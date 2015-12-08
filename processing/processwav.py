#!/usr/bin/python
import sys
import argparse
# from scipy.io.wavfile import read, write as wavread, wavwrite
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
from scipy.signal.filter_design import butter, buttord
from scipy.signal import lfilter, lfiltic



def butter_bandpass(lowcut, highcut, fs, order=9):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return b, a


def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    y = lfilter(b, a, data)
    return y

from scipy.signal import butter, lfilter

def butter_bandpass_filter_two(data, lowcut, highcut, fs, order=5):
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
  rate, sound_samples = wavread(infile)
  sound_samples = [item[0] for item in sound_samples]

  fs = 44100.0
  lowcut = 100.0
  highcut = 3000.0

  # b,a = butter_bandpass(lowcut, highcut, fs, 5)

  # filtered = lfilter(b, a, sound_samples)

  # filtered = butter_bandpass_filter(sound_samples, lowcut, highcut, fs, 5)

  filtered = butter_bandpass_filter_two(sound_samples, lowcut, highcut, fs, 5)

  wavwrite(outfile, rate, filtered)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Process and filter wav file', version='%(prog)s 1.0')
  parser.add_argument('infile', type=str, help='Input wav')
  parser.add_argument('outfile', nargs='+', type=str, help='Output')
  args = parser.parse_args()
  main(**vars(args))