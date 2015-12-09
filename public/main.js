/*
React Component Hierarchy
  -VocalizeApp
    -Title
    -Instructions
    -PronunciationTest
      -TargetWord
      -OptionButtons
      -PercentCorrect
      -NextWord
*/

var NextWord = React.createClass({
  render: function(){
    return (
      <div className="next">
        <button type="button" className="btn btn-full">Next Word</button>
      </div>
    );
  }
});

var PercentCorrect = React.createClass({
  render: function(){
    return (
      <div>
        <h2>Score:</h2>
        <h2 className="score">87%</h2>
      </div>
    );
  }
});

var OptionButtons = React.createClass({
   render: function(){
    return (
      <div className="options">
        <button type="button" className="choices sound"><i className="icon ion-volume-high"></i></button>
        <button type="button" className="choices mircophone"><i className="icon ion-mic-a"></i></button>
      </div>
    );
  }
});

var TargetWord = React.createClass({
  render: function(){
    return (
      <div>
        <h2>Target Word</h2>
      </div>
    );
  }
});

var PronunciationTest = React.createClass({
  render: function(){
    return (
      <div>
        <div>
          <TargetWord />
        </div>
        <OptionButtons />
        <PercentCorrect />
        <div>
          <NextWord />
        </div>
      </div>
    );
  }
});

var Instructions = React.createClass({
  render: function(){
    return (
      <div>
        <h3>Click the mircophone button and pronounce the word shown below</h3>
      </div>
    );
  }
});

var Title = React.createClass({
  render: function(){
    return (
      <div>
        <h1 className="title">Vocalize</h1>
      </div>
    );
  }
});

var VocalizeApp = React.createClass({
  render: function(){
    return (
      <div>
        <Title />
        <div>
          <Instructions />
        </div>
        <div>
          <PronunciationTest />
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <VocalizeApp/>, 
  document.getElementById('vocalizeApp')
);