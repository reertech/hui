export const isString = (value) => typeof value === "string"
export const isFunction = (value) => typeof value === "function"
export const isNumber = (value) => typeof value === "number"
export const isBoolean = (value) => typeof value === "boolean"
export const isArray = (value) => Array.isArray(value)
export const isObject = (value) => value != null && !isArray(value) && typeof value === "object"

export const checkEmpty = (value) => {
  switch (true) {
    case value == null: return true
    case isString(value): return !value.trim()
    case isArray(value): return !value.length 
    case isNumber(value): return false
    case isBoolean(value): return false
    case isObject(value): return !Object.keys(value).length
    default: return false
  }
}

export const checkNotEmpty = (value) => !checkEmpty(value)

export const isEqualArrays = (a, b) => {
  if (![a, b].every(isArray)) return false
  if (a.length !== b.length) return false

  return a.every((v, i) => v === b.at(i))
}

export const isEqual = (a, b) => a === b || 
  [a, b].every(checkEmpty) || isEqualArrays(a, b)

export const buildFuzzyRegex = (string, params = "i") => {
  if (!isString(string) || checkEmpty(string)) return null

  return new RegExp(string.replace(/\s+/, " "), params)
}

export const uniqueArray = (array) => {
  if (!isArray) return array

  return new Set(array).values().toArray()
}

export const diffArrays = (arrA, arrB) =>
  new Set(arrA).difference(new Set(arrB)).values().toArray()

export const symDiffArrays = (arrA, arrB) =>
  new Set(arrA).symmetricDifference(new Set(arrB)).values().toArray()

export const arrayToMap = (array, value) => {
  if (!isArray(array)) return array

  const result = {}

  array.forEach((key, i) => {
    result[key] = isFunction(value) ? value(key, i) : value
  })

  return result
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

export const fetchParentByTag = (el, tag) => {
  if (!el) return null

  if (el.tagName === tag) return el

  return fetchParentByTag(el.parentElement, tag)
}

export const calcCutParentOffset = (el) =>
  calcParentOffset(el, fetchCutParent(el))

export const sortBy = (entries, fun) => {
  if (!isArray(entries)) return entries
  if (!isFunction(fun)) return entries 

  const check = (v, type) => v == null || typeof v !== type

  return [...entries].sort((a, b) => {
    const [aa, bb] = [a, b].map(fun)
    if ([aa, bb].some(v => check(v, "string"))) return 0

    return aa.localeCompare(bb)
  })
}

export const formatPx = (value, def = null) => {
  switch (true) {
    case isString(value) && !checkEmpty(value): return value
    case isNumber(value): return `${Math.round(value)}px`
    default: return def
  }
}

export const formatNumber = (value, def = null) => {
  const number = +value 

  return value == null || isNaN(number) ? def : number
}

export const formatBoolean = (value, def = null) => {
  return isBoolean(value) ? def : value
}

export const formatString = (value, def = null) => {
  switch (typeof value) {
    case "number": return value.toString()
    case "boolean": return value.toString()
    case "string": return checkEmpty(value) ? def : value
    default: return def
  }
}

export const formatValue = (value, type, def = null) => {
  if (isArray(value)) {
    return value.map(v => formatValue(v, type, def)).filter(checkNotEmpty)
  }

  switch (type) {
    case "number": return formatNumber(value, def)
    case "boolean": return formatBoolean(value, def)
    case "string": return formatString(value, def)
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
