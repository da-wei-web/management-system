<template>
  <el-container class="container">
    <el-header class="header">
      <el-row class="row">
        <el-col :span="4" class="col-item logo"></el-col>
        <el-col :span="18" class="col-item">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2" class="col-item">
          <el-button type="text" class="exit" @click="exit()">退出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <!-- 需大写 -->
        <Menu :menus-list="menusList"></Menu>
      </el-aside>
      <el-main class="main">
        <!-- isRouterAlive用于刷新页面 -->
        <router-view v-if="isRouterAlive" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Menu from 'components/content/Menu'

  import { getMenus } from 'network/menus'

  export default {
    name: 'Home',
    components: {
      Menu
    },
    provide () {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        // 用于刷新页面
        isRouterAlive: true,
        // 菜单列表数据
        menusList: [],
        // 菜单标题图标
        icons: [
          {
            icon1: 'el-icon-location',  // 一级标题图标
            childIcon: ['el-icon-user-solid']  // 二级标题图标
          },
          {
            icon1: 'el-icon-location',
            childIcon: ['el-icon-user', 'el-icon-key'] 
          },
          {
            icon1: 'el-icon-location',
            childIcon: ['el-icon-goods', 'el-icon-setting', 'el-icon-rank'] 
          },
          {
            icon1: 'el-icon-location',
            childIcon: ['el-icon-tickets'] 
          },
          {
            icon1: 'el-icon-location',
            childIcon: ['el-icon-pie-chart'] 
          }
        ]
      }
    },
    created() {
      this.getMenusList()
    },
    methods: {
      // 请求菜单权限列表
      async getMenusList() {
        const res = await getMenus()

        const { 
          data,
          meta: {msg, status}
        } = res

        console.log(res)

        // 处理数据, 在数据中添加图标
        if (data !== null) {
          data.forEach((item1, index1) => {
            item1.icon = this.icons[index1].icon1
            item1.children.forEach((item2, index2) => {
              item2.icon = this.icons[index1].childIcon[index2]
            })
          })
        }
        
        // 保存新的数据
        if (status === 200) {
          this.menusList = data
          // console.log(this.menusList)
        }
      },

      // 退出
      exit() {
        this.$confirm('您即将退出平台, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 成功的提示信息
          this.$message.success('退出成功!')

          // 清楚token
          localStorage.clear()

          // 跳转到登录页
          this.$router.push('/login')
        })
        .catch(() => {})
      },

      // 刷新页面
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    height: 100%;

    > .header {
      background-color: #136BB7;

      > .row {
        height: 100%;

        > .col-item {
          height: 100%;
          line-height: 60px;
          text-align: center;
          color: #fff;

          > .exit {
            color: #fff;

            &:hover {
              color: #4dacff;
            }
          }
        }

        > .logo {
          background: 
            url("~assets/images/logo.png") 
            no-repeat center / contain;
        }
      }
    }

    .aside {
      background-color: #2364AA;
    }

    .main {
      height: 100%;
      background-color: #DCF1FC;
    }
  }
</style>
