<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>我的提单</span
				>
				<a-button
					type="primary"
					icon="plus"
					v-auth="'steel:takeDelivery:add'"
					@click="apply"
				>
					<span style="font-size: 14px">提单开具</span>
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<p style="display: flex; justify-content: end; margin-top: 20px">
				<a-button
					type="primary"
					icon="export"
					@click="exportList"
					:disabled="disabledExport"
				>
					导出
				</a-button>
			</p>
			<a-table
				:columns="columns"
				:data-source="dataSource"
				:pagination="false"
				:scroll="{ x: 1200 }"
				:loading="loading"
				rowKey="serialNo"
				class="new-table"
				:row-selection="rowSelection"
				:customRow="onClickRow"
				style="margin-top: 20px"
			>
				<span
					slot="status"
					slot-scope="text, record"
				>
					{{ getStatusDesc(record.status) }}
				</span>
				<span
					slot="validity"
					slot-scope="text, record"
				>
					{{ record.takeStartDate }}-{{ record.takeEndDate }}
				</span>
				<span
					slot="methods"
					slot-scope="text, record"
				>
					<a-button
						type="link"
						@click.stop="edit(record, 'edit')"
						v-if="[1].includes(record.status)"
						v-auth="'steel:takeDelivery:edit'"
					>
						修改
					</a-button>
					<a-button
						type="link"
						@click.stop="details(record)"
						v-if="[1, 2, 3, 4, 5, 6, 7].includes(record.status)"
						v-auth="'steel:takeDelivery:view'"
					>
						查看
					</a-button>
					<a-button
						type="link"
						@click.stop="edit(record, 'input')"
						v-if="[7].includes(record.status) && record.realTakeStatus != 'ALL_SUBMIT'"
						v-auth="'steel:takeDelivery:operate'"
					>
						填写实提
					</a-button>
					<a-button
						type="link"
						@click.stop="seal(record)"
						v-if="[6].includes(record.status)"
						v-auth="'steel:takeDelivery:sign'"
					>
						盖章
					</a-button>
					<a-button
						type="link"
						@click.stop="sendEmail(record)"
						v-if="record.status == 7 && record.isSendMail == 2 && record.warehouseShortName != '厂提'"
					>
						发邮件
					</a-button>
					<a-button
						type="link"
						@click.stop="preview(record)"
						v-if="[7].includes(record.status) && record.generateWay !== 'ARTIFICIAL_COLLECTION'"
					>
						查看提单
					</a-button>
					<a-button
						type="link"
						@click.stop="edit(record, 'relation')"
						v-if="[2].includes(record.status) && record.isRelationCollection == 2"
						v-auth="'steel:takeDelivery:operate'"
					>
						关联回款
					</a-button>
					<a-button
						type="link"
						@click.stop="toVoid(record)"
						v-if="[1, 4, 5, 6, 7].includes(record.status)"
						v-auth="'steel:takeDelivery:operate'"
					>
						作废
					</a-button>
					<a-button
						type="link"
						@click.stop="edit(record, 'upload')"
						v-if="[5].includes(record.status)"
						v-auth="'steel:takeDelivery:operate'"
					>
						上传提单
					</a-button>
				</span>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>

		<viewer ref="viewer" />
		<preview ref="preview" />
		<email
			ref="email"
			v-on:update="getList"
		/>
		<void-dialog
			:fn="fn"
			ref="voidDialog"
			v-on:update="getList"
		/>
	</div>
</template>

