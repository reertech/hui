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

  $: params = {
    display,
    direction,
    wrap,
    justifyContent,
    alignItems,
    alignContent
  }
</script>

<Container
  hui="Flex"
  {tag}
  {idx}
  flex={params}
>
  <slot />
</Container>
