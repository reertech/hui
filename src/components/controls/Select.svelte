<script>
  import "../../themes/controls/Select.css"
  import "../../styles/controls/Select.css"
  import Container from "../Container.svelte"
  import Badge from "./Badge.svelte"
  import Dropdown from "./Dropdown.svelte"

  import { checkEmpty } from "../../helpers.js"
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

  export let inputNode = null
  export let name = null
  export let selected = []
  export let options = {}
  export let label = null
  export let maxValues = 1
  export let placeholder = +maxValues === 1 ? "Select" : "Add"
  export let nullValue = null

  let filter = null
  let closeTimer = null
  let dropdownOpened = false

  $: selectedArray = Array.isArray(selected) ? selected
    : selected == null ? [] : [selected]

  $: selectedSet = new Set(selectedArray)

  $: optionEntries = Array.isArray(options)
    ? options.map(o => [o, o])
    : Object.entries(options)

  $: optionsMap = new Map(optionEntries)

  $: maxValuesInt = +maxValues || 1
  $: isMulti = maxValuesInt > 1
  $: maxPossibleValues = Math.min(maxValuesInt, optionEntries.length)
  $: isFull = selectedSet.size >= maxPossibleValues

  const open = () => {
    clearTimeout(closeTimer)

    dropdownOpened = true
  }

  const close = () => {
    closeTimer = setTimeout(() => dropdownOpened = false, 200)
  }

  const commit = async () => {
    selected = isMulti
      ? [...selectedSet].slice(-maxValuesInt)
      : [...selectedSet].at(-1) ?? nullValue

    await tick()

    dispatch("select", selected)
  }

  const select = async (e) => {
    const value = e.detail
    if (value == null) return

    dropdownOpened = false
    selectedSet.add(value)

    await commit()
    filter = null
  }

  const remove = async (value) => {
    selectedSet.delete(value)

    await commit()

    if (!isMulti) inputNode.focus()
  }

  /* $: { select(filter) } ??? */
</script>

<Container
  hui="Select"
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
  {#if label || $$slots.label}
    <legend>
      <label>
        {dropdownOpened}
        {#if label}{label}{/if}
        <slot name="label" />
        <input
          {name}
          hidden
          value={isMulti ? JSON.stringify(selected) : selected}
        />
      </label>
    </legend>
  {/if}

  {#each selectedArray as value}
    <Badge
      tag="button"
      theme="small"
      on:click={() => remove(value)}
    >
      {optionsMap.get(value)}
    </Badge>
  {/each}
  <input
    bind:value={filter}
    on:focus={open}
    on:blur={close}
    {placeholder}
    hidden={isFull}
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    on:keyup
    on:keydown
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
  />

  {#if !checkEmpty(options) && dropdownOpened}
    <Dropdown
      {options}
      {selected}
      {filter}
      on:select={select}
      root={inputNode?.parentElement}
      active={dropdownOpened}
    />
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex;
  > input = common;
  > input::placeholder = font-size;
  > button = flex-grow, cursor;
-->
