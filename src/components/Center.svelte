<script>
  import Container from "./Container.svelte"

  const flex = {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  }
</script>

<Container
  hui="Center"
  {flex}
>
  <slot />
</Container>
