import {
  isEqual,
  isObject,
  isString,
  isFunction,
  formatPx,
  formatString,
  formatNumber
} from "./helpers.js"

const applyStyles = (node, changes, styles, formatter) => {
  const values = {}
  let withStyles = false

  for (const key in changes) {
    const style = styles[key]

    if (style) {
      const value = isFunction(formatter)
        ? formatter(changes[key]) : changes[key]

      if (value != null) values[style] = value
      else node.style[style] = null
    }
  }

  for (const style in values) {
    withStyles = true
    node.style[style] = values[style]
  }

  return withStyles
}

const applyStyle = (node, value, style, formatter) => {
  value = isFunction(formatter) ? formatter(value) : value

  node.style[style] = value
}

const applyDataAttrs = (node, changes, attrs, formatter) => {
  // console.log("applyDataAttrs", changes, attrs)
  let withData = false

  for (const key in changes) {
    const attr = attrs[key]

    if (attr) {
      const value = isFunction(formatter)
        ? formatter(changes[key]) : changes[key]

      // console.log("applyDataAttrs >", key, attr, JSON.stringify(value))

      if (value != null) {
        withData = true
        node.dataset[attr] = value
      } else {
        delete node.dataset[attr]
      }
    }
  }

  return withData
}

const applyDataAttr = (node, value, attr, formatter) => {
  value = isFunction(formatter) ? formatter(value) : value

  if (value != null) node.dataset[attr] = value
  else delete node.dataset[attr]
}

const replaceDefault = (def, replacement) => {
  return (value) => {
    if (value == null) return replacement
    if (value === def) return replacement
    return value
  }
}

const mergeChanges = (changes, keys) => {
  return keys.reduce((acc, key) => {
    const change = changes[key]
    if (!isObject(change)) return acc
    return Object.assign(acc, change)
  }, {})
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
  const size = changes["size"]

  if (!isObject(size)) return

  applyStyles(node, size, sizeStyles, formatPx)
}

const overflowStyles = {
  x: "overflow-x",
  y: "overflow-y"
}

const overflowAllowed = {
  scroll: "scroll",
  hidden: "hidden",
  clip: "clip",
  visible: "visible",
  auto: "auto"
}

const applyOverflow = (node, changes) => {
  const overflow = changes["overflow"]

  if (!isObject(overflow)) return

  applyStyles(node, overflow, overflowStyles, v => overflowAllowed[v])
}

const scrollAttrs = {
  X: "huiScrollX",
  Y: "huiScrollY"
}

const applyScroll = (node, changes) => {
  (["X", "Y"]).forEach(dir => {
    const key = `scroll${dir}`

    if (!changes.hasOwnProperty(key)) return

    applyDataAttr(node, changes[key], scrollAttrs[dir], value => {
      if (value === false || value === "false") return "visible"
      if (value === true || value === "true" || value === "scroll") return ""
      return overflowAllowed[value]
    })
  })
}

const bgStyles = {
  bgFull: "background",
  color: "background-color",
  image: "background-image",
  position: "background-position"
}

const applyBg = (node, changes) => {
  const keys = ["bg", "background"]
  if (!keys.some(k => changes.hasOwnProperty(k))) return

  const bg = mergeChanges(changes, keys)

  applyStyles(node, bg, bgStyles, formatString)
}

const positionAllowed = {
  static: "static",
  fixed: "fixed",
  relative: "relative",
  sticky: "sticky",
  absolute: "absolute"
}

const applyPosition = (node, changes) => {
  if (!changes.hasOwnProperty("position")) return

  applyDataAttr(node, changes["position"], "huiPosition", v => positionAllowed[v])
}

const applyZ = (node, changes) => {
  if (!changes.hasOwnProperty("z")) return

  applyDataAttr(node, changes["z"], "huiZ", formatNumber)
}

const applyZIndex = (node, changes) => {
  if (!changes.hasOwnProperty("zIndex")) return

  applyStyle(node, changes["zIndex"], "z-index", formatNumber)
}

const applyTheme = (node, changes) => {
  if (!changes.hasOwnProperty("theme")) return

  applyDataAttr(node, changes["theme"], "huiTheme", formatString)
}

const applyClasses = (node, changes, initialClasses) => {
  if (!changes.hasOwnProperty("class")) return

  const classes = changes["class"]

  node.classList.value = ""
  node.classList.add(initialClasses)

  if (!isString(classes)) return

  classes.split(" ").forEach(newClass => {
    if (!newClass) return
    node.classList.add(newClass)
  })
}

