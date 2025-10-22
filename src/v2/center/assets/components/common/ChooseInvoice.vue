<template>
	<a-modal
		v-model="visible"
		width="1000px"
		@ok="okInc"
		title="选择发票"
	>
		<div class="contentBox">
			<div class="content">
				<a-row style="margin-top: 20px">
					<a-form
						:label-col="{
							span: 8
						}"
						:wrapper-col="{
							span: 14
						}"
					>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="发票代码">
								<a-input v-model="queryParams.code"></a-input>
							</a-form-item>
							<a-form-item label="发票号码">
								<a-input v-model="queryParams.no"></a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="开票日期">
								<a-range-picker
									v-model="time1"
									:placeholder="['开始时间', '结束时间']"
									format="YYYY-MM-DD"
									@change="getTime"
								/>
							</a-form-item>
							<a-form-item
								label=" "
								:colon="false"
							>
								<a-button
									type="primary"
									@click.native="getList"
									>查询</a-button
								>
								<a-button
									style="margin-left: 20px"
									@click.native="resetValues"
									>重置</a-button
								>
							</a-form-item>
						</a-col>
					</a-form>
				</a-row>
				<a-table
					:columns="filesColumns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					bordered
					:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
					@change="handleTableChange"
					:pagination="true"
					rowKey="id"
				>
				</a-table>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { API_GetReceivableInvoListLine } from '@/v2/center/assets/api/index.js';
export default {
	name: 'ChooseInvoice',
	// props: ["showChoose", "contractId", "contractType"],
	components: {
		// AssetsCompanyRelationChainModal
	},
	data() {
		return {
			visible: false,
			time1: null,
			queryParams: {
				pageSize: 10,
				pageNo: 1
			},
			dataSource: [],
			selectedRowKeys: [],
			filesColumns: [
				{ title: '发票代码', dataIndex: 'code', key: 'code' },
				{ title: '发票号码', dataIndex: 'no', key: 'no' },

				{
					title: '价税合计(元)',
					dataIndex: 'totalAmount',
					key: 'totalAmount'
				},
				{
					title: '不含税金额(元)',
					dataIndex: 'taxExcludedAmount',
					key: 'taxExcludedAmount'
				},
				{
					title: '税额(元)',
					dataIndex: 'taxAmount',
					key: 'taxAmount'
				},
				{
					title: '开票日期',
					dataIndex: 'issuedDate',
					key: 'issuedDate'
				},
				{
					title: '开票公司名称',
					dataIndex: 'sellerName',
					key: 'sellerName'
				}
			]
		};
	},
	// computed: {
	//     rowSelection() {
	//         const { selectedRowKeys } = this;
	//         const t = this;
	//         return {
	//             type: "checkbox",
	//             selectedRowKeys: selectedRowKeys,
	//             onSelect: (record) => {
	//                 t.selectedRowKeys = [record.id];
	//             },
	//         };
	//     },
	// },

	methods: {
		getList() {
			API_GetReceivableInvoListLine({
				...this.queryParams,
				contractId: this.contractId,
				contractType: this.contractType
			}).then(res => {
				this.dataSource = res.data.records || [];
			});
		},
		handleTableChange() {
			this.getList();
		},
		getTime(value, dateString) {
			this.queryParams.issuedDateBegin = dateString[0];
			this.queryParams.issuedDateEnd = dateString[1];
		},
		resetValues() {
			this.queryParams = {
				pageSize: 10,
				pageNo: 1
			};
			this.time1 = null;
			this.selectedRowKeys = [];
			this.dataSource = [];
			this.getList();
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		// onClickRow(record) {
		//     return {
		//         on: {
		//             click: () => {
		//                 this.selectedRowKeys.push(record.id);

		//             },
		//         },
		//     };
		// },
		show(id, type, selectedRowKeys) {
			this.visible = true;

			this.contractId = id;
			this.contractType = type;

			this.resetValues();
			if (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys;
			}
		},
		okInc() {
			let array = [];
			for (var i = 0; i < this.dataSource.length; i++) {
				if (this.selectedRowKeys.includes(this.dataSource[i].id)) {
					array.push(this.dataSource[i]);
				}
			}
			this.$emit('chooseFinInvo', array);
			this.visible = false;
		}
	}
};
</script>
<style lang="less" scoped></style>
