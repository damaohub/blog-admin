<template>
  <div class="form-container">
    <el-form autoComplete="on" :model="defaultForm" status-icon  :rules="defaultRules" ref="defaultForm" label-position="left" label-width="0px"
      :class="['card-box',isRegist ? 'regist-form' : 'login-form']">
      <h3 class="title">vue-element-admin</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_form">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="defaultForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="email" v-if=isRegist>
        <span class="svg-container svg-container_form">
          <i class="el-icon-message"></i>
        </span>
        <el-input name="email" type="email" v-model="defaultForm.email" autoComplete="on" placeholder="邮箱" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="defaultForm.password" autoComplete="on"
          placeholder="输入密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="checkPass" v-if=isRegist>
        <span class="svg-container">
          <i class="el-icon-circle-check"></i>
        </span>
        <el-input name="checkPass" :type="pwdType" @keyup.enter.native="handleLogin" v-model="defaultForm.checkPass" autoComplete="on"
          placeholder="确认密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button v-if=isRegist type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleRegist">
          注册
        </el-button>
        <el-button v-else type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="tips" v-if=!isRegist>
        <!-- <span style="margin-right:20px;">username:{{loginForm.username}}</span>
        <span> password: {{loginForm.password}}</span> -->
        <span>没有帐号注册？<router-link to="/regist">注册</router-link></span>
      </div>
    </el-form>
  </div>
  
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { regist } from '@/api/login'
export default {
  name: 'formDetail',
  props: {
    isRegist: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        if (this.defaultForm.checkPass !== '') {
          this.$refs.defaultForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.defaultForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      defaultForm: {
        username: '',
        email: '',
        password: '',
        checkPass: ''
      },
      defaultRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        email: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        checkPass: [{ required: true, trigger: 'blur', validator: validateCheckPass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      const { username, password } = this.defaultForm
      const loginForm = { username, password }
      this.$refs.defaultForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message({
            showClose: true,
            message: '注意检查填写信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleRegist() {
      const { username, email, password, checkPass } = this.defaultForm
      const registForm = { username, email, password, checkPass }
      this.$refs.defaultForm.validate(valid => {
        if (valid) {
          this.loading = true
          regist(registForm).then(response => {
            this.loading = false
            this.$router.push({ path: '/login' })
          })
        } else {
          this.$message({
            showClose: true,
            message: '注意检查填写信息',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .form-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_form {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form,.regist-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .regist-form{ 
      margin: 65px auto;
      }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
