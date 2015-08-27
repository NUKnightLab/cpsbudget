
function draw_pie_chart(school_name, total) {
  var budget15 = total;

  var width = 480,
      height = 250,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[school_name]; });

  var svg = d3.select("body").select("#pie").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv("./js/data/pieChart.csv", function(error, data) {

    data.forEach(function(d) {
      d[school_name] = +d[school_name];
    });

    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { 
          if (d.value > 0.0001) {
            return color(d.data["2015Expenditures"]); 
          }
        })
        .transition().delay(function(d, i) { return i * 1000; }).duration(1000)
        .attrTween('d', function(d) {
           var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t) {
              d.endAngle = i(t);
              return arc(d);
            }
          });


    g.append("text")
        .attr("transform", function(d) { var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            h = Math.sqrt(x*x + y*y);
        return "translate(" + (x/h * 120) +  ',' +
           (y/h * 120) +  ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", function(d){ return (d.endAngle + d.startAngle)/2 > Math.PI ?
            "end" : "start";})
        .style("font-family", "sans-serif")
        .style("font-size", "12px") 
        .style("fill","black")
        .text(function(d) { 
          console.log(5*Math.PI/180)
          if(d.endAngle - d.startAngle< 4*Math.PI/90) { return ""; }
          return d.data["2015Expenditures"]});

  //prepare tooltips
  var tooltip_pie = d3.select("body").select("#pie").append("div")
      .attr("class", "tooltip_pie");

    svg.selectAll(".arc").on("mouseover", function(d) { 
      console.log("mouseOVER!")
          tooltip_pie.style("visibility","visible")
               .transition()
               .duration(200)
               .style("opacity", .9);
          tooltip_pie.html(function(){
            return d.data["2015Expenditures"] + " " + currencyFormat(parseInt(d.value * budget15));
            })
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
          tooltip_pie.transition()
               .duration(500)
               .style("opacity", 0);
      });
  });
}