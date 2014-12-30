var tree = [];
var len = -1;

function createBST(rootKey, rootValue, tree) {
	var node0 = {
		"nodeID": 0,
		"parent": null,
		"children": [null, null],
		"key": rootKey,
		"val": rootValue,
		"x_coor": 500,
		"y_coor": 50,
		"searched": 0,
		"depth": 0	
	};
	len = len + 1;
	return tree.push(node0);
};
	
function searchNode(rootKey) {
	for (node in tree) { 
		node["searched"] = 0;
	}
	return search_recur(rootKey, tree[0])
};

function search_recur(rootKey, node) {
	if (node == null || node["key"] == rootKey){
		if (node) { 
			node["searched"] = 1;
		}
		return node
	} else if (rootKey < node["key"]){
		return search_recur(rootKey, tree[node["children"][0]])
	} else {
		return search_recur(rootKey, tree[node["children"][1]])
	}
};

function addNode(key, value, tree) {
	for (node in tree) { 
		node["searched"] = 0;
	}
    var currentNode = tree[0];
    var currentParent = null;
    var side = 0;
    while (currentNode != null) {
        currentKey = currentNode["key"];
        if (currentKey == key) {
            currentNode["val"] = value;
            return;
        } else if (currentKey < key) {
            currentParent = currentNode["nodeID"]
            currentNode = tree[currentNode["children"][1]];
            side = 1;
        } else {
            currentParent = currentNode["nodeID"]
            currentNode = tree[currentNode["children"][0]];
            side = 0;
        }
    }
    var depth = tree[currentParent]["depth"] + 1;
    var parentX_coor = tree[currentParent]["x_coor"];
    var parentY_coor = tree[currentParent]["y_coor"];
    var newX_coor = 0;
    var newY_coor = parentY_coor + 75;
    if (side == 0 ){
        newX_coor = parentX_coor - 300/(Math.pow(2, depth));
        console.log(depth);
        console.log(newX_coor);
    }
    else {
        newX_coor = parentX_coor + 300/(Math.pow(2, depth));
        console.log(depth);
        console.log(Math.pow(2, depth));
    }
    var newNode = {
		"nodeID": len + 1,
		"parent": currentParent,
		"children": [null, null],
		"key": key,
		"val": value,
		"x_coor": newX_coor,
		"y_coor": newY_coor,
		"searched": 0,
		"depth": depth
	};
    len = len + 1;
    tree[currentParent]["children"][side] = len;
    tree.push(newNode);
};

function updateNode(key, value) {
    var oldNode = searchNode(key);
    tree[oldNode["nodeID"]]["val"]=value;
};

function removeNode(key){
	var newTree = []
	var length = tree.length;
	len = -1;
	for (i = 0; i < length; i++) {
		node = tree[i];
		if (node["key"] != key) {
			if (len == -1) {
				createBST(node["key"], node["val"], newTree);
			}
			else {
				addNode(node["key"], node["val"], newTree);
			}
		}
	}
	tree = newTree
};

//ADD ALL EVENT LISTENERS FOR EACH BUTTON
addButton.onclick = function(e) {
	e.preventDefault();
	var addKey = document.getElementById("addKey").value;
	var addVal = document.getElementById("addVal").value;
	if (len == -1) {
		createBST(addKey, addVal, tree);
	}
	else {
		addNode(addKey, addVal, tree);
	}
	createVisual();
};
deleteButton.onclick = function(e) {
	e.preventDefault();
	var deleteKey = document.getElementById("deleteKey").value;
	removeNode(deleteKey);
	createVisual();
};
searchButton.onclick = function(e) {
	e.preventDefault();
	var searchKey = document.getElementById("searchKey").value;
	var node = searchNode(searchKey);
	if (node == null) { 
		alert(searchKey + " is not in the tree.");
	}
	createVisual();
};
