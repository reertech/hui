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
  export let position = null
  export let classes = null
  export let grid = null
  export let flex = null
  export let scrollY = null
  export let scrollX = null

  const isValid = (value, allowed) => {
    switch (true) {
      case value == null: return false
      case typeof value === "object": return true
      case !["string", "boolean"].includes(typeof value): return false
      case allowed.includes(value): return true
      default: return false
    }
  }

  $: isGrid = !flex && isValid(grid, [true, "true"])
  $: isFlex = !grid && isValid(flex, [true, "true"])
  $: isPosition = isValid(position, ["static", "fixed", "relative", "sticky", "absolute"])
  $: isScroll = scrollX || scrollY

  $: g = !isGrid ? {} : { display: "grid", ...(typeof grid !== "object" ? {} : grid) }
  $: f = !isFlex ? {} : { display: "flex", ...(typeof flex !== "object" ? {} : flex) }

  $: p = !isPosition ? {} : typeof position == "string" ? { position } : position

  $: target = tag === null ? "child" : "self"
  $: isTargeted = isGrid || isFlex || isScroll || isPosition
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

  data-hui-target={isTargeted ? target : null}

  data-hui-scroll-x={scrollX || null}
  data-hui-scroll-y={scrollY || null}

  data-hui-grid={g.display || null}
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
  data-hui-flex-direction={f.direction || null}
  data-hui-flex-wrap={f.wrap || null}
  data-hui-flex-justify-content={f.justifyContent || null}
  data-hui-flex-align-items={f.alignItems || null}
  data-hui-flex-align-content={f.alignContent || null}

  data-hui-position={p.position || null}
  style:top={p.top || null}
  style:right={p.right || null}
  style:bottom={p.bottom || null}
  style:left={p.left || null}
  style:inset={p.inset || null}

  on:click
>
  {#if false}
    <pre>{JSON.stringify(flex, null, 2)}</pre>
  {/if}
  <slot />
</svelte:element>
