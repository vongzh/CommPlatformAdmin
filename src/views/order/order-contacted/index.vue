// 订单列表-待联系
<template>
  <div class="content">
    <!-- 检索区域 -->
    <el-card>
      <el-form ref="searchCondition" :inline="true" :model="searchCondition" label-position="top" class="searchForm">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="7">
            <el-form-item label="离店日期" prop="selectedDate" class="w332">
              <el-date-picker style="width: 332px" v-model="selectedDate" type="daterange" align="right"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="orderNo" label="订单号">
              <el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="checkInName" label="入住人">
              <el-input v-model="searchCondition.checkInName" clearable placeholder="入住人"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="invoiceContactName" label="联系人">
              <el-input v-model="searchCondition.invoiceContactName" clearable placeholder="联系人"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="invoiceType" label="开票方式">
              <el-select clearable v-model="searchCondition.invoiceType" placeholder="请选择">
                <el-option key="1" label="平台开票" :value="1"></el-option>
                <el-option key="2" label="酒店开票" :value="2"></el-option>
                <el-option key="3" label="供应商开票" :value="3"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="invoiceStatus" label="发票状态">
              <el-select clearable v-model="searchCondition.invoiceStatus" placeholder="请选择">
                <el-option key="1" label="待联系" :value="0"></el-option>
                <el-option key="2" label="待开票" :value="5"></el-option>
                <el-option key="3" label="待审核" :value="10"></el-option>
                <el-option key="4" label="已确认" :value="20"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="isSupportSpecialInvoice" label="发票类型">
              <el-select clearable v-model="searchCondition.isSupportSpecialInvoice" placeholder="请选择">
                <el-option key="1" label="增值税专票" :value="1"></el-option>
                <el-option key="2" label="增值税普票" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" align="bottom" :gutter="20" class="mt10">
          <el-col :span="4">
            <el-form-item prop="invoiceCode" label="发票代码">
              <el-input v-model="searchCondition.invoiceCode" clearable placeholder="发票代码"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="invoiceNo" label="发票号码">
              <el-input v-model="searchCondition.invoiceNo" clearable placeholder="发票号码"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="invoiceCompany" label="开票单位">
              <el-input v-model="searchCondition.invoiceCompany" clearable placeholder="开票单位"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="creater" label="信息录入人">
              <el-input v-model="searchCondition.creater" clearable placeholder="信息录入人"
                class="filter-item input-search" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="purchasePlatformId" label="采购平台">
              <el-select clearable v-model="searchCondition.purchasePlatformId" placeholder="请选择">
                <el-option v-for="(p, index) of purchasePlatform" :key="index" :label="p.configName" :value="p.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="btn-group">
              <el-button size="small" type="primary" icon="el-icon-search" @click="getInvoiceOrderListByHotelName">搜索
              </el-button>
              <el-button size="small" type="warning" icon="el-icon-close" @click="resetForm('searchCondition')">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据表格 -->
    <el-card class="box-card mt15">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="exportReport">导出报表</el-button>
        <!-- <el-button type="primary" @click="contactInformation()"
          >联系人信息录入</el-button
        >
        <el-button type="primary" @click="invoiceInformation()"
          >发票信息录入</el-button
        > -->
        <el-button type="primary" @click="unlockHotel">解锁酒店</el-button>
      </div>
      <el-table size="small" v-loading="transactionLoading" :data="formData" style="width: 100%" max-height="620"
        @selection-change="handleSelectionChange" border>
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column prop="orderCreateTime" label="预定日期" width="150">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="100"></el-table-column>
        <el-table-column prop="roomTypeName" label="房型"></el-table-column>
        <el-table-column label="间/夜">
          <template slot-scope="scope">
            {{ scope.row.roomCount }}间/{{
                getDayNos(scope.row.checkInDate, scope.row.checkOutDate)
            }}夜
          </template>
        </el-table-column>
        <el-table-column label="入离日期" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.checkInDate }}</div>
            <div>{{ scope.row.checkOutDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="97">
          <template slot-scope="scope">
            <el-tag type="warning">￥{{ scope.row.orderAmount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkInName" label="入住人"></el-table-column>
        <el-table-column label="采购平台">
          <template slot-scope="scope">
            {{ purchasePlatformVal(scope.row.platformId) }}
          </template>
        </el-table-column>
        <el-table-column label="开票方式">
          <template slot-scope="scope">
            <div v-if="scope.row.invoiceType == '1'">平台开票</div>
            <div v-else-if="scope.row.invoiceType == '2'">酒店开票</div>
            <div v-else-if="scope.row.invoiceType == '3'">供应商开票</div>
          </template>
        </el-table-column>
        <el-table-column label="发票类型" width="100">
          <template slot-scope="scope">
            {{
                scope.row.isSupportSpecialInvoice == 1
                  ? "增值税专票"
                  : "增值税普票"
            }}
          </template>
        </el-table-column>
        <el-table-column label="发票状态">
          <template slot-scope="scope">
            <div v-if="scope.row.invoiceStatus == '0'">待联系</div>
            <div v-else-if="scope.row.invoiceStatus == '5'">待开票</div>
            <div v-else-if="scope.row.invoiceStatus == '10'">待审核</div>
            <div v-else-if="scope.row.invoiceStatus == '20'">已确认</div>
          </template>
        </el-table-column>
        <el-table-column label="联系人/方式" width="150">
          <template slot-scope="scope">
            {{ scope.row.invoiceContactName }}/{{
                scope.row.invoiceContactPhone
            }}
          </template>
        </el-table-column>
        <el-table-column prop="invoiceCreateTime" label="联系时间" width="150">
        </el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
        <el-table-column prop="invoiceNo" label="发票号码"> </el-table-column>
        <el-table-column prop="invoiceAmount" label="开具金额">
        </el-table-column>
        <el-table-column prop="invoiceCompany" label="开票单位">
        </el-table-column>
        <el-table-column prop="invoiceDate" label="开票日期" width="150"></el-table-column>
        <el-table-column prop="creater" label="信息录入人"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-link @click="contactInformation(scope.row)" type="success" v-if="!scope.row.invoiceStatus">录入联系信息
            </el-link>
            <el-link @click="invoiceInformation(scope.row)" type="primary">录入发票信息</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background hide-on-single-page class="mt10" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="searchCondition.pageIndex" :page-sizes="[10, 20, 50, 100]"
        :page-size="searchCondition.pageSize" layout="sizes,total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 录入联系信息弹框 -->
    <el-dialog title="联系人信息录入" center width="30%" :destroy-on-close="true" :visible.sync="contactInformationVisible">
      <el-form :model="contactInfo" ref="contactInfo" :rules="contactInfoRules">
        <el-form-item label="联系人" prop="invoiceContactName">
          <el-input v-model="contactInfo.invoiceContactName" placeholder="联系人姓名" required></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="invoiceContactPhone">
          <el-input v-model="contactInfo.invoiceContactPhone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="联系内容" prop="invoiceContactContent">
          <el-input type="textarea" :rows="3" placeholder="例子：本次交流的是XX酒店，XX-XX时间段内的订单"
            v-model="contactInfo.invoiceContactContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible('contactInfo')">取 消</el-button>
        <el-button type="primary" @click="confirmEntrant">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 发票信息录入弹框 -->
    <el-dialog title="发票信息录入" center width="40%" :before-close="invoiceDialoghandleClose"
      :visible.sync="invoiceInformationVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form :model="invoiceInformationData" ref="invoiceInformationData" label-position="top" class="invoice-info">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发票类型" prop="isSupportSpecialInvoice">
              <el-select v-model="invoiceInformationData.isSupportSpecialInvoice" clearable placeholder="请选择">
                <el-option label="增值税专票" value="0"></el-option>
                <el-option label="增值税普票" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供票方式" prop="invoiceSupportWay">
              <el-select clearable placeholder="请选择" v-model="invoiceInformationData.invoiceSupportWay">
                <el-option label="纸质发票" value="2"></el-option>
                <el-option label="电子发票" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票代码" prop="invoiceCode">
              <el-input placeholder="发票代码" v-model="invoiceInformationData.invoiceCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号码" prop="invoiceNo">
              <el-input placeholder="发票号码" v-model="invoiceInformationData.invoiceNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开具总金额" prop="invoiceAmount">
              <el-input placeholder="开具总金额" v-model="invoiceInformationData.invoiceAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="税前金额" prop="invoicePreTaxAmount">
              <el-input placeholder="税前金额" v-model="invoiceInformationData.invoicePreTaxAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="税额" prop="invoiceTaxAmount">
              <el-input placeholder="税额" v-model="invoiceInformationData.invoiceTaxAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票日期" prop="invoiceDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="invoiceInformationData.invoiceDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票单位" prop="invoiceCompany">
              <el-input placeholder="开票单位" v-model="invoiceInformationData.invoiceCompany"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人识别号" prop="invoiceCompanyCode">
              <el-input placeholder="纳税人识别号" v-model="invoiceInformationData.invoiceCompanyCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传发票" prop="invoicefFile">
              <el-upload :action="fileApi" list-type="picture-card" :headers="requestHeaders"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="initUpload"
                :on-success="fileUploadSuccess" :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img width="100%" :src="dialogImageUrl" />
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票人" prop="drawer">
              <el-input placeholder="开票人" v-model="invoiceInformationData.drawer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票电话" prop="drawerPhone">
              <el-input placeholder="开票电话" v-model="invoiceInformationData.drawerPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeInvoiceDialog">取 消</el-button>
        <el-button type="primary" @click="determineEntryInvoice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  InvoiceOrderListByHotelName,
  InvoiceContactInfoAdd,
  InvoiceManageAdd,
  UnlockHotel,
  ExportOrderList,
} from "@/api/invoice/invoice";
import { GetPurchasePlatforms } from "@/api/sys/sysconfig";
import { getDays } from '@/utils/validate';
import auth from "@/control/auth";

export default {
  name: "OrderContacted",
  data() {
    return {
      // 检索包装对象
      searchCondition: {
        hotelName: "",
        checkOutDate: "",
        orderNo: "",
        checkInName: "",
        invoiceContactName: "",
        invoiceType: "",
        invoiceStatus: "",
        isSupportSpecialInvoice: "",
        invoiceCompany: "",
        creater: "",
        purchasePlatformId: "",
        pageSize: 10,
        pageIndex: 1,
      },
      // 选择的日期
      selectedDate: [],
      // 日期组件配置项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 表格数据
      tableData: [{}],
      // 录入联系信息弹框状态
      contactInformationVisible: false,
      // 发票信息录入弹框状态
      invoiceInformationVisible: false,
      formLabelWidth: "120px",
      // 采购平台
      purchasePlatform: [],
      // 表格数据
      formData: [],
      total: 0,
      transactionLoading: false,
      orderStatistics: [],
      // 联系信息对象
      contactInfo: {
        orderNos: [],
        invoiceContactName: "",
        invoiceContactPhone: "",
        invoiceContactContent: "",
      },
      // 录入发票信息对象
      invoiceInformationData: {
        orderNos: [],
        isSupportSpecialInvoice: "",
        invoiceSupportWay: "",
        invoiceCode: "",
        invoiceNo: "",
        invoiceAmount: "",
        invoicePreTaxAmount: "",
        invoiceTaxAmount: "",
        invoiceDate: "",
        invoiceCompany: "",
        invoiceCompanyCode: "",
        invoicefFile: "",
        drawer: "",
        drawerPhone: "",
      },
      contactInfoRules: {
        invoiceContactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
        ],
        invoiceContactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      requestHeaders: "",
      selectedOption: [],
      hotelCode: '',
      // 图片上传地址，记得更改为环境路径
      fileApi: process.env.VUE_APP_BASE_API+"/File/Upload?type=invoice",
    };
  },
  methods: {
    // token相关
    initToken() {
      const token = auth.GetClientAuth();
      const customerAuth = auth.GetCustomerAuth();
      const clientToken = auth.GenerateRequestToken();
      this.requestHeaders = {
        Authorization: token.token_type + " " + token.access_token,
        ck: clientToken,
        sid: customerAuth.sessionId,
      };
    },
    // 根据入离时间计算天数
    getDayNos(d1, d2) {
      return getDays(d1, d2)
    },
    // 删除已上传发票信息
    handleRemove() {
      this.invoiceInformationData.invoicefFile = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传提交
    initUpload(file) {
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
    },
    // 上传成功
    fileUploadSuccess(response, file, fileList) {
      this.invoiceInformationData.invoicefFile = response;
      this.$message({
        type: "success",
        message: "已成功上传发票附件",
      });
    },
    // 上传失败
    fileUploadError(err, file, fileList) {
      let code = err.status;
      if (code) {
        switch (code) {
          case 415:
            this.$message("不支持的文件类型");
            break;
          case 410:
            this.$message("上传次数过多，请明天再试");
            break;
          case 500:
            this.$message("上传失败，服务器错误");
            break;
        }
      }
      this.$message(err.message ? err.message : "上传失败");
    },
    // 录入联系信息
    contactInformation(row) {
      if (!row.invoiceStatus) {
        // 状态为待联系能录入
        this.contactInformationVisible = true;
        this.contactInfo.orderNos = [row.orderNo];
      } else {
        this.$message({
          message: "已有联系人，请勿重复添加",
          type: "warning",
        });
      }
    },
    // 确认录入联系人信息
    confirmEntrant() {
      if (!this.contactInfo.invoiceContactName.trim()) {
        this.$message.warning('缺少联系人姓名')
      } else if (!this.contactInfo.invoiceContactPhone.trim()) {
        this.$message.warning('缺少联系电话')
      } else {
        InvoiceContactInfoAdd(this.contactInfo).then((res) => {
          if (res.result) {
            this.contactInformationVisible = false;
            this.$message.success("添加成功");
            this.getInvoiceOrderListByHotelName();
            this.$refs["contactInfo"].resetFields();
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
        }).catch(err => this.$message.error(err.message));
      }
    },
    // 取消录入联系信息
    dialogFormVisible(contactInfo) {
      this.contactInfo.orderNos = [];
      this.$refs[contactInfo].resetFields();
      this.contactInformationVisible = false;
    },
    // 打开录入发票信息
    invoiceInformation(row) {
      if (row.invoiceStatus) {
        this.invoiceInformationVisible = true;
        this.invoiceInformationData.orderNos = [row.orderNo];
      } else {
        this.$message({
          message: "请先录入联系人信息",
          type: "warning",
        });
      }
    },
    // 确认录入发票信息
    determineEntryInvoice() {
      InvoiceManageAdd(this.invoiceInformationData).then((res) => {
        if (res.result) {
          this.$message.success('发票录入成功');
          this.getInvoiceOrderListByHotelName();
          this.closeInvoiceDialog();
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
          this.invoiceInformationVisible = false;
        }
      }).catch(err => this.$message.error(err.message));;
    },
    // 关闭录入发票信息弹窗
    closeInvoiceDialog() {
      this.invoiceInformationVisible = false;
      this.$refs['invoiceInformationData'].resetFields();
    },
    invoiceDialoghandleClose(done) {
      this.$confirm('确认取消录入？')
        .then(_ => {
          this.$refs['invoiceInformationData'].resetFields();
          done();
        })
        .catch(_ => { });
    },
    // 导出报表
    exportReport() {
      if (!this.selectedOption.length) {
        this.$message.warning('请选择需要导出项')
        return;
      }
      ExportOrderList(this.selectedOption).then((res) => {
        if (res.result) {
          import("@/vendor/Export2Excel")
            .then((excel) => {
              const header = [
                "订单号",
                "城市",
                "酒店名称",
                "酒店电话",
                "酒店地址",
                "预定日期",
                "房型名称",
                "间夜",
                "入住日期",
                "离店日期",
                "订单金额",
                "入住人",
                "退款订单号",
                "退款金额",
                "退款状态",
              ];
              const filterVal = [
                "orderNo",
                "cityName",
                "hotelName",
                "hotelPhone",
                "hotelAddress",
                "createTime",
                "roomTypeName",
                "roomCount",
                "checkInDate",
                "checkOutDate",
                "orderAmount",
                "checkInName",
                "refundNo",
                "refundAmount",
                "refundStatus",
              ];
              const data = this.formatJson(filterVal, res.data);
              excel.export_json_to_excel({
                header,
                data,
                filename: "列表数据",
                autoWidth: true,
                bookType: "xlsx",
              });
            })
            .catch((err) => this.$message.error(err));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 复选列表项
    handleSelectionChange(selectedOption) {
      this.selectedOption = selectedOption.map((item) => item.orderNo);
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
    // 根据酒店名称查询订单列表
    getInvoiceOrderListByHotelName() {
      this.formData = [];
      this.transactionLoading = true;
      InvoiceOrderListByHotelName(this.searchCondition)
        .then((res) => {
          if (res.result) {
            const { rows, total } = res.data;
            this.formData = rows && rows.length ? rows : [];
            this.total = total;
            this.hotelCode = rows[0].hotelCode;
          } else {
            this.hotelCode = '';
            this.$message.info(res.message);
          }
          this.transactionLoading = false;
        })
        .catch((err) => {
          this.transactionLoading = false;
          this.$message.error(err);
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
    // 更改日期
    changeDate(e) {
      let arr = Array.from(e);
      this.searchCondition.checkOutDate = {
        item1: arr[0],
        item2: arr[1],
      };
    },
    // 重置
    resetForm(formName) {
      this.selectedDate = "";
      this.searchCondition.checkOutDate = "";
      this.searchCondition.pageIndex = 1;
      this.$refs[formName].resetFields();
      this.getInvoiceOrderListByHotelName();
    },
    // 解锁酒店
    unlockHotel() {
      this.$confirm("确定解锁酒店？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          UnlockHotel({ hotelCode: this.hotelCode }).then((res) => {
            if (res.result) {
              this.$message({
                type: "success",
                message: "解锁成功!",
              });
            } else {
              this.$message.error(err);
            }
          }).catch(err => this.$message.error(err.message));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解锁",
          });
        });
    },
    // 初始化订单列表数据
    initialization() {
      if (this.getUrlParams()) {
        this.getInvoiceOrderListByHotelName();
      }
    },
    // 路由参数得到酒店名称
    getUrlParams() {
      const { hn } = this.$route.params;
      return (this.searchCondition.hotelName = hn);
    },
  },
  watch: {
    selectedDate(newVal) {
      if (newVal) {
        this.searchCondition.checkOutDate = {
          item1: newVal[0],
          item2: newVal[1],
        };
      } else {
        this.searchCondition.checkOutDate = "";
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
  // activated() {
  //   this.initialization();
  //   this.getGetPurchasePlatforms();
  // },
  created() {
    this.initToken();
    this.initialization();
    this.getGetPurchasePlatforms();
  },
};
</script>

<style scoped>
.content {
  padding: 15px;
}

.w150 {
  width: 150px;
}

.w200 {
  width: 200px;
}

.w300 {
  width: 300px;
}

.mt10 {
  margin-top: 10px;
}

.mt15 {
  margin-top: 1.5rem;
}

.invoice-info {
  width: 90%;
  margin: 0 auto;
}
</style>