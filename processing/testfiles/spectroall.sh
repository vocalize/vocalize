#!/bin/bash


#python ../spectro.py 19energy.wav spectrograms/19energy.png

for file in *
do
  if [ ${file: -4} == ".wav" ]; then
    outfile="spectrograms/$file.png"
    command="../spectro.py $file $outfile"
    python $command
  fi
done