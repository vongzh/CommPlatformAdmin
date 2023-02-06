<template>
  <div class="app-container">
    <el-tabs v-model="currentTab">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-s-grid" /> 组织架构</span>
        <div class="org">
          <vue2-org-tree :data="treeData" :props="{label: 'departmentName', children: 'children'}" @on-node-click="orgNodeClick" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><i class="el-icon-menu" /> 部门</span>
        <el-collapse value="search">
          <el-collapse-item name="search">
            <span slot="title" class="collapse-title">部门列表</span>
            <div class="filter-container">
              <el-card>
                <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
                  <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="searchCondition.deptName" clearable placeholder="部门名称" class="filter-item input-search" />
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
              <el-button v-waves size="medium" icon="el-icon-upload" @click="handleSync()">同步部门</el-button>
              <el-button v-waves size="medium" icon="el-icon-upload" @click="handleSyncEmpls()">同步所有部门人员</el-button>
            </el-button-group>
          </div>
          <div class="content">
            <div class="table">
              <el-table v-loading="tableLoading" :data="departmentList" :fit="true" border highlight-current-row>
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="departmentName" label="部门名称">
                  <template slot-scope="scope">
                    <el-link @click="handleViewDepartment(scope.row)">{{ scope.row.departmentName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="上级部门">
                  <template slot-scope="scope">
                    {{ scope.row.parentDepartment?scope.row.parentDepartment.departmentName:'-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="order" label="排序" />
                <el-table-column prop="syncTime" label="同步时间" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><i class="el-icon-s-custom" /> 员工</span>
        <el-card>
          <el-form label-position="left">
            <el-form-item label="部门ID">
              <span>{{ currentDepartment.id }}</span>
            </el-form-item>
            <el-form-item label="部门名称">
              <span>{{ currentDepartment.departmentName }}</span>
            </el-form-item>
            <el-form-item label="上级部门">
              <span>{{ currentDepartment.parentDepartment?currentDepartment.parentDepartment.departmentName:'' }}</span>
            </el-form-item>
            <el-form-item label="部门人数">
              <span>{{ currentDepartment.employees?currentDepartment.employees.length:0 }}</span>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top:2%">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="medium" icon="el-icon-upload" @click="handleSyncEmpls(currentDepartment.id, true)">同步部门人员</el-button>
            </el-button-group>
          </div>
          <div class="content">
            <div class="table">
              <el-table v-loading="tableLoading" :data="currentDepartment.employees" :fit="true" border highlight-current-row>
                <el-table-column prop="userId" label="ID" />
                <el-table-column prop="nickName" label="姓名" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  SyncDepartments,
  SyncEmployees,
  GetDepartments,
  GetEmployees
} from '@/api/sys/department'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'Department',
  directives: {
    waves
  },
  data() {
    return {
      departmentList: [],
      tableLoading: false,

      // 搜索表单
      searchCondition: {
        deptName: ''
      },
      treeData: {},

      currentDepartment: {},

      currentTab: '0'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchDepartments()
    },
    fetchDepartments(param) {
      this.tableLoading = true

      GetDepartments(param || {}).then(res => {
        this.departmentList = res.data

        this.departmentList = this.departmentList.map(x => { x.children = []; return x })
        this.departmentList.forEach((v, i) => {
          if (v.parentId) {
            this.departmentList.find(z => z.id === v.parentId).children.push(v)
          }
        })

        this.treeData = this.departmentList.find(x => !x.parentId)

        this.tableLoading = false
      })
    },
    fetchEmployees(deptartment, callback) {
      GetEmployees(deptartment.id).then(res => {
        if (callback) {
          callback(res.data)
        }
      })
    },
    handleViewDepartment(department) {
      this.fetchEmployees(department, employees => {
        department.employees = employees
        // department.children = employees.map(x => { x.departmentName = x.nickName; return x })

        this.currentDepartment = department

        this.currentTab = '2'
      })
    },
    handleSync() {
      this.$confirm('确定要同步部门吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SyncDepartments().then(res => {
          this.$message.info('正在后台同步，请稍后查看')
        })
      }).catch(() => {

      })
    },
    handleSyncEmpls(departmentId, single) {
      if (single) {
        if (!departmentId) {
          this.$message.info('请先选择部门')
          return
        }
      }

      this.$confirm('确定要同步人员吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SyncEmployees(departmentId).then(res => {
          this.$message.info('正在后台同步，请稍后查看')
        })
      }).catch(() => {

      })
    },
    handleSearch() {
      this.fetchDepartments(this.searchCondition)
    },
    orgNodeClick(e, d) {
      this.handleViewDepartment(d)
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}

.org-tree-container {
    width: 100%;
    padding-bottom: 5%;
    padding-top: 5%;
    padding-left: 20%;
}
</style>
