<script>
  import "../../themes/controls/Dropdown.css"
  import "../../styles/controls/Dropdown.css"
  import Container from "../Container.svelte"

  import { calcCutParentOffset, buildFuzzyRegex } from "../../helpers.js"
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
  export let scrollX = null
  export let scrollY = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let selected = []
  export let options = {}
  export let filter = null
  export let root = null

  let params = null

  $: sizeParams = { height: params?.height ?? null, ...size }
  $: dirTheme = params?.dir === "top" ? "toTop" : "toBottom"
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

  $: rootEl = root || document.body

  const select = async (label) => {
    const value = valuesByLabel.get(label)
    if (!value) return

    await tick()

    dispatch("select", value)
  }

  const calcOpenDir = () => {
    const offset = calcCutParentOffset(rootEl)
    const result = { dir: null, height: null }

    if (!offset) return params = result

    if (offset.bottom >= offset.top) {
      result.height = offset.bottom - 5
    } else {
      result.height = offset.top - 5
      result.dir = "top"
    }

    return params = result
  }

  $: { calcOpenDir(active) }
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
        {@html label}
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
