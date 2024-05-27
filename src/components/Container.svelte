<script>
  import "../styles/Container.css"

  export let hui = null
  export let tag = null
  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
  export let classes = null
  export let grid = null
  export let flex = null
  export let scrollY = null
  export let scrollX = null

  $: target = tag === null ? "child" : "self"
  $: isGrid = !flex && grid && typeof grid === "object"
  $: isFlex = !grid && flex && typeof flex === "object"
  $: isScroll = scrollX || scrollY
  $: g = !isGrid ? {} : { display: "grid", ...grid }
  $: f = !isFlex ? {} : { display: "flex", ...flex }
</script>

<svelte:element
  this={tag || "data"}
  data-hui={hui || null}

  data-hui-theme={theme || null}
  data-hui-active={(active || null) && ""}
  data-hui-disabled={(disabled || null) && ""}
  data-hui-readonly={(readonly || null) && ""}
  data-hui-valid={(valid || null) && ""}
  data-hui-invalid={(invalid || null) && ""}

  class={classes || null}
  hidden={hidden || null}

  data-hui-scroll-x={scrollX || null}
  data-hui-scroll-y={scrollY || null}
  data-hui-scroll-target={isScroll && target || null}

  data-hui-grid={g.display || null}
  data-hui-grid-target={isGrid && target || null}
  data-hui-grid-justify-items={g.justifyItems || null}
  data-hui-grid-align-items={g.alignItems || null}
  data-hui-grid-justify-content={g.justifyContent || null}
  data-hui-grid-align-content={g.alignContent || null}
  data-hui-grid-auto-flow={g.autoFlow || null}
  style:grid-template-rows={g.templateRows || null}
  style:grid-template-columns={g.templateColumns || null}
  style:grid-column-start={g.columnStart || null}
  style:grid-column-end={g.columnEnd || null}
  style:grid-row-start={g.rowStart || null}
  style:grid-row-end={g.rowEnd || null}
  style:grid-template-areas={g.templateAreas || null}
  style:row-gap={g.rowGap || null}
  style:column-gap={g.columnGap || null}
  style:grid-auto-rows={g.autoRows || null}
  style:grid-auto-columns={g.autoColumns || null}

  data-hui-flex={f.display || null}
  data-hui-flex-target={isFlex && target || null}
  data-hui-flex-direction={f.direction || null}
  data-hui-flex-wrap={f.wrap || null}
  data-hui-flex-justify-content={f.justifyContent || null}
  data-hui-flex-align-items={f.alignItems || null}
  data-hui-flex-align-content={f.alignContent || null}
>
  {#if false && isGrid}
    <pre>{JSON.stringify(g, null, 2)}</pre>
  {/if}
  <slot />
</svelte:element>
