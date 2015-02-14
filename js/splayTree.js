var currentTree = [];
var previousTree = [];
var insertHistory = [];
var reorderArray = [];
var len = -1;

function findLength(array) { 
    var counter = 0;
    for (var i = 0; i < array.length; i++) { 
        if (array[i]) { 
            counter++;
        }
    }
    return counter;
}

function formatChildren(tree) { 
    for (var i = 0; i < tree.length; i++) { 
        var node = tree[i];
        for (var j = 0; j < node.children.length; j++) { 
            if (node.children[j]) {
                tree[node.children[j]].parent = i;
            }
        }
    }
}

function findSide(nodeID, children) { 
    for (var counter = 0; counter < children.length; counter++) { 
        if (children[counter] == nodeID) { 
            return counter;
        }
    }
}

function reorderNodes(tree) { 
    reorderArray = [];
    for (var counter = 0; counter < tree.length; counter++) {
        if (counter != tree[counter].nodeID) { 
            reorderArray[tree[counter].nodeID] = counter;
            tree[counter].nodeID = counter;
        }
    }
    for (var counter = 0; counter < tree.length; counter++) {
        if (tree[counter].children) {
            for (var i = 0; i < tree[counter].children.length; i++) { 
                if (reorderArray[tree[counter].children[i]]) { 
                    tree[counter].children[i] = reorderArray[tree[counter].children[i]];
                }
            }
        }
        if (reorderArray[tree[counter].parent]) { 
            tree[counter].parent = reorderArray[tree[counter].parent];
        }
    }   
}

function findNextLargestKey(nodeID, tree) { 
    var currentNode = tree[nodeID];
    currentNode = tree[currentNode.children[1]];
    var key = currentNode.key;
    while (currentNode != null) {
        key = currentNode.key;
        currentNode = tree[currentNode.children[0]];
    }
    return key;
}

//make a zig function and a zag function 
function rotateNode(nodeID, tree) { 
    var thisNode = tree[nodeID];
    var parent = tree[tree[nodeID].parent];
    var thisSide = findSide(nodeID, parent.children);
    if (parent.nodeID == 0 && nodeID != 0) { 
        tree[parent.nodeID] = thisNode;
        tree[nodeID] = parent;
        var temp = thisNode.nodeID;
        thisNode.nodeID = parent.nodeID;
        parent.nodeID = temp;
        parent.parent = thisNode.nodeID;
        if (thisSide == 1) { 
            parent.children[1] = thisNode.children[0];
            thisNode.children[0] = parent.nodeID;
            if (thisNode.children[1]) {
                tree[thisNode.children[1]].parent = thisNode.nodeID;
            }   
        } else {
            parent.children[0] = thisNode.children[1];
            thisNode.children[1] = parent.nodeID;
            if (thisNode.children[0]) {
                tree[thisNode.children[0]].parent = thisNode.nodeID;
            }
        }
        if (parent.children[1]) {
            tree[parent.children[1]].parent = parent.nodeID;
        }
        if (parent.children[0]) {
            tree[parent.children[0]].parent = parent.nodeID;
        }
    } else {
        var gParent = tree[parent.parent];
        var parentSide = findSide(parent.nodeID, gParent.children);
        if ((thisSide == 0 && parentSide == 1) || (thisSide == 1 && parentSide == 0)) { 
            tree[gParent.nodeID] = thisNode;
            tree[nodeID] = gParent;
            var temp = thisNode.nodeID;
            thisNode.nodeID = gParent.nodeID;
            gParent.nodeID = temp;
            if (gParent.parent != null) {
                thisNode.parent =  tree[gParent.parent].nodeID;
            } else { 
                thisNode.parent = null;
            }
            gParent.parent = thisNode.nodeID;
            parent.parent = thisNode.nodeID;
            if (thisSide == 1) { 
                parent.children[1] = thisNode.children[0];
                thisNode.children[0] = parent.nodeID;
                tree[thisNode.children[0]].parent = thisNode.nodeID;
                if (parent.children[1]) {
                    tree[parent.children[1]].parent = parent.nodeID;
                }
                gParent.children[0] = thisNode.children[1]; 
                thisNode.children[1] = gParent.nodeID;
            } else {
                parent.children[0] = thisNode.children[1];
                thisNode.children[1] = parent.nodeID;
                tree[thisNode.children[1]].parent = thisNode.nodeID;
                if (parent.children[0]) {
                    tree[parent.children[0]].parent = parent.nodeID;
                }
                gParent.children[1] = thisNode.children[0]; 
                thisNode.children[0] = gParent.nodeID;
            }
        } else if ((thisSide == 0 && parentSide == 0) || (thisSide == 1 && parentSide == 1)) { 
            tree[gParent.nodeID] = thisNode;
            tree[nodeID] = gParent;
            var temp = thisNode.nodeID;
            thisNode.nodeID = gParent.nodeID;
            gParent.nodeID = temp;
            if (gParent.parent != null) {
                thisNode.parent = tree[gParent.parent].nodeID;
            } else { 
                thisNode.parent = null;
            }
            gParent.parent = parent.nodeID;
            parent.parent = thisNode.nodeID;
            if (thisSide == 0) { 
                gParent.children[0] = parent.children[1];
                if (gParent.children[0]) {
                    tree[gParent.children[0]].parent = gParent.nodeID;
                }
                parent.children[1] = gParent.nodeID;
                parent.children[0] = thisNode.children[1];
                thisNode.children[1] = parent.nodeID;
                if (thisNode.children[0]) {
                    tree[thisNode.children[0]].parent = thisNode.nodeID;
                }
                if (parent.children[0]) {
                    tree[parent.children[0]].parent = parent.nodeID;
                }
            } else { 
                gParent.children[1] = parent.children[0];
                if (gParent.children[1]) {
                    tree[gParent.children[1]].parent = gParent.nodeID;
                }
                parent.children[0] = gParent.nodeID;
                parent.children[1] = thisNode.children[0];
                thisNode.children[0] = parent.nodeID;
                if (thisNode.children[1]) {
                    tree[thisNode.children[1]].parent = thisNode.nodeID;
                }
                if (parent.children[1]) {
                    tree[parent.children[1]].parent = parent.nodeID;
                }
            }
        }
    }
    return thisNode.nodeID;
}

