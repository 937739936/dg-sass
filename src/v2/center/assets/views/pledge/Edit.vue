<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div class="methods-wrap">
				<span
					v-if="$route.query.id"
					slot="title"
					class="slTitle"
					>编辑货押资产</span
				>
				<span
					v-else
					slot="title"
					class="slTitle"
					>新增货押资产</span
				>
			</div>
			<a-form
				:form="baseForm"
				:label-col="{ span: 9 }"
				:wrapper-col="{ span: 13 }"
			>
				<div class="bottom-box">
					<div class="s-card-content">
						<h2>基本信息</h2>
						<a-row>
							<a-col span="12">
								<a-form-item label="货押资产编号">
									<span v-if="detailData.receivalVO">{{ detailData.receivalVO.serialNo }}</span>
									<span v-else>-</span>
								</a-form-item>
							</a-col>
						</a-row>
						<a-row class="row">
							<a-col span="12">
								<a-row>
									<a-form-item label="行业">
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
									<a-form-item label="仓库名称">
										<a-select
											showSearch
											:filterOption="false"
											:defaultActiveFirstOption="false"
											@change="clearGoods"
											placeholder="请选择仓库名称"
											v-decorator="[
												`storageNo`,
												{
													rules: [{ required: true, message: `仓库名称必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in storageList"
												:key="index"
												:value="item.serialNo"
											>
												{{ item.name }}
											</a-select-option>
										</a-select>
										<a-tooltip>
											<template slot="title"> 修改仓库需要重新选择仓单，请谨慎操作 </template>
											<a-icon
												type="exclamation-circle"
												style="margin-left: 5px"
											/>
										</a-tooltip>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="资金类型">
										<a-select
											showSearch
											:filterOption="false"
											:defaultActiveFirstOption="false"
											placeholder="请选择资金类型"
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
									<a-form-item label="质押单价计算规则">
										<a-select
											placeholder="请选择质押单价计算规则"
											@change="clearGoods"
											v-decorator="[
												`calculateType`,
												{
													rules: [{ required: true, message: `质押单价计算规则必填` }]
												}
											]"
										>
											<a-select-option value="CECI">CECI价格指数</a-select-option>
											<a-select-option value="TERMINAL_PRICE">下游合同单价</a-select-option>
										</a-select>
										<a-tooltip>
											<template slot="title"> 修改计价规则需要重新选择仓单，请谨慎操作 </template>
											<a-icon
												type="exclamation-circle"
												style="margin-left: 5px"
											/>
										</a-tooltip>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="质押货值（元）">
										{{ totalGoObj.p }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="状态">
										<span v-if="detailData.receivalVO">{{
											filterCodeByValueName(detailData.receivalVO.status, 'receivableStatusDict')
										}}</span>
										<span v-else>待提交</span>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="货主名称">
										{{ VUEX_ST_COMPANYSUER.companyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓储企业">
										{{ getStoreObj(baseForm.getFieldValue('storageNo')).companyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="金融机构">
										{{ getBankObj(baseForm.getFieldValue('paymentType')).bankName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="质押数量（吨）">
										{{ totalGoObj.q }}
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item
										label="拟融资金额（元）"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 10 }"
									>
										<a-input
											placeholder="请输入拟融资金额（元）"
											v-decorator="[
												`planFinancingAmount`,
												{
													rules: [
														{ required: true, message: `拟融资金额必填` },
														{ pattern: numberReg, message: '请输入数字，最多两位小数' }
													]
												}
											]"
										>
										</a-input>
										<a @click="cesuan"> 测算</a>
										<a-tooltip>
											<template slot="title"> 拟融资金额≤ min【质押货值*质押率、应收账款金额*应收账款融资比例】 </template>
											<a-icon
												type="exclamation-circle"
												style="margin-left: 5px"
											/>
										</a-tooltip>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="应收账款申请日期">
										<span v-if="detailData.receivalVO">{{ detailData.receivalVO.requestTime }}</span>
										<span v-else>{{ moment().format('YYYY-MM-DD HH:mm:ss') }}</span>
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>
				<div class="bottom-box">
					<div class="s-card-content">
						<h2>下游合同信息</h2>
						<a-row>
							<a-col span="12">
								<a-form-item
									label="合同信息"
									:colon="false"
								></a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-form-item label="卖方名称">
									<span>{{ VUEX_ST_COMPANYSUER.companyName }}</span>
								</a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-row>
									<a-form-item label="买方名称">
										<a-select
											show-search
											placeholder="请输入买方名称"
											style="width: 100%"
											:filter-option="false"
											:default-active-first-option="false"
											@search="getCompanyInfo"
											v-decorator="[
												'buyerBizNo',
												{
													rules: [{ required: true, message: '买方名称必填' }]
												}
											]"
										>
											<a-select-option
												v-for="item in companyList"
												:key="item.name"
												:value="item.creditCode"
											>
												{{ item.name }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同编号">
										<a-input
											placeholder="请输入合同编号"
											:maxLength="50"
											@blur="checkContractNo"
											:disabled="!baseForm.getFieldValue('buyerBizNo')"
											v-decorator="[
												`paperContractNo`,
												{
													rules: [{ required: true, message: `合同编号必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item label="合同签订状态">
										<a-select
											placeholder="请选择合同签订状态"
											v-decorator="[
												`status`,
												{
													rules: [{ required: true, message: `合同签订状态必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in [
													{ text: '双签', value: 2 },
													{ text: '单签', value: 1 }
												]"
												:key="index"
												:value="item.value"
											>
												{{ item.text }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同执行期">
										<a-range-picker
											@change="changeBeginDate"
											:disabled-date="disabledDateExec"
											v-decorator="[
												`execDateStart`,
												{
													rules: [{ required: true, message: `合同执行期必填` }],
													validateTrigger: 'change'
												}
											]"
										></a-range-picker>
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item label="合同数量（吨）">
										<a-input
											placeholder="请输入合同数量"
											v-decorator="[
												`quantity`,
												{
													rules: [{ required: true, message: `合同数量必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="标的货物名称">
										<a-input
											placeholder="请输入标的货物名称"
											v-decorator="[
												`goodsName`,
												{
													rules: [{ required: true, message: `标的货物名称必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="热力值标准（Kcal/kg）">
										<a-input
											placeholder="请输入热力值标准（Kcal/kg）"
											v-decorator="[
												`calorificValue`,
												{
													rules: [
														{ required: true, message: `热力值标准必填` },
														{ pattern: numberReg, message: '请输入数字，最多两位小数' },
														{
															validator: (rule, value, callback) => {
																if (Number(value) < 1000 || Number(value) > 7500) {
																	callback('请输入数字，1000-7500');
																} else {
																	callback();
																}
															}
														}
													]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="买方企业信用代码">
										{{ getBuyerBizNoObj(baseForm.getFieldValue('buyerBizNo')).buyerBizNo }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同名称">
										<a-input
											placeholder="请输入合同名称"
											:maxLength="50"
											v-decorator="[
												`contractName`,
												{
													rules: [{ required: true, message: `合同名称必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="签订日期">
										<a-date-picker
											:disabled-date="disabledDate"
											v-decorator="[
												`contractSignTime`,
												{
													rules: [{ required: true, message: `签订日期必填` }],
													validateTrigger: 'change'
												}
											]"
										></a-date-picker>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同单价（元/吨）">
										<a-input
											placeholder="请输入合同单价"
											@change="clearGoods"
											v-decorator="[
												`price`,
												{
													rules: [
														{ required: true, message: `合同单价必填` },
														{ pattern: numberReg, message: '请输入数字，最多两位小数' }
													]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同总价（元）">
										{{ (baseForm.getFieldValue('price') || 0) * (baseForm.getFieldValue('quantity') || 0) || '' }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="交货港">
										<a-input
											placeholder="请输入交货港"
											:maxLength="50"
											v-decorator="[
												`deliveryPlace`,
												{
													rules: [{ required: true, message: `交货港必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="交货方式">
										<a-select
											placeholder="请选择交货方式"
											v-decorator="[
												`deliveryMode`,
												{
													rules: [{ required: true, message: `交货方式必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in [
													{ text: '车板场地交货', value: 'VEHICLE_BOARD' },
													{ text: '平仓交货', value: 'FLAT_WAREHOUSE' },
													{ text: '离岸平仓', value: 'OFFSHORE_CLOSING' },
													{ text: '到岸舱底', value: 'BILGE_DELIVERY' },
													{ text: '铁路直达', value: 'RAILWAY' }
												]"
												:key="index"
												:value="item.value"
											>
												{{ item.text }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
						<a-row v-if="baseForm.getFieldValue('deliveryMode') == 'VEHICLE_BOARD'">
							<a-col span="12">
								<a-row>
									<a-form-item label="发站车次">
										<a-input
											:maxLength="50"
											placeholder="请输入发站车次"
											v-decorator="[
												`deliveryNo`,
												{
													rules: [{ required: true, message: `发站车次必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="垛位">
										<a-input
											placeholder="请输入垛位"
											:maxLength="50"
											v-decorator="[
												`stackingPosition`,
												{
													rules: [{ required: true, message: `垛位必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="发站地">
										<a-input
											placeholder="请输入发站地"
											:maxLength="50"
											v-decorator="[
												`deliveryStation`,
												{
													rules: [{ required: true, message: `发站地必填` }]
												}
											]"
										>
										</a-input>
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-form-item
									label="应收账款信息"
									:colon="false"
								></a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-row>
									<a-form-item label="应收账款金额（元）">
										{{ (baseForm.getFieldValue('price') || 0) * (baseForm.getFieldValue('quantity') || 0) || '' }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="应收账款起始日期">
										<a-date-picker
											:disabled-date="disabledDateBegin"
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
							<a-col span="12">
								<a-row style="opacity: 0">
									<a-form-item label=" "> </a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="应收账款到期日期">
										{{ getEndDateObj(baseForm.getFieldValue('beginDate')) }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>
			</a-form>
			<div class="s-card-content">
				<h2>资产信息</h2>
				<a-button
					type="primary"
					v-show="checkGoodBtn()"
					style="float: right; margin-bottom: 10px; position: relative; z-index: 2"
					@click="openGoodsModal"
					>选择仓单信息</a-button
				>
				<a-table
					:columns="goodsColumn"
					:dataSource="goodsDataSource"
					:pagination="false"
					rowKey="id"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
					<template
						slot="thisPledgeQuantity"
						slot-scope="text, record, index"
					>
						<a-input-number
							v-model="record.thisPledgeQuantity"
							@change="calcNum(record, index)"
							:precision="2"
						></a-input-number>
					</template>
					<template
						slot="action"
						slot-scope="text, record, index"
					>
						<a-popconfirm
							title="确定删除?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteGItem(index, record)"
						>
							<a href="javascript:;">删除</a>
						</a-popconfirm>
					</template>
				</a-table>
				<h2 style="margin-top: 30px">仓单详情信息</h2>
				<div class="goods-container">
					<a-tabs
						:defaultActiveKey="0"
						v-show="goodsDataSource.length"
					>
						<a-tab-pane
							:tab="item.number"
							:key="index"
							v-for="(item, index) in goodsDataSource"
						>
							<InOutDetail
								:iid="item.id.toString()"
								ppageType="in"
								aactiveIndex="0"
							/>
						</a-tab-pane>
					</a-tabs>
				</div>
			</div>
			<div class="s-card-content">
				<h2>附件信息</h2>
				<Upload
					@uploadFiles="getUploadFiles"
					type="TERMINAL_CONTRACT"
					btnText="上传下游合同"
					styleType="new"
				></Upload>
				<!-- <Upload @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT_SUPPLEMENT" btnText="上传补充文档"></Upload> -->
				<SupplementUpload
					@uploadFiles="getUploadFilesSupplment"
					type="7"
					btnText="上传补充协议"
				/>
				<Upload
					@uploadFiles="getUploadFiles"
					type="TERMINAL_CONTRACT_OTHER_MATERIALS"
					btnText="上传其他材料"
					styleType="new"
				></Upload>

				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				<!-- 附件展示 -->
				<a-table
					bordered
					v-if="fileListDataSource.length || (!fileListDataSource.length && !supplementalInfo.length)"
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="name"
						slot-scope="name, items"
					>
						<a
							:href="items.path"
							target="_blank"
							>{{ name }}</a
						>
					</template>
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） 删除按钮应隐藏-->
					<template
						slot="action"
						slot-scope="action, items, index"
					>
						<a-popconfirm
							v-if="!items.locked"
							title="确定删除该附件?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteFiles(items, index)"
						>
							<a href="javascript:;">删除</a>
						</a-popconfirm>
					</template>
				</a-table>

				<a-table
					v-if="supplementalInfo.length"
					bordered
					:dataSource="supplementalInfo"
					:columns="supplementalColumns"
					:rowKey="record => record.index"
					:pagination="false"
					:scroll="{ x: true }"
					style="margin-top: 20px"
				>
					<template
						slot="changeItem"
						slot-scope="text, record"
						v-if="record.changeItem"
					>
						<span
							v-for="(item, index) in record.changeItem.split(',')"
							:key="index"
						>
							{{ filterCodeByValueName(item, 'changeItemEnums') }}
							<span v-if="index < record.changeItem.split(',').length - 1">、</span>
						</span>
					</template>
					<template
						slot="executionDate"
						slot-scope="text, record"
					>
						{{ record.executionDateStart }}
						<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
					</template>
					<template
						slot="name"
						slot-scope="text, record"
					>
						<a
							v-for="(item, index) in record.supplementalFile"
							:key="index"
							class="edit-btn"
							:href="item.url"
							target="_blank"
						>
							{{ item.name }}
							<span v-if="index < record.supplementalFile.length - 1">,</span>
						</a>
					</template>
					<template
						slot="transferName"
						slot-scope="text, record"
					>
						<span
							v-for="(item, index) in record.supplementalFile"
							:key="index"
							class="edit-btn"
						>
							{{ item.transferName || '-' }}
							<span v-if="index < record.supplementalFile.length - 1 && item.transferName">,</span>
						</span>
					</template>
					<template
						slot="operation"
						slot-scope="operation, record, index"
					>
						<a-space>
							<a-popconfirm
								title="确定删除该附件信息?"
								okText="确定"
								cancelText="取消"
								@confirm="() => deleteSupplementFiles(record, index)"
							>
								<a
									href="javascript:;"
									class="delete-btn"
									>删除</a
								>
							</a-popconfirm>
						</a-space>
					</template>
				</a-table>
			</div>
			<ChooseGoods
				ref="ChooseGoods"
				@chooseFinGoods="chooseFinGoods"
			/>
			<div class="btn-box">
				<div class="btn-wrap">
					<a-button
						@click="$router.back()"
						type="primary"
						ghost
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit('1')"
						>保存</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit('2')"
						>提交</a-button
					>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_GetAssetsPledgeDetail,
	API_GetAccountsPledgecheckContract,
	API_AssetsGoodsSave,
	API_AssetsWareList,
	API_AssetsPledgeBankPro,
	API_GetCompanyName
} from '@/v2/center/assets/api/index.js';
import _ from 'lodash';
import moment from 'moment';
import Upload from '@/v2/center/assets/components/common/Upload.vue';
import InOutDetail from '@/views/center/pledge/cargoManage/InOutDetail.vue';
import ChooseGoods from '@/v2/center/assets/components/common/ChooseGoods.vue';
import { mapGetters } from 'vuex';
import SupplementUpload from '@/v2/center/assets/components/common/SupplementUpload.vue';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	data() {
		return {
			moment,
			baseForm: this.$form.createForm(this),
			numberReg: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
			filterCodeByValueName: filterCodeByValueName,
			detailData: {}, // 详情数据
			bankList: [],
			bankName: '',
			endDate: '',
			execDateObj: {},
			companyList: [],
			goodsDataSource: [],
			totalGoObj: {},
			goodsColumn: [
				{ title: '编号', dataIndex: 'number', key: 'number', fixed: 'left' },
				{ title: '货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '存储地址', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '单价（元/吨）', dataIndex: 'thisPledgePrice', key: 'thisPledgePrice' },
				{ title: '货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods' },
				{ title: '已质押（吨）', dataIndex: 'hasPledgeQuantity', key: 'hasPledgeQuantity' },
				{ title: '可质押（吨）', dataIndex: 'canPledgeQuantity', key: 'canPledgeQuantity' },
				{
					title: '本次质押（吨）',
					dataIndex: 'thisPledgeQuantity',
					key: 'thisPledgeQuantity',
					scopedSlots: { customRender: 'thisPledgeQuantity' }
				},
				{
					title: '本次质押货值（元）',
					dataIndex: 'thisPledgeGoods',
					key: 'thisPledgeGoods',
					customRender: (a, r) => {
						return (r.thisPledgeQuantity * r.thisPledgePrice).toFixed(2);
					}
				},
				{ title: '资产类型', dataIndex: 'assetType', key: 'assetType' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{
					title: '单据类型',
					dataIndex: 'type',
					key: 'type',
					customRender: (text, row) => {
						let typeName = this.CONSTANTS.fileType[text];
						return {
							children: `${typeName}`,
							attrs: {
								rowSpan: row.typeRowSpan
							}
						};
					}
				},
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			fileListDataSource: [],
			storageList: [],
			supplementalInfo: [], // 下游补充协议附件
			supplementalColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : text == '2' ? '双签' : '';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				},
				{
					title: '操作',
					dataIndex: 'operation',
					align: 'center',
					width: 150,
					fixed: 'right',
					scopedSlots: { customRender: 'operation' }
				}
			]
		};
	},
	components: {
		Upload,
		InOutDetail,
		ChooseGoods,
		SupplementUpload,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		})
	},
	watch: {
		goodsDataSource: {
			handler(v) {
				let p = 0,
					q = 0;
				v.forEach(item => {
					p = p + Number(item.thisPledgeGoods);

					q = q + Number(item.thisPledgeQuantity);
				});
				this.totalGoObj = {
					q: q.toFixed(2),
					p: p.toFixed(2)
				};
			},
			deep: true
		}
	},
	mounted: async function () {
		await API_AssetsWareList().then(res => {
			this.storageList = res.data || [];
		});
		await API_AssetsPledgeBankPro().then(res => {
			this.bankList = res.data || [];
		});

		if (this.$route.query.edit) {
			await API_GetAssetsPledgeDetail({ id: this.$route.query.id }).then(async res => {
				if (res.success) {
					this.detailData = res.data;
					this.initEditTerminalContractData();

					this.baseForm.setFieldsValue({
						...this.detailData.receivalVO,
						beginDate: moment(this.detailData.receivalVO.beginDate)
					});
					this.goodsDataSource = this.detailData.pledgeInboundList || [];
				}
			});
		}
	},
	methods: {
		async initEditTerminalContractData() {
			await this.getCompanyInfo(this.detailData.pledgeTerminalContract.buyerBizNo);

			this.baseForm.setFieldsValue({
				...this.detailData.pledgeTerminalContract,
				...this.detailData.pledgeTerminalContract.pledgeGoodsList[0],
				status: this.detailData.pledgeTerminalContract.status,
				buyerBizNo: this.detailData.pledgeTerminalContract.buyerName,
				contractSignTime: moment(this.detailData.pledgeTerminalContract),
				execDateStart: [
					moment(this.detailData.pledgeTerminalContract.execDateStart),
					moment(this.detailData.pledgeTerminalContract.execDateEnd)
				]
			});
			setTimeout(() => {
				this.baseForm.setFieldsValue({
					deliveryNo: this.detailData.pledgeTerminalContract.deliveryNo,
					stackingPosition: this.detailData.pledgeTerminalContract.stackingPosition,
					deliveryStation: this.detailData.pledgeTerminalContract.deliveryStation
				});
				this.changeBeginDate(null, [
					this.detailData.pledgeTerminalContract.execDateStart,
					this.detailData.pledgeTerminalContract.execDateEnd
				]);
			});

			this.fileListDataSource = TableRowSpanFunc(this.detailData.pledgeTerminalContract.list || [], 'type');
			this.supplementalInfo = this.detailData.pledgeTerminalContract.supplementalInfo || [];
		},
		getStoreObj(no) {
			var cur = _.find(this.storageList, { serialNo: no });

			if (!cur) return {};
			return (this.curStoreObj = {
				companyName: cur.storageCompanyName,
				companyUscc: cur.storageCompanyUscc,
				storageName: cur.name,
				storageId: cur.id
			});
		},
		getBankObj(type) {
			var cur = _.find(this.bankList, { paymentType: type });

			if (!cur) return {};
			let obj = {
				bankName: cur.bankName,
				paymentTypeName: cur.name
			};
			cur.id = null;
			this.curBankObj = {
				...cur,
				...obj
			};
			return this.curBankObj;
		},
		getBuyerBizNoObj(code) {
			var cur = _.find(this.companyList, { creditCode: code });
			if (!cur) {
				cur = _.find(this.companyList, { name: code });
			}

			if (!cur) return {};
			let obj = {
				buyerName: cur.name,
				buyerBizNo: cur.creditCode
			};
			cur.id = null;
			this.curBuyBizNoobj = {
				...cur,
				...obj
			};
			return this.curBuyBizNoobj;
		},
		getEndDateObj(start) {
			if (this.curBankObj && start) {
				this.curEndDateObj = moment(start)
					.add(this.curBankObj.receivableDeadline, this.curBankObj.receivableDeadlineUnit)
					.format('YYYY-MM-DD');
				return this.curEndDateObj;
			}

			return null;
		},

		getCompanyInfo(v) {
			// 获取公司社会代码
			if (!v) {
				return;
			}
			API_GetCompanyName({ name: v }).then(res => {
				if (res.success) {
					setTimeout(() => {
						this.companyList = (res.data || []).filter(item => item.creditCode);
					}, 50);
				}
			});
		},
		openGoodsModal() {
			if (this.curStoreObj) {
				this.$refs.ChooseGoods.showAss(
					this.goodsDataSource,
					this.baseForm.getFieldValue('storageNo'),
					this.baseForm.getFieldValue('calculateType'),
					this.baseForm.getFieldValue('price'),
					this.curStoreObj.storageId
				);
			}
		},
		chooseFinGoods(r) {
			this.goodsDataSource = r;
		},
		deleteGItem(index, record) {
			this.goodsDataSource.splice(_.findIndex(this.goodsDataSource, { id: record.id }), 1);
			// this.selectedRows.splice(_.findIndex(this.selectedRows,{id:record.id}),1)
		},
		calcNum(record, index) {
			record.thisPledgeGoods = record.thisPledgeQuantity * record.thisPledgePrice;
		},
		checkGoodBtn() {
			if (this.baseForm.getFieldValue('calculateType') == 'CECI') {
				return this.baseForm.getFieldValue('storageNo') ? true : false;
			}
			if (this.baseForm.getFieldValue('calculateType') == 'TERMINAL_PRICE') {
				return this.baseForm.getFieldValue('storageNo') && this.baseForm.getFieldValue('price') ? true : false;
			}
			return false;
		},

		changeBeginDate(value, dateString) {
			this.execDateObj.execDateStart = dateString[0];
			this.execDateObj.execDateEnd = dateString[1];
		},
		disabledDateBegin(current) {
			if (this.execDateObj.execDateStart) {
				return current && current <= moment(this.execDateObj.execDateStart).startOf('day');
			}
			return false;
		},
		disabledDateExec(current) {
			if (this.baseForm.getFieldValue('contractSignTime')) {
				return current && current <= this.baseForm.getFieldValue('contractSignTime').startOf('day');
			}
			return false;
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.fileListDataSource.push(item);
			});
			this.fileListDataSource = TableRowSpanFunc(this.fileListDataSource || [], 'type');
		},
		deleteFiles(items, _index) {
			// 删除附件

			this.fileListDataSource[_index].delFlag = 1;
			this.$forceUpdate();
			this.fileListDataSource = TableRowSpanFunc(this.fileListDataSource || [], 'type');
		},
		getUploadFilesSupplment(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.supplementalInfo.push(item);
			});
		},
		deleteSupplementFiles(items, index) {
			// 删除补协附件
			this.supplementalInfo.splice(index, 1);
		},
		cesuan() {
			if (
				this.curBankObj &&
				this.baseForm.getFieldValue('price') &&
				this.baseForm.getFieldValue('quantity') &&
				this.totalGoObj.p
			) {
				var y =
					(this.baseForm.getFieldValue('price') || 0) *
					(this.baseForm.getFieldValue('quantity') || 0) *
					this.curBankObj.financeScale *
					1;
				var z = this.totalGoObj.p * this.curBankObj.pledgeRate * 1;
				this.baseForm.setFieldsValue({
					planFinancingAmount: Math.min(y, z).toFixed(2)
				});
			} else {
				this.$message.info('请输入资金类型，单价，数量，质押数量才能正确测算');
			}
		},
		clearGoods() {
			this.goodsDataSource = [];
		},
		checkContractNo(e) {
			// 编辑状态下
			if (this.$route.query.edit) {
				return;
			}
			let v = e.target.value;
			let uscc = this.baseForm.getFieldValue('buyerBizNo');
			API_GetAccountsPledgecheckContract({ paperContractNo: v, buyerUscc: uscc }).then(res => {
				if (res.success && res.data) {
					this.$message.info('该合同已在平台存在，将复用原合同信息');

					this.detailData.pledgeTerminalContract = res.data.pledgeTerminalContract;
					this.initEditTerminalContractData();
				}
			});
		},
		onSubmit(type) {
			this.baseForm.validateFields((error, values) => {
				if (!error) {
					if (this.totalGoObj.q == 0) {
						this.$message.error('请填写质押数量');
						return;
					}
					var v = {
						...values,
						...this.curBankObj,
						...this.curBuyBizNoobj,
						...this.curStoreObj,
						execDateStart: this.execDateObj.execDateStart,
						execDateEnd: this.execDateObj.execDateEnd,
						beginDate: values.beginDate.format('YYYY-MM-DD'),
						endDate: this.curEndDateObj,
						contractSignTime: values.contractSignTime.format('YYYY-MM-DD')
					};
					const obj = {
						pledgeAssetReceivable: {
							...v,
							id: this.$route.query.id || null,
							status: this.detailData.receivalVO ? this.detailData.receivalVO.status : null
						},
						pledgeTerminalContract: {
							...v,
							list: this.fileListDataSource,
							supplementalInfo: this.supplementalInfo,
							pledgeGoodsList: [
								{
									goodsName: v.goodsName,
									price: v.price,
									quantity: v.quantity
								}
							],
							status: values.status,
							id: this.detailData.pledgeTerminalContract ? this.detailData.pledgeTerminalContract.id : null
						},
						pledgeInboundList: this.goodsDataSource.map(i => {
							return {
								serialNo: i.serialNo,
								thisPledgeQuantity: i.thisPledgeQuantity
							};
						}),
						submitType: type
					};
					this.doSubmit(obj);
				}
			});
		},

		doSubmit(obj) {
			if (obj) {
				API_AssetsGoodsSave(obj).then(res => {
					if (res.success) {
						this.$message.success('操作成功');
						this.$router.back();
					}
				});
			}
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
.s-card-content > h2 {
	font-family: PingFangSC-Medium;
	padding-left: 16px;
	text-align: left;
	line-height: 40px !important;
	font-size: 15px;
	height: 40px;
	background-color: rgba(0, 83, 219, 0.15);
}
.goods-container ::v-deep .inout-content {
	margin: 0 !important;
	.backbtn {
		display: none;
	}
	.top-box {
		box-shadow: none;
	}
	.s-card-content {
		margin: 0 !important;
	}
	.s-card-title {
		border: none !important;
		font-size: 14px;
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
</style>
