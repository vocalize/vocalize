#!/usr/bin/env python


import sys
import imp
processing = imp.load_source('processing', '../../speechprocessing/speechprocessing/processing.py')




def usage():
  print "USAGE: process.py <input file path> <output file path> <control file path>"
  sys.exit(0)

if __name__ == '__main__':
  
  if len(sys.argv) < 2:
    usage()
  input_wav_path = sys.argv[1]
  output_wav_path = sys.argv[2]
  control_wav_path = sys.argv[3]

  processing.chop(input_wav_path, output_wav_path)
  processing.trim(output_wav_path, output_wav_path)
  processing.match_length(output_wav_path, output_wav_path, control_wav_path)
  processing.filter(output_wav_path, output_wav_path)
  distance = processing.compare(control_wav_path, output_wav_path)
  print distance



