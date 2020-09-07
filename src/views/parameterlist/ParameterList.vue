<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" icon="el-icon-arrow-right" />
    <!-- 提示信息 -->
    <el-alert title="商品参数" type="error" class="alert-msg"></el-alert>
    <!-- 商品类型 -->
    <el-form label-position="left" label-width="80px" :model="form" style="height: 500px; overflow:auto;">
      <el-form-item label="商品分类">
        <!-- 联级选择器 -->
        <el-cascader
          clearable
          v-model="value"
          :options="options"
          :props="cascaderDefaultOptions"
          :show-all-levels="false">
        </el-cascader>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getGoodsCategory } from 'network/category'

  export default {
    name: 'ParameterList',
    components: {
      BreadCrumb
    },
    data() {
      return {
        // 面包屑数据
        titlesList: [
          {
            value: '首页',
            path: '/',
          },
          {
            value: '商品管理'
          },
          {
            value: '参数列表'
          }
        ],
        // 选择的值
        value: [],
        // 渲染联级选择器的可选项数据源
        options: [],
        // 联级选择器的配置项
        cascaderDefaultOptions: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
      }
    },
    created() {
      this.getGoodsCategoryList()
    },
    methods: {
      // 1.请求分类数据
      async getGoodsCategoryList(type=3) {
        const res = await getGoodsCategory(type)

        // 通过解构赋值整理数据
        const { 
          data,
          meta: { msg, status }
        } = res

        // 状态码不为200, 说明未能成功获取分类列表
        if (status !== 200) {
          return this.$message.error(msg)
        }

        // 状态码为200时, 成功获取分类列表, 保存数据
        this.options = data
      },

    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;

    .alert-msg {
      margin: 20px 0 10px;
    }
  }
</style>