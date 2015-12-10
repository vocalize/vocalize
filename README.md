# vocalize

[![Stories in Ready](https://badge.waffle.io/vocalize/vocalize.png?label=ready&title=Ready)](https://waffle.io/vocalize/vocalize)


## Dependencies

### Data Scraping

* youtube-dl `brew install youtube-dl`

### Processing

* numpy
* scipy
* scikits.audiolab sndfile `brew install libsndfile`
* pydub
* pylab
* opencv python bindings

## About

### Data Scraping

In the data scraping directory you will find node js files that scrape youtube videos (audio books) for wav files of words.

```
npm install
node index.js scrape <youtube id>
```

There is also a file that runs the python scripts to average the words and outputs them into a 'averaged' folder called average.sh

### Processing

In the processing directory you will find a few python files for processing user input as well as scraped data.

#### Main Files

* compareuser.sh - This runs it all in order and compares against the file in ../dataScraping/averaged/<word>.wav
  * Usage: `compareuser.sh <inputfile> <word>`

* trim.py - Trims a wav file of silence
  * Usage: `trim.py <inputfilepath> <outputfilepath>`

* matchlength.py - Changes the length of a file to match another
  * Usage: `matchlength.py <match_file_path> <input_file_path> <output_path>`

* filterwav.py - Takes in a wav file and runs a butterworth band pass filter to get rid of any sound that is far outside of human speech frequencies.
  * Usage: `filterwav.py <input wav path> <output wav path>`

* average.py -  Takes in any number of wav files, performs a FFT on them, averages them together, and performs an IFFT on the result. Outputs the result to a wav file.
  * Usage: `average.py <output file path> <input file paths>`

* compare.py - compares two wav files that have been filtered and returns an double. The first wav file is the control and the second is the user. The lower the number, the closer the user is to the control.
  * Usage: `compare.py <native wav path> <user wav path>`

#### Other Files

* spectro.py - takes in a wav file and saves a spectrogram to an image file
  * Usage: `spectro.py <input wav path> <output image path>`

* powerspectrumpy - displays the power spectrum of a wav file. Currently no input/output configured

* mse.py - computes the mean square error of a few wav files. Currently no input/output configured

* fftcompare.py - compares two wav files by calculating the fft and zero padding them. To be used for xcorr. Currently no input/output configured

* genfft.py - computes the FFT of a wave and prints a graph of it to an image
  * Usage: `genfft.py <sound file path> [display sample rate] [outfile]`
