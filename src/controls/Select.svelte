<script>
  export let name
  export let selected = []
  export let options = {}
  export let readonly = false
  export let disabled = false
  export let label = null
  export let maxValues = 1
  export let placeholder = "Select"

  import { checkEmpty, buildFuzzyRegex } from "../helpers.js"
  import { tick, createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  let search = null
  let opened = false
  let closeTimer = null

  $: selectedArray = Array.isArray(selected) ? selected
    : selected == null ? [] : [selected]

  $: selectedSet = new Set(selectedArray)

  $: labelRe = buildFuzzyRegex(search)

  $: optionEntries = Array.isArray(options)
    ? options.map(o => [o, o])
    : Object.entries(options)

  $: optionsMap = new Map(optionEntries)
  $: valuesByLabel = new Map(optionEntries.map(([v, l]) => [l, v]))

  $: filteredOptions = optionEntries.filter(([v, l]) => {
    return !selectedSet.has(v) && (!labelRe || labelRe.test(l))
  })

  $: maxValuesInt = +maxValues || 1
  $: isMulti = maxValuesInt > 1
  $: maxPossibleValues = Math.min(maxValuesInt, optionEntries.length)
  $: isFull = selectedSet.size >= maxPossibleValues

  const open = () => {
    clearTimeout(closeTimer)
    opened = true
  }

  const close = () => {
    closeTimer = setTimeout(() => opened = false, 200)
  }

  const commit = async () => {
    await tick()

    selected = isMulti
      ? [...selectedSet].slice(-maxValuesInt)
      : [...selectedSet].at(-1) || null

    dispatch("select", selected)
  }

  const select = async (label) => {
    const value = valuesByLabel.get(label)
    if (!value) return

    opened = false
    selectedSet.add(value)

    await commit()
    search = null
  }

  const remove = async (value) => {
    selectedSet.delete(value)

    await commit()
    if (!isMulti) open()
  }

  /* $: { select(search) } */
</script>

<fieldset
  {name}
  {disabled}
>
  {#if label || $$slots.label}
    <legend>
      <label>
        {opened}
        {#if label}{label}{/if}
        <slot name="label" />
      </label>
    </legend>
  {/if}

  <input
    {name}
    hidden
    value={isMulti ? JSON.stringify(selected) : selected}
  />

  <figure>
    {#each selectedArray as value}
      <data
        {value}
        on:click={() => remove(value)}
      >
        {optionsMap.get(value)}
      </data>
    {/each}
    <input
      bind:value={search}
      hidden={isFull}
      on:focus={open}
      on:blur={close}
      {placeholder}
    >
  </figure>

  <datalist
    hidden={!opened || !filteredOptions.length}
  >
    {#each filteredOptions as [value, label]}
      <option
        {label}
        {value}
        on:click={() => select(label)}
      />
    {/each}
  </datalist>
</fieldset>

<style>
  datalist[hidden],
  input[hidden] {
    display: none;
  }
  figure {
    display: flex;
    flex-wrap: wrap;
    border: 2px solid green;
    padding: 0;
    margin: 0;
  }
  fieldset {
    display: block;
    border: 2px solid black;
    padding: 0;
    margin: 0;
    position: relative;
  }
  datalist {
    display: block;
    border: 2px solid red;
    background: #fff;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
  }
  datalist > option {
    display: block;
    border: 2px solid blue;
  }
  data {
    display: inline-block;
    padding: 4px;
  }
  figure > input {
    border: 0 none transparent;
    flex-grow: 1;
    outline: none;
    padding: 4px;
  }
</style>
