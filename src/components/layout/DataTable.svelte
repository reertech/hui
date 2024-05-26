<script>
  import "../../themes/layout/DataTable.css"
  import "../../styles/layout/DataTable.css"
  import Container from "../Container.svelte"
  import Grid from "../Grid.svelte"
  import Table from "./Table.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
  export let grid = null
  export let flex = null

  let classes = null
  export { classes as class }

  export let cols = []
  export let rows = []
</script>

<Container
  hui="DataTable"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {valid}
  {invalid}
  {theme}
  {classes}
  {grid}
  {flex}
>
  <Table>
    <Grid
      tag="thead"
      templateColumns="subgrid"
      columnStart="1"
      columnEnd="-1"
    >
      {#if $$slots.thead}
        <slot name="thead" />
      {:else if $$slots.th}
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
            <th>
              <slot name="thFirst" />
            </th>
          {/if}
          {#each cols as col, colIdx}
            <th>
              <slot name="th" {col} {colIdx} />
            </th>
          {/each}
          {#if $$slots.thLast}
            <th>
              <slot name="thLast" />
            </th>
          {/if}
          {#if $$slots.thAfter}
            <slot name="thAfter" />
          {/if}
        </Grid>
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
                <td>
                  <slot name="tdFirst" {rowIdx} {row} />
                </td>
              {/if}
              {#each cols as col, colIdx}
                <td>
                  <slot name="td" {rowIdx} {row} {col} {colIdx} />
                </td>
              {/each}
              {#if $$slots.tdLast}
                <td>
                  <slot name="tdLast" {rowIdx} {row} />
                </td>
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
  </Table>
</Container>

<!-- theme.ini
  > data > table = common, grid;
  > data > table > tbody,
  > data > table > thead,
  > data > table > * > tr = common;
  > data > table > tbody > tr > td,
  > data > table > thead > tr > th = common, grid;
-->
