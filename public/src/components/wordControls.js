var React = require('react');

var Button = require('../bootstrap-components/button');

var WordService = require('../actions/wordService');


var WordControls = React.createClass({
	
	render: function(){
		return (
			<div className="center-content">
				<Button text="Previous Word" style="btn-primary" onClick={this.props.previousWord} />
				<Button text="Next Word" style="btn-primary" onClick={this.props.nextWord} />
			</div>
		);
	}
});

module.exports = WordControls;