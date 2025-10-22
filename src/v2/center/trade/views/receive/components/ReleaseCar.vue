<template>
	<div class="release-form-car">
		<a-form
			:form="releaseForm"
			class="slFormDetail"
		>
			<a-row class="row">
				<a-col :span="8">
					<a-row>
						<a-form-item
							label="发货数量(吨)"
							:colon="false"
						>
							<a-input
								placeholder="发货数量(吨)"
								autocomplete="off"
								v-decorator="[
									'deliverQuantity',
									{
										rules: [
											{ required: true, message: '请输入发货数量' },
											{
												validator: validateQuantity
											}
										]
									}
								]"
							/>
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
								v-decorator="['deliverDate', { rules: [{ required: true, message: '请输入发货日期' }] }]"
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
							label="发货地址"
							:colon="false"
						>
							<a-input
								placeholder="发货地址"
								autocomplete="off"
								v-decorator="[
									'deliverAddr',
									{
										rules: [{ required: true, message: '请输入发货地址' }],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row>
						<a-form-item
							label="收货地址"
							:colon="false"
							class="textarea-wrap"
						>
							<a-input
								placeholder="收货地址"
								autocomplete="off"
								v-decorator="[
									'receiveAddr',
									{
										rules: [{ required: true, message: '请输入收货地址' }]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							label="车数"
							:colon="false"
						>
							<a-input
								placeholder="车数"
								autocomplete="off"
								v-decorator="[
									'trainNum',
									{
										rules: [
											{ required: true, message: '请输入车数' },
											{ pattern: /^[0-9]*$/, message: '车数为正整数' }
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<CarInfo
			type="release"
			ref="carInfo"
			v-if="!isAccountAndCar"
			:selectContractInfo="selectContractInfo"
			:datas="automobileDetailDtoList"
		/>
		<Attachment
			:list="fileType"
			ref="attachment"
		></Attachment>
		<!-- <FileTable
        :add-type="fileType"
        :fileData="attachments"
        @fileChange="attachmentsChange"
    /> -->
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
		<ConfirmReturn ref="confirmReturn" />
	</div>
</template>

<script>
import FileTable from '@/v2/center/trade/views/receive/components/FileTable';
import CarInfo from '@/v2/center/trade/views/receive/components/CarInfo';
import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn';
import { API_DELIVERYSAVE } from '@/v2/center/trade/api/receive';
import Attachment from './Attachment.vue';
import moment from 'moment';

export default {
	name: 'ReleaseCar',
	props: {
		selectContractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		automobileDetailDtoList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		isRelate: {
			default: true
		}
	},
	components: {
		CarInfo,
		FileTable,
		ConfirmReturn,
		Attachment
	},
	computed: {
		// 是否是汽运 并且是 应收业务
		isAccountAndCar() {
			return this.selectContractInfo.businessType == 'ACCOUNT_RECEIVABLE' && this.isRelate;
		}
	},
	watch: {
		selectContractInfo(e) {
			this.releaseForm.setFieldsValue({
				deliverAddr: this.selectContractInfo.deliveryStationList,
				receiveAddr: this.selectContractInfo.arriveStationList
			});
		}
	},
	data() {
		return {
			releaseForm: this.$form.createForm(this),
			signLoading: false,
			isEdit: false,
			fileType: [
				{
					key: 'YSPZ',
					label: '运输凭证',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					required: true
				}
			],
			attachments: []
		};
	},
	mounted() {
		this.releaseForm.setFieldsValue({
			deliverAddr: this.selectContractInfo.deliveryStationList,
			receiveAddr: this.selectContractInfo.arriveStationList
		});
	},
	methods: {
		initAttach(list) {
			this.$refs.attachment.init(list);
		},
		validateQuantity(rule, value, callback) {
			// 校验发货数量
			let regs2 = /^\d+(\.\d{0,3})?$/;
			if (value && (!regs2.test(value) || Number(value) >= 100000000)) {
				callback('发货数量不大于10000000吨，最多三位小数');
			} else {
				callback();
			}
		},
		moment(val) {
			return moment(val).locale('zh-cn').format('YYYY-MM-DD');
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		submitReleaseForm() {
			this.releaseForm.validateFieldsAndScroll(async (err, values) => {
				let dataSource = [];
				if (!this.isAccountAndCar) {
					dataSource = this.$refs.carInfo.form.tableDataSource;
				}
				// 如果是应收业务 并且是汽运
				if (dataSource.length < 1 && !this.isAccountAndCar) {
					this.$message.error('请录入至少一条运输信息');
					return;
				}
				dataSource.map(item => {
					item.deliverDate = item.deliverDate ? moment(item.deliverDate).format('YYYY-MM-DD HH:mm:ss') : undefined;
					item.arriveDate = item.arriveDate ? moment(item.arriveDate).format('YYYY-MM-DD HH:mm:ss') : undefined;
				});

				if (!this.isAccountAndCar) {
					let carInfoValid = await this.$refs.carInfo.handleSubmit();
					if (!carInfoValid) {
						return;
					}
				}

				const attachList = this.$refs.attachment.save();
				if (!attachList) {
					return;
				}
				if (!err) {
					let bodyObj = {
						orderId: this.$route.query.orderId,
						deliverId: this.$route.query.deliverId,
						transInfo: [
							{
								deliverAddr: values.deliverAddr,
								receiveAddr: values.receiveAddr,
								deliverQuantity: values.deliverQuantity,
								deliverDate: this.moment(values.deliverDate),
								trainNum: values.trainNum,
								transType: 2,
								automobileDetailDtoList: !this.isAccountAndCar ? dataSource : [],
								submit: true,
								receiverName: this.selectContractInfo?.receiverName?.join(','),
								deliveryPlace: this.selectContractInfo.deliveryPlace,
								unloadGoodsPlace: this.selectContractInfo.unloadGoodsPlace,
								fileInfoList: attachList
							}
						],
						
					};
					const that = this;
					this.openModel(that, bodyObj);
					// if(this.verifyFile()){
					//   this.openModel(that, bodyObj)
					// }
				}
			});
		},
		openModel(that, obj) {
			that.$confirm({
				centered: true,
				title: '请确认发货信息无误并提交发货申请吗？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					return API_DELIVERYSAVE(obj)
						.then(res => {
							if (res.success) {
								that.$message.success('发货申请提交成功');
								that.$router.push('/center/receive/send/list');
							}
						})
						.finally(() => {});
				},
				onCancel() {}
			});
		},
		attachmentsChange(attachments) {
			this.attachments = attachments;
		},
		verifyFile() {
			let fileType = '';
			let success = true;
			this.attachments.map(item => {
				fileType += item.typeName;
			});
			this.fileType
				.filter(item => item.required)
				.map(item => {
					if (!fileType.includes(item.label)) {
						this.$message.error(`请上传${item.label}`);
						success = false;
					}
				});
			return success;
		},
		goBack() {
			this.$refs.confirmReturn.init('/center/receive/send/list');
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	height: 82px;
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
