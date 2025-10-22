<template>
	<div>
		<div class="release-form-ship">
			<a-form
				:form="releaseForm"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="发货数量(吨)">
							<a-input
								placeholder="发货数量(吨)"
								autocomplete="off"
								@change="e => handleDeliverQuantityChange(e)"
								v-decorator="[
									'deliverQuantity',
									{
										rules: [
											{ required: true, message: '发货数量必填' },
											{
												validator: validNumber({ float: 2, min: 0, max: 99999999.99 })
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="发货日期">
							<a-date-picker
								placeholder="发货日期"
								:disabled-date="disabledDate"
								v-decorator="['deliverDate', { rules: [{ required: true, message: '发货日期必填' }] }]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<ShipInfo
				:data-source="shipDetailDtoList"
				:portNameHistoryInfo="portNameHistoryInfo"
				ref="shipInfo"
				@changeFirstDeliverQuantity="changeFirstDeliverQuantity"
			/>
			<Attachment
				:list="fileType"
				ref="attachment"
			></Attachment>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { validNumber } from '@/v2/utils/validForm';
import ShipInfo from '@/v2/center/logisticSupervise/views/receive/components/ShipInfo';
import FileTable from '@/v2/center/logisticSupervise/views/receive/components/FileTable';
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
		},
		portNameHistoryInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
	},
	name: 'ReleaseApplyShip',
	components: {
		FileTable,
		ShipInfo,
		Attachment
	},
	data() {
		return {
			validNumber,
			releaseForm: this.$form.createForm(this),
			fileType: [
				{
					key: 'YSPZ',
					label: '运输凭证',
					required: true,
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
			attachments: []
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
			return new Promise(resolve => {
				this.$nextTick(() => {
					this.releaseForm.validateFieldsAndScroll(async (err, values) => {
						const flag = await this.deliverSubmit();
						if (!flag) {
							resolve(false);
						}
						let deliveryInfoShip = this.$refs.shipInfo.form.tableDataSource;
						if (deliveryInfoShip.length < 1) {
							this.$message.error('请录入至少一条运输信息');
							resolve(false);
						}
						if (err) {
							resolve(false);
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
						if (hasEmptyDeliverQuatity) {
							this.$message.error('装货量必填');
							resolve(false);
						}
						let shipInfoVlidator = await this.$refs.shipInfo.handleSubmit();
						if (!shipInfoVlidator) {
							resolve(false);
						}
						const attachList = this.$refs.attachment.save();
						if (!attachList) {
							resolve(false);
						}
						//判断运输信息中是否需要补充信息信息字段
						let PortDetail = false;
						deliveryInfoShip.map(item => {
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
							resolve(false);
						}
						let bodyObj = {
							orderId: this.isRelate ? this.$route.query.orderId : null,
							deliverId: this.$route.query.deliverId,
							transInfo: [
								{
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
								}
							]
						};
						resolve(bodyObj);
					});
				});
			});
		},
		attachmentsChange(attachments) {
			this.attachments = attachments;
		},
		goBack() {
			this.$router.back();
		},
		// 发货数量发生变化
		handleDeliverQuantityChange(e) {
			let deliverQuantity = e.target.value;
			if (deliverQuantity) {
				this.$refs.shipInfo.setFirstDeliverQuantity(deliverQuantity);
			}
		},
		changeFirstDeliverQuantity(e) {
			this.releaseForm.setFieldsValue({ deliverQuantity: e });
			this.releaseForm.validateFields(['deliverQuantity']);
		}
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	padding: 0;
	.ant-row {
		.ant-col-8:nth-child(3n + 1) {
			display: flex;
			justify-content: left;
		}
		.ant-col-8:nth-child(3n + 2) {
			display: flex;
			justify-content: center;
		}
		.ant-col-8:nth-child(3n) {
			display: flex;
			justify-content: right;
		}
	}
}

.ant-col {
	min-height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
</style>
