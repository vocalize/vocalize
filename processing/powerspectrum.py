#!/usr/bin/env python

from __future__ import division

import numpy as np
import matplotlib.pyplot as plt

from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
# Print entire, readable ndarrays
np.set_printoptions(precision=3)
np.set_printoptions(suppress=True)
np.set_printoptions(threshold=np.nan)
f, data = wavread('test.wav')

ps = np.abs(np.fft.fft(data))**2

time_step = 1 / 44100
freqs = np.fft.fftfreq(data.size, time_step)
idx = np.argsort(freqs)

print ps

plt.plot(freqs, ps)
plt.show()