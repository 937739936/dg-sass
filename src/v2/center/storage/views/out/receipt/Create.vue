<template>
	<div class="background-wrapper">
		<a-form
			:form="form"
			v-bind="formLayout"
		>
			<a-card
				class="custom-card-title mb16"
				title="新增出仓单"
				:bordered="false"
			>
				<a-button
					class="add"
					ghost
					type="primary"
					@click="$router.go(-1)"
					>返回</a-button
				>
				<a-steps
					style="margin-bottom: 32px"
					:current="currentStep"
				>
					<a-step
						v-for="(item, index) in steps"
						:key="index"
						:title="item"
					/>
				</a-steps>
				<div v-show="currentStep === 0">
					<h3>出仓单信息</h3>
					<a-row>
						<a-col :span="12">
							<a-form-item
								label="仓储企业"
								:colon="false"
							>
								<a-select
									placeholder="请选择仓储企业"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'storageCompanyId',
										{
											rules: [{ required: true, message: '请选择仓储企业' }],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-select-option
										@click="getDepotPointList(item)"
										v-for="item in storageCompanyList"
										:key="item.id"
										:value="item.id"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								:required="true"
								label="货权方"
								:colon="false"
							>
								{{ VUEX_ST_COMPANYSUER.companyName }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="储存库点"
								:colon="false"
							>
								<a-select
									placeholder="请先选择仓储企业"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'depotPointFlag',
										{
											rules: [{ required: true, message: '请选择储存库点' }],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-select-option
										@click="getStorehouseList(item)"
										v-for="item in depotPointList"
										:key="item.depotPointFlag"
										:value="item.depotPointFlag"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="仓房号"
								:colon="false"
							>
								<a-select
									placeholder="请先选择储存库点"
									:open="false"
									:showArrow="false"
									@dropdownVisibleChange="curStorehouseVisible = true"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'storehouseId',
										{
											rules: [{ required: true, message: '请选择仓房号' }],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-select-option
										@click="getCurStorehouse(item)"
										v-for="item in storehouseList"
										:key="item.storehouseId"
										:value="item.storehouseId"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="实时库存(吨)"
								:colon="false"
							>
								{{ curStorehouse.currentCapacity }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="可开出仓单数量(吨)"
								:colon="false"
							>
								{{ curStorehouse.canReceipt }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="提货人名称"
								:colon="false"
							>
								<a-input
									:precision="4"
									placeholder="请输入提货人名称"
									v-decorator="[
										'consignee',
										{
											rules: [
												{ required: true, message: '请输入提货人名称' },
												{ max: 40, message: `提货人名称长度不能超过40个字符` }
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="出仓期限"
								:colon="false"
							>
								<a-range-picker
									:allowClear="false"
									format="YYYY-MM-DD"
									:getCalendarContainer="getPopupContainer"
									v-decorator="[
										'date',
										{
											rules: [{ required: true, message: '请选择出仓期限' }],
											validateTrigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="商品名称"
								:colon="false"
							>
								<a-select
									placeholder="请选择商品名称"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'grainName',
										{
											rules: [{ required: true, message: '请选择商品名称' }],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-select-option
										v-for="item in grainVariety"
										:key="item.value"
										:value="item.value"
									>
										{{ item.value }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="出仓数量(吨)"
								:colon="false"
							>
								<a-input-number
									:precision="2"
									:min="0"
									:max="99999999.99"
									placeholder="请输入出仓数量"
									v-decorator="[
										'deliveryAmount',
										{
											rules: [{ required: true, message: '请输入出仓数量' }, { validator: deliveryAmountRules }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item
								:label-col="{ span: 3 }"
								:wrapper-col="{ span: 19 }"
								label="备注"
								:colon="false"
							>
								<a-textarea
									placeholder="请输入备注"
									v-decorator="[
										'remarks',
										{
											rules: [
												{ required: false, message: '请输入备注' },
												{ max: 200, message: `备注长度不能超过200个字符` }
											],
											validateTrigger: 'change'
										}
									]"
								></a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
					<h3
						class="mb8"
						style="line-height: 32px"
					>
						还款信息
						<a-button
							style="float: right"
							type="primary"
							@click="add"
						>
							增加还款信息
						</a-button>
					</h3>
					<a-table
						:columns="columns"
						:rowKey="record => record.timestamp"
						:dataSource="dataSource"
						:pagination="false"
						:scroll="{ x: true }"
					>
						<template
							slot="repaymentSerialNo"
							slot-scope="text, record"
						>
							<a-form-item>
								<a-input
									style="width: 230px"
									placeholder="请输入银行还款流水号"
									@focus="handleFocus(record)"
									@change="handleChangeRepaymentSerialNo"
									v-decorator="[
										setDecoratorName(record, 'repaymentSerialNo'),
										{
											initialValue: text,
											rules: [
												{ required: false, message: '请输入银行还款流水号' },
												{
													pattern: /^[A-Za-z0-9]+$/,
													message: '请输入正确的银行还款流水号'
												},
												{
													max: 30,
													message: `银行还款流水号长度不能超过30个字符`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</template>
						<template
							slot="repaymentTime"
							slot-scope="text, record"
						>
							<a-form-item>
								<a-date-picker
									:allowClear="false"
									format="YYYY-MM-DD"
									@focus="handleFocus(record)"
									@change="handleChangeRepaymentTime"
									v-decorator="[
										setDecoratorName(record, 'repaymentTime'),
										{
											initialValue: text,
											rules: [{ required: true, message: '请选择还款时间' }],
											validateTrigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</template>
						<template
							slot="repaymentAmount"
							slot-scope="text, record"
						>
							<a-form-item>
								<a-input-number
									:precision="2"
									:max="99999999.99"
									style="width: 100%"
									placeholder="请输入对应还款金额"
									@focus="handleFocus(record)"
									@change="handleChangeRepaymentAmount"
									v-decorator="[
										setDecoratorName(record, 'repaymentAmount'),
										{
											initialValue: text,
											rules: [{ required: true, message: '请输入对应还款金额' }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</template>
						<template
							slot="action"
							slot-scope="text, record, index"
						>
							<a @click="del(index)">删除</a>
						</template>
					</a-table>
				</div>
				<table
					v-if="currentStep === 1"
					class="table"
					cellspacing="0"
					cellpadding="0"
				>
					<colgroup>
						<col width="15%" />
						<col width="35%" />
						<col width="15%" />
						<col width="35%" />
					</colgroup>
					<tbody>
						<tr>
							<td colspan="4">
								<p><strong>出仓单</strong></p>
								<!-- <p style="text-align: right;">开具日期：{{ formValues }}</p> -->
							</td>
						</tr>
						<tr>
							<td><p>货权方：</p></td>
							<td>
								<p>{{ VUEX_ST_COMPANYSUER.companyName }}</p>
							</td>
							<td><p>仓储企业：</p></td>
							<td>
								<p>{{ formValues.storageCompany || curStorageCompany.name }}</p>
							</td>
						</tr>
						<tr>
							<td><p>储存库点：</p></td>
							<td>
								<p>{{ formValues.depotPoint || curDepotPoint.name }}</p>
							</td>
							<td><p>仓房号：</p></td>
							<td>
								<p>{{ formValues.storehouse || curStorehouse.name }}</p>
							</td>
						</tr>
						<tr>
							<td><p>提货人名称：</p></td>
							<td>
								<p>{{ formValues.consignee }}</p>
							</td>
							<td><p>出仓期限：</p></td>
							<td>
								<p>
									{{ formValues.deliveryStartDate || (formValues.date && formValues.date[0].format('YYYY-MM-DD')) }}
									至
									{{ formValues.deliveryEndDate || (formValues.date && formValues.date[1].format('YYYY-MM-DD')) }}
								</p>
							</td>
						</tr>
						<tr>
							<td><p>货物名称：</p></td>
							<td>
								<p>{{ formValues.grainName }}</p>
							</td>
							<td><p>出仓数量：</p></td>
							<td>
								<p>{{ formValues.deliveryAmount }} 吨</p>
							</td>
						</tr>
						<tr>
							<td><p>备注：</p></td>
							<td colspan="3">
								<p style="text-align: left">{{ formValues.remarks }}</p>
							</td>
						</tr>
					</tbody>
				</table>
				<a-result
					v-if="currentStep === 2"
					status="success"
					title="操作成功"
					:sub-title="
						ownFund
							? '出仓单已经开具，您可以到“出仓单管理”查看该出仓单。'
							: '出仓单已经开具，您可以到“出仓单管理”查询金融机构审核进度。'
					"
				>
				</a-result>
			</a-card>
		</a-form>

		<a-card
			class="tc"
			:bordered="false"
		>
			<template v-if="currentStep === 0">
				<a-button
					style="margin-right: 24px"
					@click="cancel"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="nextStep"
					:disabled="loading"
					>提交</a-button
				>
			</template>
			<template v-if="currentStep === 1">
				<div
					class="tc"
					style="margin-bottom: 20px"
				>
					<a-checkbox v-model="agreementChecked"> 已仔细核对《出仓单》且无异议，同意签章 </a-checkbox>
				</div>
				<a-button
					type="primary"
					style="margin: 0px 50px"
					:disabled="!agreementChecked || loading"
					@click="toSign"
					>确认&签章</a-button
				>
			</template>
			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
			/>
			<SignModal ref="signModal"></SignModal>
		</a-card>
		<a-modal
			v-model="curStorehouseVisible"
			title="出仓单新增-仓房选择"
			@ok="getCurStorehouse"
			@cancel="cancelCurStorehouse"
			:width="900"
		>
			<div class="curStorehouseModel">
				<a-descriptions :column="2">
					<a-descriptions-item label="仓储企业">
						{{ curStorageCompany.name || '请选择-仓储企业' }}
					</a-descriptions-item>
					<a-descriptions-item label="储存库点">
						{{ curDepotPoint.name || '请选择-储存库点' }}
					</a-descriptions-item>
				</a-descriptions>
				<a-table
					:scroll="{ x: true }"
					bordered
					:rowSelection="rowSelection"
					:dataSource="storehouseList"
					:columns="curStorehouseColumns"
					:pagination="{ hideOnSinglePage: true }"
					:rowKey="record => record.storehouseId"
					:customRow="onClickRow"
				>
				</a-table>
			</div>
		</a-modal>
	</div>
</template>

<script lang="jsx">
import {
	API_OutWarehouseReceiptGetStorageCompany,
	API_OutWarehouseReceiptGetGrainVariety,
	API_OutWarehouseReceiptSave,
	API_OutWarehouseReceiptUkey, // 盖章[Ukey]
	API_OutWarehouseReceiptAutoSignature, // 盖章[托管]
	API_OutWarehouseReceiptUpdateStatus, // 修改出仓单状态
	API_OutWarehouseReceiptDetail //出仓单详情数据，带签章状态时调用
} from '@/v2/center/storage/api';
import moment from 'moment';
import { sign } from '@/v2/utils/sign.js';
import { mapGetters } from 'vuex';
import { hasAuth } from '@/v2/utils/checkAuth';
import SignModal from '@/v2/components/signModal/index';
import { getPopupContainer } from '@/v2/utils/factory';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

const columns = [
	{
		title: '银行还款流水号',
		dataIndex: 'repaymentSerialNo',
		scopedSlots: { customRender: 'repaymentSerialNo' },
		width: 150
	},
	{
		title: '还款时间',
		dataIndex: 'repaymentTime',
		scopedSlots: { customRender: 'repaymentTime' },
		width: 200
	},
	{
		title: '对应还款金额(元)',
		dataIndex: 'repaymentAmount',
		width: 220,
		scopedSlots: { customRender: 'repaymentAmount' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 100,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const curStorehouseColumns = [
	{ title: '仓房', dataIndex: 'name', width: 65 },
	{ title: '累计入库数量(吨)', dataIndex: 'cumulativeStorage', width: 144 },
	{ title: '累计出库数量(吨)', dataIndex: 'cumulativeOutbound', width: 144 },
	{ title: '实时库存(吨)', dataIndex: 'currentCapacity', width: 116 },
	{ title: '已开出仓单数量(吨)', dataIndex: 'issuedReceipt', width: 158 },
	{ title: '可开出仓单数量(吨)', dataIndex: 'canReceipt', width: 158 }
];
export default {
	name: 'storageCenterOutCreate',
	components: {
		SignModal,
		ChooseStamp
	},

	data() {
		return {
			moment,
			columns,
			curStorehouseColumns,
			getPopupContainer,
			agreementChecked: false,
			currentStep: null,
			formValues: {},
			steps: ['填写出仓单信息', '确认签章', '开具成功'],
			continue: true,
			dataSource: [],
			grainVariety: [],
			curStorageCompany: {},
			curDepotPoint: {},
			curStorehouse: {},
			selectedRowKeys: [], //表格选中
			storageCompanyList: [],
			depotPointList: [],
			storehouseList: [],
			attachments: [],
			loading: false,
			curStorehouseVisible: false, //仓房选择弹框
			form: this.$form.createForm(this),
			formLayout: {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 14
				}
			},
			data: {},
			checkData: {},
			last: false, // 是否是最后一次出仓单
			ownFund: false //是否为自有资金，true自有资金，false非自有资金
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		//表格单选
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.storehouseId];
				}
			};
		}
	},

	methods: {
		getGrainVariety() {
			API_OutWarehouseReceiptGetGrainVariety().then(res => {
				this.grainVariety = res.data;
			});
		},
		getDepotPointList(storageCompany) {
			this.curStorageCompany = storageCompany;
			this.depotPointList = storageCompany.depotPointList;
			this.storehouseList = [];
			this.curDepotPoint = {};
			this.selectedRowKeys = [];
			this.curStorehouse = {};
			this.form.resetFields(['depotPointFlag', 'storehouseId']);
		},
		getStorehouseList(depotPoint) {
			this.storehouseList = depotPoint.storehouseList;
			this.curDepotPoint = depotPoint;
			this.selectedRowKeys = [];
			this.form.resetFields(['storehouseId']);
			this.curStorehouse = {};
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.storehouseId];
						return;
					}
				}
			};
		},
		//选择仓房
		getCurStorehouse() {
			//判断是否有选中仓房
			if (this.selectedRowKeys.length > 0) {
				this.curStorehouse = this.storehouseList.find(item => {
					return item.storehouseId == this.selectedRowKeys[0];
				});
				this.form.setFieldsValue({
					storehouseId: this.curStorehouse.storehouseId
				});
				this.curStorehouseVisible = false;
			} else {
				this.$message.warning('请选择仓房');
			}
		},
		//选择仓房弹框取消
		cancelCurStorehouse() {
			this.selectedRowKeys = this.curStorehouse.storehouseId ? [this.curStorehouse.storehouseId] : [];
		},
		//出仓单数量校验规则
		deliveryAmountRules(rule, value, callback) {
			if (value) {
				if (value <= 0) {
					callback('出仓数量须大于零');
				} else if (
					(this.curStorehouse.canReceipt || this.curStorehouse.canReceipt !== 0 || this.curStorehouse.canReceipt !== '0') &&
					value > this.curStorehouse.canReceipt
				) {
					//判断已经选择仓房
					callback('出仓数量不得大于该仓房可开出仓单数量');
				}
			}
			callback();
		},
		getStorageCompanyList() {
			API_OutWarehouseReceiptGetStorageCompany().then(res => {
				if (res.success) {
					this.storageCompanyList = res.data;
				}
			});
		},
		setDecoratorName(record, str) {
			return `${str}${record.timestamp}`;
		},
		setValue(v, str) {
			const fields = {};
			fields[this.setDecoratorName(this.curRecord, str)] = v;
			this.form.setFieldsValue(fields);
			this.dataSource.forEach(item => {
				if (item.timestamp === this.curRecord.timestamp) {
					item[str] = v;
				}
			});
		},
		handleChangeRepaymentSerialNo(e) {
			this.setValue(e.target.value, 'repaymentSerialNo');
		},
		handleChangeRepaymentAmount(e) {
			this.setValue(e, 'repaymentAmount');
		},
		handleChangeRepaymentTime(e) {
			this.setValue(e.format('YYYY-MM-DD'), 'repaymentTime');
		},
		handleFocus(record) {
			this.curRecord = record;
		},
		add() {
			if (this.continue) {
				this.continue = false;
				setTimeout(() => {
					const timestamp = new Date().getTime();
					const item = {
						repaymentSerialNo: '',
						repaymentAmount: '',
						repaymentTime: null,
						timestamp
					};
					this.dataSource = [...this.dataSource, item];
					this.continue = true;
				}, 200);
			}
		},
		del(index) {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确定删除此条数据？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.dataSource.splice(index, 1);
				}
			});
		},
		cancel() {
			this.$confirm({
				centered: true,
				title: '系统可能不会保存您所做的更改，确定要离开吗？',
				// content: '',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.$router.go(-1);
				}
			});
		},
		nextStep() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					this.values = values;
					this.judge();
				}
			});
		},
		judge() {
			let values = this.values;
			this.formValues = values;
			//提交数据
			this.save();
		},
		//提交数据
		save() {
			const { storageCompanyId, depotPointFlag, storehouseId, consignee, grainName, deliveryAmount, remarks, date } =
				this.formValues;
			const params = {
				storageCompanyId,
				storageCompany: this.curStorageCompany.name,
				depotPointFlag,
				storehouseId,
				consignee,
				grainName,
				deliveryAmount,
				remarks,
				deliveryStartDate: date[0].format('YYYY-MM-DD'),
				deliveryEndDate: date[1].format('YYYY-MM-DD'),
				paymentInfoList: this.dataSource,
				last: this.last
			};
			this.loading = true;
			API_OutWarehouseReceiptSave(params)
				.then(res => {
					if (res.success) {
						if (res.data) {
							// this.$message.success('保存成功')
							this.id = res.data.id;
							//进行对应的权限状态判断
							//核心企业管理员、仓储员可新增，管理员可以签章，仓储员返回列表，签章员进行签章
							//判断是否有签章权限 VUEX_ST_USERAUTH权限列表
							if (hasAuth('warehouse:outManage:outWarehouseReceipt:seal')) {
								//进行盖章
								this.currentStep += 1;
								return;
							} else {
								//无权限返回列表
								this.$message.success('保存成功,请联系签章员进行签章!');
								this.$router.go(-1);
								return;
							}
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 盖章相关
		toSign() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.finish, isOrderModule);
				// 盖章完成刷新页面
			}
		},
		// 盖章
		step1(v) {
			return API_OutWarehouseReceiptUkey({
				id: this.id,
				...v // sign方法传入的cert参数
			});
		},

		// 修改状态
		step2() {
			return API_OutWarehouseReceiptUpdateStatus({
				id: this.id,
				sealFlag: true
			});
		},

		finish() {
			this.currentStep = 2;
		},

		// 自动盖章
		autoSignature() {
			this.signLoading = true;
			API_OutWarehouseReceiptAutoSignature(this.id)
				.then(res => {
					if (res.success) {
						this.step2()
							.then(reset => {
								if (reset.success) {
									//判断是自有资金还是金融，给与不同提示
									this.ownFund = reset.data.ownFund || false;
									this.$message.success('签署完成').then(() => this.finish());
								} else {
									this.$message.error('签署异常，请联系管理员');
								}
							})
							.finally(() => {
								this.signLoading = false;
							});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		//获取出仓单详情
		async getDetail() {
			let res = await API_OutWarehouseReceiptDetail(this.id);
			if (res.success) {
				let data = res.data;
				//判断出仓单状态是否为待签章
				if (data.status == 'WAIT_SIGN_SEAL') {
					this.formValues = data;
					this.currentStep = 1;
				} else {
					this.$message.error('出仓单详情状态异常');
					this.$router.go(-1);
				}
			} else {
				this.$message.error('出仓单详情加载失败，请稍候重试');
			}
		}
	},
	created() {
		let id = this.$route.query.id;
		//判断是否是传参
		if (id) {
			//加载出仓单详情
			this.id = id;
			this.currentStep = 1;
			this.getDetail();
		} else {
			this.currentStep = 0;
			this.getStorageCompanyList();
			this.getGrainVariety();
		}
	}
};
</script>
<style lang="less" scoped>
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.curStorehouseModel {
	::v-deep .ant-descriptions-item-label {
		text-align: right;
		font-size: 14px;
		color: #999999;
	}
	::v-deep .ant-descriptions-item-content {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.85);
		text-align: left;
	}
}
.table {
	width: 100%;
	height: 100%;
	border: 1px solid #000000;
	text-align: center;
	border-collapse: collapse;
	table-layout: fixed;
	th,
	td {
		height: 32px;
		border: 1px solid black;
		color: #000000;
		padding: 10px 6px;
	}
}
::v-deep .ant-input-number {
	width: 100%;
}
</style>
