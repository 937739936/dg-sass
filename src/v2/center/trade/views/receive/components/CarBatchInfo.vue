<template>
	<div class="batch-info">
		<div class="sub-title">
			{{ title }}
			<a-button
				@click="addNewItem"
				style="margin-left: 25px"
				type="primary"
				ghost
			>
				新增发货批次
			</a-button>
		</div>
		<a-form-model
			ref="transForm"
			:model="formModel"
			:rules="rules"
			class="slFormDetail"
		>
			<a-table
				class="new-table"
				:dataSource="formModel.dataSource"
				:columns="columns"
				:pagination="false"
				:scroll="{ x: true }"
				rowKey="uuid"
			>
				<template slot="deliverDateTitle">
					<span class="requiredTableTitle">发货日期</span>
				</template>
				<template
					slot="deliverDate"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.deliverDate'"
						:rules="rules.deliverDate"
						>
						<a-date-picker
							style="width: 250px"
							placeholder="请输入发货日期"
							format="YYYY-MM-DD"
							valueFormat="YYYY-MM-DD"
							v-model="record.deliverDate"
						/>
					</a-form-model-item>
				</template>
				<template slot="deliverQuantityTitle">
					<span class="requiredTableTitle">发货数量（吨）</span>
				</template>
				<template
					slot="deliverQuantity"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.deliverQuantity'"
						:rules="rules.deliverQuantity"
						>
						<a-input-number
							style="width: 250px"
							placeholder="请输入发货数量"
							v-model="record.deliverQuantity"
						/>
						</a-form-model-item>
				</template>
				<template slot="trainNumTitle">
					<span class="requiredTableTitle">车数</span>
				</template>
				<template
					slot="trainNum"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.trainNum'"
						:rules="rules.trainNum"
						>
						<a-input-number
							style="width: 250px"
							v-model="record.trainNum"
							placeholder="请输入车数"
						/>
					</a-form-model-item>
				</template>
				<template slot="automobileDetailDtoListTitle">
					<span class="requiredTableTitle">车牌号</span>
				</template>
				<template
					slot="automobileDetailDtoList"
					slot-scope="list, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.automobileDetailDtoList'"
						:rules="rules.automobileDetailDtoList"
						>
						<div style="width: 250px" class="autoListWrapper">
							<div class="autoList">{{ showPlateNumberList(list) }}</div>
							<div @click="showAutoListModel(record, index)" class="edit-btn">
								<ChooseIcon></ChooseIcon>
							</div>
						</div>
					</a-form-model-item>
				</template>
				<template slot="fileInfoListTitle">
					<span class="requiredTableTitle">运输凭证</span>
				</template>
				<template
					slot="fileInfoList"
					slot-scope="fileList, record, index"
				>
						<a-form-model-item
							:prop="'dataSource.' + index + '.fileInfoList'"
							:rules="rules.fileInfoList"
						>
							<div
								class="fileList-box"
								style="min-width: 140px;"
							>
							<div
								v-for="(item, fileIndex) in fileList"
								:key="fileIndex"
								class="fileName"
							>
								<a-tooltip>
									<template slot="title">
										<span>上传时间：{{ item.uploadTime || item.createTime || item.createDate }}</span>
									</template>
									<span
										class="preview"
										@click="previewFile(item)"
									>
										{{ item.fileName || item.name }}</span
									>
									
								</a-tooltip>
									<img
										class="del"
										@click="deleteFile(record, index, fileIndex)"
										src="@sub/assets/imgs/trade/del-icon.png"
										alt=""
									/>
							</div>

						</div>
			</a-form-model-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
				>
					<a-space>
						<a-upload
							:headers="headers"
							:beforeUpload="beforeUpload"
							:accept="accept"
							:multiple="true"
							:fileList="[]"
							name="file"
						>
							<a
								href="javascript:void(0)"
								@click="startUploadFile(record,index)"
								>上传</a>
							</a-upload>
							<a href="#" @click="onDeleteItem(index)">删除</a>
						<!-- <a-popconfirm
							title="确定删除该条批次信息?"
							okText="确定"
							cancelText="取消"
							@confirm="onDeleteItem(index)"
						>
						</a-popconfirm> -->
					</a-space>
				</template>
			</a-table>
		</a-form-model>
		<ImageViewer ref="imageViewer" />
		<AutoListModel ref="autoListModel" @editAutoListFinish="editAutoListFinish" />
		<ConfirmModal ref="confirmModal"></ConfirmModal>
	</div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { API_UPLOAD_FILE } from '../../../api/receive.js';
import { v4 as uuidv4 } from "uuid";
import ImageViewer from '@sub/components/viewer/image.vue';
import AutoListModel from './AutoListModel.vue';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import { ChooseIcon } from '@sub/components/svg';

