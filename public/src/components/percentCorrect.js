var React = require('react');

var PercentCorrect = React.createClass({
  render: function(){
    return (
      <div>
        <h2>Score:</h2>
        <h2 className="score">
          {this.props.percentCorrect}%
        </h2>
      </div>
    );
  }
});

module.exports = PercentCorrect;