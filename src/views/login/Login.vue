<template>
  <div class="login">
    <el-form label-position="top"
             label-width="80px"
             :model="formData"
             class="login-form">
      <h2>用户登录</h2>
      <el-form-item label="用户名" size="small" class="label-font">
        <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" size="small" class="label-font"> 
        <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-button type="primary" 
                 class="login-btn"
                 size="small"
                 @click.prevent="handleLogin(formData)">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  import { login } from 'network/login'
  export default {
    name: 'Login',
    data() {
      return {
        formData: {
          username: null,
          password: null
        }
      }
    },
    methods: {
      handleLogin(userData) {
        login(userData).then(res => {
          const {
            data, // 用户的账号信息
            meta: { msg, status } // 解构赋值
          } = res

          // 登录验证成功
          if( status === 200 ) {
            // this.$router.push('/home')
            this.$message.success(msg);
          }else{
            // 错误信息
            this.$message.error(msg);
          }
          
        }).catch(err => console.log(err))
      }

      // 调用插件
      // handleLogin() {
      //   this.$http.post('/login', this.formData).then(res =>{
      //     console.log(res.data)
      //   })
      // }
    }
  }
</script>

<style lang="less" scoped>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background:
      linear-gradient(
        45deg,
        #ccffff 0,
        #ffcccc 100%
      )
    ;

    > .login-form {
      // box-sizing: border-box;
      width: 400px;
      padding: 20px;
      border-radius: 7px;
      background-color: #fff;
      box-shadow: 0 0 3px 1px rgba(100, 100, 100, .1); 

      > h2 {
        margin: 5px 0;
      }

      > .label-font {
        margin-bottom: 8px;

        > label {
          padding-bottom: 5px;
        }
      }

      > .login-btn {
        width: 100%;
        margin: 20px 0 10px;
      }
    }
  }
</style>