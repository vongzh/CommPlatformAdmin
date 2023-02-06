<template>
  <div class="content">
    <el-card>
      <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
        <el-form-item label="第三方平台" prop="sourcePlatformId" style="width:200px;">
          <el-select v-model="searchCondition.sourcePlatformId" placeholder="第三方平台" clearable>
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              :key="item.dictValue"
              v-for="item in merchantsDict"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="第三方订单号" prop="thirdOrderNo" style="width: 200px;">
          <el-input
            v-model="searchCondition.thirdOrderNo"
            clearable
            placeholder="第三方订单号"
            class="filter-item input-search"
          />
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input
            v-model="searchCondition.orderNo"
            clearable
            placeholder="订单号"
            class="filter-item input-search"
          />
        </el-form-item>
        <el-form-item label="入住人" prop="checkInName">
          <el-input
            v-model="searchCondition.checkInName"
            clearable
            placeholder="入住人"
            class="filter-item input-search"
          />
        </el-form-item>
        <el-form-item label="入离日期" prop="orderDates" style="width: 230px;">
          <el-date-picker
            v-model="searchCondition.orderDates"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="入住日期"
            end-placeholder="离店日期"
            align="right"
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
        <el-form-item label="退款状态" prop="refundStatus" style="width: 150px;">
          <el-select v-model="searchCondition.refundStatus" clearable>
            <el-option :value="0" label="待审核" />
            <el-option :value="2" label="拒绝退款" />
            <el-option :value="4" label="待退款" />
            <el-option :value="6" label="退款成功" />
            <el-option :value="7" label="退款失败" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="申请日期" style="width: 230px;" prop="refundApplyDates">
          <el-date-picker
            v-model="searchCondition.refundApplyDates"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>-->
        <el-form-item label="预订日期" style="width: 230px;" prop="orderCreateTimes">
          <el-date-picker
            v-model="searchCondition.orderCreateTimes"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>

        <el-form-item label="酒店名称" prop="hotelName" style="width: 200px;">
          <el-input
            v-model="searchCondition.hotelName"
            clearable
            placeholder="酒店名称"
            class="filter-item input-search"
          />
        </el-form-item>
        <el-form-item label="入住人电话" prop="checkInPhone">
          <el-input
            v-model="searchCondition.checkInPhone"
            clearable
            placeholder="入住人电话"
            class="filter-item input-search"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus" style="width:200px;">
          <el-select v-model="searchCondition.orderStatus" clearable>
            <el-option
              v-for="os in OrderStatus"
              :key="os.value"
              :label="os.text"
              :value="os.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="　" style="user-select: none;width: auto;">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="handleSearch()"
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
    <el-card>
      <!-- <div slot="header">
        <el-button type="text" @click="exportOrders">导出列表</el-button>
      </div>-->
      <!-- 			<div class="tools">
				<el-row>
					<el-button-group>
						<el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
					</el-button-group>
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
      </div>-->

      <el-table
        ref="tableDataRef"
        v-loading="tableLoading"
        :data="orders"
        :fit="true"
        stripe
        highlight-current-row
      >
        <el-table-column label="订单号/酒店名称" min-width="8%" v-if="colData[0].istrue">
          <template slot-scope="scope">
            <el-link type="info" @click="goDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link>
            <i
              class="el-icon-document-copy copy"
              v-clipboard:copy="scope.row.orderNo"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            ></i>
            <br />
            {{ scope.row.hotelName }}
          </template>
        </el-table-column>
        <el-table-column label="退款单号" min-width="7%" v-if="colData[1].istrue">
          <template slot-scope="scope">
            <el-col type="info" :underline="false">
              <span style="color:#3c3c3c">{{ scope.row.refundNo }}</span>
            </el-col>
          </template>
        </el-table-column>
        <!-- <el-table-column label="酒店名称" prop="hotelName" min-width="15%" v-if="colData[2].istrue"></el-table-column> -->
        <el-table-column label="入离日期" min-width="4%" v-if="colData[3].istrue">
          <template slot-scope="scope">
            {{ dateTimeToDate(scope.row.checkInDate).substr(5) }}
            <br />
            {{ dateTimeToDate(scope.row.checkOutDate).substr(5) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" min-width="4%" v-if="colData[4].istrue">
          <template slot-scope="scope">¥{{scope.row.orderAmount}}</template>
        </el-table-column>
        <el-table-column prop="checkInName" label="入住人" min-width="5%" v-if="colData[5].istrue" />
        <el-table-column prop="checkInPhone" label="入住人电话" min-width="6%" v-if="colData[6].istrue" />

        <el-table-column prop="platform" label="采购平台" min-width="5%" v-if="colData[7].istrue" />
        <el-table-column prop="customerName" label="客户" min-width="5%" v-if="colData[8].istrue" />
        <!-- <template slot-scope="scope">
            <el-link type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName }}</el-link>
        </template>-->

        <el-table-column
          prop="orderStatusDesc"
          label="订单状态"
          min-width="5%"
          v-if="colData[9].istrue"
        >
          <template slot-scope="scope">
            <!-- <el-tag type="success">{{ scope.row.orderStatusDesc }}</el-tag> -->
            <el-col type="success">{{ scope.row.orderStatusDesc }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" min-width="5%" v-if="colData[10].istrue">
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
              >{{ scope.row.refundStatusDesc }}</el-link>
            </el-popover>
            <el-col v-else style="margin-left:3px">{{ scope.row.refundStatusDesc }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="第三方订单号" min-width="7%">
          <template slot-scope="scope">
            <b>{{ scope.row.thirdOrderNo }}</b>
            <b v-if="scope.row.thirdOrderNo">【{{ getPlatName(scope.row.sourcePlatformId) }}】</b>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderCreatTimeDesc"
          label="预订日期"
          min-width="8%"
          v-if="colData[11].istrue"
        />
        <!-- <el-table-column prop="applyTime" label="申请时间" min-width="11%" v-if="colData[11].istrue" /> -->
        <el-table-column label="操作" fixed="right" min-width="7%" v-if="colData[12].istrue">
          <template slot-scope="scope">
            <el-link style="color:#DF9524" size="mini" @click="goDetail(scope.row.orderNo)">详情</el-link>
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
import { QueryPreSaleOrders } from "@/api/order/order";
import waves from "@/directive/waves";
import moment from "moment";
import { deepClone } from "@/utils/index";
import SearchBlock from "@/components/SearchBlock";
import { GetPlatformDict } from "@/api/dict/dict";
export default {
  name: "PreSalesList",
  directives: {
    waves
  },
  components: {
    SearchBlock
  },
  data() {
    return {
      searchCondition1: {
        refundNo: "",
        refundStatus: "",
        orderDates: [],
        refundApplyDates: [],
        orderCreateTimes: [],
        sourcePlatformId: "",
        orderNo: "",
        hotelName: "",
        orderStatus: "",
        checkInName: "",
        checkInPhone: "",
        thirdOrderNo: ""
      },
      searchCondition: {
        refundNo: "",
        refundStatus: "",
        orderDates: [],
        sourcePlatformId: "",
        refundApplyDates: [],
        orderCreateTimes: [],
        orderNo: "",
        hotelName: "",
        orderStatus: "",
        checkInName: "",
        checkInPhone: "",
        thirdOrderNo: ""
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
          title: "酒店名称",
          istrue: true
        },
        {
          title: "入离日期",
          istrue: true
        },
        {
          title: "订单金额",
          istrue: true
        },
        {
          title: "入住人",
          istrue: true
        },
        {
          title: "入住人电话",
          istrue: true
        },
        {
          title: "订单来源",
          istrue: true
        },
        {
          title: "客户",
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
          title: "预订时间",
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
        "酒店名称",
        "入离日期",
        "订单金额",
        "入住人",
        "入住人电话",
        "订单来源",
        "客户",
        "订单状态",
        "退款状态",
        //"申请时间",
        "预订时间",
        "操作"
      ], //默认全选
      colSelect: [
        "订单号",
        "退款单号",
        "酒店名称",
        "入离日期",
        "订单金额",
        "入住人",
        "入住人电话",
        "订单来源",
        "客户",
        "订单状态",
        "退款状态",
        // "申请时间",
        "预订时间",
        "操作"
      ], //选中
      orders: [],
      tableLoading: false,
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      refundApplyOrderStatus: {
        ORIGINAL: 0,
        PASS: 1,
        REJECT: 2
      },
      OrderStatus: [
        {
          text: "预订失败",
          value: 30
        },
        {
          text: "已取消",
          value: -1
        }
      ],
      date: [],
      merchantsDict: []
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
      this.fetchOrders();
      this.getDict();
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

    fetchOrders(tip) {
      //this.validForm()
      this.tableLoading = true;

      const condition = {
        ...this.searchCondition1,
        checkDate: {
          item1: this.searchCondition1.orderDates
            ? this.searchCondition1.orderDates[0]
            : "",
          item2: this.searchCondition1.orderDates
            ? this.searchCondition1.orderDates[1]
            : ""
        },
        // refundApplyDate: {
        //   item1: this.searchCondition1.refundApplyDates
        //     ? this.searchCondition1.refundApplyDates[0]
        //     : "",
        //   item2: this.searchCondition1.refundApplyDates
        //     ? this.searchCondition1.refundApplyDates[1]
        //     : ""
        // },
        OrderCreateTime: {
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

      QueryPreSaleOrders(condition).then(res => {
        this.totalCount = res.data.total;
        this.orders = res.data.rows;

        this.tableLoading = false;

        if (tip) {
          this.$message("搜索成功");
        }
      });
    },
    handleSearch(type) {
      if (type === "refresh") {
        this.fetchOrders();
      } else {
        this.searchCondition1 = deepClone(this.searchCondition);
        this.pageIndex = 1;
        this.fetchOrders(true);
      }
    },
    handleReset() {
      this.date = [];
      this.$refs["searchForm"].resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.fetchOrders();
    },
    onPageChange(index) {
      this.pageIndex = index;
      this.fetchOrders();
    },
    goDetail(orderNo) {
      this.$router.push({
        path: `/presale/detail/${orderNo}`
      });
    },
    goHotel(hotelCode) {
      this.$router.push({
        path: `/hotel/${hotelCode}`
      });
    },
    dateTimeToDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    changeDate() {
      this.searchCondition.refundApplyDates = this.date;
    },
    getPlatName(sourcePlatformId) {
      var arr = this.merchantsDict.filter(item => {
        return item.dictValue == sourcePlatformId;
      });
      return arr.length > 0 ? arr[0].dictLabel : "未知";
    },
    validForm() {
      var o = this.searchCondition;
      if (
        o.thirdOrderNo == "" &&
        o.orderNo == "" &&
        o.checkInName == "" &&
        o.orderStatus == "" &&
        !(o.orderDates && o.orderDates.length > 0) &&
        !(this.date && this.date.length > 0) &&
        o.hotelName == "" &&
        o.checkInPhone == "" &&
        o.refundNo == "" &&
        o.refundStatus == ""
      ) {
        let year = moment(new Date()).format("YYYY");
        let time = [year + "-01-01", Number(year) + 1 + "-01-01"];
        this.searchCondition.refundApplyDates = time;
        this.searchCondition1.refundApplyDates = time;
      } else {
        this.searchCondition.refundApplyDates = [];
      }
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
.tools-btn {
  margin-top: 10px;
}

.el-form--inline .el-form-item {
  margin-bottom: 0px;
}

.content {
  margin: 10px;
}

.pagination {
  margin-top: 1rem;
}

.content >>> .el-form-item {
  width: 120px;
}

.content >>> .el-range-editor {
  width: 230px !important;
}

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
</style>
