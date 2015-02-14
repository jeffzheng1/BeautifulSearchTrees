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

function createBST(rootKey, tree) {
    insertHistory.push(rootKey);
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
    
function searchNode(rootKey) {
    for (node in tree) { 
        node.searched = 0;
    }
    return search_recur(rootKey, tree[0]);
};

function search_recur(rootKey, node) {
    if (node == null || node.key == rootKey){
        if (node) { 
            node.searched = 1;
        }
        return node
    } else if (rootKey < node.key){
        return search_recur(rootKey, currentTree[node.children[0]]);
    } else {
        return search_recur(rootKey, currentTree[node.children[1]]);
    }
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
    formatChildren(tree);
};

function removeNode(key, tree){
    var nextKey = null;
    for (var i = 0; i < tree.length; i++) {
        node = tree[i];
        if (node.key == key) {
            if (findLength(node.children) > 1) { 
                nextKey = findNextLargestKey(i, tree);
                removeNode(nextKey, tree);
            } else if (findLength(node.children)  == 1) {
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
};