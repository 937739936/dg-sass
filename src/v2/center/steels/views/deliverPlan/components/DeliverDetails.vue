<template>
	<!-- 收发货车辆信息-->
	<div>
		<div
			class="slTitleAssis"
			v-if="!this.$route.fullPath.includes('detail') && type !== 'update'"
		>
			发运货物明细
			<a-space
				:size="10"
				class="icon-wrap"
			>
				<div
					v-bind:class="styleClass"
					v-on:mouseover="
						() => {
							styleClass = 'hover';
						}
					"
					v-on:mouseleave="
						() => {
							styleClass = '';
						}
					"
				>
					<a-tooltip placement="top">
						<template slot="title">清空数据</template>
						<img
							v-if="styleClass === 'hover'"
							src="~@/v2/assets/imgs/steels/clear_hover_icon.png"
							alt=""
							@click="showModal('', 'empty')"
						/>
						<img
							v-else
							src="~@/v2/assets/imgs/steels/clear_icon.png"
							alt=""
							@click="showModal('', 'empty')"
						/>
					</a-tooltip>
				</div>
				<a-divider type="vertical" />
				<div
					v-bind:class="styleClass1"
					v-on:mouseover="
						() => {
							styleClass1 = 'hover';
						}
					"
					v-on:mouseleave="
						() => {
							styleClass1 = '';
						}
					"
				>
					<a-tooltip placement="top">
						<template slot="title">导入模板下载</template>
						<a
							v-if="transportMode === 'TRUCKS'"
							:href="publicPath + 'files/发货计划导入模板-汽运.xlsx'"
						></a>
						<a
							v-if="transportMode === 'TRAIN'"
							:href="publicPath + 'files/发货计划导入模板-火运.xlsx'"
						></a>
					</a-tooltip>
				</div>
				<div
					v-bind:class="styleClass2"
					v-on:mouseover="
						() => {
							styleClass2 = 'hover';
						}
					"
					v-on:mouseleave="
						() => {
							styleClass2 = '';
						}
					"
				>
					<a-tooltip placement="top">
						<template slot="title">导入</template>
						<a-upload
							name="file"
							:beforeUpload="beforeUpload"
							:multiple="false"
							:action="action"
							:data="paramsData"
							:headers="headers"
							@change="fileChange"
						>
							<img
								v-if="styleClass2 === 'hover'"
								src="~@/v2/assets/imgs/steels/export_hover_icon.png"
								alt=""
							/>
							<img
								v-else
								src="~@/v2/assets/imgs/steels/export_icon.png"
								alt=""
							/>
						</a-upload>
					</a-tooltip>
				</div>
			</a-space>
		</div>
		<div>
			<a-form-model
				ref="ruleForm"
				:model="form"
				:rules="rules"
				style="margin-bottom: 40px"
				class="slFormDetail"
			>
				<a-table
					:dataSource="form.tableDataSource"
					:columns="transportMode === 'TRAIN' ? trainColumns : type === 'update' ? trucksUpdateColumns : trucksColumns"
					class="new-table"
					:pagination="false"
					:rowSelection="type === 'update' ? undefined : rowSelection"
				>
					<template
						slot="materialName"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="materialName"
							:prop="'tableDataSource.' + index + '.materialName'"
							:rules="rules.materialName"
						>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ record.materialName }}</span>
								</template>
								<a-input
									v-model="record.materialName"
									style="width: 136px"
									placeholder="请填写品名"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								/>
							</a-tooltip>
						</a-form-model-item>
					</template>
					<template
						slot="materialTexture"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="materialTexture"
							:prop="'tableDataSource.' + index + '.materialTexture'"
							:rules="rules.materialTexture"
						>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ record.materialTexture }}</span>
								</template>
								<a-input
									v-model="record.materialTexture"
									style="width: 105px"
									placeholder="请填写材质"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								/>
							</a-tooltip>
						</a-form-model-item>
					</template>
					<template
						slot="specs"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="specs"
							:prop="'tableDataSource.' + index + '.specs'"
							:rules="rules.specs"
						>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ record.specs }}</span>
								</template>
								<a-input
									v-model="record.specs"
									style="width: 105px"
									placeholder="请填写规格"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								/>
							</a-tooltip>
						</a-form-model-item>
					</template>
					<template
						slot="baleNo"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="baleNo"
							:prop="'tableDataSource.' + index + '.baleNo'"
							:rules="rules.baleNo"
						>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ record.baleNo }}</span>
								</template>
								<a-input
									v-model="record.baleNo"
									style="width: 136px"
									placeholder="请填写捆包号"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								/>
							</a-tooltip>
						</a-form-model-item>
					</template>
					<template
						slot="shipmentAmount"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="shipmentAmount"
							:prop="'tableDataSource.' + index + '.shipmentAmount'"
							:rules="rules.shipmentAmount"
						>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ record.shipmentAmount }}</span>
								</template>
								<a-input
									v-model="record.shipmentAmount"
									style="width: 136px"
									placeholder="请填写发货数量"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								/>
							</a-tooltip>
						</a-form-model-item>
					</template>
					<template
						slot="shipmentQuantity"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="shipmentQuantity"
							:prop="'tableDataSource.' + index + '.shipmentQuantity'"
							:rules="rules.shipmentQuantity"
						>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ record.shipmentQuantity }}</span>
								</template>
								<a-input
									@blur="v => handleInputCheck(v, record, 'shipmentQuantity')"
									v-model="record.shipmentQuantity"
									style="width: 132px"
									placeholder="请填写发货重量"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								/>
							</a-tooltip>
						</a-form-model-item>
					</template>
					<template
						slot="plateNumber"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.plateNumber'"
							:rules="rules.plateNumber"
						>
							<div>
								<a-input
									autocomplete="off"
									v-model="record.plateNumber"
									@blur="handleSubmit"
									style="width: 130px"
									placeholder="请输入车牌号"
									:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
								>
									<div slot="suffix">
										<a-popover placement="right">
											<template slot="content">
												<div class="vector">
													<ul>
														<li
															v-for="item in S.split('')"
															:key="item"
															@click="keyEnter(record, item)"
														>
															{{ item }}
														</li>
													</ul>
													<ul>
														<li
															v-for="item in N.split('')"
															:key="item"
															@click="keyEnter(record, item)"
														>
															{{ item }}
														</li>
													</ul>
													<ul>
														<li
															v-for="item in Z.split('')"
															:key="item"
															@click="keyEnter(record, item)"
														>
															{{ item }}
														</li>
													</ul>
													<img
														src="~@/v2/assets/imgs/receive/delete.png"
														alt=""
														class="delete-item"
														@click="delEnter(record)"
													/>
												</div>
											</template>
											<img
												src="~@/v2/assets/imgs/receive/vector.png"
												alt=""
												style="width: 15px"
											/>
										</a-popover>
									</div>
								</a-input>
							</div>
						</a-form-model-item>
					</template>
					<template
						slot="arriveStatusDesc"
						slot-scope="text, record"
					>
						<span :class="'status ' + record.arriveStatus">{{ text }}</span>
					</template>
					<template
						slot="startDate"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.startDate'"
							:rules="rules.startDate"
						>
							<a-date-picker
								style="min-width: 130px; width: 130px"
								placeholder="请选择日期"
								showTime
								format="YYYY-MM-DD"
								valueFormat="YYYY-MM-DD"
								v-model="record.startDate"
								:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
							>
							</a-date-picker>
						</a-form-model-item>
					</template>
					<template
						slot="remark"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="remark"
							:prop="'tableDataSource.' + index + '.remark'"
							:rules="rules.remark"
						>
							<a-input
								v-model="record.remark"
								style="width: 294px"
								placeholder="请填写备注"
								:disabled="type === 'update' ? record.arriveStatus === 'ARRIVED' : false"
							/>
						</a-form-model-item>
					</template>
					<template
						slot="operation"
						slot-scope="text, record, index"
					>
						<a-space :size="16">
							<div
								@mouseover="getCur(index, 'curAddIndex')"
								@mouseleave="getCur('', 'curAddIndex')"
								:class="curAddIndex === index ? 'action hover' : 'action '"
								@click="add(index)"
							>
								<img
									v-if="curAddIndex === index"
									src="~@/v2/assets/imgs/steels/add_hover_icon.png"
									alt=""
								/>
								<img
									v-else
									src="~@/v2/assets/imgs/steels/add_icon.png"
									alt=""
								/>
							</div>
							<div
								v-show="form.tableDataSource.length > 1 && (type === 'update' ? record.arriveStatus !== 'ARRIVED' : true)"
								@mouseover="getCur(index, 'curDelIndex')"
								@mouseleave="getCur('', 'curDelIndex')"
								:class="curDelIndex === index ? 'action hover' : 'action '"
								@click="showModal(index, 'delete')"
							>
								<img
									v-if="curDelIndex === index"
									src="~@/v2/assets/imgs/steels/del_hover_icon.png"
									alt=""
								/>
								<img
									v-else
									src="~@/v2/assets/imgs/steels/del_icon.png"
									alt=""
								/>
							</div>
						</a-space>
					</template>
				</a-table>
				<p class="sum_text">
					发货总重量<span>{{ sumTotal }}</span
					>吨
				</p>
			</a-form-model>
		</div>
		<!-- 清空数据确认弹窗 -->
		<a-modal
			class="slTitleConfirmModal"
			:visible="visible"
			title=""
			@cancel="hideModal"
			@ok="confirmFunc"
		>
			<div class="title">
				<a-icon
					type="exclamation-circle"
					theme="filled"
				/>{{ modalObj.modalTitle }}
			</div>
			<p class="label">{{ modalObj.modalText }}</p>
			<template slot="footer">
				<a-button @click="hideModal">取消</a-button>
				<a-button
					type="primary"
					@click="confirmFunc"
					>确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
