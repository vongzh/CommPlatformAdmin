<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <el-page-header content="账户资料" @back="goBack" />
      </div>
      <div v-if="loading" v-loading="loading" style="height: 28.125rem;" />
      <div v-else>
        <!-- <div v-if="rightCustomer" style="height: 28.125rem;text-align: center;padding-top:7%">
          <el-col :offset="8" :span="8">
            <el-row>
              <i class="el-icon-circle-check" style="color: #13CE66;font-size: 5rem;" />
            </el-row>
            <el-row style="line-height: 3.125rem;">
              <el-link :underline="false" style="font-size: x-large;color: #263445;">资料已提交，请耐心等待审核。</el-link>
            </el-row>
            <el-row>
              <el-link :underline="false" style="font-size: small;color: darkgrey;">提示：提交信息会在一个工作日内审核完成</el-link>
            </el-row>
          </el-col>
        </div> -->
        <div>
          <el-col :span="14">
            <el-form
              ref="personForm"
              :rules="rules"
              :model="customer"
              class="form"
              label-position="right"
              label-width="100px"
              :disabled="userdisable"
            >
              <el-form-item label="用户类别" prop="customerType">
                <!-- <el-select v-model="customer.customerType===CustomerType.PERSON?'个人用户':'企业用户'"> -->
                <el-select v-model="customer.customerType" disabled >
                  <el-option label="个人" :value="2" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="所属行业" prop="industry">
                <el-select v-model="customer.industry">
                  <el-option label="旅行社" :value="1" />
                  <el-option label="休闲及餐饮工商业" :value="2" />
                  <el-option label="其它" :value="10" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="联系人" prop="contactName">
                <el-col :span="14">
                  <el-input v-model="customer.contactName" placeholder="请输入联系人姓名" maxlength="20" />
                </el-col>
              </el-form-item>
              <el-form-item label="手机号" prop="contactPhone">
                <el-col :span="14">
                  <el-input v-model="customer.contactPhone" placeholder="请输入联系手机号" maxlength="11" />
                </el-col>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-col :span="14">
                  <el-input v-model="customer.email" placeholder="请输入电子邮箱" />
                </el-col>
                <el-col :span="8" :offset="2">
                  <el-button :type="canSendCaptcha1?'primary':'info'" size="mini" :disabled="!canSendCaptcha1" @click="sendCaptcha1()">{{ captchaText1 }}</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="邮箱验证码" prop="mailCode">
                <el-col :span="14">
                  <el-input v-model="customer.mailCode" :maxlength="4" clearable placeholder="请输入邮箱验证码" />
                </el-col>
              </el-form-item>
              <el-form-item label="身份证姓名" prop="realName">
                <el-col :span="14">
                  <el-input v-model="customer.realName" placeholder="请输入身份证姓名" maxlength="20" />
                </el-col>
              </el-form-item>
              <el-form-item label="身份证号" prop="idCardNo">
                <el-col :span="14">
                  <el-input v-model="customer.idCardNo" placeholder="请输入身份证号" maxlength="18" />
                </el-col>
                <!-- <el-col :offset="2" :span="11">
                    <el-upload
                      :action="fileApi"
                      list-type="picture"
                      :limit="2"
                      :file-list="idCardImgFiles"
                      :before-upload="initUpload"
                      :headers="requestHeaders"
                      :auto-upload="true"
                      :on-exceed="fileExceed"
                      :on-success="fileUploadSuccess"
                      :on-error="fileUploadError"
                      :on-remove="fileUploadRemove"
                    >
                      <el-button type="primary" size="mini">上传身份证图片</el-button>
                    </el-upload>
                  </el-col> -->
              </el-form-item>
              <!-- <el-form-item label="验证码" prop="smsCode">
                  <el-col :span="11">
                    <el-input v-model="customer.smsCode" placeholder="请输入验证码" />
                  </el-col>
                  <el-col :offset="2" :span="11">
                    <el-button type="info" size="mini" @click="">发送验证信息</el-button>
                  </el-col>
                </el-form-item> -->
              <el-form-item prop="agreeService">
                <el-checkbox v-model="customer.agreeService">我已阅读并同意</el-checkbox>
                <el-link type="primary">《众客分销平台服务隐私协议条款》</el-link>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('personForm')">提交</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" style="line-height: 1.875rem;">
            <el-row>
              <el-link :underline="false" style="font-size: medium;"><i class="el-icon-s-order" />&nbsp;平台规则</el-link>
            </el-row>
            <div style="margin-left: 20%;">
              <el-row>
                <el-link>1.xxxxxxx</el-link>
              </el-row>
              <el-row>
                <el-link>2.xxxxxxx</el-link>
              </el-row>
              <el-row>
                <el-link>3.xxxxxxx</el-link>
              </el-row>
              <el-row>
                <el-link>4.xxxxxxx</el-link>
              </el-row>
              <el-row>
                <el-link>5.xxxxxxx</el-link>
              </el-row>
            </div>
          </el-col>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import auth from '@/control/auth'
