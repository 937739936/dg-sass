<template>
	<div class="wrapper slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>企业资料管理</span
				>
			</div>
			<div class="s-card-content companyAccount">
				<div class="wrapper">
					<div class="block-wrapper">
						<a-row
							type="flex"
							justify="space-between"
						>
							<a-timeline style="width: 120px; margin-top: 10px">
								<a-timeline-item
									v-for="(item, index) in tabList"
									:key="index"
									v-auth="item.auth"
									:class="setActiveStyle(item.value)"
								>
									<img
										slot="dot"
										class="icon"
										:src="item.icon"
									/>
									<span
										class="text"
										:class="setActiveStyle(item.value)"
										@click="swicth(item.value)"
										>{{ item.label }}</span
									>
								</a-timeline-item>
							</a-timeline>
							<div class="item-wrapper">
								<TaxTable v-if="curTab == 1" />
								<FinanceReport v-if="curTab == 2" />
								<TaxOtherTable v-if="curTab == 3" />
							</div>
						</a-row>
					</div>
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import TaxTable from '../../components/TaxTable.vue';
import TaxOtherTable from '../../components/TaxOtherTable.vue';
import FinanceReport from '../../components/FinanceReport.vue';

export default {
	components: { TaxTable, TaxOtherTable, FinanceReport },
	data() {
		return {
			curTab: 1,
			tabList: [
				{
					label: '纳税申报表',
					icon: require('@sub/assets/imgs/assets/test.png'),
					auth: 'company:attachment:tax',
					value: 1
				},
				{
					label: '企业财报',
					icon: require('@sub/assets/imgs/assets/confirm.png'),
					auth: 'company:attachment:tax',
					value: 2
				},
				{
					label: '其他文件',
					icon: require('@sub/assets/imgs/assets/file.png'),
					auth: 'company:attachment:other',
					value: 3
				}
			]
		};
	},

	created() {},

	computed: {},

	methods: {
		swicth(v) {
			this.curTab = v;
		},

		setActiveStyle(v) {
			if (v == this.curTab) {
				return 'active';
			}
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
::v-deep {
	.ant-tabs-bar {
		border: 0;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
}
.wrapper {
	background-color: rgb(244, 245, 248);

	.block-wrapper {
		// margin-bottom: 8px;
		background: #ffffff;
		// padding: 20px;
		::v-deep {
			.ant-timeline-item {
				padding: 0 0 40px;
			}
		}
		.text {
			cursor: pointer;
			padding: 2px 5px;
			display: inline-block;
			border-radius: 4px;
		}
		.active {
			color: @primary-color;
			img {
				filter: brightness(150%);
			}
		}
		.item-wrapper {
			flex: 1;
			width: calc(100% - 120px);
		}
		.icon {
			width: 24px;
			height: 24px;
		}
		.des {
			color: #383a3f;
		}
		.time {
			color: #9ba0aa;
		}
		.r {
			color: #f24e4d;
		}
	}
	.count {
		.name {
			margin-bottom: 8px;
		}
		.value {
			font-size: 24px;
			color: #f24e4d;
		}
	}
}
</style>

<style lang="less" scoped>
.center-user {
	.control-wrap {
		a {
			display: inline-block;
			padding: 0 6px;
		}
	}
	.search-wrap {
		padding: 0 0 16px 0;
		.ant-select {
			width: 100%;
		}
	}
	.s-card-title {
		margin: 6px 0 16px;
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #141517;
		letter-spacing: 0;
		line-height: 24px;
	}
	.s-card-content {
		border-top: 1px solid#EEF0F2;
	}
	.order-wrap {
		button {
			width: 104px;
		}
	}
}
::v-deep .ant-checkbox-group {
	width: 100%;
}
::v-deep.ant-table-wrapper {
	width: 100%;
}
::v-deep.ant-tabs-tabpane {
	display: block !important;
}
::v-deep.ant-tabs-bar {
	border: none;
}
::v-deep.ant-form-item {
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	text-align: left;
}
::v-deep.ant-modal-body {
	padding: 20px 32px 12px 20px;
}
::v-deep.ant-modal-title {
	font-family: PingFangSC-Medium;
	font-size: 16px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 24px;
}
.methods-wrap {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
</style>
