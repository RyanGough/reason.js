module.exports = {
    newSub: function(){
        return {
            assoc: {},
            isEmpty: function(){
                return Object.getOwnPropertySymbols(this.assoc).length === 0;
            },
            extend: function(variable, value){
                this.assoc[variable] = value;
                return this;
            },
            lookup: function(variable){
                return this.assoc[variable];
            },
            reify: function(){
                var me = this;
                var vars = Object.getOwnPropertySymbols(this.assoc);
                return vars.reduce(function(a,i){
                    a.push(i.toString() + ":" + me.lookup(i));
                    return a;
                },[]).join(", "); 
            }
        }
    },
    fresh: function(desc){
        return Symbol(desc);
    }
};
