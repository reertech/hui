<script>
  import "../../styles/layout/Title.css"
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
  hui="Title"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <title>
    <slot />
  </title>
</Container>

<!-- theme.ini
  > title = common
-->

