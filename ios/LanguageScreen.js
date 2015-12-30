'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

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

var GenderScreen = React.createClass({
  onSelectEnglish: function() {
    this.props.onSelectGender('English');
    this.props.navigator.pop();
  },

  onSelectSpanish: function() {
    this.props.onSelectGender('Spanish');
    this.props.navigator.pop();
  },

  renderRowIconEnglish: function() {
    if (this.state.showRowIconEnglish) {
      return (
        <Icon 
          style={styles.rowIcon} 
          name="done" 
          size={20} 
          color="#007AFF" />
      );
    }
  },

  renderRowIconSpanish: function() {
    if (this.state.showRowIconSpanish) {
      return (
        <Icon 
          style={styles.rowIcon} 
          name="done" 
          size={20} 
          color="#007AFF" />
      );
    }
  },
  
  getInitialState: function() {
    if (this.props.gender === 'English') {
      return {
        showRowIconEnglish: true,
        showRowIconSpanish: false
      }
    } else {
      return {
        showRowIconEnglish: false,
        showRowIconSpanish: true
      }
    }
  },

  render: function() {
    return (
      <View style={styles.genderContainer}>
        <View style={styles.heading}>
        </View>
        <TouchableHighlight
          onPress={this.onSelectEnglish}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>English</Text>
            {this.renderRowIconEnglish()}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.onSelectSpanish}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Spanish</Text>
            {this.renderRowIconSpanish()}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});


var styles = StyleSheet.create({
  navContainer: {
    flex: 1,
  },
  genderContainer: {
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
  rowTitle: {
    paddingLeft: 20,
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  rowIcon: {
    paddingRight: 25,
  },
});

module.exports = GenderScreen;