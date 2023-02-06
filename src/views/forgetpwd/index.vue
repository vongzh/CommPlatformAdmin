<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <el-page-header content="找回密码" @back="goBack" />
        <span class="goBack">
          <el-link type="primary" @click="goBack">已有账号，去登陆</el-link>
        </span>
      </div>
      <el-steps :active="activeSetp" simple>
        <el-step v-if="activeSetp===0" title="验证手机号" icon="el-icon-warning-outline" />
        <el-step v-if="activeSetp===1" title="二次验证" icon="el-icon-warning" />
        <el-step v-if="activeSetp===2" title="重置密码" icon="el-icon-key" />
        <el-step v-if="activeSetp===3" title="完成" icon="el-icon-check" />
      </el-steps>
      <el-tabs v-model="currentTab" tab-position="top" style="margin-top: -2.6rem;">
        <el-tab-pane name="setp1" :lazy="true" :disabled="true">
          <el-form
            ref="setp1Form"
            :model="customerInfo"
            :rules="setp1Rules"
            :hide-required-asterisk="true"
            label-position="right"
            label-width="120px"
            class="form1"
          >
            <el-form-item label="注册手机号" prop="mobile">
              <el-col :span="5">
                <el-input v-model="customerInfo.mobile"  placeholder="请输入注册手机号" maxlength="11" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
              <el-col :span="5">
                <el-input v-model="customerInfo.captcha" placeholder="请输入验证码" :maxlength="4" clearable />
              </el-col>
              <el-col :offset="1" :span="5">
                <el-button :type="canSendCaptcha?'primary':'info'" :disabled="!canSendCaptcha" size="mini" @click="sendCaptcha()">{{ captchaText }}</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button :type="canToSetp2?'primary':'info'" :disabled="!canToSetp2" size="small" @click="verifyCaptcha">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="setp2" :lazy="true" :disabled="true">
          <div v-if="loadIdentify" v-loading="loadIdentify" style="height: 28.125rem" />
          <div v-else>
            <div v-if="!identifyCheckResult" style="padding-left: 40%;margin-top: 2rem;">
              <el-row style="margin: 0.625rem;margin-left: 3rem;">
                <i class="el-icon-circle-close" style="color: #FF4040;font-size: 5rem;" />
              </el-row>
              <el-row>
                <el-link :underline="false" style="color: #FF4040;font-size: medium">验证失败：</el-link> <el-link :underline="false" style="color: #FF4040;font-size: large;">{{ identifyCheckInfo }}</el-link>
              </el-row>
              <el-row style="margin-left: 4rem;margin-top: 4rem;">
                <el-button type="primary" size="small" @click="goSetp1()">返回</el-button>
              </el-row>
            </div>
            <div v-else>
              <div v-if="!needCheck" style="width: 40%;margin-left: 45%;margin-top: 2rem;">
                <el-row style="margin: 0.625rem;margin-left: 0.625rem;">
                  <i class="el-icon-circle-check" style="color: #13CE66;font-size: 5rem;" />
                </el-row>
                <el-row style="margin-left: 0.625rem;">
                  <el-link :underline="false" style="color: #2D3A4B;font-size: large;">验证通过！</el-link>
                </el-row>
                <el-row style="margin-left: 1.25rem;margin-top: 4rem;">
                  <el-button :type="canToSetp3?'primary':'info'" :disabled="!canToSetp3" size="small" @click="checkPass">下一步</el-button>
                </el-row>
              </div>
              <el-form
                v-else
                ref="setp2Form"
                :model="customerInfo"
                :rules="setp2Rules"
                :hide-required-asterisk="true"
                label-position="right"
                label-width="200px"
                class="form2"
              >
                <el-form-item label="身份证姓名" prop="realName">
                  <el-col :span="14">
                    <el-input
                      v-model="customerInfo.realName"
                      size="small"
                      auto-complete="off"
                      placeholder="身份证姓名"
                      :maxlength="20"
                      clearable
                    />
                  </el-col>
                  <el-tooltip placement="bottom">
                    <div slot="content">请填写账户信息中的身份证姓名</div>
                    <i class="el-icon-info" style="margin-left: 0.625rem;" />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="身份证号码" prop="idCard">
                  <el-col :span="14">
                    <el-input
                      v-model="customerInfo.idCard"
                      size="small"
                      auto-complete="off"
                      placeholder="请输入身份证号码"
                      :maxlength="18"
                      clearable
                    />
                  </el-col>
                  <el-tooltip placement="bottom">
                    <div slot="content">请填写账户信息中的身份证号</div>
                    <i class="el-icon-info" style="margin-left: 0.625rem;" />
                  </el-tooltip>
                </el-form-item>
                <el-form-item>
                  <el-button :type="canToSetp3?'primary':'info'" :disabled="!canToSetp3" size="small" @click="checkIdentity">下一步</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="setp3" :lazy="true" :disabled="true">
          <el-form
            ref="setp3Form"
            :model="customerInfo"
            :rules="setp3Rules"
            :hide-required-asterisk="true"
            label-position="right"
            label-width="220px"
            class="form3"
          >
            <el-form-item label="密码" prop="pwd">
              <el-col :span="14">
                <el-input
                  v-model="customerInfo.pwd"
                  type="password"
                  show-password
                  size="small"
                  auto-complete="off"
                  placeholder="请输入密码"
                  maxlength="20"
                  clearable
                />
              </el-col>
            </el-form-item>
            <el-form-item label="重复密码" prop="repeatPwd">
              <el-col :span="14">
                <el-input
                  v-model="customerInfo.repeatPwd"
                  type="password"
                  show-password
                  size="small"
                  auto-complete="off"
                  placeholder="请再次输入密码"
                  maxlength="20"
                  clearable
                />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button :type="canToSetp4?'primary':'info'" :disabled="!canToSetp4" size="small" @click="resetPwd">重置密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="setp4" :lazy="true" :disabled="true">
          <div style="width: 40%;margin-left: 45%;margin-top: 3rem;">
            <el-row>
              <i class="el-icon-circle-check" style="color: #13CE66;font-size: 5rem;" />
            </el-row>
            <el-row style="margin-left: -7%;margin-top: 1rem;">
              <el-link :underline="false" style="font-size: x-large;">密码重置成功,去</el-link><el-link style="font-size: x-large;color: #1890FF;" @click="goBack()"> 登录 </el-link>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import md5 from 'js-md5'
