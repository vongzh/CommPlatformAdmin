<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">用户组列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="用户组名称" prop="groupName">
                <el-input v-model="searchCondition.groupName" clearable placeholder="用户组名称" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="用户组标记" prop="meta">
                <el-input v-model="searchCondition.meta" clearable placeholder="用户组标记" class="filter-item input-search" />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleSearch('search')">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="handleReset('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" @click="handleEdit()" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
        </el-button-group>
      </div>
      <div class="content">
        <div class="table">
          <el-table v-loading="tableLoading" :data="userGroupList" :fit="true" border highlight-current-row>
            <el-table-column prop="groupName" label="用户组名称" />
            <el-table-column prop="meta" label="用户组标记" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="table-opt">
                  <el-button size="mini" type="info" @click="handleEdit(scope.row.id)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  <el-button size="mini" type="warning" @click="handleUserGroup(scope.row.id)">用户分配</el-button>
                  <el-button size="mini" type="success" @click="handleGiveModule(scope.row.id)">模块分配</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog :visible.sync="formVisiable" title="用户组" width="600px" :close-on-click-modal="false" @close="handleReset('form')">
      <el-form ref="form" :model="userGroup" :rules="UserGroupFormRules" :inline-message="true" label-width="100px">
        <el-form-item label="用户组名称" prop="groupName">
          <el-col :span="12">
            <el-input
              v-model="userGroup.groupName"
              placeholder="名称"
              maxlength="20"
              show-word-limit
              style="width:350px"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="用户组标识" prop="meta" style="width:350px">
          <el-col :span="12">
            <el-input
              v-model="userGroup.meta"
              placeholder="标识"
              maxlength="20"
              show-word-limit
              style="width:350px"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="userGroup.description"
            type="textarea"
            maxlength="50"
            style="width:350px"
            rows="6"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handlerSave">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>

      </div>
    </el-dialog>

    <el-dialog :visible.sync="giveUserGroupVisiable" title="用户分配" center :close-on-click-modal="false" @close="handleCancelGroupUsers">
      <el-card>
        <el-transfer
          v-model="userGroupUserList"
          style="margin-left: 10%;"
          :titles="giveUserGroupTitle"
          :props="userListProps"
          :data="userList"
          filterable
        />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="handleCancelGroupUsers">取消</el-button>
        <el-button type="primary" @click="saveUserGroupUser">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="giveModuleVisiable" title="模块分配" center @close="handleCancelGroupModules">
      <el-card>
        <el-transfer
          v-model="userGroupModuleList"
          :titles="giveModuleTitle"
          :props="moduleListProps"
          :data="moduleList"
          filterable
          @change="userGroupChange"
        />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="handleCancelGroupModules">取消</el-button>
        <el-button type="primary" @click="saveUserGroupModule">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList
} from '@/api/sys/user'
import {
  getUserGroupUsers,
  saveUserGroupUsers
}
  from '@/api/sys/usergroup-user'
import { getUserGroupModules, saveUserGroupModules } from '@/api/sys/usergroup-module'
import { getModules }
  from '@/api/sys/module'
