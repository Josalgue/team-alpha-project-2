function bar_chart(kind_of_chart, type_of_feature) {

let svgArea = d3.select("body").select("svg");

if (!svgArea.empty()) {
    svgArea.remove();
}

var svgHeight = 0;
var svgWidth = 0;

if (window.innerWidth < 1000){
  svgWidth = window.innerWidth*.8;
}else if (window.innerWidth > 1000){
  svgWidth = 800
}

if (window.innerHeight < 500){
    svgHeight/3;
}else{
    svgHeight = 400;
}

//SVG sizes and margins
let margin = {
    top: 50,
    right: 20,
    bottom: 20,
    left: 70,
}

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

//Create SVG element
let svg = d3.select("#bar_chart")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)


// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



    d3.json("static/data/countries_comparison.json").then(data =>{

      max_value = d3.max([d3.max(data, d => d.danceability), d3.max(data, d => d.energy), d3.max(data, d => d.valence)])

      var data = data.filter(d => d.type_of_info === kind_of_chart)

      // THIS IS FOR ADDING COLOR TO EACH BAR:

      let color_list = []

      for (let i=0, n=data.length; i<n; i++){ 

         let color = d3.schemeDark2[i]
        //  let color = d3.schemeTableau10[i]
        color_list.push(color)
      }

      function select_color(x){
        let color = color_list[x]
        return color
      }


  // Cast the hours value to a number for each piece of tvData
  data.forEach(function(d) {
    d.danceability = +d.danceability;
    d.energy = +d.energy;
    d.valence = +d.valence;
  });


  // Create a linear scale for the bottom axis.
  var xLinearScale = d3.scaleLinear()
    .domain([0, max_value*1.1])
    // .domain([0, d3.max(data, d => d[`${type_of_feature}`])])
    .range([0, width])  


    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes

    var bottomAxis = d3.axisBottom(xLinearScale);
    

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


  // Configure a band scale for the vertical axis with a padding of 0.1 (10%)
  var yBandScale = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.countries))
    .padding(0.45);

    var leftAxis = d3.axisLeft(yBandScale);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  bar_graph = chartGroup.selectAll("#bar_chart")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xLinearScale(0))
    .attr("y", d => yBandScale(d.countries))
    .attr("width", d => xLinearScale(d[`${type_of_feature}`]))
    .transition()
    .duration(1200)
    .attr("height", yBandScale.bandwidth())
    .style("fill", (d,i) => select_color(i))
    // .on('mouseover', function(d) {
    //     d3.select(this)
    //     .style("fill", "blue")
    // })
    // .on('mouseout', function(d) {
    //     d3.select(this)
    //     .style("fill", "orange")
    // })

}).catch(function(error) {
  console.log(error);
});

}

var kind_of_chart = "cons"
var type_of_feature = "danceability"

bar_chart(kind_of_chart, type_of_feature)

d3.select(".select_chart").on("change",function(){
  kind_of_chart = d3.select(this).property("value")
  bar_chart(kind_of_chart, type_of_feature)
  })

d3.select(".select_feature").on("change",function(){
  type_of_feature = d3.select(this).property("value")
  bar_chart(kind_of_chart, type_of_feature)
  })

function makeResponsive() {
  bar_chart(kind_of_chart, type_of_feature)
}


d3.select(window).on("resize", makeResponsive);

    
