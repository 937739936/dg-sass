<template>
	<div class="slMain">
		<Breadcrumb :routes="routes" />
		<a-card
			:bordered="false"
			class="a-card-border-bottom"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>发货计划详情</span>
			</div>
			<div>
				<div class="slTitleAssis">基本信息</div>
				<a-form
					:form="baseInfoForm"
					:colon="false"
					class="slFormDetail"
				>
					<a-row>
						<a-col :span="8">
							<a-form-item label="发货企业">
								<a-input
									disabled
									v-model="detail.sellCompanyName"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="收货仓库">
								<a-input
									disabled
									v-model="detail.warehouseAbbreviation"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="货主企业">
								<a-input
									disabled
									v-model="VUEX_ST_COMPANYSUER.companyName"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="运输方式">
								<a-input
									disabled
									v-model="detail.transportModeDesc"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="到库通知人员">
								<a-input
									disabled
									v-model="detail.noticeUsers"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="上游合同号">
								<a-input
									disabled
									v-model="detail.contractNo"
								></a-input>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>

				<div class="slTitleAssis">发运货物明细</div>
				<a-table
					style="margin-top: 20px; margin-bottom: 30px"
					:columns="detail.transportMode === 'TRAIN' ? trainColumns : autoMobileColumns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="detail.particularsList || []"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="arriveStatusDesc"
						slot-scope="text, items"
					>
						<span :class="'status ' + items.arriveStatus">{{ text }}</span>
					</template>
					<!-- 操作 -->
					<template
						slot="action"
						slot-scope="text, items"
						v-if="detail.transportMode === 'TRUCKS'"
					>
						<a @click="viewAutoMobileTravel(items)">查看轨迹</a>
					</template>
				</a-table>
				<!-- 只有火运展示 -->
				<template v-if="detail.transportMode === 'TRAIN'">
					<div class="slTitleAssis">
						发货信息
						<a-button
							v-if="detail.transportMode === 'TRAIN'"
							type="primary"
							ghost
							style="margin-left: 30px"
							@click="viewTrainTravel"
							:disabled="!detail.arriveStatus"
							>查看运输轨迹</a-button
						>
					</div>
					<a-form
						:form="deliverInfoForm"
						:colon="false"
						class="slFormDetail"
					>
						<a-row>
							<a-col :span="8">
								<a-form-item label="托运人名称">
									<a-input
										disabled
										v-model="detail.consignor"
									></a-input>
								</a-form-item>
							</a-col>
							<a-col :span="8">
								<a-form-item label="运单号">
									<a-input
										disabled
										v-model="detail.waybillNo"
									></a-input>
								</a-form-item>
							</a-col>
							<a-col :span="8">
								<a-form-item label="到库状态">
									<a-input
										disabled
										v-model="detail.arriveStatusDesc"
									></a-input>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</template>
				<div class="slTitleAssis">附件信息</div>
				<div class="upload-wrap">
					<FileUpload
						:ifEditable="false"
						:fileDataSource="fileDataSource"
						:type="'deliverPlan'"
						ref="uploadFiles"
					>
					</FileUpload>
				</div>
			</div>
			<div class="btn-wrap">
				<a-button @click="$router.go(-1)">返回</a-button>
			</div>
		</a-card>
	</div>
</template>

