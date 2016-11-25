# reason.js

A JavaScript microKanren using generators to produce the substitution streams.

## Code Example

    r = require("./reason.js");
    s = require("./subs.js");
    x = s.fresh();
    goal = r.unify("foo", x);
    stream = goal(s.emptySub());
    stream.next().value.lookup(x);
    
## Tests

In the tests folder:

    ./runtests all

## License

MIT
