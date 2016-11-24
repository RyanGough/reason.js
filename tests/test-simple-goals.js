var list = require("../list.js");
var subs = require("../subs.js");
var r = require("../reason.js");
var run = require("./testrunner.js");
var assert = require("assert");

// for convenience
var emptySub = subs.emptySub;
var fresh = subs.fresh;
var x = fresh();
var y = fresh();

run([
    function nullo_unifies_fresh_var_with_empty_list(){
        var s = emptySub();
        var goal = r.nullo(x);
        var res = goal(s).next().value;
        assert.equal(res.lookup(x), list.emptyList);
    },

    function conso_unifies_a_pair_from_a_given_head_and_tail(){
        var s = emptySub();
        var goal = r.conso(x, "bar", list.pair("foo", "bar"));
        var res = goal(s).next().value;
        assert.equal(res.lookup(x), "foo");
    },

    function pairo_fails_if_not_given_a_pair(){
        var s = emptySub();
        var goal = r.pairo("foo");
        var res = goal(s).next().value;
        assert.equal(res, null);
    },

    function pairo_create_a_pair_with_a_fresh_head_and_tail(){
        var s = emptySub();
        var goal = r.pairo(x);
        var res = goal(s).next().value;
        assert.equal(typeof res.lookup(x).head, "symbol");
        assert.equal(typeof res.lookup(x).tail, "symbol");
    },

    function heado_can_grab_the_head_of_a_list(){
        var s = emptySub();
        var goal = r.heado(list.createList(["foo"]), x);
        var res = goal(s).next().value;
        assert.equal(res.lookup(x), "foo");
    },

    function heado_can_create_a_list_with_a_given_head(){
        var s = emptySub();
        var goal = r.heado(x, "foo");
        var res = goal(s).next().value;
        assert.equal(res.lookup(x).head, "foo");
        assert.equal(typeof res.lookup(x).tail, "symbol");
    },

    function tailo_can_grab_the_tail_of_a_list(){
        var s = emptySub();
        var goal = r.tailo(list.createList(["foo", "bar"]), x, s);
        var res = goal(s).next().value;
        assert.equal(res.lookup(x).head, "bar");
        assert.equal(res.lookup(x).tail, list.emptyList);
    },

    function tailo_can_create_a_list_with_a_given_tail(){
        var s = emptySub();
        var expectedTail = list.createList(["foo"]);
        var goal = r.tailo(x, expectedTail);
        var res = goal(s).next().value;
        assert.equal(typeof res.lookup(x).head, "symbol");
        assert.equal(res.lookup(x).tail, expectedTail);
    },

    function nullo_succeeds_given_empty_list(){
        var s = emptySub();
        var l = list.createList(["foo"]);
        var goal = r.nullo(l.tail);
        var res = goal(s).next().value;
        assert.equal(res, s);
    },

]);
