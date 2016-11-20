r = require("./reason.js");
plist = require("./plist.js");
run = require("./testrunner.js");
assert = require("assert");

// create some fresh variables for use in tests
x = r.fresh();
y = r.fresh();

run([
    function nullo_unifies_fresh_var_with_empty_list(){
        var s = r.newSub();
        var res = r.nullo(x, s);
        assert.equal(res[0].lookup(x), plist.emptyList);
    },

    function conso_unifies_a_pair_from_a_given_head_and_tail(){
        var s = r.newSub();
        var res = r.conso(x, "bar", plist.cons("foo", "bar"), s);
        assert.equal(res[0].lookup(x), "foo");
    },

    function pairo_fails_if_not_given_a_pair(){
        var s = r.newSub();
        var res = r.pairo("foo", s);
        assert.equal(res.length, 0);
    },

    function pairo_create_a_pair_with_a_fresh_head_and_tail(){
        var s = r.newSub();
        var res = r.pairo(x, s);
        assert.equal(plist.toString(res[0].lookup(x)), "(Symbol(), Symbol())");
    },


    function heado_can_grab_the_head_of_a_list(){
        var s = r.newSub();
        var res = r.heado(plist.properList(["foo"]), x, s);
        assert.equal(res[0].lookup(x), "foo");
    },

    function heado_can_create_a_list_with_a_given_head(){
        var s = r.newSub();
        var res = r.heado(x, "foo", s);
        assert.equal(plist.toString(res[0].lookup(x)), "(foo, Symbol())");
    },

    function tailo_can_grab_the_tail_of_a_list(){
        var s = r.newSub();
        var res = r.tailo(plist.properList(["foo", "bar"]), x, s);
        assert.equal(res[0].lookup(x).head, "bar");
        assert.equal(res[0].lookup(x).tail, plist.emptyList);
    },

    function tailo_can_create_a_list_with_a_given_tail(){
        var s = r.newSub();
        var expectedTail = plist.properList(["foo"]);
        var res = r.tailo(x, expectedTail, s);
        assert.equal(res[0].lookup(x).head.toString(), "Symbol()");
        assert.equal(res[0].lookup(x).tail, expectedTail);
    },

    function nullo_succeeds_given_empty_list(){
        var s = r.newSub();
        var list = plist.properList(["foo"]);
        var res = r.nullo(list.tail, s);
        assert.equal(res[0], s);
    },

]);
