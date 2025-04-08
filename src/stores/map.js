import { writable, get } from "svelte/store"
import { isObject, isArray } from "../helpers.js"

const prepareValue = (value) => {
  if (value == null) return null
  if (isObject(value)) return Object.entries(value)
  if (isArray(value)) return value
  throw "Broken Map value"
}

const merge = (value, store) => {
  const entries = prepareValue(value)

  if (entries) {
    store.update(map => {
      entries.forEach(([k, v]) => map.set(k, v))
      return map
    })
  }

  return store
}

const replace = (value, store) => {
  const entries = prepareValue(value)

  store.update(map => {
    map.clear()
    if (entries) entries.forEach(([k, v]) => map.set(k, v))
    return map
  })

  return store
}

const drop = (keys, store) => {
  if (!isArray(keys)) return store

  store.update(map => {
    keys.forEach(map.delete.bind(map))
    return map
  })

  return store
}

const update = (key, callback, store) => {
  store.update(map => {
    const newValue = callback(map.get(key))
    map.set(key, newValue)
    return map
  })

  return store
}

export default (value) => {
  const store = writable(new Map(prepareValue(value)))

  return {
    clear: () => store.update(map => (map.clear(), map)),
    delete: (key) => store.update(map => (map.delete(key), map)),
    entries: () => get(store).entries(),
    get: (key) => get(store).get(key),
    has: (key) => get(store).has(key),
    keys: () => get(store).keys(),
    set: (key, val) => store.update(map => map.set(key, val)),
    update: (key, cb) => update(key, cb, store),
    values: () => get(store).values(),
    clone: () => new Map(get(store)),
    merge: (value) => merge(value, store),
    replace: (value) => replace(value, store),
    drop: (keys) => drop(keys, store),
    toObject: () => Object.fromEntries(get(store)),
    subscribe: store.subscribe
  }
}
