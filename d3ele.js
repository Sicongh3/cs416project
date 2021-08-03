var scene1 = d3.select('#scene1')
var scene2 = d3.select('#scene2')
var scene3 = d3.select('#scene3')
var width = 950, height = 950, spacing=120;
var margin = { top: 10, right: 100, bottom: 50, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var makes = ["Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
"Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini",
"Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda", "McLaren Automotive", "Mercedes-Benz", "MINI", "Mitsubishi",
"Nissan", "Porsche", "Ram", "Rolls-Royce", "Roush Performance", "smart", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"];

var highway_mpgs = ["35", "33", "19", "30", "22", "41", "27", "30", "29", "25", "24", "22", "103", "96", "24", "29", "38", "122",
    "30", "39", "27", "92", "21", "28", "30", "29", "24", "24", "34", "23", "82", "33", "102", "101", "27", "21", "19", "23", "39", "27",
    "98", "30", "28", "29"];

var city_mpgs = ["25", "24", "12", "23", "13", "30", "20", "22", "21", "16", "15", "16", "121", "118", "17", "21", "30", "150", "22",
    "30", "19", "120", "14", "22", "22", "23", "17", "16", "26", "16", "85", "24", "121", "124", "21", "14", "12", "14", "32", "21", "92",
    "23", "21", "22"];

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var y=d3.scaleLinear().domain([0, 120]).range([height-spacing,0]);
var x=d3.scaleLinear().domain([10, 20, 30, 40]).range([0,width-spacing]);

scene1.append("g").attr("transform","translate(50,"+(height-810) +")").call(d3.axisLeft(y));
scene1.attr("class", "center-screen");
scene1.append('text')
    .attr('x', -500)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Mileage')

scene1.append('text')
    .attr('x', 500)
    .attr('y', 1050)
    .attr('text-anchor', 'middle')
    .text('Car Brand')


var tooltip = d3.select("body").append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
    
var filling = "#5E4FA2"


async function load1() {
    d3.csv("https://flunky.github.io/cars2017.csv").then(function (d) {
        var makeScale = d3.scaleBand()
            .range([0, width])
            .domain(d.map(function (d) { return d.Make }))

        var makeAxis = d3.axisBottom()
            .scale(makeScale)
            .ticks(5);

        scene1.append("g")
            .attr("transform", "translate(50,950)")
            .attr("class", "axis")
            .call(makeAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-30)")
            .style("text-anchor", "end");
        
        scene1.selectAll("rect")
            .data(makes)
            .enter()
            .append("rect")
            .attr("x", function (c, i) { return margin.left + (width/44)*i; })
            .attr("y", function (c, i) { return y(highway_mpgs[i])+10 ; })
            .attr("width", makeScale.bandwidth() - 10)
            .attr("height", function (c, i) { return height - y(highway_mpgs[i]); })
            .attr("fill", "#5E4FA2").on("mouseover", function (event,d) {
                d3.select(this)
                    .style("stroke", "black")
                tooltip.transition().duration(200)
                    .style('opacity', 0.9)
                    .style('left', (event.x ) + 'px')
                    .style('top', (event.y) + 'px')
                tooltip.html(d+"<br>"
                    +"highway: "+highway_mpgs[makes.indexOf(d)]+"<br>"
                    +"city: "+city_mpgs[makes.indexOf(d)])
                filling = scene1.select("rect").attr("fill")
                d3.select(this).attr("fill","orange")
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("fill",filling)
                tooltip.transition().duration(200)
                    .style('opacity', 0);
                d3.select(this)
                    .style("stroke", "none")
                
            });
    })
}
    

function change(setting) {
    if (setting === "AverageHighwayMPG") {
        scene1.selectAll("rect")
            .transition()
            .duration(1500)
            .attr("fill", "#5E4FA2")
            .attr("y", function (c, i) { return y(highway_mpgs[i]) + 10; })
            .attr("height", function (d, i) { return height - y(highway_mpgs[i]); })
    } else {
        scene1.selectAll("rect")
            .transition()
            .duration(2000)
            .attr("fill", "#66C2A5")
            .attr("y", function (c, i) { return y(city_mpgs[i]) + 10; })
            .attr("height", function (c, i) { return height - y(city_mpgs[i]); })
    }
}
var keys_cyls = ["2", "4", "6", "8", "10", "12"]
var myColor = d3.scaleOrdinal()
    .domain(keys_cyls)
    .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
        "#FFFFBF"]);

var size = 20
scene2.selectAll("legend")
    .data(keys_cyls)
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function (d, i) { return 200 + i * (size + 5) })
    .attr("width", size)
    .attr("height", size)
    .attr("stroke", "black")
    .style("fill", function (d) { return myColor(d) })

scene2.selectAll("labels")
    .data(keys_cyls)
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", function (d, i) { return 200 + i * (size + 5) + (size / 2) })
    .style("fill", function (d) { return "black" })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")


// Annotation
scene2.append('rect')
    .attr("x", 300)
    .attr("y", 200)
    .attr("width", 500)
    .attr("height", 30)
    .style("fill", 'lightgray')
