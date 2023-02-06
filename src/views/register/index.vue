<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <el-page-header content="用户注册" @back="goBack" />
        <span class="goBack">
          <el-link type="primary" @click="goBack">已有账号，去登陆</el-link>
        </span>
      </div>
      <el-tabs v-model="registerType" tab-position="left">
        <el-tab-pane label="公司用户" name="company">
          <el-form ref="registerForm" :model="customer" :rules="rules" class="form" label-position="right" label-width="80px">
            <el-form-item label="用户类别">
              <el-input placeholder="公司用户" disabled />
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="customer.userName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="设置密码" prop="userPwd">
              <el-input v-model="customer.userPwd" type="password" :show-password="true" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="userPwdRepeat">
              <el-input v-model="customer.userPwdRepeat" type="password" :show-password="true" placeholder="请确认密码" />
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="customer.companyName" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="customer.industry">
                <el-option label="旅行社" value="1" />
                <el-option label="休闲及餐饮工商业" value="2" />
                <el-option label="其它" value="10" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="customer.contactName" placeholder="请输入联系人姓名" />
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="customer.email" placeholder="请输入电子邮箱" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseNo">
              <!-- <el-col :span="11">
                <el-input v-model="customer.businessLicenseNo" placeholder="请输入营业执照编号" />
              </el-col>
              <el-col :offset="2" :span="11"> -->
              <el-col>
                <el-upload action="#" list-type="picture" :limit="1" :auto-upload="false">
                  <el-button type="primary" size="mini">上传营业执照</el-button>
                </el-upload>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号" prop="contactPhone">
              <el-input v-model="customer.contactPhone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="验证码" prop="smsCode">
              <el-col :span="11">
                <el-input v-model="customer.smsCode" placeholder="请输入验证码" />
              </el-col>
              <el-col :offset="2" :span="11">
                <el-button type="info" size="mini">发送验证信息</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="customer.agreeService">我已阅读并同意</el-checkbox>
              <el-link type="primary">《众客分销平台服务隐私协议条款》</el-link>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="open">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人用户" name="personnal">
          <el-form class="form" label-position="right" label-width="80px">
            <el-form-item label="用户类别">
              <el-input placeholder="个人用户" disabled />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="设置密码">
              <el-input placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input placeholder="请确认密码" />
            </el-form-item>
            <el-form-item label="所属行业">
              <el-select v-model="customer.industry">
                <el-option label="旅行社" value="1" />
                <el-option label="休闲及餐饮工商业" value="2" />
                <el-option label="其它" value="10" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input placeholder="请输入联系人姓名" />
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input placeholder="请输入电子邮箱" />
            </el-form-item>
            <el-form-item label="身份证">
              <el-col :span="11">
                <el-input placeholder="请输入身份证号" />
              </el-col>
              <el-col :offset="2" :span="11">
                <el-upload action="#" list-type="picture" :limit="1" :auto-upload="false">
                  <el-button type="primary" size="mini">上传身份证</el-button>
                </el-upload>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="验证码">
              <el-col :span="11">
                <el-input placeholder="请输入验证码" />
              </el-col>
              <el-col :offset="2" :span="11">
                <el-button type="info" size="mini">发送验证信息</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-checkbox>我已阅读并同意</el-checkbox>
              <el-link type="primary">《众客分销平台服务隐私协议条款》</el-link>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="open">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerType: 'company',
      customer: {
        userName: '',
        email: ''
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        userPwd: [
          {
            required: true,
            message: '请输密码',
            trigger: 'blur'
          }
        ],
        userPwdRepeat: [
          {
            required: true,
            message: '请再次输密码',
            trigger: 'blur'
          }
        ],
        companyName: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: 'blur'
          }
        ],
        industry: [
          {
            required: true,
            message: '请选择行业',
            trigger: 'blur'
          }
        ],
        contactName: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }
        ],
        contactPhone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        businessLicenseNo: [
          {
            required: true,
            message: '请输入营业执照编号',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    open() {
      this.$message('您的注册信息已经提交成功，请耐心等待平台审核')
    },
    goBack() {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style scoped>
  .content {
    margin-left: 10%;
    width: 80%;
  }

  .form {
    width: 60%;
    margin-left: 15%;
    margin-top: 15px;
  }

  .goBack {
    margin-top: -20px;
    float: right;
  }
</style>
