<template>
<el-card class="box-card">
  <!-- 面包屑 -->
  <bread-crumb :titles-list="titlesList" />
  <!-- 添加分类按钮 -->
  <el-row class="add-cat">
    <el-col>
      <el-button type="danger">添加商品分类</el-button>
    </el-col>
  </el-row>
  <!-- 商品分类列表 -->
  <el-table
    :data="categoriesList"
    style="width: 100%">
    <!-- 树形单元格 -->
    <el-tree-grid 
      label="分类名称" 
      prop="cat_name"
      treeKey="cat_id"
      parentKey="cat_pid"
      levelKey="cat_level"
      childKey="children">
    </el-tree-grid>
    <!-- 第二列-级别 -->
    <el-table-column 
      label="级别" 
      prop="cat_level">
      <template slot-scope="scope">
        <span v-if="scope.row.cat_level === 0">一级</span>
        <span v-if="scope.row.cat_level === 1">二级</span>
        <span v-if="scope.row.cat_level === 2">三级</span>
      </template>
    </el-table-column>
    <!-- 第三列-角色名 -->
    <el-table-column 
      label="是否有效" 
      prop="cat_deleted">
      <template slot-scope="scope">
        <span v-if="scope.row.cat_deleted === false">无效</span>
        <span v-if="scope.row.cat_deleted === true">有效</span>
      </template>
    </el-table-column>
    <!-- 第五列-操作 -->
    <el-table-column label="操作" width="160">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit" 
          circle
          plain
          type="primary">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete" 
          circle
          plain>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</el-card>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import Table from 'components/content/Table'

const ElTreeGrid = require('element-tree-grid')

import {
  getGoodsCategory
} from 'network/category'

export default {
  name: 'Category',
  components: {
    BreadCrumb,
    ElTreeGrid
  },
  data() {
    return {
      // 面包屑数据
      titlesList: [
        {
          value: '首页',
          path: '/'
        },
        {
          value: '商品管理'
        },
        {
          value: '商品分类'
        }
      ],
      // 商品分类数据
      categoriesList: [],
      // 页数
      pagenum: 1,
      // 一页的数据量
      pagesize: 2,
      // 保存总共的数据数
      total: 0,
      // 分类级别
      type: 3,
    }
  },
  created() {
    this.getGoodsCategoryList(this.type, this.pagenum, this.pagesize)
  },
  methods: {
    // 改变一页显示的数据量
    handleSizeChange(val) {
      this.pagesize = val
      this.getGoodsCategoryList(this.type, this.pagenum, this.pagesize)
      console.log(`每页 ${val} 条`);
    },

    // 改变当前页
    handleCurrentChange(val) {
      this.pagenum = val
      this.getGoodsCategoryList(this.type, this.pagenum, this.pagesize)
      console.log(`当前页: ${val}`);
    },

    // 获取商品参数列表数据
    async getGoodsCategoryList(type, pagenum, pagesize) {
      // 1.请求分类数据
      const res = await getGoodsCategory(type, pagenum, pagesize)

      // 通过解构赋值整理数据
      const {
        data: { result, total },
        meta: { msg, status }
      } = res

      console.log(res)

      // 状态码不为200, 说明未能成功获取分类列表
      if (status !== 200) {
        return this.$message.error(msg)
      }
      
      // 保存总数据量
      this.total = total

      // 状态码为200时, 成功获取分类列表, 保存数据
      this.categoriesList = result
    },
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 100%;

  .add-cat {
    margin: 20px 0 10px;
  }

  .pagination {
    margin-top: 10px;
  }
}
</style>
