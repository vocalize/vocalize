#!/bin/bash

for file in output/*
do
  if [[ -d $file ]]; then
    standard="$file/standard/*"
    word="${file##*/}"
    echo $word
    command="../processing/average.py averaged/$word.wav"
    for wav in $standard
    do
      command="$command $wav"
    done
    python $command
  fi
done