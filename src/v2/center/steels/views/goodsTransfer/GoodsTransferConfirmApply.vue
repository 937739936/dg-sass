<template>
	<div id="goodsTransferApplyBuyer">
		<div class="steps-wrap">
			<a-steps :current="1">
				<a-step title="选择待开具货转的合同信息" />
				<a-step title="选择对应货物信息" />
				<a-step title="完成" />
			</a-steps>
		</div>
		<div class="goods-form-apply">
			<a-form-model
				:rules="rules"
				ref="goodsTransferForm"
				:model="resultDetail"
				layout="inline"
			>
				<div class="title"><i class="title_icon"></i>基本信息</div>
				<a-row>
					<a-col
						:span="12"
						v-for="(item, index) in basicInfoList"
						:key="index"
						class="row"
					>
						<template v-if="item.value == 'billLoadingNo' || item.value == 'billLoadingDate'">
							<a-form-model-item
								v-if="item.type == 'input'"
								:ref="item.value"
								:label="item.label"
								:prop="item.value"
							>
								<a-input v-model="resultDetail[item.value]" />
								<!-- 焦煤004垛位号stackNum  动力煤010提单号billLoadingNo 提单日期 billLoadingDate 可输入 -->
							</a-form-model-item>
							<a-form-model-item
								v-if="item.type == 'date'"
								:ref="item.value"
								:label="item.label"
								:prop="item.value"
								:colon="false"
							>
								<a-date-picker
									format="YYYY-MM-DD"
									placeholder="请选择日期"
									v-model="resultDetail[item.value]"
									@change="handleDateChange"
								/>
							</a-form-model-item>
						</template>
						<template v-else>
							<a-form-item
								v-if="item.type == 'input'"
								:label="item.label"
								:colon="false"
							>
								<a-input
									v-if="!!item.filterValue"
									:disabled="true"
									v-model="resultDetail[item.filterValue]"
								/>
								<!-- 焦煤004垛位号stackNum可输入 -->
								<a-input
									v-else
									:disabled="item.value != 'stackNum' || (item.value == 'stackNum' && $route.query.type == 'submit')"
									v-model="resultDetail[item.value]"
								/>
							</a-form-item>
							<a-form-item
								v-if="item.type == 'date'"
								:label="item.label"
								:colon="false"
							>
								<a-date-picker
									format="YYYY-MM-DD"
									placeholder="请选择日期"
									v-model="resultDetail[item.value]"
									@change="handleDateChange"
								/>
							</a-form-item>
						</template>
						<a-form-item
							v-if="item.type == 'dateRange'"
							:label="item.label"
							:colon="false"
							class="date-range"
						>
							<a-range-picker
								:disabled="true"
								format="YYYY-MM-DD"
								:placeholder="['开始时间', '结束时间']"
								v-model="resultDetail[item.value]"
							/>
						</a-form-item>
					</a-col>
				</a-row>

				<template>
					<div class="title"><i class="title_icon" />收发货信息</div>
					<a-table
						:rowSelection="rowSelection"
						:columns="goodsTransferColumns"
						:scroll="{ x: true }"
						:rowKey="record => record.id"
						:dataSource="goodsTransferData"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
			</a-form-model>
			<div class="title"><i class="title_icon"></i>附件信息</div>
			<div class="upload-wrap">
				<div class="upload-block">
					<CustomUpload
						:isNeedRotate="true"
						:ifEditable="true"
						@uploadFiles="getUploadFiles"
						:fileDataSource="fileDataSource"
						:type="'transfer'"
					></CustomUpload>
				</div>
			</div>
			<a-modal
				:visible="rejectVisible"
				okText="确定"
				title="驳回"
				@cancel="
					() => {
						rejectVisible = false;
					}
				"
				@ok="handleReject"
				width="30%"
			>
				<a-form :form="form">
					<a-row>
						<a-row>
							<a-col :span="24">
								<a-form-item label="">
									<a-textarea
										placeholder="请输入驳回原因"
										:auto-size="{ minRows: 3 }"
										v-decorator="[
											'reason',
											{
												rules: [
													{ required: true, message: '驳回原因必填' },
													{ max: 200, message: '驳回原因不能超过200个字' }
												],
												validateTrigger: 'blur'
											}
										]"
									>
									</a-textarea>
								</a-form-item>
							</a-col>
						</a-row>
					</a-row>
				</a-form>
			</a-modal>
			<div class="btn-wrap">
				<a-button @click="prevContract">返回</a-button>
				<a-button
					type="primary"
					@click="rejectVisible = true"
					>驳回</a-button
				>
				<a-button
					type="primary"
					@click="confirm"
					>确认</a-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_SteelsGoodstransferConfirm,
	API_SteelsGetReceiveListInfo,
	API_SteelsGoodstransferDetail
} from '@/v2/center/steels/api/goodsTransfer.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';
export default {
	name: 'goodsTransferApplyBuyer',
	mounted() {
		this.contractNo = this.$route.query.contractNo;
		this.getEditDetail();
	},
	data() {
		return {
			goodsTransferForm: {
				contractNo: '',
				orderNo: '',
				buyerName: '',
				goodsName: '',
				transType: '',
				coalType: ''
			},
			falg: this.$route.query.flag,
			resultDetail: {},
			receiveIds: [],
			id: '',
			pdfUrl: '',
			// modalPdfIsShow:false,
			goodsTransferId: '',
			selectedRows: [], // 选中的批次数据
			basicInfoList: [
				{
					type: 'input',
					label: '合同编号',
					value: 'contractNo'
				},
				{
					type: 'input',
					label: '买方名称',
					value: 'buyCompanyName'
				},
				{
					type: 'input',
					label: '钢材种类',
					value: 'steelTypeDesc'
				},
				{
					type: 'input',
					label: '运输方式',
					value: 'transportMode'
				},
				{
					type: 'input',
					label: '合同期限',
					value: 'goodsTransferTime'
				},
				{
					type: 'input',
					label: '业务类型',
					value: 'businessTypeDesc'
				}
			], // 基本信息
			fileInfos: [],
			fileDataSource: [],
			goodTransferUrl: '', // 货转证明附件url
			rules: {
				billLoadingNo: [
					{
						required: true,
						message: '提单号必填',
						trigger: 'blur'
					}
				],
				billLoadingDate: [
					{
						required: true,
						message: '提单日期必填',
						trigger: 'blur'
					}
				]
			},
			goodsTransferColumns: [
				{
					title: '批次号',
					dataIndex: 'shipmentNo'
				},
				{
					title: '收货编号',
					dataIndex: 'receiptNo'
				},
				{
					title: '钢材种类',
					dataIndex: 'steelType',
					customRender: text => {
						return '废钢';
						// return filterCodeByValueName(text,'steelType') || text
					}
				},
				{
					title: '收货日期',
					dataIndex: 'receiptDate'
				},
				{
					title: '收货数量',
					dataIndex: 'receiptQuantity'
				}
			], // 无收发货信息时，货转信息table列
			goodsTransferData: [], // 无收发货信息时，货转信息选中的数据
			referredCertNo: '', // 被复用的货转编号
			receiveIds: [],
			/** 货转标的 */
			warehousesColumns: [
				{
					title: '品名',
					dataIndex: 'materialName',
					key: 'materialName'
				},
				{
					title: '规格',
					dataIndex: 'specs',
					key: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture',
					key: 'materialTexture'
				},
				{
					title: '产地',
					dataIndex: 'placeOfOrigin',
					key: 'placeOfOrigin'
				},
				{
					title: '合同数量',
					dataIndex: 'quantity',
					key: 'quantity'
				},
				{
					title: '已开具货转数量(吨)',
					dataIndex: 'issuedGoodsTransferQuantity',
					key: 'issuedGoodsTransferQuantity'
				},
				{
					title: '本次结算件数',
					dataIndex: 'currentPieceQuantity',
					scopedSlots: { customRender: 'currentPieceQuantity' }
				},
				{
					title: '本次货转数量(吨)',
					dataIndex: 'currentQuantity',
					scopedSlots: { customRender: 'currentQuantity' }
				}
			],
			warehousesData: [],
			form: this.$form.createForm(this), //驳回
			// 驳回原因
			reason: '',
			rejectVisible: false
		};
	},
	computed: {
		rowSelection() {
			const that = this;
			return {
				selectedRowKeys: this.receiveIds,
				onChange: (selectedRowKeys, selectedRows) => {
					that.receiveIds = selectedRowKeys;
				},
				getCheckboxProps: record => ({
					props: {
						disabled: that.$route.query.flag == 'submit'
					}
				})
			};
		}
	},
	methods: {
		// 货转修改
		getEditDetail() {
			API_SteelsGoodstransferDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.resultDetail = res.data.contract || {};
					this.contractNo = this.resultDetail.contractNo;
					res.data.receiveList.map(i => {
						this.receiveIds.push(i.id);
					});
					this.$nextTick(() => {
						this.warehousesData = res.data.purchaseLists;
					});

					this.resultDetail.steelTypeDesc = filterCodeByValueName(this.resultDetail.steelType, 'steelType');
					this.resultDetail.transportMode = filterCodeByValueName(this.resultDetail.transportMode, 'transportMode');

					API_SteelsGetReceiveListInfo(this.contractNo).then(resp => {
						if (resp.success) {
							// 合同剩余的收货列表
							this.goodsTransferData = res.data.receiveList.concat(resp.data.receiptResp);
							this.resultDetail.goodsTransferTime = `${resp.data.effectiveStartDate}-${resp.data.effectiveEndDate}`;
							this.$forceUpdate();
						}
					});
				}
			});
		},
		submitGoodsTransferApplyForm(type) {
			if (!this.receiveIds.length) {
				this.$message.error('请选择收发货信息');
				return;
			}

			let _this = this;
			if (type === 'submit') {
				this.$confirm({
					closable: true,
					content: '您确认信息无误并进行提交？',
					okText: '确认',
					onOk() {
						_this.submit();
					},
					cancelText: '取消',
					onCancel() {}
				});
			} else {
				this.save(type);
			}
		},
		async confirm() {
			// let ids = [].concat(this.receiveIds)
			if (!this.fileInfos.length) {
				this.$message.error('请上传附件');
				return;
			}
			const params = {
				operation: 'CONFIRMED',
				attachList: this.fileInfos.map(el => {
					return {
						type: '货权转移证明',
						fileId: el.id
					};
				}),
				id: +this.$route.query.id
			};
			await API_SteelsGoodstransferConfirm(params);
			this.$message.success('操作成功！');
			this.$router.go(-1);
		},
		async handleReject() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const params = {
						operation: 'REJECT',
						reason: values.reason,
						id: +this.$route.query.id
					};
					API_SteelsGoodstransferConfirm(params).then(res => {
						if (res.success) {
							this.$message.success('驳回成功！');
							this.rejectVisible = false;
							this.$router.go(-1);
						}
					});
				}
			});
		},
		prevContract() {
			if (this.$route.query.id) {
				this.$router.go('-1');
			} else {
				this.$router.push({
					path: '/center/steels/goodsTransfer/goodsTransferApplyList',
					query: {
						contractNo: this.$route.query.contractNo
					}
				});
			}
		},
		// 仓押业务
		getUploadFiles(data) {
			this.fileInfos = data;
		}
	},
	components: {
		CustomUpload
	}
};
</script>

<style lang="less">
#goodsTransferApplyBuyer {
	color: rgba(0, 0, 0, 0.75);
	padding-bottom: 80px;

	.ant-table td,
	.ant-table th {
		white-space: nowrap;
	}

	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin-bottom: 30px;

		.title_icon {
			width: 12px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			margin: 0 14px;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}

	.row {
		padding-left: 40px;
		line-height: 60px;
		margin-bottom: 0;
	}

	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 74px;
			margin-right: 46px;
			display: inline-block;
			text-align: left;
		}
	}

	.ant-form-item-control {
		input {
			width: 240px;
		}

		.ant-select {
			width: 240px;
		}
	}

	.date-range {
		.ant-calendar-picker {
			width: 240px;

			input {
				width: 90px;
			}
		}
	}

	.weight-unit .ant-form-item-children {
		&:after {
			content: '吨';
			font-size: 12px;
			color: rgba(0, 0, 0, 0.75);
			margin-left: 10px;
		}
	}

	.table-wrap {
		margin-bottom: 30px;
	}

	.ant-form-inline .ant-form-item-with-help {
		margin-bottom: 0;
	}
}
</style>
