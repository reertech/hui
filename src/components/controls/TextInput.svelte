<script>
  import "../../themes/controls/TextInput.css"
  import "../../styles/controls/TextInput.css"
  import Container from "../Container.svelte"
  import Strong from "../typography/Strong.svelte"
  import Dropdown from "./Dropdown.svelte"

  import { checkEmpty } from "../../helpers.js"

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
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let name = null
  export let placeholder = null
  export let value = null
  export let maxLength = null
  export let prefix = null
  export let suffix = null
  export let options = null

  let dropdownOpened = false
  let closeTimer = null
  let input = null

  const open = () => {
    clearTimeout(closeTimer)

    dropdownOpened = true
  }

  const close = () => {
    closeTimer = setTimeout(() => dropdownOpened = false, 200)
  }
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
  {idx}
  {size}
  {position}
  {scrollX}
  {scrollY}
  {grid}
  {flex}
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
    on:change
    bind:value
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
  />
  {#if suffix}
    <Strong>
      {suffix}
    </Strong>
  {/if}
  {#if !checkEmpty(options) && dropdownOpened}
    <!-- <pre>{JSON.stringify(options)}</pre> -->
    <Dropdown
      {options}
      selected={value}
      on:select={console.log}
      on:select={(e) => value = e.detail}
      filter={value}
      root={input?.parentElement}
      active={dropdownOpened}
    />
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex, gap;
  > input = common;
  > input::placeholder = font-size, text-align;
-->
