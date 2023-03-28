<script>
  export let primary
  export let secondary
  export let text
  export let outline
  export let disabled
  export let hidden
</script>

<button
  on:click
  class:outline
  class:primary
  class:secondary
  {hidden}
  {disabled}
>
  {#if text}
    {text}
  {:else}
    <slot />
  {/if}
</button>

<style>
  button.primary {
    background-color: var(--hui-control-button-background-color);
    border: 2px solid green;
  }
</style>
