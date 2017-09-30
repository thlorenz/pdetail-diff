const test = require('tape')
const { setWithoutBlockers } = require('../')
const { rangeToDetails } = require('./util/range')

test('\nKK with Kh blocker', function(t) {
  const set = rangeToDetails('KK')
  const res = setWithoutBlockers(set, new Set([ 'Kh' ]))
  t.deepEqual(Array.from(res), [ 'KcKd', 'KcKs', 'KdKs' ])
  t.end()
})

test('\nAKs with Ah blocker', function(t) {
  const set = rangeToDetails('AKs')
  const res = setWithoutBlockers(set, new Set([ 'Ah' ]))
  t.deepEqual(Array.from(res), [ 'AcKc', 'AdKd', 'AsKs' ])
  t.end()
})

test('\nKK with Kh, Ks blockers', function(t) {
  const set = rangeToDetails('KK')
  const res = setWithoutBlockers(set, new Set([ 'Kh', 'Ks' ]))
  t.deepEqual(Array.from(res), [ 'KcKd' ])
  t.end()
})
