<template>
  <el-container class="container">
    <el-header class="header">Header</el-header>
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
      background-color: #181658;
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