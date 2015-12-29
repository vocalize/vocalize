var Promise = require('bluebird');

module.exports = {

  /**
   * Requests access to browser microphone from users
   */
  requestUserAudioPermission: function() {
    var mediaConstraints = {
      audio: true,
      video: false
    };

    var successCallback = function(mediaStream) {
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

  postAudioFile: function(formData) {
    return new Promise(function(resolve, reject){
      jQuery.ajax({
        type: 'POST',
        url: '/api/audio/',
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        contentType: 'audio/wav',
        success: function(data) {
          resolve(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/api/audio', status, err.toString());
          reject(err);
        }.bind(this)
      });
    }.bind(this));
  }
};
