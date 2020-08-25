<template>
  <el-dialog :title="name" 
    :visible="dialogFormVisible" 
    :width="dialogWidth"
    @open="open" 
    @close="cancel">
    <el-form :model="form">
      <el-form-item 
        v-for="(item, index) in form.formContent"
        :key="index"
        class="form-item" 
        :label="item.item_cn_title" 
        :label-width="formLabelWidth">
        <el-input v-model="form[item.item_en_title]" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel(isRequest = false)">取 消</el-button>
      <el-button type="primary" @click="cancel(isRequest = true)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'Dialog',
    props: {
      name: '',
      dialogFormVisible: {
        type: Boolean,
        default: false
      },
      form: {
        type: Object,
        default: {}
      },
      formLabelWidth: {
        type: String,
        default: '100px'
      },
      dialogWidth: {
        type: String,
        default: '50%'
      }
    },
    data() {
      return {
        isRequest: false
      }
    },
    methods: {
      // 通过自定义事件，在父组件里修改dialogFormVisible的值
      // 关闭添加用户对话框
      cancel(status) {
        this.$emit('cancelAddUser', status)
      },

      // 打开添加用户对话框
      open() {
        this.$emit('openAddUser')
      }
    }
  }
</script>

<style lang="less" scoped>
  .form-item {
    margin-bottom: 15px;
  }
</style>
