<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<!-- <div class="breadcrumb">实提记录查询 <span style="margin:0 8px">/</span> <span style="font-weight:600">实提单详情</span></div> -->
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>实提单详情</span>
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
						<a-form-item label="仓库简称">
							<a-input
								disabled
								v-decorator="[`warehouseAbbr`, { rules: [{ required: true, message: `` }] }]"
							/>
						</a-form-item>
					</a-col>

					<!-- 再次提单 详情展示 -->
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="已实提总数量">
								<a-input
									disabled
									v-decorator="[`extractedQuantity`, { rules: [{ required: true, message: `` }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="已实提总重量(吨)">
								<a-input
									disabled
									v-decorator="[`extractedWeight`, { rules: [{ required: true, message: `` }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>

					<a-col :span="8">
						<a-form-item label="是否清库">
							<a-select
								:getPopupContainer="getPopupContainer"
								disabled
								v-decorator="[`cleanWarehouse`, { rules: [{ required: true, message: `请选择是否出库` }] }]"
							>
								<a-select-option
									v-for="(items, index) in cleanWarehouseList"
									:key="index"
									:value="items.value"
								>
									{{ items.label }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="出库单号">
								<a-tooltip>
									<template slot="title">
										{{ info.outboundNo }}
									</template>
									<span></span>
									<a-input
										placeholder="请输入出库单号"
										disabled
										v-decorator="[`outboundNo`, { rules: [{ required: true, message: `` }] }]"
									/>
								</a-tooltip>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<div
					style="margin-top: 6px; margin-bottom: 30px"
					class="particulars"
				>
					<span class="slTitleAssis">出库明细信息</span>
				</div>
				<a-table
					:columns="outColumns"
					:data-source="outList"
					class="new-table"
					:scroll="{ x: 1200, y: 500 }"
					:pagination="false"
					:rowKey="(text, record, index) => index"
				>
					<span
						slot="serialNo"
						slot-scope="text, record"
					>
						<a-tooltip>
							<template slot="title">
								{{ record.serialNo }}
							</template>
							<div class="outbound">{{ record.serialNo }}</div>
						</a-tooltip>
					</span>
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
									{{ info.remark }}
								</template>
								<span></span>
								<a-input
									:maxLength="200"
									style="width: 100%"
									placeholder="请输入"
									disabled
									v-decorator="[`remark`]"
								/>
							</a-tooltip>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="实提类型">
							<a-input
								disabled
								v-decorator="[`statusDesc`, { rules: [{ required: true, message: `请选择实提类型` }] }]"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<!-- <a-col :span="8">
            <div class="tip">
              <img src="../../../../assets/imgs/storage/steel/warning.png" alt="">
              <span>选择全部实提后，后期将无法再对该出库单进行实提数据的填写。</span>
            </div>
          </a-col> -->
				</a-row>
			</a-form>
			<!-- /** 上传附件 */ -->
			<div style="margin-top: 0px; margin-bottom: 30px">
				<span class="slTitleAssis">上传附件</span>
			</div>
			<uploadAttachment
				ref="uploadAttachment"
				:fileData="fileData"
				:columns="fileColumns"
				:fileType="['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip']"
				:optList="[
					{ value: 'OUTBOUND_BACK_TO_ORDER', label: '出库返单（已盖章)' },
					{ value: 'OTHER', label: '其他' }
				]"
				:disabled="true"
			>
			</uploadAttachment>
			<!-- /** 历史实提记录 */ -->
			<div
				style="margin-top: 30px; margin-bottom: 30px"
				v-if="isAgain"
			>
				<span class="slTitleAssis">历史实提记录</span>
			</div>
			<a-table
				v-if="isAgain"
				:columns="recordColumns"
				:data-source="recordList"
				class="new-table"
				:scroll="{ x: true }"
				:pagination="false"
				rowKey="id"
			>
			</a-table>
			<div class="btn-box"></div>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { getOutboundInventory, submitActualExtract, getActualExtractDetail } from '../../api';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import uploadAttachment from '../../components/uploadAttachment.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
