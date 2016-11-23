var list = require("./list.js");
var subs = require("./subs.js");

// for convenience
var fresh = subs.fresh;
var isLogicVar = subs.isLogicVar;

/* 
 * basic goals
 */

function success(s){
    return [s];
};

function fail(){
    return [];
};

function failed(stream){
    return stream.length === 0;
}

function succeeded(stream){
    return stream.length > 0;
}

/* 
 * unification
 */

function unify(x, y, s){
    var xLookup = s.lookup(x);
    var yLookup = s.lookup(y);
    if (xLookup === yLookup){
        return success(s);
    }
    if (isLogicVar(xLookup)){
        return success(s.extend(xLookup, yLookup));
    }
    if (isLogicVar(yLookup)){
        return success(s.extend(yLookup, xLookup));
    }
    if (list.isPair(xLookup) && list.isPair(yLookup)){
        var headResult = unify(xLookup.head, yLookup.head, s);
        if (failed(headResult)){
            return fail();
        }
        return unify(xLookup.tail, yLookup.tail, headResult[0]);
    }
    return fail();
};

/* 
 * more goals 
 */

function nullo(x, s){
    return unify(x, list.emptyList, s);
}

function conso(h, t, p, s){
    return unify(list.pair(h, t), p, s);
}

function pairo(p, s){
    return conso(fresh(), fresh(), p, s);
}

function heado(l, x, s){
    var headoFresh = fresh();
    var headoList = list.pair(x, headoFresh);
    return unify(headoList, l, s);
}

function tailo(l, x, s){
    var tailoFresh = fresh();
    var tailoList = list.pair(tailoFresh, x);
    return unify(tailoList, l, s);
}


/*
 * goals that can return multiple values
 */

function* listo(l, s){
    var nullRes = nullo(l, s);
    if (succeeded(nullRes)){
        yield nullRes;
    }
    var headRes = pairo(l, s);
    if (succeeded(headRes)){
        var tail = fresh();
        var tailRes = tailo(l, tail, headRes[0]);
        yield * listo(tail, tailRes[0]);
    }
    return fail();
}

/*
 * run a goal that is a generator
 */

function run(g, limit){
    var results = [];
    while (limit--){
        var r = g.next();
        results.push(r.value[0]);
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
