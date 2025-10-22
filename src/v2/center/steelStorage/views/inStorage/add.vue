<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<!-- import Breadcrumb from "@/v2/components/Breadcrumb.vue"; -->
		<!-- <div class="breadcrumb">入库记录查询 <span style="margin:0 8px">/</span> <span style="font-weight:600">新增入库单</span></div> -->
		<a-card
			:bordered="false"
			class="content"
			style="padding-bottom: 74px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>
					<span>{{ $route.query.id ? '编辑入库单' : '新增入库单' }}</span></span
				>
			</div>
			<div class="divider"></div>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
				@submit="handleSubmit"
				style="padding-bottom: 6px"
			>
				<a-row>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="仓库简称">
								<!-- 选择框 -->
								<a-select
									show-search
									:filter-option="filterOption"
									:getPopupContainer="getPopupContainer"
									placeholder="请选择仓库简称"
									notFoundContent="暂无数据"
									v-decorator="[`warehouseId`, { rules: [{ required: true, message: `仓库简称必填` }] }]"
								>
									<a-select-option
										v-for="(items, index) in storageList"
										:key="index"
										:value="items.warehouseId"
									>
										{{ items.warehouseAbbr }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="运输方式">
								<a-select
									show-search
									:filter-option="filterOption"
									:getPopupContainer="getPopupContainer"
									notFoundContent="暂无数据"
									mode="multiple"
									placeholder="请选择运输方式"
									v-decorator="[`transportMode`, { rules: [{ required: true, message: `运输方式必填` }] }]"
								>
									<a-select-option
										v-for="(items, index) in transportModeList"
										:key="index"
										:value="items.value"
									>
										{{ items.label }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="入库单号">
								<a-input
									:maxLength="30"
									placeholder="请输入入库单号"
									v-decorator="[`serialNo`, { rules: [{ required: true, message: `请输入入库单号`, whitespace: true }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-form-item label="业务类型">
							<a-input
								placeholder="请输入业务类型"
								disabled
								v-decorator="[`workType`, { rules: [{ required: true, message: `请输入入业务类型` }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="货主">
								<a-input
									placeholder="请输入货主"
									disabled
									v-decorator="[`customer`, { rules: [{ required: true, message: `请输入货主` }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="创建日期">
								<a-input
									placeholder="请输入日期"
									disabled
									v-decorator="[`operationDate`, { rules: [{ required: true, message: `请输入日期` }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-form-item label="备注">
							<a-input
								placeholder="请输入备注"
								:maxLength="60"
								v-decorator="[`remark`]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<AddingMode
				type="IN"
				ref="addingMode"
				v-show="form.getFieldValue('warehouseId')"
			></AddingMode>
			<!-- /** 上传附件 */ -->
			<div
				style="margin-top: 30px; margin-bottom: 30px"
				v-if="form.getFieldValue('warehouseId')"
			>
				<span class="slTitleAssis">上传附件</span>
				<a-button
					type="primary"
					@click="upload"
					class="upload-file"
					>新增附件</a-button
				>
			</div>
			<uploadAttachment
				ref="uploadAttachment"
				v-if="form.getFieldValue('warehouseId')"
				@fileChange="getAttachList"
				:fileData="fileData"
				:multiple="true"
				:fileType="['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip']"
				:optList="[
					{ value: 'INBOUND_CREDENTIALS', label: '入库凭证（已盖章）' },
					{ value: 'OTHER', label: '其他' }
				]"
				:disabled="false"
			>
			</uploadAttachment>
			<div class="slDetailBottom">
				<a-button
					type="primary"
					style="width: 88px; margin-left: 0; padding: 0; line-height: inherit"
					@click="goBack"
					class="upload-file"
					>取消</a-button
				>
				<a-button
					type="primary"
					style="margin-left: 30px; width: 88px; padding: 0; line-height: inherit"
					@click="handleSubmit('add')"
					class="upload-file"
					>保存</a-button
				>
				<a-button
					type="primary"
					style="margin-left: 30px; width: 88px; padding: 0; line-height: inherit"
					@click="handleSubmit('submit')"
					>提交</a-button
				>
			</div>

			<tipModal
				ref="tipModal"
				tip="确定作废当前入库记录么？作废后将会影响系统中的库存统计数据"
				@save="tipModalSave"
			></tipModal>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { getStorageAbbreviationList, addInout, getInoutDetail, editInout, submitInout } from '../../api';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';
import AddingMode from '../../components/AddingMode.vue';
import uploadAttachment from '../../components/uploadAttachment.vue';
import tipModal from '../../components/tipModal.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	data() {
		return {
			storageList: [],
			form: this.$form.createForm(this),
			// 运输方式
			transportModeList: filterSteelsCodeByKey('warehouseTransportMode'),
			fileData: [],
			disabled: false,
			detailInfo: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.init();
		this.getStorageList();
		this.getInoutDetail();
		window.addEventListener('resize', () => {
			this.handleScroll();
		});
	},

	methods: {
		// 初始化
		init() {
			/** 赋值 */
			this.$nextTick(() => {
				this.form.setFieldsValue({
					operationDate: moment().format('YYYY-MM-DD'),
					customer: this.VUEX_ST_COMPANYSUER.companyName,
					workType: '入库'
				});
			});
		},
		/** 获取详情 */
		async getInoutDetail() {
			const params = {
				id: this.$route.query.id
			};
			if (!this.$route.query.id) {
				return;
			}
			const res = await getInoutDetail(params);
			this.detailInfo = res.data;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					transportMode: this.detailInfo.transportMode.split(','),
					warehouseId: String(this.detailInfo.warehouseId),
					serialNo: this.detailInfo.serialNo,
					remark: this.detailInfo.remark
				});

				res.data.attachList.forEach(el => {
					el.typeName = el.typeDesc;
					el.fullPath = el.path;
				});
				this.fileData = res.data.attachList;
				res.data.goods.forEach((el, i) => {
					el.mainId = i;
				});
				const attach = res.data.attach || '';
				const fileFormat = attach.split('?')[0].split('.').pop().toLowerCase();
				if (attach) {
					const obj = {
						path: attach,
						url: attach,
						id: res.data.attachId
					};
					this.$refs.addingMode.init(res.data.goods, obj, fileFormat);
				} else {
					this.$refs.addingMode.init(res.data.goods, {});
				}
			});
		},
		handleScroll() {
			this.$nextTick(() => {
				var thead = document.querySelector('.slDetailBottom');
				var lw = document.querySelector('#app');
				lw.addEventListener('scroll', function () {
					var sl = 228 - lw.scrollLeft;
					thead.style.left = sl + 'px';
				});
			});
		},
		getPopupContainer,
		// 获取仓库列表
		async getStorageList() {
			const res = await getStorageAbbreviationList({});
			const list = res.data || [];
			this.storageList = list;
		},
		upload() {
			this.$refs.uploadAttachment.open();
		},
		// 获取附件
		getAttachList(data) {
			this.fileData = data;
		},
		goBack() {
			this.$router.go(-1);
		},
		handleSubmit(type) {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					/** 判断明细 */
					if (!this.$refs.addingMode.save()) {
						return;
					}
					// 判断附件
					if (!this.fileData.length) {
						this.$message.error('请上传附件');
						return;
					}
					const info = this.$refs.addingMode.save();
					const params = {
						...values,
						...info,
						workType: 'IN',
						attachList: this.fileData.map(el => {
							return {
								type: el.type,
								fileId: el.id
							};
						})
					};

					if (this.disabled) {
						return;
					}
					this.disabled = true;
					try {
						let fn = this.$route.query.id ? editInout : addInout;

						if (this.$route.query.id) {
							params.id = this.$route.query.id;
						}
						if (type == 'submit') {
							fn = submitInout;
						}
						await fn(params);
						this.disabled = false;
						this.$message.success('操作成功');
						this.goBack();
					} catch (error) {
						this.disabled = false;
					}
				}
			});
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		tipModalSave() {}
	},
	components: {
		AddingMode,
		uploadAttachment,
		tipModal,
		Breadcrumb
	}
};
</script>

<style scoped lang="less">
.slMain {
	margin-left: -30px;
	margin-right: -30px;
	// padding-bottom: 74px;
	background: #fff;
	.breadcrumb {
		background: #f4f5f8;
		padding-bottom: 15px;
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
	}
	.divider {
		margin-top: 30px;
		margin-bottom: 10px;
		background: #e5e6eb;
	}
	.ant-col {
		height: 82px;
	}
	.ant-form-item {
		width: 364px;
	}
	.upload-file {
		width: 116px;
		height: 32px;
		background: #ffffff;
		border: 1px solid @primary-color;
		border-radius: 4px;
		color: @primary-color;
		margin-left: 30px;
	}
	.btn-box {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 64px;
		border-top: 1px solid #e5e6eb;
		margin-top: 14px;
	}
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
	z-index: 999;
}
</style>
