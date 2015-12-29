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

    var modalProps = {
      targetId: 'instructionsModal',
      title: 'How to Vocalize',
      text: 'This is how we do it.'
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
