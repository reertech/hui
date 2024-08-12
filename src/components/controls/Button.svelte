<script>
  import "../../themes/controls/Button.css"
  import "../../styles/controls/Button.css"
  import hui from "../../hui.js"

  export let name = null
  export let title = null
  export let text = "Click me!"
  export let node = null
</script>

<button
  use:hui={{
    tag: "Button",
    ...$$restProps
  }}
  {name}
  on:click
  bind:this={node}
  title={title || null}
  hidden={$$restProps.hidden || null && ""}
  active={$$restProps.active || null && ""}
  readonly={$$restProps.readonly || null && ""}
  disabled={$$restProps.disabled || null && ""}
  valid={$$restProps.valid || null && ""}
  invalid={$$restProps.invalid || null && ""}
>
  {#if $$slots.default}
    <slot />
  {:else}
    {text}
  {/if}
</button>

<!-- theme.ini
  states: active, disabled, readonly;
  themes: flat, small, round, icon;
  &
  | &:hover
  | &:active
  | &:focus = common;
  > svg = common, display, stroke, stroke-width;
-->
