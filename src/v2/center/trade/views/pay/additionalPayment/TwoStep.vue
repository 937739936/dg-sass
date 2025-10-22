<template>
	<div>
		<PaymentStep :currentStep="1" />
		<div
			class="pay-apply-form"
			style="padding-bottom: 10px"
		>
			<div class="title"><i class="title_icon"></i>合同信息</div>
			<a-form layout="inline">
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="订单编号"
							:colon="false"
						>
							<!-- orderType=ONLINE 时不是补协合同，可以跳转详情-->
							<a
								v-if="orderDetail.orderType === 'ONLINE'"
								@click="toContractDetail"
								>{{ orderDetail.serialNo }}</a
							>

							<span v-if="orderDetail.orderType !== 'ONLINE'">{{ orderDetail.serialNo }}</span>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="合同编号"
							:colon="false"
						>
							{{ orderDetail.contractNo }}
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="卖方名称"
							:colon="false"
						>
							{{ orderDetail.sell }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="买方名称"
							:colon="false"
						>
							{{ orderDetail.buy }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="数量"
							:colon="false"
						>
							{{ orderDetail.quantity }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row specialItem"
					>
						<a-form-item
							label="基准价格"
							:colon="false"
						>
							<TextOverFlow
								v-if="orderDetail.basePriceDesc"
								:content="orderDetail.basePriceDesc"
								:maxWidth="320"
							/>
							<TextOverFlow
								v-else-if="orderDetail.basePrice"
								:content="orderDetail.basePrice + '元/吨'"
								:maxWidth="320"
							/>
							<span v-else>-</span>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="运输方式"
							:colon="false"
						>
							{{ orderDetail.transportModeDesc }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="签订日期"
							:colon="false"
						>
							{{ orderDetail.signTime }}
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>

			<!-- 全业务线
            由于系统合同目前存在多对多的情况，故付款时对应的采购合同可能你属于多条全业务线（不受付款类型、资金来源等影响）
            ○ 当属于多条全业务线时，在”合同信息“板块展示其对应的全业务线，有用户进行选择确定基于哪条全业务线进行付款，单选；
            ○ 当只属于一条全业务线时，默认取该条，且前端不展示”选择业务线“板块 -->
			<div v-if="bizLineInfo.length > 1 && $route.query.type !== 'overview'">
				<strong style="line-height: 40px">选择业务线：</strong>
				<a-table
					:columns="bizLineColumns"
					:dataSource="bizLineInfo"
					:pagination="false"
					:rowKey="record => record.id"
					:rowSelection="{
						selectedRowKeys: bizLineSelectedRowKeys,
						type: 'radio'
					}"
					:customRow="onClickBizLineRow"
				>
				</a-table>
			</div>
		</div>
		<div class="pay-apply-form">
			<a-form
				:form="payApplyForm"
				layout="inline"
			>
				<div class="title"><i class="title_icon"></i>付款信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="付款类型"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['type', { rules: [{ required: true, message: '请选择付款类型' }] }]"
								@change="payTypeChange"
								placeholder="请选择付款类型"
							>
								<a-select-option
									v-for="(items, index) in paymentType"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="是否有票"
							:colon="false"
						>
							<a-select
								:disabled="$route.query.type === 'submit'"
								v-decorator="['hasInvoice', { rules: [{ required: true, message: '请选择是否有票' }] }]"
								placeholder="请选择是否有票"
							>
								<a-select-option value="0">无票</a-select-option>
								<a-select-option value="1">有票</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="付款方式"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['method', { rules: [{ required: true, message: '请选择付款方式' }] }]"
								placeholder="请选择付款方式"
							>
								<a-select-option
									v-for="(items, index) in paymentMethod"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
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
								v-decorator="['sellerName', { rules: [{ required: true, message: '收款方' }] }]"
							>
							</a-input>
						</a-form-item>
					</a-col>

					<!-- 全业务线
            由于本次支持对上游补录的合同发起付款，但上游补录的合同系统内没有维护其上游收款账号，故如果判断是上游补录的合同，则”收款账户名称“、”收款方银行“、”收款账号“均需要手动填写
            orderType ="UP"代表上游补录合同   “ONLINE”代表电子合同-->
					<template v-if="$route.query.orderType === 'UP'">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收款账户名称"
								:colon="false"
							>
								<a-input
									placeholder="请输入收款账户名称"
									disabled
									v-decorator="[
										'receiveAccName',
										{
											rules: [{ required: true, message: '收款账户名称必填，请输入' }]
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
								label="收款账号"
								:colon="false"
							>
								<a-input
									placeholder="请输入收款账号"
									disabled
									v-decorator="[
										'receiveAccNo',
										{
											rules: [{ required: true, message: '收款账号必填，请输入' }]
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
								label="收款方银行"
								:colon="false"
							>
								<a-input
									:maxLength="200"
									disabled
									v-decorator="[
										'receiveAccBank',
										{
											rules: [{ required: true, message: '收款银行必填，请输入' }]
										}
									]"
									placeholder="请输入收款方银行"
								>
								</a-input>
							</a-form-item>
						</a-col>
					</template>
					<!-- 存在已维护的收款账号 -->
					<template v-if="$route.query.orderType === 'ONLINE'">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收款账号"
								:colon="false"
							>
								<a-select
									disabled
									v-decorator="['receiveId', { rules: [{ required: true, message: '请选择收款账号' }] }]"
									placeholder="请选择收款账号"
								>
									<a-select-option
										v-for="(items, index) in payBankInfo"
										:key="index"
										:value="items.id"
									>
										<a-tooltip placement="topLeft">
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
									v-decorator="['receiveAccName', { rules: [{ required: true, message: '收款账户名称' }] }]"
								>
								</a-input>
							</a-form-item>
						</a-col>
					</template>
					<template v-if="!shanMeiPayType.includes(payType)">
						<a-col
							:span="12"
							class="row"
							v-if="payApplyForm.getFieldValue('type') == 1"
						>
							<a-form-item
								label="付款金额"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="[
										'payAmount',
										{
											rules: [
												{ required: true, message: '请输入付款金额' },
												{
													pattern: /^\d+(\.\d{0,2})?$/,
													message: '付款金额为非负数，最多两位小数'
												}
											]
										}
									]"
									placeholder="请输入付款金额"
								>
								</a-input>
							</a-form-item>
						</a-col>
					</template>
					<!-- <a-col :span="12" class="row" v-if="isShowGoodsValue">
                        <a-form-item label="应付账款金额" :colon=false>
                            <a-input
                                    disabled
                                    v-decorator="[
                                      'goodsValue',
                                      { rules: [
                                        { required: true, message: '应付账款金额必填，请填写' },
                                        { pattern: /^\d+(\.\d{0,2})?$/, message:'应付账款金额非负数，最多两位小数'}
                                        ] },
                                    ]"
                                    placeholder="请输入应付账款金额">
                            </a-input>
                        </a-form-item>
                    </a-col> -->
					<a-col
						:span="12"
						class="row"
						v-if="$route.query.type !== 'overview'"
					>
						<a-form-item
							label="资金来源"
							:colon="false"
						>
							<a-select
								v-decorator="['payType', { rules: [{ required: true, message: '请选择资金来源' }] }]"
								disabled
								placeholder="请选择资金来源"
							>
								<a-select-option
									v-for="(items, index) in payTypeList"
									:key="index"
									:value="items.source"
									>{{ items.sourceName }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<!-- 付款详情--若资金来源停用，回显不出则直接展示payTypeName -->
					<a-col
						:span="12"
						class="row"
						v-if="$route.query.type === 'overview'"
					>
						<a-form-item
							label="资金来源"
							:colon="false"
						>
							<a-input
								v-decorator="['payTypeName', { rules: [{ required: true, message: '请选择资金来源' }] }]"
								disabled
								placeholder="请选择资金来源"
							/>
						</a-form-item>
					</a-col>
					<template v-if="!shanMeiPayType.includes(payType)">
						<a-col
							:span="12"
							class="row"
							v-if="payApplyForm.getFieldValue('type') == 1"
						>
							<a-form-item
								v-if="status == 3"
								:label="payApplyForm.getFieldValue('payType') == '6' ? '应付账款到期日' : '付款日期'"
								:colon="false"
							>
								<a-date-picker
									:placeholder="payApplyForm.getFieldValue('payType') == '6' ? '请输入应付账款到期日' : '请输入付款日期'"
									disabled
									v-decorator="['confirmTime', { rules: [{ required: true, message: '请输入日期' }] }]"
								/>
							</a-form-item>
							<a-form-item
								v-else
								:label="payApplyForm.getFieldValue('payType') == '6' ? '应付账款到期日' : '付款日期'"
								:colon="false"
							>
								<a-date-picker
									:placeholder="payApplyForm.getFieldValue('payType') == '6' ? '请输入应付账款到期日' : '请输入付款日期'"
									disabled
									v-decorator="['planPayDate', { rules: [{ required: true, message: '请输入日期' }] }]"
								/>
							</a-form-item>
						</a-col>
					</template>
					<a-col
						:span="12"
						class="row"
						v-if="$route.query.isAdditionalPaymentCreat"
					>
						<a-form-item
							label="主资金流水号"
							:colon="false"
						>
							<a @click="openNewPage">{{ $route.query.serialNo || $route.query.mainPaymentNo }}</a>
						</a-form-item>
					</a-col>
				</a-row>
				<!-- 只有资金来源是善美保理-融单时才显示融单信息模块 -->
				<template v-if="shanMeiPayType.includes(payType)">
					<div class="title"><i class="title_icon"></i>融单信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="付款金额"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="[
										'payAmount',
										{
											rules: [
												{ required: true, message: '付款金额必填，请填写' },
												{
													pattern: /^\d+(\.\d{0,2})?$/,
													message: '付款金额为非负数，最多两位小数'
												}
											]
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
						>
							<a-form-item
								label="开立日期"
								:colon="false"
							>
								<a-date-picker
									disabled
									placeholder="请选择开立日期"
									v-decorator="[
										'planPayDate',
										{
											rules: [{ required: true, message: '开立日期必填，请填写' }]
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
								label="承诺付款日期"
								:colon="false"
							>
								<a-date-picker
									disabled
									placeholder="请选择承诺付款日期"
									v-decorator="[
										'promisePayDate',
										{
											rules: [{ required: true, message: '付款日期必填，请填写' }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</template>
				<!-- 善美保理本地去掉卓鼎特殊情况 -->
				<!-- 只有动力煤-郑州卓鼎(91410100MA45CKY3XX)显示--start-->
				<!--比较当前输入金额和后台返回金额是否一致，不一致则显示"货值金额调整说明"-->
				<!-- <a-row v-if="isShowAccounting">
                    <a-col :span="12" class="row">
                        <a-form-item label="货值总金额" :colon=false>
                            <a-input
                              disabled
                              v-decorator="[ 'goodsValueTotalAmount' ]">
                            </a-input>
                        </a-form-item>
                        <div class="detail-wrapper">
                            <a @click.prevent="handleViewDetail">明细</a>
                        </div>
                    </a-col>
                    <a-col :span="12" class="row">
                        <a-form-item label="本次货值金额" :colon=false>
                            <a-input
                              disabled
                              v-decorator="[ 'goodsValueThisAmount']">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" class="row" v-if="detail.goodsValueAdjustExplain !== null">
                        <a-form-item label="货值金额调整说明" class="textarea-wrap" :colon=false>
                            <a-textarea
                              disabled
                              v-decorator="['goodsValueAdjustExplain']">
                            </a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row> -->
				<!-- 只有动力煤-郑州卓鼎显示--end-->

				<!--                <a-row>-->
				<!--                    <a-col :span="24" class="row">-->
				<!--                        <a-form-item  label="备注" :colon=false class="textarea-wrap">-->
				<!--                            <a-textarea-->
				<!--                                    disabled-->
				<!--                                    v-decorator="['comments']"-->
				<!--                                    placeholder="请输入备注"-->
				<!--                            ></a-textarea>-->
				<!--                        </a-form-item>-->
				<!--                    </a-col>-->
				<!--                </a-row>-->
				<div
					class="hidden-wrap"
					v-show="payApplyForm.getFieldValue('type') == 1"
				>
					<div class="title"><i class="title_icon"></i>结算单信息</div>
					<a-table
						rowKey="id"
						:columns="billColumns"
						:dataSource="billData"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="jumpToDetail('settle', record.id)"
								>查看</a
							>
						</template>
					</a-table>
				</div>
				<!-- 基于收发货数据，发起付款申请 -->
				<!-- v-if="payApplyForm.getFieldValue('type') == 2 && goodsData.length > 0" -->
				<template v-if="goodsData.length > 0">
					<GoodsInfo
						v-if="!loading"
						:isShowGoodsValue="isShowGoodsValue"
						:editDetail="detail"
						:pageState="'detail'"
						:source="detail.payType"
						:hasInvoice="payApplyForm.getFieldValue('hasInvoice')"
						:goodsData="goodsData"
						:deliveryIds="deliveryIds"
						:receiveRecordIds="receiveRecordIds"
						:goodsResultInfo="goodsResultInfo"
						type="additionalPayment"
						ref="goodsInfo"
						:orderDetail="orderDetail"
					/>
				</template>

				<!-- 全业务线-无收发货信息时，基于货转信息，发起付款申请 -->
				<template v-else>
					<GoodsTransferInfo
						v-if="payApplyForm.getFieldValue('type') == 2 && goodsData.length === 0"
						:isShowGoodsValue="isShowGoodsValue"
						:editDetail="detail"
						:pageState="'detail'"
						:source="detail.payType"
						:hasInvoice="payApplyForm.getFieldValue('hasInvoice')"
						:goodsData="goodsTransferData"
						:deliveryIds="deliveryIds"
						:receiveRecordIds="receiveRecordIds"
						:type="$route.query.type === 'submit' ? '' : 'additionalPayment'"
						:goodsResultInfo="goodsResultInfo"
						ref="goodsInfo"
					/>
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
								<span class="text">{{ detail.amountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">税额总和（元）</p>
							<p>
								<span class="text">{{ detail.taxAmountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">价税合计总和（元）</p>
							<p>
								<span class="text">{{ detail.totalAmountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">发票分拆金额总和（元）</p>
							<p>
								<span class="text">{{ detail.splitedAmountSum }}</span>
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
							<!-- <a
                href="javascript:;"
                style="margin-right: 8px;"
                @click="$router.push('/center/counterfoil/record/rongDetail?id=' + record.id)">查看</a> -->
							<a-popconfirm
								title="确定删除该条发票信息?"
								okText="确定"
								cancelText="取消"
								@confirm="() => onDeleteInvoice(record.key)"
							>
								<a
									href="javascript:;"
									class="delete-btn"
									>删除</a
								>
							</a-popconfirm>
						</template>
					</a-table>
					<p
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
							:payType="payApplyForm.getFieldValue('type')"
							:transType="$route.query.transType"
							:coalType="$route.query.coalType"
							:isShowGoodsValue="isShowGoodsValue"
							ref="customUpload"
							:isNeedRotate="true"
							:ifEditable="$route.query.type === 'submit' ? false : true"
							@uploadFiles="getUploadFiles"
							:fileDataSource="fileDataSource"
							:type="'addpay'"
							:allowFormat="isNeedStamp ? ['jpg', 'jpeg', 'png'] : []"
							:accountingSeal="isNeedStamp"
							:bankPayConfig="bankPayConfig"
						>
						</CustomUpload>
					</div>
				</div>

				<div class="btn-wrap">
					<a-button @click="goBack()">返回</a-button>
					<a-button
						:disabled="disabledSubmit"
						type="primary"
						@click="submitPayForm('save')"
						>保存</a-button
					>
					<a-button
						:disabled="disabledSubmit"
						type="primary"
						@click="submitPayForm('submit')"
						>提交</a-button
					>
				</div>
				<!--审批进度 3已付款 4驳回 -->
				<!--                <template v-if="(status== 3 || status == 4) && $route.query.method != 'collect'">-->
				<template v-if="showAudit">
					<div class="title"><i class="title_icon"></i>审批进度</div>
					<audit-records
						:data-source="auditProgressRecord"
						ref="auditRecords"
					/>
				</template>
			</a-form>
		</div>
		<!-- <a-modal
      title="发票信息"
      centered
      width="1000px"
      v-model="modalInvoiceInfoIsShow"
      okText="确定"
      cancelText="取消"
      @ok="modalInvoiceFormSubmit"
      @cancel="modalInvoiceFormCancel"
      class="modal-invoice-info"
    >
      <a-form layout="inline" class="search-wrap">
        <a-row class="row">
          <a-col :span="24">
            <a-form-item label="发票代码" class="order-wrap">
              <a-input v-model="params.code"> </a-input>
            </a-form-item>
            <a-form-item label="发票号码" class="order-wrap">
              <a-input v-model="params.no"> </a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                class="search-btn"
                @click="searchInvoiceInfo"
              >
                查询
              </a-button>
              <a-button html-type="reset" @click="resetInvoiceInfo">
                重置
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-table
          :rowSelection="{
            selectedRowKeys: invoiceSelectedRowKeys,
            onChange: onSelectInvoiceChange,
          }"
          :columns="modalInvoiceColumns"
          :dataSource="modalInvoiceData"
          :locale="{ emptyText: '暂无数据' }"
        >
        </a-table>
      </a-form>
    </a-modal> -->
		<a-modal
			title="发票信息"
			centered
			v-model="modalInvoiceInfoIsShow"
			width="850"
			okText="确定"
			cancelText="取消"
			@ok="modalInvoiceFormSubmit"
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
								v-model="params.code"
								placeholder="请输入"
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
								v-model="params.no"
								placeholder="请输入"
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
					:rowSelection="{ selectedRowKeys: invoiceSelectedRowKeys, onChange: onSelectInvoiceChange }"
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
					@click.native="modalInvoiceFormSubmit"
					>确定</a-button
				>
			</template>
		</a-modal>
		<DetailModel
			:isSelfLoad="pageType != 'submit'"
			:isView="false"
			ref="detailModel"
		/>
		<TipModal ref="tipModal" />
	</div>
</template>

<script>
import moment from 'moment';
import { filterCodeByKey, filterCodeByValueName } from '@sub/utils/globalCode.js';
import CustomUpload from '@/v2/components/CustomUpload';
import {
	API_GETCAPITALSOURCE,
	API_GETGOODSINFO,
	API_GETINVOICEINFO,
	API_GETPAYRECORDDETAIL,
	API_PaymentApplyOrderDetail,
	API_SavePaymentAdditional,
	API_SubmitPaymentAdditional,
	API_PAYAPPinvoLYLIST
} from '@/v2/center/trade/api/pay';
import GoodsInfo from '../components/GoodsInfo';
import AuditRecords from '../components/AuditRecords';
import { mapGetters } from 'vuex';
import DetailModel from '../components/DetailModel.vue';
import GoodsTransferInfo from '../components/GoodsTransferInfo';
import TipModal from '../components/TipModal';
import PaymentStep from './components/PaymentStep.vue';
import { shanMeiPayType } from '../payConfig.js';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { find, uniq } from 'lodash';

const assetBillVOColumns = [
	{ title: '票据号', dataIndex: 'serialNo' },
	{ title: '票据类型', dataIndex: 'billTypeDesc' },
	{ title: '票据持有方', dataIndex: 'receiverName' },
	{ title: '票据开立方', dataIndex: 'issuerName' },
	{ title: '融单金额(元)', dataIndex: 'amount' },
	{ title: '开立日期', dataIndex: 'issueDate' },
	{ title: '承诺付款日', dataIndex: 'acceptanceDate' },
	{ title: '票据状态', dataIndex: 'statusDesc' },
	{
		title: '操作',
		scopedSlots: { customRender: 'operation' },
		dataIndex: 'operation',
		fixed: 'right'
	}
];

export default {
	name: 'PayAdditionalPaymentTwoStep',

	components: {
		CustomUpload,
		GoodsInfo,
		AuditRecords,
		DetailModel,
		TipModal,
		GoodsTransferInfo,
		PaymentStep,
		TextOverFlow
	},
	data() {
		return {
			moment,
			shanMeiPayType,
			assetBillVOColumns,
			certNoList: [],
			invoiceAllData: [],
			invoicePagination: {},
			issuedDate: [],
			fileInfos: [],
			isNeedStamp: false,
			deliveryIds: '',
			receiveRecordIds: '',
			payType: '',
			detail: {},
			currentStep: 1,
			loading: false,
			steps: [
				{
					title: '选择采购订单'
				},
				{
					title: '填写付款信息'
				},
				{
					title: '完成'
				}
			],
			payApplyForm: this.$form.createForm(this),
			fileDataSource: [],
			payBankInfo: [],
			payTypeList: [],
			billColumns: [
				{
					title: '结算单号',
					dataIndex: 'serialNo'
				},
				{
					title: '结算金额(元)',
					dataIndex: 'settleAmount'
				},
				{
					title: '结算日期',
					dataIndex: 'confirmTime'
				},
				{
					title: '结算吨数(吨)',
					dataIndex: 'settleQuantity'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
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
					dataIndex: 'amount'
				},
				{
					title: '税额',
					dataIndex: 'taxAmount'
				},
				{
					title: '价税合计',
					dataIndex: 'totalAmount',
					customRender: (text, record) => record.totalAmount || record.total_amount
				},
				{
					title: '开票日期',
					dataIndex: 'issuedDate',
					customRender: (text, record) => record.issuedDate || record.issued_date
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
					dataIndex: 'amount'
				},
				{
					title: '税额',
					dataIndex: 'taxAmount'
				},
				{
					title: '价税合计',
					dataIndex: 'total_amount',
					customRender: (text, record) => record.totalAmount || record.total_amount
				},
				{
					title: '开票日期',
					dataIndex: 'issued_date',
					customRender: (text, record) => record.issuedDate || record.issued_date
				},
				{
					title: '操作',
					scopedSlots: {
						customRender: 'operation'
					},
					dataIndex: 'operation'
				}
			],
			goodsData: [],
			billData: [],
			invoiceData: [],
			modalInvoiceData: [],
			selectedRowKeys: [],
			invoiceSelectedRowKeys: [],
			invoiceSelectedIds: '',
			billSelectedRowKeys: [],
			billSelectedIds: '',
			goodsSelectedRowKeys: [],
			goodsSelectedIds: '',
			modalInvoiceInfoIsShow: false,
			params: {
				code: '',
				no: ''
			},
			paymentType: [
				{
					value: '1',
					text: '结算付款'
				},
				{
					value: '2',
					text: '预结算付款'
				},
				{
					value: '3',
					text: '融资还款'
				},
				{
					value: '4',
					text: '预付款'
				}
			],
			paymentMethod: [
				{ value: '1', text: '银行存款' },
				{ value: '2', text: '银行承兑汇票' },
				{ value: '3', text: '商业承兑汇票' },
				{ value: '4', text: '信用证' },
				{ value: '5', text: '现金' },
				{ value: '6', text: '银行汇票' },
				{ value: '7', text: 'T/T' },
				{ value: '8', text: '支票' },
				{ value: '9', text: '其他' }
			],
			approvalColumns: [
				{
					title: '节点名称',
					dataIndex: 'nodeName'
				},
				{
					title: '操作人',
					dataIndex: 'signature'
				},
				{
					title: '审批结果',
					dataIndex: 'operation'
				},
				// {
				//     title: '留言',
				//     dataIndex: 'message',
				// },

				{
					title: '操作时间',
					dataIndex: 'signatureDate'
				}
			],
			auditProgressRecord: [],
			status: '',
			payDate: null,
			goodsResultInfo: '',
			pageType: '',
			amountDetail: {}, // 货值总金额 信息
			/**
			 * goodsAllAmount 总货值 = 加权货值+单批次总货值+调整总金额+额外扣减
			 * 该字段用于页面暂存'调整总金额'为0时的基础货值总金额
			 * 在货值总金额明细页面显示的"调整总金额"为接口返回的"货值总金额"-goodsAllAmount
			 */
			goodsAllAmount: 0, // 初始化货值总金额，此时调整金额为0
			accountingDetail: {}, // 合同核算办法明细数据
			isShowGoodsValue: false,
			orderDetail: {},

			// 全业务线
			bizLineInfo: [], // 全业务线数据
			bizLineSelectedRowKeys: [], // 选中全业务线key
			bizLineColumns: [
				{
					title: '煤种',
					dataIndex: 'coalType',
					customRender: text => filterCodeByValueName(text, 'goods_type') || text,
					width: 120
				},
				{
					title: '交易参与企业',
					dataIndex: 'companyName'
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
				}
			],
			goodsTransferData: [], // 货转信息
			disabledSubmit: false,
			bankPayConfig: {}
		};
	},
	created() {
		this.pageType = this.$route.query.type;
		//  插入默认收款方
		const { sellerName } = this.$route.query;
		this.payApplyForm.setFieldsValue({ sellerName });
		this.getOrderDetail();
		// 判断是否是修改
		this.loading = true;
		if (this.$route.query.id) {
			// 获取支付详情
			API_GETPAYRECORDDETAIL({ id: this.$route.query.id, additional: 1 })
				.then(res => {
					if (res.success) {
						if (this.$route.query.isAdditionalPaymentCreat) {
							res.data.hasInvoice = '1'; // 追加付款，默认有票
						}
						const r = res.data;

						// 全业务线-- 业务线数据回显
						this.bizLineInfo = res.data.businessLineFullList || [];
						this.bizLineSelectedRowKeys = [res.data.businessLineFullId];

						this.detail = res.data || {};
						this.isShowGoodsValue = this.detail ? this.CONSTANTS.isShowGoodsValue.indexOf(this.detail.financingType) > -1 : false;
						this.payBankInfo = [];
						// 回款账号列表
						if (this.$route.query.orderType === 'ONLINE') {
							const payBankObj = {};
							payBankObj.id = r.receiveId;
							payBankObj.no = r.receiveAccNo;
							payBankObj.name = r.receiveAccName;
							payBankObj.bankName = r.receiveAccBank;
							payBankObj.uscc = r.sellerUscc;
							this.payBankInfo.push(payBankObj);
						}
						this.$nextTick(() => {
							this.payApplyForm.setFieldsValue({
								// "comments": r.comments,
								hasInvoice: r.hasInvoice,
								method: r.method,
								payAmount: r.payAmount,
								goodsValue: r.goodsValue == 0 ? '-' : r.goodsValue, // 应付账款金额
								receiveId: r.receiveId,
								receiveAccName: r.receiveAccName,
								sellerName: r.sellerName,
								type: r.type,
								payType: r.payType,
								totalAmount: r.totalAmount,
								goodsAmount: r.goodsAmount,
								changeExplain: r.changeExplain,
								payTypeName: r.payTypeName,
								receiveAccNo: r.receiveAccNo,
								receiveAccBank: r.receiveAccBank
							});
							this.payType = r.payType;
							this.needStamp(r.payType);
							setTimeout(() => {
								this.payApplyForm.setFieldsValue({
									payAmount: r.payAmount,
									planPayDate: r.planPayDate ? moment(r.planPayDate) : null,
									promisePayDate: r.promisePayDate ? moment(r.promisePayDate) : null
								});
							});
							let data;
							// 设置结算单信息
							if (r.type == '1') {
								this.billData = r.statementInfoList;
								data = this.billData;
								this.billSelectedRowKeys = r.statementIds;
								this.billSelectedIds = r.statementIds.join(',');
							}
							if (r.statementIds) {
								const result = [];
								data.forEach(item => {
									r.statementIds.forEach(it => {
										if (it == item.id) {
											result.push(item);
										}
									});
								});
								if (r.type == '1') {
									this.billData = result;
								}
							}
							// if (this.isShowAccounting) {
							//   this.payApplyForm.setFieldsValue({
							//     "goodsValueTotalAmount": r.goodsValueTotalAmount,
							//     "goodsValueThisAmount":r.goodsValueThisAmount,
							//     "goodsValueAdjustExplain":r.goodsValueAdjustExplain
							//   })
							//   if(this.pageType == 'submit'){
							//     this.getAccountingDetail()
							//     this.getTemplateDetail()
							//   }
							// }

							// 设置货物信息
							if (r.type == '2') {
								this.deliveryIds = r.deliveryIds ? r.deliveryIds.split(',') : [];
								this.receiveRecordIds = r.receiveRecordIds ? r.receiveRecordIds.split(',') : [];
								this.goodsData = r.preStatementDeliveryDtoList || [];
								this.goodsResultInfo = r.goodsInfo ? JSON.parse(r.goodsInfo) : '';
								// 全业务线---货转数据
								this.goodsTransferData = r.goodsTransferRecordVOList;

								this.certNoList = r.goodTransferNos ? r.goodTransferNos.split(',') : [];
							}
							this.getCaptialSource(r.type); // 获取资金来源
							// 设置附件信息
							if (!this.$route.query.additionalPayment) {
								this.fileDataSource = r.paymentAttachmentInfo;
							}
							// 发票数据
							if (r.upInvoiceList) {
								r.upInvoiceList.forEach((item, index) => {
									r.upInvoiceList[index].key = item.id;
								});
								this.invoiceData = r.upInvoiceList;
								this.invoiceAllData = r.upInvoiceList;
								this.invoiceSelectedRowKeys = r.invoiceIds;
								this.invoiceSelectedIds = r.invoiceIds.join(',');
							}

							// 设置审批记录
							this.status = r.status;

							// 状态不同，对应付款日期字段不同
							setTimeout(() => {
								if (this.status == 3) {
									this.payApplyForm.setFieldsValue({
										confirmTime: r.confirmTime ? moment(r.confirmTime) : null
									});
									this.payDate = r.confirmTime;
								} else {
									this.payApplyForm.setFieldsValue({
										planPayDate: r.planPayDate ? moment(r.planPayDate) : null
									});
									this.payDate = r.planPayDate;
								}
							}, 500);
							if (r.auditProgress) {
								this.auditProgressRecord = JSON.parse(r.auditProgress);
							}
							setTimeout(this.checkConfig, 600);
						});
					}
				})
				.finally(() => (this.loading = false));
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		showAudit() {
			if (this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY') {
				// 核心企业，审批记录为空 不展示栏目
				return this.auditProgressRecord.length > 0;
			}
			// 一般贸易商，没有风控审批记录 不展示栏目
			return this.auditProgressRecord.filter(item => item.source === '易煤风控').length > 0;
		}
		//   isShowAccounting(){
		//       return (this.VUEX_ST_COMPANYSUER.companyUscc==='91410100MA45CKY3XX' || this.detail.buyerUscc === '91410100MA45CKY3XX') && this.detail.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL && !!this.detail.terminalCompanyId
		//   }
	},
	methods: {
		// 打开合同详情页
		toContractDetail() {
			let routerData = this.$router.resolve({
				path: '/center/contract/buy/online/detail',
				query: {
					id: this.$route.query.orderId,
					type: 'BUY'
				}
			});
			window.open(routerData.href, '_blank');
		},
		paginationChange(data) {
			let result = {};
			this.invoicePagination.pageNo = data.current;
			Object.assign(result, this.invoicePagination, this.params);
			this.getInvoiceInfo(result);
		},
		issuedDateChange(value, dateString) {
			this.params.issuedDateBegin = dateString[0];
			this.params.issuedDateEnd = dateString[1];
		},
		goBack() {
			if (this.$route.query.type === 'submit') {
				this.$router.go(-1);
				return;
			}
			this.$confirm({
				centered: true,
				title: '系统可能不会保存您所做的更改，确定要离开吗?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$router.go(-1);
				}
			});
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		needStamp(value) {
			// 判断核算表是否需要盖章
			let that = this;
			let timer = setInterval(function () {
				if (that.payTypeList.length > 0) {
					that.payTypeList.forEach(item => {
						if (item.source == value) {
							that.isNeedStamp = Boolean(item.accountingSeal);
							//0核算表不盖章  1核算表盖章
						}
					});
					clearInterval(timer);
				}
			}, 500);
		},
		openNewPage() {
			const { id, orderId, type, orderType } = this.$route.query;
			const { href } = this.$router.resolve({
				path: '/center/fund/pay/record/detail',
				query: { id, orderId, type, orderType }
			});
			window.open(href);
		},
		getCaptialSource(value) {
			// 获取资金来源
			const captialObj = {};
			if (value == 2) {
				captialObj.goodsTransferOnly = this.goodsData.length === 0;
			}
			(captialObj.sellerUscc = this.detail.sellerUscc || this.payBankInfo[0].uscc), (captialObj.type = value);
			API_GETCAPITALSOURCE(captialObj).then(res => {
				if (res.success) {
					this.payTypeList = res.result;
				}
			});
		},
		getOrderDetail() {
			API_PaymentApplyOrderDetail({
				orderId: this.$route.query.orderId,
				orderType: this.$route.query.orderType
			}).then(res => {
				if (res.success) {
					this.orderDetail = res.data || {};
				}
			});
		},
		payTypeChange(value, filterIds) {
			API_GETGOODSINFO({ orderId: this.$route.query.orderId, paytype: value }).then(res => {
				if (res.success) {
					let data;
					if (value == '1') {
						// 结算信息
						this.billData = res.result;
						data = this.billData;
					}
					if (filterIds) {
						const result = [];
						data.forEach(item => {
							filterIds.forEach(it => {
								if (it == item.id) {
									result.push(item);
								}
							});
						});
						if (value == 1) {
							this.billData = result;
						}
					}
				}
			});
		},
		/**
		 * 动力煤
		 * 汽运、船运——代发证明（非必填）、委托函（非必填）
		 * 火运——代发证明（必填）、委托函（必填）
		 * 火运、汽运核算表（当使用中原银行资金和善美-供应链资金时，必填；当使用善美-自有和自有资金非必填）；
		 * 非动力煤
		 * 汽运、船运、火运——代发证明（非必填）、委托函（非必填）
		 */
		// 核算表的配置跟随付款模块的admin端配置
		validateFileType() {
			// 核算表：都有，必填，注意区分需要盖章和不需要盖章的上传附件的格式要求
			// 委托结算函、代发证明：火运，火运和气运时必填，汽运、船运时非必填
			let arr = this.bankPayConfig.fileConfigList;
			if (!arr) {
				this.$message.error('获取文件配置失败，请稍后重试');
				return false;
			}
			let typeArr = this.fileInfos.map(item => item.type);
			typeArr = [...new Set(typeArr)];
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].type == 28 && arr[i].required && !typeArr.includes(arr[i].type)) {
					this.$message.error('请上传收货对应的核算表附件');
					return false;
				}
			}
			switch (this.orderDetail.transportMode) {
				case 'AUTOMOBILE_AND_TRAIN':
					break;
				case 'TRAIN':
					if (!typeArr.includes('WTJSH')) {
						this.$message.error('请上传收货对应的委托结算函附件');
						return false;
					}
					if (!typeArr.includes('DFZM')) {
						this.$message.error('请上传收货对应的代发证明附件');
						return false;
					}
					break;
				case 'AUTOMOBILE':
					break;
				case 'SHIP':
					break;
				default:
					break;
			}
			return true;
			// // 全业务线--付款类型“预付款”值为4，无论选择何种资金，附件均非必填
			// if (this.payApplyForm.getFieldValue('type') == '4') {
			//   return true;
			// }
			// if (this.$route.query.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL) {
			//   if (this.$route.query.transType == this.CONSTANTS.transportModeDict.TRAIN) {
			//     if (!typeArr.includes(6)) {
			//       this.$message.error('请上传收货对应的代发证明附件');
			//       return false;
			//     }
			//     if (
			//       this.payApplyForm.getFieldValue('payType') == '91610139MA6U8HA76Y'
			//       || this.payApplyForm.getFieldValue('payType') == '9141000031741675X6'
			//     ) {
			//       if (!typeArr.includes(28)) {
			//         this.$message.error('请上传收货对应的核算表附件');
			//         return false;
			//       }
			//     } // 中原银行资金和善美-供应链资金必填
			//     if (!typeArr.includes(7)) {
			//       this.$message.error('请上传收货对应的委托结算函附件');
			//       return false;
			//     }
			//     return true;
			//   }
			//   if (
			//     this.payApplyForm.getFieldValue('payType') == '91610139MA6U8HA76Y'
			//     || this.payApplyForm.getFieldValue('payType') == '9141000031741675X6'
			//   ) {
			//     if (!typeArr.includes(28)) {
			//       this.$message.error('请上传收货对应的核算表附件');
			//       return false;
			//     }
			//     return true;
			//   } // 中原银行资金和善美-供应链资金必填
			//   return true;
			// }
			// if (this.$route.query.transType == this.CONSTANTS.transportModeDict.SHIP) {
			//   if (
			//     this.payApplyForm.getFieldValue('payType') == '91610139MA6U8HA76Y'
			//     || this.payApplyForm.getFieldValue('payType') == '9141000031741675X6'
			//   ) {
			//     if (!typeArr.includes(28)) {
			//       this.$message.error('请上传收货对应的核算表附件');
			//       return false;
			//     }
			//     return true;
			//   } // 中原银行资金和善美-供应链资金必填
			//   return true;
			// }
			// return true;
		},
		async submitPayForm(type) {
			// 货物信息处理
			let goodsvdata = {};
			if (this.$refs.goodsInfo) {
				try {
					goodsvdata = await this.$refs.goodsInfo.validateForm();
				} catch (e) {
					goodsvdata = null;
				}
				if (!goodsvdata) {
					return;
				}
			}
			this.payApplyForm.validateFields((err, values) => {
				if (!err) {
					// 如果付款类型为1，则结算单信息不能为空,如果为2，则货物信息不能为空
					if (values.type == '1') {
						if (this.billSelectedIds == '') {
							this.$message.error('结算单信息不能为空');
							return;
						}
					}
					if (values.type == '2') {
						if (!this.$refs.goodsInfo.goodsSelectedRowKeys) {
							this.$message.error('货物信息不能为空');
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
					// 主体信息
					const bodyObj = {
						// "comments": values.comments,
						mainPaymentNo: this.detail.mainPaymentNo || this.$route.query.serialNo,
						deliveryBatchIds: this.goodsSelectedIds,
						hasInvoice: values.hasInvoice,
						id: this.$route.query.id,
						invoiceIds: this.invoiceSelectedIds,
						method: values.method,
						orderId: this.$route.query.orderId,
						payAmount: this.detail.payAmount,
						goodsValue: this.detail.goodsValue, // 应付账款金额
						planPayDate: this.payDate || '',
						confirmTime: this.payDate || '',
						receiveId: values.receiveId,
						receiveAccName: values.receiveAccName,
						saveType: type == 'save' ? 1 : 2,
						sellerName: this.$route.query.sellerName,
						settmentIds: this.billSelectedIds,
						type: values.type,
						payType: values.payType,
						payType: this.payType,
						payDateFlag: new Date().getTime() > new Date(`${this.payDate} 23:59:59`).getTime() ? 0 : 1,
						goodsInfo: this.goodsResultInfo ? JSON.stringify(this.goodsResultInfo) : '',

						enableGoods: this.detail.enableGoods,
						thistransferAmount: this.detail.thistransferAmount,
						totalAmountSum: this.detail.totalAmountSum,
						transferableAmount: this.detail.transferableAmount,
						transferredAmount: this.detail.transferredAmount || 0,

						// 全业务线新增字段
						orderNo: this.orderDetail.serialNo,
						orderType: this.$route.query.orderType,
						// certNoList: this.goodsData.length === 0 ? this.deliveryIds : [],
						certNoList: this.certNoList,
						receiveAccNo: values.receiveAccNo,
						receiveAccBank: values.receiveAccBank,
						fullBizLineId: this.bizLineSelectedRowKeys[0],
						promisePayDate: values.promisePayDate && values.promisePayDate.format('YYYY-MM-DD'),
						...goodsvdata
					};
					if (this.$route.query.additionalPayment) {
						delete bodyObj.id;
					}
					// if (this.isShowAccounting) {
					//   bodyObj = {
					//     ...bodyObj,
					//     goodsValueTotalAmount: values.goodsValueTotalAmount,
					//     goodsValueThisAmount: values.goodsValueThisAmount,
					//     goodsValueAdjustExplain: values.goodsValueAdjustExplain
					//   }
					// }

					// if (this.status == 3) {
					//   delete bodyObj.planPayDate;
					// } else {
					//   delete bodyObj.confirmTime;
					// }

					// 附件信息
					const fileObj = {};
					this.fileDataSource.forEach((item, index) => {
						Object.assign(fileObj, this.fileDataSource[index]);
					});

					// Object.assign(bodyObj,fileObj);
					bodyObj.fileInfoList = this.fileInfos;
					if (type == 'save') {
						this.disabledSubmit = true;
						API_SavePaymentAdditional(bodyObj)
							.then(res => {
								if (res.success) {
									this.$router.push('/center/fund/pay/additional/payment/threeStep');
								}
							})
							.finally(() => {
								this.disabledSubmit = false;
							});
					}
					if (type == 'submit') {
						if (!this.validateFileType()) {
							return;
						}
						// 付款时选择非自有资金需要判断销售合同是否完善
						// API_JudgeContractNew({ orderSerialNo: this.$route.query.orderNo }).then((res) => {
						//   if (res.success) {
						//     if (!res.result.exist) return;
						//     if (!this.detail.terminalContractId && this.detail.payType != '0') {
						//       switch (`${this.detail.terminalModel}`) {
						//       case '1':
						//       case '3':
						//         // 云控推过来的数据，无法完善，只给出提示
						//         this.$refs.tipModal.init(true, this.detail);
						//         return;
						//       case '2':
						//         // 暂时没有这种情况，不处理
						//         break;
						//         // 需要完善
						//       }
						//     }

						this.$confirm({
							centered: true,
							title: '请确认付款信息填写完成并提交？',
							okText: '确定',
							cancelText: '取消',
							onOk: () => {
								this.disabledSubmit = true;
								return API_SubmitPaymentAdditional(bodyObj)
									.then(res => {
										if (res.success) {
											this.$router.push('/center/fund/pay/additional/payment/threeStep');
										}
									})
									.finally(() => {
										this.disabledSubmit = false;
									});
							}
						});

						//   }
						// });
					}
				}
			});
		},
		// addInvoice() {
		//   this.modalInvoiceInfoIsShow = true;
		//   this.getInvoiceInfo();
		// },
		addInvoice() {
			this.modalInvoiceInfoIsShow = true;
			this.invoicePagination = {
				current: 1,
				pageNo: 1
			};
			this.params = {
				code: '',
				no: ''
			};
			this.getInvoiceInfo(this.invoicePagination);
		},
		getInvoiceInfo(params) {
			API_GETINVOICEINFO({
				...params,
				orderNo: this.$route.query.orderNo,
				orderType: this.$route.query.orderType,
				type: 'UP'
			}).then(res => {
				if (res.success) {
					this.modalInvoiceData = [];
					res.result.records.forEach(item => {
						this.modalInvoiceData.push({
							key: item.id,
							amount: item.amount,
							code: item.code,
							id: item.id,
							no: item.no,
							taxAmount: item.taxAmount,
							...item
						});
					});

					this.invoiceAllData = this.invoiceAllData.concat(res.result.records);
					const pagination = {
						total: res.result.total,
						pageSize: res.result.size,
						current: res.result.current,
						showTotal: function (total) {
							return `共${total}条记录 第${res.result.current}页 `;
						}
					};
					this.invoicePagination = pagination;
				}
			});
		},
		modalInvoiceFormSubmit() {
			// 插入发票选中数据
			this.invoiceData = [];
			this.invoiceAllData.forEach(item => {
				this.invoiceSelectedRowKeys.forEach(id => {
					if (item.id == id) {
						item['key'] = item.id;
						if (JSON.stringify(this.invoiceData).indexOf(JSON.stringify(item)) == -1) {
							if (this.invoiceData.map(item => item.id).includes(id)) {
								return;
							}
							this.invoiceData.push(item);
						}
					}
				});
			});
			this.getInvoiceIds();
			this.modalInvoiceInfoIsShow = false;
		},
		modalInvoiceFormCancel() {
			this.modalInvoiceInfoIsShow = false;
		},
		searchInvoiceInfo() {
			this.getInvoiceInfo(this.params);
		},
		resetInvoiceInfo() {
			this.params = {
				code: '',
				no: ''
			};
			this.issuedDate = [];
			this.getInvoiceInfo();
		},
		onSelectInvoiceChange(selectedRowKeys, selectedRows) {
			this.invoiceSelectedRowKeys = selectedRowKeys;
			// 插入发票选中数据
			// this.invoiceData = selectedRows;
			// this.getInvoiceIds();
		},
		// getInvoiceIds() {
		//   const selectIds = [];
		//   this.invoiceData.forEach((item) => {
		//     selectIds.push(item.id);
		//   });
		//   this.invoiceSelectedIds = selectIds.join(',');
		// },
		getInvoiceIds() {
			const selectIds = [];
			this.invoiceData.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedIds = selectIds.join(',');
			// 实时计算发票汇总
			API_PAYAPPinvoLYLIST({
				invoiceIds: selectIds,
				orderId: this.$route.query.orderId,
				orderNo: this.$route.query.orderNo,
				type: 'UP',
				orderType: this.$route.query.orderType
			}).then(res => {
				if (res.success) {
					this.detail = {
						...this.detail,
						...res.result
					};
				}
			});
		},
		onSelectBillChange(selectedRowKeys, selectedRows) {
			this.billSelectedRowKeys = selectedRowKeys;
			const selectIds = [];
			selectedRows.forEach(item => {
				selectIds.push(item.id);
			});
			this.billSelectedIds = selectIds.join(',');
		},
		onDeleteInvoice(key) {
			const invoiceData = [...this.invoiceData];
			const keys = [];
			this.invoiceData = invoiceData.filter(item => item.key !== key);
			this.$message.success('删除成功');
			this.invoiceData.forEach(item => {
				keys.push(item.key);
			});
			this.invoiceSelectedRowKeys = keys;
			this.getInvoiceIds();
		},
		jumpToDetail(type, id) {
			if (type == 'settle') {
				window.open(`/center/settle/mine/detail?orderId=${this.$route.query.orderId}&id=${id}`);
			}
			if (type == 'goods') {
				window.open(`/center/receive/accept/detail?deliverId=${id}`);
			}
		},
		// // 获取合同核算办法明细
		// async getAccountingDetail(){
		//   let resp = await API_GetIndicatorTemplateAccountingDetail({
		//     orderId: this.$route.query.orderId
		//   })
		//   if (resp.success)this.accountingDetail = resp.data || {}
		// },
		// 获取贷款总金额明细
		// async getTemplateDetail(){
		//   let resp = await API_GetIndicatorTemplateAddDetail({
		//     orderId: this.$route.query.orderId,
		//     // totalAmount: this.detail.goodsValueTotalAmount
		//     totalAmount: 0
		//   })
		//   if (resp.success){
		//     this.amountDetail = resp.data || {}
		//     this.goodsAllAmount = 0
		//     let obj = this.amountDetail.goodsItemVO || {}
		//     Object.keys(obj).forEach(key => {return this.goodsAllAmount += Number(obj[key]||0)})
		//     this.goodsAllAmount = Number(this.goodsAllAmount.toFixed(6))

		//     if(!isNaN(Number(this.detail.goodsValueTotalAmount))){
		//       this.amountDetail = {
		//         ...this.amountDetail,
		//         goodsItemVO: {
		//           ...obj,
		//           adjustTotalAmount: Number((this.detail.goodsValueTotalAmount-this.goodsAllAmount).toFixed(6))
		//         }
		//       }
		//     }

		//   }
		// },

		handleViewDetail() {
			if (this.pageType == 'submit') {
				this.$refs.detailModel.init(this.accountingDetail, this.amountDetail);
			} else {
				this.$refs.detailModel.init();
			}
		},
		checkConfig() {
			// if (!this.goodsResultInfo) return

			let downStreamOrderNo = null;

			if (this.bizLineSelectedRowKeys.length) {
				let bz = find(this.bizLineInfo, { id: this.bizLineSelectedRowKeys[0] });
				if (bz && bz.orderNo) {
					let arr = bz.orderNo.split(',');
					let index = arr.indexOf(this.orderDetail.serialNo) + 1;
					downStreamOrderNo = arr[index];
				}
			}

			let despatchTypes = [];
			if (this.goodsResultInfo && (this.goodsData || this.goodsTransferData)) {
				this.goodsResultInfo.forEach(item => {
					// eslint-disable-next-line no-undef
					let i =
						find(this.goodsData, { id: item.deliverBatchId || item.deliveryId }) ||
						_.find(this.goodsTransferData, { no: item.no });

					if (i) {
						despatchTypes.push(i.despatchType);
					}
				});
			}

			let payType = this.detail.payType;
			let type = this.detail.type;
			if (payType && type) {
				this.bankPayConfig = {};
				API_GETCAPITALSOURCE({
					despatchType: uniq(despatchTypes).join(','),
					d: Date.now(),
					orderNo: this.orderDetail.serialNo,
					type: type,
					goodsTransferOnly: false,
					sellerUscc: this.payBankInfo[0].uscc,
					downStreamOrderNo
				}).then(res => {
					if (res.success) {
						this.fileTypeInfo = null;
						let arr = res.result || [];
						let cur = find(arr, { source: payType }) || {};
						this.bankPayConfig = cur;
						this.bankPayConfig.fileConfigList.forEach(item => {
							if (item.typeDesc == '保证金支付凭证') {
								this.fileTypeInfo = item;
							}
						});
					}
				});
			}
		}
	}
};
</script>

<style lang="less">
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
			width: 240px;
		}
		.ant-select {
			width: 240px;
		}
	}
	.pay-account-wrap {
		.ant-select {
			width: 420px;
		}
	}
	.row {
		padding-left: 40px;
		.detail-wrapper {
			width: fit-content;
			position: absolute;
			top: 10px;
			right: 0px;
		}
		::v-deep.has-error .ant-form-explain {
			position: absolute;
		}
	}
	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 74px;
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
	.upload-wrap {
		margin-bottom: 30px;
	}
	.ant-input-number {
		width: 240px;
	}
}
.modal-invoice-info {
	width: 80% !important;
	.search-btn {
		margin-right: 10px;
	}
}
.specialItem {
	.textOverflow {
		position: relative;
		top: 0px;
		left: 0;
	}
}
</style>
