<template>
	<div
		style="width: 100%"
		class="audit-records"
	>
		<!--风控的审批记录-->
		<template v-for="(item, index) in auditRecords">
			<div :key="index">
				<a-table
					v-if="item.fin.length > 0"
					style="width: 100%; margin-bottom: 40px"
					bordered
					:rowKey="(record, index) => index"
					:columns="cols"
					:pagination="false"
					:dataSource="item.fin"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
				<!--cssoa 和其他oa 审批记录 （一般贸易商不展示）-->
				<a-table
					v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' && [...item.ccs, ...item.oth].length > 0"
					bordered
					style="width: 100%; margin-bottom: 40px"
					:rowKey="(record, index) => index"
					:columns="cols"
					:pagination="false"
					:dataSource="[...item.ccs, ...item.oth]"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</div>
		</template>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
	props: {
		dataSource: Array
	},
	name: 'AuditRecords',
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	created() {
		//如果当前登陆账户为一般贸易商 不展示电子签名
		if (this.VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY') {
			this.cols.splice(1, 1);
			this.cols.forEach(e => {
				e.width = '33.33%';
			});
		}
	},
	data() {
		return {
			title: '审批进度',
			cols: [
				{
					title: '节点名称',
					dataIndex: 'nodeName',
					width: '25%',
					align: 'center',
					slots: { title: 'customTitle' },
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '电子签名',
					dataIndex: 'signature',
					width: '25%',
					align: 'center'
				},
				{
					title: '签名时间',
					dataIndex: 'signatureDate',
					width: '25%',
					align: 'center',
					customRender(text) {
						return moment(text).format('YYYY-MM-DD HH:mm:ss');
					}
				},
				{
					title: '操作',
					dataIndex: 'operation',
					width: '25%',
					align: 'center'
				}
			],
			auditRecords: [
				{
					//易煤风控审批信息
					fin: [],
					//ccs审批信息
					ccs: [],
					//其他审批信息
					oth: []
				}
			]
		};
	},
	methods: {
		dataHandle(data) {
			this.auditRecords = [];
			/**
			 * 数据结构说明
			 * 当来源source 为null 时 则为判定为老数据 不存在多次审批 否则为新数据 则可能存在多次审批
			 * 后端返回的数组已经根据source来源按照 易煤风控 易煤风控oa 和 其他oa的顺序进行了排序
			 * 新数据可能存在多次审批的情况，source为易煤风控的数据到下一个source为易煤风控的数据项 视为一次审批
			 * oa审批流程为 易煤风控 易煤风控oa 和 其他oa 的顺序 串行，因此前端无需进行二次排序
			 * */
			if (Array.isArray(data)) {
				let auditTimes = data.filter(item => item.source === '易煤风控').length;
				data.forEach((item, index) => {
					//如果数据无来源 或 当前数据项为来源为易煤风控，新增加一组数据
					if (auditTimes === 0 || item.source === '易煤风控') {
						this.auditRecords.push({
							fin: [],
							ccs: [],
							oth: []
						});
					}
					//数组末尾下标
					let cur = this.auditRecords.length - 1;
					if (item.source === '易煤风控') {
						this.auditRecords[cur].fin.push(...item.approveRecordList);
					} else if (item.source === 'CCS_OA') {
						this.auditRecords[cur].ccs.push(...item.approveRecordList);
					} else {
						this.auditRecords[cur].oth.push(...item.approveRecordList);
					}
				});
			}
		}
	},
	watch: {
		dataSource: {
			immediate: true,
			handler(n) {
				// 空数据不进行处理
				if (n === null || n.length === 0) {
					return;
				}
				this.dataHandle(n);
			}
		}
	}
};
</script>

<style>
.audit-records .ant-table-placeholder {
	border-bottom: 1px solid #e8e8e8 !important;
	border-top: 1px solid #e8e8e8 !important;
}

.audit-records .ant-table-column-title {
	font-weight: bold;
}
</style>
