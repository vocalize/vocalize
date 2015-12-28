var React = require('react');

var RadioButton = React.createClass({
  render: function(){
    
    return (
      <div className="radio">
        <label>
          <input type="radio"
          onChange={this.props.handleChange}
          defaultChecked={this.props.checked}
          name={this.props.groupName} 
          value={this.props.value} />
          {this.props.label}
        </label>
      </div>
    );
  }
});

module.exports = RadioButton;