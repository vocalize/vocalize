var React = require('react');

var CollapseButton = React.createClass({
	render: function(){

		var children = React.Children.map(this.props.children, function(child, i){
      return <span key={i}>{child}</span>
    });

		return (
				<a href="#" data-toggle="collapse" data-target={'#' + this.props.collapseTargetId} aria-expanded="false" aria-controls="collapseExample">
					{children}
				</a>
		)
	}
});

module.exports = CollapseButton;