<script>
  import "../../styles/layout/Footer.css"
  import Container from "../Container.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }
</script>

<Container
  hui="Footer"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {grid}
  {flex}
>
  <footer>
    <slot />
  </footer>
</Container>

<!-- theme.ini
  > footer = common;
-->

