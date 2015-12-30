'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Button = require('react-native-button');
var {AudioRecorder, AudioPlayer} = require('react-native-audio');
var RNFS = require('react-native-fs');
var FileUpload = require('NativeModules').FileUpload;
var CookieManager = require('react-native-cookies');

var SettingsScreen = require('./SettingsScreen');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} = React;


var RecordAudioBtn = React.createClass({

  _stopRecording: function() {
    AudioRecorder.stopRecording();
  },

  _startRecording: function() {
    AudioRecorder.startRecording();
  },

  _getUserAudioPath: function () {
    // access the app's Document directory and find the userAudio.wav file
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then( (results) => {
        var userAudioPath;
        for (var i = 0; i < results.length; i++) {
          if (results[i].name === 'userAudio.wav') {
            userAudioPath = results[i].path;
            break;
          }
        }

        this._postUserAudio(userAudioPath);
      })
      .catch( (err) => {
        console.log(err.message, err.code);
      });
  },

  _postUserAudio: function(userAudioPath) {
    var params = {
        uploadUrl: 'https://vocalizeapp.com/api/audio',
        method: 'POST',
        fields: {
            'required': 'required',
        },
        files: [
          {
            filename: 'userAudio.wav', 
            filepath: userAudioPath, 
            filetype: 'audio/wav',
          },
        ]
    };

    FileUpload.upload(params, function(err, result) {
      console.log('upload:', err, result);
    });
  },

  componentDidMount: function() {
    AudioRecorder.prepareRecordingAtPath('/userAudio.wav')
    AudioRecorder.onFinished = (data) => {
      AudioRecorder.playRecording();
      this._getUserAudioPath();
    };
  },

  render: function() {
    return (
      <View style={styles.recordAudioContainer}>
        <Button
          style={styles.recordAudioBtn}
          styleDisabled={{color: '#FF3B30'}}
          onPressIn={this._startRecording}
          onPressOut={this._stopRecording}
        >
          <Icon name="mic" size={125} color="#007AFF" />
        </Button>
      </View>
    );
  }
});

var NextWordBtn = React.createClass({
  _handleButtonPress: function() {
    this.props.loadNextWord();
  },

  render: function() {
    return (
      <View style={styles.nextWordContainer}>
        <Button
          style={styles.nextWordBtn}
          styleDisabled={{color: 'red'}}
          onPress={this._handleButtonPress}
          >
          Next
        </Button>
      </View>
    );
  }
});

var PrevWordBtn = React.createClass({
  _handleButtonPress: function() {
    this.props.loadPrevWord();
  },

  render: function() {
    return (
      <View style={styles.prevWordContainer}>
        <Button
          style={styles.prevWordBtn}
          styleDisabled={{color: 'red'}}
          onPress={this._handleButtonPress}
          >
          Previous
        </Button>
      </View>
    );
  }
});

var OptionBtns = React.createClass({

  render: function() {
    return (
      <View style={styles.optionBtnsContainer}>
        <PrevWordBtn loadPrevWord={this.props.loadPrevWord} />
        <RecordAudioBtn />
        <NextWordBtn loadNextWord={this.props.loadNextWord} />
      </View>
    );
  }
});

var ComparisonResults = React.createClass({
  render: function() {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>87</Text>
      </View>
    );
  }
});

var PlayWordBtn = React.createClass({
  playWord: function() {
    var url = 'http://d2oh9tgz5bro4i.cloudfront.net/public/' + this.props.s3key;
    AudioPlayer.playWithUrl('http://d2oh9tgz5bro4i.cloudfront.net/apple.wav');
  },

  render: function() {
    return (
      <View style={styles.playWordContainer}>
        <Button
          style={styles.PlayWordBtn}
          styleDisabled={{color: 'red'}}
          onPress={this.playWord}
        >
          <Icon name="play-circle-outline" size={30} color="#007AFF" />
        </Button>
      </View>
    );
  }
});

var CurrentWord = React.createClass({
  render: function() {
    return (
      <View style={styles.currentWordContainer}>
        <View style={styles.dummyContainer}></View>
        <View style={styles.currentWordTextContainer}>
          <Text style={styles.currentWordText}>{this.props.currentWord}</Text>
        </View>
        <PlayWordBtn s3key={this.props.s3key} />
      </View>
    );
  }
});

