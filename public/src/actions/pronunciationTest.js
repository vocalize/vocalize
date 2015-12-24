var React = require('react');

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
      contentType: 'audio/wav',
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