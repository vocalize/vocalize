'use strict';

var React = require('react-native');
var CookieManager = require('react-native-cookies');

var CurrentWord = require('../components/CurrentWord');
var OptionBtns = require('../components/OptionBtns');
var ComparisonResults = require('../components/ComparisonResults');
var SettingsScreen = require('./SettingsScreen');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  ActivityIndicatorIOS,
} = React;

var HomeScreen = React.createClass({

  loadPrevWord: function() {
    var url = this.generatePrevWordUrl();


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

  loadNextWord: function() {
    var url = this.generateNextWordUrl();


    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentWord: data.word, 
          s3key: data.s3.Key
        });
        this.updateCurrentWordCookie();
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  generateNextWordUrl: function() {
    var language = 'language=' + this.state.language.toLowerCase();
    var gender = 'gender=' + this.state.gender.toLowerCase();
    var ip = 'https://vocalizeapp.com';
    var url = ip + '/api/words/index/?' + language + '&' + gender;
    return url;
  },
  
  generatePrevWordUrl: function() {
    var language = 'language=' + this.state.language.toLowerCase();
    var gender = 'gender=' + this.state.gender.toLowerCase();
    var ip = 'https://vocalizeapp.com';
    var url = ip + '/api/words/previndex/?' + language + '&' + gender;
    return url;
  },

  updateCurrentWordCookie: function() {
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

  updateWordIndexCookie: function(wordIndex) {
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

  toggleLoading: function() {
    this.setState({
      loading: !this.state.loading,
      instructionsDisplayed: false
    });
  },
  
  renderResultsDisplay: function() {
    if (this.state.loading) {
      return (
        <ActivityIndicatorIOS
          animating={true}
          size="large"
          style={[{height: 60}]}
          color='#007AFF'/>
      )
    } else if (this.state.instructionsDisplayed) {
      return (
        <View style={styles.instructionsTextContainer}>
        <Text style={styles.instructionsText}>
          Hold down the microphone button and pronounce the word shown above.
        </Text>
        <Text style={styles.instructionsText}>
          The lower the score, the better!
        </Text>
        </View>
      )
    } else if (this.state.comparisonResults > 0) {
      return (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Score: </Text>
          <Text style={styles.resultsText}>{this.state.comparisonResults}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Score: </Text>
          <Text style={styles.resultsTextHidden}>00</Text>
        </View>
      )
    }
  },

  onComparisonResults: function(score) {
    this.setState({
      comparisonResults: score
    });
  },

  resetComparisonResults: function() {
    this.setState({
      comparisonResults: 0
    });
  },

  getInitialState: function() {
    return {
      gender: this.props.gender,
      language: this.props.language,
      currentWord: ' ',
      s3key: '',
      instructionsDisplayed: true,
      comparisonResults: -1,
      loading: false
    };
  },

  componentDidMount: function() {
    if (!this.state.wordIndex) {
      this.setState({wordIndex: 0}, () => {
        var wordIndex = this.state.wordIndex.toString();
        this.updateWordIndexCookie(wordIndex);
      });
    }
    this.loadNextWord();
  },

  render: function() {
    return (
      <View style={styles.pronunciationTest}>
        <CurrentWord 
          currentWord={this.state.currentWord} 
          s3key={this.state.s3key}
        />
        <ComparisonResults 
          renderResultsDisplay={this.renderResultsDisplay}
          comparisonResults={this.state.comparisonResults}
        />
        <OptionBtns 
          loadNextWord={this.loadNextWord}
          loadPrevWord={this.loadPrevWord}
          onComparisonResults={this.onComparisonResults}
          toggleLoading={this.toggleLoading}
          resetComparisonResults={this.resetComparisonResults}
        />
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
          passProps: {
            gender: this.props.gender,
            language: this.props.language,
          }
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
  instructionsTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsText: {
    textAlign: 'center',
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '300',
    color: '#898C90',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreTitle: {
    fontFamily: 'Helvetica Neue',
    lineHeight: 50,
    fontSize: 30,
    fontWeight: '300',
    color: '#4A4A4A',
  },
  resultsText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '800',
    color: '#FF5B37',
  },
  resultsTextHidden: {
    fontFamily: 'Helvetica Neue',
    fontSize: 50,
    fontWeight: '800',
    color: 'white',
  },
});

module.exports = HomeScreenNavigator;