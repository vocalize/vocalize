#!/usr/bin/env python

from scipy.io.wavfile import read,write
from pylab import plot,show,subplot,specgram



rate,data = read('umbrellaonefiltered.wav')
subplot(411)
# plot(range(len(data)),data)
# subplot(412)
# NFFT is the number of data points used in each block for the FFT
# and noverlap is the number of points of overlap between blocks
# specgram(data, NFFT=128, noverlap=0) # small window
# subplot(413)
# specgram(data, NFFT=512, noverlap=0) 
# subplot(414)
specgram(data, NFFT=1024, noverlap=0) # big window

rate,data = read('umbrellatwofiltered.wav')
subplot(412)
specgram(data, NFFT=1024, noverlap=0)

rate,data = read('umbrellathreefiltered.wav')
subplot(413)
specgram(data, NFFT=1024, noverlap=0)


rate,data = read('omg.wav')
subplot(410)
specgram(data, NFFT=1024, noverlap=0)

# rate,data = read('umbrellafourfiltered.wav')
# subplot(414)
# specgram(data, NFFT=1024, noverlap=0)
show()