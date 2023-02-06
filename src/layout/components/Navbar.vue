<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item hover-effect" />

        <search v-if="false" id="header-search" class="right-menu-item hover-effect" />

        <screenfull v-if="false" id="screenfull" class="right-menu-item hover-effect" />

        <notice-panel v-if="false" class="right-menu-item hover-effect" />

      </template>
      <el-link style="padding-bottom:2rem;margin-right:1.5rem;font-size:12px" @click="more()">更多>></el-link>
      <el-avatar size="small" shape="square" :src="avatar" style="border-radius: 0.5rem;position: relative;top: -0.5rem;margin-left: 0.3125rem;" />
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="top">
          <span class="avatar-name" style="margin-top: -1.875rem;margin-left: 0.3125rem;font-size: 14px;">{{ sysUser.nickName }}</span>
          <i class="el-icon-arrow-down el-icon--right" style="font-size: 14px;" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>账号信息</el-dropdown-item>
          </router-link>
          <!-- <router-link to="/subaccount/list">
            <el-dropdown-item v-if="customer.customerType===CustomerType.COMPANY&&customer.auditStatus===CustomerAuditStatus.PASS" divided>子账号信息</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div />
    <div>

      <div class="textBox">
        <transition name="slide" mode="out-in">
          <span :key="text.id" class="text" @mouseenter="Stop()" @mouseleave="Up()">{{ text.val|ellipsis }}</span>
        </transition>
      </div>
      <svg-icon class="iconstyle" icon-class="gonggao" />
    </div>
  </div>
</template>

<script>
import { GetNotices } from '@/api/message/message'

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import NoticePanel from './NoticePanel'
import {
  GetCustomer
} from '@/api/customer/customer'

export default {
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 15) {
        return value.slice(0,15) + '...'
      }
      return value
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Search,
    NoticePanel
  },
  data() {
    return {
      SysUserType: {
        BACKSTAGE: 100,
        CUSTOMER: 1,
        //注册但未完善信息的用户
        Description:24
      },
      timer: null,
      number: 0,
      noticeList: [],
      customer: {},
      CustomerType: {
        COMPANY: 1,
        PERSON: 2
      },
      CustomerAuditStatus: {
        REJECT: -5,
        WAITAUDIT: 0,
        PASS: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'sysUser'
    ]),
    text() { 
      return {
        id: this.number,
        val: this.noticeList[this.number]
      }
    }
  },
  created() {
    this.fetchCustomer()
    this.fetchNotices()
    this.startMove()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      try {
        const ret = await this.$store.dispatch('user/logout')
        if (ret) {
          // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          this.$router.push(`/login`)
        }
      } catch (error) {
        console.log('账号已经退出或在其它地方登录')
      }
    },
    more() {
      if(this.sysUser.userRoles[0].id===this.SysUserType.Description){
        this.$alert('您没有权限进行操作','请完善信息',{
          confirmButtonText:'确定'
        })
        return
      }else{
    this.$router.push({
        path: '/general/notice'
      })
      }

    },
    fetchCustomer() {
      GetCustomer().then(res => {
        if (res.data.item1) {
          this.customer = res.data.item2
        }
      })
    },
    fetchNotices() {
      const param = {
        PageSize: 5
      }
      GetNotices(param).then(res => {
        this.noticeList = res.data.rows.map((val) => {
          return val.title
        })
      })
    },
    Stop() {
      clearInterval(this.timer)
    },
    Up() {
      this.startMove()
    },
    startMove() {
      this.timer = setInterval(() => {
        if (this.number === 4) {
          this.number = 0
        } else {
          this.number += 1
        }
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;

  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 1.875rem;

      .avatar-wrapper {
        padding-top: 0.3125rem;
        height: 3.125rem;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          margin-top: 0.3125rem;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style scoped>
.iconstyle{
float: right;
margin-top: 18px;
margin-right: 7px;
color: red;
}
  .textBox {
    /* width: 100%;
    height: 40px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    text-align: center; */
    float:right;
width:300px;height:30px;position: relative;top: 0.5rem;float:right;   border-radius: 4px;           overflow: hidden;
  }
  .text {
    display: inline-block;
    width: 100%;
    height: 30px;
    cursor: pointer;
    font-size: 14px;
    color:black;
    padding-top: 10px;
  }
   .slide-enter-active, .slide-leave-active {
    transition: all 1s linear;
  }
  .slide-enter{
    transform: translateY(20px);
     }
  .slide-leave-to {
    transform: translateY(-20px);
  }

</style>
