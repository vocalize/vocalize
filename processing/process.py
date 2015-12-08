#!/usr/bin/env python
import sys
import argparse
import numpy as np
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
from scipy.signal.filter_design import butter, buttord
from scipy.signal import lfilter, lfiltic

def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq

    b, a = butter(order, [low, high], btype='band')
    y = lfilter(b, a, data)
    return y

def usage():
    print "USAGE: process.py <output file path> <input file paths>"
    sys.exit(0)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        usage()
    output_filepath = sys.argv[1]
    input_filepaths = sys.argv[2:]

    fs = 44100.0

    lowcut = 100.0 # Low pass cutoff
    highcut = 3000.0 # High pass cutoff

    processed_wav_data = []

    for path in input_filepaths:
        rate, sound_samples = wavread(path)
        # If there is more than one channel, take the first one
        if 'ndarray' in str(type(sound_samples[0])):
            sound_samples = [item[0] for item in sound_samples]

        filtered = butter_bandpass_filter(sound_samples, lowcut, highcut, fs, 5)
        processed_wav_data.append(filtered)


    fft_data = []

    for data in processed_wav_data:
        fft_data.append(np.fft.rfft(data))

    # Adding a * before an array of arrays makes it zip array-wise
    # .. or something. Nobody really knows how or why this works
    zipped_data = zip(*fft_data)

    mean_data = map(np.mean, zipped_data)

    # Reverse real fft
    f = np.fft.irfft(mean_data)

    wavwrite(output_filepath, fs, f)