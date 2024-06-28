import { writable, get } from "svelte/store"
import { isObject, isArray } from "../helpers.js"

const prepareValue = (value) => {
  if (value == null) return null
  if (isObject(value)) return Object.entries(value)
  if (isArray(value)) return value
  throw "Broken Map value"
}

const merge = (value, m) => {
  const entries = prepareValue(value)

  if (entries) {
    m.update(m => {
      entries.forEach(([k, v]) => m.set(k, v))
      return m
    })
  }

  return m
}

const replace = (value, m) => {
  const entries = prepareValue(value)

  return m.update(m => {
    m.clear()
    if (entries) entries.forEach(([k, v]) => m.set(k, v))
    return m
  })
}

const drop = (keys, m) => {
  if (!isArray(keys)) return m

  return m.update(m => {
    keys.forEach(m.delete.bind(m))
    return m
  })
}

export default (value) => {
  const m = writable(new Map(prepareValue(value)))

  return {
    clear: () => m.update(m => (m.clear(), m)),
    delete: (key) => m.update(m => (m.delete(key), m)),
    entries: () => get(m).entries(),
    get: (key) => get(m).get(key),
    has: (key) => get(m).has(key),
    keys: () => get(m).keys(),
    set: (key, val) => m.update(m => m.set(key, val)),
    values: () => get(m).values(),
    clone: () => new Map(get(m)),
    merge: (value) => merge(value, m),
    replace: (value) => replace(value, m),
    drop: (keys) => drop(keys, m),
    toObject: () => Object.fromEntries(get(m)),
    subscribe: m.subscribe
  }
}
