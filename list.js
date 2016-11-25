const emptyList = {head: null, tail: null};

function pair(a,b){
    return {
        head: a,
        tail: b
    };
}

function isPair(list){
    if (!list){
        return false;
    }
    return list.hasOwnProperty("head") && list.hasOwnProperty("tail");
}

// some helper functions to create "proper" lists from arrays and to print lists

function createList(list){
    if (list.length == 1){
        return pair(list[0], emptyList);
    }
    return pair(list[0], createList(list.slice(1)));
}

function listItems(list, items){
    if (list === emptyList){
        items.push("()");
        return items;
    }
    items.push(list.head.toString());
    if (!isPair(list.tail)){
        items.push(list.tail.toString());
        return items;
    }
    return listItems(list.tail, items);
}

function toString(list){
    return "(" + listItems(list, []).join(", ") + ")";
}

module.exports = {
    pair: pair,
    isPair: isPair,
    createList: createList,
    toString: toString,
    emptyList: emptyList
}
