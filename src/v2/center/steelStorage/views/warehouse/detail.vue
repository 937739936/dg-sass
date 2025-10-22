<template>
	<div>
		<div class="s-title">
			<span>{{ title }}</span>
		</div>
		<a-form
			style="margin-top: 20px"
			:form="form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 14 }"
			labelAlign="left"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="纸质合同编号">
						<a-input
							v-decorator="[
								'paperContractNo',
								{
									rules: [{ required: true, message: '请输入纸质合同编号!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓库类型">
						<a-select
							v-decorator="[
								'warehouseType',
								{
									rules: [{ required: true, message: '请选择仓库类型!' }]
								}
							]"
							:disabled="disabledAll"
						>
							<a-select-option
								:value="item.value"
								v-for="item in warehouseType"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="存放货物类型">
						<a-select
							v-decorator="[
								'goodsType',
								{
									rules: [{ required: true, message: '请选择存放货物类型!' }]
								}
							]"
							:disabled="disabledAll"
						>
							<a-select-option
								:value="item.value"
								v-for="item in goodsType"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="期限">
						<a-range-picker
							v-decorator="[
								'validity',
								{
									rules: [{ required: true, message: '请选择期限!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方">
						<a-input
							v-decorator="[
								'lessor',
								{
									rules: [{ required: true, message: '请输入租赁方!' }]
								}
							]"
							:disabled="true"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方">
						<a-input
							v-decorator="[
								'warehouseParty',
								{
									rules: [{ required: true, message: '请输入仓储方!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓库简称">
						<a-input
							v-decorator="[
								'warehouseAbbreviation',
								{
									rules: [{ required: true, message: '请输入仓库简称!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方联系人">
						<a-input
							v-decorator="[
								'lessorContacts',
								{
									rules: [{ required: true, message: '请输入租赁方联系人!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方联系电话">
						<a-input
							v-decorator="[
								'lessorTel',
								{
									rules: [{ required: true, message: '请输入租赁方联系电话!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方电子邮箱">
						<a-input
							v-decorator="[
								'lessorEmail',
								{
									rules: [{ required: true, message: '' }, { validator: this.emailCheck }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方联系地址">
						<a-input
							v-decorator="[
								'lessorAddr',
								{
									rules: [{ required: true, message: '请输入租赁方联系地址!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方微信">
						<a-input
							:maxLength="50"
							v-decorator="['lessorWechat']"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="租赁方QQ">
						<a-input
							:maxLength="50"
							v-decorator="['lessorQq']"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方联系人">
						<a-input
							v-decorator="[
								'warehousePartyContacts',
								{
									rules: [{ required: true, message: '请输入仓储方联系人!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方联系电话">
						<a-input
							v-decorator="[
								'warehousePartyTel',
								{
									rules: [{ required: true, message: '请输入仓储方联系电话!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方电子邮箱">
						<a-input
							v-decorator="[
								'warehousePartyEmail',
								{
									rules: [{ required: true, message: '' }, { validator: this.emailCheck }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方联系地址">
						<a-select
							placeholder="请选择"
							:disabled="disabledAll"
							showSearch
							:notFoundContent="addressList ? '暂无数据' : '加载中...'"
							:filterOption="false"
							:dropdownMatchSelectWidth="false"
							:defaultActiveFirstOption="false"
							@search="getAddressList"
							v-decorator="[
								`warehousePartyAddr`,
								{
									rules: [{ required: true, message: `请选择`, type: 'string' }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in addressList"
								:key="index"
								:value="items.name"
								>{{ items.name }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方QQ">
						<a-input
							:maxLength="50"
							v-decorator="['warehousePartyQq']"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="仓储方微信">
						<a-input
							:maxLength="50"
							v-decorator="['warehousePartyWechat']"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<p
			class="title"
			style="margin-bottom: 10px"
		>
			合同附件信息
		</p>
		<a-table
			:columns="columnsFile"
			:data-source="dataFile"
			:pagination="false"
			rowKey="fileId"
		>
			<span
				slot="action"
				slot-scope="text, record"
			>
				<a-button
					type="link"
					:disabled="false"
					v-if="['edit', 'preview'].includes(routeType)"
				>
					<a
						href="javascript:;"
						@click="jumpDownload(record)"
						>下载</a
					>
				</a-button>
				<a-button
					type="link"
					@click="deleteItem(record)"
					:disabled="disabledAll"
					v-if="routeType != 'preview'"
					>删除</a-button
				>
			</span>
		</a-table>
		<a-button
			type="dashed"
			block
			icon="plus"
			@click="addFile"
			v-if="!['preview'].includes(routeType)"
			style="margin-top: 40px"
			:disabled="disabledAll"
		>
			新增附件
		</a-button>
		<upload
			ref="upload"
			v-on:add-file="addFileList"
			:fileTypeList="fileTypeList"
		/>
		<div v-if="$route.query.id">
			<p
				class="title"
				style="margin-top: 20px"
			>
				修改记录
			</p>
			<a-table
				:columns="logColumns"
				style="margin-top: 20px"
				:data-source="detailInfo.changeList"
				:pagination="false"
				:scroll="{ x: true }"
				rowKey="fileId"
			>
				<span
					slot="action"
					slot-scope="text, record"
				>
					<a-button
						type="link"
						:disabled="false"
						v-if="['edit', 'preview'].includes(routeType)"
					>
						<a
							href="javascript:;"
							@click="jumpDownload(record)"
							>下载</a
						>
					</a-button>
					<a-button
						type="link"
						@click="deleteItem(record)"
						:disabled="disabledAll"
						v-if="routeType != 'preview'"
						>删除</a-button
					>
				</span>
			</a-table>
		</div>

		<div class="page-footer-wrap">
			<a-button
				type="primary"
				@click="submit(1)"
				:disabled="disabled"
				v-show="!disabledAll"
				>保存</a-button
			>
			<a-button
				type="primary"
				style="margin-left: 40px"
				@click="submit(2)"
				:disabled="disabled"
				v-show="!disabledAll && !disabledEdit"
				>启用</a-button
			>
			<a-button
				type=""
				style="margin-left: 40px"
				@click="cancel"
				>{{ cancelBtnText }}</a-button
			>
		</div>
	</div>
</template>

<script>
import upload from '@/v2/center/steels/views/takeGoods/components/upload.vue';
import { API_SteelsDownloadFilesPath } from '@/v2/api/steels';
import comDownload from '@sub/utils/comDownload.js';
import { constractSaveOrSubmit, warehouseContractDetails } from '../../api/warehouse.js';
import moment from 'moment';
import { warehouseType, goodsType, fileTypeList } from './config/type';
import { mapGetters } from 'vuex';
import { mapSearch } from '@/v2/api/common';
import { debounce } from 'lodash';
const regexpEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const logColumns = [
	{
		title: '序号',
		dataIndex: 'rowIndex',
		width: 70,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '修改项', dataIndex: 'columnDesc' },
	{ title: '修复前', dataIndex: 'changeBefore' },
	{ title: '修改后', dataIndex: 'changeAfter' },
	{ title: '修改人', dataIndex: 'createdName' },
	{ title: '修改时间', dataIndex: 'createdDate', fixed: 'right' }
];
export default {
	data() {
		this.initMap = debounce(this.initMap, 800);
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			columnsFile: [
				{
					title: '文件类型',
					dataIndex: 'typeDesc'
				},
				{
					title: '文件名称',
					dataIndex: 'fileName'
				},
				{
					title: '操作',
					key: 'action',
					scopedSlots: { customRender: 'action' }
				}
			],
			logColumns,
			dataFile: [],
			tipText: {
				1: '保存成功',
				2: '启用成功'
			},
			disabled: false,
			warehouseType,
			goodsType,
			fileTypeList,
			// 仓房联系地址详情
			addressList: [],
			detailInfo: {}
		};
	},
	components: {
		upload
	},
	computed: {
		cancelBtnText() {
			if (this.$route.query?.id) {
				return '取消';
			} else {
				return '取消';
			}
		},
		title() {
			if (!this.$route.query?.id) {
				return '新增仓储租赁合同';
			}

			if (this.$route.query.type == 'preview') {
				return '仓储租赁合同详情';
			}
			return '编辑仓储租赁合同';
		},
		disabledAll() {
			return this.$route.query?.type == 'preview';
		},
		disabledEdit() {
			return this.$route.query?.type == 'edit';
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		routeType() {
			return this.$route.query?.type;
		}
	},
	mounted() {
		this.initMap();
		this.getDeatilsById();
		this.$nextTick(() => {
			this.form.setFieldsValue({
				lessor: this.VUEX_ST_COMPANYSUER.companyName
			});
		});
	},
	methods: {
		emailCheck(rule, value, callback) {
			if (!value) {
				callback('请输入邮箱!');
			} else {
				if (!regexpEmail.test(value)) {
					callback('邮箱格式不正确!');
				} else {
					callback();
				}
			}
		},
		jumpDownload(record) {
			// 单一附件信息下载附件
			API_SteelsDownloadFilesPath({ filePath: record.path }).then(res => {
				comDownload(res, null, record.fileName);
			});
		},
		setFileListTypeDesc(list) {
			list.map(el => {
				const item = this.fileTypeList.find(el2 => el2.value == el.type);
				if (item) {
					el.typeDesc = item.text;
				}
			});
			return list;
		},
		getDeatilsById() {
			const id = this.$route.query?.id;
			if (!id) {
				return;
			}
			warehouseContractDetails({
				id
			}).then(res => {
				if (res.success) {
					this.detailInfo = res.data;
					this.form.setFieldsValue({
						validity: [moment(res.data.warehouseContract.startDate), moment(res.data.warehouseContract.endDate)],
						...res.data.warehouseContract
					});
					res.data.attachList.forEach(item => {
						item.typeDesc = '仓储租赁合同(双签)';
					});
					this.dataFile = this.setFileListTypeDesc(res.data.attachList);
					this.initMap(res.data.warehouseContract.warehousePartyAddr);
				}
			});
		},
		cancel() {
			this.$router.back();
		},
		getFileList() {
			const result = [];
			this.dataFile.forEach(item => {
				result.push({
					type: 'WAREHOUSE_RENTAL_CONTRACT',
					fileId: item.fileId
				});
			});
			return result;
		},
		submit(type) {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					/** 获取仓储方联系地址 */
					const item = this.addressList.find(el => el.name == values.warehousePartyAddr) || {};

					if (!this.getFileList().length) {
						this.$message.warning('请添加合同附件');
						return;
					}
					values.startDate = moment(values.validity[0]).format('YYYY-MM-DD');
					values.endDate = moment(values.validity[1]).format('YYYY-MM-DD');
					delete values.validity;

					if (!item.location) {
						this.$message.error('请正确选择仓储方联系地址');
						return;
					}
					if (this.disabled) return;
					this.disabled = true;
					const params = {
						id: this.$route.query.id,
						saveOrSubmit: type,
						...values,
						attachList: this.getFileList(),
						editAfterStart: type,
						warehouseAddrDetail: item.address,
						longitude: item.lng,
						latitude: item.lat
					};
					try {
						if (this.$route.query.id) {
							params.saveOrSubmit = 2;
						}
						await constractSaveOrSubmit(params);

						this.disabled = false;
						this.$message.success(this.tipText[type]);
						this.$router.back();
					} catch (error) {
						this.disabled = false;
					}
				}
			});
		},
		deleteItem(item) {
			for (let i = 0; i < this.dataFile.length; i++) {
				if (this.dataFile[i].fileId == item.fileId) {
					this.dataFile.splice(i, 1);
					break;
				}
			}
		},
		addFile() {
			this.$refs.upload.show();
		},
		addFileList(item) {
			const { fileId, fileName } = item;
			this.dataFile.push({
				id: fileId,
				fileId: fileId,
				fileName: fileName,
				type: item.type,
				path: item.fileUrl,
				typeDesc: '仓储租赁合同(双签)'
			});
		},
		getAddressList(e) {
			this.initMap(e);
		},
		// 初始化地图
		async initMap(keywords = '') {
			const that = this;
			if (!keywords) return;
			const params = {
				keyword: keywords
			};
			const res = await mapSearch(params);
			const list = res.data;
			list.forEach(el => {
				el.address = `${el.provinceName}${el.cityName}${el.adName}${el.address}`;
				el.name = `${el.provinceName}${el.cityName}${el.adName}${el.name}`;
				el.location = `${el.longitude},${el.latitude}`;
				el.lng = el.longitude;
				el.lat = el.latitude;
			});
			this.addressList = list;

			// this.addressList = list.filter(el=> el.location)
			// AMap.plugin('AMap.Autocomplete', function(){
			//   // 实例化Autocomplete
			//   var autoOptions = {
			//     city: '全国'
			//   }
			//   var autoComplete = new AMap.Autocomplete(autoOptions);
			//   autoComplete.search(keywords, function(status, result) {
			//     const list = result?.tips || []
			//     list.forEach(el => {
			//       el.address = `${el.district}${el.address}`
			//       el.name = `${el.district || ''}${el.name}`
			//     })

			//      that.addressList = list.filter(el=> el.location)
			//   })
			// })
		}
	}
};
</script>

<style lang="less" scoped>
.page-footer-wrap {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 40px;
}
.title {
	width: 100%;
	height: 40px;
	font-weight: bold;
	line-height: 40px;
}
</style>
