<template>
	<div>
		<div class="category-upload">
			<a-table
				:dataSource="fileData"
				:columns="columns"
				:rowKey="record => record.url + record.name + record.id"
				:pagination="false"
				v-if="!ifUpdate"
			>
				<template
					slot="operation"
					slot-scope="text, record"
				>
					<a-space>
						<a
							class="edit-btn"
							@click.prevent="handlePreview(record)"
							>查看</a
						>
						<a-popconfirm
							v-if="fileData.length"
							title="确定删除该附件信息?"
							okText="确定"
							cancelText="取消"
							@confirm="() => toDelete(record)"
						>
							<a
								href="javascript:;"
								class="delete-btn"
								v-if="ifEditable && type != 'pay'"
								>删除</a
							>
							<a
								href="javascript:;"
								class="delete-btn"
								v-if="ifEditable && type == 'pay' && record.checked != 1"
								>删除</a
							>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
			<p
				class="add-wrap"
				@click="addFileType"
				v-if="ifEditable"
			>
				<i>+</i>新增{{ accessoryName }}
			</p>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="附件信息"
				centered
				v-model="modalFileWrapIsShow"
				okText="确定"
				cancelText="取消"
				:maskClosable="false"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				:confirmLoading="beginUpload"
				class="modal-file-info"
			>
				<template
					slot="footer"
					v-if="!ifEditable"
				>
					<a-button
						key="submit"
						@click="modalCancel"
						>取消</a-button
					>
				</template>
				<a-form
					:form="modalFileForm"
					layout="inline"
				>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="附件类型"
								:colon="false"
							>
								<a-select
									style="width: 200px"
									placeholder="请选择"
									@change="handleFileTypeChange"
									labelInValue
									:disabled="!ifEditable"
									v-decorator="[
										'fileType',
										{
											initialValue: initialValue.key && initialValue.label ? initialValue : undefined,
											rules: [{ required: true, message: '请选择附件类型' }]
										}
									]"
								>
									<!--发货附件 start-
                  汽运--动力煤--运输凭证--必填
                  汽运--焦炭、焦煤--运输凭证--必填（运费下游支付、其他为非必填）
                  汽运--兰炭、无烟煤、喷吹煤--运输凭证--非必填

                  火运--动力煤--大票（必填）、车号表 （必填）、其他凭证（非必填）
                  火运--焦炭--运输凭证--必填（运费下游支付、其他、焦炭006为非必填）
                  火运--焦煤--运输凭证---必填（运费下游支付、其他为非必填）
                  火运--兰炭、无烟煤、喷吹煤--运输凭证--非必填

                  汽运和火运--汽运--动力煤--运输凭证--必填
                  汽运和火运--火运--动力煤--大票（必填）、车号表 （必填）、其他凭证（非必填）

                    船运--动力煤--运输凭证（必填）、化验报告（非必填）、其他凭证（非必填）
                    船运--焦炭---运输凭证（必填）、称重凭证（非必填）、其他凭证（非必填）
                    船运--焦煤---运输凭证（必填、运费下游支付、其他方式为非必填）、其他凭证（非必填）
                    船运--兰炭、无烟煤、喷吹煤---运输凭证（必填）、其他凭证（非必填）
                  **发货附件 end--->
									<!-- 发货附件 -->
									<template v-if="type == 'deliver'">
										<!-- 汽运 -->
										<template
											v-if="
												transType == CONSTANTS.transportModeDict.AUTOMOBILE ||
												despatchType == CONSTANTS.despatchModeDict.AUTOMOBILE
											"
										>
											<a-select-option value="YSPZ">运输凭证</a-select-option>
										</template>
										<!-- 火运 全煤种 -->
										<template
											v-if="transType == CONSTANTS.transportModeDict.TRAIN || despatchType == CONSTANTS.despatchModeDict.TRAIN"
										>
											<a-select-option value="DP">大票</a-select-option>
											<a-select-option value="CHB">车号表</a-select-option>
											<a-select-option value="OTHER">其他凭证</a-select-option>
										</template>
										<template v-if="transType == CONSTANTS.transportModeDict.SHIP">
											<!-- 船运-动力煤 -->
											<template v-if="coalType == CONSTANTS.coalTypeDict.STEAM_COAL">
												<a-select-option value="YSPZ">运输凭证</a-select-option>
												<a-select-option value="HYBG">化验报告</a-select-option>
												<a-select-option value="DELIVER_SHIP_HARBOR">港口确认凭证</a-select-option>
												<a-select-option value="OTHER">其他凭证</a-select-option>
											</template>
											<!-- 船运-焦炭、焦煤-->
											<template v-if="coalType == CONSTANTS.coalTypeDict.COKE || coalType == CONSTANTS.coalTypeDict.COKING_COAL">
												<a-select-option value="YSPZ">运输凭证</a-select-option>
												<a-select-option value="CZPZ">称重凭证</a-select-option>
												<a-select-option value="DELIVER_SHIP_HARBOR">港口确认凭证</a-select-option>
												<a-select-option value="OTHER">其他凭证</a-select-option>
											</template>
											<!-- 船运-兰炭、无烟煤、喷吹煤-->
											<template
												v-if="
													coalType == CONSTANTS.coalTypeDict.SEMI_COKE ||
													coalType == CONSTANTS.coalTypeDict.SMOKELESS_COAL ||
													coalType == CONSTANTS.coalTypeDict.INJECTION_COAL
												"
											>
												<a-select-option value="YSPZ">运输凭证</a-select-option>
												<a-select-option value="DELIVER_SHIP_HARBOR">港口确认凭证</a-select-option>
												<a-select-option value="OTHER">其他凭证</a-select-option>
											</template>
										</template>
									</template>
									<!--收货附件 start-
                    汽运--动力煤--其他凭证（非必填）、化验凭证（必填）、磅单（必填）、磅单明细（必填）
                    汽运--焦炭、焦煤--化验凭证（非必填）、称重凭证（必填）
                    汽运--兰炭、无烟煤、喷吹煤--化验凭证（非必填）、称重凭证（非必填）

                    火运--动力煤--化验凭证（必填）、称重凭证（必填）
                    火运--焦炭、焦煤--化验凭证（非必填）、称重凭证（必填）
                    火运--兰炭、无烟煤、喷吹煤--化验凭证（非必填）、称重凭证（非必填）

                    汽运和火运--汽运--动力煤--其他凭证（非必填）、化验凭证（必填）、磅单（必填）、磅单明细（必填）
                    汽运和火运--动力煤--化验凭证（必填）、称重凭证（必填）

                    船运--动力煤--称重凭证（必填）、化验凭证（必填）、其他凭证（非必填）
                    船运--焦炭、焦煤、兰炭、无烟煤、喷吹煤--称重凭证（非必填）、化验凭证（必填）、港口货转凭证（非必填）、其他凭证（非必填）
                  **收货附件 end--->
									<template v-if="type == 'receive'">
										<!-- 汽运 -->
										<template
											v-if="
												transType == CONSTANTS.transportModeDict.AUTOMOBILE ||
												despatchType == CONSTANTS.despatchModeDict.AUTOMOBILE
											"
										>
											<!-- 动力煤汽运 -->
											<template v-if="coalType == CONSTANTS.coalTypeDict.STEAM_COAL">
												<a-select-option value="HYPZ">化验凭证</a-select-option>
												<a-select-option value="BD">磅单</a-select-option>
												<a-select-option value="BDMX">磅单明细</a-select-option>
												<a-select-option value="OTHER">其他凭证</a-select-option>
											</template>
											<!-- 非动力煤汽运 -->
											<template v-if="coalType != CONSTANTS.coalTypeDict.STEAM_COAL">
												<a-select-option value="CZPZ">称重凭证</a-select-option>
												<a-select-option value="HYPZ">化验凭证</a-select-option>
											</template>
										</template>
										<!-- 火运 -->
										<template
											v-if="transType == CONSTANTS.transportModeDict.TRAIN || despatchType == CONSTANTS.despatchModeDict.TRAIN"
										>
											<a-select-option value="CZPZ">称重凭证</a-select-option>
											<a-select-option value="HYPZ">化验凭证</a-select-option>
										</template>
										<!-- 船运 -->
										<template v-if="transType == CONSTANTS.transportModeDict.SHIP">
											<!-- 动力煤船运 -->
											<template v-if="coalType == CONSTANTS.coalTypeDict.STEAM_COAL">
												<a-select-option value="CZPZ">称重凭证</a-select-option>
												<a-select-option value="HYPZ">化验凭证</a-select-option>
												<a-select-option value="OTHER">其他凭证</a-select-option>
											</template>
											<!-- 非动力煤船运、焦炭、焦煤、兰炭、无烟煤、喷吹煤-->
											<template v-if="coalType != CONSTANTS.coalTypeDict.STEAM_COAL">
												<a-select-option value="CZPZ">称重凭证</a-select-option>
												<a-select-option value="HYPZ">化验凭证</a-select-option>
												<a-select-option value="GKHZPZ">港口货转凭证</a-select-option>
												<a-select-option value="OTHER">其他凭证</a-select-option>
											</template>
										</template>
									</template>
									<!--付款附件 start-
                    走配置fileConfigList
                  **付款附件 end--->
									<template v-if="type == 'pay'">
										<a-select-option
											:value="item.type"
											v-for="item in bankPayConfig.fileConfigList"
											:key="item.type"
											>{{ item.typeDesc }}</a-select-option
										>
									</template>
									<template v-if="type == 'addpay'">
										<template v-if="payType == 4">
											<a-select-option value="OTHER">其他凭证</a-select-option>
										</template>
										<template v-else>
											<a-select-option value="DFZM">代发证明</a-select-option>
											<a-select-option value="28">核算表</a-select-option>
											<a-select-option value="WTJSH">委托结算函</a-select-option>
										</template>
									</template>

									<template v-if="type == 'collect'">
										<a-select-option value="YHDZHD">银行电子回单</a-select-option>
										<a-select-option value="QTDJ">其他单据</a-select-option>
									</template>

									<template v-if="type == 'releaseDCG'">
										<a-select-option value="TMD">提煤单</a-select-option>
									</template>
									<!-- 货转开具-动力煤船运-货转证明 -->
									<template
										v-if="
											type == 'goodsTransfer' &&
											transType == CONSTANTS.transportModeDict.SHIP &&
											coalType == CONSTANTS.coalTypeDict.STEAM_COAL
										"
									>
										<a-select-option value="HQZYZM">货转证明</a-select-option>
									</template>
									<!-- 补录合同附件 -->
									<template v-if="type == 'contract'">
										<a-select-option value="OFFLINE_CONTRACT">线下合同</a-select-option>
										<a-select-option value="BID_PROOF">中标佐证</a-select-option>
										<a-select-option value="BCXY">补充协议</a-select-option>
									</template>
									<!-- 补录合同现场签订附件 -->
									<template v-if="type == 'contractScene'">
										<a-select-option value="SCENE_SIGN_IMG">现场签订照片</a-select-option>
									</template>
									<!-- 补录合同下游发票附件 -->
									<template v-if="type == 'contractInvoice'">
										<a-select-option value="INFO_CHANGE_FILE">信息变更函</a-select-option>
										<a-select-option value="OTHER_PROVE_FILE">其他证明材料</a-select-option>
									</template>
									<!-- 发运数据补录 -->
									<template v-if="type == 'logistics'">
										<!-- 汽运 -->
										<template
											v-if="
												transType == CONSTANTS.transportModeDict.AUTOMOBILE ||
												despatchType == CONSTANTS.despatchModeDict.AUTOMOBILE
											"
										>
											<a-select-option value="BD">磅单</a-select-option>
											<a-select-option value="BDMX">磅单明细</a-select-option>
											<a-select-option value="HYPZ">化验凭证</a-select-option>
											<a-select-option value="OTHER">其他凭证</a-select-option>
										</template>
										<!-- 火运 -->
										<template
											v-if="transType == CONSTANTS.transportModeDict.TRAIN || despatchType == CONSTANTS.despatchModeDict.TRAIN"
										>
											<a-select-option value="DP">铁路大票</a-select-option>
											<a-select-option value="CHB">车号表</a-select-option>
											<a-select-option value="HYPZ">化验凭证</a-select-option>
											<a-select-option value="OTHER">其他凭证</a-select-option>
										</template>
										<!-- 船运 -->
										<template v-if="transType == CONSTANTS.transportModeDict.SHIP">
											<a-select-option value="CZPZ">称重凭证</a-select-option>
											<a-select-option value="HYPZ">化验凭证</a-select-option>
											<a-select-option value="OTHER">其他凭证</a-select-option>
										</template>
									</template>
									<!-- 发运数据补录收货附件 -->
									<template v-if="type == 'offlineConsig'">
										<a-select-option value="CZPZ">称重凭证</a-select-option>
										<a-select-option value="HYPZ">化验凭证</a-select-option>
										<a-select-option value="OTHER">其他凭证</a-select-option>
									</template>
									<!-- 回款流水附件 -->
									<template v-if="type == 'collection'">
										<a-select-option value="COLLECTION_DJ">回款单</a-select-option>
										<a-select-option value="COLLECTION_QT">其他材料</a-select-option>
									</template>
									<!-- 自定义 -->
									<template v-if="type == 'custom'">
										<a-select-option
											v-for="item in selectOptions"
											:key="item.value"
											:value="item.value"
											>{{ item.text }}</a-select-option
										>
									</template>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="附件"
								:colon="false"
								:class="ifEditable ? '' : 'unEditable'"
							>
								<!-- 付款申请 --核算表不需要盖章 保留原样-->
								<template>
									<a-upload
										:headers="headers"
										v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
										:beforeUpload="beforeUpload"
										:action="
											type == 'receive' || type == 'deliver' || type == 'logistics'
												? canUpload
													? actionMark
													: action
												: actionMark
										"
										:multiple="true"
										listType="picture-card"
										:fileList="fileList"
										@preview="handlePreview"
										@change="fileChange"
										name="file"
										:remove="removeFile"
									>
										<div v-if="ifEditable && fileList.length < 100">
											<i class="file_icon"></i>
											<div class="ant-upload-text">点击选择</div>
										</div>
									</a-upload>
								</template>
								<a-modal
									v-if="!isNeedRotate"
									:visible="previewVisible"
									:footer="null"
									@cancel="handlePreviewCancel"
								>
									<a
										:href="previewImage"
										target="_blank"
									>
										<img
											alt="example"
											style="width: 100%"
											:src="previewImage"
										/>
									</a>
								</a-modal>
								<a-modal
									v-if="isNeedRotate"
									width="700px"
									height="700px"
									:visible="previewVisible"
									:footer="null"
									@cancel="handlePreviewRotateCancel"
								>
									<!-- 预览图片可旋转 -->
									<div class="img-wrapper">
										<div id="preview-img-id">
											<a
												:href="previewImage"
												target="_blank"
											>
												<img
													alt="example"
													:src="previewImage"
												/>
											</a>
										</div>
										<!--<div class="rotate-wrapper">
                      <a-icon class="rotate-icon" @click="handleClick" type="redo" />
                    </div>-->
									</div>
									<div style="text-align: center"><a-button @click="handleClick">旋转</a-button></div>
								</a-modal>
							</a-form-item>
							<div
								class="file-notice"
								v-if="ifEditable"
							>
								<p>附件上传要求：</p>
								<!--                    发货火运附件文案统一-->
								<template
									v-if="
										type == 'deliver' &&
										(transType == CONSTANTS.transportModeDict.TRAIN || despatchType == CONSTANTS.despatchModeDict.TRAIN)
									"
								>
									<p>
										1.仅支持上传一列火车的附件材料。 <br />
										2.铁路大票必须是pdf或者图片（jpg、jpeg、png、ofd），且文件中须包含发运列次所有运单号。<br />
										3. 车号表与其他凭证可支持格式为：png，jpeg，jpg，gif，pdf，doc，docx，xlsx，xls。 <br />
										4. 单个附件大小不得超过100M。 <br />
									</p>
								</template>
								<template v-else>
									<p
										v-for="(item, index) in newRequireList"
										:key="item + String(index)"
									>
										{{ index + 1 }}.{{ item }}
									</p>
									<p>
										<template v-if="newRequireList.length">{{ newRequireList.length + 1 }}.</template>可支持格式为{{
											myallowFormat.join('，')
										}}的附件，单个附件大小不得超过100M的文件。
									</p>
								</template>
							</div>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</div>
		<div class="category-list-wrap">
			<a-modal
				title="货转凭证"
				centered
				v-model="categoryListModel"
				:footer="null"
				:getContainer="modalContainer"
				:z-index="999"
				wrapClassName="category-list-wrap-hzpz"
			>
				<a-table
					width="100%"
					bordered
					:pagination="false"
					:closeable="true"
					:columns="categoryColumns"
					:rowKey="record => record.receiveNo"
					:dataSource="categoryData"
					:locale="{ emptyText: '暂无数据' }"
					@cancel="categoryListModel = false"
				>
					<template
						slot="options"
						slot-scope="text, record, index"
					>
						<a
							class="edit-btn"
							@click.prevent="editFileInfo(record, index)"
							>查看</a
						>
					</template>
				</a-table>
			</a-modal>
		</div>
		<!-- encodeURI图片地址解决图片地址含有中文及特殊符号无法预览问题 -->
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
		<a-modal
			:visible="videoVisible"
			:footer="null"
			wrapClassName="modal-none-padding"
			destroyOnClose
			width="520px"
			@cancel="videoVisible = false"
		>
			<video
				width="520"
				controls
				autoplay
			>
				<source
					:src="encodeURI(previewImg)"
					type="video/ogg"
				/>
				<source
					:src="encodeURI(previewImg)"
					type="video/mp4"
				/>
				<source
					:src="encodeURI(previewImg)"
					type="video/webm"
				/>
				<object data="movie.mp4">
					<embed
						width="520"
						:src="encodeURI(previewImg)"
					/>
				</object>
				您的浏览器不支持 video 标签,请下载观看。
			</video>
		</a-modal>
	</div>
