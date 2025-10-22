<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<!-- <div class="breadcrumb">出库记录查询 <span style="margin:0 8px">/</span> <span style="font-weight:600">新增出库单</span></div> -->
		<a-card
			:bordered="false"
			class="content"
			style="padding-bottom: 74px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.query.id ? '编辑出库单' : '新增出库单' }}</span>
			</div>
			<div class="divider"></div>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
				@submit="handleSubmit"
				style="padding-bottom: 6px"
			>
				<a-row style="padding-bottom: 6px">
					<a-col :span="8">
						<a-form-item label="仓库简称">
							<!-- 选择框 -->
							<a-select
								show-search
								:filter-option="filterOption"
								@change="changeWarehouse"
								placeholder="请选择仓库简称"
								:getPopupContainer="getPopupContainer"
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
									mode="multiple"
									placeholder="请选择运输方式"
									notFoundContent="暂无数据"
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
							<a-form-item label="出库单号">
								<a-input
									:maxLength="30"
									placeholder="请输入出库单号"
									v-decorator="[`serialNo`, { rules: [{ required: true, message: `请输入入库单号`, whitespace: true }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-form-item label="出库日期">
							<a-date-picker
								v-decorator="[`operationDate`, { rules: [{ required: true, message: `请输入出库单号` }] }]"
								type="date"
								value-format="YYYY-MM-DD"
								format="YYYY-MM-DD"
								placeholder="请选择出库日期"
								style="width: 100%"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-date-picker>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="出库方式">
								<a-select
									:getPopupContainer="getPopupContainer"
									@change="changeOutWay"
									placeholder="请选择出库方式"
									:notFoundContent="!outboundWayList.length ? '暂无数据' : '加载中...'"
									v-decorator="[`outboundWay`, { rules: [{ required: true, message: `出库方式必填` }] }]"
								>
									<a-select-option
										v-for="(items, index) in outboundWayList"
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
							<a-form-item label="货权接收方">
								<a-select
									show-search
									placeholder="请输入货权接收方"
									style="width: 100%"
									:filter-option="false"
									:default-active-first-option="false"
									:not-found-content="fetching ? undefined : null"
									@search="getCompanyInfo"
									@select="handleSelect"
									v-decorator="[
										'customer',
										{
											rules: [{ required: true, message: '货权接收方必填' }]
										}
									]"
								>
									<a-spin
										v-if="fetching"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="(item, i) in companyList"
										:key="item.name"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>

					<a-col :span="8">
						<a-form-item label="备注">
							<a-input
								placeholder="请输入备注"
								:maxLength="100"
								v-decorator="[`remark`]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						v-show="false"
					>
						<a-form-item label="货权接收方">
							<a-input
								placeholder="请输入货权接收方"
								v-decorator="[`customerUscc`]"
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<AddingMode
					type="OUT"
					:outboundWay="form.getFieldValue('outboundWay')"
					v-show="form.getFieldValue('warehouseId') && form.getFieldValue('outboundWay')"
					:warehouseId="form.getFieldValue('warehouseId')"
					ref="addingMode"
				></AddingMode>
				<a-row>
					<a-col
						:span="24"
						style="margin-top: 20px"
						v-show="form.getFieldValue('warehouseId')"
					>
						<a-form-item
							label="备注"
							style="width: 100%"
						>
							<a-input
								:maxLength="100"
								style="width: 100%"
								placeholder="请输入"
								v-decorator="[`rowRemark`]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>

			<!-- /** 上传附件 */ -->
			<div
				style="margin-top: 0px; margin-bottom: 30px"
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
				:fileData="fileData"
				:multiple="true"
				v-if="form.getFieldValue('warehouseId')"
				:fileType="['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip']"
				:optList="[
					{ value: 'OUTBOUND_CREDENTIALS', label: '出库凭证（已盖章）' },
					{ value: 'OTHER', label: '其他' }
				]"
				:disabled="false"
			>
			</uploadAttachment>
			<div class="slDetailBottom">
				<a-button
					type="primary"
					style="margin-left: 0px; width: 88px; padding: 0; line-height: inherit"
					@click="goBack"
					class="upload-file"
					>取消</a-button
				>
				<a-button
					type="primary"
					:disabled="disabled"
					@click="handleSubmit('save')"
					style="margin-left: 30px; width: 88px; padding: 0; line-height: inherit"
					class="upload-file"
					>保存</a-button
				>
				<a-button
					type="primary"
					:disabled="disabled"
					style="margin-left: 30px; width: 88px; padding: 0; line-height: inherit"
					@click="handleSubmit('submit')"
					>提交</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { getStorageAbbreviationList, addInout, getOutInModifyDetailDetail, editInout, submitInout, checkInout } from '../../api';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';
import AddingMode from '../../components/AddingMode.vue';
import uploadAttachment from '../../components/uploadAttachment.vue';
import tipModal from '../../components/tipModal.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_GetCompanyName } from '@/v2/center/steels/api';
export default {
	data() {
		return {
			storageList: [],
			form: this.$form.createForm(this),
			// 运输方式
			transportModeList: filterSteelsCodeByKey('warehouseTransportMode'),
			// 出库方式
			// outboundWayList: filterSteelsCodeByKey('outboundWay'),
			outboundWayList: [
				{ value: 'SPECIFICATION', label: '指定规格出库' },
				{ value: 'CHARGED_WITH_TONS', label: '控吨出库' }
			],
			fetching: false,
			companyList: [],
			fileData: [],
			detailInfo: {},
			disabled: false
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
					operationDate: moment().format('YYYY-MM-DD')
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
			const res = await getOutInModifyDetailDetail(params);
			this.detailInfo = res.data;

			this.$nextTick(() => {
				this.form.setFieldsValue({
					...res.data,
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
						id: res.data.attachId,
						name: res.data.attachName
					};
					this.$refs.addingMode.init(res.data.goods, obj, fileFormat);
				} else {
					this.$refs.addingMode.init(res.data.goods, {});
				}
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
						workType: 'OUT',
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
						const checkRes = await checkInout(params);
						this.disabled = false;

						if (checkRes.data !== true) {
							this.$message.error(checkRes.data.msg);
							const item = this.$refs.addingMode.list[checkRes.data.serialNo - 1] || {};
							item.error = 'error';
							const list = this.$refs.addingMode.list;
							this.$refs.addingMode.updateList(list);
							this.$forceUpdate();
							return;
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
		// 出库方式
		changeOutWay(val) {
			this.$refs.addingMode.list = [];
		},
		changeWarehouse() {
			const outboundWay = this.form.getFieldValue('outboundWay');
			// 仓库变化 品名发生变化
			// 指定规格的时候
			if (outboundWay == 'SPECIFICATION') {
				this.$refs.addingMode.list = [];
			}
		},
		getCompanyInfo(v) {
			// 获取公司社会代码
			if (!v) {
				return;
			}
			this.fetching = true;
			API_GetCompanyName({ name: v })
				.then(res => {
					if (res.success) {
						this.companyList = res.data;
					}
				})
				.finally(() => (this.fetching = false));
		},
		handleSelect(e) {
			if (!this.companyList.length) return;
			const item = this.companyList.find(el => el.name == e);
			this.form.setFieldsValue({ customerUscc: item.creditCode });
		}
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
	height: 100%;
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
/deep/ .ant-table-tbody > tr:nth-child(2n) {
	background: #ffffff !important;
}
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
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
