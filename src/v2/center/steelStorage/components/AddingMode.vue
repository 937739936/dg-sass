<template>
	<div
		class="slMain"
		style="margin-top: 0"
	>
		<a-card
			:bordered="false"
			class="content"
			style="padding-bottom: 0"
		>
			<div
				class="slTitleAssis"
				style="margin-top: 0px"
				@click="locationRectK"
			>
				添加方式
			</div>
			<div
				class="tab-box"
				:class="{ 'tab-box2': !isIn }"
			>
				<div
					class="tab-item"
					@click="selectTab(item)"
					:class="{ active: item.value == tabValue }"
					v-for="item in tabList"
					:key="item.value"
				>
					{{ item.label }}
				</div>
			</div>
			<!-- 上传图片 -->
			<div v-if="tabValue == 1">
				<a-upload
					list-type="picture-card"
					class="upload-img"
					v-if="!imgInfo.url"
					name="file"
					:showUploadList="false"
					:accept="accept"
					:headers="headers"
					:multiple="false"
					:fileList="fileImgList"
					:before-upload="beforeUploadImg"
					@change="handleChange"
				>
					<div class="btn btn1">
						<img
							src="../../../assets/imgs/storage/steel/upload.png"
							alt=""
						/>
						<p style="margin-top: 17px; color: rgba(0, 0, 0, 0.4)">图片上传</p>
					</div>
				</a-upload>
				<div
					style="width: 278px"
					v-if="percent && !imgInfo.url"
				>
					<a-progress
						:percent="percent"
						status="active"
					/>
				</div>
				<div
					class="tip"
					v-if="!imgInfo.url"
				>
					<p>操作要求：</p>
					<p>1.可支持格式为jpg，jpeg，png格式，一次只能上传一张图片，图片大小不得超过100M的文件；</p>
				</div>

				<!-- 图片展示 -->
				<div
					class="img-box"
					v-if="imgInfo.url"
				>
					<div class="img-box-title">
						<span>图片预览</span>
						<p class="img-box-icon">
							<!-- <img @click="scaleUp" src="../../../assets/imgs/storage/steel/up.png" alt="">
              <img @click="scaleDown" src="../../../assets/imgs/storage/steel/rotate.png" alt="">
              <img @click="scaleDeg" src="../../../assets/imgs/storage/steel/scale.png" alt=""> -->
							<img
								@click="delImg"
								src="../../../assets/imgs/storage/steel/del.png"
								alt=""
							/>
						</p>
					</div>
					<div class="img-box-content">
						<div
							class="img-box-show"
							ref="imgCanvas"
						>
							<img
								id="img"
								@click="preview"
								:src="imgInfo.url"
								alt=""
							/>
							<canvas
								id="canvas"
								ref="canvas"
								v-show="identify"
							></canvas>
						</div>
						<div
							class="scan"
							v-if="isScanLoading"
						></div>
						<div class="line"></div>
						<div class="img-box-btn">
							<a-button
								type="primary"
								class="discern"
								@click="ocrScan"
								style="width: 116px"
								>全局识别</a-button
							>
						</div>
					</div>
				</div>
			</div>
			<!-- Excel导入 -->
			<div v-if="tabValue == 2">
				<div
					class="current-file-box"
					v-if="excelInfo.name || excelInfo.attachName"
				>
					<span>当前文件</span>
					<div class="current-file">{{ excelInfo.name || excelInfo.attachName }}</div>
				</div>
				<div class="upload-file-box">
					<a-upload
						name="file"
						:showUploadList="false"
						:accept="accept2"
						:headers="headers"
						class="upload-file"
						:multiple="false"
						:fileList="fileImgList"
						:before-upload="beforeUploadFile"
						@change="handleChange"
					>
						<a-button
							class="upload-file-btn"
							type="primary"
							>上传文件</a-button
						>
					</a-upload>
					<div
						style="position: relative"
						class="download-box"
					>
						<a-button
							type="primary"
							v-if="type == 'OUT'"
							class="download"
							>下载模板</a-button
						>
						<a-button
							type="primary"
							v-else
							class="download"
						>
							<a
								class="downloadTemplate"
								:href="publicPath + 'files/steelStorage/入库记录导入模板.xlsx'"
								>下载模板</a
							>
						</a-button>
						<div
							class="tpl-box"
							v-if="!isIn"
						>
							<a
								class="downloadTemplate"
								v-if="type == 'OUT'"
								:href="publicPath + 'files/steelStorage/出库明细导入模板-提单数据导入模板.xlsx'"
								>提单数据导入模板</a
							>
							<a
								class="downloadTemplate"
								v-if="type == 'OUT'"
								:href="publicPath + 'files/steelStorage/出库明细导入模板-云表格数据导入模板.xlsx'"
								>云表格数据导入模板</a
							>
						</div>
					</div>
				</div>
				<div class="tip">
					<p>操作要求：</p>
					<p>1.该功能仅支持上传Excel文件（*.xls、*.xlsx），请下载模板填写后上传。</p>
					<p>2.请务必将必填字段填写准确完整，否则可能识别、添加失败。</p>
				</div>
			</div>
			<!-- /** 入库明细 */ -->
			<div class="particulars">
				<div style="display: flex; align-items: center">
					<div
						class="slTitleAssis"
						style="margin-top: 0"
					>
						{{ label }}明细
					</div>
					<div>
						<a-button
							class="particulars-btn"
							:disabled="!list.length && tabValue != 3"
							type="primary"
							@click="add"
							style="margin-left: 30px"
							>新增行</a-button
						>
						<a-button
							class="particulars-btn"
							:disabled="!list.length && tabValue != 3"
							type="primary"
							@click="del"
							>删除行</a-button
						>
						<a-button
							class="particulars-btn"
							:disabled="!list.length"
							type="primary"
							@click="empty"
							>清空数据</a-button
						>
					</div>
				</div>
				<div>
					<a-button
						class="particulars-btn"
						type="primary"
						:loading="loading"
						@click="exportFile"
						>导出</a-button
					>
					<a-button
						class="particulars-btn particulars-btn2"
						:disabled="!isOcrScan"
						v-if="imgInfo.id"
						@click="exportImgIdentify"
						type="primary"
						>导出识别结果</a-button
					>
				</div>
			</div>
			<a-form
				:form="form"
				:selfUpdate="true"
			>
				<a-table
					:columns="columns"
					:rowSelection="rowSelection"
					class="new-table"
					ref="tableRef"
					:scroll="{ x: 1500, y: 550 }"
					:dataSource="list"
					:pagination="false"
					:loading="tabValue == 1 ? isScanLoading : uploadLoading"
					rowKey="mainId"
				>
					<!-- 品名 -->
					<template slot="materialNameTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['materialNameTitle'][type] }}</span>
								</template>
								<i style="display: inline-block; color: red; margin-right: 4px; position: relative; top: 2px">*</i>
								<span>品名</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('materialName')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="materialName"
						slot-scope="text, record, index"
					>
						<a-form-item prop="materialName">
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="form.getFieldValue(`materialName${record.mainId}`)">
										{{ form.getFieldValue(`materialName${record.mainId}`) }}</span
									>
								</template>
								<childFormItem
									class="ipt1"
									v-if="!isAppoint"
									:maxLength="50"
									@focus="e => locationRectK(e, record, 'materialName')"
									placeholder="请输入品名"
									@blur="e => assignment(e, record, 'materialName')"
									v-decorator="[`materialName${record.mainId}`, { initialValue: undefined }]"
								></childFormItem>
								<!-- 出库 且是指定规格出库 -->
								<childFormItemSelect
									placeholder="请选择"
									v-if="isAppoint"
									class="ipt1"
									@change="e => changeMaterialName(e, record, 'materialName')"
									v-decorator="[`materialName${record.mainId}`, { initialValue: undefined }]"
								>
									<a-select-option
										v-for="(items, index) in materialNameList"
										:key="index"
										:value="items.materialName"
									>
										{{ items.materialName }}</a-select-option
									>
								</childFormItemSelect>
							</a-tooltip>
						</a-form-item>
					</template>
					<!-- 材质 -->
					<template slot="materialTextureTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['materialTextureTitle'][type] }}</span>
								</template>
								<i style="display: inline-block; color: red; margin-right: 4px; position: relative; top: 2px">*</i>
								<span>材质</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('materialTexture')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="materialTexture"
						slot-scope="text, record"
					>
						<a-form-item>
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="form.getFieldValue(`materialTexture${record.mainId}`)">
										{{ form.getFieldValue(`materialTexture${record.mainId}`) }}
									</span>
								</template>
								<!-- 出库 且是指定规格出库 -->
								<childFormItemSelect
									placeholder="请选择"
									v-if="isAppoint"
									@change="e => changeMaterialName(e, record, 'materialTexture')"
									style="width: 246px"
									class="ipt1"
									v-decorator="[`materialTexture${record.mainId}`, { initialValue: undefined }]"
								>
									<a-select-option
										v-for="(items, index) in getMaterialTextureList(record.materialName)"
										:key="index"
										:value="items.materialTexture"
									>
										{{ items.materialTexture }}</a-select-option
									>
								</childFormItemSelect>
								<childFormItem
									class="ipt1"
									@focus="e => locationRectK(e, record, 'materialTexture')"
									style="width: 246px"
									v-else
									@blur="e => assignment(e, record, 'materialTexture')"
									:maxLength="50"
									placeholder="请输入材质"
									v-decorator="[`materialTexture${record.mainId}`, { initialValue: undefined }]"
								></childFormItem>
							</a-tooltip>
						</a-form-item>
					</template>
					<!-- 规格 -->
					<template slot="specsTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['specsTitle'][type] }}</span>
								</template>
								<i style="display: inline-block; color: red; margin-right: 4px; position: relative; top: 2px">*</i>
								<span>规格</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('specs')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="specs"
						slot-scope="text, record"
					>
						<a-form-item>
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="form.getFieldValue(`specs${record.mainId}`)">
										{{ form.getFieldValue(`specs${record.mainId}`) }}
									</span>
								</template>
								<!-- 出库 且是指定规格出库 -->
								<childFormItemSelect
									placeholder="请选择"
									v-if="isAppoint"
									style="width: 246px"
									@change="e => changeMaterialName(e, record, 'specs')"
									class="ipt1"
									v-decorator="[`specs${record.mainId}`, { initialValue: undefined }]"
								>
									<a-select-option
										v-for="(items, index) in getSpecsList(record.materialName, record.materialTexture)"
										:key="index"
										:value="items.specs"
									>
										{{ items.specs }}</a-select-option
									>
								</childFormItemSelect>
								<childFormItem
									class="ipt1"
									style="width: 246px"
									v-else
									@focus="e => locationRectK(e, record, 'specs')"
									@blur="e => assignment(e, record, 'specs')"
									:maxLength="50"
									placeholder="请输入规格"
									v-decorator="[`specs${record.mainId}`, { initialValue: undefined }]"
								></childFormItem>
							</a-tooltip>
						</a-form-item>
					</template>
					<!-- 厂家 -->
					<template slot="placeOfOriginTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['placeOfOriginTitle'][type] }}</span>
								</template>
								<i style="display: inline-block; color: red; margin-right: 4px; position: relative; top: 2px">*</i>
								<span>厂家</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('placeOfOrigin')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="placeOfOrigin"
						slot-scope="text, record"
					>
						<a-form-item>
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="form.getFieldValue(`placeOfOrigin${record.mainId}`)">
										{{ form.getFieldValue(`placeOfOrigin${record.mainId}`) }}
									</span>
								</template>
								<!-- 出库 且是指定规格出库 -->
								<childFormItemSelect
									placeholder="请选择"
									v-if="isAppoint"
									@change="e => changeMaterialName(e, record, 'placeOfOrigin')"
									style="width: 196px"
									class="ipt1"
									v-decorator="[`placeOfOrigin${record.mainId}`, { initialValue: undefined }]"
								>
									<a-select-option
										v-for="(items, index) in getPlaceOfOriginList(record.materialName, record.materialTexture, record.specs)"
										:key="index"
										:value="items.originPlace"
									>
										{{ items.originPlace }}</a-select-option
									>
								</childFormItemSelect>
								<childFormItem
									class="ipt1"
									style="width: 196px"
									v-else
									@focus="e => locationRectK(e, record, 'placeOfOrigin')"
									@blur="e => assignment(e, record, 'placeOfOrigin')"
									:maxLength="50"
									placeholder="请输入厂家"
									v-decorator="[`placeOfOrigin${record.mainId}`, { initialValue: undefined }]"
								></childFormItem>
							</a-tooltip>
						</a-form-item>
					</template>
					<!-- 出入库数量 -->
					<template slot="pieceQuantityTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['pieceQuantityTitle'][type] }}</span>
								</template>
								<span>{{ label }}数量</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('quantity', 2)"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="quantity"
						slot-scope="text, record"
					>
						<a-form-item>
							<childFormItem
								class="ipt1"
								@focus="e => locationRectK(e, record, 'quantity')"
								:maxLength="20"
								style="width: 96px"
								@blur="e => blurQuantity(e, record, 'quantity')"
								placeholder="请输入数量"
								v-decorator="[`quantity${record.mainId}`, { initialValue: undefined }]"
							></childFormItem>
						</a-form-item>
					</template>
					<!-- 出入库重量（吨） -->
					<template slot="quantityTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['quantityTitle'][type] }}</span>
								</template>
								<i style="display: inline-block; color: red; margin-right: 4px; position: relative; top: 2px">*</i>
								<span>{{ label }}重量（吨）</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('weight', 2)"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="weight"
						slot-scope="text, record"
					>
						<a-form-item>
							<childFormItemNumber
								:class="record.error"
								@focus="e => locationRectK(e, record, 'weight')"
								class="ipt1"
								:min="0"
								:precision="4"
								:max="999999999.9999"
								@blur="e => valuation(e, record, 'weight')"
								style="width: 144px"
								placeholder="请输入重量"
								v-decorator="[`weight${record.mainId}`, { initialValue: undefined }]"
							></childFormItemNumber>
						</a-form-item>
					</template>
					<!-- 捆包号 -->
					<template slot="baleNoTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['baleNoTitle'][type] }}</span>
								</template>
								<span>捆包号</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('baleNo')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="baleNo"
						slot-scope="text, record"
					>
						<a-form-item>
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="form.getFieldValue(`baleNo${record.mainId}`)">
										{{ form.getFieldValue(`baleNo${record.mainId}`) }}</span
									>
								</template>
								<!-- 出库 且是指定规格出库 -->
								<childFormItemSelect
									placeholder="请选择"
									v-if="isAppoint"
									style="width: 242px"
									class="ipt1"
									@change="e => changeMaterialName(e, record, 'baleNo')"
									v-decorator="[`baleNo${record.mainId}`, { initialValue: undefined }]"
								>
									<a-select-option
										v-for="(items, index) in getBaleNoList(
											record.materialName,
											record.materialTexture,
											record.specs,
											record.placeOfOrigin
										)"
										:key="index"
										:value="items"
									>
										{{ items }}</a-select-option
									>
								</childFormItemSelect>
								<childFormItem
									class="ipt1"
									style="width: 228px"
									v-else
									@focus="e => locationRectK(e, record, 'baleNo')"
									@blur="e => assignment(e, record, 'baleNo')"
									:maxLength="50"
									placeholder="请输入捆包号"
									v-decorator="[`baleNo${record.mainId}`, { initialValue: undefined }]"
								></childFormItem>
							</a-tooltip>
						</a-form-item>
					</template>
					<!-- 入库日期 -->
					<template slot="operateDateTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['operateDateTitle'][type] }}</span>
								</template>
								<i style="display: inline-block; color: red; margin-right: 4px; position: relative; top: 2px">*</i>
								<span>入库日期</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('operateDate', 3)"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="operateDate"
						slot-scope="text, record"
					>
						<a-form-item>
							<childFormItemDate
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								style="width: 130px"
								@focus="e => locationRectK(e, record, 'operateDate')"
								placeholder="请选择日期"
								@change="e => assignment(e, record, 'operateDate')"
								v-decorator="[`operateDate${record.mainId}`, { initialValue: undefined }]"
							/>
						</a-form-item>
					</template>
					<!-- 车船号 -->
					<template slot="vehicleShipNoTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['vehicleShipNoTitle'][type] }}</span>
								</template>
								<span>车船号</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('vehicleShipNo')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="vehicleShipNo"
						slot-scope="text, record"
					>
						<a-form-item>
							<childFormItem
								class="ipt1"
								:maxLength="50"
								style="width: 96px"
								@focus="e => locationRectK(e, record, 'vehicleShipNo')"
								@blur="e => assignment(e, record, 'vehicleShipNo')"
								v-decorator="[`vehicleShipNo${record.mainId}`, { initialValue: undefined }]"
								placeholder="请输入车船号"
							></childFormItem>
						</a-form-item>
					</template>
					<!-- 备注 -->
					<template slot="remarkTitle">
						<a-space>
							<a-tooltip placement="top">
								<template slot="title">
									<span>{{ tipInfo['remarkTitle'][type] }}</span>
								</template>
								<span>备注</span>
							</a-tooltip>
							<a-tooltip
								placement="top"
								v-show="tabValue == 1 && imgInfo.url"
							>
								<template slot="title">
									<span>选择图片截取识别</span>
								</template>
								<a-icon
									type="form"
									@click="identifyImgSingleRow('remark')"
								/>
							</a-tooltip>
						</a-space>
					</template>
					<template
						slot="remark"
						slot-scope="text, record"
					>
						<a-form-item>
							<childFormItem
								class="ipt1"
								style="width: 196px"
								placeholder="请输入备注"
								:maxLength="100"
								@focus="e => locationRectK(e, record, 'remark')"
								@blur="e => assignment(e, record, 'remark')"
								v-decorator="[`remark${record.mainId}`, { initialValue: undefined }]"
							></childFormItem>
						</a-form-item>
					</template>
					<!-- 出库的理论 库存 重量 和数量 -->
					<template slot="inventoryPieceQuantityTitle">
						<a-tooltip placement="top">
							<template slot="title">
								<span>{{ tipInfo['inventoryPieceQuantityTitle'][type] }}</span>
							</template>
							<span>理论库存数量</span>
						</a-tooltip>
					</template>
					<template
						slot="inventoryQuantity"
						slot-scope="text, record"
					>
						<a-form-item>
							{{ record.inventoryQuantity.text }}
						</a-form-item>
					</template>
					<template slot="inventoryQuantityTitle">
						<a-tooltip placement="top">
							<template slot="title">
								<span>{{ tipInfo['inventoryQuantityTitle'][type] }}</span>
							</template>
							<span>理论库存重量(吨)</span>
						</a-tooltip>
					</template>
					<template
						slot="inventoryWeight"
						slot-scope="text, record"
					>
						<a-form-item>
							{{ record.inventoryWeight.text }}
						</a-form-item>
					</template>
				</a-table>
				<p class="total-weight">
					<span>共计{{ label }}数量：</span>
					<span style="font-weight: 600; color: rgba(0, 0, 0, 0.8)"> {{ totalInfo.quantity }}</span>
					<span> 共计{{ label }}重量：</span>
					<span style="font-weight: 600; color: rgba(0, 0, 0, 0.8)"> {{ totalInfo.weight }}吨</span>
				</p>
			</a-form>
		</a-card>
		<img
			:src="imgInfo.url"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import {
	commonUpload,
	ocrScan,
	getIdentifyImgSingleRow,
	identifyExcel,
	exportImgIdentify,
	exportExcel,
	getOutCascade,
	getOutTheoryData
} from '@/v2/center/steelStorage/api';

