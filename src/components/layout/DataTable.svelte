<script>
  import "../../styles/layout/DataTable.css"
  import Container from "../Container.svelte"
  import Table from "./Table.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null

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
  {busy}
  {theme}
  {classes}
>
  <Table>
    <thead>
      {#if $$slots.thead}
        <slot name="thead" />
      {:else if $$slots.th}
        <tr>
          {#if $$slots.thBefore}
            <slot name="thBefore" />
          {/if}
          {#if $$slots.thFirst}
            <th>
              <slot name="thFirst" />
            </th>
          {/if}
          {#each cols as col}
            <th>
              <slot name="th" {col} />
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
        </tr>
      {/if}
    </thead>
    <tbody>
      {#if $$slots.tbody}
        <slot name="tbody" />
      {:else if $$slots.tr || $$slots.td}
        {#each rows as row}
          {#if $$slots.trBefore}
            <slot name="trBefore" {row} />
          {/if}
          <tr>
            {#if $$slots.tr}
              <slot name="tr" {row} />
            {:else if $$slots.td}
              {#if $$slots.tdBefore}
                <slot name="tdBefore" {row} />
              {/if}
              {#if $$slots.tdFirst}
                <td>
                  <slot name="tdFirst" {row} />
                </td>
              {/if}
              {#each cols as col}
                <td>
                  <slot name="td" {row} {col} />
                </td>
              {/each}
              {#if $$slots.tdLast}
                <td>
                  <slot name="tdLast" {row} />
                </td>
              {/if}
              {#if $$slots.tdAfter}
                <slot name="tdAfter" {row} />
              {/if}
            {/if}
          </tr>
          {#if $$slots.trAfter}
            <slot name="trAfter" {row} />
          {/if}
        {/each}
      {/if}
    </tbody>
  </Table>
</Container>

<!-- theme.ini
-->
