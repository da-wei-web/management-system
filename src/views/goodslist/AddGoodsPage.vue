<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb 
      :titles-list="titlesList" 
      icon="el-icon-arrow-right">
    </bread-crumb>

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
          <!-- 商品分类 goods_cat -->
          <el-form-item label="商品分类">
            <!-- 联级选择器 -->
            <el-cascader
              clearable
              v-model="value"
              :options="options"
              :props="cascaderDefaultOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品动态参数 -->
        <el-tab-pane label="商品参数" name="2">
          <el-form-item v-for="(item1, index1) in dynamicParameters" :key="index1" :label="item1.attr_name">
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
        <!-- 商品静态参数 -->
        <el-tab-pane label="商品属性" name="3">
          <el-form-item v-for="item in staticParameters" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 图片上传 -->
        <el-tab-pane label="商品图片" name="4">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品介绍 -->
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <!-- 添加商品 -->
            <el-button type="primary" @click="addOneGoods" class="add-goods">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quill-editor 
              v-model="form.goods_introduce"
              :options="editorOption">
            </quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getGoodsCategory } from 'network/category'
  import { getGoodsParameters } from 'network/parameter'
  import { addGoods } from 'network/goods'

  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
 
  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'AddGoodsPage',
    components: {
      BreadCrumb,
      quillEditor
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
          pics: [],
          attrs: [],
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
        // 保存动态参数
        dynamicParameters: [],
        // 保存精态参数
        staticParameters: [],
        // 请求头
        headers: {
          Authorization: localStorage.getItem('token')
        },
        // 文件列表
        fileList: [],

        // 富文本配置
        editorOption: {

        }
      }
    },
    created() {
      this.getGoodsCategoryList()
    },
    methods: {
      // 当切换tab时，触发时生效
      tabChange() {
        switch (this.active) {
          case '2':
            // 判断商品分类
            if(this._judgeValue()) {
              // 请求商品参数列表
              this.getGoodsParametersList(this.value[2], 'many')
            } else {
              return false
            }

            break
          case '3':
            // 判断商品分类
            if(this._judgeValue()) {
              // 请求商品参数列表
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

      handleRemove(file) {
        // nIndex -> 下标
        const nIndex = this.form.pics.findIndex(item => {
          // 返回一个下标
          return item.tmp_path === file.response.data.tmp_path
        })

        // 根据下标删除数组中的某个元素
        this.form.pics.splice(nIndex, 1)
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSuccess(response, file, fileList) {
        const { 
          data,
          meta: { msg, status }
        } = response

        // 在pics保存图片的临时路径
        this.form.pics.push({pic: data.tmp_path})
        this.$message.success(msg)
      },

      // 联级选择器选择值
      handleChange() {

      },

      // 添加商品
      async addOneGoods() {
        // 处理数据 - 分类参数(以,分割的字符串)
        this.form.goods_cat = this.value.join(',')

        // 处理数据 - 在上传图片和移除图片时,在form中添加或移除图片的临时路径

        // 处理数据 - 动态参数和静态参数
        // {
        //   "attr_id":15,
        //   "attr_value":"ddd"
        // },
        // 动态参数
        let arr1 = this.dynamicParameters.map(item => {
          return {attr_id: item.attr_id, attr_value: item.attr_name}
        })
        // 静态参数
        let arr2 = this.staticParameters.map(item => {
          return {attr_id: item.attr_id, attr_value: item.attr_name}
        })

        this.form.attrs = [...arr1, ...arr2]

        console.log(this.form)
        
        const res = await addGoods(this.form)

        const {
          meta: { msg, status }
        } = res

        if(status === 201) {
          this.$message.success(msg)
          this.$router.push('/goods')
        }
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

        const {
          data, 
          meta: { mag, status }
        } = res

        if (status !== 200) {
          this.$message.warning(msg)
        }

        if (sel === 'only') {
          // 保存静态参数
          this.staticParameters = data
          console.log(this.staticParameters)
        } else {
          // sel -> 'many'
          // attr_vals的值类型转换成数组类型
          data.forEach(item => {
            // item.attr_vals为0的时候不进行下面的转换
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })

          // 保存动态参数
          this.dynamicParameters = data
          console.log(this.dynamicParameters)
        }
        
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
    
    // /deep/深度选择器, 修改默认的ElementUI样式
    /deep/.el-tabs__item {
      height: 64px;
      line-height: 64px;
      font-size: 16px;
    }

    .add-goods {
      margin: 10px 0;
    }

    // 富文本编辑器的高度
    /deep/.ql-editor {
      min-height: 200px;
    }
  }

</style>