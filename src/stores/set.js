import { writable, get } from "svelte/store"

const addAll = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  values.forEach(s.add.bind(s))
  return s
})

const replace = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  s.clear()
  values.forEach(s.add.bind(s))
  return s
})

const deleteAll = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  values.forEach(s.delete.bind(s))
  return s
})

const toggle = (value, update) => update(s => {
  if (s.has(value)) s.delete(value)
  else s.add(value)
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
    size: () => get(s).size(),
    keys: () => get(s).keys(),
    values: () => get(s).values(),
    entries: () => get(s).entries(),
    toArray: () => [...get(s).values()],
    addAll: (values) => addAll(values, update),
    deleteAll: (values) => deleteAll(values, update),
    replace: (values) => replace(values, update),
    toggle: (value) => toggle(value, update),
    subscribe
  }
}
