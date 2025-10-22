<template>
	<div>
		<div class="release-form-ship">
			<a-form
				:form="releaseForm"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-row>
							<a-form-item
								label="发货数量(吨)"
								:colon="false"
								required
							>
								<div class="flex-row">
									<a-input
										placeholder="发货数量(吨)"
										autocomplete="off"
										v-decorator="['deliverQuantity', { rules: [{ validator: validateQuantity }] }]"
									/>
									<a-tooltip>
										<template #title>船运业务中，若不填写发货数量直接提交，则进入装货中状态</template>
										<i
											class="iconfont icon-liebiaobiaotou-shuoming"
											style="font-size: 12px"
										></i>
									</a-tooltip>
								</div>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="发货日期"
								:colon="false"
							>
								<a-date-picker
									placeholder="发货日期"
									:disabled-date="disabledDate"
									v-decorator="['deliverDate', { rules: [{ required: true, message: '发货日期必填' }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="提单号"
								:colon="false"
							>
								<a-input
									placeholder="提单号"
									v-decorator="['ladingNo']"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row>
							<a-form-item
								label="提单日期"
								:colon="false"
							>
								<a-date-picker
									placeholder="提单日期"
									v-decorator="['ladingDate']"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="selectContractInfo.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE' && isRelate"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="付款节点"
								:colon="false"
							>
								<a-select
									placeholder="请选择付款节点"
									v-decorator="[
										'payNode',
										{
											rules: [{ required: true, message: '付款节点必填' }]
										}
									]"
								>
									<a-select-option value="SHIPMENT">装船付 </a-select-option>
									<a-select-option value="ARRIVAL">到港付 </a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
			<ShipInfo
				:data-source="shipDetailDtoList"
				ref="shipInfo"
			/>
			<!-- <FileTable
        :add-type="fileType"
        :fileData="attachments"
        @fileChange="attachmentsChange"
      /> -->
			<Attachment
				:list="fileType"
				ref="attachment"
			></Attachment>
			<div class="submit-btn">
				<a-button
					type="primary"
					ghost
					@click="goBack"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="submitReleaseForm"
					>提交</a-button
				>
			</div>
		</div>
		<ConfirmReturn ref="confirmReturn" />
	</div>
</template>

<script>
import { API_DELIVERYSAVE } from '@/v2/center/trade/api/receive';
import moment from 'moment';
import { mapGetters } from 'vuex';
import ShipInfo from '@/v2/center/trade/views/receive/components/ShipInfo';
import FileTable from '@/v2/center/trade/views/receive/components/FileTable';
import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn';
import Attachment from './Attachment.vue';

