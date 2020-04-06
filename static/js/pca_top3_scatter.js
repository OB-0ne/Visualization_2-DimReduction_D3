function d3_ScatterPlot_Matrix(data){

    // setting the parameters for the svg
    var width = 990,
    size = 270,
    padding = 30;

    // setting the x and y scale and axis
    var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);


    var colByAttr = {},
    attr = d3.keys(data[0]).filter(function(d) { return d !== "species"; }),
    n = attr.length;

    attr.forEach(function(trait) {
        colByAttr[trait] = d3.extent(data, function(d) { return d[trait]; });
    });

    //define the number of total boxes to be created
    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);


    // make the svg for the plots
    var svg = d3.select("#svg-holder-scattermat").append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    //make the x and y axis
    svg.selectAll(".x.axis")
        .data(attr)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(colByAttr[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
        .data(attr)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(colByAttr[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
        .data(cross(attr, attr))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("class","attr_text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });

    function plot(p) {
        var cell = d3.select(this);

        x.domain(colByAttr[p.x]);
        y.domain(colByAttr[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 2.5)
    }

    //responsible for getting the vairous plot points for the dots
    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
            return c;
    }

}

