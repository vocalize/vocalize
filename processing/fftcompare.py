#!/usr/bin/python
import sys
import argparse
import math
import numpy as np
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite

# Print entire, readable ndarrays
np.set_printoptions(precision=3)
np.set_printoptions(suppress=True)
np.set_printoptions(threshold=np.nan)

rate_one, data_one = wavread('umbrellaonefiltered.wav')
rate_two, data_two = wavread('umbrellatwofiltered.wav')

zero_count = int(math.floor(len(data_one) / 2))
zero_count_two = int(math.floor(len(data_two) / 2))
if zero_count_two > zero_count:
  zero_count = zero_count_two

# Zero pad file one
zero_array = np.zeros(zero_count, dtype=np.float)
data_one = np.concatenate([data_one, zero_array])
length_one = int(math.floor(len(data_one)))
# FFT file one
fft_one = np.fft.rfft(data_one)

# Zero pad file two

length_two = int(math.floor(len(data_two)))
zero_count_two = length_one - length_two
zero_array = np.zeros(zero_count_two, dtype=np.float)
data_two = np.concatenate([data_two, zero_array])
# FFT file two
fft_two = np.fft.rfft(data_two)

# Multiply the results elementwise
product = fft_one * fft_two

inverse_fft = np.fft.irfft(product)

print inverse_fft