var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); 

// Components
var Title = require('../components/title');
var Instructions = require('../components/instructions');
var TargetWord = require('../components/targetWord');
var PlayWordBtn = require('../components/playWordBtn');
var RecordAudioBtn = require('../components/recordAudioBtn');
var WordControls = require('../components/wordControls');
var Score = require('../components/score');

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
      showScore: false
    };
  },

  handleScore: function(data) {
    
    this.setState({
      showScore: true,
      percentCorrect: data.score,
      peaks: data.peaks
    });

    console.log(data);
  },

  handleUserSettingsChange: function(e){
    var newState = {};
    newState[e.currentTarget.name] = e.currentTarget.value;
    this.setState(newState);
  },

  setTargetWord: function(previous) {
    
    this.setState({
      showScore: false
    });

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

    var TitleProps = {
      handleChange: this.handleUserSettingsChange,
      language: this.state.language,
      gender: this.state.gender,
      accent: this.state.accent
    };

    var WordControlsProps = {
      s3Key: this.state.s3Key,
      nextWord: this.setTargetWord.bind(this, false),
      previousWord: this.setTargetWord.bind(this, true)
    };

    return (
      <div className="root max-height">
        <Title {...TitleProps}/>

        <div className="container-fluid max-height">
          <div className="row max-height">
            <div className="col-md-12 content-container max-height">
              <TargetWord targetWord = {this.state.targetWord } />
              <div className="small-bucket">
              <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
                {this.state.showScore ? 
                  <Score key="1" /> :
                  <RecordAudioBtn key="2" handleScore={this.handleScore} />
                }
              </ReactCSSTransitionGroup>
              </div>
              <WordControls {...WordControlsProps}/>
              <Instructions />
            </div>
          </div>
        </div>    
      </div>
    );
  }
});

module.exports = PronunciationView;

