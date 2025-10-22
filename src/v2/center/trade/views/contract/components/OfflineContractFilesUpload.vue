<template>
	<div>
		<a-drawer
			class="contractFilesDrawer"
			:title="modelTitle"
			placement="right"
			:closable="false"
			:visible="drawerVisible"
			@close="onClose"
			:footer="null"
		>
			<a-form
				class="modalFileForm"
				:form="modalFileForm"
				layout="inline"
				:label-col="{ span: 24 }"
				:wrapper-col="{ span: 24 }"
			>
				<a-row class="row">
					<a-col :span="24">
						<a-form-item
							label="附件类型"
							:colon="false"
						>
							<a-select
								:getPopupContainer="getPopupContainer"
								style="width: 430px"
								placeholder="请选择"
								@change="handleFileTypeChange"
								labelInValue
								:disabled="!ifEditable"
								v-decorator="[
									'fileType',
									{
										rules: [{ required: true, message: '请选择附件类型' }]
									}
								]"
							>
								<a-select-option
									:value="item.value"
									v-for="item in uploadFileList"
									:key="item.value"
									>{{ item.label }}</a-select-option
								>
								<i
									slot="suffixIcon"
									class="select"
									style="fontsize: 14px"
								/>
								<slot></slot>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<!-- 附件类型为补充协议时展示 -->
				<template v-if="modalFileForm.getFieldValue('fileType') && modalFileForm.getFieldValue('fileType').key == '7'">
					<a-row class="row">
						<a-col
							:span="24"
							class="checkBox"
						>
							<a-form-item
								label="变更项"
								:colon="false"
							>
								<a-checkbox-group
									v-decorator="[
										'changeItem',
										{
											rules: [{ required: true, message: '变更项必填' }]
										}
									]"
								>
									<a-checkbox
										v-for="(item, index) in changeItemEnums"
										:key="item.value"
										:class="index > 6 ? 'marginBottom0' : ''"
										:value="item.value"
									>
										{{ item.text }}
									</a-checkbox>
								</a-checkbox-group>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="执行期"
								:colon="false"
							>
								<a-date-picker
									style="width: 45%"
									placeholder="开始时间"
									valueFormat="YYYY-MM-DD"
									:disabled-date="disabledExecutionDateStart"
									v-decorator="[
										`executionDateStart`,
										{
											rules: [{ required: true, message: `执行期开始时间必填` }]
										}
									]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
								～
								<a-date-picker
									style="width: 45%"
									placeholder="结束时间"
									valueFormat="YYYY-MM-DD"
									:disabled-date="disabledExecutionDateEnd"
									v-decorator="[`executionDateEnd`]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col
							:span="24"
							class="radioBox"
						>
							<a-form-item
								label="签章状态"
								:colon="false"
							>
								<a-radio-group
									v-decorator="[
										'signStatus',
										{
											rules: [{ required: true, message: '签章状态必填' }]
										}
									]"
								>
									<a-radio :value="1">单签</a-radio>
									<a-radio :value="2">双签</a-radio>
								</a-radio-group>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="签订日期"
								:colon="false"
							>
								<a-date-picker
									style="width: 100%"
									placeholder="请选择签订日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`signDate`,
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
							</a-form-item>
						</a-col>
					</a-row>
				</template>
				<a-row class="row">
					<a-col
						:span="24"
						class="fileBox"
					>
						<a-form-item
							label="附件"
							:colon="false"
							:class="ifEditable ? '' : 'unEditable'"
						>
							<template>
								<a-upload
									:headers="headers"
									v-decorator="[
										'uploadFiles',
										{
											rules: [{ required: true, message: '请选择附件' }]
										}
									]"
									:beforeUpload="beforeUpload"
									:action="actionMark"
									:multiple="true"
									:fileList="fileList"
									@preview="handlePreview"
									@change="fileChange"
									name="file"
								>
									<div v-if="ifEditable && !fileList.length">
										<i class="file_icon"></i>
										<div class="upload-text">上传附件</div>
										<div class="upload-tips">
											<template v-if="formatType === 'other'">
												<p v-if="contractType == 'trade'">
													当前附件类型您只能上传一份PDF文件或者多张图片（支持图片格式：jpg，jpeg，png，bmp）。 <br />
													单个附件大小不得超过100M。<br />
													请上传已签章合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息。
												</p>
												<p v-else>支持上传格式为jpg，jpeg，png，pdf，bmp的附件，单个附件大小不得超过100M。</p>
											</template>
											<template v-else>
												<p>支持上传格式为jpg，jpeg，png，pdf，bmp的附件，单个附件大小不得超过100M。</p>
											</template>
										</div>
									</div>
								</a-upload>
							</template>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>

			<div class="footer">
				<div>
					<a-button
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit"
						>提交</a-button
					>
				</div>
			</div>
		</a-drawer>
		<!-- 合同附件表格展示 -->
		<a-table
			bordered
			class="table_contractFile"
			:dataSource="table_contractFileData"
			:columns="columns"
			:rowKey="record => record.url + record.name + record.id"
			:pagination="false"
			v-if="(!table_contractFileData.length && !table_supplementalInfo.length) || table_contractFileData.length"
		>
			<template
				slot="name"
				slot-scope="text, record"
			>
				<a-space>
					<a
						class="edit-btn"
						@click.prevent="handlePreview(record)"
						>{{ text }}</a
					>
				</a-space>
			</template>
			<template
				slot="operation"
				slot-scope="operation, record, index"
			>
				<a-space>
					<a
						class="edit-btn"
						@click.prevent="editFileInfo(record, index)"
						>编辑</a
					>
					<a-popconfirm
						title="确定删除该附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => toDelete(record, index)"
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
		<a-table
			v-if="table_supplementalInfo.length"
			bordered
			:dataSource="table_supplementalInfo"
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
					@click.prevent="handlePreview(item)"
				>
					{{ item.name }}
					<span v-if="index < record.supplementalFile.length - 1">,</span>
				</a>
			</template>
			<template
				slot="operation"
				slot-scope="operation, record, index"
			>
				<a-space>
					<a
						class="edit-btn"
						@click.prevent="editFileInfo(record, index)"
						>编辑</a
					>
					<a-popconfirm
						title="确定删除该附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => toDeleteSupplement(record, index)"
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
		<a-modal
			class="confirmModal"
			:visible="modalVisible"
			width="490px"
			heigth="198px"
			@ok="handleOk"
			@cancel="handleCancel"
		>
			<p class="title">确定关闭侧边栏？</p>
			<p style="color: rgba(0, 0, 0, 0.5)">关闭侧边栏信息将不会储存</p>
		</a-modal>
		<!-- encodeURI图片地址解决图片地址含有中文及特殊符号无法预览问题 -->
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import { API_UPLOAD_WATER_MARk } from 'api';
import { mapGetters, mapMutations } from 'vuex';
import { getPopupContainer, TableRowSpanFunc } from '@/v2/utils/factory.js';
import { filterCodeByValueName, filterCodeByKey } from '@sub/utils/globalCode.js';
import ENV from 'api/env.js';
import moment from 'moment';

