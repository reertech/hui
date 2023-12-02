<script>
  export let hui = null
  export let areas = null
  export let rows = null
  export let cols = null
  export let align = null
  export let justify = null

  export let active = null
  export let focused = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null

  let className = null
  export { className as class }

  let styleName = null
  export { styleName as style }

  console.log(areas)
</script>

<div
  data-hui={hui || null}
  focused={focused || null}
  active={active || null}
  disabled={disabled || null}
  hidden={hidden || null}
  invalid={invalid || null}
  valid={valid || null}
  class={className || null}
  style={styleName || null}
  style:grid-template-areas={areas}
  style:grid-template-columns={cols}
  style:grid-template-rows={rows}
  style:justify-items={justify}
  style:align-items={align}
>
  <slot />
</div>

<style>
  :where(div) {
    display: grid;
    grid-template-areas: none;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    justify-items: stretch;
    align-items: stretch;
    padding: 0;
    overflow: hidden;
  }
</style>
