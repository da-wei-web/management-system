<template>
  <el-container class="container">
    <el-header class="header">
      <el-row class="row">
        <el-col :span="4" class="col-item logo"></el-col>
        <el-col :span="18" class="col-item">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2" class="col-item">
          <el-button type="text" class="exit">退出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home'
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