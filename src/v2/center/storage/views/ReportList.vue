<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>报表管理</span
				>
				<div>
					<a-button
						type="primary"
						class="mr16"
						v-auth="'warehouse:report:import'"
						@click="leadModel"
					>
						导入报表
					</a-button>
					<a-button
						type="primary"
						class="mr16"
						v-auth="'warehouse:report:exportXls'"
						@click="exportModel"
					>
						导出报表
					</a-button>
					<a-button
						type="primary"
						class="mr16"
						v-auth="'warehouse:report:location'"
						@click="reportLoc"
						v-debounceclick
					>
						获取经纬度
					</a-button>
				</div>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
			></SlFormNew>
			<a-tabs
				v-model="defaultParams.type"
				@change="tabChange"
			>
				<a-tab-pane
					:key="item"
					:tab="item"
					v-for="item in typeList"
				></a-tab-pane>
				<a-date-picker
					slot="tabBarExtraContent"
					v-model="defaultParams.uploadDataTime"
					@change="dataChange"
					placeholder="请选择签订日期"
					:allowClear="false"
					valueFormat="YYYY-MM-DD"
				>
				</a-date-picker>
			</a-tabs>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<a
							class="mr16"
							v-auth="'warehouse:report:edit'"
							@click="jumpPage('/center/storageCenter/report/detail', record)"
						>
							修改
						</a>
						<a-popconfirm
							title="您确定要删除该条数据么？"
							okText="确定"
							cancelText="取消"
							@confirm="() => del(record)"
						>
							<a v-auth="'warehouse:report:delete'">删除</a>
						</a-popconfirm>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
			<a-modal
				title="报表导出"
				:visible="exportVisible"
				:confirm-loading="exportLoading"
				@ok="exportOk"
				:width="700"
				@cancel="exportVisible = false"
			>
				<a-form
					:form="exportForm"
					v-bind="formLayout"
				>
					<a-form-item label="选择导出报表对应日期">
						<a-date-picker
							v-decorator="[
								'reportDate',
								{
									rules: [{ required: true, message: '选择日期' }]
								}
							]"
							placeholder="选择日期"
							:allowClear="false"
							valueFormat="YYYY-MM-DD"
						>
						</a-date-picker>
					</a-form-item>
					<a-form-item label="导出说明">
						<p>系统自动按照导入日期保存报表数据，导出时须选择导出的数据对应的日期。</p>
					</a-form-item>
				</a-form>
			</a-modal>
			<a-modal
				title="报表导入"
				:visible="leadVisible"
				:confirm-loading="leadLoading"
				@ok="leadOk"
				:width="700"
				@cancel="leadVisibleFalse"
			>
				<a-form
					:form="leadForm"
					v-bind="formLayout"
				>
					<a-form-item label="导入日期">
						<a-date-picker
							v-decorator="[
								'uploadTime',
								{
									rules: [{ required: true, message: '选择导入日期' }]
								}
							]"
							placeholder="选择导入日期"
							:allowClear="false"
							valueFormat="YYYY-MM-DD"
						>
						</a-date-picker>
					</a-form-item>
					<a-form-item label="报表导入">
						<a-upload
							name="file"
							:multiple="true"
							:accept="acceptFormat"
							:beforeUpload="beforeUpload"
							:remove="handleRemove"
							:fileList="leadFild"
						>
							<a-button> <a-icon type="upload" /> 点击选择 </a-button>
						</a-upload>
						<div
							class="has-error"
							v-if="fileErr"
						>
							<div
								class="ant-form-explain"
								v-html="fileErrHtml"
							></div>
						</div>
					</a-form-item>
					<a-form-item label="导入要求">
						<p>
							1.该功能仅支持上传Excel文件（*.xls、*.xlsx），请
							<a :href="publicPath + 'files/农开报表模板.xlsx'">下载模板 </a>
							填写后上传，或导出历史报表修改数据后上传。<br />
							2.请务必将必填字段填写准确完整，否则可能识别、添加失败。
						</p>
					</a-form-item>
				</a-form>
			</a-modal>
			<a-modal
				title="全年总量"
				:visible="getTotalSetVisible"
				:confirm-loading="getTotalSetLoading"
				@ok="getTotalSetOk"
				@cancel="getTotalSetVisible = false"
			>
				<a-form
					:form="getTotalSetForm"
					v-bind="formLayout"
				>
					<a-form-item label="小麦全年总量(吨)">
						<a-input-number
							style="width: 100%"
							step="1"
							:precision="0"
							:min="0"
							v-decorator="[
								`wheat`,
								{
									rules: [
										{
											required: true,
											message: `小麦全年总量(吨)`
										}
									]
								}
							]"
						/>
					</a-form-item>
					<a-form-item label="玉米全年总量(吨)">
						<a-input-number
							style="width: 100%"
							step="1"
							:precision="0"
							:min="0"
							v-decorator="[
								`corn`,
								{
									rules: [
										{
											required: true,
											message: `玉米全年总量(吨)`
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-form>
			</a-modal>
		</a-card>
	</div>
</template>

<script>
import {
	reportList, //列表
	reportTypeList, //品种
	reportParse, //导入
	reportExport, //导出
	reportGet, //获取全年
	reportDelete, //删除
	reportLoc, //获取经纬度
	reportSetting, //设置全年
	reportFindAllVariety //获取品种
} from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer, myFixed } from '@/v2/utils/factory.js';
import { colSpan, formLayout } from '@/config/layoutConfig';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{
		title: '地区',
		dataIndex: 'district'
	},
	{
		title: '仓库名称',
		dataIndex: 'pointName'
	},
	{
		title: '地址',
		dataIndex: 'address'
	},
	{
		title: '经纬度',
		dataIndex: 'location'
	},
	{
		title: '业务模式',
		dataIndex: 'businessModel'
	},
	{
		title: '业务线',
		dataIndex: 'businessLine'
	},
	{
		title: '保管方',
		dataIndex: 'store'
	},
	{
		title: '仓号',
		dataIndex: 'houseNum'
	},
	{
		title: '仓容(吨)',
		dataIndex: 'capacity',
		customRender: text => {
			return myFixed(text, 2);
		}
	},
	{
		title: '品种',
		dataIndex: 'variety'
	},
	{
		title: '库存状态',
		dataIndex: 'pointStatus'
	},
	{
		title: '当日入库(吨)',
		dataIndex: 'dayInCapacity'
	},
	{
		title: '累计入库(吨)',
		dataIndex: 'sumInCapacity'
	},
	{
		title: '当日出库(吨)',
		dataIndex: 'dayOutCapacity'
	},
	{
		title: '累计出库(吨)',
		dataIndex: 'sumOutCapacity'
	},
	{
		title: '现有库存(吨)',
		dataIndex: 'currentCapacity'
	},
	{
		title: '货值合计(元)',
		dataIndex: 'totalCost'
	},
	{
		title: '每吨均价(元)',
		dataIndex: 'averageCost'
	},
	{
		title: '驻库监管员',
		dataIndex: 'custodian'
	},
	{
		title: '备注',
		dataIndex: 'remark'
	},
	{
		title: '业务员负责人',
		dataIndex: 'principal'
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const searchList = [
	{
		decorator: ['pointName'],
		addonBeforeTitle: '仓库名称',
		type: 'input',
		placeholder: '请输入仓库名称'
	},
	{
		decorator: ['store'],
		addonBeforeTitle: '保管方',
		type: 'input',
		placeholder: '请输入保管方'
	},
	{
		decorator: ['houseNum'],
		addonBeforeTitle: '仓房',
		type: 'input',
		placeholder: '请输入仓房'
	},
	{
		decorator: ['custodian'],
		addonBeforeTitle: '驻库监管员',
		type: 'input',
		placeholder: '请输入驻库监管员'
	},
	{
		decorator: ['principal'],
		addonBeforeTitle: '业务负责人',
		type: 'input',
		placeholder: '请输入业务负责人'
	},
	{
		decorator: ['variety'],
		addonBeforeTitle: '品种',
		type: 'select',
		placeholder: '请选择品种',
		options: []
	}
];
export default {
	mixins: [ListMixin],
	name: 'storageCenterContractList',
	components: {
		iPagination
	},
	data() {
		return {
			getPopupContainer,
			columns,
			formLayout,
			colSpan,
			dataSource: [],
			params: {},
			varietyList: [],
			typeList: [],
			exportVisible: false, //报表导出弹框
			exportLoading: false, //报表导出中
			exportForm: this.$form.createForm(this),
			leadVisible: false, //报表导入弹框
			leadLoading: false, //报表导入中
			leadFild: [], //导入文件
			leadForm: this.$form.createForm(this),
			publicPath: process.env.BASE_URL,
			acceptFormat: '.xls,.xlsx',
			getTotalSetVisible: false, //设置全年总量弹框
			getTotalSetLoading: false, //设置全年总量中
			getTotalSetForm: this.$form.createForm(this),
			fileErr: '', //报表导入错误信息
			searchList,
			defaultParams: {
				type: '',
				uploadDataTime: moment().format('YYYY-MM-DD')
			},
			selfLoad: true,
			url: {
				list: reportList
			}
		};
	},
	watch: {
		leadFild() {
			//报表改变时清空错误提示
			this.fileErr = '';
		}
	},
	computed: {
		fileErrHtml() {
			return this.fileErr.replace(/\/n/g, '<br />');
		}
	},

	async created() {
		this.initData();
		await this.getTypeList();
		await this.getList();
		this.getVarietyList();
	},

	methods: {
		initData() {
			return new Promise(async resolve => {
				await this.getTypeList();
				await this.getVarietyList();
				this.getList();
				resolve(true);
			});
		},
		tabChange(val) {
			this.defaultParams.type = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		dataChange() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		//获取品类类型
		async getTypeList() {
			let res = await reportTypeList().catch(() => {});
			if (res?.success) {
				this.typeList = res.data;
				if (this.typeList.indexOf(this.defaultParams.type) == -1) {
					this.defaultParams.type = this.typeList[0];
				}
			}
		},
		//获取品种
		async getVarietyList() {
			let res = await reportFindAllVariety().catch(() => {});
			if (res?.success) {
				this.varietyList = res.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'variety') {
						item.options = this.varietyList.map(item => {
							return { value: item, label: item };
						});
					}
				});
			}
		},
		//导出
		exportModel() {
			this.exportVisible = true;
		},
		//报表导出确认
		exportOk() {
			this.exportForm.validateFields(async (err, values) => {
				if (!err) {
					this.exportLoading = true;
					let res = await reportExport(values).catch(() => {
						this.exportLoading = false;
					});
					comDownload(res, undefined, `库存日报表${values.reportDate}.xls`);
					this.exportVisible = false;
					this.exportLoading = false;
				}
			});
		},
		//设置全年总量
		async getTotalSetModel() {
			this.getTotalSetVisible = true;
			//加载全年总量
			this.getTotalSetLoading = true;
			let res = await reportGet().catch(() => {
				this.getTotalSetLoading = false;
			});
			if (res.success) {
				let data = res.data;
				this.$nextTick(() => {
					this.getTotalSetForm.setFieldsValue({
						corn: data.corn,
						wheat: data.wheat
					});
				});
			}
			this.getTotalSetLoading = false;
		},
		//设置全年总量确认
		getTotalSetOk() {
			this.getTotalSetForm.validateFields(async (err, values) => {
				if (!err) {
					this.getTotalSetLoading = true;
					let res = await reportSetting(values).catch(() => {
						this.getTotalSetLoading = false;
					});
					if (res.success) {
						this.$message.success('修改成功');
						this.getTotalSetVisible = false;
					}
					this.getTotalSetLoading = false;
				}
			});
		},
		//导入
		leadModel() {
			this.leadVisible = true;
		},
		//关闭导入弹框
		leadVisibleFalse() {
			this.leadVisible = false;
			this.handleRemove();
			this.leadForm.resetFields();
		},
		//报表导入确认
		leadOk() {
			this.leadForm.validateFields(async (err, values) => {
				if (!err) {
					if (!this.leadFild.length) {
						this.$message.error('请选择文件！');
						return;
					}
					let formData = new FormData();
					formData.append('file', this.leadFild[0]);
					formData.append('uploadTime', values.uploadTime);
					this.leadLoading = true;
					let res = await reportParse(formData).catch(() => {
						this.leadLoading = false;
					});
					if (res.success) {
						this.$message.success('导入成功');
						//关闭弹框
						this.leadVisibleFalse();
						//重载列表
						await this.getTypeList();
						await this.getList();
					} else {
						this.fileErr = res?.error?.message || '导入错误';
					}
					this.leadLoading = false;
				}
			});
		},
		//阻止文件自动上传
		beforeUpload(file) {
			this.leadFild = [file];
			return false;
		},
		handleRemove() {
			this.leadFild = [];
		},
		jumpPage(path, data) {
			this.$router.push({
				path,
				query: {
					id: data.id
				}
			});
		},
		//删除
		async del(data) {
			let res = await reportDelete(data);
			if (res.success) {
				this.$message.success('删除成功');
				await this.getTypeList();
				await this.getList();
			}
		},
		//重新获取经纬度
		async reportLoc() {
			let res = await reportLoc();
			if (res.success) {
				this.$message.success('更新成功');
				this.getList();
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
