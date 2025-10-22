<template>
	<div>
		<p class="title-wrap">合同基本信息</p>
		<a-form
			:form="form"
			:label-col="{ span: labelCol }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="合同编号">
						<a-input
							v-decorator="['contractNo']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="买方名称">
						<a-input
							v-decorator="['buyCompanyName']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="钢材种类">
						<a-input
							v-decorator="['steelTypeDesc']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="交提货地点">
						<a-input
							v-decorator="['deliveryPlace']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同期限">
						<a-input
							v-decorator="['effectiveStartDate']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="8">
          <a-form-item label="交提货方式">
            <a-input v-decorator="['deliveryModeDesc']" :disabled="disabledForm || disabledAll" />
          </a-form-item>
        </a-col> -->
				<a-col
					:span="8"
					v-show="contractDetails.steelType == 'FINISHED_STEEL'"
				>
					<a-form-item label="是否指定规格">
						<a-input
							v-decorator="['appointSpecDesc']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<p class="title-wrap">提货申请基本信息</p>
		<a-form
			:form="formApply"
			:label-col="{ span: labelCol }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<!-- <a-col :span="8">
          <a-form-item label="交提货期限">
            <a-input v-decorator="['validity']" :disabled="disabledApplyInfo || disabledAll" />
          </a-form-item>
        </a-col> -->
				<a-col :span="8">
					<a-form-item label="提货申请单号">
						<a-input
							v-decorator="['serialNo']"
							:disabled="disabledApplyInfo || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="申请企业">
						<a-input
							v-decorator="['createCompanyName']"
							:disabled="disabledApplyInfo || disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="申请时间">
						<a-input
							v-decorator="['createdDate']"
							:disabled="disabledApplyInfo || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="申请人">
						<a-input
							v-decorator="['createdName']"
							:disabled="disabledApplyInfo || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="提货方式">
						<a-input
							v-decorator="['takeType']"
							:disabled="disabledApplyInfo || disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<p class="title-wrap">申请提货清单</p>
		<p class="apply-title-wrap">
			<a-tabs
				default-active-key="1"
				style="width: 100%"
			>
				<a-tab-pane
					key="1"
					tab="货物清单"
				>
					<a-table
						class="contract-table-wrap"
						:columns="columns"
						:data-source="data"
						:pagination="false"
						:scroll="{ x: 1200, y: 240 }"
						rowKey="id"
						bordered
						v-if="typeModel != 'input' && realTakeStatusNo"
						:row-selection="typeModel != 'input' ? rowSelectionGoods : null"
					>
						<span
							slot="canTakePieceQuantity"
							slot-scope="text, record"
							v-if="record.materialName != '合计'"
						>
							{{ text || '/' }}
						</span>
						<span
							slot="theoreticalWeight"
							slot-scope="text, record"
							v-if="record.materialName != '合计'"
						>
							{{ text || '/' }}
						</span>
						<span
							slot="takeUnitPrice"
							slot-scope="text, record"
						>
							<a-input-number
								v-model="record.takeUnitPrice"
								:min="1"
								:max="99999999999999"
								size="small"
								v-if="record.materialName != '合计'"
								:disabled="disabledAll"
							/>
						</span>
						<span
							slot="goodTaxMount"
							slot-scope="text, record"
						>
							<span v-if="record.materialName != '合计'">
								{{
									Math.round(
										record.currentApplyQuantity *
											(record.takeUnitPrice && record.takeUnitPrice != '/' ? record.takeUnitPrice : 0) *
											100
									) / 100
								}}
							</span>
							<span v-else>
								{{ computedTotalAmountNumber }}
							</span>
						</span>
					</a-table>
					<a-table
						class="contract-table-wrap"
						:columns="columnsPut"
						:data-source="data"
						:pagination="false"
						:scroll="{ x: 1200, y: 240 }"
						:rowKey="record => record.mainId + record.id"
						bordered
						:row-selection="typeModel != 'input' ? rowSelectionGoods : null"
						v-else
					>
						<div
							slot="materialName"
							slot-scope="text, record"
						>
							<!-- 品名 -->
							<span v-if="record.realTakePieceQuantity == '合计'"></span>
							<span v-else>
								<!-- {{ record.materialName }} -->
								<span v-if="appointSpec == 1">{{ text }}</span>
								<a-select
									placeholder="请选择"
									v-else
									:disabled="['preview'].includes(typeModel)"
									v-model="record.materialName"
									style="width: 100%; min-width: 100px"
									:default-active-first-option="false"
								>
									<a-select-option
										v-for="item in materialNameList"
										:key="item"
										:value="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</span>
						</div>
						<!-- 规格 -->
						<span
							slot="specs"
							slot-scope="text, record"
						>
							<div v-if="record.realTakePieceQuantity == '合计'"></div>
							<div v-else>
								<span v-if="appointSpec == 1"> {{ text }}</span>
								<a-input
									v-else
									:disabled="['preview'].includes(typeModel)"
									placeholder="若无可输入/"
									v-model="record.specs"
								></a-input>
							</div>
						</span>

						<!-- 材质 -->
						<!-- 材质-->
						<template
							slot="materialTexture"
							slot-scope="text, record"
						>
							<div v-if="record.realTakePieceQuantity == '合计'"></div>
							<div v-else>
								<span v-if="appointSpec == 1">{{ text }}</span>
								<a-input
									v-else
									:disabled="['preview'].includes(typeModel)"
									placeholder="若无可输入/"
									v-model="record.materialTexture"
								></a-input>
							</div>
						</template>
						<!-- 产地 -->
						<template
							slot="placeOfOrigin"
							slot-scope="text, record"
						>
							<div v-if="record.realTakePieceQuantity == '合计'"></div>
							<div v-else>
								<span v-if="appointSpec == 1">{{ text }}</span>
								<a-input
									v-else
									:disabled="['preview'].includes(typeModel)"
									placeholder="若无可输入/"
									v-model="record.placeOfOrigin"
								></a-input>
							</div>
						</template>
						<!-- 预提捆包号 -->
						<template
							slot="baleNo"
							slot-scope="text, record"
						>
							<div v-if="record.realTakePieceQuantity == '合计'"></div>
							<div v-else>
								<span v-if="appointSpec == 1">{{ text }}</span>
								<a-input
									:disabled="['preview'].includes(typeModel)"
									placeholder="若无可输入/"
									v-model.trim="record.baleNo"
								></a-input>
							</div>
						</template>
						<!-- 预提件数 -->
						<template
							slot="currentApplyPieceQuantity"
							slot-scope="text, record"
						>
							<div v-if="record.realTakePieceQuantity == '合计'"></div>
							<div v-else>
								<span v-if="appointSpec == 1">{{ text }}</span>
								<a-input
									:disabled="['preview'].includes(typeModel)"
									placeholder="若无可输入/"
									v-model.trim="record.currentApplyPieceQuantity"
								></a-input>
							</div>
						</template>

						<!-- 预提数量 -->
						<template
							slot="currentApplyQuantity"
							slot-scope="text, record"
						>
							<div v-if="record.realTakePieceQuantity == '合计'"></div>
							<div v-else>
								<span v-if="appointSpec == 1">{{ text }}</span>
								<a-input
									:disabled="['preview'].includes(typeModel)"
									placeholder="若无可输入/"
									v-model.trim="record.currentApplyQuantity"
								></a-input>
							</div>
						</template>
						<span
							slot="realTakePieceQuantity"
							slot-scope="text, record"
						>
							<span v-if="text == '合计'">合计</span>
							<!-- 判断是否是核心企业 核心企业可以输入 / 和数字 -->
							<a-input
								v-model="record.realTakePieceQuantity"
								size="small"
								:disabled="['preview'].includes(typeModel)"
								:formatter="value => value && parseInt(value)"
								@blur="formateInputRealPieceOrQuantity(record, 'realTakePieceQuantity')"
								v-if="isCoreAndGeneral && text != '合计'"
							/>
							<a-input-number
								v-model="record.realTakePieceQuantity"
								:min="0"
								:max="99999999999999"
								:step="1"
								size="small"
								:disabled="['preview'].includes(typeModel)"
								:formatter="value => value && parseInt(value)"
								@blur="formateInputRealPieceOrQuantity(record, 'realTakePieceQuantity')"
								v-if="!isCoreAndGeneral && text != '合计'"
							/>
						</span>
						<span
							slot="realTakeQuantity"
							slot-scope="text, record"
						>
							<span v-if="text == '合计'">{{ computedTotalReal.realTakeQuantityTotal }}</span>
							<a-input-number
								v-model="record.realTakeQuantity"
								:min="0"
								:step="0.001"
								:max="99999999999999.999"
								size="small"
								:disabled="['preview'].includes(typeModel)"
								@blur="e => formateInputRealPieceOrQuantity(record, 'realTakeQuantity', e)"
								v-else
							/>
						</span>
						<!-- goodTaxMount -->
						<span
							slot="goodTaxMount"
							slot-scope="text, record"
						>
							<span v-if="text != '合计'">
								{{
									Math.round(
										record.currentApplyQuantity *
											(record.takeUnitPrice && record.takeUnitPrice != '/' ? record.takeUnitPrice : 0) *
											100
									) / 100
								}}
							</span>
							<span v-else>
								{{ computedTotalAmountNumber }}
							</span>
						</span>
						<template
							slot="action"
							slot-scope="text, record, index"
						>
							<div v-if="record.realTakePieceQuantity != '合计'">
								<span @click="addRow(index, record)">
									<a-icon
										type="plus-circle"
										style="color: var(--primary-color); font-size: 20px; margin-right: 15px; cursor: pointer"
								/></span>
								<span
									v-if="index > 0"
									@click="removeRow(index)"
									><a-icon
										type="minus-circle"
										style="color: red; font-size: 20px; cursor: pointer"
								/></span>
							</div>
						</template>
					</a-table>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="车船号"
					v-if="!['input', 'relation', 'oa'].includes(typeModel) && carInfoShow"
				>
					<a-table
						style="width: 100%"
						:columns="columnsCar"
						:data-source="dataCar"
						rowKey="id"
						:pagination="false"
						bordered
					>
					</a-table>
				</a-tab-pane>
			</a-tabs>
			<span style="position: absolute; right: 0">
				<a-button
					type="primary"
					icon="export"
					v-if="typeModel != 'input'"
					@click="goodsListExport"
					>导出</a-button
				>
				<span v-else>
					<a-button
						type="primary"
						icon="download"
						style="margin-right: 20px"
						@click="downloadRealTakeTemplateMethod"
						>导入模板下载</a-button
					>
					<a-upload
						name="file"
						:multiple="false"
						:action="action"
						:headers="headers"
						@change="handleApplyChange"
						style="margin-left: 20px"
						:accept="acceptFormatReal"
						:data="uploadQuerydata"
						:showUploadList="false"
					>
						<a-button type="primary"> <a-icon type="upload" /> 导入实提数量 </a-button>
					</a-upload>
				</span>
			</span>
		</p>
		<p class="contract-title">
			<span>提单基本信息</span>
		</p>
		<a-form
			:form="formType"
			:label-col="{ span: labelCol }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-apply-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="提货方式">
						<a-input
							v-decorator="[
								'takeType',
								{
									rules: [{ required: true, message: '请选择提货方式!' }]
								}
							]"
							placeholder="请选择提货方式"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="提单有效期">
						<a-range-picker
							style="width: 100%"
							v-decorator="[
								'validity',
								{
									rules: [{ required: true, message: '请选择提单有效期!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="结算方式">
						<a-input
							v-decorator="[
								'takeStatement',
								{
									rules: [{ required: false, message: '请输入结算方式!' }]
								}
							]"
							placeholder="请输入结算方式"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="制单员">
						<a-input
							:disabled="disabledAll"
							v-if="['preview'].includes(typeModel)"
							v-decorator="[
								'makePaperName',
								{
									rules: [{ required: true, message: '请选择制单员!' }]
								}
							]"
						></a-input>
						<a-select
							v-else
							show-search
							v-decorator="[
								'makePaperId',
								{
									rules: [{ required: true, message: '请选择制单员!' }]
								}
							]"
							placeholder="请选择制单员"
							:disabled="disabledAll"
						>
							<a-select-option
								:value="item.makePaperId"
								v-for="item in makePaperInfoList"
								:key="item.makePaperId"
							>
								{{ item.makePaperName }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓库简称">
						<a-select
							label-in-value
							show-search
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							:not-found-content="null"
							@search="handleWarehouseContractSearch"
							@change="handleWarehouseContractSearch"
							@dropdownVisibleChange="handleWarehouseContractSearchShow"
							v-decorator="[
								'warehouseLessorId',
								{
									rules: [{ required: true, message: '请选择制仓库简称!' }]
								}
							]"
							placeholder="请选择仓库简称"
							:disabled="disabledAll"
						>
							<a-select-option
								:value="item.warehouseLessorId"
								v-for="item in warehouseList"
								:key="item.warehouseLessorId"
							>
								{{ item.warehouseShortName }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						:gutter="24"
						style="position: relative"
					>
						<a-col :span="!isOaPage ? 24 : 24">
							<a-form-item label="提单样式模板">
								<a-select
									:style="{ width: !isOaPage ? '60%' : '100%' }"
									:disabled="previewBtnDisabled || disabledAll"
									v-decorator="[
										'takeTemplate',
										{
											rules: [
												{
													required: !previewBtnDisabled,
													message: '请选择制提单样式模板!'
												}
											]
										}
									]"
									placeholder="请选择提单样式模板"
									@change="templateChange"
								>
									<a-select-option
										:value="item.value"
										v-for="item in takeDeliveryTemplate"
										:key="item.value"
									>
										{{ item.label }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							v-if="!isOaPage"
							:span="8"
							style="position: absolute; right: -20px; margin: 4px 0 0 0"
						>
							<a-button
								v-if="!previewBtnDisabled"
								class="preview-btn"
								type="primary"
								:disabled="disabledAll"
								@click="templatePreview"
								v-show="templatePreviewBtn"
								>预览样式</a-button
							>
						</a-col>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-form-item label="备注">
						<a-input
							v-decorator="[
								'remark',
								{
									rules: [{ required: false, message: '请输入备注!' }]
								}
							]"
							placeholder="请输入结算方式"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="是否关联回款">
						<a-select
							v-decorator="[
								'isRelationCollection',
								{
									rules: [{ required: true, message: '请选择制是否关联回款!' }]
								}
							]"
							placeholder="请选择是否关联回款"
							@change="isRelationCollectionChange"
							:disabled="disabledAll"
						>
							<a-select-option value="1"> 关联回款 </a-select-option>
							<a-select-option value="2"> 暂不关联回款 </a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div v-if="isRelationCollectionShow">
			<a-table
				bordered
				class="contract-table-wrap"
				:columns="relationPayment"
				:pagination="false"
				:scroll="{ x: 1200, y: 240 }"
				:data-source="dataPayment"
				rowKey="claimRecordId"
				:row-selection="rowSelection"
			>
				<span
					slot="fundType"
					slot-scope="text, record"
				>
					<span v-if="text == '合计'">合计</span>
					<span v-else>{{ getFundTypeText(record.fundType || record.collectionType) }}</span>
				</span>
				<span
					slot="currentUseAmount"
					slot-scope="text, record"
				>
					<span v-if="record.claimRecordId == '合计'">{{ collectionTotal.currentUseAmountTotal }}</span>
					<a-input-number
						v-else
						v-model="record.currentUseAmount"
						:max="record.availableCollectionAmount"
						:min="0"
						size="small"
						:disabled="!selectedRowKeys.includes(record.claimRecordId) || (disabledAll && !['relation'].includes(typeModel))"
					/>
				</span>
				<span
					slot="availableCollectionAmount"
					slot-scope="text, record"
				>
					<span v-if="record.claimRecordId == '合计'">{{ collectionTotal.availableCollectionAmountTotal }}</span>
					<span v-else>{{ record.ifRefund ? '0(已退款)' : text }}</span>
				</span>
				<span
					slot="collectionAmount"
					slot-scope="text, record"
				>
					<span v-if="record.claimRecordId == '合计'">{{ collectionTotal.collectionAmountTotal }}</span>
					<span v-else>{{ text }}</span>
				</span>
			</a-table>
			<a-alert
				style="margin: 20px 0"
				:message="computedTotal"
				type="info"
			/>
		</div>
		<!-- 判断是否对接仓库 -->
		<div
			style="display: flex"
			v-if="['preview'].includes(typeModel) && takeDelivery.warehouseIsDocking"
		>
			<p
				class="contract-title"
				style="justify-content: flex-start"
			>
				<span>三方仓储运单明细</span>
				<a-button
					@click="openOutBound"
					type="link"
					>三方仓储提货明细</a-button
				>
			</p>
		</div>
		<div v-if="['upload', 'oa'].includes(typeModel) || currentStatus == '7'">
			<p class="contract-title">
				<span>提单附件</span>
				<a-button
					v-if="['oa'].includes(typeModel)"
					type="primary"
					@click="zipdownload"
					icon="download"
					>批量下载</a-button
				>
			</p>
			<a-table
				class="contract-table-wrap"
				:columns="columnsEnclosure"
				:pagination="false"
				:scroll="{ x: 1200, y: 240 }"
				:data-source="dataFileList"
				rowKey="fileId"
			>
				<span
					slot="methods"
					slot-scope="text, record"
				>
					<a-button
						type="link"
						@click="details(record)"
						v-if="false"
						>查看</a-button
					>
					<a-button type="link">
						<a
							href="javascript:;"
							@click="jumpDownload(record)"
							>下载</a
						>
					</a-button>
				</span>
			</a-table>
			<a-button
				type="dashed"
				block
				@click="showModal"
				v-if="['upload'].includes(typeModel)"
			>
				<a-icon type="plus" />新增附件
			</a-button>
		</div>
		<div v-if="['preview'].includes(typeModel)">
			<p class="title-wrap">操作历史</p>
			<!-- 日志 -->
			<Log :logList="operationHistory"></Log>
		</div>

		<div class="footer-btn-wrap">
			<p>
				<a-button
					@click="preview"
					v-if="showPreviewBtn"
					>提单预览</a-button
				>
				<a-button
					@click="prev"
					style="margin-left: 40px"
					v-if="!isOaPage"
					>返回</a-button
				>

				<a-button
					style="margin-left: 40px"
					v-if="!isOaPage && !['input', 'upload', 'relation', 'preview', 'oa'].includes(typeModel)"
					@click="checkIsRelation(1)"
					:loading="disabledSubmit"
					>保存</a-button
				>
				<a-button
					type="primary"
					v-if="!isOaPage && !['preview', 'oa'].includes(typeModel)"
					style="margin-left: 40px"
					@click="checkIsRelation(2)"
					:loading="disabledSubmit"
					>提交</a-button
				>
				<a-button
					type="primary"
					v-if="!isOaPage && !['preview', 'oa', 'edit', 'input', 'upload', 'relation'].includes(typeModel)"
					style="margin-left: 40px"
					@click="reject"
					>驳回</a-button
				>
			</p>
		</div>
		<upload
			ref="upload"
			:fileTypeList="fileTypeList"
			v-on:add-file="addFile"
			:acceptFormat="acceptFormat"
		/>
		<template-modal ref="template" />
		<preview
			ref="preview"
			type="base64"
		/>
		<void-dialog
			:fn="fn"
			label="驳回"
			paramsKey="remark"
			ref="voidDialog"
			v-on:update="prev"
		/>
		<OutboundModal ref="outboundModal"></OutboundModal>
	</div>
