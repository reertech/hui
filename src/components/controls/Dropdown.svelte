<script>
  import "../../themes/controls/Dropdown.css"
  import "../../styles/controls/Dropdown.css"
  import Container from "../Container.svelte"

  import {
    scrollIntoViewIfNeeded,
    fetchCutParent,
    buildFuzzyRegex,
    formatNumber,
    composeKeys,
    isNumber,
    isArray
  } from "../../helpers.js"

  import { tick, createEventDispatcher, onMount, onDestroy } from "svelte"
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
  export let maxMaxHeight = 190
  export let filter = null
  export let input = null
  export let root = null
  export let anchor = "--hui-dropdown"

  let focus = null
  let dir = null
  let height = null

  let datalist, cutParent, bound;

  $: open(active, datalist, root)

  $: maxHeight = Math.min(
    formatNumber(maxMaxHeight, 190),
    formatNumber(height, 190)
  )

  $: sizeParams = { maxHeight, ...size }
  $: positionParams = { anchor, ...position }
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

  const gap = 10
  const offset = 2

  const reposition = () => open(active, datalist, root)

  const open = (active, datalist, root) => {
    if (!datalist || !root) return
    if (!active) return datalist.hidePopover()

    const rect = root.getBoundingClientRect()
    const distanceTop = rect.top
    const distanceBottom = window.innerHeight - rect.bottom

    const supportsAnchor = CSS.supports(
      "position-anchor: --fake-anchor"
    )

    // Flip up only when the list does not fit below, not merely when there
    // happens to be more room above: comparing the two distances makes every
    // field past the middle of the window open over the rows above it.
    const wanted = formatNumber(maxMaxHeight, 190) + gap
    const toBottom = distanceBottom >= wanted || distanceBottom >= distanceTop

    if (toBottom) {
      height = distanceBottom - gap
      dir = "bottom"
    } else {
      height = distanceTop - gap
      dir = "top"
    }

    // Anchor positioning keeps the list glued to the root, but the direction
    // and the max height still have to be recalculated as the page moves.
    if (!bound) {
      bound = true
      cutParent = fetchCutParent(root)

      cutParent?.addEventListener("scroll", reposition, { passive: true })
      window.addEventListener("resize", reposition, { passive: true })
    }

    if (!supportsAnchor) {
      datalist.style.width = `${rect.width}px`
      datalist.style.left = `${rect.left}px`

      if (toBottom) {
        datalist.style.bottom = "auto"
        datalist.style.top = `${rect.bottom + offset}px`
      } else {
        datalist.style.top = "auto"
        datalist.style.bottom = `${window.innerHeight - rect.top + offset}px`
      }
    }

    if (!datalist.matches(":popover-open")) {
      datalist.showPopover({ source: root })
    }
  }

  const showFocusedOption = async () => {
    if (focus == null || datalist == null) return
    await tick()
    const option = datalist.querySelector("[data-hui-focused]")
    scrollIntoViewIfNeeded(option)
  }

  function keyDown(e) {
    const compose = composeKeys(e)

    if (!compose && ["ArrowUp", "ArrowDown"].includes(e.code)) {
      const newFocus = isNumber(focus)
        ? e.code === "ArrowUp" ? focus - 1 : focus + 1
        : e.code === "ArrowDown" ? 0 : filteredOptionsCount - 1

      if (newFocus < 0 || newFocus > filteredOptionsCount - 1) return

      focus = newFocus
      showFocusedOption()
    } else if (!compose && isNumber(focus) && ["NumpadEnter", "Enter", "Tab"].includes(e.code)) {
      // e.stopPropagation()
      select(focus)
    } else if (compose === "ctrl" && isNumber(focus) && ["NumpadEnter", "Enter"].includes(e.code)) {
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

  onDestroy(() => {
    cutParent?.removeEventListener("scroll", reposition)
    window.removeEventListener("resize", reposition)
  })
</script>

<script context="module">
  export const focusByArrows = (e, anyKey) => {
    if (!anyKey && !["ArrowUp", "ArrowDown"].includes(e.code)) return
    e.target.click()
  }

  export const generateAnchor = () => {
    const key = crypto.randomUUID().slice(0, 8)

    return `--hui-dropdown-${key}`
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
    {scrollX}
    {scrollY}
    {grid}
    {flex}
    popover="manual"
    position={positionParams}
    size={sizeParams}
    bind:node={datalist}
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
  & = common, display, position-anchor;
  > option = common, display;
  > option:hover,
  > option[data-hui-focused] = background-image;
  > option + option =
    border-top-color, border-top-style, border-top-width;
-->
