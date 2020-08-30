<template>
  <el-menu @open="handleOpen"
            :router="true" 
            :unique-opened="true">
    <sub-menu v-for="(item, i) in titles" 
              :key="i" 
              :current-index="i + 1">
      <!-- 一级标题 -->
      <icon :class-name="item.icon"></icon>
      <span>{{ item.name }}</span>
      
      <!-- 二级标题 -->
      <template v-slot:subtitle>
        <el-menu-item v-for="(childItem, childIndex) in item.childTitles"
                      :key="childIndex"
                      :index="childItem.router">
                      <icon v-if="childItem.icon" :class-name="childItem.icon"></icon>
                      {{childItem.name}}
        </el-menu-item>
      </template>

    </sub-menu>
  </el-menu>
</template>

<script>
  import SubMenu from '../common/SubMenu'
  import Icon from '../common/Icon'
  export default {
    name: 'Menu',
    data() {
      return {
        titles: [ 
          {
            name:'用户管理',
            icon: 'el-icon-location', 
            childTitles: [
              {name:'用户列表', icon: 'el-icon-user-solid', router: '/users'}
            ]
          },
          {
            name:'权限管理', 
            icon: 'el-icon-location',
            childTitles: [
              {name:'角色列表', icon: 'el-icon-user', router: '/role'},
              {name:'权限列表', icon: 'el-icon-key', router: '/right'}
            ]
          },
          {
            name:'商品管理', 
            icon: 'el-icon-location',
            childTitles: [
              {name:'商品列表', icon: 'el-icon-goods'},
              {name:'分类参数', icon: 'el-icon-setting'},
              {name:'商品分类', icon: 'el-icon-rank'}
            ]
          },
          {
            name:'订单管理', 
            icon: 'el-icon-location',
            childTitles: [
              {name:'订单列表', icon: 'el-icon-tickets'}
            ]
          },
          {
            name:'数据统计', 
            icon: 'el-icon-location',
            childTitles: [
              {name:'数据列表', icon: 'el-icon-pie-chart'}
            ]
          }
        ]
      }
    },
    components: {
      SubMenu,
      Icon
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style>

</style>