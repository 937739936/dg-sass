<template>
	<div>
		<!-- 下游 -->
		<!-- <div class="downstreamBox">
            <div class="title">采购合同</div>
            <div class="divider"></div>
            <div class="content"> -->
		<!-- <a-button-group>
                  <a-button
                    v-for="item in [{ label: '关联电子合同', value: 1 }, { label: '上传线下合同', value: 2 }]"
                    :key="item.value"
                    @click="typeChange(item)"
                    :type="item.value === typeIndex ? 'primary' : 'default'">
                      {{ item.label }}
                  </a-button>
                </a-button-group> -->
		<div>
			<p class="sub-title">基本信息</p>
			<!-- {{ onlineContractId }} {{ offlineContractId }} -->
			<!-- 下游基本信息编辑模块 -->
			<template v-if="editFlag">
				<a-form-model
					ref="baseInfoForm"
					:model="baseInfoForm"
					:rules="baseInfoRules"
				>
					<a-row v-if="typeIndex === 1">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-model-item
								ref="contractNo"
								label="合同编号"
								prop="contractNo"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								<a-input
									readOnly
									@click="showContractList"
									v-model.trim="baseInfoForm.contractNo"
									placeholder="请输入合同编号"
								/>
							</a-form-model-item>
						</a-col>
						<template v-if="onlineContractDetail">
							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									label="签订日期"
									:colon="false"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 14 }"
								>
									{{ onlineContractDetail.signTime }}
									<!-- <a-date-picker
                                                :disabled-date="disabledDate"
                                                :disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
                                                v-model="baseInfoForm.contractSignTime"
                                                type="date"
                                                format="YYYY-MM-DD"
                                                style="width:100%"
                                                @change="getTime"
                                                placeholder="请选择"
                                            /> -->
								</a-form-model-item>
							</a-col>

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
									{{ onlineContractDetail.sellerName }}
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
									{{ onlineContractDetail.buyerName }}
								</a-form-model-item>
							</a-col>

							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									label="合同签订状态"
									:colon="false"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 14 }"
								>
									{{ onlineContractDetail.status }}
									<!-- <a-radio-group v-model="baseInfoForm.status" :disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy">
                                                <a-radio :value="2">双签</a-radio>
                                                <a-radio :value="1">单签</a-radio>
                                            </a-radio-group> -->
								</a-form-model-item>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									label="合同执行日期"
									:colon="false"
									:rules="{ validator: validDoubleTime, trigger: 'change', required: true }"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 14 }"
								>
									{{ onlineContractDetail.startDate }} 至 {{ onlineContractDetail.endDate }}
									<!-- <a-range-picker
                                                v-model="baseInfoForm.execDate"
                                                :disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
                                                type="date"
                                                format="YYYY-MM-DD"
                                                style="width:100%"
                                                @change="getDoubleTime"
                                            /> -->
								</a-form-model-item>
							</a-col>
						</template>
					</a-row>
				</a-form-model>
				<a-form-model
					v-if="typeIndex === 2"
					ref="offlineBaseInfoForm"
					:model="offlineBaseInfoForm"
					:rules="offlineBaseInfoRules"
				>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-model-item
								ref="sellerName"
								label="卖方名称"
								prop="sellerName"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								<a-select
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									:not-found-content="null"
									placeholder="请输入卖方名称"
									@search="inputCompany"
									@change="contractNoChange"
									v-model="offlineBaseInfoForm.sellerName"
								>
									<a-select-option
										@click="sellerNameChange(item)"
										v-for="(item, index) in companyNameInfo"
										:value="item.value"
										:key="index"
									>
										<a-tooltip>
											<template slot="title">{{ item.name }}</template>
											<span>{{ item.name }}</span>
										</a-tooltip>
									</a-select-option>
								</a-select>

								<!-- <a-input
                                        v-model.trim="offlineBaseInfoForm.paperContractNo"
                                        placeholder="请输入卖方名称"/> -->
							</a-form-model-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-model-item
								required
								label="买方名称"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								{{ VUEX_ST_COMPANYSUER.companyName }}
							</a-form-model-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-model-item
								ref="contractNo"
								label="合同编号"
								prop="contractNo"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								<!-- @blur="checkContractNo" -->
								<!-- 合同编号选择要先选择卖方 -->
								<a-input
									v-model.trim="offlineBaseInfoForm.contractNo"
									@focus="contractNoFocusAndBlur(true)"
									@blur="contractNoChange"
									:disabled="!offlineBaseInfoForm.sellerName"
									placeholder="请输入合同编号(先选择卖方)"
									:maxLength="50"
								/>
							</a-form-model-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-model-item
								ref="signTime"
								label="签订日期"
								prop="signTime"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								<a-date-picker
									:disabled-date="disabledDate"
									v-model="offlineBaseInfoForm.signTime"
									type="date"
									valueFormat="YYYY-MM-DD"
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
								label="合同签订状态"
								prop="status"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								<a-radio-group
									v-model="offlineBaseInfoForm.status"
									:disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
								>
									<a-radio value="双签">双签</a-radio>
									<!-- <a-radio :value="1">单签</a-radio> -->
								</a-radio-group>
							</a-form-model-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<!-- <a-form-model-item ref="execDate" label="合同执行日期" prop="execDate" :colon=false  :rules="{ validator: validDoubleTime, trigger: 'change', required: true}" :label-col="{ span: 6 }" :wrapper-col="{ span: 14}"> -->
							<a-form-model-item
								ref="execDate"
								label="合同执行日期"
								prop="execDate"
								:colon="false"
								:label-col="{ span: 6 }"
								:wrapper-col="{ span: 14 }"
							>
								<a-range-picker
									v-model="offlineBaseInfoForm.execDate"
									type="date"
									valueFormat="YYYY-MM-DD"
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
							<a-col :span="18">{{ VUEX_ST_COMPANYSUER.companyName }}</a-col>
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
			<!-- <p>合同总价：{{mytotalprice}}</p> -->
			<!-- 下游合同详情编辑模块 -->
			<template v-if="editFlag">
				<div>
					<div
						v-if="typeIndex === 2"
						style="text-align: right; margin-bottom: 10px"
					>
						<a-button
							ghost
							type="primary"
							@click="addContract"
							:disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
							>新增</a-button
						>
					</div>
					<template>
						<a-table
							:pagination="false"
							:columns="[contractDetailColumns, contractEditColumns][typeIndex - 1]"
							:data-source="contractListDataSource"
							:scroll="{ x: true }"
							rowKey="id"
						>
							<template
								slot="action"
								slot-scope="action, items, index"
							>
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

		<!-- <div>
                    <p  class="sub-title">回款账户信息</p>
                    <template v-if="editFlag">
                        <a-form  layout="inline" :form="accountForm">
                            <div style=";margin-top:25px;">
                                <a-row>
                                    <a-col :span="12" class="row">

                                        <a-form-item label="回款账号">
                                            <a-select style="width:220px;height:65px;" class="fangkuan-select"
                                            :disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
                                             v-decorator="[
                                                'acctBankId',
                                                {
                                                rules: [{ required: true, message: `回款账号必填` }],validateTrigger:'change'
                                                }
                                            ]"
                                            @change="(v)=>selectAccount(v)"
                                            placeholder="请选择回款账号">
                                                <a-select-option
                                                        v-for="(items, index) in huikuanAccountList"
                                                        :key="index"
                                                        :value="items.value"
                                                >
                                                <div>{{items.bankName}}</div>
                                                <div>{{items.bankNo}}</div>
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12" class="row">

                                        <a-form-item label="回款账号开户名">
                                            {{currentAccountObj.bankAccountName}}
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="12" class="row" style="opacity:0">
                                        <a-form-item label=" ">
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12" class="row">
                                        <a-form-item label="回款账号开户行">
                                            {{currentAccountObj.bankName}}
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
                                    <a-col :span="18">{{contractInfo.acctNo}}</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="12">
                                <a-row :gutter="20">
                                    <a-col :span="6">回款账号开户名</a-col>
                                    <a-col :span="18">{{contractInfo.acctBankName}}</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="12">
                                <a-row :gutter="20">
                                    <a-col :span="6">回款账号开户行</a-col>
                                    <a-col :span="18">{{contractInfo.acctBankBranch}}</a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </template>
                </div> -->

		<div>
			<p class="sub-title">附件信息</p>
			<!-- 下游附件编辑模块 -->
			<template v-if="editFlag || editFile">
				<template v-if="typeIndex === 2">
					<a-button
						type="primary"
						class="mr8"
						v-if="hasUpContract()"
						ghost
						@click="notAllowAddUpContract"
						>上传上游合同</a-button
					>
					<Upload
						v-else
						@uploadFiles="getUploadFiles"
						type="UP_CONTRACT"
						btnText="上传上游合同"
						styleType="new"
					></Upload>
					<!-- <Upload @uploadFiles="getUploadFiles" type="UP_CONTRACT" btnText="上传上游合同"></Upload> -->

					<!-- 补充协议上传 -->
					<!-- 线下合同附件上传 -->

					<SupplementUpload
						@uploadFiles="getUploadFilesSupplment"
						type="7"
						btnText="上传补充协议"
					/>
				</template>

				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				<a-table
					:pagination="false"
					:columns="editFilesColumns"
					:data-source="fileListDataSource"
					:scroll="{ x: true }"
					rowKey="path"
					v-if="fileListDataSource.length || (!fileListDataSource.length && !supplementalInfo.length)"
				>
					<template
						slot="fileType"
						slot-scope="fileType"
					>
						{{ CONSTANTS.fileType[fileType] }}
					</template>
					<template
						slot="fileName"
						slot-scope="fileName, items"
					>
						<a @click="preview(items.fileUrl)">{{ fileName }}</a>
					</template>
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
					<template
						slot="action"
						slot-scope="action, items, index"
					>
						<!-- <a @click="preview(items.fileUrl)" class="mr8">查看</a> -->
						<a-popconfirm
							v-if="typeIndex == 2"
							title="确定删除该附件?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteFiles(items, index)"
						>
							<a>删除</a>
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
							@click.prevent="preview(item.url)"
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
			</template>
			<!-- 下游附件详情展示模块 -->
			<template v-if="!editFlag && !editFile">
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource"
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
				</a-table>
			</template>
		</div>
		<!--  </div>
        </div> -->
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
						min="0.01"
						style="width: 100%"
						placeholder="请输入单价"
						v-decorator="[
							`price`,
							{
								rules: [
									{ required: true, message: `单价必填` },
									{ pattern: numberReg, message: '请输入数字，最多两位小数' }
								]
							}
						]"
					>
					</a-input-number>
				</a-form-item>
				<a-form-item label="数量(吨)">
					<a-input-number
						min="0.01"
						style="width: 100%"
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
					</a-input-number>
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
		<ContractList
			ref="contractList"
			@getOnlineContractDetail="getOnlineContractDetail"
		/>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import Upload from '../Upload.vue';
