<script>
  import "../../themes/controls/MultiInput.css"
  import "../../styles/controls/MultiInput.css"
  import Container from "../Container.svelte"
  import Badge from "./Badge.svelte"
  import Dropdown from "./Dropdown.svelte"

  import { checkEmpty, checkNotEmpty, isString } from "../../helpers.js"
  import { tick, createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
  export let idx = null
  export let size = null
  export let position = null
  export let margin = null
  export let padding = null
  export let bg = null
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let name = null
  export let placeholder = null
  export let values = null
  export let maxLength = null
  export let prefix = null
  export let suffix = null
  export let options = null
  export let nullValue = null
  export let maxValues = 2
  export let separator = null

  let dropdownOpened = false
  let closeTimer = null
  let input = null
  let addNew = true

  $: valuesArray = [separator, values].every(isString)
    ? values.split(separator).map(s => s.trim()).filter(checkNotEmpty)
    : Array.isArray(values) ? values : []

  $: selectedArray = addNew ? valuesArray : valuesArray.slice(0, -1)
  $: lastIdx = valuesArray.length && valuesArray.length - 1
  $: value = addNew ? nullValue : valuesArray.at(lastIdx) || nullValue
  $: valuesMap = new Map(valuesArray.map((v, i) => [i, v]))
  $: maxValuesInt = +maxValues || 2
  $: isFull = valuesMap.size >= maxValuesInt
  $: isEmptyValue = checkEmpty(value) || value === nullValue

  const open = () => {
    clearTimeout(closeTimer)

    dropdownOpened = true
  }

  const close = () => closeTimer =
    setTimeout(() => dropdownOpened = false, 200)

  const change = (e) => {
    const val = e.target.value

    valuesMap.set(lastIdx + (addNew ? 1 : 0), val)

    commit()

    if (checkEmpty(val)) add()
  }

  const commit = () => {
    const start = valuesMap.size <= maxValuesInt ? 0
      : valuesMap.size - maxValuesInt

    const vals = [...valuesMap.values()].filter(checkNotEmpty).slice(start)

    values = isString(separator) ? vals.join(separator) : vals
    addNew = false

    dispatch("change", values)
  }

  const focus = async () => {
    await tick()
    input.focus()
  }

  const remove = (idx) => {
    valuesMap.delete(idx)

    commit()
    add()
  }

  const add = () => {
    addNew = true
    focus()
  }

  const removeNew = () => {
    if (!isEmptyValue || !addNew) return
    addNew = false
    commit()
    return false
  }

  const select = (e) => {
    change({ target: { value: e.detail }})
    add()
  }

  const enter = (e) => {
    if (e.code === "Enter") {
      add()
      dispatch("enter")
    } else if (e.key === "Backspace") {
      removeNew()
    } else if (e.key === separator) {
      add()
    }
  }
</script>

<Container
  hui="MultiInput"
  tag="fieldset"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {bg}
  {margin}
  {padding}
  {idx}
  {size}
  {position}
  {scrollX}
  {scrollY}
  {grid}
  {flex}
>
  {#each selectedArray as value, idx}
    <Badge
      tag="button"
      theme="small"
      on:click={() => remove(idx)}
    >
      {value}
    </Badge>
  {/each}
  <input
    {name}
    on:click
    on:input
    on:input={change}
    on:change={change}
    {value}
    bind:this={input}
    on:focus={open}
    on:blur={close}
    {placeholder}
    {maxLength}
    type="text"
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    on:keydown={enter}
    hidden={isFull && isEmptyValue}
  />
  {#if !checkEmpty(options) && dropdownOpened}
    <Dropdown
      {options}
      selected={valuesArray}
      on:select={select}
      filter={value}
      root={input?.parentElement}
      active={dropdownOpened}
    />
  {/if}
  {#if !isEmptyValue}
    <button on:click={add}>
      add
    </button>
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex, gap;
  > input = common;
  > input::placeholder = font-size, text-align;
-->

