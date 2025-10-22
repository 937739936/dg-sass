<template>
	<div class="tabs-box">
		<a-tabs
			v-model="status"
			@change="tabChange"
		>
			<a-tab-pane
				v-for="item in tabs"
				:key="item.value"
			>
				<span slot="tab">
					{{ item.label }}
					<template v-if="item.num">
						<span style="color: var(--primary-color)">
							(<template>{{ item.num }}</template
							>)
						</span>
					</template>
				</span>
			</a-tab-pane>
			<div
				class="right-box"
				slot="tabBarExtraContent"
			>
				<div
					v-if="showExport"
					class="export-box"
					@click="exportData"
				>
					<ExportIcon />
					<span class="export-text">数据导出</span>
				</div>
				<div
					v-if="showSync"
					class="export-box"
					@click="synchroData"
					style="margin-left: 30px"
				>
					<RefreshIcon :class="['rotating-element', { paused: !isSyncLoading }]" />
					<span class="export-text">数据同步</span>
				</div>
			</div>
		</a-tabs>
	</div>
</template>

<script>
import { ExportIcon, RefreshIcon } from '@sub/components/svg';
import { mapMutations, mapGetters } from 'vuex';

export default {
	data() {
		return {
			status: 'ALL',
			tabs: [],
			isSyncLoading: false
		};
	},
	props: {
		statusData: {
			default: () => {
				return [];
			}
		},
		tabsNum: {
			default: () => {
				return [];
			}
		},
		currentStatus: {
			default: ''
		},
		type: {
			default: 'rest'
		},
		showExport: {
			default: false
		},
		showSync: { default: false }
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
		// 判断当前是否是金融机构
		// isBank() {
		// 	return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		// }
	},
	mounted() {
		// 解决tabs条切换抖动问题，故封装成组件
	},
	watch: {
		statusData: {
			handler(val) {
				if (!val) return;
				this.tabs = val;
				this.$forceUpdate();
			},
			immediate: true,
			deep: true
		},
		currentStatus: {
			handler(val) {
				this.status = val || 'ALL';
			},
			deep: true,
			immediate: true
		}
	},

	methods: {
		tabChange(key) {
			this.$emit('callback', key);
		},
		rest() {
			this.status = this.statusData[0]?.value || 'ALL';
		},
		lookOaData() {
			this.$emit('look');
		},
		exportData() {
			this.$emit('export');
		},
		synchroData() {
			if (this.isSyncLoading) return;
			this.$emit('synchro');
		}
	},
	components: {
		ExportIcon,
		RefreshIcon
	}
};
</script>
<style lang="less" scoped>
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.tabs-box {
	position: relative;
	.right-box {
		// text-align: right;
		z-index: 10;
		display: flex;
		align-items: center;
	}
	.oa-box {
		display: flex;
		align-items: center;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
	}
	.line {
		width: 1px;
		height: 13px;
		background: #e5e6eb;
		margin: 0 20px;
	}
	.export-box {
		display: flex;
		align-items: center;
		color: @primary-color;
		cursor: pointer;
		.export-text {
			margin-left: 6px;
		}
	}
	.rotating-element {
		animation: rotate 1s linear infinite;
	}
	.paused {
		animation-play-state: paused;
	}
}
</style>
