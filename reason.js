var list = require("./list.js");
var subs = require("./subs.js");

// for convenience
var fresh = subs.fresh;
var isLogicVar = subs.isLogicVar;

/* 
 * unification
 */

function _unify(x, y, s){
    var xLookup = s.lookup(x);
    var yLookup = s.lookup(y);
    if (xLookup === yLookup){
        return s;
    }
    if (isLogicVar(xLookup)){
        return s.extend(xLookup, yLookup);
    }
    if (isLogicVar(yLookup)){
        return s.extend(yLookup, xLookup);
    }
    if (list.isPair(xLookup) && list.isPair(yLookup)){
        var headResult = _unify(xLookup.head, yLookup.head, s);
        if (headResult === null){
            return null;
        }
        return _unify(xLookup.tail, yLookup.tail, headResult);
    }
    return null;
}

function unify(x, y){
    return function* (s){
        return _unify(x, y, s);
    }
};

/* 
 * more goals 
 */

function nullo(x){
    return function* (s){ 
        return _unify(x, list.emptyList, s);
    }
}

function conso(h, t, p){
    return function* (s){ 
        return _unify(list.pair(h, t), p, s);
    }
}

function pairo(p){
    return function* (s){ 
        return _unify(list.pair(fresh(), fresh()), p, s);
    }
}

function heado(l, x){
    return function* (s){ 
        var headoFresh = fresh();
        var headoList = list.pair(x, headoFresh);
        return _unify(headoList, l, s);
    }
}

function tailo(l, x){
    return function* (s){ 
        var tailoFresh = fresh();
        var tailoList = list.pair(tailoFresh, x);
        return _unify(tailoList, l, s);
    }
}


/*
 * complex goals
 */

function listo(l){
    return function* (s){
        var nullRes = nullo(l)(s).next().value;
        if (nullRes){
            yield nullRes;
        }
        var headRes = pairo(l)(s).next().value;
        if (headRes){
            var tail = fresh();
            var tailRes = (tailo(l, tail)(headRes)).next().value;
            yield * (listo(tail)(tailRes));
        }
        return null;
    }
}

function disj(goal1, goal2){
    return function* (s){
        var stream1 = goal1(s);
        var stream2 = goal2(s);
        do {
            var res1 = stream1.next().value;
            if (res1.value !== null){
                yield res1;
            }
            var res2 = stream2.next().value;
            if (res2.value !== null){
                yield res2;
            }
        } while (!res1.done || !res2.done)
        return null;
    }
}

/* 
 * export the module interface
 */

module.exports = {
    unify: unify,
    nullo: nullo,
    conso: conso,
    pairo: pairo,
    heado: heado,
    tailo: tailo,
    listo: listo,
    disj: disj
};

/* 
 * some helper functions to make our life easier
 */

function isObject(x){
    return Object.prototype.toString.call(x) == "[object Object]"
}

function bothObjects(x, y){
    return isObject(x) && isObject(y);
}

function isArray(x){
    return Array.isArray(x);
}

function bothArrays(x, y){
    return (isArray(x) && isArray(y));
}
