var React = require('react');

var Spinner = React.createClass({
  render: function(){
  	return (
  		<span className="spinner">
  			<img src="/assets/ring.svg" />
  		</span>
  	);
  }
});

module.exports = Spinner;