<script>
  export let hidden = null
  export let disabled = null

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }

  export let areas = [
    $$slots.left && "left",
    $$slots.default && "default",
    $$slots.right && "right"
  ].filter(v => v).join(" ")
</script>

<figure
  data-hui="bar"
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
  style:grid-template-areas={areas === "default" ? null : `"${areas}"`}
>
  <slot name="left" />
  <slot />
  <slot name="right" />
</figure>

<style>
  [data-hui=bar] {
    display: grid;
    gap: 0;
    grid-template-areas: "default";
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    grid-auto-rows: 100%;
    align-items: center;
  }
  [data-hui=bar] :global([data-hui=button]:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  [data-hui=bar] :global([data-hui=button]:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
