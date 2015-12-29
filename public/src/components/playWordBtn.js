var React = require('react');

var Button = require('../bootstrap-components/button');

var PlayWordBtn = React.createClass({

  audioPlayer: null,

  playWord: function(){
    this.audioPlayer.play();
  },

  componentDidMount: function(){
    this.audioPlayer = jQuery('#audio-player')[0];
  },

  render: function() {

    //var streamUrl = 'http://d2oh9tgz5bro4i.cloudfront.net/public/apple.wav';
    var streamUrl = 'http://d2oh9tgz5bro4i.cloudfront.net/public/' + this.props.s3Key;

    return ( 
      
      <span>
        <audio id='audio-player' src={streamUrl}/>
        <Button text={<i className="icon ion-volume-high"></i>} onClick = {this.playWord} style="btn-primary"/>
      </span>
    );
  }
});

module.exports = PlayWordBtn;