export default {
	props: {
		deliverId: {
			type: String,
			default: () => {
				return '';
			}
		},
		inLoading: {
			//装货中
			type: Boolean,
			default: () => {
				return false;
			}
		},
		isRelate: {
			default: true
		},
		getRelatedContract: {
			type: Function
		},
		deliverSubmit: {},
		selectContractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		shipDetailDtoList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	name: 'ReleaseApplyShip',
	components: {
		FileTable,
		ShipInfo,
		ConfirmReturn,
		Attachment
	},
	data() {
		return {
			releaseForm: this.$form.createForm(this),
			fileType: [
				{
					key: 'YSPZ',
					label: '运输凭证',
					tooltip: '船运业务中，若不上传运输凭证直接提交，则进入装货中状态',
					required: false,
					tip: '上传附件格式要求：可支持上传jpg,jpeg,png,bmp,pdf的附件,单个附件大小不超过100M',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				},
				{
					key: 'HYPZ',
					label: '化验凭证',
					required: false,
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				},
				{
					key: 'CZPZ',
					label: '称重凭证',
					required: false,
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				},
				{
					key: 'DELIVER_SHIP_HARBOR',
					label: '港口确认凭证',
					required: false,
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				},
				{
					key: 'OTHER',
					label: '其他凭证',
					required: false,
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				}
			],
			attachments: [],
			inLoadingStatus: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {},
	methods: {
		initAttach(list) {
			this.$refs.attachment.init(list);
		},
		// 校验发货数量
		validateQuantity(rule, value, callback) {
			// 校验发货数量
			let regs2 = /^\d+(\.\d{0,3})?$/;
			if (value && (!regs2.test(value) || Number(value) >= 100000000)) {
				callback('装货数量不大于10000000吨，最多三位小数');
			} else {
				callback();
			}
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		moment(val) {
			return moment(val).locale('zh-cn').format('YYYY-MM-DD');
		},
		asyncConfirm() {
			return new Promise(resolve => {
				this.$confirm({
					title: '确认提交',
					content: '未填写发货数量、船舶装货量或运输凭证，提交后将进入装货中状态，是否继续提交？',
					onOk: () => {
						resolve(true);
					},
					onCancel: () => {
						resolve(false);
					}
				});
			});
		},
		submitReleaseForm() {
			this.$nextTick(() => {
				this.releaseForm.validateFieldsAndScroll(async (err, values) => {
					const flag = await this.deliverSubmit();
					if (!flag) {
						return;
					}
					let deliveryInfoShip = this.$refs.shipInfo.form.tableDataSource;
					if (deliveryInfoShip.length < 1) {
						this.$message.error('请录入至少一条运输信息');
						return false;
					}
					if (err) {
						return;
					}
					let contractNo = this.getRelatedContract();
					if (!contractNo && !values.deliverQuantity && values.deliverQuantity !== 0 && !this.inLoading) {
						this.$message.error('发货数量必填');
						return;
					}

					let hasEmptyDeliverQuatity = false;
					deliveryInfoShip.map(item => {
						item.destinationPortInTime = item.destinationPortInTime
							? moment(item.destinationPortInTime).format('YYYY-MM-DD HH:mm:ss')
							: undefined;
						item.originPortInTime = item.originPortInTime
							? moment(item.originPortInTime).format('YYYY-MM-DD HH:mm:ss')
							: undefined;
						if (!item.deliverQuantity && item.deliverQuantity !== 0) {
							hasEmptyDeliverQuatity = true;
						}
					});
					if (!contractNo && hasEmptyDeliverQuatity && !this.inLoading) {
						this.$message.error('装货量必填');
						return;
					}
					let shipInfoVlidator = await this.$refs.shipInfo.handleSubmit();
					if (!shipInfoVlidator) {
						return;
					}

					const attachList = this.$refs.attachment.save();

					if (!attachList) {
						return;
					}
					let hasTransport = attachList.some(item => item.type == 'YSPZ');
					//inLoadingStatus==true 进入装货中状态
					this.inLoadingStatus =
						(!values.deliverQuantity && values.deliverQuantity !== 0) || hasEmptyDeliverQuatity || !hasTransport;
					if (this.deliverId) {
						if (!this.inLoading && !contractNo) {
							this.inLoadingStatus = false;
						}
					} else if (!contractNo) {
						this.inLoadingStatus = false;
					}

					if (this.inLoadingStatus) {
						let isok = await this.asyncConfirm();
						if (!isok) {
							return;
						}
					}

					//判断运输信息中是否需要补充信息信息字段
					let PortDetail = false;
					deliveryInfoShip.map(item => {
						//有始发港，但是没有详细信息 不再选择始发港
						// if(item.originPortName&&!(item.originPortDetailAddress||item.originPortLat||item.originPortLon||item.originPortElectronicFenceRadius)){
						//   this.$message.error(`请重新选择港口（${item.originPortName}）对应信息`)
						//   PortDetail=true;
						// }
						//有目的港，但是没有详细信息
						if (
							item.destinationPortName &&
							!(
								item.destinationPortDetailAddress ||
								item.destinationPortLat ||
								item.destinationPortLon ||
								item.destinationPortElectronicFenceRadius
							)
						) {
							this.$message.error(`请重新选择港口（${item.destinationPortName}）对应信息`);
							PortDetail = true;
						}
					});
					if (PortDetail) {
						return;
					}
					let bodyObj = {
						orderId: this.isRelate ? this.$route.query.orderId : null,
						deliverId: this.$route.query.deliverId,
						transInfo: [{
							ladingNo: values.ladingNo,
							ladingDate: values.ladingDate ? this.moment(values.ladingDate) : undefined,
							deliverDate: this.moment(values.deliverDate),
							transType: 3,
							deliverQuantity: values.deliverQuantity,
							shipDetailDtoList: this.$refs.shipInfo.form.tableDataSource,
							submit: true,
							payNode: values.payNode,
							receiverName: this.selectContractInfo?.receiverName?.join(','),
							deliveryPlace: this.selectContractInfo.deliveryPlace,
							unloadGoodsPlace: this.selectContractInfo.unloadGoodsPlace,
							fileInfoList: attachList
						}],
						
					};

					if (this.verifyFile()) {
						if (this.inLoadingStatus) {
							this.saveDelivery(bodyObj);
						} else {
							this.openModel(bodyObj);
						}
					}
				});
			});
		},

		saveDelivery(obj) {
			return API_DELIVERYSAVE(obj)
				.then(res => {
					if (!res.success) {
						return;
					}
					if (!obj.orderId) {
						this.$message.success('发货申请提交成功');
						this.$router.push('/center/receive/send/list');
						return;
					}
					if (this.inLoadingStatus) {
						this.$message.success('发货申请提交成功');
						this.$router.push('/center/receive/send/list');
						return;
					}
					if (obj.transInfo.payNode == 'SHIPMENT') {
						this.$message.success('发货申请提交成功');
						this.$router.push('/center/receive/send/list');
						return;
					}
					this.$confirm({
						closable: true,
						content: '您可以直接开具货转凭证，是否前往开具？',
						okText: '立即前往',
						onOk: () => {
							this.$router.push({
								path: '/center/transfer/goodsTransfer/apply',
								query: {
									serialNo: this.selectContractInfo.orderSerialNo,
									orderType: 'ONLINE',
									serialId: obj.orderId
								}
							});
						},
						cancelText: '暂不开具',
						onCancel: () => {
							this.$message.success('发货申请提交成功');
							this.$router.push('/center/receive/send/list');
						}
					});
				})
				.finally(() => {});
		},
		openModel(obj) {
			this.$confirm({
				centered: true,
				title: '请确认发货信息无误并提交发货申请吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.saveDelivery(obj);
				},
				onCancel() {}
			});
		},
		attachmentsChange(attachments) {
			this.attachments = attachments;
		},
		goBack() {
			this.$refs.confirmReturn.init('/center/receive/send/list');
		},
		verifyFile() {
			let fileType = '';
			let success = true;
			this.attachments.map(item => {
				fileType += item.typeName;
			});
			// let contractNo = this.getRelatedContract();
			this.fileType
				.filter(item => item.required)
				.map(item => {
					if (!fileType.includes(item.label)) {
						if (item.key != 5) {
							this.$message.error(`请上传${item.label}`);
							success = false;
						} else {
							if (!this.inLoadingStatus) {
								this.$message.error(`请上传${item.label}`);
								success = false;
							}
						}
					}
				});
			return success;
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	height: 82px;
}
.flex-row {
	display: flex;
	align-items: center;
	.icon-liebiaobiaotou-shuoming {
		margin-left: 10px;
		cursor: pointer;
	}
}

.ant-form-item {
	width: 364px;
}

.submit-btn {
	text-align: center;
	margin-top: 52px;

	.ant-btn {
		margin: 0 10px;
		width: 114px;
		height: 38px;
		line-height: 38px;
	}
}
</style>
