var React = require('react');

// Components
var Title = require('../components/title');
var Instructions = require('../components/instructions');
var TargetWord = require('../components/targetWord');
var PlayWordBtn = require('../components/playWordBtn');
var RecordAudioBtn = require('../components/recordAudioBtn');
var WordControls = require('../components/wordControls');

// Services
var WordService = require('../actions/wordService');
var UserAudio = require('../actions/userAudio');

var PronunciationView = React.createClass({

  recordRTC: null,

  // Accent isn't used to get a word from Word Service,
  // but included in here for later incorporation
  getInitialState: function() {
    return {
      language: 'english',
      gender: 'male',
      accent: 'general',
      targetWord: null,
      percentCorrect: null,
    };
  },

  handleChange: function(e){
    var newState = {};

    newState[e.currentTarget.name] = e.currentTarget.value;

    this.setState(newState);
  },

  setTargetWord: function(previous) {
    WordService.loadWordFromServer.call(this, previous)
      .then(function(data) {
        this.setState({
          targetWord: data.word,
          s3Key: data.s3.Key
        });
      }.bind(this));
  },

  componentDidMount: function() {
    this.setTargetWord(false);
  },

  render: function() {

    return (
      <div className="root max-height">
        <Title 
          handleChange={this.handleChange}
          language={this.state.language} 
          gender={this.state.gender} 
          accent={this.state.accent}/>


        <div className="container-fluid max-height">
          <div className="row max-height">
            <div className="col-md-12 content-container max-height">
              <TargetWord targetWord = {this.state.targetWord } />
              <RecordAudioBtn handleUserSample={this.handleUserSample} />
              <PlayWordBtn s3Key={this.state.s3Key}/>
              <WordControls nextWord={this.setTargetWord.bind(this, false)} previousWord={this.setTargetWord.bind(this, true)}/>
              <Instructions />
            </div>
          </div>
        </div>    
      </div>
    );
  },

  handleUserSample: function(blob) {
    WordService.postAudioFile(blob);
    //WordService.postAudioFile.call(this, blob);
  }
});

module.exports = PronunciationView;

