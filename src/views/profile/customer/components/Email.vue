<template>
  <el-form ref="emailForm" style="width:60%;margin-left:5%;margin-top:30px;">
    <el-form-item prop="email" label="新邮箱">
      <el-col :span="12">
        <el-input v-model.trim="email" placeholder="请输入电子邮箱" />
      </el-col>
    </el-form-item>
    <el-form-item prop="mailCode" label="验证码">
      <el-col :span="6">
        <el-input v-model.trim="mailCode" :maxlength="4" clearable placeholder="请输入邮箱验证码" />
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button
          :type="canSendCaptcha1?'primary':'info'"
          size="mini"
          :disabled="!canSendCaptcha1"
          @click="sendCaptcha1()"
        >{{ captchaText1 }}</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="12" :offset="2">
        <el-button type="primary" size="mini" @click="changeEmail">修改</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>
<script>
import { SendMail, ChangeEmail } from '@/api/customer/customer'
export default {
  data() {
    return {
      email: '',
      mailCode: '',
      loading: true,
      countDown1: 0,
      timer1: null,
      canSendCaptcha1: true,
      captchaText1: '发送验证码'
    }
  },
  methods: {
    changeEmail() {
      ChangeEmail(this.email, this.mailCode).then(res => {
        if (res.data) {
          this.email = ''
          this.mailCode = ''
          this.$message.warning('修改成功')
        } else {
          this.$message.warning('修改失败')
        }
      })
    },
    sendCaptcha1() {
      const email = this.email
      const TIME_COUNT = 60
      this.countDown1 = TIME_COUNT
      this.canSendCaptcha1 = false
      // 1：注册 //2：找回密码 //3:完善信息 //4.修改邮箱
      const type = 4
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
    }
  }
}
</script>
