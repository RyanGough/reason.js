var list = require("./list.js");
var subs = require("./subs.js");
var r = require("./reason.js");
var run = require("./testrunner.js");
var assert = require("assert");

// for convenience
var emptySub = subs.emptySub;
var fresh = subs.fresh;
var x = fresh();
var y = fresh();

run([

    function listo_succeeds_if_given_a_proper_list(){
        var s = emptySub();
        var goal = r.listo(list.createList([1,2,3]), s);
        var res = r.run(goal, 1);
        assert.equal(res.length, 1);
    },

    function listo_works_with_vars_in_list(){
        var s = emptySub();
        var goal = r.listo(list.createList([1,2,x,4]), s);
        var res = r.run(goal, 1);
        assert.equal(typeof res[0].lookup(x), "symbol");
    },

    function listo_can_return_multiple_values_when_tail_of_given_list_is_fresh(){
        var s = emptySub();
        var goal = r.listo(list.pair("foo", x), s);
        var res = r.run(goal, 5);
        assert(res.length, 0);
    },

    function disj_returns_the_disjunction_of_the_goals(){
        var s = emptySub();
        var goal1 = r.conso(x, "bar", list.pair("foo", "bar"), s);
        var goal2 = r.heado(y, list.pair("foo", "bar"), s);
        var disjGoal = r.disj(goal1, goal2);
        var res = r.run(disjGoal, 2);
        assert(res.length, 2);
    }

]);
