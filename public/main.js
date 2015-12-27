 /*
React Component Hierarchy
  -VocalizeApp
    -Title
    -Instructions
    -PronunciationTest
      -TargetWord
      -PlayWordBtn
      -RecordAudioBtn
      -PercentCorrect
      -NextWordBtn
*/

var React = require('react');
window.jQuery = require('jquery');
var ReactDOM = require('react-dom');
require('bootstrap');

var PronunciationView = require('./src/views/pronunciationView.js');

ReactDOM.render(
  <PronunciationView/>, 
  document.getElementById('vocalizeApp')
);