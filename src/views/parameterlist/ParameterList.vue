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
              <el-button type="danger" @click="openSetParametersDialog">设置动态参数</el-button>
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
                  @keyup.enter.native="handleInputConfirm(scope.row)">
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
                  type="primary"
                  @click="openEditParametersDialog(scope.row.cat_id, scope.row.attr_id)">
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete" 
                  circle
                  plain
                  @click="deleteGoodsParameters(scope.row.cat_id, scope.row.attr_id, scope.row.attr_sel)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
          <!-- 按钮 -->
          <el-row class="parameter">
            <el-col>
              <el-button type="danger" @click="openSetParametersDialog">设置静态参数</el-button>
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
                  type="primary"
                  @click="openEditParametersDialog(scope.row.cat_id, scope.row.attr_id)">
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete" 
                  circle
                  plain
                  @click="deleteGoodsParameters(scope.row.cat_id, scope.row.attr_id, scope.row.attr_sel)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 设置动态参数对话框 -->
    <Dialog 
      ref="dialogAdd"
      :dialog-form-visible="dialogFormVisibleAddParameters"
      :form="form"
      dialogWidth="35%"
      name="添加动态参数"
      @cancelDialog="setGoodsParameters">
    </Dialog>
    <!-- 编辑动态参数对话框 -->
    <Dialog 
      ref="dialogEdit"
      :dialog-form-visible="dialogFormVisibleEditParameters"
      :form="form"
      dialogWidth="35%"
      name="编辑动态参数"
      @cancelDialog="editGoodsParameters">
    </Dialog>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import Table from 'components/content/Table'
  import Dialog from 'components/common/Dialog'

  import { getGoodsCategory } from 'network/category'
  import { 
    getGoodsParameters, 
    getParametersById,
    modifyGoodsParameters,
    addParameters,
    deleteParameters
  } from 'network/parameter'

  export default {
    name: 'ParameterList',
    components: {
      BreadCrumb,
      Table,
      Dialog,
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
        active: 'many',
        // 保存动态参数
        dynamicParameters: [],
        // 保存静态参数
        staticParameters: [],
        // 动态参数标签属性
        inputVisible: false,
        inputValue: '',
        // 设置动态参数对话框的开关
        dialogFormVisibleAddParameters: false,
        // 添加分类参数
        form: {
          // 用于绑定表单控件中的v-model
          attr_name: '',
          attr_vals: '',
          formContent: [
            {
              item_en_title: 'attr_name',  // 与上面的属性进行连用
              item_cn_title: '参数名称'     // 用于显示表单控件的类型
            },
            {
              item_en_title: 'attr_vals', 
              item_cn_title: '值'
            }
          ]
        },
        // 编辑参数对话框的开关
        dialogFormVisibleEditParameters: false,
        // 保存属性id
        attr_id: -1,
      }
    },
    created() {
      this.getGoodsCategoryList()
    },
    methods: {
      // 级联选择器选中节点变化时触发
      changeValue() {
        // 当选择分类后直接显示参数列表
        console.log(this.active)
        this.tabChange(this.active)
      },

      // 当切换tab时，触发时生效
      tabChange(active) {
        switch (active) {
          case 'many':
            // 判断商品分类
            if (this._judgeValue()) { // 请求商品参数列表
              this.getGoodsParametersList(this.value[2], 'many')
            } else {
              return false
            }

            break
          case 'only':
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
      
      // 添加参数
      handleInputConfirm(dynamicItemParameter) {
        let inputValue = this.inputValue;
        
        if (inputValue) {
          dynamicItemParameter.attr_vals.push(inputValue);
        }

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

      // 打开设置动态参数对话框
      openSetParametersDialog() {
        if (!this.value[2]) {
          this.$message.warning('请选择分类')
          return false
        }
        
        this.dialogFormVisibleAddParameters = true
      },

      // 提交添加商品参数的数据
      setGoodsParameters(status) {
        if (status) {
          this.form.attr_vals = this.active === 'many' ? this.form.attr_vals.trim().split(' ，') : this.form.attr_vals

          let parametersData = { 
            attr_name: this.form.attr_name,
            attr_sel: this.active,
            attr_vals: this.form.attr_vals, // 将字符串转换为数组,在表单控件中需用英文的逗号作为间隔 
          }

          // 添加商品参数
          this.addGoodsParameters(this.value[2], parametersData)

          // 更新参数列表视图
          this.getGoodsParametersList(this.value[2], this.active)

          // 清空form中的数据
          this.form.attr_name = ''
          this.form.attr_vals = ''

          // 关闭设置动态参数对话框
          this.dialogFormVisibleAddParameters = false
        } else {
          this.dialogFormVisibleAddParameters = false
        }
      },

      // 编辑商品参数
      async editGoodsParameters(status) {
        if (status) {
          this.form.attr_vals = this.active === 'many' ? this.form.attr_vals.trim().split(' ，') : this.form.attr_vals

          let parametersData = { 
            attr_name: this.form.attr_name,
            attr_sel: this.active,
            attr_vals: this.form.attr_vals, // 将字符串转换为数组,在表单控件中需用英文的逗号作为间隔 
          }

          // 提交修改商品参数
          const result = await this.modifyParameters(this.value[2], this.attr_id, dynamicData)
          
          if (result === '更新成功') {
            // 更新动态参数列表视图
            this.getGoodsParametersList(this.value[2], 'many')
          }
          
          // 关闭编辑商品参数的对话框
          this.dialogFormVisibleEditParameters = false

          // 因为添加商品参数所绑定的数据form和编辑商品参数所绑定的form是同一个，需要清空表单中的内容
          this.form.attr_name = ''
          this.form.attr_vals = ''
        } else {
          this.dialogFormVisibleEditParameters = false
          // 同上
          this.form.attr_name = ''
          this.form.attr_vals = ''
        }
      },

       // 打开编辑商品参数对话框 
      openEditParametersDialog(id, attrId) {
        // 获取商品参数数据
        this.getGoodsParametersById(id, attrId)

        // 保存属性id值
        this.attr_id = attrId

        // 打开编辑动态参数对话框
        this.dialogFormVisibleEditParameters = true
      },

      // 请求分类数据
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

      // 添加商品参数 id -> 分类id， data -> attr_name, attr_sel, attr_vals
      async addGoodsParameters(id, data) {
        // 发送添加参数的请求
        const res = await addParameters(id, data)

        const {
          meta: { msg, status }
        } = res

        if (status === 201) {
          this.$message.success(msg)
        }
      },

      // 删除商品参数 id -> 分类ID attrId -> 属性ID
      async deleteGoodsParameters(id, attrId, sel) {
        const res = await deleteParameters(id, attrId)
        console.log(res)
        const { meta: { msg, status } } = res

        if (status === 200) {
          this.$message.success(msg)
          // 更新动态参数列表视图 sel -> 'many' 或 'only'
          console.log(sel)
          this.getGoodsParametersList(this.value[2], sel)
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

      // 根据id获取商品参数
      async getGoodsParametersById(id, attrId) {
        const res = await getParametersById(id, attrId)
        
        const {
          data,
          meta: { msg, status }
        } = res

        if (status === 200) {
          this.form.attr_name = data.attr_name
          // console.log(typeof data.attr_vals)  -> string
          this.form.attr_vals = data.attr_vals
        }
      },

      // 修改参数
      async modifyParameters(id, attrId, data) {
        const res = await modifyGoodsParameters(id, attrId, data) 
        
        const {
          meta: { msg, status }
        } = res

        if (status === 200) {
          this.$message.success(msg)
          return msg
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