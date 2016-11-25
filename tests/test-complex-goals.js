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

console.log("running complex goal tests");
run([

    function listo_can_return_multiple_values_when_tail_of_given_list_is_fresh(){
        var s = emptySub();
        var goal = r.listo(list.pair("foo", x));
        var stream = goal(s);
        var res = stream.next().value;
        assert.equal(res.lookup(x), list.emptyList);
        var res2 = stream.next().value;
        assert.equal(typeof res2.lookup(x).head, "symbol");
        assert.equal(res.lookup(x).tail, s.emptyList);
    },

    function disj_returns_the_disjunction_of_the_goals(){
        var s = emptySub();
        var goal1 = r.conso(x, "bar", list.pair("foo", "bar"));
        var goal2 = r.heado(list.pair("foo", "bar"), y);
        var disjGoal = r.disj(goal1, goal2);
        var stream = disjGoal(s);
        var res = stream.next().value;
        assert.equal(res.lookup(x), "foo");
        var res2 = stream.next().value;
        assert.equal(res2.lookup(y), "foo");
    },

    function conj_returns_the_conjunction_of_the_goals(){
        var s = emptySub();
        var goal1 = r.conso(x, "bar", list.pair("foo", "bar"));
        var goal2 = r.heado(list.pair("foo", "bar"), y);
        var conjGoal = r.conj(goal1, goal2);
        var stream = conjGoal(s);
        var res = stream.next().value;
        assert.equal(res.lookup(x), "foo");
        assert.equal(res.lookup(y), "foo");
    },

    function conj_returns_no_values_if_one_goal_fails(){
        var s = emptySub();
        var goal1 = r.conso("wibble", "bar", list.pair("foo", "bar"));
        var goal2 = r.heado(list.pair("foo", "bar"), y);
        var conjGoal = r.conj(goal1, goal2);
        var stream = conjGoal(s);
        var res = stream.next().value;
        assert.equal(res, null);
    }

]);
