var React = require('react');

var RadioButton = React.createClass({
  render: function(){
    return (
      <div clasName="radio">
        <label>
          <input type="radio" name={this.props.groupName} value={this.props.value} />
          {this.props.label}
        </label>
      </div>
    );
  }
});

module.exports = RadioButton;