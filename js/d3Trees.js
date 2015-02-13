var xScale; //scale for xAxis
var yScale; //scale for yAxis
var w = 1000; //width of canvas
var h = 700; //height of canvas
var rootX = w / 2;
var rootY = 50;
var radius = 25;
var padding = 20; //padding to avoid elements in canvas being cut off
var addButton = document.getElementById("addButton");
var deleteButton = document.getElementById("deleteButton");
var searchButton = document.getElementById("searchButton");
var resetButton = document.getElementById("reset");
var heightIncrement = 65; //height between nodes of two different depths
var runAgain = false;

//Create SVG element
var mainSvg = d3.select("#canvas")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

var compareSvg = d3.select("#previous")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

function resetCoodinates(tree) { 
  for (var i = 0; i < tree.length; i++) { 
    var node = tree[i];
    node.x_coor = null;
    node.y_coor = null;
  }
}

function addManyNodes(keys, tree, history) { 
  var string = "";
  for (var counter = 0; counter < keys.length; counter++) { 
      if (keys[counter] == ",") { 
          if (len == -1) { 
              createBST(parseInt(string), tree, history);
          } else { 
              addNode(parseInt(string), tree, history);
          }
          string = "";
          continue;
      }
      string += keys[counter];
  }
}

//function that detects collisions by using quadtress, 
//a two-dimensional recursive spatial subdivision
function collide(node) {
  var r = node.radius + 100;
  var nx1 = node.x - r;
  var nx2 = node.x + r;
  var ny1 = node.y - r;
  var ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x;
      var y = node.y - quad.point.y;
      var l = Math.sqrt(x * x + y * y);
      r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

function reassignChildren(nodeID, tree) { 
  node = findNode(nodeID);
  numChildren = node.children.length;
  for (var j = 0; j < numChildren; j++) {
    var child = tree[node.children[j]];
    var baseX = node.x_coor - numChildren * 12.5;
    if (child) {
      child.x_coor = baseX + j * 50;
      child.y_coor = node.y_coor + heightIncrement;
    }
  }  
}

//appends lines for parent and child
var drawTreeLines = function (tree, svg) {
  for (var i = 0; i < tree.length; i++) {
    var x1 = tree[i]["x_coor"];
    var y1 = tree[i]["y_coor"];
    var a = [x1, y1];
    for (var j = 0; j < tree[i].children.length; j++) {
      var child = tree[tree[i].children[j]];
      if (child) {
        var x2 = child["x_coor"];
        var y2 = child["y_coor"];
        var b = [x2, y2];
        var c = [x2, y2, 25];
          var intersect1 = getIntersections(a, b, c);
          x2prime = intersect1.points.intersection1.coords[0];
          y2prime = intersect1.points.intersection1.coords[1];
          c = [x1, y1, 25];
          var intersect2 = getIntersections(a, b, c);
          x1prime = intersect2.points.intersection2.coords[0];
          y1prime = intersect2.points.intersection2.coords[1];
          svg.append("line")
            .style("opacity", 0)
            .attr("x1", x1prime)
            .attr("y1", y1prime)
            .attr("x2", x2prime)
            .attr("y2", y2prime)
            .attr("stroke-width", .75)
            .attr("stroke", "black")
            .transition().duration(500)
            .style("opacity", 1);
      }
    }
  }
}

 function findNode(nodeID, tree) { 
  for (var i = 0; i < tree.length; i++) {
    if (tree[i].nodeID == nodeID) { 
      return tree[i];
    }
  }
}

function assignCoordinates(tree, svg) { 
  runAgain = false;
  for (var i = 0; i < tree.length; i++) {
    if (i == 0) { 
      tree[i].x_coor = w/2;
      tree[i].y_coor = 30;
    } 
    node = findNode(i, tree);
    if (node) {
      numChildren = node.children.length;
      for (var j = 0; j < numChildren; j++) {
        var child = tree[node.children[j]];
        if (baseX < 0) { 
          w = w*1.25;
          h = h*1.1;
          heightIncrement += 10;
          svg.attr("width", w)
             .attr("height", h);
          return assignCoordinates(tree);
        }
        var modifier = 1;
        if (numChildren == 2) { 
          modifier = 1.24;
        } if (numChildren == 4) { 
          modifier = .85;
          if (j==2) { 
            modifier += .06
          } else if (j==3) { 
            modifier += .04
          }
        }
        //change the depth element
        if (node.x_coor == null) { 
          runAgain = true;
          continue;
        }
        var baseX = node.x_coor - numChildren * 25 * (tree.length*.4);
        if (child) {
          child.x_coor = baseX + j * 75 * modifier * (tree.length*.4);
          if (child.x_coor > w) { 
            w = w*1.25;
            svg.attr("width", w)
            return assignCoordinates(tree);
          }
          child.y_coor = node.y_coor + heightIncrement;
        }
      }  
    }
  }
}

var createVisual = function (svg, tree) {
  resetCoodinates(tree);
  assignCoordinates(tree, svg);
  while (runAgain) {
    assignCoordinates(tree, svg);
  }
  $("#canvas").scrollLeft(w*.15);
  $("#previous").scrollLeft(w*.15);
  svg.selectAll("line").remove(); //remove old parent-child lines

  var reAssign = []
  nodes = d3.range(tree.length).map(function() { return {radius: radius}; })
  var i = 0;
  var n = nodes.length;
  while (i < n) { 
    nodes[i].x = tree[i].x_coor;
    nodes[i].y = tree[i].y_coor;
    i++;
  }
  //Collision detection to prevent nodes from overlapping
  //using quadtrees in d3
  var q = d3.geom.quadtree(nodes);
  var n = nodes.length;
  for (i in _.range(10)) { 
    var i = 0;
    while (++i < n) q.visit(collide(nodes[i]));
  }
  var i = 0;
  while (i < n) {
    if (tree[i].x_coor != nodes[i].x) { 
      reAssign.unshift(tree[i].nodeID);
    }
    tree[i].x_coor = nodes[i].x;
    tree[i].y_coor = nodes[i].y; 
    i++;
  }
  for (nodeID in reAssign) { 
    reassignChildren(reAssign[nodeID], tree);
  }

  //ANIMATES EACH NODE IN TREE
  //each circle represents a node in the tree
  color = d3.scale.category10();
  var circles = svg.selectAll("circle").data(tree, function(d) { return d.nodeID; } ); //binds data to circle element in svg canvas
  circles.transition().delay(500).duration(500).style("opacity", 1)
        .attr("cx", function(d) { //animates existing circles
          return d.x_coor;
        })
        .attr("cy", function(d) {
          return d.y_coor;
        });
  circles.enter().append("circle").style("opacity", 0); //adds circles that have binded data to canvas
  circles.transition().duration(500).style("opacity", .75) //animates and instantiates attributes for new circles
        .style("fill", function(d, i) { 
          if (d.searched == 1) { 
            return "purple";
          } 
          return color(i % 5)
        })  
        .attr("cx", function(d) {
          return d.x_coor;
        })
        .attr("cy", function(d) {
          return d.y_coor;
        })
        .attr("r", 25);
  circles.exit().transition().duration(500).style("opacity", 0).remove(); //removes circles with no data binded

  //ANIMATES KEY:VALUE TEXT OF EACH CIRCLE
  //each label represents key:value text
  var labels = svg.selectAll(".labels").data(tree, function(d) { return d.nodeID; } ); //binds data to element with class labels in svg canvas
  labels.transition().delay(500).duration(500).style("opacity", 1)
        .attr("x", function(d) { //animates existing labels
          return d.x_coor;
        })
        .attr("y", function(d) {
          return d.y_coor;
        });
  labels.enter().append("text").classed("labels", true).style("opacity", 0); //adds text elements that have binded data to canvas
  labels.text(function(d) { //animates and instantiates attributes for new labels
        if (typeof d.key != "object") {
          return d.key;
        } else { 
          var str = "";
          for (counter = 0; counter < d.key.length; counter++) { 
            str += d.key[counter] + "";
            if (counter < d.key.length-1) { 
              str += "    ";
            }
          }
          return str;
        }
      })
      .transition().duration(500).style("opacity", 1)
      .attr("x", function(d) {
        if (typeof d.key != "object") {
          var str = d.key + "";
          var length = str.length;
          return d.x_coor - length * 3.5;
        } else {
          var str = ""; 
          for (counter = 0; counter < d.key.length; counter++) { 
            str += d.key[counter] + "";
            if (counter < d.key.length-1) { 
              str += "    ";
            }
          }
          var length = str.length/2;
          return d.x_coor - length * 3.5;
        }
      })
      .attr("y", function(d) {
        return d.y_coor + 3.5;
      })
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "black");
  labels.exit().transition().duration(500).style("opacity", 0).remove(); //removes labels with no data binded
  drawTreeLines(tree, svg);
  $('#history').attr("data-content", insertHistory);
};

