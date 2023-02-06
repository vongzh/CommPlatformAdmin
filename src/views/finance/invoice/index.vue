<template>
  <div class="content">
    <el-card style="margin-bottom: 10px">
      <el-form
        ref="searchForm"
        :model="searchCondition"
        inline
        label-position="top"
        class="searchForm"
      >
        <el-form-item label="开票日期" prop="invoiceDate" style="width: 230px">
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
          <el-select
            v-model="searchCondition.invoiceStatus"
            placeholder="开票状态"
            clearable
          >
            <el-option label="已申请" :value="0" />
            <el-option label="开票中" :value="5" />
            <el-option label="已开票" :value="10" />
          </el-select>
        </el-form-item>
        <el-form-item label="　" style="user-select: none; width: 200px">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="searchInvoinces"
            >搜索</el-button
          >
          <el-button
            v-waves
            class="filter-item"
            type="warning"
            size="small"
            icon="el-icon-close"
            @click="resetForm('searchForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button
            v-waves
            size="medium"
            icon="el-icon-refresh"
            @click="searchInvoinces('refresh')"
          />
        </el-button-group>
      </div>
      <!-- <div slot="header" class="clearfix">
        <el-button type="primary" @click="managerInvoiceInfo">管理我的发票信息</el-button>
      </div> -->
      <el-table
        v-loading="loading"
        :data="invoiceList"
        :fit="true"
        border
        highlight-current-row
      >
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="invoiceNo" label="发票号">
          <template v-slot="scope">
            {{ scope.row.invoiceNo }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="invoiceStatusDesc" label="发票状态" />
        <el-table-column prop="period" label="周期" />
        <el-table-column label="操作" width="160">
          <template v-slot="scope">
            <el-button
              v-if="scope.row.invoiceStatus === InvoinceStatusEnum.ORIGINAL"
              type="danger"
              size="mini"
              @click="invoiceConfirm(scope.row.invoiceNo)"
              >确认</el-button
            >
            <el-button
              v-if="scope.row.invoiceStatus === InvoinceStatusEnum.CONFIRM"
              type="warning"
              size="mini"
              >开票</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="sizes,total, prev, pager, next, jumper"
          :total="totalCount"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :current-page="pageIndex"
          @current-change="handlePageChange"
          @size-change="onsizechange"
        />
      </div>
    </el-card>
    <el-dialog
      title="我的发票信息"
      :visible.sync="formVisiable"
      :close-on-click-modal="false"
    >
      <el-form
        ref="invoinceInfoFrom"
        :model="invoiceInfo"
        label-position="top"
        label-width="60"
      >
        <el-col :span="7">
          <el-form-item label="发票类型" prop="invoiceType">
            <el-select v-model="invoiceInfo.invoiceType" disabled>
              <el-option label="增值税电子普通发票" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="发票抬头" prop="invoiceTitle">
            <el-input
              v-model="invoiceInfo.invoiceTitle"
              placeholder="抬头"
              disabled
            />
          </el-form-item>
          <el-form-item label="收票人手机号" prop="ticketPhone">
            <el-input
              v-model="invoiceInfo.ticketPhone"
              placeholder="收票人手机号"
            />
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
            <el-input
              v-model="invoiceInfo.invoiceItem"
              placeholder="发票项目"
            />
          </el-form-item>
          <el-form-item label="收票人邮箱" prop="ticketEmial">
            <el-input
              v-model="invoiceInfo.ticketEmial"
              placeholder="收票人邮箱"
            />
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
            <el-input
              v-model="invoiceInfo.taxpayerNumber"
              placeholder="纳税人识别号"
            />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="invoiceInfo.address" placeholder="地址" />
          </el-form-item>
          <el-form-item label="开票方" prop="invoiceFromName">
            <el-input
              v-model="invoiceInfo.invoiceFromName"
              placeholder="开票方"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeInvoiceInfo">取消</el-button>
        <el-button type="primary" @click="saveInvoiceInfo">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves";
import { deepClone } from "@/utils/index";
import {
  SaveInvoiceInfo,
  GetInvoiceInfoResponse,
  GetInvoices,
  InvoiceConfirm,
} from "@/api/invoice/invoice";
export default {
  name: "FinanceInvoice",
  directives: {
    waves,
  },
  data() {
    return {
      formVisiable: false,
      searchCondition: {
        invoiceDate: [],
        invoiceStatus: "",
      },
      searchCondition1: {
        invoiceDate: [],
        invoiceStatus: "",
      },
      invoiceList: [],
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      invoiceInfo: {
        invoiceType: 1,
        openingMethod: 2,
        titleType: 2,
      },
      InvoiceProduceTypeEnum: {
        ORDER: 1,
        PERIOD: 5,
      },
      InvoinceStatusEnum: {
        ORIGINAL: 0,
        CONFIRM: 5,
        DRAWER: 10,
      },
    };
  },
  created() {
    this.fetchInvoices();
  },
  methods: {
    fetchInvoiceInfo() {
      GetInvoiceInfoResponse().then((res) => {
        if (res.data) {
          this.invoiceInfo = res.data;
        }
      });
    },
    searchInvoinces(type) {
      if (type === "refresh") {
        this.fetchInvoices();
      } else {
        this.searchCondition1 = deepClone(this.searchCondition);
        this.pageIndex = 1;
        this.fetchInvoices(true);
      }
    },
    fetchInvoices(tip) {
      this.loading = true;
      const data = {
        ...this.searchCondition1,
        beginDate: this.searchCondition1.invoiceDate[0],
        endDate: this.searchCondition1.invoiceDate[1],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };

      GetInvoices(data).then((res) => {
        this.invoiceList = res.data.rows;
        this.totalCount = res.data.total;

        this.loading = false;
        if (tip) {
          this.$message("搜索成功");
        }
      });
    },
    invoiceConfirm(invoiceNo) {
      InvoiceConfirm(invoiceNo).then((res) => {
        if (res.data) {
          this.fetchInvoices();
          this.$message({
            type: "success",
            message: "确认成功",
          });
        } else {
          this.$message({
            type: "info",
            message: "确认失败",
          });
        }
      });
    },
    onsizechange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.fetchInvoices();
    },
    saveInvoiceInfo() {
      SaveInvoiceInfo(this.invoiceInfo).then((res) => {
        if (res.data) {
          this.closeInvoiceInfo();
          this.$message({
            type: "success",
            message: "保存成功",
          });
        } else {
          this.$message({
            type: "info",
            message: "保存失败",
          });
        }
      });
    },
    managerInvoiceInfo() {
      this.fetchInvoiceInfo();

      this.formVisiable = true;
    },
    closeInvoiceInfo() {
      this.formVisiable = false;
      this.resetForm("invoinceInfoFrom");
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchInvoices();
      this.pageIndex = 1;
    },
    handlePageChange(index) {
      this.pageIndex = index;
      this.fetchInvoices();
    },
  },
};
</script>

<style scoped>
.content {
  padding: 15px;
}

.dialog-footer {
  margin-right: 2.5rem;
}
.searchForm >>> .el-form-item {
  width: 120px;
}

.searchForm >>> .el-range-editor {
  width: 230px !important;
}
</style>
