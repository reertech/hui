<script>
  import "../../themes/controls/MultiInput.css"
  import "../../styles/controls/MultiInput.css"
  import Container from "../Container.svelte"
  import Badge from "./Badge.svelte"
  import Button from "./Button.svelte"
  import Dropdown from "./Dropdown.svelte"
  import IconPlus from "../../icons/Plus.svelte"

  import { checkEmpty, checkNotEmpty, isString } from "../../helpers.js"
  import { createEventDispatcher } from "svelte"
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

  export let inputNode = null
  export let name = null
  export let placeholder = null
  export let values = null
  export let maxLength = null
  export let options = null
  export let nullValue = null
  export let maxValues = 2
  export let separator = null
  export let buttonTheme = "flat small"

  let dropdownOpened = false
  let closeTimer = null
  let addMode = true
  let removeMode = false

  $: valuesArray = [separator, values].every(isString)
    ? values.split(separator).map(s => s.trim()).filter(checkNotEmpty)
    : Array.isArray(values) ? values : []

  $: selectedArray = addMode ? valuesArray : valuesArray.slice(0, -1)
  $: lastIdx = valuesArray.length && valuesArray.length - 1
  $: value = addMode ? nullValue : valuesArray.at(lastIdx) || nullValue
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
    const addable = val.endsWith(separator)
    const isEmpty = checkEmpty(val)

    if (isEmpty) removeMode = false

    if (!addable) valuesMap.set(lastIdx + (addMode ? 1 : 0), val)

    commit()
    switchAdd(addable || isEmpty)
  }

  const commit = () => {
    const start = valuesMap.size <= maxValuesInt ? 0
      : valuesMap.size - maxValuesInt

    const vals = [...valuesMap.values()].filter(checkNotEmpty).slice(start)

    values = isString(separator) ? vals.join(separator) : vals

    dispatch("change", values)
  }

  const focus = () => {
    open()
    inputNode?.focus()
  }

  const remove = (idx) => {
    valuesMap.delete(idx)

    commit()
    switchAdd()
  }

  const switchAdd = (val = true) => {
    addMode = val
    focus()
  }

  const removeNew = () => {
    if (!isEmptyValue || !addMode) return
    if (removeMode) switchAdd(false)
    else removeMode = true
  }

  const select = (e) => {
    change({ target: { value: e.detail }})
    switchAdd()
  }

  const keyDown = (e) => {
    if (e.code === "Enter" && e.ctrlKey) {
      switchAdd()
    } else if (e.key === "Backspace") {
      removeNew()
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
  {name}
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
    on:focus={open}
    on:blur={close}
    {placeholder}
    {maxLength}
    type="text"
    hidden={isFull && isEmptyValue}
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    on:keyup
    on:keydown
    on:keydown={keyDown}
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
  />
  {#if !checkEmpty(options) && dropdownOpened}
    <Dropdown
      {options}
      selected={valuesArray}
      on:select={select}
      filter={value}
      root={inputNode?.parentElement}
      active={dropdownOpened}
    />
  {/if}
  {#if !isEmptyValue}
    <Button
      theme={buttonTheme}
      on:click={switchAdd}
    >
      <IconPlus />
    </Button>
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex, gap;
  > input = common;
  > input::placeholder = font-size, text-align;
  > button[data-hui=Button] = layout-position, font-size;
-->

