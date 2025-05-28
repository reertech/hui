<script>
  import "../../themes/controls/TextInput.css"
  import "../../styles/controls/TextInput.css"
  import Container from "../Container.svelte"
  import Strong from "../typography/Strong.svelte"
  import Dropdown, { focusByArrows } from "./Dropdown.svelte"

  import { checkEmpty } from "../../helpers.js"
  import { createEventDispatcher, tick, onMount } from "svelte"
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
  export let placeholder = "Enter"
  export let value = null
  export let maxLength = null
  export let prefix = null
  export let suffix = null
  export let options = null
  export let nullValue = null
  export let autofocus = false

  let dropdownOpened = false
  let closeTimer = null

  const open = () => {
    clearTimeout(closeTimer)

    dropdownOpened = true
  }

  const close = () => closeTimer =
    setTimeout(() => dropdownOpened = false, 200)

  const change = (e) => {
    value = e.target.value
    if (checkEmpty(value)) value = nullValue

    dispatch("change", value)
  }

  const select = (e) => change({
    target: { value: e.detail }
  })

  const fireEnter = (e) => {
    if (e.key === "Enter") dispatch("enter")
  }

  onMount(() => {
    if (autofocus) tick().then(() => inputNode?.focus())
  })
</script>

<Container
  hui="TextInput"
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
  {#if prefix}
    <Strong>
      {prefix}
    </Strong>
  {/if}
  <input
    {name}
    on:click
    on:input
    on:input={change}
    on:change={change}
    {value}
    on:click={open}
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
    on:keydown={focusByArrows}
    on:keydown={fireEnter}
    on:keyup
    on:keydown
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
  />
  {#if suffix}
    <Strong>
      {suffix}
    </Strong>
  {/if}
  {#if !checkEmpty(options) && dropdownOpened}
    <Dropdown
      {options}
      selected={value}
      on:select={select}
      filter={value}
      root={inputNode?.parentElement}
      input={inputNode}
      active={dropdownOpened}
    />
  {/if}
</Container>

<!-- theme.ini
  themes: flat, medium, grow;
  & = common, display, flex, gap;
  > input = common;
  > input::placeholder = font-size, text-align;
-->
