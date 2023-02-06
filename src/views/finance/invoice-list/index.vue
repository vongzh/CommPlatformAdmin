// 发票列表
<template>
  <div class="content">
    <!-- 检索区域 -->
    <el-card>
      <el-form ref="ruleForm" inline label-position="top" label-width="80px" :model="searchCondition">
        <el-row align="middle">
          <el-col :span="7">
            <el-form-item label="离店日期" prop="selectedDate">
              <el-date-picker style="width: 332px" v-model="selectedDate" type="daterange" align="right"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="发票代码" prop="invoiceCode">
              <el-input v-model="searchCondition.invoiceCode" placeholder="发票代码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="发票号码" prop="invoiceNo">
              <el-input v-model="searchCondition.invoiceNo" placeholder="发票号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="开票单位" prop="invoiceCompany">
              <el-input v-model="searchCondition.invoiceCompany" placeholder="开票单位"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-form-item class="w150" prop="invoiceType" label="发票类型">
              <el-select clearable v-model="searchCondition.invoiceType" placeholder="请选择">
                <el-option key="1" label="增值税专票" :value="1"></el-option>
                <el-option key="2" label="增值税普票" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="供票方式" prop="invoiceSupportWay">
              <el-select clearable placeholder="请选择" v-model="searchCondition.invoiceSupportWay">
                <el-option label="纸质发票" value="2"></el-option>
                <el-option label="电子发票" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="middle" justify="center">
          <el-col :span="3" style="padding-top: 25px">
            <el-form-item label="酒店名称" prop="hotelName">
              <el-input v-model="searchCondition.hotelName" placeholder="酒店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="酒店电话" prop="hotelPhone" style="margin-top: 25px">
              <el-input v-model="searchCondition.hotelPhone" placeholder="酒店电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="发票负责人" prop="invoicePerson" style="margin-top: 25px">
              <el-input v-model="searchCondition.invoicePerson" placeholder="发票负责人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item class="btn-group">
              <el-button size="small" type="primary" icon="el-icon-search" @click="getInvoiceOrderListByHotelName">搜索
              </el-button>
              <el-button size="small" type="warning" icon="el-icon-close" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据表格 -->
    <el-card class="mt15">
      <div slot="header" class="clearfix">
        <el-button size="small" type="primary" @click="exportReport">导出报表</el-button>
        <el-button type="success" size="small" @click="examinationPassed">审核通过</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="transactionLoading" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="invoiceDate" label="开票日期" width="150"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
        <el-table-column prop="invoiceNo" label="发票号码"></el-table-column>
        <el-table-column prop="invoiceCompany" label="开票单位"></el-table-column>
        <el-table-column label="发票类型" width="100">
          <template slot-scope="scope">
            {{ scope.row.invoiceType == 1 ? "增值税专票" : "增值税普票" }}
          </template>
        </el-table-column>
        <el-table-column prop="invoiceSupportWay" label="供票方式"></el-table-column>
        <el-table-column prop="invoiceAmount" label="开具金额"></el-table-column>
        <el-table-column prop="cityName" label="酒店城市"></el-table-column>
        <el-table-column prop="hotelName" label="酒店名称"></el-table-column>
        <el-table-column prop="hotelPhone" label="酒店电话"></el-table-column>
        <el-table-column prop="drawer" label="开票人"></el-table-column>
        <el-table-column label="订单详情">
          <template slot-scope="scope">
            <el-link type="info" @click="orderDetails(scope.row.id)">查看</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="invoicePerson" label="发票负责人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color: red" @click="openRejectModal(scope.row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background hide-on-single-page class="mt10" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="searchCondition.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="searchCondition.pageSize" layout="sizes,total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 驳回弹框 -->
    <el-dialog title="驳回操作" width="30%" :visible.sync="dialogFormVisible">
      <el-form :model="formReject" ref="ruleRjectForm" :rules="ruleRjectForm">
        <el-form-item label="驳回原因" prop="rejectRemark" label-width="120px">
          <el-select v-model="formReject.rejectRemark" placeholder="请选择驳回原因">
            <el-option label="联系信息问题" value="0"></el-option>
            <el-option label="开票信息问题" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因描述" prop="rejectReason" label-width="120px">
          <el-input v-model="formReject.rejectReason" type="textarea" :rows="3" placeholder="原因描述内容" maxlength="30"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleRjectForm')">取 消</el-button>
        <el-button type="primary" @click="rejectControl">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetInvoiceManageList,
  RejectInvoiceManage,
  AuditInvoiceManage
} from "@/api/invoice/invoice";

