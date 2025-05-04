import { writable, get } from "svelte/store"

const addAll = (values, update) => update(set => {
  if (!Array.isArray(values)) return set
  values.forEach(set.add.bind(set))
  return set
})

const replace = (values, update) => update(set => {
  if (!Array.isArray(values)) return set
  set.clear()
  values.forEach(set.add.bind(set))
  return set
})

const deleteAll = (values, update) => update(set => {
  if (!Array.isArray(values)) return set
  values.forEach(set.delete.bind(set))
  return set
})

const toggle = (value, update) => update(set => {
  if (set.has(value)) set.delete(value)
  else set.add(value)
  return set
})

const filter = (callback, update) => update(set => {
  return new Set(set.values().filter(callback))
})

const reject = (callback, update) => update(set => {
  return new Set(set.values().filter(entry => !callback(entry)))
})

export default (value) => {
  const store = writable(new Set(value))
  const { subscribe, update } = store

  return {
    add: (val) => update(set => set.add(val)),
    clear: () => update(Set => (set.clear(), set)),
    delete: (val) => update(set => (set.delete(val), set)),
    has: (val) => get(store).has(val),
    size: () => get(store).size(),
    keys: () => get(store).keys(),
    values: () => get(store).values(),
    entries: () => get(store).entries(),
    toArray: () => [...get(store).values()],
    addAll: (values) => addAll(values, update),
    deleteAll: (values) => deleteAll(values, update),
    replace: (values) => replace(values, update),
    toggle: (value) => toggle(value, update),
    filter: (callback) => filter(callback, update),
    reject: (callback) => reject(callback, update),
    subscribe
  }
}
