<template>
	<div>
		<div class="category-upload">
			<a-table
				:dataSource="fileData"
				:columns="newColumns"
				:rowKey="record => record.url"
				:pagination="false"
				v-if="!ifUpdate"
			>
				<template
					slot="operation"
					slot-scope="text, record"
				>
					<a
						class="edit-btn"
						@click.prevent="handlePreview(record)"
						>查看</a
					>
					<span
						class="line"
						v-if="ifEditable"
						>|</span
					>
					<a-popconfirm
						v-if="fileData.length"
						title="是否删除该附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => onDelete(record)"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							v-if="ifEditable"
							>删除</a
						>
					</a-popconfirm>
				</template>
			</a-table>
			<p
				class="add-wrap"
				@click="addFileType"
				v-if="ifEditable"
			>
				<i>+</i>新增附件
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
									v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
								>
									<!-- 下游合同补录 -->
									<template v-if="type == 'contract'">
										<a-select-option value="STEEL_BUSINESS_CONTRACT">下游钢材买卖合同</a-select-option>
									</template>
									<!-- 采购合同补录 -->
									<template v-if="type == 'buyContract'">
										<a-select-option value="STEEL_BUSINESS_CONTRACT">钢材买卖合同</a-select-option>
									</template>
									<template v-if="attachmentTypeList && attachmentTypeList.length > 0">
										<a-select-option
											:value="item.value"
											:key="item.value"
											v-for="item in attachmentTypeList"
											>{{ item.label }}</a-select-option
										>
									</template>
									<!-- 发货申请 -->
									<template v-if="type == 'deliver'">
										<a-select-option
											v-if="isScrapSteel"
											value="SHIPMENT_LIST"
											>发货单</a-select-option
										>
										<a-select-option
											v-else
											value="REINFORCEMENT_PLAN"
											>钢筋计划</a-select-option
										>
									</template>
									<!-- 收货确认 -->
									<template v-if="type == 'receive'">
										<a-select-option
											v-if="isScrapSteel"
											value="WEIGHING_LIST"
											>过磅单</a-select-option
										>
										<template v-else>
											<a-select-option value="UPSTREAM_DOCUMENTS">上游收货凭证</a-select-option>
											<a-select-option value="DOWNSTREAM_DOCUMENTS">下游收货凭证</a-select-option>
										</template>
									</template>
									<!-- 货转确认 -->
									<template v-if="type == 'transfer'">
										<a-select-option value="WEIGHING_LIST">货权转移证明</a-select-option>
									</template>
									<!-- 货转补录 -->
									<template v-if="type == 'additional'">
										<a-select-option value="WAREHOUSING_ORDER">入库单</a-select-option>
										<a-select-option value="OUTBOUND_ORDER">出库单</a-select-option>
										<a-select-option value="OTHER">其他</a-select-option>
									</template>
									<!-- 榆神货转开具 -->
									<template v-if="type == 'yuShen'">
										<a-select-option value="WAREHOUSING_ORDER">入库单</a-select-option>
										<a-select-option value="OTHER">其他</a-select-option>
									</template>
									<template v-if="type == 'settle'">
										<a-select-option value="OFFLINE_STATEMENT">线下结算单</a-select-option>
									</template>
									<template v-if="type == 'settleAdditional'">
										<a-select-option value="OFFLINE_STATEMENT">线下结算单</a-select-option>
									</template>
									<template v-if="type == 'yuShenSettle'">
										<a-select-option
											value="PAYMENT_TICKET"
											v-if="!['OTHER_MIDDLE'].includes(businessType)"
											>打款凭证</a-select-option
										>
										<a-select-option value="statementAttachType">货物变更佐证材料</a-select-option>
										<a-select-option value="OTHER">其他</a-select-option>
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
								<a-upload
									:headers="headers"
									v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
									:beforeUpload="beforeUpload"
									:action="action"
									:multiple="true"
									:disabled="!modalFileForm.getFieldValue('fileType')"
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
								<!-- 付款申请-核算表需盖章时，选中附件类型为核算表 文案修改-->
								<p
									v-if="
										accountingSeal &&
										modalFileForm.getFieldValue('fileType') &&
										modalFileForm.getFieldValue('fileType').key == '28'
									"
								>
									可支持格式为{{ myallowFormat.join('，') }}的附件，单个图片大小不得超过100M。
								</p>
								<p v-else>可支持格式为{{ myallowFormat.join('，') }}的附件，单个附件大小不得超过100M的文件。</p>
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
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import { API_GETCURRENTENV } from '@/v2/api';
import { API_SteelsUploadFileWaterMark } from '@/v2/center/steels/api';
import ImageViewer from '@sub/components/viewer/image.vue';
import { mapGetters, mapMutations } from 'vuex';
const columns = [
	{
		title: '类型',
		dataIndex: 'typeName',
		width: '40%'
	},
	{
		title: '文件名',
		dataIndex: 'name',
		width: '30%'
	},
	{
		title: '操作',
		width: '30%',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' }
	}
];
export default {
	name: 'CustomUpload',
	components: {
		ImageViewer
	},
	props: {
		attachmentTypeList: {
			type: Array,
			default: () => []
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
		isScrapSteel: {
			type: Boolean,
			default: false
		},
		// 合同模板

		// 运输方式 汽运|火运|汽运和火运｜船运
		transType: {
			default: ''
		},
		// 发运方式 汽运|火运
		despatchType: {
			default: ''
		},
		businessType: {
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
		allowFormat: {
			//核算表需要盖章的附件类型
			type: Array,
			default: () => {
				return [];
			}
		},
		accountingSeal: {
			//核算表需要盖章true
			type: Boolean,
			default: false
		},
		columns: {
			type: Array,
			default: () => columns
		}
	},
	watch: {
		fileDataSource: {
			handler(val) {
				this.init();
			},
			deep: true,
			immediate: true
		},

		accountingSeal: function (data) {
			this.accountingSeal = data;
			if (!this.accountingSeal) {
				this.myallowFormat = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			}
			//判断 核算表盖章情况情况下，已存在核算表，则核算表不可选
			if (this.fileData.length > 0) {
				let flag = true;
				this.fileData.forEach(item => {
					if (item.type == '28' && this.accountingSeal) {
						flag = flag && false;
					} else {
						flag = flag && true;
					}
				});
				this.hsbDisabled = !flag;
			} else {
				this.hsbDisabled = false;
			}
		},
		fileData: function (data) {
			//判断 核算表盖章情况情况下，已存在核算表，则核算表不可选
			if (data.length > 0) {
				let flag = true;
				data.forEach(item => {
					if (item.type == '28' && this.accountingSeal) {
						flag = flag && false;
					} else {
						flag = flag && true;
					}
				});
				this.hsbDisabled = !flag;
			} else {
				this.hsbDisabled = false;
			}
		},
		hsbDisabled: function (data) {
			this.hsbDisabled = data;
		}
	},
	data() {
		return {
			hsbDisabled: false, //核算表类型可选
			myallowFormat: ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'],
			fileData: [],
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
			action: API_SteelsUploadFileWaterMark,
			previewVisible: false,
			previewImage: '',
			fileList: [],
			ifAddStatus: false,
			modifyIndex: 0,
			resultData: [],
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
			ele: null
		};
	},

	mounted() {
		// 合同编号是19的时候初始化一下，其他情况初始化会有问题
		// TODO fix 这块有问题，需要后续解决)
		if (this.contractTemplate === this.CONSTANTS.contractTemplateDict.OFFLINE) this.init();
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
		newColumns() {
			if (this.columns) {
				return this.columns;
			}
			return columns;
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		handleFileTypeChange(value) {
			//附件类型为核算表时，判断是否需要盖章，修改附件类型
			if (value.key === 'ACCOUNTING_TABLE') {
				this.myallowFormat = ['png', 'jpeg', 'jpg'];
				return;
			}
			this.myallowFormat =
				value.key == '28' && this.accountingSeal
					? this.allowFormat
					: ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
		},

		handlePreview(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.path;
			}
			if (data.url) {
				url = data.url;
			}
			if (!url) {
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		init() {
			this.fileData = this.fileDataSource;
			var key = 1;
			this.fileDataSource.forEach(item => {
				item.url = item.url || item.filePath;
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
					if (this.beginUpload) return; //如果有正在上传的文件 不能点击确定关闭
					// 判断是新增还是修改
					if (this.ifAddStatus) {
						this.$message.success('添加成功');
						values.uploadFiles.fileList.forEach(item => {
							this.fileData.push({
								id: item.response.data.id,
								key: values.fileType.key,
								type: values.fileType.key,
								typeName: values.fileType.label,
								dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
								name: item.response.data.name,
								url: item.response.data.path,
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
							this.$message.success('修改成功');
							this.fileData.splice(this.modifyIndex, 1, {
								key: values.fileType.key,
								type: values.fileType.key,
								typeName: values.fileType.label,
								uploadFiles: values.uploadFiles
							});
						}
					}
					this.fileList = [];
					this.modalFileWrapIsShow = false;
					this.modalFileForm.resetFields();
					this.sendToFather();
				}
			});
		},
		sendToFather() {
			// 发送父组件
			// this.resultData = []
			// this.fileData.forEach((item)=>{
			//     const fileNames = [];
			//     item.uploadFiles.fileList.forEach((it)=>{
			//         // 第一次上传与修改有区别
			//         if(it.response){
			//             fileNames.push(it.response.fileUrl)
			//         }else{
			//             fileNames.push(it.name)
			//         }

			//     })
			//     this.resultData.push({[item.type]:fileNames.join(',')})
			// })
			this.resultData = [];
			let type = [];
			this.fileData.forEach(item => {
				type.push(item.type);
			});
			type = [...new Set(type)];

			type.forEach(item => {
				let arr = [];
				const obj = {};
				this.fileData.forEach(i => {
					if (item == i.type) {
						arr = [...arr, i.url];
					}
				});
				obj[item] = arr.join(',');
				this.resultData.push(obj);
			});
			// this.resultData 为旧的数据格式
			this.$emit('uploadFiles', this.fileData);
		},

		toDelete(data) {
			const fileData = [...this.fileData];
			this.fileData = fileData.filter(item => item.url !== data.url);
			this.sendToFather();
		},

		onDelete(data) {
			this.toDelete(data);
		},
		modalCancel() {
			this.fileList = [];
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
		// handlePreview(file) {
		//     // 添加与修改时返回格式不同
		//     let t = this;
		//     function getPreview(target,ifFullPath) {
		//         var jumpUrl = ifFullPath ? target : API_GETCURRENTENV(target)
		//         if(
		//             target.indexOf(".pdf")>-1
		//         ){
		//             window.open(jumpUrl);
		//         }else if(
		//             target.indexOf(".doc")>-1 ||
		//             target.indexOf(".docx")>-1 ||
		//             target.indexOf(".xlsx")>-1 ||
		//             target.indexOf(".xls")>-1
		//         ){
		//             jumpUrl = "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(jumpUrl)
		//             window.open(jumpUrl);
		//         } else{
		//             // t.previewImage = file.url || file.thumbUrl;
		//             t.previewImage = jumpUrl
		//             t.previewVisible = true;
		//         }
		//     }

		//     if(file.response){
		//         getPreview(file.response.fileUrl,false);
		//     }

		//     if(file.url){
		//         getPreview(file.url,true);
		//     }
		// },
		fileChange({ fileList, event, file }) {
			this.fileList = fileList;
			this.beginUpload = true;
			if (this.isNeedRotate) {
				this.fileList.forEach(item => {
					if (item.response) {
						this.$set(item, 'thumbUrl', item.response.data.path);
					}
				});
			}
			this.beginUpload = true;
			this.VUEX_MU_LOADING(true);
			if (!fileList.length) {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
				this.beginUpload = false;
			}
			if (fileList.length && fileList[fileList.length - 1].status == 'done') {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
				this.beginUpload = false;
			}
		},
		beforeUpload(file) {
			const allowFormat = this.myallowFormat;
			let isAllowFormat = false;
			if (allowFormat.indexOf(file.name.split('.')[file.name.split('.').length - 1].toLowerCase()) == -1) {
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
		checkHsb() {
			if (this.hsbUseType == 1) {
				this.hsbDisabled = true;
			}
		},
		addFileType() {
			this.checkHsb();
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
						that.modalFileForm.setFieldsValue({
							fileType: { key: 'HQZYZM', label: '货转证明' }
						});
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
		color: @primary-color;
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
