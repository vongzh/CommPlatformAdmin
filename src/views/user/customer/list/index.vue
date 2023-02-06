<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">客户列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="searchCondition.userName" clearable placeholder="用户名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="注册手机号" prop="registerPhone">
                <el-input v-model="searchCondition.registerPhone" clearable placeholder="注册手机号" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="searchCondition.companyName" clearable placeholder="公司名称" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="客户类型" prop="customerType">
                <el-select v-model="searchCondition.customerType" placeholder="客户类型" clearable>
                  <el-option label="企业" :value="1" />
                  <el-option label="个人" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="联系人" prop="contactName">
                <el-input v-model="searchCondition.contactName" clearable placeholder="联系人" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="联系方式" prop="contactPhone">
                <el-input v-model="searchCondition.contactPhone" clearable placeholder="联系电话" class="filter-item input-search" />
              </el-form-item>
              <!-- <el-form-item label="邮箱" prop="email">
                <el-input v-model="searchCondition.email" clearable placeholder="邮箱" class="filter-item input-search" />
              </el-form-item> -->

              <!-- <el-form-item label="客户状态" prop="status">
                <el-select v-model="searchCondition.status" placeholder="客户状态" clearable>
                  <el-option label="注册" :value="0" />
                  <el-option label="待授权" :value="5" />
                  <el-option label="正常" :value="10" />
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item label="客户状态" prop="isEnable">
                <el-select v-model="searchCondition.isEnable" placeholder="客户状态" clearable>
                  <el-option label="启用" :value="1" />
                  <el-option label="禁用" :value="0" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="审核状态" prop="auditStatus">
                <el-select v-model="searchCondition.auditStatus" placeholder="审核状态" clearable>
                  <el-option label="待审核" :value="0" />
                  <el-option label="驳回" :value="-5" />
                  <el-option label="通过" :value="10" />
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
          <!-- <el-button v-waves size="medium" icon="el-icon-plus" @click="handleEdit()" /> -->
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
          <!-- <el-button v-waves size="medium" icon="el-icon-share" /> -->
        </el-button-group>
      </div>
      <div class="content">
        <div class="table">
          <el-table v-loading="tableLoading" :data="customerList" :fit="true" border highlight-current-row>
            <el-table-column prop="customerNo" label="客户编号" min-width="6%" />
            <el-table-column prop="userName" label="用户名" min-width="6%" />
            <el-table-column prop="registerPhone" label="注册手机号" min-width="8%" />
            <el-table-column prop="companyName" label="公司名称" min-width="11%" />
            <el-table-column prop="customerTypeDesc" label="客户类型" min-width="6%" />
            <el-table-column prop="contactName" label="联系人" min-width="6%" />
            <el-table-column prop="contactPhone" label="联系方式" min-width="7%" />
            <el-table-column prop="email" label="邮箱" min-width="9%"/>
            <el-table-column label="状态" prop="disabledDesc" min-width="6%" />
            <!-- <el-table-column
              v-if="searchCondition.customerType === CustomerType.COMPANY"
              prop="businessLicenseNo"
              label="营业执照"
              width="150"
            >
              <template v-slot="scope">
                {{ scope.row.businessLicenseNo }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="searchCondition.customerType === CustomerType.COMPANY"
              prop="businessLicenseImg"
              label="营业执照附件"
              width="120"
            >
              <template v-slot="scope">
                <el-image
                  :lazy="true"
                  :src="scope.row.businessLicenseImgs?scope.row.businessLicenseImgs[0]:''"
                  fit="fill"
                  :preview-src-list="scope.row.businessLicenseImgs"
                  style="height: 3.75rem;width:6.25rem;"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              prop="idCardNo"
              label="身份证"
              width="150"
            >
              <template v-slot="scope">
                {{ scope.row.idCardNo }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              prop="idCardImg"
              label="身份证附件"
              width="120"
            >
              <template v-slot="scope">
                <el-image
                  :lazy="true"
                  :src="scope.row.idCardImgs?scope.row.idCardImgs[0]:''"
                  fit="fill"
                  :preview-src-list="scope.row.idCardImgs"
                  style="height: 3.75rem;width: 6.25rem;"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="sysUserId" label="系统用户" width="100" /> -->
            <!-- <el-table-column label="客户状态" width="80">
              <template slot-scope="scope">
                <el-tag effect="light" :type="scope.row.isEnable === YNEnum.Y ? 'success' : 'warning'">{{ scope.row.isEnable === YNEnum.Y?'启用':'禁用' }}</el-tag>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="客户状态" width="80">
              <template slot-scope="scope">
                <el-tag effect="light" :type="scope.row.status === CustomerStatus.NORMAL ? 'info' : 'warning'">{{ scope.row.statusDesc }}</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column label="审核状态" min-width="6%">
              <template slot-scope="scope">
                <el-col>{{ scope.row.auditStatusDesc }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="6%">
              <template slot-scope="scope">
            <el-link style="color:#DF9524" size="mini" @click="goDetail(scope.row.customerNo)">详情</el-link>
                <!-- <div class="table-opt">
                  <el-button
                    v-if="CustomerAuditStatus.WAITAUDIT === scope.row.auditStatus"
                    size="mini"
                    type="success"
                    @click="handlerAudit(scope.row,CustomerAuditStatus.PASS)"
                  >通过</el-button>
                  <el-button
                    v-if="CustomerAuditStatus.WAITAUDIT === scope.row.auditStatus"
                    size="mini"
                    type="danger"
                    @click="handlerAudit(scope.row,CustomerAuditStatus.REJECT)"
                  >驳回</el-button>
                  <el-button
                    v-if="CustomerStatus.IMPOWER === scope.row.status && CustomerAuditStatus.PASS === scope.row.auditStatus"
                    size="mini"
                    type="danger"
                    @click="handlerImpower(scope.row)"
                  >启用</el-button>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              layout="sizes,total,prev, pager, next, jumper"
              :total="totalCount"
              :current-page="pageIndex"
              :page-size="pageSize"
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
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
import {
  GetCustomers,
  AuditCustomer,
  ImpowerCustomer
} from '@/api/customer/customer'
export default {
  name: 'CustomerList',
  directives: {
    waves
  },
  data() {
    return {
      searchCondition1: {
        customerType: '',
        userName: '',
        registerPhone: '',
        companyName: '',
        contactName: '',
        contactPhone: '',
        // email: '',
        status: '',
        auditStatus: '',
        isEnable: ''
      },
      searchCondition: {
        customerType: '',
        userName: '',
        registerPhone: '',
        companyName: '',
        contactName: '',
        contactPhone: '',
        // email: '',
        status: '',
        auditStatus: '',
        isEnable: ''
      },
      tableLoading: false,
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      customerList: [],
      CustomerStatus: {
        ORIGINAL: 0,
        IMPOWER: 5,
        NORMAL: 10
      },
      CustomerAuditStatus: {
        REJECT: -5,
        WAITAUDIT: 0,
        PASS: 10
      },
      CustomerType: {
        COMPANY: 1,
        PERSON: 2
      },
      YNEnum: {
        Y: 1,
        N: 0
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchCustomerList()
    },
    fetchCustomerList() {
      this.tableLoading = true
      this.customerList = []
      const condition = { ...this.searchCondition1,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      GetCustomers(condition).then(res => {
        this.customerList = res.data.rows
        this.totalCount = res.data.total
        this.tableLoading = false
      })
    },
    handleSearch(type) {
      if (type === 'refresh') {
        this.fetchCustomerList('refresh')
      } else {
        this.searchCondition1 = deepClone(this.searchCondition)
        this.pageIndex = 1
        this.fetchCustomerList()
      }
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchCustomerList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchCustomerList()

    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    handlerImpower(customer) {
      ImpowerCustomer(customer.customerNo).then(res => {
        if (res.data) {
          this.fetchCustomerList()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          this.$message({
            type: 'info',
            message: '操作失败，请稍后再试'
          })
        }
      })
    },
    handlerAudit(customer, auditStatus) {
      const opt = auditStatus === this.CustomerAuditStatus.PASS ? '通过' : '驳回'
      this.$prompt('请输入' + opt + '原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({
        value
      }) => {
        const params = {
          auditStatus,
          auditDesc: value,
          customerNo: customer.customerNo
        }
        AuditCustomer(params).then(res => {
          this.fetchCustomerList()
          if (res.data) {
            this.$message({
              type: 'success',
              message: opt + '成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: opt + '失败，请稍后再试'
            })
          }
        })
      }).catch()
    },
    goDetail(customerNo) {
      // console.log(customerNo);
      this.$router.push({
        path: '/customer/detail',
        query: {
          customerNo
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
