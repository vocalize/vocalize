'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var OctIcon = require('react-native-vector-icons/Octicons');

var HomeScreen = require('./HomeScreen');
var SettingsScreen = require('./SettingsScreen');
var InstructionsScreen = require('./InstructionsScreen');

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
      <HomeScreen />
    );
  },

  _renderSettingsScreen: function() {
    return (
      <SettingsScreen />
    );
  },
  
  _renderInstructionsScreen: function() {
    return (
      <InstructionsScreen />
    );
  },

  getInitialState: function() {
    return {
      selectedTab: 'home'
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
        <Icon.TabBarItem
          title="Instructions"
          iconName="help-outline"
          selected={this.state.selectedTab === 'instructions'}
          onPress={() => {
            this.setState({
              selectedTab: 'instructions'
            });
          }}
        >
          {this._renderInstructionsScreen()}
        </Icon.TabBarItem>
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