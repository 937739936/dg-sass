<template>
	<div>
		<a-form-model
			:model="form"
			:rules="rules"
			ref="ruleForm"
			style="margin-top: 20px"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
		>
			<a-row>
				<a-col
					:span="12"
					v-if="!isEdit"
				>
					<a-form-model-item
						label="是否复制已有合同"
						prop="ifCopyHistoryOrderId"
					>
						<a-radio-group
							v-model="form.ifCopyHistoryOrderId"
							@change="setRule"
							:disabled="false"
						>
							<a-radio value="0">否</a-radio>
							<a-radio value="1">是</a-radio>
						</a-radio-group>
					</a-form-model-item>
				</a-col>
				<a-col
					:span="12"
					v-if="!isEdit"
				>
					<a-form-model-item
						label="原合同编号"
						prop="originOrderId"
					>
						<a-input
							readOnly
							v-model="form.originOrderId"
							:disabled="form.ifCopyHistoryOrderId == 0"
							placeholder="请点击选择原合同编号"
							@click="showHistoryList"
						/>
					</a-form-model-item>
				</a-col>
				<div v-if="type == 'BUY'">
					<!-- 卖方 -->
					<a-col :span="12">
						<a-form-model-item
							label="卖方"
							prop="sellCompanyId"
						>
							<a-select
								:disabled="isOa"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
								showSearch
								v-model="form.sellCompanyId"
								:notFoundContent="sellerData ? '暂无数据' : '加载中...'"
								:filterOption="false"
								:defaultActiveFirstOption="false"
								@search="getSellerList"
								@focus="getSellerList"
								@change="changeSeller"
							>
								<a-select-option
									v-for="(items, index) in sellerData"
									:key="index"
									:value="items.id"
									>{{ items.name }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
					<!-- 买方 -->
					<a-col :span="12">
						<a-form-model-item
							label="买方"
							prop="buyer"
						>
							<a-input
								style="width: 100%"
								v-model="form.buyer"
								:disabled="true"
							></a-input>
						</a-form-model-item>
					</a-col>
				</div>
				<div v-else>
					<!-- 买方 -->
					<a-col :span="12">
						<a-form-model-item
							label="买方"
							prop="buyCompanyId"
						>
							<a-select
								:disabled="isOa"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
								showSearch
								v-model="form.buyCompanyId"
								:notFoundContent="sellerData ? '暂无数据' : '加载中...'"
								:filterOption="false"
								:defaultActiveFirstOption="false"
								@search="getSellerList"
								@focus="getSellerList"
								@change="changeSeller"
							>
								<a-select-option
									v-for="(items, index) in sellerData"
									:key="index"
									:value="items.id"
									>{{ items.name }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
					<!-- 卖方 -->
					<a-col :span="12">
						<a-form-model-item
							label="卖方"
							prop="seller"
						>
							<a-input
								style="width: 100%"
								v-model="form.seller"
								:disabled="true"
							></a-input>
						</a-form-model-item>
					</a-col>
				</div>

				<!-- 钢材种类 -->
				<a-col :span="12">
					<a-form-model-item
						label="钢材种类"
						prop="steelType"
					>
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							mode="multiple"
							@change="steelTypeChange"
							:disabled="isOa"
							v-model="form.steelType"
						>
							<a-select-option
								v-for="(items, index) in steelTypeList"
								:key="index"
								:value="items.value"
							>
								{{ items.label }}
							</a-select-option>
						</a-select>
					</a-form-model-item>
				</a-col>
				<!-- 没有选择卖方之前资金来源没有数据  -->
				<a-col :span="12">
					<a-form-model-item
						label="业务类型"
						prop="businessType"
					>
						<a-select
							placeholder="请选择"
							@change="changeBusinessType"
							v-model="form.businessType"
						>
							<a-select-option
								v-for="(items, index) in contractBusinessData"
								:key="index"
								:value="items.value"
								>{{ items.label }}</a-select-option
							>
						</a-select>
					</a-form-model-item>
				</a-col>
				<!-- 合同模板 -->
				<a-col :span="12">
					<a-form-model-item
						label="选择合同模板"
						prop="contractTemplate"
					>
						<a-select
							placeholder="请选择"
							@change="contractTemplateChange"
							v-model="form.contractTemplate"
						>
							<a-select-option
								v-for="(items, index) in contractTemplateDict"
								:key="index"
								:value="items.value"
								>{{ items.label }}</a-select-option
							>
						</a-select>
					</a-form-model-item>
				</a-col>
				<!-- 合同期限-->
				<a-col :span="12">
					<a-form-model-item
						label="合同期限"
						prop="date"
					>
						<a-range-picker
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							:placeholder="['开始时间', '结束时间']"
							@change="getTimeEnd"
							v-model="form.date"
							style="width: 100%;"
						/>
					</a-form-model-item>
				</a-col>
				<!-- 合同签约地 -->
				<a-col :span="12">
					<a-form-model-item
						label="合同签约地"
						prop="contractSignPlace"
					>
						<a-cascader
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:options="contractSignPlaceData"
							v-model="form.contractSignPlace"
							:display-render="displayRender"
						/>
					</a-form-model-item>
				</a-col>
				<!-- 资金来源 -->
				<a-col :span="12">
					<a-form-model-item
						label="使用资金来源"
						prop="bankProductCode"
					>
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							v-model="form.bankProductCode"
						>
							<a-select-option
								v-for="(items, index) in payTypeList"
								:key="index"
								:value="items.code"
								>{{ items.name }}</a-select-option
							>
						</a-select>
					</a-form-model-item>
				</a-col>
				<!-- 货权过户费 -->
				<!-- 仓押 应收没有 -->
				<a-col
					:span="12"
					v-if="['FINISHED_STEEL_BUY_004'].includes(form.contractTemplate) && type == 'BUY'"
				>
					<a-form-model-item
						label="货权过户费"
						prop="titleTransferFee"
					>
						<a-select
							placeholder="请选择"
							:disabled="isOa"
							:getPopupContainer="getPopupContainer"
							v-model="form.titleTransferFee"
						>
							<a-select-option value="PAID_BY_PARTY_A">甲方支付</a-select-option>
							<a-select-option value="PAID_BY_PARTY_B">乙方支付</a-select-option>
						</a-select>
					</a-form-model-item>
				</a-col>
				<!-- 销售合同没有废钢 -->
				<!-- 是否指定规格 -->
				<!-- 判断 是否是废钢 -->
				<div v-if="!form.steelType.includes('SCRAP_STEEL')">
					<a-col :span="12">
						<a-form-model-item
							label="是否指定规格"
							prop="appointSpec"
						>
							<a-select
								placeholder="请选择"
								:disabled="isOa"
								:getPopupContainer="getPopupContainer"
								@change="changeAppoint"
								v-model="form.appointSpec"
							>
								<a-select-option :value="1">是</a-select-option>
								<a-select-option :value="0">否</a-select-option>
							</a-select>
						</a-form-model-item>
					</a-col>
				</div>
				<div v-if="form.steelType.includes('SCRAP_STEEL')">
					<a-col :span="12">
						<a-form-model-item
							label="交付履约地"
							prop="deliverPlace"
						>
							<a-input
								placeholder="请输入"
								v-model="form.deliverPlace"
							>
							</a-input>
						</a-form-model-item>
					</a-col>
				</div>

				<!-- 榆神 002   仓押 代采 代采+仓押 005  并且是采购合同 不显示  运费 和 运输方式 -->
				<div
					v-if="
						!['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_BUY_004', 'FINISHED_STEEL_BUY_005'].includes(form.contractTemplate) &&
						type == 'BUY'
					"
				>
					<!-- 运费支付方式 -->
					<a-col
						:span="12"
						v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(form.contractTemplate) && type == 'BUY'"
					>
						<a-form-model-item
							label="运费支付方式"
							prop="freightPaymentMode"
						>
							<a-select
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
								v-model="form.freightPaymentMode"
							>
								<a-select-option
									v-for="(items, index) in freightPayTypeData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
					<!-- 运输方式 -->
					<a-col :span="12">
						<a-form-model-item
							label="运输方式"
							prop="transportMode"
						>
							<a-select
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
								v-model="form.transportMode"
							>
								<a-select-option
									v-for="(items, index) in deliveryData"
									:key="index"
									:value="items.value"
								>
									{{ items.label }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
				</div>
				<!-- 交货方式 交货地点 采购合同的显示 -->
				<div
					v-if="['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_BUY_004', 'FINISHED_STEEL_BUY_005'].includes(form.contractTemplate)"
				>
					<a-col :span="12">
						<a-form-model-item
							label="交货方式"
							prop="deliveryMode"
						>
							<a-select
								placeholder="请选择"
								:disabled="isOa"
								:getPopupContainer="getPopupContainer"
								v-model="form.deliveryMode"
							>
								<a-select-option
									v-for="(items, index) in deliveryModalList"
									:key="index"
									:value="items.code"
								>
									{{ items.title }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						v-if="['OTHER_DELIVERY', 'OTHER'].includes(form.deliveryMode)"
					>
						<a-form-model-item
							label="其他"
							prop="otherDeliveryMode"
						>
							<a-input
								v-model="form.otherDeliveryMode"
								:maxLength="100"
							/>
						</a-form-model-item>
					</a-col>
					<!-- 交货地点 -->
					<a-col :span="12">
						<a-form-model-item
							:label="labelInfo.deliveryPlace"
							prop="deliveryPlace"
						>
							<a-input
								:disabled="isOa"
								v-model="form.deliveryPlace"
							/>
						</a-form-model-item>
					</a-col>
				</div>
				<!-- 交货方式 销售合同的展示 -->
				<div v-if="['FINISHED_STEEL_SELL_002', 'FINISHED_STEEL_SELL_006'].includes(form.contractTemplate) && type == 'SELL'">
					<a-col :span="12">
						<a-form-model-item
							:label="labelInfo.deliveryMode"
							prop="deliveryMode"
						>
							<a-select
								placeholder="请选择"
								:disabled="isOa"
								:getPopupContainer="getPopupContainer"
								v-model="form.deliveryMode"
							>
								<a-select-option
									v-for="(items, index) in deliveryModalList"
									:key="index"
									:value="items.code"
								>
									{{ items.title }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						v-if="['OTHER_DELIVERY', 'OTHER'].includes(form.deliveryMode)"
					>
						<a-form-model-item
							label="其他"
							prop="otherDeliveryMode"
						>
							<a-input
								v-model="form.otherDeliveryMode"
								:maxLength="100"
							/>
						</a-form-model-item>
					</a-col>
				</div>

				<!-- 交货地点 -->
				<a-col
					:span="12"
					v-if="type == 'SELL' && ['FINISHED_STEEL_SELL_002', 'FINISHED_STEEL_SELL_006'].includes(form.contractTemplate)"
				>
					<a-form-model-item
						:label="labelInfo.deliveryPlace"
						prop="deliveryPlace"
					>
						<a-input
							:disabled="isOa"
							v-model="form.deliveryPlace"
						/>
					</a-form-model-item>
				</a-col>

				<!-- 交提货期限 -->
				<a-col
					:span="12"
					v-if="['FINISHED_STEEL_SELL_005'].includes(form.contractTemplate)"
				>
					<a-form-model-item
						label="交提货期限"
						prop="takeDeliveryDeadline"
					>
						<a-input
							:disabled="isOa"
							v-model="form.takeDeliveryDeadline"
						/>
					</a-form-model-item>
				</a-col>
				<!-- 合同签订日期 -->
				<a-col
					:span="12"
					v-if="type == 'SELL'"
				>
					<a-form-model-item
						label="合同签订日期"
						prop="contractSignDate"
					>
						<a-date-picker
							valueFormat="YYYY-MM-DD"
							v-model="form.contractSignDate"
							format="YYYY-MM-DD"
							placeholder="请选择合同签订日期"
							style="width: 100%;"
						/>
					</a-form-model-item>
				</a-col>
				<!-- 上游卖方企业名称 -->
				<a-col
					:span="12"
					v-if="
						type == 'SELL' &&
						['FINISHED_STEEL_SELL_005', 'FINISHED_STEEL_SELL_007', 'FINISHED_STEEL_SELL_006'].includes(form.contractTemplate)
					"
				>
					<a-form-model-item
						label="上游卖方企业名称"
						prop="additionalCompanyName"
					>
						<a-select
							show-search
							:disabled="$route.query.type === 'detail'"
							placeholder="请输入上游卖方企业名称"
							style="width: 100%"
							:filter-option="false"
							:default-active-first-option="false"
							:not-found-content="fetching ? undefined : null"
							@search="getCompanyInfo"
							v-model="form.additionalCompanyName"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in companyList"
								:key="item.name"
							>
								{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-model-item>
				</a-col>

				<!-- 业务经理 -->
				<a-col :span="12">
					<a-form-model-item
						label="业务经理"
						prop="assetTeamTraderId"
					>
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:filter-option="handleChangeTrader"
							v-model="form.assetTeamTraderId"
							@change="handleChangeTraderName"
						>
							<a-select-option
								v-for="(d, i) in traderList"
								:key="i"
								:value="d.keyId"
							>
								{{ d.realname }},{{ d.phone }}
							</a-select-option>
						</a-select>
					</a-form-model-item>
				</a-col>
				<!-- 是否承兑付款业务 -->
				<a-col
					:span="12"
					v-if="
						!['SCRAP_STEEL_001', 'FINISHED_STEEL_SELL_006', 'FINISHED_STEEL_SELL_002', 'RECEIVABLE_STEEL_BUY_002'].includes(
							form.contractTemplate
						)
					"
				>
					<a-form-model-item
						label="是否承兑付款业务"
						prop="acceptancePayment"
					>
						<a-radio-group v-model="form.acceptancePayment">
							<a-radio :value="0">否</a-radio>
							<a-radio :value="1">是</a-radio>
						</a-radio-group>
					</a-form-model-item>
				</a-col>

				<a-col
					:span="12"
					v-if="['RECEIVABLE_STEEL_BUY_002'].includes(form.contractTemplate)"
				>
					<a-form-model-item
						label="运费结算方式"
						prop="freightSettlementMode"
					>
						<a-select
							placeholder="请选择"
							:disabled="isOa"
							:getPopupContainer="getPopupContainer"
							v-model="form.freightSettlementMode"
						>
							<a-select-option value="ONE_TICKET">一票结算</a-select-option>
							<a-select-option value="TWO_TICKET">两票结算</a-select-option>
						</a-select>
					</a-form-model-item>
				</a-col>

				<a-col
					:span="12"
					v-if="['RECEIVABLE_STEEL_BUY_002'].includes(form.contractTemplate)"
				>
					<a-form-model-item
						label="收货地点"
						prop="deliveryPlace"
					>
						<a-input
							style="width: 100%"
							v-model="form.deliveryPlace"
						></a-input>
					</a-form-model-item>
				</a-col>

				<a-col
					:span="12"
					v-if="['RECEIVABLE_STEEL_BUY_002'].includes(form.contractTemplate)"
				>
					<a-form-model-item
						label="收货人"
						prop="deliveryMember"
					>
						<a-input
							style="width: 100%"
							v-model="form.deliveryMember"
						></a-input>
					</a-form-model-item>
				</a-col>
			</a-row>
		</a-form-model>
		<!-- 历史合同 -->
		<HistoryContractModal
			ref="historyContract"
			@send="getHistoryContract"
			:type="type"
		></HistoryContractModal>
	</div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import {
	API_SteelsContractDetail,
	getSteelTypeCascade,
	API_GetSteelBankProductItemTwo,
	getPickGoodsTypeList
} from '@/v2/center/steels/api/contract.js';
import { API_CompanySignAddressSellerandbuyer, API_GetSellListByServiceType, API_GetContractSignPlace } from '@/v2/api/account';
import { API_GetCompanyName } from '@/v2/center/steels/api';
import { getPopupContainer, getPersonalDetail } from '@/v2/utils/factory';
import HistoryContractModal from './HistoryContractModal.vue';
import SaveData from 'store/storage';
import { filterSteelsCodeByKey, filterCodeByKey } from '@sub/utils/globalCode.js';
import contract from '@/v2/center/steels/mixins/contract.js';
export default {
	props: {
		isOa: {
			default: false
		},
		type: {
			default: 'BUY'
		}
	},
	mixins: [contract],
	data() {
		return {
			form: {
				ifCopyHistoryOrderId: '0',
				sellCompanyId: '',
				buyCompanyId: '',
				seller: '',
				buyer: '',
				originOrderId: '',
				steelType: ['FINISHED_STEEL'],
				contractSignPlace: [],
				contractTemplate: '',
				deliveryMode: '',
				assetTeamTraderId: '',
				businessType: '',
				titleTransferFee: '',
				appointSpec: 0,
				deliverPlace: '',
				freightSettlementMode: '',
				otherDeliveryMode: '',
				transportMode: '',
				acceptancePayment: 0,
				// 运费支付方式
				freightPaymentMode: '',
				date: [],
				bankProductCode: '',
				takeDeliveryDeadline: '',
				contractSignDate: '',
				additionalCompanyName: '',
				deliveryPlace: '',
				deliveryMember: ''
			},
			rules: {
				originOrderId: [{ required: false, message: '请填写是否复制已有合同', trigger: ['change', 'blur'] }],
				sellCompanyId: [{ required: true, message: '请选择', trigger: 'change' }],
				buyCompanyId: [{ required: true, message: '请选择', trigger: 'change' }],
				buyer: [{ required: true, message: '请选择', trigger: 'blur' }],
				seller: [{ required: true, message: '请选择', trigger: 'blur' }],
				steelType: [{ required: true, message: `请选择钢材种类`, trigger: 'change' }],
				businessType: [{ required: true, message: `请选择业务类型`, trigger: 'change' }],
				contractTemplate: [{ required: true, message: `请选择合同模板`, trigger: 'change' }],
				date: [{ required: true, message: `请选择合同期限`, trigger: 'change' }],
				contractSignPlace: [{ required: true, message: `请选择合同签约地`, trigger: 'change' }],
				bankProductCode: [{ required: true, message: `请选择资金来源`, trigger: 'change' }],
				freightPaymentMode: [{ required: true, message: `请选择运费支付方式`, trigger: 'change' }],
				titleTransferFee: [{ required: true, message: `请选择货权过户费`, trigger: 'change' }],
				appointSpec: [{ required: true, message: `请选择是否指定规格`, trigger: 'change' }],
				assetTeamTraderId: [{ required: true, message: `请选择业务经理`, trigger: 'change' }],
				transportMode: [{ required: true, message: `请选择运输方式`, trigger: 'change' }],
				deliveryMode: [{ required: true, message: `请选择`, trigger: 'change' }],
				freightSettlementMode: [{ required: true, message: `请选择`, trigger: 'change' }],
				deliveryPlace: [{ required: true, message: `请输入`, trigger: 'blur' }],
				deliveryMember: [{ required: true, message: `请输入`, trigger: 'blur' }],
				takeDeliveryDeadline: [{ required: true, message: `请输入交提货期限`, trigger: 'blur' }],
				contractSignDate: [{ required: true, message: `请选择合同签订日期`, trigger: 'change' }],
				acceptancePayment: [{ required: true, message: `请选择是否承兑业务`, trigger: 'blur' }],
				additionalCompanyName: [{ required: true, message: `请输入上游卖方企业名称`, trigger: 'blur' }],
				deliverPlace: [{ required: true, message: `请输入履约地`, trigger: 'blur' }]
			},
			// 卖方数据列表
			sellerData: SaveData.session.getItem('steelSellerData') || null,
			getPopupContainer,
			steelTypeList: [],
			// 合同签约地
			contractSignPlaceData: [],
			/** 复制合同的详情 */
			copyContractInfo: {},
			// 资金来源
			payTypeList: [],
			// 运费支付方式
			freightPayTypeData: filterCodeByKey('freightPayTypeDict'),
			// 运输方式
			deliveryData: filterSteelsCodeByKey('transportMode'),
			/** 交货方式 */
			deliveryModalList: [],
			// 上游企业名称
			companyList: [],
			fetching: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE',
			VUEX_ST_STEELSALLCODE: 'VUEX_ST_STEELSALLCODE'
		}),
		// 判断是否是新增
		isEdit() {
			return this.$route.query.type == 'edit';
		},

		labelInfo() {
			if (this.type == 'BUY') {
				return {
					buyer: '买方',
					deliveryPlace: '交货地点',
					deliveryMode: '交货方式'
				};
			}
			return {
				buyer: '卖方',
				deliveryPlace: '交提货地点',
				deliveryMode: '交提货方式'
			};
		},
		// 业务类型
		contractBusinessData() {
			// 是否包含废钢
			const flag = this.form.steelType.includes('SCRAP_STEEL');
			let info = {};
			info = this.steelTypeList.find(el => el.value == this.form.steelType[0]) || { children: [] };
			if (flag) {
				info = this.steelTypeList.find(el => el.value == 'SCRAP_STEEL') || { children: [] };
			}
			return info.children || [];
		},
		// 合同模板
		contractTemplateDict() {
			const info = this.contractBusinessData.find(el => el.value == this.form.businessType) || { children: [] };
			return info.children;
		}
	},
	watch: {
		// 采购合同更新 买方
		VUEX_ST_COMPANYSUER: {
			handler(info) {
				if (this.type == 'BUY') {
					this.form.buyer = info.companyName;
				} else {
					this.form.seller = info.companyName;
				}
				this.$forceUpdate();
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		this.getOrderData();
	},
	methods: {
		getOrderData() {
			this.getSellerList();
			this.getSteelTypeCascade();
			// 获取业务经理列表
			this.handleSearchTrader();
		},
		/** 获取历史合同 */
		showHistoryList() {
			this.$refs.historyContract.open();
		},
		// 获取历史合同信息
		async getHistoryContract(info) {
			// 获取合同详情
			this.getEditBuyContractDetail(info.id);
		},
		// 设置规则 // 原合同号
		setRule() {
			if (this.form.ifCopyHistoryOrderId == 0) {
				this.form.originOrderId = '';
			}
			this.rules.originOrderId[0].required = this.form.ifCopyHistoryOrderId == 1;
			this.$forceUpdate();
		},
		// 获取卖方列表
		async getSellerList(data) {
			this.sellerData = null;
			const res = await API_GetSellListByServiceType({ serviceType: 'STEEL', searchKeys: data });
			this.sellerData = res.data;
			SaveData.session.setItem('steelSellerData', this.sellerData);
		},
		changeSeller() {
			if (this.type == 'BUY') {
				this.setDataSeller(this.form.sellCompanyId);
			} else {
				this.setDataSeller(this.form.buyCompanyId);
			}
			this.$emit('changeSeller', this.form);
		},
		// 是否指定规格切换
		changeAppoint() {
			this.$emit('changeAppoint', this.form);
		},
		// 选中卖方后更新合同签约地
		setDataSeller(id) {
			const item = this.sellerData.find(el => el.id == id);
			// this.VUEX_ST_COMPANYSUER.companyUscc
			// 判断是卖方 和 买方
			let uscc1 = '';
			let uscc2 = '';
			// 采购合同 买方就是自己
			if (this.type == 'BUY') {
				uscc1 = this.VUEX_ST_COMPANYSUER.companyUscc;
				uscc2 = item.bizLicenseNo;
				// 更新资金来源
				this.getPayTypeList(uscc2);
			} else {
				uscc1 = item.bizLicenseNo;
				uscc2 = this.VUEX_ST_COMPANYSUER.companyUscc;
				// 更新资金来源
				this.getPayTypeList(uscc1);
			}

			/** 更新合同签约地 */
			this.getContractSignPlace(uscc1, uscc2);
		},
		// 获取钢材种类
		async getSteelTypeCascade() {
			const res = await getSteelTypeCascade({ contractType: this.type });
			this.steelTypeList = res.data;
			// this.steelTypeInfo = this.steelTypeList.find(el => el.value == 'FINISHED_STEEL')
		},
		// 钢材种类切换
		steelTypeChange(value) {
			if (value.includes('SCRAP_STEEL')) {
				this.form.steelType = ['SCRAP_STEEL'];
			}
			// 重置业务类型 和 合同模板
			this.form.businessType = '';
			this.form.contractTemplate = '';
		},
		getTimeEnd(val) {
			this.form.effectiveStartDate = val[0];
			this.form.effectiveEndDate = val[1];
		},
		// 合同签约地展示
		displayRender({ labels }) {
			return labels[labels.length - 1];
		},
		// 获取合同签约地展示
		async getContractSignPlace(buyerUscc = '', sellerUscc = '', copy = false) {
			const params = {
				buyerUscc,
				sellerUscc
			};
			// 重置签约地列表
			this.contractSignPlaceData = [];
			const res = await API_CompanySignAddressSellerandbuyer(params);
			const result = res.data;
			if (!res.data.buyerAddress && !res.data.sellerAddress) {
				return;
			}
			if (result.buyerAddress && result.buyerAddress.length) {
				let buyerObj = {
					value: result.buyerCompanyName,
					label: result.buyerCompanyName,
					children: []
				};
				result.buyerAddress.forEach(item => {
					let vNode = (
						<div style="color:#333333">
							0<div style="color:red;font-size:8px;color:#999999"></div>
						</div>
					);
					vNode.children[0].text = item.address;
					vNode.children[1].text = item.description;
					const project = {};
					project.value = item.address;
					project.label = vNode;
					buyerObj.children.push(project);
				});
				this.contractSignPlaceData.push(buyerObj);
			}
			if (result.sellerAddress && result.sellerAddress.length) {
				let sellerObj = {
					value: result.sellerCompanyName,
					label: result.sellerCompanyName,
					children: []
				};
				result.sellerAddress.forEach(item => {
					let vNode = (
						<div style="color:#333333">
							0<div style="color:red;font-size:8px;color:#999999"></div>
						</div>
					);
					vNode.children[0].text = item.address;
					vNode.children[1].text = item.description;
					const project = {};
					project.value = item.address;
					project.label = vNode;
					sellerObj.children.push(project);
				});
				this.contractSignPlaceData.push(sellerObj);
			}
			// 新增的时候 自动赋值
			if (!this.isEdit && !copy) {
				this.form.contractSignPlace = [this.contractSignPlaceData[0].value, this.contractSignPlaceData[0].children[0].value];
			}
			// 编辑 或者 copy的时候
			if (this.isEdit || copy) {
				if (result.buyerAddress && result.buyerAddress.length) {
					const item = result.buyerAddress.find(el => el.address == this.copyContractInfo.contractSignPlace);
					if (item) {
						this.form.contractSignPlace = [this.copyContractInfo.buyCompanyName, item.address];
					}
				}
				if (result.sellerAddress && result.sellerAddress.length) {
					const item = result.sellerAddress.find(el => el.address == this.copyContractInfo.contractSignPlace);
					if (item) {
						this.form.contractSignPlace = [this.copyContractInfo.sellCompanyName, item.address];
					}
				}
			}
		},
		// 获取资金来源
		async getPayTypeList(sellerUscc) {
			const params = {
				companyUscc: sellerUscc,
				coreCompanyUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				filter: true
			};
			const res = await API_GetSteelBankProductItemTwo(params);
			this.payTypeList = res.data;
		},
		// 查看合同详情
		async getEditBuyContractDetail(contractId) {
			// 获取复制的合同信息
			const res = await API_SteelsContractDetail(contractId);
			// this.copyContractInfo = res.data;
			this.init(res.data);
		},
		getDict() {
			const allcode = this.VUEX_ST_STEELSALLCODE;
			this.deliveryData = allcode.transportMode;
			this.freightPayTypeData = this.VUEX_ST_ALLCODE.freightPayTypeDict;
		},
		// 获取交提货方式
		async getPickGoodsTypeList(pcode, deliveryMode) {
			if (!pcode) {
				return;
			}
			if (['SCRAP_STEEL_001', 'STEEL_PROFILE'].includes(pcode)) {
				return;
			}
			const params = {
				pcode,
				async: false
			};
			const res = await getPickGoodsTypeList(params);
			this.deliveryModalList = res.result;
			if (this.isEdit && deliveryMode) {
				const flag = this.deliveryModalList.some(el => el.code == deliveryMode);
				if (!flag) {
					this.form.deliveryMode = '';
				}
			}
		},
		async getCompanyInfo(v) {
			// 获取公司社会代码
			if (!v) return;
			this.fetching = true;
			try {
				const res = await API_GetCompanyName({ name: v });
				this.companyList = res.data;
				this.fetching = false;
			} catch (error) {
				this.fetching = false;
			}
		},
		// 当合同模板发生变化的时候
		contractTemplateChange(flag) {
			if (flag != true) {
				this.form.deliveryMode = null;
			}
			if (flag == 'RECEIVABLE_STEEL_BUY_002') {
				this.form.appointSpec = 1;
			} else {
				this.form.appointSpec = 0;
			}
			this.send();
			// 合同模板发生变化  提货方式也发生变化
			this.getPickGoodsTypeList(this.form.contractTemplate);
		},
		// 业务类型
		changeBusinessType(e) {
			// 钢材种类非废钢 & 业务类型为应收时，默认选中应收采购合同模版002
			if (e === 'ACCOUNT_RECEIVABLE' && !this.form.steelType.includes('SCRAP_STEEL')) {
				this.contractTemplateChange('RECEIVABLE_STEEL_BUY_002');
			}
			this.form.contractTemplate = (e === 'ACCOUNT_RECEIVABLE' && !this.form.steelType.includes('SCRAP_STEEL')) ? 'RECEIVABLE_STEEL_BUY_002' : '';
			this.$emit('getBusinessType', this.form.businessType);
		},
		// 填充数据
		setForm(info) {
			let obj = {
				// 卖方
				sellCompanyId: info.sellCompanyId,
				// 买方
				buyCompanyId: info.buyCompanyId,
				// 钢材种类
				steelType: info.steelType,
				// 业务类型
				businessType: info.businessType || null,
				/** 合同模板 */
				contractTemplate: info.contractTemplate || null,
				// 合同期限
				date: [info.effectiveStartDate, info.effectiveEndDate], //合同期限起始时间
				effectiveStartDate: info.effectiveStartDate,
				effectiveEndDate: info.effectiveEndDate,
				// 资金来源
				bankProductCode: info.bankProductCode || null,
				// 货权过户费
				titleTransferFee: info.titleTransferFee || null,
				// 是否指定规格
				appointSpec: info.appointSpec,
				// 交付履约地
				deliverPlace: info.deliverPlace || null,
				// 运费支付方式
				freightPaymentMode: info.freightPaymentMode || null,
				//运输方式
				transportMode: info.transportMode || null,
				// 交货方式
				deliveryMode: info.deliveryMode || null,
				// 其他
				otherDeliveryMode: info.otherDeliveryMode || null,
				// 交货地点
				deliveryPlace: info.deliveryPlace || null,
				// 交货人
				deliveryMember: info.deliveryMember || null,
				// 运费支付方式
				freightSettlementMode: info.freightSettlementMode || null,
				// 是否承兑业务
				acceptancePayment: info.acceptancePayment,
				// 交提货期限
				takeDeliveryDeadline: info.takeDeliveryDeadline,
				// 合同签订日期
				contractSignDate: info.contractSignDate,
				// 上游企业名称
				additionalCompanyName: info.additionalCompanyName
			};
			// 上游企业名称
			if (this.type == 'sell') {
				this.getCompanyInfo(info.additionalCompanyName);
			}
			if (this.type == 'BUY') {
				obj.buyer = this.VUEX_ST_COMPANYSUER.companyName;
			} else {
				obj.seller = this.VUEX_ST_COMPANYSUER.companyName;
			}
			// 交货方式'
			this.getPickGoodsTypeList(info.contractTemplate, info.deliveryMode);
			Object.assign(this.form, obj);
			this.$emit('form', this.form);
			this.$emit('getBusinessType', info.businessType);
			this.$forceUpdate();
		},
		// 填充数据 修改和 提交
		init(info) {
			this.copyContractInfo = info;
			this.form.originOrderId = info.contractNo;
			this.$emit('copy', info);
			/** 填充数据 */
			// 业务经理
			this.handleSearchTrader(`${info.assetTeamId}-${info.assetTeamTraderId}` || null);
			// 合同签约地
			this.getContractSignPlace(info.buyCompanyUscc, info.sellCompanyUscc, true);
			/** 字典 */
			this.getDict();
			/** 获取卖方列表 */

			this.getSellerList();
			if (this.$route.query.type === 'edit') {
				// 复制合同时，复制已关闭钢材服务的卖方
				if (this.sellerData && this.sellerData.length > 0) {
					let obj = {};
					if (this.type == 'BUY') {
						const flag = this.sellerData.some(el => el.id == info.sellCompanyId);
						obj = {
							bizLicenseNo: info.sellCompanyUscc,
							contractSignAddress: null,
							id: info.sellCompanyId,
							name: info.sellCompanyName
						};
						this.sellerData.push(obj);
					} else {
						const flag = this.sellerData.some(el => el.id == info.buyCompanyId);
						obj = {
							bizLicenseNo: info.buyCompanyUscc,
							contractSignAddress: null,
							id: info.buyCompanyId,
							name: info.buyCompanyName
						};
						this.sellerData.push(obj);
					}
				}
			}

			// 更新资金来源

			if (this.type == 'BUY') {
				this.getPayTypeList(info.sellCompanyUscc);
			} else {
				this.getPayTypeList(info.buyCompanyUscc);
			}

			this.setForm(info);
		},
		// 保存
		save() {
			let flag = false;
			this.$refs.ruleForm.validate(valid => {
				flag = valid;
			});

			/** 获取业务经理 */

			const obj = { ...this.form };
			if (this.form.assetTeamTraderId) {
				const arr = this.form.assetTeamTraderId.split('-');
				obj.assetTeamTraderId = arr[1];
				obj.assetTeamId = arr[0];
			}
			if (flag) {
				return obj;
			}
			return flag;
		},
		// 输出数据
		send() {
			this.$emit('form', this.form);
		}
	},
	components: {
		HistoryContractModal
	}
};
</script>

<style scoped></style>
