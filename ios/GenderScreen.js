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
  onSelectMale: function() {
    this.props.onSelectGender('Male');
    this.props.navigator.pop();
  },

  onSelectFemale: function() {
    this.props.onSelectGender('Female');
    this.props.navigator.pop();
  },

  renderRowIconMale: function() {
    if (this.state.showRowIconMale) {
      return (
        <Icon 
          style={styles.rowIcon} 
          name="done" 
          size={20} 
          color="#007AFF" />
      );
    }
  },

  renderRowIconFemale: function() {
    if (this.state.showRowIconFemale) {
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
    if (this.props.gender === 'Male') {
      return {
        showRowIconMale: true,
        showRowIconFemale: false
      }
    } else {
      return {
        showRowIconMale: false,
        showRowIconFemale: true
      }
    }
  },

  render: function() {
  	return (
  		<View style={styles.genderContainer}>
        <View style={styles.heading}>
        </View>
        <TouchableHighlight
          onPress={this.onSelectMale}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Male</Text>
            {this.renderRowIconMale()}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.onSelectFemale}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Female</Text>
            {this.renderRowIconFemale()}
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