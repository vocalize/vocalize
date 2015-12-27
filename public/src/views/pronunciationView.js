var React = require('react');
var Title = require('../components/title');
var Instructions = require('../components/instructions');
var PronunciationTest = require('../actions/pronunciationTest');

var PronunciationView = React.createClass({
  

  render: function(){
    return (
      <div>
        <Title />
        <Instructions />
        <!-- target word -->
        <PronunciationTest />
      </div>
    );
  }
});

module.exports = PronunciationView;