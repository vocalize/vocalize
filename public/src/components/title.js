var React = require('react');
var NavBar = require('../bootstrap-components/navBar');
var LanguageRadio = require('../components/LanguageRadio');
var CollapseButton = require('../bootstrap-components/collapseBtn');
var CollapseContainer = require('../bootstrap-components/collapseContainer');


var Title = React.createClass({
  render: function(){
    return (
      <div>
      	<NavBar title="Vocalize">
      	  <CollapseButton collapseTargetId="radio">
      	  	<span>Cheese?</span>
      	  </CollapseButton>
      	</NavBar>
      	<CollapseContainer collapseId="radio">
      		<LanguageRadio />
      	</CollapseContainer>
      </div>
    );
  }
});

module.exports = Title;