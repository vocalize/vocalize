var React = require('react');

var Modal = require('../bootstrap-components/modal');
var Button = require('../bootstrap-components/button');

var Instructions = React.createClass({
  render: function() {

    var buttonProps = {
      style: 'instructions-btn',
      dataToggle: 'modal',
      dataTarget: 'instructionsModal'
    };

    var instructions = <div><p>To compare your pronunciation to that of a native speaker, click and hold the microphone button and say the word.</p><p>The lower the score the closer you are to a native speaker. To hear the word, click the speaker button.</p><p>The graph can help you change your pronunciation to be closer to the native speaker.</p></div>

    var modalProps = {
      targetId: 'instructionsModal',
      title: 'How to Vocalize',
      text: instructions
    };

    return (
      <div className="center-content">
        <Button text={<i className="icon ion-help"></i>} {...buttonProps}/>
        <Modal {...modalProps}/>
      </div>
    );
  }
});

module.exports = Instructions;
