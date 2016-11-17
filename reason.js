/* 
 * substitutions and logic variables
 */

function newSub(){
    return {
        assoc: {},
        isEmpty: function(){
            return Object.getOwnPropertySymbols(this.assoc).length === 0;
        },
        lookup: function(variable){
            if (!this.assoc.hasOwnProperty(variable)){
                return variable;
            }
            return this.assoc[variable];
        },
        reify: function(){
            var me = this;
            var vars = Object.getOwnPropertySymbols(this.assoc);
            return vars.reduce(function(a,i){
                a.push(i.toString() + ":" + me.lookup(i));
                return a;
            },[]).join(", "); 
        },
        extend: function(variable, value){
            var subE = newSub();
            Object.assign(subE.assoc, this.assoc);
            subE.assoc[variable] = value;
            return subE;
        },
        cloneWithout: function(x){
            var clone = newSub();
            clone.assoc = this.assoc.cloneWithout(x);
            return clone;
        }
    }
};

function fresh(desc){
    return Symbol(desc);
};

function isFresh(variable){
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

function unifyArray(x, y, s){
    if (x.length === 0 && y.length === 0){
        return success(s);
    }
    var [xHead, ...xTail] = x;
    var [yHead, ...yTail] = y;
    var headResult = unify(xHead, yHead, s);
    if (failed(headResult)){
        return fail();
    }
    return unify(xTail, yTail, headResult[0]);
}

function unifyObject(x, y, s){
    var xKeys = Object.keys(x);
    var yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length){
        return fail();
    }
    if (xKeys.length === 0 && yKeys.length === 0){
        return success(s);
    }
    if (xKeys[0] !== yKeys[0]){
        return fail();
    }
    var propName = xKeys[0];
    var headResult = unify(x[propName], y[propName], s);
    if (failed(headResult)){
        return fail();
    }
    return unify(x.cloneWithout(propName), y.cloneWithout(propName), headResult[0]);
}

function unifyPrimitive(x, y, s){
    var xLookup = s.lookup(x);
    var yLookup = s.lookup(y);
    if (isFresh(xLookup)){
        return success(s.extend(xLookup, yLookup));
    }
    if (isFresh(yLookup)){
        return success(s.extend(yLookup, xLookup));
    }
    if (xLookup === yLookup){
        return success(s);
    }
    return fail();
}

function unify(x, y, s){
    if (bothArrays(x,y)){
        return unifyArray(x, y, s);
    }
    if (bothObjects(x,y)){
        return unifyObject(x, y, s);
    }
    return unifyPrimitive(x, y, s);
};

/* 
 * more goals 
 */

function heado(x, l, s){
    if (isFresh(l)){
        return unfiy(x, [l], s);
    }
    var [head, ...tail] = l;
    return unify(x, head, s);
}

function tailo(x, l, s){
    if (isFresh(l)){
        return unfiy(x, [l], s);
    }
    var [head, ...tail] = l;
    return unify(x, tail, s);
}

function nullo(x, s){
    return unify(x, [], s)
}

function membero(x, l, s){
    var nullResult = nullo(l, s);
    if (succeeded(nullResult)){
        return fail();
    }
    var headResult = heado(x, l, s);
    var remain = fresh("");
    var remainResult = tailo(remain, l, newSub());
    var tail = remainResult[0].lookup(remain);
    return headResult.concat(membero(x, tail, s.cloneWithout(x)));
}


/* 
 * export the module interface
 */

module.exports = {
    newSub: newSub,
    fresh: fresh,
    unify: unify,
    heado: heado,
    tailo: tailo,
    nullo: nullo,
    membero: membero
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

function bothArrays(x, y){
    return (Array.isArray(x) && Array.isArray(y));
}

Object.prototype.cloneWithout = function(key){
    var clone = Object.assign({}, this);
    delete clone[key];
    return clone;
}

