<template>
  <el-dialog :visible="visible" center :title="title" @close="close" width="600px">
    <el-form label-width="100px" :model="form" autocomplete="off" style="padding:0 100px" :rules="rules" ref="form">
      <div v-if="type == 'info'">
        <el-form-item prop="nickName" label="姓名">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </div>
      <div v-if="type == 'password'">
        <el-form-item prop="oriPassword" label="原密码">
          <el-input v-model="form.oriPassword" :type="showOldPwd ? 'text' : 'password'">
            <svg-icon class="icon" icon-class="Invisible" slot="suffix" v-show="showOldPwd"
              @click="showOldPwd = false" />
            <svg-icon class="icon" icon-class="Visible" slot="suffix" v-show="!showOldPwd" @click="showOldPwd = true" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input v-model="form.password" :type="showPwd ? 'text' : 'password'">
            <svg-icon class="icon" icon-class="Invisible" slot="suffix" v-show="showPwd" @click="showPwd = false" />
            <svg-icon class="icon" icon-class="Visible" slot="suffix" v-show="!showPwd" @click="showPwd = true" />
          </el-input>
        </el-form-item>
        <el-form-item prop="repeatPassword" label="确认密码">
          <el-input v-model="form.repeatPassword" :type="showPwds ? 'text' : 'password'">
            <svg-icon class="icon" icon-class="Invisible" slot="suffix" v-show="showPwds" @click="showPwds = false" />
            <svg-icon class="icon" icon-class="Visible" slot="suffix" v-show="!showPwds" @click="showPwds = true" />
          </el-input>
        </el-form-item>
      </div>
      <div v-if="type == 'email' || type == 'info'">
        <el-form-item prop="email" label="新邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="邮箱验证码">
          <el-input v-model="form.code" style="width:130px"></el-input>
          <el-button type="primary" @click="sendCaptcha1" :disabled="form.email == sysUser.mail">发送验证码</el-button>
        </el-form-item>
      </div>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    SendMail,
    ChangeEmail
  } from '@/api/customer/customer'
  import {
    mapGetters
  } from 'vuex'
  import {
    GetCustomer,
    ChangeContactInfo
  } from '@/api/customer/customer'
  import md5 from 'js-md5'
  import {
    ChangePwd
  } from '@/api/sys/user'
  import {
    saveUser,
    CheckSysUserMobileIsExist,
  } from '@/api/sys/user'
  import {
    CheckUserNameIsExist,
  } from '@/api/customer/customer'
  export default {
    name: 'Dialog',
    props: {
      type: {
        default: '',
        type: String
      },
      title: {
        default: '',
        type: String
      },
      visible: {
        default: true,
        type: Boolean
      },
    },
    computed: {
      ...mapGetters([
        'sysUser'
      ])
    },
    data() {

      var checkCode = (rule, value, callback) => {
        if (!(this.form.email == this.sysUser.mail)) {
          if (!value) {
            callback(new Error('请输入验证码'))
            return
          } else callback()
        } else callback()
      }
      var checkUserNameIsExist = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'))
          return
        }
        if (value != this.userName) {
          CheckUserNameIsExist(value).then(res => {
            if (!res.data) {
              callback()
            } else {
              callback(new Error('该用户名已被注册'))
            }
          })
        } else callback()
      }
      var checkMobileIsExist = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
          return
        }
        if (value != this.sysUser.mobile) {
          CheckSysUserMobileIsExist(this.sysUser.userId, '' + value).then(res => {
            if (!res.data) {
              callback()
            } else {
              callback(new Error('该手机号码已被注册'))
            }
          }).catch(err => {})
        } else callback()
      }
      return {
        form: {
          oriPassword: '',
          password: '',
          repeatPassword: '',
          email: '',
          code: '',
          nickName: '',
          mobile: '',
          captchaType: 5,
          userName: ''
        },
        mobile: null,
        showOldPwd: false,
        showPwd: false,
        showPwds: false,
        changeeamil: false,
        changepwd: false,
        changeuser: false,
        loading: true,
        countDown1: 0,
        timer1: null,
        canSendCaptcha1: true,
        captchaText1: '发送验证码',
        rules: {
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
          nickName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          mobile: [{
              required: true,
              message: '请输入',
              trigger: 'blur',
            },
            {
              pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
              message: '请输入正确的手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobileIsExist,
              trigger: 'blur'
            }
          ],
          code: [{
            validator: checkCode,
            trigger: 'blur'
          }],
          oriPassword: [{
            required: true,
            message: '请输入原密码',
            trigger: 'change'
          }],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              min: 6,
              max: 20,
              message: '密码长度在 6 到 20 个字符',
              trigger: 'change'
            },
            {
              pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/, // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
              message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
              trigger: 'change'
            }
          ],
          repeatPassword: [{
              required: true,
              message: '请再次输入密码',
              trigger: 'change'
            },
            {
              min: 6,
              max: 20,
              message: '密码长度在 6 到 20 个字符',
              trigger: 'change'
            },
            {
              pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/, // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
              message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
              trigger: 'change'
            }
          ]
        },
        userTypeEnum: {
          API: 200,
          // 后台
          BACKSTAGE: 100,
          // 企业
          CUSTOMER: 50,
          // 用户
          USER: 10
        }
      }
    },
    created() {
      this.form.email = this.sysUser.mail
      this.form.mobile = this.sysUser.mobile
      this.form.nickName = this.sysUser.nickName
      this.form.userName = this.sysUser.userName
    },
    methods: {
      close() {
        this.$refs.form.resetFields()
        this.showOldPwd = false
        this.showPwd = false
        this.showPwds = false
        this.$emit('close', false)
      },
      changeEmail() {
        this.$refs.emailForm.validate(valid => {
          if (!valid) {
            return
          }
          ChangeEmail(this.Email.email, this.Email.code).then(res => {
            if (res.data) {
              this.$message.warning('修改成功')
              this.changeeamil = false
              this.close()
            } else {
              this.$message.warning('修改失败')
            }
          })
        })
      },
      sendCaptcha1() {
        const email = this.form.email
        const TIME_COUNT = 60
        this.countDown1 = TIME_COUNT
        this.canSendCaptcha1 = false
        // 1：注册 //2：找回密码 //3:完善信息 //4.修改邮箱
        const type = type == 'email' ? 4 : 5
        SendMail(email, type).then(res => {
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
        }).catch(err => {
          this.countDown1 = 0
          this.canSendCaptcha1 = true
        })
      },
      getCustomer() {
        GetCustomer().then(res => {
          if (res.data.item1) {
            this.customer = res.data.item2
          }
        })
      },
      changeuserinfo() {
        this.changeuser = true
      },
      Canceluserinfo() {
        this.changeuser = false
      },
      changepassword() {
        this.changepwd = true
      },
      Cancelpassword() {
        this.$refs.form.resetFields()
        this.changepwd = false
      },
      changeemails() {
        this.changeeamil = true
      },
      Cancelemail() {
        this.$refs.form.resetFields()
        this.changeeamil = false
      },
      changeInfo() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          let obj = {
            userName: this.form.userName,
            nickName: this.form.nickName,
            mobile: this.form.mobile,
            mail: this.form.email,
            id: this.sysUser.id
          }
          if (!(this.form.email == this.sysUser.mail)) {
            obj.code = this.form.code
            obj.captchaType = 5
          }
          saveUser(obj).then(res => {
            if (res.data) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getCustomer()
              this.close()
              location.reload()
            } else {

              this.$message(res.message || '请求失败')
            }
          })
          // ChangeContactInfo(this.customer.contactName, this.customer.contactPhone).then(res => {
          // 	if (res.data) {
          // 		this.$message.warning('保存成功')
          // 		this.close()
          // 	} else {
          // 		this.$message.warning('保存失败')
          // 	}
          // })
        })
      },
      save() {
        if (this.type == 'email') this.changeEmail()
        else if (this.type == 'password') this.changePassword()
        else if (this.type == 'info') this.changeInfo()
      },
      changePassword() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          if (this.form.repeatPassword != this.form.password) {

            this.$message({
              message: '两次密码输入不一致，请重新输入！',
              type: 'error',
              duration: 5 * 1000
            })
          } else {

            const pwd = md5(this.form.password)
            const oldPwd = md5(this.form.oriPassword)
            ChangePwd(pwd, oldPwd).then(res => {
              if (res.data) {
                this.$message({
                  message: '密码修改成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.close()
              } else {
                this.$message({
                  message: '密码修改失败',
                  type: 'info',
                  duration: 5 * 1000
                })
              }
            })
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'sysUser'
      ])
    }
  }
</script>

<style>
  .icon {
    cursor: pointer;
    font-size: 20px;
    margin-right: 5px;
    margin-top: 8px;
  }
</style>
