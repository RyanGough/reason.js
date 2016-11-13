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
        }
    }
};

function fresh(desc){
    return Symbol(desc);
};

function isFresh(variable){
    return typeof variable === 'symbol';
}

function isFail(stream){
    return stream.length === 0;
}

function unify(x, y, s){
    if (Array.isArray(x) && Array.isArray(y)){
        if (x.length === 0 && y.length === 0){
            return success(s);
        }
        var [xHead, ...xTail] = x;
        var [yHead, ...yTail] = y;
        var headResult = unify(xHead, yHead, s);
        if (isFail(headResult)){
            return fail();
        }
        return unify(xTail, yTail, headResult[0]);
    }
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
};

function success(s){
    return [s];
};

function fail(){
    return [];
};

module.exports = {
    newSub: newSub,
    fresh: fresh,
    unify: unify
};
