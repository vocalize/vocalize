var React = require('react');

var UserAudio = require('../actions/userAudio');

var RecordAudioBtn = React.createClass({

  recordRTC: null,

  componentDidMount: function() {
    UserAudio.requestUserAudioPermission.call(this);
  },

  startRecording: function() {
    console.log(this.recordRTC);
    this.recordRTC.startRecording();
  },

  stopRecording: function() {
    this.recordRTC.stopRecording(function() {
      
      var formData = new FormData();

      formData.append('edition[audio]', this.recordRTC.getBlob());

      UserAudio.postAudioFile.call(this, formData);
    }.bind(this));
  },

  render: function() {

    return (
      <div className="usr-options">
        <button 
          type="button" 
          className="microphone" 
          onMouseDown={this.startRecording}
          onMouseUp={this.stopRecording}>
          <i className="icon ion-mic-a"></i>
        </button>
      </div>
    );
  }
});

module.exports = RecordAudioBtn;

