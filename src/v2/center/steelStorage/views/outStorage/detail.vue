<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<!-- <div class="breadcrumb">出库记录查询 <span style="margin:0 8px">/</span> <span style="font-weight:500">出库单详情</span></div> -->
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>出库单详情</span>
			</div>
			<div class="divider"></div>
			<div>
				<a-form
					:form="form"
					class="slFormDetail"
					:colon="false"
					style="padding-bottom: 6px"
				>
					<a-row style="padding-bottom: 6px">
						<a-col :span="8">
							<a-form-item label="仓库简称">
								<a-input
									disabled
									v-decorator="[`warehouseAbbr`, { rules: [{ required: true, message: `请输入入业务类型` }] }]"
								/>
								<!-- 选择框 -->
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="运输方式">
									<a-input
										disabled
										v-decorator="[`transportModeDesc`, { rules: [{ required: true, message: `请输入入业务类型` }] }]"
									/>
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
										disabled
										v-decorator="[`serialNo`, { rules: [{ required: true, message: `请输入入库单号` }] }]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-form-item label="出库日期">
								<a-input
									disabled
									v-decorator="[`operationDate`, { rules: [{ required: true, message: `请输入入业务类型` }] }]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="出库方式">
									<a-input
										disabled
										v-decorator="[`outboundWayDesc`, { rules: [{ required: true, message: `请输入货主` }] }]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="end"
							>
								<a-form-item label="货权接收方">
									<a-input
										disabled
										v-decorator="[`customer`, { rules: [{ required: true, message: `请输入日期` }] }]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-form-item label="备注">
								<a-tooltip>
									<template slot="title">
										{{ detailInfo.remark }}
									</template>
									<span></span>
									<a-input
										disabled
										v-decorator="[`remark`]"
									/>
								</a-tooltip>
							</a-form-item>
						</a-col>
					</a-row>
					<div
						style="margin-bottom: 30px"
						class="particulars"
					>
						<span
							class="slTitleAssis"
							style="margin-top: 0"
							>出库明细</span
						>
						<a-button
							type="primary"
							@click="exportFile"
							class="upload-file"
							>导出</a-button
						>
					</div>
					<a-table
						:columns="columns"
						:data-source="detailInfo.goods"
						class="new-table"
						:scroll="{ x: 1500, y: 500 }"
						:pagination="false"
						rowKey="fileId"
					>
					</a-table>
					<p class="total-quantity">
						<span>共计出库数量：</span>
						<span style="font-weight: 600; color: rgba(0, 0, 0, 0.8)"> {{ totalInfo.quantity }}</span>
						<span> 共计出库重量：</span>
						<span style="font-weight: 600; color: rgba(0, 0, 0, 0.8)"> {{ totalInfo.weight }}吨</span>
					</p>
					<a-row>
						<a-col :span="24">
							<a-form-item
								label="备注"
								style="width: 100%"
							>
								<a-tooltip>
									<template slot="title">
										{{ detailInfo.rowRemark }}
									</template>
									<span></span>
									<a-input
										:maxLength="200"
										style="width: 100%"
										placeholder="请输入"
										disabled
										v-decorator="[`rowRemark`]"
									/>
								</a-tooltip>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</div>
			<div style="margin-top: 6px; margin-bottom: 30px">
				<span class="slTitleAssis">上传附件</span>
			</div>
			<uploadAttachment
				ref="uploadAttachment"
				:fileData="fileData"
				:fileType="['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip']"
				:optList="[
					{ value: 'OUTBOUND_CREDENTIALS', label: '出库凭证（已盖章）' },
					{ value: 'OTHER', label: '其他' }
				]"
				:disabled="true"
			>
			</uploadAttachment>
		</a-card>
	</div>
</template>

