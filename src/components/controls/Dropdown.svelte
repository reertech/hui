<script>
  import "../../themes/controls/Dropdown.css"
  import "../../styles/controls/Dropdown.css"
  import Container from "../Container.svelte"

  import {
    calcCutParentOffset,
    buildFuzzyRegex,
    formatNumber
  } from "../../helpers.js"

  import { tick, createEventDispatcher, onMount } from "svelte"
  const dispatch = createEventDispatcher()

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
  export let margin = null
  export let padding = null
  export let bg = null
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let selected = []
  export let options = {}
  export let maxMaxHeight = 250
  export let filter = null
  export let root = null

  let dir = null
  let height = null

  $: rootEl = root || document.body
  $: calcOpenDir(active)

  $: maxHeight = Math.min(
    formatNumber(maxMaxHeight, 250),
    formatNumber(height, 250)
  )

  $: sizeParams = { maxHeight, ...size }
  $: dirTheme = dir === "top" ? "toTop" : "toBottom"
  $: themes = new Set(theme?.split(/\s+/)).add(dirTheme)
  $: themeString = [...themes].join(" ") || null
  
  $: filterRe = buildFuzzyRegex(filter)

  $: selectedArray = Array.isArray(selected) ? selected
    : selected == null ? [] : [selected]

  $: selectedSet = new Set(selectedArray)

  $: optionEntries = Array.isArray(options)
    ? options.map(o => [o, o])
    : Object.entries(options)

  $: optionsMap = new Map(optionEntries)
  $: valuesByLabel = new Map(optionEntries.map(([v, l]) => [l, v]))

  $: filteredOptions = optionEntries.filter(([v, l]) => {
    return !selectedSet.has(v) && (!filterRe || filterRe.test(l))
  })

  const select = (label) => {
    const value = valuesByLabel.get(label)
    if (!value) return

    dispatch("select", value)
  }

  const calcOpenDir = () => {
    const offset = calcCutParentOffset(rootEl)
    if (!offset) return dir = null; height = null

    if (offset.bottom >= offset.top) {
      height = offset.bottom - 10
      dir = "bottom"
    } else {
      height = offset.top - 10
      dir = "top"
    }
  }
</script>

{#if active && filteredOptions.length}
  <Container
    hui="Dropdown"
    tag="datalist"
    {active}
    {readonly}
    {disabled}
    {hidden}
    {valid}
    {invalid}
    {classes}
  {bg}
  {margin}
  {padding}
    {idx}
    {position}
    {scrollX}
    {scrollY}
    {grid}
    {flex}
    size={sizeParams}
    theme={themeString}
  >
    {#each filteredOptions as [value, label]}
      <option
        {value}
        on:click={() => select(label)}
      >
        {label}
      </option>
    {/each}
  </Container>
{/if}

<!-- theme.ini
  themes: flat, toTop, toBottom;
  & = common, display;
  > option = common, display;
  > option:hover = background-image;
  > option + option =
    border-top-color, border-top-style, border-top-width;
-->
