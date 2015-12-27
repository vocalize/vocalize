var React = require('react');

var RecordAudioBtn = React.createClass({
  render: function() {
    return (
      <div className="usr-options">
        <button 
          type="button" 
          className="microphone" 
          onMouseDown={this.props.startRecording}
          onMouseUp={this.props.stopRecording}>
          <i className="icon ion-mic-a"></i>
        </button>
      </div>    
    );
  }
});

module.exports = RecordAudioBtn;