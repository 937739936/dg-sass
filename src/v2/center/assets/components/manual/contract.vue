<template>
	<div class="contentBox">
		<!-- 下游 -->
		<div class="downstreamBox">
			<div class="title">
				下游合同信息<span
					class="redTips"
					v-if="editFlag"
					>必须存在附件</span
				>
			</div>
			<div class="divider"></div>
			<div
				class="content"
				v-if="contractInfo"
			>
				<div
					style="text-align: right"
					v-if="showEditorRadio"
				>
					编辑合同
					<a-radio-group v-model="manualContractEdit">
						<a-radio :value="false"> 是 </a-radio>
						<a-radio :value="true"> 否 </a-radio>
					</a-radio-group>
				</div>
				<div>
					<p class="sub-title">基本信息</p>
					<!-- 下游基本信息编辑模块 -->
					<template v-if="editFlag">
						<a-form-model
							ref="baseInfoForm"
							:model="baseInfoForm"
							:rules="baseInfoRules"
						>
							<a-row>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										label="卖方名称"
										:colon="false"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										{{ contractInfo.sellerName || VUEX_ST_COMPANYSUER.companyName }}
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										label="买方名称"
										:colon="false"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										{{ VUEX_MANUAL_ASSET_OBJ.buyerName }}
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										ref="paperContractNo"
										label="合同编号"
										prop="paperContractNo"
										:colon="false"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-input
											@blur="checkContractNo"
											v-model.trim="baseInfoForm.paperContractNo"
											:disabled="
												VUEX_MANUAL_ASSET_OBJ.disableCopy ||
												(VUEX_MANUAL_ASSET_OBJ.buyerName ? false : true) ||
												manualContractEdit ||
												contractInfo.whetherEditAllBoo === false
											"
											placeholder="请输入合同编号"
											:maxLength="50"
										/>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										ref="contractSignTime"
										label="合同签订日期"
										prop="contractSignTime"
										:colon="false"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-date-picker
											:disabled-date="disabledDate"
											:disabled="
												VUEX_MANUAL_ASSET_OBJ.disableCopy || manualContractEdit || contractInfo.whetherEditAllBoo === false
											"
											v-model="baseInfoForm.contractSignTime"
											type="date"
											format="YYYY-MM-DD"
											style="width: 100%"
											@change="getTime"
											placeholder="请选择"
										/>
									</a-form-model-item>
								</a-col>

								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										ref="status"
										label="签订状态"
										prop="status"
										:colon="false"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-radio-group
											v-model="baseInfoForm.status"
											:disabled="
												VUEX_MANUAL_ASSET_OBJ.disableCopy || manualContractEdit || contractInfo.whetherEditAllBoo === false
											"
										>
											<a-radio :value="2">双签</a-radio>
											<a-radio :value="1">单签</a-radio>
										</a-radio-group>
									</a-form-model-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-model-item
										ref="execDate"
										label="合同执行日期"
										prop="execDate"
										:colon="false"
										:rules="{ validator: validDoubleTime, trigger: 'change', required: true }"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-range-picker
											v-model="baseInfoForm.execDate"
											:disabled="
												VUEX_MANUAL_ASSET_OBJ.disableCopy || manualContractEdit || contractInfo.whetherEditAllBoo === false
											"
											type="date"
											format="YYYY-MM-DD"
											style="width: 100%"
											@change="getDoubleTime"
										/>
									</a-form-model-item>
								</a-col>
							</a-row>
						</a-form-model>
					</template>
					<!-- 下游基本信息详情展示模块 -->
					<template v-if="!editFlag">
						<a-row>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">卖方名称</a-col>
									<a-col :span="18">{{ contractInfo.sellerName || VUEX_ST_COMPANYSUER.companyName }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">买方名称</a-col>
									<a-col :span="18">{{ contractInfo.buyerName }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同编号</a-col>
									<a-col :span="18">{{ contractInfo.paperContractNo }}</a-col>
								</a-row>
							</a-col>

							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同签订日期</a-col>
									<a-col :span="18">{{ contractInfo.contractSignTime }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同签订状态</a-col>
									<a-col
										:span="18"
										class="doubleSign"
										v-if="contractInfo.status == '2'"
										>双签</a-col
									>
									<a-col
										:span="18"
										class="singleSign"
										v-if="contractInfo.status == '1'"
										>单签</a-col
									>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同执行日期</a-col>
									<a-col :span="18">{{ contractInfo.execDateStart }}-{{ contractInfo.execDateEnd }}</a-col>
								</a-row>
							</a-col>
						</a-row>
					</template>
				</div>

				<div>
					<p class="sub-title">合同详情</p>
					<p>合同总价：{{ mytotalprice }}</p>
					<!-- 下游合同详情编辑模块 -->
					<template v-if="editFlag">
						<div>
							<div style="text-align: right; margin-bottom: 10px">
								<a-button
									ghost
									type="primary"
									@click="addContract"
									:disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy || manualContractEdit || contractInfo.whetherEditAllBoo === false"
									>新增</a-button
								>
							</div>
							<template>
								<a-table
									:pagination="false"
									:columns="VUEX_MANUAL_ASSET_OBJ.disableCopy == false ? contractEditColumns : contractDetailColumns"
									:data-source="contractListDataSource"
									:scroll="{ x: true }"
									rowKey="id"
								>
									<template
										slot="action"
										slot-scope="action, items, index"
										v-if="contractInfo.whetherEditAllBoo !== false"
									>
										<div v-if="!manualContractEdit">
											<a
												style="margin-right: 10px"
												href="javascript:;"
												@click="editContract(items, index)"
												>编辑</a
											>
											<a-popconfirm
												v-if="!items.locked"
												title="确定删除?"
												okText="确定"
												cancelText="取消"
												@confirm="() => deleteContract(items, index)"
											>
												<a href="javascript:;">删除</a>
											</a-popconfirm>
										</div>
									</template>
								</a-table>
							</template>
						</div>
					</template>

					<!-- 下游合同详情展示模块 -->
					<template v-if="!editFlag">
						<a-table
							:pagination="false"
							:columns="contractDetailColumns"
							:data-source="contractListDataSource"
							:scroll="{ x: true }"
							rowKey="id"
						></a-table>
					</template>
				</div>

				<div>
					<p class="sub-title">回款账户信息</p>
					<!-- 下游合同详情编辑模块 -->
					<template v-if="editFlag">
						<a-form
							layout="inline"
							:form="accountForm"
						>
							<div style="margin-top: 25px">
								<a-row>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item label="回款账号">
											<a-select
												style="width: 220px; height: 65px"
												class="fangkuan-select"
												:disabled="
													VUEX_MANUAL_ASSET_OBJ.disableCopy || manualContractEdit || contractInfo.whetherEditAllBoo === false
												"
												v-decorator="[
													'acctBankId',
													{
														rules: [{ required: true, message: `回款账号必填` }],
														validateTrigger: 'change'
													}
												]"
												@change="v => selectAccount(v)"
												placeholder="请选择回款账号"
											>
												<a-select-option
													v-for="(items, index) in huikuanAccountList"
													:key="index"
													:value="items.value"
												>
													<div>{{ items.bankName }}</div>
													<div>{{ items.bankNo }}</div>
												</a-select-option>
											</a-select>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item label="回款账号开户名">
											{{ currentAccountObj.bankAccountName }}
										</a-form-item>
									</a-col>
								</a-row>
								<a-row>
									<a-col
										:span="12"
										class="row"
										style="opacity: 0"
									>
										<a-form-item label=" "> </a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item label="回款账号开户行">
											{{ currentAccountObj.bankName }}
										</a-form-item>
									</a-col>
								</a-row>
							</div>
						</a-form>
					</template>
					<template v-else>
						<a-row>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">回款账号</a-col>
									<a-col :span="18">{{ contractInfo.acctNo }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">回款账号开户名</a-col>
									<a-col :span="18">{{ contractInfo.acctBankName }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">回款账号开户行</a-col>
									<a-col :span="18">{{ contractInfo.acctBankBranch }}</a-col>
								</a-row>
							</a-col>
						</a-row>
					</template>
				</div>

				<div>
					<p class="sub-title">附件信息</p>
					<!-- 下游附件编辑模块 -->
					<template v-if="editFlag || editFile">
						<div v-if="!manualContractEdit">
							<Upload
								@uploadFiles="getUploadFiles"
								type="TERMINAL_CONTRACT"
								btnText="上传下游合同"
								styleType="new"
							></Upload>
							<SupplementUpload
								@uploadFiles="getUploadFilesSupplment"
								type="7"
								btnText="上传补充协议"
							/>
							<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5"
								>单个文件最大支持100M，支持多个上传</span
							>
						</div>
						<a-table
							bordered
							v-if="fileListDataSource.length || (!fileListDataSource.length && !supplementalInfo.length)"
							:pagination="false"
							:columns="editFilesColumns"
							:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
							:scroll="{ x: true }"
							rowKey="path"
						>
							<template
								slot="type"
								slot-scope="type"
							>
								{{ CONSTANTS.fileType[type] }}
							</template>
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
							<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
							<template
								slot="action"
								slot-scope="action, items, index"
							>
								<a-space v-if="(!manualContractEdit && items.id && contractInfo.whetherEditAllBoo !== false) || !items.id">
									<a-popconfirm
										v-if="!items.locked && (items.editFlag == null || items.editFlag == 1)"
										title="确定删除该附件?"
										okText="确定"
										cancelText="取消"
										@confirm="() => deleteFiles(items, index)"
									>
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</a-space>
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
								<a-space v-if="!manualContractEdit">
									<a-popconfirm
										title="确定删除该附件信息?"
										okText="确定"
										cancelText="取消"
										v-if="
											(record.supplementalAgreementId && contractInfo.whetherEditAllBoo !== false) ||
											!record.supplementalAgreementId
										"
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
					</template>
					<!-- 下游附件详情展示模块 -->
					<template v-if="!editFlag && !editFile">
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
								slot="type"
								slot-scope="type"
							>
								{{ CONSTANTS.fileType[type] }}
							</template>
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
						</a-table>

						<a-table
							v-if="supplementalInfo.length"
							bordered
							:dataSource="supplementalInfo"
							:columns="supplementalDetailColumns"
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
						</a-table>
					</template>
				</div>
			</div>
		</div>
		<a-modal
			class="modal"
			width="600px"
			:visible="contractVisible"
			:title="contractVisibleTitle"
			@ok="okContract"
			@cancel="
				() => {
					contractVisible = false;
				}
			"
		>
			<a-form
				:form="contractForm"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 15 }"
			>
				<a-form-item label="标的货物名称">
					<a-input
						placeholder="请输入标的货物名称"
						v-decorator="[
							`goodsName`,
							{
								rules: [{ required: true, message: `标的货物名称必填`, whitespace: true }]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="单价(元/吨)">
					<a-input-number
						placeholder="请输入单价"
						:min="0"
						:max="9999.99"
						style="width: 100%"
						v-decorator="[
							`price`,
							{
								rules: [
									{ required: true, message: `单价必填` },
									{ pattern: numberReg2, message: '请输入数字，最多三位小数' }
								]
							}
						]"
					>
					</a-input-number>
				</a-form-item>
				<a-form-item label="数量(吨)">
					<a-input
						placeholder="请输入数量"
						v-decorator="[
							`quantity`,
							{
								rules: [
									{ required: true, message: `数量必填` },
									{ pattern: numberReg, message: '请输入数字，最多两位小数' }
								]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="总价">
					{{ accMul(contractForm.getFieldValue('quantity') || 0, contractForm.getFieldValue('price') || 0) }}元
				</a-form-item>
			</a-form>
			<template slot="footer">
				<a-button
					key="back"
					@click="contractVisible = false"
				>
					取消
				</a-button>
				<a-button
					key="submit"
					type="primary"
					@click="okContract"
				>
					确定
				</a-button>
				<a-button
					key="submit1"
					type="primary"
					@click="okContract('more')"
					v-if="editContractFlag == null"
				>
					确定并继续添加
				</a-button>
			</template>
		</a-modal>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import Upload from '../common/Upload.vue';
import SupplementUpload from '../common/SupplementUpload.vue';
import { mapMutations, mapGetters } from 'vuex';
import num from '@/untils/num.js';
import { API_COMPANYACCOUNTLIST, API_GetAccountsManualcheckContract } from '@/v2/center/assets/api/index.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';

export default {
	name: 'Contract',
	data() {
		return {
			manualContractEdit: false,
			contractForm: this.$form.createForm(this),
			accountForm: this.$form.createForm(this),
			editContractFlag: null,
			accMul: num.accMul,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			numberReg2: /^(\d+)(\.\d{1,3})?$/,
			contractVisibleTitle: '',
			contractVisible: false,
			contractDetailColumns: [
				{ title: '标的货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '单价(元/吨)', dataIndex: 'price', key: 'price' },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
				{ title: '总价(元)', dataIndex: 'totalPrice', key: 'totalPrice' }
			],
			contractListDataSource: [],
			contractEditColumns: [
				{ title: '标的货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '单价(元/吨)', dataIndex: 'price', key: 'price' },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
				{ title: '总价(元)', dataIndex: 'totalPrice', key: 'totalPrice' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{
					title: '单据类型',
					dataIndex: 'type',
					key: 'type',
					customRender: (value, row, index) => {
						const obj = {
							children: '下游合同',
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.fileListDataSource.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			editFilesColumns: [
				{
					title: '单据类型',
					dataIndex: 'type',
					key: 'type',
					customRender: (value, row, index) => {
						const obj = {
							children: '下游合同',
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.fileListDataSource.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			fileInfos: [],
			baseInfoForm: {
				paperContractNo: '',
				contractSignTime: null,
				doubleSignTime: '',
				status: 1,
				execDate: null
			},
			baseInfoRules: {
				paperContractNo: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],

				contractSignTime: [{ required: true, message: '签订⽇期不能为空', trigger: 'change' }]
			},
			huikuanAccountList: [],
			currentAccountObj: {},
			fileListDataSource: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
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
			],
			supplementalDetailColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `补充协议`,
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
				}
			],
			filterCodeByValueName: filterCodeByValueName
		};
	},
	props: ['showEditorRadio', 'contractEdit', 'editFlag', 'contractInfo', 'noFileName', 'lineId', 'editFile'],
	components: {
		Upload,
		SupplementUpload
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		}),
		...mapGetters('business', {
			VUEX_MANUAL_ASSET_OBJ: 'VUEX_MANUAL_ASSET_OBJ'
		}),
		mytotalprice() {
			return this.contractListDataSource
				.reduce((pre, cur) => {
					return pre + cur.quantity * cur.price;
				}, 0)
				.toFixed(2);
		}
	},
	watch: {
		contractInfo: function () {
			// 合同详情数据转成数组格式
			this.dealEditData();
		}
	},
	mounted() {
		if (this.VUEX_ST_COMPANYSUER.companyUscc) {
			this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc);
		}
		this.manualContractEdit = this.contractEdit;
		this.dealEditData();
	},
	methods: {
		moment,
		...mapMutations({
			VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
		}),
		dealEditData() {
			if (!this.contractInfo || Object.keys(this.contractInfo).length === 0) return;
			this.baseInfoForm = {
				id: this.contractInfo.id || null,
				paperContractNo: this.contractInfo.paperContractNo,
				contractSignTime: this.contractInfo.contractSignTime,
				status: this.contractInfo.status,
				execDate: [moment(this.contractInfo.execDateStart), moment(this.contractInfo.execDateEnd)]
			};

			this.contractListDataSource = this.contractInfo.manualGoodsVOList || [];

			setTimeout(() => {
				this.accountForm.setFieldsValue({
					acctBankId: this.contractInfo.acctBankId
				});
				this.selectAccount(this.contractInfo.acctBankId);
			}, 1000);

			this.fileListDataSource = this.contractInfo.list || [];
			this.supplementalInfo = this.contractInfo.supplementalInfo || [];

			if (this.contractInfo.reuseFlag == 1) {
				this.VUEX_SET_MANUAL_ASSET_OBJ({
					disableCopy: true
				});
			}
		},

		getBankAccount(companyUscc) {
			API_COMPANYACCOUNTLIST({ uscc: companyUscc }).then(res => {
				let data = res.data || [];
				let _array = [];
				data.forEach(item => {
					_array.push({
						bankName: item.subbranchName,
						bankNo: item.accountNo,
						value: item.id,
						bankAccountName: item.accountName
					});
				});
				this.huikuanAccountList = _array;
			});
		},
		checkContractNo() {
			// 编辑状态下
			if (this.$route.query.id) {
				return;
			}
			let v = this.baseInfoForm.paperContractNo;
			API_GetAccountsManualcheckContract({ paperContractNo: v, buyerUscc: this.VUEX_MANUAL_ASSET_OBJ.buyerUscc }).then(res => {
				if (res.success && res.data) {
					this.$emit('refreshmanualTerminalContract', res.data.manualTerminalContract);
					this.$message.info('该合同已在平台存在，将复用原合同信息');
					this.VUEX_SET_MANUAL_ASSET_OBJ({
						disableCopy: true
					});
				}
			});
		},
		selectAccount(c) {
			this.currentAccountObj = {};

			this.huikuanAccountList.forEach(item => {
				if (item.value == c) {
					this.currentAccountObj = item;
				}
			});
		},
		deleteContract(item, _index) {
			this.contractListDataSource.splice(_index, 1);
		},
		editContract(item, _index) {
			this.editContractFlag = _index;
			this.contractForm.resetFields();
			this.contractVisible = true;
			this.contractVisibleTitle = '编辑货物';
			this.contractForm.setFieldsValue({
				...item
			});
		},
		okContract(more) {
			this.contractForm.validateFields((error, values) => {
				if (!error) {
					let temp = {};
					if (this.editContractFlag != null) {
						temp = this.contractListDataSource[this.editContractFlag];
						this.contractListDataSource.splice(this.editContractFlag, 1);
					}
					this.contractListDataSource.push({
						...temp,
						...values,
						totalPrice: num.accMul(values.price, values.quantity)
						// id:Date.now()
					});

					if (more == 'more') {
						this.contractForm.resetFields();
					} else {
						this.contractVisible = false;
					}
				}
			});
		},
		addContract() {
			this.editContractFlag = null;
			this.contractForm.resetFields();
			this.contractVisible = true;
			this.contractVisibleTitle = '新增货物';
		},

		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.fileListDataSource.push(item);
			});
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
		deleteFiles(items, _index) {
			// 删除附件:disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
			if (this.VUEX_MANUAL_ASSET_OBJ.disableCopy == true && items.id) {
				this.$message.error('原合同附件无法删除');
				return;
			}
			this.fileListDataSource[_index].delFlag = 1;
		},

		getTime(value, dateString) {
			// 合同签订日期
			this.baseInfoForm.contractSignTime = dateString;
			this.VUEX_SET_MANUAL_ASSET_OBJ({
				contractSignTime: dateString
			});
		},
		getDoubleTime(value, dateString) {
			// 双签日期
			this.baseInfoForm.execDateStart = dateString[0];
			this.baseInfoForm.execDateEnd = dateString[1];
		},
		validDoubleTime(rule, value, callback) {
			// 验证双签日期

			if (!value[0]) {
				return callback(new Error('请选择合同执行日期'));
			}

			if (this.baseInfoForm.contractSignTime) {
				const date = moment(this.baseInfoForm.contractSignTime);
				if (new Date(value[0]) < date) {
					return callback(new Error('合同执行日期不能小于签订日期'));
				}
			}

			return callback();
		},
		onSubmitList() {
			return this.fileListDataSource || [];
		},
		onSubmit(callback) {
			// 整体提交

			this.accountForm.validateFields((error, values) => {
				this.$refs.baseInfoForm.validate(valid => {
					if (valid && !error) {
						if (this.fileListDataSource.filter(item => item.delFlag == 0).length == 0) {
							this.$message.error('合同信息缺少附件');
							return;
						}
						let obj = {
							contractSignTime: this.baseInfoForm.contractSignTime,
							execDateEnd: this.baseInfoForm.execDate[1].format('YYYY-MM-DD'),
							execDateStart: this.baseInfoForm.execDate[0].format('YYYY-MM-DD'),
							paperContractNo: this.baseInfoForm.paperContractNo,
							status: this.baseInfoForm.status,
							sellerName: this.VUEX_ST_COMPANYSUER.companyName,
							buyerName: this.VUEX_MANUAL_ASSET_OBJ.buyerName,
							acctBankId: values.acctBankId,
							acctNo: this.huikuanAccountList.filter(i => {
								return i.value == values.acctBankId;
							})[0].value,
							acctBankName: this.currentAccountObj.bankName,
							acctBankBranch: this.currentAccountObj.bankAccountName,
							manualGoodsVOList: this.contractListDataSource,
							list: this.fileListDataSource,
							id: this.baseInfoForm.id || null,
							supplementalInfo: this.supplementalInfo,
							downTerminalContractModify: !this.manualContractEdit
						};
						callback(obj);
					} else {
						this.$message.error('合同信息缺少必要内容');
					}
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep .fangkuan-select .ant-select-arrow {
	top: 23%;
}
::v-deep .fangkuan-select .ant-select-selection {
	height: 65px;
}
.contentBox {
	font-size: 14px;
	color: #141517;

	& > div {
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}
		.divider {
			background: #f4f5f8;
			height: 1px;
			margin-top: 0;
		}
		.add-other {
			float: right;
			margin-right: 15px;
			margin-top: 8px;
		}
		.content {
			padding: 15px;
			.other-title {
				color: #383a3f;
				margin-bottom: 20px;
			}
			& > div {
				.row {
					height: 59px;
					margin-bottom: 0;
					::v-deep.ant-form-item-label {
						text-align: left;
					}
					.ant-form-item-children em {
						position: absolute;
						right: -20px;
					}
					::v-deep.ant-table-fixed-columns-in-body {
						text-align: left;
					}
				}
				& > .ant-row .ant-col .ant-row .ant-col:nth(1) {
					color: #6b6f76;
				}
				& > .ant-row .ant-col .ant-row .ant-col:odd {
					color: #383a3f;
				}
				p {
					font-family: PingFangSC-Medium;
					color: #383a3f;
					text-align: left;
					line-height: 18px;
					margin: 15px 0;
				}
				& > .ant-row {
					margin: 15px 0;
					.ant-col .ant-row .ant-col {
						margin-bottom: 3px;
					}
					.ant-col .ant-row .ant-col:first-child {
						color: #6b6f76;
					}
					.ant-col .ant-row .ant-col:last-child {
						color: #383a3f;
					}
				}
			}
		}
	}
	.doubleSign {
		color: #00ae9d !important;
	}
	.singleSign {
		color: #ff9726 !important;
	}
	.red {
		color: #f24e4d !important;
	}

	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		float: right;
		display: inline-block;
		margin-right: 15px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
