<template>
  <div class="content">
        <el-card>
          <el-form ref="searchForm" :model="searchCondition" label-position="top" inline class="searchForm">
            <el-form-item label="开票日期" prop="invoiceDate" style="width: 230px;">
              <el-date-picker
                v-model="searchCondition.invoiceDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item> 
            <el-form-item label="开票状态" prop="invoiceStatus">
              <el-select v-model="searchCondition.invoiceStatus" placeholder="开票状态" clearable>
                <el-option label="已申请" :value="0" />
                <el-option label="开票中" :value="5" />
                <el-option label="已开票" :value="10" />
              </el-select>
            </el-form-item>
							<el-form-item label="　" style="user-select: none;width: 200px;">
                <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchInvoices">搜索</el-button>
                <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
							</el-form-item>
          </el-form>
        </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <el-button v-waves size="medium" icon="el-icon-refresh" @click="searchInvoices('refresh')" />

        <el-button type="primary" style="margin-left:1.5rem" @click="managerInvoiceInfo">管理我的发票信息</el-button>
      </div>
      <el-table v-loading="loading" :data="invoiceList" :fit="true" border highlight-current-row>
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="invoiceNo" label="发票号">
          <template v-slot="scope">
            {{ scope.row.invoiceNo }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="invoiceStatusDesc" label="发票状态" />
        <el-table-column prop="period" label="周期" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="sizes,total, prev, pager, next, jumper"
          :total="totalCount"
          :page-size="pageSize"
          :page-sizes="[10,20, 50, 100]"
          @current-change="handlePageChange"
          @size-change="onsizechange"
        />
      </div>
    </el-card>
    <el-dialog title="我的" :visible.sync="formVisiable" :close-on-click-modal="false">
      <el-form ref="invoinceInfoFrom" :model="invoiceInfo" label-position="top" label-width="60" :rules="rules">
        <el-col :span="7">
          <el-form-item label="发票类型" prop="invoiceType">
            <el-select v-model="invoiceInfo.invoiceType" disabled>
              <el-option label="增值税电子普通发票" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="发票抬头" prop="invoiceTitle">
            <el-input v-model="invoiceInfo.invoiceTitle" placeholder="抬头" disabled />
          </el-form-item>
          <el-form-item label="收票人手机号" prop="ticketPhone">
            <el-input v-model="invoiceInfo.ticketPhone" placeholder="收票人手机号" maxlength="11" show-word-limit />
          </el-form-item>
          <el-form-item label="开户行" prop="openingBank">
            <el-input v-model="invoiceInfo.openingBank" placeholder="开户行" />
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="7">
          <el-form-item label="开票方式" prop="openingMethod">
            <el-radio-group v-model="invoiceInfo.openingMethod" disabled>
              <el-radio :label="1">自动开具</el-radio>
              <el-radio :label="2">手动开具</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票项目" prop="invoiceItem">
            <el-input v-model="invoiceInfo.invoiceItem" placeholder="发票项目" />
          </el-form-item>
          <el-form-item label="收票人邮箱" prop="ticketEmial">
            <el-input v-model="invoiceInfo.ticketEmial" placeholder="收票人邮箱" />
          </el-form-item>
          <el-form-item label="开票方" prop="invoiceFrom">
            <el-select v-model="invoiceInfo.invoiceFrom" disabled>
              <el-option :value="1" label="平台" />
              <el-option :value="2" label="酒店" />
              <el-option :value="3" label="第三方" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="7">
          <el-form-item label="抬头类型" prop="titleType">
            <el-radio-group v-model="invoiceInfo.titleType" disabled>
              <el-radio :label="1">公司</el-radio>
              <el-radio :label="2">个人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="taxpayerNumber">
            <el-input v-model="invoiceInfo.taxpayerNumber" placeholder="纳税人识别号" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="invoiceInfo.address" placeholder="地址" />
          </el-form-item>
          <el-form-item label="开票方" prop="invoiceFromName">
            <el-input v-model="invoiceInfo.invoiceFromName" placeholder="开票方" disabled />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeInvoiceInfo">取消</el-button>
        <el-button type="primary" @click="saveInvoiceInfo('invoinceInfoFrom')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import {
  SaveInvoiceInfo,
  GetInvoiceInfoResponse,
  GetInvoices
} from '@/api/invoice/invoice'
import { deepClone } from '@/utils/index'
export default {
  name: 'Invoice',
  directives: {
    waves
  },
  data() {
    return {
      formVisiable: false,
      searchCondition1: {
        invoiceDate: [],
        invoiceStatus: ''
      },
      searchCondition: {
        invoiceDate: [],
        invoiceStatus: ''
      },
      invoiceList: [],
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      invoiceInfo: {
        invoiceType: 1,
        openingMethod: 2,
        titleType: 2
      },
      InvoiceProduceTypeEnum: {
        ORDER: 1,
        PERIOD: 5
      },
       rules: {
          ticketPhone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
             { min: 11,  message: '手机号长度在11位', trigger: 'blur' }
          ],
          openingBank: [
            { required: true, message: '请输入开户行', trigger: 'blur' }
          ],
            address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          ticketEmial: [
            {required: true, message: '请输入发票人邮箱', trigger: 'blur' }
          ],
        }
      };
    },
  created() {
    this.fetchInvoices()
  },
  methods: {
    fetchInvoiceInfo() {
      GetInvoiceInfoResponse().then((res) => {
        if (res.data) {
          this.invoiceInfo = res.data
        }
      })
    },
    searchInvoices(type) {
      if (type === 'refresh') {
        this.fetchInvoices()
      } else {
        this.searchCondition1 = deepClone(this.searchCondition)
        this.pageIndex = 1
        this.fetchInvoices(true)
      }
    },
    fetchInvoices(tip) {
      this.loading = true
      GetInvoices(this.searchCondition1).then(res => {
        this.invoiceList = res.data.rows
        this.totalCount = res.data.total

        this.loading = false
        if (tip) {
          this.$message('搜索成功')
        }
      })
    },
    saveInvoiceInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
      SaveInvoiceInfo(this.invoiceInfo).then(res => {
        console.log(res);
        if (res.data) {
          this.closeInvoiceInfo()
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          this.$message({
            type: 'info',
            message: '保存失败'
          })
        }
      })
          } else {
            return
          }
        });
    },
    managerInvoiceInfo() {
      this.fetchInvoiceInfo()

      this.formVisiable = true
    },
    closeInvoiceInfo() {
      this.formVisiable = false
      this.resetForm('invoinceInfoFrom')
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchInvoices()
    },
    onsizechange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchInvoices()

    }
  }
}
</script>

<style scoped>
  .content {
    padding: 15px;
  }

  .dialog-footer {
    margin-right: 2.5rem;
  }
	.searchForm>>>.el-form-item {
		width: 130px;
	}
	
	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}
</style>