import SupplementUpload from '../SupplementUpload.vue';
import { mapMutations, mapGetters } from 'vuex';
import num from '@/untils/num.js';
import { API_COMPANYACCOUNTLIST, API_GetAccountsManualcheckContract, API_STORAGEGOODSONLINECONTRACTDETAIL } from 'api';
import ContractList from './ContractList.vue';
import { API_GetCompanyName, API_STORAGEGOODSINRECORDCONTRACTOFFLINEDETAIL } from 'api';
import { getOfficeFileViewUrl } from 'untils/factory.js';
import { debounce } from 'lodash';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';

export default {
	name: 'Contract',
	data() {
		return {
			offlineContractId: '',
			onlineContractId: '',

			previewImg: '',
			offlineSellerName: {},
			onlineContractDetail: '',
			contractForm: this.$form.createForm(this),
			accountForm: this.$form.createForm(this),
			editContractFlag: null,
			accMul: num.accMul,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			contractVisibleTitle: '',
			contractVisible: false,
			companyNameInfo: [],
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
				{ title: '单据类型', dataIndex: 'type' },
				{ title: '初始文件名', dataIndex: 'originalFileName' },
				{ title: '转换文件名', dataIndex: 'convertFileName' }
			],
			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'fileType', key: 'fileType', scopedSlots: { customRender: 'fileType' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'convertFileName', key: 'convertFileName', customRender: text => text || '-' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			fileInfos: [],
			offlineBaseInfoForm: {},
			baseInfoForm: {
				contractNo: ''
				// sellerName: '',
				// paperContractNo: '',
				// contractSignTime: null,
				// doubleSignTime: '',
				// status: 2,
				// execDate:null
			},
			offlineBaseInfoRules: {
				contractNo: [
					{ required: true, message: '合同编号不能为空', trigger: 'change' },
					{ max: 50, message: '合同编号长度不能超过50个字符' }
				],
				sellerName: [{ required: true, message: '卖方名称不能为空', trigger: 'change' }],
				signTime: [{ required: true, message: '签订⽇期不能为空', trigger: 'change' }],
				execDate: [{ required: true, message: '合同执行日期不能为空', trigger: 'change' }]
			},
			baseInfoRules: {
				contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'change' }]
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
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeNameRowSpan
							}
						};
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
						return text == '1' ? '单签' : '双签';
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
			filterCodeByValueName: filterCodeByValueName
		};
	},
	props: ['editFlag', 'contractInfo', 'noFileName', 'lineId', 'editFile', 'typeIndex', 'typeKey'],
	components: {
		Upload,
		ContractList,
		SupplementUpload
	},

	computed: {
		...mapGetters('business', {
			VUEX_MANUAL_ASSET_OBJ: 'VUEX_MANUAL_ASSET_OBJ'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
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
		this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc);

		this.dealEditData();
	},
	methods: {
		moment,
		...mapMutations({
			VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
		}),
		contractNoFocusAndBlur(value) {
			this.$emit('contractNoFocusAndBlur', value);
		},
		notAllowAddUpContract() {
			this.$message.error('只允许上传一个上游补录合同');
		},
		hasUpContract() {
			let hasUpContract = false;
			this.fileListDataSource.forEach(item => {
				if (item?.fileType === 'UP_CONTRACT') {
					hasUpContract = true;
				}
			});
			return hasUpContract;
		},
		contractNoChange: debounce(function () {
			if (!this.offlineBaseInfoForm.contractNo) {
				this.contractNoFocusAndBlur(false);
				return;
			}
			API_STORAGEGOODSINRECORDCONTRACTOFFLINEDETAIL({
				contractNo: this.offlineBaseInfoForm.contractNo,
				sellerUscc: this.offlineBaseInfoForm.sellerName
			})
				.then(res => {
					if (res.success) {
						if (res.data) {
							this.$emit('offlineContractNoChange', res.data);
							// this.offlineSellerName = { name: res.data.sellerName, value: res.data.sellerUscc }
							// this.offlineBaseInfoForm = {
							//     ...this.offlineBaseInfoForm,
							//     status: res.data.status,
							//     buyerName: res.data.buyerName,
							//     sellerName: res.data.sellerName,
							//     signTime: res.data.signTime,
							//     execDate: [res.data.startDate, res.data.endDate]
							// }
						}
						if (!res.data) {
							this.offlineContractId = '';
						}
					}
				})
				.finally(() => {
					this.contractNoFocusAndBlur(false);
				});
		}),
		sellerNameChange(data) {
			this.offlineSellerName = data;
		},
		preview(url) {
			const front_url = url.split('?')[0];
			const fileFormat = front_url.split('.').pop().toLowerCase();
			const previewUrl = url;
			switch (fileFormat) {
				case 'pdf':
					window.open(previewUrl, '_blank');
					break;
				case 'xls':
				case 'xlsx':
				case 'doc':
				case 'docx':
					window.open(getOfficeFileViewUrl(url), '_blank');
					break;
				default:
					this.previewImg = previewUrl;
					this.$refs.viewer.$viewer.show();
					break;
			}
		},
		// typeChange(item) {
		//     this.typeIndex = item.value
		//     this.baseInfoForm = {}
		//     this.onlineContractDetail = ''
		//     this.fileListDataSource = []
		//     this.contractListDataSource = []
		// },
		getCompanyInfo({ sellerName }) {
			this.baseInfoForm.sellerName = sellerName;
		},
		inputCompany(v) {
			if (!v) {
				return;
			}
			this.companyNameInfo = [];
			API_GetCompanyName({ name: v }).then(res => {
				const arr = res.data || [];
				// if (arr.length === 0) {
				//   this.$set(this.form, 'terminalCompanyName', v);
				//   return (this.companyNameInfo = []);
				// }
				this.companyNameInfo = arr.map(item => ({
					name: item.name,
					value: item.creditCode
				}));
			});
		},
		getOnlineContractDetail(contractNo) {
			this.baseInfoForm = { contractNo };
			API_STORAGEGOODSONLINECONTRACTDETAIL({ contractNo }).then(res => {
				if (res.success) {
					this.onlineContractId = res.data.id;

					this.onlineContractDetail = res.data;
					this.contractListDataSource = res.data.goodsList;
					this.contractListDataSource = this.contractListDataSource.map(item => {
						return {
							...item,
							price: item.basePrice
						};
					});
					if (res.data.supplementalInfo) {
						this.supplementalInfo = [...res.data.supplementalInfo];
						this.supplementalInfo = TableRowSpanFunc(this.supplementalInfo, 'typeName');
					}
					if (res.data.contractAttachment) {
						this.fileListDataSource = [res.data.contractAttachment, ...this.fileListDataSource];
					}

					this.fileListDataSource = this.fileListDataSource.map(item => {
						return {
							...item,
							fileName: item.fileName || item.originalFileName,
							fileType: item.fileType || item.type,
							fileUrl: item.fileUrl || item.path
						};
					});
				}
			});
		},
		showContractList() {
			this.$refs.contractList.showModal();
		},
		dealEditData() {
			if (!this.contractInfo) return;
			if (this.typeIndex == 1 && this.typeKey == this.typeIndex) {
				if (!this.contractInfo.no) {
					return;
				}
				this.getOnlineContractDetail(this.contractInfo.no);
				return;
			}
			if (this.typeIndex == 2 && this.typeKey == this.typeIndex) {
				const { id, sellerName, no, signTime, status, startDate, endDate, sellerUscc, contractAttachment, supplementalInfo } =
					this.contractInfo;
				this.offlineContractId = id;
				this.offlineBaseInfoForm = {
					sellerName,
					contractNo: no,
					signTime,
					status,
					execDate: [startDate, endDate]
				};
				this.sellerNameChange({ value: sellerUscc, name: sellerName });
				this.contractListDataSource = this.contractInfo.goodsList || [];
				this.contractListDataSource = this.contractListDataSource.map(item => {
					return {
						...item,
						price: item.basePrice
					};
				});
				this.fileListDataSource = [contractAttachment];
				this.fileListDataSource = this.fileListDataSource?.map(item => {
					return {
						...item,
						fileName: item.fileName || item.originalFileName,
						fileType: item.fileType || item.type,
						fileUrl: item.fileUrl || item.path
					};
				});
				this.supplementalInfo = [...supplementalInfo];
				this.supplementalInfo = TableRowSpanFunc(this.supplementalInfo, 'typeName');
				return;
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
			const tempArr = this.fileListDataSource.map(item => item.fileType);
			if (tempArr.includes('UP_CONTRACT') && data[0].fileType === 'UP_CONTRACT') {
				this.$message.error('只允许上传一个上游补录合同');
				return;
			}
			data.forEach(item => {
				this.fileListDataSource.push(item);
			});
		},
		getUploadFilesSupplment(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.supplementalInfo.push(item);
			});
			this.supplementalInfo = TableRowSpanFunc(this.supplementalInfo, 'typeName');
		},
		deleteSupplementFiles(items, index) {
			// 删除补协附件
			this.supplementalInfo.splice(index, 1);
			this.supplementalInfo = TableRowSpanFunc(this.supplementalInfo, 'typeName');
		},
		deleteFiles(items, index) {
			// 删除附件:disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
			this.fileListDataSource.splice(index, 1);
			// if (this.VUEX_MANUAL_ASSET_OBJ.disableCopy == true && items.id) {
			//     this.$message.error('原合同附件无法删除')
			//     return
			// }
			// this.fileListDataSource[_index].delFlag = 1
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
			const form = [this.$refs.baseInfoForm, this.$refs.offlineBaseInfoForm][this.typeIndex - 1];
			form.validate(valid => {
				if (valid) {
					try {
						let contractData = {
							...this.onlineContractDetail,
							contractNo: this.baseInfoForm.contractNo
						};
						if (this.typeIndex == 2) {
							const tempArr = this.fileListDataSource.map(item => item.fileType);
							if (!tempArr.includes('UP_CONTRACT')) {
								this.$message.error('请上传上游补录合同');
								return;
							}
							if (this.contractListDataSource.length <= 0) {
								this.$message.error('请添加货物');
								return;
							}
							let contractAttachment = {};
							let supplementalInfo = this.supplementalInfo;
							this.fileListDataSource.forEach(item => {
								if (item.fileType == 'UP_CONTRACT') {
									contractAttachment = item;
								}
							});
							contractData = {
								...this.offlineBaseInfoForm,
								sellerName: this.offlineSellerName.name, //卖方企业
								sellerUscc: this.offlineSellerName.value, //卖方统一社会编码
								buyerName: this.VUEX_ST_COMPANYSUER.companyName, //买方名称
								buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc, //买方统一社会编码
								contractType: 'OFFLINE',
								signTime: this.offlineBaseInfoForm.signTime,
								goodsList: this.contractListDataSource,
								contractAttachment,
								supplementalInfo,
								startDate: this.offlineBaseInfoForm.execDate[0], //合同执行期起
								endDate: this.offlineBaseInfoForm.execDate[1] //合同执行期止
							};
							delete contractData.execDate;
						}

						let contractAttachment = {};
						if (contractData.contractAttachment) {
							contractAttachment = {
								...contractData.contractAttachment,
								fileUrl: contractData.contractAttachment.path || contractData.contractAttachment.fileUrl,
								fileType: contractData.contractAttachment.type || contractData.contractAttachment.fileType,
								fileName: contractData.contractAttachment.originalFileName || contractData.contractAttachment.fileName
							};
						}
						const goodsList = (contractData.goodsList || []).map(item => {
							return {
								...item,
								price: item.basePrice || item.price
							};
						});
						const contractInfo = {
							// id: '', //合同主键（修改时必传）
							contractNo: contractData.contractNo,
							contractType: contractData.contractType, //关联合同类型(在线合同：ONLINE,线下合同：OFFLINE)
							sellerName: contractData.sellerName, //卖方企业
							sellerBizNo: contractData.sellerUscc, //卖方统一社会编码
							buyerName: contractData.buyerName, //买方名称
							buyerBizNo: contractData.buyerUscc, //买方统一社会编码
							doubleSignTime: contractData.signTime, //双签时间
							execDateStart: contractData.startDate, //合同执行期起
							execDateEnd: contractData.endDate, //合同执行期止

							supplementalInfo: contractData.supplementalInfo, // //上游合同补充文档
							contractAttachment, //上游合同附件
							goodsList //合同货物明细
						};
						contractInfo.id = [this.onlineContractId, this.offlineContractId][this.typeIndex - 1];
						// if (this.$route.query.id) {
						//     contractInfo.id = this.contractInfo.id
						// }
						// const obj = {

						// contractSignTime: this.baseInfoForm.contractSignTime,
						// execDateEnd:  this.baseInfoForm.execDate[1].format('YYYY-MM-DD'),
						// execDateStart: this.baseInfoForm.execDate[0].format('YYYY-MM-DD'),
						// paperContractNo: this.baseInfoForm.paperContractNo,
						// status: this.baseInfoForm.status,
						// sellerName:this.VUEX_ST_COMPANYSUER.companyName,
						// buyerName:this.VUEX_MANUAL_ASSET_OBJ.buyerName,
						// acctBankName:this.currentAccountObj.bankName,
						// acctBankBranch:this.currentAccountObj.bankAccountName,
						// manualGoodsVOList:this.contractListDataSource,
						// list:this.fileListDataSource,
						// id:this.baseInfoForm.id||null

						// }
						callback(contractInfo);
					} catch (e) {
						console.error(e);
					}
				} else {
					this.$message.error('合同信息缺少必要内容');
				}
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
