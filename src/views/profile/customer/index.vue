<template>
	<div class="app-container">
		<el-row :gutter="20">
			<el-col :span="8" :xs="24">
				<user-card />
			</el-col>
			<el-col :span="16" :xs="24">
				<el-card>
					<account v-if="sysUser.userRoles[0].meta != 'SubUser'" />
					<div v-else style="height: 460px;padding-top: 100px;">
						<el-row>
							<el-col v-if="sysUser.userType!==userTypeEnum.USER" :span="6" :offset="4">
								<div @click="show('密码修改','password')" class="usertype">
									<svg-icon icon-class="mima" style="font-size:6rem;margin:20px auto;width:100%" />
								</div>
								<p class="iconcolor" style="color:#006699">密码修改</p>
							</el-col>
							<el-col v-if="sysUser.userType!==userTypeEnum.USER" :span="6" :offset="2">
								<div @click="show('邮箱修改','email')" class="usertype">
									<svg-icon icon-class="youxiang" style="font-size:6rem;margin:20px auto;width:100%" />
								</div>
								<p class="iconcolor" style="color:#006699">邮箱修改</p>
							</el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<div class="usertypes" v-if="sysUser.userRoles[0].meta != 'SubUser'">
			<el-row>
				<el-col v-if="sysUser.userType!==userTypeEnum.USER" :span="4" :offset="2">
					<div @click="show('信息修改','info')" class="usertype">
						<svg-icon icon-class="yonghu" style="font-size:6rem;margin:20px 10px" />
					</div>
					<p class="iconcolor" style="color:#006699">信息修改</p>
				</el-col>
				<el-col v-if="sysUser.userType!==userTypeEnum.USER" :span="4" :offset="4">
					<div @click="show('密码修改','password')" class="usertype">
						<svg-icon icon-class="mima" style="font-size:6rem;margin:20px 10px" />
					</div>
					<p class="iconcolor" style="color:#006699">密码修改</p>
				</el-col>
<!-- 				<el-col v-if="sysUser.userType!==userTypeEnum.USER" :span="4" :offset="4">
					<div @click="show('邮箱修改','email')" class="usertype">
						<svg-icon icon-class="youxiang" style="font-size:6rem;margin:20px 10px" />
					</div>
					<p class="iconcolor" style="color:#006699">邮箱修改</p>
				</el-col> -->
			</el-row>
		</div>
		<Dialog :visible="visible" :type="type" :title="title" @close="close"></Dialog>

	</div>

</template>

<script>
	import UserCard from '../components/UserCard'
	import Dialog from '../components/Dialog'
	import Account from '../components/Account'
	import {
		SendMail,
		ChangeEmail
	} from '@/api/customer/customer'
	import {
		mapGetters
	} from 'vuex'
	import {
		GetCustomer,
		ChangeContactInfo
	} from '@/api/customer/customer'
	import md5 from 'js-md5'
	import {
		ChangePwd
	} from '@/api/sys/user'
	export default {
		name: 'Profile',
		components: {
			UserCard,
			Dialog,
			Account
		},
		data() {
			return {
				userTypeEnum: {
					API: 200,
					// 后台
					BACKSTAGE: 100,
					// 企业
					CUSTOMER: 50,
					// 用户
					USER: 10
				},
				visible: false,
				type: '',
				title: ''
			}
		},
		methods: {

			show(title, type) {
				this.visible = true
				this.title = title
				this.type = type
			},
			close() {
				this.visible = false
				this.getCustomer()
			},

			getCustomer() {
				GetCustomer().then(res => {
					if (res.data.item1) {
						this.customer = res.data.item2
					}
				})
			},

		},
		computed: {
			...mapGetters([
				'sysUser'
			])
		}
	}
</script>

<style lang="scss" scoped>
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
	.dashboard-visiter-container {
		margin: 0.3125rem;
		padding: 0.5rem;
	}

	.welcome {
		color: #F0F2F5;
		text-align: center;
	}

	.usertypes {
		display: block;
		margin-top: 2rem;
		text-align: center;
		color: #006699;
		margin-bottom: 15px;
		cursor: pointer;
	}

	.usertype:hover {
		background: #f5f5f5;
		box-shadow: 10px 10px 5px #D1D1D1;
		border-radius: 10px;
	}

	.iconcolor {
		font-size: 2.5vh;
		font-weight: 600;
		text-align: center;
	}

	.svg-icon {
		width: 10vw;
		height: 10vh;
	}
</style>
