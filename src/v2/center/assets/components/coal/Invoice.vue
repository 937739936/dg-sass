<template>
	<div class="contentBox">
		<div
			class="content"
			v-if="invoiceInfo"
		>
			<template v-if="assetsConfig.INVOICE_UP_INFO">
				<p class="sub-title">
					<span style="display: inline-block; margin-right: 30px">上游发票信息</span
					><span style="font-size: 13px; color: red"
						>发票总数（张）：{{ icount }}<em style="display: inline-block; width: 25px"></em>价税合计（元）：{{ itotal
						}}<em style="display: inline-block; width: 25px"></em>归属价税合计（元）：{{ isplit }}</span
					>
				</p>
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="invoiceInfo.list"
					:scroll="{ x: true }"
					rowKey="index"
				>
					<span
						slot="totalAmount"
						slot-scope="totalAmount"
						>¥{{ totalAmount }}</span
					>
					<span
						slot="amount"
						slot-scope="amount"
						>¥{{ amount }}</span
					>
					<template
						slot="hasAttach"
						slot-scope="hasAttach"
					>
						<span
							class="green"
							v-if="hasAttach"
							>有</span
						>
						<span
							class="orange"
							v-if="!hasAttach"
							>无</span
						>
					</template>
					<template
						slot="fileName"
						slot-scope="fileName, items"
					>
						<a
							:href="items.attachment"
							target="_blank"
							>{{ fileName }}</a
						>
					</template>
					<div
						slot="action"
						slot-scope="action, items"
					>
						<a
							href="javascript:;"
							@click="getResult(items)"
							>查验结果</a
						>
					</div>
				</a-table>
				<div
					class="export-btn"
					v-if="icount > 0"
				>
					<a-button
						type="primary"
						@click="exportI"
						>导出</a-button
					>
				</div>
			</template>

			<div v-if="assetsConfig.INVOICE_UP_DETAIL">
				<p class="sub-title">附件信息</p>
				<!-- 编辑模块 -->
				<template v-if="editFlag">
					<Upload
						@uploadFiles="getUploadFiles"
						:receivalVO="receivalVO"
						type="UP_INVOICE_DETAIL"
						btnText="上游发票明细表"
						:allowFormat="['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'rar', 'zip']"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
					<!-- 附件展示 -->
					<a-table
						:pagination="false"
						:columns="editFilesColumns"
						:data-source="
							invoiceInfo.upInvoiceDetailList ? invoiceInfo.upInvoiceDetailList.filter(item => item.delFlag == 0) : []
						"
						:scroll="{ x: true }"
						rowKey="index"
					>
						<template
							slot="type"
							slot-scope="type"
						>
							{{ CONSTANTS.fileType[type] }}
						</template>
						<template
							slot="name"
							slot-scope="name, items"
						>
							<a
								:href="items.path"
								target="_blank"
								>{{ name }}</a
							>
						</template>
						<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） 删除按钮应隐藏-->
						<template
							slot="action"
							slot-scope="action, items, index"
						>
							<a-popconfirm
								v-if="!items.locked"
								title="确定删除该附件?"
								okText="确定"
								cancelText="取消"
								@confirm="() => deleteFiles(items, index)"
							>
								<a href="javascript:;">删除</a>
							</a-popconfirm>
						</template>
					</a-table>
				</template>
				<!-- 详情模块 -->
				<template v-if="!editFlag">
					<a-table
						:pagination="false"
						:columns="filesAttColumns"
						:data-source="
							invoiceInfo.upInvoiceDetailList ? invoiceInfo.upInvoiceDetailList.filter(item => item.delFlag == 0) : []
						"
						:scroll="{ x: true }"
						rowKey="index"
					>
						<template
							slot="type"
							slot-scope="type"
						>
							{{ CONSTANTS.fileType[type] }}
						</template>
						<template
							slot="name"
							slot-scope="name, items"
						>
							<a
								:href="items.path"
								target="_blank"
								>{{ name }}</a
							>
						</template>
					</a-table>
				</template>
			</div>

			<template v-if="assetsConfig.INVOICE_BUSINESSLINE_OTHER">
				<p class="sub-title">
					其他发票信息<a-button
						style="float: right; margin-top: 20px"
						v-if="editFlag"
						@click="addOther"
						type="primary"
						ghost
						size="small"
						>新增</a-button
					>
				</p>
				<AssetsCompanyRelationChainModal
					ref="AssetsCompanyRelationChainModal"
					@addFin="addFin"
					panelType="invo"
				/>
				<div
					style="padding-top: 25px"
					v-if="otherInvoList.length == 0"
				>
					<a-empty :image="emptyImage" />
				</div>
				<div
					v-for="(item, index) in otherInvoList"
					:key="item.contractId"
					style="margin-top: 20px"
				>
					<p>
						<span style="display: inline-block; margin-right: 30px">业务线发票-{{ index + 1 }}：</span
						><span style="font-size: 13px; color: red"
							>发票总数（张）：{{ item.icount }}<em style="display: inline-block; width: 25px"></em>价税合计（元）：{{
								item.itotal
							}}<em style="display: inline-block; width: 25px"></em>归属价税合计（元）：{{ item.isplit }}</span
						>
					</p>
					<div
						v-if="editFlag"
						style="text-align: right; margin-bottom: 10px"
					>
						<a-popconfirm
							v-if="editFlag"
							title="确定删除?"
							@confirm="() => deleteOther(item.contractId)"
						>
							<a v-if="editFlag">删除</a>
						</a-popconfirm>
					</div>
					<a-table
						:pagination="false"
						:columns="filesColumns"
						:data-source="item.list"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<span
							slot="totalAmount"
							slot-scope="totalAmount"
							>¥{{ totalAmount }}</span
						>
						<span
							slot="amount"
							slot-scope="amount"
							>¥{{ amount }}</span
						>
						<template
							slot="hasAttach"
							slot-scope="hasAttach"
						>
							<span
								class="green"
								v-if="hasAttach"
								>有</span
							>
							<span
								class="orange"
								v-if="!hasAttach"
								>无</span
							>
						</template>
						<template
							slot="fileName"
							slot-scope="fileName, items"
						>
							<a
								:href="items.attachment"
								target="_blank"
								>{{ fileName }}</a
							>
						</template>
						<div
							slot="action"
							slot-scope="action, items"
						>
							<a
								href="javascript:;"
								@click="getResult(items)"
								>查验结果</a
							>
						</div>
					</a-table>
					<!-- <div class="export-btn" v-if="icount > 0">
                        <a-button type="primary" @click="exportI">导出</a-button>
                    </div> -->
				</div>
			</template>
		</div>
		<a-modal
			:visible="visible"
			:footer="null"
			@cancel="
				() => {
					visible = false;
				}
			"
			width="80%"
		>
			<div
				class="modalContent"
				v-if="invoiceResult"
			>
				<p>{{ invoiceResult.administrativeDivisionName }}增值税专用发票</p>
				<div>
					<p>
						发票代码：<span>{{ invoiceResult.code }}</span>
					</p>
					<p>
						发票号码：<span>{{ invoiceResult.no }}</span>
					</p>
					<p>
						开票日期：<span>{{ invoiceResult.issuedDate }}</span>
					</p>
					<p>
						校验码：<span>{{ invoiceResult.checkCode }}</span>
					</p>
					<p>
						机器编号：<span>{{ invoiceResult.machineCode }}</span>
					</p>
				</div>
				<table
					cellspacing="0"
					cellpadding="0"
					class="modalTable"
					style="margin-bottom: 20px"
					:scroll="{ x: true }"
				>
					<tr>
						<td colspan="1">购买方</td>
						<td
							colspan="11"
							class="left"
						>
							<p><span>名称：</span>{{ invoiceResult.buyerName }}</p>
							<p><span>纳税人识别号：</span>{{ invoiceResult.buyerUscc }}</p>
							<p><span>地址、电话：</span>{{ invoiceResult.purchaserAddressPhone }}</p>
							<p><span>开户行及账号：</span>{{ invoiceResult.purchaserBank }}</p>
						</td>
						<td colspan="1">密码区</td>
						<td colspan="7"></td>
					</tr>
					<tr>
						<td colspan="5">
							<p>货物或应税劳务、服务名称</p>
						</td>
						<td colspan="2">
							<p>规格型号</p>
						</td>
						<td colspan="1">
							<p>单位</p>
						</td>
						<td colspan="2">
							<p>数量</p>
						</td>
						<td colspan="3">
							<p>单价</p>
						</td>
						<td colspan="3">
							<p>金额</p>
						</td>
						<td colspan="1">
							<p>税率</p>
						</td>
						<td colspan="3">
							<p>税额</p>
						</td>
					</tr>
					<tr v-for="(item, index) in invoiceResult.invoiceItemList">
						<td colspan="5">
							<p class="blue">{{ item.name }}</p>
						</td>
						<td colspan="2">
							<p class="blue">{{ item.spec }}</p>
						</td>
						<td colspan="1">
							<p class="blue">{{ item.unit }}</p>
						</td>
						<td colspan="2">
							<p class="blue">{{ item.quantity }}</p>
						</td>
						<td colspan="3">
							<p class="blue">{{ item.unitPrice }}</p>
						</td>
						<td colspan="3">
							<p class="blue">{{ item.amount }}</p>
						</td>
						<td colspan="1">
							<p class="blue">{{ item.taxRate * 100 }}%</p>
						</td>
						<td colspan="3">
							<p class="blue">{{ item.tax }}</p>
						</td>
					</tr>
					<tr>
						<td colspan="5">价税合计（大写）</td>
						<td
							colspan="6"
							style="border-right: 1px solid transparent"
						>
							<p
								class="blue"
								style="text-align: left; margin-left: 15px; margin-bottom: 0"
							>
								{{ invoiceResult.amountTaxCn }}
							</p>
						</td>
						<td colspan="9">
							（小写）<span
								class="blue"
								style="display: inline-block; margin-left: 20px"
								>¥{{ invoiceResult.amountTax }}</span
							>
						</td>
					</tr>
					<tr>
						<td colspan="1">销售方</td>
						<td
							colspan="9"
							class="left"
						>
							<p><span>名称：</span>{{ invoiceResult.sellerName }}</p>
							<p><span>纳税人识别号：</span>{{ invoiceResult.sellerUscc }}</p>
							<p><span>地址、电话：</span>{{ invoiceResult.salesAddressPhone }}</p>
							<p><span>开户行及账号：</span>{{ invoiceResult.salesBank }}</p>
						</td>
						<td colspan="1">备注</td>
						<td colspan="9">
							<p class="blue">{{ invoiceResult.remarks }}</p>
						</td>
					</tr>
				</table>
				<a
					href="https://etax.jiangxi.chinatax.gov.cn/fpcx/"
					style="display: block; text-align: center; text-decoration: underline"
					target="_blank"
					>本数据来源于中国国家税务局发票验证系统</a
				>
			</div>
		</a-modal>
	</div>