let S = '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领';
let N = '0123456789';
let Z = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
import { API_ShipmentPlanImport } from '@/v2/center/steels/api/deliverPlan.js';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import { trainColumns, trucksColumns, trucksUpdateColumns } from '../config/columns.js';
const defaultObj = {
	// 品名
	materialName: '',
	// 材质
	materialTexture: '',
	// 规格
	specs: '',
	// 捆包号
	baleNo: '',
	// 发货数量
	shipmentAmount: '',
	// 发货重量
	shipmentQuantity: '',
	// 车牌号
	plateNumber: '',
	// 车辆出厂日期
	startDate: '',
	// 备注
	remark: ''
};
export default {
	data() {
		return {
			S,
			N,
			Z, // 车牌号
			dataSource: [],
			trainColumns,
			trucksColumns,
			trucksUpdateColumns,
			form: {
				tableDataSource: []
			},
			rules: {
				materialName: [
					{ required: true, message: '请填写品名', trigger: ['change', 'blur'] },
					{
						validator: (rule, value, callback) => {
							return this.validLength(rule, value, callback, 60);
						},
						trigger: ['change', 'blur']
					}
				],
				materialTexture: [
					{ required: true, message: '请填写材质', trigger: ['change', 'blur'] },
					{
						validator: (rule, value, callback) => {
							return this.validLength(rule, value, callback, 60);
						},
						trigger: ['change', 'blur']
					}
				],
				specs: [
					{ required: true, message: '请填写规格', trigger: ['change', 'blur'] },
					{
						validator: (rule, value, callback) => {
							return this.validLength(rule, value, callback, 60);
						},
						trigger: ['change', 'blur']
					}
				],
				baleNo: [
					{
						validator: (rule, value, callback) => {
							return this.validLength(rule, value, callback, 60);
						},
						trigger: ['change', 'blur']
					}
				],
				shipmentAmount: [
					{
						validator: (rule, value, callback) => {
							return this.validLength(rule, value, callback, 60);
						},
						trigger: ['change', 'blur']
					}
				],
				shipmentQuantity: [
					{ required: true, message: '请填写发货重量', trigger: ['change', 'blur'] },
					{ pattern: /^\d+(\.\d{0,4})?$/, message: '请输入非负数', trigger: ['change', 'blur'] },
					{
						validator: (rule, value, callback) => {
							return this.validateRange(rule, value, callback, 0, 999999999999, '输入数字不能超过12位数');
						},
						trigger: ['change', 'blur']
					}
				],
				plateNumber: [
					{ required: true, message: '请填写车牌号', trigger: ['change', 'blur'] },
					{
						pattern:
							/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/,
						message: '请输入正确的车牌号',
						trigger: ['change', 'blur']
					}
				],
				startDate: [{ required: true, message: '请填写车辆出厂日期', trigger: ['change', 'blur'] }],
				remark: [
					{
						validator: (rule, value, callback) => {
							return this.validLength(rule, value, callback, 300);
						},
						trigger: ['change', 'blur']
					}
				]
			},
			selectedRows: [],
			curAddIndex: '',
			curDelIndex: '',
			previewList: [],
			// 导入函数
			action: API_ShipmentPlanImport,
			isError: false,
			myallowFormat: ['xlsx', 'xls'],
			fileList: [],
			paramsData: {},
			styleClass: '',
			styleClass1: '',
			styleClass2: '',
			publicPath: process.env.BASE_URL,
			sumTotal: 0, //发货总重量
			selectedRowKeys: [],
			defaultObj,
			visible: false,
			target: null,
			modalObj: {}
		};
	},
	props: {
		datas: {
			type: Array,
			default: function () {
				return [];
			}
		},
		transportMode: {
			type: String,
			default: function () {
				return '';
			}
		},
		type: {
			type: String,
			default: function () {
				return '';
			}
		}
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'checkbox',
				// fixed: true,
				selectedRowKeys: selectedRowKeys,
				onChange: record => {
					t.selectedRowKeys = record;
				}
			};
		},
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	watch: {
		datas(e) {
			if (e?.length) {
				this.form.tableDataSource = e;
				this.sum();
			}
		},
		transportMode(e) {
			this.paramsData = {
				transportMode: e
			};
		}
	},
	mounted() {
		this.updateData();
	},
	methods: {
		getCur(a, type) {
			this[type] = a;
		},
		isNumber(value) {
			if (value === undefined || value === null || value === '') {
				return false;
			}
			if (typeof value === 'string') {
				//正整数
				var reNumber = /^\d+$/;
				//负整数
				var reNeNumber = /^-\d+$/;
				//正实数
				var reRealNumber1 = /^[1-9]\d*[.]\d+$/; //非零开头
				var reRealNumber2 = /^0[.]\d+$/; //零开头
				//负实数
				var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/; //非零开头
				var reNeRealNumber2 = /^-0[.]\d+$/; //零开头

				if (
					reNumber.test(value) ||
					reNeNumber.test(value) ||
					reRealNumber1.test(value) ||
					reRealNumber2.test(value) ||
					reNeRealNumber1.test(value) ||
					reNeRealNumber2.test(value)
				) {
					return true;
				} else {
					return false;
				}
			} else if (typeof value === 'number') {
				return true;
			} else {
				return false;
			}
		},
		toDecimal(num) {
			if (this.isNumber(num)) {
				return Number(num).toFixed(4);
			}
		},
		handleInputCheck(e, record) {
			record.shipmentQuantity = this.toDecimal(e.target.value);
			this.$forceUpdate();
			this.sum();
		},
		sum() {
			// 计算总重量
			this.sumTotal = 0;
			this.form.tableDataSource.forEach(item => {
				this.sumTotal = this.sumTotal + Number(item.shipmentQuantity || 0);
			});
			this.sumTotal = this.toDecimal(this.sumTotal);
		},
		validateRange(rule, value, callback, min, max, msg) {
			if (value && (value < min || value > max)) {
				callback(msg);
			} else {
				callback();
			}
		},
		validLength(rule, value, callback, length) {
			if (value && value.length && value.length > length) {
				callback('长度要在1和' + length + '之间');
			}
			callback();
		},
		validatePlateNumber(rule, value, callback) {
			let LICENCE_PLATE =
				/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/;
			if (!value) {
				callback();
				return;
			}
			if (!LICENCE_PLATE.test(value)) {
				callback('请输入正确的车牌号');
				return;
			}
			callback();
		},
		updateData() {
			if (!this.form.tableDataSource.length) {
				this.add();
			}
		},
		add(index = 0) {
			let obj = cloneDeep(defaultObj);
			this.form.tableDataSource.splice(index + 1, 0, obj);
		},
		handleSubmit() {
			let val = false;
			new Promise(() => {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						val = true;
					}
				});
			});
			return val;
		},
		keyEnter(record, item) {
			record.plateNumber = record.plateNumber ? `${record.plateNumber}${item}` : item;
			this.handleSubmit();
		},
		delEnter(record) {
			if (record.plateNumber) {
				record.plateNumber = record.plateNumber.slice(0, record.plateNumber.length - 1);
			}
			this.handleSubmit();
		},
		onDelete(key) {
			this.form.tableDataSource = this.form.tableDataSource.filter((item, index) => index !== key);
			this.$message.success('删除成功');
			this.sum();
			this.visible = false;
		},
		// 清空数据
		empty() {
			// 存在勾选 清空
			let obj = cloneDeep(defaultObj);
			if (this.selectedRowKeys.length) {
				this.form.tableDataSource.forEach((el, index) => {
					const flag = this.selectedRowKeys.includes(index);
					if (flag) {
						Object.assign(el, obj);
					}
				});
			} else {
				this.form.tableDataSource.forEach(el => {
					Object.assign(el, obj);
				});
				this.$refs.ruleForm.resetFields();
			}
			this.$forceUpdate();
			this.sum();
			this.visible = false;
		},
		showModal(item, type) {
			this.target = item;
			this.visible = true;
			switch (type) {
				case 'empty': // 清空
					this.modalObj.type = type;
					this.modalObj.modalTitle = '您确定要清空发运货物明细吗？';
					this.modalObj.modalText = '清空后数据列表将会全部消失';
					break;
				case 'delete': // 删除
					this.modalObj.type = type;
					this.modalObj.modalTitle = '您确定删除该行发货明细吗？';
					this.modalObj.modalText = '确定删除后信息将会消失';
					break;
			}
		},
		hideModal() {
			this.target = null;
			this.visible = false;
			this.modalObj = {};
		},
		confirmFunc() {
			if (this.modalObj.type === 'empty') {
				this.empty();
			}
			if (this.modalObj.type === 'delete') {
				this.onDelete(this.target);
			}
		},
		fileChange({ file }) {
			if (file.status == 'done') {
				this.previewList = file.response.data;
				if (!this.previewList.length) {
					this.$message.error('导入文件未填写发运货物明细');
					return;
				}
				this.isError = file.response.data.some(el => el.scanStatus == 'FAILURE');
				if (this.isError) {
					this.$message.error('存在问题的数据， 请修改后重新上传');
					return;
				}
				this.form.tableDataSource = this.previewList;
				this.sum();
			}
			if (file.status == 'error') {
				this.$message.error(file.response.error.message);
			}
		},
		beforeUpload(file) {
			const allowFormat = this.myallowFormat;
			let isAllowFormat = false;
			if (allowFormat.indexOf(file.name.split('.')[file.name.split('.').length - 1].toLowerCase()) == -1) {
				this.$message.error('仅支持' + allowFormat.join('，') + '的格式');
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}
			const t = this;
			function fileTypeJudge() {
				if (
					(file.name.indexOf('.jpg') > 0 ||
						file.name.indexOf('.jpeg') > 0 ||
						file.name.indexOf('.png') > 0 ||
						file.name.indexOf('.gif') > 0 ||
						file.name.indexOf('.pdf') > 0 ||
						file.name.indexOf('.docx') > 0 ||
						file.name.indexOf('.doc') > 0 ||
						file.name.indexOf('.xls') > 0 ||
						file.name.indexOf('.xlsx') > 0 ||
						file.name.indexOf('.rar') > 0 ||
						file.name.indexOf('.zip') > 0) &&
					file.size / 1024 / 1024 > 100
				) {
					// t.$message.error("该格式附件不能大于10M，请重新选择");
					t.$message.error('单个附件大小不得超过100M');
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}
			let ifOverSize = fileTypeJudge();
			return new Promise((resolve, reject) => {
				if (isAllowFormat && !ifOverSize) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.new-table {
	max-height: 610px;
	overflow-y: auto;
}
.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}

.sub-title-small {
	font-size: 14px;
	padding-left: 0;
	margin-bottom: -10px;
	&:before {
		display: none;
	}
}

/deep/ .ant-form-item {
	margin-bottom: 0;
}

/deep/ .ant-table-column-title {
	&:before {
		content: '*';
		float: left;
		font-size: 14px;
		display: block;
		color: #f65927;
		margin-right: 4px;
		position: relative;
		top: 2px;
	}
}
/deep/.ant-checkbox-inner {
	border-radius: 5px;
}
/deep/ [key='rowIndex'] .ant-table-column-title,
/deep/ [key='operation'] .ant-table-column-title,
/deep/ [key='baleNo'] .ant-table-column-title,
/deep/ [key='shipmentAmount'] .ant-table-column-title,
/deep/ [key='remark'] .ant-table-column-title,
/deep/ [key='selection-column'] .ant-table-column-title,
/deep/ [key='arriveStatusDesc'] .ant-table-column-title {
	&:before {
		display: none;
	}
}
/deep/ .ant-form-item {
	margin-bottom: 0;
}
/deep/.ant-table-thead > tr > th {
	padding: 10px 20px !important;
}
/deep/ .ant-table-tbody > tr > td {
	padding: 12px !important;
}
/deep/.ant-table-thead > tr > .ant-table-selection-column,
/deep/.ant-table-tbody > tr > .ant-table-selection-column {
	padding: 10px 0 10px 16px !important;
	text-align: right !important;
}
/deep/.ant-table-thead > tr > th:nth-child(2),
/deep/.ant-table-tbody > tr > td:nth-child(2) {
	padding: 10px !important;
}
/deep/ .has-error .ant-form-explain,
.has-error .ant-form-split {
	position: absolute;
	bottom: -14px;
}
/deep/ .ant-form-explain {
	position: absolute;
}
/deep/ .ant-table-body {
	overflow-y: hidden;
}
/deep/.ant-input-affix-wrapper .ant-input-prefix,
/deep/.ant-input-affix-wrapper .ant-input-suffix {
	z-index: 1;
}
/deep/.has-error .ant-form-explain,
/deep/.has-error .ant-form-split {
	bottom: -17px;
}
/deep/.ant-table-scroll table .ant-table-fixed-columns-in-body:not([colspan]) > * {
	visibility: visible !important;
}
/deep/.ant-table-tbody tr td {
	img {
		width: 14px;
		height: 14px;
		cursor: pointer;
	}
	.action {
		width: 22px;
		height: 22px;
		text-align: center;
	}
	.hover.action {
		background: rgba(119, 136, 157, 0.1);
		border-radius: 2px;
	}
}
/deep/.ant-table colgroup > col.ant-table-selection-col {
	width: 32px !important;
	padding: 10px 0 10px 16px !important;
	text-align: right;
}
.sum_text {
	color: #77889d;
	line-height: 14px;
	text-align: right;
	margin-top: 20px;
	span {
		font-weight: 500;
		font-size: 18px;
		line-height: 18px;
		color: #f46332;
		display: inline-block;
		margin: 0 4px 0 14px;
		font-family: 'D-DIN-PRO';
	}
}
.status {
	padding: 3px 5px;
	height: 20px;
	line-height: 20px;
	border-radius: 4px;
	font-size: 14px;
	zoom: 0.85;
}
.ARRIVED {
	background: #c5ecdd;
	color: #3eb384;
}
.NOT_ARRIVED {
	background: #c9daff;
	color: #596fa0;
}
.PART_ARRIVED {
	background: #c1d7ff;
	color: #4682f3;
}
.icon-wrap {
	float: right;
	/deep/.ant-space-item {
		display: inline-block;
		width: 22px;
		height: 22px;
		position: relative;
		cursor: pointer;
		img {
			width: 16px;
			height: 16px;
			position: absolute;
			left: 3px;
			top: 3px;
		}
	}
	/deep/.ant-space-item:nth-child(2) {
		width: 2px;
	}
	/deep/.ant-divider,
	.ant-divider-vertical {
		margin: 0;
		width: 2px !important;
		height: 16px !important;
		color: #e5e6eb;
		position: relative;
		top: -3px;
	}
	/deep/.ant-space-item {
		div {
			width: 22px;
			height: 22px;
		}
		a {
			display: inline-block;
			width: 22px;
			height: 22px;
			background-image: url(~@/v2/assets/imgs/steels/export_download_icon.png);
			background-size: 16px 16px;
			background-repeat: no-repeat;
			background-position: 3px 3px;
			border-radius: 2px;
		}
		.hover {
			background-color: rgba(119, 136, 157, 0.1);
			border-radius: 2px;
			a {
				background-color: rgba(119, 136, 157, 0.1);
				background-image: url(~@/v2/assets/imgs/steels/export_download_hover_icon.png);
			}
		}
	}
}
/deep/.ant-upload-list {
	display: none;
}
//车牌号弹窗
.vector {
	width: 268px;
	height: 410px;
	position: relative;
	color: #000000cc;
	ul {
		display: flex;
		flex-wrap: wrap;
		li {
			margin-right: 16px;
			width: 24px;
			height: 24px;
			font-size: 14px;
			line-height: 24px;
			cursor: pointer;
			border-radius: 4px;
			text-align: center;
			margin-bottom: 14px;
			&:nth-child(7n + 7) {
				margin-right: 0;
			}
			&:hover {
				background-color: @primary-color;
				color: #ffffff;
			}
		}
	}
	.delete-item {
		height: 12px;
		position: absolute;
		right: 11px;
		bottom: 11px;
		cursor: pointer;
	}
	.status {
		padding: 3px 5px;
		height: 20px;
		line-height: 20px;
		border-radius: 4px;
		font-size: 14px;
		zoom: 0.85;
	}
	.ARRIVED {
		background: #c5ecdd;
		color: #3eb384;
	}
	.UNARRIVED {
		background: #c9daff;
		color: #596fa0;
	}
	.PARTARRIVED {
		background: #c1d7ff;
		color: #4682f3;
	}
}
::-webkit-scrollbar {
	height: 2px;
}
</style>
