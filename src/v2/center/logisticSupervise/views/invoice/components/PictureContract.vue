<template>
	<a-card
		class="link-contract"
		:bordered="false"
	>
		<div class="title">
			{{ invoiceTitle }}
		</div>
		<div class="attachment">
			<div class="top">发票图片附件</div>
			<div
				class="tip-box"
				v-if="isShowTip"
			>
				<p>
					<i
						class="icon-danchuang-jinggaoicon iconfont"
						style="fontsize: 16px; color: var(--primary-color); vertical-align: revert"
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
					<img
						src="~/assets/imgs/newInvoice/fail.png"
						style="width: 14px; height: 14px; margin-right: 5px"
						alt=""
					/>
					<span>识别失败发票 {{ failList.length }}</span>
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
					<img
						src="~/assets/imgs/newInvoice/fail.png"
						style="width: 14px; height: 14px; margin-right: 5px"
						alt=""
					/>
					<span>未通过校验发票 {{ checkList.length }}</span>
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
				<p
					class="failed"
					v-if="successList.length"
				>
					<!-- <i class="icon-fapiaoshibiechenggong iconfont" style="font-size:12px;margin-right:5px"></i>  -->
					<img
						src="~/assets/imgs/newInvoice/success.png"
						style="width: 14px; height: 14px; margin-right: 5px"
						alt=""
					/>
					<span>识别成功发票 {{ successList.length }}</span>
				</p>
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
			class="attachment attachment2"
			style="margin-top: 70px"
			:class="[isShowSpread ? '' : 'mt40']"
		>
			<div class="top">发票与合同关联信息</div>
		</div>
		<p class="invoice-num">
			<span
				><span>发票数量</span> <span style="color: #000; margin-left: 5px">{{ total }}张</span></span
			>
		</p>
		<div class="table-box">
			<a-form :form="form">
				<a-table
					:columns="columns"
					:dataSource="dataSourceCopy"
					class="new-table"
					:pagination="false"
					:scroll="{ x: 1600, y: 520 }"
					:loading="loadingTableData"
					:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
					:rowKey="record => record.key"
				>
					<span slot="splitAmount">
						<a-tooltip>
							<template slot="title"> 含税 </template>
							拆分金额<i
								class="iconfont icon-liebiaobiaotou-shuoming"
								style="font-size: 12px"
							></i>
						</a-tooltip>
					</span>
					<div
						slot="splitAmount2"
						slot-scope="text, records"
					>
						<p v-if="!records.isEdit">
							<span>￥{{ (records.splitAmount || 0).toLocaleString() }} </span>
							<i
								@click="changeSplitAmount(records)"
								class="iconfont edit-icon icon-liebiao-shuruicon"
							></i>
						</p>
						<a-form-item
							label=""
							v-else
						>
							<div class="ipt-number">
								<span style="margin-left: 12px">￥</span>
								<a-input-number
									:min="0"
									:precision="2"
									@blur="checkSplitAmount($event, records)"
									@focus="handleFocusSplitAmount(records)"
									@change="handleChangeSplitAmount($event, records)"
									placeholder="请输入"
									v-decorator="[
										setDecoratorName(records, 'splitAmount'),
										{
											initialValue: records.splitAmount,
											rules: [{ required: true, message: '发票拆分金额必填' }]
										}
									]"
								/>
							</div>
						</a-form-item>
					</div>
					<template
						slot="action"
						slot-scope="action, record, index"
					>
						<a-space :size="24">
							<a
								href="javascript:;"
								@click="showBatchRelation(0, record)"
							>
								关联合同
							</a>
							<a
								v-if="record.orderNo && !record.invoice"
								@click="deleContract(record, index)"
								>删除关联</a
							>
							<a
								@click="delOrder(record, index)"
								href="javascript:;"
								>删除</a
							>
						</a-space>
					</template>
				</a-table>
			</a-form>
			<div class="money-box">
				<span
					class="btn-link"
					@click="showBatchRelation(1, {})"
					>批量关联合同</span
				>
				<span
					><span>价税合计总额</span> <span class="money">￥{{ fillDecimal(sum).toLocaleString() }}</span></span
				>
				<span
					v-if="$route.query.invoiceType == 'DELIVER'"
					style="margin-left: 10px"
					><span>含印花税合计总额</span> <span class="money">￥{{ fillDecimal(sum + sumyhs).toLocaleString() }}</span></span
				>
			</div>
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
		<ContractList
			ref="contractList"
			@getContract="getContract"
			:selectCheckType="selectCheckType"
		></ContractList>
		<DelModal
			ref="delModal"
			@confirm="confirmDel"
		></DelModal>
		<DelModal
			ref="delModal2"
			@confirm="previous"
			><p style="padding-left: 10px; margin-bottom: 50px">系统可能不会保存您所做的更改，确定要离开吗？</p></DelModal
		>
		<DelModal
			ref="delModal3"
			@confirm="confirmDeleContract"
			><p>确认删除此条关联吗？</p></DelModal
		>
		<ErrorModal
			ref="errorModal2"
			tip="提示"
			@confirm="closeError"
		>
			<div class="error-msg">
				<p
					v-for="(item, index) in errorInfoList"
					:key="index"
				>
					<span
						v-for="(item2, index2) in item.codeList"
						:key="index2"
					>
						{{ item2 }}
						<span v-if="!(index2 == item.codeList.length - 1)">,</span>
					</span>
					<span>{{ item.message }}</span>
				</p>
			</div>
		</ErrorModal>
		<ErrorModal
			ref="errorModal3"
			tip="确定提交关联信息"
			@confirm="confirmModal3"
			><div class="error-msg">{{ errorTip }}</div></ErrorModal
		>
	</a-card>
