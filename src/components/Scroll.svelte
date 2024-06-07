<script>
  import Container from "./Container.svelte"

  export let tag = "div"
  export let idx = null
  export let x = null
  export let y = null
  export let bg = null
  export let size = null
  export let margin = null
  export let padding = null
  export let position = null
</script>

<Container
  hui="Scroll"
  {tag}
  {idx}
  scrollX={x}
  scrollY={y}
  {bg}
  {margin}
  {padding}
  {size}
  {position}
>
  <slot />
</Container>