</template>
<script>
import { API_UPLOAD_FILE, API_GETCURRENTENV, API_DeleteAttach, API_GetDownloadRAR, API_UPLOAD_WATER_MARk } from '@/v2/api';

import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
// import { reportLog} from "../../untils/factory.js"

const defaultFormat = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
export default {
	name: 'CustomUpload',
	props: {
		payType: {
			type: [String, Number],
			default: ''
		},
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		},
		ifEditable: {
			required: true,
			default: false
		},
		fileDataSource: {
			default() {
				return [];
			}
		},
		type: {
			required: true,
			default: ''
		},
		isShowGoodsValue: {
			default: false
		},
		// 运输方式 汽运|火运|汽运和火运｜船运
		transType: {
			default: ''
		},
		// 发运方式 汽运|火运
		despatchType: {
			default: ''
		},
		contractTemplate: {
			default: ''
		},
		// 运费支付方式 对方支付|下游支付等
		freightPayType: {
			type: String,
			default: ''
		},
		deliverId: {
			type: String,
			default: ''
		},
		// 查看货转时是和否需要添加显示货转列表的逻辑
		isNeedHZList: {
			type: Boolean,
			default: false
		},
		// 是否需要图片旋转功能,上传时文件能否预览
		isNeedRotate: {
			type: Boolean,
			default: false
		},
		coalType: {
			// 煤种
			type: String,
			default: ''
		},
		ifUpdate: {
			//是否是发货记录中的发货附件查看
			type: Boolean,
			default: false
		},
		canUpload: {
			// 用于判断收货、发货详情再次补充附件，true时调水印接口
			type: Boolean,
			default: false
		},
		bankPayConfig: {
			type: Object,
			default: () => {
				return { fileConfigList: [] };
			}
		},
		accessoryName: {
			// 代替附件名称
			type: String,
			default: '附件'
		},
		requireList: {
			// 附件要求列表
			type: Array,
			default: () => {
				return [];
			}
		},
		initialValue: {
			type: Object,
			default: () => {
				return {};
			}
		},
		uploadFilesJudge: {
			type: Function
		},
		// 线下合同的合同签章状态：单签或者双签
		signStatus: {
			type: Number,
			default: 1
		},
		//当type == custom 时该项必传
		selectOptions: {
			type: Array,
			default: () => []
		},
		defaultColumns: {
			type: Array
			// default:(
		}
	},
	watch: {
		fileDataSource() {
			this.init();
		},
		//当没有表单时，清空loading状态
		fileList(val) {
			if (!val.length) {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
			}
		},
		initialValue: {
			immediate: true,
			handler(val) {
				this.handleFileTypeChange(val);
			}
		}
	},
	data() {
		return {
			myallowFormat: defaultFormat, // 默认文件类型
			receiveFormat: ['jpg', 'jpeg', 'png', 'gif', 'pdf'], // 收货确认文件类型
			contractFormat: ['jpg', 'jpeg', 'png', 'pdf', 'bmp'], //线下合同文件类型、线下发货补录文件类型
			contractSceneFormat: ['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'avi', '3gp', 'mkv'], //contractSceneFormat
			fileData: [],
			previewImg: '',
			columns: this.defaultColumns || [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					width: '40%'
				},
				{
					title: '文件名',
					dataIndex: 'name',
					align: 'center',
					width: '30%'
				},
				{
					title: '操作',
					width: '30%',
					dataIndex: 'operation',
					align: 'center',
					scopedSlots: { customRender: 'operation' }
				}
			],
			categoryColumns: [
				{
					title: '收货编号',
					dataIndex: 'receiveNo'
				},
				{
					title: '收货日期',
					dataIndex: 'receiveDate'
				},
				{
					title: '操作',
					dataIndex: 'options',
					scopedSlots: { customRender: 'options' }
				}
			],
			categoryData: [],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			actionMark: API_UPLOAD_WATER_MARk, // 上传附件加水印
			previewVisible: false,
			previewImage: '',
			fileList: [],
			ifAddStatus: false,
			modifyIndex: 0,
			yspzUrlDisabled: false,
			otherUrlDisabled: false,
			czpzUrlDisabled: false,
			hypzUrlDisabled: false,
			dfzmUrlDisabled: false,
			wtjshUrlDisabled: false,
			gkhzpzUrlDisabled: false,
			yhdzhdUrlDisabled: false,
			tmdUrlDisabled: false,
			jjdUrlDisabled: false,
			//发货-动力煤船运-港航货物交接清单ghhyjjqdUrlDisabled、水路货物运单slydUrlDisabled、化验报告hybgUrlDisabled
			ghhyjjqdUrlDisabled: false,
			slydUrlDisabled: false,
			hybgUrlDisabled: false,
			//收货-动力煤船运-称重凭证、下游化验单
			xyhydUrlDisabled: false,
			//货转开具-动力煤船运-货转证明
			hzzmUrlDisabled: false,
			deg: 0,
			yspzUrls: '',
			categoryListModel: false, // 是否显示凭证列表
			beginUpload: false,
			ele: null,
			videoVisible: false,
			newRequire: []
		};
	},
	mounted() {
		// 合同编号是19的时候初始化一下，其他情况初始化会有问题
		// TODO fix 这块有问题，需要后续解决)
		if (this.contractTemplate === this.CONSTANTS.contractTemplateDict.OFFLINE) this.init();

		// 收货类型
		// this.myallowFormat = this.type == 'receive' ? this.receiveFormat : defaultFormat
		//文件类型
		switch (this.type) {
			case 'receive':
				this.myallowFormat = this.receiveFormat;
				break;
			case 'contract':
				//线下合同
				this.myallowFormat = this.contractFormat;
				break;
			case 'contractInvoice':
				//线下合同下游发票附件
				this.myallowFormat = this.contractFormat;
				break;
			case 'contractScene':
				//线下合同现场签订照片
				this.myallowFormat = this.contractSceneFormat;
				break;
			case 'logistics':
				//发运补录
				this.myallowFormat = this.contractFormat;
				break;
			case 'offlineConsig':
				//发运补录收货附件
				this.myallowFormat = this.contractFormat;
				break;
			default:
				this.myallowFormat = defaultFormat;
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		...mapGetters('pagination', {
			hsbUseType: 'hsbUseType'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		newRequireList() {
			//将组件内的条件备注与外部相结合
			return this.newRequire.concat(this.requireList);
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		handleFileTypeChange(value) {
			//附件类型为核算表时，判断是否需要盖章，修改附件类型
			this.myallowFormat = defaultFormat;
			//如果是补录合同选择线下合同，则增加提示
			if (this.type == 'contract' && value.key == 1) {
				this.newRequire = [
					'附件类型为线下合同时，您只能上传一份PDF文件或者多张图片。',
					`请上传${this.signStatus == 2 ? '双签' : '单签'}版合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息。`
				];
			} else if (
				(this.type == 'deliver' || this.type == 'logistics') &&
				(this.transType == this.CONSTANTS.transportModeDict.AUTOMOBILE ||
					this.despatchType == this.CONSTANTS.despatchModeDict.AUTOMOBILE) &&
				value.key == 5
			) {
				// 发货申请汽运-运输凭证附件上传提示语
				this.newRequire = ['请上传不低于每日入厂车数20%的磅单扫描件及所有入厂车号明细表。'];
			} else if (
				(this.type == 'deliver' || this.type == 'logistics') &&
				(this.transType == this.CONSTANTS.transportModeDict.TRAIN ||
					this.despatchType == this.CONSTANTS.despatchModeDict.TRAIN) &&
				value.key == 27
			) {
				// 发货申请火运-车号表附件上传提示语
				this.newRequire = ['请上传全部铁路大票车号明细表。'];
			} else {
				this.newRequire = [];
			}
			if (this.type == 'contract' || this.type == 'contractInvoice' || this.type == 'logistics' || this.type == 'offlineConsig') {
				//线下合同、线下合同下游发票附件、发运补录发运、发运补录收货类型固定
				this.myallowFormat = this.contractFormat;
			} else if (this.type == 'contractScene') {
				//线下合同现场签订文件类型
				this.myallowFormat = this.contractSceneFormat;
			}
			// 核算表文件类型单独设置
			if (value.key == 28) {
				if (this.type == 'addpay') {
					// 追加付款 核算表用图片
					this.myallowFormat = ['jpg', 'jpeg', 'png'];
				} else {
					this.myallowFormat = this.bankPayConfig.accountingExtType == 1 ? ['jpg', 'jpeg', 'png'] : ['xlsx', 'xls'];
				}
			}
			if (this.type == 'receive') {
				this.myallowFormat = this.type == 'receive' ? this.receiveFormat : defaultFormat;
				if (
					value.key == 24 ||
					(this.modalFileForm.getFieldValue('fileType') && this.modalFileForm.getFieldValue('fileType').key == 24)
				) {
					this.myallowFormat =
						value.key == 24 ? ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'doc', 'xlsx', 'xls'] : this.receiveFormat;
					if (this.modalFileForm.getFieldValue('fileType') && this.modalFileForm.getFieldValue('fileType').key == 24) {
						this.modalFileForm.resetFields(['uploadFiles']);
						this.fileList = [];
					}
				}
			}
		},
		handlePreview(data, isStaticFile = false) {
			let url = '';
			if (data.response) {
				url = data.response.data.fileUrl;
			}
			if (data.url) {
				url = data.url;
			}
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
				this.videoVisible = true;
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		init() {
			this.fileData = this.fileDataSource;
			// const fileData = [];

			var key = 1;
			this.fileDataSource.forEach(item => {
				const fileList = [];
				let obj = {
					key: item.type,
					type: item.type,
					typeName: item.typeName,
					uploadFiles: {
						fileList: fileList
					}
				};
				if (this.isNeedHZList && item.typeName === '货转凭证') {
					this.categoryData = JSON.parse(item.url || '[]');
					if (this.categoryData.length === 1 && !this.categoryData[0].receiveNo) {
						item.url = this.categoryData[0].pdfUrl;
						item.url.split(',').forEach(it => {
							fileList.push({
								uid: key++,
								name: it,
								status: 'done',
								url: API_GETCURRENTENV(it)
							});
						});
					} else {
						/**
						 * 针对汽运和火运自备车、北港接列的情况，存在一个批次对应对应多个货转凭证的情况
						 * 货转证明以jsonArray存放在fileUrl字段，如果只有一条数据且receiveNo字段为null，则只有一条货转凭证，还走之前逻辑，否则就是基于收货的货转，要先弹出货转凭证列表再进行查看
						 */
						this.categoryData.forEach(item => {
							obj.isMultiple = true; // 查看是否需要打开列表弹框的一个标志
							this.$set(item, 'url', item.pdfUrl);
							this.$set(item, 'type', 'hzpzUrl');
							this.$set(item, 'typeName', '货转凭证');
							this.$set(item, 'uploadFiles', {
								fileList: [
									{
										name: item.pdfUrl,
										status: 'done',
										uid: 1,
										url: API_GETCURRENTENV(item.pdfUrl)
									}
								]
							});
						});
					}
				} else {
					item.url.split(',').forEach(it => {
						fileList.push({
							uid: key++,
							name: it,
							status: 'done',
							url: API_GETCURRENTENV(it)
						});
					});
				}

				// fileData.push(obj)
			});
			// this.fileData = fileData;
			this.sendToFather();
		},
		modalContainer() {
			return document.body;
		},
		// 旋转图片
		handleClick(e) {
			this.deg = (this.deg + 90) % 360;
			let parentEle = e.target.offsetParent;
			if (parentEle) {
				this.ele = parentEle.querySelector('#preview-img-id');
				this.ele.style.transform = `rotate(${this.deg}deg)`;
			}
		},
		editFileInfo(record, index) {
			this.modalFileWrapIsShow = true;
			this.modifyIndex = index;
			this.ifAddStatus = false;
			this.fileList = [];
			this.$nextTick(() => {
				this.modalFileForm.setFieldsValue({
					fileType: { key: record.type, label: record.typeName },
					uploadFiles: record.uploadFiles
				});
			});
			this.fileList = record.uploadFiles.fileList;
			this.repeatOptionJudge();
		},
		repeatOptionJudge() {
			this.yspzUrlDisabled = false;
			this.otherUrlDisabled = false;
			this.czpzUrlDisabled = false;
			this.hypzUrlDisabled = false;
			this.dfzmUrlDisabled = false;
			this.wtjshUrlDisabled = false;
			this.gkhzpzUrlDisabled = false;
			this.tmdUrlDisabled = false;
			this.jjdUrlDisabled = false;
			//发货-动力煤船运
			(this.ghhyjjqdUrlDisabled = false),
				(this.slydUrlDisabled = false),
				(this.hybgUrlDisabled = false),
				//收货-动力煤船运-下游化验单
				(this.xyhydUrlDisabled = false),
				//货转开具-动力煤船运-货转凭证
				(this.hzzmUrlDisabled = false),
				this.fileData.forEach(item => {
					switch (item.type) {
						case 'yspzUrl':
							this.yspzUrlDisabled = true;
							break;
						case 'otherUrl':
							this.otherUrlDisabled = true;
							break;
						case 'czpzUrl':
							this.czpzUrlDisabled = true;
							break;
						case 'hypzUrl':
							this.hypzUrlDisabled = true;
							break;
						case 'dfzmUrl':
							this.dfzmUrlDisabled = true;
							break;
						case 'wtjshUrl':
							this.wtjshUrlDisabled = true;
							break;
						case 'gkhzpzUrl':
							this.gkhzpzUrlDisabled = true;
							break;
						case 'yhdzhdUrl':
							this.yhdzhdUrlDisabled = true;
							break;
						case 'tmdUrl':
							this.tmdUrlDisabled = true;
							break;
						case 'jjdUrl':
							this.jjdUrlDisabled = true;
							break;
						//发货-动力煤船运
						case 'ghhyjjqdUrl':
							this.ghhyjjqdUrlDisabled = true;
							break;
						case 'slydUrl':
							this.slydUrlDisabled = true;
							break;
						case 'hybgUrl':
							this.hybgUrlDisabled = true;
							break;
						//收货-动力煤船运-下游化验单
						case 'xyhydUrl':
							this.xyhydUrlDisabled = true;
							break;
						//货转开具-动力煤船运-货转证明
						case 'hzzmUrl':
							this.hzzmUrlDisabled = true;
							break;
					}
				});
		},
		modalFormSubmit() {
			this.modalFileForm.validateFields((err, values) => {
				if (!err) {
					if (this.fileList.length == 0) {
						this.$message.error('请上传文件');
						return;
					}
					if (
						this.type == 'deliver' &&
						(this.transType == this.CONSTANTS.transportModeDict.TRAIN ||
							this.despatchType == this.CONSTANTS.despatchModeDict.TRAIN)
					) {
						let dpVerify = ['jpg', 'jpeg', 'png', 'ofd', 'pdf'];
						for (let i = 0; i < this.fileList.length; i++) {
							if (values.fileType.key == 'DP') {
								if (
									dpVerify.indexOf(
										this.fileList[i].response.data.fileName.split('.')[
											this.fileList[i].response.data.fileName.split('.').length - 1
										]
									) == -1
								) {
									this.$message.error('铁路大票必须是pdf或者图片（jpg、jpeg、png、ofd）');
									return;
								}
							}
						}
					}
					let fileData = [...this.fileData];
					if (this.beginUpload) return; //如果有正在上传的文件 不能点击确定关闭
					// 判断是新增还是修改
					if (this.ifAddStatus) {
						values.uploadFiles.fileList.forEach(item => {
							fileData.push({
								key: values.fileType.key,
								type: values.fileType.key,
								typeName: values.fileType.label,
								dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
								name: item.response.data.fileName,
								url: item.response.data.fileUrl,
								md5Hex: item.response.data.md5Hex,
								...item.response
							});
						});
						// this.fileData.push({
						//     key: values.fileType.key,
						//     type: values.fileType.key,
						//     typeName: values.fileType.label,
						//     // fileNames: fileNames.join(","),
						//     uploadFiles:values.uploadFiles
						// })
					} else {
						// 无用代码
						if (this.ifEditable) {
							fileData.splice(this.modifyIndex, 1, {
								key: values.fileType.key,
								type: values.fileType.key,
								typeName: values.fileType.label,
								uploadFiles: values.uploadFiles
							});
						}
					}
					//判断是否有上传限制
					if (this.uploadFilesJudge) {
						//不满足限制条件，不上传
						if (!this.uploadFilesJudge(fileData)) {
							return;
						}
					}
					this.$message.success('操作成功');
					this.fileData = fileData;
					this.modalCancel();

					if (this.$listeners.onOk) {
						this.$emit('onOk', this.fileData.slice(-1)[0]);
					}

					this.sendToFather();
				}
			});
		},
		sendToFather() {
			// 发送父组件
			this.$emit('uploadFiles', this.fileData);
		},
		toDelete(data) {
			const fileData = [...this.fileData];
			this.fileData = fileData.filter(item => item.url !== data.url);
			this.sendToFather();
			if (this.$listeners.deleteFiles) {
				this.$emit('deleteFiles', data);
			}
		},
		onDelete(data) {
			if (!data.id) {
				this.toDelete(data);
				return;
			}
			// this.$emit('deleteFiles', data)
			if (this.$listeners.deleteFiles) {
				this.$emit('deleteFiles', data);
			} else {
				API_DeleteAttach({ id: data.id }).then(res => {
					if (res.success) {
						this.toDelete(data);
						this.$message.success('删除成功');
					}
				});
			}
			// this.$emit('uploadFiles', this.fileData)
			// this.sendToFather();
		},
		modalCancel() {
			this.fileList = [];
			this.newRequire = [];
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		handlePreviewCancel() {
			this.previewVisible = false;
		},
		handlePreviewRotateCancel() {
			if (this.ele) this.ele.style.transform = `rotate(0deg)`;
			this.deg = 0;
			this.ele = null;
			this.previewVisible = false;
		},
		fileChange({ fileList, event, file }) {
			this.fileList = fileList;
			this.beginUpload = true;
			if (this.isNeedRotate) {
				this.fileList.forEach(item => {
					if (item.response) {
						this.$set(item, 'thumbUrl', ENV.BASE_NET + item.response.data.fileUrl);
					}
				});
			}
			if (
				fileList.length &&
				fileList.some(item => {
					return item.status == 'uploading';
				})
			) {
				this.beginUpload = true;
				this.VUEX_MU_LOADING(true);
			} else {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
			}
		},
		beforeUpload(file) {
			let allowFormat = this.myallowFormat;
			// 火运发货附件要求
			if (
				this.type == 'deliver' &&
				(this.transType == this.CONSTANTS.transportModeDict.TRAIN || this.despatchType == this.CONSTANTS.despatchModeDict.TRAIN)
			) {
				if (this.modalFileForm.getFieldValue('fileType')) {
					// 铁路大票
					if (this.modalFileForm.getFieldValue('fileType').key == 'DP') {
						allowFormat = ['pdf', 'jpg', 'jpeg', 'png', 'ofd'];
					} else {
						// 车号票、其他凭证
						allowFormat = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls'];
					}
				}
			}
			let isAllowFormat = false;
			let ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
			if (allowFormat.indexOf(ext) == -1) {
				this.$message.error('仅支持' + allowFormat.join('，') + '的格式');
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}

			const t = this;
			function fileTypeJudge() {
				if (
					(file.name.indexOf('.jpg') > 0 ||
						file.name.indexOf('.jpeg') > 0 ||
						file.name.indexOf('.png') > 0 ||
						file.name.indexOf('.gif') > 0 ||
						file.name.indexOf('.pdf') > 0 ||
						file.name.indexOf('.docx') > 0 ||
						file.name.indexOf('.doc') > 0 ||
						file.name.indexOf('.xls') > 0 ||
						file.name.indexOf('.xlsx') > 0 ||
						file.name.indexOf('.rar') > 0 ||
						file.name.indexOf('.zip') > 0) &&
					file.size / 1024 / 1024 > 100
				) {
					// t.$message.error("该格式附件不能大于10M，请重新选择");
					t.$message.error('单个附件大小不得超过100M');
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}

			let ifOverSize = fileTypeJudge();
			return new Promise((resolve, reject) => {
				if (isAllowFormat && !ifOverSize) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},
		addFileType() {
			this.modalFileWrapIsShow = true;
			this.ifAddStatus = true;
			this.repeatOptionJudge();
			if (
				this.type == 'goodsTransfer' &&
				this.transType == this.CONSTANTS.transportModeDict.SHIP &&
				this.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL &&
				this.fileData.length == 0
			) {
				// 货转开具--动力煤船运默认选中“货转证明”类型
				let that = this;
				that.$nextTick(() => {
					setTimeout(function () {
						that.modalFileForm.setFieldsValue({ fileType: { key: 'HQZYZM', label: '货转证明' } });
					});
				});
			}
		},
		removeFile() {
			if (!this.ifEditable) {
				this.$message.error('不能删除');
				return false;
			} else {
				if (this.fileList.length <= 1) {
					this.fileList = [];
				}
			}
		}
	}
};
</script>
<style lang="less">
.category-upload {
	width: 100%;
	.edit-btn {
		color: #0053db;
	}
	.delete-btn {
		color: #ff2929;
	}
	.line {
		padding: 0 10px;
	}
	.ant-table-placeholder {
		border-bottom: none;
	}
	.ant-table-row {
		td {
			overflow: hidden;
			word-break: break-all;
		}
	}
	.add-wrap {
		width: 100% !important;
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
}
.modal-file-info {
	width: 90% !important;
	label {
		width: 100px;
		display: inline-block;
		text-align: left;
	}
	.file_icon {
		margin: 0 auto;
		display: block;
		background: url(~@/assets/imgs/upload/file_icon.png) no-repeat right center;
		width: 28px;
		height: 22px;
		margin-bottom: 10px;
	}
	.file-notice {
		color: #333;
		font-size: 14px;
	}
	.unEditable {
		.anticon-delete {
			display: none;
		}
	}
}
.row {
	margin-bottom: 10px;
}
.img-wrapper {
	margin: auto;
	position: relative;
	height: 600px;
	width: 600px;
	#preview-img-id {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		user-select: none;
		a {
			user-select: none;
		}
		img {
			max-width: 600px;
			max-height: 600px;
			pointer-events: none;
		}
	}
	&:hover .rotate-wrapper {
		display: flex;
	}
	.rotate-wrapper {
		justify-content: center;
		align-items: center;
		position: absolute;
		display: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.rotate-icon {
			font-size: 80px;
			color: rgba(0, 0, 0, 0.3);
			cursor: pointer;
		}
	}
}
</style>
