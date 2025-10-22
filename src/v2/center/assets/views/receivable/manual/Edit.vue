<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					v-if="isEdit"
					>编辑应收账款</span
				>
				<span
					slot="title"
					class="slTitle"
					v-else
					>新增应收账款</span
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
			<div
				class="slTitleAssis"
				style="margin-top: 20px"
			>
				基本信息
			</div>
			<a-form :form="baseForm">
				<a-row>
					<a-col :span="8">
						<a-row>
							<a-form-item label="卖方名称">
								<a-input
									style="width: 364px"
									disabled
									v-model="VUEX_ST_COMPANYSUER.companyName"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="买方名称">
								<a-select
									showSearch
									style="width: 364px"
									:disabled="VUEX_POOL_ASSET_OBJ.disableCopy || isEdit || isSelectContract"
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
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="资金类型">
								<a-select
									showSearch
									style="width: 364px"
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
					</a-col>
					<a-col :span="8">
						<a-row>
							<a-form-item label="应收账款类型">
								<a-radio-group
									@change="changeType"
									v-decorator="[
										`type`,
										{
											initialValue: 'INVOICE',
											rules: [{ required: true, message: `应收账款类型必填` }]
										}
									]"
								>
									<a-radio value="PROOF">凭证结算</a-radio>
									<a-radio value="INVOICE">发票结算</a-radio>
								</a-radio-group>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="应收账款金额（元）">
								<a-input
									style="width: 364px"
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
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="拟融资金额（元）"
								style="width: 364px"
							>
								<a-input
									style="width: 300px"
									placeholder="请输入拟融资金额（元）"
									v-decorator="[
										`planFinancingAmount`,
										{
											rules: [
												{ required: true, message: `拟融资金额必填` },
												{ pattern: numberReg, message: '请输入数字，最多两位小数' },
												{
													validator: validplanFinancingAmount,
													trigger: 'change',
													message: `拟融资金额大于应收账款金额`
												}
											]
										}
									]"
								>
								</a-input>
								<a
									href="javascript:;"
									style="margin-left: 10px"
									@click="calculate"
									>测算</a
								>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="行业">
								<a-select
									disabled
									placeholder="请选择行业"
									style="width: 364px"
									v-decorator="[`industryType`, { initialValue: 'COAL', rules: [{ required: true, message: `行业必填` }] }]"
								>
									<a-select-option value="COAL">煤炭</a-select-option>
									<a-select-option value="STEEL">钢材</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="应收账款起始日期">
								<a-date-picker
									style="width: 364px"
									@change="changeBeginDate"
									:disabled-date="disabledDate"
									value-format="YYYY-MM-DD"
									format="YYYY-MM-DD"
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
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="应收账款到期日期">
								<a-date-picker
									style="width: 364px"
									:disabled="isEndDateType == 'GENERATED'"
									value-format="YYYY-MM-DD"
									format="YYYY-MM-DD"
									v-decorator="[
										`endDate`,
										{
											rules: [{ required: true, message: `应收账款到期日期必填` }],
											validateTrigger: 'change'
										}
									]"
								></a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item
								label="是否复用已有下游合同"
								style="width: 364px"
							>
								<a-radio-group
									@change="changePoolReuse"
									v-decorator="[
										`poolReuse`,
										{
											initialValue: 0,
											rules: [{ required: true, message: `应收账款类型必填` }]
										}
									]"
									:disabled="isEdit || !!contractInfo.id"
								>
									<a-radio :value="0">否</a-radio>
									<a-radio :value="1">是</a-radio>
								</a-radio-group>
								<a-button
									:disabled="isEdit || !!this.contractInfo.id"
									v-if="baseForm.getFieldValue('poolReuse') == 1"
									type="primary"
									@click="openContract"
									>选择合同</a-button
								>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
			<div
				class="s-card-content"
				style="padding-bottom: 30px"
				id="scroll-content"
			>
				<a-row :gutter="40">
					<a-col span="4">
						<div class="tabs-bar">
							<div
								@click="tabChange(0)"
								:class="activeIndex == 0 ? 'blue' : ''"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/contract.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 0 ? 'blue' : ''">合同</p>
								</div>
							</div>
							<div
								:class="activeIndex == 1 ? 'blue' : ''"
								@click="tabChange(1)"
								v-if="baseForm.getFieldValue('paymentType') !== 'receivable-shanmei-down'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/delivery.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 1 ? 'blue' : ''">运输凭证</p>
								</div>
							</div>
							<div
								:class="activeIndex == 2 ? 'blue' : ''"
								@click="tabChange(2)"
								v-if="baseForm.getFieldValue('paymentType') !== 'receivable-shanmei-down'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/test.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 2 ? 'blue' : ''">数质量凭证</p>
								</div>
							</div>
							<div
								:class="activeIndex == 3 ? 'blue' : ''"
								@click="tabChange(3)"
								v-if="
									['product-huaneng-downReceivable', 'receivable-shanmei-down'].includes(baseForm.getFieldValue('paymentType'))
								"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/goodsTransfer.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 3 ? 'blue' : ''">货转凭证</p>
								</div>
							</div>
							<div
								:class="activeIndex == 4 ? 'blue' : ''"
								@click="tabChange(4)"
								v-if="baseForm.getFieldValue('paymentType') !== 'receivable-shanmei-down'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/accounts.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 4 ? 'blue' : ''">核算表</p>
								</div>
							</div>
							<div
								:class="activeIndex == 8 ? 'blue' : ''"
								@click="tabChange(8)"
								v-if="
									['product-huaneng-downReceivable', 'receivable-shanmei-down'].includes(baseForm.getFieldValue('paymentType'))
								"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/confirm.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 8 ? 'blue' : ''">结算单</p>
								</div>
							</div>
							<div
								:class="activeIndex == 6 ? 'blue' : ''"
								@click="tabChange(6)"
								v-if="baseForm.getFieldValue('type') == 'INVOICE'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/invoice.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 6 ? 'blue' : ''">发票</p>
								</div>
							</div>
							<div
								:class="activeIndex == 7 ? 'blue' : ''"
								@click="tabChange(7)"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/file.png"
										alt=""
									/>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 7 ? 'blue' : ''">其他材料</p>
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
							<ContractInfo
								ref="contractInfo"
								v-show="activeIndex == 0"
								:poolReuse="0"
								:paymentType="baseForm.getFieldValue('paymentType')"
								:buyerUscc="baseForm.getFieldValue('buyerUscc')"
								:buyerName="buyerName"
							>
							</ContractInfo>
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
								v-show="activeIndex == 3 && ['product-huaneng-downReceivable'].includes(baseForm.getFieldValue('paymentType'))"
								:editFlag="true"
								:goodTransferInfo="detailData.manualTransfer"
								:contractInfo="detailData.contractInfo"
								ref="transfer"
								:deliverInfo="detailData.deliverInfo"
							></goods-transfer-document>
							<TransferInfo
								ref="newTransfer"
								v-show="activeIndex == 3 && ['receivable-shanmei-down'].includes(baseForm.getFieldValue('paymentType'))"
							></TransferInfo>
							<!-- 核算表 -->
							<accounts-table
								v-show="activeIndex == 4"
								:isPool="true"
								:editFlag="true"
								:accountInfo="detailData.manualAccount"
								ref="accounts"
							></accounts-table>
							<!-- 发票 -->
							<InvoiceInfo
								@saveAsset="saveAsset"
								:isPool="true"
								:paymentType="baseForm.getFieldValue('paymentType')"
								:type="baseForm.getFieldValue('type')"
								:buyerName="buyerName"
								v-show="activeIndex == 6"
								:editFlag="true"
								:invoiceInfo="detailData.manualInvoice"
								:contractInfo="contractInfo"
								:activeIndex="activeIndex"
								:endDate="baseForm.getFieldValue('endDate')"
								:amount="baseForm.getFieldValue('amount')"
								:selectFinancedInvoice="Boolean(selectFinancedInvoice)"
								ref="invo"
							></InvoiceInfo>
							<!-- 其他材料 -->
							<other-files
								v-show="activeIndex == 7"
								:editFlag="true"
								:otherInfo="detailData.manualOther"
								:paymentType="baseForm.getFieldValue('paymentType')"
								:receivalVO="detailData.receivalVO"
								ref="other"
							></other-files>
							<!-- 结算单 -->
							<SettleInfo
								:editFlag="true"
								:contractInfo="contractInfo"
								:settlesInfo="detailData.manualStatement"
								:receivalVO="detailData.receivalVO"
								v-show="activeIndex == 8"
								ref="settle"
							></SettleInfo>
						</div>
					</a-col>
					<a-col
						span="20"
						v-else
					>
						<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
							<!-- 合同 -->
							<ContractInfo
								ref="contractInfo"
								v-show="activeIndex == 0"
								:poolReuse="1"
								:paymentType="baseForm.getFieldValue('paymentType')"
								:buyerUscc="baseForm.getFieldValue('buyerUscc')"
								:buyerName="buyerName"
							></ContractInfo>
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
								v-show="activeIndex == 3 && ['product-huaneng-downReceivable'].includes(baseForm.getFieldValue('paymentType'))"
								:editFlag="true"
								:goodTransferInfo="detailData.goodTransferInfo"
								ref="transfer"
								:deliverInfo="detailData.deliverInfo"
							></goods-transfer-documentpool>
							<TransferInfo
								ref="newTransfer"
								v-show="activeIndex == 3 && ['receivable-shanmei-down'].includes(baseForm.getFieldValue('paymentType'))"
							></TransferInfo>
							<!-- 核算表 -->
							<accounts-tablepool
								v-show="activeIndex == 4"
								:editFlag="true"
								:accountInfo="detailData.accountInfo"
								ref="accounts"
							></accounts-tablepool>
							<!-- 发票 -->
							<InvoiceInfo
								v-show="activeIndex == 6"
								:editFlag="true"
								:paymentType="baseForm.getFieldValue('paymentType')"
								:type="baseForm.getFieldValue('type')"
								:endDate="baseForm.getFieldValue('endDate')"
								:contractInfo="contractInfo"
								:invoiceInfo="detailData.invoiceInfo"
								:activeIndex="activeIndex"
								:amount="baseForm.getFieldValue('amount')"
								:buyerName="buyerName"
								:selectFinancedInvoice="Boolean(selectFinancedInvoice)"
								ref="invo"
							></InvoiceInfo>
							<!-- 其他材料 -->
							<other-filespool
								v-show="activeIndex == 7"
								:editFlag="true"
								:otherInfo="detailData.otherInfo"
								:paymentType="baseForm.getFieldValue('paymentType')"
								:receivalVO="detailData.receivalVO"
								ref="other"
							></other-filespool>
							<!-- 结算单 -->
							<SettleInfo
								:editFlag="true"
								:contractInfo="contractInfo"
								:settlesInfo="detailData.manualStatement"
								:receivalVO="detailData.receivalVO"
								v-show="activeIndex == 8"
								ref="settle"
							></SettleInfo>
						</div>
					</a-col>
				</a-row>
			</div>
			<div class="btn-box">
				<div class="btn-wrap">
					<template
						v-if="!['receivable-shanmei-down', 'receivable-wanwuyilian-down'].includes(baseForm.getFieldValue('paymentType'))"
					>
						<FinancingLiu
							ref="FinancingLiu"
							v-if="isEdit"
							bizType="ASSET_RECEIVABLE"
							:data="auditChainAndOperator"
							:disabled="!(detailData.receivalVO && detailData.receivalVO.status == 'TO_BE_VERIFY')"
						/>
						<FinancingLiu
							ref="FinancingLiu"
							v-else
							bizType="ASSET_RECEIVABLE"
						/>
					</template>
					<a-button
						@click="$router.push('/center/assets/receivable/list')"
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
		<modalMain
			ref="modalMain"
			title="提交确认"
			:width="500"
			@verify="doSubmitNext"
		>
			<div class="main">
				<div class="title">请确认以下信息是否有误:</div>
				<div class="mainTable">
					<div
						class="item"
						v-if="needPushOaShow"
					>
						<span class="label required">是否推送OA：</span>
						<a-radio-group
							name="radioGroup"
							v-model="needPushOa"
						>
							<a-radio :value="true"> 推送 </a-radio>
							<a-radio :value="false"> 不推送 </a-radio>
						</a-radio-group>
					</div>
					<div class="item">
						<span class="label">买方企业：</span>
						<span>{{ manualAssetReceivable.buyerName }}</span>
					</div>
					<div class="item">
						<span class="label"> 资金类型：</span>
						<span>{{ paymentTypeText }}</span>
					</div>
					<div class="item">
						<span class="label"> 应收账款金额：</span>
						<span>
							{{ manualAssetReceivable.amount | formatMoney(4) }}（{{ convertCurrency(manualAssetReceivable.amount) }}）
						</span>
					</div>
					<div class="item">
						<span class="label"> 拟融资金额：</span>
						<span style="color: red">
							{{ manualAssetReceivable.planFinancingAmount | formatMoney }}（{{
								convertCurrency(manualAssetReceivable.planFinancingAmount)
							}}）
						</span>
					</div>
					<div class="item">
						<span class="label"> 应收账款起止日期：</span>
						<span>{{ manualAssetReceivable.beginDate }}～{{ manualAssetReceivable.endDate }}</span>
					</div>
				</div>
			</div>
		</modalMain>
		<!-- 选择合同 -->
		<RelationContract
			ref="relationContract"
			@select="getSelectContract"
			:paymentType="baseForm.getFieldValue('paymentType')"
			:buyerUscc="baseForm.getFieldValue('buyerUscc')"
		></RelationContract>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
