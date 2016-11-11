r = require("./reason.js");
run = require("./runtests.js");
assert = require("assert");

run([

    function a_new_substitution_should_be_empty(){
        var s = r.newSub();
        assert(s.isEmpty(), "a new substitution should be empty");
    },

    function a_substitution_can_be_extended_with_a_new_association(){
        var s = r.newSub();
        s.extend(r.fresh("x"), "foo");
        assert(!s.isEmpty(), "failed to extend substitution");
    },

    function a_variables_association_can_be_retrieved_from_a_substitution(){
        var s = r.newSub();
        var x = r.fresh("x");
        s.extend(x, "foo");
        var result = s.lookup(x);
        assert.equal(result, "foo", "failed to lookup association");
    },

    function a_substitution_can_be_reified(){
        var s = r.newSub();
        var x = r.fresh("x");
        var y = r.fresh("y");
        s.extend(x, "foo");
        s.extend(y, "bar");
        var reification = s.reify();
        assert.equal(reification, "Symbol(x):foo, Symbol(y):bar", "failed to reify substitution : " + reification);
    },
])
