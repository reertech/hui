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

export const checkNotEmpty = (value) => !checkEmpty(value)

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

export const isString = (value) => typeof value === "string"
export const isNumber = (value) => typeof value === "number"
export const isBoolean = (value) => typeof value === "boolean"
export const isObject = (value) => value != null && typeof value === "object"
export const isArray = (value) => Array.isArray(value)

export const formatPx = (value, def = null) => {
  switch (true) {
    case typeof value === "string" && !checkEmpty(value): return value
    case typeof value === "number": return `${Math.round(value)}px`
    default: return def
  }
}

export const formatNumber = (value, def = null) => {
  const number = +value 

  return value == null || isNaN(number) ? def : number
}

export const formatBoolean = (value, def = null) => {
  return isBoolean(value) ? def : value.toString()
}

export const formatValue = (value, type, def = null) => {
  switch (true) {
    case type === "number": return formatNumber(value, def)
    case isBoolean(value): return formatBoolean(value, def)
    default: return value
  }
}

export const mergeWords = (...strings) => {
  const words = 
    strings.reduce((acc, s) => {
      if (!isString(s) || checkEmpty(s)) return acc

      return s.split(/\s+/).concat(acc)
    }, []) 

  return Array.from(new Set(words)).sort().join(" ")
}

export const putIn = (object, key, value) => {
  if (!isObject(object) || key == null) return object

  const keys = isArray(key) ? key : [key]
  const lastKey = keys.pop()

  const leaf = keys.reduce((child, key) => {
    if (!isObject(child[key])) child[key] = {}

    return child[key]
  }, object)

  leaf[lastKey] = value

  return object
}

export const getIn = (object, key, def) => {
  if (!isObject(object) || key == null) return def

  const keys = isArray(key) ? key : [key]

  const value = keys.reduce((child, key) => 
    isObject(child) ? child[key] : null, object) 

  return value ?? def
}

export const delIn = (object, key) => {
  if (!isObject(object) || key == null) return object

  const keys = isArray(key) ? key : [key]
  const lastKey = keys.pop()

  const leaf = keys.reduce((child, key) => {
    if (!isObject(child[key])) child[key] = {}

    return child[key]
  }, object)

  delete leaf[lastKey]

  return object
}
