<template>
	<div class="background-wrapper">
		<a-card
			class="custom-card-title"
			title="补录上游发运数据"
			:bordered="false"
		>
		</a-card>
		<a-card
			class="custom-card-title"
			:bordered="false"
		>
			<div class="red">
				<p>说明：</p>
				<ul>
					<li>针对上游补录的线下合同，可以补录上游的发运数据</li>
					<li>数据补录后，如果对方为矿方且已在平台注册认证，则需要对方进行发运数据的确认</li>
					<li>如果对方未在平台注册认证，则无需对方进行发运数据的确认</li>
				</ul>
			</div>
		</a-card>
		<a-card
			class="custom-card-title"
			title="选择合同"
			:bordered="false"
		>
			<div class="contract-box">
				<a-form :form="form">
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="选择合同"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 16 }"
							>
								<a-input
									readOnly
									@click="showContractList"
									v-decorator="[
										`contractNo`,
										{
											rules: [
												{
													required: true,
													message: '请选择合同'
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<div class="contract-detail">
						<a-row>
							<a-col
								:span="12"
								class="row"
							>
								合同编号：<a
									@click="
										jumpPage('/center/contract/buy/offline/detail', {
											id: contractData.id,
											type: 'buy'
										})
									"
									>{{ contractData.paperContractNo }}</a
								>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								签订日期：{{ contractData.contractSignTime }}
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								买方企业：{{ contractData.buyerName }}
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								卖方企业：{{ contractData.sellerName }}
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								煤种：{{ contractData.coalTypeDesc }}
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								品名：{{ contractData.goodsName }}
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								基准价格(元/吨)：{{ contractData.followTheMarket ? '随行就市' : contractData.contractPrice }}
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								数量：{{ contractData.contractQuantity }}吨
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								交货期限：{{ contractData.execDateStart }}至{{ contractData.execDateEnd }} </a-col
							><a-col
								:span="12"
								class="row"
							>
								<a-form-item
									label="运输方式"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 16 }"
									:colon="false"
								>
									<a-select
										:getPopupContainer="
											triggerNode => {
												return triggerNode.parentNode || document.body;
											}
										"
										:disabled="
											Boolean(!contractData.transType) ||
											(Boolean(contractData.transType) && Boolean(contractData.transType !== 'AUTOMOBILE_AND_TRAIN'))
										"
										@change="handleChange"
										placeholder="请选择运输方式"
										v-model="params.despatchType"
									>
										<a-select-option
											v-for="(items, index) in transportMode"
											:key="index"
											:value="items.value"
										>
											{{ items.name }}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
						</a-row>
					</div>
				</a-form>
			</div>
		</a-card>

		<a-card
			class="custom-card-title"
			title="发运信息"
			:bordered="false"
		>
			<div class="release-apply-car-and-train">
				<div class="release-form-car">
					<a-form-model
						ref="formModel"
						:rules="rules"
						:model="params"
						layout="inline"
					>
						<!--发运方式为汽运的时候-->
						<template v-if="params.despatchType == 'AUTOMOBILE'">
							<a-row>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										prop="deliverQuantity"
										label="发货数量(吨)"
										:colon="false"
									>
										<a-input-number
											placeholder="发货数量(吨)"
											autocomplete="off"
											step="100"
											:max="9999999999.9999"
											:min="0"
											v-model="params.deliverQuantity"
										/>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										prop="deliverDate"
										label="发货日期"
										:colon="false"
									>
										<a-date-picker
											@change="handleDeliverDateChange"
											format="YYYY-MM-DD"
											placeholder="发货日期"
											:disabled-date="disabledDate"
											v-model="params.deliverDate"
										/>
										<span
											slot="extra"
											v-if="deliverDateDevMax"
										>
											发货日期与当前系统日期偏差较大，请确认发货日期是否无误，如果正确，请忽略提示
										</span>
									</a-form-model-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										prop="deliverAddr"
										label="发货地址"
										:colon="false"
									>
										<a-input
											placeholder="发货地址"
											autocomplete="off"
											v-model="params.deliverAddr"
										/>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										prop="receiveAddr"
										label="收货地址"
										:colon="false"
										class="textarea-wrap"
									>
										<a-input
											placeholder="收货地址"
											autocomplete="off"
											v-model="params.receiveAddr"
										/>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										prop="trainNum"
										label="车数"
										:colon="false"
									>
										<a-input-number
											placeholder="车数"
											autocomplete="off"
											:max="999"
											:min="0"
											v-model="params.trainNum"
										/>
									</a-form-model-item>
								</a-col>
							</a-row>
						</template>
						<!--发运方式为火运-->
						<template v-if="params.despatchType == 'TRAIN'">
							<a-row>
								<a-col
									:span="12"
									class="row flexDivShipperName"
								>
									<a-form-model-item
										prop="shipperName"
										label="托运人"
										:colon="false"
									>
										<a-select
											:getPopupContainer="
												triggerNode => {
													return triggerNode.parentNode || document.body;
												}
											"
											placeholder="托运人"
											v-model="params.shipperName"
											show-search
											:default-active-first-option="false"
											:show-arrow="false"
											:filter-option="false"
											:not-found-content="fetching ? undefined : null"
											@select="handleShipperNameSelect"
											@search="handleShipperNameSearch"
											@focus="handleShipperNameSearch"
										>
											<a-spin
												v-if="fetching"
												slot="notFoundContent"
												size="small"
											/>
											<a-select-option
												v-for="item in shipperNameList"
												:key="item.name"
												:title="item.name"
												>{{ item.name }}</a-select-option
											>
										</a-select>
									</a-form-model-item>
									<div
										class="tips-box"
										v-if="shipperNameTipsVisible"
									>
										<div class="tips-arrow"></div>
										<div class="tips-content">
											<p><a-icon type="exclamation-circle" />请仔细核对托运人是否与铁路大票中的一致</p>
											<a-icon
												type="close"
												@click="
													() => {
														shipperNameTipsVisible = false;
													}
												"
											/>
										</div>
									</div>
								</a-col>
								<a-col
									:span="12"
									class="row"
									style="display: flex; flex-direction: row; justify-content: flex-start"
								>
									<a-form-model-item
										prop="serialNo"
										label="运单号"
										:colon="false"
										style="display: flex; flex-direction: row; justify-content: flex-start"
									>
										<a-input
											placeholder="运单号"
											autocomplete="off"
											v-model="params.serialNo"
											@blur="getTrainInfo"
										/>
									</a-form-model-item>
									<p style="color: red; padding-left: 5px; padding-top: 8px">(若存在多张铁路大票，输入一个即可)</p>
								</a-col>
								<a-col
									:span="12"
									class="row flexDiv"
								>
									<a-form-model-item
										prop="deliverQuantity"
										label="发货数量(吨)"
										:colon="false"
									>
										<a-input-number
											:disabled="inputDisabled"
											placeholder="发货数量(吨)"
											autocomplete="off"
											step="100"
											:max="9999999999.9999"
											:min="0"
											v-model="params.deliverQuantity"
											@focus="quantityFocus"
										/>
									</a-form-model-item>
									<div
										class="tips-box"
										v-if="quantityTipsVisible"
									>
										<div class="tips-arrow"></div>
										<div class="tips-content">
											<p><a-icon type="exclamation-circle" />请仔细核对发货总数量是否正确</p>
											<a-icon
												type="close"
												@click="
													() => {
														quantityTipsVisible = false;
													}
												"
											/>
										</div>
									</div>
								</a-col>
								<a-col
									:span="12"
									class="row"
									style="display: flex; flex-direction: row; justify-content: flex-start"
								>
									<a-form-model-item
										label="发货日期"
										:colon="false"
										prop="deliverDate"
										style="display: flex; flex-direction: row; justify-content: flex-start"
									>
										<a-date-picker
											:disabled-date="disabledDate"
											:disabled="inputDisabled"
											v-model="params.deliverDate"
											@change="getTime"
										/>
										<span
											slot="extra"
											v-if="deliverDateDevMax"
										>
											发货日期与当前系统日期偏差较大，请确认发货日期是否无误，如果正确，请忽略提示
										</span>
									</a-form-model-item>
									<p style="color: red; padding-left: 5px; padding-top: 8px">(请确认该日期与铁路大票中的制单日期一致)</p>
								</a-col>
							</a-row>
							<a-row>
								<a-col
									:span="12"
									class="row flexDiv"
								>
									<a-form-model-item
										prop="trainNum"
										label="车数"
										:colon="false"
									>
										<a-input-number
											:disabled="inputDisabled"
											placeholder="车数"
											autocomplete="off"
											:max="999"
											:min="0"
											v-model="params.trainNum"
											@focus="trainNumFocus"
										/>
									</a-form-model-item>
									<div
										class="tips-box"
										v-if="trainNumTipsVisible"
									>
										<div class="tips-arrow"></div>
										<div class="tips-content">
											<p><a-icon type="exclamation-circle" />请仔细核对发货总车数是否正确</p>
											<a-icon
												type="close"
												@click="
													() => {
														trainNumTipsVisible = false;
													}
												"
											/>
										</div>
									</div>
								</a-col>
								<!-- 神华外购，发货日期、发站、到站、铁路计划号可填写，发货日期、发站、到站必填 ，数据从订单信息里取-->
								<template v-if="!isLYGJ">
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="发站"
											prop="deliveryStation"
											:colon="false"
										>
											<a-select
												mode="tags"
												v-model="params.deliveryStation"
												:getPopupContainer="
													triggerNode => {
														return triggerNode.parentNode || document.body;
													}
												"
											>
											</a-select>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											prop="arriveStation"
											label="到站"
											:colon="false"
										>
											<a-select
												mode="tags"
												v-model="params.arriveStation"
												:getPopupContainer="
													triggerNode => {
														return triggerNode.parentNode || document.body;
													}
												"
											>
											</a-select>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="铁路计划号"
											:colon="false"
											prop="railwayPlanNo"
										>
											<a-input
												autocomplete="off"
												:maxLength="20"
												v-model="params.railwayPlanNo"
											/>
										</a-form-model-item>
									</a-col>
								</template>
								<!-- 联运管家，发货日期、发站、到站、铁路计划号不可填写，数据从运单信息里取-->
								<template v-if="isLYGJ">
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="发站"
											prop="departureStation"
											:colon="false"
										>
											<a-input
												disabled
												autocomplete="off"
												v-model="trainInfoData.departureStation"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="到站"
											:colon="false"
											prop="arriveStation"
										>
											<a-input
												disabled
												autocomplete="off"
												v-model="trainInfoData.arriveStation"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="铁路计划号"
											:colon="false"
											prop="demandNo"
										>
											<a-input
												disabled
												autocomplete="off"
												v-model="trainInfoData.demandNo"
											/>
										</a-form-model-item>
									</a-col>
								</template>
							</a-row>
						</template>
						<template v-if="params.despatchType == 'SHIP'">
							<a-row>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										label="装货数量(吨)"
										:colon="false"
										prop="deliverQuantity"
									>
										<a-input-number
											placeholder="装货数量(吨)"
											autocomplete="off"
											step="100"
											:max="9999999999.9999"
											:min="0"
											v-model="params.deliverQuantity"
										/>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										label="装货日期"
										:colon="false"
										prop="deliverDate"
									>
										<a-date-picker
											placeholder="装货日期"
											:disabled-date="disabledDate"
											v-model="params.deliverDate"
										/>
										<span
											slot="extra"
											v-if="deliverDateDevMax"
										>
											发货日期与当前系统日期偏差较大，请确认发货日期是否无误，如果正确，请忽略提示
										</span>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										label="装货港"
										:colon="false"
										prop="shipLoadingPortName"
									>
										<a-input
											v-model="params.originPortName"
											disabled
										/>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										label="卸货港"
										:colon="false"
										prop="shipDischargingPortName"
									>
										<a-input
											v-model="params.destinationPortName"
											disabled
										/>
									</a-form-model-item>
								</a-col>
							</a-row>
						</template>
					</a-form-model>
				</div>

				<!-- 车辆信息-start -->
				<div v-if="params.despatchType == 'AUTOMOBILE'">
					<CarInfo
						:freightPayType="freightPayType"
						@dataSource="getDataSourceCar"
						:datas="dataSourceCar"
						type="release"
						:popCar="{
							show: false,
							orderSerialNo: contractData.contractNo,
							orderType: 'OFFLINE' //补录合同
						}"
					/>
				</div>
				<!-- 车辆信息-end -->

				<!-- 车皮信息-start -->
				<train-info-new
					:datas="trainInfoData"
					:params="params"
					v-if="params.despatchType == 'TRAIN' && isLYGJ"
				></train-info-new>
				<TrainInfo
					v-if="params.despatchType == 'TRAIN' && !isLYGJ"
					:freightPayType="freightPayType"
					@dataSource="getDataSourceTrain"
					:params="params"
					:datas="dataSourceTrain"
				/>
				<!-- 车皮信息-end -->
				<!-- 船舶信息-start  -->
				<ShipInfo
					v-if="params.despatchType == 'SHIP'"
					:freightPayType="freightPayType"
					@dataSource="getDataSource"
					:dataSource="dataSource"
				/>
				<!-- 船舶信息-end  -->
			</div>
		</a-card>
		<a-card
			class="custom-card-title"
			title="发货附件"
			:bordered="false"
		>
			<div class="upload-block">
				<CustomUpload
					:despatchType="params.despatchType"
					:transType="params.transType"
					:coalType="params.coalType"
					:contractTemplate="params.contractTemplate"
					:detail="params"
					:isNeedRotate="true"
					:ifEditable="true"
					@uploadFiles="getUploadFiles"
					:fileDataSource="fileDataSource"
					:type="'logistics'"
				/>
			</div>
			<div class="btn-wrap">
				<a-button @click="$router.go(-1)">返回</a-button>
				<a-button
					:disabled="disabledSubmit"
					type="primary"
					@click="submitReleaseForm('submit')"
					>提交</a-button
				>
			</div>
		</a-card>
		<a-modal
			id="contractModal"
			title="选择合同(仅支持上游补录的合同，且上游矿方已上线)"
			v-model="contractSearchModal"
			@cancel="
				() => {
					contractSearchModal = false;
				}
			"
			@ok="validateContract"
		>
			<a-form
				layout="inline"
				class="search-wrap"
			>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="合同编号"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParams.paperContractNo"
								placeholder="请输入订单编号"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="企业名称"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParams.companyName"
								placeholder="请输入企业名称"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="煤种"
							class="order-wrap"
							:colon="false"
						>
							<a-select
								v-model="searchModalParams.coalType"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
							>
								<a-select-option
									v-for="(items, index) in typeData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="签订日期"
							class="order-wrap"
							:colon="false"
						>
							<a-range-picker
								v-model="signTime"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getSignTime"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item>
							<a-button
								type="primary"
								@click="searchSubmit"
								class="search-btn"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetValues"
							>
								重置
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				bordered
				:rowSelection="rowSelection"
				:dataSource="contractList"
				:columns="contractColumns"
				:pagination="pagination"
				:rowKey="record => record.id"
				:customRow="onClickRow"
				@change="handleTableChange"
			>
				<template
					slot="execDateEnd"
					slot-scope="execDateEnd, items"
				>
					<p v-if="items.execDateStart">{{ items.execDateStart }}～{{ items.execDateEnd }}</p>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>
<script>
import { filterCodeByKey, filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_getCommonGetCompanyDetailFromQichacha,
	API_getDeliverInfoTrains,
	API_getApiTrainDeliverShipper,
	API_saveTrainDeliverShipper,
	getLogisticsDetail,
	getLogisticsTerminalDelivery,
	getLogisticsContractList,
	getLogisticsSubmit
} from '@/v2/center/trade/api/coal';
import moment from 'moment';
import { mapGetters } from 'vuex';
import CarInfo from '@/v2/center/trade/components/receive/CarInfo.vue';
import TrainInfo from '@/v2/center/trade/components/receive/TrainInfo.vue';
import TrainInfoNew from '@/v2/center/trade/components/receive/TrainInfoNew';
import ShipInfo from '@/v2/center/trade/components/receive/ShipInfo.vue';
import CustomUpload from '@/v2/components/CustomUpload';
import { getPopupContainer } from '@/v2/utils/factory.js';
import reg from '@sub/utils/reg.js'
const columns = [
	{
		title: '文件类型',
		key: 'typeName',
		dataIndex: 'typeName'
	},
	{
		title: '文件格式',
		key: 'ext',
		dataIndex: 'ext'
	},
	{
		title: '文件名',
		key: 'transferName',
		dataIndex: 'transferName'
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
const contractColumns = [
	{ title: '合同编号', key: 'paperContractNo', dataIndex: 'paperContractNo' },
	{ title: '卖方企业名称', key: 'sellerName', dataIndex: 'sellerName' },
	{ title: '买方企业名称', key: 'buyerName', dataIndex: 'buyerName' },
	{ title: '煤种', dataIndex: 'coalTypeDesc' },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transTypeDesc', width: 100 },
	{
		title: '数量(吨)',
		dataIndex: 'contractQuantity',
		align: 'center'
	},
	{
		title: '基准价格(元/吨)',
		dataIndex: 'contractPrice',
		align: 'center',
		width: 150,
		customRender: (text, record) => {
			return record.followTheMarket ? '随行就市' : text;
		}
	},
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{
		title: '交货期限',
		dataIndex: 'execDateStart',
		key: 'execDateStart',
		scopedSlots: { customRender: 'execDateEnd' }
	}
];
const operationLogColumns = [
	{
		title: '操作类型',
		key: 'operationType',
		dataIndex: 'operationType'
	},
	{
		title: '操作人-所属公司',
		key: 'operationBy',
		dataIndex: 'operationBy'
	},
	{
		title: '操作内容',
		key: 'comments',
		dataIndex: 'comments'
	},
	{
		title: '操作时间',
		key: 'operationTime',
		dataIndex: 'operationTime'
	}
];
export default {
	components: {
		CustomUpload,
		CarInfo,
		TrainInfo,
		TrainInfoNew,
		ShipInfo
	},
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验运单号
			if (value.length != 12 && value.length != 13) {
				return callback('运单号为12位或者13位');
			} else {
				return callback();
			}
		};
		let validateQuantity = (rule, value, callback) => {
			// 校验发货数量
			let regs2 = /^\d+(\.\d{0,4})?$/;
			if (!regs2.test(value) || Number(value) >= rule.max) {
				return callback('发货数量不大于999999999.9999吨，最多四位小数');
			} else {
				return callback();
			}
		};
		return {
			getPopupContainer,
			columns,
			contractColumns,
			operationLogColumns,
			previewImg: '',
			batchNo: this.$route.query.batchNo,
			form: this.$form.createForm(this),
			contractSearchModal: false,
			typeData: filterCodeByKey('goods_type'),
			transportMode: [
				{ name: '汽运', value: 'AUTOMOBILE' },
				{ name: '火运', value: 'TRAIN' },
				{ name: '船运', value: 'SHIP' }
			],
			searchModalParams: {
				paperContractNo: '',
				companyName: '',
				coalType: undefined
			},
			pagination: {},
			signTime: null,
			selectedRowKeys: [],
			selected: {},
			contractList: [],
			contractData: {},
			rawData: {},
			steps: [{ title: '选择销售订单' }, { title: '填写发货信息' }, { title: '完成' }],
			dataSourceCar: [],
			dataSourceTrain: [],
			dataSource: [],
			params: {},
			fileInfos: [],
			// modalPdfIsShow:false,
			pdfUrl: '',
			fileDataSource: [],
			freightPayType: '',
			shipperNameList: [],
			fetching: false,
			timer: null,
			ownerFetching: false,
			ownerTimer: null,
			nameFetching: false,
			nameTimer: null,
			platformList: filterCodeByKey('platform_type'),
			defaultDetail: {},
			query: {},
			rulesDefault: {
				deliverQuantity: [
					{
						required: true,
						message: '请输入发货数量',
						trigger: 'change'
					},
					{
						validator: validateQuantity,
						trigger: 'change'
					}
				],
				deliverDate: [
					{
						required: true,
						message: '请输入发货日期',
						trigger: ['change'],
						whitespace: true
					},
					{
						validator: this.validateDeliverDate,
						trigger: ['change']
					}
				],
				trainNum: [
					{
						required: true,
						message: '请输入车数',
						trigger: ['blur']
					},
					{
						pattern: /^[0-9]*[1-9][0-9]*$/,
						message: '车数为正整数',
						trigger: ['blur']
					}
				]
			},
			rulesTrain: {
				serialNo: [
					{
						required: true,
						message: '请输入运单号',
						trigger: 'change',
						whitespace: true
					},
					{
						validator: validatePass,
						trigger: 'blur'
					}
				],
				shipperName: [
					{
						required: true,
						message: '请输入托运人',
						trigger: ['change', 'blur'],
						whitespace: true
					}
				],
				deliveryStation: [
					{
						required: true,
						message: '请输入发站',
						trigger: ['change', 'blur'],
						type: 'array',
						transform: value => {
							return value.filter(item => {
								return item.trim();
							});
						}
					},
					{
						validator: this.validateDeliveryStation,
						trigger: ['change', 'blur']
					}
				],
				arriveStation: [
					{
						required: true,
						message: '到站必填',
						trigger: ['change', 'blur'],
						type: 'array',
						transform: value => {
							return value.filter(item => {
								return item.trim();
							});
						}
					}
				],
				railwayPlanNo: [
					{
						required: false,
						message: '铁路计划号必填',
						trigger: ['change', 'blur']
					}
				]
			},
			rulesTrainLYGJ: {
				deliverDate: [
					{
						required: true,
						message: '请输入发货日期',
						trigger: ['change']
					},
					{
						validator: this.validateDeliverDate,
						trigger: ['change']
					}
				],
				shipperName: [
					{
						required: true,
						message: '请输入托运人',
						trigger: 'change',
						whitespace: true
					}
				],
				deliverQuantity: [
					{
						required: true,
						message: '请输入发货数量',
						trigger: 'change'
					},
					{
						validator: validateQuantity,
						trigger: 'change'
					}
				],
				trainNum: [
					{
						required: true,
						message: '请输入车数',
						trigger: 'change'
					},
					{
						pattern: /^[0-9]*[1-9][0-9]*$/,
						message: '车数为正整数',
						trigger: 'change'
					}
				],
				serialNo: [
					{
						required: true,
						message: '请输入运单号',
						trigger: 'change',
						whitespace: true
					},
					{
						validator: validatePass,
						trigger: 'blur'
					}
				]
			},
			rulesCar: {
				deliverAddr: [
					{
						required: true,
						message: '请输入发货地址',
						trigger: ['blur'],
						whitespace: true
					}
				],
				receiveAddr: [
					{
						required: true,
						message: '请输入收货地址',
						trigger: ['blur'],
						whitespace: true
					}
				]
			},
			rulesShip: {
				deliverQuantity: [{ required: true, message: '请输入装货数量' }, { validator: validateQuantity }],
				deliverDate: [
					{ required: true, message: '请输入日期' },
					{
						validator: this.validateDeliverDate,
						trigger: ['change']
					}
				],
				shipLoadingPortName: [
					{
						required: true,
						message: '请选择装货港',
						type: 'array',
						transform: value => {
							return value.filter(item => {
								return item.trim();
							});
						}
					},
					{
						validator: this.validateDeliveryStation,
						trigger: ['change', 'blur']
					}
				],
				shipDischargingPortName: [
					{
						required: true,
						type: 'array',
						transform: value => {
							return value.filter(item => {
								return item.trim();
							});
						},
						message: '请选择卸货港'
					}
				]
			},
			ownerNameList: [], // 通过企查查，拿到的客户名称列表
			currentGoodsSource: {},
			filterCodeByValueName: filterCodeByValueName,
			trainInfoData: '', // 车皮信息
			isLYGJ: true, // 是否是联运管家
			pushFlag: false, // 判断是否属于人工手工输入托运人
			quantityTipsVisible: false, // 发货数量提示展示
			trainNumTipsVisible: false, // 车数提示展示
			shipperNameTipsVisible: false, // 托运人提示展示
			isWholeTrain: false, // 是否是整列运输
			serialNo: '', // 初始运单号
			shipperNameOld: '', // 初始托运人
			inputDisabled: false, // 手动录入信息是否开放输入
			deliverDateDevMax: false, //选择的时间是否偏差过大
			disabledSubmit: false
		};
	},
	filters: {
		filterCodeByValueName
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.selected = record;
				}
			};
		},
		terminalDelivery() {
			return this.contractData.terminalDelivery || {};
		},
		//附件信息
		contractAttachment() {
			return this.contractData.contractAttachment ? [this.contractData.contractAttachment] : [];
		},

		rules() {
			let rules = {};
			if (this.params.despatchType === 'AUTOMOBILE') {
				//汽运
				Object.assign(rules, this.rulesDefault, this.rulesCar);
			} else if (this.params.despatchType === 'TRAIN') {
				//huoyun
				if (this.isLYGJ) {
					// 联运管家
					Object.assign(rules, this.rulesTrainLYGJ);
				} else {
					// 神华外购
					Object.assign(rules, this.rulesDefault, this.rulesTrain);
				}
			} else if (this.params.despatchType === 'SHIP') {
				//船运
				Object.assign(rules, this.rulesShip);
			}
			return { ...rules };
		}
	},
	watch: {
		dataSource: function (data) {
			if (data.length > 0) {
				let originPortNameArr = [];
				let destinationPortNameArr = [];
				data.forEach(item => {
					originPortNameArr.push(item.originPortName);
					destinationPortNameArr.push(item.destinationPortName);
				});
				originPortNameArr = [...new Set(originPortNameArr)];
				destinationPortNameArr = [...new Set(destinationPortNameArr)];
				this.params.originPortName = originPortNameArr.join(',');
				this.params.destinationPortName = destinationPortNameArr.join(',');
			}
		}
	},
	switch: {
		params(data) {
			this.params = data;
		}
	},
	created() {
		if (this.batchNo) {
			this.getEditDetail();
		}
	},
	methods: {
		//选择合同弹框
		showContractList() {
			this.contractSearchModal = true;
			this.resetValues();
		},
		//选择合同重置
		resetValues() {
			this.searchModalParams = {
				paperContractNo: '',
				companyName: '',
				coalType: '',
				contractSignTimeBegin: '',
				contractSignTimeEnd: ''
			};
			this.signTime = null;
			this.pagination = {
				current: 1
			};
			this.getList();
		},
		//查询合同列表
		searchSubmit() {
			this.searchModalParams.pageNo = 1;
			this.pagination = {
				current: 1
			};
			this.getList(this.searchModalParams);
		},
		//加载合同列表
		getList(params) {
			getLogisticsContractList(params).then(res => {
				if (res.success) {
					let result = res.result || res.data;
					this.contractList = result.records;
					const pagination = {
						total: result.total,
						pageSize: result.size,
						current: result.current,
						showTotal: function (total) {
							return `共${total}条记录 第${result.current}页 `;
						}
					};
					this.pagination = pagination;
				}
			});
		},
		//获取合同签订时间
		getSignTime(value, dateString) {
			this.searchModalParams.contractSignTimeBegin = dateString[0];
			this.searchModalParams.contractSignTimeEnd = dateString[1];
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.selected = record;
					}
				}
			};
		},
		handleTableChange(pagination) {
			this.searchModalParams.pageNo = pagination.current;
			this.getList(this.searchModalParams);
		},
		validateContract() {
			// 校验合同
			if (this.selectedRowKeys.length === 0) {
				this.$message.error('请选择合同！');
				return;
			}
			//清空信息
			this.params = {};
			this.contractData = Object.assign({}, this.selected);
			if (this.contractData.transType == 'AUTOMOBILE_AND_TRAIN') {
				//汽运与火运时，可选择
				this.$set(this.params, 'despatchType', 'AUTOMOBILE');
				this.transportMode = [
					{ name: '汽运', value: 'AUTOMOBILE' },
					{ name: '火运', value: 'TRAIN' }
				];
			} else {
				this.$set(this.params, 'despatchType', this.contractData.transType);
				this.transportMode = [
					{ name: '汽运', value: 'AUTOMOBILE' },
					{ name: '火运', value: 'TRAIN' },
					{ name: '船运', value: 'SHIP' }
				];
			}
			this.$set(this.params, 'transType', this.contractData.transType);
			this.$set(this.params, 'coalType', this.contractData.coalType);
			this.$set(this.params, 'contractTemplate', this.CONSTANTS.contractTemplateDict.OFFLINE);
			this.form.setFieldsValue({
				contractNo: this.contractData.paperContractNo
			});
			//查询补录合同发运信息，反显合同地址数据
			getLogisticsTerminalDelivery(this.contractData.id).then(res => {
				if (res.success && res.data) {
					this.contractData = Object.assign(this.contractData, res.data, {
						id: this.contractData.id
					});
					this.clearData();
					//重新赋值
					this.assignment();
				}
			});
			this.contractSearchModal = false;
		},
		// 切换发运平台
		handleChange(val) {
			this.$refs.formModel.clearValidate();
			this.$set(this.params, 'despatchType', val);
			this.clearData();
			//重新赋值
			this.assignment();
		},
		// 切换平台或发运方式时，清空基本信息
		clearData() {
			this.dataSourceCar = []; //车号信息
			this.trainInfoData = ''; //车皮信息（联运管家）
			this.dataSourceTrain = []; //车皮信息
			this.dataSource = []; //船舶信息
			this.fileDataSource = [];
			this.$set(this.params, 'serialNo', undefined);
			this.$set(this.params, 'deliverAddr', undefined);
			this.$set(this.params, 'receiveAddr', undefined);
			this.$set(this.params, 'trainNum', undefined);
			this.$set(this.params, 'deliverQuantity', undefined);
			this.$set(this.params, 'deliverDate', undefined);
		},
		//重新赋值
		assignment() {
			//船运
			if (this.params.despatchType == 'SHIP') {
				this.$set(
					this.params,
					'shipLoadingPortName',
					typeof this.contractData.shipLoadingPortName === 'string'
						? this.contractData.shipLoadingPortName.split(',')
						: this.contractData.shipLoadingPortName
				);
				this.$set(
					this.params,
					'shipDischargingPortName',
					typeof this.contractData.shipDischargingPortName === 'string'
						? this.contractData.shipDischargingPortName.split(',')
						: this.contractData.shipDischargingPortName
				);
			}
			if (this.params.despatchType == 'TRAIN') {
				//火运
				//判断合同地址还是详情地址
				if (this.contractData.trainArriveStationName) {
					this.$set(
						this.params,
						'arriveStation',
						typeof this.contractData.trainArriveStationName === 'string'
							? this.contractData.trainArriveStationName.split(',')
							: this.contractData.trainArriveStationName
					);
				} else {
					this.$set(
						this.params,
						'arriveStation',
						typeof this.contractData.arriveStation === 'string'
							? this.contractData.arriveStation.split(',')
							: this.contractData.arriveStation
					);
				}
				if (this.contractData.trainSendStationName) {
					this.$set(
						this.params,
						'deliveryStation',
						typeof this.contractData.trainSendStationName === 'string'
							? this.contractData.trainSendStationName.split(',')
							: this.contractData.trainSendStationName
					);
				} else {
					this.$set(
						this.params,
						'deliveryStation',
						typeof this.contractData.deliveryStation === 'string'
							? this.contractData.deliveryStation.split(',')
							: this.contractData.deliveryStation
					);
				}
			}
			//汽运
			if (this.params.despatchType == 'AUTOMOBILE') {
				this.$set(this.params, 'receiveAddr', this.contractData.receiveGoodsAddress);
				this.$set(this.params, 'deliverAddr', this.contractData.sendGoodsAddress);
			}
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		moment(val) {
			return moment(val).locale('zh-cn').format('YYYY-MM-DD');
		},
		handleDeliverDateChange(val, string) {
			this.$set(this.params, 'deliverDate', string);
			// this.params.deliverDate = string
		},
		//跳转页面
		jumpPage(path, query) {
			this.$router.push({
				path,
				query
			});
		},
		// 通过企查查 模糊查询公司名称
		getCompanyListByQCC(name) {
			if (!name && !this.params.ownerName) return false;
			clearTimeout(this.ownerTimer);
			this.ownerFetching = true;
			this.ownerTimer = setTimeout(() => {
				API_getCommonGetCompanyDetailFromQichacha({
					keyword: name || this.params.ownerName
				}).then(resp => {
					this.ownerFetching = false;
					/**
           * [{"creditCode": "913711006138077718",
            "name": "山东鼎新电子玻璃集团有限公司"}]
           */
					if (resp.success) this.ownerNameList = resp.result || [];
				});
			}, 300);
		},
		// 修改获取初始化信息
		getEditDetail() {
			getLogisticsDetail(this.batchNo).then(res => {
				if (res.success) {
					// 设置发货信息
					this.params = { ...res.data };
					this.contractData = { ...res.data, id: res.data.contractId }; //合同信息
					this.contractData.transType = res.data.contractTransType; //合同运输方式
					if (this.contractData.transType == 'AUTOMOBILE_AND_TRAIN') {
						//汽运与火运时，可选择
						this.transportMode = [
							{ name: '汽运', value: 'AUTOMOBILE' },
							{ name: '火运', value: 'TRAIN' }
						];
					}
					this.$nextTick(() => {
						this.form.setFieldsValue({
							contractNo: this.contractData.paperContractNo
						});
					});
					//运输方式
					this.$set(this.params, 'despatchType', res.data.transType);
					this.rawData = res.data;
					this.serialNo = res.data.serialNo; // 获取运单号的初始值
					this.shipperNameOld = res.data.shipperName; // 获取托运人的初始值
					//铁路计划号
					this.$set(this.params, 'railwayPlanNo', this.params.railwayPlanNo);
					if (this.params.despatchType === 'AUTOMOBILE') {
						this.$set(this.params, 'arriveStation', undefined); // 到站
						this.$set(this.params, 'deliveryStation', undefined); // 发站
					} else if (this.params.despatchType === 'TRAIN') {
						// 发运方式为火运判断联运管家
						API_getDeliverInfoTrains({
							shipperName: this.params.shipperName,
							code: this.params.shipperCode,
							serialNo: this.params.serialNo
						}).then(res => {
							if (res.success) {
								if (res.data) {
									// 联运管家模式
									this.isLYGJ = true;
									this.trainInfoData = res.data;
								} else {
									// 神华外购模式
									this.isLYGJ = false;
									// 老数据修改先按最新的联运管家方式，车皮信息不展示,输入运单号时再判断是否时神华外购
									this.trainInfoData = '';
								}
							}
						});
					}

					this.defaultDetail = Object.assign({}, this.params);
					this.dealModifyData();
				}
			});
		},
		// 修改信息初始化
		dealModifyData() {
			// 参数赋值
			this.assignment();
			// 设置车辆信息
			if (this.params.deliveryInfoTruck && this.params.deliveryInfoTruck.length > 0) {
				this.dataSourceCar = [];
				this.params.deliveryInfoTruck.forEach((item, i) => {
					this.dataSourceCar.push({
						key: i,
						...item
					});
				});
			}

			// 设置车皮信息
			if (this.params.deliveryInfoTrain && this.params.deliveryInfoTrain.length > 0) {
				this.dataSourceTrain = [];
				this.params.deliveryInfoTrain.forEach((item, i) => {
					this.dataSourceTrain.push({
						key: i,
						transTicketNo: item.transTicketNo,
						deliverQuantity: item.deliverQuantity,
						trainNo: item.trainNo,
						trainType: item.trainType
					});
				});
			}
			// 设置船舶信息
			if (this.params.deliveryInfoShip && this.params.deliveryInfoShip.length > 0) {
				this.dataSource = [];
				this.params.deliveryInfoShip.forEach((item, i) => {
					this.dataSource.push({
						key: i,
						shipName: item.shipName,
						identifierNo: item.identifierNo,
						voyageNo: item.voyageNo,
						deliverQuantity: item.deliverQuantity,
						originPortName: item.originPortName,
						originPortInTime: item.originPortInTime,
						destinationPortName: item.destinationPortName,
						destinationPortInTime: item.destinationPortInTime,
						shipId: item.shipId
					});
				});
			}

			// 设置附件信息
			this.fileDataSource = this.params.deliverAttachmentList || [];
			this.freightPayType = this.params.freightPayType; // 支付方式
		},
		// 校验发站
		validateDeliveryStation(rule, value, callback) {
			if (value) {
				if (Array.isArray(value) && value.length > 1) {
					callback('只能选择一个发站');
				}
			}
			callback();
		},
		// 校验发货时间，当发货时间和当前时间差大于30天时提示
		validateDeliverDate(rule, value, callback) {
			if (Math.abs(moment().diff(moment(value), 'days')) > 30) {
				this.deliverDateDevMax = true;
			} else {
				this.deliverDateDevMax = false;
			}
			callback();
		},
		// 获取保存和提交的参数
		getParams() {
			const bodyObj = {
				batchNo: this.batchNo, //批次号
				contractId: this.contractData.id, //补录合同id
				transportMode: this.params.despatchType, //运输方式
				receiveAddr: this.params.receiveAddr,
				shipperName: this.params.shipperName, //托运人
				deliverQuantity: this.params.deliverQuantity, //发货数量
				deliverDate: this.params.deliverDate ? this.moment(this.params.deliverDate) : undefined, //发货日期
				trainNum: this.params.trainNum, //车数
				deliverAddr: this.params.deliverAddr,
				orderId: this.params.orderId
			};
			if (this.params.despatchType === 'TRAIN') {
				bodyObj.deliveryInfoTrain = this.dataSourceTrain;
				bodyObj.deliveryStation =
					typeof this.params.deliveryStation !== 'string'
						? this.params.deliveryStation
								.filter(item => {
									return item.trim();
								})
								.join(',')
						: this.params.deliveryStation; //发站
				bodyObj.arriveStation =
					typeof this.params.arriveStation !== 'string'
						? this.params.arriveStation
								.filter(item => {
									return item.trim();
								})
								.join(',')
						: this.params.arriveStation; //到站
				bodyObj.railwayPlanNo = this.params.railwayPlanNo || '';
				bodyObj.shipperCode = this.params.shipperCode || '';
			} else if (this.params.despatchType === 'AUTOMOBILE') {
				bodyObj.deliveryInfoTruck = this.dataSourceCar;
			} else if (this.params.despatchType === 'SHIP') {
				bodyObj.shipLoadingPortName =
					typeof this.params.shipLoadingPortName !== 'string'
						? this.params.shipLoadingPortName
								.filter(item => {
									return item.trim();
								})
								.join(',')
						: this.params.shipLoadingPortName;
				bodyObj.shipDischargingPortName =
					typeof this.params.shipDischargingPortName !== 'string'
						? this.params.shipDischargingPortName
								.filter(item => {
									return item.trim();
								})
								.join(',')
						: this.params.shipDischargingPortName;
				bodyObj.deliveryInfoShip = this.dataSource;
			}

			return bodyObj;
		},
		// 保存/提交
		submitReleaseForm(type) {
			this.form.validateFieldsAndScroll(err => {
				if (!err) {
					this.$refs.formModel.validate(valide => {
						//火运
						if (
							this.params.despatchType == 'TRAIN' &&
							(this.isLYGJ ? this.trainInfoData.length < 1 : this.dataSourceTrain.length < 1)
						) {
							this.$message.error('请至少录入一车皮信息');
							return false;
						} else if (this.params.despatchType == 'AUTOMOBILE' && this.dataSourceCar.length < 1) {
							this.$message.error('请至少录入一条车号信息');
							return false;
						} else if (this.params.despatchType == 'SHIP' && this.dataSource.length < 1) {
							this.$message.error('请至少录入一条船舶信息');
							return false;
						} else if (
							// 校验历史数据，没有始发港、目的港数据时不能提交
							this.params.despatchType == 'SHIP' &&
							this.dataSource.length > 0
						) {
							let flag = true;
							this.dataSource.forEach(el => {
								if (!el.originPortName || !el.originPortInTime || !el.destinationPortName) {
									flag = flag && false;
								}
							});
							if (!flag) {
								this.$message.error('始发港、始发港到港时间、目的港不能为空');
								return false;
							}
						}
						if (valide) {
							// 获取参数
							// let fileObj = this.getFileObj() // 附件数据
							let bodyObj = this.getParams(); // 其他信息
							bodyObj.fileInfoList = this.fileInfos;
							if (!this.validateFileType()) {
								return false;
							}
							// Object.assign(bodyObj,fileObj)
							if (this.params.despatchType == 'TRAIN') {
								// 联运管家传的字段不同
								if (this.isLYGJ) {
									let deliverWaybillInfoResp = [
										{
											transTicketNo: this.trainInfoData.serialNo,
											deliverQuantity: this.trainInfoData.weight,
											trainNo: this.trainInfoData.carNumber,
											trainType: this.trainInfoData.carType
										}
									];
									Object.assign(bodyObj, {
										deliveryInfoTrain: deliverWaybillInfoResp, // 新数据联运管家
										arriveStation: this.trainInfoData.arriveStation,
										deliveryStation: this.trainInfoData.departureStation,
										railwayPlanNo: this.trainInfoData.demandNo,
										deliverDate: this.params.deliverDate
									});
								}
								Object.assign(bodyObj, {
									serialNo: this.params.serialNo,
									/**联运管家返回departureTime为null的情况，用户手动录入发货日期。取值为2
              联运管家返回departureTime不为null的情况，取值为0
              联运管家返回无数据，或者神华外购，属于手动录入 取值为1
            **/
									handInput: this.isLYGJ ? (this.params.deliverDate.split(' ')[0] == this.departureTime ? 0 : 2) : 1
								});
								this.saveAndSubmit(type, bodyObj);
							} else {
								this.saveAndSubmit(type, bodyObj);
							}
						}
					});
				}
			});
		},
		//附件验证
		validateFileType() {
			let typeArr = this.fileInfos.map(item => {
				return item.type;
			});
			typeArr = [...new Set(typeArr)];
			if (this.params.despatchType == 'AUTOMOBILE') {
				//汽运磅单必填
				if (!typeArr.includes('BD')) {
					this.$message.error('请上传收货对应的磅单附件');
					return false;
				}
				return true;
			} else if (this.params.despatchType == 'TRAIN') {
				//火运称铁路大票必填
				if (!typeArr.includes('DP')) {
					this.$message.error('请上传收货对应的铁路大票附件');
					return false;
				}
				return true;
			} else if (this.params.despatchType == 'SHIP') {
				//船运称重凭证必填
				if (!typeArr.includes('CZPZ')) {
					this.$message.error('请上传收货对应的称重凭证附件');
					return false;
				}
				return true;
			} else {
				return true;
			}
		},
		// 校验到站
		validateArriveStation(obj, contractParamsArr) {
			let arr = obj.split(',');
			let flag = true;
			arr.forEach(item => {
				flag = flag && contractParamsArr.indexOf(item) != -1;
			});
			return flag;
		},
		saveAndSubmit(type, bodyObj) {
			//保存或提交
			this.submitFun(Object.assign({}, bodyObj));
		},

		submitFun(obj) {
			const that = this;
			this.$confirm({
				centered: true,
				title: '请确认信息填写完成并提交',
				okText: '确定',
				content: '提交后，发运数据将推送给对方，由对方进行发运数据确认。对方确认后，你可以进行收货相关操作',
				cancelText: '取消',
				onOk() {
					that.disabledSubmit = true;
					return getLogisticsSubmit(obj)
						.then(res => {
							if (res.success) {
								that.$message.success('发货申请提交成功').then(() => that.$router.go(-1));
							}
						})
						.finally(() => {
							that.disabledSubmit = false;
						});
				},
				onCancel() {}
			});
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		getDataSourceCar(data) {
			this.dataSourceCar = data;
		},
		getDataSourceTrain(data) {
			this.dataSourceTrain = data;
		},
		getDataSource(data) {
			this.dataSource = data;
		},
		transferData(str) {
			// 新数据为json字符串，老数据为string
			if (typeof str == 'string') {
				try {
					var obj = JSON.parse(str);
					if (typeof obj == 'object' && obj) {
						return obj;
					}
				} catch (e) {
					return str.split(',');
				}
			} else {
				return str;
			}
		},
		// 联运管家
		handleShipperNameSelect(val) {
			// 选中托运人
			this.shipperNameList.forEach(item => {
				if (item.name == val) {
					this.params.shipperCode = item.code;
					this.shipperNameTipsVisible = item.new ? true : this.pushFlag; // 如果选择的是人工手动输入的，则显示托运人提示框
					//不再推送
					if (!this.params.serialNo) return;
					this.getTrainInfo();
					if (!item.existed) {
						// 如果不存在则推送
						API_saveTrainDeliverShipper({
							shipperName: val
						}).then(res => {
							if (res.success) {
								this.params.shipperCode = res.data.code;
								if (!this.params.serialNo) return;
								this.getTrainInfo();
							}
						});
					} else {
						if (!this.params.serialNo) return;
						this.getTrainInfo();
					}
				}
			});
			this.params.shipperName = val;
		},
		handleShipperNameSearch(name) {
			if(!name) return
			if(!reg.hanZi.test(name)) {
				this.$message.error('请输入至少两个汉字且以汉字结尾')
				return
			}
			//获取托运人列表（数据来源已存在和企查查获得）
			this.shipperNameTipsVisible = false; // 不展示托运人提示
			this.shipperNameList = [];
			this.fetching = true;

			API_getApiTrainDeliverShipper({
				keyword: name
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.shipperNameList = res.data || [];
					// 检索托运人为空时支持用户输入的托运人
					if (this.shipperNameList.length == 0) {
						let obj = {};
						obj.name = name;
						obj.code = null;
						obj.existed = false;
						obj.new = true;
						this.shipperNameList.push(obj);
						this.pushFlag = true;
					} else {
						let sameFlag = false;
						this.shipperNameList.forEach(item => {
							if (item.name == name) {
								sameFlag = true;
							}
						});
						if (!sameFlag) {
							let obj = {};
							obj.name = name;
							obj.code = null;
							obj.existed = false;
							obj.new = true;
							this.shipperNameList.unshift(obj);
						} else {
							this.pushFlag = false;
						}
					}
				}
			});
		},
		getTrainInfo() {
			// 根据运单号获取车皮信息
			let obj = {};
			(obj.shipperName = this.params.shipperName), (obj.serialNo = this.params.serialNo);
			obj.code = this.params.shipperCode;
			obj.dataSource = 1;
			obj.companyUserId = this.VUEX_ST_COMPANYSUER.companyId;
			if (!this.params.shipperName) {
				this.$message.error('托运人不能为空');
				return;
			} else if (!this.params.serialNo) {
				this.$message.error('运单号不能为空');
				return;
			} else if (this.params.serialNo.length != 13 && this.params.serialNo.length != 12) {
				this.$message.error('请输入12位或者13位运单号');
				return;
			} 
			// else if (!this.params.shipperCode) {
			// 	this.$message.error('托运人编号为空');
			// 	return;
			// }
			if (!(this.serialNo != this.params.serialNo || this.shipperNameOld != this.params.shipperName)) return;
			this.serialNo = this.params.serialNo;
			this.shipperNameOld = this.params.shipperName;
			API_getDeliverInfoTrains({
				shipperName: this.params.shipperName,
				code: this.params.shipperCode,
				serialNo: this.params.serialNo
			}).then(res => {
				// success=true,有data对象是联运管家返回数据，无data是神华外购,
				// code为303，302,运单号不存在，弹出提示“该运单号可能不存在，请检查后重新输入”，不放开其他信息填写
				if (res.success) {
					if (res.data) {
						this.inputDisabled = false;
						this.$set(this.params, 'deliverDate', moment(res.data.departureTime));
						this.isLYGJ = true;
						this.trainInfoData = res.data;
						this.params.deliverDate = res.data.departureTime.split(' ')[0];
						this.departureTime = res.data.departureTime.split(' ')[0];
						if (res.data.carType == '整列运输') {
							this.isWholeTrain = true; // 是整列运输
							//修改时，如果是整列运输，车数和发货数量不覆盖
							if (this.$route.query.deliverId) {
								return;
							}
							this.$set(this.params, 'deliverQuantity', res.data.weight);
							this.$set(this.params, 'trainNum', res.data.trainNum);
							this.quantityTipsVisible = true; // 展示发货数量、车数提示语
							this.trainNumTipsVisible = true;
							$('.flexDiv .ant-form-item-control input').addClass('tipsBlue');
						} else {
							this.quantityTipsVisible = false; // 不展示发货数量、车数提示语
							this.trainNumTipsVisible = false;
							this.$set(this.params, 'deliverQuantity', null);
							this.$set(this.params, 'trainNum', null);
							if (this.isWholeTrain) {
								$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
							}
							this.isWholeTrain = false; // 不是整列运输
						}
					} else {
						this.inputDisabled = false;
						this.isLYGJ = false; // 不是联运管家,是神华外购
						this.quantityTipsVisible = false; // 不展示发货数量、车数提示语
						this.trainNumTipsVisible = false;
						this.$set(this.params, 'deliverQuantity', null);
						this.$set(this.params, 'trainNum', null);
						this.$set(this.params, 'deliverDate', null);
						if (this.isWholeTrain) {
							/*global $*/
							$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
						}
						this.isWholeTrain = false; // 不是整列运输
					}
				} else {
					//特殊情况下 展示特殊提示，且不允许用户输入
					this.isLYGJ = true;
					this.$message.error(res.error.message);
					this.inputDisabled = true;
					this.$set(this.params, 'deliverQuantity', null);
					this.$set(this.params, 'trainNum', null);
					this.$set(this.params, 'deliverDate', null);
					this.trainInfoData = '';
				}
			});
		},
		getTime(value, dateString) {
			// 发货日期修改
			this.$set(this.params, 'deliverDate', dateString);
			this.params.deliverDate = dateString;
		},
		quantityFocus() {
			// 发货数量获取焦点
			this.quantityTipsVisible = false;
			$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
		},
		trainNumFocus() {
			// 车数获取焦点
			this.trainNumTipsVisible = false;
			$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
		}
	}
};
</script>
<style lang="less" scoped>
.custom-card-title {
	::v-deep .ant-descriptions-item-label {
		text-align: right;
		font-size: 14px;
		color: #999999;
		min-width: 130px;
	}
}
.red {
	color: #f24e4d !important;
	ul {
		li {
			line-height: 28px;
			padding: 0 15px;
			list-style: inside;
		}
	}
}

