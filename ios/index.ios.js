'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Button = require('react-native-button');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  TouchableHighlight,
  AlertIOS,
  Dimensions,
} = React;

var PlayWordBtn = React.createClass({
  render: function() {
    return (
      <View style={styles.playWordContainer}>
        <Button
          style={styles.PlayWordBtn}
          styleDisabled={{color: 'red'}}
          onPress={this.onPress}
        >
          <Icon name="play_circle_outline" size={50} color="#007AFF" />
        </Button>
      </View>
    );
  }
});

var RecordAudioBtn = React.createClass({

  render: function() {
    return (
      <View style={styles.recordAudioContainer}>
        <Button
          style={styles.recordAudioBtn}
          styleDisabled={{color: '#FF3B30'}}
          onPress={this.onPress}
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
          onPress={this.onPress}
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
            iconName="help_outline" 
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