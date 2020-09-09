<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" />
    <!-- 提示信息 -->
    <el-alert title="商品参数" type="error" class="alert-msg"></el-alert>
    <!-- 商品类型 -->
    <el-form label-position="left" label-width="80px" style="height: 500px; overflow:auto;">
      <el-form-item label="商品分类">
        <!-- 联级选择器 -->
        <el-cascader
          clearable
          v-model="value"
          :options="options"
          :props="cascaderDefaultOptions"
          :show-all-levels="false">
          <!-- :show-all-levels="false" 仅渲染第三级分类 -->
        </el-cascader>
      </el-form-item>
      <el-tabs v-model="active" type="card" @tab-click="tabChange">
        <el-tab-pane label="动态参数" name="1">
          <el-button type="danger">动态参数</el-button>
          <Table 
            :cell-name="titles"
            fbgcolor="#ff4949"
            :is-show="false"
            :msg-list="dynamicParameters">
          </Table>
        </el-tab-pane>
       ​ <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import Table from 'components/content/Table'
  import { getGoodsCategory } from 'network/category'
  import { getGoodsParameters } from 'network/parameter'

  export default {
    name: 'ParameterList',
    components: {
      BreadCrumb,
      Table
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
            value: '参数列表'
          }
        ],
        // 选择的值
        value: [],
        // 级联选择器参数列表
        options: [],
        // 联级选择器的配置项
        cascaderDefaultOptions: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
        },
        // 当前的选项卡
        active: '1',
        // 保存动态参数
        dynamicParameters: [],
        // 保存静态参数
        staticParameters: [],
        // 表头信息
        titles: [
          { value: '参数名称', width: 550, column_value: 'attr_name' }
        ]
      }
    },
    created() {
      this.getGoodsCategoryList()
    },
    methods: {
      // 1.请求分类数据
      async getGoodsCategoryList(type = 3) {
        const res = await getGoodsCategory(type)
        // 通过解构赋值整理数据
        const {
          data, 
          meta: { msg, status}
        } = res

        // 状态码不为200, 说明未能成功获取分类列表
        if (status !== 200) {
          this.$message.warning(msg)
        } 

        // 状态码为200时, 成功获取分类列表, 保存数据
        this.options = data
      },

      // 当切换tab时，触发时生效
      tabChange() {
        switch (this.active) {
          case '1':
            // 判断商品分类
            if (this._judgeValue()) { // 请求商品参数列表
              this.getGoodsParametersList(this.value[2], 'many')
            } else {
              return false
            }

            break
          case '2':
            // 判断商品分类
            if (this._judgeValue()) {
              this.getGoodsParametersList(this.value[2], 'only')
            } else {
              return false
            }

            break
        }
      },

      // 判断是否选择第三级的分类
      _judgeValue() {
        if (this.value.length !== 3) {
          this.$message.warning('请选择商品分类')
          return false
        } else {
          return true
        }
      },

      // 获取商品参数的列表 sel -> 'many'动态参数
      async getGoodsParametersList(id, sel) {
        const res = await getGoodsParameters(id, sel)
        
        const {
          data, 
          meta: { msg, status}
        } = res

        if (status !== 200) {
          this.$message.warning(msg)
        }
        
        // 参数类型 'only' -> 静态参数 'many' -> 动态参数
        if (sel === 'only') { // 保存静态参数
          this.staticParameters = data
          console.log(this.staticParameters)
        } else {
          // sel -> 'many'
          // attr_vals的值类型转换成数组类型
          data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })

          // 保存动态参数
          this.dynamicParameters = data
          console.log(this.dynamicParameters)
        }
      },
      // deleteParameter() {
      //   console.log('删除参数')
      // }

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