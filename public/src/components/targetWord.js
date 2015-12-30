var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); 

var TargetWord = React.createClass({
  render: function(){

    var target = <h1 key={this.props.targetWord} className="target-word center-content"> {this.props.targetWord} </h1>;
    
    return (
      <div>
          <div className="small-bucket">
            <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
              {target}
            </ReactCSSTransitionGroup>
          </div>
        <hr className="separator" />
      </div>
    );
  }
});

module.exports = TargetWord;