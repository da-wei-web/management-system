<template>
  <i :class="className"></i>
</template>

<script>
  export default {
    name: 'Icon',
    props: {
      className: {
        type: String,
        default: null
      }
    }
  }
</script>

<style>

</style>