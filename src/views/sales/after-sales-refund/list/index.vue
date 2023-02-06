<template>
  <div class="content">
    <div class="filter-container">
      <el-card>
        <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
          <el-form-item label="订单号" prop="orderNo">
            <el-input
              v-model="searchCondition.orderNo"
              clearable
              placeholder="订单号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="退款单号" prop="refundNo">
            <el-input
              v-model="searchCondition.refundNo"
              clearable
              placeholder="退款单号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="退款类型" prop="refundType">
            <el-select v-model="searchCondition.refundType" clearable>
              <el-option :value="1" label="用户取消" />
              <el-option :value="2" label="预订失败" />
              <el-option :value="3" label="售后退款" />
              <el-option :value="4" label="调账退款" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" prop="OrderStatus">
            <el-select v-model="searchCondition.OrderStatus" clearable>
              <el-option
                v-for="os in orderStatusDict"
                :key="os.value"
                :label="os.text"
                :value="os.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="退款状态" prop="RefundOrderStatus">
            <el-select v-model="searchCondition.RefundOrderStatus" clearable>
              <el-option
                v-for="item in statusDict"
                :value="item.dictValue"
                :label="item.dictLabel"
                :key="item.dictValue"
              />
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="申请日期" prop="requestDates" style="width: 230px;">
            <el-date-picker
              v-model="searchCondition.requestDates"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>-->

          <el-form-item label="第三方平台" prop="sourcePlatformId">
            <el-select v-model="searchCondition.sourcePlatformId" placeholder="第三方平台" clearable>
              <el-option
                :label="item.dictLabel"
                :value="item.dictValue"
                :key="item.dictValue"
                v-for="item in merchantsDict"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="第三方订单号" prop="thirdOrderNo" style="width:130px;">
            <el-input
              v-model="searchCondition.thirdOrderNo"
              clearable
              placeholder="第三方订单号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="预定日期" prop="orderCreateTimes" style="width: 230px;">
            <el-date-picker
              v-model="searchCondition.orderCreateTimes"
              type="daterange"
              :editable="false"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>

          <el-form-item label="　" style="user-select:none;width: 200px;">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="searchRefunds"
            >搜索</el-button>
            <el-button
              v-waves
              class="filter-item"
              type="warning"
              size="small"
              icon="el-icon-close"
              @click="handleReset('searchForm')"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card>
      <div class="tools">
        <el-row>
          <el-button-group>
            <el-button
              v-waves
              size="medium"
              icon="el-icon-refresh"
              @click="searchRefunds('refresh')"
            />
          </el-button-group>
          <el-button
            type="text"
            size="medium"
            @click="exportRefundOrders"
            style="font-size:14px;float:right"
          >导出列表</el-button>
          <el-popover placement="top" width="400" trigger="click">
            <el-col :span="24">
              <el-checkbox-group v-model="colOptions">
                <el-col :span="8" v-for="item in colSelect" :label="item" :key="item">
                  <el-checkbox :label="item">{{item}}</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-col>
            <el-button slot="reference">设置</el-button>
          </el-popover>
        </el-row>
      </div>

      <el-table
        ref="tableDataRef"
        v-loading="loading"
        :fit="true"
        border
        stripe
        highlight-current-row
        :data="applyRefunds"
      >
        <el-table-column label="订单号" min-width="7%" v-if="colData[0].istrue">
          <template slot-scope="scope">
            <el-link type="info" @click="goOrder(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link>
            <i
              class="el-icon-document-copy copy"
              v-clipboard:copy="scope.row.orderNo"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="refundNo" label="退款单号" min-width="7%" v-if="colData[1].istrue" />
        <el-table-column prop="refundAmount" label="退款金额" min-width="7%" v-if="colData[2].istrue" />
        <el-table-column
          prop="refundReasonDesc"
          label="退款原因"
          min-width="9%"
          v-if="colData[3].istrue"
        />
        <el-table-column
          prop="refundTypeDesc"
          label="退款类型"
          min-width="7%"
          v-if="colData[4].istrue"
        />
        <el-table-column prop="refundDesc" label="问题描述" min-width="11%" v-if="colData[5].istrue">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.refundDesc"
            >
              <el-link slot="reference" style="margin-left:3px">{{ scope.row.refundDesc|ellipsis }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatucDesc"
          label="订单状态"
          min-width="6%"
          v-if="colData[6].istrue"
        ></el-table-column>
        <el-table-column label="退款状态" width="120" min-width="7" v-if="colData[7].istrue">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.refundStatus === refundApplyOrderStatus.REJECT"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.auditDesc"
            >
              <el-link
                slot="reference"
                type="warning"
                style="margin-left:3px"
              >{{ getStatus(scope.row.refundStatus) }}</el-link>
            </el-popover>
            <el-col v-else style="margin-left:3px">{{ getStatus(scope.row.refundStatus) }}</el-col>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="applyTime" label="申请时间" min-width="13%" v-if="colData[7].istrue" /> -->
        <el-table-column
          prop="orderCreateTime"
          label="预订日期"
          min-width="13%"
          v-if="colData[8].istrue"
        />
        <el-table-column
          prop="auditTime"
          label="审核时间"
          width="180"
          min-width="13%"
          v-if="colData[9].istrue"
        />

        <el-table-column v-if="colData[10].istrue" label="第三方订单号" min-width="13%">
          <template slot-scope="scope">
            <b>{{ scope.row.thirdOrderNo }}</b>
            <b v-if="scope.row.thirdOrderNo">【{{ getPlatName(scope.row.sourcePlatformId) }}】</b>
          </template>
        </el-table-column>
        <!-- <el-table-column label="处理进度" width="100">
          <template slot-scope="scope">
            <el-tag effect="plain">{{ scope.row.auditStatusDesc }}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" min-width="12%" v-if="colData[11].istrue">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.refundStatus === refundApplyOrderStatus.WAITAUDIT"
              v-permission="['RefundConfirm']"
              type="success"
              size="mini"
              class="btn-opt"
              @click="confirmRefund(scope.row.refundNo)"
            >通过</el-button>
            <el-button
              v-if="scope.row.refundStatus === refundApplyOrderStatus.WAITAUDIT"
              v-permission="['RefundReject']"
              type="danger"
              size="mini"
              class="btn-opt"
              @click="rejectRefund(scope.row.refundNo)"
            >驳回</el-button>
            <!-- <el-button
              v-if="scope.row.refundStatus === refundApplyOrderStatus.AUDITPASS || scope.row.refundStatus === refundApplyOrderStatus.WAITREFUND"
              type="danger"
              size="mini"
              class="btn-opt"
              @click="tradeRefund(scope.row.refundNo)"
            >退款</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="sizes,total, prev, pager, next, jumper"
          :total="totalCount"
          :page-size="pageSize"
          :page-sizes="[10,20, 50, 100]"
          :current-page="pageIndex"
          @current-change="onPageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  GetRefundApplys,
  ConfirmRefund,
  RejectRefund,
  RefundTrade
} from "@/api/refund/refund";
import { GetPlatformDict } from "@/api/dict/dict";
import waves from "@/directive/waves";
import permission from "@/directive/permission";

