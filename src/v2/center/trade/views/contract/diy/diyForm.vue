<template>
	<div class="diy-form-wrap">
		<div
			v-for="(key, index) in VUE_SET_FORM_LIST_SORT"
			:key="index"
			:id="key + 'Form'"
		>
			<p
				class="slTitleAssis"
				v-if="
					VUEX_FORM_LIST[key] &&
					VUEX_FORM_LIST[key].length &&
					formSchema.mapConfig &&
					formSchema.mapConfig[key] &&
					['commitment', 'quality', 'transportation', 'contacts', 'bankInfo'].includes(key)
				"
			>
				{{ formSchema.mapConfig[key] }}
			</p>
			<a-form
				class="slFormDetailDiy"
				:layout="VUEX_FORM_LAYOUT.layout"
				:labelAlign="VUEX_FORM_LAYOUT.labelAlign"
				:form="formList[index] && formList[index].form"
				v-if="key !== 'productIndicator' && VUEX_FORM_LIST[key] && VUEX_FORM_LIST[key].length"
			>
				<div>
					<a-row :gutter="[40, 0]">
						<template v-for="(item2, index2) in VUEX_FORM_LIST[key].filter(item => item.style.display === 'block')">
							<!-- 基准价格特殊处理，有文本、数字两种形式 -->
							<template v-if="item2.label.includes('basePrice')">
								<template v-if="basePriceBothFlag">
									<a-col
										:span="
											['editor', 'editor-list'].includes(item2.widget)
												? 24
												: [''].includes(item2.widget)
													? 12
													: VUEX_FORM_LAYOUT.rowColumn
										"
										:key="index2"
										class="col-list-item"
										:style="{ ...item2.style }"
										v-if="item2.inputType === 'NUMBER' && basePriceType === 'NUMBER'"
									>
										<a-form-item
											label=""
											class="form-item-normal"
										>
											<div class="code-label">
												<div class="label">
													<span class="code-required">*</span>
													<span
														class="code-name"
														v-html="item2.title"
													></span>
												</div>
												<div class="extra">
													<a-switch
														checked-children="数值"
														un-checked-children="文本"
														@change="onSwitch(formList[index].form, $event)"
														:checked="basePriceType === 'NUMBER'"
													/>
												</div>
											</div>
											<a-input-number
												class="item"
												v-bind="item2"
												:step="1 / Math.pow(10, item2.precision)"
												:formatter="value => value && parseFloat(value)"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
											/>
										</a-form-item>
									</a-col>
									<a-col
										:span="
											['editor', 'editor-list'].includes(item2.widget)
												? 24
												: [''].includes(item2.widget)
													? 12
													: VUEX_FORM_LAYOUT.rowColumn
										"
										:key="index2"
										class="col-list-item"
										:style="{ ...item2.style }"
										v-if="item2.inputType === 'TEXT' && basePriceType === 'TEXT'"
									>
										<a-form-item
											label=""
											class="form-item-normal"
										>
											<div class="code-label">
												<div class="label">
													<span class="code-required">*</span>
													<span
														class="code-name"
														v-html="item2.title"
														>22</span
													>
												</div>
												<div class="extra">
													<a-switch
														checked-children="数值"
														un-checked-children="文本"
														@change="onSwitch(formList[index].form, $event)"
														:checked="basePriceType === 'NUMBER'"
													/>
												</div>
											</div>
											<a-input
												class="item"
												v-bind="item2"
												v-decorator="[
													item2.label,
													{
														initialValue: setInitialValue(key, item2.label),
														rules: [{ required: item2.required, message: `${item2.title}必填` }]
													}
												]"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
											/>
										</a-form-item>
									</a-col>
								</template>
								<template v-else>
									<a-col
										:span="
											['editor', 'editor-list'].includes(item2.widget)
												? 24
												: [''].includes(item2.widget)
													? 12
													: VUEX_FORM_LAYOUT.rowColumn
										"
										:key="index2"
										class="col-list-item"
										:style="{ ...item2.style }"
									>
										<a-form-item
											label=""
											class="form-item-normal"
										>
											<div class="code-label">
												<div class="label">
													<span class="code-required">*</span>
													<span
														class="code-name"
														v-html="item2.title"
													></span>
												</div>
												<a-tooltip
													v-if="isHuaTai" 
													placement="top"
													>
													<template slot="title">基准价格等于含税单价</template>
													<a-icon type="info-circle" />
												</a-tooltip>
											</div>
											<template v-if="item2.inputType === 'TEXT'">
												<a-input
													class="item"
													v-bind="item2"
													v-decorator="[
														item2.label,
														{
															initialValue: setInitialValue(key, item2.label),
															rules: [{ required: item2.required, message: `${item2.title}必填` }]
														}
													]"
													@focus="elemClickChange({ key, item2 })"
													@change="e => valueChange({ key, e, item2 })"
													@blur="clearBasePrice"
												/>
											</template>
											<template v-else>
												<a-input-number
													class="item"
													v-bind="item2"
													:step="1 / Math.pow(10, item2.precision)"
													:formatter="value => value && parseFloat(value)"
													@focus="elemClickChange({ key, item2 })"
													@change="e => valueChange({ key, e, item2 })"
													@blur="clearBasePriceDesc"
													v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
												/>
											</template>
										</a-form-item>
									</a-col>
								</template>
							</template>
							<template v-else>
								<a-col
									:span="
										['editor', 'editor-list'].includes(item2.widget)
											? 24
											: [''].includes(item2.widget)
												? 12
												: VUEX_FORM_LAYOUT.rowColumn
									"
									:key="index2"
									class="col-list-item"
									:style="{ ...item2.style }"
								>
									<a-form-item
										label=""
										v-if="item2.widget === 'range-picker'"
										class="form-item-normal"
									>
										<div
											class="code-label"
											style="display: flex"
										>
											<div class="label">
												<span class="code-required">*</span>
												<span
													class="code-name"
													v-html="item2.title"
												></span>
											</div>
											<div
												v-show="typeConfirmed"
												class="LONG_TERM_CONTRACT"
											>
												<span class="text">长协</span>
											</div>
										</div>
										<a-range-picker
											class="item"
											v-bind="item2"
											:showTime="item2.showTime ? Boolean(+item2.showTime) : false"
											v-if="item2.widget === 'range-picker'"
											@focus="elemClickChange({ key, item2 })"
											@change="e => valueChange({ key, e, item2 })"
											valueFormat="YYYY-MM-DD"
											v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
										/>
									</a-form-item>
									<span v-if="item2.widget === 'date-picker'">
										<a-form-item
											v-if="item2.label == 'signTime'"
											:validateStatus="signTimeHelpText ? 'error' : undefined"
											:help="signTimeHelpText"
											:label="item2.title"
											:class="[item2.required ? 'item-required' : '']"
											class="form-item-normal"
										>
											<a-date-picker
												class="item"
												v-bind="item2"
												:disabled="signTimePlaceholder() == '请先选择交货期限'"
												:placeholder="signTimePlaceholder()"
												:disabledDate="signTimeDisableDates"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												valueFormat="YYYY-MM-DD"
												v-decorator="[
													item2.label,
													{
														rules: [
															{ required: item2.required, message: `${item2.title}必填` },
															{
																trigger: ['change', 'blur'],
																validator: (rule, value, callback) => validateSignTimeError(rule, value, callback, item2)
															}
														]
													}
												]"
											/>
										</a-form-item>
										<a-form-item
											v-else
											:label="item2.title"
											:class="[item2.required ? 'item-required' : '']"
											class="form-item-normal"
										>
											<a-date-picker
												class="item"
												v-bind="item2"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												valueFormat="YYYY-MM-DD"
												v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
											/>
										</a-form-item>
									</span>
									<a-form-item
										v-if="
											![
												'select-bank',
												'select-contacts',
												'input-director',
												'cascader',
												'editor',
												'input-quality',
												'editor-list',
												'range-picker',
												'date-picker'
											].includes(item2.widget)
										"
										:label="item2.title"
										class="form-item-normal"
									>
										<a-input
											class="item"
											v-if="item2.widget === 'input'"
											v-bind="item2"
											v-decorator="[
												item2.label,
												{
													initialValue: setInitialValue(key, item2.label),
													rules: [{ required: item2.required, message: `${item2.title}必填` }]
												}
											]"
											@focus="elemClickChange({ key, item2 })"
											@change="e => valueChange({ key, e, item2 })"
										/>
										<a-select
											class="item"
											mode="multiple"
											:default-active-first-option="false"
											:show-arrow="false"
											:filter-option="false"
											:tokenSeparators="[',']"
											:getPopupContainer="triggerNode => triggerNode.parentNode"
											:notFoundContent="!item2.options || !item2.options.length ? '输入关键字搜索...' : null"
											v-if="item2.widget === 'input-search'"
											v-bind="item2"
											@focus="elemClickChange({ key, item2 })"
											@change="e => valueChange({ key, e, item2 })"
											@search="e => valueChangeSearch({ key, e, item2 })"
											v-decorator="[
												item2.label,
												{
													initialValue: setInitialValue(key, item2.label),
													rules: [{ required: item2.required, message: `${item2.title}必填` }]
												}
											]"
										>
										</a-select>
										<a-select
											class="item"
											:id="item2.label"
											mode="tags"
											v-if="item2.widget === 'select-multiple'"
											v-bind="item2"
											:getPopupContainer="triggerNode => triggerNode.parentNode"
											:tokenSeparators="[',']"
											@focus="elemClickChange({ key, item2 })"
											@change="e => valueChange({ key, e, item2 })"
											@blur="selectMultipleScrollTop(item2.label)"
											v-decorator="[
												item2.label,
												{
													initialValue: setInitialValue(key, item2.label),
													rules: [
														{ required: item2.required, message: `` },
														{ validator: (rule, value, callback) => validateTagsFieldsError(rule, value, callback, item2) }
													]
												}
											]"
										/>
										<a-select
											class="item"
											v-bind="item2"
											:getPopupContainer="triggerNode => triggerNode.parentNode"
											v-if="item2.widget === 'select'"
											:notFoundContent="!item2.options || !item2.options.length ? '加载中...' : null"
											@focus="elemClickChange({ key, item2 })"
											@change="e => valueChange({ key, e, item2 })"
											:filter-option="filterOption"
											v-decorator="[
												item2.label,
												{
													initialValue: setInitialValue(key, item2.label),
													rules: [{ required: item2.required, message: `${item2.title}必填` }]
												}
											]"
										>
										</a-select>
										<a-input-number
											class="item"
											v-bind="item2"
											:step="1 / Math.pow(10, item2.precision)"
											:formatter="value => value && parseFloat(value)"
											v-if="item2.widget === 'input-number'"
											@focus="elemClickChange({ key, item2 })"
											@change="e => valueChange({ key, e, item2 })"
											v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
										/>
									</a-form-item>
									<span
										v-if="item2.widget === 'input-quality'"
										class="input-quality input-2column"
									>
										<a-form-item
											:label="item2.title"
											class="input-quality-left form-item-normal"
										>
											<a-input-number
												v-bind="item2.list[0]"
												:formatter="value => value && parseFloat(value)"
												:step="1 / Math.pow(10, item2.list[0].precision)"
												@focus="elemClickChange({ key, item2: item2.list[0] })"
												@change="e => valueChange({ key, e, item2: item2.list[0] })"
												v-decorator="[
													item2.list[0].label,
													{
														rules: [{ required: item2.list[0].required, message: `${item2.title}必填` }]
													}
												]"
											/>
										</a-form-item>
										<span class="input-quality-computed">±</span>
										<span class="input-quality-percent form-item-normal">
											<a-form-item label=" ">
												<a-input-number
													class="item"
													v-bind="item2.list[1]"
													:formatter="value => value && parseFloat(value)"
													:step="1"
													@focus="elemClickChange({ key, item2: item2.list[1] })"
													@change="e => valueChange({ key, e, item2: item2.list[1] })"
													v-decorator="[
														item2.list[1].label,
														{
															rules: [{ required: item2.list[1].required, message: `${item2.title}必填` }]
														}
													]"
												/>
											</a-form-item>
											<span class="input-quality-percent-icon">%</span>
										</span>
									</span>
									<span v-if="item2.widget === 'select-bank'">
										<a-form-item
											:label="item2.title"
											class="form-item-normal select-bank"
										>
											<a-select
												class="item"
												v-bind="item2"
												:getPopupContainer="triggerNode => triggerNode.parentNode"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												:notFoundContent="!item2.options || !item2.options.length ? '加载中...' : null"
												:placeholder="item2.title.includes('卖方') ? '请选择卖方银行账号' : '请选择买方银行账号'"
												v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
											>
												<a-select-option
													v-for="bank in item2.optionsBank"
													:key="bank.accountNo"
													:value="bank.id"
												>
													<p class="select-bank-content">{{ bank.bankName }}({{ bank.accountTypeText }})</p>
													<p class="select-bank-content small">{{ bank.accountNo }}</p>
												</a-select-option>
											</a-select>
										</a-form-item>
									</span>
									<span v-if="item2.widget === 'select-contacts'">
										<a-form-item
											:label="item2.title"
											:class="[item2.required ? 'item-required' : '']"
											class="form-item-normal"
										>
											<a-select
												class="item"
												v-bind="item2"
												:getPopupContainer="triggerNode => triggerNode.parentNode"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												:notFoundContent="!item2.options || !item2.options.length ? '加载中...' : null"
												v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
											/>
										</a-form-item>
									</span>
									<span
										v-if="item2.widget === 'input-director'"
										class="input-2column"
									>
										<a-form-item
											:label="item2.title"
											class="input-left form-item-normal"
										>
											<a-input
												class="item"
												v-bind="item2"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
											/>
										</a-form-item>
										<a-form-item
											v-for="(item3, index3) in item2.children"
											:key="index3"
											:label="item3.title"
											class="input-right"
										>
											<a-input
												class="item"
												:disabled="item3.disabled"
												v-bind="item3"
												@focus="elemClickChange({ key, item3 })"
												@change="e => valueChange({ key, e, item3 })"
												v-decorator="[
													item3.label,
													{
														rules: [
															{ required: item3.required, message: `${item3.title}必填` },
															{ pattern: item3.regexp, message: '手机号格式不正确' }
														]
													}
												]"
											/>
										</a-form-item>
									</span>
									<span v-if="item2.widget === 'cascader'">
										<a-form-item
											:label="item2.title"
											class="form-item-normal"
										>
											<a-cascader
												:options="item2.options"
												class="item"
												v-bind="item2"
												@focus="elemClickChange({ key, item2 })"
												@change="e => valueChange({ key, e, item2 })"
												v-decorator="[item2.label, { rules: [{ required: item2.required, message: `${item2.title}必填` }] }]"
											/>
										</a-form-item>
									</span>
									<span v-if="['editor', 'editor-list'].includes(item2.widget)">
										<div
											class="slTitleAssis marginTopLoss"
											v-if="item2.title"
										>
											<span
												class="editor-required-icon"
												v-if="item2.required"
												>*</span
											>
											{{ item2.title }}
											<a-space :size="30">
												<a-button
													class="slBtn"
													type="primary"
													ghost
													@click.native="collectTemplate(item2.templateType, item2.label)"
													>收藏</a-button
												>
												<a-button
													class="slBtn"
													type="primary"
													ghost
													@click.native="selectTemplate(item2.templateType, item2)"
													>选择已有模板</a-button
												>
												<span class="tips">注：请注意条款中甲乙方与买卖方对应关系，建议统一用买方、卖方进行描述。</span>
											</a-space>
										</div>
										<a-form-item
											label=""
											class="editor-content-wrap"
											v-if="item2.widget === 'editor'"
										>
											<div :id="item2.label + 'Form'">
												<Editor
													:placeholder="item2.title"
													:ref="item2.label + '_' + item2.templateType + '_Ref'"
													:id="item2.label + '_' + index2"
													v-on:change="val => valueChange({ key, e: val, item2 })"
													v-on:blur="val => valueChange({ key, e: val, item2 })"
													:content="getContentData(item2.label)"
													:sensitiveWordsList="sensitiveWordsList[item2.label]"
													:maxLength="item2.maxLength || 30000"
													v-decorator="[
														item2.label,
														{
															initialValue: getContentData(item2.label),
															rules: [
																{ required: true, message: `` },
																{ validator: (rule, value, callback) => validateFieldsError(rule, value, callback, item2) }
															],
															validateTrigger: 'blur'
														}
													]"
												/>
											</div>
											<p
												v-if="sensitiveWordsList[item2.label]"
												class="sensitive-words-wrap"
											>
												存在以下敏感词：{{ sensitiveWordsList[item2.label] }}
											</p>
										</a-form-item>
										<span
											v-if="item2.widget === 'editor-list'"
											class="editor-item-wrap"
										>
											<template v-for="(items, indexs) in item2.list">
												<div :key="indexs">
													<p
														v-if="indexs > 0"
														class="editor-list-item-required-title"
													>
														<span
															class="editor-list-item-required"
															v-if="items.required"
															>*</span
														>
														<span>{{ items.title }}</span>
													</p>
													<a-form-item>
														<Editor
															v-if="items.widget === 'editor'"
															:placeholder="items.title"
															:ref="items.label + '_' + items.templateType + '_Ref'"
															:id="items.label + '_' + indexs"
															v-on:change="val => valueChange({ key, e: val, item2: items })"
															v-on:blur="val => valueChange({ key, e: val, item2: items })"
															:content="getContentData(items.label)"
															:sensitiveWordsList="sensitiveWordsList[items.label]"
															:maxLength="item2.maxLength || 30000"
															v-decorator="[
																items.label,
																{
																	initialValue: getContentData(item2.label),
																	rules: [
																		{ required: true, message: `` },
																		{ validator: (rule, value, callback) => validateFieldsError(rule, value, callback, items) }
																	],
																	validateTrigger: 'blur'
																}
															]"
														/>
													</a-form-item>
													<a-form-item v-if="items.widget === 'select'">
														<template v-if="isHuaTai">
															<p class="editor-list-item-required-desc">
																1. 请从合同第二条起填写编辑（合同中“第一条：交货地点以及方式”由合同字段自动生成）
															</p>
															<p class="editor-list-item-required-desc">
																2. 请注意条款编号规则：“第二条 条款标题 …2.1 条款文本 … 2.2 条款文本…”（条款标题须加粗）。
															</p>
														</template>
														<template v-else>
															<p class="editor-list-item-required-desc">
																1. 请从合同第三条起填写编辑（合同中“第一条:
																合同标的”、“第二条：交货及运输方式”由合同字段自动生成）。
															</p>
															<p class="editor-list-item-required-desc">
																2. 请注意条款编号规则：“第三条 条款标题 …3.1 条款文本 … 3.2 条款文本…”（条款标题须加粗）。
															</p>
														</template>
														<p class="editor-list-item-required-desc">
															3. 您可点击“收藏”，将已编辑好的合同文本保存为模板，方便后续使用。使用时，点击“选择已有模板”即可。
														</p>
														<p class="editor-list-item-required-desc">
															4. 合同文本编辑完成后，请在下方点击选择您编辑的合同条款的最后一条的序号。
														</p>
														<p class="select-rule-item">
															<span>已完成对合同“第{{isHuaTai ? '二' : '三'}}条”至</span>
															<a-select
																class="editor-list-item editor-list-item-select"
																v-bind="items"
																v-decorator="[
																	items.label,
																	{ rules: [{ required: items.required, message: `请输入${items.title}` }] }
																]"
																:getPopupContainer="triggerNode => triggerNode.parentNode"
																v-on:change="val => valueChange({ key, e: val, item2: { label: items.label } })"
															/>
															<span>的编辑</span>
														</p>
													</a-form-item>
												</div>
											</template>
										</span>
									</span>
								</a-col>
							</template>
						</template>
					</a-row>
				</div>
			</a-form>
			<div
				v-if="productIndicatorVisible(key)"
			>
				<ProductIndicator
					ref="productIndicator"
					:formLayout="VUEX_FORM_LAYOUT"
				/>
			</div>
		</div>
		<TipModal
			title="提示"
			tip="合同有效期超过31天，请确认合同类型是否为长协合同？"
			@save="confirmContractType(true)"
			@cancel="confirmContractType(false)"
			ref="tipModal"
			cancelBtnText="否，月度合同"
			okBtnText="是，长协合同"
			v-bind:closable="false"
		></TipModal>
		<Template
			ref="template"
			@showContent="showContent"
		/>
	</div>
