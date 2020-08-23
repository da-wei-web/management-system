<template>
  <el-table style="width: 100%">
    <el-table-column label="#" width="60" type="index"></el-table-column>
    <el-table-column v-for="(item, index) in cellName"
     :key="index" 
     :width="(item.width).toString()"
     :label="item.value">
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: 'Table',
    props: {
      cellName: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style>

</style>