const applyIdx = (node, changes) => {
  if (!changes.hasOwnProperty("idx")) return

  applyDataAttr(node, changes["idx"], "huiIdx", formatString)
}

const elStates = [
  ["active", "huiStateActive"],
  ["readonly", "huiStateReadonly"],
  ["disabled", "huiStateDisabled"],
  ["hidden", "huiStateHidden"],
  ["invisible", "huiStateInvisible"],
  ["valid", "huiStateValid"],
  ["invalid", "huiStateInvalid"]
]

const applyElState = (node, changes) => {
  elStates.forEach(([state, attr]) => {
    if (!changes.hasOwnProperty(state)) return

    applyDataAttr(node, changes[state], attr, v => (v || null) && "")
  })
}

const huiAttrs = {
  value: "hui",
  target: "huiTarget"
}

const applyTag = (node, changes) => {
  if (!changes.hasOwnProperty("tag")) return

  const value = formatString(changes["tag"])

  if (value != null) {
    applyDataAttrs(node, { value, target: "self" }, huiAttrs)
  } else {
    applyDataAttrs(node, { value, target: null }, huiAttrs)
  }
}

const insetStyles = {
  insetFull: "inset",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left"
}

const applyInset = (node, changes) => {
  const inset = changes["inset"]

  if (!isObject(inset)) return

  applyStyles(node, inset, insetStyles, formatPx)
}

const gapStyles = {
  gapFull: "gap",
  row: "rowGap",
  col: "colGap"
}

const applyGap = (node, changes) => {
  const gap = changes["gap"]

  if (!isObject(gap)) return

  applyStyles(node, gap, gapStyles, formatPx)
}

const marginStyles = {
  marginFull: "margin",
  top: "margin-top",
  right: "margin-right",
  bottom: "margin-bottom",
  left: "margin-left"
}

const applyMargin = (node, changes) => {
  const margin = changes["margin"]

  if (!isObject(margin)) return

  applyStyles(node, margin, marginStyles, formatPx)
}

const paddingStyles = {
  paddingFull: "padding",
  top: "padding-top",
  right: "padding-right",
  bottom: "padding-bottom",
  left: "padding-left"
}

const applyPadding = (node, changes) => {
  const padding = changes["padding"]

  if (!isObject(padding)) return

  applyStyles(node, padding, paddingStyles, formatPx)
}

const gridStyles = {
  templateRows: "grid-template-rows",
  templateColumns: "grid-template-columns",
  columnStart: "grid-column-start",
  columnEnd: "grid-column-end",
  rowStart: "grid-row-start",
  rowEnd: "grid-row-end",
  templateAreas: "grid-template-areas",
  autoRows: "grid-auto-rows",
  autoColumns: "grid-auto-columns"
}

const gridAttrs = {
  justifyItems: "huiGridJustifyItems",
  alignItems: "huiGridAlignItems",
  justifyContent: "huiGridJustifyContent",
  alignContent: "huiGridAlignContent",
  autoFlow: "huiGridAutoFlow"
}

const gridDisplayAllowed = {
  grid: true,
  "inline-grid": true
}

const applyGrid = (node, changes) => {
  const grid = changes["grid"]

  // console.log("grid", grid)

  if (!isObject(grid)) return

  const withStyles = applyStyles(node, grid, gridStyles, formatString)
  const withData = applyDataAttrs(node, grid, gridAttrs, formatString)

  const display = grid.display
  const displayAttr = { display: "huiGrid" }

  if (gridDisplayAllowed[display] || withData || withStyles) {
    applyDataAttrs(node, { display }, displayAttr, replaceDefault("grid", ""))
  } else {
    applyDataAttrs(node, { display: null }, displayAttr)
    applyStyles(node, grid, gridStyles, _ => null)
    applyDataAttrs(node, grid, gridAttrs, _ => null)
  }
}

const flexAttrs = {
  direction: "huiFlexDirection",
  wrap: "huiFlexWrap",
  justifyContent: "huiFlexJustifyContent",
  alignItems: "huiFlexAlignItems",
  alignContent: "huiFlexAlignContent"
}

const flexDisplayAllowed = {
  flex: true,
  "inline-flex": true
}

