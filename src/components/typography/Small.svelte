<script>
  import "../../themes/typography/Small.css"
  import "../../styles/typography/Small.css"
  import Container from "../Container.svelte"

  export let tag = "small"
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
  export let z = null
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }
</script>

<Container
  hui="Small"
  {tag}
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {z}
  {idx}
  {size}
  {position}
  {scrollX}
  {scrollY}
  {grid}
  {flex}
>
  <slot />
</Container>

<!-- theme.ini
  & = common;
-->