import {
	API_EditAccountsManualPayable,
	API_asset_getManualBankProduct,
	API_assetmanual_getManualBuyer,
	API_assetmanual_getEndDate,
	API_GetAccountsManualDetail,
	API_GetManualOrderDetail,
	getReceivableStatementList,
	API_COMPANplatformRiskAudit
} from '@/v2/center/assets/api/index.js';
import { API_COMPANYOACHECKPOOL } from '@/api/index.js';
// manual
import TransportDocument from '@/v2/center/assets/components/manual/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/manual/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/manual/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/manual/AccountsTable.vue';

import OtherFiles from '@/v2/center/assets/components/manual/OtherFiles.vue';

// wwyl

import TransportDocumentpool from '@/v2/center/assets/components/wwyl/TransportDocument.vue';
import QualityDocumentpool from '@/v2/center/assets/components/wwyl/QualityDocument.vue';
import GoodsTransferDocumentpool from '@/v2/center/assets/components/wwyl/GoodsTransferDocument.vue';
import AccountsTablepool from '@/v2/center/assets/components/wwyl/AccountsTable.vue';

import OtherFilespool from '@/v2/center/assets/components/wwyl/OtherFiles.vue';
import { mapMutations, mapGetters } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import modalMain from '@/v2/components/modalInfo/main';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { convertCurrency, deepCompare, getPopupContainer } from '@/v2/utils/factory.js';
import ContractInfo from '../components/ContractInfo.vue';
import SettleInfo from '../components/SettleInfo.vue';
import RelationContract from '../components/RelationContract.vue';
import TransferInfo from '../components/TransferInfo.vue';
import InvoiceInfo from '../components/InvoiceInfo.vue';

