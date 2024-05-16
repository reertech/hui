<script>
  export let hidden = null
  export let disabled = null

  export let areas

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }

  /* AREAS */
  const defaultAreas = '"header" "main" "footer"'

  const withSides = (slot, area, a, b) => !$$slots[slot] ? null : [
    $$slots.aside && (a || area || slot),
    area || slot,
    $$slots.bside && (b || area || slot)
  ].filter(v => v).join(" ")

  $: withoutSlots = ["default", ""].some(v => v === Object.keys($$slots).toString())

  $: currentAreas = areas ? areas : withoutSlots ? defaultAreas : [
    withSides("header"),
    withSides("default", "main", "aside", "bside"),
    withSides("footer")
  ].filter(v => v).map(v => `"${v}"`).join(" ")
</script>

<div
  data-hui="Root"
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
  style:grid-template-areas={currentAreas === defaultAreas ? null : currentAreas}
>
  {#if withoutSlots}
    <slot />
  {:else}
    {#if $$slots.header}
      <div data-slot-header>
        <slot name="header" />
      </div>
    {/if}
    {#if $$slots.aside}
      <div data-slot-aside>
        <slot name="aside" />
      </div>
    {/if}
    <div data-slot-main>
      <slot />
    </div>
    {#if $$slots.bside}
      <div data-slot-bside>
        <slot name="bside" />
      </div>
    {/if}
    {#if $$slots.footer}
      <div data-slot-footer>
        <slot name="footer" />
      </div>
    {/if}
  {/if}
</div>

<style>
  [data-hui-root] {
    position: fixed;
    top: var(--root-t, var(--hui-layout-root-top));
    right: var(--root-r, var(--hui-layout-root-right));
    bottom: var(--root-b, var(--hui-layout-root-bottom));
    left: var(--root-l, var(--hui-layout-root-left));

    display: grid;
    grid-template-areas: "header" "main" "footer";

    padding: var(--root-p,
      var(--root-pt, var(--hui-layout-root-padding-top))
      var(--root-pr, var(--hui-layout-root-padding-right))
      var(--root-pb, var(--hui-layout-root-padding-bottom))
      var(--root-pl, var(--hui-layout-root-padding-left)));
  }
  div > div {
    display: contents;
  }
  div[data-slot-header] {
    grid-area: header;
  }
  div[data-slot-aside] {
    grid-area: aside;
  }
  div[data-slot-main] {
    grid-area: main;
  }
  div[data-slot-bside] {
    grid-area: bside;
  }
  div[data-slot-footer] {
    grid-area: footer;
  }
</style>
