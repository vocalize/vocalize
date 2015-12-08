#!/usr/bin/env python

import sys
from scipy.io.wavfile import read,write
from pylab import plot,show,subplot,specgram,savefig


def usage():
    print "USAGE: spectro.py <input wav path> <output image path>"
    sys.exit(0)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        usage()
    output_filepath = sys.argv[2]
    input_filepaths = sys.argv[1]

rate,data = read(input_filepaths)
# subplot(411)
specgram(data, NFFT=1024, noverlap=0)

# rate,data = read('umbrellafourfiltered.wav')
# subplot(414)
# specgram(data, NFFT=1024, noverlap=0)
savefig(output_filepath)