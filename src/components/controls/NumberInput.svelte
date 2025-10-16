<script>
  import "../../themes/controls/NumberInput.css"
  import "../../styles/controls/NumberInput.css"
  import Container from "../Container.svelte"
  import Strong from "../typography/Strong.svelte"

  import { isNumber, isString } from "../../helpers.js"

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
  export let step = null
  export let min = null
  export let max = null
  export let prefix = null
  export let suffix = null
  export let nullValue = null
  export let autofocus = false
  export let stringify = false

  const parseNumber = (value) => {
    if (value == null) return nullValue
    if (isString(value) && !value.trim()) return nullValue

    const num = +value

    return isNaN(num) ? nullValue : num
  }

  const toString = (value) =>
    isNumber(value) ? value.toString() : value

  const assignInputValue = (inputNode, value) => {
    if (!inputNode) return

    const newValue = parseNumber(value)
    const oldValue = parseNumber(inputNode.value)

    if (newValue !== oldValue) {
      inputNode.value = toString(newValue)
    }
  }

  $: assignInputValue(inputNode, value)

  const preventWrongInput = (e) => {
    if (e.inputType === "insertText") {
      const currentValue = e.target.value || ""

      if (currentValue.length && e.data === "-") {
        return e.preventDefault()
      }

      if (e.data === "." && currentValue.includes(".")) {
        return e.preventDefault()
      }

      if (!/[\d\-\.]/.test(e.data)) {
        return e.preventDefault()
      }
    }

    if (e.inputType === "insertFromPaste") {
      if (!/^\s*-?\s*\d+\s*(\.\s*\d+)?\s*$/.test(e.data)) {
        return e.preventDefault()
      }
    }
  }

  const handleRange = (val) => {
    if (!isNumber(val)) return val

    const fixInput = (val) => {
      inputNode.value = val.toString()
      return val
    }

    if (isNumber(max) && val > max) return fixInput(max)
    if (isNumber(min) && val < min) return fixInput(min)

    return val
  }

  const change = (e) => {
    const val = handleRange(parseNumber(e.target.value))
    const returnValue = stringify ? toString(val) : val

    dispatch(e.type, value = returnValue)
  }

  onMount(() => {
    if (autofocus) tick().then(() => inputNode?.focus())
  })
</script>

<Container
  hui="NumberInput"
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
  {#if $$slots.prefix}
    <slot name="prefix" />
  {:else if prefix != null}
    <Strong>
      {prefix}
    </Strong>
  {/if}
  <input
    {name}
    {min}
    {max}
    {step}
    on:click
    on:change={change}
    on:input={change}
    on:beforeinput={preventWrongInput}
    type="text"
    inputmode="decimal"
    {placeholder}
    valid={!!valid || null}
    invalid={!!invalid || null}
    active={!!active || null}
    disabled={!!disabled || null}
    readonly={!!readonly || null}
    on:keyup
    on:keydown
    on:blur
    on:focus
    data-hui-input
    bind:this={inputNode}
  />
  {#if $$slots.suffix}
    <slot name="suffix" />
  {:else if suffix != null}
    <Strong>
      {suffix}
    </Strong>
  {/if}
</Container>

<!-- theme.ini
  states: disabled, readonly;
  themes: flat, medium, grow;
  & = common, display, flex;
  > input = common;
  > input::placeholder = font-size, color;
-->
