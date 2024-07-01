import { isEqual, formatPx } from "../helpers.js"

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

const applyStyle = (oldVal, newVal, node, style, formatter) => {
  if (isEqual(oldVal, newVal)) return

  console.log("applyStyle", "!", style)

  node.style[style] = formatter(newVal) 
}

const applySize = (node, oldState, changes) => {
  if (!changes.hasOwnProperty("size")) return
  console.log("apply", "!", "Size")

  const size = changes["size"] 
  const s = isValid(size) ? size : {}
  const oldS = oldState["size"] || {}

  const props = [
    ["width", "width"], 
    ["minWidth", "min-width"],
    ["maxWidth", "max-width"],
    ["height", "height"], 
    ["minHeight", "min-height"],
    ["maxHeight", "max-height"]
  ]

  props.forEach(([key, style]) => {
    applyStyle(oldS[key], s[key], node, style, formatPx)
  })
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
    "value"
  ].reduce((acc, key) => {
    const newValue = newState[key]
    if (isEqual(oldState[key], newValue)) return acc
    acc[key] = newValue
    return acc
  }, {})

  applySize(node, oldState, changes)

  return changes
}

export default (node, state) => {
  const currentState = applyState(node, {}, state) 

  return {
    update: (newState) => {
      const changes = applyState(node, currentState, newState)
      Object.assign(currentState, changes) 
    }
  }
}
