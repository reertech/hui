export const checkEmpty = (value) => {
  switch (true) {
    case value == null: return true
    case typeof value === "string": return !value.trim()
    case Array.isArray(value): return !value.length 
    case typeof value === "number": return false
    case typeof value === "boolean": return false
    case typeof value === "object": return !Object.keys(value).length
    default: return false
  }
}

export const buildFuzzyRegex = (string, params = "i") => {
  if (typeof string !== "string" || checkEmpty(string)) return null

  return new RegExp("\\b" + string.replace(/\s+/, "\\b"), params)
}

export const calcParentOffset = (el, parent) => {
  if (!parent || !el) return null

  const parentRect = parent.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  return {
    top: elRect.top - parentRect.top,
    right: parentRect.right - elRect.right,
    bottom: parentRect.bottom - elRect.bottom,
    left: elRect.left - parentRect.left
  }
}

export const fetchCutParent = (el) => {
  if (!el) return null

  const overflowY = getComputedStyle(el).overflowY

  if (overflowY !== "visible") return el

  return fetchCutParent(el.parentElement)
}

export const calcCutParentOffset = (el) =>
  calcParentOffset(el, fetchCutParent(el))

export const sortObjectsBy = (objects, fun) => {
  if (!Array.isArray(objects)) return objects
  if (typeof fun !== "function") return objects 

  const check = (v, type) => v == null || typeof v !== type

  return [...objects].sort((a, b) => {
    if ([a, b].some(v => check(v, "object"))) return 0
    const [aa, bb] = [a, b].map(fun)
    if ([aa, bb].some(v => check(v, "string"))) return 0

    return aa.localeCompare(bb)
  })
}

export const formatPx = (value, def = null) => {
  switch (true) {
    case typeof value === "string" && !checkEmpty(value): return value
    case typeof value === "number": return `${Math.round(value)}px`
    default: return def
  }
}

export const formatNumber = (value, def = null) => {
  const number = +value 

  return isNaN(number) ? def : number
}
