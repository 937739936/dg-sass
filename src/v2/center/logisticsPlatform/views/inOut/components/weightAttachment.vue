<template>
	<div class="attachment">
		<!-- <div
			class="slTitleAssis"
			style="margin-bottom: 30px"
		>
			附件信息
		</div> -->
		<div
			class="tips"
			v-if="tipsList[0]"
		>
			<p class="handle">
				<span>{{ tipsList[0] && tipsList[0].tip }}</span>
				<span
					v-show="!isSpread && tipsList.length > 1"
					class="btn"
					@click="isSpread = true"
					>展开
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-down.png"
						alt=""
					/>
				</span>
				<span
					v-show="isSpread && tipsList.length > 1"
					class="btn"
					@click="isSpread = false"
				>
					收起
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-up.png"
						alt=""
					/>
				</span>
			</p>
			<div
				v-show="isSpread"
				style="color: #000"
			>
				<div
					v-for="(item, i) in tipsList"
					:key="i"
				>
					<p v-if="i != 0">{{ item.tip }}</p>
				</div>
			</div>
		</div>
		<a-table
			class="new-table"
			:columns="columns"
			:data-source="dataSource"
			rowKey="key"
			:scroll="{ x: true }"
			style="margin-top: 30px; margin-bottom: 10px"
			:pagination="false"
		>
			<div
				slot="label"
				slot-scope="text, record"
			>
				<div class="type">
					<div class="df">
						<span
							v-if="record.required"
							class="red"
							>*</span
						>
						<span
							v-else
							class="red"
							style="opacity: 0"
							>*</span
						>
						<span>{{ record.label }}</span>
					</div>
					<a-button
						type="primary"
						@click="openUpload"
						class="upload"
					>
						上传
					</a-button>
				</div>
			</div>
			<div
				slot="fileList"
				slot-scope="text, record"
			>
				<div class="name-box">
					<div
						v-for="(item, index) in record.fileList"
						:key="index"
						class="name"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.uploadTime || item.createTime }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}</span
							>
							<img
								class="del"
								@click="del(record, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
								v-if="editShowDelete || !item.typeName || item.type == 1"
							/>
						</a-tooltip>
					</div>
				</div>
			</div>
			<span
				slot="customTitles1"
				style="fontweight: 400"
			>
				<span>车辆信息</span>
			</span>
			<div
				slot="carInfoList"
				slot-scope="text, record"
			>
				<a-tooltip>
					<template slot="title">
						<span
							v-for="(item, i) in record.vehicleInfoList"
							:key="i"
						>
							<p>出库日期：{{ item.outboundDate }}</p>
							<p>车牌号：</p>
							<div v-html="formatPlatNumDes(item)"></div>
						</span>
					</template>
					<p class="omit">
						{{ plateNumberListDes(record.vehicleInfoList) }}
					</p>
				</a-tooltip>
			</div>
			<div
				slot="action"
				slot-scope="text, record, index"
			>
				<a-space>
					<a
						href="javascript:;"
						@click="editRow(record)"
						v-if="record.vehicleInfoList.length"
						>编辑</a
					>
					<a
						href="javascript:;"
						@click="delRow(index)"
						>删除</a
					>
				</a-space>
			</div>
		</a-table>
		<a-modal
			class="del-modal slModal"
			:visible="delVisible"
			:width="460"
			@cancel="cancel"
			title=""
		>
			<div class="title-box">
				<ConfirmIcon></ConfirmIcon>
				<span class="title">确认删除</span>
			</div>
			<div class="tip">确认要删除该附件吗，删除后无法恢复</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="cancel"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="saveDel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<image-viewer ref="imageViewer" />
		<a-modal
			class="slModal upload-modal"
			:visible="uploadModal"
			:width="648"
			:dialog-style="{ top: '60px' }"
			@cancel="cancelUploadModal"
			title="上传磅单明细"
		>
			<a-spin
				tip="智能识别中..."
				v-if="beginUpload"
				class="loading"
			/>
			<div class="title-box"><span class="red"> * </span> <span>上传磅单明细附件</span></div>

			<div>
				<span
					class="name upload-modal-name"
					v-for="(item, i) in modalFileList"
					:key="i"
				>
					<span
						class="preview"
						@click="handlePreview(item)"
						>{{ item.name || item.fileName }}</span
					>
					<img
						class="del"
						@click="delUploadFile(i)"
						src="@sub/assets/imgs/trade/del-icon.png"
						alt=""
					/>
				</span>
			</div>

			<div class="upload-box">
				<div class="btn-box-title">
					<a-upload
						list-type="picture-card"
						name="file"
						:showUploadList="false"
						accept=".jpg,.jpeg,.png,.bmp,.pdf,.PDF,.JPEG,.JPG,.PNG"
						:headers="headers"
						:disabled="beginUpload"
						:multiple="true"
						:fileList="fileList"
						:before-upload="e => beforeUpload(e, 'img')"
					>
						<div
							class="btn btn1"
							:class="beginUpload ? 'forbidden' : ''"
							@click="upload"
						>
							<i class="iconfont icon icon-tab"></i> 图片上传
						</div>
					</a-upload>
					<a-upload
						list-type="picture-card"
						name="file"
						:showUploadList="false"
						accept=".xls,.xlsx"
						:headers="headers"
						:disabled="beginUpload"
						:multiple="true"
						:fileList="fileList"
						:before-upload="e => beforeUpload(e, 'xls')"
					>
						<div
							class="btn"
							@click="upload"
							:class="beginUpload ? 'forbidden' : ''"
						>
							<i class="iconfont icon icon-exceldaoru1"></i>Excel导入
						</div>
					</a-upload>
				</div>
				<div class="upload-modal-tip">
					<p>1.【图片上传】支持上传jpg，jpeg，png, bmp，pdf的附件，单个附件大小不超过100M。</p>
					<p>
						<span>2.【Excel导入】支持上传xlsx，xls的附件，单个附件大小不超过100M，需先</span>
						<a :href="publicPath + 'files/汽运磅单明细导入模板.xlsx'">下载Excel导入模板</a>
					</p>
				</div>
			</div>
			<a-date-picker
				valueFormat="yyyy-MM-DD"
				v-model="dateTime"
				:showToday="false"
				class="date_picker"
				:open="isOpen"
				:disabled-date="disabledDate"
			>
				<template slot="renderExtraFooter">
					<a-button
						type="primary"
						@click="confirmDate"
						>确认</a-button
					>
				</template>
			</a-date-picker>
			<div class="title-box"><span class="red"> * </span> <span>填写车辆信息</span></div>
			<div class="date-box">
				<span
					class="date-box-item"
					:class="currentWeightIndex === i ? 'active' : ''"
					v-for="(item, i) in vehicleInfoList"
					:key="i"
					@click="selectDate(item, i)"
				>
					<span>{{ item.showDate || '选择日期' }}</span>
					<span
						class="date-box-icon"
						@click.stop="delDate(i)"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
						>
							<circle
								cx="7"
								cy="7"
								r="7"
								fill="#6F6F6F"
							/>
							<path
								d="M5.41978 4.24395C5.09498 3.91914 4.56839 3.91914 4.2436 4.24395C3.9188 4.56875 3.9188 5.09536 4.2436 5.42016L5.82365 7.00026L4.24411 8.57984C3.91931 8.90464 3.91931 9.43125 4.24411 9.75605C4.5689 10.0809 5.0955 10.0809 5.42029 9.75605L6.99983 8.17647L8.57971 9.7564C8.9045 10.0812 9.4311 10.0812 9.75589 9.7564C10.0807 9.43159 10.0807 8.90498 9.75589 8.58018L8.17601 7.00026L9.7564 5.41982C10.0812 5.09502 10.0812 4.56841 9.7564 4.2436C9.43161 3.9188 8.90502 3.9188 8.58022 4.2436L6.99983 5.82404L5.41978 4.24395Z"
								fill="white"
							/>
						</svg>
					</span>
				</span>
				<span
					class="date-box-btn"
					@click="addDate"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M6 0C5.44772 0 5 0.447715 5 1V5H1C0.447715 5 0 5.44771 0 6C0 6.55228 0.447715 7 1 7H5V11C5 11.5523 5.44772 12 6 12C6.55228 12 7 11.5523 7 11V7H11C11.5523 7 12 6.55229 12 6C12 5.44772 11.5523 5 11 5H7V1C7 0.447715 6.55228 0 6 0Z"
							fill="#C3C3C3"
						/>
					</svg>
				</span>
			</div>

			<!-- /** 车辆信息 */ -->
			<a-table
				class="new-table"
				:columns="columns2"
				:data-source="currentPlateNumberList"
				:rowKey="(record, index) => index"
				:scroll="{ x: 500, y: 200 }"
				style="margin-top: 30px; margin-bottom: 10px"
				:pagination="false"
			>
				<div
					slot="plateNumber"
					slot-scope="text, record, index"
				>
					<div class="type">
						<LicensePlateNumberInput v-model="record.plateNumber"></LicensePlateNumberInput>
					</div>
				</div>
				<div
					slot="outboundDate"
					slot-scope="text, record, index"
				>
					<div class="type">
						<span v-if="record.deliverDate">{{ outboundDateDes(record.deliverDate) }}</span>
						<a-time-picker
							:allowClear="false"
							format="HH:mm"
							v-model="record.deliverTime"
						>
						</a-time-picker>
					</div>
				</div>

				<div
					slot="action"
					slot-scope="text, record, index"
				>
					<a-space>
						<a
							href="javascript:;"
							v-if="currentPlateNumberList.length > 1"
							@click="delPlatNumber(index)"
							>删除</a
						>
						<a
							href="javascript:;"
							@click="addPlateNumber"
							v-if="index == 0"
							>新增</a
						>
					</a-space>
				</div>
			</a-table>
			<template slot="footer">
				<a-button
					key="back"
					@click="cancelUploadModal"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="saveUpload"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<DelModal
			ref="delModal"
			tip="确认要删除吗，删除后无法恢复"
			title="确认删除"
			@ok="saveDelRow"
			@cancel="cancelDelRow"
		></DelModal>
		<DelModal
			ref="delModal2"
			tip="确认要删除吗，删除后无法恢复"
			title="确认删除"
			@ok="saveDel"
		></DelModal>
	</div>
