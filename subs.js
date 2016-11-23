var list = require("./list.js");

/*
 * fresh variables
 */

var reason_script_fresh_counter = 0;
function fresh(){
    var id = (reason_script_fresh_counter++).toString();
    return Symbol(id);
};

function isLogicVar(variable){
    return typeof variable === 'symbol';
}

/* 
 * substitution
 */

function emptySub(){
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
            var extendedSub = emptySub();
            Object.assign(extendedSub.assoc, this.assoc);
            extendedSub.assoc[variable] = value;
            return extendedSub;
        },
        reify: function(variable){
            var lookup = this.lookup(x);
            if (list.isPair(lookup)){
                return "(" + this.reify(lookup.head) + ", " + this.reify(lookup.tail) + ")";
            }
            if (lookup === null){
                return "null";
            }
            return lookup.toString();
        }

    }
};


/* 
 * export the module interface
 */

module.exports = {
    isLogicVar: isLogicVar,
    emptySub: emptySub,
    fresh: fresh
}
