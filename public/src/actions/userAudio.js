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
    console.log(formData);
    jQuery.ajax({
      type: 'POST',
      url: '/api/audio/',
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
      contentType: 'audio/wav',
      success: function(data) {
        this.recordRTC.clearRecordedData();
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/audio', status, err.toString());
      }.bind(this)
    });
  }
};