</template>

<script>
import VoidDialog from '../components/voidDialog.vue';
import Pagination from '../components/pagination.vue';
import Upload from '../components/upload.vue';
import OutboundModal from '../components/outboundModal.vue';
import moment from 'moment';
import {
	columns,
	columnsCar,
	relationPayment,
	columnsEnclosure,
	columnsPutApp,
	columnsPutNoApp,
	columnsOperation
} from '../config/orderStep2';
import {
	getConstractDetailsById, //获取合同详情
	getShowTakeDeliveryInfo, //提货单查看详情
	getStartByLessor, //仓库简称下拉
	getMakePaperInfo, //查看该企业下制单员的信息
	takeDeliveryPreview, //提单预览
	takeDeliverySaveOrSubmit, //保存or提交
	findCollectionByContractNo, //查看回款信息
	checkCollection, //校验回款信息是否双签
	showTakeDeliveryInfo, //提货单查看详情
	realTake, //实提
	uploadAttach, //提单上传附件
	addCollection, //添加回款（审核、待提交状态）
	checkBusinessLine, //验证是否关联采购合同
	downloadRealTakeTemplate, //实提模板下载
	takePurchaseExport, //提单中货物清单导出
	batchDownload, //提单OA批量下载附件
	takeSelectPurchaseExport, //提单导出勾选的提货明细信息
	getBatchAttachList, //提单OA附件列表
	rejectTakeGoods,
	API_SteelsDownloadFilesPath,
	API_GETLOGINBYMOBILE
} from '@/v2/center/steels/api/orderApply';
import { debounce } from 'lodash';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import TemplateModal from './template.vue';
import Preview from '../components/preview.vue';
import ENV from '@/v2/config/env';
import { nanoid } from 'nanoid';
import { mapMutations, mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { cloneDeep } from 'lodash';
import Log from '@/v2/center/steels/components/Log.vue';
export default {
	name: 'step2',
	props: {
		labelCol: {
			type: Number,
			default: 8
		},
		isOaPage: {
			type: Boolean,
			default: false
		},
		selectItem: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			formApply: this.$form.createForm(this, { name: 'formApply' }),
			formType: this.$form.createForm(this, { name: 'formType' }),
			formCar: this.$form.createForm(this, { name: 'formCar' }),
			data: [],
			dataCar: [],
			dataList: [],
			columns,
			columnsCar,
			relationPayment,
			columnsEnclosure,
			columnsOperation,
			selectedRowKeys: [],
			isRelationCollectionShow: false,
			purchaseList: [],
			dataPayment: [],
			warehouseList: [],
			previewBtnDisabled: false,
			makePaperInfoList: [],
			dataFileList: [],
			computedTotalAmountNumber: 0,
			takeDeliveryTemplate: filterCodeBySteelKey('takeDeliveryTemplate'),
			takeType: filterCodeBySteelKey('takeType'),
			fundType: filterCodeBySteelKey('fundType'),
			messageList: {
				1: '保存成功',
				2: '提交成功'
			},
			dataEnclosure: [],
			contractDetails: [],
			takeDeliveryApply: {},
			disabledSubmit: false,
			fileTypeList: [
				{
					value: 'BILL_OF_LADING',
					text: '提货单(已盖章)'
				}
			],
			templatePreviewBtn: false,
			realTakeStatusNo: true, //没有实提
			carInfoShow: true,
			appointSpecDescShow: true,
			takeDelivery: {},
			showPreviewBtn: true,
			acceptFormat: '.png,.jpeg,.jpg,.gif',
			action: `${ENV.BASE_GANG_API}/takeDelivery/realTakeImport`,
			acceptFormatReal: '.xlsx,.xls',
			selectedRowKeysGoods: [],
			fn: rejectTakeGoods,
			// 操作日志
			operationHistory: [],
			outboundRecords: [],
			// 判断 提货申请 是否指定规格
			appointSpec: 0,
			materialNameList: []
		};
	},
	mounted() {
		this.oaDetails();
	},
	watch: {
		selectItem: {
			async handler(newValue) {
				if (this.$route.query.type == 'oa') {
					return;
				}
				if (Object.keys(newValue).length) {
					// 新建提单
					const { contractId, serialNo } = newValue;
					if (contractId && serialNo) {
						await this.getContractDetails(contractId, serialNo);
						this.getContractGoodsList(serialNo);
					} else {
						this.$message.warning('id不存在');
					}
				}
			},
			immediate: true,
			deep: true
		},
		data: {
			async handler(newValue) {
				if (newValue.length) {
					this.computedTotalAmount(newValue);
				}
			},
			deep: true
		}
	},
	computed: {
		isCoreAndGeneral() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		uploadQuerydata() {
			return {
				contractId: this.$route.query.contractId,
				serialNo: this.$route.query.id
			};
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		rowSelectionGoods() {
			const { selectedRowKeysGoods } = this;
			return {
				selectedRowKeysGoods,
				onChange: this.onSelectChangeGoods,
				hideDefaultSelections: true,
				type: 'checkbox',
				selections: [],
				getCheckboxProps: record => ({
					props: {
						disabled: record.id == '合计'
					}
				})
			};
		},
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				type: 'checkbox',
				selections: [],
				onSelection: this.onSelection,
				getCheckboxProps: record => ({
					props: {
						disabled: ['preview', 'input', 'oa'].includes(this.$route.query.type) || record.fundType == '合计' || record.ifRefund
					}
				})
			};
		},
		typeModel() {
			return this.$route.query.type;
		},
		disabledForm() {
			return this.selectItem?.contractId || this.$route.query.contractId ? true : false;
		},
		disabledApplyInfo() {
			return this.selectItem?.serialNo || this.$route.query.serialNo ? true : false;
		},
		computedTotal() {
			// 本次使用回款金额
			const collectionAmountTotal = this.dataPayment.slice(0, this.dataPayment.length - 1).reduce((pre, cur) => {
				return (
					pre +
					(this.selectedRowKeys.includes(cur.claimRecordId) ? (cur.currentUseAmount <= 0 ? 0 : cur.currentUseAmount) || 0 : 0)
				);
			}, 0);
			// 预提货物含税金额
			const taxAmountTotal = this.data.slice(0, this.data.length - 1).reduce((pre, cur) => {
				return pre + (cur.currentApplyQuantity || 0) * (cur.takeUnitPrice && cur.takeUnitPrice !== '/' ? cur.takeUnitPrice : 0);
			}, 0);
			return `本次使用回款金额 - 预提货物含税金额 = ${Math.round(collectionAmountTotal * 100) / 100} - ${Math.round(taxAmountTotal * 100) / 100} = ${
				Math.round((collectionAmountTotal - taxAmountTotal) * 100) / 100
			}`;
		},
		disabledAll() {
			return ['preview', 'upload', 'input', 'relation', 'oa'].includes(this.$route.query.type);
		},
		// 计算实提数量累加
		computedTotalReal() {
			const computedDataList = this.data.slice(0, this.data.length - 1);
			// 实提数量
			const realTakeQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (Number(cur.realTakeQuantity) || 0);
			}, 0);
			// 可提件数
			const availablePieceQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.availablePieceQuantity || 0);
			}, 0);
			// 预提件数
			const currentApplyPieceQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.currentApplyPieceQuantity || 0);
			}, 0);
			// 可提数量
			const availableQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.availableQuantity || 0);
			}, 0);
			// 预提数量
			const currentApplyQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.currentApplyQuantity || 0);
			}, 0);
			// 预提货物含税金
			const goodTaxMountTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.goodTaxMount || 0);
			}, 0);
			return {
				realTakeQuantityTotal: Math.round(realTakeQuantityTotal * 1000) / 1000,
				availablePieceQuantityTotal,
				currentApplyPieceQuantityTotal,
				availableQuantityTotal,
				currentApplyQuantityTotal: Math.round(currentApplyQuantityTotal * 1000) / 1000,
				goodTaxMountTotal
			};
		},
		// 回款信息计算
		collectionTotal() {
			const tempList = this.dataPayment.slice(0, this.dataPayment.length - 1);
			// 回款金额
			const collectionAmountTotal = tempList.reduce((pre, cur) => {
				return pre + (this.selectedRowKeys.includes(cur.claimRecordId) ? cur.collectionAmount || 0 : 0);
			}, 0);
			// 可使用回款金额
			const availableCollectionAmountTotal = tempList.reduce((pre, cur) => {
				return pre + (this.selectedRowKeys.includes(cur.claimRecordId) ? cur.availableCollectionAmount || 0 : 0);
			}, 0);
			// 本次使用回款金额
			const currentUseAmountTotal = tempList.reduce((pre, cur) => {
				return (
					pre +
					(this.selectedRowKeys.includes(cur.claimRecordId) ? (cur.currentUseAmount <= 0 ? 0 : cur.currentUseAmount) || 0 : 0)
				);
			}, 0);
			return {
				collectionAmountTotal: Math.round(collectionAmountTotal * 100) / 100,
				availableCollectionAmountTotal: Math.round(availableCollectionAmountTotal * 100) / 100,
				currentUseAmountTotal: Math.round(currentUseAmountTotal * 100) / 100
			};
		},
		currentStatus() {
			return this.$route.query.status || '';
		},
		// 判断是否是不是废钢 并且未指定规格
		isSpecial() {
			return this.takeDeliveryApply.steelType != 'SCRAP_STEEL' && this.takeDeliveryApply.appointSpec == 0;
		},
		// 实提
		columnsPut() {
			if (this.appointSpec == 1) {
				return columnsPutApp;
			}
			return columnsPutNoApp;
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		jumpDownload(record) {
			// 单一附件信息下载附件
			const fileFormat = record.fileUrl.split('?')[0].split('.').pop().toLowerCase();
			API_SteelsDownloadFilesPath({ filePath: record.fileUrl }).then(res => {
				comDownload(res, null, `${record.fileName}.${fileFormat}`);
			});
		},
		formateInputRealPieceOrQuantity(item, type, e) {
			let index = null;
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i].id == item.id) {
					index = i;
					break;
				}
			}

			let cloneItem = cloneDeep(item);
			/** 判断 实提件数 是否是 / */
			if (type == 'realTakePieceQuantity' && item.realTakePieceQuantity != '/') {
				let reg = /^[0-9]*[1-9][0-9]*$/;
				if (item.realTakePieceQuantity < 0 || item.realTakePieceQuantity > 99999999999999) {
					item.realTakePieceQuantity = 0;
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
			}
			if (type == 'realTakePieceQuantity' && item.realTakePieceQuantity == '/') {
				cloneItem[type] = '/';
			} else {
				cloneItem[type] = item[type];
			}

			if (type == 'realTakeQuantity') {
				cloneItem.realTakeQuantity = e.target.value;
			}
			this.$set(this.data, index, cloneItem);
		},
		onSelectChangeGoods(keys) {
			this.selectedRowKeysGoods = keys;
		},
		zipdownload() {
			batchDownload({
				contractId: this.contractDetails.contractId,
				serialNo: this.$route.query.id
			}).then(res => {
				comDownload(res, null, `${moment().format('YYYYMMDD')}提单附件.rar`);
			});
		},
		goodsListExport() {
			if (this.selectedRowKeysGoods.length) {
				takeSelectPurchaseExport({
					serialNo: this.$route.query.id || '',
					idList: this.selectedRowKeysGoods.join(',')
				}).then(res => {
					comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
				});
			} else {
				takePurchaseExport({
					appleTakeSerialNo: this.$route.query.serialNo || this.selectItem.serialNo,
					serialNo: this.$route.query.id || ''
				}).then(res => {
					comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
				});
			}
		},
		handleApplyChange({ file }) {
			if (file) {
				const { response } = file;
				if (response?.success) {
					this.$message.success('导入成功');
					const tempData = file.response.data;
					const currentData = cloneDeep(this.data);
					for (let j = 0; j < currentData.length; j++) {
						for (let i = 0; i < tempData.length; i++) {
							if (currentData[j].purchaseId == tempData[i].purchaseId) {
								if (tempData[i].realTakePieceQuantity) {
									if (typeof tempData[i].realTakePieceQuantity == 'number') {
										currentData[j].realTakePieceQuantity = Math.round(tempData[i].realTakePieceQuantity * 1000) / 1000;
									} else {
										currentData[j].realTakePieceQuantity = tempData[i].realTakePieceQuantity;
									}
								}
								if (tempData[i].realTakeQuantity) {
									currentData[j].realTakeQuantity = Math.round(tempData[i].realTakeQuantity * 1000) / 1000;
								}
							}
						}
					}
					this.data = currentData;
				}
				if (response?.error) {
					this.$message.error(`导入失败:${file.response.error.message}`);
				}
			}
		},
		downloadRealTakeTemplateMethod() {
			downloadRealTakeTemplate({
				serialNo: this.$route.query.id
			}).then(res => {
				comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
			});
		},
		// 模板选择改变
		templateChange(type) {
			if (type == 'OTHER') {
				this.templatePreviewBtn = false;
				this.showPreviewBtn = false;
			} else {
				this.templatePreviewBtn = true;
				this.showPreviewBtn = true;
			}
		},
		// 提单模板预览
		templatePreview() {
			this.$refs.template.show();
		},
		// 回款添加
		collectionAdd() {
			addCollection({
				serialNo: this.$route.query.id,
				takeCollectionList: this.getRelationCollectionList()
			}).then(res => {
				if (res.success) {
					this.$message.success('关联回款完成');
					this.$router.back();
				}
			});
		},
		// 添加文件列表
		addFile(item) {
			this.fileTypeList.forEach(el => {
				if (el.value == item.type) {
					item.typeDesc = el.text;
				}
			});
			this.dataFileList.push(item);
		},
		// 提单上传附件
		takeUploadFile() {
			this.disabledSubmit = true;
			const { num, id } = this.$route.query;
			uploadAttach({
				id: num,
				takeSerialNo: id,
				attachList: this.dataFileList
			})
				.then(res => {
					if (res.success) {
						this.$message.success('上传成功');
						this.$router.back();
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
				});
		},
		// 实提
		relaTakeData() {
			const realTakeList = this.data.slice(0, this.data.length - 1);
			let realTakeQuantity = 0;
			realTakeList.forEach(el => {
				realTakeQuantity += el.realTakeQuantity || 0;
			});
			if (realTakeQuantity <= 0) {
				this.$message.warning('实提数量总和不能为0');
				return;
			}
			this.disabledSubmit = true;
			const { num, serialNo } = this.$route.query;
			const purchaseRelList = this.data.slice(0, this.data.length - 1);
			const newPurchaseRelList = JSON.parse(JSON.stringify(purchaseRelList));
			newPurchaseRelList.forEach(el => {
				el.realTakePieceQuantity = el.realTakePieceQuantity == '/' ? null : el.realTakePieceQuantity;
				el.excludingTaxAmount = el.excludingTaxAmount == '/' ? null : el.excludingTaxAmount;
				el.presetUnitPrice = el.presetUnitPrice == '/' ? null : el.presetUnitPrice;
				el.takeUnitPrice = el.takeUnitPrice == '/' ? null : el.takeUnitPrice;
				el.canTakePieceQuantity = el.canTakePieceQuantity == '/' ? null : el.canTakePieceQuantity;
				el.currentApplyPieceQuantity = el.currentApplyPieceQuantity == '/' ? null : el.currentApplyPieceQuantity;
				el.theoreticalWeight = el.theoreticalWeight == '/' ? null : el.theoreticalWeight;
				el.canTakeQuantity = el.canTakeQuantity == '/' ? null : el.canTakeQuantity;
			});
			realTake({
				id: num,
				appointSpec: this.appointSpec,
				serialNo: serialNo,
				purchaseRelList: newPurchaseRelList
			})
				.then(res => {
					if (res.success) {
						this.$message.success('实提成功');
						this.$router.back();
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
				});
		},
		// 查看提单详情
		detailsInfo() {
			return showTakeDeliveryInfo({
				serialNo: this.$route.query.id
			}).then(res => {
				if (res.success) {
					const {
						takeType,
						takeStartDate,
						takeEndDate,
						takeStatement,
						makePaperId,
						warehouseLessorId,
						takeTemplate,
						remark,
						isRelationCollection,
						realTakeStatus,
						warehouseShortName,
						makePaperName
					} = res.data.takeDelivery;
					this.operationHistory = res.data.operationHistory || [];
					this.takeDelivery = res.data.takeDelivery;
					// 出库记录
					this.outboundRecords = res.data.outboundRecords || [];
					if (this.takeDelivery.takeTemplate != 'TAKE_DELIVERY_TEMPLAT_1') {
						this.showPreviewBtn = false;
					} else {
						if (['1', '2', '5'].includes(this.$route.query.status)) {
							this.showPreviewBtn = true;
						} else {
							this.showPreviewBtn = false;
						}
					}
					let takeDeliveryApply = res.data.takeDeliveryApply || {};
					this.takeDeliveryApply = takeDeliveryApply;
					this.formApply.setFieldsValue({
						serialNo: takeDeliveryApply.serialNo,
						createCompanyName: takeDeliveryApply.createCompanyName,
						createdDate: takeDeliveryApply.createdDate,
						createdName: takeDeliveryApply.createdName,
						takeType: this.getSteelTypeText(takeDeliveryApply.takeType)
					});
					this.formType.setFieldsValue({
						takeType,
						validity: [moment(takeStartDate), moment(takeEndDate)],
						takeStatement,
						makePaperId: makePaperId,
						makePaperName,
						warehouseLessorId: {
							key: warehouseLessorId,
							label: warehouseShortName
						},
						takeTemplate,
						remark,
						isRelationCollection: isRelationCollection.toString()
					});
					res.data.takeDeliveryPurchaseRelList.forEach(el => {
						el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}_${el.baleNo}`;
						el.canTakeQuantity = el.canTakeQuantity ? el.canTakeQuantity : '/';
					});
					let takeDeliveryPurchaseRelList = res.data.takeDeliveryPurchaseRelList || [];
					this.getMaterialNameList(res.data.takeDeliveryPurchaseRelList);

					for (let i = 0; i < takeDeliveryPurchaseRelList.length; i++) {
						for (let j = 0; j < this.purchaseList.length; j++) {
							const currentItem = takeDeliveryPurchaseRelList[i];
							if (
								currentItem.purchaseId == this.purchaseList[j].purchaseId ||
								currentItem.mainId == this.purchaseList[j].mainId
							) {
								currentItem.excludingTaxAmount = this.purchaseList[j].excludingTaxAmount;
								// 新建状态下单价取合同单价
								if (!this.$route.query?.type) {
									currentItem.takeUnitPrice = this.purchaseList[j].presetUnitPrice || '/';
									currentItem.presetUnitPrice = this.purchaseList[j].presetUnitPrice || '/';
								}
								currentItem.availablePieceQuantity = this.purchaseList[j].availablePieceQuantity;
								currentItem.availableQuantity = this.purchaseList[j].availableQuantity;
								// 如果预提数量是数字 则 实提数量置空
								if (typeof currentItem.currentApplyPieceQuantity == 'number' && !['preview'].includes(this.typeModel)) {
									currentItem.realTakePieceQuantity = '';
								} else {
									currentItem.realTakePieceQuantity =
										currentItem.realTakePieceQuantity == undefined || currentItem.realTakePieceQuantity == null
											? '/'
											: currentItem.realTakePieceQuantity;
								}
							} else {
								currentItem.presetUnitPrice = currentItem.presetUnitPrice || '/';
								currentItem.excludingTaxAmount = currentItem.excludingTaxAmount || '/';
							}
						}
					}

					this.data = this.computedGoodsListTotal(takeDeliveryPurchaseRelList);

					if (realTakeStatus != 'NO_SUBMIT') {
						this.realTakeStatusNo = false;
						this.data[this.data.length - 1].realTakePieceQuantity = '合计';
						this.data[this.data.length - 1].realTakeQuantity = '合计';
					}
					this.carInfoShow = this.takeDeliveryApply.takeType == 'CARSHIPNO';
					this.dataCar = [];
					if (this.carInfoShow) {
						res.data.takeDeliveryModelList.forEach((item, index) => {
							item.id = index + 1;
							this.dataCar.push(item);
						});
					}
					if (isRelationCollection == 1) {
						this.isRelationCollectionShow = true;
						this.templatePreviewBtn = true;
						res.data.collectionList.forEach(item => {
							item.id = nanoid(4);
							item.availableCollectionAmount = (item.availableCollectionAmount || 0) + (item.currentUseAmount || 0);
						});
						this.dataPayment = res.data.collectionList;
						//  预览 情况 只展示 选择的
						if (this.typeModel == 'preview') {
							this.dataPayment = res.data.collectionList.filter(el => el.exists);
						}

						const tempList = [];
						res.data.collectionList.forEach(item => {
							if (item.exists) {
								tempList.push(item.claimRecordId);
							}
						});
						this.selectedRowKeys = tempList;
						this.dataPayment.push({
							claimRecordId: '合计',
							fundType: '合计'
						});
					}
					this.getAttachListOfOa(res.data);
					if (res.data.takeDelivery.pdfPath) {
						this.dataFileList.push({
							type: '提单',
							typeDesc: '提单',
							fileId: String((Math.random() * 1000 + 1000).toFixed(0)),
							fileName: '提单标准模板',
							fileUrl: `${res.data.takeDelivery.pdfPath}`
						});
					}
					if (isRelationCollection == 2 && this.typeModel == 'relation') {
						this.formType.setFieldsValue({
							isRelationCollection: '1'
						});
						this.isRelationCollectionShow = true;
					}
					this.carInfoShow = this.takeDeliveryApply.takeType == 'CARSHIPNO';
					if (this.carInfoShow) {
						res.data.takeDeliveryModelList.forEach((item, index) => {
							item.id = index + 1;
							this.dataCar.push(item);
						});
					}
				}
			});
		},
		// 驳回
		reject() {
			this.$refs.voidDialog.showModal(this.selectItem);
		},
		// oa获取附件列表
		getAttachListOfOa(data) {
			if (this.$route.query.type == 'oa') {
				getBatchAttachList({
					contractId: this.contractDetails.contractId,
					serialNo: this.$route.query.id
				}).then(res => {
					if (res.success) {
						const tempList = [];
						res.data.forEach(item => {
							tempList.push({
								type: item.fileType,
								fileId: nanoid(4),
								fileName: item.fileName,
								fileUrl: `${item.filePath}`,
								typeDesc: '提货单(已盖章)'
							});
						});
						this.dataFileList = tempList;
					}
				});
			} else {
				this.dataFileList = data?.attachList || [];
			}
			this.dataFileList.forEach(el => {
				const item = this.fileTypeList.find(el2 => el2.value == el.type);
				if (item) {
					el.typeDesc = item.text;
				}
			});
		},
		// 根据保证金类型返回保证金类型文案
		getFundTypeText(value) {
			for (let i = 0; i < this.fundType.length; i++) {
				if (this.fundType[i].value == value) {
					return this.fundType[i].label;
				}
			}
		},
		// 获取勾选的回款列表
		getSelectedPayList() {
			let result = [];
			this.dataPayment.forEach(item => {
				if (this.selectedRowKeys.includes(item.claimRecordId)) {
					result.push(item);
				}
			});
			return result;
		},
		// 验证是否关联采购合同
		checkRelationContract() {
			return checkBusinessLine({
				contractNo: this.contractDetails.contractNo,
				id: this.selectItem.contractId || this.$route.query.contractId
			});
		},
		// 校验是否双签
		async checkCollectionResult(type) {
			let res = await checkCollection({
				contractNo: this.contractDetails.contractNo,
				takeCollectionList: this.getSelectedPayList(),
				contractId: parseInt(this.$route.query.contractId) || parseInt(this.contractDetails?.contractId)
			});
			if (res.data.checkResult) {
				this.save(type);
			} else {
				res = await this.checkRelationContract();
				if (res.data) {
					if (this.typeModel == 'relation') {
						this.collectionAdd();
					} else {
						this.save(type);
					}
				} else {
					this.$message.warning('当前合同没有关联采购合同,请先关联采购合同');
				}
			}
		},
		// 查看回款信息
		async getFindCollectionByContractNo(no, applySerialNo) {
			const params = {
				contractId: no,
				takeDeliveryId: this.$route.query.num,
				applySerialNo: applySerialNo || this.$$route.query.serialNo
			};
			const res = await findCollectionByContractNo(params);
			res.data.forEach((item, index) => {
				item.id = index.toString();
			});
			this.dataPayment = res.data;
			this.dataPayment.push({
				claimRecordId: '合计',
				fundType: '合计'
			});
			return res;
			// return findCollectionByContractNo({
			//   contractId: no,
			// }).then((res) => {
			//   if (res.success) {
			//     res.data.forEach((item, index) => {
			//       item.id = index.toString();
			//     });
			//     this.dataPayment = res.data;
			//     this.dataPayment.push({
			//       claimRecordId: "合计",
			//       fundType: "合计",
			//     });
			//   }
			// });
		},
		// 根据提货type获取提货value
		getSteelTypeText(type) {
			for (let i = 0; i < this.takeType.length; i++) {
				if (this.takeType[i].value == type) {
					return this.takeType[i].label;
				}
			}
		},
		// 预提货物含税金额(元)
		computedTotalAmount(list) {
			const total = list.slice(0, list.length - 1).reduce((prv, cur) => {
				return (
					prv +
					((cur.currentApplyQuantity == '/' ? 0 : cur.currentApplyQuantity) || 0) *
						((cur.takeUnitPrice == '/' ? 0 : cur.takeUnitPrice) || 0)
				);
			}, 0);
			this.computedTotalAmountNumber = Math.round(total * 100) / 100;
		},
		// 获取提单员
		getMakePaperList() {
			getMakePaperInfo({}).then(res => {
				if (res.success) {
					this.makePaperInfoList = res.data;
				}
			});
		},
		handleWarehouseContractSearchShow(value) {
			if (value) {
				getStartByLessor({
					warehouseShortName: ''
				}).then(res => {
					if (res.success) {
						this.warehouseList = res.data;
					}
				});
			}
		},
		// 获取仓库简称
		handleWarehouseContractSearch: debounce(function (value) {
			if (value.key == 0) {
				this.previewBtnDisabled = true;
				this.showPreviewBtn = false;
				this.formType.setFieldsValue({
					takeTemplate: 'OTHER'
				});
			} else {
				this.previewBtnDisabled = false;
				this.showPreviewBtn = true;
				this.formType.setFieldsValue({
					takeTemplate: ''
				});
			}
			getStartByLessor({
				warehouseShortName: value || value?.label?.replace(/\n/g, '')?.trim()
			}).then(res => {
				if (res.success) {
					this.warehouseList = res.data;
				}
			});
		}, 300),
		// reduce计算求和
		addTotal(type, list) {
			return list.reduce((prv, cur) => {
				if (cur[type] == '/') {
					return prv + 0;
				}
				return prv + (cur[type] || 0);
			}, 0);
		},
		// 计算货物清单table统计行
		computedGoodsListTotal(list) {
			// 可提件数
			const availablePieceQuantityTotal = this.addTotal('availablePieceQuantity', list);
			// 预提件数
			const currentApplyPieceQuantityTotal = this.addTotal('currentApplyPieceQuantity', list);
			// 可提数量(吨)
			const availableQuantityTotal = this.addTotal('availableQuantity', list);
			// 预提数量(吨)
			const currentApplyQuantityTotal = this.addTotal('currentApplyQuantity', list);
			if (this.typeModel == 'input') {
				list.push({
					id: '合计',
					realTakePieceQuantity: '合计',
					realTakeQuantity: '合计',
					availablePieceQuantity: availablePieceQuantityTotal,
					currentApplyPieceQuantity: currentApplyPieceQuantityTotal,
					availableQuantity: availableQuantityTotal,
					currentApplyQuantity: Math.round(currentApplyQuantityTotal * 1000) / 1000,
					goodTaxMount: '合计'
				});
			} else {
				list.push({
					id: '合计',
					materialName: '合计',
					availablePieceQuantity: availablePieceQuantityTotal,
					currentApplyPieceQuantity: currentApplyPieceQuantityTotal,
					availableQuantity: availableQuantityTotal,
					currentApplyQuantity: Math.round(currentApplyQuantityTotal * 1000) / 1000,
					goodTaxMount: '合计'
				});
			}
			return list;
		},
		// 获取提提交post传参
		getPostData() {
			const formTypeValues = this.formType.getFieldsValue();
			if (formTypeValues.validity?.length) {
				formTypeValues.takeStartDate = moment(formTypeValues.validity[0]).format('YYYY-MM-DD');
				formTypeValues.takeEndDate = moment(formTypeValues.validity[1]).format('YYYY-MM-DD');
			}
			delete formTypeValues.validity;
			formTypeValues.warehouseShortName = formTypeValues?.warehouseLessorId?.label?.replace(/\n/g, '')?.trim();
			formTypeValues.warehouseLessorId = formTypeValues?.warehouseLessorId?.key;
			const makePaperInfo = this.getMakePaperNameById();
			return {
				...formTypeValues,
				applyTakeSerialNo: this.$route.query.serialNo || this.selectItem.serialNo,
				pieceQuantityTotal: this.data[this.data.length - 1].currentApplyPieceQuantity,
				quantityTotal: this.data[this.data.length - 1].currentApplyQuantity,
				contractTakeType: this.contractDetails.deliveryMode,
				makePaperName: makePaperInfo.makePaperName,
				makePaperPhone: makePaperInfo.mobile,
				makePaperEmail: makePaperInfo.email,
				contractNo: this.contractDetails.contractNo,
				buyCompanyUscc: this.contractDetails.buyCompanyUscc,
				buyCompanyName: this.contractDetails.buyCompanyName,
				applyCompanyName: this.takeDeliveryApply.createCompanyName
			};
		},
		// 获取仓库简称
		getWareHouseNameById() {
			const id = this.formType.getFieldValue('warehouseLessorId');
			for (let i = 0; i < this.warehouseList.length; i++) {
				if (this.warehouseList[i].warehouseLessorId == id) {
					return this.warehouseList[i].warehouseShortName;
				}
			}
		},
		// 获取制单员名称
		getMakePaperNameById() {
			// const id = this.formType.getFieldValue("makePaperId");
			const id = this.formType.getFieldValue('makePaperId');
			const item = this.makePaperInfoList.find(el => el.makePaperId == id) || {};
			return item;
		},
		// 获取关联回款
		getRelationCollectionList() {
			let result = [];
			this.dataPayment.forEach(item => {
				if (this.selectedRowKeys.includes(item.claimRecordId)) {
					result.push(item);
				}
			});
			return result;
		},
		// 是否是关联回款和勾选保证金类型
		checkIsRelation(t) {
			if (this.typeModel == 'upload') {
				this.takeUploadFile();
				return;
			}
			let tempList = cloneDeep(this.data.slice(0, this.data.length - 1));
			const flag2 = tempList.some(el => {
				if (!el.materialName || !el.specs || !el.materialTexture || !el.placeOfOrigin || !el.metrologyWay) {
					return true;
				}
			});
			if (flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			if (this.typeModel == 'input') {
				this.relaTakeData();
				return;
			}
			const list = this.getRelationCollectionList();
			const types = list.map(item => item.fundType);
			const type = this.formType.getFieldValue('isRelationCollection');
			const flagList = list.map(item => item.currentUseAmount);
			if (type == 1 && list.length <= 0) {
				this.$message.warning('请勾选要关联的回款信息');
				return;
			}
			if (flagList.includes(undefined) || flagList.includes(null)) {
				this.$message.warning('本次使用回款金额不能为空');
				return;
			}
			if (type == 1 && types.includes('BOND')) {
				this.checkCollectionResult(t);
			} else {
				if (this.typeModel == 'relation') {
					this.collectionAdd();
				} else {
					this.save(t);
				}
			}
		},
		// 计算含税金额record.currentApplyQuantity * record.takeUnitPrice
		computedGoodTaxMount() {
			let tempList = cloneDeep(this.data.slice(0, this.data.length - 1));
			tempList.forEach(item => {
				item.goodTaxMount =
					item.currentApplyQuantity * (item.takeUnitPrice && (item.takeUnitPrice != '/' ? item.takeUnitPrice : 0));
				item.realTakePieceQuantity = item.realTakePieceQuantity == '/' ? null : item.realTakePieceQuantity;
				item.presetUnitPrice = item.presetUnitPrice == '/' ? null : item.presetUnitPrice;
				item.excludingTaxAmount = item.excludingTaxAmount == '/' ? null : item.excludingTaxAmount;
				item.theoreticalWeight = item.theoreticalWeight == '/' ? null : item.theoreticalWeight;
				item.canTakeQuantity = item.canTakeQuantity == '/' ? null : item.canTakeQuantity;
				item.takeUnitPrice = item.takeUnitPrice == '/' ? null : item.takeUnitPrice;
			});
			return tempList;
		},
		// 保存or提交
		save(type) {
			this.formType.validateFields((err, values) => {
				if (!err) {
					// 是否是关联回款和勾选保证金类型
					this.disabledSubmit = true;
					takeDeliverySaveOrSubmit({
						serialNo: this.$route.query.id,
						id: this.$route.query.num || null,
						saveOrSubmit: type,
						...this.getPostData(),
						takeDeliveryPurchaseRelList: this.computedGoodTaxMount(),
						takeCollectionList: this.getRelationCollectionList(),
						contractId: this.$route.query.contractId || this.contractDetails?.contractId
					})
						.then(res => {
							if (res.success) {
								this.$message.success({
									content: this.messageList[type],
									onClose: () => {
										this.next();
									}
								});
							}
						})
						.finally(() => {
							this.disabledSubmit = false;
						});
				}
			});
		},
		// 根据是否关联回款显示预览样式
		isRelationCollectionChange(value) {
			if (value == 1) {
				this.isRelationCollectionShow = true;
			} else {
				this.isRelationCollectionShow = false;
			}
		},
		// 获取提货清单
		async getContractGoodsList(id) {
			let fn = getShowTakeDeliveryInfo;
			let params = {
				serialNo: id,
				takeSerialNo: this.$route.query.id
			};
			// if(this.$route.query.type == 'preview' ) {
			//   fn = showTakeDeliveryInfo
			//   params.serialNo = this.$route.query.id
			// }
			const res = await fn(params);

			if (res.data.originalContractId) {
				await this.getFindCollectionByContractNo(res.data.originalContractId, id);
			}
			let takeDeliveryApply = res.data.takeDeliveryApply || {};
			this.appointSpec = takeDeliveryApply.appointSpec;
			//  this.appointSpec  = 0

			res.data.takeDeliveryPurchaseRelList.forEach(el => {
				el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}_${el.baleNo}`;
			});
			let takeDeliveryPurchaseRelList = res.data.takeDeliveryPurchaseRelList || [];
			for (let i = 0; i < takeDeliveryPurchaseRelList.length; i++) {
				for (let j = 0; j < this.purchaseList.length; j++) {
					const currentItem = takeDeliveryPurchaseRelList[i];
					const currentPurchaseItem = this.purchaseList[j];

					if (currentItem.purchaseId == currentPurchaseItem.purchaseId || currentItem.mainId == currentPurchaseItem.mainId) {
						currentItem.excludingTaxAmount = this.purchaseList[j].excludingTaxAmount;
						// 新建状态下单价取合同单价
						if (!this.$route.query?.type) {
							currentItem.takeUnitPrice = this.purchaseList[j].presetUnitPrice || '/';
							currentItem.presetUnitPrice = this.purchaseList[j].presetUnitPrice || '/';
						}
						currentItem.availablePieceQuantity = this.purchaseList[j].availablePieceQuantity;
						currentItem.availableQuantity = this.purchaseList[j].availableQuantity;
						// 如果预提数量是数字 则 实提数量置空
						if (typeof currentItem.currentApplyPieceQuantity == 'number' && !['preview'].includes(this.typeModel)) {
							currentItem.realTakePieceQuantity = '';
						} else {
							currentItem.realTakePieceQuantity =
								currentItem.realTakePieceQuantity == undefined || currentItem.realTakePieceQuantity == null
									? '/'
									: currentItem.realTakePieceQuantity;
						}
					} else {
						currentItem.presetUnitPrice = currentItem.presetUnitPrice || '/';
						currentItem.excludingTaxAmount = currentItem.excludingTaxAmount || '/';
					}
				}
			}

			this.data = this.computedGoodsListTotal(takeDeliveryPurchaseRelList);

			// 操作日志
			this.takeDeliveryApply = takeDeliveryApply;
			this.formApply.setFieldsValue({
				serialNo: takeDeliveryApply.serialNo,
				createCompanyName: takeDeliveryApply.createCompanyName,
				createdDate: takeDeliveryApply.createdDate,
				createdName: takeDeliveryApply.createdName,
				takeType: this.getSteelTypeText(takeDeliveryApply.takeType)
			});

			if (res.data.takeType == 'CARSHIPNO') {
				this.carInfoShow = true;
				this.dataCar = [];
				res.data.takeDeliveryModelList.forEach((item, index) => {
					item.id = index + 1;
					this.dataCar.push(item);
				});
			} else {
				this.carInfoShow = false;
			}
		},
		// 获取合同详情
		getContractDetails(id, applySerialNo = '') {
			return getConstractDetailsById({
				contractId: id,
				applySerialNo,
				takeSerialNo: this.$route.query.id
			}).then(res => {
				if (res.success) {
					const {
						contractNo,
						buyCompanyName,
						steelTypeDesc,
						deliveryPlace,
						effectiveStartDate,
						effectiveEndDate,
						deliveryModeDesc,
						appointSpecDesc
					} = res.data;
					this.contractDetails = res.data;

					// 获取关联回款列表
					if (res.data.appointSpec == 0) {
						this.appointSpecDescShow = false;
					}
					this.form.setFieldsValue({
						contractNo,
						buyCompanyName,
						steelTypeDesc,
						deliveryPlace,
						effectiveStartDate: `${effectiveStartDate}-${effectiveEndDate}`,
						deliveryModeDesc,
						appointSpecDesc
					});
					this.formApply.setFieldsValue({
						validity: `${effectiveStartDate}-${effectiveEndDate}`
					});
					const purchaseList = res.data.purchaseList || res.data.goodsTransferList || [];
					purchaseList.forEach(el => {
						el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}_${el.baleNo}`;
					});
					this.purchaseList = purchaseList;
				}
			});
		},
		showModal() {
			this.$refs.upload.show();
		},
		next() {
			// this.$router.back();
			this.$router.push({
				path: '/center/take/goods/list'
			});
			// if (this.$route.query?.type) {
			//   this.$router.back();
			// } else {
			//   this.$emit("next", {
			//     view: 2,
			//     id: "",
			//   });
			// }
		},
		preview() {
			this.formType.validateFields((err, values) => {
				if (!err) {
					takeDeliveryPreview({
						...this.getPostData(),
						...this.contractDetails,
						makePaperId: this.takeDelivery.makePaperId,
						serialNo: this.$route.query.id || null
					}).then(res => {
						if (res.success) {
							this.$refs.preview.show(res.data, this.contractDetails);
						}
					});
				}
			});
		},
		prev() {
			if (this.$route.query?.type) {
				this.$router.back();
			} else {
				this.data = [];
				this.formType.resetFields();
				this.selectedRowKeys = [];
				this.dataPayment = [];
				this.isRelationCollectionShow = false;
				this.previewBtnDisabled = true;
				this.$emit('next', {
					view: 0,
					id: ''
				});
			}
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		// 查看详情
		async addNewItemOrDetails() {
			// this.handleWarehouseContractSearch("");
			this.getMakePaperList();
			const { contractId, serialNo } = this.$route.query;
			if (contractId && serialNo) {
				// 获取合同详情
				await this.getContractDetails(contractId, serialNo);
				// 获取合同管理货物清单
				if (this.typeModel != 'preview') {
					await this.getContractGoodsList(serialNo);
				}
			}
			if (['preview', 'edit', 'input', 'relation', 'oa', 'upload'].includes(this.typeModel)) {
				// 提单详情
				await this.detailsInfo();
			}
		},
		oaDetails() {
			if (this.$route.query.type == 'oa') {
				const { contractId, companyUserId } = this.$route.query;
				API_GETLOGINBYMOBILE({
					contractId,
					companyUserId
				}).then(res => {
					this.VUEX_MU_USERTOKEN(res.token);
					this.addNewItemOrDetails();
				});
			} else {
				this.addNewItemOrDetails();
			}
		},
		openOutBound() {
			this.$refs.outboundModal.init(this.outboundRecords);
		},
		// 获取实提品名列表
		getMaterialNameList(list) {
			let materialNameList = [];
			list.forEach(el => {
				const newArr = el.materialName.split(',');
				// 理重
				el.theoreticalWeight = el.theoreticalWeight || '/';
				materialNameList = [...materialNameList, ...newArr];
			});
			// 去重
			const newMaterialNameList = Array.from(new Set(materialNameList));
			this.materialNameList = newMaterialNameList;
		},
		//添加行
		addRow(index = 0, item) {
			/** 判断当前必填项是否都已经填完  */
			// 校验捆包号 是否是必填
			// 获取当前列表
			const list = cloneDeep(this.data);

			const listItem = list.splice(-1, 1);
			const newList = list;
			const flag2 = newList.every(el => {
				if (
					el.materialName &&
					el.specs &&
					el.materialTexture &&
					el.placeOfOrigin &&
					el.currentApplyPieceQuantity &&
					el.currentApplyQuantity &&
					el.metrologyWay &&
					el.takeUnitPrice &&
					el.baleNo &&
					el.realTakePieceQuantity &&
					el.realTakeQuantity
				) {
					return true;
				}
			});
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}

			this.data.splice(index + 1, 0, { ...item, mainId: (Math.random() * 100888).toFixed(0), baleNo: '', id: '' });
		},
		//删除行
		removeRow(index) {
			let that = this;
			that.$confirm({
				centered: true,
				title: '确定要删除该物资记录?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					that.data.splice(index, 1);
				},
				onCancel() {}
			});
		}
	},
	components: {
		Pagination,
		Upload,
		TemplateModal,
		Preview,
		VoidDialog,
		OutboundModal,
		Log
	}
};
</script>

<style lang="less" scoped>
.footer-btn-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
.title-wrap {
	width: 100%;
	height: 30px;
	display: flex;
	flex-direction: row;
	font-weight: bold;
}
.contract-title {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}
.table-required {
	color: #f5222d;
}
.card-info::before {
	display: inline-block;
	margin-right: 4px;
	color: #f5222d;
	font-size: 14px;
	font-family: SimSun, sans-serif;
	line-height: 1;
	content: '*';
}
.apply-title-wrap {
	width: 100%;
	height: auto;
	display: flex;
	justify-content: space-between;
	position: relative;
}
.contract-table-wrap {
	width: 100%;
}
.ant-advanced-apply-form {
}
.preview-btn {
	width: 80px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
/deep/ .ant-table-thead {
	.ant-table-selection-column-custom {
		.ant-table-selection {
			margin-right: 0;
		}
	}
}
</style>
