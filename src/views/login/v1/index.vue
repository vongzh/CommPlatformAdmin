<template>
  <div class="login-container">
    <div class="login-bg" :style="bg" />
    <div class="form-container">
      <el-form
        ref="loginForm"
        class="login-form"
        autocomplete="on"
        label-position="left"
        :model="loginUser"
        :rules="loginRules"
      >
        <el-row style="margin-bottom:50px">
          <span class="login">登录</span>
          <!-- <div class="logo-container">
            <img :src="logo" alt="logo" style="transform:rotate(90deg);">
          </div> -->
          <!-- <div class="title-container">
          <h3 class="title">众客酒店平台</h3>
          </div>-->
        </el-row>
        <el-row style="margin-bottom:2rem">
          <el-form-item prop="username">
            <!-- <span class="svg-container">
            <svg-icon icon-class="user" style="color:whitesmoke" />
            </span>-->
            <el-input
              ref="username"
              v-model="loginUser.username"
              placeholder="请输入手机号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
              maxlength="18"
              clearable
              suffix-icon="el-icon-user"
            />
            <el-tooltip content="使用用户名或手机号登录" placement="right-start">
              <span class="show-pwd">
                <i class="el-icon-info" style="color:whitesmoke" />
              </span>
            </el-tooltip>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="password">
            <!-- <span class="svg-container">
              <svg-icon icon-class="password" style="color:whitesmoke" />
            </span>-->
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginUser.password"
              :type="passwordType"
              clearable
              placeholder="请输入密码(6-20位字符)"
              name="password"
              tabindex="2"
              autocomplete="on"
              maxlength="25"
              suffix-icon="el-icon-lock"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <el-tooltip v-model="capsTooltip" content="大写锁定打开" placement="right" manual>
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                  style="color:whitesmoke"
                />
              </span>
            </el-tooltip>
          </el-form-item>

        </el-row>
        <el-row class="content-btn-login">
          <el-col>
            <el-link style="color:#006699;margin-bottom:50px;margin-top:20px" class="float-right" @click="goForgetPwd()">忘记密码?</el-link>
          </el-col>
          <el-col>
            <el-button
              :loading="loading"
              type="primary"
              class="submit-button"
              @click.native.prevent="handleLogin"
            >登录</el-button>
            <span style="border-bottom:1px solid #A5A5A4;margin-left:30px;color:#A5A5A4;font-size:14px">还没有账号?去<span style="color:#006699;cursor:pointer" @click="goRegister()">注册</span></span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <div class="third-login-container">
      <el-divider><i>第三方登录</i></el-divider>
      <el-popover placement="right-end" @show="wechatQRCode">
        <div id="wechatloginqr" />
        <el-link slot="reference" :underline="false"><svg-icon icon-class="wechat1" class-name="third-login-logo" /></el-link>
      </el-popover>
    </div>
    <div style="position: absolute;bottom: 0.625rem;width: 100%;text-align: center;">
      <span style="color: whitesmoke;">
        <el-link
          style="font-size: medium;margin-right: 0.625rem;color: whitesmoke;"
          href="51zhu.cn"
        >51zhu.cn</el-link>&copy; 2020
      </span>
      <el-divider direction="vertical" />
      <span style="margin-left: 0.3125rem;">
        <el-link
          style="font-size: small;color: whitesmoke;"
          href="http://ha.beian.miit.gov.cn"
          target="_blank"
        >豫ICP备18038275号</el-link>
      </span>
    </div> -->
  </div>
</template>

<script>
import bg from '@/assets/custom-theme/imgs/bg.png'
import logo from '@/assets/custom-theme/imgs/logo.png'

export default {
  name: 'Login',
  data() {
    return {
      bg: 'background:url(' + bg + ');background-size: cover;',
      logo: logo,
      loginUser: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入用户名或手机号'))
              } else {
                callback()
              }
            }
          }
        ],
        password: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                callback()
              }
            }
          }
        ]
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
    this.init()
  },
  methods: {
    init() {
      this.addScript('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js')

      if (this.loginUser.username === '') {
        this.$refs.username.focus()
      } else if (this.loginUser.password === '') {
        this.$refs.password.focus()
      }
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
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
          .then(res => {
            this.$router.push({
              path: '/'
            })
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
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
    },
    addScript(url) {
      const script = document.createElement('script')
      script.type = 'application/javascript'
      script.src = url
      document.head.appendChild(script)
    },
    wechatQRCode() {
      const rurl = encodeURIComponent('https://www.51zhu.cn/wechat/redirect')
      new WxLogin({
        self_redirect: true,
        id: 'wechatloginqr',
        appid: 'wx07e37ee0e76ce337',
        scope: 'snsapi_login',
        redirect_uri: rurl,
        state: 'zknet',
        style: 'black'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #283443;
$light_gray: #fff;
$cursor: #F4F7F9;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    border-bottom: 1px solid #DCDFE6;
  }
}

.el-input ::v-deep  .el-input__inner {
  background-color: $cursor;
  border:0;
  height: 50px;
  color: black;
  border-bottom: 1px solid #DCDFE6;
  padding-left: 0;
}

.el-input ::v-deep  .el-icon-user {
  font-size: 25px;
}

.el-input ::v-deep  .el-icon-lock {
  font-size: 25px;
}

.third-login-container {
  width: 22%;
  margin-left: 38%;
  margin-top: 30px;
  text-align: center;
}

.el-divider__text {
  color: white;
  background-color: rgba(0,0,0,0);
}

.third-login-logo {
  color: white;
  width: 50px;
  height: 50px;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 100%;
    z-index: 1;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      color: $light_gray;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #F4F7F9;
$dark_gray: #889aa4;
$light_gray: #eee;
.login{
  font-size: 40px;
  color: #006699;
  margin-bottom: 50px;
}
.login-bg{
  width: 50vw;
  height: 100vh;
  background: wheat;
  float: left;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  z-index: 1;
  position: relative;

  .form-container {
    border-radius: 5px;
    position: relative;
    width: 550px;
    margin: 0 auto;
    max-width: 100%;
    padding: 30px 35px 30px;
    margin-top: 8%;
    // float:right;
    overflow: hidden;
    z-index: 2;
  }

  .login-form {
    z-index: 999;
    position: relative;
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
    padding: 10px 5px 10px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    margin-right: 0.625rem;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-bottom: 30px;

    .title {
      font-size: 22px;
      color: $light_gray;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .logo-container {
    text-align: center;
    margin-bottom: 30px;

    img {
      width: 65px;
      height: 65px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 5px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .submit-button {
    font-size: 15px;
    border-radius: 50px;
    width: 40%;
    height: 45px;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .float-right {
    float: right;
  }

  .content-btn-login {
    width: 100%;
  }

  .content-link {
    margin-top: 2%;
    width: 100%;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #333333 inset;
    -webkit-text-fill-color: #fff;
}
</style>
