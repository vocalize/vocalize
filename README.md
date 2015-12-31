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

![http://i.imgur.com/eByRmTel.png](http://i.imgur.com/eByRmTel.png)

![http://i.imgur.com/kzfC8iwl.png](http://i.imgur.com/kzfC8iwl.png)

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