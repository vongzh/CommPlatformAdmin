// 发票列表-订单详情
<template>
  <div class="content">
    <!-- 检索区域 -->
    <!-- <el-card>
      <el-form ref="ruleForm" inline label-position="top" label-width="80px" :model="searchCondition">
        <el-form-item label="预定日期" style="width: auto" prop="selectedDate">
          <el-date-picker style="width: 332px" v-model="searchCondition.createTime" type="daterange" align="right"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="searchCondition.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="入住人" prop="checkInName">
          <el-input v-model="searchCondition.checkInName" placeholder="入住人"></el-input>
        </el-form-item>
        <el-form-item class="w150 mt15" prop="platformId" label="采购平台">
          <el-select clearable v-model="searchCondition.platformId" placeholder="请选择">
            <el-option v-for="(p, index) of purchasePlatform" :key="index" :label="p.configName" :value="p.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人" prop="orderLockName">
          <el-input v-model="searchCondition.orderLockName" placeholder="处理人"></el-input>
        </el-form-item>
        <el-form-item class="btn-group">
          <el-button size="small" type="primary" icon="el-icon-search" @click="getInvoiceOrderListByHotelName">搜索
          </el-button>
          <el-button size="small" type="warning" icon="el-icon-close" class="btn-group" @click="resetForm('ruleForm')">
            重置</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->
    <!-- 数据表格 -->
    <el-card class="mt15">
      <!-- <div slot="header" class="clearfix">
        <el-button style="float: right" type="success" @click="examinationPassed">审核通过</el-button>
      </div> -->
      <el-table :data="formData" border style="width: 100%">
        <el-table-column fixed prop="createTime" label="预定日期">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="roomTypeName" label="房型"></el-table-column>
        <el-table-column label="间/夜">
          <template slot-scope="scope">
            {{ scope.row.roomCount }}间/{{
                howDays(scope.row.checkInDate, scope.row.checkOutDate)
            }}夜
          </template>
        </el-table-column>
        <el-table-column label="入离日期" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.checkInDate }}</div>
            <div>{{ scope.row.checkOutDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="订单金额">
          <template slot-scope="scope">￥{{ scope.row.orderAmount }}</template>
        </el-table-column>
        <el-table-column prop="checkInName" label="入住人"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
        <el-table-column label="采购平台">
          <template slot-scope="scope">
            {{ purchasePlatformVal(scope.row.platformId) }}
          </template>
        </el-table-column>
        <el-table-column prop="invoiceStatus" label="发票状态"></el-table-column>
        <el-table-column prop="invoicePerson" label="开票人"></el-table-column>
        <el-table-column prop="invoiceAuditUser" label="审核人"></el-table-column>
        <el-table-column prop="modityTime" label="审核时间"></el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="danger" @click="deleteControl(scope.row)">驳回</el-link>
          </template>
        </el-table-column> -->
        <!-- 分页 -->
        <!-- <el-pagination background hide-on-single-page class="mt10" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="searchCondition.pageIndex"
          :page-sizes="[10, 20, 50, 100]" :page-size="searchCondition.pageSize"
          layout="sizes,total, prev, pager, next, jumper" :total="total">
        </el-pagination> -->
      </el-table>
    </el-card>
    <!-- 驳回弹框 -->
    <!-- <el-dialog title="驳回操作" width="30%" :visible.sync="dialogFormVisible">
      <el-form :model="formReject">
        <el-form-item label="驳回原因" label-width="120px">
          <el-select v-model="formReject.region" placeholder="请选择驳回原因">
            <el-option label="联系信息问题" value="0"></el-option>
            <el-option label="开票信息问题" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因描述" label-width="120px">
          <el-input v-model="formReject.name" type="textarea" :rows="3" placeholder="原因描述内容" maxlength="30"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { GetInvoiceOrderList, AuditInvoiceManage } from "@/api/invoice/invoice";
import { GetPurchasePlatforms } from "@/api/sys/sysconfig";
import { getDays } from "@/utils/validate";
export default {
  name: "InvoiceListDetail",
  data() {
    return {
      // 检索对象
      searchCondition: {
        invoiceManageId: "",
        createTime: {
          item1: "",
          item2: "",
        },
        orderNo: "",
        checkInName: "",
        platformId: "",
        orderLockName: "",
        pageSize: 10,
        pageIndex: 1,
      },
      total: 0,
      // 采购平台
      purchasePlatform: [],
      // 表格数据
      formData: [],
      // 选择的日期
      selectedDate: [],
      dialogFormVisible: false,
      formReject: {},
      orderNos: [],
    };
  },
  methods: {
    // 根据发票查询订单列表
    getInvoiceOrderListByHotelName() {
      this.formData = [];
      this.transactionLoading = true;
      GetInvoiceOrderList(this.searchCondition)
        .then((res) => {
          if (res.result) {
            const { rows, total } = res.data;
            this.formData = rows && rows.length ? rows : [];
            this.total = total;
          } else {
            this.$message.warning(res.message);
          }
          this.transactionLoading = false;
        })
        .catch((err) => {
          this.$message.warning(err);
          this.transactionLoading = false;
        });
    },
    // 获取酒店采购平台信息
    getGetPurchasePlatforms() {
      GetPurchasePlatforms()
        .then((res) => {
          if (res.result) {
            this.purchasePlatform = res.data;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 重置
    resetForm(formName) {
      this.selectedDate = "";
      this.searchCondition.createTime = "";
      this.$refs[formName].resetFields();
      this.getInvoiceOrderListByHotelName();
    },

    // 转换日期差
    howDays(d1,d2) {
      return getDays(d1,d2)
    },
 
    // 初始化订单列表数据
    initialization() {
      if (this.getUrlParams()) {
        this.getInvoiceOrderListByHotelName();
      }
    },
    // 路由参数得到酒店名称
    getUrlParams() {
      const { id } = this.$route.params;
      return (this.searchCondition.invoiceManageId = id);
    },
    // 删除操作
    deleteControl() {
      this.dialogFormVisible = true;
    },
    // 审核通过
    examinationPassed() {
      this.$confirm(
        "审核通过：会将此张发票中关联的订单列表的发票状态由“待审核”全部更新成“已审核”。",
        "提示",
        {
          confirmButtonText: "通过",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const orderNos = this.getOrder();
        AuditInvoiceManage({
          invoiceManageId: this.searchCondition.invoiceManageId,
          orderNos: orderNos,
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
    // 获取所有order
    getOrder() {
      return this.formData.map((item) => item.orderNo);
    },
  },
  watch: {
    selectedDate(newVal) {
      if (newVal) {
        this.searchCondition.createTime = {
          item1: newVal[0],
          item2: newVal[1],
        };
      } else {
        this.searchCondition.createTime = "";
      }
    },
  },
  computed: {
    purchasePlatformVal: function () {
      return function (id) {
        const plat = this.purchasePlatform.find(
          (item) => item.platformId == id
        );
        let platName = plat?.configName || "";
        return platName;
      };
    },
  },
  created() {
    this.initialization();
    this.getGetPurchasePlatforms();
  },
};
</script>

<style scoped>
.btn-group {
  margin-top: 18px;
}

.mt10 {
  margin-top: 10px;
}
</style>