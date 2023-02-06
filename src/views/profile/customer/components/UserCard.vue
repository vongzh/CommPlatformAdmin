<template>
  <el-card style="margin-bottom:20px;height:481px">
    <!-- <div slot="header" class="clearfix">
      <span>账号信息</span>
    </div> -->
    <div class="user-profile">
      <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2220225449,2548630662&fm=26&gp=0.jpg" alt="" style="height:100%;width:100%">
      <!-- <div class="box-center">
        <pan-thumb :image="avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <strong>❤️</strong>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ customer.companyName }}</div>
        <div class="user-role text-center text-muted">{{ name }}</div>
      </div> -->
      <span class="userinfo">{{ sysUser.lastLoginTime }}</span>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <!-- <svg-icon icon-class="education" /><span>个人信息</span></div> -->
          <el-col>
            <pan-thumb :image="avatar" :height="'80px'" :width="'80px'" :hoverable="false" class="www">
              <strong>❤️</strong>
            </pan-thumb>
          </el-col>

          <!-- <el-row>
          <el-col :span="2" :offset="2">
            <el-link :underline="false" class="titlestyle">客户类型：</el-link>
          </el-col>
          <el-col :span="6" :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.customerType===CustomerTypeEnum.COMPANY?'企业用户':'个人用户' }}</el-link>
          </el-col>
        </el-row> -->

          <div>
            <div class="text-muted">
              <el-col :span="20" class="info-top">
                <el-col :span="8">
                  <span style="float:right;font-size:13px">用户名</span>
                </el-col>
                <el-col :span="12">
                  <span style="font-size:13px">{{ name }}</span>
                </el-col>
              </el-col>
            </div>
            <div class="text-muted">
              <el-col :span="20" class="info">
                <el-col :span="8">
                  <span style="float:right;font-size:13px">注册手机号</span>
                </el-col>
                <el-col :span="12">
                  <span style="float:left;font-size:13px">{{ sysUser.mobile }}</span></el-col>
              </el-col>
            </div>
            <!-- <div class="text-muted">
              <el-col :span="24" class="info">
                <el-col :span="8">
                  邮箱
                </el-col>
                <el-col :span="16">
                  <el-link>{{ customer.email }}</el-link>
                </el-col>
              </el-col>
            </div> -->
            <div class="text-muted">
              <!-- <el-col :span="24" class="info">
                <el-col :span="8">
                  最后登录时间:
                </el-col>
                <el-col :span="16">
                  <el-link>{{ sysUser.lastLoginTime }}</el-link>
                </el-col>
              </el-col> -->
            </div>
          </div>
        </div>
      </div>
    </div></el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import {
  mapGetters
} from 'vuex'
import {
  GetCustomer
} from '@/api/customer/customer'

export default {
  components: {
    PanThumb
  },
  data() {
    return {
      userType: '',
      userTypeEnum: {
        API: 200,
        BACKSTAGE: 100,
        CUSTOMER: 50,
        USER: 10
      },
      customer: {}
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'sysUser'
    ])
  },
  created() {
    this.getCustomer()
  },
  methods: {
    getCustomer() {
      GetCustomer().then(res => {
        if (res.data.item1) {
          this.customer = res.data.item2
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #333333;

    .info {
      line-height: 2.5rem;
    }
  }
.info-top{
  padding-top: 2rem;
  line-height: 1.375rem;
}
  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #333333;

    span {
      padding-left: 4px;
    }

    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;
      margin-bottom: 4.375rem;

      .user-bio-section-header {
        // border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        position: relative;
          color:#333333;
        font-family:"微软雅黑";
      font-style: normal;
      font-weight: 400;
      }
    }
  }
.www{
  position: absolute;
  bottom: 0.1rem;
  margin-left: 1rem;
  border:5px solid #ffffff;
  // box-sizing:border-box;
  background-color: #ffffff;
}

.userinfo{
float: right;
font-size: 13px;
height: 2.5rem;
line-height: 2.5rem;
font-family:"微软雅黑";
font-style: normal;
font-weight: 400;
}
.header{
  height: 100%;
  background-color: red;
}

</style>
