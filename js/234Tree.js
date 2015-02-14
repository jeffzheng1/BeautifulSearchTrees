// Probably want to use rectangles for 234 trees
var currentTree = [];
var previousTree = [];
var insertHistory = [];
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

function pushSortKey(key, node) { 
    node.key.push(key);
    node.key.sort(function(a, b) {
        return a - b;
    });
}

function findSide(nodeID, children) { 
    for (var counter = 0; counter < children.length; counter++) { 
        if (children[counter] == nodeID) { 
            return counter;
        }
    }
}

function shiftRight(index, array) { 
    for (var counter = array.length; counter > index; counter--) { 
        if (counter == index + 1) { 
            array[counter] = -1;
        } else {
            array[counter] = array[counter-1];
        }
    }
}

function reorderNodes(tree) { 
    var reorderArray = [];
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

function findNextLargestKey(index, nodeID, tree) { 
    var currentNode = tree[nodeID];
    currentNode = tree[currentNode.children[index+1]];
    var key = currentNode.key[0];
    while (currentNode != null) {
        key = currentNode.key[0];
        currentNode = tree[currentNode.children[0]];
    }
    return key;
}

function replace(key, newKey, tree) { 
    var currentNode = tree[0];
    var currentKeyList = currentNode.key;
    while (currentNode != null && currentKeyList.indexOf(key) == -1) { 
        var currentKeyList = currentNode.key;
        if (currentKeyList[0] > key) {
            currentNode = tree[currentNode.children[0]];
            side = 0;
        } else if (currentKeyList[0] < key && (key < currentKeyList[1] || !currentKeyList[1])) {
            currentNode = tree[currentNode.children[1]];
            side = 1;
        } else if (currentKeyList[1] < key && (key < currentKeyList[2] || !currentKeyList[2])) { 
            currentNode = tree[currentNode.children[2]];
            side = 2;
        } else { 
            currentNode = tree[currentNode.children[3]];
            side = 3;
        }
    }
    currentKeyList[currentKeyList.indexOf(key)] = newKey;
}

function createBST(rootKey, tree, history) {
    if (history) {
        insertHistory.push(rootKey);
    }
    var node0 = {
        "nodeID": 0,
        "parent": null,
        "children": [],
        "key": [rootKey],
        "x_coor": rootX,
        "y_coor": rootY,
        "searched": 0,
        "depth": 0  
    };
    len = len + 1;
    return tree.push(node0);
};

//need to add logic for encountering full node
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
    var currentParent = -1;
    var side = 0;
    var parentNode = null;
    while (currentNode != null) {
        currentKeyList = currentNode.key;
        if (currentNode.children[0] == null && currentNode.key.length < 3) { 
            pushSortKey(key, currentNode);  
            return;
        } else if (currentNode.key.length == 3) { 
            if (currentParent == -1) { 
                var leftNode = currentNode.key.splice(0, 1)[0];
                //need to reformat all children when poped 
                var rightNode = currentNode.key.splice(1, 1)[0];
                currentParent = 0;
                if (currentNode.children.length == 0) {
                    //leftNode formatting
                    formatNode(leftNode, tree, currentParent, 0, []);
                    //rightNode formatting
                    formatNode(rightNode, tree, currentParent, 1, []);
                } else { 
                    //leftNode formatting
                    leftNodeChildren = currentNode.children.splice(0, 2);
                    rightNodeChildren = currentNode.children.splice(0, 2);
                    formatNode(leftNode, tree, currentParent, 0, leftNodeChildren);
                    //rightNode formatting
                    formatNode(rightNode, tree, currentParent, 1,  rightNodeChildren);
                }
            } else { 
                //side dependent
                parentNode = tree[currentParent];
                pushSortKey(currentNode.key.splice(1, 1)[0], parentNode);
                //need to determine which side of the node it is on
                var thisSide = findSide(currentNode.nodeID, parentNode.children);
                
                shiftRight(thisSide, parentNode.children);
                
                var rightNode = currentNode.key.splice(1, 1)[0];
                rightNodeChildren = currentNode.children.splice(2, 2);
                formatNode(rightNode, tree, currentParent, thisSide+1, rightNodeChildren);
            }
            //need to figure this out
            parentNode = tree[currentParent];
            if (key > parentNode.key[2]) { 
                currentNode = tree[parentNode.children[3]];
            } else if (key > parentNode.key[1]) { 
                currentNode = tree[parentNode.children[2]];
            } else if (key > parentNode.key[0]) { 
                currentNode = tree[parentNode.children[1]];
            }
            continue;
        }
        //add the additional logic for the 4 possible children of a 2-3-4 tree
        currentParent = currentNode.nodeID;
        if (currentKeyList[0] > key) {
            currentNode = tree[currentNode.children[0]];
            side = 0;
        } else if (currentKeyList[0] < key && (key < currentKeyList[1] || !currentKeyList[1])) {
            currentNode = tree[currentNode.children[1]];
            side = 1;
        } else if (currentKeyList[1] < key && (key < currentKeyList[2] || !currentKeyList[2])) { 
            currentNode = tree[currentNode.children[2]];
            side = 2;
        } else { 
            currentNode = tree[currentNode.children[3]];
            side = 3;
        }
    }
    //abstract this into a different function 
    formatNode(key, tree, currentParent, side, []);
};


