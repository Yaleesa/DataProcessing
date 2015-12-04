// d3line.js, contains javascript for interactive linegraph with d3

var data;

//loading the data, after complete, fire up the main function
d3.json("data.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  JSONComplete(data)
});

function JSONComplete (data) {
    //parameters for the svg
    var margin = {top: 40, right: 40, bottom: 60, left:60},
        width = 1000,
        height = 500;

    //creating the svg
    var svg = d3.select('.container').append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    //setting domain and range for x axis
    var xScale = d3.time.scale()
        .domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 0)])
        .rangeRound([0, width - margin.left - margin.right]);

    //setting domain and range for y axis
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.temp; })])
        .range([height - margin.top - margin.bottom, 0]);

    //redefine domains for crosshair use (wanted to put it in the scale domains aswell, put got errors instead..)
    var xDomain = d3.extent(data, function(d) { return new Date(d.date); })
    var yDomain = d3.extent(data, function(d) { return d.temp; });

    //format the xAxis, with only the months
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(d3.time.months)
        .tickSize(10, 0)
        .tickFormat(d3.time.format("%B"))
        .tickPadding(5);

    //format the y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickPadding(8);

    //calculate the data line
    var line = d3.svg.line()
      .x(function(d) { return xScale(new Date(d.date)); })
      .y(function(d) { return yScale(d.temp); });

    //draw the dataline
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    //draw the x axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
        .call(xAxis);

    //draw the y axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    //draw the text label for x axis
    svg.append("text") 
        .attr("class", "x text")
        .attr("x", 400 )
        .attr("y", 460 )
        .style("text-anchor", "middle")
        .text("Date");

    //draw text lael for y axis
    svg.append("text") 
        .attr("class", "y text")
        .attr("x", -200 )
        .attr("y", -40 )
        .style("text-anchor", "middle")
        .attr("transform", "rotate(270)")
        .text("Temperature x10");

    //making the svg for the crosshairs
    var crosshair = svg.append('g').style('display', 'none');
        //x, y line and circle
        crosshair.append('line')
            .attr('id', 'crosshairLineX')
            .attr('class', 'crosshairLine');
        crosshair.append('line')
            .attr('id', 'crosshairLineY')
            .attr('class', 'crosshairLine');
        crosshair.append('circle')
            .attr('id', 'crosshairCircle')
            .attr('r', 5)
            .attr('class', 'circle crosshairCircle');
        //pop up text labels
        crosshair.append('text')
            .attr('id', 'textTemp')
        crosshair.append('text')
            .attr('id', 'textDate')
        
        //function used later for finding the index for the date.
        var bisectDate = d3.bisector(function(d) { return (new Date(d.date)); }).left;

        //making a rect to cover the svg with the graph on it. (and hiding it from display ofcourse)
        svg.append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            //mouseover lets the user see the crosshair when in range (on the graph),
            //mouseout, hides the crosshair when the mouse is not on the graph
            //mousemove is making the crosshair based on where the mouse is. (and updates it when the mouse moves)
            .on('mouseover', function() { crosshair.style('display', null); })
            .on('mouseout', function() { crosshair.style('display', 'none'); })
            .on('mousemove', function() { 
                var mouse = d3.mouse(this);
                var mouseDate = xScale.invert(mouse[0]);
                var i = bisectDate(data, mouseDate); 

                //get the dates on the index got with bisectData and one after that.
                var d0 = data[i - 1]
                var d1 = data[i];

                //calculate which of the dates is closest to the mouse
                var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

                //get the date and values
                var x = xScale(new Date(d.date));
                var y = yScale(d.temp);

                //assign the right x and y coordinates to make the crosshairs
                crosshair.select('#crosshairCircle')
                    .attr('cx', x)
                    .attr('cy', y);
                crosshair.select('#crosshairLineX')
                    .attr('x1', x).attr('y1', yScale(yDomain[0]))
                    .attr('x2', x).attr('y2', yScale(yDomain[1]));
                crosshair.select('#crosshairLineY')
                    .attr('x1', xScale(xDomain[0])).attr('y1', y)
                    .attr('x2', xScale(xDomain[1])).attr('y2', y);

                //getting the right values for the labels, and some hacking for positioning them.
                crosshair.select('#textTemp')
                    .attr('x', xScale.range()[1]-35)
                    .attr('y', y - 3)
                    .text(d.temp/10 + ' ℃')
                crosshair.select('#textDate')
                    .attr('x', x + 3)
                    .attr('y', yScale.range()[1]+ 10)
                    .text(d.date)
            });


}