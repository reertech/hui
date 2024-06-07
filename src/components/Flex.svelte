<script>
  import Container from "./Container.svelte"

  export let tag = "div"
  export let idx = null
  export let display = "flex"
  export let direction = null
  export let wrap = null
  export let justifyContent = null
  export let alignItems = null
  export let alignContent = null
  export let gap = null
  export let rowGap = null
  export let columnGap = null
  export let bg = null
  export let size = null
  export let margin = null
  export let scrollX = null
  export let scrollY = null
  export let position = null

  $: flex = {
    display,
    direction,
    wrap,
    justifyContent,
    alignItems,
    alignContent,
    gap,
    rowGap,
    columnGap
  }
</script>

<Container
  hui="Flex"
  {tag}
  {idx}
  {flex}
  {bg}
  {margin}
  {size}
  {position}
  {scrollX}
  {scrollY}
>
  <slot />
</Container>
