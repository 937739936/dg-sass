<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>客户信息编辑</span
			>
			<div class="info">
				<a-form-model
					:model="formData"
					ref="formData"
					:rules="rules"
					:label-col="{ span: 4 }"
					:wrapper-col="{ span: 14 }"
				>
					<div class="info-item">
						<p class="title">
							<span>{{ formData.name }}</span>

							<span
								class="bg"
								style="margin: 0 10px"
								>{{ formData.type }}</span
							>

							<a-button
								type="rest"
								class="btnDark"
								v-if="!changeCompanyInfo.name"
								style="margin: 0 10px"
								@click="check"
								>企业名称校验</a-button
							>
							<span
								style="color: #999; marginleft: 10px; fontweight: 400"
								v-if="isChangeName && changeCompanyInfo.name"
								>校验结果：企业名称未变更</span
							>
							<span
								style="color: #999; marginleft: 10px; fontweight: 400"
								v-if="!isChangeName && changeCompanyInfo.name"
								>校验结果：企业名称变更为{{ changeCompanyInfo.name }}，系统已更新</span
							>
						</p>
					</div>
					<div class="info-item">
						<p class="title">基本信息</p>
						<a-row :gutter="10">
							<a-col :span="12">
								<a-form-model-item
									label="企业简称"
									prop="abbreviation"
								>
									<a-input
										:maxLength="20"
										v-model.trim="formData.abbreviation"
										placeholder="请输入企业简称"
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item
									label="客户类别"
									prop="type"
								>
									<a-auto-complete
										v-model="formData.type"
										:data-source="typeList"
										placeholder="请选择企业简称"
									/>
								</a-form-model-item>
							</a-col>
						</a-row>
					</div>
					<div class="info-item">
						<p class="title">联系人信息</p>
						<a-row :gutter="10">
							<a-col :span="12">
								<a-form-model-item
									label="联系人姓名"
									prop="linkmanName"
								>
									<a-input
										:maxLength="50"
										v-model.trim="formData.linkmanName"
										placeholder="请输入联系人姓名"
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item
									label="联系人电话"
									prop="linkmanMobile"
								>
									<a-input
										:maxLength="13"
										v-model.trim="formData.linkmanMobile"
										placeholder="请输入联系人电话"
									/>
								</a-form-model-item>
							</a-col>
						</a-row>
					</div>
					<div class="info-item">
						<p class="title">负责人信息</p>
						<a-row :gutter="10">
							<a-col :span="12">
								<a-form-model-item label="负责人姓名">
									<a-select
										v-model="formData.headName"
										placeholder="请选择负责人"
										allowClear
										:getPopupContainer="getPopupContainer"
										@change="principalChange"
									>
										<a-select-option
											v-for="items in principalList"
											:key="items.id"
											:value="items.name"
										>
											{{ items.name }}
										</a-select-option>
									</a-select>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item label="负责人电话">
									<a-input
										v-model="formData.headMobile"
										disabled
										placeholder="负责人电话"
									/>
								</a-form-model-item>
							</a-col>
						</a-row>
					</div>
					<div class="info-item">
						<p class="title">纳税信息</p>
						<a-button
							style="float: right; margin-bottom: 20px; z-index: 99"
							@click="addTaxInfo"
							type="primary"
						>
							新增纳税申报表
						</a-button>
						<a-table
							rowKey="id"
							:scroll="{ x: true }"
							:columns="columns"
							:pagination="false"
							:dataSource="taxListData"
							:locale="{ emptyText: '暂无数据' }"
						>
							<template
								slot="operation"
								class="table-operation"
								slot-scope="record"
							>
								<a-space :size="10">
									<a
										@click="
											jumpPage('/center/account/company/tax/detail', {
												id: record.id
											})
										"
										>查看</a
									>
									<a @click="deleteTax(record.id)">删除</a>
								</a-space>
							</template>
						</a-table>
						<i-pagination
							:pagination="pagination"
							@change="handleTableChange"
						/>
					</div>
					<div
						class="tc"
						style="padding: 10px"
					>
						<a-space :size="50">
							<a-button
								html-type="reset"
								@click="$router.go(-1)"
								class="btnDark"
							>
								返回
							</a-button>
							<a-button
								type="primary"
								html-type="submit"
								class="search-btn"
								@click="save"
							>
								保存
							</a-button>
						</a-space>
					</div>
				</a-form-model>
			</div>
			<a-modal
				title="新增纳税申报表"
				:visible="visible"
				width="700px"
				:confirmLoading="confirmLoading"
				destroyOnClose
				@ok="handleOk"
				@cancel="
					() => {
						visible = false;
					}
				"
			>
				<a-form
					:form="formModalData"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 14 }"
				>
					<a-form-item label="税种">
						<a-select
							disabled
							v-decorator="[
								'taxCategory',
								{
									rules: [{ required: false, message: '请选择税种' }],
									validateTrigger: 'change',
									initialValue: 'VALUE_ADDED_TAX'
								}
							]"
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
									rules: [{ required: true, message: '请选择税款所属期间' }]
								}
							]"
							style="width: 100%"
						/>
					</a-form-item>
					<a-form-item label="实缴(退)金额">
						<a-input-number
							:formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
							:precision="2"
							:min="0"
							v-decorator="['amount', { rules: [{ required: false, message: '请输入实缴(退)金额' }] }]"
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
							:multiple="true"
							v-on:upload="taxTableFileUpload"
							:size="100"
							v-decorator="['taxTable', { rules: [{ required: false, message: '上传纳税申报表' }], validateTrigger: 'change' }]"
						>
							<span>点击选择</span>
						</i-upload>
					</a-form-item>
					<a-form-item
						label="上传完税证明"
						v-if="formModalData.getFieldValue('amount') != 0"
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
							v-decorator="['taxPaidProof', { rules: [{ required: false, message: '上传完税证明' }] }]"
						>
							<span>点击选择</span>
						</i-upload>
					</a-form-item>
					<div class="file-notice">
						<p>附件上传要求：</p>
						<p>1.可支持格式为{{ myallowFormat }}的附件，单个附件大小不得超过100M的文件。</p>
						<p style="color: red">2.请核心企业代为上传对应上游供应商补充的纳税凭证。</p>
						<!-- <p style="color:red">
              2.请核心企业代为上传对应上游供应商最新月份的纳税凭证，（当月15日之前（含当日），需上传上上月的纳税凭证，当月15日之后，需上传上月的纳税凭证）。
            </p> -->
						<!-- <p style="color:red">
              3.若因特殊原因，暂无最新月份的纳税凭证，请上传“文字版的解释说明文件”，税款所属期间请填写文件说明日期。
            </p> -->
					</div>
				</a-form>
			</a-modal>
		</a-card>
	</div>
