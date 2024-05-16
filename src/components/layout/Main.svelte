<script>
  import "../../styles/layout/Main.css"
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
