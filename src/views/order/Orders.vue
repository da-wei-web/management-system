<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" icon="el-icon-arrow-right" />
    <!-- 订单列表 -->
    <el-table
      :data="ordersList"
      style="width: 100%; margin-top: 20px;">
      <!-- 第一列-序号 -->
      <el-table-column 
        type="index" 
        label="#">
      </el-table-column>
      <el-table-column  
        label="订单编号"
        prop="order_number">
      </el-table-column>
      <el-table-column 
        label="订单价格"
        prop="order_price">
      </el-table-column>
      <el-table-column 
        label="是否付款"
        prop="order_pay">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.pay_status === '1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        label="是否发货"
        prop="is_send">
      </el-table-column>
      <el-table-column 
        label="订单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | getDate }}
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
            @click="openEditOrdersDialog()">
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
      :page-sizes="[6, 9, 12, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑订单的对话框 -->
    <el-dialog title="编辑商品分类" @click="addressDialogClosed" :visible.sync="dialogFormVisibleEditOrders">
      <el-form 
        label-position="top" 
        label-width="80px" 
        :model="form"
        :rules="addressRules"
        ref="addressFormRef" 
        style="height: 300px; overflow:auto;">
        <el-form-item label="省市区" prop="value" label-width="80px">
          {{form.value}}
          <el-cascader
            clearable
            v-model="form.value"
            :options="options"
            :props="cascaderDefaultOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address" label-width="80px">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditOrders = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getOrders, getOrderById } from 'network/orders'

  import { formDate } from 'common/untils/changeDate'
  import allCities from './cities'

  export default {
    name: 'Orders',
    components: {
      BreadCrumb
    },
    data() {
      return {
        // 面包屑列表数据
        titlesList: [
          {
            value: '首页',
            path: '/'
          },
          {
            value: '订单管理'
          },
          {
            value: '订单列表'
          }
        ],
        // 订单列表数据
        ordersList: [],
        // 搜索框用于双向绑定的数据
        message: '',
        // 当前页
        pagenum: 1,
        // 每页数据量
        pagesize: 6,
        // 总数据量
        total: -1,
        // 表单
        form: {
          value: [],
          address: ''
        },
        // 表单验证
        addressRules: {
          value: [
            { required: true, message: '请选择省市区县', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ]
        },
        // 编辑订单对话框的开关
        dialogFormVisibleEditOrders: false,
        // 渲染联级选择器的可选项数据源
        options: [],
        // 联级选择器的配置项
        cascaderDefaultOptions: {
          expandTrigger: 'hover',
        },
      }
    },
    // 过滤器
    filters: {
      getDate(value) {
        // 实例化Date对象
        let date = new Date(value * 1000);

        // 日期格式化
        return formDate(date, 'yyyy-MM-dd');
      }
    },
    created() {
      this.getOrdersList(this.message, this.pagenum, this.pagesize)
    },
    methods: {
      // 改变一页显示的数据量
      handleSizeChange(val) {
        this.pagesize = val
        this.getOrdersList(this.message, this.pagenum, this.pagesize)
        // console.log(`每页 ${val} 条`);
      },

      // 改变当前页
      handleCurrentChange(val) {
        this.pagenum = val
        this.getOrdersList(this.message, this.pagenum, this.pagesize)
        // console.log(`当前页: ${val}`);
      },

      // 打开编辑订单对话框
      openEditOrdersDialog() {
        this.options = allCities
        this.dialogFormVisibleEditOrders = true
      },

      // 获取订单数据列表
      async getOrdersList(query, pagenum, pagesize) {
        const res = await getOrders(query, pagenum, pagesize)

        const {
          data: { goods, total },
          meta: { status }
        } = res

        if (status === 200) {
          this.ordersList = goods
          this.total = total
        }
      },

      addressDialogClosed () {
        this.$refs.addressFormRef.resetFields()
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
    }

    .pagination {
      margin-top: 10px;
    }
  }
</style>