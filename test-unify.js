var list = require("./list.js");
var subs = require("./subs.js");
var r = require("./reason.js");
var run = require("./testrunner.js");
var assert = require("assert");

// for convenience
var emptySub = subs.emptySub;
var fresh = subs.fresh;
var x1 = fresh();
var x2 = fresh();

run([
    function can_unify_fresh_var_with_value(){
        var s = emptySub();
        var res = r.unify("foo", x1, s);
        assert.equal(res[0].lookup(x1), "foo");
    },

    function unification_works_regardless_of_order(){
        var s = emptySub();
        var res = r.unify(x1,"foo", s);
        assert.equal(res[0].lookup(x1), "foo");
    },

    function unification_can_chain_variable_associations(){
        var s = emptySub();
        var res = r.unify("foo", x1, s);
        var res2 = r.unify(x2, x1, res[0]);
        assert.equal(res2[0].lookup(x2), "foo");
    },

    function can_unify_proper_list(){
        var s = emptySub();
        var res = r.unify(list.createList([x2,"foo"]),list.createList(["bar", x1]),s);
        assert.equal(res[0].lookup(x1), "foo");
        assert.equal(res[0].lookup(x2), "bar");
    }
])
