import { writable, get } from "svelte/store"

const addAll = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  values.forEach(s.add.bind(s))
  return s
})

const deleteAll = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  values.forEach(s.delete.bind(s))
  return s
})

export default (value) => {
  const s = writable(new Set(value))
  const { subscribe, update } = s

  return {
    add: (val) => update(s => s.add(val)),
    clear: () => update(s => (s.clear(), s)),
    delete: (val) => update(s => (s.delete(val), s)),
    has: (val) => get(s).has(val),
    keys: () => get(s).keys(),
    values: () => get(s).values(),
    entries: () => get(s).entries(),
    // forEach: (cb) => get(s).forEach(cb) ???,
    toArray: () => get(s).values().toArray(),
    addAll: (values) => addAll(values, update),
    deleteAll: (values) => deleteAll(values, update),
    subscribe
  }
}
