<script>
  import "../../styles/controls/Swapper.css"
  import Container from "../Container.svelte"

  export let active = null
  export let readonly = null
  export let disabled = null
  export let hidden = null
  export let busy = null
  export let theme = null

  let classes = null
  export { classes as class }

  export let list = []
  export let i

  let button, onFly, left, top;

  const start = (e) => {
    // onFly = true
    // moveAt(e)
  }

  const stop = () => {
    // onFly = false
  }

  const move = (e) => {
    if (!onFly) return
    // console.log(e.clientX, e.pageX)
    // moveAt(e)
  }

  const moveAt = (e) => {
    left = e.clientX - button.offsetWidth / 2
    top = e.clientY - button.offsetHeight / 2
  }
</script>

<svelte:document
  on:mousemove={move}
/>

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
    style:position={onFly ? "fixed" : null}
    style:zIndex={onFly ? "100" : null}
    style:left={onFly ? `${left}px` : null}
    style:top={onFly ? `${top}px` : null}
    bind:this={button}
    on:dragstart={start}
    on:dragend={stop}
    on:dragend={console.log}
    on:dragstart={console.log}
    on:dragover={console.log}
    on:dragenter={console.log}
    on:dragleave={console.log}
  >
    {#if onFly}
      {`<${top}:${left}>`}
    {:else}
      {"<>"}
    {/if}
  </button>
</Container>

<style>
  button {
    display: block;
    width: 100px;
    height: 50px;
    background: #999;
    margin: 10px;
    text-align: center;
  }
</style>

<!-- theme.ini
  > button = common, grid
-->

