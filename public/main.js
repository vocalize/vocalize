/*
React Component Hierarchy
  -VocalizeApp
    -Title
    -Instructions
    -PronunciationTest
      -TargetWord
      -PlayWordBtn
      -RecordAudioBtn
      -PercentCorrect
      -NextWordBtn
*/

var NextWordBtn = React.createClass({

  render: function(){
    return (
      <div className="next">
        <button 
          type='button'
          className="btn btn-full" 
          onClick={this.props.onClick}
        >
          Next Word
        </button>
      </div>
    );
  }
});

var PercentCorrect = React.createClass({
  render: function(){
    return (
      <div>
        <h2>Score:</h2>
        <h2 className="score">
          {this.props.percentCorrect}%
        </h2>
      </div>
    );
  }
});

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

var RecordAudioBtn = React.createClass({
  render: function() {
    return (
      <div className="usr-options">
        <button 
          type="button" 
          className="microphone" 
          onMouseDown={this.props.startRecording}
          onMouseUp={this.props.stopRecording}
        >
          <i className="icon ion-mic-a"></i>
        </button>
      </div>    
    );
  }
});

var TargetWord = React.createClass({
  render: function(){
    return (
      <div>
        <h2 className="target-word">
          {this.props.targetWord}
        </h2>
      </div>
    );
  }
});

var PronunciationTest = React.createClass({
  recordRTC: null,

  loadWordFromServer: function() {
    $.ajax({
      url: '/api/word/index/',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/word/index/', status, err.toString());
      }.bind(this)
    });
  },

  playWord: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    function loadSound() {
      var request = new XMLHttpRequest();
      request.open("GET", "http://localhost:3000/api/audio/eugenehello.wav", true);
      request.responseType = "arraybuffer";

      request.onload = function() {
        var Data = request.response;
        process(Data);
      };

      request.send();
    }

    function process(Data) {
      var source = context.createBufferSource(); // Create Sound Source
      context.decodeAudioData(Data, function(buffer) {
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(context.currentTime);
      });
    }

    loadSound();
  },

  requestUserAudioPermission: function() {
    var mediaConstraints = {
      audio: true,
      video: false
    };

    var successCallback = function (mediaStream) {
      var config = {
        type: 'audio',
        numberOfAudioChannels: 1
      };

      this.recordRTC = RecordRTC(mediaStream, config);
    };

    var errorCallback = function(err) {
      console.log(err);
    };

    // TODO: check for browser compatability with navigator.mediaDevices.getUserMedia()
    // navigator.getUserMedia is deprecated and should be avoided if possible
    navigator.getUserMedia(mediaConstraints, successCallback.bind(this), errorCallback);
  },

  startRecordingUserAudio: function() {
    this.recordRTC.startRecording();
  },

  stopRecordingUserAudio: function() {
    this.recordRTC.stopRecording(function(audioURL) {
      var soundBlob = this.recordRTC.blob;
      this.sendAudioFileToServer(soundBlob);
    }.bind(this));
  },

  sendAudioFileToServer: function(soundBlob) {
    var formData = new FormData();
    formData.append('userAudio', soundBlob);
    $.ajax({
      type: 'POST',
      url: '/api/audio',
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
    });
  },

  getInitialState: function() {
    return {
      targetWord: null,
      targetWordAudio: null,
      percentCorrect: null,
    };
  },

  componentDidMount: function() {
    this.loadWordFromServer();
    this.requestUserAudioPermission();
  },

  render: function(){
    return (
      <div>
        <TargetWord targetWord={this.state.targetWord} />
        <PlayWordBtn playWord={this.playWord} />
        <RecordAudioBtn 
          startRecording={this.startRecordingUserAudio}
          stopRecording={this.stopRecordingUserAudio}
        />
        <PercentCorrect percentCorrect={this.state.percentCorrect} />
        <NextWordBtn onClick={this.loadWordFromServer} />
      </div>
    );
  }
});

var Instructions = React.createClass({
  render: function(){
    return (
      <div>
        <h3>
          Click and hold the microphone button, while pronouncing the word shown below
        </h3>
      </div>
    );
  }
});

var Title = React.createClass({
  render: function(){
    return (
      <div>
        <h1 className="title">Vocalize</h1>
      </div>
    );
  }
});

var VocalizeApp = React.createClass({
  render: function(){
    return (
      <div>
        <Title />
        <Instructions />
        <PronunciationTest />
      </div>
    );
  }
});

ReactDOM.render(
  <VocalizeApp/>, 
  document.getElementById('vocalizeApp')
);