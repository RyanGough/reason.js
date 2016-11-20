var plist = require("./plist.js");

/* 
 * substitutions and logic variables
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
            var subE = newSub();
            Object.assign(subE.assoc, this.assoc);
            subE.assoc[variable] = value;
            return subE;
        },
    }
};

function fresh(){
    return Symbol();
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
    if (plist.isProper(xLookup) && plist.isProper(yLookup)){
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
    return unify(x, plist.emptyList, s);
}

function conso(h, t, p, s){
    return unify(plist.cons(h, t), p, s);
}

function pairo(p, s){
    return conso(r.fresh(), r.fresh(), p, s);
}

function heado(l, x, s){
    var headoFresh = fresh();
    var headoList = plist.cons(x, headoFresh);
    return unify(headoList, l, s);
}

function tailo(l, x, s){
    var tailoFresh = fresh();
    var tailoList = plist.cons(tailoFresh, x);
    return unify(tailoList, l, s);
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
