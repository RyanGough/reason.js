r = require("./reason.js");
run = require("./testrunner.js");
assert = require("assert");

// create some fresh variables for use in tests
x = r.fresh("x");
y = r.fresh("y");

run([
    function test_heado_unifies_fresh_var_with_head_of_list(){
        var s = r.newSub();
        var substream = r.heado(x, [1, 2, 3], s);
        assert.equal(substream[0].lookup(x), 1, "heado failed to unify head of list with fresh var");
    },

    function test_heado_unifies_matching_value_with_head_of_list(){
        var s = r.newSub();
        var substream = r.heado(1, [1, 2, 3], s);
        assert.equal(substream[0], s, "heado failed to unify head of list with matching value");
    },

    function test_heado_fails_to_unify_fresh_var_with_empty_list(){
        var s = r.newSub();
        var substream = r.heado(1, [], s);
        assert.equal(substream.length, 0, "heado unified with empty list");
    },

    function test_heado_fails_to_non_matching_var_with_head_of_list(){
        var s = r.newSub();
        var substream = r.heado(1, [2], s);
        assert.equal(substream.length, 0, "heado unified with empty list");
    },

    function test_tailo_unfies_fresh_var_with_tail_of_list(){
        var s = r.newSub();
        var substream = r.tailo(x, [1, 2, 3], s);
        assert.equal(substream[0].lookup(x)[0], 2, "heado failed to unify tail of list with fresh var 1");
        assert.equal(substream[0].lookup(x)[1], 3, "heado failed to unify tail of list with fresh var 2");
    },

    function test_tailo_unfies_matching_value_with_tail_of_list(){
        var s = r.newSub();
        var substream = r.tailo([2,3], [1, 2, 3], s);
        assert.equal(substream[0], s, "heado failed to unify tail of list with matching value");
    },

    function test_nullo_unifies_fresh_var_with_empty_list(){
        var s = r.newSub();
        var substream = r.nullo(x, s);
        assert.equal(substream[0].lookup(x).length, 0, "nullo failed to unify fresh var with empty list");
    },

    function test_nullo_unifies_empty_list_with_empty_list(){
        var s = r.newSub();
        var substream = r.nullo([], s);
        assert.equal(substream[0], s, "nullo failed to unify empty list with empty list");
    },

    function test_nullo_fails_to_unify_non_empty_list_with_empty_list(){
        var s = r.newSub();
        var substream = r.nullo([1], s);
        assert.equal(substream.length, 0, "nullo unifed non empty list with empty list");
    },

    function test_membero_unfies_fresh_var_with_both_members_of_a_list(){
        var s = r.newSub();
        var substream = r.membero(x, ["foo", "bar"], s);
        assert.equal(substream[0].lookup(x), "foo", "membero failed to unify fresh var with first memeber");
        assert.equal(substream[1].lookup(x), "bar", "membero failed to unify fresh var with second member");
    },

    //function test_wibble(){
    //    var s = r.newSub();
    //    var substream = r.membero("foo", x, s);
    //    debugger;
    //    assert.equal(substream.length, 1);
    //}

])
