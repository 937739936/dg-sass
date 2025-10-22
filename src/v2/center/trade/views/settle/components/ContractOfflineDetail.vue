<template>
	<div>
		<div class="titleInfoBox">
			<div class="titleInfoTitle">
				<a-space :size="16">
					<em class="contractTypeSymbol">{{ typeDesc }}</em>
					<div
						@mouseenter="()=>{this.copySerialNoVisible = true}"
						@mouseleave="()=>{this.copySerialNoVisible = false}"
						>
						<span> 结算单编号：{{ contractInfo.serialNo || '-' }} </span>
						<em
							v-show="!copySerialNoVisible"
							class="copy-icon"
							>
							<Copy></Copy>
						</em>
						<em
							v-show="copySerialNoVisible"
							v-clipboard:success="onCopy" 
							v-clipboard:error="onError"  
							v-clipboard:copy="contractInfo.serialNo"
							class="copy-icon"
							>
							<CopyNow></CopyNow>
						</em>
					</div>
					<div :class="`delivery-status status-${contractInfo.status}`">
						{{ contractInfo.statusDesc || '-' }}
					</div>
				</a-space>
			</div>
			<div class="titleInfoItem pl85"	@mouseenter="()=>{this.copyContractNoVisible = true}"
				@mouseleave="()=>{this.copyContractNoVisible = false}">
				<span class="label w85">所属合同编号：</span>
				<TextOverFlow
					v-if="contractInfo.paperContractNo"
					:content="contractInfo.paperContractNo"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>
				<em
					v-show="!copyContractNoVisible"
					class="copy-icon copy-contract-icon"
					>
					<Copy></Copy>
				</em>
				<em
					v-show="copyContractNoVisible"
					v-clipboard:success="onCopy" 
					v-clipboard:error="onError"  
					v-clipboard:copy="contractInfo.paperContractNo"
					class="copy-icon copy-contract-icon"
					>
					<CopyNow></CopyNow>
				</em>
			</div>
			<div class="titleInfoItem">
				<span class="label">卖方企业：</span>
				<TextOverFlow
					v-if="contractInfo.sellerName"
					:content="contractInfo.sellerName"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">买方企业：</span>
				<TextOverFlow
					v-if="contractInfo.buyerName"
					:content="contractInfo.buyerName"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">创建时间：</span>
				<TextOverFlow
					v-if="contractInfo.createTime"
					:content="contractInfo.createTime"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>
			</div>
		</div>
	</div>
</template>
<script>
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { Copy, CopyNow } from '@sub/components/svg'
export default {
	components: { TextOverFlow, Copy, CopyNow },
	props: {
		contractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		let { meta } = this.$route;
		return {
			meta,
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 信息文案最大宽度
			copyContractNoVisible: false,
			copySerialNoVisible: false,
		};
	},
	computed: {
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		typeDesc() {
			//类型中文
			let typeDesc = '';
			switch (this.type) {
				case 'buy':
					typeDesc = '采';
					break;
				case 'sell':
					typeDesc = '销';
					break;
			}
			return typeDesc;
		}
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	filters: {},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	methods: {
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth >= 1920) {
				this.maxWidth = 260;
			}
			if (this.clientWidth < 1920) {
				this.maxWidth = 230;
			}
			if (this.clientWidth <= 1560) {
				this.maxWidth = 150;
			}
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		goContractDetail() {
			window.open(`/center/contract/sell/online/detail?type=SELL&id=${this.contractInfo.id}`);
		}
	}
};
</script>
<style lang="less" scoped>
.copy-icon {
	width: 14px;
	margin: 4px;
	cursor: pointer;
	position: relative;
	top: 1px;
}
.copy-contract-icon {
	width: 14px;
	margin: 4px;
	cursor: pointer;
	position: absolute;
	top: -1px;
}

//默认待提交状态
.delivery-status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #c1d7ff;
	color: #4682f3;
	margin-left: 20px;
	&.status-WAI_CONFIRM {
		background: #c9daff;
		color: #596fa0;
	}
	//已签约
	&.status-EFFECTIVE {
		background: #c5ecdd;
		color: #3eb384;
	}
	//驳回
	&.status-REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
}
.slTitle {
	margin-bottom: 20px;
}

.contractTypeSymbol {
	display: inline-block;
	width: 18px;
	height: 18px;
	background: @primary-color;
	color: #fff;
	text-align: center;
	line-height: 18px;
	border-radius: 4px;
	font-style: normal;
	font-size: 14px;
	position: relative;
	top: -1px;
}
.mobile-icon {
	margin: -3px 14px 0 6px;
	cursor: pointer;
	width: 14px;
	height: 14px;
}
.pt0 {
	padding-top: 0;
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 10px;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
	}
}

.slBtn {
	margin-left: 30px;
}
.titleInfoBox {
	.titleInfoItem {
		width: 22%;
		margin-right: 3%;
		display: inline-block;
		padding-left: 130px;
		position: relative;
		height: 40px;
		float: left;
		.label {
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			width: 130px;
			text-align: right;
		}
		.w85 {
			width: 130px;
		}
		.pl85 {
			padding-left: 130px;
		}
		.w130 {
			width: 130px;
		}
	}
	.titleInfoItem.more {
		overflow: inherit;
		width: 100%;
	}
	// .more-margin-left {
	//   margin-left: -5px;
	// }
	.titleInfoItem.pl85 {
		padding-left: 130px;
	}
	.titleInfoTitle {
		margin-bottom: 20px;
		font-size: 16px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		line-height: 22px;
	}
	.textOverflow {
		left: 130px !important;
	}
}

// 小于1366 以1300为准
@media screen and (min-width: 1561px) {
	.copy-contract-icon  {
		left: 330px !important;
	}
}
@media screen and (max-width: 1560px) {
	.copy-contract-icon  {
		left: 270px !important;
	}
}
</style>
