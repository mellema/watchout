// start slingin' some d3 here.

var width = 800,
    height = 500;

var gameArea = d3.select("body").append("svg")
    .attr("class", "gameArea")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lightblue");

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,width]),
  y: d3.scale.linear().domain([0,100]).range([0,height])
};

var dragmove = function(d) {
  d.x = d3.event.x, d.y = d3.event.y;
  d3.select(this)
    .attr("cx", d.x)//Math.max(10, Math.min(800-10, d3.event.x)))
    .attr("cy", d.y);//Math.max(10, Math.min(500-10, d3.event.y)));
};

var drag = d3.behavior.drag()
  .origin(function(d){return d;})
  .on("drag", dragmove);


var makePlayer = function(){
  var player =
  [{
    id: "p",
    x: Math.random() * 100,
    y: Math.random() * 100
  }];
  return player;
};

var renderPlayer = function(player) {
  var playerNode = gameArea.selectAll("circle.player")
    .data(player, function(d){
      return d.id;
    });

  playerNode.enter()
    .append("svg:circle")
    .attr("class", "player")
    .attr("cx", function(enemy){return axes.x(enemy.x);})
    .attr("cy", function(enemy){return axes.y(enemy.y);})
    .attr("r", 10)
    .attr("fill", "green")
    .call(drag);
};

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

function update(data){
  var move = gameArea.selectAll("circle.enemy")
    .data(data, function(d){
      return d.id;
    });

  move.transition()
      .duration(1000)
      .attr("cx", function(enemy){return axes.x(Math.random() * 100);})
      .attr("cy", function(enemy){return axes.y(Math.random() * 100);});
}

//d3.select(".player").call(drag);
var p = makePlayer();
renderPlayer(p);

var e = makeEnemies(30);
renderEnemies(e);
setInterval(function() {
  update(e);
}, 1000);

// var enemies = gameArea.selectAll("circle")
//     .data(makeEnemies(30));