export default {
	name: 'OfflineContractFilesUpload',
	props: {
		// 是否可编辑
		ifEditable: {
			required: true,
			default: false
		},
		fileDataSource: {
			default() {
				return [];
			}
		},
		uploadFilesJudge: {
			type: Function
		},
		uploadFileList: {
			type: Array,
			default: () => []
		},
		contractType: {
			type: String,
			default: 'trade'
		},
		modelTitle: {
			type: String,
			default: '合同附件上传'
		}
	},
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			getPopupContainer,
			drawerVisible: false, // 抽屉
			modalVisible: false, // 弹窗
			modalFileForm: this.$form.createForm(this),
			actionMark: API_UPLOAD_WATER_MARk, // 上传附件加水印
			fileList: [],
			previewVisible: false,
			formatType: '', // other 代表除线下合同/补充协议外的附件类型
			previewImg: '',
			columns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					width: '30%',
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
					title: '文件名',
					dataIndex: 'name',
					align: 'center',
					width: '30%',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '上传时间',
					dataIndex: 'uploadTime',
					align: 'center',
					width: '20%'
				},
				{
					title: '操作',
					width: '20%',
					dataIndex: 'operation',
					align: 'center',
					scopedSlots: { customRender: 'operation' }
				}
			],
			ifAddStatus: false,
			modifyIndex: 0,
			changeItemEnums: filterCodeByKey('changeItemEnums'), // 补充协议变更项
			supplementalColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: '补充协议',
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.table_supplementalInfo.length;
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
					title: '文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '上传时间',
					dataIndex: 'uploadTime',
					align: 'center'
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
			table_contractFileData: this.fileDataSource.contractFileData || [],
			table_supplementalInfo: this.fileDataSource.supplementalInfo || [],
			editObj: {}, // 编辑对象
			fileTypeRequiredFlag: true
		};
	},
	watch: {
		fileDataSource() {
			this.init();
		},
		formatType(data) {
			this.formatType = data;
		},
		//当没有表单时，清空loading状态
		fileList(val) {
			if (!val.length) {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
			}
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
		}
	},
	mounted() {
		// this.init()
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		fileTypeRequired(value) {
			if (this.contractType == 'transport') {
				if (value.key == '5') {
					this.fileTypeRequiredFlag = false;
				} else {
					this.fileTypeRequiredFlag = true;
				}
			} else {
				this.fileTypeRequiredFlag = true;
			}
		},
		init() {
			this.table_contractFileData = this.fileDataSource.contractFileData || [];
			this.table_supplementalInfo = this.fileDataSource.supplementalInfo || [];
			if (this.table_contractFileData.length) {
				this.table_contractFileData.forEach((item, index) => {
					item.uploadFiles = {};
					item.uploadFiles.fileList = [
						{
							uid: index++,
							status: 'done',
							name: item.name,
							url: item.url,
							md5Hex: item.md5Hex
						}
					];
				});
			}
			if (this.table_supplementalInfo.length) {
				this.table_supplementalInfo.forEach((item, index) => {
					item.uploadFiles = {};
					let fileList = [];
					if (item.supplementalFile.length) {
						item.supplementalFile.forEach(pro => {
							let obj = {
								uid: index++,
								status: 'done',
								name: pro.name,
								url: pro.url,
								md5Hex: pro.md5Hex
							};
							fileList.push(obj);
						});
						item.uploadFiles.fileList = fileList;
					}
				});
			}
		},
		fileChange({ fileList }) {
			// 选择附件
			this.beginUpload = true;
			this.fileList = fileList;
			let obj = document.getElementsByClassName('anticon-delete');
			if (obj && obj.length) {
				for (let i = 0; i < obj.length; i++) {
					let targetObj = document.getElementsByClassName('anticon-delete')[i];
					let targetOpc = document.getElementsByClassName('ant-upload-list-item-card-actions')[i];
					targetObj.innerHTML = '删除';
					targetOpc.style.opacity = 1;
				}
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
			// 上传
			let allowFormat = ['jpg', 'jpeg', 'png', 'pdf', 'bmp'];
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
						file.name.indexOf('.bmp') > 0 ||
						file.name.indexOf('.pdf') > 0) &&
					file.size / 1024 / 1024 > 100
				) {
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
		handleFileTypeChange(value) {
			//附件类型改变
			//如果是补录合同选择线下合同/补充协议，与其他附件的提示语不同
			this.fileTypeRequired(value);
			if (value.key == 1 || value.key == 7) {
				this.formatType = 'other';
			} else {
				this.formatType = '';
			}
		},
		handlePreview(data, isStaticFile = false) {
			// 预览附件
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
			this.$refs.viewer.$viewer.show();
		},
		onSubmit() {
			// 提交
			this.modalFileForm.validateFields((err, values) => {
				if (!err) {
					if (this.fileList.length == 0) {
						this.$message.error('请上传文件');
						return;
					}
					if (this.beginUpload) return; //如果有正在上传的文件 不能点击确定关闭
					let table_contractFileData = Object.assign([], this.table_contractFileData);
					let table_supplementalInfo = Object.assign([], this.table_supplementalInfo);
					// 判断附件是否改变
					if (values.fileType.key == 'BCXY') {
						// 补充协议--多个附件展示一条数据
						let obj = {
							key: values.fileType.key,
							type: values.fileType.key,
							typeName: values.fileType.label,
							dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
							uploadTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
							changeItem: values.changeItem.join(','),
							executionDateStart: moment(values.executionDateStart).format('YYYY-MM-DD'),
							executionDateEnd: values.executionDateEnd
								? moment(values.executionDateEnd).format('YYYY-MM-DD')
								: values.executionDateEnd,
							signStatus: values.signStatus,
							signDate: moment(values.signDate).format('YYYY-MM-DD'),
							supplementalAgreementId: this.editObj && !this.ifAddStatus ? this.editObj.supplementalAgreementId : '',
							supplementalFile: [],
							uploadFiles: {
								fileList: values.uploadFiles.fileList
							},
							historyData: this.editObj && !this.ifAddStatus ? this.editObj.historyData : null
						};
						// 当编辑补协历史数据时，若修改附件了，则historyData置成false
						if (values.uploadFiles?.file?.response && this.editObj.historyData) {
							obj.historyData = false;
						}
						if (values.uploadFiles?.fileList?.length) {
							values.uploadFiles.fileList.forEach(item => {
								let pro = {};
								(pro.attachId = ''),
									(pro.name = item.response ? item.response.data.fileName : item.name),
									(pro.url = item.response ? item.response.data.fileUrl : item.url),
									(pro.md5Hex = item.response ? item.response.data.md5Hex : item.md5Hex),
									(pro.type = values.fileType.key),
									(pro.typeName = values.fileType.label),
									(pro.ext = item.type),
									obj.supplementalFile.push(pro);
							});
							if (this.ifAddStatus) {
								// 新增
								table_supplementalInfo.unshift(obj);
							} else {
								// 编辑
								let editArr = [obj];
								if (this.editObj.type != '7') {
									// 编辑合同改成补协
									table_contractFileData.splice(this.modifyIndex, 1);
									table_supplementalInfo.unshift(obj);
								} else {
									// 编辑补协
									table_supplementalInfo.splice(this.modifyIndex, 1);
									table_supplementalInfo = editArr.concat(table_supplementalInfo);
								}
							}
						}
					} else {
						if (values.uploadFiles?.fileList) {
							let editArr = [];
							values.uploadFiles.fileList.forEach(item => {
								let obj = {
									key: values.fileType.key,
									type: values.fileType.key,
									typeName: values.fileType.label,
									dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
									name: item.response ? item.response.data.fileName : item.name,
									url: item.response ? item.response.data.fileUrl : item.url,
									md5Hex: item.response ? item.response.data.md5Hex : item.md5Hex,
									uploadTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
									uploadFiles: {
										fileList: [item]
									}
								};
								if (this.ifAddStatus) {
									// 新增
									table_contractFileData.unshift(obj);
								} else {
									// 编辑
									editArr.unshift(obj);
								}
							});
							if (!this.ifAddStatus) {
								if (this.editObj.type == '7') {
									// 编辑补协改成合同附件
									table_supplementalInfo.splice(this.modifyIndex, 1);
									table_contractFileData = editArr.concat(table_contractFileData);
								} else {
									// 编辑合同
									table_contractFileData.splice(this.modifyIndex, 1);
									table_contractFileData = editArr.concat(table_contractFileData);
								}
							}
						}
					}
					//判断是否有上传限制
					if (this.uploadFilesJudge) {
						//不满足限制条件，不上传
						let passFlag = true;
						if (table_supplementalInfo.length) {
							table_supplementalInfo.forEach(item => {
								let judge_table_supplementalInfo = [];
								item.supplementalFile.forEach(pro => {
									let obj = {
										name: pro.name,
										type: pro.type,
										url: pro.url
									};
									judge_table_supplementalInfo.push(obj);
									passFlag = passFlag && this.uploadFilesJudge(judge_table_supplementalInfo, '7');
								});
							});
						}
						if (!this.uploadFilesJudge(table_contractFileData, '1') || !passFlag) {
							return;
						}
					}
					this.$message.success('操作成功');
					this.table_contractFileData = TableRowSpanFunc(table_contractFileData, 'typeName');
					this.table_supplementalInfo = table_supplementalInfo;
					this.drawerVisible = false;
					this.sendToFather();
				}
			});
		},
		addFileType() {
			// 新增
			this.drawerVisible = true;
			this.ifAddStatus = true;
			this.fileList = [];
			this.$nextTick(() => {
				this.modalFileForm.resetFields();
				// 从新增补协处跳转进来，点击新增直接赋值补协类型
				if (this.$route.query.from === 'suppleAgreement') {
					this.modalFileForm.setFieldsValue({
						fileType: { key: 'BCXY', label: '补充协议' }
					});
				}
			});
		},
		editFileInfo(record, index) {
			// 编辑
			this.drawerVisible = true;
			this.modifyIndex = index;
			this.ifAddStatus = false;
			this.editObj = record;
			this.fileList = [];
			this.$nextTick(() => {
				this.modalFileForm.setFieldsValue({
					fileType: { key: record.type, label: record.type == 'BCXY' ? '补充协议' : record.typeName }, // 写固定值，兼容货物管理、资产的数据
					uploadFiles: record.uploadFiles
				});
				if (record.type == 'BCXY') {
					// 补充协议类型
					let that = this;
					setTimeout(function () {
						that.modalFileForm.setFieldsValue({
							changeItem: record.changeItem?.split(','),
							executionDateStart: record.executionDateStart ? moment(record.executionDateStart) : null,
							executionDateEnd: record.executionDateEnd ? moment(record.executionDateEnd) : null,
							signStatus: record.signStatus,
							signDate: record.signDate ? moment(record.signDate) : null
						});
					}, 500);
				}
				this.fileList = record.uploadFiles.fileList;
			});
		},
		sendToFather() {
			// 发送父组件
			this.$emit('uploadFiles', this.table_contractFileData, this.table_supplementalInfo);
		},
		toDelete(record, index) {
			// 删除附件
			this.table_contractFileData.splice(index, 1);
			this.table_contractFileData = TableRowSpanFunc(this.table_contractFileData, 'typeName');
			this.sendToFather();
		},
		toDeleteSupplement(record, index) {
			// 删除附件
			this.table_supplementalInfo.splice(index, 1);
			this.sendToFather();
		},
		disabledExecutionDateStart(current) {
			// 执行期开始时间小于结束时间
			return moment(current).format('YYYY-MM-DD') >= this.modalFileForm.getFieldValue('executionDateEnd');
		},
		disabledExecutionDateEnd(current) {
			// 执行期结束时间大于结束时间
			return moment(current).format('YYYY-MM-DD') <= this.modalFileForm.getFieldValue('executionDateStart');
		},
		onClose() {
			// 抽屉关闭展示弹窗
			this.modalVisible = true;
		},
		handleOk() {
			// 弹窗确认关闭抽屉
			this.drawerVisible = false;
			this.modalVisible = false;
		},
		handleCancel() {
			// 弹窗取消关闭弹窗
			this.modalVisible = false;
		}
	}
};
</script>