import { AddOperationLog } from "@/api/sys/log";
import { deepClone } from "@/utils/index";
export default {
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      }
      return value;
    }
  },
  name: "AfterSalesRefundList",
  directives: {
    waves,
    permission
  },
  data() {
    return {
      searchCondition1: {
        requestDates: [],
        orderNo: "",
        thirdOrderNo: "",
        refundNo: "",
        OrderStatus: "",
        RefundOrderStatus: "",
        refundType: "",
        orderCreateTimes: [],
        sourcePlatformId: ""
      },
      searchCondition: {
        requestDates: [],
        orderNo: "",
        thirdOrderNo: "",
        refundNo: "",
        OrderStatus: "",
        RefundOrderStatus: "",
        refundType: "",
        orderCreateTimes: [],
        sourcePlatformId: ""
      },
      colData: [
        {
          title: "订单号",
          istrue: true
        },
        {
          title: "退款单号",
          istrue: true
        },
        {
          title: "退款金额",
          istrue: true
        },
        {
          title: "退款原因",
          istrue: true
        },
        {
          title: "退款类型",
          istrue: true
        },
        {
          title: "问题描述",
          istrue: true
        },
        {
          title: "订单状态",
          istrue: true
        },
        {
          title: "退款状态",
          istrue: true
        },
        // {
        //   title: "申请时间",
        //   istrue: true
        // },
        {
          title: "预订日期",
          istrue: true
        },
        {
          title: "审核时间",
          istrue: true
        },
        {
          title: "第三方订单号",
          istrue: true
        },

        {
          title: "操作",
          istrue: true
        }
      ],
      colOptions: [
        "订单号",
        "退款单号",
        "退款金额",
        "退款原因",
        "退款类型",
		"问题描述",
		"订单状态",
        "退款状态",
        //"申请时间",
        "预订日期",
        "审核时间",
        "第三方订单号",
        "操作"
      ], //默认全选
      colSelect: [
        "订单号",
        "退款单号",
        "退款金额",
        "退款原因",
        "退款类型",
		"问题描述",
		"订单状态",
        "退款状态",
        //"申请时间",
        "预订日期",
        "审核时间",
        "第三方订单号",
        "操作"
      ], //选中
      applyRefunds: [],
      merchantsDict: [],
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      refundApplyOrderStatus: {
        WAITAUDIT: 0,
        REJECT: 2,
        WAITREFUND: 4,
        REFUNDING: 5,
        REFUNDSUCCESS: 6,
        REFUNDFAIL: 7,
        CLOSE: -1
      },
      loading: false,
      orderStatusDict: [
        {
          text: "预订成功",
          value: 25
        },
        {
          text: "预订失败",
          value: 30
        },
        {
          text: "已消费",
          value: 35
        },
        {
          text: "已消费退款",
          value: 40
        },
        {
          text: "已取消",
          value: -1
        }
      ],
      statusDict: [
        {
          dictLabel: "待审核",
          dictValue: "0"
        },
        {
          dictLabel: "拒绝退款",
          dictValue: "2"
        },
        {
          dictLabel: "待退款",
          dictValue: "4"
        },
        {
          dictLabel: "退款成功",
          dictValue: "6"
        },
        {
          dictLabel: "退款失败",
          dictValue: "7"
        }
      ]
    };
  },
  watch: {
    colOptions(valArr) {
      var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0); // 未选中
      this.colData.filter(i => {
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        }
      });
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchRefunds();
      this.getDict();
    },
    getPlatName(platformId) {
      let arr = this.merchantsDict.filter(item => {
        return item.dictValue == platformId;
      });
      return arr.length > 0 ? arr[0].dictLabel : "未知";
    },
    getDict() {
      GetPlatformDict().then(res => {
        this.merchantsDict = res.data.map(item => {
          return {
            dictLabel: item.platformName,
            dictValue: item.platformId
          };
        });
      });
    },

    getStatus(status) {
      let arr = this.statusDict.filter(item => {
        return item.dictValue == status;
      });
      return arr.length > 0 ? arr[0].dictLabel : "";
    },

    searchRefunds(type) {
      if (type === "refresh") {
        this.fetchRefunds();
      } else {
        this.searchCondition1 = deepClone(this.searchCondition);
        this.pageIndex = 1;
        this.fetchRefunds(true);
      }
    },
    fetchRefunds(tip) {
      this.loading = true;
      const param = {
        ...this.searchCondition1,
        requestDate: {
          item1: this.searchCondition1.requestDates
            ? this.searchCondition1.requestDates[0]
            : "",
          item2: this.searchCondition1.requestDates
            ? this.searchCondition1.requestDates[1]
            : ""
        },
        orderCreateTime: {
          item1: this.searchCondition1.orderCreateTimes
            ? this.searchCondition1.orderCreateTimes[0]
            : "",
          item2: this.searchCondition1.orderCreateTimes
            ? this.searchCondition1.orderCreateTimes[1]
            : ""
        },
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      };
      GetRefundApplys(param).then(res => {
        console.log(res);
        this.applyRefunds = res.data.rows;

        this.totalCount = res.data.total;
        this.loading = false;
        if (tip) {
          this.$message("搜索成功");
        }
      });
    },
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    confirmRefund(refundNo) {
      this.$confirm("确定要通过退款申请吗？", "退款确认提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "正在提交",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          ConfirmRefund(refundNo).then(res => {
            loading.close();

            if (res.data) {
              this.fetchRefunds();
              this.$message({
                type: "success",
                message: "退款审核完成"
              });
            } else {
              this.$message({
                type: "error",
                message: "退款审核失败"
              });
            }
          });
        })
        .catch(action => {});
    },
    rejectRefund(refundNo) {
      this.$prompt("请输入拒绝原因", "退款驳回提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPattern: /^.{0,200}$/,
        inputErrorMessage: "驳回原因长度应在200位以内"
      })
        .then(({ value }) => {
          const loading = this.$loading({
            lock: true,
            text: "正在提交",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          RejectRefund(refundNo, value).then(res => {
            loading.close();

            if (res.data) {
              this.fetchRefunds();
              this.$message({
                type: "success",
                message: "退款审核完成"
              });
            } else {
              this.$message({
                type: "error",
                message: "退款审核失败"
              });
            }
          });
        })
        .catch(action => {});
    },
    tradeRefund(refundNo) {
      this.$confirm("退款后不可撤回，确定要通过退款吗？", "退款确认提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "退款",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "正在处理退款",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          RefundTrade(refundNo).then(res => {
            loading.close();

            if (res.data) {
              this.fetchRefunds();
              this.$message({
                type: "success",
                message: "发起退款申请成功"
              });
            } else {
              this.$message({
                type: "error",
                message: "发起退款申请失败"
              });
            }
          });
        })
        .catch(action => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.fetchRefunds();
    },
    onPageChange(index) {
      this.pageIndex = index;
      this.fetchRefunds();
    },
    goOrder(orderNo) {
      this.$router.push({
        path: `/allorder/${orderNo}`
      });
    },
    exportRefundOrders() {
      const param = {
        ...this.searchCondition,
        requestDate: {
          item1: this.searchCondition.requestDates[0],
          item2: this.searchCondition.requestDates[1]
        },
        PageSize: 10000,
        PageIndex: 1
      };
      GetRefundApplys(param).then(res => {
        const orders = res.data.rows;
        import("@/vendor/Export2Excel").then(excel => {
          const filterVal = [
            "refundNo",
            "orderNo",
            "refundAmount",
            "refundReasonDesc",
            "refundTypeDesc",
            "refundDesc",
            "applyTime",
            "refundStatusDesc",
            "auditStatusDesc"
          ];
          const data = this.formatJson(filterVal, orders);
          excel.export_json_to_excel({
            header: [
              "退款单号",
              "订单号",
              "退款金额",
              "退款原因",
              "退款类型",
              "问题描述",
              "申请时间",
              "退款状态",
              "处理进度"
            ],
            data: data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          });
        });
        AddOperationLog("EXPORT_REFUNDORDER", JSON.stringify(param));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    copySuccess() {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    copyError() {
      this.$message({
        message: "复制失败",
        type: "warning"
      });
    }
  }
};
</script>

<style scoped>
.copy {
  font-size: 12px;
  border: 1px solid #ccc;
  padding: 3px;
  margin-left: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.copy:hover {
  border: 1px solid #006699;
}
.content {
  margin: 10px;
}

.pagination {
  margin: 0.625rem;
}

.refund-header .el-row {
  font-size: small;
  line-height: 1.5rem;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
}

.content >>> .el-form-item {
  width: 120px;
}

.content >>> .el-range-editor {
  width: 230px !important;
}
</style>
