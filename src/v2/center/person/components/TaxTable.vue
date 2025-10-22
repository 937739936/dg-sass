<template>
	<a-row
		type="flex"
		justify="start"
	>
		<div style="width: 100%; position: relative">
			<a-tabs
				v-model="taxListParams.taxCategory"
				@change="onChangeTab"
			>
				<a-tab-pane
					key=""
					tab="全部税种"
				></a-tab-pane>
				<a-tab-pane
					:key="item.value"
					:tab="item.text"
					v-for="item in taxCategoryDictList"
				></a-tab-pane>
				<a-button
					slot="tabBarExtraContent"
					v-auth="'company:attachment:tax:edit'"
					@click="showModal"
					type="primary"
				>
					新增纳税申报表
				</a-button>
			</a-tabs>
			<div
				class="tr"
				style="padding-bottom: 20px; margin-top: 20px"
			>
				<a-table
					rowKey="id"
					:scroll="{ x: true }"
					:columns="columns"
					:pagination="false"
					:dataSource="taxListData"
					:locale="{ emptyText: '暂无数据' }"
					:loading="loading"
				>
					<template
						slot="operation"
						class="table-operation"
						slot-scope="record"
					>
						<a-space :size="10">
							<a
								v-auth="'company:attachment:tax:view'"
								@click="
									jumpPage('/center/account/company/tax/detail', {
										id: record.id
									})
								"
								>查看</a
							>
							<a
								v-auth="'company:attachment:tax:edit'"
								@click="deleteTax(record.id)"
								>删除</a
							>
						</a-space>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="handleTableChange"
				/>
			</div>
		</div>
		<a-modal
			title="新增纳税申报表"
			:visible="visible"
			width="700px"
			destroyOnClose
			@ok="handleOk"
			:confirmLoading="confirmLoading"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<a-form
				:form="formData"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 14 }"
			>
				<a-form-item label="税种">
					<a-select
						v-decorator="['taxCategory', { rules: [{ required: true, message: '请选择税种' }] }]"
						placeholder="请选择税种"
					>
						<a-select-option
							v-for="item in taxCategoryDictList"
							:value="item.value"
							:key="item.value"
							>{{ item.text }}</a-select-option
						>
					</a-select>
				</a-form-item>
				<a-form-item label="税款所属期间">
					<a-range-picker
						v-decorator="[
							'taxPeriod',
							{
								rules: [{ required: true, message: '请选择税款所属期间' }, { validator: taxPeriodValid }]
							}
						]"
						style="width: 100%"
					/>
				</a-form-item>
				<a-form-item
					label="实缴(退)金额"
					prop="amount"
				>
					<a-input-number
						:formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
						:precision="2"
						:min="0"
						v-decorator="['amount', { rules: [{ required: true, message: '请输入实缴(退)金额' }] }]"
						:step="0.01"
						style="width: 100%"
						:parser="value => value.replace(/\￥\s?|(,*)/g, '')"
					/>
				</a-form-item>
				<a-form-item label="上传纳税申报表">
					<i-upload
						listType="picture-card"
						:showDesc="false"
						:action="action"
						:accept="myallowFormat"
						:limit="true"
						:showUploadList="true"
						v-on:upload="taxTableFileUpload"
						:size="100"
						v-decorator="['taxTable', { rules: [{ required: true, message: '上传纳税申报表' }] }]"
					>
						<span>点击选择</span>
					</i-upload>
				</a-form-item>
				<a-form-item
					label="上传完税证明"
					v-if="formData.getFieldValue('amount') != 0"
				>
					<i-upload
						listType="picture-card"
						:showDesc="false"
						:action="action"
						:accept="myallowFormat"
						:limit="true"
						:showUploadList="true"
						v-on:upload="taxPaidProofFileUpload"
						:size="100"
						v-decorator="['taxPaidProof', { rules: [{ required: true, message: '上传完税证明' }] }]"
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
import { API_COMPANYTAX, API_COMPANYTAXADD, API_COMPANYTAXDELETE } from '@/v2/api/account';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import iUpload from '@/v2/components/upload.vue';
import iPagination from "@sub/components/iPagination";

