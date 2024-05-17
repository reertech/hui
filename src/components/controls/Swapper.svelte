<script>
  import "../../styles/controls/Swapper.css"
  import Container from "../Container.svelte"
  import DropZone from "./Swapper/DropZone.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null

  let classes = null
  export { classes as class }

  export let list
  export let idx

  let onFly;

  const start = (e) => {
    onFly = true
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("huiSwapper", idx)
  }

  const end = () => onFly = false
  const leave = () => isOver = false
</script>

<Container
  hui="Swapper"
  {active}
  {readonly}
  {disabled}
  {hidden}
  {busy}
  {theme}
  {classes}
>
  <button
    draggable="true"
    style:opacity={onFly ? "0.5" : null}
    on:dragstart={start}
    on:dragend={end}
    on:dragover|preventDefault={() => false}
  >
    <DropZone
      {idx}
      {list}
      on:swap
      dir="left"
      hidden={onFly}
      on:swap={(e) => list = e.detail}
    />
      <slot />
    <DropZone
      {idx}
      {list}
      on:swap
      dir="right"
      hidden={onFly}
      on:swap={(e) => list = e.detail}
    />
  </button>
</Container>

<style>
  button {
    position: relative !important;
    width: 100px !important;
    margin: 10px !important;
    display: block !important;
    height: 50px !important;
    text-align: center !important;
  }
  button:active {
  }
</style>

<!-- theme.ini
  > button:active = common
  > button = common
  > div = common
-->

