var React = require('react');

var Button = React.createClass({

  render: function(){

  	var buttonStyle = (this.props.style || 'btn-default');

    return (
      <button 
      	type="button" 
      	className={buttonStyle} 
      	onClick={this.props.onClick}
      	data-toggle={this.props.dataToggle}
      	data-target={'#' + this.props.dataTarget}>
      		{this.props.text}
      	</button>
    );
  }
});

module.exports = Button;