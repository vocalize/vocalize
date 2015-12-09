#!/usr/bin/env python

import numpy as np

from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
from sklearn.metrics import mean_squared_error

# Print entire, readable ndarrays
np.set_printoptions(precision=3)
np.set_printoptions(suppress=True)
np.set_printoptions(threshold=np.nan)


f_true, data_true = wavread('umbrella.wav')
f_user, data_user = wavread('cucumberfiltered.wav')
zero_array = np.zeros(3746, dtype=np.float)
data_true = np.concatenate([data_true, zero_array])
print mean_squared_error(data_true, data_user)

fft_true = np.abs(np.fft.fft(data_true))**2
fft_user = np.abs(np.fft.fft(data_user))**2

print mean_squared_error(fft_true, fft_user)

f_true, data_true = wavread('umbrella.wav')
f_user, data_user = wavread('umbrellaonefiltered.wav')

zero_array = np.zeros(4770, dtype=np.float)
data_true = np.concatenate([data_true, zero_array])

print mean_squared_error(data_true, data_user)