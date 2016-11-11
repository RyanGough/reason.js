module.exports = function runTests(tests){
    for (var i = 0; i < tests.length; i++){
        tests[i]();
    }
    console.log(tests.length + " tests passed");
}
