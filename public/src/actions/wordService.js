var Promise = require('bluebird');


/**
 * Get Request base URL
 * @type {String}
 */
var _baseURL = '/api/words/index/?';

/**
 * Formats an object into a get request string
 * @param  {[object]} params [parameter object]
 * @return {[string]}        [get request formatted URL]
 */
var _formatGetRequest = function(params) {

  var url = _baseURL;

  for (var key in params) {
    url += key + '=' + params[key];
    url += '&';
  };

  return url.slice(0, -1);
};

/**
 * Compiles an ajax URL using current state params
 * Pass previous as true to get previous word index instead of next word index
 * @param  {[boolean]} previous [set to true to get previous word]
 * @return {[string]}           [GET request URL]
 */
var _compileWordUrl = function(previous) {
  /*
    Example: /api/words/index/?language=english&gender=male
  */

  var params = {
    language: this.state.language,
    gender: this.state.gender
  };

  if (previous) {
    params.previous = true;
  };

  return _formatGetRequest(params);
};


module.exports = {
  /**
   * Makes a GET request to the server to load word data
   * Sets state.targetWord and s3 key on success
   * @param  {[boolean]} previous [set to true to get previous word instead of next]
   * @return {[type]}          [description]
   */
  loadWordFromServer: function(previous) {
    return new Promise(function(resolve, reject) {
      var url = _compileWordUrl.call(this, previous);
      console.log(url);
      jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
          resolve(data);
        }
      });
    }.bind(this));
  },

  postTargetWord: function() {
    jQuery.ajax({
      type: 'POST',
      url: '/api/word/',
      data: {
        'word': this.state.targetWord
      },
      success: function(data) {
        alert(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/word/', status, err.toString());
      }.bind(this)
    });
  },
};
