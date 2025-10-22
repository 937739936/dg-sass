<template>
	<div>
		<div class="s-title">
			<span>异常发票</span>
		</div>
		<!-- 查询区域 -->
		<div
			class="table-page-search-wrapper"
			style="overflow: hidden"
		>
			<a-form
				style="margin-top: 20px"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 14 }"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="操作人所属企业">
							<a-input
								placeholder="请输入操作人所属企业"
								v-model="queryParam.operatorCompany"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="操作时间">
							<a-range-picker
								v-model="queryParam.operateDate"
								valueFormat="YYYY-MM-DD"
								format="YYYY-MM-DD"
								:placeholder="['开始日期', '结束日期']"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="发票代码">
							<a-input
								placeholder="请输入发票代码"
								v-model="queryParam.code"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="发票号码">
							<a-input
								placeholder="请输入发票号码"
								v-model="queryParam.no"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="开票日期">
							<a-range-picker
								v-model="queryParam.issuedDate"
								valueFormat="YYYY-MM-DD"
								format="YYYY-MM-DD"
								:placeholder="['开始日期', '结束日期']"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item class="order-wrap">
							<span>
								<a-button
									type="primary"
									@click="searchQuery"
									icon="search"
									>查询</a-button
								>
								<a-button
									type="primary"
									@click="searchReset"
									icon="reload"
									style="margin: 0 8px"
									>重置</a-button
								>
							</span>
						</a-form-item>
					</a-col>
					<a-button
						type="primary"
						icon="download"
						@click="toExport"
						style="margin-bottom: 20px"
						>导出</a-button
					>
				</a-row>
			</a-form>
		</div>
		<!-- table区域-begin -->
		<div>
			<a-table
				ref="table"
				size="middle"
				rowKey="no"
				:pagination="false"
				:scroll="{ x: true }"
				:columns="columns"
				:dataSource="dataSource"
				:loading="loading"
			>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import iPagination from "@sub/components/iPagination";
import { getUnusualList, exportUnusual } from '@/v2/center/trade/api/invoice';
export default {
	data() {
		return {
			columns: [
				{
					title: '操作人',
					align: 'center',
					dataIndex: 'operatorName',
					width: 150
				},
				{
					title: '操作人所属企业',
					align: 'center',
					dataIndex: 'operatorCompany',
					width: 150
				},
				{
					title: '发票上传企业',
					align: 'center',
					dataIndex: 'belongToCompany',
					width: 150
				},
				{
					title: '操作时间',
					align: 'center',
					dataIndex: 'operateTime',
					width: 150
				},
				{
					title: '发票代码',
					align: 'center',
					dataIndex: 'code',
					width: 150
				},
				{
					title: '发票号码',
					align: 'center',
					dataIndex: 'no',
					width: 150
				},
				{
					title: '发票类型',
					align: 'center',
					dataIndex: 'invoiceTypeDesc',
					width: 150
				},
				{
					title: '发票状态',
					align: 'center',
					dataIndex: 'stateDesc',
					width: 150
				},
				{
					title: '开票日期',
					align: 'center',
					dataIndex: 'issuedDate',
					width: 150
				},
				{
					title: '发票不含税金额',
					align: 'center',
					dataIndex: 'taxExcludedAmount',
					width: 150
				}
			],
			queryParam: {},
			dataSource: [],
			pagination: {
				type: 'unusualInvoiceList',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false,
			currentDate: ''
		};
	},
	mounted() {
		this.getList();
		this.getNowFormatDate();
	},
	methods: {
		getNowFormatDate() {
			// 获取当前日期  如20210706
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = '0' + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate;
			}
			this.currentDate = year.toString() + month.toString() + strDate.toString();
		},
		// 获取参数
		getQueryParams() {
			const params = {
				...this.queryParam
			};
			if (params.issuedDate) {
				params.issuedBeginDate = params.issuedDate[0];
				params.issuedEndDate = params.issuedDate[1];
				delete params.issuedDate;
			}
			if (params.operateDate) {
				params.operatorBeginDate = params.operateDate[0];
				params.operatorEndDate = params.operateDate[1];
				delete params.operateDate;
			}
			return params;
		},
		async getList(pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo || this.pagination.pageNo;
			const params = {
				pageNo: this.pagination.pageNo,
				pageSize: 10,
				...this.getQueryParams()
			};

			this.loading = true;
			try {
				const res = await getUnusualList(params);
				this.pagination.total = res.total || 0;
				this.dataSource = res.records || [];
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		async toExport() {
			const res = await exportUnusual(this.getQueryParams());
			comDownload(res, undefined, `异常发票记录${this.currentDate}.xlsx`);
		},
		searchQuery(e) {
			e.preventDefault();
			this.pagination.pageNo = 1;
			this.getList();
		},
		searchReset() {
			this.queryParam = {};
			this.pagination.pageNo = 1;
			this.getList();
		}
	},
	components: {
		iPagination
	}
};
</script>

<style scoped></style>
