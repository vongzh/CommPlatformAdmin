<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">角色列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="searchCondition.roleName" clearable placeholder="角色名称" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="标记" prop="meta">
                <el-input v-model="searchCondition.meta" clearable placeholder="角色名称" class="filter-item input-search" />
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
          <el-table v-loading="tableLoading" :data="roleList" :fit="true" border highlight-current-row>
            <el-table-column prop="roleName" label="名称" />
            <el-table-column prop="meta" label="标记" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="table-opt">
                  <el-button size="mini" type="info" @click="handleEdit(scope.row.id)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  <el-button size="mini" type="warning" @click="handleGivePermission(scope.row.id)">权限分配</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-dialog :visible.sync="permissionVisiable" title="分配权限" :close-on-click-modal="false" @close="handleResetPermission">
      <el-card>
        <el-tree
          ref="rolePermission"
          :data="nestMenuList"
          :props="defaultProps"
          :default-checked-keys="rolePermissionList"
          node-key="id"
          show-checkbox
          default-expand-all
        />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelPermission()">取消</el-button>
        <el-button type="primary" @click="handleSavePermission">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="formVisiable" title="角色" width="450px" :close-on-click-modal="false" @close="handleReset('form')">
      <el-form ref="form" :rules="roleFormRules" :model="role" label-width="80px" :inline-message="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-col :span="12">
            <el-input
              style="width:250px"
              v-model="role.roleName"
              placeholder="名称"
              maxlength="20"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="标记" prop="meta">
          <el-col :span="12">
            <el-input
          style="width:250px"
              v-model="role.meta"
              placeholder="标记"
              maxlength="20"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
          style="width:250px"
            v-model="role.description"
            type="textarea"
            maxlength="50"
            rows="5"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSave">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRole,
  getRoles,
  deleteRole,
  saveRole
} from '@/api/sys/role'
import {
  getNestMenus
} from '@/api/sys/menu'
import {
  getRolePermissions,
  saveRolePermissions
} from '@/api/sys/role-permission'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Role',
  directives: {
    waves
  },
  data() {
    return {
      // 数据
      roleList: [],
      rolePermissionList: [],
      tableLoading: false,

      // 搜索表单
      searchCondition: {
        roleName: '',
        meta: ''
      },

      // 新增表单
      formVisiable: false,
      role: {},
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'change' }
        ], meta: [
          { required: true, message: '请输入角色标识', trigger: 'change' }
        ]
      },
      YN: {
        N: 0,
        Y: 1
      },

      // 分配权限
      roleId: 0,
      permissionVisiable: false,
      nestMenuList: [],
      defaultProps: {
        label: 'title',
        children: 'subMenus'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getRoles()
    },
    getRoles(param) {
      this.tableLoading = true
      getRoles(param || {}).then(res => {
        this.roleList = res.data
        this.tableLoading = false
      })
    },
    getNestMenus(id) {
      getNestMenus().then(res => {
        this.nestMenuList = res.data
        this.getRolePermissions(id)
      })
    },
    getRolePermissions(id) {
      getRolePermissions(id).then(res => {
        // 筛选一级菜单或者只有一级的菜单
        const menuPermissions = this.nestMenuList.map((value) => {
          if (value.subMenus && value.subMenus.length > 0) {
            return value.id
          }
        })

        let permissions = res.data
        permissions = permissions.filter(item => menuPermissions.indexOf(item.permissionId) < 0)
        const permissionIds = permissions.map((value, index, array) => {
          return value.permissionId
        })

        this.rolePermissionList = permissionIds
      })
    },
    handleEdit(id) {
      this.formVisiable = true
      if (id) {
        getRole({
          id: id
        }).then(res => {
          this.role = res.data
        })
      }
    },
    handleDelete(role) {
      const tip = '删除后不能恢复,确定要删除' + role.roleName + '?'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({
          id: role.id
        }).then(res => {
          if (res.data) {
            this.getRoles()
            this.$message('删除成功')
          } else this.$message(res.message || '删除失败')
        })
      })
    },
    handleCancel() {
      this.role = {}
      this.handleReset('form')
      this.formVisiable = false
    },
    handlerSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }

        const role = this.role
        saveRole(role).then(res => {
          if (res.data) {
            this.getRoles()
            this.handleResetPermission()
            this.formVisiable = false
            this.$message('保存成功')
            this.role = {}
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleGivePermission(id) {
      this.roleId = id
      this.permissionVisiable = true

      this.getNestMenus(id)
      // this.getRolePermissions(id)
    },
    handleCancelPermission() {
      this.handleResetPermission()
      this.permissionVisiable = false
    },
    handleResetPermission() {
      this.roleId = 0
      this.rolePermissionList = []
    },
    handleSavePermission() {
      const selected = this.$refs.rolePermission.getCheckedKeys()
      const c = this.$refs.rolePermission.getHalfCheckedKeys()
      const allselected = [...c, ...selected]
      saveRolePermissions(this.roleId, allselected).then(res => {
        if (res.data) {
          this.permissionVisiable = false
          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSearch(type) {
      let param = {}
      if (type !== 'refresh') {
        param = this.searchCondition
      }
      this.getRoles(param)

      const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
      this.$message(tip)
    },
    handleReset(formName) {
      this.role = {}
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}
</style>
