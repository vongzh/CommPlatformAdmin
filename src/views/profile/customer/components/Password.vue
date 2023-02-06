<template>
  <div>
    <el-page-header v-if="sysUser.userType===userTypeEnum.USER" content="修改密码" @back="goBack" />
    <el-form ref="pwdForm" :rules="passwordRules" :model="pwdForm" style="width:30%;margin-left:5%;margin-top:30px;">
      <!-- style="color:{{selected ? '#C7C7C7' : '#D40C69'}}" -->
      <el-form-item label="原密码" prop="oriPassword">
        <el-input v-model.trim="pwdForm.oriPassword" show-password />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="pwdForm.password" show-password :maxlength="20" />
      </el-form-item>
      <el-form-item label="确认密码" prop="repeatPassword">
        <el-input v-model.trim="pwdForm.repeatPassword" show-password :maxlength="20" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" style="margin-bottom:22px" @click="submit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { ChangePwd } from '@/api/sys/user'
import { mapGetters } from 'vuex'
export default {
  data() {
    var checkRepeqtPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      pwdForm: {
        oriPassword: '',
        password: '',
        repeatPassword: ''
      },
      userTypeEnum: {
        API: 200,
        // 后台
        BACKSTAGE: 100,
        // 企业
        CUSTOMER: 50,
        // 用户
        USER: 10
      },
      passwordRules: {
        oriPassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          },
          {
            min: 8,
            max: 20,
            message: '密码长度在 8 到 20 个字符',
            trigger: 'change'
          },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/, // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
            message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
            trigger: 'change'
          }
        ],
        repeatPassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'change'
          },
          {
            min: 8,
            max: 20,
            message: '密码长度在 8 到 20 个字符',
            trigger: 'change'
          },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/, // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
            message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
            trigger: 'change'
          },
          {
            validator: checkRepeqtPwd,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sysUser'
    ])
  },
  methods: {
    goBack() {
      this.$router.go(-1)// 返回上一层
    },

    submit() {
      // if (!this.oriPassword || !this.password || !this.repeatPassword) {
      //   this.$message({
      //     message: '请输入密码',
      //     type: 'info',
      //     duration: 5 * 1000
      //   })
      //   return
      // }
      // if (this.password !== this.repeatPassword) {
      //   this.$message({
      //     message: '两次输入密码不一致',
      //     type: 'info',
      //     duration: 5 * 1000
      //   })
      //   return
      // }
      // const pattern = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/
      // if (!pattern.test(this.password)) {
      //   this.$message({
      //     message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
      //     type: 'info',
      //     duration: 5 * 1000
      //   })
      //   return
      // }
      this.$refs.pwdForm.validate(valid => {
        if (!valid) {
          return
        }

        const pwd = md5(this.pwdForm.password)
        const oldPwd = md5(this.pwdForm.oriPassword)
        ChangePwd(pwd, oldPwd).then(res => {
          if (res.data) {
            this.$message({
              message: '密码修改成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$refs.pwdForm.resetFields()
          } else {
            this.$message({
              message: '密码修改失败',
              type: 'info',
              duration: 5 * 1000
            })
          }
        })
      })
    }
  }
}
</script>