/**
 * Unwraps these autistic lists of `name`, `value` pairs
 * - God I hate them so much
 * - This shit drives me up the fucking wall
 * @param {[{name:*,value:*}]} list
 * @returns {object}
 */
export default function (list) {
  if (list == null) return {}
  const out = {}
  for (const { name, value } of list) {
    out[name] = value
  }
  return out
}
