<template>
	<div>
		<div class="category-upload-1">
			<a-table
				:dataSource="fileData"
				:columns="columns"
				:rowKey="record => record.url"
				:pagination="false"
			>
				<template
					slot="operation"
					slot-scope="text, record, index"
				>
					<a
						href="javascript:;"
						class="edit-btn"
						@click="handlePreview(record)"
						>查看</a
					>
					<span
						class="line"
						v-if="hasDownload"
						>|</span
					>
					<a
						v-if="hasDownload"
						href="javascript:;"
						class="edit-btn"
						@click="download(record)"
						>下载</a
					>
					<span
						class="line"
						v-if="ifEditable"
						>|</span
					>
					<a-popconfirm
						v-if="fileData.length"
						title="确定删除该附件信息?"
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
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				class="modal-file-info-upload-1"
			>
				<template
					slot="footer"
					v-if="!ifEditable"
				>
					<a-button
						key="submit"
						@click="modalCancel"
					>
						取消
					</a-button>
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
									labelInValue
									:disabled="!ifEditable"
									v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
								>
									<template v-for="(item, index) in fileTypeList">
										<a-select-option
											:value="item.value"
											:key="index"
											v-if="item.isShow"
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
								<a-upload
									:headers="headers"
									v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件类型' }] }]"
									:beforeUpload="beforeUpload"
									:action="uploadType == 'receive' || uploadType == 'deliver' ? action : actionMark"
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
							</a-form-item>
							<div
								class="file-notice"
								v-if="ifEditable"
							>
								<p>附件上传要求：</p>
								<!--                              火运附件统一文案-->
								<template
									v-if="
										uploadType == 'deliver' &&
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
								<!--                              非火运-->
								<template v-else>
									<!-- 发货申请汽运-运输凭证附件上传提示语 -->
									<p
										v-if="
											uploadType == 'deliver' &&
											(transType == CONSTANTS.transportModeDict.AUTOMOBILE ||
												despatchType == CONSTANTS.transportModeDict.AUTOMOBILE) &&
											this.modalFileForm.getFieldValue('fileType') &&
											this.modalFileForm.getFieldValue('fileType').key == 5
										"
									>
										请上传不低于每日入厂车数20%的磅单扫描件及所有入厂车号明细表。
									</p>
									<!-- 线下合同附件上传提示语 -->
									<p
										v-if="
											type == 'contract' &&
											this.modalFileForm.getFieldValue('fileType') &&
											this.modalFileForm.getFieldValue('fileType').key == 1
										"
									>
										请上传{{
											signStatus == 2 ? '双签' : '单签'
										}}版合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息。
									</p>
									<p>
										可支持格式为jpg，jpeg，png，gif，pdf，docx，doc，xlsx，xls，rar，zip的附件，单个附件大小不得超过100M的文件。
									</p>
								</template>
							</div>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</div>
		<ProofModel
			ref="proofModel"
			type="yspz"
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
import { API_UPLOAD_FILE, API_GETCURRENTENV, API_DeleteAttach, API_GetDownloadRAR, API_UPLOAD_WATER_MARk } from '@/v2/api';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import ProofModel from '@/v2/components/receive/ProofModel';
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'CustomUpload1',
	props: {
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
			default: []
		},
		isNeedRotate: {
			type: Boolean,
			default: false
		},
		contractTemplate: {
			type: [String, Number],
			default: ''
		},
		coalType: {
			// 煤种
			type: String,
			default: ''
		},
		// 运输方式 汽运|火运|船运等
		transType: {
			default: ''
		},
		uploadType: {
			// deliver发货 receive收货 pay付款
			default: ''
		},
		hasDownload: {
			// 是否具有附件下载按钮，货转详情展示的时候有下载按钮
			type: Boolean,
			default: false
		},
		// 发运方式 汽运|火运
		despatchType: {
			default: ''
		}
	},
	components: { ProofModel },
	watch: {
		fileDataSource: {
			immediate: true,
			handler(data) {
				const fileData = [];
				var key = 1,
					typeName = '';
				data.forEach(item => {
					const fileList = [];
					if (item.fileUrl) {
						item.fileUrl.split(',').forEach(it => {
							fileList.push({
								uid: key++,
								name: it,
								status: 'done',
								url: API_GETCURRENTENV(it)
							});
						});
					}
					this.fileTypeList.forEach(i => {
						if (i.value == item.type) {
							typeName = i.text;
						}
					});
					fileData.push(item);
				});
				this.fileData = fileData;
				this.sendToFather();
			}
		},
		type() {
			this.ifOptionShow();
		}
	},
	data() {
		return {
			yspzUrls: '',
			previewImg: '',
			fileData: [],
			columns: [
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
			],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			actionMark: API_UPLOAD_WATER_MARk, // 上传附件加水印
			previewVisible: false,
			previewImage: '',
			fileList: [],
			ifAddStatus: false,
			modifyIndex: 0,
			resultData: [],
			fileTypeList: [
				{
					value: 'GXHT',
					disabled: false,
					text: '购销合同',
					isShow: false
				},
				{
					value: 'CZPZ',
					disabled: false,
					text: '称重凭证',
					isShow: false
				},
				{
					value: 'HQZYZM',
					disabled: false,
					text: '货转证明',
					isShow: false
				},
				{
					value: 'HYPZ',
					disabled: false,
					text: '化验凭证',
					isShow: false
				},
				{
					value: 5,
					disabled: false,
					text: '运输凭证',
					isShow: false
				},
				{
					value: 'DFZM',
					disabled: false,
					text: '代发证明',
					isShow: false
				},
				{
					value: 'WTJSH',
					disabled: false,
					text: '委托结算函',
					isShow: false
				},
				{
					value: 'JSD',
					disabled: false,
					text: '结算单',
					isShow: false
				},
				{
					value: 'ZZHD',
					disabled: false,
					text: '转账回单',
					isShow: false
				},
				{
					value: 'QTDJ',
					disabled: false,
					text: '其他单据',
					isShow: false
				},
				{
					value: 'GKHZPZ',
					disabled: false,
					text: '港口货转凭证',
					isShow: false
				},
				{
					value: 'TMD',
					disabled: false,
					text: '提煤单',
					isShow: false
				},
				{
					value: 'YHDZHD',
					disabled: false,
					text: '银行电子回单',
					isShow: false
				},
				{
					value: 'PCD',
					disabled: false,
					text: '派车单',
					isShow: false
				},
				{
					value: 'SHZM',
					disabled: false,
					text: '收货证明',
					isShow: false
				},
				{
					value: 'JJD',
					disabled: false,
					text: '交接单',
					isShow: false
				},
				{
					value: 'COMMITMENT',
					disabled: false,
					text: '承诺函',
					isShow: false
				},
				{
					value: 'SERVICEFEE',
					disabled: false,
					text: '服务费协议',
					isShow: false
				},
				{
					value: 'GHHYJJQD',
					disabled: false,
					text: '港航货物交接清单',
					isShow: false
				},
				{
					value: 'SLYD',
					disabled: false,
					text: '水路货物运单',
					isShow: false
				},
				{
					value: 'HYBG',
					disabled: false,
					text: '化验报告',
					isShow: false
				},
				{
					value: 'XYHYD',
					disabled: false,
					text: '下游化验单',
					isShow: false
				},
				{
					value: 'BD',
					disabled: false,
					text: '磅单',
					isShow: false
				},
				{
					value: 'BDMX',
					disabled: false,
					text: '磅单明细',
					isShow: false
				},
				{
					value: 'HQZYZM',
					disabled: false,
					text: '货转证明',
					isShow: false
				},
				{
					value: 'DP',
					disabled: false,
					text: '大票',
					isShow: false
				},
				{
					value: 'CHB',
					disabled: false,
					text: '车号表',
					isShow: false
				},
				{
					value: 'HSB',
					disabled: false,
					text: '核算表',
					isShow: false
				},
				{
					value: 'OTHER',
					disabled: false,
					text: '其他凭证',
					isShow: false
				},
				{
					value: 'DELIVER_SHIP_HARBOR',
					disabled: false,
					text: '港口确认凭证',
					isShow: false
				}
			],
			deg: 0,
			ele: null
		};
	},
	mounted() {
		this.ifOptionShow();
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
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		// 旋转图片
		handleClick(e) {
			this.deg = (this.deg + 90) % 360;
			let parentEle = e.target.offsetParent;
			if (parentEle) {
				this.ele = parentEle.querySelector('#preview-img-id');
				this.ele.style.transform = `rotate(${this.deg}deg)`;
			}
		},
		ifOptionShow() {
			this.type.forEach(item => {
				this.fileTypeList.map(i => {
					if (this.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
						if (i.text === '运输凭证') i.isShow = false;
						if (i.text === '称重凭证') i.isShow = true;
						if (i.text === '化验凭证') i.isShow = true;
					} else if (item == i.value) {
						i.isShow = true;
					}
					// 特殊情况  运输方式为汽运和火运 ，发运方式汽运和火运切换时
					if (this.type.includes('DP')) {
						if (i.text === '运输凭证') i.isShow = false;
					}
					if (this.type.includes('YSPZ')) {
						if (i.text === '大票') i.isShow = false;
						if (i.text === '车号表') i.isShow = false;
						if (i.text === '核算表') i.isShow = false;
					}
				});
			});
		},

		handlePreview(data, isStaticFile = false) {
			let url = '';
			if (data.response) {
				url = data.response.data ? data.response.data.fileUrl : data.response.fileUrl;
			}
			if (data.url) {
				url = data.url;
			}
			if (data.path) {
				url = data.path;
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
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		},

		editFileInfo(record, index) {
			// if (this.detail.platformType && this.detail.platformType != '99' && (record.type==='yspzUrl' || record.type==5 || record.typeName === '运输凭证')) {
			//   this.yspzUrls = record.uploadFiles.fileList.map(item => {return item.name}).join(',')
			//   this.$refs.proofModel.init(this.yspzUrls)
			// }else {
			//   this.modalFileWrapIsShow = true;
			//   this.modifyIndex = index;
			//   this.ifAddStatus = false;
			//   this.fileList = [];
			//   this.$nextTick(()=>{
			//     this.modalFileForm.setFieldsValue(
			//       {
			//         'fileType':{'key':record.key,'label':record.typeName},
			//         'uploadFiles':record.uploadFiles
			//       }
			//     )
			//   })
			//   this.fileList =record.uploadFiles.fileList
			//   this.repeatOptionJudge()
			// }
		},
		repeatOptionJudge() {
			this.fileTypeList.map(i => {
				i.disabled = false;
			});
			this.fileData.forEach(item => {
				if (item.type) {
					this.fileTypeList.map(i => {
						if (i.value == item.type) {
							i.disabled = true;
						}
					});
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
						this.uploadType == 'deliver' &&
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
					// 判断是新增还是修改
					if (this.ifAddStatus) {
						this.$message.success('添加成功');
						values.uploadFiles.fileList.forEach(item => {
							this.fileData.push({
								key: values.fileType.key,
								type: values.fileType.key,
								typeName: values.fileType.label,
								dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
								name: item.response.data.fileName,
								url: item.response.data.fileUrl,
								md5Hex: item.response.data.md5Hex
							});
						});
						// this.fileData.push({
						//     key: values.fileType.key,
						//     type: values.fileType.key,
						//     typeName: values.fileType.label,
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
			//     const fileUrlArr = [];
			//     item.uploadFiles.fileList.forEach((it)=>{
			//         // 第一次上传与修改有区别
			//         if(it.response){
			//             fileUrlArr.push(it.response.fileUrl)
			//         }else{
			//             fileUrlArr.push(it.name)
			//         }
			//     })
			//     this.resultData.push({
			//         fileUrl:fileUrlArr.join(','),
			//         type:item.key,
			//         typeName: item.typeName
			//     })
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
		onDelete(data) {
			const dele = () => {
				const fileData = [...this.fileData];
				this.fileData = fileData.filter(item => item.url !== data.url);
				this.sendToFather();
			};
			if (!data.id) {
				dele();
				return;
			}
			API_DeleteAttach({ id: data.id }).then(res => {
				if (res.success) {
					dele();
					this.$message.success('删除成功');
				}
			});
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
			this.previewVisible = false;
			this.ele = null;
		},
		fileChange({ fileList }) {
			this.fileList = fileList;
			if (this.isNeedRotate) {
				this.fileList.forEach(item => {
					if (item.response) {
						this.$set(item, 'thumbUrl', ENV.BASE_NET + item.response.data.fileUrl);
					}
				});
			}
			this.VUEX_MU_LOADING(true);
			if (!fileList.length) {
				this.VUEX_MU_LOADING(false);
			}
			if (fileList.length && fileList[fileList.length - 1].status == 'done') {
				this.VUEX_MU_LOADING(false);
			}
		},
		beforeUpload(file) {
			let allowFormat = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			// 火运发货附件格式
			if (
				this.uploadType == 'deliver' &&
				(this.transType == this.CONSTANTS.transportModeDict.TRAIN || this.despatchType == this.CONSTANTS.despatchModeDict.TRAIN)
			) {
				if (this.modalFileForm.getFieldValue('fileType')) {
					// 铁路大票
					if (this.modalFileForm.getFieldValue('fileType').key == 'DP') {
						allowFormat = ['jpg', 'jpeg', 'png', 'ofd'];
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
		},
		download(record) {
			// 下载货转证明附件
			if (record.attachId) {
				API_GetDownloadRAR(record.attachId).then(res => {
					comDownload(res, undefined, record.name);
				});
			}
			if (record.path) {
				let BASE_NET = ENV.BASE_NET;
				API_DOWNLPREVIEWTE(BASE_NET + record.path).then(res => {
					comDownload(res, record.path);
				});
			}
		}
	}
};
</script>
<style lang="less">
.category-upload-1 {
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
.modal-file-info-upload-1 {
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
