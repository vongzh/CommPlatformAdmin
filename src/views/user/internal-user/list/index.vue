<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">内部用户</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="searchCondition.userName" clearable placeholder="用户名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="姓名" prop="nickName">
                <el-input v-model="searchCondition.nickName" clearable placeholder="姓名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="是否禁用" prop="disabled">
                <el-select v-model="searchCondition.disabled" placeholder="是否禁用" clearable>
                  <el-option label="启用" value="0" />
                  <el-option label="禁用" value="1" />
                </el-select>
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
          <el-table v-loading="tableLoading" :data="userList" :fit="true" border highlight-current-row>
            <el-table-column prop="userId" label="用户编号" min-width="6%" />
            <el-table-column prop="userName" label="用户名" min-width="7%" />
            <el-table-column prop="nickName" label="姓名" min-width="6%" />
            <el-table-column prop="mail" label="邮箱" min-width="8%">
              <template slot-scope="scope">
                {{ scope.row.mail }}
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="电话" min-width="7%">
              <template slot-scope="scope">
                {{ scope.row.mobile }}
              </template>
            </el-table-column>
            <el-table-column prop="statusDesc" label="状态" min-width="5%">
              <template slot-scope="scope">
                <el-col effect="light" :type="scope.row.status === userStatusEnum.normal ? 'success' : 'danger'">{{ scope.row.statusDesc }}</el-col>
              </template>
            </el-table-column>
            <el-table-column prop="disabled" label="是否禁用" min-width="5%">
              <template slot-scope="scope">
                <el-col effect="dark" :type="scope.row.disabled === YNEnum.N ? 'success' : 'danger'">{{ scope.row.disabled === YNEnum.N ? '启用':'禁用' }}</el-col>
              </template>
            </el-table-column>
            <el-table-column prop="disabled" min-width="10%"  label="角色名称">
              <template slot-scope="scope">
                <el-col v-for="(u,i) in scope.row.userRoles" :key="i" effect="dark">{{ u.roleName }}</el-col>
                <!-- <el-col v-for="(u,i) in scope.row.userList">{{u.userName}}&nbsp&nbsp</el-col> -->
              </template>
            </el-table-column>
            <el-table-column prop="lastLoginTime" label="最后登录" min-width="9%">
              <template slot-scope="scope">
                {{ scope.row.lastLoginTime?scope.row.lastLoginTime.replace('T',''):'' }}
              </template>
            </el-table-column>
            <el-table-column prop="registerTime" label="创建时间" min-width="9%">
              <template slot-scope="scope">
                {{ scope.row.registerTime?scope.row.registerTime.replace('T',''):'' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="10%">
              <template slot-scope="scope">
                <div class="table-opt">
                  <el-link style="color:#DF9524;margin-right:3rem" size="mini" type="primary" @click="goDetail(scope.row.userId)">详情</el-link >
                  <el-link style="color:#DF9524" size="mini" type="info" @click="handleEdit(scope.row.userId)">修改</el-link >
                  <!-- <el-button size="mini" type="warning" @click="handleRole(scope.row)">角色</el-button>
                  <el-button size="mini" type="success" @click="handleGroup(scope.row)">用户组</el-button>
                  <el-button size="mini" type="info" @click="handleEdit(scope.row.userId)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              layout="sizes,total, prev, pager, next, jumper"
              :hide-on-single-page="true"
              :total="totalCount"
              :page-size="pageSize"
              :current-page="pageIndex"
              :page-sizes="[10,20, 50, 100]"
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog :visible.sync="formVisiable" title="用户信息" center :close-on-click-modal="false" @close="handleCancel()">
      <el-form ref="form" :model="sysUser" label-width="100px" autocomplete="off" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户编号">
              <el-col :span="12">
                <el-tag type="info">{{ sysUser.userId===0?'系统生成':sysUser.userId }}</el-tag>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-col :span="12">
                <el-tag type="info">{{ sysUser.userName?sysUser.userName:'未设置' }}</el-tag>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户状态">
              <el-col :span="12">
                <el-tag :type="sysUser.status === userStatusEnum.normal ? 'success' : 'danger' ">{{ sysUser.statusDesc }}</el-tag>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否禁用">
              <el-col :span="12">
                <el-tag :type="sysUser.disabled === YNEnum.Y ?'warning':'primary'">{{ sysUser.disabled === YNEnum.Y ?'禁用':'启用' }}</el-tag>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-col :span="12">
                <el-input v-model="sysUser.userName" size="small" placeholder="用户名" :disabled="sysUser.id>0" maxlength="18" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="nickName">
              <el-col :span="12">
                <el-input v-model="sysUser.nickName" size="small" placeholder="昵称" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-col :span="12">
                <el-input v-model="sysUser.mobile" :maxlength="11" size="small" placeholder="手机号" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="mail">
              <el-col :span="12">
                <el-input v-model="sysUser.mail" size="small" type="mail" placeholder="邮箱" autocomplete="new-password" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="!sysUser.id" label="密码" prop="pwd" :rules="[{ required: true,message: '请输入密码',trigger: 'blur' },{min: 8,max: 20,message: '密码长度在 8 到 20 个字符',trigger: 'blur'},{pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/,message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',trigger: 'blur' }]">
              <el-col :span="12">
                <el-input v-model="sysUser.pwd" size="small" show-password placeholder="密码" maxlength="18" show-word-limit autocomplete="new-password" />
              </el-col>
            </el-form-item>
            <el-form-item v-else label="密码" prop="pwd">
              <el-button v-if="sysUser.id" type="warning" size="small" @click="Resetpassword(sysUser.userId)">重置密码</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleSaveSysUser()">保存</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="rolePanelVisiable" title="用户角色" center>
      <el-transfer v-model="userRoleList" filterable :titles="roleTitle" :props="roleListProps" :data="roleList" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleSaveRole()">保存</el-button>
        <el-button size="small" @click="handleCancelRole">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="groupPanelVisiable" title="用户组" center>
      <el-transfer v-model="userGroupList" filterable :titles="groupTitle" :props="groupListProps" :data="groupList" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleSaveGroup()">保存</el-button>
        <el-button size="small" @click="handleCancelGroup()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  queryUserList,
  getUserInfo,
  deleteSysUser,
  saveUser,
  ResetPwd,
  CheckSysUserMobileIsExist
} from '@/api/sys/user'
import { deepClone } from '@/utils/index'
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

import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission'
import md5 from 'js-md5'
export default {
  name: 'User',
  directives: {
    waves,
    permission
  },
  data() {
    var checkMobileIsExist = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
        return
      }
      CheckSysUserMobileIsExist(this.sysUser.userId, '' + value).then(res => {
        if (!res.data) {
          callback()
        } else {
          callback(new Error('该手机号码已被注册'))
        }
      }).catch(err => {
      })
    }
    return {
      tableLoading: false,
      searchCondition1: {
        userName: '',
        disabled: '',
        userType: 100,
        nickName:''
      },
      searchCondition: {
        userName: '',
        disabled: '',
        userType: 100,
        nickName:''
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '用户名长度应为6~18个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[A-Za-z][A-Za-z0-9]{5,18}$/,
            message: '用户名只能输入字母、数字，需要以字母开头',
            trigger: 'blur'
          }
        ],
        nickName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '姓名长度应为2到20位',
          trigger: 'blur'
        },
        {
          pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
          message: '姓名校验不合法,应由中文开头，其中可含(·)组成',
          trigger: 'blur'
        }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /[^\u4e00-\u9fa5_a-zA-Z]+$/,
            message: '格式不正确，请输入手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '手机号长度应为11位数字',
            trigger: 'blur'
          },
          {
            pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
            message: '手机号码无效',
            trigger: 'blur'
          },
          {
            validator: checkMobileIsExist,
            trigger: 'blur'
          }
        ],
        mail: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },
        {
          pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }
        ]
      },
      userList: [],
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      UserTypeEnum: {
        USER: 10,
        CUSTOMER: 50,
        BACKSTAGE: 100
      },
      formVisiable: false,
      sysUser: {
        id: 0,
        userId: 0,
        avatar: '',
        status: 0,
        modules: [],
        roleMenus: [],
        userRoles: [],
        statusDesc: '正常'
      },
      userStatusEnum: {
        lock: -5,
        normal: 0
      },
      YNEnum: {
        Y: 1,
        N: 0
      },

      // 角色
      rolePanelVisiable: false,
      userRoleList: [],
      roleTitle: [],
      roleUser: {},
      roleList: [],
      roleListProps: {
        key: 'id',
        label: 'roleName',
        disabled: 'false'
      },

      // 用户组
      groupPanelVisiable: false,
      userGroupList: [],
      groupTitle: [],
      groupUser: [],
      groupList: [],
      groupListProps: {
        key: 'id',
        label: 'groupName',
        disabled: 'false'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.queryUserList()
    },
    queryUserList(oriParam) {
      this.userList = []
      this.tableLoading = true

      const param = oriParam || {
        ...this.searchCondition1,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      queryUserList(param).then(res => {
        if (res.data) {
          this.userList = res.data.rows
          this.totalCount = res.data.total
        } else {
          this.$message(res.message || '请求失败')
        }
        this.tableLoading = false
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.queryUserList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.queryUserList()

    },
    handleSearch(type) {
      if (type === 'refresh') {
        this.queryUserList()
      } else {
        this.searchCondition1 = deepClone(this.searchCondition)
        this.pageIndex = 1
        this.queryUserList()
      }
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    handleEdit(id) {
      if (id) {
        getUserInfo(id).then(res => {
          this.sysUser = res.data
        })
      }

      this.formVisiable = true
    },
    handleCancel() {
      this.formVisiable = false
      this.$refs['form'].resetFields()
      this.sysUser = {
        id: 0,
        userId: 0,
        status: 0,
        avatar: '',
        modules: [],
        roleMenus: [],
        userRoles: [],
        statusDesc: '正常'
      }
    },
    handleDelete(sysUser) {
      this.$confirm('删除后不能恢复,确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const userId = sysUser.id
        deleteSysUser(userId).then(res => {
          if (res.data) {
            this.queryUserList()

            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleSaveSysUser() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }

        try {
          const user = deepClone(this.sysUser)
          user.userType = this.UserTypeEnum.BACKSTAGE

          if (this.sysUser.pwd) {
            user.pwd = md5(this.sysUser.pwd)
          }

          saveUser(user).then(res => {
            if (res.data) {
              this.formVisiable = false
              this.queryUserList()
              this.$message('保存成功')
              this.sysUser = {
                id: 0,
                userId: 0,
                status: 0,
                avatar: '',
                modules: [],
                roleMenus: [],
                userRoles: [],
                statusDesc: '正常'
              }
            } else {
              this.$message.error('保存失败')
            }
          })
        } catch (error) {
          console.log(error)
        }
      })
    },
    Resetpassword(userId) {
      ResetPwd(userId).then(res => {
        if (res.data) {
          this.$message('重置密码成功')
        } else {
          this.$message.error('密码重置失败')
        }
      })
    },
    getRoles() {
      getAllRoles().then(res => {
        this.roleList = res.data
      })
    },
    getUserRoles(userId) {
      getUserRoles(userId).then(res => {
        this.userRoleList = res.data.map((val, idx, arr) => {
          return val.roleId
        })
      })
    },
    handleRole(user) {
      this.roleUser = user
      this.roleTitle = ['角色', user.userName]
      this.getRoles()
      this.getUserRoles(user.id)

      this.rolePanelVisiable = true
    },
    handleCancelRole() {
      this.roleUser = {}
      this.roleTitle = []
      this.roleList = []

      this.rolePanelVisiable = false
    },
    handleSaveRole() {
      const userId = this.roleUser.id
      const roles = this.userRoleList
      saveUserRoles(userId, roles).then(res => {
        if (res.data) {
          this.handleCancelRole()

          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getGroups() {
      getAllUserGroups().then(res => {
        this.groupList = res.data
      })
    },
    getUserGroups(userId) {
      getUserGroups(userId).then(res => {
        this.userGroupList = res.data.map((val, idx, arr) => {
          return val.userGroupId
        })
      })
    },
    handleGroup(user) {
      this.groupUser = user
      this.groupTitle = ['用户组', user.userName]
      this.getGroups()
      this.getUserGroups(user.id)

      this.groupPanelVisiable = true
    },
    handleCancelGroup() {
      this.groupUser = {}
      this.groupTitle = []
      this.groupList = []

      this.groupPanelVisiable = false
    },
    handleSaveGroup() {
      const userId = this.groupUser.id
      const groups = this.userGroupList
      saveUserGroups(userId, groups).then(res => {
        if (res.data) {
          this.handleCancelGroup()

          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    goDetail(sysUserId) {
      this.$router.push({
        path: '/sysuser/detail',
        query: {
          sysUserId
        }
      })
    }
  }
}
</script>
