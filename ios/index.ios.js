'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Button = require('react-native-button');
var {AudioRecorder, AudioPlayer} = require('react-native-audio');
var RNFS = require('react-native-fs');
var FileUpload = require('NativeModules').FileUpload;
var CookieManager = require('react-native-cookies');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
} = React;

var PlayWordBtn = React.createClass({
  playWord: function() {
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
          <Icon name="play-circle-outline" size={50} color="#007AFF" />
        </Button>
      </View>
    );
  }
});

var RecordAudioBtn = React.createClass({
  componentDidMount: function() {
    AudioRecorder.prepareRecordingAtPath('/userAudio.wav')
    AudioRecorder.onFinished = (data) => {
      AudioRecorder.playRecording();
      this._getUserAudioPath();
    };

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

    var wordCookie = {
      name: 'word',
      value: 'apple',
      domain: '127.0.0.1',
      origin: '/',
      path: '/',
      version: '1',
      expiration: expiration,

    };
    
    var cookieCallback = function(err, res) {
      if (err) {
        console.log(err);
      }
    };
    
    CookieManager.set(wordCookie, cookieCallback);
  },


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
        uploadUrl: 'http://127.0.0.1:3000/api/audio',
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

  render: function() {
    return (
      <View style={styles.recordAudioContainer}>
        <Button
          style={styles.recordAudioBtn}
          styleDisabled={{color: '#FF3B30'}}
          onPressIn={this._startRecording}
          onPressOut={this._stopRecording}
        >
          <Icon name="mic" size={100} color="#007AFF" />
        </Button>
      </View>
    );
  }
});

var NextWordBtn = React.createClass({

  render: function() {
    return (
      <View style={styles.nextWordContainer}>
        <Button
          style={styles.nextWordBtn}
          styleDisabled={{color: 'red'}}
          onPress={this.props.stop}
          >
          Next
        </Button>
      </View>
    );
  }
});

var CurrentWord = React.createClass({
  render: function() {
    return (
      <View style={styles.currentWordContainer}>
        <Text style={styles.currentWordText}>umbrella</Text>
      </View>
    );
  }
});

var ComparisonResults = React.createClass({
  render: function() {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>87%</Text>
      </View>
    );
  }
});

var WordOptions = React.createClass({

  render: function() {
    return (
      <View style={styles.wordOptionsContainer}>
        <PlayWordBtn />
        <RecordAudioBtn />
        <NextWordBtn />
      </View>
    );
  }
});

var PronunciationTest = React.createClass({

  render: function() {
    return (
      <View style={styles.pronunciationTest}>
        <CurrentWord />
        <ComparisonResults />
        <WordOptions />
      </View>
    );
  }
});

var TabBar = React.createClass({
  render: function() {
    return (
      <View>
        <TabBarIOS
          barTintColor='#DBDDDE'
          tintColor='#007AFF'
          style={styles.tabBar}
          translucent={true}
        >
          <Icon.TabBarItem
            title="Gender"
            iconName="wc" 
          >
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Language"
            iconName="language" 
          >
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Instructions"
            iconName="help-outline" 
          >
          </Icon.TabBarItem>
        </TabBarIOS>
      </View>
    );
  }
});

var Instructions = React.createClass({
  render: function() {
    return (
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Hold down the microphone button and pronounce the word shown below.
        </Text>
      </View>
    );
  }
});

var Title = React.createClass({
  render: function() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Vocalize</Text>
      </View>
    );
  }
});

var vocalize = React.createClass({
  render: function() {
    return (
      <View style={styles.appContainer}>
        <Title />
        <Instructions />
        <PronunciationTest />
        <TabBar />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  titleContainer: {
    alignItems: 'center',
    height: 50,
    paddingTop: 25,
    backgroundColor: '#34AADC',
  },
  titleText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 15,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  instructionsText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    color: '#898C90',
  },
  pronunciationTest: {
    flex: 1,
    alignItems: 'center',
  },
  currentWordContainer: {
    marginTop: 75,
  },
  currentWordText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '200',
  },
  resultsContainer: {
    marginTop: 50,
  },
  resultsText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '300',
  },
  wordOptionsContainer: {
    flexDirection: 'row',
    marginTop: 100,
    alignItems: 'center',
  },
  playWordContainer: {

  },
  playWordBtn: {

  },
  recordAudioContainer: {
    marginRight: 50,
    marginLeft: 50,
  },
  nextWordContainer: {
    marginTop: 20,
  },
  nextWordBtn: {
    fontSize: 20, 
    color: '#007AFF',
  },
  tabBar: {
  }
});

AppRegistry.registerComponent('vocalize', () => vocalize);

/*
ICONS

mic 
  mic
  mic-none

play sound
  play-circle-outline

gender
  wc
  person-outline
  person

instructions 
  help-outline
  info
  live help

language
  language
  public
  sms
  chat
  font-download

*/
