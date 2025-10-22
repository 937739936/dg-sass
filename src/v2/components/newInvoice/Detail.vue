<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			class="invoice-detail"
			:bordered="false"
		>
			<div class="title">{{ invoiceTitle }}详情</div>
			<div class="link">
				<div
					class="top"
					style="margin-top: 20px"
				>
					发票与合同关联信息
					<a-button
						v-if="isEdit"
						type="primary"
						class="btn-link"
						@click="popContractList"
						>关联合同</a-button
					>
				</div>
			</div>
			<div class="table-box">
				<a-form :form="form">
					<!-- 未完结而且没有付款记录的可以删除-->
					<!-- hasPayedPayment 是否有付款记录-->
					<a-table
						:columns="columns"
						class="new-table"
						:rowKey="record => record.orderNo"
						:dataSource="detailData.contractList"
						:pagination="false"
						:scroll="{ x: true }"
					>
						<div slot="splitAmountTitle">
							拆分金额(元)
							<a-tooltip>
								<template slot="title"> 含税 </template>
								<i
									class="iconfont icon-liebiaobiaotou-shuoming"
									style="font-size: 12px"
								></i>
							</a-tooltip>
						</div>
						<template
							slot="splitAmount"
							slot-scope="text, record"
						>
							<p v-if="!record.isEdit">
								<span>￥{{ text && fillDecimal((+record.splitAmount).toLocaleString()) }} </span>
								<i
									v-if="isEdit"
									@click="changeSplitAmount(record)"
									class="iconfont edit-icon icon-liebiao-shuruicon"
								></i>
							</p>
							<a-form-item
								v-if="isEdit && record.isEdit"
								:label="false"
								:colon="false"
								:validate-status="getFieldStatus(record.orderNo).validateStatus"
								:help="getFieldStatus(record.orderNo).errorMsg"
							>
								<div class="ipt-number">
									<span style="margin-left: 12px">￥</span>
									<a-input-number
										:disabled="record.contractCompleted"
										:min="0"
										:precision="2"
										v-model.trim="record.splitAmount"
										:key="record.orderNo"
										placeholder="请输入"
										@blur="getSplitAmounts(record, record.splitAmount, record.orderNo)"
									>
									</a-input-number>
								</div>
							</a-form-item>
						</template>
						<template
							slot="action"
							slot-scope="text, record"
						>
							<a
								v-if="!record.contractCompleted && !record.hasPament && !record.hasPayedPayment"
								@click="del(record)"
								>删除</a
							>
						</template>
					</a-table>
				</a-form>
				<div class="tip">
					<span>价税合计总额</span>
					<span class="money"
						><span class="money-symbol">￥</span
						>{{ fillDecimal((+detailData.invoiceVO.totalAmount || 0.0).toLocaleString()) }}</span
					>
					<!-- <span style="margin-left:5px">已拆分金额</span> <span class="money">￥{{ fillDecimal(splitedAmount).toLocaleString() }}</span>  -->
					<span style="margin-left: 30px">剩余拆分金额</span>
					<span class="money"><span class="money-symbol">￥</span>{{ fillDecimal(notSplitAmount).toLocaleString() }}</span>
					<p v-if="detailData.invoiceVO.stampTaxFlag == 2 && type == 'DELIVER'">
						<span style="margin-left: 30px">含印花税合计总额</span>
						<span class="money"
							><span class="money-symbol">￥</span
							>{{ fillDecimal(detailData.invoiceVO.stampTaxFlagTotalAmount || 0.0).toLocaleString() }}</span
						>
					</p>
					<p v-if="detailData.invoiceVO.stampTaxFlag == 1 && type == 'DELIVER'">
						<span style="margin-left: 30px">含印花税合计总额</span>
						<span class="money"
							><span class="money-symbol">￥</span
							>{{ fillDecimal(detailData.invoiceVO.totalAmount || 0.0).toLocaleString() }}</span
						>
					</p>
				</div>
			</div>
			<div v-if="!isEdit">
				<!-- <div class="top" style="margin-top:50px">发票附件</div>
        <div class="affix" v-if="detailData.invoiceVO.attachment" @click="handlePreview">
          <img src="@/v2/assets/imgs/invoicetools/png-icon.png" alt="" style="width: 12px;margin-bottom: 2px">
          {{detailData.invoiceVO.attachmentName}}</div>

        <div style="text-align:center;margin-bottom:40px" v-else>
          <img style="width:83px" src="@/assets/imgs/newInvoice/no_file.png" alt="">
          <p class="c8" style="color:#8495AA;margin-top:10px">暂无数据</p>
        </div> -->
				<InvoiceAttachmentTable
					title="发票附件"
					:detailData="detailData"
				/>
			</div>

			<EditAttachment
				ref="pictureInvoice"
				v-else
				:detailData="detailData"
			></EditAttachment>

			<!-- <div class="top" style="margin-bottom: 20px">发票信息</div>
      <InvoiceInfo :info='detailData'></InvoiceInfo> -->
			<div class="link">
				<div
					class="top"
					style="margin-bottom: 20px; margin-top: 20px"
				>
					原发票信息
				</div>
			</div>
			<InvoiceDetailTable
				:invoiceVO="detailDataNotEmpty.invoiceVO"
				:invoiceItemVOList="detailDataNotEmpty.invoiceItemVOList"
			></InvoiceDetailTable>
			<div v-if="detailDataNotEmpty.redInvoiceVO && detailDataNotEmpty.redInvoiceVO.attachment">
				<div class="link">
					<div
						class="top"
						style="margin-bottom: 20px; margin-top: 20px"
					>
						负数发票信息
					</div>
				</div>
				<InvoiceDetailTable
					:invoiceVO="detailDataNotEmpty.redInvoiceVO"
					:invoiceItemVOList="detailDataNotEmpty.redInvoiceItemVOList"
				></InvoiceDetailTable>
			</div>
			<ContractList
				ref="contractList"
				@getContract="getContract"
			></ContractList>
			<img
				:src="previewImg"
				style="display: none"
				ref="viewer"
				v-viewer
			/>
			<div
				v-if="isEdit"
				class="save-box"
			>
				<div
					class="btn btn1"
					@click="save"
				>
					保存
				</div>
			</div>
			<DelModal
				ref="delModal"
				@confirm="confirmDel"
			></DelModal>
			<DelModal
				ref="delModal2"
				@confirm="confirmSave"
				><p>{{ errorTip }}</p></DelModal
			>
		</a-card>
	</div>
