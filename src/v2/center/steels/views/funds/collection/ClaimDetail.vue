<template>
	<div class="s-card new-detail">
		<div class="new-detail-content detail-form">
			<h2>回款信息</h2>
		</div>
		<div>
			<div style="margin-top: 12px">
				<a-form
					:form="collectionForm"
					v-bind="formLayout"
				>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="资金流水号"
								:colon="false"
							>
								<a-input
									:disabled="disabled"
									v-decorator="[
										'serialNo',
										{
											rules: [{ required: true, message: '资金流水号必填' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="对方户名"
								:colon="false"
							>
								<a-select
									show-search
									:disabled="disabled"
									placeholder="请输入对方户名,可搜索"
									style="width: 100%"
									:filter-option="false"
									:default-active-first-option="false"
									:not-found-content="fetching ? undefined : null"
									@search="searchCompany"
									v-decorator="[
										'collectionAccount',
										{
											rules: [{ required: true, message: '对方户名必填' }]
										}
									]"
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
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="回款金额"
								:colon="false"
							>
								<a-input-number
									:disabled="disabled"
									@change="collectionAmountChange"
									style="width: 100%"
									:precision="2"
									:min="0"
									v-decorator="[
										'collectionAmount',
										{
											rules: [{ required: true, message: '回款金额必填' }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="回款时间"
								:colon="false"
							>
								<a-date-picker
									style="width: 100%;"
									:disabled="disabled"
									placeholder="选择日期"
									v-decorator="[
										'collectionDate',
										{
											rules: [{ required: true, message: '回款时间必填' }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="回款方式"
								:colon="false"
							>
								<a-select
									:disabled="disabled"
									v-decorator="[
										'collectionMode',
										{
											rules: [{ required: true, message: '回款方式必选' }]
										}
									]"
									@change="payTypeChange"
									placeholder="请选择付款类型"
								>
									<!-- 3-融资还款-不展示 -->
									<a-select-option
										v-for="(items, index) in collectionMode"
										:key="index"
										:value="items.value"
									>
										{{ items.label }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							:span="24"
							class="row"
						>
							<a-form-item
								:label-col="{ span: 3 }"
								:wrapper-col="{ span: 21 }"
								label="备注"
								:colon="false"
								class="textarea-wrap"
							>
								<a-textarea
									:disabled="disabled"
									v-decorator="[
										'remark',
										{
											rules: [{ validator: validateComments }]
										}
									]"
									placeholder="请输入备注"
								></a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
					<div class="title"><i class="title_icon"></i>附件信息</div>
					<div class="upload-wrap">
						<div class="upload-block">
							<!-- 资金类型为善美保理供应链时，核算表需要盖章 -->
							<CustomUpload
								:transType="$route.query.transType"
								:coalType="$route.query.coalType"
								:isShowGoodsValue="true"
								ref="customUpload"
								:isNeedRotate="true"
								:ifEditable="!id"
								:attachmentTypeList="attachmentTypeList"
								@uploadFiles="getUploadFiles"
								@deleteFiles="deleteFiles"
								:fileDataSource="fileDataSource"
								:type="'pay'"
								:allowFormat="isNeedStamp ? ['jpg', 'jepg', 'png'] : []"
								:accountingSeal="isNeedStamp"
							/>
						</div>
					</div>
					<div
						class="claimInfo"
						v-if="$route.query.type !== 'detail'"
					>
						<span>认领信息</span>
						<a-row>
							<a-col
								:span="8"
								class="row"
							>
								<p>回款金额(元)</p>
								<span v-if="collectionForm.getFieldValue('collectionAmount')">
									¥{{ collectionForm.getFieldValue('collectionAmount') | formatMoney(2) }} </span
								><span v-else>¥0</span>
							</a-col>
							<a-col
								:span="8"
								class="row"
							>
								<p>已认领金额(元)</p>
								<span
									v-if="
										(collectionClaimRecordListNum ||
											0 + baseCollectionClaimRecordListNum ||
											0 + (goodsForm.getFieldValue('claimAmount') || 0)) > 0
									"
								>
									¥{{
										(((collectionClaimRecordListNum || 0) * 100 +
											(baseCollectionClaimRecordListNum || 0) * 100 +
											(goodsForm.getFieldValue('claimAmount') || 0) * 100) /
											100)
											| formatMoney(2)
									}}
								</span>
								<span v-else>¥0</span>
							</a-col>
							<a-col
								:span="8"
								class="row"
							>
								<p>可认领金额(元)</p>
								<span>¥{{ getValue | formatMoney(2) }}</span>
							</a-col>
						</a-row>
						<!-- ruleForm包含  payType--回款类型，  unFinancialAmount--非线上业务回款认领金额  remark--备注 -->
						<a-form
							:form="goodsForm"
							v-bind="formLayout"
						>
							<a-row>
								<a-col
									:span="12"
									class="row"
									style="margin-bottom: 0; margin-top: 8px"
								>
									<a-form-item
										label="回款类型"
										:colon="false"
									>
										<a-checkbox-group
											v-decorator="[
												'collectionType',
												{
													rules: [{ required: true, message: '回款类型必选' }]
												}
											]"
											@change="onCheck"
										>
											<a-checkbox
												v-for="item in collectionTypeList"
												:key="item.value"
												:value="item.value"
											>
												{{ item.label }}
											</a-checkbox>
											<!-- <a-checkbox value="SECURITY_DEPOSIT" :disabled="Number(claimedAmount)>0">保证金</a-checkbox> -->
										</a-checkbox-group>
									</a-form-item>
								</a-col>
							</a-row>
							<!-- 非线上业务回款认领 start-->
							<div
								v-if="
									goodsForm.getFieldValue('collectionType') &&
									goodsForm.getFieldValue('collectionType').includes('NON_PLATFORM_COLLECTION')
								"
							>
								<div
									class="title"
									style="margin-top: 30px"
								>
									非线上业务回款认领（上游合同未上线）
								</div>
								<a-row>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item label="认领金额">
											<a-input-number
												@change="claimAmountChange"
												style="width: 100%"
												v-decorator="[
													'claimAmount',
													{
														rules: [{ required: true, message: '认领金额必填' }]
													}
												]"
											/>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label=""
											:label-col="{
												span: 1
											}"
											:wrapper-col="{
												span: 23
											}"
										>
											本次可认领金额 ¥{{ getValue | formatMoney(2) }}
										</a-form-item>
									</a-col>
								</a-row>
							</div>
							<!-- 线上业务回款认领 start-->
							<div
								v-if="
									goodsForm.getFieldValue('collectionType') &&
									goodsForm.getFieldValue('collectionType').includes('PLATFORM_COLLECTION')
								"
								style="overflow: hidden"
							>
								<div class="title">
									线上业务回款认领
									<!-- <a-button type="primary" style="float: right;" @click="addFinancing">新增线上业务回款认领</a-button> -->
								</div>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-item
										label="下游合同编号"
										:colon="false"
									>
										<a-input
											:disabled="!!downstreamContractNo"
											v-decorator="[
												'downstreamContractNo',
												{
													rules: [
														{
															required: !goodsForm.getFieldValue('collectionType').includes('NON_PLATFORM_COLLECTION'),
															message: '请选择下游合同'
														}
													]
												}
											]"
											@click="onClick()"
											placeholder="请输入下游合同编号"
											style="margin-right: 8px"
										/>
									</a-form-item>
								</a-col>
								<!-- 下游合同 -->
								<a-col
									:span="24"
									v-if="handleType == 1"
								>
									<!-- 判断关联下游合同 -->
									<a-table
										@expand="expand"
										rowKey="contractNo"
										:columns="goodsColumns"
										:dataSource="goodsData"
										:scroll="{ x: true }"
										:pagination="false"
										:locale="{ emptyText: '暂无数据' }"
									>
										<template
											slot="operation"
											slot-scope="record"
										>
											<a
												href="javascript:;"
												@click="jumpToDetail('release', record)"
												>查看</a
											>
										</template>
										<div
											slot="expandedRowRender"
											slot-scope="record">
											<div v-if="record.relationType === 'OFFLINE'">
												<a-table
													rowKey="contractNo"
													:columns="warehousesColumns"
													:dataSource="[record]"
													:scroll="{ x: true }"
													:pagination="false"
													:locale="{ emptyText: '暂无数据' }"
												>
													<template
														slot="operation"
														slot-scope="record"
													>
														<a
															href="javascript:;"
															@click="jumpToDetail('release', record)"
															>查看</a
														>
													</template>
													<template
														slot="fundType"
														slot-scope="t, r"
													>
														<a-form-item
															label=""
															:colon="false"
														>
															<a-select
																:disabled="($route.query.type == 'view' && !isAgain) || isMarginCall"
																v-decorator="[
																	`${r.contractNo}-fundType`,

																	{
																		initialValue: initialValue,
																		rules: [
																			{
																				required: false,
																				message: '请填写认领金额'
																			}
																		]
																	}
																]"
																placeholder="请选择"
																@change="onChange3(r, 'fundType')"
																style="width: 150px"
															>
																<a-select-option
																	value="BOND"
																	v-if="!isAgain"
																	>保证金</a-select-option
																>
																<a-select-option value="BUSINESS_FUNDS">业务款</a-select-option>
																<a-select-option value="BOND_LETTER">追保保证金</a-select-option>
															</a-select>
														</a-form-item>
													</template>
													<template
														slot="claimAmount"
														slot-scope="t, r"
													>
														<a-form-item
															label=""
															:colon="false"
														>
															<a-input-number
																v-if="r.fundType !== 'BOND'"
																style="width: 150px"
																:disabled="false"
																:min="0.01"
																:precision="2"
																:max="99999999999.99"
																@blur="onBlur2(`${r.contractNo}-claimAmount`)"
																@change="onChange2(r.contractNo, 'claimAmount')"
																v-decorator="[
																	`${r.contractNo}-claimAmount`,

																	{
																		rules: [
																			{
																				required: false,
																				message: '请填写认领金额'
																			}
																		]
																	}
																]"
															/>
															<span
																style="color: #222; font-size: 14px"
																v-else
															>
																{{ r.claimAmount }}</span
															>
														</a-form-item>
													</template>
												</a-table>
												<MarginCallTable
													v-if="handleFundType == 'BOND_LETTER'"
													@send="getBondSelect"
													:list="bondLetterList"
													:bondLetterKeys="bondLetterKeys"
												></MarginCallTable>
											</div>
											<div v-else>
												<a-table
													:columns="innerColumns"
													:data-source="record.shipmentList"
													rowKey="shipmentNo"
													:scroll="{ x: true }"
													:pagination="false"
												>
													<template
														slot="operation"
														slot-scope="text, record"
													>
														<a
															href="javascript:;"
															@click="jumpToDetail('goods', record)"
															>查看</a
														>
													</template>
													<template
														slot="claimAmount"
														slot-scope="t, r"
													>
														<a-form-item
															label=""
															:colon="false"
														>
															<a-input-number
																style="width: 150px"
																:disabled="false"
																:precision="2"
																@blur="onBlur(r.shipmentNo, `${record.contractNo}-${r.shipmentNo}-claimAmount`)"
																@change="onChange(record.contractNo, r.shipmentNo)"
																v-decorator="[
																	`${record.contractNo}-${r.shipmentNo}-claimAmount`,
																	{
																		rules: [
																			{
																				required: false,
																				message: '请填写认领金额'
																			}
																		]
																	}
																]"
															/>
														</a-form-item>
													</template>
												</a-table>
											</div>
										</div>
									</a-table>
								</a-col>
								<a-col
									:span="24"
									v-if="handleType == 2"
								>
									<!-- 判断关联下游合同 -->
									<a-table
										rowKey="contractNo"
										:columns="warehousesColumns"
										:dataSource="goodsData"
										:scroll="{ x: true }"
										:pagination="false"
										:locale="{ emptyText: '暂无数据' }"
									>
										<template
											slot="operation"
											slot-scope="record"
										>
											<a
												href="javascript:;"
												@click="jumpToDetail('release', record)"
												>查看</a
											>
										</template>
										<template
											slot="fundType"
											slot-scope="t, r"
										>
											<a-form-item
												label=""
												:colon="false"
											>
												<a-select
													:disabled="($route.query.type == 'view' && !isAgain) || isMarginCall"
													v-decorator="[
														`${r.contractNo}-fundType`,

														{
															initialValue: initialValue,
															rules: [
																{
																	required: false,
																	message: '请填写认领金额'
																}
															]
														}
													]"
													placeholder="请选择"
													@change="onChange3(r, 'fundType')"
													style="width: 150px"
												>
													<a-select-option
														value="BOND"
														v-if="!isAgain"
														>保证金</a-select-option
													>
													<a-select-option value="BUSINESS_FUNDS">业务款</a-select-option>
													<a-select-option value="BOND_LETTER">追保保证金</a-select-option>
												</a-select>
											</a-form-item>
										</template>
										<template
											slot="claimAmount"
											slot-scope="t, r"
										>
											<a-form-item
												label=""
												:colon="false"
											>
												<a-input-number
													v-if="r.fundType !== 'BOND'"
													style="width: 150px"
													:disabled="false"
													:min="0.01"
													:precision="2"
													:max="99999999999.99"
													@blur="onBlur2(`${r.contractNo}-claimAmount`)"
													@change="onChange2(r.contractNo, 'claimAmount')"
													v-decorator="[
														`${r.contractNo}-claimAmount`,

														{
															rules: [
																{
																	required: false,
																	message: '请填写认领金额'
																}
															]
														}
													]"
												/>
												<span
													style="color: #222; font-size: 14px"
													v-else
												>
													{{ r.claimAmount }}</span
												>
											</a-form-item>
										</template>
									</a-table>
									<MarginCallTable
										v-if="handleFundType == 'BOND_LETTER'"
										@send="getBondSelect"
										:list="bondLetterList"
										:bondLetterKeys="bondLetterKeys"
									></MarginCallTable>
								</a-col>
							</div>
							<div
								class="btn-wrap"
								v-if="$route.query.type !== 'detail'"
							>
								<a-button
									style="margin-left: 10px"
									@click="$router.go(-1)"
									>返回</a-button
								>
								<a-button
									type="primary"
									@click="onSubmit('submit')"
									>提交</a-button
								>
							</div>
						</a-form>
					</div>
					<DownstreamContractNo
						ref="downstreamContractNo"
						@getDownstreamContractNo="getDownstreamContractNo"
					/>
					<invoice-info-modal
						:id="id"
						:type="collectionType"
						:visible="invoiceModalVisible"
						@cancel="toCancel"
					></invoice-info-modal>
					<a-modal
						title="认领历史"
						:visible="claimRecordVisible"
						width="80%"
						@cancel="
							() => {
								claimRecordVisible = false;
							}
						"
						:footer="null"
					>
						<a-table
							:pagination="false"
							:columns="claimRecordsColumns"
							:data-source="claimRecordList"
							rowKey="id"
							:scroll="{ x: true }"
						>
							<template
								slot="amount"
								slot-scope="amount, items"
							>
								<span v-if="amount">{{ amount | formatMoney(2) }}</span>
								<span v-else>{{ amount }}</span>
							</template>
						</a-table>
					</a-modal>
				</a-form>
			</div>
			<div
				class="claimRecordBox"
				v-if="$route.query.type === 'detail'"
			>
				<div class="title"><i class="title_icon"></i>认领历史</div>
				<h3>线上业务回款</h3>
				<div class="table-wrap">
					<a-table
						:columns="detailColumns"
						:rowKey="record => record.id"
						:dataSource="platformList"
						:pagination="false"
						:loading="loading"
						:scroll="{ x: true }"
					>
						<span
							slot="quantity"
							slot-scope="quantity, items"
						>
							{{ quantity || '-' }}
						</span>
						<!-- 未关联下游合同的非线上业务回款、保证金 -->
						<template
							slot="action"
							slot-scope="action, items"
						>
							<a
								href="javascript:;"
								v-auth="'dgChain:recPay:list:view:invalidClaim'"
								v-if="(items.type == 'NON_FINANCING_CLAIM' && !items.downContractNo) || items.type == 'SECURITY_DEPOSIT'"
								@click="invalid(items)"
								>作废</a
							>
						</template>
					</a-table>
					<MarginCallTable
						v-if="handleFundType == 'BOND_LETTER'"
						:list="detailInfo.bondLetterList"
						:bondLetterKeys="bondLetterKeys"
					></MarginCallTable>
				</div>

				<h3 class="mt8">非线上业务回款</h3>
				<div class="table-wrap">
					<a-table
						:columns="nonPlatformColumns"
						:rowKey="record => record.id"
						:dataSource="nonPlatformList"
						:pagination="false"
						:loading="loading"
						:scroll="{ x: true }"
					>
						<span
							slot="receiverName"
							slot-scope="receiverName"
						>
							{{ receiverName || '-' }}
						</span>
						<!-- 未关联下游合同的非线上业务回款、保证金 -->
						<template
							slot="action"
							slot-scope="action, items"
						>
							<a
								href="javascript:;"
								v-auth="'dgChain:recPay:list:view:invalidClaim'"
								v-if="(items.type == 'NON_FINANCING_CLAIM' && !items.downContractNo) || items.type == 'SECURITY_DEPOSIT'"
								@click="invalid(items)"
								>作废</a
							>
						</template>
					</a-table>
				</div>

				<div
					class="tc"
					style="padding-top: 30px"
				>
					<a-button @click="$router.go(-1)">返回</a-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	API_GetCollectionCollectionBillDetail,
	API_GetCollectionCollectionTeleDetail,
	API_InvalidCollectionClaim,
	API_GetCompanyName,
	addCollection,
	findByDownstreamContractNo,
	getCollectionByContractNo,
	checkShipmentIsBeyond,
	collectionDetail,
	collectionClaim,
	getBondLetterForCollection
} from '@/v2/center/steels/api/funds.js';
import CustomUpload from '@//v2/center/steels/components/upload/CustomUpload';
import invoiceInfoModal from '../components/invoiceInfoModal';
import DownstreamContractNo from '../components/DownstreamContractNo';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';
import MarginCallTable from '@sub/components/steels/MarginCallTable.vue';
import { getVal } from '@/v2/utils/order/checkVal';
import reg from '@sub/utils/reg.js'
import { cloneDeep } from 'lodash';
const attachmentColumns = [
	{ title: '类型', dataIndex: 'tradeNo' },
	{ title: '来源', dataIndex: 'payer' },
	{ title: '文件名', dataIndex: 'collectionDate', scopedSlots: { customRender: 'collectionDate' } },
	{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
const detailColumns = [
	{ title: '序号', customRender: (t, r, index) => parseInt(index) + 1, fixed: 'left' },
	{ title: '认领金额', dataIndex: 'claimAmount' },
	{ title: '回款类型', dataIndex: 'collectionTypeDesc' },
	{ title: '认领人', dataIndex: 'createdByName' },
	{ title: '认领时间', dataIndex: 'createdDate' },
	{ title: '批次号', dataIndex: 'shipmentNo' },
	{ title: '收货编号', dataIndex: 'receiptNo' },
	{ title: '发货数量', dataIndex: 'shipmentQuantity' },
	{ title: '发货日期', dataIndex: 'shipmentDate' },
	{ title: '收货数量', dataIndex: 'receiptQuantity' },
	{ title: '收货日期', dataIndex: 'receiptDate' },
	{ title: '采购合同号', dataIndex: 'contractNo' },
	{ title: '销售合同号', dataIndex: 'downstreamContractNo' }
];
const warehousesDetailColumns = [
	{ title: '序号', customRender: (t, r, index) => parseInt(index) + 1, fixed: 'left' },
	{ title: '销售合同号', dataIndex: 'contractNo' },
	{ title: '认领金额', dataIndex: 'claimAmount' },
	{ title: '回款类型', dataIndex: 'fundTypeDesc' },
	{ title: '认领人', dataIndex: 'createdByName' },
	{ title: '认领时间', dataIndex: 'createdDate' },

	,
];

const nonPlatformColumns = [
	{ title: '序号', customRender: (t, r, index) => parseInt(index) + 1, fixed: 'left' },
	{ title: '认领金额', dataIndex: 'claimAmount', align: 'center' },
	{ title: '回款类型', dataIndex: 'collectionTypeDesc' },
	{ title: '认领人', dataIndex: 'createdByName' },
	{ title: '认领时间', dataIndex: 'createdDate' }
];

const claimRecordsColumns = [
	// 认领历史
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 80,
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '收款编号', dataIndex: 'serialNo', key: 'serialNo', width: 150 },
	{ title: '认领金额', dataIndex: 'amount', key: 'amount', width: 120, scopedSlots: { customRender: 'amount' } },
	{ title: '认领人', dataIndex: 'createName', key: 'createName', width: 100 },
	{ title: '认领时间', dataIndex: 'createTime', key: 'createTime', width: 150 }
];

const financingColumns = [
	// 线上业务回款认领
	{ title: '业务线号', dataIndex: 'lineNo', key: 'lineNo' },
	{ title: '业务线名称', dataIndex: 'lineName', key: 'lineName' },
	{ title: '发运时间', dataIndex: 'deliverDate', key: 'deliverDate' },
	{ title: '发运数量', dataIndex: 'deliverNum', key: 'deliverNum' },
	{ title: '融资金额', dataIndex: 'financeAmount', key: 'financeAmount' },
	{ title: '已认领金额', dataIndex: 'receivedAmount', key: 'receivedAmount' },
	{ title: '采购合同号', dataIndex: 'upContractNo', key: 'upContractNo' },
	{ title: '销售合同号', dataIndex: 'downContractNo', key: 'downContractNo' },
	{
		title: '本次认领金额',
		dataIndex: 'repayAmount',
		key: 'repayAmount',
		fixed: 'right',
		scopedSlots: { customRender: 'repayAmount' },
		width: 150
	},
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

const goodsColumns = [
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '卖方名称', dataIndex: 'sellCompanyName' },
	{ title: '下游签约简称', dataIndex: 'downstreamCompanyAbbr' },
	{ title: '已发货数量', dataIndex: 'deliveredQuantity' },
	{ title: '已收货数量', dataIndex: 'receivedQuantity' }
];

const innerColumns = [
	{ title: '批次号', dataIndex: 'shipmentNo' },
	// { title: '收货编号', dataIndex: 'receiptNo' },
	{ title: '发货数量', dataIndex: 'quantity' },
	{ title: '发货日期', dataIndex: 'shipmentDate' },
	{ title: '收货数量', dataIndex: 'receiptQuantity' },
	// { title: '收货日期', dataIndex: 'receiptDate' },
	{ title: '已认领金额', dataIndex: 'claimedAmount' },
	{ title: '本次认领金额', dataIndex: 'claimAmount', scopedSlots: { customRender: 'claimAmount' } }
];
// 仓押业务的线上业务回款认领
const warehousesColumns = [
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '买方名称', dataIndex: 'buyCompanyName' },
	{ title: '合同数量(吨)', dataIndex: 'quantity' },
	{ title: '类型', dataIndex: 'fundType', scopedSlots: { customRender: 'fundType' } },
	{ title: '本次认领金额', dataIndex: 'claimAmount', scopedSlots: { customRender: 'claimAmount' } }
];
export default {
	name: 'ClaimDetail',
	components: {
		CustomUpload,
		DownstreamContractNo,
		invoiceInfoModal,
		MarginCallTable
	},
	data() {
		let validateNumber = (rule, value, callback) => {
			// 校验下游合同下非线上业务回款金额
			let i = 0; // 所有平台业务金额之和
			this.dynamicValidateForm.domains.forEach(item => {
				item.financingData.forEach(pro => {
					i += Number(pro.repayAmount);
				});
				i += Number(item.contractUnFinanceAmount);
			});

			let j = 0; // 当前操作的平台业务金额之和
			this.dynamicValidateForm.domains[this.index].financingData.forEach(project => {
				j += Number(project.repayAmount);
			});
			j += Number(this.dynamicValidateForm.domains[this.index].contractUnFinanceAmount);

			let regs2 = /^\d+(\.\d{0,2})?$/;
			if (!regs2.test(value)) {
				return callback(new Error(rule.msg));
			} else if (
				Number((i + Number(this.form.unFinancialAmount)).toFixed(2)) > Number(this.canClaimAmount.toFixed(2)) ||
				Number(j.toFixed(2)) > this.dynamicValidateForm.domains[this.index].canClaimAmount
			) {
				// 所有平台业务业务线的回款+所有下游合同下其他业务线回款+非线上业务回款 > 总可认领金额
				// 或者  当前平台业务业务线的回款+当前下游合同下其他业务线回款> 当前平台业务可认领金额)
				return callback('输入金额超出最大可认领余额/下游合同回款金额超过该合同结算金额，请仔细查验！');
			} else {
				this.currentCanClaimAmount = Number(
					(this.canClaimAmount - Number((i + Number(this.form.unFinancialAmount)).toFixed(2))).toFixed(2)
				);
				return callback();
			}
		};
		return {
			goodsColumns,
			attachmentColumns,
			nonPlatformColumns,
			claimRecordsColumns,
			financingColumns,
			innerColumns,
			warehousesColumns,
			moment,
			downstreamContractNo: '',
			nonPlatformList: [],
			disabled: false,
			companyList: [],
			fetching: false,
			collectionClaimRecordList: [],
			baseCollectionClaimRecordListNum: 0,
			collectionClaimRecordListNum: 0,
			expandedRowKeys: [],
			goodsSelectedRowKeys: [],
			goodsData: [],
			attachmentTypeList: filterSteelsCodeByKey('collectionAttach'),
			collectionTypeList: filterSteelsCodeByKey('collectionType'),
			isNeedStamp: true,
			rulesContractUnFinanceAmount: [
				//下游合同下非线上业务回款金额的校验规则
				{ required: true, message: '请输入该下游合同下其他业务线回款金额', trigger: 'blur' },
				{ validator: validateNumber, trigger: 'blur', msg: '请输入非负数，最多两位小数' }
			],
			formLayout: {
				labelCol: { span: 6 },
				wrapperCol: { span: 15 }
			},
			collectionMode: filterSteelsCodeByKey('collectionMode'),
			form: {
				unFinancialAmount: 0,
				collectionType: ''
			},
			rules: {
				collectionType: [{ required: true, message: '请选择回款类型', trigger: 'change' }],
				unFinancialAmount: [
					{ required: true, message: '请输入认领金额', trigger: 'blur' },
					{ validator: validateNumber, trigger: 'blur', msg: '请输入非负数，最多两位小数' }
				]
			},
			claimData: {},
			plainOptions: [
				{ label: '线上业务回款', value: 0 },
				{ label: '非线上业务回款', value: 0 }
			],
			fileDataSource: [],
			collectionForm: this.$form.createForm(this),
			goodsForm: this.$form.createForm(this),
			loading: false,
			data: {},
			isEa: '', // 是否是电汇类型
			id: '',
			fileInfos: [],
			claimedAmount: 0,
			claimRecordVisible: false,
			collectionType: '', // 查看票面信息的类型
			invoiceModalVisible: false, // 查看票面信息弹窗visible
			claimRecordList: [], //认领历史数据
			financingForm: this.$form.createForm(this, { name: 'financing' }),
			formItemLayout: {
				labelCol: {
					xs: { span: 24 },
					sm: { span: 4 }
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 20 }
				}
			},
			formItemLayoutWithOutLabel: {
				wrapperCol: {
					xs: { span: 24, offset: 0 },
					sm: { span: 20, offset: 4 }
				}
			},
			collectionAmount: 0,
			claimAmount: 0,
			platformList: [],
			// 下游合同信息
			downContractInfo: {
				contractTemplate: '',
				generateWay: ''
			},
			dynamicValidateForm: {
				domains: [
					{
						downstreamContractCashAmount: 0, // 下游合同回款金额
						downstreamContractSettleAmount: 0, // 下游合同结算单金额
						value: '',
						key: Date.now(),
						downContractNo: '', // 下游合同编号
						financingData: [], // 下游合同线上业务回款业务线表格数据
						contractUnFinanceAmount: '', //下游合同非线上业务回款金额
						unFinancialAmount: 0 // 非线上业务回款回款金额
					}
				]
			},
			isSecondClaim: false,
			detailInfo: {},
			/** 追保函信息 */
			bondLetterList: [],
			bondLetterKeys: [],
			bondLetterId: '',
			// 选择的线上回款类型
			handleFundType: ''
		};
	},

	computed: {
		getValue() {
			const value =
				(this.collectionAmount * 100 -
					(this.collectionClaimRecordListNum * 100 + this.baseCollectionClaimRecordListNum * 100 + this.claimAmount * 100)) /
					100 || 0;
			return value;
		},

		handleType() {
			// 判断是补录还是线上
			if (this.downContractInfo.generateWay == 'SYSTEM_COLLECTION') {
				return 2;
			}
			return 1;
		},
		detailColumns() {
			if (this.handleType == 2) {
				return warehousesDetailColumns;
			}
			return detailColumns;
		},
		/** 判断是否是追保函登记 */
		isMarginCall() {
			return this.$route.query.source == 'marginCall';
		},
		initialValue() {
			if (this.$route.query.type == 'view') {
				return 'BUSINESS_FUNDS';
			}
			if (this.isMarginCall) {
				return 'BOND_LETTER';
			}
			return '';
		},
		isAgain() {
			return this.$route.query.handleType == 'again';
		}
	},

	created() {
		const { id, type, collectionType } = this.$route.query;
		this.id = id;
		// 电汇 回款类型：collectionType ELECTRONIC_ACCEPT
		this.isEa = collectionType === 'ELECTRONIC_ACCEPT' ? true : false;
		this.disabled = this.$route.query.type === 'view' || this.$route.query.type === 'detail' ? true : false;
		if (this.id) {
			this.getCollectionDetail();
		}

		if (this.isMarginCall) {
			this.initMarginCall();
		}
	},

	methods: {
		/** 从追保函进入的 初始化 */
		initMarginCall() {
			/** 设置默认平台业务回款 */
			this.$nextTick(() => {
				/** 设置下游合同信息 */
				/** 获取合同信息 */
				// 都是线上采购合同
				this.downContractInfo.generateWay = 'SYSTEM_COLLECTION';
				this.handleFundType = 'BOND_LETTER';
				this.downstreamContractNo = this.$route.query.downstreamContractNo;
				this.goodsForm.setFieldsValue({ collectionType: ['PLATFORM_COLLECTION'] });
				this.fillDownstreamContractNo();
				this.getBondLetterForCollection(this.$route.query.downstreamContractId);
				this.getContract(this.$route.query.downstreamContractNo, this.$route.query.downstreamContractId);
			});
		},
		// 获取详情
		getCollectionDetail() {
			collectionDetail(this.id).then(res => {
				const {
					serialNo,
					collectionAccount,
					collectionAmount,
					collectionDate,
					collectionMode,
					remark,
					claimedAmount,
					collectionAttachList,
					nonPlatformList,
					platformList,
					contractTemplate
				} = res.data;
				this.detailInfo = res.data;
				// 合同模板
				this.downContractInfo.contractTemplate = contractTemplate;
				this.downContractInfo.generateWay = res.data.generateWay;
				this.downContractInfo.downstreamContractId = res.data.downstreamContractId;
				this.downContractInfo.id = res.data.downstreamContractId;
				this.downContractInfo.contractNo = res.data.downstreamContractNo;

				this.baseCollectionClaimRecordListNum = claimedAmount;
				this.collectionAmount = collectionAmount;
				(collectionAttachList || []).forEach(item => {
					item.url = item.filePath;
					item.typeName = item.typeDesc;
					item.name = item.fileName;
				});
				this.nonPlatformList = nonPlatformList || [];

				this.platformList = platformList || [];

				const item = this.platformList[0] || {};
				this.handleFundType = item.fundType;
				this.fileInfos = this.attachmentTypeList = this.fileDataSource = collectionAttachList;
				this.collectionForm.setFieldsValue({
					serialNo,
					collectionAccount,
					collectionAmount,
					collectionDate,
					collectionMode,
					remark
				});
				this.isSecondClaim = !!res.data.downstreamContractNo;
				const { downstreamContractNo } = res.data;
				if (downstreamContractNo) {
					this.downstreamContractNo = downstreamContractNo;
					this.fillDownstreamContractNo();
					this.getContract(downstreamContractNo, res.data.downstreamContractId);
				}
				this.getBondLetterForCollection(res.data.downstreamContractId);

				/** 设置回款 */
				this.$nextTick(() => {
					const collectionType = this.$route.query.collectionType && this.$route.query.collectionType.split(',');
					this.goodsForm.setFieldsValue({ collectionType, downstreamContractNo });
				});
			});
		},
		fillDownstreamContractNo() {
			if (!this.downstreamContractNo) {
				return;
			}
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.goodsForm.setFieldsValue({
						downstreamContractNo: this.downstreamContractNo
					});
				});
			});
		},
		searchCompany(v) {
			// 获取公司社会代码
			if (!v) {
				return;
			}
			if(!reg.hanZi.test(v)) {
          this.$message.error('请输入至少两个汉字且以汉字结尾')
          return
      }
			this.fetching = true;
			API_GetCompanyName({ name: v })
				.then(res => {
					if (res.success) {
						setTimeout(() => {
							this.companyList = res.data;
						}, 50);
					}
				})
				.finally(() => (this.fetching = false));
		},
		onBlur(shipmentNo, str) {
			setTimeout(() => {
				if (this.getValue < 0) {
					this.$message.error('已超出可认领金额');
					return;
				}
				if (!this.goodsForm.getFieldValue(str)) {
					return;
				}
				checkShipmentIsBeyond({ shipmentNo, currentClaimAmount: this.goodsForm.getFieldValue(str) }).then(res => {
					if (res.success) {
						if (res.data) {
							this.$message.error(res.data);
						}
					}
				});
			}, 50);
		},
		claimAmountChange() {
			setTimeout(() => {
				this.claimAmount = this.goodsForm.getFieldValue('claimAmount') || 0;
			}, 50);
		},
		collectionAmountChange() {
			setTimeout(() => {
				this.collectionAmount = this.collectionForm.getFieldValue('collectionAmount') || 0;
				if (this.handleType == 2 && this.goodsData.length) {
					// 重新计算保证金
					const item = this.goodsData[0];
					if (item.fundType != 'BOND') {
						return;
					}
					item.claimAmount = this.getValue;
					this.collectionClaimRecordList = this.goodsData.map(el => {
						return {
							claimAmount: el.claimAmount,
							contractNo: el.contractNo,
							fundType: el.fundType,
							bondLetterId: this.$route.query.letterId || this.bondLetterId || ''
						};
					});
				}
			}, 50);
		},
		onChange(contractNo, shipmentNo) {
			setTimeout(() => {
				const value = this.goodsForm.getFieldsValue([`${contractNo}-${shipmentNo}-claimAmount`])[
					`${contractNo}-${shipmentNo}-claimAmount`
				];
				this.goodsData.forEach(item => {
					if (item.contractNo === contractNo) {
						(item.shipmentList || []).forEach(i => {
							if (i.shipmentNo === shipmentNo) {
								i.claimAmount = value;
							}
						});
					}
				});
				this.getCollectionClaimRecordList();
			}, 50);

			// this.goodsData.forEach((item) => {

			// })
		},

		getCollectionClaimRecordList() {
			this.collectionClaimRecordList = [];
			this.collectionClaimRecordListNum = 0;
			this.goodsData.forEach(item => {
				// if (this.goodsSelectedRowKeys.includes(item.contractNo)) {
				(item.shipmentList || []).forEach(i => {
					if (i.claimAmount && i.claimAmount > 0) {
						this.collectionClaimRecordList = [
							...this.collectionClaimRecordList,
							{
								claimAmount: i.claimAmount,
								shipmentNo: i.shipmentNo,
								contractNo: item.contractNo,
								bondLetterId: this.$route.query.letterId || this.bondLetterId || ''
							}
						];
						this.collectionClaimRecordListNum = this.collectionClaimRecordListNum + i.claimAmount;
					}
				});
				// }
			});
		},
		onChange3(info) {
			let contractNo = info.contractNo;
			this.$nextTick(() => {
				const value = this.goodsForm.getFieldsValue([`${contractNo}-fundType`])[`${contractNo}-fundType`];
				const item = this.goodsData.find(el => el.contractNo == contractNo);
				item.fundType = value;
				this.handleFundType = value;
				if (value == 'BOND_LETTER') {
					this.getBondLetterForCollection(info.id);
				}

				// this.baseCollectionClaimRecordListNum = item.claimedAmount || 0
				if (value == 'BOND') {
					// 认领金额 等于剩余可认领金额
					this.collectionClaimRecordListNum = 0;
					item.claimAmount = JSON.parse(JSON.stringify(this.getValue));
					// item.claimAmount = this.getValue
				} else {
					item.claimAmount = '';
				}
				this.collectionClaimRecordList = this.goodsData.map(el => {
					return {
						claimAmount: el.claimAmount,
						contractNo: el.contractNo,
						fundType: el.fundType,
						bondLetterId: this.$route.query.letterId || this.bondLetterId || ''
					};
				});
				this.$forceUpdate();
			});
		},
		onChange2(contractNo) {
			setTimeout(() => {
				const value = this.goodsForm.getFieldsValue([`${contractNo}-claimAmount`])[`${contractNo}-claimAmount`];
				// 赋值
				this.goodsData.forEach(item => {
					if (item.contractNo === contractNo) {
						item.claimAmount = value;
					}
				});
				this.getCollectionClaimRecordList2();
			}, 50);
		},
		getCollectionClaimRecordList2() {
			this.collectionClaimRecordList = [];
			this.collectionClaimRecordListNum = 0;
			// 计算所有本次认领金额
			this.goodsData.forEach(el => {
				if (el.claimAmount > 0) {
					this.collectionClaimRecordListNum += el.claimAmount;
				}
			});
			this.collectionClaimRecordList = this.goodsData.map(el => {
				return {
					claimAmount: el.claimAmount,
					contractNo: el.contractNo,
					fundType: el.fundType,
					bondLetterId: this.$route.query.letterId || this.bondLetterId || ''
				};
			});
		},
		onBlur2(str) {
			setTimeout(() => {
				if (this.getValue < 0) {
					this.$message.error('已超出可认领金额');
					return;
				}
				if (!this.goodsForm.getFieldValue(str)) {
					return;
				}
			}, 50);
		},

		expand(expand, record) {
			if (expand) {
				this.expandedRowKeys = [...this.expandedRowKeys, record.contractNo];
				return;
			}
			this.expandedRowKeys.splice(
				this.expandedRowKeys.findIndex(item => item === record.contractNo),
				1
			);
		},
		onChangeGoods(selectedRowKeys) {
			this.goodsSelectedRowKeys = selectedRowKeys;
			this.expandedRowKeys = selectedRowKeys;
			this.$nextTick(() => {
				this.getCollectionClaimRecordList();
				// this.goodsForm.resetFields();
				// this.goodsForm.validateFields(['claimAmount'], { force: true });
			});
			// this.$emit('selectedChange',this.goodsSelectedRowKeys)
		},
		onClick() {
			//获得下游合同编号的index
			// this.index = index // 当前编辑的线上业务回款的序号
			this.$refs.downstreamContractNo.showModal(this.id);
		},
		addFinancing() {
			//新增线上业务回款
			this.dynamicValidateForm.domains.push({
				downstreamContractCashAmount: 0, // 下游合同回款金额
				downstreamContractSettleAmount: 0, // 下游合同结算单金额
				value: '',
				key: Date.now(),
				downContractNo: '', // 下游合同编号
				financingData: [], // 下游合同线上业务回款业务线表格数据
				contractUnFinanceAmount: '', //下游合同非线上业务回款金额
				unFinancialAmount: 0 // 非线上业务回款回款金额
			});
		},
		toCancel() {
			// 票面信息弹窗关闭
			this.invoiceModalVisible = false;
		},
		payTypeChange() {},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		async onSubmit(type) {
			let isGoodsForm = false;
			let goodsFormValues = {};

			this.goodsForm.validateFields((err, values) => {
				if (!err) {
					isGoodsForm = true;
					goodsFormValues = values;
				}
			});

			this.collectionForm.validateFields((err, values) => {
				if (!isGoodsForm) {
					return;
				}
				if (!err) {
					this.collectionClaimRecordList = [];
					this.collectionClaimRecordListNum = 0;
					this.goodsData.forEach(item => {
						if (item.shipmentList) {
							(item.shipmentList || []).forEach(i => {
								if (i.claimAmount && i.claimAmount > 0) {
									this.collectionClaimRecordList.push(
										{
											claimAmount: i.claimAmount,
											shipmentNo: i.shipmentNo,
											contractNo: item.contractNo,
											bondLetterId: this.$route.query.letterId || this.bondLetterId || '',
											relationType: item.relationType
										}
									);
									this.collectionClaimRecordListNum = this.collectionClaimRecordListNum + i.claimAmount;
								}
							});
						} else {
							if (item?.claimAmount !== undefined) { 
								this.collectionClaimRecordList.push( {
									claimAmount: item.claimAmount,
									contractNo: item.contractNo,
									fundType: item.fundType,
									bondLetterId: this.$route.query.letterId || this.bondLetterId || '',
									relationType: item.relationType
								})
							}
						}
					});
					if (!isGoodsForm) {
						return;
					}
					// 请上传回款单
					if (!this.fileInfos.map(item => item.type).includes('PAYMENT_RECEIPT') && this.handleType == 1) {
						this.$message.error('请上传回款单');
						return;
					}
					if (this.getValue < 0) {
						this.$message.error('已超出可认领金额');
						return;
					}

					// if (this.goodsSelectedRowKeys.length <= 0) {
					//   this.$message.error('请选择关联合同')
					//   return
					// }

					if (!this.goodsForm.getFieldValue('collectionType').includes('NON_PLATFORM_COLLECTION')) {
						if (this.collectionClaimRecordList.length <= 0) {
							this.$message.error('请至少填写一个货物认领金额，认领金额需大于0');
							return;
						}
					}

					const collectionAttachList = this.fileInfos.map(item => {
						return {
							type: item.type,
							fileId: item.id
						};
					});

					const params = {
						...values,
						...goodsFormValues,
						collectionType: goodsFormValues.collectionType.join(','),
						collectionDate: moment(values.collectionDate).format('YYYY-MM-DD'),
						collectionClaimRecordList: this.collectionClaimRecordList,
						collectionAttachList,
						generateWay: this.downContractInfo.generateWay,
						downstreamContractNo: this.downContractInfo.contractNo || this.$route.query.downstreamContractNo || '',
						downstreamContractId: this.downContractInfo.id || this.$route.query.downstreamContractId || ''
					};
					// if (type === 'submit') {}
					if (this.id) {
						collectionClaim({ ...params, collectionId: this.id }).then(res => {
							if (res.success) {
								this.$message.success('认领成功');
								this.$router.go(-1);
							}
						});
						return;
					}
					addCollection(params).then(res => {
						if (res.success) {
							this.$message.success('提交成功');
							this.$router.go(-1);
						}
					});
				}
			});
		},

		async getContract(contractNo, downstreamContractId) {
			let res = {};
			if (this.handleType == 1) {
				res = await findByDownstreamContractNo(downstreamContractId);
				this.goodsData = res.data;
			} else {
				res = await getCollectionByContractNo(contractNo);

				res.data.generateWay = 'SYSTEM_COLLECTION';

				const platItem = this.platformList[0] || {};
				const fundType = platItem.fundType;

				if (this.$route.query.type == 'view' && this.isSecondClaim && fundType == 'BUSINESS_FUNDS') {
					// 能够重新认领的只有业务款
					const key = `${res.data.contractNo}-fundType`;
					res.data[key] = 'BUSINESS_FUNDS';
					const obj = {};
					obj[key] = 'BUSINESS_FUNDS';
					this.$nextTick(() => {
						this.goodsForm.setFieldsValue(obj);
					});

					res.data.fundType = 'BUSINESS_FUNDS';
				}
				// 追保保证金
				if (this.isMarginCall || fundType == 'BOND_LETTER') {
					const key = `${res.data.contractNo}-fundType`;
					res.data[key] = 'BOND_LETTER';
					const obj = {};
					obj[key] = 'BOND_LETTER';

					this.$nextTick(() => {
						this.$nextTick(() => {
							this.goodsForm.setFieldsValue(obj);
						});
					});
					res.data.fundType = 'BOND_LETTER';
					if (!this.isAgain) {
						res.data.bondLetterId = this.$route.query.letterId;
					}
				}
				this.goodsData = [res.data];

				this.$forceUpdate();
			}
		},
		getDownstreamContractNo(data) {
			//获取下游合同编号
			//不能选择重复的下游合同编号
			this.downContractInfo = data;
			this.goodsData = [];
			this.collectionClaimRecordList = [];
			this.collectionClaimRecordListNum = 0;
			this.goodsForm.setFieldsValue({ downstreamContractNo: data.contractNo });
			/** 补录合同*/
			this.getContract(data.contractNo, data.id);

			return;
			let contractNoPassFlag = true;
			this.dynamicValidateForm.domains.forEach(item => {
				if (item.downContractNo == data.contractNo) {
					contractNoPassFlag = false;
					this.$message.error('下游合同编号已重复，请重新选择');
				}
			});

			if (!contractNoPassFlag) return;
			this.dynamicValidateForm.domains[this.index].downContractNo = data.contractNo; //下游合同编号
			this.dynamicValidateForm.domains[this.index].downContractId = data.id; //下游合同id
			this.dynamicValidateForm.domains[this.index].downstreamContractSettleAmount = data.statementAmount
				? data.statementAmount
				: 0; //下游合同结算金额
			this.dynamicValidateForm.domains[this.index].downstreamContractCashAmount = data.paymentAmount ? data.paymentAmount : 0; //下游合同回款金额
			//可认领金额=1.有结算金额，结算金额-回款总金额的差与可认领余额取最小
			//         2.结算金额为0,取可认领金额
			if (
				this.dynamicValidateForm.domains[this.index].downstreamContractSettleAmount &&
				this.dynamicValidateForm.domains[this.index].downstreamContractCashAmount
			) {
				let differ = Number(
					this.dynamicValidateForm.domains[this.index].downstreamContractSettleAmount -
						this.dynamicValidateForm.domains[this.index].downstreamContractCashAmount
				);
				this.dynamicValidateForm.domains[this.index].canClaimAmount = Number(
					Math.min(differ < 0 ? 0 : differ, this.canClaimAmount).toFixed(2)
				);
			}
			this.dynamicValidateForm.domains[this.index].financingData = [];
			this.dynamicValidateForm.domains[this.index].contractUnFinanceAmount = 0;
			// this.getCollectionBusinessLineList(data.id)
		},
		deleteFiles(data) {
			API_PaymentApplyDeleteAttach({ id: data.id }).then(res => {
				if (res.success) {
					this.$refs.customUpload.toDelete(data);
					this.$message.success('删除成功');
				}
			});
		},
		onCheck(checkedList) {
			// 选中回款类型
			setTimeout(() => {
				if (!this.goodsForm.getFieldValue('collectionType').includes('PLATFORM_COLLECTION')) {
					this.goodsData = [];
					this.collectionClaimRecordList = [];
					this.collectionClaimRecordListNum = 0;
					this.goodsForm.setFieldsValue({ downstreamContractNo: '' });
				}
				if (!this.goodsForm.getFieldValue('collectionType').includes('NON_PLATFORM_COLLECTION')) {
					this.claimAmount = 0;
				}
				this.fillDownstreamContractNo();
			}, 50);
		},
		validateComments(rule, value, callback) {
			if (value && value.length > 150) {
				callback('备注长度不能超过150');
			}
			callback();
		},
		getDetail() {
			const func = this.isEa ? API_GetCollectionCollectionTeleDetail : API_GetCollectionCollectionBillDetail;
			func(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				} else {
					this.$message.error('网络异常，请稍后重试！');
				}
			});
		},
		invalid(items) {
			// 非线上业务回款作废
			let that = this;
			this.$confirm({
				title: '提示',
				content: '是否确认作废该条认领记录? ',
				okText: '确认',
				cancelText: '取消',
				onOk: function () {
					API_InvalidCollectionClaim({ claimId: items.id }).then(res => {
						if (res.success) {
							that.getDetail();
							that.$message.success('作废成功！');
						}
					});
				}
			});
		},
		/** 获取追保函信息 */
		async getBondLetterForCollection(contractId) {
			const params = {
				contractId
			};
			const res = await getBondLetterForCollection(params);
			this.bondLetterList = res.data;
			this.bondLetterKeys = [];
			const item = res.data[0] || {};

			//  if(this.isMarginCall || this.$route.query.type == 'detail') {
			//    this.bondLetterKeys = item.id ? [item.id] : []
			//  }
			this.bondLetterKeys = item.id ? [item.id] : [];
			if (this.isAgain) {
				this.bondLetterId = item.id;
			}
		},
		getBondSelect(arr) {
			if (this.collectionClaimRecordList[0]) {
				this.collectionClaimRecordList[0].bondLetterId = arr[0];
			}
			this.bondLetterId = arr[0];
		}
	}
};
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
	margin-bottom: 0;
}
.title {
	border-bottom: 1px solid #d8d8d8;
	font-size: 18px;
	padding: 14px 0;
	margin-bottom: 30px;

	.title_icon {
		width: 12px;
		height: 16px;
		display: inline-block;
		vertical-align: middle;
		margin: 0 14px;
		background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
	}
}
.fr {
	float: right;
}
.tc {
	text-align: center;
}
h3 {
	font-size: 18px;
	line-height: 30px;
	margin: 0 0 20px 0;
	width: 100%;
}
.row {
	font-size: 16px;
	color: #333;
	padding: 10px 0;
}
.flex-box {
	display: flex;
}
.flex-1 {
	flex: 1;
}
.center {
	align-items: center;
	justify-content: center;
}
.table {
	margin: 15px 8px;
	.cell {
		padding: 0 10px;
		height: 35px;
		line-height: 35px;
	}
}
.border {
	border: 1px solid #eef0f2;
}
.border-right {
	border-right: 1px solid #eef0f2;
}
.border-left {
	border-left: 1px solid #eef0f2;
}
.border-top {
	border-top: 1px solid #eef0f2;
}
.border-bottom {
	border-bottom: 1px solid #eef0f2;
}
.claimInfo {
	background: #fff;
	margin: 15px 0;
	padding: 16px 16px 0 16px;
	& > span {
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #383a3f;
		line-height: 24px;
	}
	& > .ant-btn {
		float: right;
	}
}
.row {
	padding-left: 30px;
	height: 60px;
	.detail-wrapper {
		width: fit-content;
		position: absolute;
		top: 10px;
		right: 0px;
	}
	::v-deep.has-error,
	.has-success {
		.ant-form-explain {
			position: absolute;
		}
	}
}
.formModel {
	margin-top: 20px;
}
.formModel ::v-deep.ant-form-item-label,
.formModel ::v-deep.ant-form-item-control-wrapper {
	text-align: left;
}
.formModel .alignRight ::v-deep.ant-form-item-label {
	text-align: right;
}
.formModel.ant-form .bigText ::v-deep.ant-form-item-label label {
	font-size: 16px;
	font-family: PingFangSC-Medium;
	color: #383a3f;
}
.ant-form-item-label {
	label {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.75);
		width: 84px;
		margin-right: 66px;
		display: inline-block;
		text-align: left;
	}
}
.claimInfo {
	.ant-row {
		line-height: 60px;
		.ant-col {
			text-align: center;
			p {
				line-height: 30px;
			}
			span {
				color: #f24e4d;
				font-size: 24px;
			}
			em {
				font-style: normal;
				color: @primary-color;
			}
		}
	}
}
</style>
