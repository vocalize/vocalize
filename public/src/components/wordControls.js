var React = require('react');

var PlayWordBtn = require('./playWordBtn');
var Button = require('../bootstrap-components/button');

var WordService = require('../actions/wordService');


var WordControls = React.createClass({
	
	render: function(){
		return (
			<div className="center-content">
				<hr className="separator" />
				<Button text={<span className="icon ion-chevron-left"></span>} style="word-btn" onClick={this.props.previousWord} />
				<PlayWordBtn s3Key={this.props.s3Key} />
				<Button text={<span className="icon ion-chevron-right"></span>} style="word-btn" onClick={this.props.nextWord} />
			</div>
		);
	}
});

module.exports = WordControls;