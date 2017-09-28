const prange = require('prange')
const { detailRange } = require('pdetail')

function rangeToDetails(range) {
  const combos = prange(range)
  return combos.reduce((set, x) => {
    for (const c of detailRange(x)) set.add(c)
    return set
  }, new Set())
}

module.exports = { rangeToDetails }
