'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var OctIcon = require('react-native-vector-icons/Octicons');

var HomeScreen = require('./containers/HomeScreen');
var SettingsScreen = require('./containers/SettingsScreen');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
} = React;


var vocalize = React.createClass({

  
  _renderHomeScreen: function() {
    return (
      <HomeScreen 
        gender={this.state.gender}
        language={this.state.language}
      />
    );
  },

  _renderSettingsScreen: function() {
    return (
      <SettingsScreen 
        gender={this.state.gender}
        language={this.state.language}
        onGenderChange={this.onGenderChange}
        onLanguageChange={this.onLanguageChange}
      />
    );
  },

  onGenderChange: function(gender) {
    this.setState({
      gender: gender
    });
  },

  onLanguageChange: function(language) {
    this.setState({
      language: language
    });
  },


  getInitialState: function() {
    return {
      selectedTab: 'home',
      gender: 'Male',
      language: 'English',
    };
  },

  render: function() {
    return (
      <TabBarIOS
        style={styles.tabBar}
        barTintColor='#DBDDDE'
        tintColor='#007AFF'
      >
        <Icon.TabBarItem
          title="Home"
          iconName="home"
          selected={this.state.selectedTab === 'home'}
          onPress={() => {
            this.setState({
              selectedTab: 'home',
            });
          }}
        >
          {this._renderHomeScreen()}
        </Icon.TabBarItem>
        <OctIcon.TabBarItem
          title="Settings"
          iconName="gear"
          selected={this.state.selectedTab === 'gear'}
          onPress={() => {
            this.setState({
              selectedTab: 'gear',
            });
          }}
        >
          {this._renderSettingsScreen()}
        </OctIcon.TabBarItem>
      </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});

AppRegistry.registerComponent('vocalize', () => vocalize);