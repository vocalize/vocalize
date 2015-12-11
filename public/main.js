/*
React Component Hierarchy
  -VocalizeApp
    -Title
    -Instructions
    -PronunciationTest
      -TargetWord
      -OptionButtons
      -PercentCorrect
      -NextWord
*/

var NextWord = React.createClass({

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

var PlayWord = React.createClass({

  render: function() {
    return ( 
      < div className = "play" >
        <button type = 'button'
          className = "btn btn-full"
          onClick = {this.props.onClick} 
        >
        Play Word 
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

var OptionButtons = React.createClass({
   render: function(){
    return (
      <div className="options">
        <button type="button" className="choices sound">
          <i className="icon ion-volume-high"></i>
        </button>
        <button 
          type="button" 
          className="choices mircophone" 
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
        <h2>
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
      url: '/api/next',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/next', status, err.toString());
      }.bind(this)
    });
  },

  playWord: function() {
    console.log('play word');
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    function loadSound() {
      var request = new XMLHttpRequest();
      request.open("GET", "http://localhost:3000/api/audio/eugenehello.wav", true);
      request.responseType = "arraybuffer";

      request.onload = function() {
        console.log(request.response);
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
        <div>
          <TargetWord targetWord={this.state.targetWord} />
        </div>
        <OptionButtons 
          targetWordAudio={this.state.targetWordAudio}
          startRecording={this.startRecordingUserAudio}
          stopRecording={this.stopRecordingUserAudio}
        />
        <PercentCorrect percentCorrect={this.state.percentCorrect} />
        <div>
          <NextWord onClick={this.loadWordFromServer} />
        </div>
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
        <div>
          <Instructions />
        </div>
        <div>
          <PronunciationTest />
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <VocalizeApp/>, 
  document.getElementById('vocalizeApp')
);