<script>
  import "../../themes/layout/Panel.css"
  import "../../styles/layout/Panel.css"
  import Container from "../Container.svelte"

  export let tag = "div"
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
  export let order = null

  let classes = null
  export { classes as class }
</script>

<Container
  hui="Panel"
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
  {flex}
  {grid}
  {order}
>
  <slot />
</Container>

<!-- theme.ini
  themes: flat, low, medium, high, bg, fade;
  & = common, display, opacity;
-->