export default {
  name: "InvoiceList",
  data() {
    return {
      searchCondition: {
        invoiceDate: {
          item1: "",
          item2: "",
        },
        invoiceCode: "",
        invoiceNo: "",
        invoiceCompany: "",
        invoiceType: "",
        invoiceSupportWay: "",
        hotelName: "",
        hotelPhone: "",
        invoicePerson: "",
        pageSize: 10,
        pageIndex: 1,
      },
      tableData: [],
      transactionLoading: false,
      total: 0,
      transactionLoading: false,
      // 选择的日期
      selectedDate: [],
      dialogFormVisible: false,
      // 驳回原因
      formReject: {
        "invoiceManageId": '',
        "orderNo": "",
        "rejectRemark": "",
        "rejectReason": ''
      },
      // 驳回弹框验证规则
      ruleRjectForm: {
        rejectRemark: [
          { required: true, message: '请选择驳回原因', trigger: 'change' }
        ]
      },
      multipleSelection: []
    };
  },
  methods: {
    // 打开驳回弹框
    openRejectModal(data) {
      this.dialogFormVisible = true;
      this.formReject.invoiceManageId = data.id;
      this.formReject.orderNo = data.orderNo;
    },

    // 执行驳回操作
    rejectControl() {
      if (this.formReject.rejectRemark) {
        RejectInvoiceManage(this.formReject).then(res => {
          if (res.result) {
            this.$message.success('驳回成功');
            this.dialogFormVisible = false;
            this.getInvoiceOrderListByHotelName();
          } else {
            this.$message.warning(res.message);
          }
        }).catch(err => this.$message.error(err))
      } else {
        this.$message.warning('缺少驳回原因')
      }
    },

    // 关闭驳回弹框
    handleClose(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },

    // 选择发票项
    handleSelectionChange(selectedOption) {
      this.multipleSelection = selectedOption;
      this.multipleSelectionOrderNo = selectedOption.map((item) => item.orderNo);
    },

    // 审核通过
    examinationPassed() {
      if (!this.multipleSelectionOrderNo.length) {
        this.$message.warning('请选择需要审核项')
        return;
      }
      this.$confirm(
        "审核通过：会将此张发票中关联的订单列表的发票状态由“待审核”全部更新成“已审核”。",
        "提示",
        {
          confirmButtonText: "通过",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        AuditInvoiceManage({
          invoiceManageId: this.searchCondition.invoiceManageId,
          orderNos: this.multipleSelectionOrderNo,
        })
          .then((res) => {
            if (res.result) {
              this.$message.success("审核通过");
              this.getInvoiceOrderListByHotelName();
            } else {
              this.$message.warning(res.message);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }).catch(err => { });
    },

    // 导出报表
    exportReport() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请选择需要导出项')
        return;
      }
      GetInvoiceManageList(this.searchCondition).then((res) => {
        import("@/vendor/Export2Excel")
          .then((excel) => {
            const header = [
              "开票日期",
              "发票代码",
              "发票号码",
              "开票单位",
              "供票方式",
              "开具金额",
              "酒店城市",
              "酒店名称",
              "酒店电话",
              "处理人",
            ];
            const filterVal = [
              "invoiceDate",
              "invoiceCode",
              "invoiceNo",
              "invoiceCompany",
              "invoiceType",
              "invoiceAmount",
              "cityName",
              "hotelName",
              "hotelPhone",
              "invoicePerson",
            ];
            const data = this.formatJson(filterVal, this.multipleSelection);
            excel.export_json_to_excel({
              header,
              data,
              filename: "发票列表",
              autoWidth: true,
              bookType: "xlsx",
            });
          })
          .catch((err) => this.$message.error(err));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 更改每页数据数量
    handleSizeChange(size) {
      this.searchCondition.pageSize = size;
      this.getInvoiceOrderListByHotelName();
    },
    // 更改页码
    handleCurrentChange(current) {
      this.searchCondition.pageIndex = current;
      this.getInvoiceOrderListByHotelName();
    },
    // 发票列表
    getInvoiceOrderListByHotelName() {
      this.tableData = [];
      this.transactionLoading = true;
      GetInvoiceManageList(this.searchCondition)
        .then((res) => {
          if (res.result) {
            const { rows: invoiceList, total } = res.data;
            this.tableData = invoiceList;
            this.total = total;
            this.transactionLoading = false;
          } else {
            this.$message.error(res.message);
          }
          this.transactionLoading = false;
        })
        .catch((err) => {
          this.$message.warning(err);
          this.transactionLoading = false;
        });
    },

    // 更改每页数据数量
    handleSizeChange(size) {
      this.searchCondition.pageSize = size;
      this.getInvoiceOrderListByHotelName();
    },
    // 更改页码
    handleCurrentChange(current) {
      this.searchCondition.pageIndex = current;
      this.getInvoiceOrderListByHotelName();
    },
    // 重置
    resetForm(formName) {
      this.selectedDate = "";
      this.$refs[formName].resetFields();
      this.getInvoiceOrderListByHotelName();
    },
    // 跳转订单列表页
    orderDetails(id) {
      if (!id) return;
      this.$router.push({
        path: `invoice-list/detail/${id}`,
      });
    },
  },
  watch: {
    selectedDate(newVal) {
      if (newVal) {
        this.searchCondition.invoiceDate = {
          item1: newVal[0],
          item2: newVal[1],
        };
      } else {
        this.searchCondition.invoiceDate = "";
      }
    },
  },
  created() {
    this.getInvoiceOrderListByHotelName();
  },
};
</script>

<style scoped>
.btn-group {
  margin-top: 60px;
}
</style>