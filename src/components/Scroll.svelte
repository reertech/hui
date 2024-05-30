<script>
  import Container from "./Container.svelte"

  export let tag = "div"
  export let idx = null
  export let x = null
  export let y = null
</script>

<Container
  hui="Scroll"
  {tag}
  {idx}
  scrollX={x}
  scrollY={y}
>
  <slot />
</Container>
