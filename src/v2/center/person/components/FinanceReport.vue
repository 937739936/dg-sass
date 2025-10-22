<template>
	<a-row
		type="flex"
		justify="start"
	>
		<div style="width: 100%; position: relative">
			<div class="tl">
				<a-form
					:label-col="{ span: 5 }"
					:wrapper-col="{ span: 18 }"
					labelAlign="left"
				>
					<a-row :gutter="10">
						<a-col :span="8">
							<a-form-item label="财报类型">
								<a-select
									v-model="reportListParams.reportType"
									placeholder="请选择财报类型"
									allowClear
								>
									<a-select-option
										v-for="(items, index) in typeList"
										:key="index"
										:value="items.value"
										>{{ items.text }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="财报年度">
								<a-date-picker
									mode="year"
									format="YYYY"
									style="width: 100%"
									v-model="reportListParams.reportYear"
									:open="yearShowOne"
									@openChange="openChangeOne"
									@panelChange="panelChangeOne"
									placeholder="请选择年度"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="上传日期">
								<a-range-picker
									style="width: 100%"
									v-model="createdTime"
									@change="getTime"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="10">
						<a-col :span="8">
							<a-form-item
								label=""
								class="order-wrap"
							>
								<a-space :size="25">
									<a-button
										v-auth="'company:attachment:financeReport:edit'"
										type="primary"
										html-type="submit"
										class="search-btn"
										@click="showModal"
									>
										新增财报
									</a-button>
									<a-button
										type="primary"
										html-type="submit"
										class="search-btn"
										@click="searchSubmit"
									>
										查询
									</a-button>
									<a-button
										html-type="reset"
										@click="resetValues"
										class="btnDark"
									>
										重置
									</a-button>
								</a-space>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
				<a-table
					rowKey="id"
					:scroll="{ x: true }"
					:columns="columns"
					:pagination="reportListpagination"
					:dataSource="reportListData"
					@change="paginationChange"
					:locale="{ emptyText: '暂无数据' }"
				>
					<template
						slot="operation"
						class="table-operation"
						slot-scope="record"
					>
						<a-space :size="10">
							<a
								v-auth="'company:attachment:financeReport:view'"
								@click="
									jumpPage('/center/account/company/tax/financeReportDetail', {
										id: record.id
									})
								"
								>查看</a
							>
							<a
								v-auth="'company:attachment:financeReport:edit'"
								@click="deleteFinanceReport(record.id)"
								>删除</a
							>
						</a-space>
					</template>
				</a-table>
			</div>
		</div>
		<a-modal
			title="新增企业财报"
			:visible="visible"
			width="700px"
			destroyOnClose
			@ok="handleOk"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<a-form
				:form="formData"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 18 }"
			>
				<a-form-item label="财务类型">
					<a-select
						v-decorator="[
							'reportType',
							{
								rules: [{ required: true, whitespace: true, message: '请选择财报类型' }]
							}
						]"
						placeholder="请选择财报类型"
						allowClear
					>
						<a-select-option
							v-for="(items, index) in typeList"
							:key="index"
							:value="items.value"
							>{{ items.text }}</a-select-option
						>
					</a-select>
				</a-form-item>
				<a-form-item label="财报年度">
					<a-date-picker
						v-decorator="[
							'reportYear',
							{
								rules: [{ required: true, type: 'object', whitespace: true, message: '请选择财报年度' }]
							}
						]"
						mode="year"
						format="YYYY"
						style="width: 100%"
						:open="yearShowTwo"
						@openChange="openChangeTwo"
						@panelChange="panelChangeTwo"
						placeholder="请选择年度"
					/>
				</a-form-item>
				<a-form-item label="统一社会信用代码">
					<a-input
						disabled
						v-decorator="[
							'companyUscc',
							{
								rules: [{ required: true, whitespace: true, message: '请输入统一社会信用代码' }]
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="企业名称">
					<a-input
						disabled
						v-decorator="[
							'companyName',
							{
								rules: [{ required: true, whitespace: true, message: '请输入企业名称' }]
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="上传企业年报">
					<div style="color: red">建议上传：资产负债表、现金流量表、利润表、所有者权益变动表、附注</div>
					<i-upload
						listType="picture-card"
						:showDesc="false"
						:action="action"
						:accept="myallowFormat"
						:limit="false"
						:showUploadList="true"
						v-on:upload="fileListFileUpload"
						:multiple="true"
						:size="100"
						v-decorator="['fileList', { rules: [{ required: true, message: '上传完税证明' }] }]"
					>
						<span>点击选择</span>
					</i-upload>
				</a-form-item>
				<div class="file-notice">
					<p>附件上传要求：</p>
					<p>可支持格式为{{ myallowFormat }}的附件，单个附件大小不得超过100M的文件。</p>
				</div>
			</a-form>
		</a-modal>
	</a-row>
</template>
<script>
import { API_UPLOAD_FILE } from '@/v2/center/person/api';
import { API_CompanyFinanceReport, API_AddFinanceReport, API_DeleteFinanceReport } from '@/v2/api/account';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import iUpload from '@/v2/components/upload.vue';

export default {
	name: 'TaxTable',
	data() {
		return {
			columns: [
				{
					title: '文件名称',
					dataIndex: 'reportName',
					key: 'reportName'
				},
				{
					title: '文件类型',
					dataIndex: 'reportTypeDesc',
					key: 'reportTypeDesc'
				},
				{
					title: '财报年度',
					dataIndex: 'reportYear',
					key: 'reportYear'
				},
				{
					title: '上传时间',
					dataIndex: 'createdDate',
					key: 'createdDate'
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					align: 'center',
					fixed: 'right'
				}
			],
			reportListParams: {
				reportType: undefined,
				reportYear: undefined,
				startDate: '',
				endDate: ''
			},
			createdTime: null,
			typeList: filterCodeByKey('financeReportTypeDict'),
			reportListData: [],
			reportListpagination: {
				size: 'small',
				showSizeChanger: true,
				showQuickJumper: true,
				total: 0,
				defaultPageSize: 10,
				current: 1,
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]}共${total}条`;
				},
				hideOnSinglePage: true
			},
			visible: false,
			action: API_UPLOAD_FILE,
			myallowFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls,.rar,.zip',
			yearShowOne: false,
			yearShowTwo: false,
			formData: this.$form.createForm(this)
		};
	},
	components: { iUpload },
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	created() {
		this.getReportList();
	},
	methods: {
		fileListFileUpload(file) {
			this.fileListObj = [];
			file.forEach(item => {
				this.fileListObj.push({
					fileName: item.fileName,
					fileUrl: item.url,
					md5Hex: item.md5Hex,
					status: item.status
				});
			});
		},
		openChangeOne(status) {
			// 检索条件-财报年度
			if (status) {
				this.yearShowOne = true;
			}
		},
		panelChangeOne(value) {
			// 检索条件-财报年度
			this.reportListParams.reportYear = value.format('YYYY');
			this.yearShowOne = false;
		},
		openChangeTwo(status) {
			// 新增-财报年度
			if (status) {
				this.yearShowTwo = true;
			}
		},
		panelChangeTwo(value) {
			// 新增-财报年度
			this.formData.setFieldsValue({
				reportYear: value
			});
			this.yearShowTwo = false;
		},
		showModal() {
			this.visible = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.formData.setFieldsValue({
						companyUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
						companyName: this.VUEX_ST_COMPANYSUER.companyName
					});
				});
			});
		},
		handleOk() {
			this.formData.validateFields((err, values) => {
				if (!err) {
					const flagArr = this.fileListObj.map(item => item?.status);
					if (flagArr.includes('uploading')) {
						this.$message.warning('请等待文件上传完成');
						return;
					}
					if (flagArr.includes('error')) {
						this.$message.warning('文件上传失败请重试');
						return;
					}
					values.reportYear = values.reportYear.format('YYYY');
					let param = Object.assign({}, values);
					param.reportAttachList = this.fileListObj;
					API_AddFinanceReport(param).then(res => {
						if (res.success && res.data) {
							this.$message.success('添加成功');
							this.visible = false;
							this.getReportList();
						}
					});
				}
			});
		},
		// 获取交货到期日
		getTime(value, dateString) {
			this.reportListParams.startDate = dateString[0];
			this.reportListParams.endDate = dateString[1];
		},
		//页面跳转
		jumpPage(path, data) {
			// 跳转页面
			this.$router.push({
				path,
				query: data
			});
		},
		searchSubmit() {
			this.reportListpagination.current = 1;
			this.getReportList();
		},
		resetValues() {
			this.reportListParams = {};
			this.createdTime = null;
			this.reportListpagination.current = 1;
			this.getReportList();
		},
		// 列表
		getReportList() {
			this.reportListParams.pageNo = this.reportListpagination.current;
			this.reportListParams.pageSize = this.reportListpagination.pageSize;
			API_CompanyFinanceReport(this.reportListParams).then(res => {
				if (res.success) {
					this.reportListData = res.data.content;
					this.reportListpagination.total = res.data.totalElements;
				}
			});
		},
		// 分页组件回调事件
		paginationChange(data) {
			this.reportListpagination.current = data.current;
			this.reportListpagination.pageSize = data.pageSize;
			this.getReportList();
		},
		//删除
		deleteFinanceReport(id) {
			const that = this;
			this.$confirm({
				centered: true,
				title: '您确定要删除当前文件数据及其附件么？',
				onOk() {
					API_DeleteFinanceReport(id).then(res => {
						if (res.success && res.data) {
							that.$message.success('操作成功');
						} else {
							that.$message.error(res.message || '数据异常');
						}
						that.getReportList();
					});
				}
			});
		}
	}
};
</script>
