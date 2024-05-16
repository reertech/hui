<script>
  import "../../styles/controls/Bar.css"
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
  hui="Bar"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <figure>
    <slot name="left" />
    <slot />
    <slot name="right" />
  </figure>
</Container>

<!-- theme.ini
  > figure = common
-->

