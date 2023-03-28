<script>
  export let hidden = null
  export let disabled = null

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }
</script>

<main
  data-hui-main
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
>
  <slot />
</main>

<style>
  [data-hui-main] {
    padding: var(--main-p,
      var(--main-pt, var(--hui-layout-main-padding-top))
      var(--main-pr, var(--hui-layout-main-padding-right))
      var(--main-pb, var(--hui-layout-main-padding-bottom))
      var(--main-pl, var(--hui-layout-main-padding-left)));

    margin: var(--main-m,
      var(--main-mt, var(--hui-layout-main-margin-top))
      var(--main-mr, var(--hui-layout-main-margin-right))
      var(--main-mb, var(--hui-layout-main-margin-bottom))
      var(--main-ml, var(--hui-layout-main-margin-left)));
  }
</style>
