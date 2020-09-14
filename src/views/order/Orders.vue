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
            type="primary">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getOrders } from 'network/orders'

  import { formDate } from 'common/untils/changeDate'

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
        // 当前页
        pagenum: 1,
        // 每页数据量
        pagesize: 9,
        // 总数据量
        total: -1,
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
      this.getOrdersList(this.pagenum, this.pagesize)
    },
    methods: {
      // 1. 获取订单数据列表
      async getOrdersList(pagenum, pagesize) {
        const res = await getOrders(pagenum, pagesize)
        console.log(res)
        const {
          data: { goods, total },
          meta: { status }
        } = res

        if (status === 200) {
          this.ordersList = goods
          this.total = total
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;
  }
</style>