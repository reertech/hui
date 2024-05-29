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
  export let position = null
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

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
  {scrollX}
  {scrollY}
  {flex}
  {grid}
>
  <slot />
</Container>

<!-- theme.ini
  themes: low, medium, high;
  & = common, display;
-->
