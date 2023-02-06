<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">用户列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="searchCondition.userName" clearable placeholder="用户名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="注册手机号" prop="phone">
                <el-input v-model="searchCondition.phone" clearable placeholder="注册手机号" class="filter-item input-search" maxlength="11" show-word-limit />
              </el-form-item>
              <el-form-item label="状态" prop="disabled">
                <el-select v-model="searchCondition.disabled" clearable>
                  <el-option label="启用" :value="0" />
                  <el-option label="禁用" :value="1" />
                </el-select>
                <!-- <el-input v-model="searchCondition.disabled" clearable placeholder="状态" class="filter-item input-search" /> -->
              </el-form-item>
              <el-form-item label="注册时间" prop="registerTime">
                <el-date-picker
                  v-model="searchCondition.registerTime"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
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
            <el-table-column prop="userId" label="用户编号" />
            <el-table-column prop="userName" label="用户名" />
            <el-table-column prop="mobile" label="注册手机号">
              <template slot-scope="scope">
                {{ scope.row.mobile }}
              </template>
            </el-table-column>
            <el-table-column prop="lastLoginTime" label="最后登录">
              <template slot-scope="scope">
                {{ scope.row.lastLoginTime?scope.row.lastLoginTime.replace('T',''):'' }}
              </template>
            </el-table-column>
            <el-table-column prop="registerTime" label="注册时间">
              <template slot-scope="scope">
                {{ scope.row.lastLoginTime?scope.row.registerTime.replace('T',''):'' }}
              </template>
            </el-table-column>
            <el-table-column prop="disabled" label="状态">
              <template slot-scope="scope">
                {{ scope.row.disabled === YNEnum.N ? '启用':'禁用' }}
                <!-- <el-col effect="dark" :type="scope.row.disabled === YNEnum.N ? 'success' : 'danger'">{{ scope.row.disabled === YNEnum.N ? '启用':'禁用' }}</el-col> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="table-opt">
                  <el-button v-if="scope.row.disabled === YNEnum.N" size="mini" type="danger" @click="disabledSysUser(YNEnum.Y,scope.row.userId)">禁用</el-button>
                  <el-button v-if="scope.row.disabled === YNEnum.Y" size="mini" type="primary" @click="disabledSysUser(YNEnum.N,scope.row.userId)">启用</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              layout="sizes,total, prev, pager, next, jumper"
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
  </div>
</template>

<script>
import {
  queryUserList,
  disabledSysUser
} from '@/api/sys/user'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission'
import { deepClone } from '@/utils/index'
export default {
  name: 'User',
  directives: {
    waves,
    permission
  },
  data() {
    return {
      formVisiable:false,
      tableLoading: false,
      searchCondition1: {
        phone: '',
        userName: '',
        disabled: '',
        registerTime: []
      },
      searchCondition: {
        phone: '',
        userName: '',
        disabled: '',
        registerTime: []
      },
      userList: [],
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      YNEnum: {
        Y: 1,
        N: 0
      },
      UserTypeEnum: {
        USER: 10,
        CUSTOMER: 50,
        BACKSTAGE: 100
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
        registerTime: {
          item1: this.searchCondition1.registerTime ? this.searchCondition1.registerTime[0] : '',
          item2: this.searchCondition1.registerTime ? this.searchCondition1.registerTime[1] : ''
        },
        userType: this.UserTypeEnum.USER,
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
    disabledSysUser(disabled, userId) {
      disabledSysUser(disabled, userId).then(res => {
        if (res.data) {
          this.queryUserList()
          this.$message('操作成功')
        } else {
          this.$message(res.message || '操作失败')
        }
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
    }
  }
}
</script>
