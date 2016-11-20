r = require("./reason.js");
plist = require("./plist.js");
run = require("./testrunner.js");
assert = require("assert");

// create some fresh variables for use in tests
x1 = r.fresh();
x2 = r.fresh();

run([
    function can_unify_fresh_var_with_value(){
        var s = r.newSub();
        var res = r.unify("foo", x1, s);
        assert.equal(res[0].lookup(x1), "foo");
    },

    function unification_works_regardless_of_order(){
        var s = r.newSub();
        var res = r.unify(x1,"foo", s);
        assert.equal(res[0].lookup(x1), "foo");
    },

    function unification_can_chain_variable_associations(){
        var s = r.newSub();
        var res = r.unify("foo", x1, s);
        var res2 = r.unify(x2, x1, res[0]);
        assert.equal(res2[0].lookup(x2), "foo");
    },

    function can_unify_proper_list(){
        var s = r.newSub();
        debugger;
        var res = r.unify(plist.properList([x2,"foo"]),plist.properList(["bar", x1]),s);
        assert.equal(res[0].lookup(x1), "foo");
        assert.equal(res[0].lookup(x2), "bar");
    }
])
