<script>
  export let area
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

<header
  data-hui-header
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
  style:grid-template-areas={areas === "left" ? null : `"${areas}"`}
>
  <slot />
  <slot name="center" />
  <slot name="right" />
</header>

<style>
  [data-hui-header] {
    grid-area: var(--header-a, header);

    display: grid;
    gap: var(--header-g, var(--hui-layout-header-gap));
    grid-template-areas: "left";
    grid-auto-columns: var(--header-ac, minmax(min-content, 1fr));
    grid-auto-flow: column;
    grid-auto-rows: 100%;
    align-items: center;

    border: 2px solid green;

    height: var(--header-h, var(--hui-layout-header-height));
    line-height: var(--header-lh, var(--header-h, var(--hui-layout-header-line-height)));
    min-height: var(--header-mih, var(--header-h, var(--hui-layout-header-min-height)));
    max-height: var(--header-mah, var(--header-h, var(--hui-layout-header-max-height)));

    padding: var(--header-p,
      var(--header-pt, var(--hui-layout-header-padding-top))
      var(--header-pr, var(--hui-layout-header-padding-right))
      var(--header-pb, var(--hui-layout-header-padding-bottom))
      var(--header-pl, var(--hui-layout-header-padding-left)));

    margin: var(--header-m,
      var(--header-mt, var(--hui-layout-header-margin-top))
      var(--header-mr, var(--hui-layout-header-margin-right))
      var(--header-mb, var(--hui-layout-header-margin-bottom))
      var(--header-ml, var(--hui-layout-header-margin-left)));
  }
</style>
