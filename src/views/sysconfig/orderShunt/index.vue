<template>
  <div class="content">
    <el-card style="margin-bottom: 10px;" class="search">
      <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
        <el-form-item label="直连商家" prop="directPlatformId">
          <el-select v-model="searchCondition.directPlatformId" clearable>
            <el-option
              v-for="(item,index) in merchantsDict"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划任务名称" prop="shuntConfigName">
          <el-input
            v-model="searchCondition.shuntConfigName"
            placeholder="请输入计划任务名称"
            class="filter-item input-search"
          />
        </el-form-item>
        <el-form-item label="采购平台" prop="purchaseConfigId">
          <el-select v-model="searchCondition.purchaseConfigId" clearable>
            <el-option
              v-for="(item,index) in purchasePlatDict"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
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
        <el-form-item label="起止时间" prop="shuntConfigDates" style="width: 230px;">
          <el-date-picker
            v-model="searchCondition.shuntConfigDates"
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
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column
          prop="directPlatformId"
          label="直连商家"
          :formatter="merchantsDictFormatter"
          width="90"
        />
        <el-table-column prop="shuntConfigName" label="计划任务名称" />
        <el-table-column label="分流金额" width="90">
          <template slot-scope="scope">{{scope.row.shuntAmountMin}} - {{scope.row.shuntAmountMax}}</template>
        </el-table-column>

       <el-table-column
          prop="dataPlatformId"
          label="数据来源平台"
          :formatter="dataPlatformDictFormatter"
          width="140"
        />

        <el-table-column
          prop="purchaseConfigId"
          label="采购平台"
          :formatter="purchasePlatDictFormatter"
          width="140"
        />
        <el-table-column
          prop="lastPurchaseMethod"
          label="最终采购方式"
          :formatter="purchaseMethodDictFormatter"
          width="100"
        />
        <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              :type="scope.row.isEffect == 1 ? '' : 'danger'"
            >{{statusDictFormatter(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shuntStartDate" label="计划任务起始时间" width="150" />
        <el-table-column prop="shuntEndDate" label="计划任务结束时间" width="150" />
        <el-table-column prop="modifyTime" label="编辑时间" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" fixed="right">
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
        <span>订单分流配置</span>
      </div>
      <el-form label-width="100px" ref="addForm" :model="form" class="addForm" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="任务名称" prop="shuntConfigName">
              <el-input
                v-model="form.shuntConfigName"
                placeholder="请输入任务名称"
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="直连商家" prop="directPlatformId">
              <el-select v-model="form.directPlatformId" clearable>
                <el-option
                  v-for="(item,index) in merchantsDict"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据来源平台" prop="dataPlatformId">
              <el-select v-model="form.dataPlatformId" placeholder="请选择">
                <el-option
                  v-for="(item,index) in dataPlatformDict"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="任务描述" prop="shuntConfigDesc">
              <el-input v-model="form.shuntConfigDesc" placeholder="请输入任务描述" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否生效" prop="isEffect">
              <el-radio-group v-model="form.isEffect">
                <el-radio :label="1">有效</el-radio>
                <el-radio :label="0">无效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="酒店配置">
              <div
                :class=" isFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up' "
                @click="changeFold"
                style="cursor: pointer;"
              ></div>
            </el-form-item>
          </el-col>
          <div v-show="!isFold">
            <el-col :span="8">
              <el-form-item label="星级" prop="hotelStar">
                <el-select v-model="form.hotelStar" clearable>
                  <el-option
                    v-for="(item,index) in starDict"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省份" prop="hotelProvince">
                <el-select v-model="form.hotelProvince" clearable>
                  <el-option
                    v-for="(item,index) in provinceDict"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                    @change="provinceChange"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="城市" prop="hotelCity">
                <el-select v-model="form.hotelCity" clearable>
                  <el-option
                    v-for="(item,index) in cityDict"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌" prop="hotelBrand">
                <el-select v-model="form.hotelBrand" clearable>
                  <el-option
                    v-for="(item,index) in brandDict"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签" prop="hotelTag">
                <el-select v-model="form.hotelTag" clearable>
                  <el-option
                    v-for="(item,index) in labelDict"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物理酒店ID" prop="hotelId">
                <el-input v-model="form.hotelId" placeholder="请输入物理酒店ID(以英文逗号分割)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物理房型ID" prop="roomTypeId">
                <el-input v-model="form.roomTypeId" placeholder="请输入物理房型ID(以英文逗号分割)" />
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="8">
            <el-form-item label="分流金额下限" prop="shuntAmountMin">
              <el-input-number
                v-model="form.shuntAmountMin"
                :min="0"
                :max="form.shuntAmountMax"
                label="请输入分流金额下限"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分流金额上限" prop="shuntAmountMax">
              <el-input-number
                v-model="form.shuntAmountMax"
                :min="form.shuntAmountMin"
                label="请输入分流金额上限"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最终采购方式" prop="lastPurchaseMethod">
              <el-select v-model="form.lastPurchaseMethod" placeholder="请选择">
                <el-option
                  v-for="(item,index) in purchaseMethodDict"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购平台" prop="purchaseConfigId">
              <el-select v-model="form.purchaseConfigId" placeholder="请选择">
                <el-option
                  v-for="(item,index) in purchasePlatDict"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间" prop="shuntStartDate">
              <el-date-picker
                v-model="form.shuntStartDate"
                type="datetime"
                placeholder="选择时间"
                style="width: 200px;"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsStart"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="shuntEndDate">
              <el-date-picker
                v-model="form.shuntEndDate"
                type="datetime"
                placeholder="选择时间"
                style="width: 200px;"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsEnd"
              ></el-date-picker>
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
  GetOrderShunts,
  DeleteOrderShunt,
  OrderShunt,
  CheckOrderShunt
} from "@/api/sys/orderShunt";
import { GetPurchasePlatForms } from "@/api/sys/dict";
import waves from "@/directive/waves";
import { deepClone } from "@/utils/index";
import moment from "moment";
import { AddOperationLog } from "@/api/sys/log";
import {
  GetHotelCategoryByCityId,
  GetHotelStar,
  GetHotelBrandByCityId
} from "@/api/hotel/hotel";
import { GetPlatformDict } from "@/api/dict/dict";
export default {
  name: "OrderShunt",
  directives: {
    waves
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入任务名称"));
      }
      if (value != this.name) {
        CheckOrderShunt({
          orderShuntConfigName: value
        }).then(res => {
          if (res.data) {
            callback(new Error("名称已存在"));
          } else callback();
        });
      } else {
        callback();
      }
    };
    var checkStartTime = (rule, value, callback) => {
      if (
        new Date(this.form.shuntEndDate).getTime() -
          new Date(value).getTime() <=
        0
      ) {
        callback(new Error("开始时间不得晚于结束时间"));
      } else callback();
    };
    var checkEndTime = (rule, value, callback) => {
      if (
        new Date(value).getTime() -
          new Date(this.form.shuntStartDate).getTime() <=
        0
      ) {
        callback(new Error("结束时间不得早于开始时间"));
      } else callback();
    };
    return {
      searchCondition: {
        derectPlatformId: "",
        shuntConfigName: "",
        purchaseConfigId: "",
        isEffect: "",
        shuntConfigDates: [],
        shuntConfigDate: ""
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
        shuntConfigName: "",
        directPlatformId: "",
        dataPlatformId: "",
        isEffect: 1,
        shuntConfigDesc: "",
        hotelStar: "0",
        hotelProvince: "0",
        hotelCity: "0",
        hotelBrand: "0",
        hotelTag: "0",
        hotelId: "",
        roomTypeId: "",
        shuntAmountMin: 0,
        shuntAmountMax: 10000,
        shuntStartDate: "",
        shuntEndDate: "",
        purchaseConfigId: "",
        lastPurchaseMethod: ""
      },

      rules: {
        shuntConfigName: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: "blur"
          },
          {
            validator: checkName,
            trigger: "blur"
          }
        ],
        directPlatformId: [
          {
            required: true,
            message: "请选择直连商家",
            trigger: "change"
          }
        ],
        dataPlatformId: [
          {
            required: true,
            message: "请选择数据源",
            trigger: "change"
          }
        ],
        shuntConfigDesc: [
          {
            required: true,
            message: "请输入任务描述",
            trigger: "blur"
          }
        ],
        // hotelStar: [{
        // 	required: true,
        // 	message: '请选择星级',
        // 	trigger: 'change'
        // }],
        // hotelProvince: [{
        // 	required: true,
        // 	message: '请选择省份',
        // 	trigger: 'change'
        // }],
        // hotelCity: [{
        // 	required: true,
        // 	message: '请选择城市',
        // 	trigger: 'change'
        // }],
        // hotelBrand: [{
        // 	required: true,
        // 	message: '请选择品牌',
        // 	trigger: 'change'
        // }],
        // hotelTag: [{
        // 	required: true,
        // 	message: '请选择标签',
        // 	trigger: 'change'
        // }],
        hotelId: [
          {
            required: false,
            message: "请输入酒店ID",
            trigger: "blur"
          },
          {
            pattern: /^(([0-9]+)(\,*))+$/,
            message: "ID请以英文逗号分割",
            trigger: "blur"
          }
        ],
        roomTypeId: [
          {
            required: false,
            message: "请输入房型ID",
            trigger: "blur"
          },
          {
            pattern: /^(([0-9]+)(\,*))+$/,
            message: "ID请以英文逗号分割",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个类型",
            trigger: "change"
          }
        ],
        shuntAmountMin: [
          {
            required: true,
            message: "请输入溢价率",
            trigger: "change"
          }
        ],
        shuntAmountMax: [
          {
            required: true,
            message: "请输入溢价金额",
            trigger: "change"
          }
        ],
        inventory: [
          {
            required: true,
            message: "请输入库存",
            trigger: "change"
          }
        ],
        lastPurchaseMethod: [
          {
            required: true,
            message: "请输入最终采购方式",
            trigger: "change"
          }
        ],
        shuntStartDate: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        shuntEndDate: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        purchaseConfigId: [
          {
            required: true,
            message: "请选择采购平台",
            trigger: "change"
          }
        ]
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.form.shuntEndDate) {
            return time.getTime() >= new Date(this.form.shuntEndDate).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.form.shuntStartDate) {
            return (
              time.getTime() <= new Date(this.form.shuntStartDate).getTime()
            );
          }
        }
      },
      starDict: [
        {
          dictLabel: "全部",
          dictValue: "0"
        }
      ],
      provinceDict: [
        {
          dictLabel: "全部",
          dictValue: "0"
        }
      ],
      cityDict: [
        {
          dictLabel: "全部",
          dictValue: "0"
        }
      ],
      brandDict: [
        {
          dictLabel: "全部",
          dictValue: "0"
        }
      ],
      labelDict: [
        {
          dictLabel: "全部",
          dictValue: "0"
        }
      ],
      purchasePlatDict: [
        {
          dictLabel: "美团分销",
          dictValue: 6
        },
        {
          dictLabel: "携程商旅",
          dictValue: 7
        },
        {
          dictLabel: "携程代订",
          dictValue: 8
        },
        {
          dictLabel: "携程分销",
          dictValue: 9
        },
        {
          dictLabel: "快跑",
          dictValue: 12
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

      merchantsDict: [
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
        this.merchantsDict = res.data.map(item => {
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
        console.log(this.purchasePlatDict);
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
    merchantsDictFormatter(row, column) {
      let arr = this.merchantsDict.filter(item => {
        return item.dictValue == row.directPlatformId;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
    },
    purchasePlatDictFormatter(row, column) {
      let arr = this.purchasePlatDict.filter(item => {
        return item.dictValue == row.purchaseConfigId;
      });
      if (arr.length > 0) return arr[0].dictLabel;
      else return "";
	},
	  dataPlatformDictFormatter(row, column) {
      let arr = this.dataPlatformDict.filter(item => {
        return item.dictValue == row.dataPlatformId;
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
        return item.dictValue == row.lastPurchaseMethod;
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
        shuntConfigDate: {
          item1: this.searchCondition.shuntConfigDates
            ? this.searchCondition.shuntConfigDates[0]
            : "",
          item2: this.searchCondition.shuntConfigDates
            ? this.searchCondition.shuntConfigDates[1]
            : ""
        },
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      };
      this.loading = true;

      GetOrderShunts(param).then(res => {
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
        DeleteOrderShunt({
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
      this.$nextTick(() => {
        this.form = deepClone(config);
        this.name = config.shuntConfigName;
      });
    },
    saveData(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          OrderShunt(this.form).then(res => {
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
    exportQuotes() {
      const condition = {
        ...this.searchCondition,
        orderDate: {
          item1: this.searchCondition.orderDates[0],
          item2: this.searchCondition.orderDates[1]
        },
        PageSize: 10000,
        PageIndex: this.pageIndex
      };
      GetOrderShunts(condition).then(res => {
        const orders = res.data.rows;
        import("@/vendor/Export2Excel").then(excel => {
          const filterVal = [
            "merchants",
            "purchasePlat",
            "hotelId",
            "hotelName",
            "province",
            "city",
            "roomId",
            "roomName",
            "taskName",
            "ratio",
            "amount"
          ];
          const data = this.formatJson(filterVal, orders);

          excel.export_json_to_excel({
            header: [
              "直连商家",
              "采购平台",
              "酒店id",
              "酒店名称",
              "省份",
              "城市",
              "房型id",
              "房型名称",
              "酒店报价任务计划名称",
              "利润比",
              "金额"
            ],
            data: data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          });
        });
        AddOperationLog("EXPORT_PURCHASEORDER", JSON.stringify(condition));
      });
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
