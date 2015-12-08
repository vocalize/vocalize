#!/usr/bin/env python

import numpy as np
import sys
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite

a = np.loadtxt('umbrellaone.txt', dtype=np.complex128)
b = np.loadtxt('umbrellatwo.txt', dtype=np.complex128)
c = np.loadtxt('umbrellathree.txt', dtype=np.complex128)
print type(a)
total = zip(a,b,c)
# print total
print type(total)
# average = map(np.mean, total)
# f = np.fft.irfft(average)

# wavwrite('omg.wav', 44100, f)