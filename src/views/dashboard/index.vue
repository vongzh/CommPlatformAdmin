<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import visiterDashboard from './visiter'

export default {
  name: 'Dashboard',
  components: { adminDashboard, visiterDashboard },
  data() {
    return {
      currentRole: adminDashboard,
      userTypeEnum: {
        USER: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'sysUser'
    ])
  },
  created() {
    if (this.sysUser.userType === this.userTypeEnum.USER) {
      this.currentRole = visiterDashboard
    } else {
      const visiterRoleIndex = this.roles.findIndex((x) => { return x === 'RegisterUser' })
      if (visiterRoleIndex > -1) {
        this.currentRole = visiterDashboard
      } else {
        this.currentRole = adminDashboard
      }
    }
  }
}
</script>
