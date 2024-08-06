<script>
  export let hidden = null
  export let disabled = null
</script>

<div
  data-hui="Root"
  hidden={hidden || null}
  disabled={disabled || null}
>
  <slot />
</div>
