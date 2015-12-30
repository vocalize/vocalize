var React = require('react');
var NavBar = require('../bootstrap-components/navBar');

var Footer = React.createClass({

	render: function(){
		return(
			<footer>
				<NavBar>
          <a href="#">About</a>
        </NavBar>
			</footer>
		)
	}
});

module.exports = Footer;