<script>
  import "../../themes/controls/FileInput.css"
  import "../../styles/controls/FileInput.css"
  import Container from "../Container.svelte"

  import { formatNumber, checkEmpty, composeKeys } from "../../helpers.js"
  import { createEventDispatcher, tick } from "svelte"
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
  export let files = null
  export let nullValue = null
  export let multiple = false
  export let accept = null

  const change = (e) => {
    files = e.target.files

    if (!files?.length) files = nullValue

    dispatch("change", files)
  }
</script>

<Container
  hui="FileInput"
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
  <input
    type="file"
    {name}
    on:click
    on:focus
    on:blur
    on:change={change}
    {files}
    {accept}
    {multiple}
    {placeholder}
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
  />
</Container>

<!-- theme.ini
  themes: flat;
  & = common;
  > input = common;
  > input::placeholder = font-size, text-align;
  > input::file-selector-button = display;
-->
