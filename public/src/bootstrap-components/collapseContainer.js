var React = require('react');

var CollapseContainer = React.createClass({
	render: function(){

		var children = React.Children.map(this.props.children, function(child, i){
      return <span key={i}>{child}</span>
    });

		return (
			<div className="collapse" id={this.props.collapseId}>
				  <div className="well">
				    {children}
				  </div>
			</div>
		);
	}
});

module.exports = CollapseContainer;