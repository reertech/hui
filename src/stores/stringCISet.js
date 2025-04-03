import { writable, get } from "svelte/store"

const addAll = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  values.forEach(value => s.set(value.toLowerCase(), value).bind(s))
  return s
})

const replace = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  s.clear()
  values.forEach(value => s.set(value.toLowerCase(), value).bind(s))
  return s
})

const deleteAll = (values, update) => update(s => {
  if (!Array.isArray(values)) return s
  values.forEach(value => s.delete(value.toLowerCase()).bind(s))
  return s
})

const toggle = (value, update) => update(s => {
  if (s.has(value.toLowerCase())) s.delete(value.toLowerCase())
  else s.set(value.toLowerCase(), value)
  return s
})

const filter = (callback, update) => update(s => {
  return new Map(s.entries().filter(([key, value]) => callback(key, value)))
})

const reject = (callback, update) => update(s => {
  return new Map(s.entries().filter(([key, value]) => !callback(key, value)))
})

export default (value) => {
  const entries = (value || []).map(v => [v.toLowerCase(), v])
  const s = writable(new Map(entries))
  const { subscribe, update } = s

  return {
    add: (val) => update(s => s.set(val.toLowerCase(), val)),
    clear: () => update(s => (s.clear(), s)),
    delete: (val) => update(s => (s.delete(val.toLowerCase()), s)),
    has: (val) => get(s).has(val.toLowerCase()),
    size: () => get(s).size(),
    keys: () => get(s).keys(),
    values: () => get(s).values(),
    entries: () => get(s).entries(),
    toArray: () => [...get(s).values()],
    addAll: (values) => addAll(values, update),
    deleteAll: (values) => deleteAll(values, update),
    replace: (values) => replace(values, update),
    toggle: (value) => toggle(value, update),
    filter: (callback) => filter(callback, update),
    reject: (callback) => reject(callback, update),
    subscribe
  }
}
