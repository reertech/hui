<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let idx
  export let dir
  export let list
  export let hidden

  let isOver;
  let dropZone;

  const calcQuadrant = (e, data) => {
    if (!dropZone) return {}

    const rect = dropZone.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const h = x < rect.width / 2 ? "left" : "right"
    const v = y < rect.height / 2 ? "top" : "bottom"

    return { quadrant: { h, v }, data }
  }

  const drop = (e) => {
    const oldIdx = +e.dataTransfer.getData("huiSwapper")

    if (isNaN(oldIdx)) return

    const [replaced] = list.splice(oldIdx, 1)

    let newIdx = idx
    if (dir === "left") newIdx -= 1
    if (oldIdx > idx) newIdx += 1

    list.splice(newIdx, 0, replaced)

    dispatch("drop", calcQuadrant(e, replaced))
    dispatch("swap", list)

    return isOver = false
  }

  const leave = () => isOver = false
  const enter = () => isOver = true
</script>

<div
  data-hui="SwapperDropZone"
  hidden={hidden}
  bind:this={dropZone}
  style:opacity={isOver ? null : "0.3"}
  on:drop|preventDefault|stopPropagation={drop}
  on:dragleave
  on:dragenter
  on:dragleave={leave}
  on:dragenter={enter}
  on:dragover|preventDefault={() => false}
>
  &nbsp;
</div>
