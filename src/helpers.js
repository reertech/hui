export const checkEmpty = (value) => {
  switch (true) {
    case value == null: return true
    case typeof value === "string": return !value.trim()
    case Array.isArray(value): return !value.length 
    case typeof value === "number": return false
    case typeof value === "boolean": return false
    case typeof value === "object": return !Object.keys(this).length
    default: return false
  }
}

export const buildFuzzyRegex = (string, params = "gi") => {
  if (typeof string !== "string" || checkEmpty(string)) return null

  const pattern = string.replace(/[\W_]+/g, " ").trim()

  if (checkEmpty(pattern)) return null

  return new RegExp(pattern.replace(" ", ".+\\b"), params)
}

