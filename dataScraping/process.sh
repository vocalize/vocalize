#!/bin/bash
mkdir -p averaged

for file in output/*
do
  if [[ -d $file ]]; then
    standard="$file/standard/*"
    word="${file##*/}"
    # echo $word
    command="../processing/average.py averaged/$word.wav"
    for wav in $standard
    do
      command="$command $wav"
    done
    # echo $command
    python $command

    for wav in $standard
    do
      cd ../processing
      compare_command="./compareuser.sh ../dataScraping/$wav ../dataScraping/averaged/$word.wav >> ../dataScraping/averaged/$word.txt"
      echo $compare_command
      eval $compare_command
      cd -
    done
  fi
done