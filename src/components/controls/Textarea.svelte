<script>
  import "../../themes/controls/Textarea.css"
  import "../../styles/controls/Textarea.css"
  import Container from "../Container.svelte"
  import Overlay from "../Overlay.svelte"
  import Strong from "../typography/Strong.svelte"
  import Button from "../controls/Button.svelte"
  import IconMaximize from "../../icons/Maximize.svelte"
  import IconMinimize from "../../icons/Minimize.svelte"

  import { formatNumber, checkEmpty, composeKeys } from "../../helpers.js"
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
  export let autofocus = false
  export let newLineCtrlEnter = false

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

  const keyDown = async (e) => {
    if (!["Enter", "NumpadEnter"].includes(e.code)) return

    const compose = composeKeys(e)

    if (!newLineCtrlEnter) {
      if (expanded && !compose) e.stopPropagation()

      if (compose === "ctrl") {
        e.stopPropagation()
        e.preventDefault()
        expanded = !expanded
      }
    } else {
      if (!expanded || compose !== "ctrl") return

      e.preventDefault()
      e.stopPropagation()

      const i = e.target.selectionEnd
      const current = e.target.value ?? ""
      const value = current.substring(0, i) + "\n" + current.substring(i)

      change({ target: { value }})
      await tick()
      e.target.setSelectionRange(i + 1, i + 1)
    }
  }

  onMount(() => {
    if (autofocus) tick().then(() => inputNode?.focus())
  })
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
    on:keydown={keyDown}
    on:keyup
    on:keydown
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
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
  > button[data-hui=Button] = layout-position, font-size;
-->
