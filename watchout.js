// start slingin' some d3 here.

var width = 500,
    height = 800;

var gameArea = d3.select("body").append("svg")
    .attr("class", "gameArea")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lightblue");

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,width]),
  y: d3.scale.linear().domain([0,100]).range([0,height])
};

var enemy = d3.select(".gameArea")
    .append("svg:circle")
    .attr("cx", 300)
    .attr("cy", 300)
    .attr("r", 10)
    .attr("fill", "black");

var player = d3.select(".gameArea")
    .append("svg:circle")
    .attr("cx", 200)
    .attr("cy", 200)
    .attr("r", 10)
    .attr("fill", "green");

var makeEnemies = function(count){
  var enemies = [];
  for (var x=0; x<count; x++) {
    enemies.push({
      id: x,
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  return enemies;
};

var renderEnemies = function(enemyData) {
  var enemies = gameArea.selectAll("circle.enemy")
    .data(enemyData, function(d){
      return d.id;
    });

  enemies.enter()
    .append("svg:circle")
    .attr("class", "enemy")
    .attr("cx", function(enemy){return axes.x(enemy.x);})
    .attr("cy", function(enemy){return axes.y(enemy.y);})
    .attr("r", 10)
    .attr("fill", "black");
};

renderEnemies(makeEnemies(30));
// var enemies = gameArea.selectAll("circle")
//     .data(makeEnemies(30));


