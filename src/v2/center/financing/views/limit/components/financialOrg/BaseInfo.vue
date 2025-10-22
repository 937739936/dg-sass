<template>
	<div>
		<div class="sub-title">基本信息</div>
		<ul
			class="grid-wrap"
			style="padding: 0; margin-bottom: 30px"
		>
			<li>
				<span class="label">企业名称</span>
				<span>{{ detailInfo.companyName }}</span>
			</li>
			<li>
				<span class="label">资金类型</span>
				<TextOverFlow
					v-if="detailInfo.bankProductName"
					:content="detailInfo.bankProductName"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>
				<!-- <span>{{ detailInfo.bankProductName }}</span> -->
			</li>
			<li v-if="isCoreCompanyLimit">
				<span class="label">授信类型</span>
				<span>{{ detailInfo.creditTypeDesc }}</span>
			</li>
			<li v-else>
				<span class="label">关联核心企业</span>
				<TextOverFlow
					v-if="detailInfo.coreCompanyName"
					:content="detailInfo.coreCompanyName"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>

				<!-- <a-tooltip>
          <template v-if="detailInfo.coreCompanyName != null" slot="title">
            <span> {{ detailInfo.coreCompanyName }} </span>
          </template>
          <span>
            {{ detailInfo.coreCompanyName }}
          </span>
        </a-tooltip> -->
			</li>
			<li>
				<span class="label">授信额度（元）</span>
				<span>{{ displayAmountText(detailInfo.totalAmount) }}</span>
			</li>
			<li>
				<span class="label">剩余额度（元）</span>
				<span>{{ displayAmountText(detailInfo.availableAmount) }}</span>
			</li>
			<li>
				<span class="label">已用额度（元）</span>
				<span>{{ displayAmountText(detailInfo.usedAmount) }}</span>
			</li>
			<li>
				<span class="label">冻结额度（元）</span>
				<span>{{ displayAmountText(detailInfo.frozenAmount) }}</span>
			</li>
			<li>
				<span class="label">起始日期</span>
				<span>{{ detailInfo.beginDate }}</span>
			</li>
			<li>
				<span class="label">到期日期</span>
				<span>{{ detailInfo.endDate }}</span>
			</li>
			<li>
				<span class="label">额度是否循环</span>
				<span>{{ detailInfo.recycle ? '是' : '否' }}</span>
			</li>
			<li>
				<span class="label">额度状态</span>
				<span>{{ detailInfo.statusText }}</span>
			</li>
			<li>
				<span class="label"></span>
				<span></span>
			</li>
		</ul>
	</div>
</template>

<script>
import TextOverFlow from "@sub/components/TextOverflow.vue";

export default {
	name: 'BaseInfo',
	components: {
		TextOverFlow
	},
	props: {
		detailInfo: {} // 额度详情信息
	},
	data() {
		return {
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null //浏览器尺寸
		};
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	computed: {
		isCoreCompanyLimit() {
			// parentId != null  是融资企业额度明细
			return this.detailInfo.parentId == null;
		}
	},
	methods: {
		// 展示金额文字
		displayAmountText(amount) {
			if (amount == null) {
				return '';
			}
			return amount.toLocaleString();
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1600) {
				this.maxWidth = 215;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 280;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 365;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 440;
			} else {
				this.maxWidth = 720;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;
	margin-bottom: 20px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}

.grid-wrap {
	margin-top: 10px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span,
		.textOverflow {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.textOverflow {
			left: 160px;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}
</style>
