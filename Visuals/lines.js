/* implementation heavily influenced by http://bl.ocks.org/1166403 */
    
    //dimensions of graph
    var m = [80, 80, 80, 80];
    var w = 800 - m[1] - m[3];
    var h = 400 - m[0] - m[2];

    var data = 
    [ [ 274, 0.34891436, 453, 0.09274292 ],
         [ 1061, 0.262824, 1008, 0.10638428 ],
         [ 1186, 0.22609356, 1474, 0.12445068 ],
         [ 1593, 0.29495031, 1951, 0.10559082 ],
         [ 2015, 0.39749721, 2273, 0.10525513 ],
         [ 2030, 0.13521235, 2401, 0.093475342 ],
         [ 3006, 0.40480804, 2856, 0.10192871 ],
         [ 3316, 0.3709918, 3531, 0.10806274 ],
         [ 3955, 0.43853572, 3954, 0.10443115 ],
         [ 4515, 0.38441557, 4381, 0.09552002 ],
         [ 5036, 0.48846608, 4744, 0.08883667 ],
         [ 5161, 0.3495734, 5142, 0.091094971 ],
         [ 5484, 0.37253517, 5553, 0.090576172 ],
         [ 5651, 0.31871712, 5943, 0.088989258 ],
         [ 5692, 0.30976239, 6336, 0.082183838 ],
         [ 6314, 0.2880432, 6726, 0.073181152 ],
         [ 6754, 0.3174063, 7132, 0.05355835 ],
         [ 7478, 0.42368898, 7526, 0.057403564 ],
         [ 8506, 0.53323072, 7928, 0.056549072 ],
         [ 9029, 0.41820353, 8341, 0.05368042 ],
         [ 9392, 0.42930889, 8580, 0.049133301 ],
         [ 9718, 0.36003557, 9023, 0.050933838 ],
         [ 11065, 0.58354133, 9505, 0.043304443 ],
         [ 11130, 0.46185064, 9992, 0.033752441 ],
         [ 11438, 0.4609499, 10666, 0.052368164 ],
         [ 11882, 0.36792025, 10758, 0.020721436 ],
         [ 12435, 0.56763059, 11119, 0.043609619 ],
         [ 12659, 0.43429229, 11721, 0.078674316 ],
         [ 13420, 0.37490159, 12158, 0.11676025 ],
         [ 14777, 0.71489406, 12248, 0.09552002 ],
         [ 15340, 0.88346505, 12716, 0.098602295 ],
         [ 15938, 0.61705631, 12805, 0.087097168 ] ];


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