import { mapGetters } from 'vuex';
import childFormItem from './childFormItem.vue';
import childFormItemNumber from './childFormItemNumber.vue';
import childFormItemDate from './childFormItemDate.vue';
import childFormItemSelect from './childFormItemSelect.vue';
import { cloneDeep } from 'lodash';
import { inColumns, outColumns, defaultInObj, tipInfo } from './config.js';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';

export default {
	props: {
		type: {
			default: 'IN'
		},
		// 出库方式
		outboundWay: {
			default: ''
		},
		warehouseId: {
			default: ''
		}
	},
	data() {
		return {
			tabValue: 2,
			accept: '.jpg,.png,.gif,.pdf,.ofd,application/ofd',
			accept2: '.xls,.xlsx',
			fileImgList: [],
			uploadLoading: false,
			imgInfo: {
				url: '',
				id: ''
			},
			isScanLoading: false,
			excelInfo: {
				url: '',
				id: ''
			},
			downloadVisible: false,
			publicPath: process.env.BASE_URL,
			list: [],
			selectedRowKeys: [],
			form: this.$form.createForm(this),
			tipInfo,
			/** 按 指定规格出货的配置*/
			// 品名列表
			materialNameList: [],
			// 最后一次操作的上传方式
			attachId: '',
			totalInfo: {
				quantity: 0,
				weight: 0
			},
			isOcrScan: false,
			percent: 0,
			timer: null,
			loading: false,
			identify: false, //开始识别
			identifyPoints: [], //位置坐标记录
			identifyType: '', //替换类型记录
			identifyDataType: '' //解析的数据类型
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'checkbox',
				// fixed: true,
				selectedRowKeys: selectedRowKeys,
				onChange: (record, itemList) => {
					t.selectedRowKeys = record;
				}
			};
		},
		/*** 判断是否入库 */
		isIn() {
			return this.type == 'IN';
		},
		// 出库编辑
		isOutEdit() {
			return !this.isIn && this.$route.query.id;
		},
		columns() {
			if (this.isIn) {
				return inColumns;
			}
			return outColumns;
		},
		tabList() {
			if (this.isIn) {
				return [
					{ value: 1, label: '图片识别' },
					{ value: 2, label: 'Excel导入' },
					{ value: 3, label: '手动添加' }
				];
			}
			return [
				{ value: 2, label: 'Excel导入' },
				{ value: 3, label: '手动添加' }
			];
		},
		// 出入库文字描述
		label() {
			if (this.isIn) {
				return '入库';
			}
			return '出库';
		},
		/** 判断 是出库 且 是按指定规格出库 */
		isAppoint() {
			return !this.isIn && this.outboundWay == 'SPECIFICATION';
		}
	},
	watch: {
		warehouseId: {
			handler() {
				this.getOutCascade();
			},
			deep: true,
			immediate: true
		},
		list: {
			handler(val) {
				const arr = val.filter(el => el.weight && el.weight.text).map(el => el.weight.text);
				const arr2 = val.filter(el => el.quantity && el.quantity.text).map(el => el.quantity.text);
				let quantity = 0;
				let weight = 0;

				arr.forEach(el => {
					weight += +el || 0;
				});

				arr2.forEach(el => {
					if (this.isNumber(el)) {
						quantity += +el || 0;
					}
				});
				const flag = arr2.every(el => this.isNumber(el));
				this.totalInfo = {
					quantity: flag ? quantity.toFixed(2) : '-',
					weight: weight.toFixed(4)
				};
			},
			deep: true,
			immediate: true
		},
		imgInfo: {
			handler(val) {
				let that = this;
				this.initCanvas(val);
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		if (this.isIn) {
			this.tabValue = 1;
		}
	},
	destroyed() {
		clearInterval(this.timer);
	},
	methods: {
		init(list = [], info, fileFormat) {
			if (fileFormat) {
				const flag = '.xls,.xlsx'.includes(fileFormat);
				this.attachId = info.id;
				if (flag) {
					this.tabValue = 2;
					this.excelInfo = info;
				} else {
					this.tabValue = 1;
					this.imgInfo = info;
				}
			} else {
				this.tabValue = 3;
			}
			let obj = {};
			list.forEach(el => {
				if (!el.inventoryQuantity) {
					el.inventoryQuantity = {};
				}
				if (!el.inventoryWeight) {
					el.inventoryWeight = {};
				}
				el.cacheInventoryWeight = el.inventoryWeight || {};
				el.cacheInventoryQuantity = el.inventoryQuantity || {};
				if (el.quantity && this.isNumber(el.quantity.text) && el.inventoryQuantity && this.isNumber(el.inventoryQuantity.text)) {
					el.cacheInventoryQuantity.text = (Number(el.inventoryQuantity.text) + Number(el.quantity.text)).toFixed(2);
				}

				for (let k in el) {
					obj[`${k}${el.mainId}`] = el[k].text;
				}
			});
			this.$nextTick(() => {
				this.form.setFieldsValue(obj);
			});

			this.list = list;
		},
		initCanvas(val) {
			let that = this;
			this.$nextTick(async () => {
				//图片发生变化时重新渲染canvas
				if (val && val.url) {
					let canvas = document.getElementById('canvas');
					let offsetHeight = this.$refs.imgCanvas.offsetHeight;
					let offsetWidth = this.$refs.imgCanvas.offsetWidth;
					canvas.width = offsetWidth;
					canvas.height = offsetHeight;
					let context = canvas.getContext('2d');
					// 绑定截图事件
					canvas.onmousedown = function (event) {
						let start = {
							x: event.offsetX,
							y: event.offsetY
						};
						canvas.onmousemove = function (e) {
							if (start) {
								context.clearRect(0, 0, offsetWidth, offsetHeight);
								context.strokeStyle = 'red';
								context.strokeRect(start.x, start.y, e.offsetX - start.x, e.offsetY - start.y);
								//判断左上点和右下点，防止自由勾画
								let identifyPoints = [];
								if (start.x < e.offsetX) {
									identifyPoints[0] = start.x / offsetWidth;
									identifyPoints[2] = e.offsetX / offsetWidth;
								} else {
									identifyPoints[0] = e.offsetX / offsetWidth;
									identifyPoints[2] = start.x / offsetWidth;
								}
								if (start.y < e.offsetY) {
									identifyPoints[1] = start.y / offsetHeight;
									identifyPoints[3] = e.offsetY / offsetHeight;
								} else {
									identifyPoints[0] = e.offsetY / offsetHeight;
									identifyPoints[2] = start.y / offsetHeight;
								}
								that.identifyPoints = identifyPoints;
							}
						};
						document.addEventListener('mouseup', async function () {
							if (start) {
								start = null;
								//文本识别
								await that.getIdentifyImgSingleRow();
								await context.clearRect(0, 0, offsetWidth, offsetHeight);
							}
						});
					};
				}
			});
		},
		// 画框
		locationRectK(e, item, key) {
			this.identify = false;
			if (!this.imgInfo.url) {
				return;
			}
			if (!this.isIn) {
				return;
			}
			if (!item[key]) {
				return;
			}
			if (!item[key].text) {
				return;
			}
			if (!item[key].textRegion) {
				return;
			}
			if (!item[key].textRegion.length) {
				return;
			}

			let tpl = item[key].textRegion;
			this.identify = true;

			this.$nextTick(async () => {
				let canvas = this.$refs.canvas;
				let ctx = canvas.getContext('2d');

				await ctx.clearRect(0, 0, canvas.width, canvas.height);
				let offsetHeight = this.$refs.imgCanvas.offsetHeight;
				let offsetWidth = this.$refs.imgCanvas.offsetWidth;

				let that = this;
				ctx.strokeStyle = 'blue';
				ctx.lineWidth = 1;
				ctx.beginPath();
				tpl.forEach(el => {
					ctx.lineTo(el[0] * offsetWidth, el[1] * offsetHeight);
				});
				ctx.closePath();
				ctx.stroke();
			});
		},
		clearCanvas() {
			this.$nextTick(async () => {
				this.identify = false;
				let canvas = this.$refs.canvas;
				if (!canvas) return;
				let ctx = canvas.getContext('2d');
				await ctx.clearRect(0, 0, canvas.width, canvas.height);
			});
		},
		updateList(list = []) {
			let obj = {};

			list.forEach(el => {
				if (!el.inventoryQuantity) {
					el.inventoryQuantity = {};
				}
				if (!el.inventoryWeight) {
					el.inventoryWeight = {};
				}
				el.cacheInventoryWeight.text = el.inventoryWeight.text || 0;
				el.cacheInventoryQuantity.text = el.inventoryQuantity.text || 0;
				if (this.isNumber(el.quantity.text) && this.isNumber(el.inventoryQuantity.text)) {
					el.cacheInventoryQuantity.text = (Number(el.inventoryQuantity.text) + Number(el.quantity.text)).toFixed(2);
				}

				for (let k in el) {
					obj[`${k}${el.mainId}`] = el[k].text;
				}
			});
			this.$nextTick(() => {
				this.form.setFieldsValue(obj);
			});

			this.list = list;
			this.$forceUpdate();
		},
		selectTab(item) {
			this.tabValue = item.value;
			if (this.tabValue == 1) {
				this.initCanvas(this.imgInfo);
			}
		},
		handleChange(data, file) {},
		beforeUploadImg(file) {
			this.percent = 0;
			const isLimitFileSize = file.size / 1024 / 1024 <= 100;
			if (!isLimitFileSize) {
				this.$message.error(`文件大小不能超过100M`);
				return;
			}
			this.setPercent();
			this.handleUpload(file);
			return false;
		},
		beforeUploadFile(file) {
			if (!this.isIn) {
				if (!this.warehouseId || !this.outboundWay) {
					this.$message.error('请先选择仓库和出库方式');
					return;
				}
			}
			this.handleFileUpload(file);
			return false;
		},
		// 1.上传
		async handleUpload(file) {
			this.uploadLoading = true;
			const formData = new FormData();
			formData.append('file', file);
			try {
				const res = await commonUpload(formData);

				this.percent = 100;
				setTimeout(() => {
					this.imgInfo = res.data;
					this.imgInfo.url = `${res.data.path}`;
					this.attachId = res.data.id;
				}, 500);
			} catch (err) {
				//  const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试'
				//  this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.uploadLoading = false;
				clearInterval(this.timer);
				setTimeout(() => {
					this.percent = 0;
				}, 500);
			}
		},

		async handleFileUpload(file) {
			this.uploadLoading = true;
			const formData = new FormData();
			formData.append('file', file);
			if (!this.isIn) {
				formData.append('warehouseId', this.warehouseId);
				formData.append('outBoundWay', this.outboundWay);
			}

			try {
				const res = await commonUpload(formData);
				this.excelInfo = res.data;
				this.excelInfo.url = `${res.data.path}`;
				this.attachId = res.data.id;
				const params = {
					fileId: this.excelInfo.id,
					inoutType: this.type
				};
				if (!this.isIn) {
					params.warehouseId = this.warehouseId;
					params.outBoundWay = this.outboundWay;
				}
				this.selectedRowKeys = [];
				const excelRes = await identifyExcel(params);
				const list = excelRes.data || [];
				let obj = {};
				this.form.resetFields();
				list.forEach((el, i) => {
					if (!el.inventoryQuantity) {
						el.inventoryQuantity = {};
					}
					if (!el.inventoryWeight) {
						el.inventoryWeight = {};
					}
					el.mainId = i;
					if (el.weight && el.weight.text) {
						el.weight.text = Number(el.weight.text).toFixed(4);
					}
					for (let k in el) {
						obj[`${k}${el.mainId}`] = el[k].text;
					}
				});

				this.$nextTick(() => {
					this.form.setFieldsValue(obj);
					this.$nextTick(() => {
						this.form.setFieldsValue(obj);
					});
				});
				this.list = list;
				this.$nextTick(() => {
					this.form.setFieldsValue(obj);
					// 超过十条滚动到底部
					if (this.list.length > 10) {
						this.scrollYBot();
					}
				});
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.uploadLoading = false;
			}
		},
		// 图片ocr识别
		async ocrScan() {
			this.selectedRowKeys = [];
			const params = {
				fileId: this.imgInfo.id
			};
			if (this.isScanLoading) {
				this.$message.warning('识别中...');
				return;
			}
			this.isScanLoading = true;
			try {
				const res = await ocrScan(params);
				this.isOcrScan = true;
				this.list = [];
				const list = res.data || [];
				this.form.resetFields();
				let obj = {};
				list.forEach((el, i) => {
					if (!el.inventoryQuantity) {
						el.inventoryQuantity = {};
					}
					if (!el.inventoryWeight) {
						el.inventoryWeight = {};
					}
					el.mainId = i;
					if (el.weight && el.weight.text) {
						el.weight.text = Number(el.weight.text).toFixed(4);
					} else {
						el.weight = {
							text: ''
						};
					}
					for (let k in el) {
						obj[`${k}${el.mainId}`] = el[k].text;
					}
				});
				this.$nextTick(() => {
					this.form.setFieldsValue(obj);
				});

				this.list = list;
				this.$forceUpdate();
				this.$nextTick(() => {
					// 超过十条滚动到底部
					if (this.list.length > 10) {
						this.scrollYBot();
					}
				});
				this.$forceUpdate();

				this.isScanLoading = false;
			} catch (error) {
				this.isScanLoading = false;
			}
		},
		/**
		 * @type String 替换的表数据类型
		 * @dataType Number 解析的数据格式， 1、文本类型；2、日期类型；3、数值类型
		 */
		//截取识别
		async identifyImgSingleRow(type, dataType = 1) {
			this.clearCanvas();
			this.$nextTick(() => {
				//替换类型
				this.identifyType = type;
				this.identifyDataType = dataType;
				//展示画布
				this.identify = true;
			});
		},
		async getIdentifyImgSingleRow() {
			if (!this.identifyType) return;
			await getIdentifyImgSingleRow({
				fileId: this.imgInfo.id,
				type: this.identifyDataType,
				points: this.identifyPoints
			})
				.then(res => {
					if (res.success) {
						let data = res.data;
						let tableList = cloneDeep(this.list);
						data.map((item, index) => {
							if (tableList[index]) {
								tableList[index][this.identifyType] = item;
							}
						});
						tableList.forEach(el => {
							if (el.weight && el.weight.text) {
								el.weight.text = Number(el.weight.text).toFixed(4);
							}
							// 缓存理论库存
							el.cacheInventoryWeight = {
								text: (el.inventoryWeight && el.inventoryWeight.text) || 0
							};
							el.cacheInventoryQuantity = {
								text: (el.inventoryQuantity && el.inventoryQuantity.text) || 0
							};
							for (let k in el) {
								const obj = {};
								obj[`${k}${el.mainId}`] = el[k].text;
								this.$nextTick(() => {
									this.form.setFieldsValue(obj);
								});
							}
						});
						this.list = tableList;
					}
				})
				.finally(() => {
					this.identify = false;
				});
		},
		// 导出ocr识别的数据
		async exportImgIdentify() {
			const params = {
				fileId: this.imgInfo.id
			};
			const res = await exportImgIdentify(params);
			comDownload(res, undefined, 'ocr识别数据.xlsx');
		},
		setPercent() {
			this.timer = setInterval(() => {
				if (this.percent >= 90) {
					this.percent = 90;
					clearInterval(this.timer);
					return;
				}
				this.percent += 10;
			}, 1000);
		},
		delImg() {
			this.imgInfo.url = '';
			this.$forceUpdate();
		},
		preview() {
			this.$refs.viewer.$viewer.show();
		},
		// 滚动到底部
		scrollYBot(h = 99999) {
			this.$nextTick(() => {
				const ele = document.getElementsByClassName('ant-table-body');
				const tableBody = ele[0];
				tableBody.scrollTo(0, h);
			});
		},
		// 赋值
		valuation(e, item, key) {
			this.clearCanvas();
			if (item[key]?.text) {
				if (item[key]?.text != e.target.value) {
					item[key] = { text: e.target.value };
				}
			} else {
				item[key] = {
					text: e.target.value
				};
			}

			item.error = '';

			if (this.isIn) {
				this.$forceUpdate();
				return;
			}
			if (item.weight && item.weight.text && item.cacheInventoryWeight && this.isNumber(item.cacheInventoryWeight.text)) {
				item.inventoryWeight.text =
					item.cacheInventoryWeight.text - item.weight.text < 0
						? 0
						: (item.cacheInventoryWeight.text - item.weight.text).toFixed(4);
			}

			/** 计算理论库存重量 */
			this.$forceUpdate();
		},
		// 计算理论库存重量和理论库存数量
		computedInventory(item) {
			// 入库没有
			if (this.isIn) {
				return;
			}

			if (item?.weight?.text && item.cacheInventoryWeight && this.isNumber(item.cacheInventoryWeight.text)) {
				item.inventoryWeight.text =
					item.cacheInventoryWeight.text - item.weight.text < 0
						? 0
						: (item.cacheInventoryWeight.text - item.weight.text).toFixed(4);
			}
			if (
				item.quantity &&
				this.isNumber(item.quantity.text) &&
				item.cacheInventoryQuantity &&
				this.isNumber(item.cacheInventoryQuantity.text)
			) {
				item.inventoryQuantity.text =
					item.cacheInventoryQuantity.text - item.quantity.text < 0
						? 0
						: (item.cacheInventoryQuantity.text - item.quantity.text).toFixed(2);
			}
			if (!item.quantity) {
				item.inventoryQuantity = {
					text: item?.cacheInventoryQuantity?.text
				};
			}
			if (item.quantity && !this.isNumber(item.quantity.text)) {
				item.inventoryQuantity.text = item?.cacheInventoryQuantity?.text;
			}
			this.$forceUpdate();
		},
		blurQuantity(e, item, key) {
			this.clearCanvas();
			if (item[key]?.text) {
				if (item[key]?.text != e.target.value) {
					item[key] = { text: e.target.value };
				}
			} else {
				item[key] = {
					text: e.target.value
				};
			}

			if (
				item.quantity &&
				this.isNumber(item.quantity.text) &&
				item.cacheInventoryQuantity &&
				this.isNumber(item.cacheInventoryQuantity.text)
			) {
				item.inventoryQuantity.text =
					item.cacheInventoryQuantity.text - item.quantity.text < 0
						? 0
						: (item.cacheInventoryQuantity.text - item.quantity.text).toFixed(2);
			}
			if (!item.quantity) {
				item.inventoryQuantity = {
					text: item?.cacheInventoryQuantity?.text
				};
			}
			if (item.quantity && !this.isNumber(item.quantity.text)) {
				item.inventoryQuantity.text = item?.cacheInventoryQuantity?.text;
			}
			this.$forceUpdate();
		},
		// 赋值
		assignment(e, item, key) {
			this.clearCanvas();
			let val = e;
			if (key != 'operateDate') {
				val = e.target.value;
			}
			if (item[key]?.text) {
				if (item[key]?.text != val) {
					item[key] = { text: val };
				}
			} else {
				item[key] = { text: val };
			}

			this.$forceUpdate();
		},
		// 新增行数
		add() {
			// 判断当前用户是否勾选了单行数据

			let obj = cloneDeep(defaultInObj);

			if (!this.isIn) {
				obj.cacheInventoryWeight = {
					text: 0
				};
				obj.cacheInventoryQuantity = {
					text: 0
				};
			}
			// 勾选一个
			if (this.selectedRowKeys.length) {
				// 查找索引
				const id = this.selectedRowKeys[this.selectedRowKeys.length - 1];
				const index = this.list.findIndex(el => el.mainId == id);
				/** 插入 */
				const newArr = cloneDeep(this.list);
				obj.mainId = newArr.length;
				newArr.splice(index + 1, 0, obj);
				this.list = newArr;
				const h = (index + 1) * 48;
				this.scrollYBot(h);
				// 计算滚动位置
			} else {
				// 插入到最后
				obj.mainId = this.list.length;
				this.list.push(obj);
				this.scrollYBot();
			}
		},
		// 删除
		del() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('选择您要删除的数据');
				return;
			}
			const newArr = cloneDeep(this.list);
			const newList = newArr.filter(el => !this.selectedRowKeys.includes(el.mainId));
			this.list = newList;
			this.selectedRowKeys = [];
			this.$forceUpdate();
		},
		// 清空数据
		empty() {
			// 存在勾选 清空
			let obj = cloneDeep(defaultInObj);
			let initObj = {};
			if (this.selectedRowKeys.length) {
				this.list.forEach(el => {
					const flag = this.selectedRowKeys.includes(el.mainId);
					if (flag) {
						Object.assign(el, obj);

						for (let k in el) {
							initObj[`${k}${el.mainId}`] = undefined;
						}
					}
				});
				this.form.setFieldsValue(initObj);
			} else {
				this.list.forEach(el => {
					Object.assign(el, obj);
				});
				this.form.resetFields();
			}
		},
		/** 品名发生变化 */
		changeMaterialName(e, item, key) {
			this.clearCanvas();
			if (item[key]?.text) {
				if (item[key]?.text != e) {
					item[key] = { text: e };
				}
			} else {
				item[key] = { text: e };
			}
			// 品名变化
			if (key == 'materialName') {
				/** 清空 材质 规格 厂家 捆包号  理论数量 理论重量 */
				item.materialTexture = {
					text: ''
				};
				item.specs = {
					text: ''
				};
				item.placeOfOrigin = {
					text: ''
				};
				item.baleNo = {
					text: ''
				};
				item.inventoryQuantity = {
					text: ''
				};
				item.inventoryWeight = {
					text: ''
				};
				let obj = {};
				obj[`materialTexture${item.mainId}`] = undefined;
				obj[`specs${item.mainId}`] = undefined;
				obj[`placeOfOrigin${item.mainId}`] = undefined;
				obj[`baleNo${item.mainId}`] = undefined;
				obj[`inventoryQuantity${item.mainId}`] = undefined;
				obj[`inventoryWeight${item.mainId}`] = undefined;
				this.form.setFieldsValue(obj);
			}
			// 材质发生变化
			if (key == 'materialTexture') {
				item.specs = {
					text: ''
				};
				item.placeOfOrigin = {
					text: ''
				};
				item.baleNo = {
					text: ''
				};
				item.inventoryQuantity = {
					text: ''
				};
				item.inventoryWeight = {
					text: ''
				};
				let obj = {};
				obj[`specs${item.mainId}`] = undefined;
				obj[`placeOfOrigin${item.mainId}`] = undefined;
				obj[`baleNo${item.mainId}`] = undefined;
				obj[`inventoryQuantity${item.mainId}`] = undefined;
				obj[`inventoryWeight${item.mainId}`] = undefined;
				this.form.setFieldsValue(obj);
			}
			// 规格发生变化
			if (key == 'specs') {
				item.placeOfOrigin = {
					text: ''
				};
				item.baleNo = {
					text: ''
				};
				item.inventoryQuantity = {
					text: ''
				};
				item.inventoryWeight = {
					text: ''
				};
				let obj = {};
				obj[`placeOfOrigin${item.mainId}`] = undefined;
				obj[`baleNo${item.mainId}`] = undefined;
				obj[`inventoryQuantity${item.mainId}`] = undefined;
				obj[`inventoryWeight${item.mainId}`] = undefined;
				this.form.setFieldsValue(obj);
			}
			// 厂家发生变化
			if (key == 'placeOfOrigin') {
				item.baleNo = {
					text: ''
				};
				item.inventoryQuantity = {
					text: ''
				};
				item.inventoryWeight = {
					text: ''
				};
				let obj = {};
				obj[`baleNo${item.mainId}`] = undefined;
				obj[`inventoryQuantity${item.mainId}`] = undefined;
				obj[`inventoryWeight${item.mainId}`] = undefined;
				this.form.setFieldsValue(obj);
			}

			/** 获取 理论重量 和 理论数量 */
			if (item?.materialTexture?.text && item?.specs?.text && item?.placeOfOrigin?.text && item?.materialName?.text) {
				if (this.isAppoint) {
					const params = {
						materialName: item.materialName && item.materialName.text,
						materialTexture: item.materialTexture && item.materialTexture.text,
						specs: item?.specs?.text,
						originPlace: item?.placeOfOrigin?.text,
						warehouseId: this.warehouseId
					};
					params.baleNo = item?.baleNo?.text || null;
					this.getOutTheoryData(params, item);
				}
			}
			this.$forceUpdate();
		},
		async exportFile() {
			const params = {
				goodsList: this.list,
				workType: this.type
			};
			this.loading = true;
			try {
				const res = await exportExcel(params);
				const date = `${moment().format('YYYY-MM-DD')}日`.replace('-', '年').replace('-', '月');
				const name = `${date}${this.label}明细表.xlsx`;
				comDownload(res, undefined, name);
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		isNumber(value) {
			if (value === undefined || value === null || value === '') {
				return false;
			}
			if (typeof value === 'string') {
				//正整数
				var reNumber = /^\d+$/;
				//负整数
				var reNeNumber = /^-\d+$/;
				//正实数
				var reRealNumber1 = /^[1-9]\d*[.]\d+$/; //非零开头
				var reRealNumber2 = /^0[.]\d+$/; //零开头
				//负实数
				var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/; //非零开头
				var reNeRealNumber2 = /^-0[.]\d+$/; //零开头

				if (
					reNumber.test(value) ||
					reNeNumber.test(value) ||
					reRealNumber1.test(value) ||
					reRealNumber2.test(value) ||
					reNeRealNumber1.test(value) ||
					reNeRealNumber2.test(value)
				) {
					return true;
				} else {
					return false;
				}
			} else if (typeof value === 'number') {
				return true;
			} else {
				return false;
			}
		},
		// 获取级联
		async getOutCascade() {
			if (!this.warehouseId) return;
			const params = {
				warehouseId: this.warehouseId
			};
			const res = await getOutCascade(params);
			/** 品名 */
			const list = res.data || [];
			this.materialNameList = list;
		},
		/** 获取材质 */
		getMaterialTextureList(materialName) {
			if (!materialName) return [];
			if (!materialName.text) return [];

			// val 选择的品名
			const item = this.materialNameList.find(el => el.materialName == materialName.text) || {};
			return item.materialTextureList || [];
		},
		// 获取规格列表
		getSpecsList(materialName, materialTexture) {
			if (!materialName || !materialTexture) return [];
			// 获取材质列表
			const list = this.getMaterialTextureList(materialName);

			const item = list.find(el => el.materialTexture == materialTexture.text) || {};
			return item.specsList || [];
		},
		/** 获取厂家列表 */
		getPlaceOfOriginList(materialName, materialTexture, specs) {
			if (!materialName || !materialTexture || !specs) return [];
			const list = this.getSpecsList(materialName, materialTexture);

			const item = list.find(el => el.specs == specs.text) || {};
			return item.originPlaceList || [];
		},
		/** 获取捆包号 */
		getBaleNoList(materialName, materialTexture, specs, originPlace) {
			if (!materialName || !materialTexture || !specs || !originPlace) return [];

			const list = this.getPlaceOfOriginList(materialName, materialTexture, specs);

			const item = list.find(el => el.originPlace == originPlace.text) || {};
			return item.baleNoList || [];
		},
		// 获取理论 重量和数量
		async getOutTheoryData(params, item) {
			const res = await getOutTheoryData(params);

			item.cacheInventoryWeight = {
				text: res.data.weight
			};
			item.cacheInventoryQuantity = {
				text: res.data.quantity
			};
			item.inventoryQuantity = {
				text: res.data.quantity
			};
			item.inventoryWeight = {
				text: res.data.weight
			};

			this.computedInventory(item);
			this.$forceUpdate();
		},

		/** 保存的时候 传递数据 */
		save() {
			if (!this.list.length) {
				this.$message.error('至少有一条明细数据');
				return;
			}
			// 品名 材质 规格 厂家  重量 入库日期
			const flag = this.list.some(el => {
				if (!el.materialName || !el.materialTexture || !el.specs || !el.placeOfOrigin || !el.weight) {
					return true;
				}
				if (!el.materialName.text || !el.materialTexture.text || !el.specs.text || !el.placeOfOrigin.text || !el.weight.text) {
					return true;
				}
				if (this.isIn && !el.operateDate) {
					return true;
				}
				if (this.isIn && !el.operateDate.text) {
					return true;
				}
			});
			if (flag) {
				this.$message.error(`完成当前${this.label}明细的必填项`);
				return;
			}

			return {
				goodsList: this.list,
				attachId: this.attachId
			};
		}
	},

	components: {
		childFormItem,
		childFormItemNumber,
		childFormItemDate,
		childFormItemSelect
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	// margin: 0;
	.ant-card {
		padding-top: 0;
	}
	.slTitleAssis {
		margin-top: 6px;
	}
	.tab-box {
		box-sizing: border-box;
		width: 280px;

		height: 38px;
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		padding: 7px 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30px 0;
		box-sizing: border-box;
		.tab-item {
			color: rgba(0, 0, 0, 0.8);
			font-size: 14px;
			width: 80px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			&.active {
				background: @primary-color;
				border-radius: 4px;
				color: #fff;
			}
		}
	}
	.tab-box2 {
		width: 192px;
	}
	.upload-img {
		width: 280px;
		height: 152px;
		box-sizing: border-box;
		background: #f3f5f6;
		/* 元素/Line */
		border: 1px dashed #e5e6eb;
		border-radius: 4px;
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		/deep/ .ant-upload-select-picture-card {
			width: 100%;
			height: 100%;
			border: 0;
			background: #f3f5f6;
		}
	}
	.img-box {
		box-sizing: border-box;
		width: 712px;
		height: 414px;
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		&-title {
			width: 100%;
			height: 40px;
			background: #f3f5f6;
			border-radius: 3px 3px 0px 0px;
			display: flex;
			justify-content: space-between;
			padding: 0 20px;
			box-sizing: border-box;
			align-items: center;
		}
		&-content {
			padding-top: 18px;
			background: #888;
			border-radius: 0 0 4px 4px;
			position: relative;
		}
		&-icon {
			img {
				margin-left: 20px;
				cursor: pointer;
				width: 13px;
				height: 13px;
			}
		}
		.line {
			height: 10px;
			background: #888;
		}
		&-show {
			height: 296px;
			background: #888;
			position: relative;
			img,
			canvas {
				// width: 100%;
				// height: 100%;
				cursor: pointer;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				// object-fit: contain;

				width: 100%;
				height: 100%;
				// transform: translateX(-50%) translateY(-50%);
			}
			canvas {
				cursor: crosshair;
				z-index: 2;
			}
		}
		.scan {
			position: absolute;
			width: 40px;
			height: 371px;
			left: 0;
			top: 0;
			background: radial-gradient(100% 50% at 100% 50%, rgba(0, 255, 194, 0.69) 0%, rgba(0, 255, 194, 0) 100%);
			animation: fadezoom 8s linear infinite;
			z-index: 99;
		}
		@keyframes fadezoom {
			0% {
				left: 0;
			}
			100% {
				left: 600px;
			}
		}
		&-btn {
			height: 48px;
			background: rgba(0, 0, 0, 0.45);
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 0 0 4px 4px;
		}
	}
	.upload-file-box {
		display: flex;
		align-items: center;
	}
	.upload-file-btn,
	.download {
		width: 116px;
		height: 38px;
	}
	.download {
		background: #ffffff;
		border: 1px solid @primary-color;
		color: @primary-color;
		margin-left: 30px;
	}
}
.download-box {
	width: 80%;
}
.download-box:hover {
	.tpl-box {
		display: flex;
	}
}
.tpl-box {
	display: none;
	flex-direction: column;
	align-items: center;
	position: absolute;
	top: 0px;
	left: 154px;
	width: 154px;
	// height: 84px;
	background: #ffffff;
	border-radius: 4px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	padding: 10px 0;
	box-sizing: border-box;
	a {
		width: 154px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: rgba(0, 0, 0, 0.8);
	}
	a:hover {
		background: #e4ebf4;
	}
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 12px;
	margin-top: 20px;
}
.current-file-box {
	color: #8495aa;
	display: flex;
	align-items: center;
	margin-bottom: 30px;
	.current-file {
		padding: 5px 12px;
		background: #f3f5f6;
		border-radius: 4px;
		margin-left: 12px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
	}
}
.particulars {
	margin: 30px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	&-btn {
		width: 102px;
		background: #ffffff;
		border: 1px solid @primary-color;
		border-radius: 4px;
		color: @primary-color;
		margin-left: 20px;
	}
	&-btn2 {
		width: 112px;
		background: #ffffff;
		border: 1px solid @primary-color;
		border-radius: 4px;
		color: @primary-color;
		margin-left: 20px;
	}
}
/deep/ .sl-ipt {
	border-color: rgba(132, 149, 170, 0.3);
}
.ipt1 {
	width: 184px;
	height: 30px;
	// background: #FFFFFF;
	border-color: rgba(132, 149, 170, 0.3);
	border-radius: 4px;
	margin-right: 20px;
}
.new-table {
	/deep/ .ant-table-hide-scrollbar {
		background: #f3f5f6;
	}
	/deep/ .ant-table-thead > tr > th {
		// padding: 0px;
		padding-left: 12px;
		// padding-bottom: 8px;
		height: 48px;
		border-bottom: 0;
	}
	/deep/ .ant-table-header {
		border-radius: 4px;
	}
	/deep/ .ant-table-header-column {
		font-weight: 600;
		color: #77889d;
	}
	/deep/ tr td {
		// height: 47px;
		padding: 0px;
		padding-top: 8px;
		padding-bottom: 8px;

		// line-height: 47px;
	}
}

.error {
	/deep/ .ant-input-number {
		border-color: red;
	}
}
.total-weight {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	line-height: 20px;
	margin-top: 12px;
	margin-bottom: 20px;
	font-size: 14px;
}
/deep/ .ant-form-item {
	margin-bottom: 0;
}
/deep/ .ant-form-item {
	margin: 0;
	padding: 0;
}
/deep/ .ant-form-item-control {
	line-height: 1;
}
/deep/ .ant-table-tbody > tr:nth-child(2n) {
	background: #f3f5f6;
}
/deep/ .ant-table-row-selected {
	td {
		background: #fff !important;
	}
}
/deep/ .ant-table-row-selected:nth-child(2n) {
	td {
		background: #f3f5f6 !important;
	}
}
</style>
