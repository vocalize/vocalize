#!/usr/bin/env python

import numpy as np
import sys
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite


def usage():
  print "USAGE:", sys.argv[0], "<data file path>"
  sys.exit(1)

if __name__ == "__main__":
  infile = ""
  outfile = "ifft.wav"
  display_sample_rate = 44100

  if len(sys.argv) > 3:
    infile = sys.argv[1]
    display_sample_rate = int(sys.argv[2])
    outfile = sys.argv[3]
  elif len(sys.argv) > 2:
    infile = sys.argv[1]
    display_sample_rate = int(sys.argv[2])
  elif len(sys.argv) > 1:
    infile = sys.argv[1]
  else:
    usage()

    amp = np.loadtxt(infile, dtype=np.complex128)

  f = np.fft.irfft(amp)
  
  wavwrite(outfile, display_sample_rate, f)