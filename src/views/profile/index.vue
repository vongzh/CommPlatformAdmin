<template>
	<div class="container">
		<component :is="getProfile(sysUser.userType)" />
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		GetCustomer,
	} from '@/api/customer/customer'
	import adminProfile from './admin'
	import customerProfile from './customer'

	export default {
		name: 'Profile',
		components: {
			adminProfile,
			customerProfile
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
				customer: {
					customerType:0
				}
			}
		},
		computed: {
			...mapGetters([
				'sysUser'
			])
		},
		created() {
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
		methods: {
			getProfile(userType) {
				switch (userType) {
				  case this.userTypeEnum.BACKSTAGE:
				    return 'adminProfile'
				  case this.userTypeEnum.API:
				  case this.userTypeEnum.CUSTOMER:
				  case this.userTypeEnum.USER:
				    return 'customerProfile'
				}
			}
		}
	}
</script>

<style scoped>
	.container {
		width: 80%;
		min-width: 1000px;
		margin: 0 auto;
		padding: 30px
	}
</style>
