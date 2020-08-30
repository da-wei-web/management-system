<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <BreadCrumb 
      :titles-list="titlesList" 
      icon="el-icon-arrow-right">
    </BreadCrumb>
    <!-- 权限列表 -->
    <el-table style="width: 100%" :data="rightsList">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="150"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column prop="level" label="层次">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getRights } from "network/right";
  export default {
    name: 'Right',
    components: {
      BreadCrumb
    },
    data() {
      return {
         // 面包屑
        titlesList: [
          {
            value: '首页',
            path: '/'
          },
          {
            value: '权限管理',
          },
          {
            value: '权限列表'
          }
        ],
        // 权限列表
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      // 获取权限列表
      async getRightsList() {
        const res = await getRights('list')

        const {
          data,
          meta: {msg, status}
        } = res

        if (status === 200) {
          this.rightsList = data
        }
      } 
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;
  }
</style>