var React = require('react');
var NavBar = require('../bootstrap-components/navBar');

var Footer = React.createClass({

  render: function(){
    return(
      <footer>
        <NavBar>
          <a href="/info">About</a>
          <a href="/info#how">How It Works</a>
          <a href="#">App Store</a>
        </NavBar>
      </footer>
    );
  }
});

module.exports = Footer;