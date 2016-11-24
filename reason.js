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

function* unify(x, y, s){
    return _unify(x, y, s);
};

/* 
 * more goals 
 */

function* nullo(x, s){
    return _unify(x, list.emptyList, s);
}

function* conso(h, t, p, s){
    return _unify(list.pair(h, t), p, s);
}

function* pairo(p, s){
    return _unify(list.pair(fresh(), fresh()), p, s);
}

function* heado(l, x, s){
    var headoFresh = fresh();
    var headoList = list.pair(x, headoFresh);
    return _unify(headoList, l, s);
}

function* tailo(l, x, s){
    var tailoFresh = fresh();
    var tailoList = list.pair(tailoFresh, x);
    return _unify(tailoList, l, s);
}


/*
 * complex goals
 */

function* listo(l, s){
    var nullRes = nullo(l, s).next().value;
    if (nullRes){
        yield nullRes;
    }
    var headRes = pairo(l, s).next().value;
    if (headRes){
        var tail = fresh();
        var tailRes = tailo(l, tail, headRes).next().value;
        yield * listo(tail, tailRes);
    }
    return null;
}

function* disj(goal1, goal2){
    yield goal1.next().value;
    yield goal2.next().value;
    disj(goal1, goal2);
}

/*
 * run a goal that is a generator
 */

function run(g, limit){
    var results = [];
    while (limit--){
        var r = g.next();
        results.push(r.value);
        if (r.done){
            break;
        }
    }
    return results;
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
    disj: disj,
    run: run
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
