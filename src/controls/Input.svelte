<script>
  export let disabled = null
  export let hidden = null

  export let name = null
  export let value = null

  import Div from "../Div.svelte"

  let input, focused;

  const areas = [
    $$slots.left && "left",
    "input",
    $$slots.right && "right"
  ].filter(v => v)

  export let div = {
    areas: `"${areas.join(" ")}"`
  }
</script>

<Div
  hui="input"
  {...div}
  {focused}
  {disabled}
  {hidden}
>
  {#if $$slots.left}
    <div data-hui-slot="left">
      <slot name="left" />
    </div>
  {/if}
  <input
    bind:this={input}
    {name}
    {value}
    on:input
    on:change
    on:focus
    on:blur
    on:focus={() => focused = true}
    on:blur={() => focused = false}
  />
  {#if $$slots.right}
    <div data-hui-slot="right">
      <slot name="right" />
    </div>
  {/if}
</Div>

<style>
  :global([data-hui=input]) {
    grid-template-columns: var(--input-cs, var(--hui-control-input-grid-template-columns));

    padding: var(--input-p,
      var(--input-pt, var(--hui-control-input-padding-top))
      var(--input-pr, var(--hui-control-input-padding-right))
      var(--input-pb, var(--hui-control-input-padding-bottom))
      var(--input-pl, var(--hui-control-input-padding-left)));

    margin: var(--input-m,
      var(--input-mt, var(--hui-control-input-margin-top))
      var(--input-mr, var(--hui-control-input-margin-right))
      var(--input-mb, var(--hui-control-input-margin-bottom))
      var(--input-ml, var(--hui-control-input-margin-left)));

    border-color: var(--input-brc,
      var(--input-btc, var(--hui-control-input-border-top-color))
      var(--input-brc, var(--hui-control-input-border-right-color))
      var(--input-bbc, var(--hui-control-input-border-bottom-color))
      var(--input-blc, var(--hui-control-input-border-left-color)));

    border-style: var(--input-brs,
      var(--input-bts, var(--hui-control-input-border-top-style))
      var(--input-brs, var(--hui-control-input-border-right-style))
      var(--input-bbs, var(--hui-control-input-border-bottom-style))
      var(--input-bls, var(--hui-control-input-border-left-style)));

    border-width: var(--input-brw,
      var(--input-btw, var(--hui-control-input-border-top-width))
      var(--input-brw, var(--hui-control-input-border-right-width))
      var(--input-bbw, var(--hui-control-input-border-bottom-width))
      var(--input-blw, var(--hui-control-input-border-left-width)));

    border-radius: var(--input-brw,
      var(--input-btw, var(--hui-control-input-border-top-radius))
      var(--input-brw, var(--hui-control-input-border-right-radius))
      var(--input-bbw, var(--hui-control-input-border-bottom-radius))
      var(--input-blw, var(--hui-control-input-border-left-radius)));
  }
  
  :global([data-hui=input] > input) {
    grid-area: input;
    border: 0 none;
    outline: 0 none;
    padding: 3px 10px;
  }

  [data-hui-slot=left] {
    grid-area: left;
  }

  [data-hui-slot=right] {
    grid-area: right;
  }
</style>
