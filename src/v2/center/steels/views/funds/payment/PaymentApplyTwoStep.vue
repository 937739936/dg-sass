<template>
	<div :class="isOa ? 'oa-wrapper' : ''">
		<div
			class="steps-wrap"
			v-if="$route.query.type != 'view'"
		>
			<a-steps :current="currentStep">
				<a-step
					v-for="(item, index) in steps"
					:key="index"
					:title="item"
				/>
			</a-steps>
		</div>
		<div class="pay-apply-form">
			<a-form
				:form="payApplyForm"
				layout="inline"
			>
				<div class="title"><i class="title_icon"></i>付款信息</div>
				<SelectBusinessLine
					@send="getSelectBus"
					ref="selectBusinessLine"
				></SelectBusinessLine>
				<a-row style="margin-top: 20px;">
					<a-col
						:span="12"
						class="row"
						v-if="![3, 5, 8].includes(handleType) || handleType == 'OTHER_MIDDLE'"
					>
						<a-form-item
							label="付款金额"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-decorator="[
									'payAmount',
									{
										rules: [
											{ required: true, message: '本次付款金额必填，请填写' },
											{ validator: validMoney },
											{
												pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
												message: '付款金额为正数，最多两位小数'
											}
										],
										validateTrigger: 'blur'
									}
								]"
								placeholder="请输入付款金额"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
						v-if="![4, 5, 'OTHER_MIDDLE'].includes(handleType)"
					>
						<a-form-item
							label="付款类型"
							:colon="false"
						>
							<a-select
								:disabled="disabled"
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								v-decorator="[
									'type',
									{
										rules: [{ required: true, message: '付款类型必选，请选择' }],
										initialValue:detailInfo.type
									}
								]"
								@change="payTypeChange"
								placeholder="请选择付款类型"
							>
								<a-select-option
									v-for="(items, index) in currentPaymentTypeList"
									:key="index"
									:value="items.value"
								>
									{{ items.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
						v-if="![4, 5].includes(handleType)"
					>
						<a-form-item
							label="是否有票"
							:colon="false"
						>
							<a-select
								:disabled="disabled"
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								v-decorator="[
									'hasInvoice',
									{
										rules: [{ required: true, message: '是否有票必选，请选择' }]
									}
								]"
								placeholder="请选择是否有票"
							>
								<a-select-option :value="0"> 无票 </a-select-option>
								<a-select-option :value="1"> 有票 </a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="收款方"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[
									'sellCompanyName',
									{
										rules: [{ required: true, message: '收款方必选，请选择' }]
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
							label="资金来源"
							:colon="false"
						>
							<a-select
								:disabled="disabled"
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								v-decorator="[
									'capitalSource',
									{
										rules: [{ required: true, message: '资金来源必选，请选择' }]
									}
								]"
								placeholder="请选择资金来源"
								@change="paySourceChange"
							>
								<a-select-option
									v-for="(items, index) in payTypeList"
									:key="index"
									:data="items"
									:value="items.code"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>

					<a-col
						:span="12"
						class="row"
						v-if="[8, 3].includes(handleType) && (payApplyForm.getFieldValue('type') == 1 || !buy002ShowPay)"
					>
						<a-form-item
							label="付款金额"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-decorator="[
									'payAmount',
									{
										rules: [
											{ required: true, message: '本次付款金额必填，请填写' },
											{ validator: validMoney },
											{
												pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
												message: '付款金额为正数，最多两位小数'
											}
										],
										validateTrigger: 'blur'
									}
								]"
								placeholder="请输入付款金额"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<!-- 付款方式 -->
					<div v-if="[3, 4, 1, 'OTHER_MIDDLE'].includes(handleType)">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="付款方式"
								:colon="false"
							>
								<a-select
									:disabled="disabled"
									:getPopupContainer="
										triggerNode => {
											return triggerNode.parentNode || document.body;
										}
									"
									v-decorator="[
										'paymentMethod',
										{
											rules: [{ required: true, message: '付款方式必选，请选择' }]
										}
									]"
									placeholder="请选择付款方式"
								>
									<a-select-option
										v-for="(items, index) in paymentMethodType"
										:key="index"
										:value="items.value"
									>
										{{ items.label }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</div>
					<div v-if="[1, 2, 3, 5, 'OTHER_MIDDLE', 8].includes(handleType) && !($route.query.generateWay === 'ARTIFICIAL_COLLECTION' && $route.query.contractType === 'BUY')">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收款账号"
								:colon="false"
							>
								<a-select
									:disabled="disabled"
									:getPopupContainer="
										triggerNode => {
											return triggerNode.parentNode || document.body;
										}
									"
									v-decorator="[
										'receiveId',
										{
											rules: [{ required: true, message: '收款账号必选，请选择' }]
										}
									]"
									@change="handleSelectChange"
									placeholder="请选择收款账号"
								>
									<a-select-option
										v-for="(items, index) in payBankInfo"
										:key="index"
										:value="items.id"
									>
										<a-tooltip>
											<template slot="title">{{ items.bankName }}-{{ items.no }}</template>
											<span>{{ items.bankName }}-{{ items.no }}</span>
										</a-tooltip>
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收款账户名称"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="[
										'receiveAccName',
										{
											rules: [{ required: true, message: '收款账户名称必选，请选择' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
					</div>
					<div v-else>
						<a-col
							:span="12"
							class="row"
							v-if="!BlPaymentAccount.length""
						>
							<a-form-item
								label="收款账号"
								:colon="false"
							>
								<a-input
									:disabled="disabled"
									v-decorator="[
										'receiveAccNo',
										{
											rules: [{ required: true, message: '收款账号必选，请选择' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
							v-if="BlPaymentAccount.length""
						>
							<a-form-item
								label="收款账号"
								:colon="false"
							>
								<a-select
									:disabled="disabled"
									:getPopupContainer="
										triggerNode => {
											return triggerNode.parentNode || document.body;
										}
									"
									v-decorator="[
										'receiveAccNo',
										{
											rules: [{ required: true, message: '收款账号必选，请选择' }]
										}
									]"
									@change="handleSelectChangeBl"
									placeholder="请选择收款账号"
								>
									<a-select-option
										v-for="(items, index) in BlPaymentAccount"
										:key="index"
										:value="items.no"
									>
										<a-tooltip>
											<template slot="title">{{ items.no }}</template>
											<span>{{ items.no }}</span>
										</a-tooltip>
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收款账户名称"
								:colon="false"
							>
								<a-input
									:disabled="disabled || Boolean(BlPaymentAccount.length)"
									v-decorator="[
										'receiveAccName',
										{
											rules: [{ required: true, message: '收款账户名称必选，请选择' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
							v-if="!['OTHER_MIDDLE'].includes(handleType)"
						>
							<a-form-item
								label="银行名称"
								:colon="false"
							>
								<a-auto-complete
									:disabled="disabled || Boolean(BlPaymentAccount.length)"
									v-decorator="[
										'bankName',
										{
											rules: [{ required: true, message: '银行名称必填', type: 'string' }]
										}
									]"
									@change="
										payApplyForm.resetFields(['receiveAccBank']);
										selectData.receiveAccBank = [];
									"
									:dataSource="selectData.bankName"
									placeholder="输入银行名称"
									@focus="getBankList"
									:filterOption="filterOption"
								/>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
							v-if="!['OTHER_MIDDLE'].includes(handleType)"
						>
							<a-form-item
								label="支行所在省"
								:colon="false"
							>
								<a-select
									:disabled="disabled || Boolean(BlPaymentAccount.length)"
									:getPopupContainer="
										triggerNode => {
											return triggerNode.parentNode || document.body;
										}
									"
									@click="changeProvince(item)"
									@change="
										payApplyForm.resetFields(['bankCity']);
										selectData.bankCity = [];
									"
									v-decorator="[
										'bankProvince',
										{
											rules: [{ required: true, message: '支行所在省必选，请选择' }]
										}
									]"
									placeholder="请选择"
								>
									<a-select-option
										v-for="(item, index) in selectData.bankProvince"
										@click="changeProvince(item)"
										:key="item.name"
										:value="item.name"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
							v-if="!['OTHER_MIDDLE'].includes(handleType)"
						>
							<a-form-item
								label="支行所在市"
								:colon="false"
							>
								<a-select
									placeholder="请先选择开户省，再选择开户城市"
									:notFoundContent="selectData.bankCity ? '暂无数据' : '加载中...'"
									@focus="getCityList"
									:disabled="disabled || Boolean(BlPaymentAccount.length)"
									@change="
										payApplyForm.resetFields(['receiveAccBank']);
										selectData.receiveAccBank = [];
									"
									v-decorator="[
										'bankCity',
										{
											rules: [{ required: true, message: '开户城市必填', type: 'string' }]
										}
									]"
								>
									<a-select-option
										v-for="(item, index) in selectData.bankCity"
										@click="changeCity(item)"
										:key="item.name"
										:value="item.name"
										>{{ item.name }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
							v-if="!['OTHER_MIDDLE'].includes(handleType)"
						>
							<a-form-item
								label="支行名称"
								:colon="false"
							>
								<a-select
									showSearch
									:disabled="disabled || Boolean(BlPaymentAccount.length)"
									v-decorator="[
										'receiveAccBank',
										{
											rules: [{ required: true, message: '开户行名称必填', type: 'string' }]
										}
									]"
									placeholder="输入开户行关键字"
									@search="searchBranchList"
								>
									<a-select-option
										v-for="obj in selectData.receiveAccBank"
										:key="obj.bankCode"
										:value="obj.lname"
									>
										{{ obj.lname }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</div>
					<!-- 预结单 且是废钢 -->
					<a-col
						:span="12"
						class="row"
						v-if="payApplyForm.getFieldValue('type') == 2 && handleType == 1"
					>
						<a-form-item
							label="是否关联预结算单"
							:colon="false"
						>
							<a-select
								:disabled="disabled"
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								v-decorator="[
									'isAssociatedStatement',
									{
										rules: [{ required: true, message: '是否关联预结算单，请选择' }]
									}
								]"
								placeholder="是否关联预结算单"
							>
								<a-select-option value="1">是 </a-select-option>
								<a-select-option value="0">否 </a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<GoodsInfo
					v-if="(handleType == 2 || handleType == 8) && this.payApplyForm.getFieldValue('type') !== 1"
					:contractNo="contractNo"
					:isShowGoodsValue="isShowGoodsValue"
					:source="payApplyForm.getFieldValue('payType')"
					:hasInvoice="payApplyForm.getFieldValue('hasInvoice')"
					:payTypeList="payTypeList"
					:editDetail="editDetail"
					:pageState="$route.query.type"
					:goodsData="goodsData"
					:dataSource="goodsInfoDataSource"
					:deliveryIds="deliveryIds"
					:receiveRecordIds="receiveRecordIds"
					:goodsResultInfo="goodsResultInfo"
					:receiveNoArr="receiveNoList"
					ref="goodsInfo"
					@selectedChange="handleSelectedChange"
				/>
				<!-- 结算单信息 -->
				<template v-if="[2, 8, 3].includes(handleType) && this.payApplyForm.getFieldValue('type') === 1">
					<div
						class="title"
						v-if="handleType == 'OTHER_MIDDLE' || payApplyForm.getFieldValue('type') == 1"
					>
						<i class="title_icon"></i>结算单信息
					</div>
					<a-table
						rowKey="statementNo"
						:rowSelection="settlementRowSelection"
						:columns="settlementColumns"
						:dataSource="settlementData"
						:pagination="false"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="jumpToDetail(record)"
								>查看</a
							>
						</template>
					</a-table>
				</template>
				<!-- 废钢优化 预结算付款 -->
				<template v-if="handleType == 1 || handleType == 'OTHER_MIDDLE'">
					<div
						class="title"
						v-if="handleType == 'OTHER_MIDDLE' || payApplyForm.getFieldValue('type') == 1"
					>
						<i class="title_icon"></i>结算单信息
					</div>
					<div
						class="title"
						v-if="payApplyForm.getFieldValue('type') == 2 && payApplyForm.getFieldValue('isAssociatedStatement') == 1"
					>
						<i class="title_icon"></i>预结算单信息
					</div>
					<div
						class="title"
						v-if="payApplyForm.getFieldValue('type') == 2 && payApplyForm.getFieldValue('isAssociatedStatement') == 0"
					>
						<i class="title_icon"></i>货转信息
					</div>
					<a-table
						rowKey="statementNo"
						v-if="
							handleType == 'OTHER_MIDDLE' ||
							payApplyForm.getFieldValue('type') == 1 ||
							(payApplyForm.getFieldValue('type') == 2 && payApplyForm.getFieldValue('isAssociatedStatement') == 1)
						"
						:rowSelection="settlementRowSelection"
						:columns="settlementColumns"
						:dataSource="settlementData"
						:pagination="false"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="jumpToDetail(record)"
								>查看</a
							>
						</template>
					</a-table>
					<a-table
						rowKey="transferNo"
						v-if="payApplyForm.getFieldValue('type') == 2 && payApplyForm.getFieldValue('isAssociatedStatement') == 0"
						:rowSelection="transferRowSelection"
						:columns="transferColumns"
						:dataSource="transferData"
						:pagination="false"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								target="_blank"
								class="edit-btn"
								@click="goodsTransfer(record)"
							>
								查看
							</a>
						</template>
					</a-table>
				</template>
				<!-- 判断 仓押业务  -->
				<!-- 货转信息-->
				<template v-if="handleType == 3 && this.payApplyForm.getFieldValue('type') === 2">
					<div class="title"><i class="title_icon"></i>货转信息</div>
					<a-table
						rowKey="transferNo"
						:rowSelection="transferRowSelection"
						:columns="transferColumns"
						:dataSource="transferData"
						:pagination="false"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								target="_blank"
								class="edit-btn"
								@click="goodsTransfer(record)"
							>
								查看
							</a>
						</template>
					</a-table>
				</template>
				<!-- 付款类型为“预结算付款”，且勾选的资金来源对应的融资类型为“应收账款融资”、“类应收融资”时，显示这4个字段 -->
				<a-row>
					<template v-if="isShowItem">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="货值金额"
								:colon="false"
							>
								<a-input
									:disabled="disabled"
									v-decorator="[
										'cargoValueAmount',
										{
											rules: [
												{ required: true, message: '货值金额必填，请填写' },
												{ validator: validAmount2 },
												{
													pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
													message: '货值金额为正数，最多两位小数'
												}
											],
											validateTrigger: 'blur'
										}
									]"
									placeholder="请输入货值金额"
									@blur="countNum"
								>
								</a-input>
								<a-tooltip overlayClassName="bgc_tooltip">
									<template slot="title">
										<span>指的是该合同当前所有已收货货物的总货值金额</span>
									</template>
									<a-icon type="exclamation-circle" />
								</a-tooltip>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="已转让金额"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="['transferredAmount']"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="可转让金额"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="['transferableAmount']"
								>
								</a-input>
								<!-- 资金来源为“工商银行-煤炭”、“工商银行-钢材”时，可转让金额规则变更 -->
								<a-tooltip
									overlayClassName="bgc_tooltip"
									v-if="
										['receivable-ICBC-coal', 'receivable-ICBC-steel'].includes(this.payApplyForm.getFieldValue('capitalSource'))
									"
								>
									<template slot="title">
										<span
											>可转让金额=
											min【货值金额-已转让金额-累计非融资资金付款金额，合同金额-已转让金额-累计非融资资金付款金额】</span
										>
									</template>
									<a-icon type="exclamation-circle" />
								</a-tooltip>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="本次转让金额"
								:colon="false"
							>
								<a-input
									:disabled="disabled"
									v-decorator="[
										'currentTransferAmount',
										{
											rules: [
												{ required: true, message: '本次转让金额必填，请填写' },
												{ validator: validAmount },
												{
													pattern: /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/,
													message: '本次转让金额为正数，最多两位小数'
												}
											],
											validateTrigger: 'blur'
										}
									]"
									placeholder="请输入本次转让金额"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
							v-if="[8, 3].includes(handleType)"
						>
							<a-form-item
								label="付款金额"
								:colon="false"
							>
								<a-input
									:disabled="disabled"
									v-decorator="[
										'payAmount',
										{
											rules: [
												{ required: true, message: '本次付款金额必填，请填写' },
												{ validator: validMoney },
												{
													pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
													message: '付款金额为正数，最多两位小数'
												}
											],
											validateTrigger: 'blur'
										}
									]"
									placeholder="请输入付款金额"
								>
								</a-input>
								<template v-if="$route.query.type != 'view'">
									<a
										href="#"
										style="margin: 0 4px"
										@click="calculatePayAmount"
										>测算</a
									>
									<a-popover :title="null">
										<template slot="content">
											<p>若选择“有票”，本次付款金额≤本次转让金额*有票融资比例</p>
											<p>若选择“无票”，本次付款金额≤本次转让金额*无票融资比例</p>
										</template>
										<a-icon type="info-circle" />
									</a-popover>
								</template>
							</a-form-item>
						</a-col>
					</template>
					<a-col
						:span="12"
						class="row"
						v-if="handleType == 5"
					>
						<a-form-item
							label="退款金额"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-decorator="[
									'payAmount',
									{
										rules: [
											{ required: true, message: '本次退款金额必填，请填写' },
											{ validator: validMoney },
											{
												pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
												message: '退款金额为正数，最多两位小数'
											}
										],
										validateTrigger: 'blur'
									}
								]"
								placeholder="请输入退款金额"
							>
							</a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<template v-if="handleType == 5">
					<div class="title"><i class="title_icon"></i>选择结算单</div>
					<a-table
						rowKey="statementNo"
						:rowSelection="settlementRowSelection2"
						:columns="settlementColumns"
						:dataSource="settlementData"
						:pagination="false"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="jumpToDetail(record)"
								>查看</a
							>
						</template>
					</a-table>
				</template>
				<div
					class="hidden-wrap"
					v-if="payApplyForm.getFieldValue('hasInvoice') == 1"
				>
					<div class="title"><i class="title_icon"></i>发票信息</div>
					<div class="invo-box">
						<div class="box-inner">
							<p class="stitle">不含税金额总和（元）</p>
							<p>
								<span class="text">{{ editDetail.amountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">税额总和（元）</p>
							<p>
								<span class="text">{{ editDetail.taxAmountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">价税合计总和（元）</p>
							<p>
								<span class="text">{{ editDetail.totalAmountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">发票分拆金额总和（元）</p>
							<p>
								<span class="text">{{ editDetail.splitedAmountSum }}</span>
							</p>
						</div>
					</div>
					<a-table
						:columns="invoiceColumns"
						:dataSource="invoiceData"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<template v-if="$route.query.type != 'view'">
								<a-popconfirm
									v-if="invoiceData.length"
									title="确定删除该条发票信息?"
									okText="确定"
									cancelText="取消"
									@confirm="() => onDeleteInvoice(record)"
								>
									<a
										href="javascript:;"
										class="delete-btn"
										>删除</a
									>
								</a-popconfirm>
							</template>
						</template>
					</a-table>
					<p
						v-if="!isOa"
						class="add-wrap"
						@click="addInvoice"
					>
						<i>+</i>关联发票
					</p>
				</div>
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isShowGoodsValue="isShowGoodsValue"
							ref="customUpload"
							:isNeedRotate="true"
							:ifEditable="!disabled"
							:attachmentTypeList="attachmentTypeList"
							@uploadFiles="getUploadFiles"
							@deleteFiles="deleteFiles"
							:fileDataSource="fileDataSource"
							:type="'pay'"
							:allowFormat="[]"
							:accountingSeal="false"
						/>
					</div>
				</div>
				<!-- -->
				<div v-if="isOa && $route.query.type == 'view'">
					<div class="title"><i class="title_icon"></i>合同附件</div>
					<div class="upload-wrap">
						<div class="upload-block">
							<CustomUpload
								:isShowGoodsValue="isShowGoodsValue"
								ref="customUpload"
								:isNeedRotate="true"
								:columns="oaColumns"
								:ifEditable="false"
								:attachmentTypeList="[]"
								@uploadFiles="getUploadFiles"
								@deleteFiles="deleteFiles"
								:fileDataSource="oaContractList"
								:type="'pay'"
								:allowFormat="[]"
								:accountingSeal="false"
							/>
						</div>
					</div>
				</div>
				<div class="btn-wrap">
					<a-button
						@click="$router.go(-1)"
						v-if="!isOa"
						>返回</a-button
					>
					<template v-if="$route.query.type != 'view'">
						<a-button
							@click="save('save')"
							v-if="$route.query.type != 'submit'"
							>保存</a-button
						>
						<a-button
							type="primary"
							@click="save('submit')"
							>提交</a-button
						>
					</template>
				</div>
			</a-form>
		</div>
		<a-modal
			title="发票信息"
			centered
			v-model="modalInvoiceInfoIsShow"
			width="850"
			okText="确定"
			cancelText="取消"
			@ok="confirmCheck"
			@cancel="modalInvoiceFormCancel"
			class="modal-invoice-info"
		>
			<a-form
				layout="inline"
				class="search-wrap"
			>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="发票代码"
							class="order-wrap"
						>
							<a-input
								style="width: 100%"
								placeholder="请输入发票代码"
								v-model="params.code"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="发票号码"
							class="order-wrap"
						>
							<a-input
								style="width: 100%"
								placeholder="请输入发票号码"
								v-model="params.no"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="开票日期"
							class="order-wrap"
							:colon="false"
						>
							<a-range-picker
								style="width: 100%"
								v-model="issuedDate"
								format="YYYY-MM-DD"
								@change="issuedDateChange"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item>
							<a-button
								type="primary"
								html-type="submit"
								class="search-btn"
								@click="searchInvoiceInfo"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetInvoiceInfo"
							>
								重置
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
				<a-table
					:rowSelection="{
						selectedRowKeys: invoiceSelectedRowKeys,
						onChange: onSelectInvoiceChange
					}"
					:columns="modalInvoiceColumns"
					:dataSource="modalInvoiceData"
					:pagination="invoicePagination"
					@change="paginationChange"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</a-form>
			<template slot="footer">
				<a-button
					type="primary"
					@click.native="confirmCheck"
					>确定</a-button
				>
			</template>
		</a-modal>
		<ErrorModal
			ref="errorModal2"
			tip="提示"
		>
			<div class="error-msg">
				<p
					v-for="(item, index) in errorInfoList"
					:key="index"
				>
					{{ item }}
				</p>
				<p>无法关联付款,请核实发票状态</p>
			</div>
		</ErrorModal>
	</div>
</template>

<script>
import { API_BIZPROVINCELIST, API_BIZCITYLIST } from '@/v2/api';

import {
	savePayment,
	submitPayment,
	editPayment,
	paymentDetail,
	receiveAccountByCompanyId,
	paymentInvoiceSummary,
	paymentinvoicePage,
	API_GetAssetSum,
	API_GetSteelBankProductItemTwo,
	API_GETLOGINBYMOBILE,
	API_SteelsStatementfindByContractNo,
	API_SteelsGetGoodsTransfer,
	checkCollection,
	getTakeDeliverIng,
	getPaymentIng,
	API_PaymentApplyDeleteAttach,
	payCheckInvoice,
	API_GETCONTRACTAMOUNT,
	API_getPaymentAccount
} from '@/v2/center/steels/api/funds.js';
import { API_COMPANYACCOUNTLISTBANK, API_COMPANYACCOUNTLISTSUBBRANCH } from '@/v2/api/account';
import moment from 'moment';
import { mapMutations } from 'vuex';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import GoodsInfo from '@/v2/center/steels/components/funds/GoodsInfo';
import ErrorModal from '../components/errorModal.vue';
import { mapGetters } from 'vuex';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { getPersonalDetail } from '@/v2/utils/factory.js';
import { debounce } from 'lodash';
import num from '@/v2/utils/num.js';
import SelectBusinessLine from '../components/SelectBusinessLine.vue';

const settlementColumns = [
	{
		title: '结算单号',
		dataIndex: 'statementNo'
	},
	{
		title: '结算金额(元)',
		dataIndex: 'settleAmount'
	},
	{
		title: '结算日期',
		dataIndex: 'settleTime',
		customRender: text => {
			const arr = text ? text.split(' ') : [];
			return arr[0] || '-';
		}
	},
	{
		title: '结算数量(吨)',
		dataIndex: 'particularQuantity'
	},
	{
		title: '操作',
		scopedSlots: {
			customRender: 'operation'
		},
		dataIndex: 'operation'
	}
];
const settlementColumns2 = [
	{
		title: '结算单号',
		dataIndex: 'statementNo'
	},
	{
		title: '结算日期',
		dataIndex: 'settleTime'
	},
	{
		title: '结算吨数(吨)',
		dataIndex: 'particularQuantity'
	},
	{
		title: '货款价税合计',
		dataIndex: 'settleAmount'
	},
	{
		title: '尾款金额',
		dataIndex: 'balancePayment'
	},
	{
		title: '操作',
		scopedSlots: {
			customRender: 'operation'
		},
		dataIndex: 'operation'
	}
];
const transferColumns = [
	{
		title: '货转编号',
		dataIndex: 'transferNo'
	},
	{
		title: '货转开具时间',
		dataIndex: 'createdDate'
	},
	{
		title: '货转数量(吨)',
		dataIndex: 'transferQuantity'
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc'
	},
	{
		title: '操作',
		scopedSlots: {
			customRender: 'operation'
		},
		dataIndex: 'operation'
	}
];
const transferColumns2 = [
	{
		title: '货转编号',
		dataIndex: 'transferNo'
	},
	{
		title: '货转开具时间',
		dataIndex: 'createdDate'
	},
	{
		title: '货转数量(吨)',
		dataIndex: 'transferQuantity'
	},
	{
		title: '钢材种类',
		dataIndex: 'steelTypeDesc'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc'
	},
	{
		title: '操作',
		scopedSlots: {
			customRender: 'operation'
		},
		dataIndex: 'operation'
	}
];
// 业务逻辑
// oa 新增合同附件 和 补录合同附件的展示
const oaOnlineContract = [
	{
		title: '文件类型',
		dataIndex: 'contractName'
	},
	{
		title: '编号',
		dataIndex: 'serialNumber'
	},
	{
		title: '签订日期',
		dataIndex: 'signTime'
	},
	{
		title: '操作',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' }
	}
];
// 补录
const oaSupContract = [
	{
		title: '类型',
		dataIndex: 'attachmentTypeDesc'
	},
	{
		title: '合同签订状态',
		dataIndex: 'contractSignStatusDesc'
	},
	{
		title: '操作',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' }
	}
];

export default {
	name: 'PayApply',
	components: {
		CustomUpload,
		GoodsInfo,
		ErrorModal,
		SelectBusinessLine
	},
	data() {
		return {
			shipmentNoList: [],
			statementNoList: [],
			settlementSelectedRowKeys: [],
			contractNo: '',
			// 结算单
			settlementData: [],
			// 货转信息
			transferData: [],
			transferSelectedRowKeys: [],
			paymentType: filterSteelsCodeByKey('paymentType'),

			currentStep: 1,
			steps: ['选择采购订单', '填写付款信息', '完成'],
			payApplyForm: this.$form.createForm(this),
			fileDataSource: [],
			fileInfos: [],
			payBankInfo: [],
			payTypeList: [],
			goodsInfoDataSource: [],
			modalInvoiceColumns: [
				{
					title: '发票代码',
					dataIndex: 'code'
				},
				{
					title: '发票编号',
					dataIndex: 'no'
				},
				{
					title: '不含税金额',
					dataIndex: 'taxExcludedAmount'
				},
				{
					title: '税额',
					dataIndex: 'taxAmount'
				},
				{
					title: '价税合计',
					dataIndex: 'total_amount'
				},
				{
					title: '开票日期',
					dataIndex: 'issued_date'
				}
			],
			invoiceColumns: [
				{
					title: '发票代码',
					dataIndex: 'code'
				},
				{
					title: '发票编号',
					dataIndex: 'no'
				},
				{
					title: '不含税金额',
					dataIndex: 'taxExcludedAmount'
				},
				{
					title: '税额',
					dataIndex: 'taxAmount'
				},
				{
					title: '价税合计',
					dataIndex: 'total_amount',
					customRender: (text, record) => {
						return (+(record.total_amount || record.totalAmount)).toLocaleString();
					}
				},
				{
					title: '开票日期',
					dataIndex: 'issued_date',
					customRender: (text, record) => {
						return record.issued_date || record.issuedDate;
					}
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			contractId: [],
			invoiceData: [],
			modalInvoiceData: [],
			selectedRowKeys: [],
			invoiceSelectedRowKeys: [],
			invoiceSelectedIds: '',
			modalInvoiceInfoIsShow: false,
			params: {
				code: '',
				no: ''
			},
			invoicePagination: {
				total: 0,
				defaultPageSize: 10,
				pageNo: 1,
				hideOnSinglePage: true
			},
			invoiceAllData: [],
			issuedDate: null,
			goodsData: [],
			deliveryIds: '',
			receiveRecordIds: '',
			goodsResultInfo: null,
			isEdit: false,
			editDetail: {},
			receiveNoList: [],
			query: {},
			isShowGoodsValue: false,
			capitalSource: '',
			isOa: false,
			origin: window.location.origin,
			isShowItem: false, //付款类型为“预结算付款”，且勾选的资金来源对应的融资类型为“应收账款融资”、“类应收融资”时,展示“本次转让金额”、“货值金额”、“已转让金额”、“可转让金额”4个字段
			contractTemplate: '',
			// 用户选择操作
			selectData: {
				bankName: [],
				bankProvince: [],
				bankCity: [],
				receiveAccBank: []
			},
			provinceInfo: {},
			cityInfo: {},
			// 详情信息
			detailInfo: {},
			// 付款方式字典
			paymentMethodType: filterSteelsCodeByKey('paymentMethod'),
			errorInfoList: [],
			contractDetail: {}, // 合同详情
			buy002ShowPay: false,
			isZiyou: false,
			// 选择的业务线
			selectBusItem: {},
			BlPaymentAccount: [], // 采购补录合同账号数据
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		disabled() {
			return this.$route.query.type == 'view' || this.$route.query.type == 'submit';
		},
		settlementColumns() {
			if (this.handleType == 5) {
				return settlementColumns2;
			}
			return settlementColumns;
		},
		transferColumns() {
			if (this.handleType == 3) {
				return transferColumns2;
			}
			return transferColumns;
		},
		settlementRowSelection() {
			const { settlementSelectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys: settlementSelectedRowKeys,
				onChange: record => {
					this.settlementSelectedRowKeys = record;
				},
				getCheckboxProps: record => ({
					props: {
						disabled: this.disabled
					}
				})
			};
		},
		settlementRowSelection2() {
			const { settlementSelectedRowKeys } = this;
			const flag = ['WAREHOUSE_RECEIPTS_PLEDGE_OTHER', 'SOURCING_AGENT_OTHER', 'SOURCING_AGENT_WAREHOUSE_PLEDGE_OTHER'].includes(
				this.$route.query.businessType || this.detailInfo.businessType
			);
			return {
				type: 'radio',
				selectedRowKeys: settlementSelectedRowKeys,
				onChange: (record, arr) => {
					this.settlementSelectedRowKeys = record;
					const item = arr[0];
					this.payApplyForm.setFieldsValue({ payAmount: Math.abs(item.balancePayment || 0) });
				},
				getCheckboxProps: record => ({
					props: {
						disabled: this.disabled || (record.balancePayment >= 0 && !flag) || record.ifRefund
					}
				})
			};
		},
		attachmentTypeList() {
			if ([3, 4].includes(this.handleType)) {
				return [
					{
						label: '保证金打款凭证',
						value: 'DEPOSIT_PAYMENT'
					}
				];
			}
			if ([5].includes(this.handleType)) {
				return [
					{
						label: '下游打款凭证',
						value: 'DOWNSTREAM_PAYMENT'
					}
				];
			}
			if ([1].includes(this.handleType)) {
				if (['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_SELL_002'].includes(this.template)) {
					return [
						{
							label: '付款凭证',
							value: 'PROOF_PAYMENT'
						},
						{
							label: '其他',
							value: 'OTHER'
						}
					];
				}
				return [
					{
						label: '付款凭证',
						value: 'PROOF_PAYMENT'
					}
				];
			}
			if ([8].includes(this.handleType)) {
				if (this.isZiyou) {
					return [
						{ label: '上游其他材料', value: 'UP_OTHER_MATERIAL' },
						{ label: '下游其他材料', value: 'DOWN_OTHER_MATERIAL' },
						{ label: '核算表', value: 'ACCOUNTING_TABLE' }
					];
				} else {
					return [{ label: '核算表', value: 'ACCOUNTING_TABLE' }];
				}
			}
			return filterSteelsCodeByKey('paymentAttach');
		},
		// 选择货转信息
		transferRowSelection() {
			const { transferSelectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys: transferSelectedRowKeys,
				onChange: record => {
					this.transferSelectedRowKeys = record;
				},
				getCheckboxProps: record => ({
					props: {
						disabled: this.disabled
					}
				})
			};
		},
		handleType() {
			let contractType = 1;
			if (this.template === 'RECEIVABLE_STEEL_BUY_002') {
				contractType = 8;
				return contractType;
			}
			// 补录
			if (this.$route.query.id) {
				if (this.businessType == 'OTHER_MIDDLE') {
					contractType = 'OTHER_MIDDLE';
					this.getProvList();
				}
				if (this.detailInfo.generateWay == 'ARTIFICIAL_COLLECTION' && this.detailInfo.contractType == 'BUY') {
					contractType = 2;
				} else if (this.detailInfo.contractType == 'SELL') {
					contractType = 3;
				}
			} else {
				if (this.$route.query.generateWay == 'ARTIFICIAL_COLLECTION' && this.$route.query.contractType == 'BUY') {
					contractType = 2;
				} else if (this.$route.query.contractType == 'SELL') {
					contractType = 3;
				}
				if (this.businessType == 'OTHER_MIDDLE') {
					contractType = 'OTHER_MIDDLE';
					this.getProvList();
				}
			}
			// 第一种 基于线上采购合同 并且是废钢的
			if (contractType == 1 && (this.$route.query.steelType === 'SCRAP_STEEL' || this.detailInfo.steelType === 'SCRAP_STEEL')) {
				return 1;
			}
			// 第二种  基于线上采购合同 并且是 应收和自有的 即合同模板 采购001的 STEEL_PROFILE
			let flag = ['STEEL_PROFILE'].includes(this.template);
			if (contractType == 1 && flag) {
				return 2;
			}
			// 榆神（应收）
			flag = ['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_SELL_002'].includes(this.template);
			if (flag) {
				return 1;
			}
			// 第四种 基于补录采购合同
			if (contractType == 2) {
				this.getProvList();
				return 4;
			}
			// 第五种 销售合同
			if (contractType == 3) {
				this.getStatementData();
				return 5;
			}
			// 第三种  基于线上采购合同 并且是 仓押的业务
			flag = ['WAREHOUSE_RECEIPTS_PLEDGE', 'WAREHOUSE_RECEIPTS_PLEDGE_OTHER'].includes(this.businessType);
			if (contractType == 1 && flag) {
				return 3;
			}
			return contractType;
		},
		// 合同模板
		template() {
			return this.$route.query.contractTemplate || this.contractTemplate;
		},
		// 业务类型
		businessType() {
			return this.$route.query.businessType || this.detailInfo.businessType;
		},
		oaColumns() {
			if (this.detailInfo.generateWay == 'ARTIFICIAL_COLLECTION') {
				return oaSupContract;
			}
			return oaOnlineContract;
		},
		oaContractList() {
			let list = [];
			if (this.detailInfo.generateWay == 'ARTIFICIAL_COLLECTION') {
				list = this.detailInfo.additionAttachmentList || [];
				list.forEach(el => (el.url = el.attachmentPath));
			} else {
				list = this.detailInfo.electronicContracts || [];
				list.forEach(el => (el.url = el.path));
			}
			return list;
		},
		/** 判断付款类型 */
		currentPaymentTypeList() {
			if ([8, 3].includes(this.handleType)) {
				return this.paymentType.filter(i => i.value != 3);
			}
			return this.paymentType;
		}
	},
	watch: {
		isShowItem: function (data) {
			this.isShowItem = data;
		},
		handleType: {
			handler(val) {
				if ([3, 4].includes(val) && !this.$route.query.id) {
					this.checkCollection();
				}
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		this.isOa = this.$route.name === 'OaSteelsFundsPaymentApplyTwoStep';
		this.query = this.$route.query || {};
		this.contractNo = this.$route.query.contractNo;
		this.id = this.$route.query.id;
		const { contractId, companyUserId } = this.$route.query;
		if (this.isOa) {
			API_GETLOGINBYMOBILE({
				contractId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				getPersonalDetail(this.getData);
			});
			return;
		}
		this.getPayTypeList(this.$route.query.companyUscc);
		this.getData();
		this.getStatementData();
		this.getContractDetail();
		this.getPaymentAccount();

	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		// 采购补录合同，回显卖方账号信息
		getPaymentAccount() {
			if (this.$route.query.contractId && this.$route.query.generateWay === 'ARTIFICIAL_COLLECTION' && this.$route.query.contractType === 'BUY') {
				API_getPaymentAccount({
					contractId: this.$route.query.contractId
				}).then(res => {
					if (res.success) {
						this.BlPaymentAccount = res.data || []
						const data = res.data || []
						if (!data.length) return
						this.$nextTick(() => {
							setTimeout(()=>{
								this.payApplyForm.setFieldsValue({
									receiveAccNo:  data[0]?.no,
									receiveAccName: data[0]?.accountName,
									bankName: data[0]?.bankName,
									receiveAccBank: data[0]?.subbranchName,
									bankProvince: data[0]?.province,
									bankCity: data[0]?.city
								})
							})
						})
					}
				})
			}
		},
		handleSelectChangeBl(e) {
			const data = this.BlPaymentAccount.filter(item=>{
				return item.no === e
			})
			if (!data.length) return
			this.$nextTick(() => {
				setTimeout(()=>{
					this.payApplyForm.setFieldsValue({
						receiveAccNo:  data[0]?.no,
						receiveAccName: data[0]?.accountName,
						bankName: data[0]?.bankName,
						receiveAccBank: data[0]?.subbranchName,
						bankProvince: data[0]?.province,
						bankCity: data[0]?.city
					})
				},0)
			})
		},
		getContractDetail() {
			API_GETCONTRACTAMOUNT({ contractId: this.$route.query.contractId }).then(res => {
				if (res.success) {
					this.contractDetail = res.data;
				}
			});
		},
		getData() {
			//  插入默认收款方
			const companyName = this.$route.query.companyName;
			if (this.$route.query.companyId) {
				this.getReceiveAccountByCompanyId(this.$route.query.companyId);
			}
			setTimeout(() => {
				this.payApplyForm.setFieldsValue({ sellCompanyName: companyName || this.$route.query.sellCompanyName });
				if (this.handleType == 2) {
					this.$refs.goodsInfo.disabled = this.disabled;
				}
			}, 100);
			if (this.id) {
				this.getPaymentDetail();
			} else {
				// 货转信息
				this.getTransferData();
				/* */
			}
		},
		jumpToDetail({ id }) {
			this.$router.push({
				path: '/center/steels/settle/settleApplyDetail',
				query: {
					statementId: id,
					contractType: this.$route.query.contractType,
					contractId: this.$route.query.contractId,
					type: 'view'
				}
			});
		},
		// 查看货转
		goodsTransfer({ id }) {
			const url = `${this.origin}/center/steels/goodsTransfer/goodsTransferApplyDetail?id=${id}&contractTemplate=${this.$route.query.contractTemplate}`;
			window.open(url);
		},
		// 获取收款账号
		getReceiveAccountByCompanyId(companyId) {
			receiveAccountByCompanyId({ companyId }).then(res => {
				if (res.success) {
					this.payBankInfo = res.result;
				}
			});
		},

		getPaymentDetail() {
			paymentDetail(this.id).then(r => {
				if (r.success) {
					this.detailInfo = r.data;
					const { data } = r;
					let companyId = data.contractType == 'BUY' ? data.sellCompanyId : data.buyCompanyId;
					if (companyId&&companyId!==this.$route.query.companyId) {
						this.getReceiveAccountByCompanyId(companyId);
					}

					this.contractId = r.data.contractId;
					if (this.$route.query.type === 'view') {
						this.settlementData = r.data.statementList || [];
						this.transferData = r.data.goodsTransfers || [];
					} else {
						this.getTransferData();
					}
					this.contractTemplate = r.data.contractTemplate;
					this.payTypeChange(r.data.type);

					this.settlementSelectedRowKeys = (r.data.statementList || []).map(item => {
						return item.statementNo;
					});
					// 货转信息
					this.transferSelectedRowKeys = (r.data.goodsTransfers || []).map(item => {
						return item.transferNo;
					});

					if (r.data.hasInvoice) {
						this.invoiceData = r.data.paymentInvoiceList;
						const selectIds = [];
						this.invoiceData.forEach(item => {
							selectIds.push(item.id);
						});
						this.invoiceSelectedIds = selectIds;
						paymentInvoiceSummary({
							idList: selectIds,
							contractId: r.data.contractId
						}).then(res => {
							if (res.success) {
								this.editDetail = {
									...this.editDetail,
									...res.data
								};
							}
						});
					}

					if (this.$route.query.type === 'view') {
						this.goodsInfoDataSource = r.data.paymentDeliverList;
					}

					if (this.isOa) {
						this.paymentType = [
							{
								label: r.data.typeDesc,
								value: +r.data.type
							}
						];
					}

					/** 设置业务线数据 */
					this.$nextTick(() => {
						if (r.data.businessLineResp) {
							this.$refs.selectBusinessLine.init(r.data.businessLineResp);
						}
					});
					this.$nextTick(() => {
						this.payApplyForm.setFieldsValue({
							type: +r.data.type,
							hasInvoice: r.data.hasInvoice + '',
							method: r.data.method,
							payAmount: r.data.payAmount,
							receiveId: r.data.receiveId,
							receiveAccName: r.data.receiveAccName,
							sellCompanyName: r.data.sellCompanyName,
							payType: r.data.payType,
							cargoValueAmount: r.cargoValueAmount,
							isAssociatedStatement: String(r.data.isAssociatedStatement || 0),
							bankName: data.bankName,
							receiveAccNo: data.receiveAccNo,
							receiveAccName: data.receiveAccName,
							receiveAccBank: data.receiveAccBank,
							bankCity: data.bankCity,
							bankProvince: data.bankProvince,
							isAssociatedStatement: String(r.data.isAssociatedStatement || 0)
						});
						this.$nextTick(() => {
							let obj = {
								sellCompanyName: r.data.sellCompanyName,
								hasInvoice: r.data.hasInvoice,
								payAmount: r.data.payAmount
							};
							if (r.data.paymentMethod) {
								obj.paymentMethod = r.data.paymentMethod;
							}
							this.payApplyForm.setFieldsValue(obj);
						});
					});

					/** 判断采购合同补录 */
					if (this.handleType == 4) {
						this.provinceInfo = { code: data.bankProvince, name: data.bankProvince };
						this.cityInfo = { code: data.bankCity, name: data.bankCity };
						this.getCityList(data.bankProvince);
					}

					this.$nextTick(() => {
						setTimeout(() => {
							this.payApplyForm.setFieldsValue({ isAssociatedStatement: String(r.data.isAssociatedStatement || 0) });
						});

						if (this.handleType == 4) {
							this.searchBranchList(data.receiveAccBank);
						}
						this.$forceUpdate();
						// 获取支行
					});
					this.capitalSource = r.data.capitalSource;

					if (this.handleType == 2 || this.handleType == 8) {
						this.$nextTick(() => {
							this.$refs.goodsInfo.goodsSelectedRowKeys = this.shipmentNoList = r.data.paymentDeliverList.map(item => {
								return item.shipmentNo;
							});
						});
					}

					this.fileDataSource = this.fileInfos = r.data.paymentAttachList;
					this.fileDataSource.forEach(item => {
						item.url = item.attachmentPath;
					});
					let companyUscc = r.data.contractType == 'BUY' ? r.data.sellCompanyUscc : r.data.buyCompanyUscc;
					if (companyUscc&&companyUscc!==this.$route.query.companyUscc) {
					this.getPayTypeList(companyUscc, r.data.type);
					}

					//付款类型为“预结算付款”，且勾选的资金来源对应的融资类型为“应收账款融资”、“类应收融资”时,展示“本次转让金额”、“货值金额”、“已转让金额”、“可转让金额”4个字段 并回显
					if (r.data.type == '2') {
						let financingType = '';
						let intervalTimer = setInterval(() => {
							if (this.payTypeList.length > 0) {
								for (let i = 0; i < this.payTypeList.length; i++) {
									let item = this.payTypeList[i];
									if (item.code === this.capitalSource) {
										financingType = item.financingType;
										this.payApplyForm.setFieldsValue({
											capitalSource: this.capitalSource
										});
										break;
									} else {
										this.payApplyForm.setFieldsValue({
											capitalSource: ''
										});
									}
								}
								clearInterval(intervalTimer);
								this.isShowItem =
									financingType == 'ACCOUNTS_RECEIVABLE_LOANS' || financingType == 'ACCOUNTS_RECEIVABLE_LIKE_LOANS';
								if (this.isShowItem) {
									let that = this;
									setTimeout(function () {
										that.payApplyForm.setFieldsValue({
											cargoValueAmount: r.data.cargoValueAmount,
											currentTransferAmount: r.data.currentTransferAmount,
											transferableAmount: r.data.transferableAmount,
											transferredAmount: r.data.transferredAmount
										});
										if (that.$route.query.type !== 'view') {
											that.getAssetSum();
										}
									}, 500);
								}
							}
						}, 500);
					}
				}
			});
		},
		moment,
		handleSelectedChange(data) {
			this.shipmentNoList = data;
		},
		issuedDateChange(value, dateString) {
			this.params.issuedDateBegin = dateString[0];
			this.params.issuedDateEnd = dateString[1];
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		deleteFiles(data) {
			API_PaymentApplyDeleteAttach({ id: data.id }).then(res => {
				if (res.success) {
					this.$refs.customUpload.toDelete(data);
					this.$message.success('删除成功');
				}
			});
		},
		paginationChange(data) {
			let result = {};
			this.invoicePagination.pageNo = data.current;
			Object.assign(result, this.invoicePagination, this.params);
			this.getInvoiceInfo(result);
		},
		// 获取选择的业务线
		getSelectBus(item) {
			this.selectBusItem = item;
		},
		async save(type) {
			this.payApplyForm.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					// 如果付款类型为1 结算付款，则付款凭证和结算对账单不能为空,如果为2 预结算付款，则付款凭证不能为空
					// 若蓉欧结算付款，结算对帐单可为空

					const fileInfosTypeList = (this.fileInfos || []).map(item => item.type);

					if ([2].includes(this.handleType)) {
						if (!fileInfosTypeList.includes('PROOF_PAYMENT')) {
							this.$message.error('请上传付款凭证');
							return;
						}
						if (
							!fileInfosTypeList.includes('SETTLEMENT_BILLING') &&
							values.type == 1 &&
							this.VUEX_ST_COMPANYSUER.companyUscc !== '91510100MA69N5DE2T'
						) {
							this.$message.error('请上传结算对账单');
							return;
						}
					}

					// 废钢 预付款 不关联
					if (this.handleType == 1 && values.type == 2 && values.isAssociatedStatement == 0) {
						if (this.transferSelectedRowKeys.length <= 0) {
							this.$message.error('货转信息不能为空');
							return;
						}
					}
					// 废钢 预付款 关联
					if (this.handleType == 1 && values.type == 2 && values.isAssociatedStatement == 1) {
						if (this.settlementSelectedRowKeys.length <= 0) {
							this.$message.error(`${['结算单信息', '预结算单信息'][values.type - 1]}不能为空`);
							return;
						}
					}
					// 废钢 付款
					if (this.handleType == 1 && values.type == 1) {
						if (this.settlementSelectedRowKeys.length <= 0) {
							this.$message.error(`${['结算单信息', '预结算单信息'][values.type - 1]}不能为空`);
							return;
						}
					}
					// 应收业务 自有业务
					if (this.handleType == 2 || this.handleType == 8) {
						if (values.type == 1) {
							// 结算付款
							if (this.settlementSelectedRowKeys.length <= 0) {
								this.$message.error('结算单信息不能为空');
								return;
							}
						} else {
							if (this.shipmentNoList.length <= 0) {
								this.$message.error('货物信息不能为空');
								return;
							}
						}
					}
					// 货物信息 仓押
					if (this.handleType == 3) {
						if (values.type == 1) {
							// 结算付款
							if (this.settlementSelectedRowKeys.length <= 0) {
								this.$message.error('结算单信息不能为空');
								return;
							}
						} else {
							if (this.transferSelectedRowKeys.length <= 0) {
								this.$message.error('货物信息不能为空');
								return;
							}
						}
						// if (this.transferSelectedRowKeys.length <= 0) {
						//   this.$message.error('货物信息不能为空')
						//   return
						// }
					}
					if (this.handleType == 'OTHER_MIDDLE') {
						if (this.settlementSelectedRowKeys.length <= 0) {
							this.$message.error(`结算单信息不能为空`);
							return;
						}
					}
					// if ([3,4].includes(this.handleType)) {
					//   if(!fileInfosTypeList.includes('DEPOSIT_PAYMENT')) {
					//     this.$message.error('请上传保证金打款凭证');
					//     return
					//   }
					// }
					// if ([5].includes(this.handleType)) {
					//   if(!fileInfosTypeList.includes('PROOF_PAYMENT')) {
					//     this.$message.error('请上传下游打款凭证');
					//     return
					//   }
					// }
					if (this.handleType == 5) {
						if (this.settlementSelectedRowKeys.length <= 0) {
							this.$message.error('请选择结算单');
							return;
						}
					}

					// 如果选择有票，发票信息不能为空
					if (values.hasInvoice == '1') {
						if (this.invoiceSelectedIds == '') {
							this.$message.error('发票信息不能为空');
							return;
						}
						// 发票信息价税合计之和不能小于付款金额
						let sum = 0;
						this.invoiceData.forEach(item => {
							sum = +(sum + item.total_amount * 1).toFixed(2);
						});

						if (sum < values.payAmount * 1) {
							this.$message.error('发票总额小于付款额，提交失败');
							return;
						}
					}

					const { hasInvoice, receiveId, receiveAccName, payAmount, capitalSource } = values;

					let bodyObj = {
						id: this.id,
						contractNo: this.contractNo,
						type: values.type,
						hasInvoice,
						receiveId,
						receiveAccName,
						payAmount,
						capitalSource,
						shipmentNoList: this.shipmentNoList, // 货物编号
						paymentAttachList: this.fileInfos.map(item => {
							return {
								fileId: item.fileId || item.id,
								type: item.type
							};
						}),
						...values,
						contractType: this.$route.query.contractType || 'BUY',
						generateWay: this.$route.query.generateWay || 'SYSTEM_COLLECTION',
						contractId: this.$route.query.contractId || this.detailInfo.contractId
					};
					// 发票ID
					if (values.hasInvoice == 1) {
						const invoiceList = [];
						this.invoiceData.forEach(item => {
							invoiceList.push(item.id);
						});
						bodyObj.invoiceList = invoiceList;
					}
					if (this.handleType == 'OTHER_MIDDLE') {
						bodyObj.statementNoList = this.settlementSelectedRowKeys || [];
					}
					if (this.handleType == '8') {
						bodyObj.statementNoList = this.settlementSelectedRowKeys || [];
					}
					if (this.handleType == 1) {
						// 不关联
						if (values.isAssociatedStatement == 0) {
							bodyObj.transferNoList = this.transferSelectedRowKeys || [];
						} else {
							// 关联
							bodyObj.statementNoList = this.settlementSelectedRowKeys || [];
						}
						delete bodyObj.shipmentNoList;
					}
					if ([2, 3].includes(this.handleType) && values.type == 1) {
						// 结算付款
						bodyObj.statementNoList = this.settlementSelectedRowKeys || [];
					}
					// 仓押业务
					if (this.handleType == 3 && values.type == 2) {
						bodyObj.transferNoList = this.transferSelectedRowKeys || [];
					}
					// 下游合同
					if (this.handleType == 5) {
						bodyObj.statementNoList = this.settlementSelectedRowKeys || [];
						// 校验在途 下游付款的时候
						let res = await getTakeDeliverIng(this.$route.query.contractNo);
						if (res.data && res.data.length) {
							const item = res.data[0];
							this.$message.error(`该合同下存在未完结的提单记录，请全部实提/作废后再提交。未完结提单编号：${item.serialNo}`);
							return;
						}
						const params = {
							contractId: +this.$route.query.contractId,
							paymentId: this.id ? Number(this.id) : ''
						};

						res = await getPaymentIng(params);
						if (res.data && res.data.length) {
							const item = res.data[0];
							this.$message.error(`合同下存在未完结的退款记录，请完成/驳回/作废后再提交。未完结付款编号：${item.serialNo}`);
							return;
						}
					}
					if (!this.selectBusItem.relationNo) {
						this.$message.error('请选择业务线');
						return;
					}
					bodyObj.businessLineNo = this.selectBusItem.relationNo;

					const self = this;
					if (type == 'save') {
						if (this.id) {
							const res = await editPayment(bodyObj);
							this.$message.success('成功');
							this.$router.push({
								path: '/center/steels/funds/payment/list'
							});
						} else {
							const res = await savePayment(bodyObj);
							this.$message.success('成功');
							this.$router.push({
								path: '/center/steels/funds/payment/list'
							});
						}
					} else {
						this.$confirm({
							centered: true,
							title: '请确认付款信息填写完成并提交？',
							okText: '确定',
							cancelText: '取消',
							async onOk() {
								const res = await submitPayment(bodyObj);
								self.$message.success('保存成功');
								self.$router.push({
									path: '/center/steels/funds/payment/list'
								});
							}
						});
					}
				}
			});
		},
		addInvoice() {
			this.modalInvoiceInfoIsShow = true;
			const selectIds = [];
			this.invoiceData.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedRowKeys = selectIds;
			this.invoicePagination = {
				current: 1,
				pageSize: 10,
				pageNo: 1,
				defaultPageSize: 10,
				hideOnSinglePage: true
			};
			this.params = {
				code: '',
				no: ''
			};
			this.getInvoiceInfo(this.params);
		},
		getInvoiceInfo(params) {
			paymentinvoicePage({
				...this.invoicePagination,
				...params,
				orderId: this.$route.query.orderId,
				paymentId: this.$route.query.id || null,
				contractId: this.$route.query.contractId || this.contractId
			}).then(res => {
				if (res.success) {
					this.modalInvoiceData = [];

					res.data.records.forEach(item => {
						this.modalInvoiceData.push({
							key: item.id,
							amount: item.amount,
							code: item.code,
							id: item.id,
							issued_date: item.issuedDate,
							no: item.no,
							taxAmount: item.taxAmount,
							total_amount: item.totalAmount,
							taxExcludedAmount: item.taxExcludedAmount
						});
					});

					// 插入所有发票数据
					this.invoiceAllData = this.invoiceAllData.concat(res.data.records);

					const pagination = {
						total: res.data.total,
						pageSize: res.data.size || 10,
						// current: res.data.current,
						pageNo: res.data.current||this.invoicePagination.pageNo,

						current: res.data.current||this.invoicePagination.pageNo,

						defaultPageSize: 10,
						hideOnSinglePage: true
						// showTotal: function(total) {
						//   return `共${total}条记录 第${res.data.current}页 `;
						// }
					};
					this.invoicePagination = pagination;
				}
			});
		},
		async confirmCheck() {
			// 插入发票选中数据
			this.invoiceData = [];
			this.invoiceAllData.forEach(item => {
				this.invoiceSelectedRowKeys.forEach(id => {
					if (item.id == id) {
						item['key'] = item.id;
						if (JSON.stringify(this.invoiceData).indexOf(JSON.stringify(item)) == -1) {
							this.invoiceData.push(item);
						}
					}
				});
			});
			if (!this.invoiceSelectedRowKeys.length) {
				this.modalInvoiceFormSubmit();
				return;
			}
			const invoiceIdList = this.invoiceData.map(el => el.id);
			const params = {
				invoiceIdList: invoiceIdList
			};
			const errRes = await payCheckInvoice(params);
			if (errRes.data && errRes.data.length) {
				this.errorInfoList = errRes.data;
				this.$refs.errorModal2.open();
			} else {
				this.modalInvoiceFormSubmit();
			}
		},
		modalInvoiceFormSubmit() {
			this.getInvoiceIds();

			this.modalInvoiceInfoIsShow = false;
		},
		modalInvoiceFormCancel() {
			this.modalInvoiceInfoIsShow = false;
		},
		searchInvoiceInfo() {
			// this.invoicePagination.pageNo = 1
			this.invoicePagination = {
				current: 1,
				pageSize: 10,
				pageNo: 1,
				defaultPageSize: 10
			};
			this.getInvoiceInfo(this.params);
		},
		resetInvoiceInfo() {
			this.invoicePagination = {
				current: 1,
				pageSize: 10,
				pageNo: 1,
				defaultPageSize: 10
			};
			this.params = {
				code: '',
				no: '',
				issuedDateBegin: '',
				issuedDateEnd: ''
			};
			this.issuedDate = null;
			this.getInvoiceInfo();
		},
		onSelectInvoiceChange(selectedRowKeys) {
			this.invoiceSelectedRowKeys = selectedRowKeys;
		},
		getInvoiceIds() {
			const selectIds = [];
			this.invoiceData.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedIds = selectIds.join(',');
			if (selectIds.length <= 0) {
				return;
			}
			// 实时计算发票汇总
			paymentInvoiceSummary({
				idList: selectIds,
				contractId: this.$route.query.contractId || this.contractId
			}).then(res => {
				if (res.success) {
					this.editDetail = {
						...this.editDetail,
						...res.data
					};
				}
			});
		},
		onDeleteInvoice(record) {
			const invoiceData = [...this.invoiceData];
			const keys = [];
			this.invoiceData = invoiceData.filter(item => item.id !== record.id);
			this.$message.success('删除成功');
			this.invoiceData.forEach(item => {
				keys.push(item.id);
			});
			this.invoiceSelectedRowKeys = keys;
			this.getInvoiceIds();
		},
		handleSelectChange(value) {
			//遍历payBankInfo数组，根据id获取name
			for (let i = 0; i < this.payBankInfo.length; i++) {
				if (this.payBankInfo[i].id == value) {
					this.payApplyForm.setFieldsValue({
						receiveAccName: this.payBankInfo[i].name
					});
				}
			}
		},
		//校验付款金额 应付账款金额
		validMoney(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (value > 99999999999999.99) {
				callback('金额不超过100000000000000,最多两位小数');
				return;
			}
			if (
				Number(this.payApplyForm.getFieldValue('payAmount')) > Number(this.payApplyForm.getFieldValue('currentTransferAmount'))
			) {
				callback('金额不能大于本次转让金额');
				return;
			}
			callback();
		},
		// 获取资金来源
		getPayTypeList(companyUscc, type) {
			let filter = true;
			if (this.$route.query.type == 'view' || this.$route.query.type == 'submit') {
				filter = false;
			}
			if (!companyUscc) {
				return;
			}
			API_GetSteelBankProductItemTwo({
				paymentType: type,
				companyUscc: companyUscc,
				coreCompanyUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				filter
			}).then(res => {
				if (res.success) {
					this.payTypeList = res.data;
					for (let i = 0; i < this.payTypeList.length; i++) {
						let item = this.payTypeList[i];
						if (item.code === this.capitalSource) {
							this.payApplyForm.setFieldsValue({
								capitalSource: this.capitalSource
							});
							break;
						} else {
							this.payApplyForm.setFieldsValue({
								capitalSource: undefined
							});
						}
					}
				}
			});
		},
		payTypeChange(value) {
			// 付款类型修改
			this.getPayTypeList(this.$route.query.companyUscc, value);
			if (value == 1) {
				this.isShowItem = false;
			} else if (value == 2 && [8, 3].includes(this.handleType) && this.buy002ShowPay) {
				this.isShowItem = true;
			}
			if (this.$route.query.type == 'view') {
				return;
			}
			// 废钢 预结算单 默认不关联
			if (value == 2 && this.$route.query.steelType === 'SCRAP_STEEL') {
				if (
					this.payApplyForm.getFieldValue('isAssociatedStatement') === undefined ||
					this.payApplyForm.getFieldValue('isAssociatedStatement') === null ||
					this.payApplyForm.getFieldValue('isAssociatedStatement') === ''
				) {
					this.payApplyForm.setFieldsValue({ isAssociatedStatement: '0' });
				}
			}
			this.getStatementData(value);
			// if (this.$route.query.steelType === 'SCRAP_STEEL' || this.handleType == 3 || this.handleType == 'OTHER_MIDDLE' ||  ['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_SELL_002'].includes( this.template)) {
			//   this.$nextTick(() => {
			//     this.getStatementData(value)
			//   })
			// }
		},
		// 获取结算单数据
		async getStatementData(value) {
			const params = {
				contractId: this.$route.query.contractId,
				contractNo: this.$route.query.contractNo,
				paymentType: value || this.payApplyForm.getFieldValue('type') || ''
			};
			const res = await API_SteelsStatementfindByContractNo(params);
			this.settlementData = res.data;
			this.$forceUpdate();
		},
		// 获取货转信息
		async getTransferData() {
			this.settlementSelectedRowKeys = [];
			const params = {
				contractId: this.$route.query.contractId,
				generateWay: this.$route.query.generateWay
			};
			const res = await API_SteelsGetGoodsTransfer(params);

			this.$nextTick(() => {
				this.transferData = res.data;
			});
		},
		paySourceChange(value, a) {
			const financingType = a.data.attrs.data.financingType;

			// 资金来源修改
			if (this.handleType == 3) {
				this.isShowItem = this.payApplyForm.getFieldValue('type') == '2' && ['ACCOUNTS_RECEIVABLE_LOANS'].includes(financingType);
			} else {
				this.isShowItem =
					this.payApplyForm.getFieldValue('type') == '2' &&
					['ACCOUNTS_RECEIVABLE_LOANS', 'ACCOUNTS_RECEIVABLE_LIKE_LOANS'].includes(financingType);
			}

			// NONE("非融资"),

			// LIQUIDITY_LOANS("流贷融资"),

			// ACCOUNTS_RECEIVABLE_LOANS("应收账款融资"),

			// ACCOUNTS_RECEIVABLE_LIKE_LOANS("类应收账款融资"),

			// PRE_PAYMENT_LOANS("预付融资"),

			// PLEDGE_ACCOUNTS_RECEIVABLE("货押融资"),
			this.buy002ShowPay = ['ACCOUNTS_RECEIVABLE_LOANS', 'ACCOUNTS_RECEIVABLE_LIKE_LOANS'].includes(financingType);

			if (this.isShowItem) {
				this.getAssetSum(); // 获取已转让金额
			}
			this.capitalSource = value;
			if (value == '0') {
				this.isZiyou = true;
			} else {
				this.isZiyou = false;
			}
		},
		validAmount(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (value > 99999999999999.99) {
				callback('金额不超过100000000000000,最多两位小数');
				return;
			}
			if (Number(this.payApplyForm.getFieldValue('payAmount')) > Number(value)) {
				callback('付款金额不能大于本次转让金额');
				return;
			}
			if (Number(value) > Number(this.payApplyForm.getFieldValue('transferableAmount'))) {
				callback('本次转让金额不能大于可转让金额');
				return;
			}
			callback();
		},
		validAmount2(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (value > 99999999999999.99) {
				callback('金额不超过100000000000000,最多两位小数');
				return;
			}
			callback();
		},
		getAssetSum() {
			// 获取已转让金额
			API_GetAssetSum({ id: this.$route.query.contractId }).then(res => {
				if (res.success) {
					this.$nextTick(() => {
						this.payApplyForm.setFieldsValue({ transferredAmount: res.data });
						if (this.payApplyForm.getFieldValue('cargoValueAmount')) {
							// 如果是修改，则取最新的已转让金额，重新计算可转让金额
							this.countNum();
						}
					});
				}
			});
		},
		countNum() {
			// 输入货值金额后， 可转让金额=货值金额-已转让金额
			// 若资金来源为“工商银行-煤炭”、“工商银行-钢材”时：
			// 可转让金额=min【货值金额-已转让金额-累计非融资资金付款金额，合同金额-已转让金额-累计非融资资金付款金额】
			let a = Number(this.payApplyForm.getFieldValue('cargoValueAmount') || 0); // 货值金额
			let b = Number(this.payApplyForm.getFieldValue('transferredAmount') || 0); // 已转让金额
			let c = this.contractDetail.nonFinancialAmount || 0; //累计非融资资金付款金额
			let d = this.contractDetail.contractAmount || 0; //合同金额
			let result = 0;
			if (['receivable-ICBC-coal', 'receivable-ICBC-steel'].includes(this.payApplyForm.getFieldValue('capitalSource'))) {
				let min = Math.min(a, d);
				let result1 = num.accSub(min, b);
				result = num.accSub(result1, c);
			} else {
				result = num.accSub(a, b);
			}
			this.payApplyForm.setFieldsValue({ transferableAmount: result });
		},
		// 获取省
		async getProvList() {
			const res = await API_BIZPROVINCELIST({ countryCode: 1, containsAll: true });
			this.selectData.bankProvince = res.result;
		},
		// 获取市
		async getCityList(value) {
			if (!this.provinceInfo.code) return;

			const params = {
				provinceCode: this.provinceInfo.code,
				containsAll: true
			};
			const res = await API_BIZCITYLIST(params);
			this.selectData.bankCity = res.result;
		},
		changeProvince(item) {
			this.provinceInfo = item;
		},
		changeCity(item) {
			this.cityInfo = item;
		},
		// 获取银行列表
		async getBankList() {
			if (this.selectData.bankName.length) return;
			const res = await API_COMPANYACCOUNTLISTBANK();
			this.selectData.bankName = res.data || [];
		},
		// 获取支行
		searchBranchList: debounce(async function (v) {
			if (!v) {
				return;
			}
			const bankName = this.payApplyForm.getFieldValue('bankName');
			if (!this.provinceInfo.code || !this.cityInfo.code || !bankName) {
				return;
			}
			const params = {
				bankName,
				province: this.provinceInfo.name,
				city: this.cityInfo.name,
				subbranchName: v
			};
			const res = await API_COMPANYACCOUNTLISTSUBBRANCH(params);
			this.selectData.receiveAccBank = res.data;
		}, 500),
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		// 校下游合同是否登记了保证金
		async checkCollection() {
			const params = {
				contractId: this.$route.query.contractId,
				contractNo: this.$route.query.contractNo
			};
			const res = await checkCollection(params);
			if (res.data.associatedBond) {
				res.data.collectionAttachList.forEach(el => {
					el.name = el.fileName;
					el.url = el.filePath;
					el.attachmentPath = el.filePath;
					el.type = 'DEPOSIT_PAYMENT';
					el.typeName = '保证金打款凭证';
				});
				this.fileDataSource = res.data.collectionAttachList;
			}
		},
		// 测算付款金额
		calculatePayAmount() {
			var hasInvoiceValue = this.payApplyForm.getFieldValue('hasInvoice');
			var capitalSource = this.payApplyForm.getFieldValue('capitalSource');
			var currentTransferAmount = this.payApplyForm.getFieldValue('currentTransferAmount');
			var transferredAmount = this.payApplyForm.getFieldValue('transferredAmount');
			var selectZc = this.payTypeList.filter(function (obj) {
				return obj.code === capitalSource;
			})[0];

			if (hasInvoiceValue === undefined) {
				this.$message.error('请选择是否有票');
				return;
			}
			if (capitalSource === undefined) {
				this.$message.error('请选择资金来源');
				return;
			}
			if (currentTransferAmount === undefined) {
				this.$message.error('请输入本次转让金额');
				return;
			}

			let payAmount =
				hasInvoiceValue == 0
					? currentTransferAmount * selectZc.noTicketFinancingPercentage
					: currentTransferAmount * selectZc.ticketFinancingPercentage;
			this.payApplyForm.setFieldsValue({
				payAmount: payAmount.toFixed(2)
			});
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep .ant-form-item-label label {
	font-size: 16px;
	color: rgba(0, 0, 0, 0.75);
	width: 84px;
	margin-right: 66px;
	display: inline-block;
	text-align: left;
}
.pay-apply-form {
	padding-bottom: 60px;
	.invo-box {
		display: flex;
		margin-bottom: 15px;

		.text {
			font-size: 18px;
		}
		.box-inner {
			height: 100px;
			width: 300px;
			background: #fafafa;
			margin: 20px;
			text-align: center;
			.stitle {
				margin-top: 20px;
			}
		}
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

	.ant-form-item-control {
		input {
			width: 280px;
		}

		.ant-select {
			width: 280px;
		}
	}

	.pay-account-wrap {
		.ant-select {
			width: 420px;
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

	.textarea-wrap {
		textarea {
			width: 704px;
			text-align: left !important;
		}
	}

	.hidden-wrap {
		margin-bottom: 30px;
	}

	.add-wrap {
		width: 100%;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;

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

	.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}

	th[key='selection-column'] {
		span {
			display: none;
		}
	}
}

.modal-invoice-info {
	width: 80% !important;

	.search-btn {
		margin-right: 10px;
	}
}
::v-deep.ant-calendar-picker {
	width: 240px;
}
</style>
<style lang="less">
.oa-wrapper {
	padding: 20px;
}
.anticon-exclamation-circle {
	font-size: 20px;
	color: @primary-color;
	cursor: pointer;
	position: relative;
	left: 10px;
	top: 2px;
}
.bgc_tooltip {
	.ant-tooltip-inner {
		background: #fff;
		color: #333;
	}
	.ant-tooltip {
		color: #fff;
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
.edit-btn {
	color: @primary-color;
}
</style>
