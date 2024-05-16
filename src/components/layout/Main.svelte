<script>
  import "../../styles/layout/Main.css"
  import Container from "../Container.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null

  let classes = null
  export { classes as class }
</script>

<Container
  hui="Main"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <main>
    <slot />
  </main>
</Container>

<!-- theme.ini
  > main = common
-->