import {
  SaveCustomerInfo,
  GetCustomer,
  SendMail,
  CheckIdCardNoIsExist,
  CheckLicenseNoIsExist
} from '@/api/customer/customer'
export default {
  name: 'AccountProfile',
  data() {
    var checkIdCardNoIsExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'))
        return
      }
      CheckIdCardNoIsExist(value).then(res => {
        if (!res.data) {
          callback()
        } else {
          callback(new Error('身份证号已被使用'))
        }
      })
    }

    var checkLicenseNoIsExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入营业执照编号'))
        return
      }
      CheckLicenseNoIsExist(value).then(res => {
        if (!res.data) {
          callback()
        } else {
          callback(new Error('营业执照编号已被使用'))
        }
      })
    }

    return {
      fileApi: process.env.VUE_APP_BASE_API + '/File/Upload?type=customer',
      rightCustomer: false,
      registerType: 'company',
      userdisable: false,
      customer: {
        customerType: 2,
        businessLicenseImgs: [],
        idCardImgs: [],
        authorizationImgs: []
      },
      businessLicenseImgFiles: [],
      idCardImgFiles: [],
      authorizationImgFiles: [],
      requestHeaders: {},
      rules: {
        companyName: [{
          required: true,
          message: '请输入公司名称',
          trigger: 'blur'
        },
        {
          pattern: /[\u4e00-\u9fa5]$/,
          message: '公司名称请输入中文',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 50,
          message: '公司名称长度应输入3-50个字符中文',
          trigger: 'blur'
        }
        ],
        isLegalPerson: [
          {
            required: true,
            message: '请选择是否是法人',
            trigger: 'blur'
          }
        ],
        industry: [{
          required: true,
          message: '请选择行业',
          trigger: 'blur'
        }],
        contactName: [{
          required: true,
          message: '请输入联系人',
          trigger: 'blur'
        },
        {
          pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
          message: '联系人只能包含中文和点（·），需要以中文开头',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '联系人长度应为2-20个字符',
          trigger: 'blur'
        }
        ],
        contactPhone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
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
        }
        ],
        businessLicenseNo: [{
          required: true,
          message: '请输入营业执照编号',
          trigger: 'blur'
        },
        {
          min: 18,
          max: 18,
          message: '请输入18位的营业执照编号',
          trigger: 'blur'
        },
        {
          pattern: /^(?![a-zA-Z]+$)[A-Za-z0-9]{18,18}$/,
          message: '营业执照编号应为18位的字母以及数字组合',
          trigger: 'blur'
        },
        {
          validator: checkLicenseNoIsExist,
          trigger: 'blur'
        }
        ],
        email: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },
        {
          pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }
        ],
        mailCode: [
          {
            required: true,
            message: '请输入邮箱验证码',
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
        realName: [{
          required: true,
          message: '请输入身份证姓名',
          trigger: 'blur'
        },
        {
          pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
          message: '身份证姓名只能包含中文和点（·），需要以中文开头',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '身份证姓名长度应为2-20个字符',
          trigger: 'blur'
        }
        ],
        idCardNo: [{
          required: true,
          message: '请输入身份证号码',
          trigger: 'blur'
        },
        {
          min: 18,
          max: 18,
          message: '身份证号长度应为18个字符',
          trigger: 'blur'
        },
        {
          pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
          message: '身份证号应为18位只能包含数字以及X',
          trigger: 'blur'
        },
        {
          validator: checkIdCardNoIsExist,
          trigger: 'blur'
        }
        ],
        certigier: [
          {
            required: true,
            message: '请输入授权人姓名',
            trigger: 'blur'
          },
          {
            pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
            message: '授权人姓名只能包含中文和点（·），需要以中文开头',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '授权人姓名长度应为2-20个字符',
            trigger: 'blur'
          }
        ]
      },
      CustomerAuditStatus: {
        REJECT: -5,
        WAITAUDIT: 0,
        PASS: 10
      },
      CustomerType: {
        COMPANY: 1,
        PERSON: 2,
        PASS: 10
      },
      Customerindustry: {

      },
      YN: {
        Y: 1,
        N: 0
      },
      companyTabDisabled: false,
      personageTabDisabled: false,
      loading: true,
      countDown: 0,
      timer: null,
      canSendCaptcha: true,
      captchaText: '发送验证码',
      countDown1: 0,
      timer1: null,
      canSendCaptcha1: true,
      captchaText1: '发送验证码'
    }
  },
  computed: {
    // requestHeaders() {
    //   const token = auth.GetClientAuth()
    //   const customerAuth = auth.GetCustomerAuth()
    //   const clientToken = auth.GenerateRequestToken()

    //   return {
    //     Authorization: token.token_type + ' ' + token.access_token,
    //     ck: clientToken,
    //     sid: customerAuth.sessionId
    //   }
    // }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.addScript('https://ssl.captcha.qq.com/TCaptcha.js')
      this.fetchCustomer()
    },

    fetchCustomer() {
      const that = this
      GetCustomer().then(res => {
        this.loading = false

        this.rightCustomer = res.data.item1

        if (this.rightCustomer) {
          const customer = res.data.item2
          this.customer = res.data.item2
          this.customer.agreeService = true
          this.userdisable = true
          this.customer.agreeService = true
          if (this.customer.customerType == this.CustomerType.COMPANY) {
            this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
            this.$router.go(-1)
          }
          if (this.customer.customerType == this.CustomerType.PASS) {
            this.$router.push({
              path: `/dashboard/`
            })
          }
          if (customer.auditStatus === this.CustomerAuditStatus.REJECT) {
            const confirmText = ['原因：' + res.data.item2.auditDesc, '请重新填写后提交']
            const newDatas = []
            const h = this.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            this.$confirm('资料审核未通过', {
              title: '资料审核未通过',
              message: h('div', null, newDatas),
              confirmButtonText: '重新填写',
              cancelButtonText: '取消',
              type: 'warning'

            }).then(() => {
              this.rightCustomer = false
              this.customer = customer
              this.userdisable = false
              this.$nextTick(() => {
                switch (customer.customerType) {
                  case that.CustomerType.COMPANY:
                    that.personageTabDisabled = true
                    that.registerType = 'company'
                    break
                  case that.CustomerType.PERSON:
                    that.companyTabDisabled = true
                    that.registerType = 'personage'
                    break
                }
              })
            }).catch(() => {
              this.$router.go(-1)
            })
            return
          }
        }
      })
    },
    sendCaptcha() {
      this.$refs['companyForm'].validateField('email', (res) => {
        if (res) {
          return
        }

        // var captcha = new TencentCaptcha('2085651946', res => {
        // const randstr = res.randstr
        // const ticket = res.ticket
        // const ret = res.ret
        // if (ret !== 0) {
        //   return
        // }

        const email = this.customer.email
        const TIME_COUNT = 60
        this.countDown = TIME_COUNT
        this.canSendCaptcha = false
        // 1：注册 //2：找回密码 //3:完善信息
        const type = 3
        SendMail(email, type)
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
        //     .catch(err => {
        //       this.countDown = 0
        //       this.canSendCaptcha = true
        //     })
        // })
        // captcha.show()
      })
    },
    sendCaptcha1() {
      this.$refs['personForm'].validateField('email', (res) => {
        if (res) {
          return
        }

        // var captcha = new TencentCaptcha('2085651946', res => {
        // const randstr = res.randstr
        // const ticket = res.ticket
        // const ret = res.ret
        // if (ret !== 0) {
        //   return
        // }

        const email = this.customer.email
        const TIME_COUNT = 60
        this.countDown1 = TIME_COUNT
        this.canSendCaptcha1 = false
        // 1：注册 //2：找回密码 //3:完善信息
        const type = 3
        SendMail(email, type)
          .then(res => {
            if (res.data) {
              this.timer1 = setInterval(() => {
                if (this.countDown1 > 0 && this.countDown1 <= TIME_COUNT) {
                  this.countDown1--
                  this.captchaText1 = this.countDown1 + '秒后重发'
                } else {
                  this.canSendCaptcha1 = true
                  this.captchaText1 = '发送验证码'
                  clearInterval(this.timer1)
                }
              }, 1000)
              this.$message({
                type: 'success',
                message: '验证码发送成功'
              })
            } else {
              this.countDown1 = 0
              this.canSendCaptcha1 = true
              this.$message({
                type: 'info',
                message: '验证码发送失败，请稍后再试'
              })
            }
          })
          // eslint-disable-next-line handle-callback-err
        //     .catch(err => {
        //       this.countDown = 0
        //       this.canSendCaptcha = true
        //     })
        // })
        // captcha.show()
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.customer.agreeService) {
            this.$message({
              type: 'info',
              message: '请先阅读并同意协议'
            })
            return
          }

          // if (this.registerType === 'company') {
          //   if (!this.customer.businessLicenseImgs || this.customer.businessLicenseImgs.length < 1) {
          //     this.$message({
          //       type: 'info',
          //       message: '请先上传营业执照副本'
          //     })
          //     return
          //   }
          // }
          // if (this.registerType === 'personage') {
          //   if (!this.customer.idCardImgs || this.customer.idCardImgs.length < 2) {
          //     this.$message({
          //       type: 'info',
          //       message: '请先上传身份证正反面副本'
          //     })
          //     return
          //   }
          // }

          SaveCustomerInfo(this.customer).then(res => {
            if (res.data) {
              this.$alert('提交成功，请耐心等待平台审核', '提示', {
                type: 'success',
                confirmButtonText: '确定',
                callback: () => {
                  this.$router.go(0)
                }
              })
            } else {
              this.$error('提交失败，请稍后再试')
            }
          })
        }
      })
    },
    tabsClick(selected) {
      const tab = selected.name
      switch (tab) {
        case 'company':
          this.customer.customerType = this.CustomerType.COMPANY
          break
        case 'personage':
          this.customer.customerType = this.CustomerType.PERSON
          break
      }
    },
    addScript(url) {
      const script = document.createElement('script')
      script.type = 'application/javascript'
      script.src = url
      document.head.appendChild(script)
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .content {
    width: 100%;
  }

  .form {
    width: 400px;
		margin: 0 auto;
  }
	
	.form>>>.el-form-item__content{
		margin-bottom: 15px;
	}
	
	.form>>>.el-input__inner{
		width: 175px;
	}
</style>
