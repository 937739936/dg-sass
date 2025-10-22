<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div class="methods-wrap">
				<span
					v-if="isEdit"
					slot="title"
					class="slTitle"
					>编辑池资产</span
				>
				<span
					v-else
					slot="title"
					class="slTitle"
					>新增池资产</span
				>
				<a
					href="javascript:;"
					@click="$router.back()"
					>返回</a
				>
			</div>
			<div class="bottom-box">
				<!-- 只显⽰当前“平台驳回”的审核信息 -->
				<div
					class="s-card-content"
					v-if="
						detailData.receivalVO &&
						detailData.receivalVO.status == 'PLATFORM_REJECT' &&
						detailData.auditInfo &&
						detailData.auditInfo.audit &&
						detailData.auditInfo.audit.auditResult != 'PASS'
					"
				>
					<h2>审核信息</h2>
					<a-row>
						<a-col :span="4">审批人</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditor }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核时间</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditTime }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核结果</a-col>
						<a-col
							:span="20"
							class="red"
							>驳回</a-col
						>
					</a-row>
					<a-row>
						<a-col :span="4">驳回原因</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditOpinion }}</a-col>
					</a-row>
				</div>
				<!-- 只显⽰当前“融资失败”且已批注的批注信息-->
				<div
					class="s-card-content"
					v-if="
						detailData.receivalVO &&
						detailData.receivalVO.status == 'COMMENTED' &&
						detailData.commentInfo &&
						detailData.commentInfo.comment
					"
				>
					<h2>批注信息</h2>
					<a-row>
						<a-col :span="4">批注人</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.commenter }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">批注时间</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.createDate }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">批注信息</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.remark }}</a-col>
					</a-row>
				</div>
			</div>
			<div class="bottom-box">
				<div class="s-card-content">
					<a-form :form="baseForm">
						<h2>基本信息</h2>
						<a-row class="row">
							<a-col span="12">
								<a-row>
									<a-form-item
										label="应收账款流水号"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<span v-if="detailData.receivalVO">{{ detailData.receivalVO.serialNo }}</span>
										<span v-else>-</span>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="卖方名称"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										{{ VUEX_ST_COMPANYSUER.companyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="应收账款类型"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-radio-group
											button-style="solid"
											v-decorator="[
												`type`,
												{
													initialValue: 'PROOF',
													rules: [{ required: true, message: `应收账款类型必填` }]
												}
											]"
										>
											<a-radio-button value="PROOF">凭证结算</a-radio-button>
											<a-radio-button value="INVOICE">发票结算</a-radio-button>
										</a-radio-group>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="应收账款起始日期"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-date-picker
											@change="changeBeginDate"
											:disabled-date="disabledDate"
											v-decorator="[
												`beginDate`,
												{
													rules: [{ required: true, message: `应收账款起始日期必填` }],
													validateTrigger: 'change'
												}
											]"
										></a-date-picker>
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item
										label="应收账款金额"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-input
											placeholder="请输入应收账款金额（元）"
											v-decorator="[
												`amount`,
												{
													rules: [
														{ required: true, message: `应收账款金额必填` },
														{ pattern: numberReg, message: '请输入数字，最多两位小数' }
													]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="资金类型"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-select
											showSearch
											:filterOption="false"
											:defaultActiveFirstOption="false"
											@change="changeBankName"
											placeholder="请输入资金类型"
											v-decorator="[
												`paymentType`,
												{
													rules: [{ required: true, message: `资金类型必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in bankList"
												:key="index"
												:value="item.paymentType"
											>
												{{ item.name }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="是否复用已有下游合同"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-radio-group
											v-decorator="[
												`poolReuse`,
												{
													initialValue: 1,
													rules: [{ required: true, message: `应收账款类型必填` }]
												}
											]"
											@change="changeFu"
											:disabled="isEdit"
										>
											<a-radio :value="1">是</a-radio>
											<a-radio :value="0">否</a-radio>
										</a-radio-group>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item
										label="行业"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-select
											placeholder="请选择行业"
											v-decorator="[
												`industryType`,
												{
													rules: [{ required: true, message: `行业必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in [{ name: '煤炭', value: 'COAL' }]"
												:key="index"
												:value="item.value"
											>
												{{ item.name }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="买方名称"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-select
											showSearch
											:disabled="VUEX_POOL_ASSET_OBJ.disableCopy || isEdit"
											:filterOption="filterOption"
											:defaultActiveFirstOption="false"
											placeholder="请输入买方名称"
											@change="changeBuyname"
											v-decorator="[
												`buyerUscc`,
												{
													rules: [{ required: true, message: `买方名称必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in buyerNameList"
												:key="index"
												:value="item.uscc"
											>
												{{ item.companyName }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="金融机构"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<span v-if="bankName">{{ bankName }}</span>
										<span v-else-if="detailData.receivalVO">{{ detailData.receivalVO.bankName }}</span>
										<span v-else>-</span>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="应收账款到期日期"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<span v-if="endDate">{{ endDate }}</span>
										<span v-else-if="detailData.receivalVO">{{ detailData.receivalVO.endDate }}</span>
										<span v-else>-</span>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="应收账款申请日期"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<span v-if="detailData.receivalVO">{{ detailData.receivalVO.requestTime }}</span>
										<span v-else>{{ moment().format('YYYY-MM-DD HH:mm:ss') }}</span>
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item
										label="数据来源"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										{{ '资产管理' }}
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item
										label="状态"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 15 }"
									>
										<span v-if="detailData.receivalVO">{{
											filterCodeByValueName(detailData.receivalVO.status, 'receivableStatusDict')
										}}</span>
										<span v-else>待提交</span>
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</a-form>
				</div>
			</div>
			<div
				class="s-card-content"
				id="scroll-content"
			>
				<a-row :gutter="40">
					<a-col span="4">
						<div class="s-card-title dj-info">
							单据信息
							<a-switch
								style="margin-left: 15%"
								v-model="toolTipVisible"
								size="small"
								@change="changeToolTipVisible"
							/>
						</div>
						<div
							class="tabs-bar"
							:class="{ 'hidden-text': !toolTipVisible }"
						>
							<div @click="tabChange(0)">
								<div class="tabs-text">
									<p :class="activeIndex == 0 ? 'blue' : ''">合同</p>
									<div class="contract-item">
										下游合同信息（双签）
										<div class="contract-subitem">
											<span>*</span>
											下游合同
											<a-tooltip>
												<template slot="title"> 下游合同为双签，核心企业银行账户需为平安银行 </template>
												<a-icon type="question-circle" />
											</a-tooltip>
										</div>
										<div class="contract-subitem">下游补充协议</div>
									</div>
								</div>
							</div>
							<div @click="tabChange(1)">
								<div class="tabs-text">
									<p :class="activeIndex == 1 ? 'blue' : ''">运输凭证</p>
									<template v-if="transType == 'AUTOMOBILE' || transType == ''">
										<div>
											<span>*</span>
											汽运-运输凭证
										</div>
									</template>
									<template v-if="transType == 'TRAIN' || transType == ''">
										<div>
											<span>*</span>
											火运-大票
										</div>
										<div>
											<span>*</span>
											火运-车号表
										</div>
										<div>火运-其他凭证</div>
									</template>
									<template v-if="transType == 'SHIP' || transType == ''">
										<div>
											<span>*</span>
											船运-运输凭证
										</div>
										<div>船运-港口确认凭证</div>
										<div>船运-其他凭证</div>
									</template>
								</div>
							</div>
							<div @click="tabChange(2)">
								<div class="tabs-text">
									<p :class="activeIndex == 2 ? 'blue' : ''">数质量凭证</p>
									<template v-if="transType == 'AUTOMOBILE' || transType == ''">
										<div>
											<span>*</span>
											汽运-磅单
										</div>
										<div>
											<span>*</span>
											汽运-磅单明细
										</div>
										<div>
											<span>*</span>
											汽运-化验凭证
										</div>
										<div>汽运-其他凭证</div>
									</template>
									<template v-if="transType == 'TRAIN' || transType == ''">
										<div>
											<span>*</span>
											火运-称重凭证
										</div>
										<div>
											<span>*</span>
											火运-化验凭证
										</div>
										<div>火运-其他凭证</div>
									</template>
									<template v-if="transType == 'SHIP' || transType == ''">
										<div>
											<span>*</span>
											船运-称重凭证
										</div>
										<div>
											<span>*</span>
											船运-化验凭证
										</div>
										<div>船运-其他凭证</div>
									</template>
								</div>
							</div>
							<div @click="tabChange(3)">
								<div class="tabs-text">
									<p :class="activeIndex == 3 ? 'blue' : ''">货转凭证</p>
									<div v-if="transType == 'AUTOMOBILE' || transType == ''">
										<span>*</span>
										汽运-货转凭证
									</div>
									<div v-if="transType == 'TRAIN' || transType == ''">
										<span>*</span>
										火运-货转凭证
									</div>
									<div v-if="transType == 'SHIP' || transType == ''">
										<span>*</span>
										船运-货转凭证
									</div>
								</div>
							</div>
							<div @click="tabChange(4)">
								<div class="tabs-text">
									<p :class="activeIndex == 4 ? 'blue' : ''">核算表</p>
									<div>
										<span>*</span>
										核算表（Excel表格）
									</div>
									<div>
										<span>*</span>
										核算表（截图）
									</div>
									<div>
										<span>*</span>
										核算表（盖章版PDF）
										<a-tooltip>
											<template slot="title"> 系统生成 </template>
											<a-icon type="question-circle" />
										</a-tooltip>
									</div>
								</div>
							</div>
							<div
								@click="tabChange(6)"
								v-if="baseForm.getFieldValue('type') !== 'PROOF'"
							>
								<div class="tabs-text">
									<p :class="activeIndex == 6 ? 'blue' : ''">发票</p>
									<div>
										<span>*</span>
										下游发票
									</div>
								</div>
							</div>
							<div @click="tabChange(7)">
								<div class="tabs-text">
									<p :class="activeIndex == 7 ? 'blue' : ''">其他材料</p>
									<div v-if="transType == 'TRAIN' || transType == ''">代发证明（火运）</div>
									<div v-if="transType == 'TRAIN' || transType == ''">委托结算函（火运）</div>
									<div>上游其他材料</div>
									<div>下游其他材料</div>
								</div>
							</div>
						</div>
					</a-col>
					<!-- 右侧数据展示模块 -->
					<a-col
						span="20"
						v-if="baseForm.getFieldValue('poolReuse') == 0"
					>
						<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
							<!-- 合同 -->
							<contract
								v-show="activeIndex == 0"
								:editFlag="true"
								:contractEdit="Boolean($route.query.id)"
								:showEditorRadio="Boolean($route.query.id)"
								:contractInfo="detailData.manualTerminalContract || {}"
								ref="contract"
								@refreshmanualTerminalContract="refreshmanualTerminalContract"
							></contract>
							<!-- 运输凭证 -->
							<transport-document
								v-show="activeIndex == 1"
								:editFlag="true"
								:deliverInfo="detailData.manualDeliver"
								:receivalVO="detailData.receivalVO"
								:contractInfo="detailData.contractInfo"
								@changeTransType="changeTransType"
								ref="transport"
							></transport-document>
							<!-- 数质量凭证 -->
							<quality-document
								v-show="activeIndex == 2"
								:editFlag="true"
								:recvInfo="detailData.manualReceive"
								:contractInfo="detailData.contractInfo"
								ref="quality"
								:receivalVO="detailData.receivalVO"
							></quality-document>
							<!-- 货转凭证 -->
							<goods-transfer-document
								v-show="activeIndex == 3"
								:editFlag="true"
								:goodTransferInfo="detailData.manualTransfer"
								:contractInfo="detailData.contractInfo"
								ref="transfer"
								:deliverInfo="detailData.deliverInfo"
							></goods-transfer-document>
							<!-- 核算表 -->
							<accounts-table
								v-show="activeIndex == 4"
								:isPool="true"
								:editFlag="true"
								:accountInfo="detailData.manualAccount"
								ref="accounts"
							></accounts-table>
							<!-- 发票 -->
							<invoice
								@saveAsset="saveAsset"
								:isPool="true"
								v-if="activeIndex == 6"
								:editFlag="true"
								:invoiceInfo="detailData.manualInvoice"
								:contractInfo="detailData.manualTerminalContract"
								:activeIndex="activeIndex"
								:selectFinancedInvoice="Boolean(selectFinancedInvoice)"
							></invoice>
							<!-- 其他材料 -->
							<other-files
								v-show="activeIndex == 7"
								:editFlag="true"
								:otherInfo="detailData.manualOther"
								:receivalVO="detailData.receivalVO"
								ref="other"
							></other-files>
						</div>
					</a-col>
					<a-col
						span="20"
						v-if="baseForm.getFieldValue('poolReuse') == 1"
					>
						<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
							<!-- 合同 -->
							<contractpool
								v-show="activeIndex == 0"
								:contractEdit="Boolean($route.query.id)"
								:showEditorRadio="Boolean($route.query.id)"
								:editFlag="true"
								:contractInfo="detailData.poolContract"
								:deliverInfo="detailData.deliverInfo"
								ref="contract"
							></contractpool>
							<!-- 运输凭证 -->
							<transport-documentpool
								v-show="activeIndex == 1"
								:editFlag="true"
								:deliverInfo="detailData.deliverInfo"
								ref="transport"
								@changeDetailData="changeDetailData"
								:receivalVO="detailData.receivalVO"
							></transport-documentpool>
							<!-- 数质量凭证 -->
							<quality-documentpool
								v-show="activeIndex == 2"
								:editFlag="true"
								:recvInfo="detailData.recvInfo"
								ref="quality"
								:receivalVO="detailData.receivalVO"
							></quality-documentpool>
							<!-- 货转凭证 -->
							<goods-transfer-documentpool
								v-show="activeIndex == 3"
								:editFlag="true"
								:goodTransferInfo="detailData.goodTransferInfo"
								ref="transfer"
								:deliverInfo="detailData.deliverInfo"
							></goods-transfer-documentpool>
							<!-- 核算表 -->
							<accounts-tablepool
								v-show="activeIndex == 4"
								:editFlag="true"
								:accountInfo="detailData.accountInfo"
								ref="accounts"
							></accounts-tablepool>
							<!-- 发票 -->
							<invoicepool
								v-show="activeIndex == 6"
								:editFlag="true"
								:invoiceInfo="detailData.invoiceInfo"
								:activeIndex="activeIndex"
								:selectFinancedInvoice="Boolean(selectFinancedInvoice)"
								ref="invo"
							></invoicepool>
							<!-- 其他材料 -->
							<other-filespool
								v-show="activeIndex == 7"
								:editFlag="true"
								:otherInfo="detailData.otherInfo"
								:receivalVO="detailData.receivalVO"
								ref="other"
							></other-filespool>
						</div>
					</a-col>
				</a-row>
			</div>
			<div class="btn-box">
				<div class="btn-wrap">
					<FinancingLiu
						ref="FinancingLiu"
						v-if="isEdit"
						bizType="ASSET_RECEIVABLE"
						:data="auditChainAndOperator"
					/>
					<FinancingLiu
						ref="FinancingLiu"
						v-else
						bizType="ASSET_RECEIVABLE"
					/>
					<a-button
						@click="$router.push('/center/assets/pool/manage')"
						type="primary"
						ghost
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="getSubmitData('save')"
						>保存</a-button
					>
					<a-button
						type="primary"
						@click="getSubmitData('submit')"
						>提交</a-button
					>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
import {
	API_GetAccountsPoolDetail,
	API_EditAccountsPoolAssets,
	API_asset_getManualBankProduct,
	API_assetmanual_getManualBuyer,
	API_assetmanual_getEndDate
} from '@/v2/center/assets/api/index.js';
// manual
import Contract from '@/v2/center/assets/components/manual/contract.vue';
import TransportDocument from '@/v2/center/assets/components/manual/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/manual/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/manual/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/manual/AccountsTable.vue';
import Invoice from '@/v2/center/assets/components/manual/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/manual/OtherFiles.vue';
// pool
import Contractpool from '@/v2/center/assets/components/pool/contract.vue';
import TransportDocumentpool from '@/v2/center/assets/components/pool/TransportDocument.vue';
import QualityDocumentpool from '@/v2/center/assets/components/pool/QualityDocument.vue';
import GoodsTransferDocumentpool from '@/v2/center/assets/components/pool/GoodsTransferDocument.vue';
import AccountsTablepool from '@/v2/center/assets/components/pool/AccountsTable.vue';
import Invoicepool from '@/v2/center/assets/components/pool/Invoice.vue';
import OtherFilespool from '@/v2/center/assets/components/pool/OtherFiles.vue';
import { mapMutations, mapGetters } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';
import { getPopupContainer } from 'untils/factory';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			moment,
			baseForm: this.$form.createForm(this),
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			numberReg: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
			bankList: [{ paymentType: 1, name: 'xxx', bankName: 'bankName' }],
			bankName: '',
			selectFinancedInvoice: false, // 判断发票是否可以选择已关联发票
			endDate: '',
			buyerNameList: [{ companyName: 'companyName', uscc: '123' }],
			detailData: {}, // 详情数据
			isEdit: false,
			auditChainAndOperator: null,
			strMsg: '', // 提交时发票状态错误提示信息内容
			visible: false, // 提交时发票状态错误提示信息弹窗
			getPopupContainer,
			toolTipVisible: false, // 开关
			toolTipVisible1: false, //是否第一次进入这个页面，第一次显示文字提示，以后不展示 存入cookie
			transType: ''
		};
	},
	components: {
		Contract,
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		Invoice,
		OtherFiles,
		Contractpool,
		TransportDocumentpool,
		QualityDocumentpool,
		GoodsTransferDocumentpool,
		AccountsTablepool,
		Invoicepool,
		OtherFilespool,
		FinancingLiu,
		Breadcrumb
	},
	provide() {
		return {
			orderNoParent: this.orderNo
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('business', {
			VUEX_POOL_ASSET_OBJ: 'VUEX_POOL_ASSET_OBJ'
		}),
		...mapGetters('business', {
			VUEX_MANUAL_ASSET_OBJ: 'VUEX_MANUAL_ASSET_OBJ'
		}),
		// 获取对应合同的订单编号，发票中绑定对应发票时使用
		orderNo() {
			let parentOrderNo = this.VUEX_POOL_ASSET_OBJ.parentOrderNo;
			let orderNo = parentOrderNo || '';
			return () => orderNo;
		}
	},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		this.isEdit = this.$route.query.id ? true : false;
		this.VUEX_SET_MANUAL_ASSET_OBJ({
			disableCopy: false
		});
		this.VUEX_SET_POOL_ASSET_OBJ({
			disableCopy: false,
			buyerName: null,
			buyerUscc: null
		});

		if (this.isEdit) {
			API_GetAccountsPoolDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.auditChainAndOperator = res.data.auditChainAndOperator;
					this.transType = this.detailData?.manualDeliver?.transType || this.detailData?.deliverInfo?.deliverList[0].transferType;

					this.dealEditData();
				}
			});
		}

		API_asset_getManualBankProduct({ financingType: 'POOL_FACTORING_LOANS' }).then(res => {
			this.bankList = res.data || [];
		});
		API_assetmanual_getManualBuyer({ financingType: 'POOL_FACTORING_LOANS' }).then(res => {
			this.buyerNameList = res.data || [];
		});

		if (!Cookies.get('assets-tooltip-1')) {
			this.toolTipVisible = true;
			this.$nextTick(() => {
				this.toolTipVisible1 = true;
			});
		} else {
			this.toolTipVisible1 = false;
		}
		this.toolTipVisible = Cookies.get('assets-tooltip') === 'false' ? false : true;
	},
	methods: {
		...mapMutations({
			VUEX_SET_POOL_ASSET_OBJ: 'business/VUEX_SET_POOL_ASSET_OBJ'
		}),
		...mapMutations({
			VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
		}),
		toolTipAleady() {
			Cookies.set('assets-tooltip-1', 1, { expires: 99999 });
			this.toolTipVisible1 = false;
		},
		changeTransType(v) {
			this.transType = v;
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		dealEditData() {
			this.baseForm.setFieldsValue({
				...this.detailData.receivalVO,
				beginDate: moment(this.detailData.receivalVO.beginDate)
			});
			setTimeout(() => {
				this.changeBankName(this.detailData.receivalVO.paymentType);
				this.changeBuyname(this.detailData.receivalVO.buyerUscc);
			}, 1600);
		},
		changeDetailData(v) {
			this.detailData.deliverInfo = v.deliverInfo;
			this.detailData.goodTransferInfo = v.goodTransferInfo;
			this.detailData.recvInfo = v.recvInfo;
			this.$forceUpdate();
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
			document.querySelector('#scroll-content')?.scrollIntoView();
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		refreshmanualTerminalContract(data) {
			this.baseForm.setFieldsValue({
				buyerUscc: data.buyerBizNo
			});
			console.log(data);
			this.changeBuyname(data.buyerBizNo);
			this.detailData.manualTerminalContract = data;
		},
		saveAsset() {
			this.getSubmitData('save', 'nojump');
		},
		validplanFinancingAmount(rule, value, callback) {
			let amount = this.baseForm.getFieldValue('amount');
			if (amount && Number(value) > Number(amount)) {
				callback(true);
			} else {
				callback();
			}
		},
		judgeColor() {},
		changeFu() {
			this.detailData = {};
		},

		async getSubmitData(type, jump) {
			let auditChainAndOperator = null;
			try {
				auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck();
			} catch (e) {
				auditChainAndOperator = e;
			}

			if (!auditChainAndOperator) {
				return;
			}

			this.baseForm.validateFields((error, values) => {
				if (!error) {
					let manualAssetReceivable = {
						amount: values.amount,
						buyerName: this.buyerName,
						buyerUscc: values.buyerUscc,
						buyerBizNo: values.buyerName,
						sellerBizNo: this.VUEX_ST_COMPANYSUER.companyUscc,
						sellerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
						sellerName: this.VUEX_ST_COMPANYSUER.companyName,
						bankUscc: this.bankUscc,
						bankName: this.bankName,
						industryType: values.industryType,
						paymentType: values.paymentType,
						planFinancingAmount: values.planFinancingAmount,
						type: values.type,
						beginDate: values.beginDate.format('YYYY-MM-DD'),
						endDate: this.endDate,
						reuseFlag: this.VUEX_MANUAL_ASSET_OBJ.disableCopy == true ? 1 : 0,
						poolReuse: values.poolReuse
					};
					if (this.isEdit) {
						manualAssetReceivable.id = this.$route.query.id;
					}

					this.$refs.contract.onSubmit(manualTerminalContract => {
						if (values.poolReuse == 1) {
							let manualDeliver = this.$refs.transport.onSubmit();

							let manualReceive = this.$refs.quality.onSubmit();

							let manualTransfer = this.$refs.transfer.onSubmit();

							let manualAccount = this.$refs.accounts.onSubmit();

							let manualOther = this.$refs.other.onSubmit();

							let manualInvoice = this.$refs.invo.onSubmit();

							if (manualReceive == false || manualDeliver == false || manualAccount == false) {
								return;
							}
							if (values.type == 'INVOICE' && !manualInvoice.keys) {
								this.$message.error('请上传发票');
								return;
							}
							let list = manualTerminalContract.list
								.concat(manualDeliver.attachList)
								.concat(manualTransfer.list)
								.concat(manualReceive.attachList)
								.concat(manualAccount.list)
								.concat(manualOther.list);

							let obj = {
								manualAssetReceivable,
								poolContract: {
									...(this.VUEX_POOL_ASSET_OBJ.poolContractDetail || {}),
									...manualTerminalContract,
									id: this.VUEX_POOL_ASSET_OBJ.poolContractDetail.id
								},
								manualDeliver,
								manualTransfer,
								manualReceive,
								manualOther,
								manualAccount,
								goodsInfo: manualDeliver.goodsInfo,
								invoiceIds: manualInvoice.keys,
								list,
								auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator
							};
							obj.downTerminalContractModify = manualTerminalContract.downTerminalContractModify;
							if (type == 'save') {
								obj.submitType = '1';
							} else {
								obj.submitType = '2';
							}
							this.doSubmit(obj, jump);
						} else {
							this.$refs.transport.onSubmit(manualDeliver => {
								let manualReceive = this.$refs.quality.onSubmit();

								let manualTransfer = this.$refs.transfer.onSubmit();

								let manualAccount = this.$refs.accounts.onSubmit();

								let manualOther = this.$refs.other.onSubmit();

								if (manualReceive == false || manualTransfer == false || manualAccount == false) {
									return;
								}

								let obj = {
									manualAssetReceivable,
									manualTerminalContract,
									manualDeliver,
									manualTransfer,
									manualReceive,
									manualOther,
									manualAccount,
									auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator
								};
								obj.downTerminalContractModify = obj.manualTerminalContract.downTerminalContractModify;
								if (type == 'save') {
									obj.submitType = '1';
								} else {
									obj.submitType = '2';
								}

								this.doSubmit(obj, jump);
							});
						}
					});
				} else {
					this.$message.error('基本信息内容填写有误');
				}
			});
		},

		getEndDate() {
			let beginDate = this.baseForm.getFieldValue('beginDate')
				? this.baseForm.getFieldValue('beginDate').format('YYYY-MM-DD')
				: null;
			let paymentType = _.find(this.bankList, { bankName: this.bankName })
				? _.find(this.bankList, { bankName: this.bankName }).paymentType
				: null;
			if (paymentType && beginDate) {
				API_assetmanual_getEndDate({ paymentType, beginDate }).then(res => {
					this.endDate = res.data || '';
				});
			}
		},
		changeBankName(v) {
			this.bankName = _.find(this.bankList, { paymentType: v }).bankName;
			this.bankUscc = _.find(this.bankList, { paymentType: v }).bankUscc;
			this.selectFinancedInvoice = _.find(this.bankList, { paymentType: v }).selectFinancedInvoice;
			this.getEndDate();
		},
		changeBeginDate() {
			setTimeout(() => {
				this.getEndDate();
			});
		},
		doSubmit(obj, jump) {
			if (obj) {
				API_EditAccountsPoolAssets(obj).then(res => {
					if (res.success) {
						this.$message.success('操作成功');
						if (jump == 'nojump') {
							this.$router.replace('/center/assets/pool/manage/Edit?isEdit=1&activeIndex=6&id=' + res.data);
							window.location.reload();
							return;
						}
						this.$router.push('/center/assets/pool/manage');
					}
				});
			}
		},

		changeBuyname(v) {
			this.buyerName = _.find(this.buyerNameList, { uscc: v }).companyName;

			this.VUEX_SET_POOL_ASSET_OBJ({
				buyerName: this.buyerName,
				buyerUscc: v
			});
			this.VUEX_SET_MANUAL_ASSET_OBJ({
				buyerName: this.buyerName,
				buyerUscc: v
			});
		},
		changeToolTipVisible(e) {
			Cookies.set('assets-tooltip', e, { expires: 99999 });
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep .ant-form-item-label {
	text-align: left;

	label {
		color: #6b6f76;
	}
}

.top-box {
	box-shadow: 0 2px 10px 0 #dddfe4;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;

	.s-card-title {
		margin-left: 20px;
		margin-top: 20px;
		font-family: PingFangSC-Medium;
		color: #141517;
		line-height: 24px;
		justify-content: space-between;
		padding-right: 20px;

		a {
			cursor: pointer;
		}
	}

	.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
		color: #6b6f76;
	}

	.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}

.bottom-box {
	.s-card-content .ant-row .ant-col:first-child {
		color: #6b6f76;
	}

	.s-card-content .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}

.s-card-content {
	padding: 20px 0 0 0;
	border-radius: 8px;
	background: #fff;

	.row .ant-col {
		margin-top: 8px;
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}

	.ant-row .ant-col {
		margin-bottom: 8px;
		margin-top: 8px;
	}

	h2 {
		font-style: normal;
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #141517;
		line-height: 22px;
		margin-bottom: 16px;
	}
}

.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
.tabs-bar {
	position: relative;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	> div:last-child {
		em {
			display: none;
		}
	}
}
.tabs-bar i {
	color: #8495aa;
	margin-left: 10px;
}
.tabs-bar > div {
	float: left;
	width: 100%;
}
.tabs-bar .tabs-icon {
	margin-right: 10px;
	em {
		display: block;
		width: 1px;
		height: 36px;
		background: @primary-color;
		border-radius: 1.5px 1.5px 0 0;
		margin: 5px 0 5px 6px;
	}
	img {
		width: 24px;
		height: 24px;
		margin-left: -5px;
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		color: #383a3f;
		line-height: 22px;
		width: 100%;
		padding-bottom: 9px;
		margin-bottom: 11px;
		position: relative;
		font-weight: 400;
	}
	.blue {
		border-bottom: 2px solid @primary-color;
		font-weight: bold;
	}
	div {
		line-height: 22px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		padding-left: 22px;
		margin-bottom: 22px;
		position: relative;
	}
	.contract-item {
		line-height: 22px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		color: #77889d;
		padding-left: 0;
		margin-top: 16px;
		margin-bottom: 0;
		.contract-subitem {
			margin-bottom: 16px;
			&:nth-child(1) {
				margin-top: 16px;
			}
		}
	}
	span {
		color: #ea5530;
		position: absolute;
		left: 10px;
	}
}

.red {
	color: #f24e4d !important;
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.contentBox {
	font-family: PingFangSC-Regular;
}

.green {
	background: #00ae9d !important;
}

.orange {
	background: #ff9726 !important;
}

.red_bg {
	background: #f24e4d !important;
}

.btn-box {
	background: #ffffff !important;
	border-radius: 8px;
	padding: 20px 0;
	margin-top: 20px;
}

.btn-box .btn-wrap {
	margin: 0;
}

.dj-info {
	color: #141517;
	margin-left: 0;
	font-weight: bold;
	margin-top: 0;
	position: relative;
	i {
		position: absolute;
		left: 140px;
		color: #8495aa;
		font-size: 16px;
		top: 4px;
		cursor: pointer;
	}
}
.hidden-text .tabs-text {
	div {
		display: none !important;
	}
}
/deep/ .ant-popover-inner-content {
	background: #4089f8;
	width: 280px;
	border-radius: 6px;
	height: 146px;
	padding: 17px 20px;
	color: #ffffff;
	.pop-title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 18px;
		line-height: 18px;
		margin-bottom: 14px;
		img {
			width: 18px;
			height: 18px;
			margin-left: 4px;
		}
	}
	.pop-desc {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
	}
	.button {
		float: right;
		margin-top: 7px;
		width: 88px;
		height: 32px;
		background: #ffffff;
		border-radius: 4px;
		color: #4089f8;
		cursor: pointer;
		text-align: center;
		line-height: 32px;
	}
}
/deep/ .ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
	border-right-color: #4089f8;
	border-bottom-color: #4089f8;
}
</style>
