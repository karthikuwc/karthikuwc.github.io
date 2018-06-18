const https = require('https');

function stock_data(ticker) {
https.get('https://api.iextrading.com/1.0/stock/${ticker}/chart/5y?filter=date,close,open&chartLast=400', (resp) => {
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

    console.log(highest_price);
    console.log(lowest_price);
    
    return array_data;
    
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
}


 var vis = d3.select("#graph")
    .append("svg")
    .attr("width", 500).attr("height", 500);

    var nodes = stock_data("appl");

    vis.selectAll("circle.nodes")
    .data(array_data)
    .enter()
    .append("svg:circle")
    .attr("cx", function(d) { return d.open; })
    .attr("cy", function(d) { return d.close; })
    .attr("r", "3px")
    .attr("fill", "black");