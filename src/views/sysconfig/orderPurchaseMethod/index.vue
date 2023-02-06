<template>
  <div class="content">
    <el-card style="margin-bottom: 10px;" class="search">
      <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
        <el-form-item label="直连商家" prop="configDirectPlatformId">
          <el-select v-model="searchCondition.configDirectPlatformId" clearable>
            <el-option
              v-for="(item,index) in directplatformDict"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置名称" prop="configName">
          <el-input
            v-model="searchCondition.configName"
            placeholder="请输入配置名称"
            class="filter-item input-search"
          />
        </el-form-item>
     
        <el-form-item label="状态" prop="isEffect">
          <el-select v-model="searchCondition.isEffect" clearable>
            <el-option
              v-for="(item,index) in statusDict"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" prop="PurchaseMethodConfigDate" style="width: 230px;">
          <el-date-picker
            v-model="searchCondition.configDates"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width: 230px;"
          />
        </el-form-item>
        <el-form-item label="　" style="width: auto;user-select: none">
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
            @click="resetForm('searchForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" @click="add()" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
        </el-button-group>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        :fit="true"
        border
        stripe
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column
          prop="configDirectPlatformId"
          label="直连商家"
          :formatter="directplatformDictFormatter"
          width="100"
        />
        <el-table-column prop="configName" label="配置名称" width="135" />
        <el-table-column label="配置订单金额范围" width="100">
          <template slot-scope="scope">{{scope.row.configAmountMin}} - {{scope.row.configAmountMax}}</template>
        </el-table-column>

       <el-table-column
          prop="configDataPlatformId"
          label="数据来源平台"
          :formatter="dataPlatformDictFormatter"
          width="100"
        />
         <el-table-column
          prop="configRiskLevel"
          label="风险等级"
          :formatter="riskDictFormatter"
          width="80"
        />
        <el-table-column
          prop="configPurchaseMethod"
          label="接单方式"
          :formatter="purchaseMethodDictFormatter"
          width="80"
        />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              :type="scope.row.isEffect == 1 ? '' : 'danger'"
            >{{statusDictFormatter(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="configStartDate" label="配置起始时间" width="120" />
        <el-table-column prop="configEndDate" label="配置结束时间" width="120" />
        <el-table-column prop="modifyTime" label="编辑时间" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" fixed="right" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editData(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <!-- <el-button icon="el-icon-download" @click="exportOrders(scope.row)">下载</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 0.625rem;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="handlePageChange"
      />
    </div>
    <el-dialog
      :visible.sync="dataVisiable"
      :inline="true"
      width="70%"
      :close-on-click-modal="false"
      @close="closeForm"
    >
      <div slot="title">
        <span>接单方式配置</span>
      </div>
      <el-form label-width="100px" ref="addForm" :model="form" class="addForm" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8">
            
            <el-form-item label="配置名称" prop="configName">
              
              <el-input
                v-model="form.configName"
                placeholder="请输入配置名称"
                maxlength="30"
                show-word-limit
              />
             
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="直连商家" prop="configDirectPlatformId">
              <el-select v-model="form.configDirectPlatformId" clearable>
                <el-option
                  v-for="(item) in directplatformDict"
                    :key="item.dictValue"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据来源平台" prop="configDataPlatformId">
              <el-select v-model="form.configDataPlatformId" placeholder="请选择">
                <el-option
                  v-for="(item) in dataPlatformDict"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="配置描述" prop="configDesc">
              <el-input v-model="form.configDesc" placeholder="请输入任务描述" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否生效" prop="isEffect">
              <el-radio-group v-model="form.isEffect">
                <el-radio :label="1" >有效</el-radio>
                <el-radio :label="0">无效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分流金额下限" prop="configAmountMin">
              <el-input-number
                v-model="form.configAmountMin"
                :min="0"
                :max="form.configAmountMax"
                label="请输入分流金额下限"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分流金额上限" prop="configAmountMax">
              <el-input-number
                v-model="form.configAmountMax"
                :min="form.configAmountMin"
                label="请输入分流金额上限"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接单方式" prop="configPurchaseMethod">
              <el-select v-model="form.configPurchaseMethod" placeholder="请选择">
                <el-option
                  v-for="(item,index) in purchaseMethodDict"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="configStartDate">
              <el-date-picker
                v-model="form.configStartDate"
                type="datetime"
                placeholder="选择时间"
                style="width: 200px;"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsStart"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="configEndDate">
              <el-date-picker
                v-model="form.configEndDate"
                type="datetime"
                placeholder="选择时间"
                style="width: 200px;"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsEnd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
             <el-col :span="24">
            <el-form-item label="订单风险等级" prop="configRiskLevel">
                  <el-radio-group v-model="form.configRiskLevel" >
												<el-radio v-for="item in riskDict" :key="item.dictLabel" :label="item.dictValue"  >
						     	 {{item.dictLabel}} 
												</el-radio>
										</el-radio-group>    
             </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="saveData('addForm')">提交</el-button>
        <el-button size="small" @click="closeForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetOrderPurchaseMethodCongfigs,
  DeleteOrderPurchaseMethod,
  SaveOrderPurchaseMethodConfig,
  CheckPurchaseMthodConfig
} from "@/api/sys/orderPurchaseMethod";
import { GetPurchasePlatForms } from "@/api/sys/dict";
import waves from "@/directive/waves";
import { deepClone } from "@/utils/index";
import moment from "moment";
import { AddOperationLog } from "@/api/sys/log";
import { GetPlatformDict } from "@/api/dict/dict";
export default {
  name: "OrderPurchaseMethod",
  directives: {
    waves
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入配置名称"));
      }
      if (value != this.name) {
        CheckPurchaseMthodConfig({
          configName: value
        }).then(res => {
          if (res.data) {
            callback(new Error("配置名称已存在"));
          } else callback();
        });
      } else {
        callback();
      }
    };
    var checkStartTime = (rule, value, callback) => {
      if (
        new Date(this.form.configEndDate).getTime() -
          new Date(value).getTime() <=
        0
      ) {
        callback(new Error("开始时间不得晚于结束时间"));
      } else callback();
    };
    var checkEndTime = (rule, value, callback) => {
      if (
        new Date(value).getTime() -
          new Date(this.form.configStartDate).getTime() <=
        0
      ) {
        callback(new Error("结束时间不得早于开始时间"));
      } else callback();
    };
    return {
      searchCondition: {
        configDirectPlatformId: "",
        configName: "",
        isEffect: "",
        configDates: [],
        PurchaseMethodConfigDate: ""
      },
      pageSize: 10,
      pageIndex: 1,
      dataList: [],
      dataVisiable: false,
      totalCount: 0,
      data: {},
      loading: false,
      form: {
        id: "",
        configName: "",
        configDirectPlatformId: "",
        configDataPlatformId: "",
        configRiskLevel:[2],
        isEffect: 1,
        configDesc: "",
        configAmountMin: 0,
        configAmountMax: 10000,
        configStartDate: "",
        configEndDate: "",
        configPurchaseMethod: ""
      },

      rules: {
        configName: [
          {
            required: true,
            message: "请输入配置名称",
            trigger: "blur"
          },
          {
            validator: checkName,
            trigger: "blur"
          }
        ],
        configDirectPlatformId: [
          {
            required: true,
            message: "请选择直连商家",
            trigger: "change"
          }
        ],
        configDataPlatformId: [
          {
            required: true,
            message: "请选择订单数据源",
            trigger: "change"
          }
        ],

        configRiskLevel:[
          {
            required:true,
            message:"请设置风险等级",
            trigger:"change"
          }
        ],
        configDesc: [
          {
            required: true,
            message: "请输入任务描述",
            trigger: "blur"
          }
        ],
       
        configPurchaseMethod: [
          {
            required: true,
            message: "请输入接单方式",
            trigger: "change"
          }
        ],
        configStartDate: [
          {
            required: true,
            message: "请选择配置开始时间",
            trigger: "change"
          }
        ],
        configEndDate: [
          {
            required: true,
            message: "请选择配置结束时间",
            trigger: "change"
          }
        ] 
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.form.configEndDate) {
            return time.getTime() >= new Date(this.form.configEndDate).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.form.configStartDate) {
            return (
              time.getTime() <= new Date(this.form.configStartDate).getTime()
            );
          }
        }
      },

      labelDict: [
        {
          dictLabel: "全部",
          dictValue: "0"
        }
      ],
      statusDict: [
        {
          dictLabel: "无效",
          dictValue: "0"
        },
        {
          dictLabel: "有效",
          dictValue: "1"
        }
      ],
        riskDict: [
        {
          dictLabel: "高风险",
          dictValue: 7
        },
        {
          dictLabel: "中高风险",
          dictValue: 6
        },
          {
          dictLabel: "未知风险",
          dictValue: 5
        },
        {
          dictLabel: "中风险",
          dictValue: 4
        },
        {
          dictLabel: "中低风险",
          dictValue: 3
        },
        {
          dictLabel: "低风险",
          dictValue: 2
        },
        {
          dictLabel: "无风险",
          dictValue: 1
        }
      ],
       dataPlatformDict: [
        {
          dictLabel: "携程分销",
          dictValue: 9
        },
        {
          dictLabel: "携程商旅-特牌",
          dictValue: 7
        },
        {
          dictLabel: "同程艺龙分销",
          dictValue: 4
        },
        {
          dictLabel: "美团分销",
          dictValue: 6
        },
          {
          dictLabel: "飞猪分销",
          dictValue: 17
        },
        {
          dictLabel: "艺龙M端",
          dictValue: 70
        },
        {
          dictLabel: "锦江分销",
          dictValue: 110
        }
      ],

       directplatformDict: [
        {
          dictLabel: "51ZhuWeb",
          dictValue: 1
        },
        {
          dictLabel: "美团",
          dictValue: 2
        },
        {
          dictLabel: "51ZhuAPI",
          dictValue: 3
        },
        {
          dictLabel: "携程",
          dictValue: 10
        },
        {
          dictLabel: "艺龙",
          dictValue: 70
        },
        {
          dictLabel: "去哪儿",
          dictValue: 30
        },
        {
          dictLabel: "同程",
          dictValue: 40
        },
        {
          dictLabel: "飞猪",
          dictValue: 5
        },
        {
          dictLabel: "武汉胜意",
          dictValue: 15
        },
        {
          dictLabel: "易沃思",
          dictValue: 16
        }
      ],
      purchaseMethodDict: [
        {
          dictLabel: "系统",
          dictValue: 1
        },
        {
          dictLabel: "人工",
          dictValue: 2
        }
      ],
      isFold: true,
      edit: false
    };
  },
  watch: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchDatas();
      //this.fetchHotelStars()
      this.getPurchasePlatDict();
      this.getDict();
    },
    getDict() {
      GetPlatformDict().then(res => {
        this.directplatformDict = res.data.map(item => {
          return {
            dictLabel: item.platformName,
            dictValue: item.platformId
          };
        });
      });
    },
    // fetchHotelTypes() {
    // 	GetHotelCategoryByCityId().then((res) => {
    // 		this.labelDict = res.data
    // 		console.log(res.data)
    // 	})
    // },
    getPurchasePlatDict() {
      GetPurchasePlatForms().then(res => {
        this.purchasePlatDict = res.data.map(item => {
          return {
            dictLabel: item.configName,
            dictValue: item.id
          };
        });
      });
    },
    fetchHotelStars() {
      GetHotelStar().then(res => {
        this.starDict = res.data.map(item => {
          return {
            dictLabel: item.starName,
            dictValue: item.starLevel
          };
        });
      });
    },
    // fetchHotelBrands() {
    // 	GetHotelBrandByCityId().then((res) => {
    // 		this.brandDict = res.data
    // 		console.log(res.data)
    // 	})
    // },
    directplatformDictFormatter(row, column) {
      let arr = this.directplatformDict.filter(item => {
        return item.dictValue == row.configDirectPlatformId;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
    },
    
     riskDictFormatter(row, column) {
      let arr = this.riskDict.filter(item => {
        return item.dictValue == row.configRiskLevel;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
	},

	  dataPlatformDictFormatter(row, column) {
      let arr = this.dataPlatformDict.filter(item => {
        return item.dictValue == row.configDataPlatformId;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
	},

    statusDictFormatter(row, column) {
      let arr = this.statusDict.filter(item => {
        return item.dictValue == row.isEffect;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
    },
    purchaseMethodDictFormatter(row, column) {
      let arr = this.purchaseMethodDict.filter(item => {
        return item.dictValue == row.configPurchaseMethod;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
    },
    // 	searchDatas() {
    // 		this.searchConditionRequest = this.searchCondition

    // 		this.pageIndex = 1
    // 		this.fetchDatas(true)
    // 	},
    fetchDatas(tip) {
      const param = {
        ...this.searchCondition,
        PurchaseMethodConfigDate: {
          item1: this.searchCondition.configDates
            ? this.searchCondition.configDates[0]
            : "",
          item2: this.searchCondition.configDates
            ? this.searchCondition.configDates[1]
            : ""
        },
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      };
      this.loading = true;

      GetOrderPurchaseMethodCongfigs(param).then(res => {
        this.dataList = res.data.rows;
        this.totalCount = res.data.total;
        
        if (tip) {
          this.$message("搜索成功");
        
        }
        this.loading = false;
      });
    },
    handleDelete(config) {
      const tip = "删除后不能恢复,确定要删除吗?";
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DeleteOrderPurchaseMethod({
          id: config.id
        }).then(res => {
          if (res.result) {
            this.fetchDatas();
            this.$message("删除成功");
          } else {
            this.$message(res.message || "删除失败");
          }
        });
      });
    },
    editData(config) {
      this.dataVisiable = true;
       //console.log(config);
      this.$nextTick(() => {
        this.form = deepClone(config);
        this.name = config.configName;
         
      });
    },
    saveData(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          SaveOrderPurchaseMethodConfig(this.form).then(res => {
            if (res.result) {
              this.dataVisiable = false;
              this.resetForm("addForm");
              this.form.id = "";
              this.fetchDatas();
              this.$message({
                message: "保存成功",
                type: "success"
              });
            } else {
              this.$message.error("保存失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    handlePageChange(index) {
      this.pageIndex = index;
      this.fetchDatas();
    },
    add() {
      this.dataVisiable = true;
      this.$nextTick(() => {
        this.name = "";
        this.resetForm("addForm");
      });
    },
    handleSearch(type) {
      if (type === "refresh") {
        this.fetchDatas();
      } else {
        this.pageIndex = 1;
        this.fetchDatas();
      }
    },
    closeForm() {
      this.resetForm("addForm");
      this.form.id = "";
      this.dataVisiable = false;
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    dateTimeToDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    provinceChange(val) {
      this.cityDict = [];
    },
    changeFold() {
      this.isFold = !this.isFold;
    }
  }
};
</script>

<style scoped>
.content {
  margin: 10px;
}

.dialog-footer {
  text-align: center;
}

.content >>> .el-dialog__body {
  padding: 30px 50px;
}

.search >>> .el-form-item {
  width: 160px;
}

.addForm >>> .el-form-item {
  margin-bottom: 0px !important;
}
</style>
