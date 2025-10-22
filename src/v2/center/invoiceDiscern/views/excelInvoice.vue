<template>
	<div class="add-box">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			class="add-invoice"
		>
			<div class="invoice-title">发票新增-发票信息确认</div>

			<div class="task">
				<div class="top-box">
					<div class="top">发票信息</div>
					<div
						class="export-box"
						@click="exportFunc"
						style="color: #77889d; display: flex; align-items: center; cursor: pointer"
					>
						<img
							src="@/v2/assets/imgs/invoicetools/export-icon.png"
							alt=""
							style="width: 14px; margin-right: 5px"
						/>
						<span>导出失败发票</span>
					</div>
				</div>

				<a-table
					:columns="excelColumns"
					class="new-table"
					:bordered="false"
					:rowKey="record => record.index"
					:dataSource="dataSource"
					:pagination="false"
				>
					<div
						slot="scanReason"
						slot-scope="text, record"
					>
						<p
							class="check-success"
							v-if="record.scanStatus === 0"
						>
							<i
								style="color: #45b48c; fontsize: 12px"
								class="icon-yanzhengjieguo-chenggong iconfont"
							></i>
							{{ record.scanReason || '验证成功' }}
						</p>
						<p
							class="check-fail"
							v-else
						>
							<i
								style="color: #e04a4a; fontsize: 12px"
								class="icon-yanzhengjieguo-shibai iconfont"
							></i>
							{{ record.scanReason }}
						</p>
					</div>
					<div
						slot="action"
						slot-scope="text, record, index"
					>
						<div class="btn-box">
							<a
								href="javascript:;"
								class="btn"
								@click="edit(record, index)"
								>编辑</a
							>
							<a
								href="javascript:;"
								style="margin-left: 26px"
								class="btn"
								@click="del(record, index)"
								>删除</a
							>
						</div>
					</div>
				</a-table>
			</div>
			<div class="task">
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					销售货物或应税劳务、服务清单
				</div>
				<TableInvoice
					type="detail"
					:dataSource="taskDetail.invoiceItemList"
				></TableInvoice>
			</div>
			<!-- 保存 -->
			<div class="save-box">
				<div
					class="btn"
					@click="goBack"
					style="margin-right: 60px"
				>
					上一步
				</div>
				<div
					class="btn btn1"
					@click="save"
				>
					保存
				</div>
			</div>
		</a-card>
		<SaveModal
			ref="saveModal"
			:dataSource="dataSource"
		></SaveModal>
		<TipModal
			ref="tipModal"
			tip="确认要删该发票吗，删除后无法恢复"
			@save="saveDel"
		></TipModal>
		<a-modal
			v-model="editVisible"
			title="编辑发票信息"
			wrapClassName="edit-invoice-box2 "
			width="920px"
		>
			<div slot="closeIcon">
				<i
					class="icon-danchuang-closeicon iconfont"
					style="fontsize: 25px"
				></i>
			</div>
			<div>
				<p class="tip-box">
					<span
						class="tip1"
						v-if="currentItem.scanStatus === 0"
					>
						<i class="icon-fapiaoxiaoyan-chenggong iconfont"></i> 恭喜，验证成功！</span
					>
					<span
						class="tip2"
						v-else
					>
						<i class="icon-fapiaoshibie-shibai iconfont"></i> {{ currentItem.scanReason }}</span
					>
				</p>
			</div>
			<a-form
				:form="form"
				class="form"
				layout="inline"
			>
				<a-form-item label="发票代码">
					<a-input
						placeholder="请输入发票代码"
						v-decorator="[`code`]"
					/>
				</a-form-item>
				<a-form-item label="发票号码">
					<a-input
						placeholder="请输入发票号码"
						v-decorator="[`no`, { rules: [{ required: true, message: `请输入发票号码`, type: 'string' }] }]"
					/>
				</a-form-item>
				<a-form-item
					label="开票日期"
					style="margin: 0"
				>
					<a-date-picker
						placeholder="请选择开票日期"
						v-decorator="[
							'issuedDate',
							{
								validateTrigger: 'change',
								rules: [{ required: true, message: '请选择开票日期' }]
							}
						]"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
					/>
				</a-form-item>
				<a-form-item
					label="发票金额(元)不含税"
					style="margin-top: 20px"
				>
					<a-input-number
						placeholder="请输入发票金额不含税"
						:precision="2"
						v-decorator="[`taxExcludedAmount`, { rules: [{ required: true, message: `请输入发票金额不含税` }] }]"
					/>
				</a-form-item>
			</a-form>

			<template slot="footer">
				<a-button
					key="back"
					style="width: 88px"
					@click="editVisible = false"
				>
					取消
				</a-button>
				<a-button
					key="submit"
					style="margin-left: 20px; width: 88px"
					@click="saveEdit"
					type="primary"
				>
					确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import InvoiceInfo from '../components/InvoiceInfo.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import TableInvoice from '../components/TableInvoice.vue';
