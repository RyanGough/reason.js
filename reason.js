var list = require("./list.js");

/*
 * fresh variables
 */

var reason_script_fresh_counter = 0;
function fresh(){
    return Symbol((reason_script_fresh_counter++).toString());
};

/* 
 * substitution
 */

function newSub(){
    return {
        assoc: {},
        lookup: function(variable){
            if (!isLogicVar(variable)){
                return variable;
            }
            if (!this.assoc.hasOwnProperty(variable)){
                return variable;
            }
            var res = this.assoc[variable];
            if (isLogicVar(res)){
                return this.lookup(res);
            } else {
                return res;
            }
        },
        extend: function(variable, value){
            var extendedSub = newSub();
            Object.assign(extendedSub.assoc, this.assoc);
            extendedSub.assoc[variable] = value;
            return extendedSub;
        },
        reify: function(variable){
            var lookup = this.lookup(x);
            if (list.isList(lookup)){
                return "(" + this.reify(lookup.head) + ", " + this.reify(lookup.tail) + ")";
            }
            if (lookup === null){
                return "null";
            }
            return lookup.toString();
        }

    }
};


function isLogicVar(variable){
    return typeof variable === 'symbol';
}

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
    if (list.isList(xLookup) && list.isList(yLookup)){
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
    return unify(list.cons(h, t), p, s);
}

function pairo(p, s){
    return conso(fresh(), fresh(), p, s);
}

function heado(l, x, s){
    var headoFresh = fresh();
    var headoList = list.cons(x, headoFresh);
    return unify(headoList, l, s);
}

function tailo(l, x, s){
    var tailoFresh = fresh();
    var tailoList = list.cons(tailoFresh, x);
    return unify(tailoList, l, s);
}


/*
 * goals that can return multiple values
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
 * export the module interface
 */

module.exports = {
    newSub: newSub,
    fresh: fresh,
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
