#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: compareuser.sh <user input wav> <word>"
    exit 1
fi

input_file=$1
word=$2
echo "Word: $word"
echo "File: $input_file"

word_path="../dataScraping/averaged/$word.wav"
echo "Word Path: $word_path"

if [ ! -f "$word_path" ]; then
  echo "File: $word_path does not exist"
  exit 1
fi

# Trim
trim_command="trim.py $input_file trimmed.wav"
python $trim_command

# Match Length
match_length_command="matchlength.py $word_path trimmed.wav matched.wav"
python $match_length_command

# Filter
filter_command="filterwav.py matched.wav filtered.wav"
python $filter_command

# Compare
compare_command="compare.py $word_path filtered.wav"
python $compare_command

rm filtered.wav
rm matched.wav
rm trimmed.wav
