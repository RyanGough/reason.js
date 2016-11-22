const emptyList = {head: null, tail: null};

function cons(a,b){
    return {
        head: a,
        tail: b
    };
}

function createList(list){
    var [head,...tail] = list;
    if (tail.length === 0){
        return cons(head, emptyList);
    }
    return cons(head, createList(tail));
}

function isList(list){
    if (!list){
        return false;
    }
    return list.hasOwnProperty("head") && list.hasOwnProperty("tail");
}

function listItems(list, items){
    if (list === emptyList){
        items.push("()");
        return items;
    }
    items.push(list.head.toString());
    if (!isList(list.tail)){
        items.push(list.tail.toString());
        return items;
    }
    return listItems(list.tail, items);
}

function toString(list){
    return "(" + listItems(list, []).join(", ") + ")";
}

module.exports = {
    createList: createList,
    cons: cons,
    isList: isList,
    toString: toString,
    emptyList: emptyList
}