import {
  saveUserGroup,
  getUserGroup,
  getUserGroups,
  deleteUserGroup
} from '@/api/sys/user-group'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'UserGroup',
  directives: {
    waves
  },
  data() {
    return {
      userGroupList: [],
      tableLoading: false,

      // 搜索表单
      searchCondition: {
        meta: '',
        groupName: ''
      },

      // 新增表单
      formVisiable: false,
      userGroup: {},
      UserGroupFormRules: {
        groupName: [
          { required: true, message: '请输入用户组名称', trigger: 'change' }
        ], meta: [
          { required: true, message: '请输入用户组标识', trigger: 'change' }
        ]
      },

      // 用户组分配
      giveUserGroup: {},
      giveUserGroupTitle: [],
      giveUserGroupVisiable: false,
      userListProps: {
        key: 'id',
        label: 'userName',
        disabled: 'false'
      },
      userList: [],
      userGroupUserList: [],

      // 模块分配
      giveUserModule: {},
      giveModuleVisiable: false,
      giveModuleTitle: [],
      moduleListProps: {
        key: 'id',
        label: 'moduleName',
        disabled: 'false'
      },
      userGroupModuleList: [],
      moduleList: []
    }
  },
  created() {
    this.getUserGroups({})
  },
  methods: {
    getUserGroups(param) {
      this.tableLoading = true
      getUserGroups(param || {}).then(res => {
        this.userGroupList = res.data

        this.tableLoading = false
      })
    },
    getUserList() {
      getUserList().then(res => {
        this.userList = res.data
      })
    },
    getModules() {
      getModules().then(res => {
        this.moduleList = res.data
      })
    },
    handleSearch(type) {
      let param = {}
      if (type !== 'refresh') {
        param = this.searchCondition
      }
      this.getUserGroups(param)

      const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
      this.$message(tip)
    },
    handleEdit(id) {
      this.formVisiable = true
      if (id) {
        getUserGroup({
          id: id
        }).then(res => {
          this.userGroup = res.data
        })
      }
    },
    handlerSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }

        const userGroup = this.userGroup
        saveUserGroup(userGroup).then(res => {
          if (res.data) {
            this.handleReset('form')
            this.userGroup = {}

            this.getUserGroups()
            this.formVisiable = false
            this.$message('保存成功')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleDelete(group) {
      const tip = '删除后不能恢复,确定要删除' + group.groupName + '?'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserGroup({
          id: group.id
        }).then(res => {
          if (res.data) {
            this.getUserGroups({})
            this.$message('删除成功')
          } else this.$message(res.message || '删除失败')
        })
      })
    },
    handleUserGroup(id) {
      if (id) {
        const param = {
          id: id
        }
        getUserGroup(param).then(res => {
          this.giveUserGroup = res.data

          const groupName = this.giveUserGroup.groupName
          this.giveUserGroupTitle = ['用户', '已分配用户']
        })

        getUserGroupUsers(id).then(res => {
          const userGroupUserIds = res.data.map((value, index, array) => {
            return value.userId
          })
          this.userGroupUserList = userGroupUserIds
        })
      }
      this.getUserList()
      this.giveUserGroupVisiable = true
    },
    saveUserGroupUser() {
      const groupId = this.giveUserGroup.id
      const userIds = this.userGroupUserList
      saveUserGroupUsers(groupId, userIds).then(res => {
        if (res.data) {
          this.handleCancelGroupUsers()
          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleCancel() {
      this.handleReset('form')
      this.userGroup = {}

      this.formVisiable = false
    },
    handleCancelGroupUsers() {
      this.giveUserGroupTitle = []
      this.userGroupUserList = []
      this.giveUserGroup = {}
      this.userList = []

      this.giveUserGroupVisiable = false
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    handleGiveModule(id) {
      if (id) {
        getUserGroup({ id: id }).then(res => {
          this.giveUserModule = res.data

          const groupName = this.giveUserModule.groupName
          this.giveModuleTitle = ['模块', '已分配模块']
        })

        getUserGroupModules(id).then(res => {
          const userGroupModuleIds = res.data.map((value, index, array) => {
            return value.moduleId
          })
          this.userGroupModuleList = userGroupModuleIds
        })
      }

      this.getModules()
      this.giveModuleVisiable = true
    },
    saveUserGroupModule() {
      const groupId = this.giveUserModule.id
      const moduleIds = this.userGroupModuleList

      saveUserGroupModules(groupId, moduleIds).then(res => {
        if (res.data) {
          this.handleCancelGroupModules()
          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleCancelGroupModules() {
      this.userGroupModuleList = []
      this.giveModuleTitle = []
      this.giveUserModule = {}
      this.moduleList = []

      this.giveModuleVisiable = false
    },
    userGroupChange(val, to, vals) {

    }
  }
}
</script>

<style scoped>
  .transfer-footer {
    float: right;
    margin: 0.25rem;
  }
  .footer{
    text-align: center
  }
  .dialog-footer{
    text-align: center;
  }
</style>
