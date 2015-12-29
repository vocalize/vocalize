var React = require('react');

var Score = React.createClass({
  componentDidMount: function() {
    drawGraph(this.props.peaks);
  },

	render: function(){
		return(
			<div className="small-bucket center-content">
				<h2>Score</h2>
        <div id="graph" className="aGraph"></div>
				<span id="scoreDisplay">{this.props.percentCorrect}</span> 
			</div>
		);
	}
});

module.exports = Score;

var calculateXMax = function(data) {
  var max = data.reduce(function(prev, curr, index, array) {
    return Math.max(prev, Math.max(curr[0], curr[2]));
  }, 0);

  return max * 1.1;  // extra room
}

var calculateYMax = function(data) {
  var max = data.reduce(function(prev, curr, index, array) {
    return Math.max(prev, Math.max(curr[1], curr[3]));
  }, 0);
  return max * 1.1;  // extra room
}

var drawGraph = function(data) {
  if (!data) return;


  var m = [80, 80, 80, 80];
  var w = 800 - m[1] - m[3];
  var h = 400 - m[0] - m[2];

  var x = d3.scale.linear().domain([0, calculateXMax(data)]).range([0, w]);
  var y = d3.scale.linear().domain([0.00, calculateYMax(data)]).range([h, 0]);

  var nativeLine = d3.svg.line()
      .interpolate("basis")
      .x(function(data, i) {
          return x(data[0]);
      })
      .y(function(data) {
          return y(data[1]);
      });

  var userLine = d3.svg.line()
      .interpolate("basis")
      .x(function(data, i) {
          return x(data[2]);
      })
      .y(function(data) {
          return y(data[3]);
      });

  var graph = d3.select("#graph").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


  var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);

  graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);



  var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

  graph.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(-25,0)")
      .call(yAxisLeft);

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  graph.append("svg:path")
  .attr("d", nativeLine(data))
  .attr("class", "native")
      .on("mouseover", function(d) {
          div.transition()
              .duration(200)
              .style("opacity", 0.9);
          div.html('Native Sample')
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          div.transition()
              .duration(500)
              .style("opacity", 0);
      });


  graph.append("svg:path").attr("d", userLine(data))
  .attr("class", "user")
      .on("mouseover", function(d) {
          div.transition()
              .duration(200)
              .style("opacity", 0.9);
          div.html('Your Sample')
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          div.transition()
              .duration(500)
              .style("opacity", 0);
      });


}