//add the basic non-one key delete functionality; we can do this with the findNextLargestKey
function removeNode(key, tree, r) { 
    var currentNode = tree[0];
    var currentParent = -1;
    var side = 0;
    var parentNode = null;
    var thisSide = 0;
    var currentKeyList = null;
    while (currentNode != null) {
        if (currentParent == -1) { 
            parentNode = tree[0];
        } else {
            parentNode = tree[currentParent];
        }
        thisSide = findSide(currentNode.nodeID, parentNode.children);
        var otherSibiling = null;
        if (thisSide == 0) { 
            otherSibiling = tree[parentNode.children[1]];
        } else { 
            otherSibiling = tree[parentNode.children[0]];
        }
        if (currentNode.key.length == 1 && currentParent < 1 
            && tree[0].length == 1 && otherSibiling.key.length == 1) {
            var leftChild = tree.splice(tree[tree[0].children[0]].nodeID,1);
            var rightChild = tree.splice(tree[tree[0].children[1]].nodeID - 1,1);
            leftChild.children.concat(rightChild.children);
            tree[0].children = leftChild.children.slice();
            tree[0].key.unshift(leftChild.key[0]);
            tree[0].key.push(rightChild.key[0]);
            // if (tree[0].indexOf(key) != -1) {
            // var nextLargestKey = findNextLargestKey(0, tree[0].children);

        } else if (currentNode.key.length == 1 && currentParent != -1) { 
            thisSide = findSide(currentNode.nodeID, parentNode.children);
            //add logic to adjust nodeID's when a node is
            if (thisSide > 0 && tree[parentNode.children[thisSide-1]].key.length > 1) { 
                var leftSibiling = tree[parentNode.children[thisSide-1]];
                var largestKeyIndex = leftSibiling.key.length-1;
                var poped = leftSibiling.key.splice(largestKeyIndex,1)[0];
                var popedChildren = leftSibiling.children.splice(largestKeyIndex+1,1)[0];
                var parentPoped = parentNode.key.splice(thisSide-1, 1)[0];
                pushSortKey(parentPoped, currentNode);
                pushSortKey(poped, parentNode);
                currentNode.children.unshift(popedChildren);
            } else if (thisSide < findLength(parentNode.children)-1 && tree[parentNode.children[thisSide+1]].key.length > 1) { 
                var rightSibiling = tree[parentNode.children[thisSide+1]];
                var poped = rightSibiling.key.splice(0,1)[0];
                var popedChildren = rightSibiling.children.splice(0,1)[0];
                var parentPoped = parentNode.key.splice(thisSide, 1)[0];
                pushSortKey(parentPoped, currentNode);
                pushSortKey(poped, parentNode);
                currentNode.children.push(popedChildren);
            } else { 
                if (thisSide < findLength(parentNode.children)-1) {
                    var parentPoped = parentNode.key.splice(thisSide, 1)[0];
                    var rightSibiling = tree[parentNode.children[thisSide+1]];
                    var poped = rightSibiling.key.splice(0,1)[0];
                    tree.splice(rightSibiling.nodeID,1);
                    tree[rightSibiling.nodeID] == null;
                    parentNode.children.splice(thisSide+1, 1);
                    currentNode.children.concat(rightSibiling.children);
                } else { 
                    var parentPoped = parentNode.key.splice(thisSide-1, 1)[0];
                    var leftSibiling = tree[parentNode.children[thisSide-1]];
                    var poped = leftSibiling.key.splice(0,1)[0];
                    tree.splice(leftSibiling.nodeID,1);
                    parentNode.children.splice(thisSide-1, 1);
                    currentNode.children.concat(leftSibiling.children);
                }
                pushSortKey(poped, currentNode);
                pushSortKey(parentPoped, currentNode);
                len--;
                reorderNodes(tree);
            }
        } 
        currentKeyList = currentNode.key;
        if (currentKeyList.indexOf(key) != -1) { 
            if (!currentNode.children[0]) {
                var index = currentKeyList.indexOf(key);
                currentKeyList.splice(index, 1);
                return;
            } else { 
                var nextLargestKey = findNextLargestKey(currentKeyList.indexOf(key), currentNode.nodeID, tree);
                removeNode(nextLargestKey, tree, 1);
                replace(key, nextLargestKey, tree);
                return;
            }
        }
        currentParent = currentNode.nodeID;
        if (currentKeyList[0] > key) {
            currentNode = tree[currentNode.children[0]];
            side = 0;
        } else if (currentKeyList[0] < key && (key < currentKeyList[1] || !currentKeyList[1])) {
            currentNode = tree[currentNode.children[1]];
            side = 1;
        } else if (currentKeyList[1] < key && (key < currentKeyList[2] || !currentKeyList[2])) { 
            currentNode = tree[currentNode.children[2]];
            side = 2;
        } else { 
            currentNode = tree[currentNode.children[3]];
            side = 3;
        }
    }
}

function formatNode(key, tree, currentParent, side, children) { 
    var depth = tree[currentParent].depth + 1;
    if (children == null) { 
        children = [];
    }
    len++;
    var newNode = {
        "nodeID": len,
        "parent": currentParent,
        "children": children,
        "key": [key],
        "x_coor": null,
        "y_coor": null,
        "searched": 0,
        "depth": depth
    };
    tree[currentParent].children[side] = len;
    tree.push(newNode);
}