<script>
const trainColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 80,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) < 10 ? '0' + (parseInt(index) + 1) : parseInt(index) + 1;
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		customCell: () => {
			return {
				style: {
					'min-width': '100px'
				}
			};
		}
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		customCell: () => {
			return {
				style: {
					'min-width': '100px'
				}
			};
		}
	},
	{
		title: '规格',
		dataIndex: 'specs',
		customCell: () => {
			return {
				style: {
					'min-width': '100px'
				}
			};
		}
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		customRender: text => {
			return text || '-';
		},
		customCell: () => {
			return {
				style: {
					'min-width': '100px'
				}
			};
		}
	},
	{
		title: '发货数量',
		dataIndex: 'shipmentAmount',
		customRender: text => {
			return text || '-';
		},
		customCell: () => {
			return {
				style: {
					'min-width': '120px'
				}
			};
		}
	},
	{
		title: '发货重量(吨)',
		dataIndex: 'shipmentQuantity',
		customCell: () => {
			return {
				style: {
					'min-width': '120px'
				}
			};
		}
	},
	{
		title: '备注',
		dataIndex: 'remark',
		customRender: text => {
			return text || '-';
		}
	}
];
const autoMobileColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 80,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) < 10 ? '0' + (parseInt(index) + 1) : parseInt(index) + 1;
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		customCell: column => {
			return {
				style: {
					'min-width': '100px'
				}
			};
		}
	},
	{ title: '材质', dataIndex: 'materialTexture' },
	{ title: '规格', dataIndex: 'specs' },
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		customRender: text => {
			return text || '-';
		}
	},
	{
		title: '发货数量',
		dataIndex: 'shipmentAmount',
		customRender: text => {
			return text || '-';
		}
	},
	{ title: '发货重量(吨)', dataIndex: 'shipmentQuantity' },
	{ title: '车牌号', dataIndex: 'plateNumber' },
	{ title: '车辆出厂日期', dataIndex: 'startDate' },
	{ title: '到库状态', dataIndex: 'arriveStatusDesc', scopedSlots: { customRender: 'arriveStatusDesc' } },
	{
		title: '备注',
		dataIndex: 'remark',
		customRender: text => {
			return text || '-';
		}
	},
	{ title: '操作', scopedSlots: { customRender: 'action' }, align: 'center', dataIndex: 'action', fixed: 'right' }
];
import Breadcrumb from '@/v2/center/steels/components/Breadcrumb.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';
import FileUpload from './components/FileUpload.vue';
import { API_ShipmentPlanDetail } from '@/v2/center/steels/api/deliverPlan.js';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			getPopupContainer,
			baseInfoForm: this.$form.createForm(this, { name: 'baseInfo' }),
			deliverInfoForm: this.$form.createForm(this, { name: 'deliverInfo' }),
			routes: [
				{
					path: '',
					name: '发货计划管理'
				},
				{
					path: '/center/steels/deliverPlan/list',
					name: '发货计划'
				},
				{
					path: '/center/steels/deliverPlan/detail',
					name: '发货计划详情'
				}
			],
			fileInfos: [],
			fileDataSource: [],
			detail: {},
			trainColumns,
			autoMobileColumns
		};
	},
	components: {
		Breadcrumb,
		FileUpload
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		}
	},
	methods: {
		getDetail() {
			API_ShipmentPlanDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detail = res.data || {};
					let str = '';
					if (this.detail.noticeUsers.length) {
						this.detail.noticeUsers.forEach((item, index) => {
							if (item.noticeName) {
								str = str + item.noticeName + '-' + item.noticePhone;
							} else {
								str = str + item.noticePhone;
							}
							if (index < this.detail.noticeUsers.length - 1) {
								str = str + '，';
							}
						});
					}
					this.detail.noticeUsers = str;
					this.fileDataSource = this.detail.attachList || [];
				}
			});
		},
		// 查看火运轨迹
		viewTrainTravel() {
			window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + this.$route.query.id + '&from=steels', '_blank');
		},
		viewAutoMobileTravel(record) {
			window.open('/logistics/logisticsDetailCarNew?id=' + record.id + '&from=steels', '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
/deep/.ant-select-selection__rendered,
/deep/.ant-select-selection {
	height: auto !important;
}
.upload-wrap {
	margin-top: 20px;
}
.status {
	padding: 3px 5px;
	height: 20px;
	line-height: 20px;
	border-radius: 4px;
	font-size: 14px;
	zoom: 0.85;
}
.ARRIVED {
	background: #c5ecdd;
	color: #3eb384;
}
.NOT_ARRIVED {
	background: #c9daff;
	color: #596fa0;
}
.PART_ARRIVED {
	background: #c1d7ff;
	color: #4682f3;
}
</style>
