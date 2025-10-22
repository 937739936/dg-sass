<template>
	<div class="tabs-content">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="detail"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space>
						<a
							v-if="
								(items.terminateType !== 'RESCISSION_OF_AGREEMENT' && items.attachment && items.attachment.length) ||
								items.terminateType == 'RESCISSION_OF_AGREEMENT'
							"
							@click="viewFile(items)"
							>查看</a
						>
						<!-- 待盖章状态下   盖章按钮 -->
						<router-link
							v-if="
								VUEX_ST_COMPANYSUER.companyUscc != $route.query.terminalContractInitiatorUscc &&
								['CONFIRM_WAIT_SIGN_SEAL'].includes(items.status) &&
								(currentUserRolesList.includes('ADMIN') || currentUserRolesList.includes('SIGNER'))
							"
							:to="{
								path: '/center/contract/' + $route.query.type.toLowerCase() + '/termination/stamp',
								query: {
									orderId: $route.query.id,
									type: $route.query.type,
									logId: items.id,
									serialNo: data.contract.serialNo,
									relieveContractPdfPath: relieveContractPdfPath,
									id: $route.query.id,
									terminalContractInitiatorUscc: $route.query.terminalContractInitiatorUscc
								}
							}"
							>盖章</router-link
						>
						<router-link
							v-if="
								VUEX_ST_COMPANYSUER.companyUscc == $route.query.terminalContractInitiatorUscc &&
								['WAIT_SIGN_SEAL'].includes(items.status) &&
								(currentUserRolesList.includes('ADMIN') || currentUserRolesList.includes('SIGNER'))
							"
							:to="{
								path: '/center/contract/' + $route.query.type.toLowerCase() + '/termination/stamp',
								query: {
									orderId: $route.query.id,
									type: $route.query.type,
									logId: items.id,
									serialNo: data.contract.serialNo,
									relieveContractPdfPath: relieveContractPdfPath,
									id: $route.query.id,
									terminalContractInitiatorUscc: $route.query.terminalContractInitiatorUscc
								}
							}"
							>盖章</router-link
						>
						<!-- 待确认状态下   确认按钮 -->
						<router-link
							v-if="
								VUEX_ST_COMPANYSUER.companyUscc != $route.query.terminalContractInitiatorUscc &&
								items.status == 'WAIT_CONFIRM' &&
								(currentUserRolesList.includes('ADMIN') || currentUserRolesList.includes('OPERATOR'))
							"
							:to="{
								path: '/center/contract/' + $route.query.type.toLowerCase() + '/confirm/stop',
								query: {
									orderId: $route.query.id,
									logId: items.id,
									serialNo: data.contract.serialNo,
									relieveContractPdfPath: relieveContractPdfPath,
									id: $route.query.id,
									type: $route.query.type
								}
							}"
							>确认</router-link
						>
					</a-space>
				</template>
			</a-table>
		</div>
		<a-modal
			width="70%"
			okText="解除合同协议"
			@cancel="
				() => {
					visible = false;
				}
			"
			:footer="null"
			:visible="visible"
		>
			<pdf-preview
				v-if="relieveContractPdfPath"
				:url="relieveContractPdfPath"
			></pdf-preview>
		</a-modal>
		<a-modal
			okText="返回"
			@cancel="
				() => {
					visibleFile = false;
				}
			"
			:footer="null"
			title="查看"
			:visible="visibleFile"
		>
			<a-table
				:columns="stopFileColumns"
				:data-source="stopFileDataSource"
			>
				<template
					slot="operation"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="openFile(record.fileUrl)"
						class="edit-btn"
						>预览</a
					>
					<a
						href="javascript:;"
						@click="downloadFile(record)"
						class="edit-btn"
						style="padding-left: 8px"
						>下载</a
					>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>

<script>
const columns = [
	{ title: '申请编号', dataIndex: 'applyNo' },
	{ title: '终止状态', dataIndex: 'statusDesc' },
	{ title: '终止类型', dataIndex: 'terminateTypeDesc' },
	{ title: '终止原因', dataIndex: 'terminateReason' },
	{ title: '业务联系人', dataIndex: 'contacts' },
	{ title: '申请时间', dataIndex: 'applyTime' },
	{ title: '审批时间', dataIndex: 'auditTime' },
	{ title: '驳回原因', dataIndex: 'rejectReason' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
import { API_listOrderTerminateLog, API_DOWNLPREVIEWTE } from '@/v2/center/trade/api/contract';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import PdfPreview from '@sub/components/pdf/index.vue';
import { filterCodeByTextName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			filterCodeByTextName: filterCodeByTextName,
			columns,
			detail: [],
			visibleFile: false,
			visible: false,
			stopFileColumns: [
				{
					title: '名称',
					dataIndex: 'name'
				},
				{
					title: '操作',
					dataIndex: 'operation',
					scopedSlots: { customRender: 'operation' }
				}
			],
			stopFileDataSource: [],
			loading: false,
			relieveContractPdfPath: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentUserRolesList() {
			return this.VUEX_ST_COMPANYSUER.roles.map(item => item.code?.toUpperCase());
		}
	},
	props: ['data'],
	components: {
		PdfPreview
	},
	watch: {
		data: {
			handler(val) {},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			API_listOrderTerminateLog({ orderId: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detail = res.data;
					this.detail.forEach((item, index) => {
						item.id = index;
					});
				}
			});
		},
		viewFile(record) {
			// 查看解除合同协议
			if (record.terminateType == 'RESCISSION_OF_AGREEMENT') {
				this.visible = true;
				this.relieveContractPdfPath = record?.attachment[0]?.fileUrl;
			} else {
				this.stopFileDataSource = [];
				if (record.attachment) {
					record.attachment.map((item, index) => {
						item.name = `附件${index + 1}：${item.fileName}`;
						this.stopFileDataSource.push(item);
					});
				}
				this.visibleFile = true;
			}
		},
		openFile(url) {
			window.open(url, '_blank');
		},
		downloadFile(record) {
			let url = record.fileUrl;
			if (url) {
				let BASE_NET = ENV.BASE_NET;
				API_DOWNLPREVIEWTE(BASE_NET + url).then(res => {
					comDownload(res, null, record.fileName || record.name);
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
</style>