<style lang="less" scoped>
.contractFilesDrawer {
	::v-deep.ant-drawer-content-wrapper {
		width: 488px !important;
		.ant-drawer-wrapper-body {
			padding: 18px 28px 30px 30px;
			.ant-drawer-header {
				padding: 0 0 16px 0;
				border-color: hsla(221, 76%, 95%, 1);
				.ant-drawer-title {
					font-size: 20px;
					font-family:
						PingFangSC-Medium,
						PingFang SC;
					color: rgba(0, 0, 0, 0.8);
					line-height: 28px;
				}
			}
			.ant-drawer-body {
				padding: 22px 0 0 0;
				height: 100%;
				.row {
					margin-bottom: 40px;
				}
				.ant-form-explain {
					position: absolute;
					top: 38px;
				}
				.ant-form-item-with-help {
					margin-bottom: 0;
				}
				.ant-form-item-label {
					font-size: 14px;
					font-family:
						PingFangSC-Regular,
						PingFang SC;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.8);
					line-height: 20px;
					padding-bottom: 12px;
				}
				.ant-select,
				.ant-form-item-children,
				.ant-select-selection,
				.ant-form-item-control {
					width: 430px;
					height: 32px;
				}
				.ant-form-item-children {
					display: inline-block;
					position: relative;
				}
				.ant-select {
					position: absolute;
					left: 0;
					top: 0;
					.ant-select-selection__rendered {
						line-height: 32px;
					}
				}
				.checkBox {
					.ant-form-item-children,
					.ant-form-item-control {
						height: 100px;
					}
					.ant-form-explain {
						position: absolute;
						top: 106px;
					}
					.ant-checkbox-wrapper {
						width: 33.3%;
						margin: 0;
						font-size: 14px;
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						font-weight: 400;
						color: rgba(0, 0, 0, 0.8);
						line-height: 22px;
						margin-bottom: 18px;
					}
					.ant-checkbox-wrapper:nth-child(7),
					.ant-checkbox-wrapper:nth-child(8),
					.ant-checkbox-wrapper:nth-child(9) {
						margin-bottom: 0;
					}
				}
				.radioBox {
					.ant-form-item-children,
					.ant-form-item-control {
						height: 21px;
						position: reltive;
						top: -3px;
					}
					.ant-radio-group {
						position: absolute;
						left: 0;
						top: 0;
					}
					.ant-form-explain {
						position: absolute;
						top: 30px;
					}
				}
				.fileBox {
					margin-bottom: 120px;
					.ant-form-item-children,
					.ant-form-item-control {
						height: auto;
					}
					.ant-form-explain {
						position: absolute;
						height: 20px;
						top: 100%;
						bottom: 0;
					}
					.ant-form-item-control {
						position: relative;
					}
				}
				.ant-upload-select {
					width: 430px;
					padding: 38px 62px;
					background: hsla(224, 58%, 96%, 1);
					border: 1px dashed hsla(224, 23%, 84%, 1);
					cursor: pointer;
					border-radius: 10px;
					.upload-text {
						text-align: center;
						font-size: 14px;
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						font-weight: 400;
						color: rgba(0, 0, 0, 0.8);
						line-height: 20px;
					}
					.upload-tips {
						width: 306px;
						margin: 20px auto 0;
						text-align: left;
						font-size: 12px;
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						font-weight: 400;
						color: #8495aa;
						line-height: 22px;
					}
					.file_icon {
						margin: 0 auto;
						display: block;
						background: url('~@/v2/assets/imgs/upload/file_add.png') no-repeat center center;
						width: 20px;
						height: 22px;
						margin-bottom: 10px;
					}
				}
				.ant-upload-list {
					width: 100%;
					.ant-upload-list-item-name,
					.anticon-delete {
						color: @primary-color;
						cursor: pointer;
					}
				}
				.ant-upload-list-item-name {
					width: 80%;
				}
				.footer {
					width: 100%;
					text-align: right;
					left: 0;
					border-radius: 0 0 4px 4px;
					position: absolute;
					bottom: 0;
					padding: 0 28px 30px 30px;
					background: #fff;
					div {
						border-top: 1px solid #e8e8e8;
						padding-top: 29px;
					}
					.ant-btn {
						width: 90px;
						height: 34px;
						border-radius: 6px;
						border: 1px solid #d2d6dd;
						font-size: 14px;
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						font-weight: 400;
						color: rgba(0, 0, 0, 0.8);
						line-height: 20px;
					}
					.ant-btn-primary {
						color: #fff;
						border: none;
						background: @primary-color;
					}
				}
			}
		}
	}
}
.confirmModal {
	.title {
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 15px;
	}
	::v-deep.ant-modal-footer {
		border-top: none;
	}
}
.calendar,
.select {
	width: 20px;
	height: 20px;
	display: inline-block;
	vertical-align: middle;
	background: url(~assets/imgs/newInvoice/calendar.png) no-repeat;
	background-size: contain;
	line-height: 38px !important;
	top: 40%;
}
.select {
	background: url(~@/v2/assets/imgs/contract/select_icon.png) no-repeat;
}
.table_contractFile {
	::v-deep.ant-table-placeholder {
		border: 1px solid #e8e8e8 !important;
	}
}
</style>