import SaveModal from '../components/saveModal.vue';
import TipModal from '../components/TipModal.vue';
import comDownload from '@sub/utils/comDownload.js';
import FourElements from '../components/FourElements.vue';
import { getInvoiceTaskDetail, saveInvoiceTask, saveExcelInvoice, exportErrorInvoice } from '@/v2/center/invoiceDiscern/api';
import moment from 'moment';
import ENV from '@/v2/config/env';
const excelColumns = [
	{
		title: '发票代码',
		dataIndex: 'myInvoiceDO.code'
	},
	{
		title: '发票号码',
		dataIndex: 'myInvoiceDO.no'
	},
	{
		title: '验证结果',
		dataIndex: 'scanReason',
		// fixed: 'right',
		scopedSlots: { customRender: 'scanReason' }
	},
	{
		title: '开票日期',
		dataIndex: 'myInvoiceDO.issuedDate'
	},
	{
		title: '发票金额(不含税)',
		dataIndex: 'myInvoiceDO.taxExcludedAmount'
	},

	{
		title: '操作',
		dataIndex: 'action',
		width: 150,
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	data() {
		return {
			excelColumns,
			form: this.$form.createForm(this),
			currentItem: {},
			currentIndex: 0,
			editVisible: false,
			dataSource: [],
			taskDetail: {}
		};
	},
	mounted() {
		this.getRelInvoiceList();
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		async save() {
			const splitList = this.dataSource.filter(el => el.myInvoiceDO.scanStatus == 0);
			if (!splitList.length) {
				return this.$message.error('没有识别成功的发票');
			}
			const params = {
				taskId: this.$route.query.taskId,
				splitList
			};
			await saveInvoiceTask(params);
			this.$refs.saveModal.open();
		},
		edit(item, index) {
			this.editVisible = true;
			this.currentItem = item;
			this.currentIndex = index;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					code: item.myInvoiceDO.code,
					no: item.myInvoiceDO.no,
					totalAmount: item.myInvoiceDO.totalAmount,
					taxExcludedAmount: item.myInvoiceDO.taxExcludedAmount,
					issuedDate: item.myInvoiceDO.issuedDate,
					splitAmount: item.splitAmount,
					contractNo: item.contractNo
				});
			});
		},
		saveEdit() {
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					const params = {
						id: this.currentItem.id,
						taskId: this.$route.query.taskId,
						type: this.$route.query.invoiceType,
						industryType: this.$route.query.industryType,
						index: this.currentIndex,
						buyerName: this.currentItem.buyerName || '',
						sellerName: this.currentItem.sellerName || '',
						...values
					};
					const res = await saveExcelInvoice(params);
					const obj = res.data;
					// obj.myInvoiceDO = obj.invoiceVO
					const flag = this.dataSource.some(el => el.myInvoiceDO.no == obj.myInvoiceDO.no);
					if (flag) {
						this.$message.warning('当前发票号码已经存在');
						return;
					}
					this.dataSource[this.currentIndex] = res.data;

					this.$forceUpdate();
					this.$message.success('保存成功');
					this.editVisible = false;
					/** 获取劳务清单 */
					const list = this.taskDetail.invoiceItemList.filter(el => el.no != this.currentItem.myInvoiceDO.no);
					this.taskDetail.invoiceItemList = [...list, ...res.data.list];
				}
			});
		},
		del(item, index) {
			this.currentIndex = index;
			this.currentItem = item;
			this.$refs.tipModal.open();
		},
		saveDel() {
			/** 删除对应的劳务清单 */
			this.taskDetail.invoiceItemList = this.taskDetail.invoiceItemList.filter(el => el.no != this.currentItem.myInvoiceDO.no);
			this.dataSource = this.dataSource.filter(el => el.myInvoiceDO.no != this.currentItem.myInvoiceDO.no);

			this.$refs.tipModal.close();
		},
		async exportFunc() {
			const params = {
				failList: this.dataSource.filter(el => el.myInvoiceDO.scanStatus != 0)
			};
			const res = await exportErrorInvoice(params);
			comDownload(res, undefined, `失败发票-${moment().format('YYYY-MM-DD')}.xls`);
		},
		// 获取发票列表
		async getRelInvoiceList() {
			const params = {
				taskId: this.$route.query.taskId
			};
			const res = await getInvoiceTaskDetail(params);
			const list = res.data.invoiceSplitList || [];
			this.taskDetail = res.data;
			list.forEach((el, index) => {
				el.originalIndex = index;
				if (this.$route.query.invoiceType === 'DELIVER') {
					el.splitAmount = el?.myInvoiceDO?.stampTaxFlagTotalAmount || el?.myInvoiceDO?.totalAmount || '0';
				} else {
					el.splitAmount = el?.myInvoiceDO?.totalAmount || '0';
				}
				if (el.myInvoiceDO && el.myInvoiceDO.scanTime) {
					el.myInvoiceDO.scanTime = moment(el.myInvoiceDO.scanTime).format('yyyy-MM-DD HH:mm:ss');
				}
			});

			this.dataSource = list;
		}
	},
	components: {
		Breadcrumb,
		TableInvoice,
		SaveModal,
		TipModal,
		FourElements
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less">
.edit-invoice-box2 {
	.ant-modal {
		width: 920px !important;
	}
	.ant-modal-header {
		border-bottom: 0;
		height: 58px;
		padding: 0;
		background: #f5f7fa;
		.ant-modal-title {
			font-weight: 600;
			font-size: 18px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 600;
			line-height: 58px;
			color: rgba(0, 0, 0, 0.8);
			padding-left: 20px;
		}
	}
	.tip-box {
		margin-top: 20px;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: #eb5353;
		.tip2 {
			vertical-align: middle;
		}
		.tip1 {
			color: #53c199;
			vertical-align: middle;
		}
	}
	.ant-modal-close-x {
		width: 24px;
		height: 24px;
		background: rgba(132, 149, 170, 0.1);
		line-height: 24px;
		margin-right: 32px;
		margin-top: 17px;
	}
	.ant-modal-close {
		top: 0px;
	}
	.ant-modal-body {
		padding: 0 20px;
	}
	.ant-modal-footer {
		padding-top: 28px;
		padding-bottom: 28px;
		border-top: 1px solid #eff0f3;
		// text-align: center;
	}
	.form {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: #8495aa;
		line-height: 20px;
		margin-top: 20px;
		margin-bottom: 30px;
		.ant-form-item-label {
			color: #8495aa;
			display: block;
			text-align: left;
			line-height: inherit;
			margin-bottom: 10px;
		}
		label {
			color: #8495aa;
			font-size: 14px;
		}
		.ant-input-number-input {
			height: 32px;
		}

		.ant-input,
		.ant-input-number {
			width: 280px;
			height: 32px;
			background: #fff;
			border-radius: 6px;
			// border: 1px solid #E5E6EB;
		}
		.ant-input-disabled,
		.ant-input-number-disabled {
			background: #f0f3fb;
		}
	}
}
</style>
<style scoped lang="less">
.add-box {
	padding-top: 25px;
	// min-height: calc(100vh - 130px);
	background: #fff;
	position: relative;
	height: 100%;
}

.add-invoice {
	// margin-top: 6px;
	min-height: calc(100vh - 135px);

	.invoice-title {
		padding-bottom: 15px;
		border-bottom: 1px solid #e9effc;
		display: flex;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
		align-items: center;
		justify-content: space-between;
	}

	.upload-box,
	.task {
		margin-top: 30px;

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
				background: #4682f3;
			}
		}
	}

	.btn-box-title {
		display: flex;
		align-items: center;
		margin-top: 20px;

		.btn {
			width: 106px;
			height: 38px;
			border-radius: 4px;
			border: 1px solid #4682f3;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #4682f3;
			font-size: 14px;
			margin-right: 20px;
			cursor: pointer;

			.icon {
				margin-right: 10px;
			}
		}

		.btn1 {
			background: #4682f3;
			color: #fff;
		}
	}

	.tip {
		font-size: 12px;
		font-weight: 400;
		color: #8495aa;
		line-height: 22px;
		margin-top: 20px;
	}

	.task {
		margin-top: 30px;
	}

	.btn-box {
		// min-width: 180px;
		width: 100%;
		display: flex;
		// justify-content: space-around;
		// align-items: left;
		position: relative;
	}

	.del-box {
		width: 22px;
		height: 22px;
		display: none;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		right: 10px;
		border-radius: 4px;
		transform: translateY(-50%);
		cursor: pointer;
	}

	.del-box:hover {
		background: rgba(132, 149, 170, 0.1);
	}

	.del-btn {
		// display:  none;
		font-size: 20px;
		color: #8495aa;

		line-height: inherit;
		line-height: 20px;
	}

	.btn-box:hover {
		.del-box {
			display: flex;
		}

		// .del-btn {
		//   display: inline-block;
		// }
	}
}
.save-box {
	display: flex;
	align-items: center;
	justify-content: center;
	position: sticky;
	width: 100%;
	background: #fff;
	bottom: 0px;
	// height: 100px;
	padding: 20px;
	left: 0;
	z-index: 999;
	.btn {
		width: 114px;
		height: 38px;
		border-radius: 4px;
		border: 1px solid #4682f3;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #4682f3;
		font-size: 14px;
		margin-right: 20px;
		cursor: pointer;
		.icon {
			margin-right: 10px;
		}
	}
	.btn1 {
		background: #4682f3;
		color: #fff;
	}
}
.top-box {
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
