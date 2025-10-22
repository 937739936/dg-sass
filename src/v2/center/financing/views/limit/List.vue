<template>
	<div
		class="slMain"
		v-if="reloadPage"
	>
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				额度查询
				<div
					class="line"
					v-if="VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY'"
				></div>
			</span>
			<div v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'">
				<a-tabs v-model="status">
					<a-tab-pane
						key="我的额度"
						:tab="myTab"
					>
						<div style="width: 100%; position: relative; padding: 10px 0">
							<My @setMyCount="setMyCount" />
						</div>
					</a-tab-pane>
					<a-tab-pane
						key="客户额度明细"
						:tab="clientTab"
					>
						<div style="width: 100%; position: relative; padding: 10px 0">
							<Client @setClientCount="setClientCount" />
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
			<div v-else-if="VUEX_ST_COMPANYSUER.companyType === 'FINANCIAL_ORG'">
				<Financial />
			</div>
			<div v-else>
				<div style="width: 100%; position: relative; padding: 10px 0">
					<Trade />
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import My from '@/v2/center/financing/views/limit/modules/My';
import Client from '@/v2/center/financing/views/limit/modules/Client';
import Trade from '@/v2/center/financing/views/limit/modules/Trade';
import Financial from '@/v2/center/financing/views/limit/modules/Financial';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			status: '我的额度',
			myTab: '我的额度',
			clientTab: '客户额度明细',
			reloadPage: false
		};
	},
	components: {
		My,
		Client,
		Trade,
		Financial
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	beforeRouteEnter(to, from, next) {
		if (!from.path.includes('detail')) {
			next(vm => {
				vm.reloadPage = false;
				vm.$nextTick(() => {
					vm.reloadPage = true;
				});
			});
		} else {
			next();
		}
	},
	mounted() {
		this.reloadPage = true;
	},
	methods: {
		setMyCount(e) {
			this.myTab = `我的额度（${e}）`;
		},
		setClientCount(e) {
			this.clientTab = `客户额度明细（${e}）`;
		}
	}
};
</script>
<style lang="less" scoped>
.line {
	height: 1px;
	width: 100%;
	margin-top: 20px;
	background-color: #e5e6eb;
}
.slMain {
	margin-top: -10px;
}

.tabs-box {
	position: relative;

	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}

	.export-box {
		position: absolute;
		right: 0;
		top: 16px;
		text-align: right;
		cursor: pointer;

		.export-icon {
			width: 14px;
			height: 14px;
			margin-right: 5px;
			position: relative;
			top: -2px;
		}

		.export-text {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 20px;
		}
	}

	::v-deep.ant-tabs-ink-bar {
		bottom: 1.5px;
	}
}
</style>
