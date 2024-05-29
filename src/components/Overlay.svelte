<script>
  // import "../styles/Overlay.css"
  import Container from "./Container.svelte"

  export let tag = "div"
  export let flex = null
  export let grid = null
  export let fullscreen = false
  export let top = 0
  export let right = 0
  export let bottom = 0
  export let left = 0

  $: position = {
    position: fullscreen ? "absolute" : "fixed",
    top,
    right,
    bottom,
    left
  }
</script>

<Container
  hui="Overlay"
  {tag}
  {flex}
  {grid}
  {position}
>
  <slot />
</Container>