export default {
	name: 'TaxTable',
	data() {
		return {
			taxCategory: '',
			confirmLoading: false,
			columns: [
				{
					title: '申报年度',
					dataIndex: 'year',
					key: 'year',
					customRender: text => {
						return text ? text + '年' : '';
					}
				},
				{
					title: '税种',
					dataIndex: 'taxCategoryDesc',
					key: 'taxCategoryDesc'
				},
				{
					title: '税种所属期间',
					dataIndex: 'taxPeriodStart',
					key: 'taxPeriodStart',
					customRender: (text, r) => {
						return text + '至' + r.taxPeriodEnd;
					}
				},
				{
					title: '实缴(退)金额',
					dataIndex: 'amount',
					key: 'amount',
					customRender: text => {
						let sum = text ? (text % 1 == 0 ? text.toLocaleString() + '.00' : text.toLocaleString()) : text;
						return `￥ ${sum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
					}
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					align: 'center'
				}
			],
			taxCategoryDictList: filterCodeByKey('taxCategoryDict'),
			taxListParams: {
				taxCategory: ''
			},
			taxListData: [],
			visible: false,
			formData: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			myallowFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls,.rar,.zip',
			taxTableFileList: [],
			taxPaidProofFileList: [],
			loading: false,
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			}
		};
	},
	components: {
		iUpload,
		iPagination
	},
	computed: {},
	created() {
		this.getTaxList();
	},
	methods: {
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getTaxList();
		},
		taxTableFileUpload(file) {
			this.taxTableFileList = [];
			file.forEach(item => {
				this.taxTableFileList.push({
					fileName: item.fileName,
					fileUrl: item.url,
					md5Hex: item.md5Hex,
					status: item.status
				});
			});
		},
		taxPaidProofFileUpload(file) {
			this.taxPaidProofFileList = [];
			file.forEach(item => {
				this.taxPaidProofFileList.push({
					fileName: item.fileName,
					fileUrl: item.url,
					md5Hex: item.md5Hex,
					status: item.status
				});
			});
		},
		showModal() {
			this.visible = true;
		},
		handleOk() {
			this.formData.validateFields((err, values) => {
				if (!err) {
					const flagArr = this.taxTableFileList.concat(this.taxPaidProofFileList).map(item => item?.status);
					if (flagArr.includes('uploading')) {
						this.$message.warning('请等待文件上传完成');
						return;
					}
					if (flagArr.includes('error')) {
						this.$message.warning('文件上传失败请重试');
						return;
					}
					let param = Object.assign({}, values);
					param.taxPeriodStart = values.taxPeriod[0].format('YYYY-MM-DD');
					param.taxPeriodEnd = values.taxPeriod[1].format('YYYY-MM-DD');
					param.taxTable = this.taxTableFileList;
					param.taxPaidProof = this.taxPaidProofFileList;
					delete param.taxPeriod;
					this.confirmLoading = true;
					API_COMPANYTAXADD(param)
						.then(res => {
							if (res.success && res.data) {
								this.$message.success('添加成功');
								this.visible = false;
								this.getTaxList();
							}
						})
						.finally(e => {
							this.confirmLoading = false;
						});
				}
			});
		},
		taxPeriodValid(rule, value, callback) {
			if (!value.length) {
				callback();
			}
			let start = value[0],
				end = value[1];
			if (start.format('YYYY') == end.format('YYYY')) {
				callback();
			} else {
				callback('税款所属时间需在同一年');
			}
		},
		//页面跳转
		jumpPage(path, data) {
			// 跳转页面
			this.$router.push({
				path,
				query: data
			});
		},
		// 列表
		getTaxList() {
			this.loading = true;
			API_COMPANYTAX({...this.taxListParams, ...this.pagination}, { loading: false })
				.then(res => {
					if (res.success) {
						this.taxListData = res.data.content;
						this.pagination.total = res.data?.totalElements;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		onChangeTab(e) {
			this.taxListParams.taxCategory = e;
			this.getTaxList();
		},
		//删除
		deleteTax(id) {
			const that = this;
			this.$confirm({
				centered: true,
				title: '您确定要删除当前纳税申报表数据及其附件么？',
				onOk() {
					API_COMPANYTAXDELETE(id).then(res => {
						if (res.success && res.data) {
							that.$message.success('操作成功');
						} else {
							that.$message.error(res.message || '数据异常');
						}
						that.getTaxList();
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
/deep/ .ant-tabs-ink-bar {
	bottom: 2px;
}
</style>
