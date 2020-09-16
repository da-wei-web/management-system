<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" />
    <!-- 数据折线图 -->
    <div id="main" style="width: 800px;height:600px;"></div>
  </el-card>
</template>

<script>
  import { reportsData } from 'network/reports'

  import BreadCrumb from 'components/common/BreadCrumb'

  import echarts from 'echarts'
  export default {
    name: 'DataReport',
    components: {
      BreadCrumb
    },
    data() {
      return {
        titlesList: [
          {
            value: '首页',
            path: '/'
          },
          {
            value: '数据统计'
          },
          {
            value: '数据报表'
          }
        ],
        options: {},
      }
    },
    mounted() {
      this.getReportsData()
    },
    methods: {
      async getReportsData() {
        const res = await reportsData()
        
        const {
          data,
          meta: { status },
        } = res

        console.log(data)

        // 自定义数据
        let option1 = {
          title: {
            text: '堆叠区域图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
        }
        if (status === 200) {
          let option2 = data
          this.options = {...option1, ...option2}
          
          const myChart = echarts.init(document.getElementById('main'))
          myChart.setOption(this.options)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;

    #main {
      margin-top: 20px;
    }
  }
</style>



