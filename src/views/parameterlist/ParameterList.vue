<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" />
    <!-- 提示信息 -->
    <el-alert title="只允许第三级分类显示" type="error" class="alert-msg"></el-alert>
    <!-- 商品类型 -->
    <el-form label-position="left" label-width="80px" style="height: 500px; overflow:auto;">
      <el-form-item label="商品分类">
        {{value}}
        <!-- 联级选择器 -->
        <el-cascader
          clearable
          v-model="value"
          :options="options"
          :props="cascaderDefaultOptions"
          :show-all-levels="false"
          @change="changeValue">
          <!-- :show-all-levels="false" 仅渲染第三级分类 -->
        </el-cascader>
      </el-form-item>
      <el-tabs v-model="active" type="card" @tab-click="tabChange(active)">
        <el-tab-pane label="动态参数" name="1">
          <!-- 按钮 -->
          <el-row class="parameter">
            <el-col>
              <el-button type="danger">设置动态参数</el-button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table 
            :data="dynamicParameters"
            style="width: 100%">
            <!-- 第一列-展开详情 -->
            <el-table-column 
              label="#" 
              type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)">
                  {{tag}}
                </el-tag>
                <!-- 添加标签的输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
                  @blur="handleInputConfirm(scope.row.attr_vals)">
                </el-input>
                <!-- 添加标签 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 第二列-参数名称 -->
            <el-table-column
              label="参数名称"
              prop="attr_name">
            </el-table-column>
            <!-- 操作 -->
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
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
          <!-- 按钮 -->
          <el-row class="parameter">
            <el-col>
              <el-button type="danger">设置静态参数</el-button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table 
            :data="staticParameters"
            style="width: 100%">
            <!-- 第一列-展开详情 -->
            <el-table-column 
              label="#" 
              type="index">
            </el-table-column>
            <!-- 第二列-参数名称 -->
            <el-table-column
              label="参数名称"
              prop="attr_name">
            </el-table-column>
            <!-- 第三列-静态参数内容 -->
            <el-table-column
              label="参数名称"
              prop="attr_vals">
            </el-table-column>
            <!-- 操作 -->
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
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import Table from 'components/content/Table'
  import { getGoodsCategory } from 'network/category'
  import { getGoodsParameters, modifyGoodsParameters } from 'network/parameter'

  export default {
    name: 'ParameterList',
    components: {
      BreadCrumb,
      Table,
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
        // 动态参数标签属性
        inputVisible: false,
        inputValue: ''
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

      // 级联选择器选中节点变化时触发
      changeValue() {
        console.log('1')
        // 当选择分类后直接显示参数列表
        this.tabChange('1')
      },

      // 当切换tab时，触发时生效
      tabChange(active) {
        switch (active) {
          case '1':
            // 判断商品分类
            if (this._judgeValue()) { // 请求商品参数列表
              this.getGoodsParametersList(this.value[2], 'many')
              console.log('2')
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
          meta: { msg, status }
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

      // 动态参数相关事件
      handleClose(tag, dynamicItemParameter) {
        // 找到并移除动态参数数组中的目标元素
        dynamicItemParameter.attr_vals.splice(dynamicItemParameter.attr_vals.indexOf(tag), 1)
        
        // 解构
        const { attr_id, attr_name, attr_sel, attr_vals } = dynamicItemParameter

        // 修改后的动态参数数据
        const dynamicData = {
          attr_name: attr_name,
          attr_sel: attr_sel,
          attr_vals: attr_vals.join(',') // 数据类型是以,分割的字符串
        }

        // 发送修改参数的请求， 第一个参数: 分类id(第三级)，第二参数: 动态参数id， 第三参数: 修改后要提交的数据
        this.modifyParameters(this.value[2], attr_id, dynamicData)
      },

      handleInputConfirm(dynamicTags) {
        let inputValue = this.inputValue;
        if (inputValue) {
          dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      // 显示输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },

      // 修改参数
      async modifyParameters(id, attrId, data) {
        const res = await modifyGoodsParameters(id, attrId, data) 
        
        const {
          meta: { msg, status }
        } = res

        if (status === 200) {
          this.$message.success(msg)
        }
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

    .el-tag + .el-tag {
      margin-left: 10px;
    }

    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
</style>