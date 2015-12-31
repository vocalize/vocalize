'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var Icon = require('react-native-vector-icons/MaterialIcons');
var {AudioRecorder, AudioPlayer} = require('react-native-audio');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var PlayWordBtn = React.createClass({
  playWord: function() {
    var url = 'http://d38tzlq9umqxd2.cloudfront.net/' + this.props.s3key;
    AudioPlayer.playWithUrl(url);
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
          <Text style={styles.currentWordText}>{this.props.currentWord}</Text>
        <PlayWordBtn s3key={this.props.s3key} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
currentWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dummyContainer: {
    width: 40,
  },
  currentWordText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '200',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'rgba(0, 0, 0, 0.5)',
  },
  playWordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
  },
});

module.exports = CurrentWord;