<script>
  export let hidden = null
  export let disabled = null

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }
</script>

<h1
  data-hui=h1
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
>
  <slot />
</h1>

<style>
  [data-hui=h1] {
    font-weight: var(--h1-fw, var(--hui-typography-h1-font-weight));
    font-size: var(--h1-fs, var(--hui-typography-h1-font-size));

    padding: var(--h1-p,
      var(--h1-pt, var(--hui-typography-h1-padding-top))
      var(--h1-pr, var(--hui-typography-h1-padding-right))
      var(--h1-pb, var(--hui-typography-h1-padding-bottom))
      var(--h1-pl, var(--hui-typography-h1-padding-left)));

    margin: var(--h1-m,
      var(--h1-mt, var(--hui-typography-h1-margin-top))
      var(--h1-mr, var(--hui-typography-h1-margin-right))
      var(--h1-mb, var(--hui-typography-h1-margin-bottom))
      var(--h1-ml, var(--hui-typography-h1-margin-left)));
  }
</style>
