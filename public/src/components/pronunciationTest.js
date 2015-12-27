var React = require('react');
var TargetWord = require('./targetWord');
var PlayWordBtn = require('./playWordBtn');
var PercentCorrect = require('./percentCorrect');
var RecordAudioBtn = require('./recordAudioBtn');
var Button = require('../bootstrap-components/button');

var PronunciationTest = React.createComponent({
	  render: function(){
    return (
      <div>
        <TargetWord targetWord={this.state.targetWord} />
        <PlayWordBtn playWord={this.playWord} />
        <RecordAudioBtn 
          startRecording={this.startRecordingUserAudio}
          stopRecording={this.stopRecordingUserAudio} />
        <PercentCorrect percentCorrect={this.state.percentCorrect} />
        <Button text='Next Word' onClick={this.loadWordFromServer} />
        <Button text='Previous Word' onClick={this.loadPrevWordFromServer} />
      </div>
    );
    }
});

module.exports = PronunciationTest;