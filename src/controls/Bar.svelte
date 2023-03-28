<script>
  export let hidden = null
  export let disabled = null

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }

  export let areas = [
    $$slots.default && "left",
    $$slots.center && "center",
    $$slots.right && "right"
  ].filter(v => v).join(" ")
</script>

<figure
  data-hui-bar
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
  style:grid-template-areas={areas === "left" ? null : `"${areas}"`}
>
  <slot />
  <slot name="center" />
  <slot name="right" />
</figure>

<style>
  [data-hui-bar] {
    display: grid;
    gap: 4px;
    grid-template-areas: "left";
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    grid-auto-rows: 100%;
    align-items: center;
  }
</style>