const outColumns = [
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
	{ key: 'materialName', dataIndex: 'materialName', title: '品名', width: 204 },
	{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质', width: 116 },
	{ key: 'specs', dataIndex: 'specs', title: '规格', width: 116 },
	{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '厂家', width: 212 },
	{ key: 'quantity', dataIndex: 'quantity', title: '出库数量', width: 116 },

	{ key: 'weight', dataIndex: 'weight', title: '出库重量(吨)', width: 164 },
	{ key: 'baleNo', dataIndex: 'baleNo', title: '捆包号', width: 116 },
	{ key: 'vehicleShipNo', dataIndex: 'vehicleShipNo', title: '车船号', width: 116 },
	{ key: 'serialNo', dataIndex: 'serialNo', title: '出库单号', width: 200, scopedSlots: { customRender: 'serialNo' } },
	{ key: 'operateDate', dataIndex: 'operateDate', title: '出库日期', width: 164 },
	{ key: 'outboundWayDesc', dataIndex: 'outboundWayDesc', title: '出库方式', width: 164 },
	{ key: 'customer', dataIndex: 'customer', title: '货权接收方', width: 164, ellipsis: true }
];
const recordColumns = [
	{ key: 'operateTime', dataIndex: 'operateTime', title: '操作时间' },
	{ key: 'createdName', dataIndex: 'createdName', title: '操作人' },
	{ key: 'quantity', dataIndex: 'quantity', title: '实提总数量' },
	{ key: 'weight', dataIndex: 'weight', title: '实提总重量(吨)' }
];

export default {
	data() {
		return {
			storageList: [],
			form: this.$form.createForm(this),
			outColumns,
			// 运输方式
			outList: [],
			cleanWarehouseList: [
				{ value: 1, label: '是' },
				{ value: 0, label: '否' }
			],
			statusList: filterSteelsCodeByKey('actualExtractStatus'),
			// 历史记录
			recordList: [],
			recordColumns,
			info: {},
			fileData: [],
			disabled: false,
			fileColumns: [
				{
					title: '附件类型',
					dataIndex: 'typeName',
					scopedSlots: { customRender: 'typeName' }
				},
				{
					title: '上传时间',
					dataIndex: 'createdDate'
				},
				{
					title: '文件名称',
					dataIndex: 'name',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '操作',
					key: 'action',
					scopedSlots: { customRender: 'action' }
				}
			]
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		totalInfo() {
			const arr = this.outList.filter(el => el.quantity).map(el => el.quantity);
			const arr2 = this.outList.filter(el => el.weight).map(el => el.weight);
			let quantity = 0;
			let weight = 0;

			arr.forEach(el => {
				if (this.isNumber(el)) {
					quantity += +el || 0;
				}
			});
			arr2.forEach(el => {
				weight += +el || 0;
			});
			const flag = arr.every(el => this.isNumber(el));
			return {
				quantity: flag ? quantity.toFixed(2) : '-',
				weight: weight.toFixed(4)
			};
		},
		isAgain() {
			return !!this.$route.query.id;
		}
	},
	mounted() {
		/** 再次实提 */
		if (this.$route.query.id) {
			this.getActualExtractDetail();
		} else {
			this.getOutboundInventory();
		}
	},

	methods: {
		// 根据出库id集合获取实际库存和出库明细
		async getOutboundInventory() {
			const params = {
				idList: this.$route.query.idList
			};
			const res = await getOutboundInventory(params);
			this.info = res.data;
			this.outList = res.data.inoutGoodsResp || [];
			this.$nextTick(() => {
				this.form.setFieldsValue(res.data);
			});
		},
		async getActualExtractDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getActualExtractDetail(params);
			this.info = res.data;
			this.outList = res.data.goodsList;
			res.data.attachList.forEach(el => {
				el.typeName = el.typeDesc;
				el.fullPath = el.path;
			});
			this.fileData = res.data.attachList;
			this.recordList = res.data.recordList;
			this.$nextTick(() => {
				this.form.setFieldsValue(res.data);
			});
		},
		getPopupContainer,
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
		handleSubmit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					// 判断附件
					if (!this.fileData.length) {
						this.$message.error('请上传附件');
						return;
					}
					const params = {
						warehouseId: this.info.warehouseId,
						outboundIdList: this.$route.query.idList.split(','),
						...values,
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
						await submitActualExtract(params);
						this.disabled = false;
						this.$message.success('操作成功');
						this.goBack();
					} catch (error) {
						this.disabled = false;
					}
				}
			});
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
		// border-top: 1px solid #E5E6EB;
		margin-top: 14px;
	}
	/deep/ .ant-table-column-title {
		font-weight: 600;
		color: #77889d;
	}
}
.ant-card {
	padding-bottom: 0 !important;
}
.total-quantity {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	line-height: 20px;
	margin-top: 12px;
	margin-bottom: 20px;
	font-size: 14px;
}
.tip {
	background: #f3f7ff;
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	width: 458px;
	padding-left: 12px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	height: 32px;
	position: relative;
	top: 30px;
	img {
		margin-right: 12px;
		width: 16px;
		height: 16px;
	}
}
.new-table {
	/deep/ .ant-table-hide-scrollbar {
		background: #f3f5f6;
	}
	/deep/ tr td {
		padding-top: 8px !important;
		padding-bottom: 8px !important;
		line-height: 30px;
	}
	/deep/ .ant-table-fixed-right tr {
		height: 42px !important;
	}
}
/deep/ .ant-btn {
	padding: 0 10px;
}

/deep/ .ant-table-column-title {
	font-weight: 600;
}
.outbound {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 200px;
}
</style>
