#!/bin/bash


## Example: ./compareuser.sh testfiles/energyracist.wav ../dataScraping/averaged/against.wav
if [ "$#" -ne 2 ]; then
    echo "Usage: compareuser.sh <user input wav> <control input wav>"
    exit 1
fi

input_file=$1
control_file=$2
# echo "User File: $input_file"
# echo "Control File: $control_file"


if [ ! -f "$control_file" ]; then
  echo "File: $control_file does not exist"
  exit 1
fi

if [ ! -f "$input_file" ]; then
  echo "File: $input_file does not exist"
  exit 1
fi

# Chop
chop_command="chop.py $input_file chopped.wav"
python $chop_command

# Trim
trim_command="trim.py chopped.wav trimmed.wav"
python $trim_command

# Match Length
match_length_command="matchlength.py $control_file trimmed.wav matched.wav"
python $match_length_command

# Filter
filter_command="filterwav.py matched.wav filtered.wav"
python $filter_command

# Compare
compare_command="compare.py $control_file filtered.wav"
python $compare_command

rm filtered.wav
rm matched.wav
rm trimmed.wav
