<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb 
      :titles-list="titlesList" 
      icon="el-icon-arrow-right">
    </bread-crumb>

    <!-- 搜索框 -->
    <el-row class="search-row">
      <el-col :span="24">
        <el-input 
          :clearable="true"
          placeholder="商品名称" 
          v-model="message" 
          @clear="getGoodsLt(message, pagenum, pagesize)"
          class="input-with-select">
          <el-button 
            slot="append" 
            icon="el-icon-search"
            @click="message === '' ? warning() : getGoodsLt(message, pagenum, pagesize)">
          </el-button>
        </el-input>
        <el-button 
          type="success" 
          class="add-goods"
          @click="$router.push('/addgoods')">
          添加商品
        </el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <Table 
      :cell-name="titles"
      :msg-list="goodsList" 
      fbgcolor="#ff4949"
      :is-show="false"
      @deleteItem="deleteGoods"
      @openEditDialog="jumpEditGoodsPage">
    </Table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'
  import Table from 'components/content/Table'
  import Dialog from 'components/common/Dialog'

  import { 
    getGoodsList, deleteGoodsById, addGoods,
  } from 'network/goods'

  import { formDate } from 'common/untils/changeDate'

  // 富文本编辑器的样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
 
  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'GoodsList',
    components: {
      BreadCrumb,
      Table,
      Dialog
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
        // 搜索框用于双向绑定的数据
        message: '',
        // 页数
        pagenum: 1,
        // 一页的数据量
        pagesize: 4,
        // 表格表头数据
        titles: [
          {value: '商品名称', width: 550, column_value: 'goods_name'}, 
          {value: '商品价格(元)', width: 100, column_value: 'goods_price'}, 
          {value: '商品重量', width: 120, column_value: 'goods_weight'}, 
          {value: '创建日期', width: 140, column_value: 'add_time'}, 
        ],
        // 商品列表信息
        goodsList: [],
        // 保存总共的数据数
        total: 0,
        // 保存根据id
        id: null,
        // 保存商品信息
        goodsForm: {},
      }
    },
    created() {
      this.getGoodsLt(this.message, this.pagenum, this.pagesize)
    },
    methods: {
      // 事件处理
      // 改变一页显示的数据量
      handleSizeChange(val) {
        this.pagesize = val
        this.getGoodsLt(this.message, this.pagenum, this.pagesize)
        // console.log(`每页 ${val} 条`);
      },

      // 改变当前页
      handleCurrentChange(val) {
        this.pagenum = val
        this.getGoodsLt(this.message, this.pagenum, this.pagesize)
        // console.log(`当前页: ${val}`);
      },

      // 获取商品列表
      async getGoodsLt(query, pagenum, pagesize) {
        try {
          // 发送请求
          const res = await getGoodsList(query, pagenum, pagesize)
          
          console.log(res)
          // 处理数据
          const {
            meta: {msg, status},
            data: {goods, total}
          } = res

          console.log(res)

          if (status === 200) {
            // 日期格式处理
            const newGoods = []
            goods.map(item => {
              // 时间变为毫秒
              let date = new Date(item.add_time * 1000)

              // 转换日期格式并替换掉create_time中的原始数据
              item.add_time = formDate(date, 'yyyy-MM-dd')
              
              // 返回新的数组
              return newGoods.push(item)
            })

            // 保存数据
            this.goodsList = newGoods
            this.total = total
          }
          
        } catch(err) {
          return new Error(err)
        }
        
      },

      // 搜索框为空时点击搜索，触发该警告提示
      warning() {
        this.$message.warning('查询的内容不能为空!')
      },

      // 删除商品
      async deleteGoods(id) {
        const res = await deleteGoodsById(id) 

        const {
          meta: {msg, status}
        } = res

        if (status === 200) {
          this.$message.success(msg)

          // 更新视图
          this.getGoodsLt(this.message, this.pagenum, this.pagesize)
        }
      },

      // 打开编辑商品对话框
      jumpEditGoodsPage(goodsId) {
        this.$router.push({ name: 'EditGoodsPage', params: { id: goodsId }})
      },
      
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;

    .search-row {
      margin: 20px 0;

      .input-with-select {
        width: 400px;
        background-color: #fff;
      }

      .add-goods {
        margin-left: 10px;
      }
    }

    .pagination {
      margin-top: 10px;
    }

    // .form-item {
    //   margin-bottom: 15px;
    // }

  }
</style>