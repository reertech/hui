<script>
  import "../../themes/controls/Textarea.css"
  import "../../styles/controls/Textarea.css"
  import Container from "../Container.svelte"
  import Overlay from "../Overlay.svelte"
  import Strong from "../typography/Strong.svelte"
  import Button from "../controls/Button.svelte"
  import IconMaximize from "../../icons/Maximize.svelte"
  import IconMinimize from "../../icons/Minimize.svelte"

  import { formatNumber, checkEmpty } from "../../helpers.js"
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

  export let name = null
  export let placeholder = null
  export let value = null
  export let maxLength = null
  export let rows = 1
  export let cols = 50
  export let expandedRows = 2
  export let expandedCols = 100
  export let expanded = false
  export let nullValue = null
  export let buttonTheme = "flat small"

  $: rowsNum = formatNumber(expanded ? expandedRows : rows, 1)
  $: colsNum = formatNumber(expanded ? expandedCols : cols, 50)

  $: themes = [
    expanded ? "expanded" : rowsNum === 1 ? "oneLine" : null,
    checkEmpty(theme) ? null : theme
  ].filter(v => v != null).join(" ")

  const change = (e) => {
    value = e.target.value
    if (checkEmpty(value)) value = nullValue

    dispatch("change", value)
  }

  const enter = (e) => {
    if (e.code === "Enter") dispatch("enter")
  }
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
  theme={themes}
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
  {value}
  {name}
>
  <textarea
    {name}
    on:click
    on:focus
    on:blur
    on:input
    on:input={change}
    on:change={change}
    {value}
    {placeholder}
    maxLength={formatNumber(maxLength)}
    rows={rowsNum}
    cols={formatNumber(cols, 50)}
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    on:keyup={enter}
    on:keydown
  />
  <Button
    theme={buttonTheme}
    on:click={() => expanded = !expanded}
  >
    {#if expanded}
      <IconMinimize />
    {:else}
      <IconMaximize />
    {/if}
  </Button>
</Container>

<!-- theme.ini
  themes: flat, oneLine;
  & = common, display, grid;
  > textarea, &::after = common, grid-area;
  > textarea = resize, overflow, max-height;
  &::after = content, visibility, display, max-height;
  > textarea::placeholder = font-size, text-align;
  > button[data-hui=Button] = cursor, layout-position, font-size;
-->
