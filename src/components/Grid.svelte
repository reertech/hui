<script>
  import Container from "./Container.svelte"

  export let tag = "div"
  export let idx = null
  export let display = "grid"
  export let templateAreas = null
  export let templateRows = null
  export let templateColumns = null
  export let columnStart = null
  export let columnEnd = null
  export let rowStart = null
  export let rowEnd = null
  export let rowGap = null
  export let columnGap = null
  export let justifyItems = null
  export let alignItems = null
  export let justifyContent = null
  export let alignContent = null
  export let autoColumns = null
  export let autoRows = null
  export let autoFlow = null
  export let bg = null
  export let size = null
  export let margin = null
  export let padding = null
  export let scrollX = null
  export let scrollY = null
  export let position = null

  $: grid = {
    display,
    templateAreas,
    templateRows,
    templateColumns,
    columnStart,
    columnEnd,
    rowStart,
    rowEnd,
    rowGap,
    columnGap,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    autoFlow,
    autoRows,
    autoColumns
  }
</script>

<Container
  hui="Grid"
  {tag}
  {idx}
  {grid}
  {bg}
  {margin}
  {padding}
  {size}
  {position}
  {scrollX}
  {scrollY}
>
  <slot />
</Container>
