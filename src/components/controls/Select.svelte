<script>
  import "../../themes/controls/Select.css"
  import "../../styles/controls/Select.css"
  import Container from "../Container.svelte"
  import Badge from "../controls/Badge.svelte"
  import { calcCutParentOffset } from "../../helpers.js"

  import { checkEmpty, buildFuzzyRegex } from "../../helpers.js"
  import { tick, createEventDispatcher } from "svelte"
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

  export let name
  export let selected = []
  export let options = {}
  export let label = null
  export let maxValues = 1
  export let placeholder = +maxValues === 1 ? "" : "Add"

  let search = null
  let opened = false
  let closeTimer = null
  let searchInput;

  $: root = searchInput && searchInput.parentElement

  $: selectedArray = Array.isArray(selected) ? selected
    : selected == null ? [] : [selected]

  $: selectedSet = new Set(selectedArray)

  $: labelRe = buildFuzzyRegex(search)

  $: optionEntries = Array.isArray(options)
    ? options.map(o => [o, o])
    : Object.entries(options)

  $: optionsMap = new Map(optionEntries)
  $: valuesByLabel = new Map(optionEntries.map(([v, l]) => [l, v]))

  $: filteredOptions = optionEntries.filter(([v, l]) => {
    return !selectedSet.has(v) && (!labelRe || labelRe.test(l))
  })

  $: maxValuesInt = +maxValues || 1
  $: isMulti = maxValuesInt > 1
  $: maxPossibleValues = Math.min(maxValuesInt, optionEntries.length)
  $: isFull = selectedSet.size >= maxPossibleValues

  const open = () => {
    clearTimeout(closeTimer)

    opened = calcOpenDir()
  }

  const close = () => {
    closeTimer = setTimeout(() => opened = false, 200)
  }

  const commit = async () => {
    await tick()

    selected = isMulti
      ? [...selectedSet].slice(-maxValuesInt)
      : [...selectedSet].at(-1) || null

    dispatch("select", selected)
  }

  const select = async (label) => {
    const value = valuesByLabel.get(label)
    if (!value) return

    opened = false
    selectedSet.add(value)

    await commit()
    search = null
  }

  const remove = async (value) => {
    selectedSet.delete(value)

    await commit()

    if (!isMulti) searchInput.focus()
  }

  const calcOpenDir = () => {
    const offset = calcCutParentOffset(root)
    const result = { dir: "bottom", height: null }

    if (!offset) return result

    if (offset.bottom >= offset.top) {
      result.height = offset.bottom - 5
    } else {
      result.height = offset.top - 5
      result.dir = "top"
    }

    return result
  }

  /* $: { select(search) } ??? */
</script>

<Container
  hui="Select"
  tag="fieldset"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {idx}
  {size}
  {position}
  {scrollX}
  {scrollY}
  {grid}
  {flex}
>
  {#if label || $$slots.label}
    <legend>
      <label>
        {opened}
        {#if label}{label}{/if}
        <slot name="label" />
        <input
          {name}
          hidden
          value={isMulti ? JSON.stringify(selected) : selected}
        />
      </label>
    </legend>
  {/if}

  {#each selectedArray as value}
    <Badge
      tag="button"
      theme="small"
      on:click={() => remove(value)}
    >
      {@html optionsMap.get(value)}
    </Badge>
  {/each}
  <input
    bind:this={searchInput}
    bind:value={search}
    on:focus={open}
    on:blur={close}
    {placeholder}
    hidden={isFull}
    active={active || null}
    disabled={disabled || null}
    readonly={readonly || null}
  />

  {#if opened && filteredOptions.length}
    <datalist
      class:toTop={opened && opened.dir === "top"}
      style:height={opened && opened.height}
    >
      {#each filteredOptions as [value, label]}
        <option
          {value}
          on:click={() => select(label)}
        >
          {@html label}
        </option>
      {/each}
    </datalist>
  {/if}
</Container>

<!-- theme.ini
  themes: flat;
  & = common, display, flex, gap;
  > button = flex-grow, cursor;
  > datalist = common, display;
  > datalist.toTop = top, bottom;
  > datalist > option = common, display;
  > datalist > option:hover = background-image;
  > input = common;
  > datalist > option + option =
    border-top-color, border-top-style, border-top-width;
-->
