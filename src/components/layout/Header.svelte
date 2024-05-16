<script>
  import "../../styles/layout/Header.css"
  import Container from "../Container.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null

  let classes = null
  export { classes as class }
</script>

<Container
  hui="Header"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <header>
    {#if $$slots.left}
      <slot name="left" />
    {/if}
    <slot />
    {#if $$slots.right}
      <slot name="right" />
    {/if}
  </header>
</Container>

<!--
<style>
  [data-hui=header] {
    grid-area: var(--header-a, header);

    display: grid;
    gap: var(--header-g, var(--hui-layout-header-gap));
    grid-template-areas: "left";
    grid-auto-columns: left minmax(max-content, 1fr) center minmax(max-content, 2fr) right minmax(max-content, 1fr);
    grid-auto-flow: column;
    grid-auto-rows: 100%;
    align-items: center;

    overflow: hidden;

    box-shadow: var(--header-shd, var(--hui-layout-header-box-shadow));

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

    width: var(--header-h, var(--hui-layout-header-width));
    min-width: var(--header-mih, var(--header-h, var(--hui-layout-header-min-width)));
    max-width: var(--header-mah, var(--header-h, var(--hui-layout-header-max-width)));
    margin-top: 1rem;
    margin-right: auto;
    margin-left: auto;

    border-radius: var(--header-brw,
      var(--header-btw, var(--hui-layout-header-border-top-radius))
      var(--header-brw, var(--hui-layout-header-border-right-radius))
      var(--header-bbw, var(--hui-layout-header-border-bottom-radius))
      var(--header-blw, var(--hui-layout-header-border-left-radius)));

    color: var(--button-c, var(--hui-layout-header-color));
    background-color: var(--button-bgc, var(--hui-layout-header-background-color));
    background-image: var(--button-bgi, var(--hui-layout-header-background-image));
  }
</style>
-->

<!-- theme.ini
  > header = common
-->
