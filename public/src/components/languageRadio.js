var React = require('react');
var RadioButton = require('../bootstrap-components/radioButton');

var LanguageRadio = React.createClass({
  render: function(){
    return (
      <form>
        <RadioButton label={"English"} groupName={"language"} value={"english"} />
        <RadioButton label={"Spanish"} groupName={"language"} value={"spanish"} />
        <RadioButton label={"Chinese"} groupName={"language"} value={"chinese"} />
      </form>
    );
  }
});

module.exports = LanguageRadio;