scene2.append('text')
    .attr('x', 500)
    .attr('y', 390)
    .attr('text-anchor', 'middle')
    .text('Average Highway MPG')
scene2.append('text')
    .attr('x', 500)
    .attr('y', 590)
    .attr('text-anchor', 'middle')
    .text('Average City MPG')
scene2.append('text')
    .attr("x", 330)
    .attr("y", 215)
    .attr("width", 60)
    .attr("height", 20)
    .style("fill", 'black')
    .attr("font-size","15px")
    .text("Fewer engineer cylinders are largely correlated with better mileage.")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")


async function load2() {
    d3.csv("https://flunky.github.io/cars2017.csv").then(function (d) {
        scene2.append("g").selectAll("circle")
            .data(d)
            .enter()
            .append("circle")
            .attr("class", function (d) { return "datapt " + "a" + d.EngineCylinders })
            .attr("cx", function (d) { return d.AverageHighwayMPG * 20})
            .attr("cy", function (d) { return 300 })
            .attr("r", "7")
            .attr("fill", function (d) { return myColor(d.EngineCylinders); })
            .on("mouseover", function (event,d) {
                tooltip.transition().duration(200)
                    .style('opacity', 0.9)
                    .style('left', (event.x ) + 'px')
                    .style('top', (event.y) +height*2+ 'px')
                tooltip.html(d.Make+"<br>"+d.AverageHighwayMPG)
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
            scene2.append("g").selectAll("circle")
                .data(d)
                .enter()
                .append("circle")
                .attr("class", function (d) { return "datapt " + "a" + d.EngineCylinders })
                .attr("cx", function (d) { return d.AverageCityMPG * 20  +100})
                .attr("cy", function (d) { return 500 })
                .attr("r", "7")
                .attr("fill", function (d) { return myColor(d.EngineCylinders); })
                .on("mouseover", function (event,d) {
                    tooltip.transition().duration(200)
                        .style('opacity', 0.9)
                        .style('left', (event.x ) + 'px')
                        .style('top', '2500px')
                    tooltip.html(d.Make+"<br>"+d.AverageCityMPG)
            })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            });
    })
}

var keys_fuel = ["Diesel", "Gasoline", "Electricity"]
var colorkeys = d3.scaleOrdinal().domain(keys_fuel).range(["red", "#21908dff", "#fde725ff"])
scene3.selectAll("legend")
    .data(keys_fuel)
    .enter()
    .append("circle")
    .attr("cx", 50)
    .attr("cy", function (d, i) { return 50+ i*30  })
    .attr("width", size)
    .attr("height", size)
    .attr("r", 10)
    .attr("stroke", "black")
    .style("fill", function (d) { return colorkeys(d) })
scene3.selectAll("labels")
    .data(keys_fuel)
    .enter()
    .append("text")
    .attr("x", 50 + size * 1.2)
    .attr("y", function (d, i) { return 50+ i*30 })
    .style("fill", function (d) { return "black" })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

var xaxis = d3.scaleLinear()
    .domain([10, 120]).range([0,width-spacing]);
var yaxis = d3.scaleLinear()
    .domain([2,12]).range([height-4*spacing,0]);
scene3.append("g")
    .attr("transform", "translate(150," + (width-350) + ")")
    .call(d3.axisBottom(xaxis));
scene3.append("g")
    .attr("transform","translate(150,"+(height-900) +")")
    .call(d3.axisLeft(yaxis));

scene3.append('text')
    .attr('x', -250)
    .attr('y', 125)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Cylinder Number')

scene3.append('text')
    .attr('x', 500)
    .attr('y', 550)
    .attr('text-anchor', 'middle')
    .text('Highway MPG')

const highlight = function(event,d){

    selected_specie = d.Fuel

    d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .style("opacity", 0.4)
        .attr("r", 3)

    d3.selectAll("." + selected_specie)
        .transition()
        .duration(200)
        .style("fill", colorkeys(selected_specie))
        .style("opacity", 1)
        .attr("r", 7)
    tooltip.transition().duration(200)
        .style('opacity', 0.9)
        .style('left', (event.x ) + 'px')
        .style('top', '2800px')
    tooltip.html(d.Make+"<br>"
        +"MPG Highway: "+d.AverageHighwayMPG
        +"<br>"+"Number of engin cylinders: "+d.EngineCylinders)
}

    // Highlight the specie that is hovered
const doNotHighlight = function(event,d){
    d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", d => colorkeys(d.Fuel))
        .style("opacity", 0.4)
        .attr("r", 4 )
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}
async function load3(){
    d3.csv("https://flunky.github.io/cars2017.csv").then(function (data) {
        scene3
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) { return "dot " + d.Fuel } )
            .attr("cx", function (d) { return 150+((width-spacing)/110)*(d.AverageHighwayMPG-10); } )
            .attr("cy", function (d) { return height-4*spacing-150-((height-4*spacing)/10)*(d.EngineCylinders-2); } )
            .attr("r", 4)
            .style("opacity", 0.4)
            .style("fill", function (d) { return colorkeys(d.Fuel) } )
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight )

    })
        

}