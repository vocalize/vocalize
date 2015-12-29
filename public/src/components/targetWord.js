var React = require('react');

var TargetWord = React.createClass({
  render: function(){
    return (
      <div>
        <h1 className="target-word center-content">
          {this.props.targetWord}
        </h1>
        <hr className="separator" />
      </div>
    );
  }
});

module.exports = TargetWord;