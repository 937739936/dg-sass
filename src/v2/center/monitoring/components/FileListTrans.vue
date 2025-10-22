<template>
	<div>
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
	API_DOWNLPREVIEWTE,
	API_GetDownloadRAR
} from '@/v2/center/monitoring/api';
import { getTransAttachList } from '../api/transportBusiness.js';
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
		'belongContractType',
		'transContractNo'
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
		//判断是否符合新增修改条件，我也不知道是啥，只是见他用的多的，看起来太麻烦，做个整理 --郭凯宣 2022/7/19
		isEdit() {
			if (
				this.dynamicMonitoringDetail[this.curDataStatusKey] &&
				(this.dynamicMonitoringDetail.terminalDirectorId == this.VUEX_ST_COMPANYSUER.companyUserId ||
					this.VUEX_ST_COMPANYSUER.companyUserRoles.indexOf('admin') != -1) &&
				this.dynamicMonitoringDetail[this.curDataStatusKey].cnname != '已完结' &&
				this.dynamicMonitoringDetail[this.curDataStatusKey].cnname != '待审核'
			) {
				return true;
			} else {
				return false;
			}
		}
	},
	watch: {},
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
			this.businessLineType = this.$route.query.businessLineType;
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			const params = {
				...this.params,
				contractNo: this.transContractNo
			};
			const res = await getTransAttachList(params);
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
