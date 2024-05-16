<script>
  import "../../styles/layout/Article.css"
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
  hui="Article"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <article>
    <slot />
  </article>
</Container>

<!-- theme.ini
  > article = common
-->
