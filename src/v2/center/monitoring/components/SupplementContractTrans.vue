<template>
	<div style="display: inline-block; width: 100%">
		<div class="contract-content">
			<a-tabs default-active-key="1">
				<a-tab-pane
					key="1"
					tab="合同信息"
				>
					<a-descriptions :column="2">
						<a-descriptions-item label="合同类型">{{ contractTypeDesc }}</a-descriptions-item>
						<a-descriptions-item label="合同编号">{{ dynamicMonitoringTransDetail.paperContractNo }}</a-descriptions-item>
						<a-descriptions-item label="承运人">{{ transportContract.consigneeCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="托运人">{{ transportContract.consignorCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="合同有效期"
							>{{ dynamicMonitoringTransDetail.execDateStart }}-{{
								dynamicMonitoringTransDetail.execDateEnd
							}}</a-descriptions-item
						>
						<a-descriptions-item label="签订日期">{{ dynamicMonitoringTransDetail.contractSignTime }}</a-descriptions-item>
						<a-descriptions-item label="合同签约状态">{{
							dynamicMonitoringTransDetail.signStatus == 2 ? '双签' : '单签'
						}}</a-descriptions-item>
						<a-descriptions-item label="运输公司收款账户">
							{{ dynamicMonitoringTransDetail.receivableBankName }} - {{ dynamicMonitoringTransDetail.receivableBankNo }}
						</a-descriptions-item>
						<a-descriptions-item label="运输方式">{{ transportContract.transportModeDesc }}</a-descriptions-item>
						<a-descriptions-item label="起运地">{{ transportContract.origin }}</a-descriptions-item>
						<a-descriptions-item label="目的地">{{ transportContract.destination }}</a-descriptions-item>
						<a-descriptions-item label="合同价格（元/吨）">{{ dynamicMonitoringTransDetail.contractPrice }}</a-descriptions-item>
						<a-descriptions-item label="运输吨数">{{ dynamicMonitoringTransDetail.contractQuantity }}</a-descriptions-item>
					</a-descriptions>
				</a-tab-pane>
				<!-- 纸质合同均展示, 全业务线查看contractType=2不展示-->
				<a-tab-pane
					key="2"
					tab="合同附件"
					force-render
				>
					<div style="width: 100%">
						<OfflineCotractFilesTable
							:contractAttachment="dynamicMonitoringTransDetail.terminalAttachmentVO || []"
							:supplementalInfo="dynamicMonitoringTransDetail.supplementalInfo || []"
						/>
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import OfflineCotractFilesTable from './OfflineCotractFilesTable';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_LogisticsContract } from '@/v2/center/monitoring/api/transportBusiness';

const columns = [
	{ title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
	{ title: '审核状态', dataIndex: 'auditStatusText', key: 'auditStatusText' },
	{ title: '审核意见', dataIndex: 'rejectReason', key: 'rejectReason' },
	{ title: '审核时间', dataIndex: 'auditTime', key: 'auditTime' },
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 100
	}
];
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeName', key: 'typeName' },
	{ title: '文件格式', dataIndex: 'ext', key: 'ext' },
	{
		title: '文件名',
		dataIndex: 'name',
		key: 'name',
		scopedSlots: { customRender: 'name' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 100
	}
];

export default {
	name: 'ContractContent',
	components: {
		imageViewer,
		OfflineCotractFilesTable
	},
	props: {
		contractType: {
			type: [Number, String],
			default: 0
		},
		downOrderNo: {
			type: [Number, String],
			default: ''
		},
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		orderNo: {
			type: String,
			default: ''
		},
		transContractNo: {
			type: String,
			default: ''
		},
		info: {
			default: () => {
				return {};
			}
		}
	},
	filters: {
		filterCodeByValueName
	},
	data() {
		return {
			columns,
			contractTypeText: '',
			recordDetailVisible: false,
			recordListVisible: false,
			detailForm: {},
			params: {},
			fileDataSource: [], // 从详情接口获取的数据
			fileInfos: [], // 从上传子组件传回的数据
			recordDetail: {
				attachment: {}
			},
			recordListDataSource: [], //审核记录
			businessLineType: '',
			filesColumns,
			previewImg: '',
			videoVisible: false,
			contractTimeTypeList: filterCodeByKey('contractTermEnums'),
			dynamicMonitoringTransDetail: {},
			transportContract: {}
		};
	},
	computed: {
		contractTypeDesc() {
			const result = this.contractTimeTypeList.filter(item => item.value == this.dynamicMonitoringTransDetail.contractTermType);
			return result[0]?.text || '';
		}
	},
	watch: {},
	mounted() {
		this.getDetailsData();
	},
	methods: {
		getDetailsData() {
			const no = this.transContractNo;
			if (!no) return;
			API_LogisticsContract({
				contractNo: no,
				_time: new Date().getTime()
			}).then(res => {
				if (res.success) {
					this.transportContract = res.data.terminalDeliveryVO;
					this.dynamicMonitoringTransDetail = res.data;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.collection-account {
	display: table-cell;
	margin-right: 5px;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.recordDetailVisible .ant-form-item {
	display: flex;
	font-size: 14px;
}
.contract-title {
	font-weight: bold;
	margin: 20px 0;
	font-size: 16px;
}
</style>
