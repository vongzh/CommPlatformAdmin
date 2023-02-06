<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" autocomplete="on" label-position="left" :model="loginUser" :rules="loginRules">
      <el-row>
        <div class="title-container">
          <h3 class="title">登录</h3>
        </div>
      </el-row>
      <el-row>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginUser.username"
            placeholder="用户名/手机号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            clearable
          />
          <el-tooltip content="使用用户名或手机号登录" placement="right-start">
            <span class="show-pwd">
              <i class="el-icon-info" />
            </span>
          </el-tooltip>
        </el-form-item>
      </el-row>
      <el-row>
        <el-tooltip v-model="capsTooltip" content="大写锁定打开" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginUser.password"
              :type="passwordType"
              clearable
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-button :loading="loading" type="primary" class="submit-button" @click.native.prevent="handleLogin">登录</el-button>
      </el-row>
      <el-row class="content-link" type="flex" justify="space-between">
        <el-col>
          <el-link @click="goRegister()">申请账号</el-link>
        </el-col>
        <el-col>
          <el-link class="float-right" @click="goForgetPwd()">忘记密码?</el-link>
        </el-col>
      </el-row>
    </el-form>
    <div style="position: absolute;bottom: 0.625rem;width: 100%;text-align: center;">
      <span style="color: whitesmoke;"><el-link style="font-size: medium;margin-right: 0.625rem;color: whitesmoke;" href="51zhu.cn">51zhu.cn</el-link>&copy; 2019</span>
      <el-divider direction="vertical" />
      <span style="margin-left: 0.3125rem;"><el-link style="font-size: small;color: whitesmoke;" href="http://ha.beian.miit.gov.cn" target="_blank">豫ICP备18038275号</el-link></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginUser: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'))
            } else {
              callback()
            }
          }
        }],
        password: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else {
              callback()
            }
          }
        }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginUser.username === '') {
      this.$refs.username.focus()
    } else if (this.loginUser.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock({
      shiftKey,
      key
    } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) ||
            (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        this.$store
          .dispatch('user/login', this.loginUser)
          .then((res) => {
            this.$router.push({
              path: this.redirect || '/'
            })
          // eslint-disable-next-line handle-callback-err
          }).catch(err => {
            this.loading = false
          })
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    goRegister() {
      this.$router.push({
        path: '/quickregister'
      })
    },
    goForgetPwd() {
      this.$router.push({
        path: '/forgetpwd'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    padding-top: 5%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      margin-right: 0.625rem;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 22px;
        color: $light_gray;
        margin: 0px auto 30px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 5px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .submit-button {
      width: 100%;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    .float-right {
      float: right;
    }

    .content-link {
      margin-top: 1%;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
