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
        <el-alert title="编辑商品信息" type="success" center show-icon></el-alert>
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
      <el-tabs v-model="active" tab-position="left" class="tabs">
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
            {{value}}
            <!-- 联级选择器 -->
            <el-cascader
              clearable
              v-model="value"
              :options="options"
              :props="cascaderDefaultOptions">
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
            <el-button type="primary" @click="editGoodsMsg" class="edit-goods">修改商品信息</el-button>
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
  import { 
    getGoodsById, GoodsMsg, editGoods
  } from 'network/goods'

  // 富文本编辑器的样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
 
  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'EditGoodsPage',
    components: {
      BreadCrumb,
      quillEditor
    },
    data() {
      return {
        // 面包屑数据列表
        titlesList: [
          {
            value: '商品列表',
            path: '/goods'
          },
          {
            value: '编辑商品'
          }
        ],
        // 当前处于激活状态的步骤
        active: '1',
        // 商品id
        id: -1,
        // 表单
        form: {},
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
        // 保存动态参数
        dynamicParameters: [],
        // 保存精态参数
        staticParameters: [],
        // 请求头
        headers: {
          Authorization: localStorage.getItem('token')
        },
        // 富文本配置
        editorOption: {
          placeholder: '在这里输入内容'
        },
        // 图片列表
        fileList: []
      }
    },
    created() {
      this.getGoodsCategoryList()
      this.getGoodsMsg()
    },
    methods: {
      // 移除图片
      handleRemove(file) {
        // nIndex -> 下标
        const nIndex = this.form.pics.findIndex(item => {
          // 返回一个下标
          return item.tmp_path === file.response.data.tmp_path
        })

        // 根据下标删除数组中的某个元素
        this.form.pics.splice(nIndex, 1)
      },
      // 上传图片
      handleSuccess(response) {
        const { 
          data,
          meta: { msg, status }
        } = response
    
        // 在pics保存图片的临时路径
        this.form.pics.push({pic: data.tmp_path})
        this.$message.success(msg)
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

      async getGoodsMsg() {
        // 接受路由参数id
        const goodsId = this.$route.params.id

        // 商品id为空时或在该页面刷新时(导致无法获取商品id)时触发
        if (!goodsId) {
          this.$router.push('/goods')
          return false
        }

        // 保存商品id
        this.id = goodsId

        // 根据商品id请求商品信息
        const res = await getGoodsById(goodsId) 

        const { 
          data,
          meta: { msg, status }
        } = res

        console.log(data)
        // 整合数据
        const goodsMsg = new GoodsMsg(data)

        // 图片列表
        this.fileList = goodsMsg.pics

        // 用于保存动态参数
        let dynamicArr = []

        // 商品参数
        goodsMsg.attrs.forEach(item => {
          item.attr_sel === 'only' ? this.staticParameters.push(item) : dynamicArr.push(item) 
        })

        // 动态参数数据整理
        dynamicArr.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })

        // 保存最终的动态参数数据
        this.dynamicParameters = dynamicArr

        // 分类 字符串转换为数组
        let goodsCat = goodsMsg.goods_cat.split(',')

        // 过渡数组，保存分类id -> ['1', '2', '3']
        let arr = []
        goodsCat.forEach(value => {
          // 字符串转数字
          arr.push(value * 1)
        })

        // 保存分类的id -> [1, 2, 3]
        this.value = arr

        // 基本信息
        this.form = goodsMsg
      },

      // 编辑商品提交
      async editGoodsMsg() {
        // 处理数据 - 分类参数(以,分割的字符串)
        this.form.goods_cat = this.value.join(',')

        // 动态参数
        let arrAttr1 = this.dynamicParameters.map(item => {
          return {attr_id: item.attr_id, attr_value: item.attr_name}
        })
        // 静态参数
        let arrAttr2 = this.staticParameters.map(item => {
          return {attr_id: item.attr_id, attr_value: item.attr_name}
        })

        // 合并动态参数和静态参数
        this.form.attrs = [...arrAttr1, ...arrAttr2]


        console.log(this.form)
        const res = await editGoods(this.id, this.form) 
       
        const {
          meta: { msg, status}
        } = res

        if (status === 200) {
          this.$message.success(msg)
          this.$router.push('/goods')
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
    
    // /deep/深度选择器, 修改默认的ElementUI样式
    /deep/.el-tabs__item {
      height: 64px;
      line-height: 64px;
      font-size: 16px;
    }

    .edit-goods {
      margin: 10px 0;
    }

    // 富文本编辑器的高度
    /deep/.ql-editor {
      min-height: 200px;
    }
  }

</style>