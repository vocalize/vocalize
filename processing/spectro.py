#!/usr/bin/env python

import sys
from scipy.io.wavfile import read,write
from pylab import plot,show,subplot,specgram,savefig
import pylab

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

pylab.figure(figsize=(10,10))
specgram(data, NFFT=1024, noverlap=0)
pylab.axis('off')
# show()
savefig(output_filepath)
# rate,data = read('umbrellafourfiltered.wav')
# subplot(414)
# specgram(data, NFFT=1024, noverlap=0)

# savefig(output_filepath)