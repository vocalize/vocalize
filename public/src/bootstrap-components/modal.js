var React = require('react');

var Modal = React.createClass({

	render: function(){
		return (
			<div id={this.props.targetId} className="modal fade" tabIndex="-1" role="dialog">
			  <div className="modal-dialog">
			    <div className="modal-content">
			      <div className="modal-header">
			        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 className="modal-title">{this.props.title}</h4>
			      </div>
			      <div className="modal-body">
			        {this.props.text}
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
});

module.exports = Modal;