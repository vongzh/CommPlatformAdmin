<template>
	<div>
		<el-card>
			<div style="display: flex;justify-content: space-between;">
				<div :class="isFold ? 'outer' : '' " ref="block" :style="{height:height}">
					<slot></slot>
				</div>
				<div v-show="show">
					<el-form>
						<el-form-item label="　" style="user-select: none">
							<el-button @click="changeFold">更多条件<span
									:class="isFold? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="changeFold"
									style="margin-left: 5px;"></span></el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'SearchBlock',
		props: {
			show: {
				default: true,
				type: Boolean
			},
		},
		data() {
			return {
				isFold: true,
				searchHeight: 0,
				height: 82,
			}
		},
		mounted() {
			this.$nextTick(() => { // 页面渲染完成后的回调
				this.searchHeight = this.$refs.block.offsetHeight
				if (this.show) {
					this.height = this.$refs.block.offsetHeight - 82 + 'px'
				} else this.height = this.$refs.block.offsetHeight + 'px'

			})
			window.onresize = () => {
				return (() => {
					this.height = 'auto'
					this.$nextTick(() => { // 页面渲染完成后的回调
						if (this.show) {
							this.searchHeight = this.$refs.block.offsetHeight
							if (this.isFold) {
								this.height = this.searchHeight - 82 + 'px'
							}
						} else this.height = this.$refs.block.offsetHeight + 'px'
					})
				})()
			}
		},
		methods: {
			changeFold() {
				if (this.isFold) {
					this.height = 'auto'
				} else this.height = this.searchHeight - 82 + 'px'
				this.isFold = !this.isFold

			}
		}
	}
</script>

<style lang="scss">
	.outer {
		overflow-y: hidden;
	}

	.el-form-item {
		margin-bottom: 0;
	}
</style>
