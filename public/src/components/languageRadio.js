var React = require('react');
var RadioButton = require('../bootstrap-components/radioButton');

var LanguageRadio = React.createClass({

  languages: ['English', 'Spanish'],

  genders: ['Female', 'Male'],

  render: function() {
    var languageRadioButtons = this.languages.map(function(language, idx) {

      var props = {
        key: idx,
        value: language.toLowerCase(),
        label: language,
        groupName: "language",
        checked: language.toLowerCase() === this.props.language,
        handleChange: this.props.handleChange
      };

      return <RadioButton {...props}/>
    }.bind(this));

    var genderRadioButtons = this.genders.map(function(gender, idx) {

      var props = {
        key: idx,
        value: gender.toLowerCase(),
        label: gender,
        groupName: "gender",
        checked: gender.toLowerCase() === this.props.gender,
        handleChange: this.props.handleChange
      };

      return <RadioButton {...props}/>
    }.bind(this));

    return (
      <form>
        <div className="form-group">
          <label>Language</label>
          {languageRadioButtons}
        </div>
        <div className="form-group">
          <label>Gender</label>
          {genderRadioButtons}
        </div>
      </form>
    );
  }
});

module.exports = LanguageRadio;
