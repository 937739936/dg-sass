<template>
	<div class="add-box">
		<Breadcrumb></Breadcrumb>
		<a-card
			class="link-contract"
			:bordered="false"
		>
			<div class="title">发票新增-发票信息确认</div>
			<div class="attachment">
				<div class="top">发票图片附件</div>
				<div
					class="tip-box"
					v-if="isShowTip"
				>
					<p>
						<i
							class="icon-danchuang-jinggaoicon iconfont"
							style="fontsize: 16px; color: #4682f3; vertical-align: revert"
						></i>
						发票号码：{{
							existList.map(el => el.myInvoiceDO.no).join()
						}}、对应发票信息已存在，保存时以上发票图片附件将自动关联发票信息
					</p>
					<i
						@click="isShowTip = false"
						class="icon-danchuang-closeicon iconfont icon"
					></i>
				</div>
				<div class="tab-box">
					<div
						v-for="(tab, i) in tabList"
						:key="tab.value"
					>
						<div
							class="tab-box-item"
							:class="{ active: tab.value == tabIndex }"
							@click="changeTab(tab)"
							v-if="tab.total"
						>
							<span>{{ tab.label }}</span>
							<span style="margin-left: 5px">{{ tab.total }}</span>
						</div>
					</div>
				</div>

				<div v-if="tabIndex == 1">
					<p
						class="failed"
						v-if="failList.length"
					>
						<!-- <img src="~/assets/imgs/newInvoice/fail.png" style="width:14px;height:14px;margin-right:5px" alt=""> -->
						<span>识别失败发票 {{ failList.length }}张</span>
					</p>
					<div class="df">
						<InvoiceImg
							:info="item"
							v-for="(item, i) in failList"
							tplKey="tplFailList"
							:handleIndex="i"
							type="failList"
							@del="delInvoice"
							@again="getNewInvoice"
							@replace="getNewInvoice"
							:key="i"
							style="margin-bottom: 32px"
						></InvoiceImg>
					</div>
					<p
						class="failed"
						style="margin-top: 0px; margin-bottom: 20px"
						v-if="checkList.length"
					>
						<!-- <img src="~/assets/imgs/newInvoice/fail.png" style="width:14px;height:14px;margin-right:5px" alt=""> -->
						<span>未通过校验发票 {{ checkList.length }}张</span>
					</p>
					<div class="df">
						<InvoiceImg
							:info="item"
							type="checkList"
							:handleIndex="i"
							tplKey="tplCheckList"
							v-for="(item, i) in checkList"
							@del="delInvoice"
							@again="getNewInvoice"
							@replace="getNewInvoice"
							:key="i"
							style="margin-bottom: 32px"
						>
						</InvoiceImg>
					</div>
				</div>
				<div v-if="tabIndex == 2">
					<!-- <p class="failed"  v-if="successList.length">
            <i class="icon-fapiaoshibiechenggong iconfont" style="font-size:12px;margin-right:5px"></i> 
            <img src="~/assets/imgs/newInvoice/success.png" style="width:14px;height:14px;margin-right:5px" alt="">
            <span>识别成功发票 {{successList.length}}</span>
          </p> -->
					<div class="df">
						<InvoiceImg
							v-for="(item, i) in successList"
							tplKey="tplSuccessList"
							:handleIndex="i"
							type="successList"
							:info="item"
							@del="delInvoice"
							:key="i"
							style="margin-bottom: 32px"
						></InvoiceImg>
					</div>
				</div>
			</div>
			<div
				class="icon-box"
				v-if="isShowSpread"
			>
				<div
					v-if="isSpread"
					@click="pickUp"
					class="icon-1"
				>
					收起全部
					<i
						style="fontsize: 12px"
						class="iconfont icon-gengduoshaixuan-xialajiantou1-copy"
					/>
				</div>
				<div
					v-else
					@click="pickDown"
					class="icon-2"
				>
					展开全部
					<i
						style="fontsize: 12px"
						class="iconfont icon-gengduoshaixuan-xialajiantou1"
					/>
				</div>
			</div>
			<div
				class="attachment"
				style="margin-top: 30px"
			>
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					发票信息
				</div>
				<TableInvoice :dataSource="taskDetail.invoiceList"></TableInvoice>
			</div>
			<div
				class="attachment"
				style="margin-top: 10px"
			>
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					销售货物或应税劳务、服务清单
				</div>
				<TableInvoice
					:dataSource="taskDetail.invoiceItemList"
					type="detail"
				></TableInvoice>
			</div>
			<!-- 保存 -->
			<div class="save-box">
				<div
					class="btn"
					@click="cancel"
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
			:dataSource="taskDetail.invoiceSplitList"
		></SaveModal>
	</div>