const applyFlex = (node, changes) => {
  const flex = changes["flex"]

  // console.log("flex", flex)

  if (!isObject(flex)) return

  const withData = applyDataAttrs(node, flex, flexAttrs, formatString)

  const display = flex.display
  const displayAttr = { display: "huiFlex" }

  if (flexDisplayAllowed[display] || withData) {
    applyDataAttrs(node, { display }, displayAttr, replaceDefault("flex", ""))
  } else {
    applyDataAttrs(node, { display: null }, displayAttr)
    applyDataAttrs(node, flex, flexAttrs, _ => null)
  }
}

const stateApplicators = [
  applyTag,
  applyTheme,
  applyClasses,
  applyElState,
  applyIdx,
  applySize,
  applyBg,
  applyMargin,
  applyPadding,
  applyGrid,
  applyFlex,
  applyPosition,
  applyInset,
  applyGap,
  applyOverflow,
  applyScroll,
  applyZ,
  applyZIndex
]

const stateKeys = [
  "tag",
  "theme",
  "class",
  "idx",
  "active",
  "readonly",
  "disabled",
  "hidden",
  "invisible",
  "valid",
  "invalid",
  "size",
  "margin",
  "padding",
  "bg",
  "background",
  "grid",
  "flex",
  "position",
  "inset",
  "gap",
  "overflow",
  "scrollY",
  "scrollX",
  "z",
  "zIndex"
]

const applyState = (node, oldState, newState, classes) => {
  const changes = oldState == null ? newState 
    : stateKeys.reduce((acc, key) =>
      extractChanges(oldState, newState, key, acc), {})

  stateApplicators.forEach(fun => fun(node, changes, classes))

  return changes
}

const objectOrBoolKeys = {
  grid: { display: "grid" },
  flex: { display: "flex" }
}

const objectOrStringKeys = {
  bg: "bgFull",
  background: "bgFull",
  margin: "marginFull",
  padding: "paddingFull",
  inset: "insetFull",
  gap: "gapFull",
  overflow: "overflowFull"
}

const objectValueKeys = {
  ...{ size: true },
  ...objectOrStringKeys,
  ...objectOrBoolKeys
}

const extractNestedChanges = (newValue, oldValue) => {
  // console.log("extractNestedChanges", newValue, oldValue)
  if (!isObject(newValue) && !isObject(oldValue)) return null

  newValue = newValue ?? {}
  oldValue = oldValue ?? {}

  const compared = {}
  const keys = Object.keys(newValue).concat(Object.keys(oldValue))

  // console.log("keys", keys)

  return keys.reduce((acc, key) => {
    if (compared[key]) return acc
    else compared[key] = true

    if (!isEqual(newValue[key], oldValue[key])) acc[key] = newValue[key]

    return acc
  }, {})
}

const stringToObjectValue = (value, key) => {
  if (isString(value)) return { [objectOrStringKeys[key]]: value }
  if (isObject(value)) return { ...value }
  return
}

const boolToObjectValue = (value, key) => {
  if (isObject(value)) return { ...value }
  if (value === true || value === "true") return { ...objectOrBoolKeys[key] }
  return
}

const extractChanges = (oldState, newState, key, acc) => {
  const newValue = newState[key]
  const oldValue = oldState[key]

  if (isObject(newValue) && isObject(oldValue)) {
    if (!objectValueKeys[key]) return acc

    const changes = extractNestedChanges(newValue, oldValue)

    if (changes && Object.keys(changes).length) acc[key] = changes
  } else if (objectOrBoolKeys[key]) {
    const newValueObj = boolToObjectValue(newValue, key)
    const oldValueObj = boolToObjectValue(oldValue, key)

    const changes = extractNestedChanges(newValueObj, oldValueObj)

    if (changes && Object.keys(changes).length) acc[key] = changes
  } else if (objectOrStringKeys[key]) {
    const newValueObj = stringToObjectValue(newValue, key)
    const oldValueObj = stringToObjectValue(oldValue, key)

    const changes = extractNestedChanges(newValueObj, oldValueObj)

    if (changes && Object.keys(changes).length) acc[key] = changes
  } else if (!isEqual(newValue, oldValue)) {
    acc[key] = isObject(newValue) ? { ...newValue } : newValue
  }

  return acc
}

export default function hui(node, state) {
  const classes = [...node.classList.values()]
  let currentState = applyState(node, null, state)

  return {
    update(newState) {
      // console.log("update", Object.keys(newState))
      const changes = applyState(node, currentState, newState, classes)
      currentState = { ...currentState, ...changes }
    },
    destroy() {
      // delete currentState
      // console.log("bye!", this)
    }
  }
}