</template>
<script>
import { API_GetInvoiceResult, API_ExportInvoice } from '@/v2/center/assets/api/index.js';
import comDownload from '@sub/utils/comDownload.js';
import Upload from '../common/Upload.vue';
import { Empty } from 'ant-design-vue';
import _ from 'lodash';
import AssetsCompanyRelationChainModal from '../common/AssetsCompanyRelationChainModal';
export default {
	name: 'Invoice',
	props: ['invoiceInfo', 'editFlag', 'lineId', 'isAdvance', 'receivalVO'],
	components: {
		AssetsCompanyRelationChainModal,
		Upload
	},
	watch: {
		invoiceInfo: {
			immediate: true,
			handler(v, oldVal) {
				this.checkAssetsConfig(v);
				let list = v?.list;

				if (list && list[0]) {
					this.contractNo = list[0].contractNo;
					this.icount = list.length;
					this.itotal = list.reduce((pre, cur) => pre + Number(cur.totalAmount) || 0, 0).toFixed(2);
					this.isplit = list.reduce((pre, cur) => pre + Number(cur.splitAmount) || 0, 0).toFixed(2);
				}

				if (this.assetsConfig.INVOICE_BUSINESSLINE_OTHER) {
					this.otherInvoList = v.assetBusinessLineInvoiceVOList || [];
					this.otherInvoList = this.otherInvoList.map(item => {
						let invoiceList = item.invoiceList;
						let icount = invoiceList.length;
						let itotal = invoiceList.reduce((pre, cur) => pre + Number(cur.totalAmount) || 0, 0).toFixed(2);
						let isplit = invoiceList.reduce((pre, cur) => pre + Number(cur.splitAmount) || 0, 0).toFixed(2);
						return {
							list: invoiceList,
							// _id:this.get_id(),
							contractId: item.contractId,
							contractType: item.contractType,
							icount,
							isplit,
							itotal
						};
					});
				}
			}
		}
	},
	data() {
		return {
			filesColumns: [
				{ title: '发票代码', dataIndex: 'code', key: 'code' },
				{ title: '发票号码', dataIndex: 'no', key: 'no' },
				{ title: '开票日期', dataIndex: 'issuedDate', key: 'issuedDate' },
				{ title: '价税合计(元)', dataIndex: 'totalAmount', key: 'totalAmount', scopedSlots: { customRender: 'totalAmount' } },
				{ title: '贸易合同编号', dataIndex: 'contractNo', key: 'contractNo' },
				{ title: '归属价税合计(元)', dataIndex: 'splitAmount', key: 'splitAmount', scopedSlots: { customRender: 'splitAmount' } },
				{ title: '有无附件', dataIndex: 'hasAttach', key: 'hasAttach', scopedSlots: { customRender: 'hasAttach' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
			],
			filesAttColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],

			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			visible: false,
			invoiceResult: '',
			contractNo: '',
			icount: '0',
			itotal: '0',
			isplit: '0',
			otherInvoList: [],
			assetsConfig: {},
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
		};
	},
	methods: {
		get_id() {
			return Date.now() + '_' + Math.random();
		},
		// 资产包配置
		checkAssetsConfig(data) {
			let list = data.bankProductAssetConfigList || [{}];

			this.assetsConfig.INVOICE_UP_INFO = (_.find(list, { item: 'INVOICE_UP_INFO' }) || {}).status == 1;
			this.assetsConfig.INVOICE_BUSINESSLINE_OTHER = (_.find(list, { item: 'INVOICE_BUSINESSLINE_OTHER' }) || {}).status == 1;
			this.assetsConfig.INVOICE_UP_DETAIL = (_.find(list, { item: 'INVOICE_UP_DETAIL' }) || {}).status == 1;
			this.$forceUpdate();
		},
		checkAssetsSubmit(invo) {
			var fileList = invo.fileList;
			let list = this.invoiceInfo.bankProductAssetConfigList || [];
			var obj = {};

			if (this.assetsConfig.INVOICE_UP_DETAIL && (_.find(list, { item: 'INVOICE_UP_DETAIL' }) || {}).required == 1) {
				if (fileList.length == 0) {
					obj.errorStr = '发票模块-缺少:发票明细表';
				}
			}
			if (
				this.assetsConfig.INVOICE_BUSINESSLINE_OTHER &&
				(_.find(list, { item: 'INVOICE_BUSINESSLINE_OTHER' }) || {}).required == 1
			) {
				if (invo.otherInvoList.length == 0) {
					obj.errorStr = '发票模块-缺少:业务线发票';
				}
			}

			return obj;
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据

			data.forEach(item => {
				this.invoiceInfo.upInvoiceDetailList.push(item);
			});
		},
		deleteFiles(items, _index) {
			// 删除附件
			this.invoiceInfo.upInvoiceDetailList[_.findIndex(this.invoiceInfo.upInvoiceDetailList, { path: items.path })].delFlag = 1;
		},
		exportI() {
			API_ExportInvoice({
				receivableId: this.$route.query.id
			}).then(res => {
				comDownload(res, undefined, '基础合同及发票登记表+' + this.contractNo + '.xls');
			});
		},
		addOther() {
			this.$refs.AssetsCompanyRelationChainModal.init(this.lineId);
		},
		deleteOther(contractId) {
			let index = _.findIndex(this.otherInvoList, { contractId: contractId });
			this.otherInvoList.splice(index, 1);
		},

		addFin(data) {
			let index = _.findIndex(this.otherInvoList, { contractId: data.contractId });
			if (index > -1) {
				this.$message.error('当前发票已经添加过');
				return;
			}
			let curInvoList = data.curInvoList || [];
			let icount = curInvoList.length;
			let itotal = curInvoList.reduce((pre, cur) => pre + Number(cur.totalAmount) || 0, 0).toFixed(2);
			let isplit = curInvoList.reduce((pre, cur) => pre + Number(cur.splitAmount) || 0, 0).toFixed(2);
			this.otherInvoList = this.otherInvoList.concat({
				list: curInvoList,
				icount,
				itotal,
				isplit,
				contractId: data.contractId,
				contractType: data.contractType
				// _id:this.get_id(),
			});
		},
		getResult(items) {
			this.visible = true;

			API_GetInvoiceResult({ invoiceId: items.id, industryType: 'COAL' }).then(res => {
				if (res.success) {
					this.invoiceResult = res.data;
				}
			});
		},
		onSubmit() {
			let obj = {
				fileList: this.invoiceInfo.upInvoiceDetailList || [],
				otherInvoList: this.otherInvoList.map(item => {
					return {
						contractType: item.contractType,
						contractId: item.contractId,
						invoiceList: item.list.map(o => o.id)
					};
				})
			};

			var checkRes = this.checkAssetsSubmit(obj);
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return obj;
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;
	.sub-title {
		&:before {
			content: '';
			float: left;
			margin-right: 4px;
			margin-top: 3px;
			display: block;
			width: 4px;
			height: 14px;
			background: @primary-color;
		}
	}
	.content {
		padding: 0 15px;
		p {
			font-family: PingFangSC-Medium;
			color: #383a3f;
			text-align: left;
			line-height: 18px;
			margin-bottom: 15px;
		}
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.green {
		color: #00ae9d !important;
	}
	.orange {
		color: #ff9726 !important;
	}
}
.export-btn {
	text-align: right;
	margin-top: 11px;
}
.modalContent {
	color: #383a3f;
	& > p {
		text-align: center;
		font-size: 18px;
		color: @primary-color;
		margin-bottom: 15px;
	}
	& > div {
		display: flex;
		flex-decoration: row;
		justify-content: space-between;
		margin-bottom: 5px;
		span {
			color: @primary-color;
		}
	}
}
.modalTable {
	width: 100%;
	height: 100%;
	border: 1px solid #000000; /*设置边框粗细，实线，颜色*/
	text-align: center; /*文本居中*/
	border-collapse: collapse; /*边框重叠，否则你会看到双实线*/
	table-layout: fixed;
	th,
	td {
		height: 32px;
		border: 1px solid black;
		color: #000000;
		padding: 10px 6px;
	}
	.left {
		text-align: left;
		p {
			color: @primary-color;
			span {
				display: inline-block;
				width: 110px;
				color: #000000;
			}
		}
	}
	.blue {
		color: @primary-color;
		text-align: left;
	}
}
</style>
