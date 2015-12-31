'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var Icon = require('react-native-vector-icons/MaterialIcons');
var {AudioRecorder, AudioPlayer} = require('react-native-audio');
var RNFS = require('react-native-fs');
var FileUpload = require('NativeModules').FileUpload;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
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
    this.props.toggleLoading();
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

    FileUpload.upload(params, function(err, results) {
      if (err) {
        console.log('upload error:', err);
      }
      var data = JSON.parse(results.data);
      var score = Math.round(data.score) - 50;
      this.props.toggleLoading();
      this.props.onComparisonResults(score);
    }.bind(this));
  },

  componentDidMount: function() {
    AudioRecorder.prepareRecordingAtPath('/userAudio.wav')
    AudioRecorder.onFinished = (data) => {
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
          <Icon name="mic" size={110} color="#007AFF" />
        </Button>
      </View>
    );
  }
});

var NextWordBtn = React.createClass({
  _handleButtonPress: function() {
    this.props.resetComparisonResults();
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
    this.props.resetComparisonResults();
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
        <PrevWordBtn 
          loadPrevWord={this.props.loadPrevWord} 
          resetComparisonResults={this.props.resetComparisonResults}
        />
        <RecordAudioBtn 
          onComparisonResults={this.props.onComparisonResults}
          toggleLoading={this.props.toggleLoading}
        />
        <NextWordBtn 
          loadNextWord={this.props.loadNextWord} 
          resetComparisonResults={this.props.resetComparisonResults}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
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
    fontSize: 18, 
    color: '#007AFF',
  },
  prevWordBtn: {
    fontSize: 18, 
    color: '#007AFF',
  },
});

module.exports = OptionBtns;