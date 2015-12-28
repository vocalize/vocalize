var React = require('react');

var PlayWordBtn = React.createClass({

  audioPlayer: null,

  playWord: function(){
    this.audioPlayer.play();
  },

  componentDidMount: function(){
    this.audioPlayer = jQuery('#audio-player')[0];
  },

  render: function() {

    var streamUrl = 'http://d2oh9tgz5bro4i.cloudfront.net/public/apple.wav';

    return ( 
      
      <div className = "usr-options" >
        {/* Change streamUrl to s3key for production */}
        <audio id='audio-player' src={streamUrl}/>
        <button type = "button"
          className = "sound"
          onClick = {this.playWord}>
          <i className="icon ion-volume-high"></i>
        </button> 
      </div>
    );
  }
});

module.exports = PlayWordBtn;