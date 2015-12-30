'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Text,
} = React;

var InstructionsScreen = React.createClass({

  render: function() {
  	return (
  		<View style={styles.instructionsContainer}>
        <Text>Instructions</Text>
  		</View>
  	);
  }
});

var InstructionsScreenNavigator = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.navContainer}
        initialRoute={{
          component: InstructionsScreen,
          title: 'Instructions',
        }}
        barTintColor={'#007AFF'}
        tintColor={'white'}
        titleTextColor={'black'}
      />
    );
  }
});

var styles = StyleSheet.create({
  navContainer: {
    flex: 1,
  },
  instructionsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 65,
    marginBottom: 50,
  },
});

module.exports = InstructionsScreenNavigator;