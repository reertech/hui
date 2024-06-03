<script>
  import "../../themes/controls/Textarea.css"
  import "../../styles/controls/Textarea.css"
  import Container from "../Container.svelte"

  import { formatNumber } from "../../helpers.js"

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
  export let rows = 1
  export let cols = 50
</script>

<Container
  hui="Textarea"
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
  <textarea
    {name}
    on:click
    on:input
    on:change
    bind:value
    on:focus
    on:blur
    {placeholder}
    maxLength={formatNumber(maxLength)}
    rows={formatNumber(rows, 1)}
    cols={formatNumber(cols, 50)}
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
  />
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex, gap;
  > textarea = common;
  > textarea[rows=1] = common;
  > textarea::placeholder = font-size, text-align;
-->
