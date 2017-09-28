/* eslint-disable comma-spacing */
const { rangeToDetails } = require('./util/range')
const DEBUG = false

const test = require('tape')
const { createDiff, applyDiff } = require('../')

// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

function haveSameCombos(set1, set2) {
  if (set1.size !== set2.size) return false
  for (const c of set1) if (!set2.has(c)) return false
  return true
}

function check(t, { available, included, blockers = null }) {
  if (blockers != null) blockers = new Set(blockers)

  const [ availableRange, availableRemove ] = available
  const [ includedRange, includedRemove ] = included

  const availableSet = rangeToDetails(availableRange)
  for (const c of availableRemove) availableSet.delete(c)

  const includedSet = rangeToDetails(includedRange)
  for (const c of includedRemove) includedSet.delete(c)

  const diff = createDiff(availableSet, includedSet, blockers)
  const res = applyDiff(availableSet, diff, blockers)
  if (DEBUG) {
    inspect({ availableSet, includedSet, blockers, diff })
  }

  if (haveSameCombos(includedSet, res)) {
    const blockerVal = blockers == null ? null : Array.from(blockers)
    return t.pass(`available: ${availableRange}, included: ${includedRange}, blockers: ${blockerVal}`)
  }
  inspect({ includedSet, res })
  t.fail('included not the same after diff applied')
}

test('\nroundtrip without blockers', function(t) {
  [ { available: [ 'AKs-ATs, QQ+'  , [ 'KhKs' ] ]
    , included:  [ 'AKs, KK+'      , [ 'KhKs', 'AhKh', 'AsKs', 'AcKc' ] ] }
  , { available: [ '22+'  , [ '3h3s', '2h2s' ] ]
    , included:  [ '55+'  , [ ] ] }
  , { available: [ 'AJ+', [ 'AhJh' ] ]
    , included:  [ 'AQ+', [ 'AhQs' ] ] }
  ].forEach(x => check(t, x))

  t.end()
})

test('\nroundtrip with blockers', function(t) {
  [ { available: [ 'AKs-ATs, QQ+'  , [ 'KhKs' ] ]
    , included:  [ 'AKs, KK+'      , [ 'KhKs', 'KcKd', 'AhKh', 'AsKs', 'AcKc' ] ]
    , blockers:                      [ 'KhKs', 'KcKd', 'AhKh' ] }
  , { available: [ '22+'  , [ '3h3s', '2h2s' ] ]
    , included:  [ '55+'  , [ '5h5s', '5c5d' ] ]
    , blockers:             [ '5h5s' ] }
  , { available: [ '22+'  , [ '3h3s', '2h2s' ] ]
    , included:  [ '55+'  , [ '5h5s', '5c5d' ] ]
    , blockers:             [ '5h5s', '5c5d' ] }
  ].forEach(x => check(t, x))

  t.end()
})

