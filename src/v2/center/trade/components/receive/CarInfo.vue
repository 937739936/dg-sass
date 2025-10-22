<template>
	<!-- 收发货车辆信息-->
	<div id="carInfo">
		<div
			:class="{
				title: true,
				'title-remark': freightPayType && freightPayType != filterCodeByTextName('下游支付', 'freightPayTypeDict')
			}"
		>
			<i class="title_icon"></i>车辆信息
		</div>
		<div class="train-times-wrap">
			<a-table
				:dataSource="dataSource"
				:columns="columns"
				:pagination="false"
				:locale="{ emptyText: '暂无数据' }"
			>
				<template
					slot="operation"
					slot-scope="text, record, index"
				>
					<a-space>
						<a
							href="javascript:;"
							v-if="(release && record.type == 'HAND') || receive"
							@click="editCarInfo(record, index)"
							>编辑</a
						>
						<a-popconfirm
							v-if="release"
							title="确定删除该车辆信息?"
							okText="确定"
							cancelText="取消"
							@confirm="() => onDelete(index)"
						>
							<a
								href="javascript:;"
								class="delete-btn"
								>删除</a
							>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
			<p
				class="add-wrap"
				v-if="release"
			>
				<a-space size="middle">
					<span
						@click="popCarList"
						v-if="popCar.show"
						><a-space><a-icon type="plus" />选择已有发运车辆</a-space></span
					>
					<span @click="editCarInfo"
						><a-space><a-icon type="plus" />手动添加</a-space></span
					>
				</a-space>
			</p>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="车辆信息"
				centered
				:visible="modalCarInfoIsShow"
				okText="确定"
				cancelText="取消"
				@ok="modalFormSubmit"
				@cancel="cancel"
				class="modal-car-info"
			>
				<a-form-model
					v-if="modalCarInfoIsShow"
					ref="plateForm"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 18 }"
					:model="carInfoform"
					:rules="plateRules"
					layout="inline"
					:colon="false"
				>
					<a-form-model-item
						prop="plateNumber"
						label="车牌号"
						ref="plateNumber"
						:autoLink="false"
					>
						<div>
							<a-input
								autocomplete="off"
								:disabled="!release"
								@blur="
									() => {
										$refs.plateNumber.onFieldBlur();
									}
								"
								@change="
									() => {
										$refs.plateNumber.onFieldChange();
									}
								"
								v-model="carInfoform.plateNumber"
							>
								<i
									@click="isShowPlateNumber = !isShowPlateNumber"
									slot="suffix"
									v-if="release"
									class="iconfont icon-keyboard"
								/>
							</a-input>
							<!-- 车牌小键盘 -->
							<div v-if="isShowPlateNumber">
								<div class="plate-number-container">
									<div class="plate-number-province">
										<div
											class="plate-number-item"
											@click="handlePlateNumberClick(item)"
											v-for="(item, index) in plateNumberJson.provinces"
											:key="index"
										>
											{{ item }}
										</div>
									</div>
									<div class="plate-number-number">
										<div
											class="plate-number-item"
											@click="handlePlateNumberClick(item)"
											v-for="(item, index) in plateNumberJson.numbers"
											:key="index"
										>
											{{ item }}
										</div>
									</div>
									<i
										@click="handlePlateNumberDelete"
										slot="suffix"
										class="iconfont icon-back plate-number-delete"
									/>
								</div>
							</div>
						</div>
					</a-form-model-item>
					<a-form-model-item
						prop="deliverQuantity"
						label="发货量(吨)"
					>
						<a-input
							:disabled="!release"
							v-model="carInfoform.deliverQuantity"
						/>
					</a-form-model-item>
					<a-form-model-item
						prop="deliverDate"
						label="发车时间"
					>
						<a-date-picker
							style="width: 100%"
							showTime
							:disabled="!release"
							placeholder="请选择发车时间"
							format="YYYY-MM-DD HH:mm"
							valueFormat="YYYY-MM-DD HH:mm"
							:disabled-date="disabledStartDate"
							v-model="carInfoform.deliverDate"
						>
						</a-date-picker>
					</a-form-model-item>
					<a-form-model-item
						label="到站时间"
						prop="arriveDate"
					>
						<a-date-picker
							style="width: 100%"
							showTime
							placeholder="请选择到站时间"
							:disabled-date="disabledEndDate"
							valueFormat="YYYY-MM-DD HH:mm"
							format="YYYY-MM-DD HH:mm"
							v-model="carInfoform.arriveDate"
						>
						</a-date-picker>
					</a-form-model-item>
					<a-form-model-item
						prop="ticketNo"
						label="运单号"
					>
						<a-input
							:disabled="!release"
							v-model="carInfoform.ticketNo"
						/>
					</a-form-model-item>
				</a-form-model>
			</a-modal>
			<CarList
				ref="carList"
				@getCarList="getCarList"
			/>
		</div>
	</div>
