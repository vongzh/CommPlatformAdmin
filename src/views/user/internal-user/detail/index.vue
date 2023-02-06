<template>
  <div class="content">
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>账号信息</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">用户编号：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.userId }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">用户类型：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.userTypeDesc }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">状态：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.statusDesc }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">用户名：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.userName }}</el-link>
          </el-col>
          <el-col :span="2" v-if="sysUser.mobile">
            <el-link :underline="false" class="titlestyle">注册手机号：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.mobile }}</el-link>
          </el-col>
          <el-col :span="2" v-if="sysUser.mail">
            <el-link :underline="false" class="titlestyle">邮箱：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.mail }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">姓名：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.nickName }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">注册时间：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.registerTime }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">最后登录：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float:left">{{ sysUser.lastLoginTime }}</el-link>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>权限设置</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">状态：</el-link>
          </el-col>
          <el-col :span="3">
            <el-radio-group v-model="sysUser.disabled">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="opt">
          <el-col :span="2">
            <el-link />
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini" @click="disabledSysUser">保存</el-button>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">角色：</el-link>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="userRoles"
              size="mini"
              type="textarea"
              :rows="3"
              disabled
              style="font-size:Small;"
            />
          </el-col>
          <el-col :offset="2" :span="2">
            <el-link :underline="false" class="titlestyle">用户组：</el-link>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="userGroups"
              type="textarea"
              :rows="3"
              size="mini"
              disabled
              style="font-size:Small;"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-link />
          </el-col>
          <el-col class="opt" :span="3">
            <el-button type="primary" size="mini" @click="handleRole">角色分配</el-button>
          </el-col>
          <el-col :span="2">
            <el-link />
          </el-col>
          <el-col class="opt" :offset="2" :span="3">
            <el-button type="primary" size="mini" @click="handleGroup">用户组分配</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog :visible.sync="rolePanelVisiable" title="用户角色" center :close-on-click-modal="false" @close="handleResetRole">
      <el-transfer v-model="userRoleList" filterable :titles="roleTitle" :props="roleListProps" :data="roleList" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveRole()">保存</el-button>
        <el-button @click="handleResetRole">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="groupPanelVisiable" title="用户组" center :close-on-click-modal="false"> 
      <el-transfer v-model="userGroupList" filterable :titles="groupTitle" :props="groupListProps" :data="groupList" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveGroup()">保存</el-button>
        <el-button @click="handleResetGroup">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getUserInfo,
  disabledSysUser
} from '@/api/sys/user'
import {
  getAllRoles,
  getUserRoles,
  saveUserRoles
} from '@/api/sys/role'
import {
  getAllUserGroups
} from '@/api/sys/user-group'
import {
  getUserGroups,
  saveUserGroups
} from '@/api/sys/usergroup-user'
export default {
  data() {
    return {
      sysUser: {},
      // 角色
      rolePanelVisiable: false,
      userRoles: '',
      userRoleList: [],
      roleTitle: [],
      roleList: [],
      roleListProps: {
        key: 'id',
        label: 'roleName',
        disabled: 'false'
      },

      // 用户组
      groupPanelVisiable: false,
      userGroups: '',
      userGroupList: [],
      groupTitle: [],
      groupList: [],
      groupListProps: {
        key: 'id',
        label: 'groupName',
        disabled: 'false'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getUrlParams()
      if (this.sysUser.userId) {
        this.fetchUserInfo()
      } else {
        this.error()
      }
    },
    getUrlParams() {
      const query = this.$route.query
      if (query && query.sysUserId) {
        this.sysUser.userId = query.sysUserId
      }
    },
    fetchUserInfo() {
      getUserInfo(this.sysUser.userId).then(res => {
        if (res.result) {
          this.sysUser = res.data

          // 角色信息
          this.getRoles().then(() => {
            this.getUserRoles(this.sysUser.userId)
          })

          // 用户组
          this.getGroups().then(() => {
            this.getUserGroups(this.sysUser.userId)
          })
        }
      }).catch(err => {
        this.error(err)
      })
    },
    disabledSysUser() {
      const disabled = this.sysUser.disabled
      disabledSysUser(disabled, this.sysUser.userId).then(res => {
        if (res.data) {
          this.fetchUserInfo()
          this.$message('操作成功')
        } else {
          this.$message(res.message || '操作失败')
        }
      })
    },
    async getRoles() {
      await getAllRoles().then(res => {
        this.roleList = res.data
      })
    },
    getUserRoles(sysUserId) {
      getUserRoles(sysUserId).then(res => {
        this.userRoleList = res.data.map((val, idx, arr) => {
          return val.roleId
        })

        const userRoles = this.roleList.filter((item, index, arr) => {
          return this.userRoleList.indexOf(item.id) !== -1
        }).map((val, index, arr) => {
          return val.roleName
        })
        this.userRoles = userRoles.join('\n')
      })
    },
    handleRole() {
      this.roleTitle = ['系统角色', '用户角色']
      this.rolePanelVisiable = true
    },
    handleResetRole() {
      this.rolePanelVisiable = false
      this.getUserRoles(this.sysUser.userId)
    },
    handleSaveRole() {
      const sysUserId = this.sysUser.userId
      const roles = this.userRoleList
      saveUserRoles(sysUserId, roles).then(res => {
        if (res.data) {
          this.handleResetRole()
          this.fetchUserInfo()
          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async getGroups() {
      await getAllUserGroups().then(res => {
        this.groupList = res.data
      })
    },
    getUserGroups(sysUserId) {
      getUserGroups(sysUserId).then(res => {
        this.userGroupList = res.data.map((val, idx, arr) => {
          return val.userGroupId
        })

        const userGroups = this.groupList.filter((item, index, arr) => {
          return this.userGroupList.indexOf(item.id) !== -1
        }).map((val, index, arr) => {
          return val.groupName
        })
        this.userGroups = userGroups.join('\n')
      })
    },
    handleGroup() {
      this.groupTitle = ['系统用户组', '用户用户组']
      this.groupPanelVisiable = true
    },
    handleResetGroup() {
      this.groupPanelVisiable = false
      this.getUserGroups(this.sysUser.userId)
    },
    handleSaveGroup() {
      const sysUserId = this.sysUser.userId
      const groups = this.userGroupList
      saveUserGroups(sysUserId, groups).then(res => {
        if (res.data) {
          this.handleResetGroup()
          this.fetchUserInfo()

          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    error(err) {
      let message = '查询失败'
      if (err && err.message) {
        message = err.message
      }
      this.$alert('请返回重试', message, {
        confirmButtonText: '返回',
        type: 'error',
        callback: action => {
          this.$router.push({ path: '/sysuser/list' })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-link.el-link--default:hover {
	color: #606266;
}

.content{
    margin: 10px;
}

.info .el-row {
    line-height: 35px;
}

.opt {
    margin-top: 30px;
}
.titlestyle{

float: right;
}
.el-col {
    /* border: 1px solid red; */
}
</style>