</template>

<script lang="jsx">
import { handleUploadChange, beforeUpload, fillDecimal } from '@/v2/utils/factory.js';
import ContractList from './ContractList.vue';
import ENV from '@/v2/config/env';
import { cloneDeep } from 'lodash';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import moment from 'moment';
import EditAttachment from './EditAttachment.vue';
import { detailColumns, editColumns } from './columns/columns.js';
import InvoiceInfo from './InvoiceInfo.vue';
import DelModal from './delModal.vue';
import { getInvoiceDetail, saveEdit, delInvoiceEdit } from '@/v2/center/steels/api/invoice.js';
import { invoiceTypeInfo } from './columns/constant.js';
import breadcrumb from '@/v2/components/breadcrumb/index';
import InvoiceAttachmentTable from './InvoiceAttachmentTable.vue';
import InvoiceDetailTable from './InvoiceDetailTable.vue';

export default {
	name: 'CreateInvoice',
	props: {
		type: {
			type: String,
			default: ''
		},
		module: {
			type: [String, Number],
			default: ''
		}
	},
	components: {
		ContractList,
		InvoiceInfo,
		EditAttachment,
		DelModal,
		breadcrumb,
		InvoiceAttachmentTable,
		InvoiceDetailTable
	},
	data() {
		return {
			fillDecimal,
			orderNoList: [],
			disabled: true,
			detailData: {
				invoiceVO: {}
			},
			originalDetailData: {},
			invoiceType: '',
			form: this.$form.createForm(this),
			curSplitAmount: 0,
			previewImg: '',
			splitedAmount: 0,
			notSplitAmount: 0,
			goodModelCountData: [],
			passFlag: true, //校验拆分金额是否通过
			disabled: false,
			loading: false,
			// 当前选择的项
			currentItem: {},
			errorTip: '',
			editParams: {}
		};
	},
	filters: {
		filterCodeByValueName
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		invoiceTitle() {
			return invoiceTypeInfo[this.invoiceType || this.$route.query.invoiceType];
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		disabledInvoiceInfo() {
			return ['detail', 'modify'].includes(this.$route.query.type);
		},
		columns() {
			return this.isEdit ? editColumns : detailColumns;
		},
		isEdit() {
			return this.$route.query.type == 'modify';
		},
		detailDataNotEmpty() {
			return this.detailData || {};
		}
	},
	watch: {
		detailData: {
			deep: true,
			handler() {
				let splitedAmount = 0;
				// 重新计算 拆分金额

				// 获取当前 有业务线号的
				// businessLineNo
				let obj = {};
				const hasNumberList = this.detailData.contractList.filter(el => el.businessLineNo);
				/** 获取有相同业务线号的取最大值 */
				// 获取所有相同的业务线号数组
				hasNumberList.forEach(el => {
					if (obj[el.businessLineNo]) {
						obj[el.businessLineNo].push(el);
					} else {
						obj[el.businessLineNo] = [el];
					}
				});
				let hasSplitedAmount = 0;
				let noNumberSplitedAmount = 0;
				/** 遍历 相同的数组 取出每个相同 数组的 拆分金额最大值 */
				for (let key in obj) {
					const newArr = obj[key].filter(el => el.splitAmount || el.splitAmount === 0).map(el => Number(el.splitAmount));
					hasSplitedAmount += (Math.max.apply(null, newArr) * 100) / 100;
				}

				const noNumberList = this.detailData.contractList.filter(el => !el.businessLineNo);
				noNumberSplitedAmount = noNumberList.reduce((pre, cur, index, arr) => {
					// js 解决计算精度问题
					return (pre * 100 + cur.splitAmount * 100) / 100;
				}, 0);

				splitedAmount = hasSplitedAmount + noNumberSplitedAmount;
				//  判断是否是运费发票
				if (this.$route.query.invoiceType != 'DELIVER') {
					splitedAmount = this.detailData.contractList.reduce((pre, cur, index, arr) => {
						// js 解决计算精度问题
						return (pre * 100 + cur.splitAmount * 100) / 100;
					}, 0);
				}
				this.splitedAmount = splitedAmount;

				if (this.detailData.invoiceVO.stampTaxFlag == 2 && this.detailData.invoiceVO.stampTaxFlagTotalAmount) {
					this.notSplitAmount = (this.detailData.invoiceVO.stampTaxFlagTotalAmount * 100 - this.splitedAmount * 100) / 100;
				} else {
					this.notSplitAmount = (this.detailData.invoiceVO.totalAmount * 100 - this.splitedAmount * 100) / 100;
				}
				if (this.notSplitAmount < 0 && this.$route.query.type == 'detail') {
					this.notSplitAmount = 0;
				}
			}
		}
	},
	created() {
		this.getDetail();
	},
	methods: {
		getFieldStatus(orderNo) {
			const data = this.goodModelCountData.filter(item => orderNo === item.orderNo)[0];
			if (data) {
				return data;
			} else {
				return {
					errorMsg: '',
					validateStatus: 'success'
				};
			}
		},
		changeSplitAmount(records) {
			// const key = records.orderNo ? 'splitAmount' + records.orderNo + records.myInvoiceDO.no : 'splitAmount' + records.myInvoiceDO.no
			records.isEdit = true;
			this.$forceUpdate();
			// const obj = {}
			// obj[key] = records.splitAmount
			// this.$nextTick(() => {
			//   this.form.getFieldsValue()
			//   this.form.setFieldsValue(obj)
			//   this.$forceUpdate()
			// })
		},
		validateSplitAmount(value, orderNo) {
			// 新增校验规则--修改后拆分金额必须≥保存前发票拆分金额
			if (!value) {
				this.passFlag = false;
				return {
					validateStatus: 'error',
					errorMsg: '发票拆分金额必填'
				};
			} else if (Number(value) < this.originalDetailData[orderNo]) {
				this.passFlag = false;
				return {
					validateStatus: 'error',
					errorMsg: '发票拆分金额不能小于修改前的拆分金额'
				};
			} else {
				this.passFlag = true;
				return {
					validateStatus: 'success',
					errorMsg: ''
				};
			}
		},
		getSplitAmounts(record, value, orderNo) {
			//拆分金额表格项失去焦点
			//上游合同  已付款未完结有这个校验规则

			if (!record.contractCompleted && record.hasPayedPayment) {
				const newData = [...this.detailData.contractList];
				const target = newData.filter(item => item.orderNo === orderNo)[0];
				if (target) {
					const { errorMsg, validateStatus } = this.validateSplitAmount(value, orderNo);
					let flag = true;
					this.goodModelCountData.forEach(val => {
						if (val.orderNo === orderNo) {
							flag = false;
							(val.errorMsg = errorMsg), (val.validateStatus = validateStatus);
						}
					});
					if (flag) {
						this.goodModelCountData.push({
							orderNo,
							errorMsg,
							validateStatus
						});
					}
					target.splitedAmount = value;
					record.isEdit = false;
					this.$forceUpdate();
					this.detailData.contractList = newData;
				}
			} else {
				record.isEdit = false;
				this.$forceUpdate();
				return {
					validateStatus: 'success',
					errorMsg: ''
				};
			}
		},
		openPdf(url) {
			window.open(url, '_blank');
		},
		getContract(selectedOrderNoList, selectedOrderNoData) {
			// 先剔除数据中本次取消的合同
			const tempInvoiceContractVOList = cloneDeep(this.detailData.contractList);
			this.detailData.contractList.forEach((item, index) => {
				if (!selectedOrderNoList.includes(item.orderNo) && item.orderNo) {
					tempInvoiceContractVOList.splice(index, 1);
				}
			});
			this.detailData.contractList = tempInvoiceContractVOList;

			const tempArr = [];
			const selectedOrderNoListCopy = [...selectedOrderNoList];
			// 剔除之前绑定的合同，只处理新增的
			selectedOrderNoList.forEach(item => {
				if (this.orderNoList.includes(item)) {
					selectedOrderNoListCopy.splice(
						selectedOrderNoListCopy.findIndex(i => item === i),
						1
					);
				}
			});
			selectedOrderNoList = selectedOrderNoListCopy;

			selectedOrderNoList.forEach(item => {
				let quantity = '';
				let orderNoData = '';
				selectedOrderNoData.forEach(i => {
					if (i.orderNo === item) {
						quantity = i.quantity;
						orderNoData = i;
					}
				});
				tempArr.push({
					...cloneDeep(this.curInvoice),
					contractCompleted: !item.contractCompleted ? false : item.contractCompleted,
					orderNo: item,
					quantity,
					newFlag: true,
					contractId: orderNoData.contractId,
					contractNo: orderNoData.contractNo,
					contractType: orderNoData.contractType,
					sellerName: orderNoData.sellerName,
					buyerName: orderNoData.buyerName
				});
			});
			this.detailData.contractList.splice(0, 0, ...tempArr);
		},

		save() {
			if (!this.detailData.contractList || this.detailData.contractList.length <= 0) {
				this.$message.error('发票至少关联一个合同');
				return;
			}
			let item = this.detailData.contractList.find(el => !el.splitAmount);
			if (item) {
				this.$message.error(`发票拆分金额必须大于0,合同编号:${item.contractNo},请核实`);
				return;
			}
			const splitAmountList = this.detailData.contractList.map(el => el.splitAmount);
			// 总拆分金额
			const totalSplitAmount = splitAmountList.reduce((sum, current) => {
				return (sum += Number(current));
			}, 0);
			// 是否有印花税税额
			if (this.detailData.stampTaxFlag == 2 && this.type == 'DELIVER') {
				// 印花税税额
				if (totalSplitAmount > this.detailData.stampTaxFlagTotalAmount) {
					this.$message.error(`发票号码${this.detailData.no}，拆分金额不能大于含印花税合计,请核实`);
					return;
				}
			}
			if (!this.passFlag) return; // 校验可拆分金额是否通过
			this.form.validateFieldsAndScroll(err => {
				if (!err) {
					this.toSave();
				}
			});
		},

		async toSave() {
			const params = {
				id: this.$route.query.id,
				industryType: this.$route.query.industryType,
				invoiceType: this.$route.query.invoiceType,
				type: this.$route.query.invoiceType
			};
			if (this.detailData.invoiceVO.attachment) {
				params.attachments = [{ attachment: this.detailData.attachment }];
			}
			const list = this.detailData.contractList.map(item => {
				return {
					orderNo: item.orderNo,
					contractNo: item.contractNo,
					splitAmount: item.splitAmount,
					businessLineNo: item.businessLineNo || '',
					contractType: item.contractType,
					newFlag: item.newFlag || false
				};
			});
			params.list = list;
			let invoiceIdList = [];
			if (this.$refs.pictureInvoice) {
				let attachments = [];
				if (this.$refs.pictureInvoice.successList[0]?.myInvoiceDO) {
					attachments = this.$refs.pictureInvoice.successList.map(item => item.myInvoiceDO);
				} else {
					attachments = this.$refs.pictureInvoice.successList;
				}
				params.attachments = attachments;
				if (!params.attachments.length && this.isEdit) {
					this.$message.error('请上传正确发票附件');
					return;
				}
				invoiceIdList = params.attachments.map(el => el.no || el.invoiceNo);
			}

			this.editParams = params;
			if (this.isEdit && !invoiceIdList.includes(this.$route.query.no) && !this.detailData.invoiceVO.attachment) {
				this.errorTip = `本次上传附件中无本发票【发票号码：${this.detailData.invoiceVO.no}】匹配的图片附件`;
				this.$refs.delModal2.open();
			} else {
				if (this.disabled) {
					return;
				}
				this.disabled = true;
				try {
					this.confirmSave();
				} catch (error) {
				} finally {
					this.disabled = false;
				}
			}
		},
		// 确认保存
		async confirmSave() {
			await saveEdit(this.editParams);
			this.$refs.delModal2.close();
			this.$message.success('保存成功');
			this.$router.go(-1);
		},
		// 获取详情
		async getDetail() {
			const res = await getInvoiceDetail({ invoiceId: this.$route.query.id });
			this.detailData = res.data;
			if (this.detailData.contractList.length) {
				this.detailData.contractList.forEach(item => {
					this.originalDetailData[item.orderNo] = item.splitAmount;
				});
			}
			this.$nextTick(() => {
				if (this.detailData.invoiceVO.attachment) {
					// 处理附件名称
					const arr = this.detailData.invoiceVO.attachment.split('/');
					let name = arr[arr.length - 1];
					this.detailData.invoiceVO.attachmentName = name;
					const obj = {
						status: 'success',
						result: 'PASS',
						scanReason: '识别成功',
						url: this.detailData.invoiceVO.attachment,
						attachment: this.detailData.invoiceVO.attachment,
						scanStatus: 0,
						invoiceUrl: this.detailData.invoiceVO.attachment
					};
					if (this.$refs.pictureInvoice) {
						this.$refs.pictureInvoice.invoiceImgList = [obj];
					}
					this.$forceUpdate();
				}
			});
		},
		// 关联合同
		popContractList() {
			const data = this.detailData.contractList[0];
			this.curInvoice = {
				...data,
				splitAmount: '',
				hasPament: false
			};
			this.orderNoList = [];
			const hasPamentOrderNoList = [];
			this.detailData.contractList.forEach(item => {
				this.orderNoList.push(item.orderNo);
				if (item.hasPament) {
					hasPamentOrderNoList.push(item.orderNo);
				}
			});
			this.$refs.contractList.showModal(this.orderNoList, hasPamentOrderNoList, this.detailData.id);
		},

		del(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		async confirmDel() {
			// 判断是否是运费发票
			if (this.$route.query.invoiceType == 'DELIVER' && !this.currentItem.newFlag) {
				const params = {
					contractId: this.currentItem.contractId,
					invoiceId: this.$route.query.id
				};
				await delInvoiceEdit(params);
			}
			const index = this.detailData.contractList.findIndex(item => item.orderNo === this.currentItem.orderNo);
			if (index > -1) {
				this.detailData.contractList.splice(index, 1);
			}
			this.$refs.delModal.close();
		},

		handlePreview() {
			this.previewImg = ENV.BASE_NET + this.detailData.invoiceVO.attachment;
			this.$refs.viewer.$viewer.show();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>

<style lang="less" scoped>
.invoice-detail {
	.title {
		padding-bottom: 15px;
		border-bottom: 1px solid #e9effc;
		display: flex;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		align-items: center;
		justify-content: space-between;
	}
	.link {
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		color: rgba(0, 0, 0, 0.8);
	}
	.top {
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
	.affix {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: @primary-color;
		margin-bottom: 50px;
		cursor: pointer;
	}
	.edit-icon {
		font-size: 12px;
		margin-left: 4px;
		color: #8495aa;
		cursor: pointer;
	}
	.tip {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: #8495aa;
		margin-top: 23px;
		text-align: right;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		line-height: 20px;
		.money {
			margin-left: 16px;
			line-height: 20px;
			font-size: 18px;
			font-family:
				D-DIN-PRO-Medium,
				D-DIN-PRO,
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 500;
			color: #f46332;
			margin-left: 10px;
			.money-symbol {
				font-size: 12px;
			}
		}
	}
	.btn-link {
		width: 108px;
		height: 32px;
		border-radius: 4px;
		cursor: pointer;
		float: right;
	}
	.table-box {
		.ipt-number {
			border: 1px solid rgba(132, 149, 170, 0.3);
			border-radius: 4px;
			background: #fff;
			display: flex;
			align-items: center;
			width: 120px;
		}
		.ipt-number:focus {
			border: 1px solid @primary-color;
		}
		/deep/ .ant-table-tbody > tr > td {
			padding: 6px 15px;
			height: 52px;
			box-sizing: border-box;
		}
		/deep/ .ant-input-number {
			border: 0;
			box-shadow: none;
			width: 100%;
		}
		/deep/ .ant-input-number:focus {
			border: 0;
			box-shadow: none;
		}
		/deep/ .ant-form-item-children {
			line-height: initial;
		}
	}
}
.save-box {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 76px;
	.btn {
		width: 126px;
		height: 44px;
		border-radius: 4px;
		border: 1px solid @primary-color;
		display: flex;
		justify-content: center;
		align-items: center;
		color: @primary-color;
		font-size: 14px;
		margin-right: 20px;
		cursor: pointer;
		.icon {
			margin-right: 10px;
		}
	}
	.btn1 {
		background: @primary-color;
		color: #fff;
	}
}
</style>
