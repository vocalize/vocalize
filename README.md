# vocalize

[![Stories in Ready](https://badge.waffle.io/vocalize/vocalize.svg?label=ready&title=Ready)](http://waffle.io/vocalize/vocalize)

## Table of Contents

1. [About](#about)
1. [Team](#team)
1. [Dependencies](#dependencies)
    1. [Data Scraping](#data-scraping)
    1. [Processing](#processing)
1. [Running](#running)

## About

Vocalize is a pronunciation trainer made for language learners.

![Vocalize Web App](http://imgur.com/KKXHEMP.png)
![Vocalize Web Results](http://imgur.com/hkxT7I9.png)
![Vocalize Web Results](http://imgur.com/Nssm3Lw.png)
![Tech Stack](http://i.imgur.com/uwZ0o6u.png)

Vocalize is an application that provides pronunciation training for language learners.  The user selects the language that they would like to practice, either English and Spanish, and is then presented with practice words.  The user is able to record their pronunciation and submit it for comparison against the average pronunciation of the word.  A visual representation of the user's pronunciation is graphed against the average pronunciation.  

The average pronunciation of each word is created by feeding YouTube videos into a custom audio processing algorithm.  We first scrape audio books from YouTube and submit them to IBM Watson's Text-to-Speech API.  We then use FFmpeg to create an audio file for each word in the audiobook.  When a word appears multiple times, we average the word instances together using a custom Python module that is built on top of SciPi.  We narrow the scope of our data by only processing the 1000 most popular words of each language.  Once an average pronunciation has been create for a word, it is stored using Amazon S3.


__Front End__: React.js, React Native, Redux, D3.js  
__Back End__: Node.js, Express, MongoDB, Amazon S3  
__Audio Processing__: Python, SciPy, IBM Watson, FFmpeg  
__Testing__: Chai, Mocha, pytest  
__Build Tools__: Gulp, Browersify, Webpack    
__Deployment__: Digital Ocean  

## Team

  - __Product Owner__: Eugene Krayni
  - __Scrum Master__: Andrew Pedley
  - __Development Team Members__: Luke Powell, Aaron Phillips, Alex Zywiak

## Dependencies

### Data Scraping

* youtube-dl `brew install youtube-dl`

### Processing

* Processing requires [this python module](https://pypi.python.org/pypi/speech-processing). [Github](https://github.com/vocalize/speechprocessing)


## Running

```
npm install
gulp build
node server.js
```

### Data Scraping

In the data scraping directory you will find node js files that scrape youtube videos (audio books) for wav files of words.

```
npm install
node index.js scrape <youtube id> <language>
```

There is also a file that runs the python scripts to average the words and outputs them into a 'averaged' folder called average.sh