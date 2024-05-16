<script>
  import "../../styles/layout/Nav.css"
  import Container from "../Container.svelte"

  export let active
  export let readonly
  export let disabled
  export let hidden
  export let busy
  export let theme

  let classes
  export { classes as class }
</script>

<Container
  hui="Nav"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <nav>
    <slot />
  </nav>
</Container>

<!-- theme.ini
  > nav = common
-->
