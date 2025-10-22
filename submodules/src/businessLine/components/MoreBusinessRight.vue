<template>
	<div class="more-right">
		<div style="margin-left:20px" v-if="activeMore =='MORE_TO_ONE'">
      <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 12.9777C7 13.3938 7.47854 13.6278 7.80697 13.3724L15.4926 7.39468C15.7499 7.1945 15.7499 6.8055 15.4926 6.60532L7.80697 0.627643C7.47854 0.372199 7 0.606245 7 1.02232L7 4L0.5 4C0.223858 4 0 4.22386 0 4.5L0 9.5C0 9.77614 0.223858 10 0.5 10L7 10V12.9777Z" fill="#9AB5D7"/>
      </svg>
    </div>
		<!-- 上游 -->
		<div
			class="up-box"
			:class="['isMore']"
		>
			<div
				class="up-box-item"
				:class="{ active: upIndex == item.businessLineNo }"
				v-for="(item, i) in upList"
				:key="i"
				@click="selectUp(item, i)"
			>
				<div class="up-box-item-left">上游</div>
				<div class="up-box-item-right">
					<a-tooltip >
						<template slot="title">
								<div>{{item.upStreamSellerCompany}}</div>
								<div >采购合同：{{item.upContractNo}}</div>
						</template>
						<div class="up-box-item-right-1">{{item.upStreamSellerCompany}}</div>
						<div class="up-box-item-right-2">采购合同：{{item.upContractNo}}</div>
					</a-tooltip>

				</div>
			</div>
		</div>
		<div style="margin: 0 20px">
			<svg
				width="16"
				height="14"
				viewBox="0 0 16 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 12.9777C7 13.3938 7.47854 13.6278 7.80697 13.3724L15.4926 7.39468C15.7499 7.1945 15.7499 6.8055 15.4926 6.60532L7.80697 0.627643C7.47854 0.372199 7 0.606245 7 1.02232L7 4L0.5 4C0.223858 4 0 4.22386 0 4.5L0 9.5C0 9.77614 0.223858 10 0.5 10L7 10V12.9777Z"
					fill="#9AB5D7"
				/>
			</svg>
		</div>
		<div class="mid">{{detailData.coreCompany}}</div>
		<div style="margin: 0 20px">
			<svg
				width="16"
				height="14"
				viewBox="0 0 16 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 12.9777C7 13.3938 7.47854 13.6278 7.80697 13.3724L15.4926 7.39468C15.7499 7.1945 15.7499 6.8055 15.4926 6.60532L7.80697 0.627643C7.47854 0.372199 7 0.606245 7 1.02232L7 4L0.5 4C0.223858 4 0 4.22386 0 4.5L0 9.5C0 9.77614 0.223858 10 0.5 10L7 10V12.9777Z"
					fill="#9AB5D7"
				/>
			</svg>
		</div>
		<div class="up-box" style="margin-right:20px">
			<div
				class="up-box-item down-box-item"
				:class="{ active: downIndex == item.businessLineNo }"
				v-for="(item, i) in downList"
				:key="i"
				@click="selectDown(item, i)"
			>
				<div class="up-box-item-left">下游</div>
				<div class="up-box-item-right">
					<a-tooltip >
						<template slot="title">
							<div >{{item.downStreamBuyerCompany}}</div>
							<div>销售合同：{{item.downContractNo}}</div>
						</template>
						<div class="up-box-item-right-1">{{item.downStreamBuyerCompany}}</div>
						<div class="up-box-item-right-2">销售合同：{{item.downContractNo}}</div>
					</a-tooltip>

				</div>
			</div>
		</div>
		<div style="margin-right:20px"  v-if="activeMore =='ONE_TO_MORE'">
			<svg
				width="16"
				height="14"
				viewBox="0 0 16 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 12.9777C7 13.3938 7.47854 13.6278 7.80697 13.3724L15.4926 7.39468C15.7499 7.1945 15.7499 6.8055 15.4926 6.60532L7.80697 0.627643C7.47854 0.372199 7 0.606245 7 1.02232L7 4L0.5 4C0.223858 4 0 4.22386 0 4.5L0 9.5C0 9.77614 0.223858 10 0.5 10L7 10V12.9777Z"
					fill="#9AB5D7"
				/>
			</svg>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		detailData: {
			default: () => {
				return {}
			}
		},
		activeMore: {
			default: ''
		}

	},
	data() {
		return {
			upIndex: 0,
			upItem: {},
			downIndex: 0,
			downItem: {}
		};
	},
	computed: {
		// 一对多 获取当前采购合同 既上游的数据
		upList() {

			const upContractNo = this.detailData.upContractNo 
			const item = this.detailData.upBusinessLineList.find(el => el.upContractNo == upContractNo)  || {}
			const index = this.detailData.upBusinessLineList.findIndex(el => el.upContractNo == upContractNo)  || {}

			

			if(this.activeMore == 'ONE_TO_MORE') {

				this.$emit('selectUp', item)
				return [item]
				
			}
			let info = this.detailData.upBusinessLineList[0] || {}
			// this.upIndex = item.businessLineNo
			this.$emit('selectUp', item)
			return  this.detailData.upBusinessLineList
		},
		downList() {
			const downContractNo = this.detailData.downContractNo 
			const item = this.detailData.downBusinessLineList.find(el => el.downContractNo == downContractNo) 

			if(this.activeMore == 'MORE_TO_ONE') {
			
				this.$emit('selectDown', item)
				return [item]
			}

			// this.downIndex = item.businessLineNo
			let info = this.detailData.downBusinessLineList[0] || {}
			this.$emit('selectDown', item)
			return  this.detailData.downBusinessLineList
		},

	},
	watch: {
		activeMore: {
			handler() {
					const upContractNo = this.detailData.upContractNo 
					const item = this.detailData.upBusinessLineList.find(el => el.upContractNo == upContractNo)  || {}

					const downContractNo = this.detailData.downContractNo 

					const item2 = this.detailData.downBusinessLineList.find(el => el.downContractNo == downContractNo) 
					this.upIndex = item.businessLineNo
					this.downIndex = item2.businessLineNo
			},
			deep: true,
			immediate: true,


		},
	},
	methods: {
		selectUp(item, i) {
			this.upItem = item;
			this.upIndex = item.businessLineNo
			this.$emit('selectUp', item)
		},
		selectDown(item, i) {
			this.downItem = item;
			this.downIndex = item.businessLineNo
			this.$emit('selectDown', item)

		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.more-right {
	background-color: #f8fafb;
	// width: 100%;
	display: flex;
	align-items: center;
	padding: 10px 0;
	.up-box {
		&-item {
			background: #ffffff;
			height: 64px;
			display: flex;
			width: 200px;
			// align-items: center;
			margin-bottom: 20px;
			cursor: pointer;
			border-radius: 4px;
			&:last-child {
				margin-bottom: 0;
			}
			border: 1px solid transparent;
			&.active {
				border: 1px solid #ff800f;
				border-radius: 4px;
				.up-box-item-left {
					background: #ff800f;
					color: #fff;
					border-radius: 0;
				}
				.up-box-item-right {
					border-radius: 0;
				}
			}
			&-left {
				background: #d3e1e8;
				width: 24px;
				writing-mode: vertical-rl;
				text-align: center;
				line-height: 24px;
				color: #77889d;
				font-weight: 600;
				letter-spacing: 6px;
				border-radius: 4px 0px 0 4px;
			}
			&-right {
				display: flex;
				flex-direction: column;
				padding-left: 20px;
				justify-content: center;
				border-radius: 0px 4px 4px 0px;

				box-sizing: border-box;
				&-1 {
					color: rgba(0, 0, 0, 0.8);
					font-weight: 600;
					font-size: 16px;
					margin-bottom: 6px;
					width: 144px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
				&-2 {
					color: rgba(0, 0, 0, 0.4);
					font-size: 12px;
					width: 144px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
	}
	.down-box-item.active {
		border: 1px solid @primary-color;
		.up-box-item-left {
			background: @primary-color;
			color: #fff;
			border-radius: 0;
		}
		.up-box-item-right {
			border-radius: 0;
		}
	}
	.mid {
		background-color: @primary-color;
		color: #fff;
		font-weight: 600;
		height: 64px;
		display: flex;
		align-items: center;
		// justify-content: center;
		padding-left: 20px;
		padding-right: 20px;
		box-sizing: border-box;
		width: 200px;

		border-radius: 4px;
	}
}
.isMore {
	margin-left: 20px;
}
// <=1440
@media screen and (max-width: 1440px) {
	.up-box-item {
		width: 190px !important;
	}
	.up-box-item-right {
		padding-right: 10px !important;
		padding-left: 10px !important;
	}
	.up-box-item-right-1 {
		width: 144px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.up-box-item-right-2 {
		width: 144px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.mid {
		width: 190px !important;
		text-overflow: ellipsis;
		// white-space: nowrap;
		overflow: hidden;
	}
}
@media screen and (min-width: 1560px) {
	.up-box-item {
		width: 228px !important;
	}
	.up-box-item-right {
		padding-right: 10px !important;
		padding-left: 10px !important;
	}
	.up-box-item-right-1 {
		width: 180px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.up-box-item-right-2 {
		width: 180px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.mid {
		width: 235px !important;
		text-overflow: ellipsis;
		// white-space: nowrap;
		overflow: hidden;
	}
}
// >=1920px
@media screen and (min-width: 1920px) {
  .up-box-item {
		width: 352px !important;
	}
	.up-box-item-right {
		padding-right: 0px !important;
		padding-left: 20px !important;
	}
	.up-box-item-right-1 {
		width: 280px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.up-box-item-right-2 {
		width: 280px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.mid {
		width: 348px !important;
		text-overflow: ellipsis;
		// white-space: nowrap;
		overflow: hidden;
	}
}
// >=2048px
@media screen and (min-width: 2048px) {
	.up-box-item {
		width: 550px !important;
	}
	.up-box-item-right {
		padding-right: 0px !important;
		padding-left: 20px !important;
	}
	.up-box-item-right-1 {
		width: 400px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.up-box-item-right-2 {
		width: 400px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.mid {
		width: 550px !important;
		text-overflow: ellipsis;
		// white-space: nowrap;
		overflow: hidden;
	}
}
// >=3000
@media screen and (min-width: 3000px) {
	.up-box-item {
		width: 750px !important;
	}
	.up-box-item-right {
		padding-right: 0px !important;
		padding-left: 20px !important;
	}
	.up-box-item-right-1 {
		width: 600px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.up-box-item-right-2 {
		width: 600px !important;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.mid {
		width: 750px !important;
		text-overflow: ellipsis;
		// white-space: nowrap;
		overflow: hidden;
	}
}
</style>
