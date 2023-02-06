<template>
	<div style="position:relative;height:460px">
		<!-- <el-card style="margin-top:20px">
      <div slot="header">
        <span>客户信息</span>
      </div> -->
		<div slot="header">
			<span style="font-size:20px;font-weight:600">客户信息</span>
		</div>
		<el-row style="padding:35px 0 35px 30px" type="flex">
			<el-col :span="12">
				<div class="margin-lg">
					<span class="title">用户名：</span>
					<span>{{ sysUser.userName }}</span>
				</div>
				<div class="margin-lg">
					<span class="title">姓名：</span>
					<span>{{ sysUser.nickName }}</span>
				</div>
				<div class="margin-lg">
					<span class="title">手机号：</span>
					<span>{{ sysUser.mobile }}</span>
				</div>
				<div class="margin-lg">
					<span class="title">邮箱：</span>
					<span>{{ sysUser.mail }}</span>
				</div>
				<div class="margin-lg">
					<span class="title">所属公司：</span>
					<span>{{ customer.companyName }}</span>
				</div>
<!-- 				<div class="margin-lg">
					<span class="title">用户类型：</span>
					<span>接口用户</span>
				</div> -->
			</el-col>
			<el-col :span="12" style="vertical-align: middle;position: relative;">
				<div class="block" @click="userdetail()"
					style="padding:20px;cursor: pointer; margin: 0 auto;width: 160px;position: absolute;top: calc(50% - 85px);left: calc(50% - 80px);">
					<svg-icon icon-class="xiangqing"
						style="font-size:6rem;color:#006699;display:inline-block;height: 100px;width:100px;margin-bottom:20px;" />
					<br />
					<span style="color: #3385ad;font-size: 20px;">详细信息查看</span>
				</div>
			</el-col>
		</el-row>


		<el-dialog :visible.sync="userinfo" :close-on-click-modal="false" label-position="right" :inline="true">
			<div slot="title">
				<span>用户详细信息</span>
			</div>
			<div class="purchase-order-info">
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">用户类别：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">企业</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">所属行业：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">旅游业</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">公司名称：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">{{ customer.companyName }}</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">联系人：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">{{ customer.contactName }}</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">联系人手机号：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">{{ customer.contactPhone }}</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">电子邮箱：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">{{ customer.email }}</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">身份证姓名：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">{{ customer.realName }}</el-link>
					</el-col>
				</el-row>

				<el-row>

					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">身份证号：</el-link>
					</el-col>
					<el-col :span="5" class="ml10">
						<el-link :underline="false" class="content">{{ customer.idCardNo }}</el-link>
					</el-col>
				</el-row>

				<el-row>

					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">身份证照片：</el-link>
					</el-col>
					<el-col :span="1" v-if="customer.customerType === CustomerTypeEnum.COMPANY">
						<el-popover placement="top" trigger="click" width="500">
							<el-image v-if="customer.idCardDisplayImgs && customer.idCardDisplayImgs.length>0"
								:src="customer.idCardDisplayImgs[0].item2"
								:preview-src-list="customer.idCardDisplayImgs.map(x=> {return x.item2 })" />
							<el-link v-else>暂无图片</el-link>
							<el-link slot="reference" type="primary">正面</el-link>
						</el-popover>
					</el-col>

					<el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY" :span="1">
						<el-popover placement="top" trigger="click" width="500">
							<el-image v-if="customer.idCardDisplayImgs && customer.idCardDisplayImgs.length>1"
								:src="customer.idCardDisplayImgs[1].item2"
								:preview-src-list="customer.idCardDisplayImgs.map(x=> {return x.item2 })" />
							<el-link v-else>暂无图片</el-link>
							<el-link slot="reference" type="primary">反面</el-link>
						</el-popover>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">是否法人：</el-link>
					</el-col>
					<el-col :span="10" class="ml10">
						<el-link :underline="false" class="content">
							{{ customer.isLegalPerson === YNEnum.Y?'是':'否' }}
						</el-link>
					</el-col>
				</el-row>

				<!-- <el-col :span="3">
            <el-link :underline="false" class="titlestyle">身份证号：</el-link>
          </el-col>
          <el-col :span="6" class="ml10">
            <el-link :underline="false" class="content">{{ customer.idCardNo }}</el-link>
          </el-col>
        </el-row> -->

				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">营业执照编号：</el-link>
					</el-col>
					<el-col :span="5" class="ml10">
						<el-link :underline="false" class="content">{{ customer.businessLicenseNo }}</el-link>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="3">
						<el-link :underline="false" class="titlestyle">营业执照照片：</el-link>
					</el-col>

					<el-col :span="1">
						<el-popover placement="top" trigger="click" width="500"
							v-if="customer.businessLicenseDisplayImgs && customer.businessLicenseDisplayImgs.length>0">
							<el-image
								v-if="customer.businessLicenseDisplayImgs && customer.businessLicenseDisplayImgs.length>0"
								:src="customer.businessLicenseDisplayImgs[0].item2"
								:preview-src-list="customer.businessLicenseDisplayImgs.map(x=> {return x.item2 })" />
							<el-link v-else>暂无图片</el-link>
							<el-link slot="reference" type="primary">正面</el-link>
						</el-popover>
					</el-col>

					<el-col :span="1">
						<el-popover placement="top" trigger="click" width="500">
							<el-image
								v-if="customer.businessLicenseDisplayImgs && customer.businessLicenseDisplayImgs.length>1 && customer.businessLicenseDisplayImgs[1] "
								:src="customer.businessLicenseDisplayImgs[1].item2"
								:preview-src-list="customer.businessLicenseDisplayImgs.map(x=> {return x.item2 })" />
							<el-link v-else>暂无图片</el-link>
							<el-link slot="reference" type="primary">反面</el-link>
						</el-popover>
					</el-col>

				</el-row>

				<!-- 		<el-row
					v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N">
					<el-col
						v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N"
						:span="3">
						<el-link :underline="false" class="titlestyle">授权人：</el-link>
					</el-col>
					<el-col
						v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N"
						class="ml10" :span="5">
						<el-link :underline="false" class="content">{{ customer.certigier }}</el-link>
					</el-col>
					<el-col
						v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N"
						:span="1">
						<el-popover placement="top" trigger="click" width="500">
							<el-image
								v-if="customer.authorizationDisplayImgs && customer.authorizationDisplayImgs.length>0"
								:src="customer.authorizationDisplayImgs[0].item2"
								:preview-src-list="customer.authorizationDisplayImgs.map(x=> {return x.item2 })" />
							<el-link v-else>暂无图片</el-link>
							<el-link slot="reference" type="primary">正面</el-link>
						</el-popover>
					</el-col>

					<el-col
						v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N && (customer.authorizationDisplayImgs[1] && customer.authorizationDisplayImgs.length>0)"
						:span="1">
						<el-popover placement="top" trigger="click" width="500">
							<el-image
								v-if="customer.authorizationDisplayImgs && customer.authorizationDisplayImgs.length>0"
								:src="customer.authorizationDisplayImgs[1].item2"
								:preview-src-list="customer.authorizationDisplayImgs.map(x=> {return x.item2 })" />
							<el-link v-else>暂无图片</el-link>
							<el-link slot="reference" type="primary">反面</el-link>
						</el-popover>
					</el-col>
				</el-row> -->
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		GetCustomer,
		ChangeContactInfo
	} from '@/api/customer/customer'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				userinfo: false,
				CustomerTypeEnum: {
					COMPANY: 1,
					PERSON: 2
				},
				YNEnum: {
					Y: 1,
					N: 0
				},
				customer: {}
			}
		},
		computed: {
			...mapGetters([
				'sysUser'
			])
		},
		created() {
			this.getCustomer()
			console.log(this.sysUser)
		},
		methods: {
			getCustomer() {
				GetCustomer().then(res => {
					if (res.data.item1) {
						this.customer = res.data.item2
						const temp = this.customer.idCardNo.substring(6, 14)
						this.customer.idCardNo = this.customer.idCardNo.replace(temp, '********')
						const length = this.customer.businessLicenseNo.length
						const temp2 = this.customer.businessLicenseNo.substr(0, length - 6)
						this.customer.businessLicenseNo = temp2 + '******'
					}
				})
			},
			userdetail() {
				this.userinfo = true
			},
			changeContactInfo() {
				ChangeContactInfo(this.customer.contactName, this.customer.contactPhone).then(res => {
					if (res.data) {
						this.getCustomer()
						this.$message.warning('保存成功')
					} else {
						this.$message.warning('保存失败')
					}
				})
			}
		}
	}
</script>

<style scoped>
	.el-link.el-link--default::after {
		border-color: #606266;
	}

	.el-row {
		padding: 10px
	}

	.titlestyle {
		/* color:red; */
		/* border:1px solid red; */
		color: #333333;
		float: right;
		text-align: center;
		height: 1.5rem;
	}

	.content {
		color: #333333;
		height: 1.5rem;
		margin-right: 1rem;
		float: left;
	}

	.ml10 {
		margin-left: 10px;
		height: 1.5rem;
		float: left;
	}

	.details {
		font-size: 6em;
		padding: 10px;
	}

	/* .svg-icon{
  width: 50%;
} */
	.details:hover {
		background: #F5F5F5;
		box-shadow: 10px 10px 5px #D3D3D3;
		border-radius: 10px;
	}

	.titlecss {
		color: #006699;
		font-size: 1vw;
		font-weight: 600;
	}

	.svg-icon {
		width: 5vw;
		height: 10vh;
	}
	.margin-bottom{
		margin-bottom: 20px;
	}
	.margin-lg{
		margin: 30px 10px;
	}
	.title{
		display: inline-block;
		width: 100px;
		text-align: right;
	}
</style>
