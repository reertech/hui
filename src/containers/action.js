import { isEqual, isObject, formatPx } from "../helpers.js"

const isValid = (value, allowed) => {
  switch (true) {
    case value == null: return false
    case typeof value === "object": return true
    case allowed == null: return false
    case !["string", "boolean"].includes(typeof value): return false
    case allowed === "string" && isString(value): return true
    case allowed.includes(value): return true
    default: return false
  }
}

const applyStyle = (node, style, value, formatter) => {
  console.log("applyStyle", "!", style, formatter(value))

  node.style[style] = formatter(value)
}

const sizeStyles = {
  width: "width",
  minWidth: "min-width",
  maxWidth: "max-width",
  height: "height",
  minHeight: "min-height",
  maxHeight: "max-height"
}

const applySize = (node, changes) => {
  if (!changes.hasOwnProperty("size")) return

  console.log("apply", "!", "size")

  const size = changes["size"] 
  const s = isValid(size) ? size : {}

  console.log("s", s)

  for (const key in s) {
    const style = sizeStyles[key]

    if (style) applyStyle(node, style, s[key], formatPx)
  }
}

const applyBg = (node, changes) => {
  if (!changes.hasOwnProperty("bg")) return
}

const applyState = (node, oldState, newState) => {
  const changes = [
    "hui",
    "tag",
    "active",
    "readonly",
    "disabled",
    "hidden",
    "valid",
    "invalid",
    "theme",
    "idx",
    "size",
    "position",
    "margin",
    "padding",
    "bg",
    "classes",
    "grid",
    "flex",
    "scrollY",
    "scrollX",
    "value",
    "name"
  ].reduce((acc, key) => 
    extractChanges(oldState, newState, key, acc), {})

  console.log("changes", changes)

  applySize(node, changes)

  return changes
}

const extractChanges = (oldState, newState, key, acc) => {
  const newValue = newState[key]
  const oldValue = oldState[key]

  if (isObject(newValue) && isObject(oldValue)) {
    const compared = {}
    const keys = Object.keys(newValue).concat(Object.keys(oldValue))

    const changes = keys.reduce((acc, key) => {
      if (compared[key]) return acc
      else compared[key] = true

      return extractChanges(oldValue, newValue, key, acc)
    }, {})

    if (Object.keys(changes)) acc[key] = changes
  } else if (!isEqual(newValue, oldValue)) {
    acc[key] = newValue
  }

  console.log("changes", acc)

  return acc
}

export default function hui(node, state) {
  const currentState = applyState(node, {}, state) 

  return {
    update(newState) {
      const changes = applyState(node, currentState, newState)
      Object.assign(currentState, changes) 
    },
    destroy() {
      console.log("bye!", this)
    }
  }
}
