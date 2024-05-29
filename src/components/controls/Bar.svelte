<script>
  import "../../styles/controls/Bar.css"
  import Container from "../Container.svelte"

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
  hui="Bar"
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
  {grid}
  {flex}
>
  <figure>
    <slot name="left" />
    <slot />
    <slot name="right" />
  </figure>
</Container>

<!-- theme.ini
  > figure = common;
-->