</template>

<script>
import {
	API_COMPANYCUSTOMERTYPEID,
	API_COMPANYCUSTOMERTYPE,
	API_COMPANYCUSTOMERTYPEPUT,
	API_COMPANYUSERLIST,
	API_COMPANYCUSTOMERTAXADD,
	API_COMPANYTAX,
	API_COMPANYTAXDELETE
} from '@/v2/api/account';
import { API_TianYanCha, modifyName } from '@/v2/center/person/api';
import { getPopupContainer } from '@/v2/utils/factory';
import { API_UPLOAD_FILE } from '@/v2/center/person/api';
import iUpload from '@/v2/components/upload.vue';
import iPagination from "@sub/components/iPagination";
export default {
	components: {
		iUpload,
		iPagination
	},
	data() {
		return {
			formData: {},
			confirmLoading: false,
			id: '',
			typeList: [], //客户类别
			principalList: [], //负责人列表
			taxListData: [],
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
			visible: false,
			formModalData: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			myallowFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls,.rar,.zip',
			taxTableFileList: [],
			taxPaidProofFileList: [],
			taxCategoryDictList: [{ text: '增值税', value: 'VALUE_ADDED_TAX' }], // 写死增值税
			typeList: [], //客户类别
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			isChangeName: false,
			changeCompanyInfo: {}
		};
	},
	computed: {
		rules() {
			return {
				abbreviation: {
					required: true,
					message: '请输入企业简称',
					trigger: 'blur'
				},
				type: {
					required: true,
					message: '请选择客户类别',
					trigger: 'change'
				},
				linkmanName: {
					required: true,
					message: '请输入联系人名称',
					trigger: 'blur'
				},
				linkmanMobile: {
					required: true,
					message: '请输入正确的联系人电话',
					pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
					trigger: 'blur'
				}
			};
		}
	},
	methods: {
		// 校验企业名称变化
		async check() {
			const res = await API_TianYanCha({ keyword: this.formData.creditCode });
			this.isChangeName = this.formData.name == res.data.name;
			this.changeCompanyInfo = res.data;
			if (!this.isChangeName) {
				const params = {
					id: this.$route.query.id,
					name: this.changeCompanyInfo.name
				};
				await modifyName(params);
			}
		},
		getPopupContainer,
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getTaxDetail();
		},
		getTaxDetail() {
			//加载纳税详情
			API_COMPANYTAX({ ...this.pagination, uscc: this.formData.creditCode }).then(res => {
				if (res.success) {
					this.taxListData = res.data.content;
					this.pagination.total = res.data?.totalElements;
				}
			});
		},
		addTaxInfo() {
			this.visible = true;
		},
		jumpPage(path, data) {
			// 跳转页面
			this.$router.push({
				path,
				query: data
			});
		},
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
						that.getTaxDetail();
					});
				}
			});
		},
		handleOk() {
			this.formModalData.validateFields((err, values) => {
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
					(param.companyCreditCode = this.formData.creditCode), delete param.taxPeriod;
					this.confirmLoading = true;
					API_COMPANYCUSTOMERTAXADD(param)
						.then(res => {
							if (res.success && res.data) {
								this.$message.success('添加成功');
								this.visible = false;
								this.getTaxDetail();
							}
						})
						.finally(e => {
							this.confirmLoading = false;
						});
				}
			});
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
		//加载详情
		async getDetail() {
			//加载详情
			await API_COMPANYCUSTOMERTYPEID(this.id).then(res => {
				if (res.success) {
					this.formData = res.data;
					this.getTaxDetail();
				}
			});
		},
		//客户类型
		getType() {
			API_COMPANYCUSTOMERTYPE().then(res => {
				let data = res.data;
				this.typeList = data;
			});
		},
		//获取负责人列表，取值范围为为当前登录企业的用户列表；
		getCompanyPersonalUserList() {
			API_COMPANYUSERLIST().then(res => {
				if (res.success) {
					this.principalList = res.data.map(item => {
						const { mobile, name } = item.personal;
						return {
							id: item.id,
							mobile,
							name
						};
					});
				}
			});
		},
		//负责任人变化
		principalChange(value) {
			let obj = this.principalList.find(item => {
				return item.name == value;
			});
			if (obj) {
				this.formData.headMobile = obj.mobile;
			} else {
				this.formData.headMobile = '';
			}
		},
		save() {
			this.$refs.formData.validate(valid => {
				if (valid) {
					const params = {
						...this.formData
					};

					if (this.changeCompanyInfo.name) {
						params.name = this.changeCompanyInfo.name;
					}
					API_COMPANYCUSTOMERTYPEPUT(params).then(res => {
						if (res.success && res.data) {
							this.$message.success('修改成功');
							this.$router.go(-1);
						}
					});
				} else {
					return false;
				}
			});
		}
	},
	created() {
		this.id = this.$route.query.id;
		if (this.id) {
			this.getDetail();
			this.getType();
			this.getCompanyPersonalUserList();
		} else {
			//如果没有id为异常，返回列表
			this.$router.push('/center/account/company/customer');
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.info {
	background: #ffffff;
	margin-top: 20px;
	.info-item {
		margin-bottom: 16px;
		::v-deep .ant-descriptions-item-label {
			text-align: right;
			font-size: 14px;
			color: #999999;
			min-width: 130px;
		}
		::v-deep .ant-descriptions-item-content {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
			text-align: left;
			max-width: calc(100% - 130px);
		}
		.title {
			margin-bottom: 10px;
			padding-bottom: 0;
			font-size: 14px;
			// font-weight: 600;
		}
		.bg {
			display: inline-block;
			background: @primary-color;
			height: 30px;
			line-height: 30px;
			padding: 0 20px;
			font-size: 14px;
			color: #fff;
			font-weight: normal;
			border-radius: 15px;
		}
	}
}
</style>
