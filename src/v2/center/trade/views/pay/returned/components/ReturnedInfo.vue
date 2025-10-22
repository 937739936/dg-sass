<template>
	<div>
		<div class="money-box">
			<div class="money-box-item">
				<p>回款金额(元)</p>
				<p>{{ notPlateClaimAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="money-box-item"
				style="background: #fff9f0"
			>
				<p>已认领金额(元)</p>
				<p>{{ claimAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="money-box-item"
				style="background: #ebfaef"
			>
				<p>可认领金额(元)</p>
				<p>{{ currentCanClaimAmount | formatMoney(2) }}</p>
			</div>
		</div>
		<div>
			<a-form :form="payApplyForm">
				<a-table
					class="new-table"
					:scroll="{ x: true }"
					:columns="columns"
					:dataSource="list"
					:pagination="false"
					rowKey="id"
				>
					<!-- 认领类型-->
					<span slot="customTitles1"><i class="req">*</i>认领类型</span>
					<template
						slot="type"
						slot-scope="text, record, index"
					>
						<a-form-item>
							<!-- 必须 === 三等 不要动 -->
							<!-- v-model="record.type" -->
							<a-select
								style="width: 140px"
								:disabled="isEdit && record.editOrDeleteBoo === false"
								v-decorator="[`type${index}`, { rules: [{ required: true, message: '认领类型必选' }] }]"
								@change="e => changeType(e, index)"
							>
								<a-select-option
									v-for="(j, index) in claimOptions"
									:key="index"
									:value="j.value"
									:disabled="j.disabled"
								>
									{{ j.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</template>
					<!-- 收款类型-->
					<span slot="customTitles2"><i class="req">*</i>收款类型</span>
					<template
						slot="paymentType"
						slot-scope="text, record, index"
					>
						<a-form-item>
							<a-radio-group
								:disabled="isEdit && record.editOrDeleteBoo === false"
								v-decorator="[`paymentType${index}`, { rules: [{ required: true, message: '收款类型必选' }] }]"
								@change="e => changePaymentType(e, index)"
							>
								<a-radio
									v-for="(item, index) in typeData"
									:value="item.value"
									:key="index"
									>{{ item.text }}</a-radio
								>
							</a-radio-group>
						</a-form-item>
					</template>
					<template
						slot="info"
						slot-scope="text, record, index"
					>
						<div
							v-if="record.type == 'FINANCING_CLAIM' && record.info && record.info.lineNo"
							class="business-box"
						>
							<p class="business">
								<span style="margin-right: 5px">业务线号：{{ record.info.lineNo }}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									v-if="!isEdit || record.editOrDeleteBoo !== false"
									@click="openBusinessLine(index, record)"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M11.8785 4.88387L8.51367 1.28012L9.43584 0.292557C9.80026 -0.0975189 10.3907 -0.0975189 10.7551 0.292557L10.7556 0.292057L12.8011 2.48121C12.9762 2.66877 13.0746 2.9232 13.0746 3.18851C13.0746 3.45381 12.9762 3.70824 12.8011 3.8958L11.8785 4.88387ZM11.219 5.59203L3.36525 14.0016H0V10.3979L7.8538 1.98828L11.219 5.59203ZM13.0673 11.9922H7.46708C6.95185 11.9922 6.53418 12.4397 6.53418 12.9918C6.53418 13.5438 6.95185 13.9913 7.46708 13.9913H13.0673C13.5825 13.9913 14.0002 13.5438 14.0002 12.9918C14.0002 12.4397 13.5825 11.9922 13.0673 11.9922Z"
										fill="var(--primary-color)"
									/>
								</svg>
							</p>
							<p>业务线名称：{{ record.info.lineName }}</p>
							<p>
								<span>采购合同：{{ record.info.upContractNo || '-' }}</span>
								<span style="margin-left: 5px">签订日期：{{ record.info.upstreamContractSignDate || '-' }}</span>
							</p>
							<p>
								<span>销售合同：{{ record.info.downContractNo || '-' }}</span>
								<span style="margin-left: 5px">签订日期：{{ record.info.downstreamContractSignDate || '-' }}</span>
							</p>
						</div>
						<div
							v-if="record.type == 'NOT_BUSINESS_CLAIM' && record.info && record.info.paperContractNo"
							class="business-box"
						>
							<p>
								<span style="margin-right: 5px">销售合同编号：{{ record.info.paperContractNo }}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									v-if="!isEdit || record.editOrDeleteBoo !== false"
									@click="openDownContract(index, record)"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M11.8785 4.88387L8.51367 1.28012L9.43584 0.292557C9.80026 -0.0975189 10.3907 -0.0975189 10.7551 0.292557L10.7556 0.292057L12.8011 2.48121C12.9762 2.66877 13.0746 2.9232 13.0746 3.18851C13.0746 3.45381 12.9762 3.70824 12.8011 3.8958L11.8785 4.88387ZM11.219 5.59203L3.36525 14.0016H0V10.3979L7.8538 1.98828L11.219 5.59203ZM13.0673 11.9922H7.46708C6.95185 11.9922 6.53418 12.4397 6.53418 12.9918C6.53418 13.5438 6.95185 13.9913 7.46708 13.9913H13.0673C13.5825 13.9913 14.0002 13.5438 14.0002 12.9918C14.0002 12.4397 13.5825 11.9922 13.0673 11.9922Z"
										fill="var(--primary-color)"
									/>
								</svg>
							</p>
							<p>买方名称：{{ record.info.buyerName || '-' }}</p>
							<p>品名：{{ record.info.goodsName || '-' }}</p>
							<p>运输方式：{{ record.info.transTypeStr || '-' }}</p>
							<p>收货人：{{ record.info.consigneeCompanyName || '-' }}</p>
							<p>交货期限：{{ record.info.execDateStart }} - {{ record.info.execDateEnd }}</p>
						</div>
						<div
							v-if="record.type == 'NON_FINANCING_CLAIM'"
							class="business-box2"
						>
							注：下游合同未在数链平台补录
						</div>
					</template>
					<template
						slot="statementAmount"
						slot-scope="text, record"
					>
						<span v-if="record.statementAmount !== null && record.statementAmount !== undefined">{{
							record.statementAmount | formatMoney(2)
						}}</span>
					</template>
					<template
						slot="paymentAmount"
						slot-scope="text, record"
					>
						<span
							href="javascript:;"
							v-if="record.type != 'NON_FINANCING_CLAIM' && record.paymentAmount !== undefined && record.paymentAmount !== null"
						>
							{{ record.paymentAmount | formatMoney(2) }}</span
						>
						<span v-if="record.type == 'NON_FINANCING_CLAIM'"> - </span>
					</template>
					<span slot="customTitles5"><i class="req">*</i>本次认领金额(元)</span>
					<template
						slot="claimAmount"
						slot-scope="text, record, index"
					>
						<a-form-item
							label=""
							:colon="false"
						>
							<a-tooltip
								placement="topLeft"
								:visible="record.priceShow && !!record.priceUnit"
								:key="record.id"
							>
								<template slot="title">
									{{ record.priceUnit }}
								</template>

								<a-input-number
									placeholder="请输入"
									@focus="e => showPrice(e, record, index)"
									@change="e => showPrice(e, record, index)"
									@blur="hidePrice(record, index)"
									:min="0.01"
									:precision="2"
									:key="index"
									:disabled="(isEdit && record.editOrDeleteBoo === false) || !record.type"
									v-decorator="[`claimAmount${index}`, { rules: [{ required: true, message: '本次认领金额必填' }] }]"
								/>
							</a-tooltip>
						</a-form-item>
					</template>

					<template
						slot="action"
						slot-scope="text, record, index"
					>
						<a
							href="javascript:;"
							v-if="list.length > 1 && ((isEdit && record.editOrDeleteBoo) || record.type == 'NON_FINANCING_CLAIM' || !isEdit)"
							@click="openDelModal(index)"
							>删除</a
						>
					</template>
				</a-table>
			</a-form>
			<div
				class="add"
				@click="add"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="none"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5 0C4.44772 0 4 0.447715 4 1V4L1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6H4V9C4 9.55229 4.44772 10 5 10C5.55228 10 6 9.55228 6 9V6H9C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4L6 4V1C6 0.447715 5.55228 0 5 0Z"
						fill="var(--primary-color)"
					/>
				</svg>
				<span style="margin-left: 8px">新增</span>
			</div>
		</div>
		<DelModal
			ref="delModal"
			tip="确认要删除该笔认领记录吗，删除后无法恢复"
			title="确认删除"
			@save="saveDel"
		></DelModal>
		<BusinessLine
			ref="businessLine"
			@select="selectBusiness"
			@noSelect="noSelect"
			:paymentInfo="paymentInfo"
		></BusinessLine>
		<DownContract
			ref="downContract"
			@select="selectDownContract"
			@noSelect="noSelect"
			:paymentInfo="paymentInfo"
		></DownContract>
	</div>
</template>

<script>
import DelModal from '../../components/DelModal.vue';
import BusinessLine from './BusinessLine.vue';
import DownContract from './DownContract.vue';
import { cloneDeep } from 'lodash';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
const columns = [
	{ key: 'type', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'type' } },
	{ key: 'paymentType', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'paymentType' } },
	{ key: 'info', title: '认领信息', scopedSlots: { customRender: 'info' }, width: 420 },
	{ key: 'statementAmount', title: '下游结算金额(元)', scopedSlots: { customRender: 'statementAmount' } },
	{ key: 'paymentAmount', title: '已认领金额(元)', scopedSlots: { customRender: 'paymentAmount' } },
	{ key: 'claimAmount', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'claimAmount' } },
	{ title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: 75, fixed: 'right' }
];
export default {
	props: ['returnedMoney', 'paymentInfo'],
	data() {
		return {
			// 回款金额
			notPlateClaimAmount: 0,
			columns,
			// 认领列表
			list: [],
			// 缓存列表
			cacheList: [],
			// 认领操作索引
			currentIndex: '',
			payApplyForm: this.$form.createForm(this),
			// 已经选择的业务线号 或者下游合同
			selected: null,
			claimAmount: 0,
			typeData: filterCodeByKey('collectionClaimPaymentTypeEnum')
		};
	},
	watch: {
		returnedMoney(val) {
			this.notPlateClaimAmount = val || 0;
		},
		paymentInfo: {
			handler(info) {
				if (info.handleType == 'add') {
					this.list = [];
					this.cacheList = [];
				}
			},
			deep: true
		}
	},
	computed: {
		claimOptions() {
			const flag = this.list.some(el => el.type == 'NON_FINANCING_CLAIM');
			// ■ 非线上业务回款：只允许有一条数据，一旦某行选择后，其余行不可再选择此项，其他行选择时，禁用此选项。
			return [
				{ value: 'FINANCING_CLAIM', label: '业务线回款' },
				{ value: 'NOT_BUSINESS_CLAIM', label: '非业务线回款' },
				{ value: 'NON_FINANCING_CLAIM', label: '非线上业务回款', disabled: flag }
			];
		},
		// 计算认领金额
		// claimedAmount() {
		//   console.log(1111)
		//   let num = 0
		//   this.list.forEach(el => {
		//     num += +(el.claimAmount || 0)
		//   })
		//   return num
		// },
		// 可认领金额
		currentCanClaimAmount() {
			return +(this.notPlateClaimAmount - this.claimAmount).toFixed(2);
		},
		/** 是否是编辑 */
		isEdit() {
			return !!this.$route.query.id;
		}
	},
	methods: {
		init(data) {
			/** 初始化数据 */
			data.forEach((el, index) => {
				el.statementAmount = el.downstreamSettleAmount;
				el.paymentAmount = el.currentClaimedAmount;
				el.claimAmount = el.currentClaimedAmount;
				el.priceShow = false;
				if (el.type == 'NOT_BUSINESS_CLAIM') {
					el.info = {
						paperContractNo: el.downstreamContractNo,
						buyerName: el.buyerName,
						goodsName: el.goodsName,
						consigneeCompanyName: el.consigneeCompanyName,
						execDateStart: el.execDateStart,
						execDateEnd: el.execDateEnd,
						transTypeStr: el.transportModeDesc,
						id: el.terminalContractId,
						contractType: el.contractType || 'OFFLINE'
					};
					// el.statementAmount= el.downstreamSettleAmount
					// el.paymentAmount = el.claimedAmount
					// el.claimAmount = el.currentClaimedAmount
				} else if (el.type == 'FINANCING_CLAIM') {
					el.info = {
						lineNo: el.businessLineNo,
						lineName: el.businessLineName,
						upContractNo: el.upstreamContractNo,
						downContractNo: el.downstreamContractNo,
						upstreamContractSignDate: el.upstreamContractSignDate,
						downstreamContractSignDate: el.downstreamContractSignDate,
						id: el.terminalContractId
					};
				}
				this.$nextTick(() => {
					const obj = {};
					const key = `claimAmount${index}`;
					const key2 = `type${index}`;
					const key3 = `paymentType${index}`;
					obj[key] = el.claimAmount;
					obj[key2] = el.type;
					obj[key3] = el.paymentType;
					this.payApplyForm.setFieldsValue(obj);
				});
			});
			this.list = data;
			this.cacheList = cloneDeep(data);
			this.computedClaimAmount();
		},
		// 初始化 从业务线跳转过来的数据
		initBusiness(data) {
			data.forEach((el, index) => {
				el.priceShow = false;
				el.statementAmount = el.info.statementAmount || '0';
				el.paymentAmount = '0';
				this.$nextTick(() => {
					const obj = {};
					const key2 = `type${index}`;
					obj[key2] = el.type;
					this.$nextTick(() => {
						this.payApplyForm.setFieldsValue(obj);
					});
				});
			});
			this.list = data;
			this.cacheList = cloneDeep(data);
			this.computedClaimAmount();
		},
		showPrice(e, item, index) {
			if (!e) {
				return;
			}
			const value = e.target ? e.target.value : e;
			// this.list[index].claimAmount = value
			this.$set(this.list[index], 'claimAmount', value);
			this.$set(this.cacheList[index], 'claimAmount', value);
			this.computedClaimAmount();
			if (!value || value < 1000) {
				item.priceShow = false;
				item.priceUnit = '';
				return;
			}
			item.priceShow = true;
			item.priceUnit = this.computeUnit(value);
		},
		hidePrice(record, index) {
			this.$set(this.list[index], 'priceShow', false);
			this.$forceUpdate();
		},
		computeUnit(val) {
			let priceUnit = '';
			if (val >= 1000 && val < 10000) {
				priceUnit = '千';
			} else if (val > 10000 && val <= 100000) {
				priceUnit = '万';
			} else if (val > 100000 && val <= 1000000) {
				priceUnit = '十万';
			} else if (val > 1000000 && val <= 10000000) {
				priceUnit = '百万';
			} else if (val > 10000000 && val <= 100000000) {
				priceUnit = '千万';
			} else if (val > 100000000 && val <= 1000000000) {
				priceUnit = '亿';
			} else if (val > 1000000000 && val <= 10000000000) {
				priceUnit = '十亿';
			} else if (val > 10000000000) {
				priceUnit = '百亿';
			}
			return priceUnit;
		},
		// 计算本次认领金额
		computedClaimAmount() {
			this.claimAmount = 0;
			this.list.forEach(el => {
				this.claimAmount += +(el.claimAmount || 0);
			});
		},
		// 选择认领类型
		changeType(val, index) {
			this.currentIndex = index;
			this.$set(this.list[index], 'type', val);
			// 业务线
			if (val == 'FINANCING_CLAIM') {
				this.openBusinessLine(index, '');
			} else if (val == 'NOT_BUSINESS_CLAIM') {
				this.openDownContract(index, '');
			}
		},
		// 选择收款类型
		changePaymentType(e, index) {
			this.currentIndex = index;
			this.$set(this.list[index], 'paymentType', e.target.value);
		},
		openDelModal(index) {
			this.currentIndex = index;
			this.$refs.delModal.open();
		},
		saveDel() {
			this.list.forEach((el, i, arr) => {
				if (i == this.currentIndex) {
					arr.splice(i, 1);
				}
			});
			this.list.forEach((el, index) => {
				const obj = {};
				const key = `claimAmount${index}`;
				const key2 = `type${index}`;
				const key3 = `paymentType${index}`;
				obj[key] = el.claimAmount;
				obj[key2] = el.type;
				obj[key3] = el.paymentType;
				this.$nextTick(() => {
					this.payApplyForm.setFieldsValue(obj);
				});
			});
			this.cacheList = cloneDeep(this.list);
			this.computedClaimAmount();
			this.$refs.delModal.close();
		},
		add() {
			if (!this.paymentInfo.terminalName && !this.isEdit && !this.$route.query.source) {
				this.$message.error('请选择回款方');
				return;
			}
			const obj = {
				type: '',
				id: Math.random(),
				info: {},
				statementAmount: 0,
				paymentAmount: 0,
				claimAmount: null,
				editOrDeleteBoo: true
			};
			this.list.push(obj);
			this.cacheList = cloneDeep(this.list);
			this.computedClaimAmount();
			this.$forceUpdate();
		},
		selectBusiness(info) {
			/** 判断当前是否已经有 这个业务线 */
			this.selectDownContractInfo = info;
			const item = this.list[this.currentIndex];
			item.info = info;
			item.statementAmount = info.statementAmount || '0';
			item.paymentAmount = '0';
			this.list[this.currentIndex] = item;
			this.$set(this.list, this.currentIndex, item);
			this.cacheList = cloneDeep(this.list);
			this.$forceUpdate();
		},
		selectDownContract(info) {
			this.selectDownContractInfo = info;
			this.list[this.currentIndex].info = info;
			this.list[this.currentIndex].statementAmount = info.statementAmount || '0';
			this.list[this.currentIndex].paymentAmount = '0';
			this.cacheList = cloneDeep(this.list);
			this.$forceUpdate();
		},
		noSelect() {
			const item = this.cacheList[this.currentIndex];
			this.list[this.currentIndex] = { ...item };
			const obj = {};
			const key = `type${this.currentIndex}`;
			obj[key] = item.type;
			this.payApplyForm.setFieldsValue(obj);
			this.$forceUpdate();
		},
		// 选择业务线
		openBusinessLine(index, record) {
			this.currentIndex = index;
			this.$refs.businessLine.showDrawer(record);
		},
		openDownContract(index, record) {
			this.currentIndex = index;
			this.$refs.downContract.showDrawer(record);
		},
		// 不允许相同【收款类型】选择重复的业务线，不允许相同【收款类型】选择重复的合同
		checkPaymentType() {
			let flag = true;
			let type = '';
			if (this.list.length > 1) {
				for (let i = 0; i < this.list.length - 1; i++) {
					if (flag) {
						for (let j = i; j < this.list.length; j++) {
							if (j !== i) {
								let current = this.list[i];
								let next = this.list[j];
								if (
									current.type === 'FINANCING_CLAIM' &&
									current.type === next.type &&
									current.info.lineNo === next.info.lineNo &&
									current.paymentType === next.paymentType
								) {
									flag = false;
									type = current.type;
									break;
								}
								if (
									current.type === 'NOT_BUSINESS_CLAIM' &&
									current.type === next.type &&
									current.info.paperContractNo === next.info.paperContractNo &&
									current.paymentType === next.paymentType
								) {
									flag = false;
									type = current.type;
									break;
								}
							}
						}
					}
				}
			}
			return { flag: flag, type: type };
		},
		save() {
			if (!this.list.length) {
				this.$message.error('至少有一条回款认领信息');
				return;
			}
			return new Promise(async resolve => {
				this.payApplyForm.validateFieldsAndScroll(err => {
					if (!err) {
						const result = this.checkPaymentType();
						if (result && !result.flag) {
							this.$message.error(
								result.type === 'FINANCING_CLAIM'
									? '不允许相同【收款类型】选择重复的业务线'
									: '不允许相同【收款类型】选择重复的合同'
							);
							return;
						}
						/** 判断 非业务回款认领金额 */
						if (this.currentCanClaimAmount < 0) {
							this.$message.error('本次认领金额不能大于可认领余额');
							return;
						}
						resolve(this.list);
					} else {
						resolve(false);
					}
				});
			});
		}
	},
	components: {
		DelModal,
		BusinessLine,
		DownContract
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
svg {
	cursor: pointer;
}
.money-box {
	display: flex;
	margin-bottom: 30px;
	&-item {
		width: 250px;
		height: 88px;
		flex-shrink: 0;
		border-radius: 6px;
		background: #f0f8ff;
		margin-right: 30px;
		padding: 14px 0;
		padding-left: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		p:last-child {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 600;
		}
	}
}
.new-table {
	border-radius: 4px 4px 0 0px;
}
.req {
	display: inline-block;
	color: red;
	margin-right: 10px;
	position: relative;
	top: 2px;
}
.add {
	width: 100%;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	border-top: 0;
	height: 48px;
	border-radius: 0px 0px 4px 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: @primary-color;
	font-family: PingFang SC;
	font-size: 14px;
	cursor: pointer;
}
.business-box {
	p {
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		font-family: PingFang SC;
		font-size: 12px;
	}
	P:first-child {
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		margin-bottom: 10px;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
}
.business-box2 {
	color: var(--text-40, rgba(0, 0, 0, 0.4));
	font-size: 14px;
}
.ant-table-fixed-left,
.ant-table-fixed-right {
	z-index: 999;
}
</style>
