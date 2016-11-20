const emptyList = {head: null, tail: null};

function cons(a,b){
    return {
        head: a,
        tail: b
    };
}

function properList(list){
    var [head,...tail] = list;
    if (tail.length === 0){
        return cons(head, emptyList);
    }
    return cons(head, properList(tail));
}

function isProper(list){
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
    if (!isProper(list.tail)){
        items.push(list.tail.toString());
        return items;
    }
    return listItems(list.tail, items);
}

function toString(list){
    return "(" + listItems(list, []).join(", ") + ")";
}

module.exports = {
    properList: properList,
    cons: cons,
    isProper: isProper,
    toString: toString,
    emptyList: emptyList
}
