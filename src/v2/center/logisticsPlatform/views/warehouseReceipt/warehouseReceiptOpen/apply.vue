<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 70px"
		>
			<div
				class="methods-wrap"
				@click="save"
			>
				<span class="slTitle">电子仓单开立申请</span>
			</div>
			<div class="slTitleAssis">基本信息</div>
			<OpenContractInfo
				:type="type"
				@updateIndex="updateIndex"
				@sendRelationFlag="getContactRelation"
				ref="contractInfo"
				querySource="WAREHOUSE_RECEIPT_ISSUANCE"
			></OpenContractInfo>
			<div class="slTitleAssis">
				<span>货物明细</span>
				<a-button
					style="margin-left: 20px"
					type="primary"
					ghost
					@click="openInInfo"
					>选择入库记录</a-button
				>
			</div>
			<div style="margin-top: 20px">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:dataSource="selectInList"
					:columns="inColumns"
					:pagination="false"
					:rowKey="record => record.inStorageNo"
				>
					<template
						slot="inStorageNo"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="goInDetail(record)"
							>{{ text }}</a
						>
					</template>
					<template
						slot="goodsName"
						slot-scope="text"
					>
						<a-tooltip v-if="text">
							<template slot="title">{{ text }}</template>
							<p class="omit">{{ text || '-' }}</p>
						</a-tooltip>
						<span v-else>-</span>
					</template>
					<template
						slot="warehouseGoodsAllocationName"
						slot-scope="text"
					>
						<a-tooltip v-if="text">
							<template slot="title">{{ text }}</template>
							<p class="omit">{{ text || '-' }}</p>
						</a-tooltip>
						<span v-else>-</span>
					</template>
					<template
						slot="deliveryReceiveCompanyName"
						slot-scope="text"
					>
						<a-tooltip>
							<template slot="title">{{ text }}</template>
							<p class="omit">{{ text }}</p>
						</a-tooltip>
					</template>
					<template
						slot="action"
						slot-scope="text, record"
					>
						<a @click.prevent="delInRecord(record)">删除</a>
					</template>
				</a-table>
				<p class="in-tip">
					<span>共计入库数量：</span> <span> {{ inTotalWeight | formatMoney }}吨</span>
				</p>
			</div>
			<InStorageDraw
				ref="inStorageDraw"
				:contractId="selectContractInfo.orderContractId"
				:contractType="selectContractInfo.contractType"
				@select="getSelectItems"
				:selectInList="selectInList"
			></InStorageDraw>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item :label="lossStandardType != 'NUMER' ? '损耗标准' : '损耗标准%'">
								<span v-if="lossStandardType == 'NUMER'">±</span>
								<a-input-number
									style="width: 364px"
									:precision="4"
									:min="0"
									v-if="lossStandardType == 'NUMER'"
									:max="100"
									placeholder="请输入损耗标准"
									v-decorator="['lossStandard', { rules: [{ required: true, message: '请输入损耗标准' }] }]"
								></a-input-number>
								<a-input
									style="width: 364px"
									precision
									v-else
									:maxLength="200"
									placeholder="请输入损耗规则，上限200字"
									v-decorator="['lossStandard', { rules: [{ required: true, message: '请输入损耗标准' }] }]"
								></a-input>
							</a-form-item>
							<a-radio-group
								v-model="lossStandardType"
								class="tab-box"
								@change="changeLossStandard"
							>
								<a-radio-button
									v-for="item in textAndNumberList"
									:key="item.value"
									:value="item.value"
									>{{ item.label }}
								</a-radio-button>
							</a-radio-group>
						</a-row>
					</a-col>
				</a-row>
				<div>
					<ProductIndicator
						:contractId="selectContractInfo.contractNo"
						ref="productIndicator"
					/>
				</div>
				<ApplyInfo
					ref="applyInfo"
					:listApi="getWarehouseReceiptOpenContractList"
					@select="getSelectStorageContractInfo"
				></ApplyInfo>
			</a-form>
			<div
				class="slTitleAssis"
				style="margin-top: 0"
			>
				附件
			</div>
			<AttachmentOpen
				ref="attachmentOpen"
				style="margin-top: 30px"
				:list="attachmentList"
			></AttachmentOpen>
		</a-card>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			@cancel="closeModal"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="提交"
		>
			<div class="tip-box">
				<p>系统将对提交开立申请，请确保信息无误</p>
			</div>
		</TipModal>
		<a-modal
			class="slModal slModal2"
			:visible="previewVisible"
			:width="1174"
			@cancel="previewVisible = false"
			title="仓单预览"
			:footer="null"
		>
			<div class="content">
				<pdf-preview
					:url="currentPdf"
					type="base64"
				></pdf-preview>
			</div>
		</a-modal>
		<ModalInfo
			ref="modalInfoChange"
			title="提示确认提交"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="forceBack"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="submit"
				>
					提交后返回
				</a-button>
			</div>
		</ModalInfo>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="goBack"
					>取消</a-button
				>
				<a-button
					type="primary"
					ghost
					@click="save"
					>保存</a-button
				>
				<a-button
					type="primary"
					ghost
					@click="preview"
					>预览</a-button
				>
				<a-button
					type="primary"
					@click="submit"
					>提交</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { cloneDeep, merge } from 'lodash';