</template>

<script>
import plateNumberJson from '@/v2/center/trade/config/licensePlateNumber.json';
import { filterCodeByTextName } from '@sub/utils/globalCode.js';
import { dispatchDriverSaveOrUpdate } from '@/v2/center/trade/api/receive';
import CarList from './CarList.vue';
import moment from 'moment';
export default {
	name: 'CarInfo',
	props: {
		freightPayType: {
			required: false
		},
		datas: {
			type: Array,
			default: function () {
				return [];
			}
		},
		type: {
			type: String,
			default: '' //默认空，详情，可添加删除，收货不可添加删除
		},
		popCar: {
			type: Object,
			default: function () {
				return { show: false };
			} //是否可以选择选择已有数据
		}
	},
	computed: {
		//发货
		release() {
			return this.type == 'release';
		},
		//收货
		receive() {
			return this.type == 'receive';
		},
		plateRules() {
			return {
				plateNumber: [
					{ required: this.release, message: '请输入车牌号', trigger: ['change', 'blur'] },
					{
						pattern:
							/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/,
						message: '请输入正确的车牌号',
						trigger: ['change', 'blur']
					}
				],
				deliverQuantity: [
					{ required: this.release, message: '请输入发货量', trigger: ['change', 'blur'] },
					{
						pattern: /(^((\d{0,2})|([1]\d{0,2})|0)(\.\d{0,2})?$)|(^([2][0]{0,2})(\.[0]{0,2})?$)/,
						message: '发货量为数字，最大200，最多两位小数',
						trigger: ['change', 'blur']
					}
				],
				deliverDate: [{ required: this.release, message: '请选择发车时间', trigger: ['change', 'blur'] }],
				arriveDate: [{ required: this.receive, message: '请选择到站时间', trigger: ['change', 'blur'] }]
			};
		}
	},
	created() {
		this.dataSource = this.datas;
	},
	components: {
		CarList
	},
	watch: {
		datas() {
			this.dataSource = this.datas;
		},
		modalCarInfoIsShow(nv, ov) {
			if (nv && !ov && !this.isEdit) {
				this.isShowPlateNumber = false;
				this.carInfoform = {};
			}
			this.isEdit = false;
		}
	},
	data() {
		return {
			plateNumberJson,
			dataSource: [],
			columns: [
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
				},
				{
					title: '发车时间',
					dataIndex: 'deliverDate'
				},
				{
					title: '到站时间',
					dataIndex: 'arriveDate'
				},
				{
					title: '发货量(吨)',
					dataIndex: 'deliverQuantity'
				},
				{
					title: '运单号',
					dataIndex: 'ticketNo'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			modalCarInfoIsShow: false,
			modifyIndex: 0,
			modifyStatus: false,
			carInfoform: {},
			isShowPlateNumber: false,
			isEdit: false,
			filterCodeByTextName: filterCodeByTextName
			// plateNumberReg: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
		};
	},
	methods: {
		editCarInfo: function (record, index) {
			this.isEdit = true;
			this.modalCarInfoIsShow = true;
			this.modifyIndex = index;
			if (index !== undefined) {
				this.isShowPlateNumber = false;
				this.modifyStatus = true;
				this.carInfoform = { ...record };
			}
		},
		cancel() {
			this.carInfoform = {};
			this.modifyStatus = false;
			this.isShowPlateNumber = false;
			this.modalCarInfoIsShow = false;
		},
		disabledStartDate(startValue) {
			const endValue = this.carInfoform.arriveDate;
			if (!startValue || !endValue) {
				return false;
			}
			return startValue.valueOf() > moment(endValue).valueOf();
		},
		disabledEndDate(endValue) {
			const startValue = this.carInfoform.deliverDate;
			if (!endValue || !startValue) {
				return false;
			}
			return moment(startValue).valueOf() >= endValue.valueOf();
		},
		// 确定添加车辆信息
		modalFormSubmit() {
			this.$refs.plateForm.validate(async valid => {
				if (valid) {
					let obj = { type: 'HAND', ...this.carInfoform, orderSerialNo: this.popCar.orderSerialNo };
					if (this.popCar.orderType) {
						obj.orderType = this.popCar.orderType;
					}
					if (!this.modifyStatus) {
						this.$message.success('添加成功');
						this.dataSource.push(obj);
					} else {
						// 编辑时，确定提交
						if (obj.id) {
							let res = await dispatchDriverSaveOrUpdate(obj).catch(() => {
								this.modifyStatus = false;
								this.modalCarInfoIsShow = false;
							});
							if (!(res.success && res.data)) {
								return;
							}
						}
						this.$message.success('修改成功');
						this.dataSource.splice(this.modifyIndex, 1, obj);
					}
					this.modifyStatus = false;
					this.modalCarInfoIsShow = false;
					// this.carInfoform.resetFields()
					this.$emit('dataSource', this.dataSource);
					this.cancel();
				}
			});
		},
		onDelete(index) {
			const dataSource = [...this.dataSource];
			dataSource.splice(index, 1);
			this.dataSource = dataSource;
			this.$message.success('删除成功');
			this.$emit('dataSource', this.dataSource);
		},
		// 小键盘添加一个item
		handlePlateNumberClick(item) {
			let str = this.carInfoform.plateNumber || '';
			this.$set(this.carInfoform, 'plateNumber', str + item);
			this.$refs.plateNumber.onFieldChange();
		},
		// 小键盘删除
		handlePlateNumberDelete() {
			let str = this.carInfoform.plateNumber || '';
			this.$set(this.carInfoform, 'plateNumber', str || str.length > 0 ? str.substring(0, str.length - 1) : '');
			this.$refs.plateNumber.onFieldChange();
		},
		//选择已有发运车辆
		popCarList() {
			let carNoList = [];
			this.dataSource.forEach(item => {
				carNoList.push(item.id);
			});
			this.$refs.carList.showModal(carNoList, this.popCar.orderSerialNo, this.popCar.batchNo);
		},
		//已有发运车辆确认
		getCarList(selectedCarNoList, selectedCarNoData) {
			// 先剔除数据中本次取消的合同
			let dataSource = this.dataSource.filter(item => {
				return !item.id || (item.id && selectedCarNoList.includes(item.id));
			});
			//处理新增
			let selectedCarNoDataNew = selectedCarNoData.filter(item => {
				return !dataSource.some(items => {
					return items.id == item.id;
				});
			});
			selectedCarNoDataNew = selectedCarNoDataNew.map(item => {
				return {
					...item,
					orderSerialNo: this.popCar.orderSerialNo
				};
			});
			dataSource = dataSource.concat(selectedCarNoDataNew);
			this.dataSource = dataSource;
			this.$emit('dataSource', this.dataSource);
		}
	}
};
</script>

<style lang="less" scoped>
#carInfo {
	.train-times-wrap {
		margin-bottom: 30px;
		font-size: 0;
	}
	.title-remark {
		&:after {
			content: '(至少录入一个车号)';
			color: #ff1515;
			font-size: 16px;
			padding-left: 44px;
		}
	}
	.add-wrap {
		width: 100%;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;
		font-size: 14px;
		span:hover {
			opacity: 0.8;
			cursor: pointer;
		}
	}
}
.modal-car-info {
	.plate-number-container {
		position: relative;
		width: 300px;
		padding: 15px 15px 20px 15px;
		box-shadow: 0 0 6px 0 #aaa;
		border-radius: 5px;
		.plate-number-province,
		.plate-number-number {
			display: flex;
			flex-wrap: wrap;
		}
		.plate-number-item {
			width: 27px;
			height: 27px;
			text-align: center;
			line-height: 24px;
			cursor: pointer;
			user-select: none;
			&:hover {
				background: rgba(24, 144, 255, 0.1);
				border-radius: 100%;
			}
		}
		.plate-number-delete {
			position: absolute;
			right: 20px;
			bottom: 10px;
			height: 24px;
			font-size: 24px;
			cursor: pointer;
		}
	}
	::v-deep .ant-input-suffix {
		right: -4px !important;
		i {
			cursor: pointer;
		}
	}
	::v-deep.ant-modal-content {
		width: 450px;
	}
	::v-deep label {
		width: 80px;
		display: inline-block;
		text-align: right;
	}
	::v-deep input {
		width: 300px;
	}
	::v-deep.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}
}
</style>
