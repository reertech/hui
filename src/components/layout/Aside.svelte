<script>
  import "../../styles/layout/Aside.css"
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
  hui="Aside"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <aside>
    <slot />
  </aside>
</Container>

<!-- theme.ini
  > aside = common
-->

