var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); 

var Spinner = require('./spinner');

var UserAudio = require('../actions/userAudio');

var RecordAudioBtn = React.createClass({

  recordRTC: null,

  getInitialState: function() {
    return {
      loading: false,
      recording: false
    };
  },

  componentDidMount: function() {
    UserAudio.requestUserAudioPermission.call(this);
  },

  startRecording: function() {
    this.recordRTC.startRecording();
    this.setState({
      recording: true
    });
  },

  stopRecording: function() {

    this.setState({
      loading: true,
      recording: false
    });

    this.recordRTC.stopRecording(function() {

      var formData = new FormData();

      formData.append('edition[audio]', this.recordRTC.getBlob());

      UserAudio.postAudioFile.call(this, formData)
        .then(function(data) {
          
          this.setState({
            loading: false
          });
          debugger;

          this.props.handleScore(data);
        }.bind(this));
    }.bind(this));
  },

  render: function() {
    var display = (this.state.loading) ? 
      <Spinner key='1' /> : 
      <button key='2' type="button" 
      className={this.state.recording ? "microphone live-mic" : "microphone"} 
      onMouseDown={this.startRecording} 
      onMouseUp={this.stopRecording}>
      <i className="icon ion-mic-a"></i>
      </button>;
    return (
      <div className="record-btn-container center-content">
        <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
            {display}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

module.exports = RecordAudioBtn;
