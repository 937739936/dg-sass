<template>
	<div class="background-wrapper">
		<a-card
			title="结算单"
			:bordered="false"
		>
			<a-form-model
				ref="ruleForm"
				:model="form"
				:rules="rules"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
				labelAlign="left"
			>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="serialNo"
							label="结算单号"
							prop="serialNo"
							:colon="false"
						>
							<a-input
								v-model="form.serialNo"
								:disabled="disabled"
								placeholder="请输入结算单号"
								:maxLength="50"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="settleUnitPrice"
							label="结算单价"
							prop="settleUnitPrice"
							:colon="false"
						>
							<a-input
								v-model="form.settleUnitPrice"
								:disabled="disabled"
								placeholder="请输入结算单价"
							/>
							<span class="text">元/吨</span>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="settleQuantity"
							label="结算数量"
							prop="settleQuantity"
							:colon="false"
						>
							<a-input
								v-model="form.settleQuantity"
								:disabled="disabled"
								placeholder="请输入结算数量"
							/><span class="text">吨</span>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="settleAmount"
							label="结算金额"
							prop="settleAmount"
							:colon="false"
						>
							<a-input
								v-model="form.settleAmount"
								:disabled="disabled"
								placeholder="请输入结算金额"
							/><span class="text">元</span>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="statementTime"
							label="结算日期"
							prop="statementTime"
							:colon="false"
						>
							<a-date-picker
								v-model="form.statementTime"
								type="date"
								format="YYYY-MM-DD"
								style="width: 100%"
								@change="getTime"
								placeholder="请选择"
								:disabled="disabled"
							/>
						</a-form-model-item>
					</a-col>
				</a-row>
				<div class="title">附件信息</div>
				<div class="upload-wrap">
					<FilesUpload
						:ifEditable="$route.query.type == 'detail' ? false : true"
						@uploadFiles="getUploadFiles"
						:type="[3, 5]"
						:fileDataSource="fileDataSource"
						tabType="settlement"
					/>
				</div>
				<a-form-model-item
					:wrapper-col="{ span: 14, offset: 4 }"
					class="btn-wrap"
				>
					<a-button
						style="margin-left: 10px"
						@click="$router.go(-1)"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit"
						v-if="$route.query.type != 'detail'"
						>提交</a-button
					>
				</a-form-model-item>
			</a-form-model>
		</a-card>
	</div>
</template>

<script>
import FilesUpload from '@/v2/center/monitoring/components/FilesUpload';
import { API_GetSettlementInfo, API_SaveSettlement } from '@/v2/center/monitoring/api';
export default {
	name: 'SettlementEdit',
	components: {
		FilesUpload
	},
	created() {
		if (this.$route.query.type == 'edit' || this.$route.query.type == 'detail' || this.$route.query.type == 'unEdit') {
			this.getSettlementInfo(this.$route.query.statementId);
		}
	},
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验结算数量、结算金额、结算单价字段
			let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{0,2})?$/;
			let regs4 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{0,4})?$/;
			let reg = rule.field == 'settleQuantity' ? regs4 : regs2;
			if (!reg.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		return {
			labelCol: { span: 5 },
			wrapperCol: { span: 15 },
			other: '',
			form: {
				serialNo: '',
				settleUnitPrice: '',
				settleQuantity: '',
				settleAmount: '',
				statementTime: undefined
			},
			rules: {
				serialNo: [{ required: true, message: '请输入结算单号', trigger: 'blur' }],
				settleUnitPrice: [
					{ required: true, message: '请输入结算单价', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						max: 99999,
						msg: '请输入0-99999的正数，最多两位小数'
					}
				],
				settleQuantity: [
					{ required: true, message: '请输入结算数量', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						max: 99999999,
						msg: '请输入0-99999999的正数，最多四位小数'
					}
				],
				settleAmount: [
					{ required: true, message: '请输入结算金额', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						max: 99999999,
						msg: '请输入0-99999999的正数，最多两位小数'
					}
				],
				statementTime: [{ required: true, message: '请选择结算日期', trigger: 'change' }]
			},
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			disabled: this.$route.query.type == 'detail' || this.$route.query.type == 'unEdit' ? true : false
		};
	},
	methods: {
		getTime(value, dateString) {
			this.form.statementTime = dateString;
		},
		async getSettlementInfo(statementId) {
			const res = await API_GetSettlementInfo({ statementId: statementId });
			this.form.serialNo = res.data.serialNo;
			this.form.settleUnitPrice = res.data.settleUnitPrice.toString();
			this.form.settleQuantity = res.data.settleQuantity.toString();
			this.form.settleAmount = res.data.settleAmount.toString();
			this.fileInfos = this.fileDataSource = res.data.attachmentList;
			this.form.statementTime = res.data.statementTime;
		},
		onSubmit() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.fileInfos.length == 0) {
						this.$message.error('请上传附件');
						return false;
					}
					var bodyObj = {};
					Object.assign(bodyObj, this.form);
					let arr = [];
					this.fileInfos.forEach(element => {
						let item = {};
						item.type = element.type;
						item.fileUrl = element.fileUrl;
						item.fileName = element.fileName;
						item.md5Hex = element.md5Hex;
						arr.push(item);
					});
					bodyObj.attachmentList = arr;
					if (this.$route.query.type == 'edit' || this.$route.query.type == 'unEdit') {
						bodyObj.statementId = this.$route.query.statementId;
					}
					bodyObj.terminalContractId = this.$route.query.terminalContractId;
					API_SaveSettlement(bodyObj).then(res => {
						if (res.success) {
							this.$message.success('提交成功');
							this.$router.go(-1);
						}
					});
				} else {
					return false;
				}
			});
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		}
	}
};
</script>

<style lang="less" scoped>
.ant-form {
	margin-top: 30px;
	.ant-form-item-label {
		text-align: left;
	}
	.ant-row .row {
		padding-left: 30px;
		.ant-form-item-children {
			position: relative;
			span.text {
				position: absolute;
				top: -10px;
				right: -20px;
			}
		}
	}
	.ant-row .row:nth-child(2) {
		.ant-form-item-children span {
			right: -40px;
		}
	}
}
.title {
	margin: 0 40px;
	line-height: 32px;
	padding-bottom: 10px;
	border-bottom: 1px solid #ccc;
}
.upload-wrap {
	padding: 10px 40px;
}
</style>
