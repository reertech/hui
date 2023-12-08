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
    grid-auto-flow: column;
    grid-auto-rows: 100%;
    grid-template-areas: var(--bar-ta, var(--hui-control-bar-template-areas));
    grid-auto-columns: var(--bar-ac, var(--hui-control-bar-auto-columns));
    align-items: var(--bar-ai, var(--hui-control-bar-align-items));
    gap: var(--bar-g, var(--hui-control-bar-gap));
  }
  [data-hui=bar] :global([data-hui=button]:not(:last-child)) {
    border-top-right-radius: 1px;
    border-bottom-right-radius: 1px;
  }
  [data-hui=bar] :global([data-hui=button]:not(:first-child)) {
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
  }
</style>
