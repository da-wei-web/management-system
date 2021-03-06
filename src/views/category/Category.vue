<template>
<el-card class="box-card">
  <!-- 面包屑 -->
  <bread-crumb :titles-list="titlesList" />
  <!-- 添加分类按钮 -->
  <el-row class="add-cat">
    <el-col>
      <el-button type="danger" @click="openAddGoodsCategoryDialog">添加商品分类</el-button>
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
          type="primary"
          @click="openEditGoodsCategoryDialog(scope.row.cat_id)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete" 
          circle
          plain
          @click="deleteGoodsCategory(scope.row.cat_id)">
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
  <!-- 添加分类对话框 -->
  <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleAddCategories">
    <el-form 
      label-position="top" 
      label-width="80px" 
      :model="form" 
      style="height: 250px; overflow:auto;">
      <el-form-item label="分类名称" label-width="80px">
        <el-input v-model="form.cat_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        {{value}}
        <!-- 联级选择器 -->
        <el-cascader
          clearable
          v-model="value"
          :options="options"
          :props="cascaderDefaultOptions">
        </el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleAddCategories = false">取 消</el-button>
      <el-button type="primary" @click="addGoodsCategory">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 编辑商品分类对话框 -->
  <el-dialog title="编辑商品分类" :visible.sync="dialogFormVisibleEditCategories">
    <el-form 
      label-position="top" 
      label-width="80px" 
      :model="form" 
      style="height: 150px; overflow:auto;">
      <el-form-item label="分类名称" label-width="80px">
        <el-input v-model="form.cat_name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEditCategories = false">取 消</el-button>
      <el-button type="primary" @click="editGoodsCategory">确 定</el-button>
    </div>
  </el-dialog>
</el-card>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import Table from 'components/content/Table'

const ElTreeGrid = require('element-tree-grid')

import {
  getGoodsCategory, addCategory,
  deleteCategory, getCategoryById,
  editCategory
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
      // 添加分类的对话框开关
      dialogFormVisibleAddCategories: false,
      // 表单
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1,
      },
      // 选择的值
      value: [],
      // 渲染联级选择器的可选项数据源
      options: [],
      // 联级选择器的配置项
      cascaderDefaultOptions: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,   // 单选任意一个选项
      },
      // 编辑分类对话框的开关
      dialogFormVisibleEditCategories: false,
      // 商品分类id
      cat_id: -1,
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

    // 打开添加商品分类对话框
    openAddGoodsCategoryDialog() {
      // 获取级联选择器的二级分类数据
      this.getCascaderData(2)
      this.dialogFormVisibleAddCategories = true
    },

    // 打开编辑商品分类对话框
    openEditGoodsCategoryDialog(id) {
      this.getGoodaCategoryById(id)
      this.dialogFormVisibleEditCategories = true
    },

    // 添加商品分类
    async addGoodsCategory() {
      // 数据整理
      if (this.value.length === 0) {
        // 一级分类
        this.form.cat_pid = 0
        this.form.cat_level = 0
      } else if (this.value.length === 1) {
        // 二级分类
        this.form.cat_pid = this.value[0]
        this.form.cat_level = 1
      } else if (this.value.length === 2) {
        // 三级分类
        this.form.cat_pid = this.value[1]
        this.form.cat_level = 2
      }

      if (!this.form.cat_name) this.$message.warning('分类名称不能为空')

      // 发送添加分类的请求
      const res = await addCategory(this.form)

      const {
        meta: { msg, status }
      } = res

      // 添加分类成功
      if (status === 201) this.$message.success(msg)

      // 更新视图
      this.getGoodsCategoryList(this.type, this.pagenum, this.pagesize)
      
      // 关闭添加分类对话框
      this.dialogFormVisibleAddCategories = false
    },

    // 删除商品分类
    async deleteGoodsCategory(id) {
      const res = await deleteCategory(id)
      console.log(res)
      const {
        meta: { msg, status }
      } = res

      if (status === 200) this.$message.success(msg)

      // 更新视图并返回第一页
      this.pagenum = 1
      this.getGoodsCategoryList(this.type, this.pagenum, this.pagesize)
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

      // 状态码不为200, 说明未能成功获取分类列表
      if (status !== 200) {
        return this.$message.error(msg)
      }
      
      // 保存总数据量
      this.total = total

      // 状态码为200时, 成功获取分类列表, 保存数据
      this.categoriesList = result
    },

    // 根据id获取商品参数数据 id -> 商品分类ID
    async getGoodaCategoryById(id) {
      const res = await getCategoryById(id)
      
      const {
        data,
        meta: { status }
      } = res

      if (status === 200) {
        // 保存参数名称
        this.form.cat_name = data.cat_name
        // 保存分类id
        this.cat_id = id
      }
    },

    // 编辑商品参数
    async editGoodsCategory() {
      // 发送编辑参数的请求
      const res = await editCategory(this.cat_id, this.form.cat_name)
      
      const {
        meta: { msg, status }
      } = res

      if (status === 200) {
        this.$message.success(msg)
      }

      // 关闭编辑参数对话框
      this.dialogFormVisibleEditCategories = false

      // 清空表单
      this.form.cat_name = ''

      // 更新视图
      this.getGoodsCategoryList(this.type, this.pagenum, this.pagesize)
    },

    // 获取级联选择器数据
    async getCascaderData(type) {
      const res = await getGoodsCategory(type)

      const {
        data,
        meta: { status }
      } = res

      if (status === 200) {
        this.options = data
      }
    }
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
