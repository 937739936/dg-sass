<template>
	<div class="main">
		<a-form
			:form="form"
			class="slFormDetail"
		>
			<div class="mainCon">
				<div>
					<table
						class="new-table"
						border="2"
						rules="all"
						cellpadding="0"
					>
						<tr>
							<th colspan="3">贸易结算单</th>
						</tr>
						<tr>
							<td align="left">
								<a-space :size="10">
									<span class="title">合同编号</span>
									<span>{{ contractInfo.contractNo }}</span>
								</a-space>
							</td>
							<td
								align="left"
								style="width: 33.333%"
							>
								<a-space :size="10">
									<span class="title">供货周期</span>
									<span>
										{{ contractInfo.deliveryStartDate }}
										~
										{{ contractInfo.deliveryEndDate }}
									</span>
								</a-space>
							</td>
							<td
								align="left"
								style="width: 33.333%"
							>
								<a-row type="flex">
									<a-col flex="80px">
										<span class="required">*</span>
										<span
											class="title"
											style="line-height: 32px"
										>
											结算日期
										</span>
									</a-col>
									<a-col flex="auto">
										<div class="inputIconMain">
											<a-form-item>
												<a-date-picker
													placeholder="请选择结算日期"
													valueFormat="YYYY-MM-DD"
													:disabled-date="disabledDate"
													:getPopupContainer="getPopupContainer"
													style="width: 100%"
													@change="settleTimeChange"
													v-decorator="[
														'settleTime',
														{
															rules: [{ required: true, message: '请选择结算日期' }]
														}
													]"
												>
													<span
														slot="suffixIcon"
														class="calendar"
													></span>
												</a-date-picker>
											</a-form-item>
											<a-tooltip
												v-if="form.getFieldError(`settleTime`)"
												:title="form.getFieldError(`settleTime`).toString()"
											>
												<div class="icon">
													<i class="icon-tishi iconfont" />
												</div>
											</a-tooltip>
										</div>
									</a-col>
								</a-row>
							</td>
						</tr>
						<tr>
							<td
								align="left"
								style="width: 33.333%"
							>
								<a-row type="flex">
									<a-col flex="50px">
										<span class="required">*</span>
										<span
											class="title"
											style="line-height: 32px"
										>
											品名
										</span>
									</a-col>
									<a-col flex="auto">
										<div class="inputIconMain">
											<a-form-item>
												<a-select
													v-if="contractExamineIndicatorOption.length > 1"
													placeholder="请选择品名"
													:getPopupContainer="getPopupContainer"
													style="width: 100%"
													@change="receiveIndicatorsChange"
													v-decorator="[
														'combineGoodsName',
														{
															rules: [{ required: true, message: '请选择品名' }]
														}
													]"
												>
													<a-select-option
														v-for="item in contractExamineIndicatorOption"
														:key="item.combineGoodsName"
													>
														{{ item.combineGoodsName }}
													</a-select-option>
												</a-select>
												<a-input
													v-else
													placeholder="请选择品名"
													readOnly
													v-decorator="[
														'combineGoodsName',
														{
															rules: [{ required: true, message: '请选择品名' }]
														}
													]"
												/>
											</a-form-item>
											<a-tooltip
												v-if="form.getFieldError(`combineGoodsName`)"
												:title="form.getFieldError(`combineGoodsName`).toString()"
											>
												<div class="icon">
													<i class="icon-tishi iconfont" />
												</div>
											</a-tooltip>
										</div>
									</a-col>
								</a-row>
							</td>
							<td
								align="left"
								colspan="2"
							>
								<!-- 运输方式特殊处理，展示运输内容，内容外部决定 -->
								<table
									border="0"
									cellpadding="0"
									class="transTypeMain"
								>
									<template v-for="key in Object.keys(transType).filter(item => item != 'ships')">
										<template v-if="transType[key] && transType[key].length">
											<template v-for="(item, index) in transType[key]">
												<tr :key="key + index">
													<td
														v-for="(items, indexs) in item"
														:key="indexs"
														:colspan="indexs == item.length - 1 ? 5 - indexs : 1"
													>
														<span class="title">{{ items.name }}</span>
														<template v-if="items.type == 'number'">
															{{ items.value | formatMoney(4) }}
														</template>
														<template v-else>
															{{ items.value }}
														</template>
													</td>
												</tr>
											</template>
										</template>
									</template>
								</table>
								<!-- 船运信息展示 -->
								<div
									v-for="(key, i) in Object.keys(transType).filter(item => item == 'ships')"
									:key="i"
								>
									<template v-if="transType[key] && transType[key].length">
										<div
											v-for="(item, index) in transType[key]"
											:key="index"
											class="transTypeMain"
										>
											<a-space
												:size="10"
												v-for="items in item"
												:key="items.name"
											>
												<span class="title">{{ items.name }}</span>
												<span>
													<template v-if="items.type == 'number'">
														{{ items.value | formatMoney(4) }}
													</template>
													<template v-else>
														{{ items.value }}
													</template>
												</span>
											</a-space>
										</div>
									</template>
								</div>
							</td>
						</tr>
					</table>
				</div>
				<div class="tablex">
					<table
						class="new-table"
						border="2"
						rules="all"
						cellpadding="0"
					>
						<tr>
							<td
								rowspan="5"
								style="border-bottom: 0; border-left: 0; width: 60px"
							>
								<span
									class="title"
									style="display: inline-block; white-space: normal; width: 32px"
								>
									指标信息
								</span>
							</td>
							<td align="left">
								<span class="title">指标名</span>
							</td>
							<template v-if="productIndicatorSelect.length">
								<td
									v-for="item in productIndicatorSelect"
									:key="item.indicatorCode"
									align="left"
								>
									<a-space :size="4">
										<span class="title">
											{{ item.indicatorName }}
											<i
												class="icon-a-shanchu-caozuo6 iconfont"
												@click="modalInfoShow(item.indicatorCode)"
											>
											</i>
										</span>
									</a-space>
								</td>
							</template>
							<td
								rowspan="4"
								v-else
							>
								请选择收指标信息
							</td>
							<td
								rowspan="4"
								style="border-right: 0; width: 56px"
							>
								<a
									style="width: 28px"
									@click="assessmentModel"
									>添加考核指标</a
								>
							</td>
						</tr>
						<tr>
							<td align="left">
								<span class="title"> 合同基准值 </span>
							</td>
							<td
								v-for="item in productIndicatorSelect"
								:key="item.indicatorCode"
								align="left"
							>
								<span>{{ receiveIndicatorsFind(item.indicatorCode) }}</span>
							</td>
						</tr>
						<tr>
							<td align="left">
								<span
									class="required"
									v-show="!hiddenRow.includes('INDICATOR_CURRENT_SETTLE_AMOUNT')"
								>
									*
								</span>
								<span class="title">
									本次结算值
									<a-tooltip>
										<template slot="title"> 如您确认结算单中不需要展示该信息，您可以点击禁用此行 </template>
										<i
											class="icon-yanjing iconfont"
											v-show="!hiddenRow.includes('INDICATOR_CURRENT_SETTLE_AMOUNT')"
											@click="hiddenRowChange('INDICATOR_CURRENT_SETTLE_AMOUNT')"
										/>
										<i
											class="icon-guanbiyanjing iconfont"
											v-show="hiddenRow.includes('INDICATOR_CURRENT_SETTLE_AMOUNT')"
											@click="hiddenRowChange('INDICATOR_CURRENT_SETTLE_AMOUNT')"
										/>
									</a-tooltip>
								</span>
							</td>
							<td
								v-for="item in productIndicatorSelect"
								:key="item.indicatorCode"
								align="left"
								:class="{
									disabled: hiddenRow.includes('INDICATOR_CURRENT_SETTLE_AMOUNT')
								}"
							>
								<div class="inputIconMain">
									<a-form-item>
										<!-- 如果禁用此列则为非必填 -->
										<a-input-number
											:placeholder="item.errorMsg"
											:max="item.columnMax"
											:min="item.columnMin"
											:disabled="hiddenRow.includes('INDICATOR_CURRENT_SETTLE_AMOUNT')"
											v-decorator="[
												`${item.indicatorCode}_settleValue`,
												{
													initialValue: item.settleValue,
													rules: [
														{
															required: !hiddenRow.includes('INDICATOR_CURRENT_SETTLE_AMOUNT'),
															message: `${item.indicatorName}必填`
														},
														{
															validator: (rule, value, callback) => validateLeftFieldsError(value, callback, item)
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`${item.indicatorCode}_settleValue`)"
										:title="form.getFieldError(`${item.indicatorCode}_settleValue`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
						</tr>
						<tr>
							<td align="left">
								<span
									class="required"
									v-show="!hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')"
								>
									*
								</span>
								<span class="title">
									本次奖罚值(元/吨)
									<a-tooltip>
										<template slot="title"> 如您确认结算单中不需要展示该信息，您可以点击禁用此行 </template>
										<i
											class="icon-yanjing iconfont"
											v-show="!hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')"
											@click="hiddenRowChange('INDICATOR_CURRENT_REWARD_AMOUNT')"
										/>
										<i
											class="icon-guanbiyanjing iconfont"
											v-show="hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')"
											@click="hiddenRowChange('INDICATOR_CURRENT_REWARD_AMOUNT')"
										/>
									</a-tooltip>
								</span>
							</td>
							<td
								v-for="item in productIndicatorSelect"
								:key="item.indicatorCode"
								align="left"
								:class="{
									disabled: hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')
								}"
							>
								<div class="inputIconMain">
									<a-form-item>
										<!-- 如果禁用此列则为非必填 -->
										<a-input-number
											placeholder="允许输入负值"
											:max="1000"
											:min="-1000"
											@change="totalChange"
											:disabled="hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')"
											v-decorator="[
												`${item.indicatorCode}_rewardValue`,
												{
													initialValue: item.rewardValue,
													rules: [
														{
															required: !hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT'),
															message: '本次奖罚值必填'
														},
														{
															validator: (rule, value, callback) =>
																validateLeftFieldsError(value, callback, {
																	length: 4
																})
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`${item.indicatorCode}_rewardValue`)"
										:title="form.getFieldError(`${item.indicatorCode}_rewardValue`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
						</tr>
						<tr>
							<td align="left">
								<span
									class="required"
									v-show="!hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')"
								>
									*
								</span>
								<span class="title"> 本次其他奖罚(元/吨) </span>
							</td>
							<td
								:colspan="Math.floor((productIndicatorSelect.length + 1) / 2) || 1"
								:class="{
									disabled: hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')
								}"
							>
								<div class="inputIconMain">
									<a-form-item>
										<a-input-number
											placeholder="允许输入负值"
											:max="1000"
											:min="-1000"
											:disabled="hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')"
											@change="totalChange"
											v-decorator="[
												`offsetOther`,
												{
													rules: [
														{
															required: !hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT'),
															message: '本次其他奖罚值必填'
														},
														{
															validator: (rule, value, callback) =>
																validateLeftFieldsError(value, callback, {
																	length: 4
																})
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`offsetOther`)"
										:title="form.getFieldError(`offsetOther`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
							<td
								align="left"
								:colspan="Math.ceil((productIndicatorSelect.length + 1) / 2)"
								:class="{
									disabled: hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')
								}"
							>
								<a-space :size="10">
									<span class="title">奖罚合计（元/吨）</span>
									<span>
										<template v-if="total > 0">+</template>
										{{ total | formatMoney(4) }}
									</span>
								</a-space>
							</td>
						</tr>
					</table>
				</div>
				<div class="tablex">
					<table
						class="new-table"
						border="2"
						rules="all"
						cellpadding="0"
					>
						<tr>
							<td
								colspan="4"
								style="border-left: 0"
							>
								<span class="title">结算信息</span>
							</td>
							<td
								colspan="2"
								style="border-right: 0"
							>
								<span class="title">开票信息</span>
							</td>
						</tr>
						<tr>
							<td style="border-left: 0">
								<span class="required">*</span>
								<span class="title"> 本次结算数量(吨) </span>
							</td>
							<td
								align="left"
								width="346"
							>
								<div class="inputIconMain">
									<a-form-item>
										<a-input-number
											placeholder="请输入本次结算数量"
											:max="99999999"
											:min="0.0001"
											v-decorator="[
												`currentSettleQuantity`,
												{
													initialValue: currentSettleQuantity || undefined,
													rules: [
														{ required: true, message: '本次结算数量必填' },
														{
															validator: (rule, value, callback) =>
																validateLeftFieldsError(value, callback, {
																	length: 4
																})
														}
													]
												}
											]"
										>
										</a-input-number>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`currentSettleQuantity`)"
										:title="form.getFieldError(`currentSettleQuantity`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
							<td>
								<span class="title"> 合同数量(吨) </span>
							</td>
							<td
								align="left"
								width="346"
							>
								{{ contractInfo.quantity | formatMoney(3) }}
							</td>
							<td
								colspan="2"
								rowspan="6"
								style="border-right: 0"
							>
								<div class="infoMain">
									<div class="info">
										<span class="title"> 单位名称</span>
										<span> {{ invoice.companyName }} </span>
									</div>
									<div class="info">
										<span class="title"> 纳税人识别号</span>
										<span> {{ invoice.companyUscc }} </span>
									</div>
									<div class="info">
										<span class="title"> 地址</span>
										<span> {{ invoice.address }} </span>
									</div>
									<div class="info">
										<span class="title"> 电话</span>
										<span> {{ invoice.contactPhone }} </span>
									</div>
									<div class="info">
										<span class="title"> 开户行</span>
										<span> {{ invoice.subbranchName }} </span>
									</div>
									<div class="info">
										<span class="title"> 银行账号</span>
										<span> {{ invoice.accountNo }} </span>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td style="border-left: 0">
								<span class="required">*</span>
								<span class="title">
									本次结算单价(元/吨)
									<a-tooltip>
										<template slot="title"> 本次结算单价 = 本次货款价税合计/本次结算数量 </template>
										<i class="iconfont icon-shuoming" />
									</a-tooltip>
								</span>
							</td>
							<td align="left">
								<span v-if="form.getFieldValue('settleTotalPrice') && form.getFieldValue('currentSettleQuantity')">
									{{
										(form.getFieldValue('settleTotalPrice') / form.getFieldValue('currentSettleQuantity')) | formatMoney(2)
									}}</span
								>
							</td>
							<td>
								<span class="title"> 已结算数量(吨) </span>
							</td>
							<td align="left">
								{{ statementInfo.finishSettleQuantity | formatMoney(4) }}
							</td>
						</tr>
						<tr>
							<td style="border-left: 0">
								<span class="required">*</span>
								<span class="title"> 本次货款价税合计(元) </span>
							</td>
							<td align="left">
								<div class="inputIconMain">
									<a-form-item>
										<a-input-number
											placeholder="请输入本次货款价税合计"
											:max="9999999999"
											:min="0.01"
											v-decorator="[
												`settleTotalPrice`,
												{
													rules: [
														{ required: true, message: '本次货款价税合计必填' },
														{
															validator: (rule, value, callback) =>
																validateLeftFieldsError(value, callback, {
																	length: 2
																})
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`settleTotalPrice`)"
										:title="form.getFieldError(`settleTotalPrice`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
							<td>
								<span class="title"> 总结算数量(吨) </span>
							</td>
							<td align="left">
								{{
									((Number(form.getFieldValue('currentSettleQuantity')) || 0) + (Number(statementInfo.finishSettleQuantity) || 0))
										| formatMoney(4)
								}}
							</td>
						</tr>
						<tr>
							<td style="border-left: 0">
								<span class="title"> 本次其他扣款(元) </span>
							</td>
							<td align="left">
								<div class="inputIconMain">
									<a-form-item>
										<a-input-number
											placeholder="如保证金等，不填写默认为 0"
											:max="9999999999"
											:min="0"
											v-decorator="[
												`settleOtherPart1`,
												{
													rules: [
														{ required: false },
														{
															validator: (rule, value, callback) =>
																validateLeftFieldsError(value, callback, {
																	length: 2
																})
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`settleOtherPart1`)"
										:title="form.getFieldError(`settleOtherPart1`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
							<td>
								<span class="title"> 已结算金额(元) </span>
							</td>
							<td align="left">
								{{ statementInfo.settledAmount | formatMoney }}
							</td>
						</tr>
						<tr>
							<td style="border-left: 0">
								<span class="title"> 本次代收代垫(元) </span>
							</td>
							<td align="left">
								<div class="inputIconMain">
									<a-form-item>
										<a-input-number
											placeholder="如运费等，不填写默认为 0"
											:max="9999999999"
											:min="0"
											v-decorator="[
												`settleOtherPart2`,
												{
													rules: [
														{ required: false },
														{
															validator: (rule, value, callback) =>
																validateLeftFieldsError(value, callback, {
																	length: 2
																})
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-tooltip
										v-if="form.getFieldError(`settleOtherPart2`)"
										:title="form.getFieldError(`settleOtherPart2`).toString()"
									>
										<div class="icon">
											<i class="icon-tishi iconfont" />
										</div>
									</a-tooltip>
								</div>
							</td>
							<td>
								<span class="title"> 总结算金额(元) </span>
							</td>
							<td align="left">
								{{
									((Number(
										(form.getFieldValue('settleTotalPrice') || 0) -
											(form.getFieldValue('settleOtherPart1') || 0) +
											(form.getFieldValue('settleOtherPart2') || 0)
									) || 0) +
										(Number(statementInfo.settledAmount) || 0))
										| formatMoney
								}}
							</td>
						</tr>
						<tr>
							<td style="border-left: 0">
								<span class="title">
									本次结算金额(元)
									<a-tooltip>
										<template slot="title"> 本次结算金额=本次货款价税合计-本次其他扣款+本次待收代垫 </template>
										<i class="iconfont icon-shuoming" />
									</a-tooltip>
								</span>
							</td>
							<td
								align="left"
								colspan="3"
							>
								{{
									((form.getFieldValue('settleTotalPrice') || 0) -
										(form.getFieldValue('settleOtherPart1') || 0) +
										(form.getFieldValue('settleOtherPart2') || 0))
										| formatMoney
								}}
							</td>
						</tr>
						<tr>
							<td style="border-left: 0; width: 16.6667%">
								<span class="title"> 备注 </span>
							</td>
							<td
								align="left"
								colspan="5"
								style="border-right: 0"
							>
								<a-form-item>
									<a-textarea
										placeholder="请输入备注"
										:maxLength="500"
										v-decorator="[`comments`]"
									/>
								</a-form-item>
							</td>
						</tr>
						<tr>
							<td
								align="left"
								colspan="3"
								style="border-left: 0; width: 50%"
							>
								<a-space :size="10">
									<span class="title">卖方单位</span>
									<span>{{ contractInfo.sellerName }}</span>
								</a-space>
							</td>
							<td
								align="left"
								colspan="3"
								style="border-right: 0; width: 50%"
							>
								<a-space :size="10">
									<span class="title">买方单位</span>
									<span>{{ contractInfo.buyerName }}</span>
								</a-space>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</a-form>
		<modalInfo
			ref="modalInfo"
			@verify="modalInfoVerify"
			title="删除提示"
			tip="删除后，将不会在结算单中展示该指标，如需展示，可以通过右侧的“添加考核指标”进行重新添加"
		/>
		<modalMain
			:width="900"
			title="选择考核指标"
			ref="assessmentModel"
			okText="保存"
			@verify="selectOK"
		>
			<div class="modalMain">
				<div class="modalMainTitle">
					<a-space :size="4">
						<span>选择指标</span>
						<span class="modalMainTitleTip"> （带有底色的为合同中约定的考核指标） </span>
					</a-space>
				</div>
				<a-form
					class="ant-table"
					:form="selectForm"
				>
					<a-form-item>
						<a-checkbox-group v-decorator="['productIndicator']">
							<a-row :gutter="[6, 4]">
								<a-col
									:span="6"
									v-for="item in productIndicatorList"
									:key="item.indicatorCode"
								>
									<!-- receiveIndicators合同选中的指标 -->
									<a-checkbox :value="item.indicatorCode">
										<a-tooltip :getPopupContainer="getPopupContainer">
											<template slot="title">
												{{ item.indicatorName }}
											</template>
											<span
												:class="{
													indicator: true,
													indicatorDef: receiveIndicators.some(items => items.indicatorCode == item.indicatorCode)
												}"
											>
												{{ item.indicatorName }}
											</span>
										</a-tooltip>
									</a-checkbox>
								</a-col>
							</a-row>
						</a-checkbox-group>
					</a-form-item>
				</a-form>
			</div>
		</modalMain>
	</div>
</template>

<script>
import moment from 'moment';
import { getCoalConfigByType } from '@/v2/center/trade/api/settle';
import { getPopupContainer } from '@/v2/utils/factory.js';
import modalInfo from '@/v2/components/modalInfo/info';
import modalMain from '@/v2/components/modalInfo/main';
export default {
	components: { modalInfo, modalMain },
	props: {
		info: {
			type: Object,
			default: () => {
				//contractInfo合同信息,invoice开票信息,statementInfo结算单信息,transType结算单中运输信息部分，currentSettleQuantity//本次结算数量，取衡重或是货转数量
				return {
					contractInfo: {},
					invoice: {},
					statementInfo: {},
					transType: {},
					currentSettleQuantity: 0 //本次结算数量，取衡重或是货转数量
				};
			}
		}
	},
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this, { onValuesChange: this.selectChange }),
			selectForm: this.$form.createForm(this),
			hiddenRow: [
				'INDICATOR_CURRENT_REWARD_AMOUNT', //本次奖罚值
				'INDICATOR_CURRENT_SETTLE_AMOUNT' //本次结算值
			], //禁用行
			productIndicatorList: [], //合同对应煤种的的指标信息
			productIndicatorSelect: [], //选中指标
			receiveIndicators: [], //品名对应的指标信息
			deleteCode: '', //删除选中的指标
			total: 0, //统计奖罚合计值
			saveReq: {} //保存时提交的信息
		};
	},
	computed: {
		//合同信息
		contractInfo() {
			let { contractInfo = {} } = this.info;
			return contractInfo;
		},
		//所有的品名
		contractExamineIndicatorOption() {
			let { contractExamineIndicatorOption = [] } = this.contractInfo;
			return contractExamineIndicatorOption;
		},
		//企业开票信息
		invoice() {
			let { invoice = {} } = this.info;
			return invoice;
		},
		//结算单信息
		statementInfo() {
			let { statementInfo = {} } = this.info;
			return statementInfo;
		},
		//结算单信息
		transType() {
			let { transType = {} } = this.info;
			return transType;
		},
		//煤种
		coalType() {
			let { coalType = '' } = this.contractInfo;
			return coalType;
		},
		//本次结算默认值
		currentSettleQuantity() {
			let { currentSettleQuantity = 0 } = this.info;
			return currentSettleQuantity;
		}
	},
	watch: {
		coalType: {
			immediate: true,
			handler(val) {
				//煤种发生变化时，调取煤种基础指标
				if (val) {
					this.getCoalConfigByType();
				}
			}
		},
		//所有品名发生变化时
		contractExamineIndicatorOption: {
			immediate: true,
			deep: true,
			handler(val) {
				//如果只有一个品名,则设置成默认值,不可修改
				if (val?.length == 1) {
					this.$nextTick(() => {
						let combineGoodsName = this.form.getFieldValue('combineGoodsName');
						if (combineGoodsName != val[0].combineGoodsName) {
							this.form.setFieldsValue({
								combineGoodsName: val[0].combineGoodsName
							});
							//设置指标
							this.receiveIndicators = val[0].productIndicatorList;
						}
					});
				}
			}
		},
		receiveIndicators: {
			immediate: true,
			deep: true,
			handler(val) {
				//品名默认指标发生变化时，默认选中指标为合同默认指标前10个，最多10个
				this.productIndicatorSelect = [...val.slice(0, 10)];
			}
		},
		//选中指标变化时
		productIndicatorSelect: {
			immediate: true,
			deep: true,
			handler(val, old) {
				if (val?.length) {
					//如果当前有长度，并且上一个没有数据，说明是初次添加，放开所有禁用限制
					if (!old?.length) {
						this.hiddenRow = [];
					}
				} else {
					//如果没有长度，禁用所有
					this.hiddenRow = [
						'INDICATOR_CURRENT_REWARD_AMOUNT', //本次奖罚值
						'INDICATOR_CURRENT_SETTLE_AMOUNT' //本次结算值
					];
					//将本次其他奖罚值置空
					this.$nextTick(() => {
						this.form.setFieldsValue({
							offsetOther: ''
						});
					});
				}
			}
		},
		//有结算单默认属性时，重绘表单数据,总结算数量(吨)xuyaojisuan
		currentSettleQuantity: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					this.$forceUpdate();
				});
			}
		}
	},
	filters: {},
	mounted() {},
	methods: {
		//编辑时,设置默认值
		setValue(val) {
			//品名变化
			this.receiveIndicatorsChange(val.combineGoodsName);
			//设置表单
			this.$nextTick(() => {
				this.form.setFieldsValue(val);
				//指标信息
				this.productIndicatorSelect = [...val.receiveIndicators];
				delete val.receiveIndicators;
				//禁用行，将禁用行放在指标信息设置之后，防止指标信息设置重置禁用行
				this.hiddenRow = [...val.hiddenRow];
				delete val.hiddenRow;
			});
		},
		//修改结算日期
		settleTimeChange(val) {
			//当修改结算日期与当前系统日期偏差大于30天时，提示
			if (Math.abs(moment(val).diff(moment(), 'days')) > 30) {
				this.$message.warning('结算日期与当前日期偏差较多，如果实际如此，请忽略提示');
			}
		},
		//品名发生变动，重置指标信息
		receiveIndicatorsChange(combineGoodsName) {
			let receiveIndicators = [];
			if (combineGoodsName) {
				//从所有的品名筛选除对应指标
				receiveIndicators =
					this.contractExamineIndicatorOption.find(item => item.combineGoodsName == combineGoodsName)?.productIndicatorList || [];
			}
			this.receiveIndicators = [...receiveIndicators];
		},
		//不可选结算日期
		disabledDate(current) {
			// 合同签订日期之前时间不可选
			return current < moment(this.contractInfo.signTime).endOf('day');
		},
		//结算单校验
		validateFields() {
			return new Promise(resolve => {
				// 因存在不定必填项，force重新校验所有字段
				this.form.validateFieldsAndScroll({ force: true }, (error, values) => {
					if (!error) {
						let params = this.dataAssemble(values);
						resolve(params);
					} else {
						resolve(false);
					}
				});
			});
		},
		//组装数据
		dataAssemble(values) {
			let params = {};
			//统计选中的指标值
			let receiveIndicators = this.productIndicatorSelect.map(item => {
				let data = {
					...item,
					settleValue: values[`${item.indicatorCode}_settleValue`],
					rewardValue: values[`${item.indicatorCode}_rewardValue`]
				};
				delete values[`${item.indicatorCode}_settleValue`];
				delete values[`${item.indicatorCode}_rewardValue`];
				return data;
			});
			//被隐藏的行
			let hiddenRow = [...this.hiddenRow];
			params = { ...values, receiveIndicators, hiddenRow };
			this.saveReq = params;
			return params;
		},
		//奖罚合计计算
		totalChange() {
			this.$nextTick(() => {
				// 判断本次奖罚值是否禁用，不禁用加载
				let total = 0;
				let form = this.form.getFieldsValue();
				if (!this.hiddenRow.includes('INDICATOR_CURRENT_REWARD_AMOUNT')) {
					this.productIndicatorSelect.map(item => {
						total += form[`${item.indicatorCode}_rewardValue`] || 0;
					});
				}
				//本次其他奖罚
				total += form.offsetOther || 0;
				this.total = total;
			});
		},
		//本次结算值交易规则
		validateLeftFieldsError(value, callback, item) {
			if (this.isNull(value)) {
				callback();
			} else {
				if (value.toString()?.split('.')[1]?.length > item.length) {
					callback(`小数点后最多${item.length}位数字`);
					return;
				}
				callback();
			}
		},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		//筛选合同基准值
		receiveIndicatorsFind(code) {
			let data = this.receiveIndicators.find(item => item.indicatorCode == code);
			let str = '-';
			if (data) {
				//判断基准值类型
				switch (data.inputType) {
					case 'SINGLE':
						//单区间
						if (data.value1) {
							str = `${data.symbol == '无符号' ? '' : data.symbol}${data.value1}`;
						}
						break;
					case 'RANGE':
						//区间范围
						if (data.value1 || data.value2) {
							if (data.value1 !== null && data.value2 !== null) {
								str = `${data.value1 || ''}~${data.value2 || ''}`;
							} else {
								str = `${data.value1 || ''}${data.value2 || ''}`;
							}
						}
						break;
				}
			}
			return str;
		},
		//禁用行变动
		hiddenRowChange(val) {
			if (this.hiddenRow.includes(val)) {
				this.hiddenRow = this.hiddenRow.filter(item => item != val);
			} else {
				this.hiddenRow.push(val);
				// 重置错误状态值
				let obj = this.form.getFieldsError();
				for (let key in obj) {
					if (obj[key]) {
						this.form.resetFields(key);
					}
				}
			}
			//如果本次奖罚值变动重新计算奖罚合计
			if (val == 'INDICATOR_CURRENT_REWARD_AMOUNT') {
				this.totalChange();
			}
			this.selectChange();
		},
		//获取每种质量指标
		getCoalConfigByType() {
			getCoalConfigByType({
				coalTypeCode: this.coalType
			}).then(res => {
				if (res.data) {
					let data = res.data;
					let { productIndicator = [] } = data;
					this.productIndicatorList = productIndicator;
				}
			});
		},
		//确认选择的考核指标
		selectOK() {
			let selectForm = this.selectForm.getFieldsValue();
			let { productIndicator = [] } = selectForm;
			if (productIndicator.length > 10) {
				this.$message.warning('最多只能选择 10 个指标');
				return;
			}
			this.productIndicatorSelect = this.productIndicatorList.filter(item => productIndicator.includes(item.indicatorCode));
			this.selectChange();
			this.$refs.assessmentModel.close();
		},
		//确认删除操作,弹框展示选择
		modalInfoShow(code) {
			this.$refs.modalInfo.open();
			this.deleteCode = code;
		},
		//确认删除操作
		modalInfoVerify() {
			this.productIndicatorDetail();
			this.$refs.modalInfo.close();
		},
		//删除对应指标
		productIndicatorDetail() {
			let code = this.deleteCode;
			this.productIndicatorSelect = this.productIndicatorSelect.filter(item => item.indicatorCode != code);
			this.selectChange();
		},
		//添加考核指标
		assessmentModel() {
			this.$refs.assessmentModel.open();
			this.$nextTick(() => {
				this.selectForm.setFieldsValue({
					productIndicator: this.productIndicatorSelect.map(item => item.indicatorCode)
				});
			});
		},
		//表单值发生变化
		selectChange() {
			if (this.$listeners.selectChange) {
				this.$emit('electNoChange');
			}
		}
	}
};
</script>
<style lang="less" scoped>
.main {
	width: 100%;
	.slFormDetail {
		padding: 0;
	}
	.mainCon {
		width: 100%;
		border-bottom: 1px solid rgba(229, 230, 235, 1);
		.tablex {
			overflow-x: scroll;
			border-left: 1px solid rgba(229, 230, 235, 1);
			border-right: 1px solid rgba(229, 230, 235, 1);
			&::-webkit-scrollbar {
				height: 6px;
			}
			&::-webkit-scrollbar-thumb {
				background: rgba(147, 158, 175, 0.5);
			}
		}
	}
	.new-table {
		width: 100%;
		font-size: 14px;
		font-family: PingFang SC;
		text-align: center;
		color: rgba(119, 136, 157, 1);
		border-color: rgba(229, 230, 235, 1);
		border: 0px;
		tr:last-child {
			td {
				border-bottom-width: 0px;
			}
		}
		th,
		td {
			border-color: rgba(229, 230, 235, 1);
			white-space: nowrap;
			&.disabled {
				background: #f3f5f6;
			}
		}
		th {
			font-size: 18px;
			font-weight: 500;
			line-height: 25px;
			letter-spacing: 0px;
			padding: 14px;
		}
		td {
			color: rgba(0, 0, 0, 0.8);
			font-family: PingFang SC;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			padding: 4px 20px;
			height: 50px;
			.iconfont,
			.anticon {
				margin-left: 4px;
				font-size: 16px;
				vertical-align: middle;
				cursor: pointer;
				&:hover {
					color: @primary-color;
				}
				&.icon-a-shanchu-caozuo6,
				&.icon-shuoming {
					vertical-align: unset;
					font-size: 14px;
				}
			}
			.anticon {
				vertical-align: middle;
			}
			.required {
				color: #d44;
			}
			.title {
				font-size: 14px;
				color: #77889d;
			}
			table.transTypeMain {
				td {
					white-space: normal;
					min-width: 140px;
					height: 34px;
					.title {
						margin-right: 10px;
					}
				}
			}
			div.transTypeMain {
				display: -webkit-box;
				display: -webkit-flex;
				display: -ms-flexbox;
				display: flex;
				flex-wrap: wrap;
				& > div {
					margin-right: 60px;
					padding: 6px 0;
					&:last-child {
						margin: 0;
					}
				}
			}
			a {
				display: inline-block;
				white-space: normal;
				color: @primary-color;
			}
			.inputIconMain {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				min-width: 100px;
				/deep/.ant-row {
					flex: auto;
					.has-error {
						input {
							color: rgba(221, 68, 68, 1) !important;
						}
					}
				}
				.icon {
					background-size: 100%;
					font-size: 14px;
					color: rgba(221, 68, 68, 1) !important;
				}
			}
			.infoMain {
				padding: 10px 0;
				line-height: 22px;
				.info {
					padding: 6px 0px;
					text-align: left;
					.title {
						display: inline-block;
						width: 138px;
					}
				}
			}
			/deep/.ant-form-item {
				margin-bottom: 0;
				.ant-input,
				.ant-input-number,
				.ant-select-selection {
					border: 0;
					input {
						padding: 0;
					}
				}
				.ant-form-explain {
					// position: absolute;
					// top: 50%;
					// bottom: 50%;
					// margin: auto;
					// left: 0;
					display: none;
				}
			}
			/deep/.ant-descriptions {
				padding-top: 10px;
				.ant-descriptions-item:has(.ant-descriptions-item-content) {
					padding-bottom: 14px;
				}
			}
		}
	}
}

.modalMain {
	.modalMainTitle {
		color: rgba(0, 0, 0, 0.8);
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 20px;
		.modalMainTitleTip {
			color: #77889d;
			font-size: 12px;
			font-weight: 400;
			line-height: 20px;
		}
	}
	.ant-form-item {
		margin: 0;
		.ant-checkbox-wrapper {
			display: flex;
			align-items: center;
			width: 100%;
			.ant-checkbox {
				width: 16px;
			}
			/deep/.ant-checkbox + span {
				max-width: calc(100% - 16px);
				.indicator {
					display: inline-block;
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding: 9px 6px;
					border-radius: 4px;
					&.indicatorDef {
						background: #e4ebf4;
					}
				}
			}
		}
	}
}
</style>
