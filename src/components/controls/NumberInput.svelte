<script>
  import "../../themes/controls/NumberInput.css"
  import "../../styles/controls/NumberInput.css"
  import Container from "../Container.svelte"
  import Strong from "../typography/Strong.svelte"

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
  export let step = null
  export let min = null
  export let max = null
  export let prefix = null
  export let suffix = null
  export let nullValue = null

  const change = (e) => {
    value = e.target.valueAsNumber
    if (isNaN(value)) value = nullValue

    dispatch("change", value)
  }

  const enter = (e) => {
    if (e.code === "Enter") dispatch("enter")
  }
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
>
  {#if prefix}
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
    on:focus
    on:blur
    on:input
    on:input={change}
    on:change={change}
    {value}
    {placeholder}
    type="number"
    valid={valid || null}
    invalid={invalid || null}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
    on:keyup={enter}
  />
  {#if suffix}
    <Strong>
      {suffix}
    </Strong>
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex;
  > input = common;
  > input::placeholder = font-size;
-->
