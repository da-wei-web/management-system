<template>
  <el-table style="width: 100%" :data="usersList">
    <el-table-column label="#" width="60" type="index"></el-table-column>
    <el-table-column v-for="(item, index) in cellName"
                     :key="index" 
                     :width="(item.width).toString()"
                     :label="item.value"
                     :prop="item.column_value">
    </el-table-column>
    <el-table-column label="操作" width="160">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit" 
          circle
          type="primary"
          @click="handleEdit(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete" 
          circle
          @click="handleDelete(scope.$index, scope.row)">
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
  export default {
    name: 'Table',
    props: {
      // 表头
      cellName: {
        type: Array,
        default: []
      },
      // 表格数据
      usersList: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style>

</style>