<template>
	<div
		class="slMain"
		v-if="detailData"
	>
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ this.$route.query.view === 'edit' ? $route.meta.editTitle : $route.meta.title }}</span>
			</div>
			<div class="slTitleAssis">合同信息</div>
			<ul
				class="grid-wrap"
				v-if="contractInfo"
			>
				<li>
					<span class="label">合同编号</span>
					<span>
						<div
							class="contract-box"
						>
							<TextOverFlow
								:content="contractInfo.contractNo"
								:maxWidth="maxWidth"
								@clickFunc="viewContractDetail"
							/>
							<div class="copy-icon" @click="changeContract()">
								<ChooseIcon></ChooseIcon>
							</div>
						</div>
					</span>
				</li>
				<li>
					<span class="label">卖方企业</span>
					<span>{{ contractInfo.sellerName || VUEX_ST_COMPANYSUER.companyName }}</span>
				</li>
				<li>
					<span class="label">买方企业</span>
					<span>{{ contractInfo.buyerName }}</span>
				</li>
				<li>
					<span class="label">品名</span>
					<TextOverFlow
						:content="contractInfo.goodsName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">基准价格</span>
					<TextOverFlow
						v-if="!contractInfo.followTheMarket && contractInfo.basePriceDesc"
						:content="contractInfo.basePriceDesc"
						:maxWidth="maxWidth"
					/>
					<span v-if="contractInfo.followTheMarket">随行就市</span>
					<span v-if="!contractInfo.followTheMarket && contractInfo.basePrice"
						>{{ contractInfo.basePrice | formatMoney(2) }}元/吨</span
					>
					<span v-if="!contractInfo.followTheMarket && !contractInfo.basePrice">-</span>
				</li>
				<li>
					<span class="label">数量</span>
					<span
						>{{ contractInfo.quantity | formatMoney(2) }}吨
						<template v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</template>
					</span>
				</li>
				<li>
					<span class="label">签订日期</span>
					<span>{{ contractInfo.signTime }}</span>
				</li>
				<li>
					<span class="label">交货期限</span>
					<span>{{ contractInfo.deliveryStartDate }}至{{ contractInfo.deliveryEndDate }}</span>
				</li>
				<li>
					<span class="label">运输方式</span>
					<span>{{ contractInfo.transportModeDesc || '无' }}</span>
				</li>
			</ul>
			<div
				class="slTitleAssis"
				style="margin-top: 50px"
			>
				业务线信息
			</div>
			<div class="table-box">
				<a-table
					:columns="businessLineColumns"
					class="new-table"
					:bordered="false"
					rowKey="businessLineNo"
					:dataSource="businessLineInfo"
					:pagination="false"
					:rowSelection="{
						selectedRowKeys: bizLineSelectedRowKeys,
						onChange: onSelectBizLineChange,
						type: 'radio'
					}"
					:customRow="onClickBizLineRow"
				>
					<template
						slot="businessLineNo"
						slot-scope="text, items"
					>
						<a
							href="javascript:;"
							@click="viewBusinessLineDetail(items)"
							>{{ text }}</a
						>
					</template>
				</a-table>
			</div>
			<div class="slTitleAssis">追保函信息</div>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="追保函编号">
							<a-input
								:maxLength="50"
								autoComplete="off"
								placeholder="请输入追保函编号"
								v-decorator="[
									`serialNo`,
									{
										validateTrigger: 'blur',
										rules: [{ required: true, message: `追保函编号必填` }]
									}
								]"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="追保金额(元)">
							<a-input-number
								:formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
								:precision="2"
								:min="0"
								:max="99999999.99"
								v-decorator="['recoveryAmount', { rules: [{ required: true, message: '追保金额必填' }] }]"
								:step="0.01"
								:parser="value => value.replace(/\￥\s?|(,*)/g, '')"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="签发日期">
							<a-date-picker
								placeholder="请选择签发日期"
								:disabled-date="disabledStartDate"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								v-decorator="[
									`signTime`,
									{
										rules: [
											{
												required: true,
												message: `签发日期必填`
											}
										]
									}
								]"
							>
							</a-date-picker>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="追保截止日期">
							<a-date-picker
								placeholder="请选择追保截止日期"
								:disabled-date="disabledEndDate"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								v-decorator="[
									`recoveryDeadline`,
									{
										rules: [
											{
												required: true,
												message: `追保截止日期必填`
											}
										]
									}
								]"
							>
							</a-date-picker>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="slTitleAssis">附件</div>
			<span></span>
			<AttachmentUpload
				@beginUpload="getBeginUpload"
				:dataSource="fileList"
				ref="attachmentUpload"
				accept=".jpg,.jpeg,.png,.pdf"
				tips="【线下追保函】可支持格式为jpg，jpeg，png，pdf的附件，单个附件大小不得超过100M的文件。"
			/>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="cancel"
						>取消</a-button
					>
					<a-button
						type="primary"
						:loading="loadingSubmit"
						:disabled="disabled"
						@click="submit"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
		<ChooseContract
			:type="$route.query.type"
			:contractType="contractType"
			ref="chooseContract"
			@detail="getContractDetail"
			:id="contractInfo.id"
		/>
		<ConfirmModal
			ref="backConfirmModal"
			@confirm="backConfirmFunc"
		/>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import AttachmentUpload from '@/v2/components/upload/AttachmentUpload';
