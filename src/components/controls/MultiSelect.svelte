<script>
  import "../../themes/controls/MultiSelect.css"
  import "../../styles/controls/MultiSelect.css"
  import Container from "../Container.svelte"
  import Badge from "./Badge.svelte"
  import Dropdown from "./Dropdown.svelte"
  import IconX from "../../icons/X.svelte"

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
  export let maxValues = 10
  export let placeholder = "Add"

  let filter = null
  let closeTimer = null
  let dropdownOpened = false

  $: selectedArray = Array.isArray(selected) ? selected
    : selected == null ? [] : [selected]

  $: selectedSet = new Set(selectedArray)

  $: optionEntries = Array.isArray(options)
    ? options.map(o => [o, o])
    : Object.entries(options)

  $: optionsObj = Object.fromEntries(optionEntries)

  $: maxValuesInt = +maxValues || 10
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
    selected = [...selectedSet].slice(-maxValuesInt)

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

  const remove = (value) => {
    selectedSet.delete(value)

    commit()
  }
</script>

<Container
  hui="MultiSelect"
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
  {#each selectedArray as value}
    <Badge
      tag="button"
      theme="small"
      on:click={() => remove(value)}
    >
      {optionsObj[value]}
      <IconX />
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
  > button[data-hui=Badge] = flex-grow, cursor;
-->
