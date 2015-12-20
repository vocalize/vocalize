#!/usr/bin/env python

from __future__ import division
from pydub import AudioSegment
import sys

def usage():
	print "USAGE: check.py <control file path> <user file path>"
	sys.exit(0)
if __name__ == '__main__':

	if len(sys.argv) < 3:
		usage()
	control_path = sys.argv[1]
	user_path = sys.argv[2]
	control = AudioSegment.from_file(control_path)
	user = AudioSegment.from_file(user_path)
	filter_coeff = user.duration_seconds / control.duration_seconds
	sys.exit(filter_coeff)