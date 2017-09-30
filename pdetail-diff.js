const { rangeFromDetail } = require('pdetail')

function allMissingHaveBlocker(set, arSet, blockers) {
  for (const c of arSet) {
    if (set.has(c)) continue
    const [ r1, s1, r2, s2 ] = c
    if (blockers.has(r1 + s1) || blockers.has(r2 + s2)) continue
    return false
  }
  return true
}

function setWithoutBlockers(set, blockers) {
  if (blockers == null || blockers.size === 0 || set.size === 0) return set
  const res = new Set()
  for (const c of set) {
    const [ r1, s1, r2, s2 ] = c
    if (blockers.has(r1 + s1) || blockers.has(r2 + s2)) continue
    res.add(c)
  }
  return res
}

/**
 * Creates a diff between the detailed combo sets that were available and the ones
 * of those that were included.
 *
 * It assumes that we can only include available combos and omits
 * any checks to verify in order to not hurt performance.
 *
 * If all details of a combo that were available were also included it adds
 * the combo specifier, i.e. 'AA' or 'AKs' to the `complete` set.
 * If some details were missing it instead adds the included combos to the
 * `incomplete` set, i.e. `AsKs, AhKh, AcKc`.
 *
 * **Note** round tripping `createDiff` and `applyDiff`, results in the original `included` set.
 *
 * @name createDiff
 * @function
 * @param {Set.<string>} available detail set of combos that were available to be included
 * @param {Set.<string>} included  detail set of the available combos that were included
 * @param {Set.<string>} blockers  cards that may be part of `available` combos but are blocked
 * for the `included` set i.e. `'Ah', 'Ks'`
 * @return {Object} result `{ complete, incomplete }` `complete` being a set of combo notations for detail sets that
 * were fully included and `incomplete` a set of detail notations of combos that were partially included
 */
function createDiff(available, included, blockers) {
  const ar = rangeFromDetail(available)
  const ir = rangeFromDetail(included)

  const complete = new Set()
  const incomplete = new Set()

  function processCombo(k, set, arSet) {
    // are all available combos included?
    if (arSet.size === set.size) {
      return complete.add(k)
    }
    // are the only missing combos blockers?
    if (blockers != null && allMissingHaveBlocker(set, arSet, blockers)) {
      return complete.add(k)
    }

    for (const c of set) incomplete.add(c)
  }

  for (const [ k, set ] of ir.pairs) {
    if (set.size === 6) complete.add(k)
    else processCombo(k, set, ar.pairs.get(k))
  }

  for (const [ k, set ] of ir.offsuits) {
    if (set.size === 12) complete.add(k)
    else processCombo(k, set, ar.offsuits.get(k))
  }

  for (const [ k, set ] of ir.suiteds) {
    if (set.size === 4) complete.add(k)
    else processCombo(k, set, ar.suiteds.get(k))
  }

  return { complete, incomplete }
}

/**
 * Applies a diff derived via `createDiff` to the `available` set.
 *
 * @name applyDiff
 * @function
 * @param {Set.<string>} available detail set of combos that were available to be included
 * @param {Object> diff `{ complete, incomplete }` `Set.<string>, Set.<string>` that is applied to the available set
 * to reconstruct the original `included` set
 * @param {Set.<string>} blockers cards that weren't available to be included when diff was created, i.e. `'Ah', 'Ks'`
 * should be the same as the ones passed to `createDiff` to arrive at the same `included` set
 * @return {Set} included combos for which the diff from the available ones was created
 */
function applyDiff(available, diff, blockers) {
  const { complete, incomplete } = diff

  const ar = rangeFromDetail(available)
  const included = new Set(incomplete)

  function processCombo(k, set) {
    if (complete.has(k)) {
      const unblocked = setWithoutBlockers(set, blockers)
      for (const c of unblocked) included.add(c)
    }
  }

  for (const [ k, set ] of ar.pairs) processCombo(k, set)
  for (const [ k, set ] of ar.offsuits) processCombo(k, set)
  for (const [ k, set ] of ar.suiteds) processCombo(k, set)

  return included
}

module.exports = { createDiff, applyDiff, setWithoutBlockers }
