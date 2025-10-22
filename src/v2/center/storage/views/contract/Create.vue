<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>新增合同</span
				>
			</div>
			<a-form
				:form="form"
				v-bind="formLayout"
				labelAlign="left"
				class="slFormDetail"
			>
				<div class="custom-card-title mb16">
					<a-row>
						<a-col :span="12">
							<a-form-item
								:required="true"
								label="买方"
							>
								{{ VUEX_ST_COMPANYSUER.companyName }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="卖方">
								<a-select
									allowClear
									placeholder="请选择卖方"
									:getPopupContainer="getPopupContainer"
									show-search
									v-decorator="[
										'sellerName',
										{
											rules: [{ required: true, message: '请选择卖方' }],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-select-option
										@click="getCurSeller(item)"
										v-for="item in storageCompanyList"
										:key="item.bizLicenseNo"
										:value="item.bizLicenseNo"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="合同编号">
								<a-input
									placeholder="请输入合同编号"
									v-decorator="[
										'contractNo',
										{
											rules: [{ required: true, message: '请输入合同编号' }],
											validateTrigger: 'blur'
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="合同类型">
								<a-select
									allowClear
									show-search
									placeholder="请选择合同类型"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'contractType',
										{
											rules: [{ required: true, message: '请选择合同类型' }],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-select-option
										v-for="item in contractTypeList"
										:key="item.value"
										:value="item.value"
									>
										{{ item.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="商品名称">
								<a-input
									:precision="4"
									placeholder="请输入商品名称"
									v-decorator="[
										'productName',
										{
											rules: [{ required: true, message: '请输入商品名称' }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="交付日期">
								<a-date-picker
									placeholder="请选择交付日期"
									:getCalendarContainer="getPopupContainer"
									v-decorator="[
										'deliveryTime',
										{
											rules: [{ required: true, message: '请选择交付日期' }],
											validateTrigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="合同起始日期">
								<a-range-picker
									format="YYYY-MM-DD"
									:placeholder="['开始日期', '结束日期']"
									:getCalendarContainer="getPopupContainer"
									v-decorator="[
										'date',
										{
											rules: [{ required: true, message: '合同起始日期' }],
											validateTrigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="合同签订日期">
								<a-date-picker
									placeholder="请选择合同签订日期"
									:getCalendarContainer="getPopupContainer"
									v-decorator="[
										'signTime',
										{
											rules: [{ required: true, message: '请选择合同签订日期' }],
											validateTrigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								style="margin: 0"
								label="合同附件"
							>
								<i-upload
									:accept="accept"
									:action="action"
									:size="limitFileSize"
									v-decorator="['attachments', { rules: [{ required: true, message: '请上传合同附件' }] }]"
									v-on:upload="setFileList"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</div>

				<div class="table-box">
					<a-table
						class="new-table"
						style="width: 100%"
						:columns="columns"
						:rowKey="record => record.path"
						:dataSource="attachments"
						:pagination="false"
					>
						<template
							slot="name"
							slot-scope="text, record"
						>
							<a @click="handlePreview(record.path)">{{ text }}</a>
						</template>
						<span slot="customTitle"> 操作 </span>
						<div
							slot="action"
							slot-scope="action, item"
						>
							<a
								style="margin-right: 10px"
								@click="del(item)"
								>删除</a
							>
						</div>
					</a-table>
				</div>
			</a-form>

			<div class="slDetailBottom">
				<a-button
					style="margin-right: 24px"
					@click="$router.go(-1)"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="save"
					>提交</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_UPLOAD_GRAIN, API_GrainContractSave, API_GrainStorageCompanyList } from '@/v2/center/storage/api';
import { handleUploadChange } from '@/v2/utils/factory';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { contractTypeList } from '@/v2/center/storage/config/dictionaryConfig';
import { getPopupContainer, handleScrollBottomBtn } from '@/v2/utils/factory';
import iUpload from '@/v2/components/upload.vue';

const columns = [
	{
		title: '合同附件',
		align: 'center',
		dataIndex: 'name',
		scopedSlots: { customRender: 'name' },
		width: 300
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 80,
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	name: 'storageCenterContractCreate',

	data() {
		return {
			moment,
			columns,
			contractTypeList,
			getPopupContainer,
			curSeller: {},
			storageCompanyList: [],
			attachments: [],
			loading: false,
			visible: false,
			date: [],
			action: API_UPLOAD_GRAIN,
			accept: '.pdf',
			limitFileSize: 20,
			fileListcontract: [],
			tempFileList: [],
			uploadKeyList: ['contract'],
			form: this.$form.createForm(this),
			companyConfigEnableList: [],
			formLayout: {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 14
				}
			},
			data: {}
		};
	},
	components: {
		iUpload
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	created() {
		this.uploadKeyList.forEach(item => {
			this[`handleChange${item}`] = info => {
				if (this.attachments.length >= 5) {
					return;
				}
				this.loading = true;
				handleUploadChange.call(this, info, item, this.setAttachments);
			};
			this[item] = '';
		});

		this.getStorageCompanyList();
		this.handleScroll();
	},

	methods: {
		// fixed随页面滚动
		handleScroll() {
			this.$nextTick(() => {
				var thead = document.querySelector('.slDetailBottom');
				var lw = document.querySelector('#app');
				lw.addEventListener('scroll', function () {
					var sl = 228 - lw.scrollLeft;
					thead.style.left = sl + 'px';
				});
			});
		},
		setFileList(file) {
			const fileItem = file.filter(item => item.status == 'done')[file.length - 1];
			if (!fileItem) return;
			this.attachments.push({
				path: fileItem.url,
				name: fileItem.fileName,
				md5Hex: fileItem.md5Hex
			});
		},
		del(data) {
			this.attachments.splice(
				this.attachments.findIndex(item => item.path === data.path),
				1
			);
		},
		getCurSeller(v) {
			this.curSeller = v;
		},
		getStorageCompanyList() {
			API_GrainStorageCompanyList().then(res => {
				if (res.success) {
					this.storageCompanyList = res.data;
				}
			});
		},
		handlePreview(v) {
			window.open(v, '_blank');
		},

		setAttachments(info, type) {
			this.loading = false;
			if (!info) {
				return;
			}
			const file = {
				path: info.file.response.data.fileUrl,
				name: info.file.name,
				md5Hex: info.file.response.data.md5Hex
				// convertFileName: info.file.response.result.convertFileName,
			};
			this.attachments = [...this.attachments, file];
		},

		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					values.contractStartDate = values.date[0].format('YYYY-MM-DD');
					values.contractEndDate = values.date[1].format('YYYY-MM-DD');
					values.deliveryTime = values.deliveryTime.format('YYYY-MM-DD');
					values.signTime = values.signTime.format('YYYY-MM-DD');
					delete values.date;
					delete values.attachments;

					values.sellerUscc = this.curSeller.bizLicenseNo;
					values.sellerName = this.curSeller.name;
					values.files = this.attachments;
					API_GrainContractSave(values).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('保存成功');
								this.$router.go(-1);
							}
						} else {
							this.$message.error(res?.error?.message);
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
::v-deep .ant-input-number {
	width: 100%;
}
::v-deep .ant-time-picker {
	width: 100%;
}
::v-deep.ant-calendar-picker {
	min-width: auto !important;
	width: 100% !important;
}
::v-deep .des {
	display: block;
	margin-top: 8px;
}
.ant-row {
	width: 100%;
}
.ant-col {
	display: flex;
	line-height: 32px;
	height: 32px;
	margin-bottom: 24px;
	/* border: 1px solid red; */
	span {
		display: inline-block;
		flex: 2;
	}
	span:nth-of-type(2) {
		flex: 4;
		padding-right: 5px;
	}
	.value {
		display: inline-block;
		max-width: 100%;
	}
}
.attachment {
	p {
		font-weight: 600;
		padding: 10px 0;
	}
	img {
		max-height: 400px;
		display: block;
		cursor: pointer;
	}
}
.des {
	margin-top: 8px;
}

.slMain {
	.slDetailBottom {
		width: calc(100vw - 254px);
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 228px;
	}
}
</style>