</template>

<script>
const columns = [
	{ title: '单据类型', dataIndex: 'label', scopedSlots: { customRender: 'label' }, width: 210 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ dataIndex: 'carInfoList', scopedSlots: { customRender: 'carInfoList' }, width: 400, slots: { title: 'customTitles1' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 100 }
];
const columns2 = [
	{ title: '车牌号', dataIndex: 'plateNumber', scopedSlots: { customRender: 'plateNumber' } },
	{ title: '发车时间', dataIndex: 'outboundDate', scopedSlots: { customRender: 'outboundDate' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 90 }
];
import ENV from '@/v2/config/env';
import { filePreview } from '@/v2/utils/file';
import { mapGetters } from 'vuex';
import LicensePlateNumberInput from '@sub/components/LicensePlateNumberInput/index.vue';
// import DelModal from "@sub/components/DelModal.vue";
import DelModal from './DelModal.vue';
import imageViewer from '@/v2/components/imageViewer.vue';

import { commonUpload, API_UPLOAD_WATER_MARk } from 'api';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { receiveCommonUpload, receiveOcr } from '@/v2/center/logisticsPlatform/api/inout';
import { ConfirmIcon } from "@sub/components/svg"
const reg =
	/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/;

export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			isSpread: false,
			columns,
			columns2,
			dataSource: [],
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			previewImg: '',
			fileList: [],
			beginUpload: false,
			type: null,
			uploadFileList: [],
			action: API_UPLOAD_WATER_MARk,
			editShowDelete: true,
			// 提示
			tipsList: [],
			publicPath: process.env.BASE_URL,
			uploadModal: false,
			/** 磅单明细数据 */
			vehicleInfoList: [],
			currentWeightItem: {},
			currentWeightIndex: null,
			// 日期
			isOpen: false,
			dateTime: '',
			/** 上传的附件列表 */
			modalFileList: [],
			discernLoading: false
		};
	},

	mounted() {},
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

		currentPlateNumberList() {
			const item = this.vehicleInfoList[this.currentWeightIndex] || {};
			return item.plateNumberList || [];
		}
	},
	watch: {
		list: {
			handler(arr) {
				this.dataSource = [];
				this.tipsList = arr.filter(el => el.tip);
				arr.forEach(el => {
					this.dataSource.push({
						...el,
						fileList: [],
						vehicleInfoList: []
					});
				});
			},
			immediate: true
		},
		uploadFileList(val) {
			if (val.length) {
				// const item = this.dataSource.find(el => el.key == this.type) || {};
				// const list = item.fileList;
				this.handleUpload(val);
			}
		}
	},
	methods: {
		defaultTimeValue(record) {
			return moment(record.deliverDate);
		},
		outboundDateDes(date) {
			return moment(date).format('YYYY-MM-DD');
		},
		formatPlatNumDes(item) {
			let des = '';
			item.plateNumberList.forEach((element, index) => {
				des += element.plateNumber;
				des += index == item.plateNumberList.length - 1 ? '' : '、';
				des += (index + 1) % 3 == 0 ? '<br>' : '';
			});
			return des;
		},
		disabledDate(current) {
			// Can not select days before today and today
			const fiveMonthsAgo = moment().subtract(5, 'months');
			return current && current < fiveMonthsAgo.endOf('day');
		},
		plateNumberListDes(vehicleInfoList) {
			let des = '';
			vehicleInfoList.forEach(el => {
				des += `出库日期:${el.outboundDate} 车牌号:`;
				el.plateNumberList.forEach(el2 => {
					des += `${el2.plateNumber}、`;
				});
				des = des.replace(/、$/, '');
				des + '  ';
			});
			return des;
		},
		blurValue(value, index) {
			if (!reg.test(value)) {
				this.$message.error('请输入正确车牌号');
			}
			this.$forceUpdate();
		},
		delRow(index) {
			this.$refs.delModal.open();
		},
		saveDelRow() {
			const item = this.dataSource[0];
			item.vehicleInfoList = [];
			item.fileList = [];
			this.vehicleInfoList = [];
			this.modalFileList = [];
			this.$refs.delModal.close();

			this.$forceUpdate();
		},
		cancelDelRow() {
			this.$refs.delModal.close();
		},
		clearData() {
			this.dataSource.forEach(el => {
				el.fileList = [];
			});
		},
		//上传前校验
		beforeUpload(file, type) {
			// let fileType = this.fileType;
			let accept = '.jpg,.jpeg,.png,.bmp,.pdf,.PDF,.JPEG,.JPG,.PNG';
			if (type == 'xls') {
				accept = '.xls,.xlsx';
			}
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = accept.includes(fileFormat);
			// 获取当前上传的单据类型

			let isAllowFormat = false;
			if (!flag) {
				this.$message.error('当前文件格式不支持');
				return;
			}

			// 只能上传一份PDF文件，或者图片（可多张）

			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return true;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return true;
			}
			this.uploadFileList.push(file);
			return false;
		},
		// 1.上传
		async handleUpload(files, t) {
			this.beginUpload = true;

			const formData = new FormData();
			files.forEach(file => {
				formData.append('files', file);
			});
			// /api/common/file/upload/batch
			try {
				const res = await receiveCommonUpload(formData);

				const fileList = res.data;
				fileList.forEach(el => {
					el.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
					el.name = el.fileName;
					el.url = el.fileUrl;
				});

				this.modalFileList = [...this.modalFileList, ...fileList];

				const params = {
					fileList
				};

				const ocrRes = await receiveOcr(params);

				const list = ocrRes.data || [];

				/** 日期去重 */
				list.forEach(el => {
					el.plateNumberList.map(el => {
						el.deliverTime = el.deliverDate;
						return el;
					});
					const outboundDateList = this.vehicleInfoList.map(el2 => el2.outboundDate);
					if (!outboundDateList.includes(el.outboundDate)) {
						const arr = el.outboundDate.split('-');
						const str = `${arr[1]}月${arr[2]}日`;
						el.showDate = str;
						// el.plateNumberList = el.plateNumberList.map(el2 => {
						// 	return {
						// 		plateNumber: el2
						// 	};
						// });

						// 忽略除五个月之前的
						const fiveMonthsAgo = moment().subtract(5, 'months');
						let isValidateDate = moment(el.outboundDate).isAfter(fiveMonthsAgo);
						if (isValidateDate) {
							this.vehicleInfoList.push(el);
						}
					} else {
						const item = this.vehicleInfoList.find(el2 => el2.outboundDate == el.outboundDate);
						const itemPlateNumberList = item.plateNumberList ?? [];
						/** 去重 */
						const currentPlatList = el.plateNumberList.filter(el2 => {
							const found = itemPlateNumberList.find(
								element => element.plateNumber === el2.plateNumber && element.deliverDate == el2.deliverDate
							);
							return !found;
						});
						item.plateNumberList = [...item.plateNumberList, ...currentPlatList];
					}
				});
				this.currentWeightIndex = 0;

				this.$forceUpdate();
			} catch (err) {
				console.log(err);

				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		fileChange(info) {
			// console.log(info)
		},
		// 保存上传的信息
		saveUpload() {
			if (!this.modalFileList.length) {
				this.$message.error('请上传至少一份图片或Excel文件');
				return;
			}
			if (!this.vehicleInfoList.length) {
				this.$message.error('请填写车辆信息');
				return;
			}
			const obj = {
				fileList: this.modalFileList,
				vehicleInfoList: this.vehicleInfoList
			};
			let plateNumberFlag = false;
			let timeFlag = false;
			this.vehicleInfoList.forEach(el => {
				el.plateNumberList.forEach(el2 => {
					if (!el2.plateNumber) {
						plateNumberFlag = true;
					}
					if (!el2.deliverTime) {
						timeFlag = true;
					}
					// else {
					// 	const timePattern = /\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/;
					// 	if (!timePattern.test(el2.deliverTime)) {
					// 		timeFlag = true;
					// 	}
					// }
				});
			});
			if (plateNumberFlag && !timeFlag) {
				this.$message.error('有车牌号信息未填写');
				return;
			}
			if (!plateNumberFlag && timeFlag) {
				this.$message.error('有发车时间未填写');
				return;
			}
			if (plateNumberFlag && timeFlag) {
				this.$message.error('有车牌号、发车时间未填写');
				return;
			}

			// reg
			let flag2 = false;
			let tip = '';
			this.vehicleInfoList.forEach(el => {
				el.plateNumberList.forEach((el2, i) => {
					if (el2.deliverTime) {
						const time = moment(el2.deliverTime).format('HH:mm');
						el2.deliverDate = moment(el2.deliverDate).format('YYYY-MM-DD') + ' ' + time;
					} else {
						el2.deliverDate = moment(el2.deliverDate).format('YYYY-MM-DD');
					}

					if (!reg.test(el2.plateNumber)) {
						tip = `${el.outboundDate}下面的第${i + 1}列车牌号不正确`;
						flag2 = true;
					}
				});
			});

			/** 判断 车牌号 */
			if (flag2) {
				this.$message.error(tip);
				return false;
			}

			const item = this.dataSource[0];
			this.dataSource = [
				{
					...item,
					...cloneDeep(obj)
				}
			];
			this.uploadModal = false;
		},
		save() {
			// 判断当前是否有必填项
			const item = this.dataSource.find(el => el.required && !el.fileList.length);
			if (item) {
				this.$message.error(`缺少${item.label}附件`);
				return false;
			}
			const newItem = this.dataSource[0];
			if (!newItem.vehicleInfoList.length) {
				this.$message.error('磅单明细缺少车辆信息');
				return false;
			}

			let newAttachList = [];
			this.dataSource.forEach(el => {
				el.fileList &&
					el.fileList.forEach(el2 => {
						newAttachList.push({
							fileType: el.key,
							path: el2.url || el2.fileUrl,
							name: el2.name,
							createdDate: el2.uploadTime,
							dataSource: 1,
							md5Hex: el2.md5Hex
						});
					});
			});
			// 获取磅单信息

			return {
				newAttachList,
				vehicleInfoList: newItem.vehicleInfoList
			};
		},
		openUpload() {
			this.uploadModal = true;
		},
		editRow(record) {
			this.uploadModal = true;
		},
		// 上传的附件类型
		upload() {
			this.uploadFileList = [];
		},
		del(item, index) {
			// this.delVisible = true
			this.currentIndex = index;
			this.currentItem = item;
			this.$refs.delModal2.open();
		},
		delUploadFile(i) {
			this.modalFileList.forEach((el, index, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
			this.$forceUpdate();
		},
		saveDel() {
			const item = this.dataSource.find(el => el.key == this.currentItem.key) || {};
			const list = item.fileList || [];
			list.forEach((el, index, arr) => {
				if (index == this.currentIndex) {
					arr.splice(index, 1);
				}
			});
			this.$forceUpdate();
			this.delVisible = false;
			this.$refs.delModal2.close();
		},
		handlePreview(data) {
			let url = data.fileUrl || data.url || data.path;
			if (!url) {
				return;
			}
			filePreview(url, this.$refs.imageViewer.show);
		},
		cancelUploadModal() {
			this.uploadModal = false;
			this.isOpen = false;
		},
		cancel() {
			this.delVisible = false;
			this.isOpen = false;
		},
		/** 选择日期 */
		selectDate(item, i) {
			// 当前日期是新增
			this.currentWeightIndex = i;
			this.currentWeightItem = item;
			// 获取不到日期
			if (!item.outboundDate) {
				this.isOpen = true;
			}
			// this.currentPlateNumberList.map((el)=>{
			// 	if(!el.deliverDate) {
			// 		el.deliverDate = item.outboundDate;
			// 	}
			// });
		},
		addDate() {
			this.vehicleInfoList.push({
				outboundDate: '',
				// plateNumberList: [{ plateNumber: '', deliverDate: '' }]
				plateNumberList: []
			});
		},
		// 删除日期
		delDate(i) {
			this.vehicleInfoList.forEach((el, index, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
			this.currentWeightIndex = null;
			this.currentWeightItem = {};
			this.isOpen = false;
		},
		confirmDate(e) {
			if (!this.dateTime) {
				this.$message.error('请选择日期');
				return;
			}
			// 处理日期
			const arr = this.dateTime.split('-');
			// 判断当前日期是否已经存在
			const str = `${arr[1]}月${arr[2]}日`;
			const flag = this.vehicleInfoList.some(el => el.outboundDate.includes(this.dateTime));
			if (flag) {
				this.$message.error('当前日期已经存在');
				return;
			}
			let item = this.vehicleInfoList[this.currentWeightIndex];
			if (item) {
				item.outboundDate = this.dateTime;
				item.showDate = str;
				if (!item.plateNumberList || !item.plateNumberList.length) {
					const outboundDate = item.outboundDate;
					item.plateNumberList = [
						{
							plateNumber: '',
							deliverDate: outboundDate,
							deliverTime: outboundDate
						}
					];
				}
			}

			this.isOpen = false;
			this.$forceUpdate();
		},
		// 删除车牌列表
		delPlatNumber(i) {
			const item = this.vehicleInfoList[this.currentWeightIndex];
			item.plateNumberList.forEach((el, index, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
			this.$forceUpdate();
		},
		// 新增车牌
		addPlateNumber() {
			const item = this.vehicleInfoList[this.currentWeightIndex];
			let outboundDate = item.outboundDate;
			item.plateNumberList.push({
				plateNumber: '',
				deliverDate: outboundDate,
				deliverTime: outboundDate
			});
			this.$forceUpdate();
		}
	},
	components: {
		LicensePlateNumberInput,
		DelModal,
		imageViewer,
		ConfirmIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.attachment {
	position: relative;
	.title {
		margin-top: 20px;
		margin-bottom: 16px;
		color: #77889d;
	}
	.tips {
		padding: 10px 12px;
		background: #e1eafe;
		border: 1px solid #d0dfff;
		border-radius: 4px;
		font-size: 12px;
		line-height: 22px;
		position: relative;
	}
	.handle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #000;
	}
	.btn {
		color: @primary-color;
		cursor: pointer;
	}
	.red {
		color: red;
		vertical-align: middle;
		margin-right: 5px;
	}
	.df {
		display: flex;
		align-items: center;
	}
	.name-box {
		display: flex;
		flex-wrap: wrap;
	}
}
.title-box {
	display: flex;
	align-items: center;
	.icon {
		color: @primary-color;
		font-size: 20px;
	}
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-size: 20px;
		margin-left: 5px;
	}
}
.tip {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	display: flex;
	margin-top: 20px;
}
.icon {
	width: 16px;
	height: 16px;
	vertical-align: sub;
	img {
		width: 16px;
		height: 16px;
	}
}
.upload {
	color: @primary-color;
	background: #fff;
	border: 1px solid @primary-color;
	height: 24px;
	width: 64px;
}
.type {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.preview {
	cursor: pointer;
}
/deep/ .ant-modal-body {
	padding-top: 30px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
.new-table {
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 8px 12px;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(2) {
		border-right: 1px solid #e5e6eb;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(3) {
		border-right: 1px solid #e5e6eb;
	}
}
.loading {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	z-index: 999;
	width: 100px;
}
.omit {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 400px;
}
.name {
	background: #f3f5f6;
	border-radius: 4px;
	padding: 6px;
	display: flex;
	align-items: center;
	color: @primary-color;
	margin-right: 14px;
	margin-bottom: 10px;
}
.del {
	width: 14px;
	cursor: pointer;
	margin-left: 8px;
}

.upload-modal {
	.red {
		color: red;
	}
	/deep/ .ant-modal-body {
		padding-top: 20px;
	}
	.btn-box-title {
		margin-top: 20px;
	}
	.title-box {
		padding-bottom: 10px;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		font-family: PingFang SC;
		font-size: 14px;
	}
	.upload-modal-name {
		display: inline-block;
		margin-top: 10px;
		margin-bottom: 0px;

		.del {
			vertical-align: middle;
		}
	}
	.upload-box {
		.top {
			font-family: 'PingFang SC';
			height: 32px;
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
		.btn-box-title {
			display: flex;
			align-items: center;
			.btn {
				width: 106px;
				height: 38px;
				border-radius: 4px;
				border: 1px solid @primary-color;
				display: flex;
				justify-content: center;
				align-items: center;
				color: @primary-color;
				font-size: 14px;
				margin-right: 10px;
				cursor: pointer;

				.icon {
					margin-right: 10px;
					position: relative;
					top: -3px;
				}
			}

			.btn1 {
				background: @primary-color;
				color: #fff;
			}
		}
	}
	/deep/ .ant-upload {
		border: 0;
	}
	.upload-modal-tip {
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		font-family: PingFang SC;
		font-size: 12px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		margin-top: 10px;
	}
	.upload-box {
		/deep/ .ant-upload-select-picture-card {
			height: initial;
		}

		/deep/ .ant-upload-picture-card-wrapper {
			height: initial;
		}

		/deep/ .ant-upload {
			padding: 0;
		}
	}
	.date-box {
		&-item {
			display: inline-block;
			padding: 4px 10px;
			justify-content: center;
			align-items: center;
			gap: 10px;
			border-radius: 4px;
			background: var(---BG, #f3f5f6);
			color: #000;
			font-family: PingFang SC;
			font-size: 12px;
			position: relative;
			margin-right: 10px;
			cursor: pointer;
			margin-bottom: 10px;
			&.active {
				background:  @primary-color;
				color: var(--VI-, #fff);
			}
		}
		&-icon {
			position: absolute;
			right: -8px;
			top: -8px;
			cursor: pointer;
		}
		&-btn {
			display: inline-block;
			width: 64px;
			height: 26px;
			padding: 4px 10px;
			justify-content: center;
			align-items: center;
			gap: 10px;
			border-radius: 4px;
			border: 1px solid var(---Line, #e5e6eb);
			line-height: 18px;
			text-align: center;
			vertical-align: middle;
			cursor: pointer;
		}
	}
}
/deep/ .ant-calendar-footer-extra {
	text-align: right;
	margin-top: 5px;
	margin-bottom: 5px;
}
.date_picker {
	opacity: 0;
}
.forbidden {
	cursor: not-allowed !important;
}
</style>