<script>
import Pagination from './components/pagination.vue';
import { columns } from './config/orderList';
import Viewer from './components/viewer.vue';
import Email from './components/email.vue';
import comDownload from '@sub/utils/comDownload.js';
import {
	getTakeDeliveryPageList,
	getStartByLessor,
	exportTakeDelivery,
	exportSelectData,
	rejectBeforeCheck,
	rejectToVoid
} from '@/v2/center/steels/api/orderApply';
import moment from 'moment';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import Preview from './components/preview.vue';
import { debounce } from 'lodash';
import ENV from '@/v2/config/env';
import VoidDialog from './components/voidDialog.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '提货单号',
		type: 'input',
		placeholder: '请输入提货单号',
		allowClear: true
	},
	{
		decorator: ['warehouseShortName'],
		addonBeforeTitle: '仓库简称',
		type: 'select',
		placeholder: '请选择',
		'show-search': true,
		'filter-option': '',
		allowClear: true,
		options: []
	},
	{
		decorator: ['applyCompanyName'],
		addonBeforeTitle: '申请提货企业',
		type: 'input',
		placeholder: '请输入申请提货企业',
		allowClear: true
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '提货单状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterCodeBySteelKey('takeDeliveryStatus')
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['applyTakeSerialNo'],
		addonBeforeTitle: '提货申请单号',
		type: 'input',
		placeholder: '请输入提货申请单号',
		allowClear: true
	},
	{
		decorator: ['makePaperName'],
		addonBeforeTitle: '制单员',
		type: 'input',
		placeholder: '请输入制单员',
		allowClear: true
	},

	{
		decorator: ['date2'],
		addonBeforeTitle: '创建日期',
		realKey: ['takeStartDate', 'takeEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			url: {
				list: getTakeDeliveryPageList
			},
			data: [],
			columns,
			loading: false,
			takeDeliveryStatus: filterCodeBySteelKey('takeDeliveryStatus'),
			warehouseList: [],
			disabledExport: false,
			selectedRowKeys: [],
			selectAll: false,
			fn: rejectToVoid,
			searchList
		};
	},
	components: {
		Pagination,
		Viewer,
		Preview,
		Email,
		VoidDialog
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				onSelectAll: this.onSelectAll,
				type: 'checkbox',
				selections: []
			};
		}
	},
	mounted() {
		this.getList();
		this.handleWarehouseContractSearchShow();
		this.searchList[1]['filter-option'] = this.filterOptions;
	},
	methods: {
		onSelectAll(selected, selectedRows) {
			this.selectAll = selected;
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						if (this.selectedRowKeys.includes(record.serialNo)) {
							this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record.serialNo), 1);
						} else {
							this.selectedRowKeys.push(record.serialNo);
						}
					}
				}
			};
		},
		onSelectChange(keys) {
			this.selectedRowKeys = keys;
		},
		filterOptions(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		async handleWarehouseContractSearchShow(value) {
			const res = await getStartByLessor({ warehouseShortName: '' });
			this.warehouseList = res.data;
			this.searchList[1].options = res.data.map(el => {
				return {
					value: el.warehouseLessorId,
					label: el.warehouseShortName
				};
			});
		},
		getStatusDesc(value) {
			for (let i = 0; i < this.takeDeliveryStatus.length; i++) {
				if (this.takeDeliveryStatus[i].value == value) {
					return this.takeDeliveryStatus[i].label;
				}
			}
		},
		seal(row) {
			this.$router.push({
				path: '/center/take/order/seal',
				query: {
					id: row.id,
					contractId: row.contractId,
					serialNo: row.serialNo,
					pdfPath: row.pdfPath
				}
			});
		},
		// 勾选导出
		exportSelectDataList() {
			exportSelectData({
				serialNoList: this.selectedRowKeys.join(','),
				...this.form.getFieldsValue()
			}).then(res => {
				comDownload(res, undefined, `${moment().format('YYYYMMDD')}提货单导出.xls`);
			});
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		exportList() {
			if (this.selectedRowKeys.length) {
				this.exportSelectDataList();
				return;
			}
			this.disabledExport = true;
			exportTakeDelivery({
				...this.searchParams
			})
				.then(res => {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}提货单导出.xls`);
				})
				.finally(() => {
					this.disabledExport = false;
				});
		},

		toVoid(item) {
			if ([6, 5, 7].includes(item.status)) {
				rejectBeforeCheck({
					id: item.id
				}).then(res => {
					if (res.success && res.data) {
						this.$refs.voidDialog.showModal(item);
					}
				});
			} else {
				this.$refs.voidDialog.showModal(item);
			}
		},
		sendEmail(item) {
			this.$refs.email.showModal(item);
		},
		preview(item) {
			if (item.pdfPath) {
				this.$refs.preview.show(item.pdfPath, item);
			} else {
				const fileList = (item.attachList || []).map(item => `${location.origin}${ENV.BASE_GANG_API}/${item.fileUrl}`);
				if (!fileList.length) return
				this.$refs.viewer.show(fileList);
			}
		},
		edit(row, type) {
			// 判断 当前是否 依据合同开提单
			let path = '/center/take/order/step';
			// 购销
			if (row.issueMode == 'CONTRACT') {
				path = '/center/take/order/contract/stepTwo';
			}
			this.$router.push({
				path,
				query: {
					type: type,
					serialNo: row.applyTakeSerialNo,
					contractId: row.contractId,
					id: row.serialNo,
					num: row.id,
					status: row.status
				}
			});
		},
		details(row) {
			// 判断 当前是否 依据合同开提单
			let path = '/center/take/order/step';
			// 购销
			if (row.issueMode == 'CONTRACT') {
				path = row.generateWay === 'ARTIFICIAL_COLLECTION' ? '/center/take/order/contract/stepTwoAdditional' : '/center/take/order/contract/stepTwo';
			}
			this.$router.push({
				path,
				query: {
					type: 'preview',
					serialNo: row.applyTakeSerialNo,
					contractId: row.contractId,
					id: row.serialNo,
					num: row.id,
					status: row.status
				}
			});
		},
		apply() {
			this.$router.push({
				path: '/center/take/order/step'
			});
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			if (this.url?.list) {
				this.pageSize = pageSize;
				this.pagination.pageNo = pageNo;
				const params = {
					...this.isorter,
					...this.defaultParams,
					...this.searchParams,
					...this.pagination,
					pageSize
				};
				delete params.issuedDate;
				this.loading = true;
				try {
					const res = await this.url.list(params);
					this.dataSource = res.data ? res.data.records : res.result.records;
					this.pagination.total = res.data ? res.data.total : res.result.total;
					this.loading = false;
					if (this.selectAll) {
						this.dataSource.forEach(el => {
							if (!this.selectedRowKeys.includes(item.serialNo)) {
								this.selectedRowKeys.push(item.serialNo);
							}
						});
					}
				} catch (error) {
					this.loading = false;
				}
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.ant-advanced-search-form {
	margin-top: 20px;
}
/deep/ .ant-table-thead {
	.ant-table-selection-column-custom {
		.ant-table-selection {
			margin-right: 0;
		}
	}
}
</style>
