<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
		>
			<div
				v-if="isBuyContract"
				style="display: flex; flex-wrap: wrap"
			>
				<a-row style="width: 100%">
					<!-- 采购合同 -->
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="卖方企业">
								<a-select
									:getPopupContainer="getPopupContainer"
									showSearch
									placeholder="请选择卖方企业"
									:notFoundContent="sellerData ? '暂无数据' : '加载中...'"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									@search="getSellerList"
									@select="judgeFunc"
									v-decorator="[
										`sellerName`,
										{
											rules: [{ required: true, message: `请输入卖方企业名称`, type: 'string' }]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in sellerData"
										:key="index"
										:value="items.name"
										>{{ items.name }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="买方企业名称">
								<a-input
									style="width: 100%"
									:disabled="true"
									placeholder="请选择买方企业"
									v-decorator="[
										`buyerName`,
										{
											rules: [{ required: true, message: `请输入买方企业名称` }]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="合同编号">
								<a-input
									style="width: 100%"
									:maxLength="50"
									placeholder="请输入合同编号"
									@change="changeContractNo"
									v-decorator="[
										`paperContractNo`,
										{
											rules: [{ required: true, message: `请输入合同编号` }, { validator: checkPaperContractNo }],
											validateTrigger: ['blur']
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						class="relation-order"
					>
						<a-row
							:gutter="10"
							type="flex"
							justify="start"
							style="width: 100%"
						>
							<a-col
								:span="17"
								style="width: 264px"
							>
								<a-form-item
									label="合同单价"
									style="width: 264px"
								>
									<a-tooltip
										placement="topLeft"
										:visible="priceShow"
									>
										<template slot="title">
											<span>{{ form.getFieldValue('contractPrice') >= 1000 ? '千' : '' }}</span>
										</template>
										<a-input-number
											style="width: 100%"
											step="100"
											:disabled="contractPriceDisabled"
											:max="9999.999"
											:precision="3"
											@change="changePrice"
											@focus="changePriceFocus"
											@blur="priceShow = false"
											placeholder="请输入合同单价"
											:min="0"
											v-decorator="[
												`contractPrice`,
												{
													rules: [
														{ required: !form.getFieldValue('followTheMarket'), message: `合同单价必填` },
														{ validator: judgeQuantity2 }
													]
												}
											]"
										/>
									</a-tooltip>
								</a-form-item>
							</a-col>
							<a-col
								:span="7"
								style="width: 100px"
							>
								<a-form-item
									label=""
									style="width: 100px; margin-top: 30px"
								>
									<a-checkbox v-decorator="[`followTheMarket`, { valuePropName: 'checked', initialValue: false }]">
										随行就市
									</a-checkbox>
								</a-form-item>
							</a-col>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						class="relation-order"
					>
						<a-row
							:gutter="10"
							type="flex"
							justify="center"
							style="width: 100%; margin-left: -10px"
						>
							<a-form-item
								label="合同数量"
								style="width: 256px"
							>
								<a-row class="df">
									<a-tooltip
										placement="topLeft"
										:visible="quantityShow"
									>
										<template slot="title">
											<span> {{ computeUnit(form.getFieldValue('contractQuantity')) }}</span>
										</template>
										<a-input-number
											@blur="quantityShow = false"
											@focus="changeQuantityFocus"
											@change="changeQuantity"
											placeholder="请输入合同数量"
											step="100"
											:precision="3"
											:max="9999999.999"
											:min="0"
											v-decorator="[
												`contractQuantity`,
												{ rules: [{ required: true, message: `合同数量必填` }, { validator: judgeQuantity }] }
											]"
										/>
									</a-tooltip>

									<div style="margin: 0 5px">±</div>
								</a-row>
							</a-form-item>

							<a-form-item
								label="合同数量"
								style="width: 88px"
								class="quantity-box"
							>
								<a-row class="df">
									<a-input-number
										class="quantity-offset"
										:min="0"
										:max="100"
										v-decorator="[
											`quantityOffset`,
											{
												rules: [
													{ required: false, message: `数量偏差必填` },
													{ pattern: /^(?:0|[1-9][0-9]?|100)$/, message: '数量偏差请输入为0-100整数字' }
												]
											}
										]"
									/>
									<div class="symbol">%</div>
								</a-row>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="品名">
								<a-input
									placeholder="请输入品名"
									:maxLength="200"
									v-decorator="[
										`goodsName`,
										{
											rules: [{ required: true, message: `品名必填` }]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="8"
						:class="{ 'col-height2': execDateDevMax || execDateLengthMax || contractSignTimeDevMax }"
					>
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="合同签订日期">
								<a-date-picker
									style="width: 100%"
									placeholder="请选择签订日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`contractSignTime`,
										{
											rules: [{ required: true, message: `签订日期必填` }]
										}
									]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
								<span
									slot="extra"
									v-if="contractSignTimeDevMax"
								>
									签订日期与当前系统日期偏差较大，请确认签订日期是否无误，如果正确，请忽略提示
								</span>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						:class="{ 'col-height2': execDateDevMax || execDateLengthMax || contractSignTimeDevMax }"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="合同签章状态">
								<a-select
									:getPopupContainer="getPopupContainer"
									placeholder="请选择合同签章状态"
									v-decorator="[
										`signStatus`,
										{
											initialValue: 2,
											rules: [
												{
													required: true,
													message: `合同签章状态必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in signStatus"
										:key="index"
										:value="items.value"
									>
										{{ items.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						:class="{ 'col-height2': execDateDevMax || execDateLengthMax || contractSignTimeDevMax }"
					>
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="交货期限"
								class="marginBottom0"
							>
								<a-range-picker
									style="width: 100%"
									:allowClear="false"
									:placeholder="['开始时间', '结束时间']"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`execDate`,
										{
											rules: [{ required: true, message: `交货期限必填` }]
										}
									]"
								>
								</a-range-picker>
								<span
									slot="extra"
									v-if="execDateDevMax || execDateLengthMax"
								>
									<span v-if="execDateDevMax">
										交货期限与当前系统日期偏差较多，请确认合同有效期是否无误，如果正确，请忽略提示。
									</span>
									<span v-if="execDateLengthMax"> 交货期限过长，请确定是否填写无误，如果正确，请忽略提示。 </span>
								</span>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="合同类型">
								<a-select
									:getPopupContainer="getPopupContainer"
									placeholder="请选择合同类型"
									v-decorator="[
										`contractTermType`,
										{
											rules: [
												{
													required: true,
													message: `合同类型必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in contractTimeTypeList"
										:key="index"
										:value="items.value"
									>
										{{ items.text }}
									</a-select-option>
								</a-select>
								<span
									slot="extra"
									v-if="execDateMatch"
								>
									<span>{{ execDateMatchText }}</span>
								</span>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="业务类型">
								<a-select
									showSearch
									:getPopupContainer="getPopupContainer"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									v-decorator="[
										`businessType`,
										{
											initialValue: 'ACCOUNT_RECEIVABLE',
											rules: [
												{
													required: true,
													message: `业务类型必填`,
													type: 'string'
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(item, index) in orderBusinessTypeDescMap"
										:key="index"
										:value="item.value"
										v-if="item.value !== 'DISCOUNT_WAREHOUSE_PLEDGE'"
									>
										{{ item.text }}
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
							<a-form-item label="业务实际负责人">
								<!-- 选择框 -->
								<a-select
									placeholder="请选择业务实际负责人"
									:disabled="isOa"
									:getPopupContainer="getPopupContainer"
									showSearch
									:notFoundContent="!upDownUserList.length ? '暂无数据' : null"
									:filterOption="filterOption"
									:defaultActiveFirstOption="false"
									v-decorator="[
										`businessOwnershipTeamConfigId`,
										{
											rules: [
												{
													required: true,
													message: `业务实际负责人必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in upDownUserList"
										:key="index"
										:value="items.id"
									>
										{{ items.businessUnitName }}-{{ items.department }}- {{ items.memberName }}-{{ items.memberMobile }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						class="relation-order"
						style="height: auto !important"
					>
						<a-row
							:gutter="10"
							type="flex"
							justify="start"
							style="width: 100%"
						>
							<a-col
								:span="17"
								class="h_auto"
								style="width: 264px; height: auto"
							>
								<a-form-item
									:label="'业务线（关联' + titleDesc + '合同）'"
									:required="!form.getFieldValue('relateOrder')"
									style="width: 264px"
								>
									<a-input
										:placeholder="'请选择' + titleDesc + '合同'"
										v-show="!linkContractNo"
										:disabled="isOa || form.getFieldValue('relateOrder') || isBusinessSource || !!$route.query.id"
										@click="showRelationOrderList"
										v-decorator="[
											`linkContractNo`,

											{
												rules: [
													{
														required: !form.getFieldValue('relateOrder'),
														message: `关联${titleDesc}合同必填`
													}
												]
											}
										]"
									/>
									<SpecialInput
										v-show="linkContractNo"
										@openModal="showRelationOrderList"
										@send="getSelectContractNoList"
										:contactNos="linkContractNo"
										:placeholder="'请选择' + titleDesc + '合同'"
										:disabled="
											isOa || form.getFieldValue('relateOrder') || isBusinessSource || editDisabledNoCfca || !!$route.query.id
										"
									></SpecialInput>
								</a-form-item>
							</a-col>
							<a-col
								:span="7"
								style="width: 100px"
							>
								<a-form-item
									label=" "
									style="width: 100px"
								>
									<a-checkbox
										@change="onChange"
										:disabled="isOa || isBusinessSource || !!$route.query.id"
										v-decorator="[
											`relateOrder`,
											{
												valuePropName: 'checked',
												rules: [
													{
														required: false,
														message: `关联销售合同必填`
													}
												]
											}
										]"
										>暂不关联</a-checkbox
									>
								</a-form-item>
							</a-col>
						</a-row>
					</a-col>
				</a-row>
			</div>
			<div v-else>
				<a-row style="display: flex; flex-wrap: wrap">
					<template>
						<a-col :span="8">
							<a-row type="flex">
								<a-form-item label="买方企业">
									<a-select
										:getPopupContainer="getPopupContainer"
										@select="handleSelect"
										showSearch
										:disabled="editDisabledNoCfca"
										placeholder="请选择买方企业"
										:notFoundContent="sellerData ? '暂无数据' : '加载中...'"
										:filterOption="false"
										:defaultActiveFirstOption="false"
										@search="getSellerList"
										v-decorator="[
											`buyerName`,
											{
												rules: [{ required: true, message: `请输入买方企业名称`, type: 'string' }]
											}
										]"
									>
										<a-select-option
											v-for="(items, index) in sellerData"
											:key="index"
											:value="items.name"
											>{{ items.name }}</a-select-option
										>
									</a-select>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="卖方企业名称">
									<a-input
										style="width: 100%"
										:disabled="true"
										placeholder="请选择卖方企业"
										v-decorator="[
											`sellerName`,
											{
												rules: [{ required: true, message: `请输入卖方企业名称` }]
											}
										]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
					</template>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="合同编号">
								<a-input
									style="width: 100%"
									:maxLength="50"
									placeholder="请输入合同编号"
									:disabled="editDisabledNoCfca"
									@change="changeContractNo"
									v-decorator="[
										`paperContractNo`,
										{
											rules: [{ required: true, message: `请输入合同编号` }, { validator: checkPaperContractNo }],
											validateTrigger: ['blur']
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="合同签章状态">
								<a-select
									:disabled="editDisabledCfca"
									:getPopupContainer="getPopupContainer"
									@change="changeSignStatus"
									placeholder="请选择合同签章状态"
									v-decorator="[
										`signStatus`,
										{
											rules: [
												{
													required: true,
													message: `合同签章状态必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in signStatus"
										:key="index"
										:value="items.value"
									>
										{{ items.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="form.getFieldValue('signStatus') == 2"
						class="col-height"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="双签合同获得日期">
								<a-date-picker
									:disabled="editDisabledCfca"
									style="width: 100%"
									placeholder="请选择双签合同获得日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`doubleSignTime`,
										{
											rules: [{ required: true, message: `双签合同获得日期必填` }]
										}
									]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
								<span
									slot="extra"
									v-if="doubleSignTimeDevMax"
								>
									双签合同获得日期与当前系统日期偏差较大，请确认双签合同获得日期是否无误，如果正确，请忽略提示
								</span>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="form.getFieldValue('signStatus') != 2"
					>
						<a-row
							type="flex"
							:justify="form.getFieldValue('signStatus') == 2 ? 'start' : 'center'"
						>
							<a-form-item label="回款账号">
								<a-select
									:getPopupContainer="getPopupContainer"
									:dropdownMatchSelectWidth="true"
									:disabled="editDisabledNoCfca"
									placeholder="请输入回款账号"
									v-decorator="[
										`receivableBankAccountId`,
										{
											rules: [{ required: true, message: `回款账号必填` }]
										}
									]"
								>
									<!-- <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <div style="padding: 4px 8px" @mousedown="(e) => e.preventDefault()">列表中没有？<a @click="creatBankAccount('add')">添加新账户</a></div>
                  </div> -->
									<a-select-option
										v-for="item in collectionAccountInfo"
										:key="item.subbranchName"
										:value="item.id"
									>
										{{ item.subbranchName }}/{{ item.accountNo }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="form.getFieldValue('signStatus') == 2"
					>
						<a-row
							type="flex"
							:justify="form.getFieldValue('signStatus') == 2 ? 'end' : 'center'"
						>
							<a-form-item label="回款账号">
								<a-select
									:getPopupContainer="getPopupContainer"
									:dropdownMatchSelectWidth="true"
									placeholder="请输入回款账号"
									:disabled="editDisabledNoCfca"
									v-decorator="[
										`receivableBankAccountId`,
										{
											rules: [{ required: true, message: `回款账号必填` }]
										}
									]"
								>
									<!-- <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <div style="padding: 4px 8px" @mousedown="(e) => e.preventDefault()">列表中没有？<a @click="creatBankAccount('add')">添加新账户</a></div>
                  </div> -->
									<a-select-option
										v-for="item in collectionAccountInfo"
										:key="item.subbranchName"
										:value="item.id"
									>
										{{ item.subbranchName }}/{{ item.accountNo }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							:justify="form.getFieldValue('signStatus') == 2 ? 'start' : 'end'"
						>
							<a-form-item label="业务类型">
								<a-select
									showSearch
									:getPopupContainer="getPopupContainer"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									:disabled="editDisabledNoCfca"
									v-decorator="[
										`businessType`,
										{
											initialValue: 'ACCOUNT_RECEIVABLE',
											rules: [
												{
													required: true,
													message: `业务类型必填`,
													type: 'string'
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(item, index) in orderBusinessTypeDescMap"
										:key="index"
										:value="item.value"
										v-if="item.value !== 'DISCOUNT_WAREHOUSE_PLEDGE'"
									>
										{{ item.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							:justify="form.getFieldValue('signStatus') == 2 ? 'center' : 'start'"
						>
							<a-form-item label="业务实际负责人">
								<!-- 选择框 -->
								<a-select
									placeholder="请选择业务实际负责人"
									:disabled="businessOwnerDisabled"
									:getPopupContainer="getPopupContainer"
									showSearch
									:notFoundContent="!upDownUserList.length ? '暂无数据' : null"
									:filterOption="filterOption"
									:defaultActiveFirstOption="false"
									v-decorator="[
										`businessOwnershipTeamConfigId`,
										{
											rules: [
												{
													required: true,
													message: `业务实际负责人必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in upDownUserList"
										:key="index"
										:value="items.id"
									>
										{{ items.businessUnitName }}-{{ items.department }}-{{ items.memberName }}-{{ items.memberMobile }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						class="relation-order"
						style="height: auto"
					>
						<a-row
							:gutter="10"
							type="flex"
							:justify="form.getFieldValue('signStatus') == 2 ? 'end' : 'center'"
							style="width: 100%"
						>
							<a-col
								:span="17"
								class="h_auto"
								style="width: 264px; height: auto"
							>
								<a-form-item
									:label="'业务线（关联' + titleDesc + '合同）'"
									:required="!form.getFieldValue('relateOrder')"
									style="width: 264px"
								>
									<a-input
										:placeholder="'请选择' + titleDesc + '合同'"
										:disabled="
											isOa || form.getFieldValue('relateOrder') || isBusinessSource || editDisabledNoCfca || !!$route.query.id
										"
										@click="showRelationOrderList"
										v-show="!linkContractNo"
										v-decorator="[
											`linkContractNo`,
											{
												rules: [
													{
														required: !form.getFieldValue('relateOrder'),
														message: `关联${titleDesc}合同必填`
													}
												]
											}
										]"
									/>
									<SpecialInput
										v-show="linkContractNo"
										@openModal="showRelationOrderList"
										@send="getSelectContractNoList"
										:contactNos="linkContractNo"
										:placeholder="'请选择' + titleDesc + '合同'"
										:disabled="
											isOa || form.getFieldValue('relateOrder') || isBusinessSource || editDisabledNoCfca || !!$route.query.id
										"
									></SpecialInput>
								</a-form-item>
							</a-col>
							<a-col
								:span="7"
								style="width: 100px"
							>
								<a-form-item
									label=" "
									style="width: 100px"
								>
									<a-checkbox
										@change="onChange"
										:disabled="isOa || isBusinessSource || editDisabledNoCfca || !!$route.query.id"
										v-decorator="[
											`relateOrder`,
											{
												valuePropName: 'checked',
												rules: [
													{
														required: false,
														message: `关联销售合同必填`
													}
												]
											}
										]"
										>暂不关联</a-checkbox
									>
								</a-form-item>
							</a-col>
						</a-row>
					</a-col>
				</a-row>
			</div>
		</a-form>
		<relation-contract
			:type="this.$route.query.type === 'sell' ? 'buy' : 'sell'"
			ref="RelationContract"
			@detail="getRelationOrderDetail"
			:relateOrderNo="form.getFieldValue('linkContractNo')"
		/>
		<ConfirmModal
			ref="confirmModal"
			okText="确认"
			:cancelBtnVisible="false"
		></ConfirmModal>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import RelationContract from '../DownRelationContract.vue';
import ConfirmModal from '@/v2/components/modal/ConfirmModal.vue';
import SpecialInput from '../../../../components/SpecialInput.vue';

import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_listTerminalDirector } from '@/v2/center/trade/api/contract';
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import moment from 'moment';
import {
	API_GETOFFLINESELLERLIST,
	API_COMPANYACCOUNTLIST,
	API_OFFLINESELLERORDEREXIST, //判断合同号是否重复
	API_validCompanyIsInRiskBlack
} from '@/v2/center/trade/api/contract';

export default {
	props: {
		isBuyContract: {
			type: Boolean,
			default: false
		},
		orderType: {
			type: String,
			default: ''
		},
		isOa: {
			type: Boolean,
			default: false
		},
		canEdit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			// form: this.$form.createForm(this, { name: "baseInfo" }),
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			optionList: [],
			disabledRelateOrder: false,
			signPlaceList: [],
			bankProductCodeList: [],
			assetTeamTraderList: [],
			linkOrderNo: null,
			linkContractNo: null,
			paperContractNo: null,
			// 卖方企业
			sellerData: [],
			contractPriceDisabled: false,
			contractSignTimeDevMax: false, //签订日期偏差较大时展示
			execDateDevMax: false, //合同有效期偏差较大时展示
			execDateLengthMax: false, //合同有效期偏差较大时展示
			doubleSignTimeDevMax: false, //双签合同日期偏差较大时展示
			execDateMatch: false, // 合同有效期和合同类型不匹配时展示
			contractTimeTypeList: filterCodeByKey('contractTermEnums'), //合同类型
			orderBusinessTypeDescMap: filterCodeByKey('orderBusinessTypeDescMap'), //业务类型
			collectionAccountInfo: [],
			upDownUserList: [],

			unit: '',

			isBusinessSource: false,

			priceShow: false,
			quantityShow: false,
			editDisabledNoCfca: false, //  非"合同签章"状态下的输出框
			editDisabledCfca: false, // 合同签章状态的输入框
			defaultInfo: {}, //记录默认数据，判断有无业务负责人字段
			selectContractList: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_CONTRACT_OTHER_DATA: 'VUEX_GET_CONTRACT_OTHER_DATA'
		}),
		relateOrderNoRequired() {
			return !this.VUEX_GET_CONTRACT_DATA.relateOrder;
		},
		signStatus() {
			if (this.isBuyContract) {
				return [{ value: 2, text: '双签' }];
			}
			return [
				{ value: 1, text: '单签' },
				{ value: 2, text: '双签' }
			];
		},
		titleDesc() {
			const titleDesc = {
				sell: '采购',
				buy: '销售'
			};
			if (this.$route.query?.type) {
				return `${titleDesc[this.$route.query?.type?.toLowerCase()]}`;
			}
			return `${titleDesc[this.orderType.toLowerCase()]}`;
		},
		//判断业务负责人是否禁用
		businessOwnerDisabled() {
			let disabled = false;
			//当以下情况是禁用(当前判断逻辑)
			if (this.isOa || this.editDisabledNoCfca) {
				disabled = true;
			}
			//如果数据为空（旧数据），允许编辑
			if (!this.defaultInfo?.businessOwnershipTeamConfig?.id) {
				disabled = false;
			}
			return disabled;
		}
	},
	watch: {
		VUEX_GET_CONTRACT_DATA: {
			handler(newVal) {
				if (!Object.keys(newVal).length) return;
				// this.initFormData();
			},
			deep: true,
			immediate: true
		}
	},
	components: {
		'relation-contract': RelationContract,
		ConfirmModal,
		SpecialInput
	},
	async mounted() {
		this.isBusinessSource = false;
		if (!this.isOa && !this.$route.query.id) {
			this.initFormData();
		}
		// 判断从业务线过来
		if (this.$route.query.linkOrderNo) {
			this.linkContractNo = this.$route.query.linkPaperContractNo || this.$route.query.linkContractNo;
			this.linkOrderNo = this.$route.query.linkOrderNo;
			this.isBusinessSource = true;
			this.selectContractList = [
				{
					contractNo: this.$route.query.linkContractNo,
					paperContractNo: this.$route.query.linkPaperContractNo,
					id: ''
				}
			];
			this.$nextTick(() => {
				this.form.setFieldsValue({
					linkContractNo: this.linkContractNo
				});
			});
		}
		// 判断从新增应收账款过来的
		if (this.$route.query.source == 'receivable') {
			const buyerName = this.$route.query.buyerName || undefined;
			this.getSellerList(buyerName);
			this.$nextTick(() => {
				this.form.setFieldsValue({
					buyerName
				});
			});
		}
		// 销售合同 编辑
		if (this.$route.query.id && this.$route.query.type === 'sell') {
			if (this.$route.query.whetherEditAllBoo === 'false') {
				this.editDisabledNoCfca = true;
				this.editDisabledCfca = true;
			}
			if (this.$route.query.whetherHaveRelAuditBoo === 'true') {
				this.editDisabledNoCfca = true;
			}
		}
	},
	beforeDestroy() {},
	methods: {
		getPopupContainer,
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA',
			VUEX_SET_FORM_SCHEMA_INIT: 'contract/VUEX_SET_FORM_SCHEMA_INIT',
			VUEX_SET_THYMELEAF_CONTENT: 'contract/VUEX_SET_THYMELEAF_CONTENT',
			VUEX_SET_TRANSPORT_MODE: 'contract/VUEX_SET_TRANSPORT_MODE',
			VUEX_SET_PRODUCTION_INDICATOR: 'contract/VUEX_SET_PRODUCTION_INDICATOR',
			VUE_SET_OPTIONS_LIST: 'contract/VUE_SET_OPTIONS_LIST',
			VUE_SET_THYMELEAF_COMMITMENT: 'contract/VUE_SET_THYMELEAF_COMMITMENT',
			VUE_SET_HTML_REPLACE_ATTR: 'contract/VUE_SET_HTML_REPLACE_ATTR',
			VUE_SET_FORM_LIST_SORT: 'contract/VUE_SET_FORM_LIST_SORT'
		}),
		handleSelect(e) {
			this.$emit('verifyBuyer');
			this.judgeFunc(e);
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		changePrice(val) {
			this.priceShow = false;
			if (val >= 1000) {
				this.priceShow = true;
			}
		},
		changePriceFocus(e) {
			const val = e.target.value;

			this.priceShow = false;
			if (val >= 1000) {
				this.priceShow = true;
			}
		},
		changeQuantityFocus(e) {
			const val = e.target.value;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		changeQuantity(val) {
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},

		// 初始化数据

		async init(info) {
			this.defaultInfo = { ...info };
			await this.getUpDownUserList();
			this.form.setFieldsValue(info);
			this.$nextTick(() => {
				this.form.setFieldsValue(info);
			});

			this.linkOrderNo = info.linkOrderNo;
			if (info.relatedContractReqList) {
				this.selectContractList = info.relatedContractReqList || [];
				this.selectContractList = this.selectContractList.map(el => {
					el.id = el.id || el.contractId;
					if (el.paperContractNo) {
						el.id = Number(el.id);
					}
					return {
						...el,
						contractNo: el.contractNo || el.relateContractNo
					};
				});
			} else {
				this.selectContractList = [];
			}

			this.linkContractNo = this.selectContractList.map(el => el.paperContractNo || el.contractNo).join(',');

			// relatedContractReqList
			const relateOrder = this.selectContractList.length ? true : false;

			if (this.isBuyContract) {
				await this.getSellerList(info.sellerName);
				this.form.setFieldsValue({
					buyerName: this.VUEX_ST_COMPANYSUER.companyName,
					execDate: [info.execDateStart, info.execDateEnd],
					businessOwnershipTeamConfigId: info?.businessOwnershipTeamConfig?.id,
					relateOrder: !relateOrder, //是否关联
					linkContractNo: this.linkContractNo
				});
			} else {
				await this.getSellerList(info.buyerName);
				await this.getCollectionAccount();

				this.form.setFieldsValue({
					sellerName: this.VUEX_ST_COMPANYSUER.companyName,
					relateOrder: !relateOrder, //是否关联
					businessOwnershipTeamConfigId: info?.businessOwnershipTeamConfig?.id,
					linkContractNo: this.linkContractNo
				});
				this.$nextTick(() => {
					let receivableBankAccountId = this.collectionAccountInfo.find(item => {
						return item.accountNo == info.receivableBankAccountNo;
					});
					if (receivableBankAccountId) {
						this.form.setFieldsValue({
							receivableBankAccountId: receivableBankAccountId.id || ''
						});
					}
				});
			}
		},

		initFormData() {
			return new Promise(async (resolve, reject) => {
				this.$emit('loading', true);
				await this.getUpDownUserList();

				if (this.isBuyContract) {
					this.form.setFieldsValue({
						buyerName: this.VUEX_ST_COMPANYSUER.companyName
					});
				} else {
					await this.getCollectionAccount();
					this.form.setFieldsValue({
						sellerName: this.VUEX_ST_COMPANYSUER.companyName
					});
				}
				this.$emit('loading', false);
				resolve(true);
			});
		},
		showRelationOrderList() {
			this.$refs.RelationContract.showRelationOrderList(this.selectContractList);
		},
		computeUnit(val) {
			if (val >= 1000 && val < 10000) {
				return '千';
			} else if (val > 10000 && val <= 100000) {
				return '万';
			} else if (val > 100000 && val <= 1000000) {
				return '十万';
			} else if (val > 1000000 && val <= 10000000) {
				return '百万';
			} else {
				return '百万';
			}
		},
		onChange(e) {
			const { checked } = e.target;

			this.selectContractList = [];
			if (checked) {
				this.disabledRelateOrder = true;
				this.linkOrderNo = '';
				this.linkContractNo = '';
				this.form.setFieldsValue({
					linkContractNo: null
				});
			} else {
				this.disabledRelateOrder = false;
				this.form.setFieldsValue({
					linkContractNo: null
				});
			}
		},
		getSelectContractNoList(list) {
			const linkContractNo = list.join(',') || null;

			this.selectContractList = this.selectContractList.filter(el => list.includes(el.paperContractNo || el.contractNo));

			this.linkContractNo = linkContractNo;
			this.form.setFieldsValue({
				linkContractNo: this.linkContractNo
			});
		},
		// 关联业务线

		getRelationOrderDetail(list) {
			this.selectContractList = list;
			this.linkContractNo = list.map(el => el.paperContractNo || el.contractNo).join(',');

			this.form.setFieldsValue({
				linkContractNo: this.linkContractNo
			});
		},
		// 获取卖方列表
		async getSellerList(data) {
			this.sellerData = null;
			const res = await API_GETOFFLINESELLERLIST({ searchKeys: data ? encodeURIComponent(data) : '' });
			this.sellerData = res.data;
		},
		changeContractNo(e) {
			if (e.target.value) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						paperContractNo: e.target.value.replace(/\s*/g, '')
					});
				});
			}
		},
		//合同编号校验
		async checkPaperContractNo(rule, value, callback) {
			let buyerUscc, sellerUscc;

			this.validateStatusContractNo();

			let name = this.form.getFieldValue('buyerName');

			let item = this.sellerData.find(el => el.name == name) || {};

			if (this.$route.query?.type == 'sell') {
				buyerUscc = item.bizLicenseNo; //买方企业社会统一信用代码

				sellerUscc = this.VUEX_ST_COMPANYSUER.companyUscc; //卖方企业社会统一信用代码

				if (buyerUscc && sellerUscc && value) {
					let res = await API_OFFLINESELLERORDEREXIST({
						buyerUscc,
						sellerUscc,
						paperContractNo: value,
						id: this.$route.query.id
					});
					if (res.success && res.data?.boo) {
						callback('合同编号重复请重新输入');
					} else {
						callback();
					}
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		//添加买卖双方校验装填
		validateStatusContractNo(err) {
			let errors = err ? [''] : undefined;
			this.$nextTick(() => {
				this.form.setFields({
					buyerName: {
						value: this.form.getFieldValue('buyerName'),
						errors
					}
				});
				this.form.setFields({
					sellerName: {
						value: this.form.getFieldValue('sellerName'),
						errors
					}
				});
			});
		},
		//监听表单值的变化
		onValuesChange(props, values) {
			// 合同签章状态发生变化
			if (values.hasOwnProperty('signStatus')) {
				this.$emit('signStatusChange');
			}
			//合同单价类型变化，清空单价
			if (values.hasOwnProperty('followTheMarket')) {
				this.contractPriceDisabled = values.followTheMarket;
				if (this.contractPriceDisabled) {
					this.form.setFieldsValue({
						contractPrice: ''
					});
				}
			}
			//合同数量单价变化
			if (values.hasOwnProperty('contractPrice') || values.hasOwnProperty('contractQuantity')) {
				this.$nextTick(() => {
					let contractAmount = '',
						contractPrice = Number(this.form.getFieldValue('contractPrice')),
						contractQuantity = Number(this.form.getFieldValue('contractQuantity'));
					if (contractPrice && contractQuantity) {
						contractAmount = (contractPrice * contractQuantity).toFixed(2);
					}
					this.form.setFieldsValue({
						contractAmount: contractAmount
					});
				});
			}
			//合同签订日期变化
			if (values.hasOwnProperty('contractSignTime')) {
				//当选择签订日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.contractSignTime).diff(moment(), 'days')) > 30) {
					this.contractSignTimeDevMax = true;
				} else {
					this.contractSignTimeDevMax = false;
				}
			}
			//合同有效期变化
			if (values.hasOwnProperty('execDate')) {
				//当选择签订日期与当前系统日期偏差大于60天时，提示
				if (
					Math.abs(moment(values.execDate[0]).diff(moment(), 'days')) > 30 ||
					Math.abs(moment(values.execDate[1]).diff(moment(), 'days')) > 30
				) {
					this.execDateDevMax = true;
				} else {
					this.execDateDevMax = false;
				}
				if (moment(values.execDate[1]).diff(moment(values.execDate[0]), 'days') > 60) {
					this.execDateLengthMax = true;
				} else {
					this.execDateLengthMax = false;
				}
				/** 交货期限 大于31 */
				if (moment(values.execDate[1]).diff(moment(values.execDate[0]), 'days') > 31) {
					this.form.setFieldsValue({ contractTermType: 'LONG_TERM_CONTRACT' });
				} else {
					this.form.setFieldsValue({ contractTermType: 'MONTHLY_CONTRACT' });
				}

				// 合同有效期发生变化，校验和合同类型是否匹配
				if (this.form.getFieldValue('contractTermType')) {
					this.judgeExecDate(values.execDate, 'execDate');
				}
			}
			//合同双签日期变化
			if (values.hasOwnProperty('doubleSignTime')) {
				//当选择签订日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.doubleSignTime).diff(moment(), 'days')) > 30) {
					this.doubleSignTimeDevMax = true;
				} else {
					this.doubleSignTimeDevMax = false;
				}
			}
			//买卖方发生变化，重新检验合同编号
			if (values.hasOwnProperty('buyerBizNo') || values.hasOwnProperty('sellerBizNo')) {
				this.$nextTick(() => {
					//如果有合同编号，重新校验
					if (this.form.getFieldValue('paperContractNo')) {
						this.form.validateFields(['paperContractNo'], () => {});
					}
				});
			}
			// 合同类型发生变化，校验和合同有效期是否匹配
			if (values.hasOwnProperty('contractTermType')) {
				if (this.form.getFieldValue('execDate')) {
					this.judgeExecDate(values.contractTermType, 'contractTermType');
				}
			}
		},
		//合同单价控制
		judgeQuantity2(rule, value, callback) {
			var regu = /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/;
			if (value !== '' && value != null) {
				if (!regu.test(value)) {
					callback('输入数字范围0~9999.99,最多三位小数');
				}
			}
			callback();
		},
		//合同数量控制
		judgeQuantity(rule, value, callback) {
			var regu = /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/;
			if (value !== '' && value != null) {
				if (!regu.test(value)) {
					callback('输入数字范围0~9999999999.999,最多三位小数');
				}
			}
			callback();
		},
		// 判断合同类型和合同有效期是否匹配
		judgeExecDate(value, type) {
			let contractTermType = type === 'contractTermType' ? value : this.form.getFieldValue('contractTermType');
			let execDate = type === 'execDate' ? value : this.form.getFieldValue('execDate');
			let rangeDays = Math.abs(moment(execDate[1]).diff(moment(execDate[0]), 'days'));
			//如“合同有效期”选则日期区间天数大于一个月（31天），但“合同类型”选择“月度合同”时，提示
			//如“合同有效期”选则日期区间天数小于等于一个月（31天），但“合同类型”选择“长协合同”时，提示
			if (contractTermType === 'LONG_TERM_CONTRACT' && rangeDays <= 31) {
				this.execDateMatch = true;
				this.execDateMatchText = '合同有效期未超过31天，请确认合同类型是否为长协合同；如果正确，请忽略提示。';
			} else if (contractTermType === 'MONTHLY_CONTRACT' && rangeDays > 31) {
				this.execDateMatch = true;
				this.execDateMatchText = '合同有效期超过31天，请确认合同类型是否为月度合同；如果正确，请忽略提示。';
			} else {
				this.execDateMatch = false;
				this.execDateMatchText = '';
			}
		},
		//回款账户
		async getCollectionAccount() {
			// 获取回款账户
			await API_COMPANYACCOUNTLIST({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc
			}).then(res => {
				if (res.success) {
					this.collectionAccountInfo = res.data;
				}
			});
		},
		// 获取上下游业务负责人
		async getUpDownUserList() {
			const res = await API_listTerminalDirector();
			this.upDownUserList = res.data;
		},
		save() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						if (this.isBuyContract) {
							let companyInfo =
								this.sellerData.find(item => {
									return item.name === values.sellerName;
								}) || {};

							values.buyerBizNo = this.VUEX_ST_COMPANYSUER.companyUscc;
							values.sellerBizNo = companyInfo.bizLicenseNo;
						} else {
							let companyInfo =
								this.sellerData.find(item => {
									return item.name === values.buyerName;
								}) || {};

							values.sellerBizNo = this.VUEX_ST_COMPANYSUER.companyUscc;
							values.buyerBizNo = companyInfo.bizLicenseNo;
						}
						if (values.execDate) {
							values.execDateStart = values.execDate[0];
							values.execDateEnd = values.execDate[1];
						}

						values.linkOrderNo = this.linkOrderNo || null;

						values.relatedContractReqList = this.selectContractList.map(el => {
							return {
								relateContractNo: el.contractNo,
								onlineFlag: el.paperContractNo ? false : true
							};
						});

						// 回款账号
						let receivableBank = this.collectionAccountInfo.find(item => item.id == values.receivableBankAccountId);

						if (!this.isBuyContract && receivableBank) {
							values.receivableAccountNo = receivableBank.accountNo; //回款账号
							values.receivableAccountName = receivableBank.accountName; //回款账户名称
							values.receivableAccountBank = receivableBank.subbranchName; //回款银行支行名称
						}

						resolve(values);
					} else {
						resolve(false);
					}
				});
			});
		},
		changeSignStatus() {
			let receivableBankAccountId = this.form.getFieldValue('receivableBankAccountId');
			this.$nextTick(() => {
				this.form.setFieldsValue({
					receivableBankAccountId
				});
			});
		},
		judgeFunc(name) {
			let companyInfo =
				this.sellerData.find(item => {
					return item.name === name;
				}) || {};
			API_validCompanyIsInRiskBlack({
				companyUscc: companyInfo.bizLicenseNo
			}).then(res => {
				if (res.success && res.result) {
					const modalObj = {
						modalTitle: '提示',
						modalText: res.result
					};
					this.$refs.confirmModal.showModal(modalObj);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-checkbox-wrapper {
	height: 32px;
	line-height: 32px;
}
.relation-order {
	/deep/ .ant-form-item-control {
		text-align: right;
	}
	/deep/ .ant-checkbox-wrapper {
		span:nth-child(2) {
			padding-right: 0;
		}
	}
	/deep/ .ant-form-explain {
		text-align: left;
	}
}
.ant-col {
	height: 82px;
	// margin-bottom: 10px
}
.col-height.ant-col {
	height: inherit;
}
.col-height2.ant-col {
	height: 120px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
#thymeleaf-content {
	width: 0;
	height: 0;
	display: none;
}
.df {
	display: flex;
	align-items: center;
}
.symbol {
	background: #f3f5f6;
	border: 1px solid #e5e6eb;
	border-radius: 0px 4px 4px 0px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.quantity-offset {
	border-right: 0;
	border-radius: 4px 0px 0 4px;
}
.quantity-box {
	/deep/ .ant-form-item-label {
		opacity: 0;
	}
}
.marginBottom0 {
	margin-bottom: 0;
	min-height: 64px;
}
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}
.h_auto {
	height: auto !important;
}
</style>
