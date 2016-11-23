var r = require("./reason.js");
var list = require("./list.js");
var run = require("./testrunner.js");
var assert = require("assert");

// create some fresh variables for use in tests
var x = r.fresh();
var y = r.fresh();

run([
    function nullo_unifies_fresh_var_with_empty_list(){
        var s = r.emptySub();
        var res = r.nullo(x, s);
        assert.equal(res[0].lookup(x), list.emptyList);
    },

    function conso_unifies_a_pair_from_a_given_head_and_tail(){
        var s = r.emptySub();
        var res = r.conso(x, "bar", list.pair("foo", "bar"), s);
        assert.equal(res[0].lookup(x), "foo");
    },

    function pairo_fails_if_not_given_a_pair(){
        var s = r.emptySub();
        var res = r.pairo("foo", s);
        assert.equal(res.length, 0);
    },

    function pairo_create_a_pair_with_a_fresh_head_and_tail(){
        var s = r.emptySub();
        var res = r.pairo(x, s);
        assert.equal(typeof res[0].lookup(x).head, "symbol");
        assert.equal(typeof res[0].lookup(x).tail, "symbol");
    },

    function listo_succeeds_if_given_a_proper_list(){
        var s = r.emptySub();
        var goal = r.listo(list.createList([1,2,3]), s);
        var res = r.run(goal, 1);
        assert.equal(res.length, 1);
    },

    function listo_works_with_vars_in_list(){
        var s = r.emptySub();
        var goal = r.listo(list.createList([1,2,x,4]), s);
        var res = r.run(goal, 1);
        assert.equal(typeof res[0].lookup(x), "symbol");
    },

    function listo_can_return_multiple_values_when_tail_of_given_list_is_fresh(){
        var s = r.emptySub();
        var goal = r.listo(list.pair("foo", x), s);
        var res = r.run(goal, 5);
        assert(res.length > 1);
    },

    function heado_can_grab_the_head_of_a_list(){
        var s = r.emptySub();
        var res = r.heado(list.createList(["foo"]), x, s);
        assert.equal(res[0].lookup(x), "foo");
    },

    function heado_can_create_a_list_with_a_given_head(){
        var s = r.emptySub();
        var res = r.heado(x, "foo", s);
        assert.equal(res[0].lookup(x).head, "foo");
        assert.equal(typeof res[0].lookup(x).tail, "symbol");
    },

    function tailo_can_grab_the_tail_of_a_list(){
        var s = r.emptySub();
        var res = r.tailo(list.createList(["foo", "bar"]), x, s);
        assert.equal(res[0].lookup(x).head, "bar");
        assert.equal(res[0].lookup(x).tail, list.emptyList);
    },

    function tailo_can_create_a_list_with_a_given_tail(){
        var s = r.emptySub();
        var expectedTail = list.createList(["foo"]);
        var res = r.tailo(x, expectedTail, s);
        assert.equal(typeof res[0].lookup(x).head, "symbol");
        assert.equal(res[0].lookup(x).tail, expectedTail);
    },

    function nullo_succeeds_given_empty_list(){
        var s = r.emptySub();
        var l = list.createList(["foo"]);
        var res = r.nullo(l.tail, s);
        assert.equal(res[0], s);
    },

]);
