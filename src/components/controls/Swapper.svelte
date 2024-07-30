<script>
  import "../../styles/controls/Swapper.css"
  import Container from "../Container.svelte"
  import DropZone from "./Swapper/DropZone.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let valid = null
  export let invalid = null
  export let theme = null
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

  export let list
  export let idx

  let onFly, isOver, element;

  const start = (e) => {
    onFly = true
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("huiSwapper", idx)
  }

  const end = () => onFly = false

  const enter = () => isOver = true

  const leave = (e) => {
    if (e.relatedTarget?.parentNode === element) return
    if (e.fromElement?.parentNode === element) return
    if (e.relatedTarget?.parentNode?.parentNode === element) return
    if (e.fromElement?.parentNode?.parentNode === element) return

    isOver = false
  }

  const swap = (e) => {
    list = e.detail
    isOver = false
  }
</script>

<Container
  hui="Swapper"
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
  {size}
  {position}
  {scrollX}
  {scrollY}
  {grid}
  {flex}
>
  {#if disabled}
    <slot />
  {:else}
    <button
      draggable="true"
      bind:this={element}
      style:opacity={onFly ? "0.5" : null}
      on:dragstart={start}
      on:dragend={end}
      on:dragleave={leave}
      on:dragenter={enter}
      on:dragover|preventDefault={() => false}
      on:drop|preventDefault|stopPropagation={leave}
    >
      <DropZone
        {idx}
        {list}
        on:swap
        dir="left"
        hidden={onFly || !isOver}
        on:swap={swap}
      />
        <slot />
      <DropZone
        {idx}
        {list}
        on:swap
        dir="right"
        hidden={onFly || !isOver}
        on:swap={swap}
      />
    </button>
  {/if}
</Container>

<!-- theme.ini
  > button = common, display;
  > button > [data-hui=SwapperDropZone] = common;
-->

