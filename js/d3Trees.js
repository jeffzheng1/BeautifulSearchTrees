var xScale; //scale for xAxis
var yScale; //scale for yAxis
var w = 1000; //width of canvas
var h = 700; //height of canvas
var padding = 20; //padding to avoid elements in canvas being cut off
var addButton = document.getElementById("addButton");
var deleteButton = document.getElementById("deleteButton");
var searchButton = document.getElementById("searchButton");

//Create SVG element
var svg = d3.select("#canvas")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

//appends lines for parent and child
var drawTreeLines = function () {
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
};

var createVisual = function () {
	$(".viewport").scrollLeft(150);
	svg.selectAll("line").remove(); //remove old parent-child lines

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
	   			return d.key + " : " + d.val;
	   		})
			.transition().delay(1000).duration(500).style("opacity", 1)
	   		.attr("x", function(d) {
	   			var str = d.key + " : " + d.val;
	   			var length = str.length;
	   			return d.x_coor - length*2.5;
	   		})
	   		.attr("y", function(d) {
	   			return d.y_coor+3.5;
	   		})
	   		.attr("font-weight", "bold")
	   		.attr("font-family", "sans-serif")
	   		.attr("font-size", "12px")
	   		.attr("fill", "black");
	labels.exit().transition().duration(500).style("opacity", 0).remove(); //removes labels with no data binded
	drawTreeLines();
};