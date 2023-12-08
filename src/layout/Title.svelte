<script>
  export let hidden
</script>

<strong
  {hidden}
  data-hui=title
>
  <slot />
</strong>

<style>
  [data-hui=title] {
    display: block;
    overflow: hidden;
    font-weight: var(--title-fw, var(--hui-layout-title-font-weight));
  }
  [data-hui=title][hidden] {
    display: none;
  }
</style>
