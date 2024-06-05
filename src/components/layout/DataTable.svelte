<script>
  import "../../themes/layout/DataTable.css"
  import "../../styles/layout/DataTable.css"
  import Container from "../Container.svelte"
  import Grid from "../Grid.svelte"
  import Flex from "../Flex.svelte"

  import { onMount, tick } from "svelte"

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

  export let cols = []
  export let rows = []

  export let thTop = true
  export let thBottom = true
  export let colsWidth = null

  let colsRealWidth = []

  const buildWidth = (value) => {
    switch (typeof value) {
      case "number": return `minmax(${value}px, max-content)`
      case "string": return value
      default: return "max-content"
    }
  }

  const widthDedup = (acc, value, idx, array) => {
    if (!idx || array[idx - 1] !== value) return [...acc, value]

    let prev = acc.pop()

    if (typeof prev === "object") {
      prev.count += 1
    } else {
      prev = { count: 2, value }
    }

    return [...acc, prev]
  }

  const calcColsRealWidth = async () => {
    await tick()

    const thCols = document.querySelectorAll("tr > th[data-hui-idx]")

    colsRealWidth = [...thCols].map(th => th.offsetWidth)
  }

  $: isCustomWidth = Array.isArray(colsWidth) &&
    colsWidth.length === cols.length

  $: colsTemplate = !isCustomWidth
    ? `repeat(${cols.length}, max-content)`
    : colsWidth.map(buildWidth).reduce(widthDedup, []).map(w => {
      if (typeof w !== "object") return w
      return `repeat(${w.count}, ${w.value})`
    }).join(" ")

  $: templateColumns = [
    $$slots.tdFirst && "max-content",
    colsTemplate,
    $$slots.tdLast && "max-content"
  ].filter(s => s).join(" ")

  $: calcColsRealWidth(cols, colsWidth)
  onMount(calcColsRealWidth)
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
>
    <Grid
      tag="thead"
      templateColumns="subgrid"
      columnStart="1"
      columnEnd="-1"
    >
      {#if $$slots.thead}
        <slot name="thead" />
      {:else if $$slots.th}
        {#if thTop && $$slots.thTop}
          <Grid
            tag="tr"
            templateColumns="subgrid"
            columnStart="1"
            columnEnd="-1"
          >
            {#if $$slots.thTopBefore}
              <slot name="thTopBefore" />
            {/if}
            {#if $$slots.thTopFirst}
              <Flex tag="th">
                <slot name="thTopFirst" />
              </Flex>
            {/if}
            {#each cols as col, colIdx}
              <Flex tag="th">
                <slot
                  name="thTop"
                  {col}
                  {colIdx}
                  colWidth={colsRealWidth[colIdx]}
                />
              </Flex>
            {/each}
            {#if $$slots.thTop}
              <Flex tag="th">
                <slot name="thTopLast" />
              </Flex>
            {/if}
            {#if $$slots.thTopAfter}
              <slot name="thTopAfter" />
            {/if}
          </Grid>
        {/if}
        <Grid
          tag="tr"
          templateColumns="subgrid"
          columnStart="1"
          columnEnd="-1"
        >
          {#if $$slots.thBefore}
            <slot name="thBefore" />
          {/if}
          {#if $$slots.thFirst}
            <Flex tag="th">
              <slot name="thFirst" />
            </Flex>
          {/if}
          {#each cols as col, colIdx}
            <Flex tag="th" idx={colIdx}>
              <slot
                name="th"
                {col}
                {colIdx}
                colWidth={colsRealWidth[colIdx]}
              />
            </Flex>
          {/each}
          {#if $$slots.thLast}
            <Flex tag="th">
              <slot name="thLast" />
            </Flex>
          {/if}
          {#if $$slots.thAfter}
            <slot name="thAfter" />
          {/if}
        </Grid>
        {#if thBottom && $$slots.thBottom}
          <Grid
            tag="tr"
            templateColumns="subgrid"
            columnStart="1"
            columnEnd="-1"
          >
            {#if $$slots.thBottomBefore}
              <slot name="thBottomBefore" />
            {/if}
            {#if $$slots.thBottomFirst}
              <Flex tag="th">
                <slot name="thBottomFirst" />
              </Flex>
            {/if}
            {#each cols as col, colIdx}
              <Flex tag="th">
                <slot
                  name="thBottom"
                  {col}
                  {colIdx}
                  colWidth={colsRealWidth[colIdx]}
                />
              </Flex>
            {/each}
            {#if $$slots.thBottomBottom}
              <Flex tag="th">
                <slot name="thBottomBottom" />
              </Flex>
            {/if}
            {#if $$slots.thBottomAfter}
              <slot name="thBottomAfter" />
            {/if}
          </Grid>
        {/if}
      {/if}
    </Grid>
    <Grid
      tag="tbody"
      templateColumns="subgrid"
      columnStart="1"
      columnEnd="-1"
    >
      {#if $$slots.tbody}
        <slot name="tbody" />
      {:else if $$slots.tr || $$slots.td}
        {#each rows as row, rowIdx}
          {#if $$slots.trBefore}
            <slot name="trBefore" {rowIdx} {row} />
          {/if}
          <Grid
            tag="tr"
            templateColumns="subgrid"
            columnStart="1"
            columnEnd="-1"
          >
            {#if $$slots.tr}
              <slot name="tr" {rowIdx} {row} />
            {:else if $$slots.td}
              {#if $$slots.tdBefore}
                <slot name="tdBefore" {rowIdx} {row} />
              {/if}
              {#if $$slots.tdFirst}
                <Flex tag="td">
                  <slot name="tdFirst" {rowIdx} {row} />
                </Flex>
              {/if}
              {#each cols as col, colIdx}
                <Flex tag="td">
                  <slot name="td" {rowIdx} {row} {col} {colIdx} />
                </Flex>
              {/each}
              {#if $$slots.tdLast}
                <Flex tag="td">
                  <slot name="tdLast" {rowIdx} {row} />
                </Flex>
              {/if}
              {#if $$slots.tdAfter}
                <slot name="tdAfter" {rowIdx} {row} />
              {/if}
            {/if}
          </Grid>
          {#if $$slots.trAfter}
            <slot name="trAfter" {rowIdx} {row} />
          {/if}
        {/each}
      {/if}
    </Grid>
</Container>

<!-- theme.ini
  & = common, grid;
   > tbody,
   > thead,
   > * > tr = common, grid;
   > tbody = overflow-y;
   > tbody > tr > td = common;
   > thead > tr > th = common;
   > tbody > tr:nth-child(odd) > td = background-color;
   > tbody > tr > td + td =
    border-left-width,
    border-left-style,
    border-left-color;
   > tbody > tr + tr,  > thead + tbody =
    border-top-width,
    border-top-style,
    border-top-color;
-->
