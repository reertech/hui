<script>
  import "../../themes/controls/Select.css"
  import "../../styles/controls/Select.css"
  import Container from "../Container.svelte"

  import { checkEmpty, buildFuzzyRegex } from "../../helpers.js"
  import { tick, createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null

  let classes = null
  export { classes as class }

  export let name
  export let selected = []
  export let options = {}
  export let label = null
  export let maxValues = 1
  export let placeholder = "Select"

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

<Container
  hui="Select"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
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

    <div>
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
        active={active || null}
        disabled={disabled || null}
        readonly={readonly || null}
      >
    </div>

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
</Container>

<!-- theme.ini
  > fieldset = common
  > fieldset > datalist = common
  > fieldset > datalist > option = common
  > fieldset > div > input = common
-->
