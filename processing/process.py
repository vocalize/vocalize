#!/usr/bin/env python


import sys
import imp
import speechprocessing


def usage():
  print "USAGE: process.py <input file path> <control file path>"
  sys.exit(0)

if __name__ == '__main__':
  
  if len(sys.argv) < 2:
    usage()
  input_wav_path = sys.argv[1]
  control_wav_path = sys.argv[2]

  speechprocessing.chop(input_wav_path, input_wav_path)
  speechprocessing.trim(input_wav_path, input_wav_path)
  speechprocessing.match_length(input_wav_path, input_wav_path, control_wav_path, force=True)
  speechprocessing.filter(input_wav_path, input_wav_path)
  distance = speechprocessing.compare(control_wav_path, input_wav_path)

  print distance



