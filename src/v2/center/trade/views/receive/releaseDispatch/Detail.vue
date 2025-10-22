<template>
	<div class="wrap slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<div class="title">
				查看发运明细
				<a
					class="back-btn"
					@click="
						() => {
							this.$router.back();
						}
					"
					>
				<BackIcon class="back-btn-icon"></BackIcon>返回</a>
			</div>
			<div class="car-number-info">
				<div class="car-number-title"><em></em><span>车号表信息</span></div>
				<a-row>
					<a-col :span="6">
						<div class="label">派车计划编号</div>
						<div class="value">{{ detailData.serialNo }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">合同编号</div>
						<div class="value">{{ detailData.contractNo }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">派车单位</div>
						<div class="value">{{ detailData.deliveryCompanyName }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">收货人名称</div>
						<div class="value">{{ detailData.consigneeCompanyName }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">累计发运车次</div>
						<div class="value">{{ detailData.shipNumberToatl }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">在途车次</div>
						<div class="value">{{ detailData.inTransitToatl }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">累计装车重量(吨)</div>
						<div class="value">{{ detailData.deliverQuantityTotal }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">累计在途重量(吨)</div>
						<div class="value">{{ detailData.inTransitQuantityTotal }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">累计卸货重量(吨)</div>
						<div class="value">{{ detailData.unloadQuantityTotal }}</div>
					</a-col>
					<a-col :span="6">
						<div class="label">累计盈亏重量(吨)</div>
						<div class="value">{{ detailData.profitQuantityTotal }}</div>
					</a-col>
				</a-row>
			</div>
			<div class="car-number-info">
				<div class="car-number-title">
					<em></em>
					<span>车号表信息查询</span>
					<div class="export-btn">
						<div
							class="btn"
							@click="exportCarNumberTable"
						>
							<ExportBgIcon class="icon2"></ExportBgIcon>
							<span>导出车号表</span>
						</div>
						<div
							class="btn"
							@click="exportPoundOrder"
						>
							<ExportBgIcon class="icon2"></ExportBgIcon>
							<span>批量下载磅单</span>
						</div>
					</div>
				</div>
				<!-- 查询区域 -->
				<SlForm
					:list="searchList"
					layout="inline"
					@change="changeSearch"
					:allowClear="false"
					:isShowIcon="false"
					:isShowSearchBox="true"
				></SlForm>
				<a-tabs
					v-model="status"
					@change="tabChange"
				>
					<a-tab-pane key="">
						<span slot="tab"> 全部({{ listData.allNum || 0 }}) </span>
					</a-tab-pane>
					<a-tab-pane
						v-for="(item, index) in statusData"
						:key="item.value"
					>
						<span slot="tab">
							{{ item.text }}(<template v-if="index == 0">{{ listData.notStartedNum || 0 }}</template
							><template v-else-if="index == 1">{{ listData.inTransitNum || 0 }}</template
							><template v-else>{{ listData.arrivedNum || 0 }}</template
							>)
						</span>
					</a-tab-pane>
				</a-tabs>
				<a-table
					:columns="columnsDetails"
					class="new-table"
					:bordered="false"
					:rowKey="(record, index) => `${record.id}-${index}`"
					:dataSource="list"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<span
						slot="action"
						slot-scope="text, record"
					>
						<a
							class="ant-dropdown-link"
							@click="viewImg(record)"
							v-if="record.status !== 'NOT_STARTED'"
							>查看磅单</a
						>
					</span>
				</a-table>
				<div class="new-pagination">
					<i-pagination
						:pagination="pagination"
						@change="getList"
					/>
				</div>
			</div>
			<imgView
				v-if="previewVisible"
				ref="imgView"
			/>
		</a-card>
	</div>
</template>

<script>
import {
	API_getDispatchPlanDetail,
	API_getDispatchPlanshippingDetail,
	API_exportDispatchCarNumberTable,
	API_exportDispatchPoundOrder
} from '@/v2/center/trade/api/receive';
import { columnsDetails } from './config/columns';
import SlForm from '@sub/components/ui-new/Form/sl-form.vue';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import imgView from './components/imgView.vue';
import ENV from '@/v2/config/env';
import breadcrumb from '@/v2/components/breadcrumb/index';
import { ExportBgIcon, BackIcon } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['plateNumber'],
		addonBeforeTitle: '车牌号',
		type: 'input',
		maxLength: 10,
		placeholder: '请输入车牌号',
		allowClear: true
	},
	{
		decorator: ['driverName'],
		addonBeforeTitle: '司机姓名',
		type: 'input',
		maxLength: 20,
		placeholder: '请输入司机姓名',
		allowClear: true
	},
	{
		decorator: ['driverMobile'],
		addonBeforeTitle: '司机联系方式',
		type: 'input',
		maxLength: 11,
		placeholder: '请输入司机联系方式',
		allowClear: true
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '发车日期',
		type: 'select',
		maxLength: 50,
		placeholder: '请选择发车日期',
		allowClear: true,
		options: []
	}
];
export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'details' }),
			columnsDetails,
			list: [],
			pagination: {
				total: 10, // 总条数
				pageNo: 1
			},
			loading: false,
			searchParams: {},
			searchList: [],
			statusData: filterCodeByKey('driverDispatchPlanStatusEnum'),
			status: '',
			previewVisible: false,
			detailData: {},
			listData: {}
		};
	},
	components: {
		SlForm,
		iPagination,
		imgView,
		breadcrumb,
		ExportBgIcon,
		BackIcon
	},
	mounted() {
		this.searchList = [...searchList];
		this.getDetail();
	},
	methods: {
		tabChange(val) {
			this.searchParams.status = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		async getDetail() {
			let res = await API_getDispatchPlanDetail({ id: this.$route.query.id });
			if (res.success) {
				this.detailData = res.data;
				this.getDeliverDate();
				this.getList();
			}
		},
		getDeliverDate() {
			// 获取发车日期选项内容
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'deliverDate') {
					if (this.detailData?.deliverDate?.length) {
						item.options = [];
						this.detailData?.deliverDate.forEach(pro => {
							let obj = {
								label: pro,
								value: pro
							};
							item.options.push(obj);
						});
					}
				}
			});
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values);
				}
			});
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.searchParams.orderSerialNo = this.detailData.orderSerialNo;
			this.searchParams.dispatchPlanSerialNo = this.detailData.serialNo;
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize
			};
			this.loading = true;
			try {
				const res = await API_getDispatchPlanshippingDetail(params);
				this.listData = res.data;
				this.list = res.data.pageData.records;
				this.pagination.total = res.data.pageData.total;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		changeSearch(data) {
			this.searchParams = data;
			this.searchParams.status = this.status;
			this.getList(1, this.pageSize);
		},
		// 导出
		async exportCarNumberTable() {
			const params = {
				orderSerialNo: this.detailData.orderSerialNo,
				dispatchPlanSerialNo: this.detailData.serialNo
			};
			const res = await API_exportDispatchCarNumberTable(params);
			comDownload(res, undefined, `车号表-${this.detailData.serialNo}.xls`);
		},
		async exportPoundOrder() {
			const params = {
				orderSerialNo: this.detailData.orderSerialNo,
				dispatchPlanSerialNo: this.detailData.serialNo
			};
			const res = await API_exportDispatchPoundOrder(params);
			comDownload(res, undefined, `磅单-${this.detailData.serialNo}.zip`);
		},
		viewImg(record) {
			// 查看磅单图片
			let fileArr = [];
			if (record.loadingScaleFilePath) {
				let obj = {
					name: '【装车磅单】-' + record.loadingScaleFileName,
					url: record.loadingScaleFilePath
				};
				fileArr.push(obj);
			}
			if (record.unloadScaleFilePath) {
				let obj = {
					name: '【卸车磅单】-' + record.unloadScaleFileName,
					url: ENV.BASE_NET + record.unloadScaleFilePath
				};
				fileArr.push(obj);
			}
			if (fileArr.length) {
				this.previewVisible = true;
				this.$nextTick(() => {
					this.$refs.imgView.viewPic(fileArr);
				});
			} else {
				this.$message.error('未找到磅单附件！');
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
@import url('~@/v2/style/pagination.less');
</style>
<style lang="less" scoped>
.wrap {
	.title {
		padding-bottom: 15px;
		font-size: 20px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		line-height: 28px;
		border-bottom: 1px solid #e9effc;
	}
	.car-number-info {
		margin: 30px 0 40px 0;
		.car-number-title {
			height: 26px;
			margin-bottom: 20px;
			em {
				display: inline-block;
				width: 2px;
				height: 18px;
				background: @primary-color;
				border-radius: 6px 0px 0px 6px;
				margin-right: 14px;
				position: relative;
				top: 3px;
			}
			span {
				font-size: 18px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
				line-height: 26px;
			}
		}
		.label {
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #8495aa;
			line-height: 22px;
			margin: 30px 0 6px 0;
		}
		.value {
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 22px;
		}
		.export-btn {
			float: right;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			top: -6px;
			.btn {
				padding: 0 14px;
				height: 38px;
				border-radius: 4px;
				border: 1px solid @primary-color;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				margin-left: 30px;
				span {
					font-size: 14px;
					font-family:
						PingFangSC-Regular,
						PingFang SC;
					font-weight: 400;
					color: @primary-color;
					line-height: 22px;
				}
			}
			.icon2 {
				width: 18px;
				height: 18px;
				vertical-align: middle;
				margin-right: 10px;
			}
		}
		.sl-form {
			margin-top: 12px;
		}
	}
	::v-deep {
		.ant-tabs {
			margin: 30px 0 10px 0;
			.ant-tabs-tab {
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #8495aa;
			}
			.ant-tabs-tab-active {
				color: rgba(0, 0, 0, 0.8);
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
			}
			.ant-tabs-bar {
				border-color: #e9effc;
				margin: 0;
			}
		}
	}
	.back-btn {
		float: right;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: @primary-color;
		line-height: 22px;
		cursor: pointer;
		.back-btn-icon {
			width: 14px;
			vertical-align: middle;
			margin-right: 5px;
		}
	}
}
</style>
