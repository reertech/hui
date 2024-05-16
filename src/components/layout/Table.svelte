<script>
  import "../../styles/layout/Table.css"
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
  hui="Table"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <table>
    <slot />
  </table>
</Container>