import OpenContractInfo from '../components/OpenContractInfo.vue';
import InStorageDraw from '../components/InStorageDraw.vue';
import ProductIndicator from '../components/ProductIndicator.vue';
import AttachmentOpen from '../components/AttachmentOpen.vue';
import ApplyInfo from '../components/applyInfo.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { formatMoney } from '@sub/filters';
import PdfPreview from '@sub/components/pdf/index.vue';
import TipModal from '@sub/components/DelModal.vue';
import ModalInfo from '@/v2/components/modalInfo/info';
import { deepCompare } from '@/v2/utils/factory';
import {
	getWarehouseReceiptOpenContractList,
	saveOrSubmitWarehouseReceiptOpen,
	getWarehouseReceiptOpenDetail,
	previewWarehouseReceiptOpen,
	getLatestWarehouseContract
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';

const inColumns = [
	{
		title: `入库编号`,
		key: 'inStorageNo',
		dataIndex: 'inStorageNo',
		fixed: 'left',
		scopedSlots: { customRender: 'inStorageNo' }
	},
	{ title: `入库日期`, key: 'storageDate', dataIndex: 'storageDate' },
	{ title: `品名`, key: 'goodsName', dataIndex: 'goodsName', scopedSlots: { customRender: 'goodsName' } },
	{ title: `入库数量(吨)`, key: 'quantity', dataIndex: 'quantity', customRender: t => formatMoney(t) },

	{
		title: `发货单位`,
		key: 'deliveryCompanyName',
		dataIndex: 'deliveryCompanyName',
		scopedSlots: { customRender: 'deliveryCompanyName' }
	},
	{ title: `仓库名称`, key: 'stationName', dataIndex: 'stationName', customRender: t => t || '-' },
	{
		title: `仓房&货位`,
		key: 'warehouseGoodsAllocationName',
		dataIndex: 'warehouseGoodsAllocationName',
		scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
	},
	{ title: `操作`, key: 'action', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
export default {
	data() {
		return {
			type: 'IN',
			inColumns,
			lossStandardType: 'TEXT',
			textAndNumberList: [
				{ value: 'TEXT', label: '文本' },
				{ value: 'NUMER', label: '数值' }
			],
			selectInList: [],
			form: this.$form.createForm(this),
			selectContractInfo: {},
			attachmentList: [
				{
					key: 'MANAGE_AGREEMENT',
					label: '电子仓单管理协议',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					tip: '说明：可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件。',
					required: true,
					isShowBtn: false
				},
				{
					key: 'OFFLINE_CONTRACT',
					label: '仓储合同',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					isShowBtn: false,
					required: true
				},
				{
					key: 'INSURANCE_POLICY',
					label: '保险单',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					isShowBtn: true
				},
				{
					key: 'OTHER',
					label: '其他材料',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					isShowBtn: true
				}
			],
			// 选择的仓储合同
			selectStorageContractInfo: {},
			currentPdf: '',
			previewVisible: false,
			currentParams: {},
			detailInfo: {},
			isNeedNext: true,
			// 缓存

			cacheInfo: {}
		};
	},
	computed: {
		inTotalWeight() {
			let num = 0;
			this.selectInList.forEach(el => {
				num += Number(el.quantity);
			});
			return num;
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		})
	},
	beforeRouteLeave(to, form, next) {
		if (this.isNeedNext) {
			this.oldAndNew(next);
		} else {
			next();
		}
	},
	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		} else {
			this.getLatestWarehouseContract();
		}
	},
	methods: {
		...mapMutations({
			VUEX_SET_UPDATE_INDICATOR: 'contract/VUEX_SET_UPDATE_INDICATOR'
		}),

		getWarehouseReceiptOpenContractList,
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getWarehouseReceiptOpenDetail(params);

			this.detailInfo = res.data;
			this.selectInList = this.detailInfo.inStorageList;
			let insuranceInfo = this.detailInfo.insuranceInfo;
			if (insuranceInfo) {
				for (let key in insuranceInfo) {
					if (!insuranceInfo[key]) {
						delete insuranceInfo[key];
					}
				}
			}
			this.cacheInfo = {
				lossStandard: this.detailInfo.lossStandard,
				lossStandardType: this.detailInfo.lossStandardType,
				contractId: this.detailInfo.contractInfo.orderContractId,
				productIndicatorList: this.detailInfo.productIndicatorList,
				selectInList: this.detailInfo.inStorageList.map(el => el.id),
				insuranceInfo: insuranceInfo ? { ...insuranceInfo } : null,
				warehouseReceiptAttachmentList: this.detailInfo.warehouseReceiptAttachmentList
					.filter(el => el.fileType != 'WAREHOUSE_RECEIPT')
					.map(el => el.path),
				storageFees: this.detailInfo.storageFees,
				storageFeesType: this.detailInfo.storageFeesType,
				warehouseContractId: this.detailInfo.warehouseContractId,
				storageTimeEnd: this.detailInfo.storageTimeEnd,
				storageTimeStart: this.detailInfo.storageTimeStart
			};

			this.$nextTick(() => {
				this.$refs.contractInfo.init(this.detailInfo.contractInfo, true);
				this.form.setFieldsValue({
					lossStandard: this.detailInfo.lossStandard
				});
				this.lossStandardType = this.detailInfo.lossStandardType;

				// 仓储合同信息
				// applyInfo
				this.$refs.applyInfo.init(this.detailInfo);
				// 附件
				let list = this.detailInfo.warehouseReceiptAttachmentList || [];
				list = list.map(el => {
					return {
						...el,
						type: el.fileType
					};
				});
				this.$refs.attachmentOpen.init(list);

				const productIndicatorList = this.detailInfo.productIndicatorList;

				productIndicatorList.forEach(el => {
					el.valueList = {};
					el.valueList[el.indicatorCode + '_value1'] = el.value1;
					el.valueList[el.indicatorCode + '_value2'] = el.value2;
				});
				const orderIndicators = [
					{
						productIndicatorList
					}
				];

				this.VUEX_SET_UPDATE_INDICATOR(orderIndicators);
				this.$nextTick(() => {
					this.$refs.productIndicator.init();
				});
			});
		},
		// 更新指标
		updateIndex() {
			this.$nextTick(() => {
				this.$refs.productIndicator.init();
			});
		},
		forceBack() {
			this.isNeedNext = false;
			this.goBack();
		},
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/list');
		},
		// 修改损耗标准
		changeLossStandard() {
			this.form.setFieldsValue({
				lossStandard: this.lossStandardType == 'TEXT' ? undefined : 0
			});
		},
		getContactRelation(info, flag) {
			this.selectContractInfo = info;
			this.selectInList = [];
			// flag 判断是否是第一次加载 如果不是 则清空质量指标
			if (!flag) {
				this.VUEX_SET_UPDATE_INDICATOR([]);

				this.$nextTick(() => {
					this.$refs.productIndicator.init();
				});
			}
		},
		openInInfo() {
			this.$refs.inStorageDraw.show(this.selectInList);
		},
		closeModal() {
			this.$refs.submitModal.close();
		},
		getSelectItems(list) {
			this.selectInList = list;
		},
		getSelectStorageContractInfo(info) {
			this.selectStorageContractInfo = info;
			/** 选择仓储合同以后更新 当前的附件 */
			// 电子仓单管理协议附件
			const warehouseReceiptAttachmentList = info.warehouseReceiptAttachmentList || [];
			// 仓储合同附件
			const warehouseContractAttachmentList = info.warehouseContractAttachmentList || [];
			warehouseReceiptAttachmentList.forEach(el => {
				el.type = 'MANAGE_AGREEMENT';
				(el.key = 'MANAGE_AGREEMENT'), (el.isShowBtn = false);
			});
			warehouseContractAttachmentList.forEach(el => {
				el.type = 'OFFLINE_CONTRACT';
				el.key = 'OFFLINE_CONTRACT';
				el.isShowBtn = false;
			});

			const list = [...warehouseReceiptAttachmentList, ...warehouseContractAttachmentList];
			this.$nextTick(() => {
				this.$refs.attachmentOpen.init(list);
			});
		},
		delInRecord(item) {
			this.selectInList = this.selectInList.filter(el => el.inStorageNo != item.inStorageNo);
		},
		formateOrderIndicators(orderIndicators) {
			let cloneObj = cloneDeep(orderIndicators);
			cloneObj?.forEach(item => {
				if (item.productIndicatorList) {
					item.productIndicatorList.forEach(items => {
						if (items.inputType == 'RANGE') {
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
							items.value2 = items.valueList[items.indicatorCode + '_value2'];
						} else {
							// items.value2 = items.symbol == '无符号' ? null : items.symbol;
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
						}
					});
				}
			});
			return cloneObj;
		},
		// 去往入库详情
		goInDetail(item) {
			window.open(`/center/logisticsPlatform/in/detail?id=${item.id}`);
		},
		async preview() {
			const values = this.form.getFieldsValue();

			// 选择的合同信息
			let params = {
				...values,
				contractId: this.selectContractInfo.orderContractId,
				contractType: this.selectContractInfo.contractType,
				quantity: this.inTotalWeight,
				lossStandardType: this.lossStandardType,
				operatorType: 'SAVE',
				id: this.$route.query.id
			};
			params.inStorageNoList = this.selectInList.map(el => el.id);
			// 判断 质量指标
			const flag = await this.$refs.productIndicator.handleSubmit();
			if (!flag) return;
			const orderIndicators = this.formateOrderIndicators(this.VUEX_GET_CONTRACT_DATA.orderIndicators);

			params.productIndicatorList = orderIndicators[0].productIndicatorList;
			const info = await this.$refs.applyInfo.save();
			if (!info) return;

			params = { ...params, ...info };
			const res = await previewWarehouseReceiptOpen(params);
			this.currentPdf = res.data;
			this.previewVisible = true;
		},
		async save() {
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					/** 选择货物明细 */
					if (!this.selectInList.length) {
						this.$message.error('请选择入库记录');
						return;
					}
					// 选择的合同信息
					let params = {
						...values,
						contractId: this.selectContractInfo.orderContractId,
						contractType: this.selectContractInfo.contractType,
						quantity: this.inTotalWeight,
						lossStandardType: this.lossStandardType,
						operatorType: 'SAVE',
						id: this.$route.query.id
					};
					// 获取货物明细
					if (!this.selectInList.length) {
						this.$message.error('请选择货物明细');
						return;
					}
					params.inStorageNoList = this.selectInList.map(el => el.id);
					// 判断 质量指标
					const flag = await this.$refs.productIndicator.handleSubmit();
					if (!flag) return;
					const orderIndicators = this.formateOrderIndicators(this.VUEX_GET_CONTRACT_DATA.orderIndicators);

					params.productIndicatorList = orderIndicators[0].productIndicatorList;
					const info = await this.$refs.applyInfo.save();
					if (!info) return;

					const list = this.$refs.attachmentOpen.save();
					if (!list) return;
					let warehouseReceiptAttachmentList = list
						.filter(el => ['OTHER', 'INSURANCE_POLICY'].includes(el.type))
						.map(el => {
							return {
								...el,
								attachmentType: el.type
							};
						});
					params.warehouseReceiptAttachmentList = warehouseReceiptAttachmentList;
					params = { ...params, ...info };
					this.currentParams = params;
					await saveOrSubmitWarehouseReceiptOpen(this.currentParams);
					this.isNeedNext = false;
					this.$message.success('保存成功');
					this.goBack();
				}
			});
		},

		submit() {
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					/** 选择货物明细 */
					if (!this.selectInList.length) {
						this.$message.error('请选择入库记录');
						return;
					}
					// 选择的合同信息
					let params = {
						...values,
						contractId: this.selectContractInfo.orderContractId,
						contractType: this.selectContractInfo.contractType,
						quantity: this.inTotalWeight,
						lossStandardType: this.lossStandardType,
						operatorType: 'SUBMIT',
						id: this.$route.query.id
					};
					// 获取货物明细
					if (!this.selectInList.length) {
						this.$message.error('请选择货物明细');
						return;
					}
					params.inStorageNoList = this.selectInList.map(el => el.id);
					// 判断 质量指标
					const flag = await this.$refs.productIndicator.handleSubmit();
					if (!flag) return;
					const orderIndicators = this.formateOrderIndicators(this.VUEX_GET_CONTRACT_DATA.orderIndicators);

					params.productIndicatorList = orderIndicators[0].productIndicatorList;
					const info = await this.$refs.applyInfo.save();
					if (!info) return;

					const list = this.$refs.attachmentOpen.save();
					if (!list) return;
					let warehouseReceiptAttachmentList = list
						.filter(el => ['OTHER', 'INSURANCE_POLICY'].includes(el.type))
						.map(el => {
							return {
								...el,
								attachmentType: el.type
							};
						});
					params.warehouseReceiptAttachmentList = warehouseReceiptAttachmentList;
					params = { ...params, ...info };
					this.currentParams = params;
					this.$refs.submitModal.open();
				}
			});
		},
		async confirmSubmit() {
			this.closeModal();
			await saveOrSubmitWarehouseReceiptOpen(this.currentParams);
			this.isNeedNext = false;
			this.$message.success('提交成功');
			this.goBack();
		},
		async oldAndNew(next) {
			//如果有原始数据并且原始数据与现有数据不一致，则发生了修改
			/** 判断当前必填项都已经完成 */
			this.form.validateFields(async (err, values) => {
				if (!err) {
					if (!this.selectInList.length) {
						next();
						return;
					}

					let newObj = {
						...values,
						lossStandardType: this.lossStandardType,
						selectInList: this.selectInList.map(el => el.id),
						contractId: this.selectContractInfo.orderContractId
					};
					const flag = await this.$refs.productIndicator.handleSubmit();
					if (!flag) {
						next();
						return;
					}
					const orderIndicators = this.formateOrderIndicators(this.VUEX_GET_CONTRACT_DATA.orderIndicators);

					newObj.productIndicatorList = [...orderIndicators[0].productIndicatorList];

					const info = await this.$refs.applyInfo.save();

					if (!info) {
						next();
						return;
					}
					newObj = {
						...newObj,
						...info
					};

					const list = this.$refs.attachmentOpen.save2();
					if (!list) {
						next();
						return;
					}
					let warehouseReceiptAttachmentList = list.map(el => el.path);

					newObj.warehouseReceiptAttachmentList = warehouseReceiptAttachmentList;
					console.log(this.cacheInfo, newObj);
					if (deepCompare(newObj, this.cacheInfo)) {
						next();
					} else {
						this.openModal();
					}
				} else {
					next();
				}
			});
		},
		openModal() {
			this.$refs.modalInfoChange.open();
		},
		// 新增的时候获取默认的 仓储合同
		async getLatestWarehouseContract() {
			const res = await getLatestWarehouseContract();
			const info = res.data || {};
			this.$nextTick(() => {
				this.$refs.applyInfo.selectStorageContract(info);
			});
		}
	},
	components: {
		Breadcrumb,
		OpenContractInfo,
		InStorageDraw,
		ProductIndicator,
		AttachmentOpen,
		ApplyInfo,
		PdfPreview,
		TipModal,
		ModalInfo
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.in-tip {
	margin-top: 10px;
	span {
		color: rgba(0, 0, 0, 0.4);
	}
	span:last-child {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
	}
}
.tab-box {
	position: absolute;
	left: 264px;
	top: 0;
	/deep/ .ant-radio-button-wrapper {
		height: 24px;
		line-height: 24px;
		width: 50px;
		font-size: 12px;
		padding: 0;
		text-align: center;
	}
}
.omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
}
.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	.bot-1 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.25);
	}
	.bot-2 {
		position: absolute;
		left: 20px;
		font-size: 12px;
		vertical-align: middle;
		margin-top: 2px;
		color: red;
	}
	/deep/ .ant-checkbox-inner {
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
