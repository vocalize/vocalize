var React = require('react');
var NavBar = require('../bootstrap-components/navBar');

var Footer = React.createClass({

  render: function(){
    return(
      <footer>
        <NavBar>
          <a href="/info" target="_blank">About</a>
          <a href="/info#how" target="_blank">How It Works</a>
          <a href="#">App Store</a>
        </NavBar>
      </footer>
    );
  }
});

module.exports = Footer;