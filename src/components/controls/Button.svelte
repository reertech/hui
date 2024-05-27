<script>
  import "../../themes/controls/Button.css"
  import "../../styles/controls/Button.css"
  import Container from "../Container.svelte"

  export let active = null
  export let disabled = null
  export let readonly = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let text = "Click me!"
</script>

<Container
  hui="Button"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {grid}
  {flex}
>
  <button
    on:click
    active={active || null}
    readonly={readonly || null}
    disabled={disabled || null}
    valid={valid || null}
    invalid={invalid || null}
  >
    {#if $$slots.default}
      <slot />
    {:else}
      {text}
    {/if}
  </button>
</Container>

<!-- theme.ini
  themes: flat;
  > button
  | > button:hover
  | > button:active
  | > button:focus = common;
-->
