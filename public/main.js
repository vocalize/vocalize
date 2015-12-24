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
var $ = window.jQuery;
var Button = require('react-bootstrap').Button;
var ReactDOM = require('react-dom');
require('bootstrap');


var NextWordBtn = React.createClass({

  render: function(){
    return (
      <div>
        <Button bsStyle="primary" onClick={this.props.onClick} > Next Word </Button> 
      </div> 
    );
  }
});

var PrevWordBtn = React.createClass({

  render: function(){
    return (
      <div className="prev">
        <button 
          type='button'
          className="btn btn-full" 
          onClick={this.props.onClick}
        >
          Previous Word
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

  loadPrevWordFromServer: function() {
    var url = this.compilePrevWordUrl();
    console.log(url);
  },

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

  compilePrevWordUrl: function() {
    var language = 'language=' + this.state.language;
    var gender = 'gender=' + this.state.gender;
    var url = '/api/words/previndex/?' + language + '&' + gender;
    return url;
  },

  playWord: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var s3key = this.state.s3key;

    function loadSound() {
      var request = new XMLHttpRequest();
      request.open("GET", "/api/audio/" + s3key, true);
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
      contentType: 'multipart/form-data',
      success: function(data) {
        this.recordRTC.clearRecordedData();
        console.log('data', data);
        var percentCorrect = Math.floor(data.score);
        this.setState({
          percentCorrect: percentCorrect
        });
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
        alert(data);
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
        <PrevWordBtn onClick={this.loadPrevWordFromServer} />
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
      <NavBar title="Vocalize">
        <LanguageRadio />
      </NavBar>
    );
  }
});

var LanguageRadio = React.createClass({
  render: function(){
    return (
      <form>
        <RadioButton label={"English"} groupName={"language"} value={"english"} />
        <RadioButton label={"Spanish"} groupName={"language"} value={"spanish"} />
        <RadioButton label={"Chinese"} groupName={"language"} value={"chinese"} />
      </form>
    );
  }
});

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

var NavBar = React.createClass({
  render: function(){

    var children = React.Children.map(this.props.children, function(child, i){
      return <li key={i}>{child}</li>
    });

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{this.props.title}</a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse">
            
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  {children}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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