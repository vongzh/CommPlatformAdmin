<template>

	<el-card style="height: 500px;">
		<el-image fit="cover" :src="url" style="height: 270px;width: 100%;">
		</el-image>
		<el-image fit="cover" :src="avatar"
			style="width: 90px;height: 90px;border: 5px solid #fff;border-radius: 50%;margin: -45px 0 0 20px">
		</el-image>
		<span style="float:right;margin:10px" v-if="sysUser.userRoles[0].meta == 'SubUser'">{{sysUser.lastLoginTime}}</span>
		<div class="margin-lg" v-if="sysUser.userRoles[0].meta == 'SubUser'">
			<div class="margin">
				<span class="title margin-bottom">用户名：</span>
				<span>{{sysUser.userName}}</span>
			</div>
			<div class="margin">
				<span class="title margin-bottom">注册手机号：</span>
				<span>{{sysUser.mobile}}</span>
			</div>
		</div>
		<div class="margin-lg" v-else>
			<div class="margin">
				<span class="title margin-bottom">登陆时间：</span>
				<span>{{sysUser.lastLoginTime}}</span>
			</div>
			<div class="margin">
				<span class="title margin-bottom">用户名：</span>
				<span>{{sysUser.userName}}</span>
			</div>
		</div>
	</el-card>
</template>

<script>
	import PanThumb from '@/components/PanThumb'
	import {
		mapGetters
	} from 'vuex'
	import {
		GetCustomer
	} from '@/api/customer/customer'

	export default {
		components: {
			PanThumb
		},
		data() {
			return {
				userType: '',
				userTypeEnum: {
					API: 200,
					BACKSTAGE: 100,
					CUSTOMER: 50,
					USER: 10
				},
				customer: {},
				isChild: false,

				url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.macdown.com%2F180529%2FJPG-180529_313%2FgSg1ki0di6_small.jpg&refer=http%3A%2F%2Fphoto.macdown.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640230672&t=56d458f2907d32cbf864cc5f0ca976e9",
			}
		},
		computed: {
			...mapGetters([
				'name',
				'avatar',
				'sysUser'
			])
		},
		created() {
			this.getCustomer()
		},
		methods: {
			getCustomer() {
				GetCustomer().then(res => {
					if (res.data.item1) {
						this.customer = res.data.item2
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-center {
		margin: 0 auto;
		display: table;
	}

	.text-muted {
		color: #333333;

		.info {
			line-height: 2.5rem;
		}
	}

	.info-top {
		padding-top: 2rem;
		line-height: 1.375rem;
	}

	.user-profile {
		.user-name {
			font-weight: bold;
		}

		.box-center {
			padding-top: 10px;
		}

		.user-role {
			padding-top: 10px;
			font-weight: 400;
			font-size: 14px;
		}

		.box-social {
			padding-top: 30px;

			.el-table {
				border-top: 1px solid #dfe6ec;
			}
		}

		.user-follow {
			padding-top: 20px;
		}
	}

	.user-bio {
		margin-top: 20px;
		color: #333333;

		span {
			padding-left: 4px;
		}

		.user-bio-section {
			font-size: 14px;
			padding: 15px 0;
			margin-bottom: 4.375rem;

			.user-bio-section-header {
				// border-bottom: 1px solid #dfe6ec;
				padding-bottom: 10px;
				margin-bottom: 10px;
				position: relative;
				color: #333333;
				font-family: "微软雅黑";
				font-style: normal;
				font-weight: 400;
			}
		}
	}

	.www {
		position: absolute;
		bottom: 0.1rem;
		margin-left: 1rem;
		border: 5px solid #ffffff;
		// box-sizing:border-box;
		background-color: #ffffff;
	}

	.userinfo {
		float: right;
		font-size: 13px;
		height: 2.5rem;
		line-height: 2.5rem;
		font-family: "微软雅黑";
		font-style: normal;
		font-weight: 400;
	}

	.header {
		height: 100%;
		background-color: red;
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
