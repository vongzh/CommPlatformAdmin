// 开票列表
<template>
  <div class="content">
    <!-- 检索条件区域 -->
    <el-card>
      <el-form :inline="true" label-position="top" class="demo-form-inline" :model="ruleForm" :rules="rules"
        ref="ruleForm">
        <el-form-item label="城市" prop="cityName">
          <el-input clearable v-model.trim="ruleForm.cityName" placeholder="城市"></el-input>
        </el-form-item>
        <el-form-item label="酒店名称" prop="hotelName">
          <el-input clearable v-model.trim="ruleForm.hotelName" placeholder="酒店名称"></el-input>
        </el-form-item>
        <el-form-item label="酒店电话" prop="hotelPhone">
          <el-input clearable v-model.trim="ruleForm.hotelPhone" placeholder="酒店电话"></el-input>
        </el-form-item>
        <el-form-item label="锁定人" prop="invoiceLockName">
          <el-input clearable v-model.trim="ruleForm.invoiceLockName" placeholder="锁定人"></el-input>
        </el-form-item>
        <el-form-item style="padding-top: 35px;">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getInvoiceHotelList">搜索</el-button>
          <el-button type="warning" size="small" icon="el-icon-close" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 搜索结果 可开票酒店列表  -->
    <el-card class="mt10">
      <el-table border v-loading="transactionLoading" :data="invoiceList" style="width: 100%">
        <el-table-column prop="cityName" label="所在城市"> </el-table-column>
        <el-table-column label="酒店名称">
          <template slot-scope="scope">
            <el-button @click="jumpContacted(scope.row.hotelName)" type="text" size="small">{{ scope.row.hotelName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="hotelPhone" label="酒店电话"> </el-table-column>
        <el-table-column prop="hotelAddress" label="酒店地址">
        </el-table-column>
        <el-table-column prop="address" label="锁定人"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background hide-on-single-page class="mt10" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="ruleForm.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="ruleForm.pageSize" layout="sizes,total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { InvoiceHotelList } from "@/api/invoice/invoice";
export default {
  name: "MakeOutInvoice",
  data() {
    return {
      // 搜索项
      ruleForm: {
        cityName: "",
        hotelName: "",
        hotelPhone: "",
        invoiceLockName: "",
        pageSize: 10,
        pageIndex: 1,
      },
      // 表单搜索项验证规则
      rules: {
        cityName: [
          { required: false, message: "请输入城市名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 开票列表数据
      invoiceList: [],
      // 分页相关
      currentPage: 1,
      total: 0,

      transactionLoading: false,
    };
  },
  methods: {
    // ***获取开票列表数据***
    getInvoiceHotelList() {
      this.invoiceList = [];
      this.transactionLoading = true;
      InvoiceHotelList(this.ruleForm)
        .then((res) => {
          if (res.result) {
            const { rows: invoiceList, total } = res.data;
            this.invoiceList = invoiceList;
            this.total = total;
            this.transactionLoading = false;
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.$message.warning(err)
        });
    },
    // 更改每页数据数量
    handleSizeChange(size) {
      this.ruleForm.pageSize = size;
      this.getInvoiceHotelList();
    },
    // 更改页码
    handleCurrentChange(current) {
      this.ruleForm.pageIndex = current;
      this.getInvoiceHotelList();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getInvoiceHotelList();
    },
    // 跳转订单列表页
    jumpContacted(hotelName) {
      if (!hotelName) return;
      this.$router.push({
        path: `orderContacted/${hotelName}`,
      });
    },
  },
  created() {
    this.getInvoiceHotelList();
  },
};
</script>
<style scoped>
.content {
  padding: 15px;
}

.el-form-item {
  margin-right: 2rem;
}

.mt10 {
  margin-top: 10px;
}
</style>
