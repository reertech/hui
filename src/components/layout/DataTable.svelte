<script>
  import "../../themes/layout/DataTable.css"
  import "../../styles/layout/DataTable.css"
  import Container from "../Container.svelte"
  import { isObject, checkEmpty } from "../../helpers.js"

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

  export let node = null
  export let tbodyNode = null

  let classes = null
  export { classes as class }

  export let cols = []
  export let rows = []

  export let colsWidth = null
  export let colsActive = {}
  export let colsFilter = {}
  export let showInactiveCols = false
  export let showFilteredCols = false

  const buildWidth = (value) => {
    switch (typeof value) {
      case "number": return `minmax(${value}px, max-content)`
      case "string": return value
      default: return "max-content"
    }
  }

  const check = (entries, entry) =>
    !isObject(entries) ? null : entries[entry]

  const colWidthBuilder = (acc, c) => {
    if (!check(colsActive, c) || check(colsFilter, c)) return acc
    acc.push(buildWidth(check(colsWidth, c)))
    return acc
  }

  $: colsTemplate = !isObject(colsWidth)
    ? `repeat(${cols.length}, max-content)`
    : cols.reduce(colWidthBuilder, []).join(" ")

  $: templateColumns = [
    $$slots.tdFirst && "max-content",
    colsTemplate,
    $$slots.tdLast && "max-content"
  ].filter(s => s).join(" ")
</script>

<Container
  tag="table"
  hui="DataTable"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {bg}
  {margin}
  {padding}
  {idx}
  {size}
  {position}
  {scrollX}
  {scrollY}
  {flex}
  grid={{
    templateColumns,
    ...grid
  }}
  bind:node
>
  <thead>
    <tr>
      {#if $$slots.thBefore}
        <slot name="thBefore" />
      {/if}
      {#if $$slots.thFirst || $$slots.tdFirst}
        <th>
          <slot name="thFirst" />
        </th>
      {/if}
      {#each cols as col, colIdx}
        {#if (showInactiveCols || check(colsActive, col)) && !check(colsFilter, col)}
          <th data-hui-idx={colIdx}>
            <slot name="th" {col} {colIdx} />
          </th>
        {/if}
      {/each}
      {#if $$slots.thLast || $$slots.tdLast}
        <th>
          <slot name="thLast" />
        </th>
      {/if}
      {#if $$slots.thAfter}
        <slot name="thAfter" />
      {/if}
    </tr>
  </thead>
  <tbody bind:this={tbodyNode}>
    {#each rows as row, rowIdx}
      {#if $$slots.trBefore}
        <slot name="trBefore" {rowIdx} {row} />
      {/if}
      <tr>
        {#if $$slots.tr}
          <slot name="tr" {rowIdx} {row} />
        {:else if $$slots.td}
          {#if $$slots.tdBefore}
            <slot name="tdBefore" {rowIdx} {row} />
          {/if}
          {#if $$slots.tdFirst || $$slots.thFirst}
            <td>
              <slot name="tdFirst" {rowIdx} {row} />
            </td>
          {/if}
          {#each cols as col, colIdx}
            {@const inactive = !showInactiveCols && !check(colsActive, col)}
            {@const filtered = !showFilteredCols && check(colsFilter, col)}
            {#if !inactive && !filtered}
              <td data-hui-idx={colIdx}>
                <slot name="td" {rowIdx} {row} {col} {colIdx} />
              </td>
            {/if}
          {/each}
          {#if $$slots.tdLast || $$slots.thLast}
            <td>
              <slot name="tdLast" {rowIdx} {row} />
            </td>
          {/if}
          {#if $$slots.tdAfter}
            <slot name="tdAfter" {rowIdx} {row} />
          {/if}
        {/if}
      </tr>
      {#if $$slots.trAfter}
        <slot name="trAfter" {rowIdx} {row} />
      {/if}
    {/each}
  </tbody>
</Container>

<!-- theme.ini
  & = common, grid;
   > tbody,
   > thead,
   > * > tr = common, grid, display;
   > tbody > tr > td = common, flex, display;
   > thead > tr > th = common, flex, display;
   > tbody > tr:nth-child(odd),
   > tbody > tr:nth-child(odd) > td = background-color;
   > tbody =
     min-height,
     overflow-y,
     scrollbar-gutter,
     border-bottom-width,
     border-bottom-style,
     border-bottom-color;
   > tbody > tr > td + td =
     border-left-width,
     border-left-style,
     border-left-color;
   > tbody > tr + tr,  > thead + tbody =
     border-top-width,
     border-top-style,
     border-top-color;
-->