export default {
	data() {
		return {
			moment,
			baseForm: this.$form.createForm(this),
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			numberReg: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
			bankList: [],
			bankName: '',
			selectFinancedInvoice: false, // 判断发票是否可以选择已关联发票
			buyerNameList: [],
			detailData: {}, // 详情数据
			auditChainAndOperator: null,
			getPopupContainer,
			convertCurrency,
			deepCompare,
			transType: '',
			buyerName: '',
			// 合同信息
			contractInfo: {},
			// 当 合同选择完成以后 禁止再次选择合同
			isSelectContract: false,
			/** 判断应收账款到期日期是否可以编辑 */
			isEndDateType: '',
			isEdit: false,
			platformRiskAudit: true, // 判断是否需要平台风控审核
			needPushOa: true,
			oaflag: false,
			doSubmitObj: {}
		};
	},
	components: {
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		OtherFiles,
		TransportDocumentpool,
		QualityDocumentpool,
		GoodsTransferDocumentpool,
		AccountsTablepool,
		OtherFilespool,
		FinancingLiu,
		Breadcrumb,
		ContractInfo,
		SettleInfo,
		RelationContract,
		TransferInfo,
		InvoiceInfo,
		modalMain
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
		// 判断是否展示推送OA
		needPushOaShow() {
			// 只有华能云成判断
			let { paymentType } = this.manualAssetReceivable;
			if (paymentType === 'product-huaneng-downReceivable') {
				// 不需平台风控审核，且对接OA的情况下展示
				// 陕煤系企业无论后端配置什么，都跳过平台审核
				return (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) && this.oaflag;
			} else {
				return false;
			}
		},
		// 展示提交的信息
		manualAssetReceivable() {
			return this.doSubmitObj?.obj?.manualAssetReceivable || {};
		},
		// 展示当前选择资金类型
		paymentTypeText() {
			let { paymentType } = this.manualAssetReceivable;
			let item = this.bankList.find(el => el.paymentType == paymentType);
			return item?.name || '';
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.path == '/center/assets/receivable/list') {
				vm.contractInfo = {};
				vm.isSelectContract = false;
				vm.detailData = null;
				setTimeout(() => {
					vm.detailData = {};
					vm.init();
				}, 500);
			} else {
				vm.init();
			}
		});
	},
	async activated() {
		this.isEdit = !!this.$route.query.id;
		this.VUEX_SET_MANUAL_ASSET_OBJ({
			isFirst: true
		});
		this.getPaymentTypeList();
		this.getBuyList();
		// 兼容从结算单跳转回来
		if (this.activeIndex == 8) {
			this.tabChange(8);
		} else {
			this.tabChange(this.$route.query.activeIndex);
		}

		/** 判断当前是否是从合同编辑和新增 页面跳转过来的 */
		if (this.$route.query.contractId && !this.$route.query.id) {
			// 都是编辑线下销售合同
			const obj = {
				id: this.$route.query.contractId,
				contractType: this.$route.query.contractType || 'DOWN'
			};
			this.getSelectContract(obj);
		}
		this.$nextTick(() => {
			this.initBuyerName();

			if (this.$route.query.poolReuse) {
				if (this.baseForm.getFieldValue('poolReuse') != this.$route.query.poolReuse) {
					this.baseForm.setFieldsValue({ poolReuse: Number(this.$route.query.poolReuse) });
				}
			}
		});
	},
	methods: {
		...mapMutations({
			VUEX_SET_POOL_ASSET_OBJ: 'business/VUEX_SET_POOL_ASSET_OBJ'
		}),
		...mapMutations({
			VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
		}),
		// 初始化数据
		init() {
			if (this.$route.query.id) {
				this.getDetail();
			}
		},
		// 获取资金类型
		getPaymentTypeList() {
			API_asset_getManualBankProduct({ financingType: 'ACCOUNTS_RECEIVABLE_LOANS' }).then(res => {
				this.bankList = res.data || [];
			});
		},
		// 获取买方名称
		getBuyList() {
			API_assetmanual_getManualBuyer({ financingType: 'POOL_FACTORING_LOANS' }).then(res => {
				this.buyerNameList = res.data || [];
			});
		},
		// 获取详情
		async getDetail() {
			const res = await API_GetAccountsManualDetail({ id: this.$route.query.id });
			this.detailData = res.data || {};
			this.auditChainAndOperator = res.data.auditChainAndOperator;

			if (this.detailData?.manualDeliver) {
				this.transType = this.detailData?.manualDeliver?.transType;
				if (!this.transType && this.detailData?.deliverInfo) {
					const deliverInfo = this.detailData?.deliverInfo;
					const deliverList = deliverInfo.deliverList || [];
					const item = deliverList[0] || {};
					this.transType = item.transferType;
				}
			}
			this.dealEditData();
			const contractInfo = this.detailData.manualTerminalContract || this.detailData.poolContract || {};
			const obj = {
				id: contractInfo.id,
				contractType: contractInfo.contractType || 'DOWN',
				parentOrderNo: contractInfo.parentOrderNo || ''
			};
			this.getSelectContract(obj);
			this.getTransInfoList(this.detailData?.manualTransfer?.list);
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
				const item = _.find(this.bankList, { paymentType: this.detailData.receivalVO.paymentType }) || {};
				this.bankName = item.bankName;
				this.bankUscc = item.bankUscc;
				this.selectFinancedInvoice = item.selectFinancedInvoice;
				this.isEndDateType = item.endDateType;
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
			/** 如果当前 没有合同信息 不让切换 */
			if (index != 0 && !this.VUEX_POOL_ASSET_OBJ.id) {
				this.$message.error('请选择合同');
				return;
			}
			if (index == 8) {
				this.getSettleList();
			}
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		refreshmanualTerminalContract(data) {
			this.baseForm.setFieldsValue({
				buyerUscc: data.buyerBizNo
			});
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
						sellerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
						sellerName: this.VUEX_ST_COMPANYSUER.companyName,
						bankUscc: this.bankUscc,
						bankName: this.bankName,
						industryType: values.industryType,
						paymentType: values.paymentType,
						planFinancingAmount: values.planFinancingAmount,
						type: values.type,
						beginDate: moment(values.beginDate).format('YYYY-MM-DD'),
						endDate: moment(values.endDate).format('YYYY-MM-DD'),
						reuseFlag: this.VUEX_MANUAL_ASSET_OBJ.disableCopy == true ? 1 : 0,
						poolReuse: values.poolReuse,
						parentOrderNo: this.contractInfo.parentOrderNo
					};
					let flag = moment(values.endDate).isBefore(values.beginDate);
					if (flag) {
						this.$message.error('结束日期要大于等于起始日期');
						return;
					}
					/** 判断当前日期是否不能选择周末 */
					if (this.isEndDateType == 'SELECTED_WORKING') {
						if (moment(values.endDate).weekday() === 5 || moment(values.endDate).weekday() === 6) {
							this.$message.error('结束日期不能选择周末');
							return;
						}
					}
					// 比较日期大小
					if (this.isEdit) {
						manualAssetReceivable.id = this.$route.query.id;
					}
					if (!this.contractInfo.id) {
						this.$message.error('请选择合同');
						return;
					}

					// 华能云成 合同 运输 质量 货转 核算 结算单 发票 其他
					// 万物易链-下游应收 合同 运输 质量 核算 发票 其他
					// 善美保理 合同 货转 结算单 发票 其他

					let obj = {
						manualAssetReceivable,
						contractId: this.contractInfo.contractId || this.contractInfo.id,
						parentOrderNo: this.contractInfo.parentOrderNo,
						contractType: this.contractInfo.contractType,
						downTerminalContractModify: this.contractInfo.downTerminalContractModify,
						auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator
					};

					//  判断是否是复用合同
					if (values.poolReuse == 0) {
						// 华能云成
						if (values.paymentType == 'product-huaneng-downReceivable') {
							let manualDeliver, manualReceive, manualTransfer, manualAccount, statementIdList;
							// 运输
							this.$refs.transport.onSubmit(res => {
								manualDeliver = res;

								obj.goodsInfo = manualDeliver?.goodsInfo;
								obj.manualDeliver = manualDeliver;

								//  质量
								manualReceive = this.$refs.quality.onSubmit();

								obj.manualReceive = manualReceive;

								// 货转
								manualTransfer = this.$refs.transfer.onSubmit();

								obj.manualTransfer = manualTransfer;

								//  核算
								manualAccount = this.$refs.accounts.onSubmit();

								obj.manualAccount = manualAccount;
								//  结算单
								statementIdList = this.$refs.settle.onSubmit();
								obj.statementIdList = statementIdList;

								if (!manualDeliver || !manualReceive || !manualTransfer || !manualAccount || !statementIdList) {
									return;
								}

								// 发票
								let manualInvoice = this.$refs.invo.onSubmit();
								if (values.type == 'INVOICE' && !manualInvoice) {
									this.$message.error('请关联发票');
									return;
								}
								if (values.type == 'INVOICE') {
									obj.invoiceIds = manualInvoice.keys;
								}

								//  其他
								let manualOther = this.$refs.other.onSubmit();
								obj.manualOther = manualOther;
								let list = []
									.concat(manualDeliver.attachList || [])
									.concat(manualTransfer.list || [])
									.concat(manualReceive.attachList || manualReceive.list || [])
									.concat(manualAccount.list || [])
									.concat(manualOther.list || []);
								obj.list = list;
								if (type == 'save') {
									obj.submitType = '1';
								} else {
									obj.submitType = '2';
								}
								this.doSubmit(obj, jump);
							});
						}
						//  万物易链-下游应收
						if (values.paymentType == 'receivable-wanwuyilian-down') {
							let manualDeliver, manualReceive, manualAccount;
							// 运输
							this.$refs.transport.onSubmit(res => {
								manualDeliver = res;
								obj.manualDeliver = manualDeliver;
								obj.goodsInfo = manualDeliver?.goodsInfo || null;
								//  质量
								manualReceive = this.$refs.quality.onSubmit();
								obj.manualReceive = manualReceive;
								//  核算
								manualAccount = this.$refs.accounts.onSubmit();
								obj.manualAccount = manualAccount;
								if (!manualDeliver || !manualReceive || !manualAccount) {
									return;
								}

								// 发票
								let manualInvoice = this.$refs.invo.onSubmit();
								if (values.type == 'INVOICE' && !manualInvoice) {
									this.$message.error('请关联发票');
									return;
								}
								if (values.type == 'INVOICE') {
									obj.invoiceIds = manualInvoice.keys;
								}

								//  其他
								let manualOther = this.$refs.other.onSubmit();
								obj.manualOther = manualOther;
								let list = []
									.concat(manualDeliver.attachList || [])
									.concat(manualReceive.attachList || manualReceive.list || [])
									.concat(manualAccount.list || [])
									.concat(manualOther.list || []);
								obj.list = list;
								if (type == 'save') {
									obj.submitType = '1';
								} else {
									obj.submitType = '2';
								}
								this.doSubmit(obj, jump);
							});
						}
					} else {
						// 华能云成
						if (values.paymentType == 'product-huaneng-downReceivable') {
							let manualDeliver, manualReceive, manualTransfer, manualAccount, statementIdList;
							// 运输
							manualDeliver = this.$refs.transport.onSubmit();
							obj.goodsInfo = manualDeliver?.goodsInfo;
							obj.manualDeliver = manualDeliver;

							//  质量
							manualReceive = this.$refs.quality.onSubmit();

							obj.manualReceive = manualReceive;
							// 货转
							manualTransfer = this.$refs.transfer.onSubmit();

							obj.manualTransfer = manualTransfer;
							//  核算
							manualAccount = this.$refs.accounts.onSubmit();

							obj.manualAccount = manualAccount;
							//  结算单
							statementIdList = this.$refs.settle.onSubmit();
							obj.statementIdList = statementIdList;

							if (!manualDeliver || !manualReceive || !manualTransfer || !manualAccount || !statementIdList) {
								return;
							}

							// 发票
							let manualInvoice = this.$refs.invo.onSubmit();
							if (values.type == 'INVOICE' && !manualInvoice) {
								this.$message.error('请关联发票');
								return;
							}
							if (values.type == 'INVOICE') {
								obj.invoiceIds = manualInvoice.keys;
							}

							//  其他
							let manualOther = this.$refs.other.onSubmit();
							obj.manualOther = manualOther;
							let list = []
								.concat(manualDeliver.attachList || [])
								.concat(manualTransfer.list || [])
								.concat(manualReceive.attachList || manualReceive.list || [])
								.concat(manualAccount.list || [])
								.concat(manualOther.list || []);
							obj.list = list;
							if (type == 'save') {
								obj.submitType = '1';
							} else {
								obj.submitType = '2';
							}
							this.doSubmit(obj, jump);
						}
						//  万物易链-下游应收
						if (values.paymentType == 'receivable-wanwuyilian-down') {
							let manualDeliver, manualReceive, manualAccount;
							// 运输
							manualDeliver = this.$refs.transport.onSubmit();

							obj.manualDeliver = manualDeliver;
							obj.goodsInfo = manualDeliver?.goodsInfo || null;
							//  质量
							manualReceive = this.$refs.quality.onSubmit();
							obj.manualReceive = manualReceive;
							//  核算
							manualAccount = this.$refs.accounts.onSubmit();
							obj.manualAccount = manualAccount;
							if (!manualDeliver || !manualReceive || !manualAccount) {
								return;
							}

							// 发票
							let manualInvoice = this.$refs.invo.onSubmit();
							if (values.type == 'INVOICE' && !manualInvoice) {
								this.$message.error('请关联发票');
								return;
							}
							if (values.type == 'INVOICE') {
								obj.invoiceIds = manualInvoice.keys;
							}

							//  其他
							let manualOther = this.$refs.other.onSubmit();
							obj.manualOther = manualOther;
							let list = []
								.concat(manualDeliver.attachList || [])
								.concat(manualReceive.attachList || manualReceive.list || [])
								.concat(manualAccount.list || [])
								.concat(manualOther.list || []);
							obj.list = list;
							if (type == 'save') {
								obj.submitType = '1';
							} else {
								obj.submitType = '2';
							}
							this.doSubmit(obj, jump);
						}
					}

					//  善美保理
					if (values.paymentType == 'receivable-shanmei-down') {
						// 货转
						let manualTransfer = this.$refs.newTransfer.onSubmit();

						if (!manualTransfer) {
							return;
						}

						obj.manualTransfer = manualTransfer;
						//  结算单
						let statementIdList = this.$refs.settle.onSubmit();
						if (!statementIdList) {
							return;
						}
						obj.statementIdList = statementIdList;
						// 发票
						let manualInvoice = this.$refs.invo.onSubmit();

						if (values.type == 'INVOICE' && !manualInvoice) {
							this.$message.error('请关联发票并上传附件');
							return;
						}
						if (values.type == 'INVOICE') {
							obj.invoiceIds = manualInvoice.keys;
						}

						//  其他
						let manualOther = this.$refs.other.onSubmit();
						obj.manualOther = manualOther;
						let list = []
							.concat(manualTransfer.list || [])
							.concat(manualOther.list || [])
							.concat(manualInvoice.upInvoiceDetailList || []);

						obj.list = list;
						if (type == 'save') {
							obj.submitType = '1';
						} else {
							obj.submitType = '2';
						}
						this.doSubmit(obj, jump);
					}
				} else {
					this.$message.error('基本信息内容填写有误');
				}
			});
		},

		getEndDate() {
			this.endDate = '';
			let beginDate = this.baseForm.getFieldValue('beginDate')
				? moment(this.baseForm.getFieldValue('beginDate')).format('YYYY-MM-DD')
				: null;

			const item = _.find(this.bankList, { bankName: this.bankName }) || {};
			let paymentType = item ? item.paymentType : null;
			//  获取当前日期是否可以编辑
			// 系统生成的不能编辑
			this.isEndDateType = item.endDateType;

			if (paymentType && beginDate) {
				API_assetmanual_getEndDate({ paymentType, beginDate }).then(res => {
					this.baseForm.setFieldsValue({ endDate: res.data });
				});
			}
		},
		changeBankName(v) {
			this.activeIndex = 0;
			const item = _.find(this.bankList, { paymentType: v }) || {};
			this.bankName = item.bankName;
			this.bankUscc = item.bankUscc;
			this.selectFinancedInvoice = item.selectFinancedInvoice;
			this.getEndDate();
		},
		changeBeginDate() {
			setTimeout(() => {
				this.getEndDate();
			});
		},
		async doSubmit(obj, jump) {
			if (obj) {
				this.doSubmitObj = { obj, jump };
				let { manualAssetReceivable } = obj;
				// 判断保存还是提交，提交时进行判断
				if (obj.submitType === '2') {
					// 只有华能云成判断
					let { paymentType } = manualAssetReceivable;
					if (paymentType === 'product-huaneng-downReceivable') {
						// 判断是否需要平台审核，
						if (manualAssetReceivable.paymentType) {
							let res = await API_COMPANplatformRiskAudit({ payType: manualAssetReceivable.paymentType });
							if (res.success) {
								this.platformRiskAudit = res.result;
							}
						}
						// 如果不需要平台审核，判断是否对接OA,
						// 陕煤系企业无论后端配置什么，都跳过平台审核
						if (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) {
							let res = await API_COMPANYOACHECKPOOL({
								bizType: 'ASSET_RECEIVABLE'
							});
							if (res.success) {
								this.oaflag = res.data;
							}
						}
					}
					this.$refs.modalMain.open();
				} else {
					this.doSubmitNext();
				}
			}
		},
		doSubmitNext() {
			let { obj, jump } = this.doSubmitObj;
			// 是否需要推送OA
			if (this.needPushOaShow) {
				obj.needPushOa = this.needPushOa;
			}
			this.$refs.modalMain.close();
			API_EditAccountsManualPayable(obj).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					if (jump == 'nojump') {
						this.$router.replace('/center/assets/pool/manage/edit?isEdit=1&activeIndex=6&id=' + res.data);
						window.location.reload();
						return;
					}
					this.$router.push('/center/assets/receivable/list');
				}
			});
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
		// 选择销售合同
		openContract() {
			if (!this.baseForm.getFieldValue('paymentType')) {
				this.$message.error('请先选择资金类型');
				return;
			}
			this.$refs.relationContract.showRelationOrderList();
		},
		// 测算
		calculate() {
			// 应收账款金额*有票/无票比例，
			const { amount, paymentType, type } = this.baseForm.getFieldsValue(['amount', 'paymentType', 'type']);
			if (!amount || !paymentType || !type) {
				this.$message.error('应收账款金额和资金类型必须有数据');
				return;
			}
			let planFinancingAmount = 0;
			// 查询当前选择的资金类型
			const item = this.bankList.find(el => el.paymentType == paymentType);
			if (type == 'INVOICE') {
				planFinancingAmount = (amount * item.ticketFinancingPercentage).toFixed(2);
			} else {
				planFinancingAmount = (amount * item.noTicketFinancingPercentage).toFixed(2);
			}
			this.baseForm.setFieldsValue({ planFinancingAmount });
		},
		// 获取选择的合同信息
		async getSelectContract(item) {
			const params = {
				id: item.id,
				contractType: item.contractType,
				parentOrderNo: item.parentOrderNo || ''
			};
			const res = await API_GetManualOrderDetail(params);
			const obj = res.data || {};
			const contractInfo = {
				...obj,
				contractId: obj.poolContractDetail.id,
				...obj.poolContractDetail
			};
			this.contractInfo = contractInfo;
			/** 只允许选择一次合同 */
			this.isSelectContract = true;
			// 代入买方名称
			this.baseForm.setFieldsValue({ buyerUscc: contractInfo.buyerUscc });
			this.buyerName = contractInfo.buyerName;

			this.getSettleList();
			this.$nextTick(() => {
				this.$refs.contractInfo && this.$refs.contractInfo.init(contractInfo);
			});
			this.VUEX_SET_MANUAL_ASSET_OBJ(contractInfo);
			this.VUEX_SET_POOL_ASSET_OBJ(contractInfo);
		},
		// 设置买方名称
		initBuyerName() {
			if (this.contractInfo) {
				this.buyerName = this.contractInfo.buyerName;
			} else {
				this.buyerName = _.find(this.buyerNameList, { uscc: this.baseForm.getFieldValue('buyerUscc') }).companyName;
			}
		},
		// 切换复用合同
		changePoolReuse(e) {
			// 切换到合同模块 重置数据
			this.activeIndex = 0;
			this.contractInfo = {};
			this.$nextTick(() => {
				this.$refs.contractInfo && this.$refs.contractInfo.init({ list: [] });
			});
			this.VUEX_SET_MANUAL_ASSET_OBJ({ id: '', contractId: '' });
			this.VUEX_SET_POOL_ASSET_OBJ({ id: '', contractId: '' });
		},
		// 获取结算单列表
		async getSettleList() {
			if (!this.contractInfo.id) return;
			const params = {
				contractId: this.contractInfo.id,
				contractType: this.contractInfo.contractType
			};
			const res = await getReceivableStatementList(params);
			this.$nextTick(() => {
				this.$refs.settle && this.$refs.settle.init(res.data);
			});
		},
		// 更新货转数据
		getTransInfoList(list = []) {
			// 判断当前的货转是否存在
			this.$nextTick(() => {
				this.$refs.newTransfer && this.$refs.newTransfer.init(list);
			});
		},
		changeType() {
			this.activeIndex = 0;
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
	padding: 20px 16px 24px 16px;
	border-radius: 8px;
	background: #fff;
	margin: 14px 0 0 0;

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
	display: flex;
	flex-direction: column;
	cursor: pointer;
}
.tabs-bar i {
	display: none;
	// display: inline-block;
	width: 10px;
	height: 10px;
	float: right;
	background: red;
	border-radius: 50%;
	margin-top: 8px;
	margin-right: 10px;
}
.tabs-bar > div > div {
	float: left;
}
.tabs-bar > div {
	padding: 14px 0;
	.tabs-icon {
		flex: none;
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		img {
			width: 18px;
			height: 18px;
			margin-right: 10px;
		}
		span,
		img {
			vertical-align: middle;
		}
	}
}
.tabs-bar > div.blue {
	img {
		filter: brightness(150%);
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		color: #383a3f;
		line-height: 22px;
	}
	.blue {
		color: @primary-color;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
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

.main {
	.title {
		color: rgba(0, 0, 0, 0.4);
		font-family: PingFang SC;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
	.mainTable {
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		margin-top: 10px;
		.item {
			padding: 0 13px;
			color: rgba(0, 0, 0, 0.8);
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			&:nth-child(2n) {
				background: #f3f5f6;
			}
			.label {
				text-align: right;
				width: 130px;
				color: rgba(0, 0, 0, 0.4);
				display: inline-block;
				margin-right: 5px;
				&.required {
					position: relative;
					&::after {
						content: '*';
						color: #f5222d;
						position: absolute;
						right: 95px;
					}
				}
			}
			.red {
				color: #d44;
			}
		}
	}
	.footer-title {
		color: rgba(0, 0, 0, 0.8);
		margin-top: 20px;
	}
}
</style>
