<script>
  export let text = "button"
  export let hidden = null
  export let active = null
  export let disabled = null
</script>

<button
  on:click
  {hidden}
  {active}
  {disabled}
  data-hui-button
>
  {#if $$slots.default}
    <slot />
  {:else}
    {text}
  {/if}
</button>

<style>
  [data-hui-button][active] {
  }

  [data-hui-header][hidden]:not(#hack) {
    display: none;
  }

  :global([disabled]) [data-hui-button]:not(#hack),
  [data-hui-button][disabled]:not(#hack) {
    color: #fff;
    pointer-events: none;
  }

  [data-hui-button] {
    font-size: var(--button-fs, var(--hui-controls-button-font-size));
    font-weight: var(--button-fw, var(--hui-controls-button-font-weight));

    color: var(--button-c, var(--hui-controls-button-color));
    background-color: var(--button-bgc, var(--hui-controls-button-background-color));

    box-shadow: none;

    border-color: var(--button-brc,
      var(--button-btc, var(--hui-controls-button-border-top-color))
      var(--button-brc, var(--hui-controls-button-border-right-color))
      var(--button-bbc, var(--hui-controls-button-border-bottom-color))
      var(--button-blc, var(--hui-controls-button-border-left-color)));

    border-style: var(--button-brs,
      var(--button-bts, var(--hui-controls-button-border-top-style))
      var(--button-brs, var(--hui-controls-button-border-right-style))
      var(--button-bbs, var(--hui-controls-button-border-bottom-style))
      var(--button-bls, var(--hui-controls-button-border-left-style)));

    border-width: var(--button-brw,
      var(--button-btw, var(--hui-controls-button-border-top-width))
      var(--button-brw, var(--hui-controls-button-border-right-width))
      var(--button-bbw, var(--hui-controls-button-border-bottom-width))
      var(--button-blw, var(--hui-controls-button-border-left-width)));

    border-radius: var(--button-brw,
      var(--button-btw, var(--hui-controls-button-border-top-radius))
      var(--button-brw, var(--hui-controls-button-border-right-radius))
      var(--button-bbw, var(--hui-controls-button-border-bottom-radius))
      var(--button-blw, var(--hui-controls-button-border-left-radius)));

    padding: var(--button-p,
      var(--button-pt, var(--hui-controls-button-padding-top))
      var(--button-pr, var(--hui-controls-button-padding-right))
      var(--button-pb, var(--hui-controls-button-padding-bottom))
      var(--button-pl, var(--hui-controls-button-padding-left)));

    margin: var(--button-m,
      var(--button-mt, var(--hui-controls-button-margin-top))
      var(--button-mr, var(--hui-controls-button-margin-right))
      var(--button-mb, var(--hui-controls-button-margin-bottom))
      var(--button-ml, var(--hui-controls-button-margin-left)));
  }
</style>