import {
  FindPwd,
  VerifyCaptcha,
  // CheckUserNameIsExist,
  CheckUserMobileIsExist,
  ResetPwd,
  CheckIdentity,
  CheckCustomer
} from '@/api/customer/customer'
export default {
  data() {
    // var checkUserNameIsExist = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入用户名'))
    //     return
    //   }
    //   CheckUserNameIsExist(value).then(res => {
    //     if (res.data) {
    //       callback()
    //     } else {
    //       callback(new Error('用户不存在'))
    //     }
    //   })
    // }

    var checkUserMobileIsExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
        return
      }
      CheckUserMobileIsExist(value).then(res => {
        if (res.data) {
          callback()
        } else {
          callback(new Error('此手机号未注册账号'))
        }
      })
    }

    var checkRepeatPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
        return
      }

      if (value === this.customerInfo.pwd) {
        callback()
      } else {
        callback(new Error('两次密码不一致'))
      }
    }

    return {
      currentTab: 'setp1',
      customerInfo: {
        mobile: '',
        captcha: '',
        pwd: '',
        repeatPwd: ''
      },
      canSendCaptcha: false,
      canToSetp2: false,
      canToSetp3: false,
      canToSetp4: false,
      loadIdentify: true,
      identifyCheckResult: false,
      identifyCheckInfo: '',
      needCheck: true,
      captchaText: '发送验证码',
      countDown: 0,
      timer: null,
      setp1Rules: {
        // userName: [{
        //   required: true,
        //   message: '请输入用户名！',
        //   trigger: 'blur'
        // },
        // {
        //   min: 6,
        //   max: 18,
        //   message: '用户名长度在 6 到 18 个字符！',
        //   trigger: 'blur'
        // },
        // {
        //   pattern: /^[A-Za-z0-9]{6,18}$/,
        //   message: '用户名只支持大小写字母、数字！',
        //   trigger: 'blur'
        // },
        // {
        //   validator: checkUserNameIsExist,
        //   trigger: 'blur'
        // }
        // ],
        mobile: [
          {
            required: true,
            message: '请输入注册手机号',
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
        captcha: [{
          required: true,
          message: '请输入验证码！',
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
        ]
      },
      setp2Rules: {
        idCard: [
          {
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          },
          {
            min: 18,
            max: 18,
            message: '请输入长度为18位的身份证号码',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        realName: [{
          required: true,
          message: '请输入身份证姓名',
          trigger: 'blur'
        },
        {
          pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
          message: '身份证姓名只能输入中文、点（·），需要以中文开头',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '身份证姓名长度应为2-20个字符',
          trigger: 'blur'
        }
        ]
      },
      setp3Rules: {
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
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/, // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
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
            validator: checkRepeatPwd,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    activeSetp() {
      let setp = 0
      switch (this.currentTab) {
        case 'setp1':
          setp = 0
          break
        case 'setp2':
          setp = 1
          break
        case 'setp3':
          setp = 2
          break
        case 'setp4':
          setp = 3
          break
        default:
          break
      }
      return setp
    }
  },
  watch: {
    customerInfo:
    {
      handler(newVal, val) {
        if (this.$refs['setp1Form']) {
          if (this.currentTab === 'setp1') {
            this.$refs['setp1Form'].validateField(['mobile'], (valid) => {
              this.canSendCaptcha = !valid && this.countDown <= 0
            })

            this.$refs['setp1Form'].validate((valid) => {
              this.canToSetp2 = valid
            })
          }
        }

        if (this.currentTab === 'setp2') {
          if (this.$refs['setp2Form']) {
            this.$refs['setp2Form'].validateField(['idCard'], (valid) => {
              this.canToSetp3 = !valid
            })
          }
        }

        if (this.currentTab === 'setp3') {
          if (this.$refs['setp3Form']) {
            this.$refs['setp3Form'].validate((valid) => {
              this.canToSetp4 = valid
            })
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.addScript('https://ssl.captcha.qq.com/TCaptcha.js')
    },
    verifyCaptcha() {
      this.$refs['setp1Form'].validate((valid) => {
        if (!valid) {
          return
        }

        const uin = this.customerInfo.mobile
        const code = this.customerInfo.captcha
        const type = 2
        VerifyCaptcha(uin, code, type).then(res => {
          if (res.data.item1) {
            this.customerInfo.requestId = res.data.item2
            this.currentTab = 'setp2'

            // /检查是否需要二次验证
            this.checkCustomer()
          } else {
            this.$message({ type: 'error', message: '验证失败' })
          }
        })
      })
    },
    sendCaptcha() {
      if (!this.canSendCaptcha) {
        return
      }
      if (this.countDown > 0) {
        this.canSendCaptcha = false
        return
      }

      // eslint-disable-next-line no-undef
      var captcha = new TencentCaptcha('2085651946', (res) => {
        const randstr = res.randstr
        const ticket = res.ticket
        const ret = res.ret
        if (ret !== 0) {
          return
        }

        const TIME_COUNT = 60
        this.countDown = TIME_COUNT
        this.canSendCaptcha = false
        // 1：注册 //2：找回密码
        const mobile = this.customerInfo.mobile
        FindPwd(mobile, randstr, ticket, ret).then(res => {
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
        // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          this.countDown = 0
          this.canSendCaptcha = true
        })
      })
      captcha.show()
      // })
    },
    checkIdentity() {
      const mobile = this.customerInfo.mobile
      const idcard = this.customerInfo.idCard
      const realname = this.customerInfo.realName

      CheckIdentity(mobile, realname, idcard).then(res => {
        if (res.data) {
          this.currentTab = 'setp3'
        } else {
          this.$message({ type: 'error', message: '验证失败！' })
        }
      })
    },
    checkCustomer() {
      const mobile = this.customerInfo.mobile
      CheckCustomer(mobile).then(res => {
        this.loadIdentify = false
        this.identifyCheckResult = true

        this.needCheck = !res.data
        this.canToSetp3 = !this.needCheck

        this.checkPass()
      }).catch(err => {
        this.$message.closeAll()

        this.identifyCheckInfo = err.message

        this.loadIdentify = false
        this.identifyCheckResult = false
      })
    },
    checkPass() {
      if (!this.needCheck) {
        this.currentTab = 'setp3'
      }
    },
    resetPwd() {
      const mobile = this.customerInfo.mobile
      const pwd = md5(this.customerInfo.pwd)
      const reqId = this.customerInfo.requestId

      ResetPwd(mobile, pwd, reqId).then(res => {
        if (res.data) {
          this.currentTab = 'setp4'
        } else {
          this.$message({ type: 'error', message: '密码重置失败' })
        }
      })
    },
    goBack() {
      this.$router.push({
        path: '/login'
      })
    },
    goSetp1() {
      this.customerInfo.captcha = ''
      this.currentTab = 'setp1'
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
    margin-left: 30%;
    margin-top: 1.875rem;
  }

  .form2 {
    width: 60%;
    margin-left: 20%;
    margin-top: 1.875rem;
  }

  .form3 {
    width: 60%;
    margin-left: 20%;
    margin-top: 1.875rem;
  }

  .goBack {
    margin-top: -20px;
    float: right;
  }
</style>
