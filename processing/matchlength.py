#!/usr/bin/env python
from __future__ import division
from pydub import AudioSegment
import subprocess as sp
import sys
# ffmpeg -i WesternEngergy.wav -filter:a atempo="1.27455485353" -acodec pcm_f32le WesternEngergysync.wav
FFMPEG_BIN = 'ffmpeg'

# TODO: INPUTS
input_path = 'WesternEngergy.wav'
output_path = 'WesternEngergysync.wav'
match_path = 'energy.wav'
def usage():
    print "USAGE: matchlength.py <match_file_path> <input_file_path> <output_path>"
    sys.exit(0) 
if __name__ == '__main__':
    if len(sys.argv) < 3:
        usage()
    match_path = sys.argv[1]
    input_path = sys.argv[2]
    output_path = sys.argv[3]

    input_segment = AudioSegment.from_file(input_path)
    input_length = input_segment.duration_seconds
    match_segment = AudioSegment.from_file(match_path)
    match_length = match_segment.duration_seconds
    filter_coeff = input_length / match_length
    atempo = 'atempo=' + str(filter_coeff)

    command = [ FFMPEG_BIN,
              '-i', input_path,
              '-filter:a',
              atempo,
              '-acodec', 'pcm_f32le',
              '-y', #overwrite
              output_path
              ]
    sp.call(command, shell=False)