</template>

<script>
import ProductIndicator from './components/ProductIndicator.vue';
import Template from './components/Template.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Editor from './components/Editor.vue';
import { API_SensitiveWordsCheck, checkDateIsWorkDay } from '@/v2/center/trade/api/contract';
import othercustomCount from './config';
import moment from 'moment';
import contractMixin from '../mixin/index';
import TipModal from '../suppleAgreement/components/TipModal';
import { convertCurrency } from '@/v2/utils/factory.js';

export default {
	mixins: [contractMixin],
	props: {
		formSchema: {
			type: Object,
			default: () => {}
		},
		isOa: {
			type: Boolean,
			default: false
		}
	},
	components: {
		Editor,
		ProductIndicator,
		Template,
		TipModal
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_CONTRACT_OTHER_DATA: 'VUEX_GET_CONTRACT_OTHER_DATA',
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA',
			VUE_SET_FORM_LIST_SORT: 'VUE_SET_FORM_LIST_SORT',
			VUEX_GET_OPTIONS_LIST: 'VUEX_GET_OPTIONS_LIST'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		VUEX_FORM_LAYOUT() {
			return this.VUEX_GET_FORM_SCHEMA.formLayout;
		},
		VUEX_FORM_LIST() {
			return this.VUEX_GET_FORM_SCHEMA.formList;
		},
		customCount() {
			return this.VUEX_GET_CONTRACT_DATA?.contractExtension?.customCount || null;
		},
		// 是否有基准价格汉字、文本字段
		basePriceBothFlag() {
			const qualityItem = this.VUEX_GET_FORM_SCHEMA.formList.quality;
			let showflag1 = false;
			let showflag2 = false;
			qualityItem.filter(item => {
				showflag1 = showflag1 || item.label === 'basePriceDesc';
			});
			qualityItem.filter(item => {
				showflag2 = showflag2 || item.label === 'basePrice';
			});
			return showflag1 && showflag2;
		},
		// 是否是华泰专用模版
		isHuaTai() {
			return ['STEAM_COAL_018', 'COKING_COAL_008', 'COKING_012', 'SEMI_COKE_007', 'SMOKELESS_COAL_007', 'INJECTION_COAL_007'].includes(this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName || '');
		}
	},
	data() {
		return {
			formList: [],
			othercustomCount,
			selectTemplateItem: {},
			sensitiveWordsList: {},
			basePriceType: '',
			typeConfirmed: null,
			signTimeHelpText: undefined // 签名时间的提示信息（默认为空不显示）
		};
	},
	watch: {
		VUEX_FORM_LIST: {
			handler(val) {
				this.$nextTick(() => {
					this.updateTransFormData(val);
				});
			},
			immediate: false,
			deep: true
		}
	},
	mounted() {
		this.formatePrice();
		if (!this.isOa) {
			this.initFormData();
		}
	},
	methods: {
		convertCurrency,
		...mapActions({
			VUEX_GTE_API_COMPANYACCOUNTLIST: 'contract/VUEX_GTE_API_COMPANYACCOUNTLIST',
			VUEX_GTE_API_COMPANY_PEOPLE: 'contract/VUEX_GTE_API_COMPANY_PEOPLE'
		}),
		...mapMutations({
			VUEX_SET_CONTRACT_DATA: 'contract/VUEX_SET_CONTRACT_DATA',
			VUEX_SET_FORM_ERRORS: 'contract/VUEX_SET_FORM_ERRORS',
			VUEX_UPDATE_FORM_SCHEMA: 'contract/VUEX_UPDATE_FORM_SCHEMA'
		}),
		productIndicatorVisible(key) {
			if (key == 'productIndicator' && !['STEAM_COAL_1001'].includes(this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName)) {
				return true;
			}
			return false;
		},
		confirmContractType(isLongTerm) {
			const values = { ['contractTermType']: isLongTerm ? 'LONG_TERM_CONTRACT' : 'MONTHLY_CONTRACT' };
			this.VUEX_UPDATE_FORM_SCHEMA({ field: 'contract', values });
			this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values });
			if (isLongTerm) {
				this.typeConfirmed = true;
				this.$refs.tipModal.close();
			} else {
				this.typeConfirmed = false;
			}
		},
		clearBasePrice() {
			this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values: { basePrice: null } });
		},
		clearBasePriceDesc() {
			this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values: { basePriceDesc: null } });
		},
		formatePrice() {
			// 基准价格默认是数值类型
			this.basePriceType = this.VUEX_GET_CONTRACT_DATA?.contract?.basePriceDesc ? 'TEXT' : 'NUMBER';
			if (this.basePriceType === 'NUMBER') {
				this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values: { basePriceDesc: null } });
			} else {
				this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values: { basePrice: null } });
			}
		},
		selectMultipleScrollTop(id) {
			this.$nextTick(() => {
				const elem = document.querySelector(`#transportation_${id}`);
				const elemUl = elem.querySelector('ul');
				if (elemUl) {
					elemUl.scrollTop = 0;
				}
			});
		},
		validateTagsFieldsError(rule, value, callback, item) {
			if (!item.required) {
				callback();
				return;
			}
			if (!value.length) {
				callback(`${item.title}必填`);
			} else {
				if (value.length > item.maxTagCount) {
					callback(`最多${item.maxTagCount}个标签`);
				}
				let flag = false;
				for (let i = 0; i < value.length; i++) {
					if (value[i].length > item.maxTagTextLength) {
						flag = true;
						break;
					}
				}
				if (flag) {
					callback(`单个标签最大长度为${item.maxTagTextLength}`);
				}
			}
			callback();
		},
		// 根据key值获取当前输入类型
		getItemWidgeType(key) {
			const list = this.VUEX_FORM_LIST['transportation'];
			for (let i = 0; i < list.length; i++) {
				if (list[i].label === key) {
					return list[i].widget;
				}
			}
		},
		// 设置初始值
		setInitialValue(item, label) {
			const key = item == 'transportation' ? 'contractDelivery' : '';
			let result = undefined;
			if (key && this.VUEX_GET_CONTRACT_DATA[key] && this.VUEX_GET_CONTRACT_DATA[key][label]) {
				result = this.VUEX_GET_CONTRACT_DATA[key][label] || undefined;
			} else {
				if (['select-multiple', 'input-search'].includes(this.getItemWidgeType(label))) {
					result = [];
				} else {
					result = undefined;
				}
			}
			return result;
		},
		initFormData() {
			this.createFormList();
			this.initContactAndBankList();
			this.setItemShow();
			this.setFormInit(this.VUEX_GET_CONTRACT_DATA);
		},
		updateTransFormData(val) {
			const transportationList = val.transportation;
			transportationList.forEach(item => {
				if (item.style.display === 'none') {
					let result = null;
					if (['select-multiple', 'input-search'].includes(item.widget)) {
						result = [];
					}
					this.VUEX_SET_CONTRACT_DATA({ field: 'transportation', values: { [item.label]: result } });
				}
			});
		},
		getContentData(label) {
			if (this.VUEX_GET_CONTRACT_DATA.contractExtension) {
				return this.VUEX_GET_CONTRACT_DATA.contractExtension[label] || '';
			}
			return '';
		},
		setContractFormData() {
			const value = this.VUEX_GET_CONTRACT_DATA;
			this.$nextTick(() => {
				this.formList.forEach(item => {
					if (['contacts', 'bankInfo'].includes(item.key)) {
						item.form.setFieldsValue({
							...value['contract'],
							...value['contractDelivery']
						});
					}
				});
			});
		},
		setFormInit(value) {
			this.$nextTick(() => {
				let contractTermType = '';
				let isLongTermDate = false;
				this.formList.forEach(item => {
					if (item.key === 'contractExtension') {
						item.form.setFieldsValue({
							...value[item.key]
						});
					} else {
						const tempObj = {
							...value['contract'],
							...value['contractDelivery'],
							customCount: value?.contractExtension?.customCount
						};
						for (const key in tempObj) {
							let value = tempObj[key] || undefined;
							if (key == 'depositAmount' && !tempObj[key]) {
								value = 0;
							}
							item.form.setFieldsValue({
								[key]: value,
								settleMode: tempObj['settleMode'] || undefined
							});
							if (key == 'contractTermType') {
								contractTermType = value;
							}
							if (key == 'deliveryDate' && value.length > 0) {
								const startDate = moment(value[0]);
								const endDate = moment(value[1]);
								const daysBetween = endDate.diff(startDate, 'days');
								isLongTermDate = daysBetween >= 31;
							}
						}
					}
				});

				// 初始化长协标签状态
				if (contractTermType.length > 0) {
					this.confirmContractType(contractTermType == 'LONG_TERM_CONTRACT');
				} else {
					this.confirmContractType(isLongTermDate);
				}
			});
		},
		// 设置运输方式联动item
		setItemShow() {
			if (!this.VUEX_GET_CONTRACT_DATA.contractDelivery) return;
			const list = this.VUEX_FORM_LIST?.transportation || [];
			const { transportMode, deliveryMode, freightPayMode, transportResponsibility } =
				this.VUEX_GET_CONTRACT_DATA.contractDelivery;
			const valueMap = {
				transportMode: transportMode,
				deliveryMode: deliveryMode,
				freightPayMode: freightPayMode,
				transportResponsibility: transportResponsibility
			};
			for (let i = 0; i < list.length; i++) {
				// 运输方式 交货方式 支付方式 运输负责方
				if (['transportMode', 'deliveryMode', 'freightPayMode', 'transportResponsibility'].includes(list[i].label)) {
					this.valueChange({ key: 'transportation', e: valueMap[list[i].label], item2: list[i] });
				}
			}
		},
		// 初始化获取银行/联系人信息
		initContactAndBankList() {
			for (const key in this.VUEX_FORM_LIST) {
				if (['bankInfo', 'contacts'].includes(key)) {
					this.VUEX_FORM_LIST[key].forEach(item => {
						this.elemClickChange({ key, item2: item });
					});
				}
			}
		},
		validateFieldsError(rule, value, callback, item) {
			if (!value) {
				callback(`${item.title}必填`);
			} else {
				const maxLength = Number(item.maxLength) || 30000;
				if (value.length > maxLength) {
					callback(`${item.title}最多${maxLength}个字符`);
					return;
				}
				API_SensitiveWordsCheck({
					content: value.split(','),
					title: item.item
				})
					.then(res => {
						if (res.success && res.data.length) {
							this.sensitiveWordsList[item.label] = res.data.join('，');
						} else {
							delete this.sensitiveWordsList[item.label];
						}
					})
					.finally(() => {
						callback();
					});
			}
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		createFormList() {
			for (const key in this.VUEX_FORM_LIST) {
				if (this.VUEX_FORM_LIST[key] && this.VUEX_FORM_LIST[key].length) {
					this.formList.push({
						key,
						form: this.$form.createForm(this, { name: key })
					});
				}
			}
		},
		submit() {
			const resultPromise = [];
			this.formList.forEach(item => {
				resultPromise.push(
					new Promise(resolve => {
						item.form.validateFieldsAndScroll(errors => {
							this.VUEX_SET_FORM_ERRORS({
								[item.key]: errors
							});
							if (!errors) {
								resolve(true);
							} else {
								resolve(false);
							}
						});
					})
				);
			});
			if (this.$refs.productIndicator) {
				resultPromise.push(this.$refs.productIndicator[0].handleSubmit());
			}
			return Promise.all(resultPromise);
		},
		elemClickChange(...args) {
			const params = args[0];
			this.$emit('clickItem', { field: params.key, words: params.e || null, ...params.item2 });
		},
		// 表单填写内容变化重新校验
		validateForm(name) {
			this.$nextTick(() => {
				if (name === 'contractExtension') return;
				const form = this.formList.filter(item => item.key === name)[0]?.form;
				if (form) {
					form.validateFields(error => {
						this.VUEX_SET_FORM_ERRORS({
							[name]: error
						});
					});
				}
			});
		},
		valueChangeSearch(...args) {
			const params = args[0];
			if (params.key === 'transportation') {
				this.elemClickChange(params);
			}
		},
		resetFormValueByName(form, name) {
			const formItem = this.formList.filter(item => item.key == form)[0]?.form;
			formItem?.setFieldsValue({
				[name]: undefined
			});
		},
		valueChange(...args) {
			const params = args[0];
			// 新建合同不触发校验
			if (this.$route.query.flag != 'add') {
				this.validateForm(params.key);
			}
			if (params.key === 'transportation') {
				this.elemClickChange(params);
				// 运输方式变更，交货方式要重置
				if (params.item2.label === 'transportMode') {
					this.resetFormValueByName('transportation', 'deliveryMode');
					const values = { ['deliveryMode']: null };
					this.VUEX_UPDATE_FORM_SCHEMA({ field: params.key, values });
					this.VUEX_SET_CONTRACT_DATA({ field: params.key, values });
				}
			}
			// 交货方式变更需要重置
			if (
				[
					'transportMode',
					'deliveryMode',
					'buyerBankAccountId',
					'sellerBankAccountId',
					'sellerContactsId',
					'buyerContactsId'
				].includes(params.item2.label)
			) {
				const options = params?.item2?.optionsBank || params?.item2?.options || [];
				const deliveryModeList = options?.map(item => item.value);
				if (!deliveryModeList.includes(params.e)) {
					params.e = '';
					// 合同附件下载要求transportMode、deliveryMode不填写时为null
					if (['transportMode', 'deliveryMode'].includes(params.item2.label)) {
						params.e = null;
					}
				}
			}
			let value = undefined;
			if (params?.e?.target) {
				value = params?.e?.target?.value || undefined;
			} else {
				value = params.e;
			}
			let bankInfo = {};
			let contactsInfo = {};
			let deliveryDate = {};

			if (params.key === 'bankInfo') {
				if (params.item2.label === 'sellerBankAccountId') {
					bankInfo.sellerSubbranchName = params.item2.optionsBank.filter(item => item.id === value)[0].subbranchName;
					bankInfo.sellerBankNo = params.item2.optionsBank.filter(item => item.id === value)[0].accountNo;
				}
				if (params.item2.label === 'buyerBankAccountId') {
					bankInfo.buySubbranchName = params.item2.optionsBank.filter(item => item.id === value)[0].subbranchName;
					bankInfo.buyBankNo = params.item2.optionsBank.filter(item => item.id === value)[0].accountNo;
				}
			}
			// 华泰合同模版增加不含税金额，含税总额/大写，不含税总额/大写
			// 不含税单价 unitPriceExcludeTax 基准价格/（1+13%）
			// 不含税总额 totalAmountExcludeTax （基准价格*数量）/（1+13%）
			// 不含税总额大写 totalAmountExcludeTaxChinese
			// 含税总额 totalAmountIncludeTaxChinese 基准价格*数量
			// 含税总额大写 totalAmountIncludeTax
			let huaTai = {}
			let quantityVal = this.VUEX_GET_CONTRACT_DATA?.contract?.quantity || 0
			let basePriceVal = this.VUEX_GET_CONTRACT_DATA?.contract?.basePrice || 0
			if(this.isHuaTai && ((params.item2.label === 'basePrice' && quantityVal) || (params.item2.label === 'quantity' && basePriceVal)) ) {
				huaTai.unitPriceExcludeTax = (basePriceVal / 1.13).toFixed(2),
				huaTai.totalAmountExcludeTax = (basePriceVal * quantityVal / 1.13).toFixed(2),
				huaTai.totalAmountExcludeTaxChinese = convertCurrency(huaTai.totalAmountExcludeTax)
				huaTai.totalAmountIncludeTax =  (basePriceVal * quantityVal).toFixed(2),
				huaTai.totalAmountIncludeTaxChinese = convertCurrency(huaTai.totalAmountIncludeTax)
			}
			if (params.item2.label === 'deliveryDate') {
				const startDate = moment(value[0]);
				const endDate = moment(value[1]);
				const daysBetween = endDate.diff(startDate, 'days');
				if (daysBetween >= 31) {
					this.$refs.tipModal.open();
				} else {
					this.confirmContractType(false);
				}
				deliveryDate.deliveryStartDate = startDate.format('YYYY-MM-DD');
				deliveryDate.deliveryEndDate = endDate.format('YYYY-MM-DD');
				deliveryDate.signTime = startDate.format('YYYY-MM-DD');
				// 给签订日期赋值： 交货期限起始时间
				const signTime = value.length > 0 ? startDate : undefined;
				this.setFormValueByName('quality', 'signTime', signTime);
				// 检查签名时间
				this.configSignTimeHelpText(signTime, value);
			}
			const values = { [params.item2.label]: value, ...bankInfo, ...contactsInfo, ...deliveryDate, ...huaTai };
			if (params.item2.label === 'deliveryDate') {
				this.VUEX_SET_CONTRACT_DATA({ field: 'transportation', values });
				// value = (Array.isArray(value) && value.length) ? value.join(',') : value;
			}
			if (params.item2.label == 'signTime') {
				// 检查签名时间
				const deliveryDateValues = this.getFormValueByName('quality', 'deliveryDate');
				this.configSignTimeHelpText(value, deliveryDateValues);
			}
			if (params.key === 'commitment') {
				if (params?.item2.label == 'upstreamSignCompanyName') {
					const valuesCompany = {
						['downstreamSignCompanyName']: value
					};
					this.VUEX_SET_CONTRACT_DATA({ field: 'commitment', values: valuesCompany });
				}
			}
			this.$emit('change', { field: params.key, values });
			// 改变formSchema
			this.VUEX_UPDATE_FORM_SCHEMA({ field: params.key, values });
			// 存储值
			this.VUEX_SET_CONTRACT_DATA({ field: params.key, values });
		},
		setEditDefaultValue(key, item2) {
			if (this.VUEX_GET_CONTRACT_DATA[key]) {
				return this.VUEX_GET_CONTRACT_DATA[key][item2.label] || '';
			}
			return '';
		},
		scrollCurrentView(key) {
			// this.tipList.forEach(item => {
			//   document.querySelector(`#${item}Form`).style.marginTop = '0';
			// });
			document.querySelector(`#${key}Form`).scrollIntoView({ behavior: 'smooth' });
			this.$nextTick(() => {
				// document.querySelector(`#${key}Form`).style.marginTop = '62px';
			});
		},
		validateFields(key) {
			document.querySelector(`#${key}Form`).scrollIntoView({ behavior: 'smooth' });
			this.formList.filter(item => item.key === key)[0]?.form?.validateFields();
		},
		// 收藏模版
		collectTemplate(type, contentType) {
			// type是模版数，editorContent是富文本编辑器的内容
			this.$refs.template.collect(type, this.VUEX_GET_CONTRACT_DATA.contractExtension[contentType]);
		},
		// 选择模版
		selectTemplate(type, item) {
			this.selectTemplateItem = item;
			this.$refs.template.select(type, '');
		},
		// 选中模版后将内容回填到对应的富文本编辑器
		showContent(data) {
			const { label, templateType } = this.selectTemplateItem;
			if (this.$refs[`${label}_${templateType}_Ref`] && this.$refs[`${label}_${templateType}_Ref`][0]) {
				this.$refs[`${label}_${templateType}_Ref`][0].updateHtmlContent(data);
			}
			// this.valueChange({key: 'contractExtension', e: data, item2: this.selectTemplateItem});
		},
		// formatFormLayout(key){
		//   let list = this.VUEX_FORM_LIST[key].filter(item => item.style.display === 'block')
		// }
		onSwitch(form, e) {
			this.basePriceType = e ? 'NUMBER' : 'TEXT';
			if (this.basePriceType === 'NUMBER') {
				this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values: { basePriceDesc: null } });
			} else {
				this.VUEX_SET_CONTRACT_DATA({ field: 'contract', values: { basePrice: null } });
			}
		},
		// 设置指定form表单的某个值
		setFormValueByName(form, name, value) {
			const formItem = this.formList.filter(item => item.key == form)[0]?.form;
			formItem?.setFieldsValue({
				[name]: value
			});
			this.$nextTick(() => {
				formItem?.validateFields([name]);
			});
		},
		getFormValueByName(form, name) {
			const formItem = this.formList.filter(item => item.key == form)[0]?.form;
			return formItem?.getFieldValue(name);
		},
		// 签名时间占位符
		signTimePlaceholder() {
			const qualityForm = this.formList.filter(item => item.key == 'quality')[0];
			if (qualityForm) {
				const qualityFormItem = qualityForm.form;
				const deliveryDateValue = qualityFormItem.getFieldValue('deliveryDate');
				if (deliveryDateValue && deliveryDateValue.length > 0) {
					return '请选择合同签订日期';
				}
			}
			return '请先选择交货期限';
		},
		// 签名时间不可选择日期
		signTimeDisableDates(currentDate) {
			const qualityForm = this.formList.filter(item => item.key == 'quality')[0];
			if (qualityForm) {
				const qualityFormItem = qualityForm.form;
				const deliveryDateValue = qualityFormItem.getFieldValue('deliveryDate');
				const startDate = moment(deliveryDateValue[0]);
				startDate.isSameOrAfter(currentDate, 'day');
				if (deliveryDateValue.length > 0 && currentDate.isSameOrBefore(startDate, 'day')) {
					// 签订时间和交货期限开始时间相同或在其之前可选
					return false;
				}
			}
			return true;
		},
		validateSignTimeError(rule, value, callback, item2) {
			console.log('validateSignTimeError:');
			const placeholder = this.signTimePlaceholder();
			console.log('validateSignTimeError:', placeholder);
			if (placeholder == '请先选择交货期限') {
				callback('请先选择交货期限');
			} else {
				callback();
			}
		},
		configSignTimeHelpText(signDateValue, deliveryDateValues) {
			if (!signDateValue) {
				// 签名时间没值
				this.signTimeHelpText = undefined;
				return;
			}
			if (!deliveryDateValues || deliveryDateValues.length < 1) {
				this.signTimeHelpText = undefined;
				return;
			}
			const signDateMoment = moment(signDateValue);
			const startDate = moment(deliveryDateValues[0]);
			const startDate30AgoMoment = startDate.subtract(30, 'days');
			checkDateIsWorkDay({ localDate: signDateMoment.format('YYYY-MM-DD') })
				.then(res => {
					if (res.success && res.data == false) {
						// 非工作日
						this.signTimeHelpText = '合同签订日期为非工作日，如果实际如此，请忽略提示';
					} else {
						if (signDateMoment < startDate30AgoMoment) {
							// 签名时间小于起始日期30天
							this.signTimeHelpText = '该日期与交货起始日偏差较多，若实际如此，请忽略';
						} else {
							this.signTimeHelpText = undefined;
						}
					}
				})
				.finally(() => {});
			// return '合同签订日期与交货期限起始日偏差较多，如果实际如此，请忽略提示'
			// return '合同签订日期为非工作日，如果实际如此，请忽略提示'
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	.slTitleAssis {
		height: 52px;
		display: flex;
		align-items: center;
		margin-top: 0;
		.ant-space {
			margin-left: 30px;
		}
		.ant-space-item .tips {
			font-size: 12px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.4);
		}
	}
	.slTitleAssis.marginTopLoss {
		// margin-top: -20px;
	}
	.btn128 {
		width: 128px;
	}
	.btn88 {
		width: 88px;
	}
	//敏感词
	.sensitiveWords {
		color: #dd4444;
		margin: 15px 0 20px 0;
	}

	// 自定义条款填写说明：
	.customTerms {
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.4);
		line-height: 22px;
		.customTermsEdit {
			color: rgba(0, 0, 0, 0.8);
			font-weight: 400;
			margin-top: 16px;
			.ant-select {
				width: 364px;
			}
		}
	}
}
.item {
	width: 100%;
	/deep/.ant-select-selection-selected-value {
		padding-right: 28px;
	}
	/deep/.ant-calendar-picker-input {
		.ant-calendar-range-picker-input:nth-child(3) {
			padding-left: 12px !important;
		}
	}
}
.select-bank {
	margin-bottom: 20px !important;
	::v-deep.ant-select-selection__rendered {
		height: 56px;
		padding: 8px 0;
	}
	::v-deep.ant-select-dropdown {
		.ant-select-dropdown-menu {
			padding: 0 !important;
			.ant-select-dropdown-menu-item {
				height: 64px;
				padding: 10px 12px !important;
			}
			.select-bank-content.small {
				font-size: 14px;
				zoom: 0.85;
				color: rgba(0, 0, 0, 0.4);
				margin-top: 8px;
			}
		}
	}

	.select-bank-content {
		height: 20px;
		line-height: 20px;
		font-family: 'PingFang SC';
		font-weight: 400;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
	}
	.select-bank-content.small {
		font-size: 14px;
		zoom: 0.85;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 2px;
	}
	::v-deep.ant-select-selection {
		height: 56px;
	}
}
.col-list-item {
	max-width: 100%;
	box-sizing: border-box;
}
.input-2column {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	.input-left {
		width: 30%;
	}
	.input-right {
		width: 60%;
		/deep/ .ant-form-item-label {
			opacity: 0;
		}
	}
}
.editor-required-icon {
	color: #f5222d;
}
.form-item-normal {
	// width: 364px;
	height: 82px;
	margin-bottom: 0;
	padding-bottom: 0;
}
.input-quality {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	.input-quality-left {
		flex: 1;
		.ant-input-number {
			width: 100%;
		}
	}
}
.input-quality-percent {
	width: 150px;
	height: 82px;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	padding-top: 30px;
	box-sizing: border-box;
	/deep/ .ant-form-item-label {
		margin: 0 !important;
		display: none;
	}
	/deep/ .ant-form-item {
		margin-bottom: 0;
	}
	.item {
		width: 118px;
		border-radius: 4px 0 0 4px;
		margin-bottom: 0;
	}
}
.input-quality-computed {
	width: 20px;
	height: 32px;
	display: inline-block;
	text-align: center;
	line-height: 32px;
	margin-top: 10px;
}
.input-quality-percent-icon {
	width: 32px;
	height: 32px;
	background: #f3f5f6;
	border-radius: 0px 4px 4px 0px;
	border: 1px solid #e5e6eb;
	border-left: none;
	text-align: center;
	line-height: 32px;
	position: relative;
	// top: 1px;
}
.slFormDetailDiy {
	// padding-bottom: 20px;
	/deep/ .ant-form-item {
		margin: 0;
		padding: 0;
	}
	/deep/ .ant-col-24 {
		// margin-top: 30px;
	}
	/deep/ .ant-select-selection__rendered {
		width: 100%;
		padding-right: 8px;
		box-sizing: border-box;
		ul {
			width: 100%;
			height: 30px;
			overflow: hidden;
			overflow-y: auto;
			li {
				max-width: 30%;
			}
			.ant-select-search--inline {
				width: 90%;
			}
		}
	}
	.ant-input-number-focused::after /deep/ .ant-select-search__field__mirror {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
// 以1440为准
@media screen and (max-width: 1440px) {
	.slTitleAssis {
		.ant-space {
			margin-left: 10px !important;
		}
		.ant-space-item {
			margin-right: 10px !important;
		}
	}
	.slBtn {
		padding: 6px 10px !important;
	}
}
::v-deep.ant-select-selection--multiple {
	.ant-select-selection__rendered {
		height: 32px !important;
	}
}
.sensitive-words-wrap {
	font-size: 14px !important;
	zoom: 0.85;
	color: #f5222d;
}
.editor-content-wrap {
	padding-bottom: 10px !important;
}
.diy-form-wrap {
	padding-bottom: 40px;
}

.code-label {
	display: flex;
	align-items: center;
	width: 100%;
	height: 20px;
	line-height: 20px;
	margin-bottom: 10px;
	.extra {
		margin-left: 15px;
		::v-deep.ant-switch {
			height: 20px;
			margin: 4px 0 4px;
			box-sizing: border-box;
			.ant-switch-inner {
				position: relative;
				top: -1px;
				margin-left: 20px;
				font-size: 14px;
				zoom: 0.85;
				line-height: 20px;
			}
		}
		::v-deep.ant-switch-checked {
			.ant-switch-inner {
				margin-right: 20px;
				margin-left: 8px;
			}
		}
		::v-deep.ant-switch-loading-icon,
		.ant-switch::after {
			width: 14px;
			height: 14px;
			top: 2px;
		}
	}
	.LONG_TERM_CONTRACT {
		position: relative;
		margin-left: 10px;
		border-radius: 4px;
		border: 1px solid @primary-color;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		.text {
			text-align: center;
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -2px;
			color: @primary-color;
		}
	}
}
.code-required {
	display: inline-block;
	margin-right: 4px;
	color: #f5222d;
	font-size: 14px;
	line-height: 1;
}
.code-name {
	color: rgba(0, 0, 0, 0.85);
}
.editor-list-item-title {
	margin-top: 10px;
}
.editor-list-item-required {
	color: #f5222d;
	margin-right: 4px;
}
.select-rule-item {
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-top: 16px;
}
.editor-list-item-select {
	width: 400px !important;
	margin: 0 10px;
}
.editor-list-item {
	// margin-bottom: 40px;
}
.editor-list-item-required-title {
	margin: 10px 0;
}
.editor-list-item-required-desc {
	line-height: 22px;
	color: rgba(0, 0, 0, 0.4);
}
::v-deep.anticon-info-circle {
	display: inline-block;
	margin-left: 10px;
	cursor: pointer;
	color: #999;
}
</style>
