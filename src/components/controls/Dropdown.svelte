<script>
  import "../../themes/controls/Dropdown.css"
  import "../../styles/controls/Dropdown.css"
  import Container from "../Container.svelte"

  import {
    calcCutParentOffset,
    buildFuzzyRegex,
    formatNumber,
    composeKeys,
    isNumber,
    isArray
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
  export let input = null
  export let root = null

  let focus = null
  let dir = null
  let height = null

  let datalist;

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

  $: filteredOptions = optionEntries.filter(([v, l]) =>
    !selectedSet.has(v) && (!filterRe || filterRe.test(l)))

  $: filteredOptionsCount = filteredOptions.length

  const select = (idx) => {
    const value = filteredOptions.at(idx)
    if (!isArray(value)) return

    dispatch("select", value.at(0))
  }

  const calcOpenDir = () => {
    const offset = calcCutParentOffset(rootEl)
    if (!offset) return dir = height = null

    if (offset.bottom >= offset.top) {
      height = offset.bottom - 10
      dir = "bottom"
    } else {
      height = offset.top - 10
      dir = "top"
    }
  }

  const showFocusedOption = async () => {
    if (focus == null || datalist == null) return
    await tick()
    const option = datalist.querySelector("[data-hui-focused]")
    option?.scrollIntoView({ block: "center" })
  }

  function keyDown(e) {
    if (composeKeys(e) !== "") return

    if (["ArrowUp", "ArrowDown"].includes(e.code)) {
      const newFocus = isNumber(focus)
        ? e.code === "ArrowUp" ? focus - 1 : focus + 1
        : e.code === "ArrowDown" ? 0 : filteredOptionsCount - 1

      if (newFocus < 0 || newFocus > filteredOptionsCount - 1) return

      focus = newFocus
      showFocusedOption()
    } else if (isNumber(focus) && e.code === "Enter") {
      e.stopPropagation()
      select(focus)
    }
  }

  const resetFocus = () => focus = null

  $: resetFocus(filteredOptionsCount)

  onMount(() => {
    if (!input) return

    input.addEventListener("keydown", keyDown)

    return () => input.removeEventListener("keydown", keyDown)
  })
</script>

<script context="module">
  export const focusByArrows = (e, anyKey) => {
    if (!anyKey && !["ArrowUp", "ArrowDown"].includes(e.code)) return
    e.target.click()
  }
</script>

{#if active && filteredOptionsCount}
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
    bind:node={datalist}
    size={sizeParams}
    theme={themeString}
  >
    {#each filteredOptions as [value, label], idx}
      <option
        {value}
        {label}
        data-hui-focused={focus === idx ? "" : null}
        on:click={() => select(idx)}
      />
    {/each}
  </Container>
{/if}

<!-- theme.ini
  themes: flat, toTop, toBottom;
  & = common, display;
  > option = common, display;
  > option:hover,
  > option[data-hui-focused] = background-image;
  > option + option =
    border-top-color, border-top-style, border-top-width;
-->
