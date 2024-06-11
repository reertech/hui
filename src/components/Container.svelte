<script>
  import "../styles/Container.css"
  import { formatPx, formatNumber, isString } from "../helpers.js"

  export let hui = null
  export let tag = null
  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
  export let idx = null
  export let size = null
  export let position = null
  export let margin = null
  export let padding = null
  export let bg = null
  export let classes = null
  export let grid = null
  export let flex = null
  export let scrollY = null
  export let scrollX = null
  export let value = null

  export let node = null

  const isValid = (value, allowed) => {
    switch (true) {
      case value == null: return false
      case typeof value === "object": return true
      case allowed == null: return false
      case !["string", "boolean"].includes(typeof value): return false
      case allowed === "string" && isString(value): return true
      case allowed.includes(value): return true
      default: return false
    }
  }

  $: isSize = isValid(size)
  $: isBg = isValid(bg, "string")
  $: isMargin = isValid(margin, "string")
  $: isPadding = isValid(padding, "string")
  $: isGrid = !flex && isValid(grid, [true, "true", "default"])
  $: isFlex = !grid && isValid(flex, [true, "true", "default"])
  $: isPosition = isValid(position, ["static", "fixed", "relative", "sticky", "absolute"])
  $: isScroll = scrollX || scrollY

  $: g = !isGrid ? {} : { display: "grid", ...(typeof grid !== "object" ? {} : grid) }
  $: f = !isFlex ? {} : { display: "flex", ...(typeof flex !== "object" ? {} : flex) }

  $: l = !isPosition ? {} : isString(position) ? { position } : position
  $: m = !isMargin ? {} : isString(margin) ? { margin } : margin
  $: p = !isPadding ? {} : isString(padding) ? { padding } : padding
  $: b = !isBg ? {} : isString(bg) ? { color: bg } : bg
  $: s = !isSize ? {} : size

  $: target = tag === null ? "child" : "self"
  $: isTargeted = isGrid || isFlex || isScroll || isPosition || isSize ||
    isMargin || isPadding || isBg
</script>

{#if tag === "data"}
  <data
    data-hui={hui || null}
    data-hui-tag={tag || "data"}
    bind:this={node}

    data-hui-theme={theme || null}
    data-hui-active={(active || null) && ""}
    data-hui-disabled={(disabled || null) && ""}
    data-hui-readonly={(readonly || null) && ""}
    data-hui-valid={(valid || null) && ""}
    data-hui-invalid={(invalid || null) && ""}

    class={classes || null}
    hidden={hidden || null}

    data-hui-target={isTargeted ? target : null}
    data-hui-idx={idx ?? null}
    data-hui-value={value ?? null}

    data-hui-scroll-x={scrollX || null}
    data-hui-scroll-y={scrollY || null}

    style:background-color={b.color || null}
    style:background-image={b.image || null}
    style:background-position={b.position || null}

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
    style:grid-auto-rows={g.autoRows || null}
    style:grid-auto-columns={g.autoColumns || null}

    data-hui-flex={f.display || null}
    data-hui-flex-direction={f.direction || null}
    data-hui-flex-wrap={f.wrap || null}
    data-hui-flex-justify-content={f.justifyContent || null}
    data-hui-flex-align-items={f.alignItems || null}
    data-hui-flex-align-content={f.alignContent || null}

    style:gap={f.gap || g.gap || null}
    style:row-gap={f.rowGap || g.rowGap || null}
    style:column-gap={f.columnGap || g.columnGap || null}

    data-hui-position={l.position || null}
    data-hui-z={formatNumber(l.z)}
    style:inset={formatPx(l.inset)}
    style:top={formatPx(l.top)}
    style:right={formatPx(l.right)}
    style:bottom={formatPx(l.bottom)}
    style:left={formatPx(l.left)}

    style:width={formatPx(s.width)}
    style:min-width={formatPx(s.minWidth)}
    style:max-width={formatPx(s.maxWidth)}
    style:height={formatPx(s.height)}
    style:min-height={formatPx(s.minHeight)}
    style:max-height={formatPx(s.maxHeight)}

    style:margin={formatPx(m.margin)}
    style:margin-top={formatPx(m.top)}
    style:margin-right={formatPx(m.right)}
    style:margin-bottom={formatPx(m.bottom)}
    style:margin-left={formatPx(m.left)}

    style:padding={formatPx(p.padding)}
    style:padding-top={formatPx(p.top)}
    style:padding-right={formatPx(p.right)}
    style:padding-bottom={formatPx(p.bottom)}
    style:padding-left={formatPx(p.left)}

    on:click
    on:mouseup
    on:mousedown
    on:keypress
  >
    <slot />
  </data>
{:else}
  <svelte:element
    this={tag || "data"}
    data-hui={hui || null}
    bind:this={node}

    data-hui-theme={theme || null}
    data-hui-active={(active || null) && ""}
    data-hui-disabled={(disabled || null) && ""}
    data-hui-readonly={(readonly || null) && ""}
    data-hui-valid={(valid || null) && ""}
    data-hui-invalid={(invalid || null) && ""}

    class={classes || null}
    hidden={hidden || null}

    data-hui-target={isTargeted ? target : null}
    data-hui-idx={idx ?? null}
    data-hui-value={value ?? null}

    data-hui-z={formatNumber(l.z)}
    data-hui-scroll-x={scrollX || null}
    data-hui-scroll-y={scrollY || null}

    style:background-color={b.color || null}
    style:background-image={b.image || null}
    style:background-position={b.position || null}

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
    style:grid-auto-rows={g.autoRows || null}
    style:grid-auto-columns={g.autoColumns || null}

    data-hui-flex={f.display || null}
    data-hui-flex-direction={f.direction || null}
    data-hui-flex-wrap={f.wrap || null}
    data-hui-flex-justify-content={f.justifyContent || null}
    data-hui-flex-align-items={f.alignItems || null}
    data-hui-flex-align-content={f.alignContent || null}

    style:gap={f.gap || g.gap || null}
    style:row-gap={f.rowGap || g.rowGap || null}
    style:column-gap={f.columnGap || g.columnGap || null}

    data-hui-position={l.position || null}
    style:inset={formatPx(l.inset)}
    style:top={formatPx(l.top)}
    style:right={formatPx(l.right)}
    style:bottom={formatPx(l.bottom)}
    style:left={formatPx(l.left)}

    style:width={formatPx(s.width)}
    style:min-width={formatPx(s.minWidth)}
    style:max-width={formatPx(s.maxWidth)}
    style:height={formatPx(s.height)}
    style:min-height={formatPx(s.minHeight)}
    style:max-height={formatPx(s.maxHeight)}

    style:margin={formatPx(m.margin)}
    style:margin-top={formatPx(m.top)}
    style:margin-right={formatPx(m.right)}
    style:margin-bottom={formatPx(m.bottom)}
    style:margin-left={formatPx(m.left)}

    style:padding={formatPx(p.padding)}
    style:padding-top={formatPx(p.top)}
    style:padding-right={formatPx(p.right)}
    style:padding-bottom={formatPx(p.bottom)}
    style:padding-left={formatPx(p.left)}

    on:click
    on:mouseup
    on:mousedown
    on:keypress
  >
    <slot />
  </svelte:element>
{/if}