</template>

<script lang="jsx">
import { fillDecimal } from '@/v2/utils/factory.js';
import ContractList from './ContractList.vue';
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { pictureBuyColumns, pictureSellColumns, pictureFreightColumns } from './columns/columns.js';
import { getRelInvoiceList, saveAdd, saveCheckEdit, getContractList } from '@/v2/center/steels/api/invoice.js';
import { invoiceTypeInfo } from './columns/constant.js';
import moment from 'moment';
import InvoiceImg from './InvoiceImg.vue';
import DelModal from './delModal.vue';
import ErrorModal from './errorModal.vue';

import SlInput from '@sub/components/ui-new/Form/sl-input.vue';

export default {
	props: {
		invoiceImgList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	components: {
		ContractList,
		DelModal,
		InvoiceImg,
		SlInput,
		ErrorModal
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
			errorTip: '',
			fillDecimal,
			loading: false,
			total: 0,
			form: this.$form.createForm(this),
			dataSourceCopy: [],
			orderNoList: [],
			isOrderNo: false,
			curChangeInvoiceTypeData: '',
			curChangeInvoiceSplitAmountData: '',
			sum: 0,
			sumyhs: 0,
			errorInfoList: [],
			selectedRowKeys: [],
			selectCheckType: 0,
			visibleBatch: false,
			formBatch: this.$form.createForm(this, { name: 'formBatch' }),
			selectItemBatch: [],
			loadingTableData: false,
			linkOrderNo: this.$route.query.orderNo, // 关联合同编号
			linkOrderInfo: null //关联合同信息
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
					item.contractNo = item.contractNo || '';
					item.isEdit = true;
					// 是否默认关联合同
					if (this.linkOrderInfo) {
						item.contractNo = this.linkOrderInfo.contractNo;
						item.orderNo = this.linkOrderInfo.orderNo;
						item.contractId = this.linkOrderInfo.contractId;
						item.contractType = this.linkOrderInfo.contractType;
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
		},
		dataSourceCopy: {
			deep: true,
			handler(value, old) {
				this.calcInvoiceData();
				if (value?.length != old?.length) {
					this.updateSelectRowKeys();
				}
			}
		}
	},
	created() {
		this.getRelInvoiceList();
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		columns() {
			if (this.$route.query.invoiceType == 'DELIVER') {
				return pictureFreightColumns;
			}
			return pictureBuyColumns;
		},
		invoiceTitle() {
			return invoiceTypeInfo[this.$route.query.invoiceType];
		},
		// 是否展示收起
		isShowSpread() {
			const flag =
				(this.tabIndex == 1 && this.checkList.length + this.failList.length >= 5) ||
				(this.tabIndex == 2 && this.successList.length >= 5);
			return flag || !this.isSpread;
		}
	},
	methods: {
		// 返回上一步
		previous() {
			let type = this.$route.query.type;
			if (type) {
				this.$router.replace({
					path: `/center/logisticSupervise/invoice/${type}/add`,
					query: {
						type
					}
				});
			} else {
				this.goback();
			}
		},
		// 返回上一页
		// 判断是否有上一页，有返回上一页，没有返回列表页
		goback() {
			//判断是否存在上个页面
			if (window.history.length <= 1) {
				// 不存在返回列表页
				let type = this.$route.query.type;
				this.$router.push({
					path: `/center/logisticSupervise/invoice/${type}`
				});
			} else {
				this.$router.back();
			}
		},
		// 获取发票列表
		async getRelInvoiceList() {
			const params = {
				taskId: this.$route.query.taskId
			};
			const res = await getRelInvoiceList(params);
			// 判断是否有默认关联合同
			if (this.linkOrderNo) {
				// 查询相关参数信息
				const params = {
						orderNo: this.linkOrderNo,
						type: this.$route.query.invoiceType,
						industryType: this.$route.query.industryType
				}
				if(params.type == 'INPUT') {
          params.productCode = 'WAREHOUSE_RENT'
        }
        if(params.type == 'DELIVER') {
          params.productCode = 'LOGIC_DELIVER'
        }
				let orderInfo = await getContractList(params);
				// 如果有一条数据进行匹配(这个地方数据返回可能有多条，取第一条就行)
				if (orderInfo.success && orderInfo.data?.records?.length > 0) {
					orderInfo = orderInfo.data?.records[0];
					this.linkOrderInfo = orderInfo;
				}
			}
			const list = res.data || [];
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
		updateSelectRowKeys() {
			const ids = this.dataSourceCopy.map(item => item.key);
			this.selectedRowKeys.forEach((item, index) => {
				if (!ids.includes(item)) {
					this.selectedRowKeys.splice(index, 1);
				}
			});
		},
		uniqueArr(arr, uniId) {
			const res = new Map();
			let tempArr = [];
			tempArr = arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
			let spliceArr = [];
			let result = [];
			tempArr.forEach((item, index) => {
				if (this.selectedRowKeys.includes(item.key) && !item.contractNo) {
					spliceArr.push(index);
				}
			});
			tempArr.forEach((item, index) => {
				if (!spliceArr.includes(index)) {
					result.push(item);
				}
			});
			return result;
		},
		getSelectItemByKey(key) {
			return this.dataSourceCopy.filter(item => item.key == key)[0];
		},
		findIndex(key) {
			for (let i = 0; i < this.dataSourceCopy.length; i++) {
				if (this.dataSourceCopy[i].key == key) {
					return i;
				}
			}
		},
		setSelectList() {
			let cloneList = cloneDeep(this.dataSourceCopy);
			this.dataSourceCopy.forEach(item => {
				if (this.selectedRowKeys.includes(item.key)) {
					let cloneItem = cloneDeep(this.getSelectItemByKey(item.key));
					cloneItem.contractNo = this.selectItemBatch[0].contractNo;
					cloneItem.orderNo = this.selectItemBatch[0].orderNo;
					cloneItem.contractId = this.selectItemBatch[0].contractId;
					cloneItem.contractType = this.selectItemBatch[0].contractType;
					cloneItem.key = item.myInvoiceDO.no + '&&' + this.formBatch.getFieldValue('orderNo');
					cloneList.splice(this.findIndex(item.key), 0, cloneItem);
				}
			});

			this.dataSourceCopy = this.uniqueArr(cloneList, 'key');
			this.selectedRowKeys = [];
			this.visibleBatch = false;
		},
		confirmModal3() {
			this.$refs.errorModal3.close();
			this.setSelectList();
		},
		getInvoiceIds() {
			const tempArr = [];
			this.selectedRowKeys.forEach(item => {
				tempArr.push(item?.split('&&')[0]);
			});
			return [...new Set(tempArr)].join(',');
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		getCheckboxProps(record) {
			return {
				props: {
					disabled: !record.invoice
				}
			};
		},
		setDecoratorName(records, str) {
			return records.orderNo ? str + records.orderNo + records.myInvoiceDO.no : str + records.myInvoiceDO.no;
		},

		getContract(selectedOrderNoList, selectedOrderNoData, type) {
			this.selectItemBatch = selectedOrderNoData;
			if (type == 1) {
				this.setSelectList();
				return;
			}
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
				let contractType = '',
					contractNo = '',
					contractId = '';
				selectedOrderNoData.forEach(i => {
					if (i.orderNo === item) {
						contractType = i.contractType;
						contractNo = i.contractNo;
						contractId = i.contractId;
					}
				});
				tempArr.push({
					...cloneDeep(this.curInvoice),
					orderNo: item,
					contractNo,
					contractType,
					splitAmount: '',
					contractId,
					key: this.curInvoice.myInvoiceDO.no + '&&' + item
				});
			});
			const splitAmount = this.curInvoice.splitAmount;
			if (splitAmount && !this.curInvoice.orderNo) {
				tempArr[tempArr.length - 1].splitAmount = splitAmount;
			}
			const dataSource = cloneDeep(this.dataSourceCopy);
			let firstItemIndex = -1;
			this.dataSourceCopy.forEach((item, index) => {
				if (this.curInvoice?.myInvoiceDO?.no === item.myInvoiceDO.no) {
					if (this.orderNoList.length <= 0) {
						dataSource.splice(
							dataSource.findIndex(item => item.myInvoiceDO.no === this.curInvoice.myInvoiceDO.no),
							1,
							...tempArr
						);
					} else {
						if (firstItemIndex < 0) {
							firstItemIndex = index;
							dataSource.splice(firstItemIndex, 0, ...tempArr);
						}
					}
				}
			});
			this.dataSourceCopy = dataSource;
		},
		// 关闭错误弹窗
		closeError() {
			this.$refs.errorModal2.close();
		},
		save() {
			this.form.validateFieldsAndScroll(async err => {
				let isOrderNo = true;
				if (!this.existList.length) {
					if (!this.dataSourceCopy.length) {
						this.$message.warning('发票数据为空');
						return;
					}
					this.dataSourceCopy.forEach(item => {
						if (!item.orderNo) {
							isOrderNo = false;
						}
					});
					if (!isOrderNo) {
						this.$message.warning('发票必须关联合同');
						return;
					}
					let item = this.dataSourceCopy.find(el => !el.splitAmount);
					if (item) {
						this.$message.error(`合同编号：${item.contractNo}发票拆分金额必须大于0,请核实`);
						return;
					}
					const splitAmountList = this.dataSourceCopy.map(el => el.splitAmount);
					// 总拆分金额
					const totalSplitAmount = splitAmountList.reduce((sum, current) => {
						return (sum += Number(current));
					}, 0);
				}
				const existList = this.existList.map(el => {
					return {
						id: el.myInvoiceDO.id,
						invoiceNo: el.myInvoiceDO.no,
						attachment: el.myInvoiceDO.attachment
					};
				});
				if (!err) {
					const params = {
						splitList: this.dataSourceCopy,
						existList: existList,
						taskId: this.$route.query.taskId
					};
					if(this.$route.query.invoiceType == 'INPUT') {
						params.productCode = 'WAREHOUSE_RENT'
					}
					if(this.$route.query.invoiceType == 'DELIVER') {
						params.productCode = 'LOGIC_DELIVER'
					}
					const errRes = await saveCheckEdit(params);
					if (errRes.data && errRes.data.length) {
						this.errorInfoList = errRes.data.map(el => {
							const obj = {};
							for (let key in el) {
								obj.message = key;
								obj.codeList = [...new Set(el[key])];
							}
							return obj;
						});
						this.$refs.errorModal2.open();
						return;
					}
					this.loading = true;

					saveAdd(params)
						.then(res => {
							if (res.success) {
								if (res.data) {
									this.$message.success('保存成功');
									this.goback();
								} else {
									this.$message.error('保存失败');
								}
							}
						})
						.finally(() => {
							this.loading = false;
						});
				}
			});
		},
		// 删除图片发票
		delInvoice(item, index, key, tplKey) {
			this.delInvoicePic(item, index, key, tplKey);
			// 如果删除的是成功发票 则列表同步删除
			// if(item.scanStatus === 0) {
			//   this.currentItem = item
			//   this.delInvoiceList()
			// }
		},

		// 计算发票张数和价税合计总额
		calcInvoiceData() {
			let invoiceNoList = [];
			this.total = 0;
			this.sum = 0;
			this.sumyhs = 0;
			this.dataSourceCopy.forEach(item => {
				if (!invoiceNoList.includes(item.myInvoiceDO.no)) {
					invoiceNoList.push(item.myInvoiceDO.no);
					this.total += 1;
					this.sum += +item.myInvoiceDO.totalAmount || 0;
					this.sumyhs += +item.myInvoiceDO.stampTaxFlagAmount || 0;
				}
			});
		},

		cancel() {
			// this.$router.go(-1)
			this.$refs.delModal2.open();
			// this.$confirm({
			//   centered:true,
			//   title: '确认提示',
			//   content: '系统可能不会保存您所做的更改，确定要离开吗？',
			//   okText: '确定',
			//   cancelText: '取消',
			//   icon: () => {
			//     return <a-icon type="exclamation-circle" theme="filled" />
			//   },
			//   onOk: () => {
			//     this.$router.go(-1)
			//   },
			//   onCancel() {}
			// })
		},

		handleFocus(v) {
			this.curChangeInvoiceTypeData = v;
		},

		handleChange(v) {
			const tempDataSource = cloneDeep(this.dataSourceCopy);
			const fields = {};
			tempDataSource.forEach(item => {
				if (this.curChangeInvoiceTypeData.myInvoiceDO.no == item.myInvoiceDO.no) {
					item.myInvoiceDO.invoiceType = v;
					fields[this.setDecoratorName(item, 'invoiceType')] = v;
				}
			});
			this.form.setFieldsValue(fields);
			this.dataSourceCopy = tempDataSource;
		},

		handleFocusSplitAmount(v) {
			this.curChangeInvoiceSplitAmountData = v;
		},

		handleChangeSplitAmount(v, item) {
			item.splitAmount = v;
			this.$forceUpdate();
			// this.dataSourceCopy.forEach((item) => {
			//   if (this.curChangeInvoiceSplitAmountData.orderNo) {
			//     if (this.curChangeInvoiceSplitAmountData.orderNo === item.orderNo &&
			//       this.curChangeInvoiceSplitAmountData.myInvoiceDO.no == item.myInvoiceDO.no) {
			//       item.splitAmount = v
			//     }
			//   } else {
			//     if (this.curChangeInvoiceSplitAmountData.myInvoiceDO.no == item.myInvoiceDO.no) {
			//       item.splitAmount = v
			//     }
			//   }
			// })
		},
		showBatchRelation(type, data = {}) {
			if (type == 1) {
				if (!this.selectedRowKeys.length) {
					this.$message.warn('请先勾选要关联的发票');
				} else {
					// this.visibleBatch = true;
					this.popContractList(type, data);
				}
			} else {
				this.popContractList(type, data);
			}
		},
		popContractList(type, data = {}) {
			this.selectCheckType = type;
			this.curInvoice = {
				...data
			};
			this.orderNoList = [];
			this.dataSourceCopy.forEach(item => {
				if (data.myInvoiceDO && data.myInvoiceDO.no == item.myInvoiceDO.no && item.orderNo) {
					this.orderNoList.push(item.orderNo);
				}
			});
			this.$refs.contractList.showModal(this.orderNoList);
		},
		// 删除关联合同
		deleContract(item, index) {
			this.currentIndex = index;
			this.currentItem = item;
			this.$refs.delModal3.open();
		},
		// 确认删除关联合同吧
		confirmDeleContract() {
			const ids = this.dataSourceCopy.filter(item => item.myInvoiceDO.no == this.currentItem.myInvoiceDO.no);
			if (ids.length > 1) {
				for (let i = 0; i < this.dataSourceCopy.length; i++) {
					if (this.dataSourceCopy[i].key == this.currentItem.key) {
						this.dataSourceCopy.splice(i, 1);
					}
				}
			} else {
				let cloneItem = cloneDeep(this.currentItem);
				let cloneIndex = this.dataSourceCopy.findIndex(item => item.key == this.currentItem.key);
				cloneItem.contractNo = '';
				cloneItem.splitAmount = 0;
				cloneItem.orderNo = '';
				cloneItem.key = cloneItem.myInvoiceDO.no + '&&' + 'null';
				this.$set(this.dataSourceCopy, cloneIndex, cloneItem);
			}
			this.$refs.delModal3.close();
		},
		// 检测数据
		checkSplitAmount(e, item) {
			if (!item.splitAmount && item.splitAmount !== 0) {
				item.splitAmount = item.tplSplitAmount;
			}
			item.isEdit = false;

			this.$forceUpdate();
		},
		changeSplitAmount(records) {
			const key = records.orderNo
				? 'splitAmount' + records.orderNo + records.myInvoiceDO.no
				: 'splitAmount' + records.myInvoiceDO.no;
			records.isEdit = true;
			const obj = {};
			obj[key] = records.splitAmount;
			this.$nextTick(() => {
				this.form.getFieldsValue();
				this.form.setFieldsValue(obj);
				this.$forceUpdate();
			});
		},

		delOrder(item, index) {
			this.currentIndex = index;
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		confirmDel() {
			// this.delInvoiceList()
			// 发票图片成功列表 同步删除
			this.delInvoicePic(this.currentItem, this.currentIndex, 'successList', 'tplSuccessList');
		},
		/*** 解决删除相互关联 */
		// 发票图片成功删除
		delInvoicePic(item, index, key, tplKey) {
			this.dataSourceCopy.forEach(el => {
				this.dataSource.forEach(el2 => {
					if (el.myInvoiceDO.attachment == el2.myInvoiceDO.attachment) {
						el2.contractNo = el.contractNo || '';
						el2.orderNo = el.orderNo || '';
						el2.splitAmount = el.splitAmount || '';
					}
				});
			});
			this.dataSource.forEach((el, i, arr) => {
				if (el.myInvoiceDO.attachment == item.myInvoiceDO.attachment) {
					arr.splice(i, 1);
				}
			});

			// this[key].forEach((el,i,arr) => {
			//   if(i == index) {
			//     arr.splice(i, 1)
			//   }
			// })
			// // 删除对应的缓存
			// this[tplKey].forEach((el,i,arr) => {
			//   if(i == index) {
			//     arr.splice(i, 1)
			//   }
			// })
			// // 获取总数
			// this.tabList[0].total = this.failList.length + this.checkList.length
			// this.tabList[1].total = this.successList.length
			// if( !this.tabList[0].total && this.tabList[1].total) {
			//   this.tabIndex = 2
			// }
			this.$message.success('删除成功');
			this.$refs.delModal.close();
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
			/** 判断当前发票是否重新识别成功 */
			if (item.scanStatus == 0) {
				// 当前列表删除
				// this[key].forEach((el,i,arr) => {
				//   if(i == index) {
				//     arr.splice(i, 1)
				//   }
				// })
				// // 缓存列表删除
				// this[tplKey].forEach((el,i,arr) => {
				//   if(i == index) {
				//     arr.splice(i, 1)
				//   }
				// })
				// 成功列表添加
				// this.successList.push(item)
				// this.tplSuccessList.push(item)
				// 发票与订单关联信息
				// 删除原来旧的
				const obj = cloneDeep(item);
				if (obj.myInvoiceDO) {
					obj.key = obj.myInvoiceDO.no + '&&' + item.orderNo || 'null';
				}
				obj.isEdit = true;
				// 是否默认关联合同
				if (this.linkOrderInfo) {
					obj.contractNo = this.linkOrderInfo.contractNo;
					obj.orderNo = this.linkOrderInfo.orderNo;
					obj.contractId = this.linkOrderInfo.contractId;
					obj.contractType = this.linkOrderInfo.contractType;
				}
				const index = this.dataSource.findIndex(el => el.myInvoiceDO.attachment == oldItem.myInvoiceDO.attachment);
				this.dataSource.splice(index, 1, obj);
				this.$message.success(`${obj.myInvoiceDO.no}识别成功`);
			} else {
				// this[key][index] = item
				// this[tplKey][index] = item
				const index = this.dataSource.findIndex(el => el.myInvoiceDO.attachment == oldItem.myInvoiceDO.attachment);
				this.dataSource.splice(index, 1, item);
				let tip1 = `${handleType == 'replace' ? '替换结果为' : '重试结果为'}${item.scanReason}`;
				let tip = item.myInvoiceDO && item.myInvoiceDO.no ? `${item.myInvoiceDO.no}${tip1}` : tip1;
				this.$message.error(tip);
			}
			// // 获取总数
			// this.tabList[0].total = this.failList.length + this.checkList.length
			// this.tabList[1].total = this.successList.length
			// if( !this.tabList[0].total && this.tabList[1].total) {
			//   this.tabIndex = 2
			// }
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
.link-contract {
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
				background: @primary-color;
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
				&.active {
					color: @primary-color;
					font-weight: 600;
				}
				&.active::after {
					content: '';
					width: 100%;
					height: 2px;
					background: @primary-color;
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
		color: @primary-color;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
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
		margin-top: 76px;
		.btn {
			width: 114px;
			height: 38px;
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
			color: @primary-color;
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
