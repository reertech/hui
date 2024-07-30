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

<div
  data-hui="SwapperDropZone"
  hidden={hidden}
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