.contract-box {
	::v-deep.ant-form-item-label {
		text-align: left;
	}
	h2 {
		font-size: 16px;
		padding: 15px;
		margin-top: 15px;
	}
	.contract-detail {
		padding: 0 20px;
		.ant-col {
			margin-bottom: 15px;
		}
	}
}

#contractModal {
	::v-deep.ant-modal {
		width: 80% !important;
		min-width: 800px;

		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
		.search-wrap {
			.order-wrap {
				.ant-form-item-children > input {
					width: 200px;
				}
				.ant-select {
					width: 200px;
				}
				.ant-calendar-picker-input input {
					width: 85px;
				}
			}
		}
		.ant-table td {
			white-space: nowrap;
		}
	}
}
.release-apply-car-and-train {
	::v-deep.release-form-car {
		color: rgba(0, 0, 0, 0.75);
		.title-remark {
			&:after {
				content: '(至少录入一个车号)';
				color: #ff1515;
				font-size: 16px;
				padding-left: 44px;
			}
		}
		.row {
			min-height: 60px;
			padding-left: 6px;
			margin: 0 !important;
		}
		.ant-form-item-label {
			label {
				font-size: 16px;
				color: rgba(0, 0, 0, 0.75);
				width: 74px;
				margin-right: 46px;
				display: inline-block;
				text-align: left;
			}
		}
		.ant-form-item-control {
			input {
				width: 240px;
			}
			ul li .ant-select-search__field__wrap {
				input {
					width: 0.75em;
					max-width: 100%;
					padding: 1px;
				}
			}
			.ant-select {
				width: 240px;
			}
			.ant-form-extra {
				width: 240px;
			}
			.ant-input-number {
				width: 240px;
			}
		}
		.delivery-station-input {
			ul li {
				display: inline-block;
				div {
					width: auto;
					input {
						width: auto;
					}
				}
			}
		}
		.date-range {
			.ant-calendar-picker {
				width: 240px;
				input {
					width: 90px;
				}
			}
		}
		.weight-unit .ant-form-item-children {
			&:after {
				content: '吨';
				font-size: 12px;
				color: rgba(0, 0, 0, 0.75);
				margin-left: 10px;
				display: inline-block;
				height: 10px;
			}
		}
		.textarea-wrap {
			textarea {
				width: 706px;
				text-align: left !important;
			}
		}
		.edit-btn {
			color: #0053db;
		}
		.delete-btn {
			color: #ff2929;
		}
		.line {
			padding: 0 10px;
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
			i {
				font-size: 20px;
				display: inline-block;
				vertical-align: middle;
				margin-right: 10px;
				position: relative;
				top: -2px;
			}
			&:hover {
				opacity: 0.8;
				cursor: pointer;
			}
		}
		.train-add-wrap {
			.add-wrap {
				width: 50%;
				display: inline-block;
			}
		}
		.train-times-wrap {
			margin-bottom: 30px;
			font-size: 0;
		}
		.btn-wrap {
			margin-top: 30px;
			padding-left: 40px;
			.ant-btn {
				width: 96px;
				height: 34px;
				margin-right: 30px;
			}
		}
		.ant-form-inline .ant-form-item-with-help {
			margin: 0;
		}
		input.contractAmount {
			width: 120px;
		}
		.floatValue {
			width: 120px;
			position: relative;
			top: -2px;
			input {
				width: 54px;
				display: inline-block;
				vertical-align: middle;
			}
		}
	}
	.tips-box {
		display: inline-block;
		position: relative;
		top: -10px;
		left: -8px;
		.tips-content {
			color: #999;
			padding: 0 14px 0 10px;
			border-radius: 4px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.tips-arrow {
			display: block;
			position: absolute;
			left: -4px;
			box-shadow: -3px 3px 7px rgba(0, 0, 0, 0.07);
			width: 10px;
			height: 10px;
			border-width: 5px;
			background: transparent;
			border-style: solid;
			border-top-color: transparent;
			border-right-color: transparent;
			border-bottom-color: #fff;
			border-left-color: #fff;
			top: 50%;
			transform: translateY(-50%) rotate(45deg);
		}
		.anticon-close {
			position: absolute;
			top: 2px;
			right: 3px;
			font-size: 12px;
		}
		.anticon-exclamation-circle {
			display: inline-block;
			margin-right: 4px;
		}
	}
	.flexDiv {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		.ant-row {
			display: flex;
			flex-direction: row;
		}
		input.tipsBlue {
			border-color: rgb(37, 118, 232);
		}
	}
	.flexDivShipperName {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		.ant-row {
			display: flex;
			flex-direction: row;
		}
	}
	.rejectBox {
		color: red;
		background: #fef0ef;
		border: 1px solid #fabeb9;
		padding: 5px 10px;
		border-radius: 6px;
		margin-bottom: 20px;
	}
}
</style>
