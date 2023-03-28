<script>
  export let hidden = null
  export let disabled = null

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }
</script>

<nav
  data-hui-nav
  hidden={hidden || null}
  disabled={disabled || null}
  class={className || null}
  style={styleName || null}
>
  <slot />
</nav>

<style>
  [data-hui-nav] {
    padding: var(--nav-p,
      var(--nav-pt, var(--hui-layout-nav-padding-top))
      var(--nav-pr, var(--hui-layout-nav-padding-right))
      var(--nav-pb, var(--hui-layout-nav-padding-bottom))
      var(--nav-pl, var(--hui-layout-nav-padding-left)));

    margin: var(--nav-m,
      var(--nav-mt, var(--hui-layout-nav-margin-top))
      var(--nav-mr, var(--hui-layout-nav-margin-right))
      var(--nav-mb, var(--hui-layout-nav-margin-bottom))
      var(--nav-ml, var(--hui-layout-nav-margin-left)));
  }
</style>
