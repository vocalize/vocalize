var React = require('react');

var NavBar = React.createClass({
  render: function(){

    var children = React.Children.map(this.props.children, function(child, i){
      return <li key={i}>{child}</li>
    });

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{this.props.title}</a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse">
            
            <ul className="nav navbar-nav navbar-right">
              {children}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;