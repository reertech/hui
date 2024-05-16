<script>
  import "../../styles/controls/Button.css"
  import Container from "../Container.svelte"

  export let active
  export let disabled
  export let readonly
  export let hidden
  export let busy
  export let theme

  let classes
  export { classes as class }

  export let text = "Click me!"
</script>

<Container
  hui="Button"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <button
    on:click
    active={active || null}
    readonly={readonly || null}
    disabled={disabled || null}
  >
    {#if $$slots.default}
      <slot />
    {:else}
      {text}
    {/if}
  </button>
</Container>

<!--
<style>
  [data-hui=button] {
    font-size: var(--button-fs, var(--hui-control-button-font-size));
    font-weight: var(--button-fw, var(--hui-control-button-font-weight));

    color: var(--button-c, var(--hui-control-button-color));
    background-color: var(--button-bgc, var(--hui-control-button-background-color));
    background-image: var(--button-bgi, var(--hui-control-button-background-image));

    overflow: hidden;
    cursor: pointer;

    padding: var(--button-p,
      var(--button-pt, var(--hui-control-button-padding-top))
      var(--button-pr, var(--hui-control-button-padding-right))
      var(--button-pb, var(--hui-control-button-padding-bottom))
      var(--button-pl, var(--hui-control-button-padding-left)));

    margin: var(--button-m,
      var(--button-mt, var(--hui-control-button-margin-top))
      var(--button-mr, var(--hui-control-button-margin-right))
      var(--button-mb, var(--hui-control-button-margin-bottom))
      var(--button-ml, var(--hui-control-button-margin-left)));

    border-color: var(--button-brc,
      var(--button-btc, var(--hui-control-button-border-top-color))
      var(--button-brc, var(--hui-control-button-border-right-color))
      var(--button-bbc, var(--hui-control-button-border-bottom-color))
      var(--button-blc, var(--hui-control-button-border-left-color)));

    border-style: var(--button-brs,
      var(--button-bts, var(--hui-control-button-border-top-style))
      var(--button-brs, var(--hui-control-button-border-right-style))
      var(--button-bbs, var(--hui-control-button-border-bottom-style))
      var(--button-bls, var(--hui-control-button-border-left-style)));

    border-width: var(--button-brw,
      var(--button-btw, var(--hui-control-button-border-top-width))
      var(--button-brw, var(--hui-control-button-border-right-width))
      var(--button-bbw, var(--hui-control-button-border-bottom-width))
      var(--button-blw, var(--hui-control-button-border-left-width)));

    border-radius: var(--button-brw,
      var(--button-btw, var(--hui-control-button-border-top-radius))
      var(--button-brw, var(--hui-control-button-border-right-radius))
      var(--button-bbw, var(--hui-control-button-border-bottom-radius))
      var(--button-blw, var(--hui-control-button-border-left-radius)));

    box-shadow: var(--button-shd, var(--hui-control-button-box-shadow));
  }
  [data-hui=button]:hover {
    box-shadow: var(--button-hover-shd, var(--hui-control-button-hover-box-shadow));
    background-image: var(--button-hover-bgi, var(--hui-control-button-hover-background-image));
  }
  [data-hui=button]:active,
  [data-hui=button].active,
  [data-hui=button][active] {
    box-shadow: var(--button-active-shd, var(--hui-control-button-active-box-shadow));
    background-image: var(--button-active-bgi, var(--hui-control-button-active-background-image));
  }
  /*[data-hui=button]:focus {
    border-color: var(--button-focus-bgc, var(--hui-control-button-focus-border-color));
  }*/

  [data-hui=header][hidden]:not(#hack) {
    display: none;
  }

  :global([disabled]) [data-hui=button]:not(#hack),
  [data-hui=button][disabled]:not(#hack) {
    color: #fff;
    pointer-events: none;
  }

</style>
-->

<!-- theme.ini
  > button = common
-->
