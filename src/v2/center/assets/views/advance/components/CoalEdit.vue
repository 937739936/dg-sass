<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData && showAssetsOperation === 2"
		>
			<span
				slot="title"
				class="slTitle"
				>编辑预付账款</span
			>
			<EditInfo
				ref="editInfo"
				:defaultDetailData="detailData"
				:defaultIndex="defaultIndex"
			/>
		</a-card>

		<a-card
			:bordered="false"
			style="padding-top: 6px"
			v-if="detailData && showAssetsOperation === 1"
		>
			<a-tabs>
				<a-tab-pane
					key="info"
					tab="编辑预付账款"
				>
					<EditInfo
						ref="editInfo"
						:defaultDetailData="detailData"
						:defaultIndex="defaultIndex"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="log"
					tab="操作记录"
				>
					<AssetsOperation :assetNo="detailData.receivalVO.serialNo" />
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import EditInfo from './edit/EditInfo.vue';
import AssetsOperation from '@/v2/center/assets/components/common/AssetsOperation.vue';

export default {
	data() {
		return {
			showAssetsOperation: 0,
			filterCodeByValueName: filterCodeByValueName,
			strMsg: '', // 提交时发票状态错误提示信息内容
			visible: false // 提交时发票状态错误提示信息弹窗
		};
	},
	props: {
		defaultIndex: {
			type: [Number, String],
			default: () => {
				return 0;
			}
		},
		detailData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	components: {
		Breadcrumb,
		EditInfo,
		AssetsOperation
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		})
	},
	mounted: function () {
		this.showAssetsOperation = ['PLATFORM_OPERATE_REJECT', 'PLATFORM_REJECT'].includes(this.detailData.receivalVO.status) ? 1 : 2;
	},
	methods: {
		changeStatus(e) {
			this.$refs.leftTabs.downContractStatus = e;
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	::v-deep .ant-tabs {
		overflow: unset;
	}
}
</style>
