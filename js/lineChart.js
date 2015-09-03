function draw_line_chart(school_short,school_name,similars,dataset){
  console.log("LineCHART!")
var containerWidth = document.getElementsByClassName('LineGraph')[0].offsetWidth;
var margin = {top: 20, right: 100, bottom: 30, left: 80},
    width = 900 >= containerWidth ? (
      containerWidth
     ) : (
      900 - margin.left - margin.right ),
    height = 500 - margin.top - margin.bottom;


var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%Y"))
    .ticks(5)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left").ticks(6,"s");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.budget); });


// var dropDown = d3.select("#lineFilter").append("select")
//                   .attr("name", "school-list");


var svg = d3.select("body").select('#lineChart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//crudly drawing up the legend
svg.append("text")
   .attr("x", width-30)
   .attr("y", height-450)
   .attr("class","legend")
   .text(school_short);
svg.append("text")
   .attr("x",width-30)
   .attr("y", height-430)
   .attr("class","legend")
   .text("similar schools");
svg.append('rect')
  .attr("x",width-50)
  .attr("y",height-460)
  .attr("width",10)
  .attr("height",10)
  .style("fill", "#c1272d");
svg.append('rect')
  .attr("x",width-50)
  .attr("y",height-440)
  .attr("width",10)
  .attr("height",10)
  .style("fill", "#4879CE");


d3.csv("./js/data/yearlyBudget.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var schools = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, budget: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(schools, function(c) { return d3.min(c.values, function(v) { return v.budget; }); }),
    d3.max(schools, function(c) { return d3.max(c.values, function(v) { return v.budget; }); })
  ]);

  svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y_axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Budget (Million $)");

  var sch = svg.selectAll(".sch")
      .data(schools)
      .enter().append("g")
      .attr("class", "school");

//draw default lines
  sch.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) {
          if (d.name == school_name){
            return "#c1272d";
          }
          else if (similars.indexOf(d.name)!= -1){
          return "#4879CE";
          }
      })
      .style("stroke-width", function(d) {
        if ((d.name == school_name) || (similars.indexOf(d.name)!= -1)){
          return "3px";
        }
        else {
          return "1.5px";
        }
      })
      .style("opacity", function(d) {
        if ((d.name == school_name) || (similars.indexOf(d.name)!= -1)){
          return "1";
        }
        else {
          return "0.1";
        }
      });

//prepare tooltips
var tooltip = d3.select("body")
                .select("#lineChart")
                .append("div")
                .attr("class", "tooltip");

//formating lines
  sch.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.budget) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em");


  svg.selectAll(".line").on("mouseover", function(d) {
        tooltip.style("background-color", function() {
              if (d.name == school_name){
                return "#c1272d";
              } else if (similars.indexOf(d.name)!= -1){
              console.log("similar school found!")
              return "#4879CE";
              } else {
                return "#7e7e7e";
              }
            })
           .style("visibility","visible")
           .transition()
           .duration(200)
           .style("opacity", .9);
          tooltip.html(d["name"])
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
})
}



