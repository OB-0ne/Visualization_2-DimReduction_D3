
function d3_ScreePlot(pca_data_dim, pca_data_cumdim){

  var n = 12, // number of samples
    m = 3; // number of series

  var colors = ["#AAA139", "#324575", "#943156"];


  var margin = {top: 20, right: 30, bottom: 50, left: 50},
      width = 1600 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;


  var metric = [0,1];

  var y = d3.scaleLinear()
      .domain(metric)
      .range([height,0]);

  var x0 = d3.scaleBand()
      .domain(d3.range(n))
      .range([0,width], .2);

  var x1 = d3.scaleBand()
      .domain(d3.range(m))
      .range([0, x0.bandwidth() - 10]);


  var z = d3.scaleOrdinal()
      .domain(["Original Data", "Random Data","Stratified Data"])
      .range(colors);

  var svg = d3.select("#svg-holder").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5);
  }

  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

  svg.append("g").selectAll("g")
      .data(pca_data_dim)
    .enter().append("g")
      .style("fill", function(d, i) { return z(i); })
      .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
    .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d); })
        .attr("x", function(d, i) { return x0(i); })
        .attr("y", function(d) { return y(d); });

  x0 = d3.scaleBand()
    .domain(d3.range(1,n+1))
    .range([0,width], .2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x0,function(d,i){return i;}));

  // Add the Y Axis, have them in percentage
  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

  //----------------LINE GRAPH----------------
  var y = d3.scaleLinear()
      .range([height,0])
      .domain([0, 1]);
  var x = d3.scaleBand()
      .domain(d3.range(n))
      .range([0,width], .2);

  var valueline = d3.line()
    .x(function(d,i) { return x(i) + 20; })
    .y(function(d) { return y(d); });

  // Add the valueline path.
  svg.append("path")
      .data([pca_data_cumdim[0]])
      .attr("class", "line1")
      .attr("d", valueline);

  var valueline = d3.line()
  .x(function(d,i) { return x(i) + 60; })
  .y(function(d) { return y(d); });
    
  // Add the valueline path.
  svg.append("path")
      .data([pca_data_cumdim[1]])
      .attr("class", "line2")
      .attr("d", valueline);

  var valueline = d3.line()
    .x(function(d,i) { return x(i) + 100; })
    .y(function(d) { return y(d); });



  // Add the valueline path.
  svg.append("path")
      .data([pca_data_cumdim[2]])
      .attr("class", "line3")
      .attr("d", valueline);

  // Title to the x axis
  svg.append("text")
    .attr("class","axis-titles")
    .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("PC Components");

  //Title for Y Axis
  svg.append("text")
    .attr("class","axis-titles")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("PCA Value (%)");  

  //Legends code - manual code to create the boxes and texts
  var x_main = 1300;
  var y_main = 500;

  svg.append("text").attr("x", x_main + 20).attr("y", y_main - 12).text("LEGENDS").style("font-size", "15px").attr("alignment-baseline","middle").attr("font-weight","bold").style("text-decoration","underline");
  svg.append("rect").attr("x", x_main).attr("y", y_main).attr("height", 15).attr("width",15).style("fill", "#AAA139");
  svg.append("rect").attr("x", x_main).attr("y", y_main + 20).attr("height", 15).attr("width",15).style("fill", "#324575");
  svg.append("rect").attr("x", x_main).attr("y", y_main + 40).attr("height", 15).attr("width",15).style("fill", "#943156");
  svg.append("text").attr("x", x_main + 20).attr("y", y_main + 12).text("Original Data").style("font-size", "15px").attr("alignment-baseline","middle");
  svg.append("text").attr("x", x_main + 20).attr("y", y_main + 32).text("Random Sampled Data").style("font-size", "15px").attr("alignment-baseline","middle");
  svg.append("text").attr("x", x_main + 20).attr("y", y_main + 52).text("Stratified Sampled Data").style("font-size", "15px").attr("alignment-baseline","middle");

}