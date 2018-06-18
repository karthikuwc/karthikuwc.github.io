const https = require('https');

https.get('https://api.iextrading.com/1.0/stock/aapl/chart/5y?filter=date,close,open&chartLast=400', (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    // var fs = require('fs');
    // fs.writeFile("thing.json", data);
    var array_data = JSON.parse(data);
    var highest_price = 0;
    var lowest_price  = 0;

    for (var i in array_data) {
      if ((array_data[i].close < lowest_price) || (lowest_price === 0)) {lowest_price = array_data[i].close;}
      if ((array_data[i].close > highest_price) || (highest_price === 0)) {highest_price = array_data[i].close;}
      array_data[i].open = i;
    }


    var fs = require('fs');
    fs.writeFile("thing.json", JSON.stringify(array_data));


    var vis = d3.select("#graph")
    .append("svg")
    .attr("width", 500).attr("height", 500);

    

    vis.selectAll("circle.nodes")
    .data(nodes)
    .enter()
    .append("svg:circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", "3px")
    .attr("fill", "black")

    console.log(highest_price);
    console.log(lowest_price);
    console.log(JSON.stringify(array_data));
    
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});