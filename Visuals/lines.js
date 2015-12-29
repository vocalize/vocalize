/* implementation heavily influenced by http://bl.ocks.org/1166403 */
    
    //dimensions of graph
    var m = [80, 80, 80, 80];
    var w = 800 - m[1] - m[3];
    var h = 400 - m[0] - m[2];

    var data = [
        [141, 0.059752584, 428, 0.075148381],
        [1586, 0.084293477, 682, 0.055529114],
        [1930, 0.051642373, 1554, 0.063409381],
        [2089, 0.046324391, 2356, 0.072343513],
        [2872, 0.068827689, 2979, 0.045618758],
        [3296, 0.053785808, 3352, 0.048490517],
        [3674, 0.054419037, 3701, 0.033609092],
        [4089, 0.06812989, 4051, 0.057071056],
        [4322, 0.038137503, 5369, 0.040184222],
        [4854, 0.043681193, 5482, 0.038941864],
        [5529, 0.040516123, 6368, 0.055369712],
        [6115, 0.043028761, 6584, 0.031398799],
        [6265, 0.03453549, 6955, 0.026006462],
        [6688, 0.069173008, 7301, 0.041809995],
        [7050, 0.032410365, 8154, 0.033934649],
        [7651, 0.060003195, 8315, 0.022865785],
        [8155, 0.051406257, 8675, 0.021453142],
        [8517, 0.041929573, 9113, 0.031976182],
        [8812, 0.036815859, 9405, 0.024029503],
        [9502, 0.059880696, 9574, 0.020245638],
        [9857, 0.039597239, 9829, 0.010965667],
        [10223, 0.049861655, 10393, 0.022992456],
        [10601, 0.030916154, 10497, 0.014151745],
        [11407, 0.040453617, 10980, 0.028933708],
        [11851, 0.034054797, 11199, 0.013407934],
        [12050, 0.018086506, 11774, 0.015749579],
        [12608, 0.013804808, 12194, 0.019376997],
        [13190, 0.015733527, 12437, 0.017405471],
        [13527, 0.01535001, 12824, 0.02055954],
        [13887, 0.03185381, 13806, 0.02061658],
        [14564, 0.031291306, 14318, 0.031293031],
        [14974, 0.02502743, 14841, 0.027576791],
        [15228, 0.019549977, 15772, 0.053660613]
    ];


    var x = d3.scale.linear().domain([0, 20000]).range([0, w]);
    var y = d3.scale.linear().domain([0.00, 0.09]).range([h, 0]);

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


    graph.append("svg:path").attr("d", nativeLine(data))
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


