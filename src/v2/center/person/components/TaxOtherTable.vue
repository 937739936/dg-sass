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
							<a-form-item label="文件名称">
								<a-input
									v-model="taxListParams.name"
									placeholder="请输入文件名称"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="文件类型">
								<a-select
									v-model="taxListParams.type"
									placeholder="请选择文件类型"
									allowClear
								>
									<a-select-option
										v-for="items in typeList"
										:key="items.value"
										:value="items.label"
										>{{ items.label }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="上传时间">
								<a-range-picker
									style="width: 100%"
									v-model="createdTime"
									@change="getTime"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="10">
						<a-col :span="20">
							<a-form-item
								label=""
								class="order-wrap"
							>
								<a-row type="flex">
									<a-button
										v-auth="'company:attachment:other:edit'"
										type="primary"
										html-type="submit"
										class="search-btn"
										@click="showModal"
									>
										新增文件
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
								</a-row>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
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
								v-auth="'company:attachment:other:view'"
								@click="taxLook(record.path)"
								>查看</a
							>
							<a
								v-auth="'company:attachment:other:edit'"
								@click="deleteTax(record.id)"
								>删除</a
							>
							<a
								v-auth="'company:attachment:other:view'"
								@click="download(record)"
								>下载附件</a
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
			title="新增文件"
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
				:wrapper-col="{ span: 14 }"
			>
				<a-form-item label="文件类型">
					<a-select
						v-decorator="[
							'fileTypeName',
							{
								rules: [
									{
										required: true,
										whitespace: true,
										message: '请输入文件类型'
									},
									{ validator: typeValid }
								]
							}
						]"
						placeholder="请输入文件类型"
						><a-select-option
							v-for="items in typeList"
							:key="items.value"
							:value="items.value"
							>{{ items.label }}</a-select-option
						>
					</a-select>
				</a-form-item>
				<a-form-item label="文件上传">
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
						v-decorator="['fileList', { rules: [{ required: true, message: '请文件上传' }] }]"
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
		<image-viewer ref="imageViewer" />
	</a-row>
</template>
<script>
import { API_UPLOAD_FILE, API_getCommonDownload } from '@/v2/center/person/api';
import comDownload from '@sub/utils/comDownload.js';
import {
	API_COMPANYTAXOTHER,
	API_COMPANYTAXOTHERTYPE,
	API_COMPANYTAXOTHERADD,
	API_COMPANYTAXOTHERDELETE
} from '@/v2/api/account';
import iUpload from '@/v2/components/upload.vue';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import iPagination from '@sub/components/iPagination';

export default {
	name: 'TaxTable',
	data() {
		return {
			taxCategory: '',
			columns: [
				{
					title: '文件名称',
					dataIndex: 'fileName',
					key: 'fileName'
				},
				{
					title: '文件类型',
					dataIndex: 'fileTypeName',
					key: 'fileTypeName',
					width: 120
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
					width: 180
				}
			],
			taxListParams: {
				name: '',
				type: undefined,
				createdDateStart: '',
				createdDateEnd: ''
			},
			createdTime: null,
			typeList: [{ value: 'OTHER', label: '企业其他资料' }],
			taxListData: [],
			taxListpagination: {
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
			formData: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			myallowFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls,.rar,.zip',
			fileListObj: [],
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
		imageViewer,
		iPagination
	},
	computed: {},
	created() {
		this.getType();
		this.getTaxList();
	},
	methods: {
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getTaxList();
		},
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
		showModal() {
			this.visible = true;
		},
		handleOk() {
			this.formData.validateFields((err, values) => {
				if (!err) {
					let param = Object.assign({}, values);
					const flagArr = this.fileListObj.map(item => item?.status);
					if (flagArr.includes('uploading')) {
						this.$message.warning('请等待文件上传完成');
						return;
					}
					if (flagArr.includes('error')) {
						this.$message.warning('文件上传失败请重试');
						return;
					}
					// this.fileListObj.forEach(item => delete item?.status);
					param.fileList = this.fileListObj;
					API_COMPANYTAXOTHERADD(param).then(res => {
						if (res.success && res.data) {
							this.$message.success('添加成功');
							this.visible = false;
							this.getTaxList();
							this.getType();
						}
					});
				} else {
					return false;
				}
			});
		},
		typeValid(rule, value, callback) {
			if (!value) {
				callback();
			}
			if (value.length > 20) {
				callback('文本类型做多20字符。');
			}
			if (value.replace(/(^\s*)|(\s*$)/g, '') == '纳税申报表') {
				callback('若您上传的文件为纳税申报表，请在纳税申报表页面点击“新增纳税申报表”上传。');
			} else if (value.replace(/(^\s*)|(\s*$)/g, '') == '完税证明') {
				callback('若您上传的文件为完税证明，请在纳税申报表页面点击“新增纳税申报表”与纳税申报表一起上传。');
			} else {
				callback();
			}
		},
		// 获取交货到期日
		getTime(value, dateString) {
			this.taxListParams.createdDateStart = dateString[0] ? dateString[0] + ' 00:00:00' : '';
			this.taxListParams.createdDateEnd = dateString[1] ? dateString[1] + ' 23:59:59' : '';
		},
		//查看附件
		taxLook(url) {
			filePreview(url, this.$refs.imageViewer.show);
		},
		//下载附件
		download(record) {
			API_getCommonDownload(record.path).then(res => {
				comDownload(res, null, record.fileName);
			});
		},
		searchSubmit() {
			this.getTaxList();
		},
		resetValues() {
			this.taxListParams = {};
			this.createdTime = null;
			this.pagination.pageNo = 1;
			this.pagination.pageSize = 10;
			this.getTaxList();
		},
		//文件类型
		getType() {
			// API_COMPANYTAXOTHERTYPE().then(res => {
			// 	let data = res.data;
			// 	this.typeList = data;
			// });
		},
		// 列表
		getTaxList() {
			this.loading = true;
			let param = { ...this.taxListParams, ...this.pagination };
			API_COMPANYTAXOTHER(param)
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
		//删除
		deleteTax(id) {
			const that = this;
			this.$confirm({
				centered: true,
				title: '您确定要删除当前文件数据及其附件么？',
				onOk() {
					API_COMPANYTAXOTHERDELETE(id).then(res => {
						if (res.success && res.data) {
							that.$message.success('操作成功');
						} else {
							that.$message.error(res.message || '数据异常');
						}
						that.getTaxList();
						that.getType();
					});
				}
			});
		}
	}
};
</script>
<style scoped>
.search-btn {
	margin-right: 20px;
}
</style>
