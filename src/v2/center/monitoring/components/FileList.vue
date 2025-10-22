<template>
	<div>
		<div style="text-align: right; margin-bottom: 15px">
			<!-- 下游负责人  已完善合同 状态未完结未发起审核 才可新建、编辑、删除 -->
			<template
				v-if="
					(contractType === 0 && businessLineType === 'UP') ||
					(contractType === 1 && businessLineType === 'DOWN') ||
					businessLineType === 'OFFLINE'
				"
			>
				<template v-if="needAdd && isEdit">
					<a-button
						type="primary"
						@click="goCreate('add', '')"
						>新增附件</a-button
					>
				</template>
			</template>
		</div>
		<a-table
			:pagination="false"
			:columns="columns"
			:data-source="filesData"
			:scroll="{ x: true }"
			rowKey="fileUrl"
		>
			<div
				slot="action"
				slot-scope="action, items"
			>
				<a
					@click.prevent="handlePreview(items)"
					v-if="items != null"
					>查看</a
				>
				<a
					href="javascript:;"
					@click="downFile(items)"
					v-if="items.dataSource != 1"
					>下载</a
				>
				<template v-if="contractType !== 2 && !isElectronicContract">
					<!-- 买卖合同不允许删除，否则下游会报错 -->
					<a-popconfirm
						title="确定删除该合同附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => goDelete(items)"
					>
						<a v-if="items.dataSource != 1 && isEdit && items.typeName !== '买卖合同'">删除</a>
					</a-popconfirm>
				</template>
			</div>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getContractFilesList"
		/>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	API_DeleteContractFiles,
	API_BusinessMonitoringUpstreamOtherAttachList,
	API_BusinessMonitoringDownstreamOtherAttachList,
	API_FullBusinessLineDetailOtherAttachList,
	API_DOWNLPREVIEWTE,
	API_GetDownloadRAR
} from '@/v2/center/monitoring/api';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import dataStatusDict from '../config/dataStatusDict';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';

const columns = [
	{ title: '附件类型', dataIndex: 'typeName' },
	{ title: '文件名', dataIndex: 'name' },
	{ title: '文件类型', dataIndex: 'ext' },
	{
		title: '来源',
		dataIndex: 'dataSourceName'
	},
	{
		title: '操作',
		fixed: 'right',
		slots: { title: 'customTitle' },
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	name: 'FileList',
	data() {
		return {
			columns,
			businessLineType: '',
			filesData: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			deliveryAttachTypeMap: {
				7: '下游合同补充协议',
				5: '其他材料'
			},
			params: {},
			contractNo: '',
			previewImg: ''
		};
	},
	props: [
		'contractId',
		'contractSerialNo',
		'dynamicMonitoringDetail',
		'needAdd',
		'contractType',
		'downOrderNo',
		'curUpstream',
		'downOrderId',
		'orderNo',
		'isElectronicContract',
		'belongContractType'
	],
	components: {
		iPagination,
		imageViewer
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		curDataStatusKey() {
			return dataStatusDict[this.contractType];
		},
		isEdit() {
			if (
				this.dynamicMonitoringDetail[this.curDataStatusKey] &&
				this.dynamicMonitoringDetail[this.curDataStatusKey].cnname != '已完结' &&
				this.dynamicMonitoringDetail[this.curDataStatusKey].cnname != '待审核'
			) {
				return true;
			} else {
				return false;
			}
		}
	},
	watch: {
		curUpstream() {
			this.getContractFilesList();
		},
		orderNo() {
			this.getContractFilesList();
		}
	},
	created() {
		this.contractNo = this.contractSerialNo;
		this.getContractFilesList();
	},
	methods: {
		goCreate(type, item) {
			// 编辑
			const temp = {
				path: '/center/monitoring/dynamicMonitoring/downStream/filesEdit',
				query: {
					type,
					contractSerialNo: [this.curUpstream.upOrderNo, this.downOrderNo][this.contractType],
					terminalContractId: [this.curUpstream.upOrderId, this.downOrderId][this.contractType],
					contractType: this.contractType
				}
			};
			if (type === 'edit' || type === 'detail') {
				temp.query.id = item.id;
			}
			this.$router.push(temp);
		},
		async goDelete(data) {
			// 删除合同附件
			const res = await API_DeleteContractFiles({
				terminalContractAttachmentId: data.id
			});
			if (res.success) {
				this.$message.success('删除成功');
				this.getContractFilesList();
			}
		},
		// 获取合同附件
		async getContractFilesList(pageNo = this.pagination.pageNo, pageSize = 10) {
			if (this.contractType !== 2) {
				if (this.belongContractType !== this.contractType) {
					return;
				}
			}
			this.businessLineType = this.$route.query.businessLineType;
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			if (this.contractType === 1) {
				this.params.contractNo = this.contractNo;
			} else {
				this.params.contractId = this.contractId;
			}
			const fct = [
				API_BusinessMonitoringUpstreamOtherAttachList,
				API_BusinessMonitoringDownstreamOtherAttachList,
				API_FullBusinessLineDetailOtherAttachList
			][this.contractType];
			const params = {
				...this.params,
				orderNo: this.orderNo,
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				downOrderNo: this.downOrderNo || '',
				businessLineType: this.businessLineType
			};
			const res = await fct(params);
			this.filesData = res.data.records;
			this.pagination.total = res.data.total;
		},
		// onPageState() {
		//   // 点击操作中的按钮，保存分页状态
		//   this.VUEX_setListPamars(this.pagination);
		// },

		handlePreview(data) {
			this.previewImg = data.fileUrl;
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				}
				return;
			}
			filePreview(this.previewImg, this.$refs.imageViewer.show);
		},
		downFile(item) {
			// 下载下载
			API_DOWNLPREVIEWTE(item.fileUrl).then(res => {
				if (item.name) {
					comDownload(res, undefined, item.name);
				} else {
					comDownload(res, item.fileUrl);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-table-tbody {
	td {
		div > a {
			display: inline-blok;
			margin-right: 8px;
		}
		div > a:last-child {
			margin-right: 0;
		}
	}
}
</style>
