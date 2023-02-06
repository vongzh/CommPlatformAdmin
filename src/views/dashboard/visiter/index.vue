<template>
  <div class="dashboard-visiter-container">
    <el-row class="welcome">
      <el-col :span="24"><box-card /></el-col>
    </el-row>
    <div class="perfect_wrap">
      <div class="perfect">
<h2 style="text-align:center">完善信息</h2>
<p>若需要更多权限,需完善信息认证,认证类型有两种,如下</p>
<p>企业:公司账号,支持子账号维护,父账号权限可继承</p>
<p>个人:完善个人信息,拥有独立的权限</p>
    </div>
    </div>
    <div class="userinfo">
      <el-row>
        <el-col :span="2" :offset="4"><el-link class="title">用户名:</el-link></el-col>
        <el-col :span="8">  <el-link class="content">{{ name }}</el-link></el-col>
        <el-col :span="2"><el-link class="title">手机号:</el-link></el-col>
        <el-col :span="8">  <el-link class="content">{{ sysUser.mobile }}</el-link></el-col>
      </el-row>
    </div>
    <div class="usertypes">
      <el-row>
        <el-col :span="3" :offset="7" class="usertype">
          <el-link :underline="false" :disabled="companydisabled" @click="goCompany()">
            <svg-icon :icon-class="companyicon" style="font-size:6rem" />
            <p class="iconcolor" :style="{'color':ComActive==true ? '#bfbfbf':'#006699'}">企业用户</p>
          </el-link>
        </el-col>
        <el-col :span="3" :offset="4" class="usertype">
          <el-link :underline="false" :disabled="persondisabled" @click="goProson()">
            <svg-icon :icon-class="personicon" style="font-size:6rem;color:#006699" />
            <p class="iconcolor" :style="{'color':PerActive==true ? '#bfbfbf':'#006699'}">个人用户</p>
          </el-link>
        </el-col>
      </el-row>
    </div>
    <div />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
// import TodoList from './components/TodoList'
import {
  GetCustomer
} from '@/api/customer/customer'
import BoxCard from './components/BoxCard'
export default {
  name: 'VisiterDashboard',
  components: {
    BoxCard
    // TodoList
  },
  data() {
    return {
      customer: {},
      companydisabled: false,
      persondisabled: false,
      ComActive: false,
      PerActive: false,
      CustomerType: {
        COMPANY: 1,
        PERSON: 2
      },
      companyicon: 'yonghuzu-copy',
      personicon: 'gerenyonghu',
      iconActive: true
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'sysUser'
    ])
  },
  created() {
    this.fetchCustomer()
  },
  methods: {
    goCompany() {
      this.$router.push({
        path: '/companycustomer'
      })
    },
    goProson() {
      this.$router.push({
        path: '/pensonnalcustomer'
      })
    },
    fetchCustomer() {
      GetCustomer().then(res => {
        if (res.data.item1) {
          this.customer = res.data.item2
          if (this.customer.customerType === this.CustomerType.COMPANY) {
            // 禁止选中
            this.persondisabled = true
            // 改变头像颜色
            this.personicon = 'geren'
            //  改变字体颜色
            this.PerActive = true
          } else {
            // 禁止选中
            this.companydisabled = true
            // 改变头像颜色
            this.companyicon = 'qiye'
            // 改变字体颜色
            this.ComActive = true
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-visiter-container {
    margin: 0.3125rem;
    padding: 0.5rem;
  }

  .welcome{
    color: #F0F2F5;
    text-align: center;
  }
  .perfect_wrap{
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }
  .perfect{
    margin: 0 auto;
    width: 23%;
    text-align: left;
  }

.perfectinfo{
  font-size: 16px;
}
  .userinfo{
    margin: 0 auto;
    width: 70%;
    height: 50px;
    background: #EEEEEE;
    border-radius: 12px;
    font-size: 19px;
    padding-top: 0.88rem;;
      box-shadow: 5px 5px 5px #DCE3E8;
      margin-bottom: 2rem;
  }
.usertypes{
    text-align: center;
    color: #006699;
    padding-top: 0.88rem;
    vertical-align: middle;
}
.usertype:hover{
  background: #F5F5F5;
  box-shadow: 10px 10px 5px #D3D3D3;
  border-radius: 10px;
}
// .active{
// background: #eeeeee;
// border-radius: 10px;
// box-shadow: 10px 10px 5px #888888;
// }
.title{
text-decoration:none;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  letter-spacing:8px;
}
.content{
  text-decoration:none;
  text-align: center;
  font-size:large;
  color:#51D9D7;
  font-weight: 700;
}
.iconcolor{
font-size:1.5rem;font-weight:bold
}

</style>
<style scoped>
::v-deep #app .main-container{
      background: #f9f9f9;
}
</style>
