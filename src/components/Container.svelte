<script>
  import "../styles/Container.css"

  export let hui = null
  export let tag = "data"
  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null
  export let classes = null
</script>

<svelte:element
  this={tag}
  data-hui-data
  data-hui={hui || null}
  data-hui-active={active || null}
  data-hui-disabled={disabled || null}
  data-hui-readonly={readonly || null}
  data-hui-busy={busy || null}
  data-hui-theme={theme || null}
  class={classes || null}
  hidden={hidden || null}
>
  <slot />
</svelte:element>
