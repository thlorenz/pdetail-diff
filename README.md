# pdetail-diff [![build status](https://secure.travis-ci.org/thlorenz/pdetail-diff.png)](http://travis-ci.org/thlorenz/pdetail-diff)

Concise way to express which card combos found in a set are also set in another

```js
const { createDiff, applyDiff } = require('pdetail-diff')

const diff = createDiff(availableSet, includedSet, blockers)
const res = applyDiff(availableSet, diff, blockers)
// => res now has exact same combos as the original includedSet
```

## Installation

    npm install pdetail-diff

## [API](https://thlorenz.github.io/pdetail-diff)


## License

MIT
