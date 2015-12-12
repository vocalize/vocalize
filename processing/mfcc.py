#!/usr/bin/env python


from features import mfcc
from features import logfbank
import scipy.io.wavfile as wav
from sklearn.metrics import mean_squared_error

(rate,sig) = wav.read("./testfiles/energy.wav")
mfcc_feat = mfcc(sig,rate)
fbank_feat = logfbank(sig,rate)

(rate2,sig2) = wav.read("./testfiles/64energyfiltered.wav")
mfcc_feat2 = mfcc(sig2,rate2)
fbank_feat2 = logfbank(sig2,rate2)

print mean_squared_error(mfcc_feat, mfcc_feat2[:46])
