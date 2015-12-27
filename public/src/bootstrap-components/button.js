var React = require('react');

var Button = React.createClass({

  render: function(){

  	var buttonStyle = (this.props.style || 'btn-default');

    return (
      <button type="button" className={"btn " + buttonStyle} onClick={this.props.onClick}>{this.props.text}</button>
    );
  }
});

module.exports = Button;