function addNodeHelper(addKey, tree, svg, history) { 
  if (addKey.indexOf(",") > -1) {
        addManyNodes(addKey+",", tree, history);
  } else {
    var numVal = parseInt(addKey);
    if (numVal != NaN) { 
      addKey = numVal;
    }
    if (len == -1) {
      createBST(addKey, tree, history);
    } else {
      addNode(addKey, tree, history);
    }
  }
  createVisual(svg, tree);
}

addButton.onclick = function(e) {
  e.preventDefault();
  var addKey = document.getElementById("addKey").value;
  addNodeHelper(addKey, currentTree, mainSvg, 1);
  var tempLen = len;
  len = -1;
  previousTree = [];
  addNodeHelper(insertHistory.slice(0, insertHistory.length-1).toString(), previousTree, compareSvg, 0);
  len = tempLen;
};

function removeNodeHelper(deleteKey, tree, svg) { 
  var numVal = parseInt(deleteKey);
  if (numVal != NaN) { 
    deleteKey = numVal;
  }
  removeNode(deleteKey, tree);
  createVisual(svg, tree);
}

deleteButton.onclick = function(e) {
  e.preventDefault();
  var deleteKey = document.getElementById("deleteKey").value;
  var numVal = parseInt(deleteKey);
  if (numVal != NaN) { 
    deleteKey = numVal;
  }
  removeNode(deleteKey, currentTree);
  createVisual(mainSvg, currentTree);
  createVisual(compareSvg, previousTree);
};

searchButton.onclick = function(e) {
  e.preventDefault();
  var searchKey = document.getElementById("searchKey").value;
  var node = searchNode(searchKey);
  if (node == null) { 
    alert(searchKey + " is not in the tree.");
  }
  createVisual(mainSvg, currentTree);
};

resetButton.onclick = function(e) {
  e.preventDefault();
  currentTree = [];
  previousTree = [];
  insertHistory = [];
  len = -1;
  createVisual(mainSvg, currentTree);
  createVisual(compareSvg, previousTree);
}
