<script>
  import "../../styles/controls/Input.css"
  import Container from "../Container.svelte"

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
  export let z = null
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let name = null
  export let value = null

  let input, focused;
</script>

<Container
  hui="Input"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {z}
  {idx}
  {size}
  {position}
  {scrollX}
  {scrollY}
  {grid}
  {flex}
>
  {#if $$slots.left}
    <slot name="left" />
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
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
  />
  {#if $$slots.right}
    <slot name="right" />
  {/if}
</Container>

<!--
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
-->

<!-- theme.ini
  > input = common;
-->