</template>

<script lang="jsx">
import { fillDecimal } from '@/v2/utils/factory.js';
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { getRelInvoiceList, saveAdd, saveCheckEdit } from '@/v2/center/steels/api/invoice.js';
import { getInvoiceTaskDetail, saveInvoiceTask } from '@/v2/center/invoiceDiscern/api';
import moment from 'moment';
import InvoiceImg from '../components/InvoiceImg.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import TableInvoice from '../components/TableInvoice.vue';
import SaveModal from '../components/saveModal.vue';

export default {
	components: {
		InvoiceImg,
		Breadcrumb,
		TableInvoice,
		SaveModal
	},
	data() {
		return {
			isShowTip: true,
			tabList: [
				{
					value: '1',
					label: '验证失败发票',
					total: 1
				},
				{
					value: '2',
					label: '验证成功发票',
					total: 2
				}
			],
			tabIndex: '1',
			failList: [],
			checkList: [],
			successList: [],
			isSpread: true,
			// 缓存识别失败列表
			tplFailList: [],
			// 缓存校验失败列表
			tplCheckList: [],
			// 缓存成功列表
			tplSuccessList: [],
			// 当前操作的项
			currentItem: {},
			currentIndex: '',
			// 已经存在的发票
			existList: [],
			dataSource: [],
			fillDecimal,
			loading: false,
			form: this.$form.createForm(this),
			dataSourceCopy: [],
			isOrderNo: false,
			selectedRowKeys: [],
			selectCheckType: 0,
			visibleBatch: false,
			loadingTableData: false,
			taskDetail: {}
		};
	},
	watch: {
		dataSource: {
			handler(value) {
				if (!value) {
					this.loadingTableData = true;
				} else {
					value.map((item, index) => {
						item.originalIndex = index;
					});
					this.loadingTableData = false;
				}
				const newList = cloneDeep(this.dataSource);
				this.dataSourceCopy = newList.filter(el => el.scanStatus == 0 && el.myInvoiceDO && !el.myInvoiceDO.id);

				this.dataSourceCopy.forEach(item => {
					if (item.myInvoiceDO) {
						item.key = item.myInvoiceDO.no + '&&' + item.orderNo || 'null';
					}
				});
				// 已经存在的发票
				this.existList = newList.filter(el => el.scanStatus == 0 && el.myInvoiceDO && el.myInvoiceDO.id);
				this.isShowTip = !!this.existList.length;
				// 扫描状态 0：成功 1：失败 2：识别中 3：验真失
				/** 获取识别失败 */
				this.failList = value.filter(el => el.scanStatus == 1);
				this.tplFailList = value.filter(el => el.scanStatus == 1);
				/** 获取未通过检验 */
				this.checkList = value.filter(el => el.scanStatus == 3);
				this.tplCheckList = value.filter(el => el.scanStatus == 3);
				/** 获取成功 */
				this.successList = value.filter(el => el.scanStatus == 0 && el.myInvoiceDO && !el.myInvoiceDO.id);
				this.tplSuccessList = value.filter(el => el.scanStatus == 0 && el.myInvoiceDO && !el.myInvoiceDO.id);
				// 获取总数
				this.tabList[0].total = value.filter(el => el.scanStatus !== 0).length;
				this.tabList[1].total = this.successList.length;
				if (!this.tabList[0].total && this.tabList[1].total) {
					this.tabIndex = 2;
				}
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		this.getRelInvoiceList();
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		// 是否展示收起
		isShowSpread() {
			const flag =
				(this.tabIndex == 1 && this.checkList.length + this.failList.length >= 5) ||
				(this.tabIndex == 2 && this.successList.length >= 5);
			return flag || !this.isSpread;
		}
	},
	methods: {
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
		},
		changeTab(item) {
			this.tabIndex = item.value;
		},
		// 收起全部
		pickUp() {
			this.isSpread = false;
			// 失败
			if (this.tabIndex == 1) {
				if (this.failList.length > 4) {
					this.checkList = [];
					this.failList = this.failList.splice(0, 4);
					return;
				}
				if (this.checkList.length > 4 && this.failList.length < 4 && this.failList.length) {
					this.checkList = [];
					return;
				}
				if (this.checkList.length > 4 && this.failList.length < 4 && !this.failList.length) {
					this.checkList = this.checkList.splice(0, 4);
					return;
				}
			} else {
				if (this.successList.length > 4) {
					this.successList = this.successList.splice(0, 4);
				}
			}
		},
		pickDown() {
			this.isSpread = true;
			if (this.tabIndex == 1) {
				this.checkList = [...this.tplCheckList];
				this.failList = [...this.tplFailList];
			} else {
				this.successList = [...this.tplSuccessList];
			}
		},
		// 跳转列表页面
		skip() {
			const str = {
				INPUT: 'buyInvoiceList',
				OUTPUT: 'sellInvoiceList',
				DELIVER: 'freightInvoiceList'
			};
			const strTrade = {
				INPUT: 'buy/list',
				OUTPUT: 'sell/list',
				DELIVER: 'freight/list'
			};
			// 判断是钢材新增还是发票新增
			const path =
				this.$route.query.industryType == 'STEEL'
					? `/center/steels/invoice/${str[this.$route.query.invoiceType]}`
					: `/center/invoice/${strTrade[this.$route.query.invoiceType]}`;
			this.$router.push(path);
		},
		async save() {
			if (!this.dataSourceCopy.length) {
				this.$message.error('没有成功发票');
				return;
			}

			const existList = this.existList.map(el => {
				return {
					id: el.myInvoiceDO.id,
					invoiceNo: el.myInvoiceDO.no,
					attachment: el.myInvoiceDO.attachment
				};
			});
			const params = {
				splitList: this.dataSourceCopy,
				existList: existList,
				taskId: this.$route.query.taskId
			};
			if (this.loading) return;
			try {
				this.loading = true;
				await saveInvoiceTask(params);
				this.$refs.saveModal.open();
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}

			// this.form.validateFieldsAndScroll(async(err) => {
			//   let isOrderNo = true
			//   if(!this.existList.length) {
			//     this.$message.warning('发票数据为空')
			//   }
			//   const existList =  this.existList.map(el => {
			//     return {
			//       id:el.myInvoiceDO.id,
			//       invoiceNo:el.myInvoiceDO.no,
			//       attachment:el.myInvoiceDO.attachment,
			//     }
			//   })
			//   if (!err) {
			//     const params = {
			//       splitList: this.dataSourceCopy,
			//       existList: existList,
			//       taskId: this.$route.query.taskId,
			//     }
			//     if(this.loading) return
			//     try {
			//       this.loading = true
			//       await saveInvoiceTask(params)
			//       this.$message.success('保存成功')
			//        this.loading = false
			//       this.$refs.saveModal.open()
			//     } catch (error) {
			//        this.loading = false
			//     }

			//   }
			// })
		},
		// 删除图片发票
		delInvoice(item, index, key, tplKey) {
			this.delInvoicePic(item, index, key, tplKey);
		},

		cancel() {
			this.$router.go(-1);
		},
		/*** 解决删除相互关联 */
		// 发票图片成功删除
		delInvoicePic(item, index, key, tplKey) {
			this.dataSource.forEach((el, i, arr) => {
				if (el.myInvoiceDO.attachment == item.myInvoiceDO.attachment) {
					arr.splice(i, 1);
				}
			});
			/** 删除对应的发票 和 明细 */
			this.taskDetail.invoiceList = this.taskDetail.invoiceList.filter(el => el.no != item.myInvoiceDO.no);

			this.taskDetail.invoiceItemList = this.taskDetail.invoiceList.filter(el => el.no != item.myInvoiceDO.no);

			this.$message.success('删除成功');
		},
		// 发票成功列表删除
		delInvoiceList() {
			const index = this.dataSourceCopy.findIndex(item => item.myInvoiceDO.no === this.currentItem.myInvoiceDO.no);
			// 关联合同
			if (this.currentItem.orderNo) {
				const index2 = this.dataSourceCopy.findIndex(item => item.orderNo === this.currentItem.orderNo);
				if (index > -1 && index2 > -1) {
					this.dataSourceCopy.splice(index, 1);
				}
			} else {
				if (index > -1) {
					this.dataSourceCopy.splice(index, 1);
				}
			}
			this.$refs.delModal.close();
		},
		// 获取识别之后的发票
		getNewInvoice(item, oldItem, handleType) {
			const invoiceSplitList = item.invoiceSplitList || [{ myInvoiceDO: {} }];
			const handleItem = invoiceSplitList[0];
			/** 判断当前发票是否重新识别成功 */
			if (handleItem.scanStatus === 0) {
				// 当前列表删除
				// 发票与订单关联信息
				// 删除原来旧的
				const obj = cloneDeep(handleItem);
				if (obj.myInvoiceDO) {
					obj.key = obj.myInvoiceDO.no + '&&' + item.orderNo || 'null';
				}
				const index = this.dataSource.findIndex(el => el.myInvoiceDO.attachment == oldItem.myInvoiceDO.attachment);
				this.dataSource.splice(index, 1, obj);

				/** 删除对应的发票 和 明细 */
				this.taskDetail.invoiceList = this.taskDetail.invoiceList.filter(el => el.no != oldItem.myInvoiceDO.no);

				this.taskDetail.invoiceItemList = this.taskDetail.invoiceList.filter(el => el.no != oldItem.myInvoiceDO.no);
				/** 添加对应的发票 和明细 */
				this.taskDetail.invoiceItemList = [...this.taskDetail.invoiceList, ...item.invoiceItemList];
				this.taskDetail.invoiceList = [...this.taskDetail.invoiceList, ...item.invoiceList];

				this.$message.success(`${obj.myInvoiceDO.no}识别成功`);
			} else {
				const index = this.dataSource.findIndex(el => el.myInvoiceDO.attachment == oldItem.myInvoiceDO.attachment);
				this.dataSource.splice(index, 1, handleItem);
				let tip1 = `${handleType == 'replace' ? '替换结果为' : '重试结果为'}${handleItem.scanReason || '识别失败'}`;
				let tip = handleItem.myInvoiceDO && handleItem.myInvoiceDO.no ? `${handleItem.myInvoiceDO.no}${tip1}` : tip1;
				this.$message.error(tip);
			}
			this.$forceUpdate();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.new-table {
	// td { white-space: nowrap; }
	/deep/ .ant-table-fixed {
		width: 200px;
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
	box-sizing: border-box;
}
.link-contract {
	//  min-height: calc(100vh - 135px);
	/deep/ .ant-card-body {
		// padding-top: 20px;
	}
	.title {
		padding-bottom: 15px;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
		border-bottom: 1px solid #e9effc;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family:
			PingFangSC-Medium,
			PingFang SC,
			PingFangSC-Regular,
			PingFang SC;
	}
	.attachment {
		margin-top: 30px;
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
				background: #4682f3;
			}
		}
		.tip-box {
			height: 44px;
			background: #f4f4f8;
			border-radius: 4px;
			border: 1px solid #e3e7f3;
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 14px;
			padding-right: 14px;
			margin-top: 10px;
		}
		.icon {
			color: rgba(0, 0, 0, 0.5);
			cursor: pointer;
		}
		.tab-box {
			height: 54px;
			line-height: 54px;
			display: flex;
			align-items: center;
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #8495aa;
			border-bottom: 1px solid #e9effc;
			margin-bottom: 20px;

			&-item {
				margin-right: 40px;
				cursor: pointer;
				position: relative;
				// border-bottom: 2px solid transparent;
				// background: #4682F3;
				&.active {
					// border-bottom: 2px solid #4682F3;
					color: #4682f3;
					font-weight: 600;
				}
				&.active::after {
					content: '';
					width: 100%;
					height: 2px;
					background: #4682f3;
					border-radius: 100px 100px 0px 0px;
					position: absolute;
					bottom: -1px;
					left: 0;
				}
			}
		}
		.failed {
			font-size: 12px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 600;
			color: #8495aa;
			margin-bottom: 27px;
			display: flex;
			align-items: center;
		}
	}
	.df {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		// justify-content: space-between;
		/deep/ .invoice-img {
			margin-right: 20px;
		}
	}
	.icon-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
		color: #4682f3;
		cursor: pointer;

		font-size: 12px;
		.icon-1,
		.icon-2 {
			width: 94px;
			height: 34px;
			border-radius: 4px;
			line-height: 34px;
			text-align: center;
			vertical-align: middle;
			font-size: 14px;
		}
		.icon-1:hover,
		.icon-2:hover {
			background: rgba(132, 149, 170, 0.1);
		}
	}
	.attachment2 {
		// display: flex;
		// justify-content: space-between;
		// align-items: center;
		// margin-bottom: 30px;
	}
	.invoice-num {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: #8495aa;
		margin-bottom: 16px;
	}
	.edit-icon {
		font-size: 12px;
		margin-left: 4px;
		color: #8495aa;
		cursor: pointer;
	}
	.save-box {
		display: flex;
		align-items: center;
		justify-content: center;
		position: sticky;
		width: 100%;
		background: #fff;
		bottom: 0px;
		height: 100px;
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
	.money-box {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: #8495aa;
		line-height: 20px;
		margin-top: 23px;
		text-align: right;
		.btn-link {
			color: #4682f3;
			font-size: 14px;
			float: left;
			cursor: pointer;
		}
		.money {
			font-size: 18px;
			font-family:
				D-DIN-PRO-Medium,
				D-DIN-PRO,
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 600;
			color: #f46332;
			line-height: 26px;
			margin-left: 30px;
		}
	}
	.table-box {
		.ipt-number {
			border: 1px solid rgba(132, 149, 170, 0.3);
			border-radius: 4px;
			background: #fff;
			display: flex;
			align-items: center;
			width: 126px;
		}
		.ipt-number:focus {
			border: 1px solid #4682f3;
		}
		/deep/ .ant-table-tbody > tr > td {
			padding: 6px 15px;
			height: 52px;
			box-sizing: border-box;
		}
		/deep/ .ant-input-number {
			border: 0;
			box-shadow: none;
			width: 100% !important;
		}
		/deep/ .ant-input-number:focus {
			border: 0;
			box-shadow: none;
		}
		/deep/ .ant-form-item-control {
			line-height: initial;
		}
		/deep/ .ant-form-item-children {
			display: flex;
			align-items: center;
		}
	}

	.btn-box {
		display: flex;
		justify-content: space-around;
	}
	/deep/ .ant-table-header {
		background: #f5f7fd;
	}
	/deep/ .ant-empty-normal {
		margin-top: 100px;
	}
}
.error-msg {
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.5);
}
.mt40 {
	margin-top: 40px !important;
}
</style>
