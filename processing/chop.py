#!/usr/bin/env python
# ffmpeg -i test.wav -ss 00:00:00.05  testcpoy.wav
import sys
from pydub import AudioSegment

def usage():
    print "USAGE: trim.py <inputfilepath> <outputfilepath>"
    sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
      usage()
    input_path = sys.argv[1]
    output_path = sys.argv[2]

    sound = AudioSegment.from_file(input_path, format="wav")

    chopped_sound = sound[30:-10]
    chopped_sound.export(output_path, format="wav")