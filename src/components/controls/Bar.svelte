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

