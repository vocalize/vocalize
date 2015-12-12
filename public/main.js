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
    var url = this.compileNextWordUrl();

    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.setState({targetWord: data.word});
      }.bind(this)
    });
  },

  compileNextWordUrl : function() {
    /*
      Example: /api/words/index/?word_index=0&language=english&gender=male
    */
    var language = 'language=' + this.state.language;
    var gender = 'gender=' + this.state.gender;
    var word_index = document.cookie.slice();
    var url = '/api/words/index/?' + word_index + '&' + language + '&' + gender;
    
    return url;
  },

  playWord: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var word = this.state.targetWord;

    function loadSound() {
      var request = new XMLHttpRequest();
      request.open("GET", "http://localhost:3000/api/audio/" + word + ".wav", true);
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
      this.postAudioFile(soundBlob);
    }.bind(this));
  },

  postAudioFile: function(soundBlob) {
    var formData = new FormData();
    formData.append('userAudio', soundBlob);
    $.ajax({
      type: 'POST',
      url: '/api/audio/',
      data: formData,
      processData: false,
      contentType: 'audio/wav',
      success: function(data) {
        this.postTargetWord();
        this.recordRTC.clearRecordedData();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/audio', status, err.toString());
      }.bind(this)
    });
  },

  postTargetWord: function() {
    $.ajax({
      type: 'POST',
      url: '/api/word/',
      data: {'word': this.state.targetWord},
      success: function(data) {
        // TODO: update state with comparison results
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/word/', status, err.toString());
      }.bind(this)
    });  
  },

  getInitialState: function() {
    return {
      language: 'english',
      gender: 'male',
      targetWord: null,
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