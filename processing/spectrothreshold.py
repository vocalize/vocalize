#!/usr/bin/env python
from __future__ import division
import cv2
import numpy as np

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

# t = get_threshold('umbrellaonefiltered.png')
# cv2.imwrite('umbrellaonefiltered.png', t)
# t2 = get_threshold('umbrella.png')
# cv2.imwrite('umbrellathresh.png', t2)

# difference = t2 - t
# cv2.imwrite('difference.png', difference)

# cv2.imshow('thresh',t)
# cv2.imshow('thresh2',t2)
# cv2.waitKey(0)
# cv2.destroyAllWindows()


# avg = cv2.imread('umbrella.png')
# one = cv2.imread('westernUmbrellaFiltered.png')
# diff = avg - one

# cv2.imwrite('diffwestern.png', diff)

# thresh = get_threshold('umbrella.png')
# cv2.imwrite('sameword.png', thresh)

avg2 = cv2.imread('umbrella.png')
one2 = cv2.imread('assfiltered.png')
diff2 = avg2 - one2
cv2.imwrite('diffspectro.png', diff2)
thresh2 = get_threshold('diffspectro.png')

non_zeros = np.count_nonzero(thresh2.flatten(0))
# print non_zeros
# print non_zeros
# print len(diff2.flatten())
print non_zeros/len(thresh2.flatten(0))*100
# cv2.imwrite('diffspectro.png', diff2)

# thresh2 = get_threshold('diffspectro.png')
# cv2.imwrite('diffwestern.png', thresh2)
