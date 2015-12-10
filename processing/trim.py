#!/usr/bin/python
import sys
from pydub import AudioSegment

def detect_leading_silence(sound, silence_threshold=-40.0, chunk_size=10):
    trim_ms = 0 # ms
    while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold:
        trim_ms += chunk_size

    return trim_ms
def usage():
    print "USAGE: trim.py <inputfilepath> <outputfilepath>"
    sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
      usage()
    input_path = sys.argv[1]
    output_path = sys.argv[2]

    sound = AudioSegment.from_file(input_path, format="wav")

    start_trim = detect_leading_silence(sound)
    end_trim = detect_leading_silence(sound.reverse())

    duration = len(sound)    
    trimmed_sound = sound[start_trim:duration-end_trim]
    trimmed_sound.export(output_path, format="wav")