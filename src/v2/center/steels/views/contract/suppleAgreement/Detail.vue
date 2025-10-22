<template>
	<div
		class="background-wrapper"
		:class="isOa ? 'oa-wrapper' : ''"
	>
		<a-card
			class="custom-card-title"
			title="基本信息"
			:bordered="false"
		>
			<span
				slot="extra"
				:class="detailData.status === 'COMPLETED' ? 'completed' : ''"
			>
				补协状态：{{ detailData.statusDesc }}
			</span>
			<a-descriptions :column="3">
				<a-descriptions-item label="补充协议编号">{{ detailData.serialNo }}</a-descriptions-item>
				<a-descriptions-item label="所属合同编号">
					<template v-if="isOa">
						{{ detailData.contractNo }}
					</template>
					<a
						@click="jumpToPage"
						v-else
						>{{ detailData.contractNo }}</a
					>
				</a-descriptions-item>
				<a-descriptions-item label="卖方企业名称">{{ detailData.sellCompanyName }}</a-descriptions-item>
				<a-descriptions-item label="买方企业名称">{{ detailData.buyCompanyName }}</a-descriptions-item>
				<a-descriptions-item label="补协签订日期">{{ detailData.signDate }}</a-descriptions-item>
				<a-descriptions-item label="签约地点">{{ detailData.contractSignPlace }}</a-descriptions-item>
			</a-descriptions>

			<template v-if="detailData.purchaseList && detailData.purchaseList.length > 0">
				<p class="title">采购物资明细</p>
				<a-table
					:pagination="false"
					:columns="buyDetailsColumns"
					:data-source="detailData.purchaseList"
					:scroll="{ x: true }"
					:rowKey="
						(record, index) => {
							return record.id;
						}
					"
				>
				</a-table>
			</template>

			<template v-if="detailData.changeItems && detailData.changeItems.length > 0">
				<p class="title">合同期限 <span v-if="detailData.steelType != 'SCRAP_STEEL'">、收货人等信息</span></p>
				<a-table
					rowKey="serialNumber"
					:columns="agreementColumns"
					:dataSource="detailData.changeItems"
					:scroll="{ x: true }"
					:pagination="false"
				>
					<template
						slot="itemDetailsOld"
						slot-scope="text, record"
					>
						<ChangeItem
							:data="record"
							type="oldValue"
						/>
					</template>
					<template
						slot="itemDetails"
						slot-scope="text, record"
					>
						<ChangeItem :data="record" />
					</template>
				</a-table>
			</template>

			<template v-if="detailData.signContent">
				<p class="title">对其他事项的补充约定</p>
				<div style="position: relative; cursor: disabled">
					<div
						style="
							position: absolute;
							width: 100%;
							height: 100%;
							left: 0;
							top: 0;
							z-index: 100;
							background: #dddddd;
							opacity: 0.1;
						"
					></div>
					<ContractTemplate
						type="1"
						value="otherAppointHtmlStr"
						:disabled="true"
						:getData="getData"
						:defaultValue="detailData.signContent"
					/>
				</div>
				<!-- <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }" v-model="detailData.signContent" disabled/> -->
			</template>

			<template v-if="detailData.pdfPath">
				<p class="title">补协文件</p>
				<div style="width: 100px">
					<img
						class="cp"
						style="display: inline-block; width: 100%"
						src="@/assets/imgs/pdf.png"
						@click="openPdf(detailData.pdfPath)"
					/>
					<p class="tc mt8">补充协议</p>
				</div>
			</template>
		</a-card>

		<a-card
			class="custom-card-title"
			title="操作历史"
			:bordered="false"
		>
			<Log :logList="detailData.logList"></Log>
			<div
				class="tc mt16"
				v-if="!isOa"
			>
				<a-button @click="$router.go(-1)">
					<span style="font-size: 14px">返回</span>
				</a-button>
			</div>
		</a-card>
	</div>
</template>
<script>
import { API_SupplementalAgreementModifyDetail, API_GETLOGINBYMOBILE } from '@/v2/center/steels/api/contract.js';
import ChangeItem from './components/ChangeItem';
import ContractTemplate from '@/v2/components/template/index.vue';
import { getPersonalDetail } from '@/v2/utils/factory';
import { mapMutations } from 'vuex';
import Log from '@/v2/center/steels/components/Log.vue';
const agreementColumns = [
	{ title: '序号', dataIndex: 'serialNumber', fixed: 'left' },
	{ title: '字段名称', dataIndex: 'fieldCName' },
	{ title: '基于原合同条款', dataIndex: 'regulation' },
	{ title: '变更前', dataIndex: 'itemDetailsOld', scopedSlots: { customRender: 'itemDetailsOld' } },
	{ title: '变更后', dataIndex: 'itemDetails', scopedSlots: { customRender: 'itemDetails' } },
	{ title: '变更说明', dataIndex: 'description' }
];

