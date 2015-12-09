#!/usr/bin/python
import sys
import argparse
# from scipy.io.wavfile import read, write as wavread, wavwrite
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
from scipy.signal.filter_design import butter, buttord
from scipy.signal import lfilter, lfiltic
import numpy as np
import subprocess as sp

def ffmpeg_load_audio(filename, sr=44100, mono=True, dtype=np.float32):
    channels = 1 if mono else 2
    format_strings = {
        np.float64: 'f64le',
        np.float32: 'f32le',
        np.int32: 's32le',
        np.uint32: 'u32le'
    }
    format_string = format_strings[dtype]
    command = [
        'ffmpeg',
        '-i', filename,
        '-f', format_string,
        '-acodec', 'pcm_' + format_string,
        '-ar', str(sr),
        '-ac', str(channels),
        '-']
    p = sp.Popen(command, stdout=sp.PIPE, bufsize=10**8)
    bytes_per_sample = np.dtype(dtype).itemsize
    chunk_size = bytes_per_sample * channels * sr # read in 1-second chunks
    raw = b''
    with p.stdout as stdout:
        while True:
            data = stdout.read(chunk_size)
            if data:
                raw += data
            else:
                break
    audio = np.fromstring(raw, dtype=dtype)
    if channels > 1:
        audio = audio.reshape((-1, channels)).transpose()
    return(audio, sr)

def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    y = lfilter(b, a, data)
    return y

def main(**kwargs):
  outfile = kwargs['outfile'][0]
  infile = kwargs['infile']
  print "Filtering %s to %s" % (infile, outfile)

  data, rate = ffmpeg_load_audio(infile, 44100, True, dtype=np.float32)
  wavwrite('test.wav', 44100, data)
  filtered_data = butter_bandpass_filter(data, 100.0, 3000.0, 44100)
  wavwrite(outfile, 44100, filtered_data)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Process and filter wav file', version='%(prog)s 1.0')
  parser.add_argument('infile', type=str, help='Input wav')
  parser.add_argument('outfile', nargs='+', type=str, help='Output')
  args = parser.parse_args()
  main(**vars(args))
