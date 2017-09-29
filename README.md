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

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### createDiff

Creates a diff between the detailed combo sets that were available and the ones
of those that were included.

It assumes that we can only include available combos and omits
any checks to verify in order to not hurt performance.

If all details of a combo that were available were also included it adds
the combo specifier, i.e. 'AA' or 'AKs' to the `complete` set.
If some details were missing it instead adds the included combos to the
`incomplete` set, i.e. `AsKs, AhKh, AcKc`.

**Note** round tripping `createDiff` and `applyDiff`, results in the original `included` set.

**Parameters**

-   `available` **[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** detail set of combos that were available to be included
-   `included` **[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** detail set of the available combos that were included
-   `blockers` **[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** detail set of cards that may be part of `available` but are blocked for the `included` set

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** `{ complete, incomplete }` `complete` being a set of combo notations for detail sets that
were fully included and `incomplete` a set of detail notations of combos that were partially included

### applyDiff

Applies a diff derived via `createDiff` to the `available` set.

**Parameters**

-   `available` **[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** detail set of combos that were available to be included
-   `blockers` **[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** detail combos that weren't unavailable to be included when diff was created
    should be the same as the ones passed to `createDiff` to arrive at the same `included` set

Returns **[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)** included combos for which the diff from the available ones was created

## License

MIT
