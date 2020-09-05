<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <BreadCrumb 
      :titles-list="titlesList" 
      icon="el-icon-arrow-right">
    </BreadCrumb>

    <!-- 警告提示 -->
    <el-row class="alert-msg">
      <el-col>
        <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
      </el-col>
    </el-row>
    
    <!-- 步骤 -->
    <el-steps :active="1 * active" align-center simple finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 最终要取所有tabpane的数据，发送给后端，所以添加表单组件 -->
    <el-form label-position="top" label-width="80px" :model="form" style="height: 500px; overflow:auto;">
      <!-- tab -->
      <el-tabs v-model="active" tab-position="left" class="tabs" @tab-click="tabChange">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍">
            <el-input v-model="form.goods_introduce"></el-input>
          </el-form-item>
          <el-form-item label="图片上传">
            <el-input v-model="form.pics"></el-input>
          </el-form-item>
          <el-form-item label="商品参数">
            <el-input v-model="form.attrs"></el-input>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <!-- 联级选择器 -->
            {{value}}
            <el-cascader
              v-model="value"
              :options="options"
              :props="cascaderDefaultOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <el-form-item v-for="(item1, index1) in parameters" :key="index1" :label="item1.attr_name">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox 
                v-for="(value, i) in item1.attr_vals" 
                :key="i" 
                :label="value"
                border>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="4">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getGoodsCategory } from 'network/category'
  import { getGoodsParameters } from 'network/parameter'

  export default {
    name: 'AddGoodsPage',
    components: {
      BreadCrumb
    },
    data() {
      return {
        // 面包屑数据列表
        titlesList: [
          {
            value: '首页',
            path: '/'
          },
          {
            value: '商品管理',
          },
          {
            value: '商品列表'
          }
        ],
        // 当前处于激活状态的步骤
        active: '1',
        // 表单
        form: {
          goods_name: '',
          goods_cat: '',
          goods_price: '',
          goods_number: '',
          goods_weight: '',
          goods_introduce: '',
          pics: '',
          attrs: '',
        },
        // 选择的值
        value: [1, 3, 6],
        // 渲染联级选择器的可选项数据源
        options: [],
        // 联级选择器的配置项
        cascaderDefaultOptions: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 保存参数
        parameters: []
      }
    },
    created() {
      this.getGoodsCategoryList()
    },
    methods: {
      // 当切换tab时，触发时生效
      tabChange() {
        // 警告信息提示
        // console.log(this.value.length)
        if(this.active === '2' && this.value.length !== 3) {
          this.$message.warning('请先选择商品分类')
          return false
        }

        // 请求商品参数列表
        this.getGoodsParametersList(this.value[2], 'many')



      },

      // 联级选择器选择值
      handleChange() {

      },

      // 获取联机选择器列表数据
      async getGoodsCategoryList(type=3) {
        // 1.请求分类数据
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

      // 获取商品参数的列表 sel -> 'many'动态参数
      async getGoodsParametersList(id, sel) {
        const res = await getGoodsParameters(id, sel)
        console.log(res)

        const {
          data, 
          meta: { mag, status }
        } = res

        if (status !== 200) {
          this.$message.warning(msg)
        }

        // attr_vals的值类型转换成数组类型
        data.forEach(item => {
          // item.attr_vals为0的时候不进行下面的转换
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })

        this.parameters = data
      }
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
    
    // 修改默认的ElementUI样式
    /deep/.el-tabs__item {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
  }

</style>