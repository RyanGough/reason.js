r = require("./reason.js");
run = require("./testrunner.js");
assert = require("assert");

// create some fresh variables for use in tests
x = r.fresh("x");
y = r.fresh("y");

run([
    function new_substitution_should_be_empty(){
        var s = r.newSub();
        assert(s.isEmpty(), "a new substitution should be empty");
    },

    function substitution_can_be_extended_with_a_new_association(){
        var s = r.newSub();
        var s1 = s.extend(x, "foo");
        assert(!s1.isEmpty(), "failed to extend substitution");
    },

    function association_can_be_retrieved_from_a_substitution(){
        var s = r.newSub();
        var s1 = s.extend(x, "foo");
        var result = s1.lookup(x);
        assert.equal(result, "foo", "failed to lookup association");
    },

    function substitution_can_be_reified(){
    function test_heado_fails_when_can_unify_head_of_list_with_var(){
        var substream = r.heado(x, [1,2,3], r.newSub());
        assert.equal(substream[0].lookup(x), 1, "heado failed with fresh var and valid list");
    }
        var s = r.newSub();
        var s1 = s.extend(x, "foo");
        var s2 = s1.extend(y, "bar");
        var reification = s2.reify();
        assert.equal(reification, "Symbol(x):foo, Symbol(y):bar", "failed to reify substitution : " + reification);
    },

    function fresh_variable_can_be_unified_with_a_value(){
        var substream = r.unify(x, "foo", r.newSub());
        assert.equal(substream[0].lookup(x), "foo", "failed to unify fresh variable with value");
    },

    function value_can_be_unified_with_fresh_variable(){
        var substream = r.unify("foo", x, r.newSub());
        assert.equal(substream[0].lookup(x), "foo", "failed to unify value with fresh variable");
    },

    function non_fresh_variable_cannot_have_its_association_changed(){
        var s = r.newSub();
        var s1 = s.extend(x, "foo");
        var substream = r.unify(x, "bar", s1);
        assert.equal(substream.length, 0, "non fresh variable cannot have its association changed");
    },

    function two_identical_values_unify_without_extending_substitution(){
        var s = r.newSub();
        var substream = r.unify("foo", "foo", s);
        assert.equal(substream[0], s, "failed to unify identical values");
    },

    function two_different_values_fail_to_unify(){
        var substream = r.unify("foo", "bar", r.newSub());
        assert.equal(substream.length, 0, "two different values should fail to unify");
    },

    function a_bound_variable_will_unify_with_its_bound_value_without_extending_substitution(){
        var s = r.newSub().extend(x, "foo");
        var substream = r.unify(x, "foo", s);
        assert.equal(substream[0], s, "a bound variable should unify with its bound value and leave substitution unchanged");
    },

    function two_empty_lists_unify_without_changing_substitution(){
        var s = r.newSub();
        var substream = r.unify([], [], s);
        assert.equal(substream[0], s, "failed to unify empty lists");
    },

    function lists_with_different_values_will_fail_to_unify(){
        var s = r.newSub();
        var substream = r.unify(["foo"], ["bar"], s);
        assert.equal(substream.length, 0, "lists with different values should fail to unify");
    },

    function lists_of_different_lengths_will_fail_to_unify(){
        var s = r.newSub();
        var substream = r.unify(["foo", "foo"], ["foo"], s);
        assert.equal(substream.length, 0, "lists of different lenghts should fail to unify");
    },

    function fresh_variables_in_lists_unify_correctly(){
        var s = r.newSub();
        var substream = r.unify([x, "bar"], ["foo", "bar"], s);
        assert.equal(substream[0].lookup(x), "foo", "failed to unfiy fresh variable in a list");
    },

    function empty_objects_should_unify_without_changing_substitution(){
        var s = r.newSub();
        var substream = r.unify({}, {}, s);
        assert.equal(substream[0], s, "failed to unify empty objects");
    },

    function identical_objects_should_unify_without_changing_substitution(){
        var s = r.newSub();
        var substream = r.unify({"foo": 1}, {"foo": 1}, s);
        assert.equal(substream[0], s, "failed to unify identical objects");
    },

    function fresh_variables_in_objects_should_unify(){
        var s = r.newSub();
        var substream = r.unify({"foo": x}, {"foo": "bar"}, s);
        assert.equal(substream[0].lookup(x), "bar", "failed to unfiy fresh variable in an object");
    },

    function test_complex_objects_should_unify(){
       var obj1 =  {
            "name": "Fred",
            "age": x,
            "hobbies": [{"foo": "bar", "baz": 7},{"a": 1, "b": ["crosswords"]}]
        };
        var obj2 = {
            "name": "Fred",
            "age": 27,
            "hobbies": [{"foo": "bar", "baz": 7},{"a": 1, "b": [y]}]
        };
        var substream = r.unify(obj1, obj2, r.newSub());
        assert.equal(substream[0].lookup(x), 27, "failed to unfiy complex objects 1");
        assert.equal(substream[0].lookup(y), "crosswords", "failed to unfiy complex objects 2");
    }
])
