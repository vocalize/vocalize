#!/usr/bin/env python
import sys
import argparse
import numpy as np
import subprocess as sp
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
from scipy.signal.filter_design import butter, buttord
from scipy.signal import lfilter, lfiltic

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
        '-loglevel', 'quiet',
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

def usage():
    print "USAGE: average.py <output file path> <input file paths>"
    sys.exit(0)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        usage()
    output_filepath = sys.argv[1]
    input_filepaths = sys.argv[2:]

    fs = 44100.0

    lowcut = 100.0 # Low pass cutoff
    highcut = 3000.0 # High pass cutoff

    processed_wav_data = []

    for path in input_filepaths:
        data, rate = ffmpeg_load_audio(path, 44100, True, dtype=np.float32)
        filtered_data = butter_bandpass_filter(data, 100.0, 3000.0, 44100)
        processed_wav_data.append(filtered_data)

    fft_data = []

    for data in processed_wav_data:
        fft_data.append(np.fft.rfft(data))

    # Adding a * before an array of arrays makes it zip array-wise
    # .. or something. Nobody really knows how or why this works
    zipped_data = zip(*fft_data)

    mean_data = map(np.mean, zipped_data)

    # Reverse real fft
    f = np.fft.irfft(mean_data)

    wavwrite(output_filepath, fs, f)