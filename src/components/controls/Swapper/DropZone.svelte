<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let idx
  export let dir
  export let list
  export let hidden

  let isOver;

  const drop = (e) => {
    const oldIdx = +e.dataTransfer.getData("huiSwapper")

    if (isNaN(oldIdx)) return

    const [replaced] = list.splice(oldIdx, 1)

    let newIdx = idx
    if (dir === "left") newIdx -= 1
    if (oldIdx > idx) newIdx += 1

    list.splice(newIdx, 0, replaced)

    dispatch("swap", list)

    return isOver = false
  }

  const leave = () => isOver = false
  const enter = () => isOver = true
</script>

{#if !hidden}
  <div
    style:opacity={isOver ? null : 0}
    on:drop|preventDefault|stopPropagation={drop}
    on:dragleave={leave}
    on:dragenter={enter}
    on:dragover|preventDefault={() => false}
  >
    &nbsp;
  </div>
{/if}

<style>
  div {
    position: absolute !important;
    top: 0 !important;
    bottom: 0 !important;
    text-align: center !important;
    line-height: 100% !important;
    width: 33% !important;
    height: 100% !important;
    background: #0000004f !important;
  }
  div:first-child {
    left: 0 !important;
    right: 33% !important;
  }
  div:last-child {
    left: 77% !important;
    right: 100% !important;
  }
</style>
