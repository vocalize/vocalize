#!/usr/bin/env python
from __future__ import division
import cv2
import numpy as np
import sys
import os
from scipy.io.wavfile import read,write
from pylab import plot,show,subplot,specgram,savefig
import pylab


def get_threshold(filename):
  image = cv2.imread(filename)
  blurred = cv2.blur(image, (3,3))

  hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
  thresh = cv2.inRange(hsv,np.array((0, 80, 80)), np.array((20, 255, 255)))
  thresh2 = thresh.copy()
  contours,hierarchy = cv2.findContours(thresh,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)

  max_area = 0
  for cnt in contours:
    area = cv2.contourArea(cnt)
    if area > max_area:
      max_area = area
      best_cnt = cnt
  M = cv2.moments(best_cnt)
  cx,cy = int(M['m10']/M['m00']), int(M['m01']/M['m00'])
  cv2.circle(blurred,(cx,cy),5,255,-1)
  return thresh2


def usage():
  print "USAGE: compare.py <native wav path> <user wav path>"
  sys.exit(0)

if __name__ == '__main__':
  if len(sys.argv) < 2:
    usage()
  native_wav_path = sys.argv[1]
  user_wav_path = sys.argv[2]

  native_rate, native_wav = read(native_wav_path)
  pylab.figure(figsize=(10,10))
  specgram(native_wav, NFFT=1024, noverlap=0)
  pylab.axis('off')
  savefig('native.png')

  user_rate, user_wav = read(user_wav_path)
  pylab.figure(figsize=(10,10))
  specgram(user_wav, NFFT=1024, noverlap=0)
  pylab.axis('off')
  savefig('user.png')

  # THRESHOLD THEN DIFFERENCE
  # native_thresh = get_threshold('native.png')
  # user_thresh = get_threshold('user.png')


  # diff_thresh = native_thresh - user_thresh

  # DIFFERENCE THEN TRESHOLD
  native_image = cv2.imread('native.png')
  user_image = cv2.imread('user.png')
  difference = native_image - user_image
  cv2.imwrite('difference.png', difference)
  diff_thresh = get_threshold('difference.png')

  # Images for debugging purposes
  # cv2.imwrite('nativethresh.png', native_thresh)
  # cv2.imwrite('userthresh.png', user_thresh)
  # cv2.imwrite('diffthresh.png', diff_thresh)
  
  non_zeros = np.count_nonzero(diff_thresh.flatten(0))
  print non_zeros/len(diff_thresh.flatten(0))
  
  # CLEANUP
  try:
    os.remove('native.png')
    os.remove('user.png')
    os.remove('difference.png')
  except OSError:
    pass