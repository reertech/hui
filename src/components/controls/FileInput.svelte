<script>
  import "../../themes/controls/FileInput.css"
  import "../../styles/controls/FileInput.css"
  import Strong from "../typography/Strong.svelte"
  import Container from "../Container.svelte"
  import IconPlus from "../../icons/Plus.svelte"

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

  let isHover = false

  $: themes = theme?.length
    ? isHover ? `hover ${theme}` : theme
    : isHover ? "hover" : null

  const change = (e) => {
    files = e.target.files

    if (!files?.length) files = nullValue

    dispatch("change", files)
  }

  const checkEvent = (e) =>
    e.dataTransfer.types.includes("Files")

  const dragenter = (e) => {
    isHover = checkEvent(e)
  }

  const dragleave = () => {
    isHover = false
  }

  const drop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    isHover = false

    if (!checkEvent(e)) return

    e.target.files = e.dataTransfer.files

    await tick()

    change(e)
  }

  const dragover = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
  }
</script>

<Container
  hui="FileInput"
  tag="fieldset"
  theme={themes}
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
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
    on:drop={drop}
    on:dragover={dragover}
    on:dragenter={dragenter}
    on:dragleave={dragleave}
  />
  {#if isHover}
    <Strong theme="small">
      drop
      <!--<IconPlus />-->
    </Strong>
  {/if}
</Container>

<!-- theme.ini
  themes: flat, hover;
  & = common, display, flex;
  > input = common;
  > input::placeholder = font-size, text-align;
  > input::file-selector-button = display;
-->
