// start slingin' some d3 here.

var width = 800,
    height = 500;
    radius = 100;

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

var players = [];
var makePlayer = function(){
  var player =
  [{
    id: "p",
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 25
  }];
  players.push(player);
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
    .attr("r", 25)
    .attr("fill", "green")
    .call(drag);
};

var makeEnemies = function(count){
  var enemies = [];
  for (var x=0; x<count; x++) {
    enemies.push({
      id: x,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: this.radius
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
    .attr("r", 100)
    .attr("fill", "black");

};
var collisionCounter = 0;
  var checkCollision = function(enemy, collidedCallback){
    _.each(players, function(player){
      var enX = enemy.data("x")[0][0]["cx"].baseVal.value;
      var enY = enemy.data("y")[0][0]["cy"].baseVal.value;
      var radiusSum = parseFloat(enemy.attr('r')) + player[0].r;
      var xDiff = parseFloat(enX) - player[0].x;
      var yDiff = parseFloat(enY) - player[0].y;

      var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff,2));
      // TODO why are there no params???
      if( separation < radiusSum ){
        // collidedCallback();
        collisionCounter++;
        console.log(collisionCounter);
      }
    });

  };

function update(data){
  var move = gameArea.selectAll("circle.enemy")
    .data(data, function(d){
      return d.id;
    });

  move.transition()
      .duration(1000)
      .attr("cx", function(enemy){return axes.x(Math.random() * 100);})
      .attr("cy", function(enemy){return axes.y(Math.random() * 100);})
      .tween('custom', tweenWithCollisionDetection);
}
//Bostock code
// function collide(node) {
//   var r = node.r,
//       nx1 = node.x - r,
//       nx2 = node.x + r,
//       ny1 = node.y - r,
//       ny2 = node.y + r;
//   return function(quad, x1, y1, x2, y2) {
//     if (quad.point && (quad.point !== node)) {
//       var x = node.x - quad.point.x,
//           y = node.y - quad.point.y,
//           l = Math.sqrt(x * x + y * y),
//           r = node.radius + quad.point.radius;
//       if (l < r) {
//         l = (l - r) / l * .5;
//         node.x -= x *= l;
//         node.y -= y *= l;
//         quad.point.x += x;
//         quad.point.y += y;
//       }
//     }
//     if(x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1){
//       collisionCounter++;
//       console.log("Collision: " + collisionCounter);
//     }
//     return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//   };
// }

var tweenWithCollisionDetection = function(endData){
  var enemy = d3.select(this);
  var startPos = {
    x: parseFloat(enemy.attr('x')),
    y: parseFloat(enemy.attr('y'))
  };
  var endPos = {
    x: axes.x(endData.x),
    y: axes.y(endData.y)
  };
  return function(t){
    checkCollision(enemy, null);
    var enX = enemy.data("x")[0][0]["cx"].baseVal.value;
    var enY = enemy.data("y")[0][0]["cy"].baseVal.value;
    var enemyNextPos = {
      x: enX + (endPos.x - startPos.x) * t,
      y: enY + (endPos.y - startPos.y) * t
    };
    enemy.attr('x', enemyNextPos.x)
      .attr('y', enemyNextPos.y);
  };
};
//Bostock code END
var p = makePlayer();
renderPlayer(p);

var en = makeEnemies(2);

// var force = d3.layout.force()
//   .nodes(en)
//   .size([width, height]);

// force.start();

// force.on("tick", function(e){
//   var q = d3.geom.quadtree(en);
//   var i = 0;
//   var n = en.length;

//   while(++i < n){
//     q.visit(collide(en[i]));
//   }
//   gameArea.selectAll("circle")
//     .attr("cx", function(d){return d.x;})
//     .attr("cy", function(d){return d.y;});

// });

renderEnemies(en);
setInterval(function() {
  update(en);
}, 1000);

// var enemies = gameArea.selectAll("circle")
//     .data(makeEnemies(30));












