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

var React = require('react');
window.jQuery = require('jquery');
var ReactDOM = require('react-dom');
require('bootstrap');


<<<<<<< 1e219c81ce57901043bd7f2d162908ca91bb344d
var PronunciationView = require('./src/views/pronunciationView.js');
=======
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
        this.setState({targetWord: data.word, s3key: data.s3.Key});
      }.bind(this)
    });
  },

  compileNextWordUrl : function() {
    /*
      Example: /api/words/index/?language=english&gender=male
    */
    var language = 'language=' + this.state.language;
    var gender = 'gender=' + this.state.gender;
    var url = '/api/words/index/?' + language + '&' + gender;
    
    return url;
  },

  playWord: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var s3key = this.state.s3key;

    function loadSound() {
      var request = new XMLHttpRequest();
      request.open("GET", "http://localhost:3000/api/audio/" + s3key, true);
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
        // Close audio context when file is done
        source.onended = function(){
          context.close();
        }
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
      this.postTargetWord();
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
>>>>>>> added some things

ReactDOM.render(
  <PronunciationView/>, 
  document.getElementById('vocalizeApp')
);