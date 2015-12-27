var React = require('react');

var PlayWordBtn = React.createClass({

  render: function() {
    return ( 
      < div className = "usr-options" >
        <button type = "button"
          className = "sound"
          onClick = {this.props.playWord} 
        >
          <i className="icon ion-volume-high"></i>
        </button> 
      </div>
    );
  }
});

module.exports = PlayWordBtn;