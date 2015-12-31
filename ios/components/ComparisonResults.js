'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS,
} = React;

var ComparisonResults = React.createClass({

  render: function() {
    return (
      <View style={styles.resultsContainer}>
        {this.props.renderResultsDisplay()}
      </View>
    );
  }
});


var styles = StyleSheet.create({
  resultsContainer: {
    height: 100,
  },
});

module.exports = ComparisonResults;