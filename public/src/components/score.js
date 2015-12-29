var React = require('react');

var Score = React.createClass({

	render: function(){
		return(
			<div>
				<h2>Score</h2>
				<span>{this.props.score}</span>
			</div>
		);
	}
});

module.exports = Score;