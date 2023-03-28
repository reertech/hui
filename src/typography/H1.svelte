<script>
</script>

<h1 data-hui-h1>
  <slot />
</h1>

<style>
  h1 {
    font-weight: var(--h1-fw, var(--hui-typography-h1-font-weight));
    font-size: var(--h1-fs, var(--hui-typography-h1-font-size));

    padding: var(--h1-p,
      var(--h1-pt, var(--hui-typography-h1-padding-top))
      var(--h1-pr, var(--hui-typography-h1-padding-right))
      var(--h1-pb, var(--hui-typography-h1-padding-bottom))
      var(--h1-pl, var(--hui-typography-h1-padding-left)));

    margin: var(--h1-m,
      var(--h1-mt, var(--hui-typography-h1-margin-top))
      var(--h1-mr, var(--hui-typography-h1-margin-right))
      var(--h1-mb, var(--hui-typography-h1-margin-bottom))
      var(--h1-ml, var(--hui-typography-h1-margin-left)));
  }
</style>
