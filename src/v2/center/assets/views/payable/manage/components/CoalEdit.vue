<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData && !showAssetsOperation"
		>
			<span
				slot="title"
				class="slTitle"
				>编辑应付账款</span
			>
			<EditInfo
				ref="editInfo"
				:defaultDetailData="detailData"
				:defaultIndex="defaultIndex"
			/>
		</a-card>
		<a-card
			:bordered="false"
			v-if="detailData && showAssetsOperation"
		>
			<a-tabs>
				<a-tab-pane
					key="info"
					tab="编辑应付账款"
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
import Breadcrumb from '@/v2/components/breadcrumb/index';
import EditInfo from './edit/EditInfo.vue';
import AssetsOperation from '@/v2/center/assets/components/common/AssetsOperation.vue';

export default {
	data() {
		return {
			showAssetsOperation: false
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
				return undefined;
			}
		}
	},
	components: {
		Breadcrumb,
		EditInfo,
		AssetsOperation
	},
	// computed: {
	// 	...mapGetters('user', {
	// 		VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
	// 		VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
	// 	}),
	// 	industryType() {
	// 		let industryType = this.detailData?.receivalVO?.industryType;
	// 		return industryType;
	// 	}
	// },
	mounted() {
		this.showAssetsOperation = ['PLATFORM_OPERATE_REJECT', 'PLATFORM_REJECT'].includes(this.detailData.receivalVO.status);
	},
	methods: {}
};
</script>
<style lang="less" scoped>
.slMain {
	::v-deep.ant-tabs {
		overflow: unset;
	}
}
</style>