const buyDetailsColumns2 = [
	{
		title: '序号',
		customRender: (text, record, index) => `${index + 1}`
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		key: 'materialName'
	},
	{
		title: '规格',
		dataIndex: 'specs',
		key: 'specs'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		key: 'materialTexture'
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		key: 'placeOfOrigin'
	},
	{
		title: '件数',
		dataIndex: 'pieceQuantity',
		key: 'pieceQuantity'
	},
	{
		title: '仓库',
		dataIndex: 'entrepot',
		key: 'entrepot'
	},
	{
		title: '数量(吨)',
		dataIndex: 'quantity',
		key: 'quantity'
	},
	{
		title: '含税单价（元/吨）',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice'
	},
	{
		title: '不含税单价（元/吨）',
		dataIndex: 'test3',
		key: 'test3'
	},
	{
		title: '含税金额',
		dataIndex: 'test4',
		key: 'test4'
	}
];
const buyDetailsColumns = [
	{ title: '序号', customRender: (text, record, index) => `${index + 1}` },
	{ title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
	{ title: '规格', dataIndex: 'specs', key: 'specs' },
	{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
	{ title: '质量指标', dataIndex: 'qualityStandard', key: 'qualityStandard' },
	{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
	{ title: '预设单价（元/吨）', dataIndex: 'presetUnitPrice', key: 'presetUnitPrice' }
];

export default {
	name: 'SuppleAgreementList',

	components: {
		ChangeItem,
		ContractTemplate,
		Log
	},

	data() {
		return {
			agreementColumns,
			transportFormField: [],
			url: '',
			isOa: false,
			detailData: {
				changeItems: []
			},
			isCanSubmit: false
		};
	},

	computed: {
		// 明细列表
		buyDetailsColumns() {
			if (
				this.detailData.contractTemplate == 'FINISHED_STEEL_BUY_002' ||
				this.detailData.contractTemplate == 'FINISHED_STEEL_SELL_005'
			) {
				return buyDetailsColumns2;
			}
			if (this.detailData.steelType == 'SCRAP_STEEL') {
				return [
					{ title: '序号', customRender: (text, record, index) => `${index + 1}` },
					{ title: '品种', dataIndex: 'materialName' },
					{ title: '数量', dataIndex: 'quantity', customRender: text => text || '-' },
					{ title: '预设单价(元/吨)', dataIndex: 'presetUnitPrice' }
				];
			}
			return buyDetailsColumns;
		}
	},

	created() {
		this.isOa = this.$route.name === 'OaSteelsSuppleAgreementDetail';
		this.url = this.$route.query.pdfPath;
		this.id = this.$route.query.id;
		const { contractId, companyUserId } = this.$route.query;
		if (this.isOa) {
			API_GETLOGINBYMOBILE({
				contractId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				getPersonalDetail(this.getDetail);
			});
			return;
		}
		this.getDetail();
	},

	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		openNewPage(supplementalAgreementNo) {
			const { contractId, contractNo, buyCompanyName, sellCompanyName } = this.detailData;
			let query = {
				contractNo,
				contractId,
				zipFileName: `${contractNo}-${buyCompanyName}-${sellCompanyName}.zip`,
				newTab: 'newTab'
			};
			if (supplementalAgreementNo) {
				query = {
					...query,
					no: supplementalAgreementNo
				};
			}
			const { href } = this.$router.resolve({
				path: '/center/contract/detail',
				query
			});
			window.open(href);
		},
		getDetail() {
			API_SupplementalAgreementModifyDetail({ id: this.id }).then(res => {
				if (res.success) {
					this.detailData = res.data;
				}
			});
		},
		jumpToPage() {
			let routeUrl = this.$router.resolve({
				path: '/center/steels/contract/buy/detail',
				query: {
					type: 'detail',
					contractId: this.detailData.contractId,
					flag: 'buy'
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		openPdf(url) {
			window.open(url, '_blank');
		},
		getData(data) {
			if (data.data.replace(/<[^>]+>/g, '') == '') {
				this.signContent = '';
			} else {
				this.signContent = data.data;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.oa-wrapper {
	padding: 20px;
}
.title {
	margin: 20px 0px 8px 0;
	font-weight: bold;
	font-size: 14px;
}
.completed {
	color: #52c41a;
}
::v-deep .select-template {
	display: none;
}
::v-deep .ant-input-number {
	width: auto;
}
</style>