var PronunciationTest = React.createClass({

  _loadPrevWord: function() {
    var url = this._generatePrevWordUrl();
    // curl -X GET http:/https://vocalizeapp.com/api/words/index/?language=english&gender=male

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentWord: data.word, 
          s3key: data.s3.Key
        });
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  _loadNextWord: function() {
    var url = this._generateNextWordUrl();
    // curl -X GET https://vocalizeapp.com/api/words/previndex/?language=english&gender=male

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentWord: data.word, 
          s3key: data.s3.Key
        });
        this._updateCurrentWordCookie();
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  _generateNextWordUrl: function() {
    var language = 'language=' + this.state.language;
    var gender = 'gender=' + this.state.gender;
    var ip = 'https://vocalizeapp.com';
    var url = ip + '/api/words/index/?' + language + '&' + gender;
    return url;
  },
  
  _generatePrevWordUrl: function() {
    var language = 'language=' + this.state.language;
    var gender = 'gender=' + this.state.gender;
    var ip = 'https://vocalizeapp.com/';
    var url = ip + '/api/words/previndex/?' + language + '&' + gender;
    return url;
  },

  _updateCurrentWordCookie: function() {
    // set cookie that expires in 30 days
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    if (month === 11) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }
    var day = date.getDate();
    var time = 'T12:30:00.00-05:00'
    var expiration = '' + year + '-' + month + '-' + day + time;
    var currentWord = this.state.currentWord;

    var currentWordCookie = {
      name: 'word',
      value: currentWord,
      domain: '127.0.0.1',
      origin: '/',
      path: '/',
      version: '1',
      expiration: expiration,
    };
    
    CookieManager.set(currentWordCookie, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  },

  _updateWordIndexCookie: function(wordIndex) {
    // set cookie that expires in 30 days
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    if (month === 11) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }
    var day = date.getDate();
    var time = 'T12:30:00.00-05:00'
    var expiration = '' + year + '-' + month + '-' + day + time;
    var currentWord = this.props.currentWord;

    var currentWordCookie = {
      name: 'word_index',
      value: wordIndex,
      domain: '127.0.0.1',
      origin: '/',
      path: '/',
      version: '1',
      expiration: expiration,

    };
    
    CookieManager.set(currentWordCookie, function(err, res) {
      if (err) {
        console.log(err);
      }
    });
  },

  getInitialState: function() {
    return {
      language: 'english',
      gender: 'male',
      currentWord: ' ',
      s3key: '',
      comparisonResults: []
    };
  },

  componentDidMount: function() {
    if (!this.state.wordIndex) {
      this.setState({wordIndex: 0}, () => {
        var wordIndex = this.state.wordIndex.toString();
        this._updateWordIndexCookie(wordIndex);
      });
    }
    this._loadNextWord();
  },

  render: function() {
    return (
      <View style={styles.pronunciationTest}>
        <CurrentWord 
          currentWord={this.state.currentWord} 
          s3key={this.state.s3key}
        />
        <ComparisonResults />
        <OptionBtns 
          loadNextWord={this._loadNextWord}
          loadPrevWord={this._loadPrevWord}
        />
      </View>
    );
  }
});


var HomeScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.homeScreenContainer}>
        <PronunciationTest navigator={this.props.navigator}/>
      </View>
    );
  }
});

var HomeScreenNavigator = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.homeScreenContainer}
        initialRoute={{
          component: HomeScreen,
          title: 'Vocalize',
        }}
        barTintColor={'#007AFF'}
        tintColor={'white'}
        titleTextColor={'black'}
      />
    );
  }
});

var styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  pronunciationTest: {
    flex: 5,
    flexDirection: 'column',
    marginTop: 65,
    marginBottom: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  currentWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dummyContainer: {
    width: 40,
  },
  currentWordTextContainer: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  currentWordText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '200',
  },
  playWordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
  },
  resultsContainer: {

  },
  resultsText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '300',
  },
  optionBtnsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  recordAudioContainer: {
  },
  nextWordContainer: {
    width: 85,
    marginTop: 20,
  },
  prevWordContainer: {
    width: 85,
    marginTop: 20,
  },
  nextWordBtn: {
    fontSize: 20, 
    color: '#007AFF',
  },
  prevWordBtn: {
    fontSize: 20, 
    color: '#007AFF',
  },
});

module.exports = HomeScreenNavigator;