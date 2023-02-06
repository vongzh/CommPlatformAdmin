<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <el-page-header content="用户注册" @back="goBack" />
        <span class="goBack">
          <el-link type="primary" @click="goBack">已有账号，去登陆</el-link>
        </span>
      </div>
      <el-steps :active="activeSetp" simple>
        <el-step title="验证手机号" icon="el-icon-edit"/>
        <el-step title="设置用户名/密码" icon="el-icon-key"/>
        <el-step title="完成" icon="el-icon-check" />
      </el-steps>
      <el-tabs v-model="currentTab" tab-position="top" style="margin-top: -2.6rem;">
        <el-tab-pane name="setp1" :lazy="true" :disabled="true">
          <el-form
            ref="setp1Form"
            :model="customerInfo"
            :rules="accounRules"
            :hide-required-asterisk="true"
            label-position="right"
            label-width="100px"
            class="form1"
            @validate="afterValidate"
          >
            <el-form-item ref="phoneblur" label="注册手机号" prop="phone">
              <el-col :span="8">
                <el-input
                  v-model="customerInfo.phone"
                  :maxlength="11"
                  placeholder="请输入手机号"
                  clearable
                  @clear="clearphone"
                  @blur="blursearch"
                />
              </el-col>
              <el-col v-if="mobileCanRegister" :span="10">
                <el-link
                  :underline="false"
                  style="margin-left: 10px;font-size: small;color: yellowgreen;"
                >
                  恭喜，该手机号可以注册。
                </el-link>
              </el-col>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
              <el-col :span="5">
                <el-input v-model="customerInfo.captcha" placeholder="请输入验证码" :maxlength="4" clearable />
              </el-col>
              <el-col :offset="1" :span="5">
                <el-button
                  :type="canSendCaptcha?'primary':'info'"
                  size="mini"
                  @click="sendCaptcha()"
                >{{ captchaText }}</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="verifyCaptcha">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="setp2" :lazy="true" :disabled="true">
          <el-form
            ref="setp2Form"
            :model="customerInfo"
            :rules="accounRules"
            :hide-required-asterisk="true"
            label-position="right"
            label-width="80px"
            class="form2"
            @validate="afterValidate"
          >
            <el-form-item label="用户名" prop="customerName">
              <el-col :span="8">
                <el-input
                  v-model="customerInfo.customerName"
                  auto-complete="off"
                  maxlength="18"
                  placeholder="请输入用户名"
                  size="small"
                  clearable
                  @clear="clearusername"
                />
              </el-col>
              <el-col :span="10">
                <el-link
                  :underline="false"
                  style="margin-left: 10px;font-size: small;color: darkgray;"
                >
                  6-18
                  位字母和数字组合，不能以数字开头
                </el-link>
              </el-col>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-col :span="8">
                <el-input
                  v-model="customerInfo.pwd"
                  type="password"
                  show-password
                  show-word-limit
                  size="small"
                  auto-complete="off"
                  placeholder="请输入密码"
                  maxlength="20"
                  clearable
                />
              </el-col>
              <el-col :span="10">
                <el-link
                  :underline="false"
                  style="margin-left: 10px;font-size: small;color: darkgray;"
                >
                  8-20
                  位字母、数字和字符，需包含至少两种及以上类型
                </el-link>
              </el-col>
            </el-form-item>
            <el-form-item label="重复密码" prop="repeatPwd">
              <el-col :span="8">
                <el-input
                  v-model="customerInfo.repeatPwd"
                  type="password"
                  show-password
                  size="small"
                  show-word-limit
                  auto-complete="off"
                  placeholder="请再次输入密码"
                  maxlength="20"
                  clearable
                />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="quickRegister">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="setp3" :lazy="true" :disabled="true">
          <div style="width: 50%;margin-left: 30%;margin-top: 3rem;">
            <el-row>
              <i class="el-icon-circle-check" style="color: #13CE66;font-size: 5rem;margin-left:40%" />
            </el-row>
            <el-row style="margin-top: 2rem;">
              <el-link :underline="false" style="font-size: x-large;">恭喜您！已成功注册51住酒店预订平台，请使用已注册的用户名或手机号进行</el-link>
              <el-link style="font-size: x-large;color: #1890FF;" @click="goBack()">登录</el-link>
              <el-link :underline="false" style="font-size: x-large;">。</el-link>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  CheckUserMobileIsExist,
  CheckUserNameIsExist,
  Captcha,
  VerifyCaptcha,
  QuickRegister
} from '@/api/customer/customer'
export default {
  data() {
    var checkUserMobileIsExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
        this.mobileCanRegister = false
        return
      }
      CheckUserMobileIsExist(value).then(res => {
        if (!res.data) {
          this.mobileCanRegister = true
          callback()
        } else {
          this.mobileCanRegister = false
          callback(new Error('该手机号码已被注册'))
        }
      })
    }
    var checkUserNameIsExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
        return
      }
      CheckUserNameIsExist(value).then(res => {
        if (!res.data) {
          callback()
        } else {
          callback(new Error('该用户名已被注册'))
        }
      })
    }
    var checkRepeqtPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.customerInfo.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      currentTab: 'setp1',
      customerInfo: {},
      mobileCanRegister: false,
      accounRules: {
        customerName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '用户名长度应为6~18个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[A-Za-z][A-Za-z0-9]{5,18}$/,
            message: '用户名只能输入字母、数字，需要以字母开头',
            trigger: 'blur'
          },
          {
            validator: checkUserNameIsExist,
            trigger: 'blur'
          }
        ],
        phone: [

          {
            pattern: /[^\u4e00-\u9fa5_a-zA-Z]+$/,
            message: '格式不正确，请输入手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '手机号长度应为11位数字',
            trigger: 'blur'
          },
          {
           pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
            message: '手机号码无效',
            trigger: 'blur'
          },
          {
            validator: checkUserMobileIsExist,
            trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            pattern: /[0-9]$/,
            message: '验证码请输入数字！',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 4,
            message: '验证码长度应为4位',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 20,
            message: '密码长度在 8 到 20 个字符',
            trigger: 'blur'
          },
          {
            // pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/, // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/, 
            message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
            trigger: 'blur'
          }
        ],
        repeatPwd: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            validator: checkRepeqtPwd,
            trigger: 'blur'
          }
        ]
      },
      canSendCaptcha: false,
      canToSetp2: false,
      canToSetp3: false,
      captchaText: '发送验证码',
      countDown: 0,
      timer: null
    }
  },
  computed: {
    activeSetp() {
      let setp = 0
      switch (this.currentTab) {
        case 'setp1':
          setp = 1
          break
        case 'setp2':
          setp = 2
          break
        case 'setp3':
          setp = 3
          break
        default:
          break
      }
      return setp
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.addScript('https://ssl.captcha.qq.com/TCaptcha.js')
    },
    quickRegister() {
      this.$refs.setp2Form.validate(valid => {
        if (!valid) {
          return
        }
        if (!this.canToSetp3) {
          this.$message('请先完善注册信息')
          return
        }
        QuickRegister(this.customerInfo).then(res => {
          if (res.data) {
            this.currentTab = 'setp3'
          } else {
            this.$message({ type: 'info', message: '注册失败' })
          }
        })
      })
    },
    blursearch() {
      const rephone = this.customerInfo.phone
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (!reg.test(rephone)) {
        this.mobileCanRegister = false
        return
      }
    },

    clearphone() {
      this.$refs['setp1Form'].clearValidate()

      this.mobileCanRegister = false
      this.canSendCaptcha = false
    },
    
    clearusername() {
      this.$refs['setp2Form'].clearValidate()
    },
    verifyCaptcha() {
      this.$refs.setp1Form.validate(valid => {
        if (!valid) {
          this.mobileCanRegister = false
          return
        }

        if (!this.canToSetp2) {
          this.$message('请先完善注册信息')
          return
        }

        const mobile = this.customerInfo.phone
        const code = this.customerInfo.captcha
        VerifyCaptcha(mobile, code, 1).then(res => {
          if (res.data.item1) {
            this.customerInfo.requestId = res.data.item2
            this.currentTab = 'setp2'
          } else {
            this.$error('验证失败')
          }
        })
      })
    },
    sendCaptcha() {
      // const validProp = ['phone']
      // this.$refs['setp1Form'].validateField(validProp, (res) => {
      //   this.canSendCaptcha = !res
      if (!this.canSendCaptcha) {
        return
      }
      if (this.countDown > 0) {
        this.canSendCaptcha = false
        return
      }

      // eslint-disable-next-line no-undef
      var captcha = new TencentCaptcha('2085651946', res => {
        const randstr = res.randstr
        const ticket = res.ticket
        const ret = res.ret
        const mobile = this.customerInfo.phone
        if (ret !== 0) {
          return
        }

        const TIME_COUNT = 60
        this.countDown = TIME_COUNT
        this.canSendCaptcha = false
        // 1：注册 //2：找回密码
        const type = 1
        Captcha(mobile, type, randstr, ticket, ret)
          .then(res => {
            if (res.data) {
              this.timer = setInterval(() => {
                if (this.countDown > 0 && this.countDown <= TIME_COUNT) {
                  this.countDown--
                  this.captchaText = this.countDown + '秒后重发'
                } else {
                  this.canSendCaptcha = true
                  this.captchaText = '发送验证码'
                  clearInterval(this.timer)
                }
              }, 1000)
              this.$message({
                type: 'success',
                message: '验证码发送成功'
              })
            } else {
              this.countDown = 0
              this.canSendCaptcha = true
              this.$message({
                type: 'info',
                message: '验证码发送失败，请稍后再试'
              })
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.countDown = 0
            this.canSendCaptcha = true
          })
      })
      captcha.show()
      // })
    },
    afterValidate(item, result, message) {
      switch (item) {
        case 'phone':
          this.canSendCaptcha = result && this.countDown <= 0
          break
        case 'captcha':
          this.canToSetp2 = result
          break
        case 'repeatPwd':
          this.canToSetp3 = result
          break
      }
    },
    goBack() {
      this.$router.push({
        path: '/login'
      })
    },
    addScript(url) {
      const script = document.createElement('script')
      script.type = 'application/javascript'
      script.src = url
      document.head.appendChild(script)
    }
  }
}
</script>
<style scoped>
.form1 {
  width: 60%;
  margin-left: 35%;
  margin-top: 30px;
}

.form2 {
  width: 60%;
  margin-left: 35%;
  margin-top: 30px;
}
  input {
    width: 200px;
  }
.goBack {
  margin-top: -20px;
  float: right;
}
</style>

<style lang="scss" scoped>
.el-form-item {
  height: 50px;
}

.el-link.el-link--default:hover {
	color: #606266;
}
</style>
