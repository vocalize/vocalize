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
      	  	<span className="user-settings icon ion-gear-a"></span>
      	  </CollapseButton>
      	</NavBar>
      	<CollapseContainer collapseId="radio">
      		<LanguageRadio 
            handleChange={this.props.handleChange}
            language={this.props.language} 
            gender={this.props.gender} 
            accent={this.props.accent}/>
      	</CollapseContainer>
      </div>
    );
  }
});

module.exports = Title;