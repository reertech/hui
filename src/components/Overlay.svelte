<script>
  // import "../styles/Overlay.css"
  import Container from "./Container.svelte"

  import { onMount } from "svelte"

  export let tag = "div"
  export let idx = null
  export let flex = null
  export let grid = null
  export let fullscreen = false
  export let top = 0
  export let right = 0
  export let bottom = 0
  export let left = 0
  export let inset = 0
  export let height = null
  export let width = null

  let currentOverflow;

  const fixBodyStyles = (isDestroy) => {
    if (fullscreen && !isDestroy) {
      currentOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
    }

    if (currentOverflow != null && !fullscreen || isDestroy) {
      document.body.style.overflow = currentOverflow
      currentOverflow = null
    }
  }

  $: position = {
    position: fullscreen ? "fixed" : "absolute",
    top,
    right,
    bottom,
    left,
    inset
  }

  $: size = { height, width }

  onMount(() => {
    fixBodyStyles()
    return () => fixBodyStyles("destroy")
  })
</script>

<Container
  hui="Overlay"
  {idx}
  {tag}
  {flex}
  {grid}
  {position}
  {size}
>
  <slot />
</Container>
