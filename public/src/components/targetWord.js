var React = require('react');

var TargetWord = React.createClass({
  render: function(){
    return (
      <div>
        <h2 className="target-word">
          {this.props.targetWord}
        </h2>
      </div>
    );
  }
});

module.exports = TargetWord;