import ChooseContract from '../components/ChooseContract';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import { API_GetContractBusinessLineInfo, API_BondLetterSaveOrUpdate } from '@/v2/center/trade/api/bondLetter';
import { mapGetters } from 'vuex';
import { deepCompare, GetCurrentDateFormat } from '@/v2/utils/factory';
import TextOverFlow from "@sub/components/TextOverflow.vue";
const businessLineColumns = [
	{ title: '业务线号', dataIndex: 'businessLineNo', scopedSlots: { customRender: 'businessLineNo' } },
	{ title: '业务线名称', dataIndex: 'businessLineName' },
	{ title: '上游采购合同编号', dataIndex: 'parentContractNo' }
];
import { ChooseIcon } from '@sub/components/svg';
export default {
	name: 'Detail',
	data() {
		return {
			businessLineColumns,
			copyContractNoVisible: false,
			loadingSubmit: false,
			form: this.$form.createForm(this),
			detailData: {},
			contractInfo: {},
			businessLineInfo: [],
			bizLineSelectedRowKeys: [],
			bondLetterData: {},
			fileList: [{ type: 'APPEND_BOND_LETTER', id: '', fileList: [], typeName: '追加保证金承诺函' }],
			orderContractId: this.$route.query.orderContractId,
			contractType: this.$route.query.contractType,
			oldForm: {
				recoveryAmount: undefined,
				recoveryDeadline: undefined,
				signTime: GetCurrentDateFormat(),
				serialNo: undefined
			},
			formValue: {},
			dataObj: {},
			isChangeContract: false, //是否修改合同
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null, //浏览器尺寸
			disabled: false
		};
	},
	components: {
		Breadcrumb,
		AttachmentUpload,
		ChooseContract,
		ConfirmModal,
		TextOverFlow,
		ChooseIcon
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCreator() {
			return this.VUEX_ST_COMPANYSUER.company.uscc === this.contractInfo.sellerUscc;
		}
	},
	created() {
		this.getDetail();
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		getBeginUpload(val) {
			this.disabled = val;
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 220;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 220;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 240;
			} else {
				this.maxWidth = 350;
			}
		},
		getDetail() {
			const obj = {
				orderContractId: this.orderContractId,
				contractType: this.contractType
			};
			let currentDate = GetCurrentDateFormat(); // 获取当前日期
			this.$nextTick(() => {
				this.form.setFieldsValue({
					signTime: currentDate
				});
			});
			if (this.$route.query.view === 'edit') {
				obj.bondLetterId = this.$route.query.bondLetterId;
			}
			API_GetContractBusinessLineInfo(obj).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.contractInfo = res.data.contractInfo || {};
					this.contractType = this.contractInfo?.contractType;
					this.businessLineInfo = res.data.businessLineInfoList || [];
					if (this.$route.query.view === 'edit') {
						this.bondLetterData = res.data.bondLetterData || {};
						if (!this.isChangeContract) {
							this.bizLineSelectedRowKeys = [this.bondLetterData.businessLineNo];
							this.$refs.attachmentUpload.init(this.bondLetterData.attachmentList);
						}
						this.$nextTick(() => {
							this.form.setFieldsValue({
								recoveryAmount: this.bondLetterData.recoveryAmount,
								recoveryDeadline: this.bondLetterData.recoveryDeadline,
								signTime: this.bondLetterData.signTime,
								serialNo: this.bondLetterData.serialNo
							});
						});
						this.oldForm = {
							recoveryAmount: this.bondLetterData.recoveryAmount,
							recoveryDeadline: this.bondLetterData.recoveryDeadline,
							signTime: this.bondLetterData.signTime,
							serialNo: this.bondLetterData.serialNo
						};
					}
					if (this.businessLineInfo.length === 1) {
						this.bizLineSelectedRowKeys = [this.businessLineInfo[0].businessLineNo];
					}
				}
			});
		},
		onSelectBizLineChange(selectedRowKeys) {
			this.bizLineSelectedRowKeys = selectedRowKeys;
		},
		onClickBizLineRow(record) {
			return {
				on: {
					click: () => {
						this.bizLineSelectedRowKeys = [record.businessLineNo];
					}
				}
			};
		},
		// 业务线详情
		viewBusinessLineDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.parentOrderNo,
					downOrderNo: items.orderNo,
					businessLineType: items.type,
					businessLineNo: items.businessLineNo,
					contractType: 0,
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					downstreamActiveIndex: 0
				}
			});
			window.open(routerData.href, '_blank');
		},
		cancel() {
			this.formValue = {
				recoveryAmount: this.form.getFieldValue('recoveryAmount'),
				recoveryDeadline: this.form.getFieldValue('recoveryDeadline'),
				signTime: this.form.getFieldValue('signTime'),
				serialNo: this.form.getFieldValue('serialNo')
			};
			// 比较表单是否发生变化
			if (!deepCompare(this.oldForm, this.formValue)) {
				const modalObj = {
					modalTitle: '取消',
					modalText: '取消后已录入信息将不会被保存，确认离开当前页面？'
				};
				this.$refs.backConfirmModal.showModal(modalObj);
			} else {
				this.backConfirmFunc();
			}
		},
		backConfirmFunc() {
			this.$router.push({
				path: '/center/bondLetter/online/list?active=offline'
			});
		},
		formateFileData(data) {
			if (data) {
				var arr = [];
				data[0].fileList.forEach(item => {
					var obj = {
						...item
					};
					obj.typeName = data[0].typeName;
					obj.type = data[0].type;
					arr.push(obj);
				});
				return arr;
			}
		},
		validateFile() {
			const files = this.$refs.attachmentUpload.dataSource;
			if (!files.length || (files.length && !files[0].fileList.length)) {
				this.$message.error('请上传线下追保函');
				return false;
			}
			if (files.length > 5) {
				this.$message.error('最多不超过5个');
				return false;
			}
			return true;
		},
		submit() {
			if (!this.bizLineSelectedRowKeys.length) {
				this.$message.error('请至少选择一个业务线');
				return;
			}
			this.form.validateFields((err, values) => {
				if (!err) {
					this.dataObj = {
						...values
					};
					this.dataObj.type = this.$route.query.type;
					this.dataObj.contractType = this.contractType;
					this.dataObj.businessLineNo = this.bizLineSelectedRowKeys[0];
					this.dataObj.orderNo = this.contractInfo.orderNo;
					if (!this.validateFile()) return;
					const attachmentInfo = this.formateFileData(this.$refs.attachmentUpload.dataSource);
					this.dataObj.fileInfos = attachmentInfo;
					if (this.dataObj.contractType === 'ONLINE') {
						this.dataObj.contractNo = this.contractInfo.contractNo;
					} else {
						this.dataObj.terminalContractId = this.contractInfo.id;
						this.dataObj.paperContractNo = this.contractInfo.contractNo;
					}
					if (this.$route.query.view === 'edit') {
						this.dataObj.id = this.bondLetterData.id;
					}

					const modalObj = {
						modalTitle: '确认',
						modalText: '提交后，追保函将生效，请仔细核对追保函信息'
					};
					this.$refs.confirmModal.showModal(modalObj);
				}
			});
		},
		confirmFunc() {
			this.loadingSubmit = true;
			API_BondLetterSaveOrUpdate(this.dataObj)
				.then(res => {
					if (res.success && res.data) {
						this.$message.success('追保函提交成功');
						this.$router.push('/center/bondLetter/online/list?active=offline');
						this.loadingSubmit = false;
					}
				})
				.finally(() => {
					this.loadingSubmit = false;
				});
		},
		disabledStartDate(current) {
			if (this.form.getFieldValue('recoveryDeadline')) {
				return current > moment(this.form.getFieldValue('recoveryDeadline'));
			} else {
				return false;
			}
		},
		disabledEndDate(current) {
			if (this.form.getFieldValue('signTime')) {
				return current < moment(this.form.getFieldValue('signTime'));
			} else {
				return false;
			}
		},
		changeContract() {
			this.$refs.chooseContract.showModal();
		},
		getContractDetail(data) {
			this.isChangeContract = true;
			this.contractInfo = data;
			(this.orderContractId = data.id), (this.contractType = data.contractType), this.getDetail();
			this.bizLineSelectedRowKeys = [];
		},
		viewContractDetail() {
			let type = this.isCreator ? 'SELL' : 'BUY';
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + this.contractInfo.contractType.toLowerCase() + '/detail',
				query: {
					id: this.contractInfo.id,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	/deep/.ant-card {
		padding-bottom: 48px;
	}
	.slTitleAssis {
		margin-top: 30px;
	}
	.grid-wrap {
		margin-top: 20px;
		width: 100%;
		border-radius: 3px;
		height: auto;
		overflow: hidden;
		border-left: 1px solid #e5e6eb;
		li {
			width: 33.3%;
			height: 48px;
			float: left;
			border-bottom: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			overflow: hidden;
			position: relative;
			span,
			.textOverflow {
				display: inline-block;
				height: 48px;
				line-height: 48px;
				padding: 0 12px;
			}
			& > span:first-child {
				border-right: 1px solid #e5e6eb;
			}
			.label {
				width: 120px;
				background: #f3f5f6;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #77889d;
				position: absolute;
				left: 0;
				top: 0;
			}
			span:last-child {
				width: 100%;
				padding-left: 132px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.textOverflow {
				left: 132px;
				padding: 0;
			}
			.contract-box {
				color: @primary-color;
			}
		}
		li:nth-child(1),
		li:nth-child(2),
		li:nth-child(3) {
			border-top: 1px solid #e5e6eb;
		}
		li:nth-child(3) {
			border-radius: 0 3px 0 0;
		}
		li:last-child {
			border-radius: 0 0 3px 0;
		}
		li.special {
			border-radius: 0 3px 3px 0;
		}
	}
	.copy-icon {
		margin-left: 12px;
		cursor: pointer;
		position: absolute;
		top: 17px;
		width: 14px;
		height: 14px;
		left: 170px;
		display: flex;
		align-items: center;
	}
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
	.slFormDetail {
		.ant-col {
			height: 82px;
		}
		.ant-form-item {
			width: 364px;
			margin-bottom: 0;
		}
	}
	.table-box {
		padding-bottom: 20px;
		margin-top: 20px;
		.new-table {
			max-height: 268px;
			overflow: hidden;
			/deep/.ant-table-body {
				max-height: 268px;
				overflow-y: scroll;
			}
		}
	}
}
.attachment {
	margin-bottom: 60px;
}
// 小于1366 以1300为准
@media screen and (min-width: 1920px) {
	.copy-icon {
		left: 480px !important;
	}
}
@media screen and (max-width: 1919px) {
	.copy-icon {
		left: 370px !important;
	}
}
@media screen and (max-width: 1559px) {
	.copy-icon {
		left: 330px !important;
	}
}
</style>
