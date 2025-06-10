<script>
  import "../../themes/controls/Select.css"
  import "../../styles/controls/Select.css"
  import Container from "../Container.svelte"
  import Button from "./Button.svelte"
  import Dropdown, { focusByArrows, generateAnchor } from "./Dropdown.svelte"
  import IconX from "../../icons/X.svelte"
  import { checkEmpty } from "../../helpers.js"

  import { tick, createEventDispatcher, onMount } from "svelte"
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
  export let value = null
  export let options = {}
  export let required = false
  export let placeholder = "Select"
  export let nullValue = null
  export let buttonTheme = "small flat"
  export let autofocus = false

  let filter = null
  let closeTimer = null
  let isFocused = false
  let dropdownOpened = false

  const dropdownAnchor = generateAnchor()

  $: optionEntries = Array.isArray(options)
    ? options.map(o => [o, o])
    : Object.entries(options)

  $: optionsObj = Object.fromEntries(optionEntries)

  $: isSelected = optionsObj.hasOwnProperty(value)

  $: isClearable = !required && isSelected && isFocused && !filter

  $: filterPlaceholder = optionsObj[value] ?? placeholder

  $: filterValue = isFocused ? filter
    : isSelected ? optionsObj[value] : null

  $: isValueVisible = filter == null && isSelected

  const open = async () => {
    clearTimeout(closeTimer)

    isFocused = true
    dropdownOpened = true
    await tick()
    inputNode?.focus()
  }

  const close = () => {
    isFocused = false
    closeTimer = setTimeout(() => dropdownOpened = false, 200)
  }

  const commit = async () => {
    await tick()

    dispatch("select", value)
  }

  const select = async (e) => {
    value = e.detail ?? nullValue

    dropdownOpened = false

    await commit()
    filter = null
    // inputNode?.focus()
  }

  const clear = async () => {
    value = nullValue

    await commit()
    inputNode.focus()
  }

  onMount(() => {
    if (autofocus) tick().then(() => inputNode?.focus())
  })
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
  anchor={dropdownAnchor}
>
  <input
    on:blur={close}
    on:keydown={focusByArrows}
    value={filterValue}
    placeholder={filterPlaceholder}
    on:click={open}
    on:focus={open}
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    data-hui-selected={isValueVisible ? "" : null}
    on:input={(e) => filter = e.target.value}
    on:keyup
    on:keydown
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
  />
  {#if isClearable}
    <Button
      theme={buttonTheme}
      on:mousedown={clear}
    >
      <IconX />
    </Button>
  {/if}

  {#if !checkEmpty(options) && dropdownOpened}
    <Dropdown
      {options}
      {filter}
      selected={value}
      on:select={select}
      input={inputNode}
      root={inputNode?.parentElement}
      active={dropdownOpened}
      anchor={dropdownAnchor}
    />
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex;
  > input = common;
  > input[data-hui-selected] = color;
  > input::placeholder = font-size;
  > button[data-hui=Button] = layout-position, font-size;
-->
