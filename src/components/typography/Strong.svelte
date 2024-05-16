<script>
  import "../../styles/typography/Strong.css"
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
  hui="Strong"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <strong>
    <slot />
  </strong>
</Container>

<!-- theme.ini
  > strong = common
-->
