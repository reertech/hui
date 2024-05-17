import { writable } from "svelte/store"

const persist = (name, value) => {
  const stored = localStorage.getItem(name)
  const serviceKey = `${name}_state`

  value = writable(!stored ? value : JSON.parse(stored))

  value.subscribe(value => {
    if (value === undefined) return
    
    if (localStorage.getItem(serviceKey) === "sync") {
      return localStorage.setItem(serviceKey, "")
    }

    localStorage.setItem(name, JSON.stringify(value))
  })

  window.addEventListener("storage", (e) => {
    if (e.key !== name) return

    localStorage.setItem(serviceKey, "sync")

    value.set(JSON.parse(e.newValue))
  })

  return value
}

export default persist
