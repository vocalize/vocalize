'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var GenderScreen = require('./GenderScreen');
var LanguageScreen = require('./LanguageScreen');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Text,
  TouchableHighlight,
  Dimensions,
} = React;

var screenWidth = Dimensions.get('window').width;

var SettingsScreen = React.createClass({
  onSelectGender: function(gender) {
    this.props.onGenderChange(gender);
    this.setState({gender: gender});
  },

  onSelectLanguage: function(language) {
    this.props.onLanguageChange(language);
    this.setState({language: language});
  },

  selectGender: function() {
    this.props.navigator.push({
      title: 'Gender',
      component: GenderScreen,
      passProps: {
        gender: this.state.gender,
        onSelectGender: this.onSelectGender,
      }
    });
  },

  selectLanguage: function() {
    this.props.navigator.push({
      title: 'Language',
      component: LanguageScreen,
      passProps: {
        gender: this.state.language,
        onSelectGender: this.onSelectLanguage,
      }
    });
  },

  getInitialState: function() {
    return {
      gender: this.props.gender,
      language: this.props.language,
    };
  },

  componentDidMount: function() {
  },

  render: function() {

  	return (
      <View style={styles.settingsContainer}>
        <View style={styles.heading}>
        </View>
        <TouchableHighlight
          onPress={this.selectGender}>
          <View style={styles.row}>
            <View style={styles.rowLeftSide}>
              <Text style={styles.rowTitle}>Gender</Text>
            </View>
            <View style={styles.rowRightSide}>
              <Text style={styles.rowSelction}>{this.state.gender}</Text>
              <Icon 
                style={styles.rowIcon} 
                name="keyboard-arrow-right" 
                size={30} 
                color="#898C90" 
              />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.selectLanguage}>
          <View style={styles.row}>
            <View style={styles.rowLeftSide}>
              <Text style={styles.rowTitle}>Language</Text>
            </View>
            <View style={styles.rowRightSide}>
              <Text style={styles.rowSelction}>{this.state.language}</Text>
              <Icon 
                style={styles.rowIcon} 
                name="keyboard-arrow-right" 
                size={30} 
                color="#898C90" 
              />
            </View>
          </View>
        </TouchableHighlight>

  		</View>
  	);
  }
});

var SettingsScreenNavigator = React.createClass({
    render: function() {
    return (
      <NavigatorIOS
        style={styles.navContainer}
        initialRoute={{
          component: SettingsScreen,
          title: 'Settings',
          passProps: {
            gender: this.props.gender,
            language: this.props.language,
            onGenderChange: this.props.onGenderChange,
            onLanguageChange: this.props.onLanguageChange 
          }
        }}
        barTintColor={'#4CD964'}
        tintColor={'black'}
        titleTextColor={'black'}
      />
    );
  }
});

var styles = StyleSheet.create({
  navContainer: {
    flex: 1,
  },
  settingsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 50,
  },
  heading: {
    height: 35,
    width: screenWidth,
    backgroundColor: '#DBDDDE',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth,
    height: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  rowLeftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowRightSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowTitle: {
    paddingLeft: 20,
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  rowSelction: {
    paddingRight: 10,
    fontFamily: 'Helvetica Neue',
    fontSize: 15,
    fontWeight: '400',
    color: '#898C90'
  },
  rowIcon: {
    paddingRight: 10,
  },
});

module.exports = SettingsScreenNavigator;