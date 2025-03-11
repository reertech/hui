<script>
  import "../../styles/controls/Badge.css"
  import "../../themes/controls/Badge.css"
  import Container from "../Container.svelte"

  export let tag = "strong"
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
  export let name = null

  let classes = null
  export { classes as class }
</script>

<Container
  hui="Badge"
  {tag}
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
  on:click
>
  <slot />
</Container>

<!-- theme.ini
  themes: small, button, inline;
  & = common, display;
  > svg = common, display, stroke, stroke-width;
-->