<script>
import { getPopupContainer } from '@/untils/factory.js';
import uploadAttachment from '../../components/uploadAttachment.vue';
import { getInoutDetail, exportExcel } from '../../api';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { getOutInStorageDetail } from '../../api';
import { mapMutations, mapGetters } from 'vuex';
import Breadcrumb from '@/v2/components/breadcrumb/index';
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		},
		width: 70
	},
	{ key: 'materialName.text', dataIndex: 'materialName.text', title: '品名', width: 204 },
	{ key: 'materialTexture.text', dataIndex: 'materialTexture.text', title: '材质', width: 116 },
	{ key: 'specs.text', dataIndex: 'specs.text', title: '规格', width: 116 },
	{ key: 'placeOfOrigin.text', dataIndex: 'placeOfOrigin.text', title: '厂家', width: 212 },
	{ key: 'quantity.text', dataIndex: 'quantity.text', title: '出库数量', width: 116 },
	{ key: 'weight.text', dataIndex: 'weight.text', title: '出库重量(吨)', width: 164 },
	{ key: 'baleNo.text', dataIndex: 'baleNo.text', title: '捆包号', width: 116, customRender: (text, row, index) => text || '-' },
	{ key: 'inventoryQuantity.text', dataIndex: 'inventoryQuantity.text', title: '理论库存数量', width: 132 },
	{ key: 'inventoryWeight', dataIndex: 'inventoryWeight.text', title: '理论库存重量(吨)', width: 132 },
	{ key: 'vehicleShipNo.text', dataIndex: 'vehicleShipNo.text', title: '车船号', width: 116 },
	{ key: 'remark.text', dataIndex: 'remark.text', title: '备注', fixed: 'right', width: 222 }
];

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			getPopupContainer,
			loading: false,
			columns,
			detailInfo: {
				goods: []
			},
			fileData: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		totalInfo() {
			const arr = this.detailInfo.goods.filter(el => el.weight).map(el => el.weight.text);
			const arr2 = this.detailInfo.goods.filter(el => el.quantity).map(el => el.quantity.text);
			let quantity = 0;
			let weight = 0;
			arr.forEach(el => {
				weight += +el || 0;
			});
			arr2.forEach(el => {
				if (this.isNumber(el)) {
					quantity += +el || 0;
				}
			});
			const flag = arr2.every(el => this.isNumber(el));
			return {
				quantity: flag ? quantity.toFixed(2) : '-',
				weight: weight.toFixed(4)
			};
		}
	},
	mounted() {
		this.getInoutDetail();
	},
	methods: {
		goBack(item) {
			this.$router.go(-1);
		},
		/** 获取详情 */
		async getInoutDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getInoutDetail(params);
			this.detailInfo = res.data;
			this.$nextTick(() => {
				this.form.setFieldsValue({ ...res.data });
				res.data.attachList.forEach(el => {
					el.typeName = el.typeDesc;
					el.fullPath = el.path;
				});
				this.fileData = res.data.attachList;
			});
		},
		async getOutInStorageDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getOutInStorageDetail(params);
			this.detailInfo = res.data;
		},
		isNumber(value) {
			if (value === undefined || value === null || value === '') {
				return false;
			}
			if (typeof value === 'string') {
				//正整数
				var reNumber = /^\d+$/;
				//负整数
				var reNeNumber = /^-\d+$/;
				//正实数
				var reRealNumber1 = /^[1-9]\d*[.]\d+$/; //非零开头
				var reRealNumber2 = /^0[.]\d+$/; //零开头
				//负实数
				var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/; //非零开头
				var reNeRealNumber2 = /^-0[.]\d+$/; //零开头

				if (
					reNumber.test(value) ||
					reNeNumber.test(value) ||
					reRealNumber1.test(value) ||
					reRealNumber2.test(value) ||
					reNeRealNumber1.test(value) ||
					reNeRealNumber2.test(value)
				) {
					return true;
				} else {
					return false;
				}
			} else if (typeof value === 'number') {
				return true;
			} else {
				return false;
			}
		},
		async exportFile() {
			const params = {
				goodsList: this.detailInfo.goods,
				workType: 'OUT'
			};
			const res = await exportExcel(params);
			const date = `${moment().format('YYYY-MM-DD')}日`.replace('-', '年').replace('-', '月');
			const name = `${date}出库明细表.xlsx`;
			comDownload(res, undefined, name);
		}
	},
	components: {
		uploadAttachment,
		Breadcrumb
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	margin-left: -30px;
	margin-right: -30px;
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
	.particulars {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.total-quantity {
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		line-height: 20px;
		margin-top: 12px;
		margin-bottom: 20px;
		font-size: 14px;
	}
	/deep/ .ant-table-column-title {
		font-weight: 600;
	}
	/deep/ .ant-table-hide-scrollbar {
		background: #f3f5f6;
	}
}
</style>