export default {
	name: 'CarBatchInfo',
	props: {
		title: {
			type: String,
			default: '批次信息'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否是应收
		accountReceivable: {
			type: Boolean,
			default: false
		}
	},
	components: {
		ImageViewer,
		AutoListModel,
		ConfirmModal,
		ChooseIcon
	},
	data() {
		return {
			formModel: {
				dataSource: [],
			},
      // columns:columns,
			rules: rules, 
			uploadingFileList: [] // 正在上传的文件列表 
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
		accept() {
			return '.jpg,.jpeg,.png,.bmp,.pdf'
		},
		columns() {
			let list = [...tcolumns]
			if (this.accountReceivable) {
				// 应收情况下不展示车牌
				list = list.filter(item => {
					if (item.dataIndex === 'automobileDetailDtoList') {
						return false;
					} else {
						return true;
					}
				})
			}
			return [...list];
		}
	},
	methods: {
		// 校验运输信息
		onValidateTransInfo() {
			return new Promise((resolve, reject) => {
				let dataSource = this.formModel.dataSource || [];
				if (dataSource.length === 0) {
					reject('请录入至少一条批次信息');
					return;
				}
				this.$refs.transForm.validate((valid, obj) => {
					if (valid) {
						resolve(dataSource);
					} else {
							let isAutoListEmpty = false;
							let isFileInfoListEmpty = false;
						  const keys = Object.keys(obj);
							keys.forEach(key => {
								if (key.indexOf('automobileDetailDtoList') > -1) {
									// console.log(obj[key]);
									isAutoListEmpty = true;
								} else if (key.indexOf('fileInfoList') > -1) {
									isFileInfoListEmpty = true;
								}
							});
							let error = ''
							if (isAutoListEmpty) {
								error = '您有未上传车牌号的批次数据'
							}
							if (isFileInfoListEmpty) {
								error = '您有未上传运输凭证的批次数据'
							}
							if (isAutoListEmpty && isFileInfoListEmpty) {
								error = '您有未上传车牌号、运输凭证的批次数据'
							}
							reject(error);
					}
				});
			});
		},
		addNewItem() {
			let oldList = this.formModel.dataSource || [];
			// 
			let newItem = {
				uuid: uuidv4(),
				deliverDate: '',
				deliverQuantity: '',
				trainNum: '',
				automobileDetailDtoList: [],
				fileInfoList: [],
				transType: 2,
			};
			oldList.push(newItem);
			this.formModel = {
				dataSource: [...oldList],
			};
		},
		onDeleteItem(index) {
			let that = this
			this.$refs.confirmModal.showModal({
				modalTitle: '确认删除',
				modalText: '确认要删除该发货批次吗，删除后无法恢复',
				confirm: () => {
					let dataSource = this.formModel.dataSource;
					dataSource.splice(index, 1);
					that.formModel.dataSource = dataSource;
				}
			});
		},
		disabledDeliverDate(current) {
			return current && current > moment().endOf('day');
		},
		startUploadFile(record) {
			this.uploadinguuid = record.uuid;
		},
		beforeUpload(file) {
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = this.accept.includes(fileFormat);
			if (!flag) {
				this.$message.error('当前文件格式不支持');
				return false;
			}
			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return false;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return false;
			}
			// this.uploadingFileList.push(file);
			this.handleUpload(file, '');
			return false;
		},
		async handleUpload(file,) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('file', file);
			API_UPLOAD_FILE(formData).then(res => {
				if (!res.success) {
					return
				}
				const obj = res.data;
				obj.type = 'YSPZ';
				obj.name = obj.fileName;
				obj.url = obj.fileUrl;
				obj.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
				let uploadIndex = 0
				const item = this.formModel.dataSource.find((el, index) => {
					if (el.uuid == this.uploadinguuid) {
						uploadIndex = index
						return true;
					}
					return false;
				}) || {};
				if (item) {
					let fileInfoList = item.fileInfoList || [];
					fileInfoList.push(obj);
					this.$set(this.formModel.dataSource[uploadIndex], 'fileInfoList', fileInfoList)
					this.$forceUpdate();
					this.$refs.transForm.validateField('dataSource.' + uploadIndex + '.fileInfoList',()=>{})
				}
			});
		},
		previewFile(data) {
			this.$refs.imageViewer.showFile(data);
		},
		deleteFile(record, index, fileIndex) {
			const that = this;
			this.$refs.confirmModal.showModal({
				modalTitle: '确认删除',
				modalText: '确认要删除该附件吗，删除后无法恢复',
				confirm: () => {
					let fileInfoList = record.fileInfoList || [];
					fileInfoList.splice(fileIndex, 1);
					that.$set(that.formModel.dataSource[index], 'fileInfoList', fileInfoList)
					that.$forceUpdate();
				}
			});
		},
		showAutoListModel(record, index) {
			this.$refs.autoListModel.showModal(record, index);
		},
		editAutoListFinish(list, record, index) {
			this.$set(this.formModel.dataSource[index], 'automobileDetailDtoList', list)
			this.$forceUpdate();
			this.$refs.transForm.validateField('dataSource.' + index + '.automobileDetailDtoList',()=>{})
		},
		showPlateNumberList(list) {
			return list.map(item => {
				return item.plateNumber;
			}).join('、');
		}
	}
};
const customRender = (t, r, index) => {
	return parseInt(index) + 1;
};
export const tcolumns = [
	{ title: '序号', dataIndex: 'no', customRender },
	{
    // title: '发货日期',
    dataIndex: 'deliverDate',
		slots: { title: 'deliverDateTitle' },
    scopedSlots: { customRender: 'deliverDate' }
  },
  {
    // title: '发货数量（吨）',
    dataIndex: 'deliverQuantity',
		slots: { title: 'deliverQuantityTitle' },
    scopedSlots: { customRender: 'deliverQuantity' },
  },
  {
    // title: '车数',
    dataIndex: 'trainNum',
		slots: { title: 'trainNumTitle' },
    scopedSlots: { customRender: 'trainNum' },
  },
  {
		// title: '车牌号',
		dataIndex: 'automobileDetailDtoList',
		slots: { title: 'automobileDetailDtoListTitle' },
		scopedSlots: { customRender: 'automobileDetailDtoList' }
	},
  {
		// title: '运输凭证',
		dataIndex: 'fileInfoList',
		slots: { title: 'fileInfoListTitle' },
		scopedSlots: { customRender: 'fileInfoList' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		align: 'center',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

const rules = {
	deliverDate: [
		{ 
			required: true, 
			message: '请输入发货日期', 
			trigger: ['change',] 
		}
	],
	deliverQuantity: [
		{ 
			required: true, 
			message: '请输入发货数量', 
			trigger: ['change', 'blur'] 
		},
		{
			// 正则发货量为数字，最大10000000，最多三位小数
			pattern: /^\d{1,7}(\.\d{1,3})?$/,
			message: '发货量为数字，最大10000000，最多三位小数',
			trigger: ['change', 'blur']
		}
	],
	trainNum:[
		{ 
			required: true, 
			message: '请输入车数',
			trigger: ['change', 'blur']  
		},
		{ 
			pattern: /^[0-9]*$/, 
			message: '车数为正整数', 
			trigger: ['change', 'blur'] 
		},
	] ,
	automobileDetailDtoList: [
		{ 
			required: true, 
			// 故意空格字符 为了有提醒但不显示
			message: '    ',
			trigger: ['change', 'blur']  
		},
	],
	fileInfoList: [
		{ 
			required: true, 
			message: '    ',
			trigger: ['change', 'blur']  
		},
	]

}

</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>

<style lang="less" scoped>
.new-table {
	margin-top: 10px;
	/deep/ .ant-table-tbody > tr > td {
		padding: 14px 20px;
	}
	/deep/ .ant-form-item {
		margin-bottom: 0;
	}
	/deep/ .has-error .ant-form-explain,
	.has-error .ant-form-split {
		position: absolute;
		bottom: -14px;
	}
	/deep/ .ant-form-explain {
		position: absolute;
		line-height: 14px;
		min-height: unset;
		// bottom: -20px;
	}
	/deep/ .ant-form-item-control {
		line-height: 32px;
	}
}


</style>


<style lang="less" scoped>
.batch-info {
	.requiredTableTitle {
		// color: #f5222d;
		&::before {
			content: '*';
			color: #f5222d;
		}
	}
	.sub-title {
		margin-bottom: 16px;
		height: 32px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 32px;
		color: rgba(0, 0, 0, 0.8);
		position: relative;
		padding-left: 12px;

		&:before {
			content: '';
			top: 7px;
			position: absolute;
			display: block;
			width: 4px;
			height: 18px;
			left: 0;
			background: @primary-color;
		}
	}
	.slFormDetail {
		padding-top: 0px;
	}
	.fileList-box {
		min-width: 100px;
		min-height: 32px;
		vertical-align: middle;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		.fileName {
			flex-shrink: 1;
			background: #f3f5f6;
			border-radius: 4px;
			padding: 6px;
			display: flex;
			align-items: center;
			color: @primary-color;
			min-height: 32px;
			cursor: pointer;
			span {
				line-height: 14px;
			}
		}
		.fileName:nth-child(n+2) {
			margin-top: 10px;
		}
		.del {
			width: 14px;
			cursor: pointer;
			margin-left: 8px;
		}
	}
	.autoListWrapper {
		display: flex;
		align-items: center;
		height: 32px;
		.autoList {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
		.edit-btn {
			flex-shrink: 1;
			margin-left: 10px;
			width: 20px;
			height: 20px;
			background-size: 14px 14px;
			cursor: pointer;
		}

	}
	
}
</style>