function createBST(rootKey, tree, history) {
    if (history) {
        insertHistory.push(rootKey);
    }
    var node0 = {
        "nodeID": 0,
        "parent": null,
        "children": [],
        "key": rootKey,
        "x_coor": rootX,
        "y_coor": rootY,
        "searched": 0,
        "depth": 0  
    };
    len = len + 1;
    return tree.push(node0);
};

function addNode(key, tree, history) {
    if (history) {
        if ($.inArray(key, insertHistory) != -1) { 
            bootbox.alert(key + " is already in the tree! Please select a different number.");
            return;
        }
        insertHistory.push(key);
    }
    for (node in tree) { 
        node.searched = 0;
    }
    var currentNode = tree[0];
    var currentParent = null;
    var side = 0;
    while (currentNode != null) {
        currentKey = currentNode.key;
        if (currentKey == key) { 
            return;
        }
        if (currentKey < key) {
            currentParent = currentNode.nodeID;
            currentNode = tree[currentNode.children[1]];
            side = 1;
        } else {
            currentParent = currentNode.nodeID;
            currentNode = tree[currentNode.children[0]];
            side = 0;
        }
    }
    var depth = tree[currentParent].depth + 1;
    len++;
    var newNode = {
        "nodeID": len,
        "parent": currentParent,
        "children": [],
        "key": key,
        "x_coor": null,
        "y_coor": null,
        "searched": 0,
        "depth": depth
    };
    tree[currentParent].children[side] = len;
    tree.push(newNode);
    var nodeID = len;
    while (tree[0].key != key) {
        nodeID = rotateNode(nodeID, tree);
    }
    formatChildren(tree);
};

function removeNode(key, tree) { 
    var nextKey = null;
    for (var i = 0; i < tree.length; i++) {
        node = tree[i];
        if (node.key == key) {
            if (findLength(node.children) > 1) { 
                nextKey = findNextLargestKey(i, tree);
                removeNode(nextKey, tree);
            } else if (findLength(node.children) == 1) {
                var thisSide = findSide(i, tree[node.parent].children);
                if (node.children[0] != null) {
                    tree[node.parent].children[thisSide] = node.children[0];
                    tree[node.children[0]].parent = node.parent;
                } else { 
                    tree[node.parent].children[thisSide] = node.children[1];
                    tree[node.children[1]].parent = node.parent;
                }
                tree.splice(i, 1);
                reorderNodes(tree);
                len--;
            } else {
                var thisSide = findSide(i, tree[node.parent].children);
                tree[node.parent].children[thisSide] = null;
                tree.splice(i, 1);
                reorderNodes(tree);
                len--;
            }
            if (reorderArray[node.parent]) {
                rotateNode(reorderArray[node.parent], tree);
            } else { 
                rotateNode(node.parent, tree);
            }
            break;
        }
    }
    if (nextKey) {
        for (var i = 0; i < tree.length; i++) {
            node = tree[i];
            if (node.key == key) {
                node.key = nextKey;
            }
        }
    }
    formatChildren(tree);
}


