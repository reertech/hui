<script>
  import "../../themes/controls/TextInput.css"
  import "../../styles/controls/TextInput.css"
  import Container from "../Container.svelte"

  import { tick, createEventDispatcher } from "svelte"
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
  <input
    {name}
    on:click
    on:input
    on:change
    bind:value
    {placeholder}
    {maxLength}
    type="text"
  />
</Container>

<!-- theme.ini
  & = common, display, flex, gap;
  > input = common;
  > input::placeholder = font-size;
-->
