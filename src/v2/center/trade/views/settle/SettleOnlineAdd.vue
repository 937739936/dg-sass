<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				{{ meta.title }}
			</span>
			<div class="sub">
				<div class="slTitleAssis">合同信息</div>
				<ContractOnline :contractInfo="contractInfo || {}" />
			</div>
			<div class="sub">
				<div class="slTitleAssis">选择结算货物</div>
				<!-- 如果有发运信息，展示发运信息板块，否则判断是否有货转信息，展示货转信息板块 -->
				<DeliverDto
					:dataSource="deliverBatchWithDeliverInfos.map(item => item.deliverBatch)"
					:selectIdList="deliveryIdList"
					@electNoChange="electNoChange"
					ref="deliverDto"
					v-if="deliverBatchWithDeliverInfos.length"
				/>
				<GoodsTransfer
					:dataSource="goodsTransferWithDeliverBatchInfos.map(item => item.goodsTransfer)"
					@electNoChange="electNoChange"
					:selectIdList="goodsTransferIdList"
					ref="goodsTransfer"
					v-else-if="goodsTransferWithDeliverBatchInfos.length"
				/>
				<div
					class="subInfo"
					v-if="deliveryIdList.length || goodsTransferIdList.length"
				>
					<span>已选：</span>
					<template v-if="deliveryIdList.length"> {{ deliveryIdList.length | formatMoney }}个批次 </template>
					<template v-if="goodsTransferIdList.length"> {{ goodsTransferIdList.length | formatMoney }}个货转 </template>
					<template v-if="selectNoListInfo.deliverQuantity || selectNoListInfo.receiveQuantity">
						<span>，票重：</span>
						{{ selectNoListInfo.deliverQuantity | formatMoney(4) }}吨
						<span>，衡重：</span>
						{{ selectNoListInfo.receiveQuantity | formatMoney(4) }}吨
					</template>
					<template v-if="selectNoListInfo.trainNum">
						<span>，车数：</span>
						{{ selectNoListInfo.trainNum | formatMoney }}
					</template>
					<template v-if="selectNoListInfo.goodsTransferQuantity">
						<span>，货转数量：</span>
						{{ selectNoListInfo.goodsTransferQuantity | formatMoney(4) }}吨
					</template>
				</div>
			</div>
			<div class="sub">
				<div class="slTitleAssis">结算信息</div>
				<!-- 结算信息编辑 -->
				<SettleOnlineInfo
					ref="settleOnlineInfo"
					:info="{
						contractInfo,
						invoice,
						statementInfo,
						transType: selectNoListInfo.info, //运输信息
						currentSettleQuantity: selectNoListInfo.receiveQuantity || selectNoListInfo.goodsTransferQuantity //本次结算数量，取衡重或是货转数量
					}"
					@selectChange="selectChange"
				/>
				<!-- 结算信息详情 -->
			</div>
			<div class="submit-btn">
				<a-button
					type="primary"
					ghost
					@click="judgeBack"
				>
					取消
				</a-button>
				<a-button
					type="primary"
					ghost
					@click="preView"
					:loading="preViewLoading"
				>
					预览
				</a-button>
				<a-button
					type="primary"
					ghost
					@click="save"
					:loading="saveLoading"
				>
					保存
				</a-button>
				<a-button
					type="primary"
					@click="submit"
					:loading="submitLoading"
				>
					提交
				</a-button>
			</div>
		</a-card>
		<modalInfo
			ref="modalInfo"
			@verify="submitOK"
			:loading="modalLoading"
			title="确认提交"
			tip="提交后，请对结算单进行盖章，盖章后将由对方进行确认盖章，双方盖章后，结算单将生效，确认提交吗？"
		/>
		<modalInfo
			ref="modalInfoChange"
			title="提示确认提交"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="back"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="save"
				>
					保存后返回
				</a-button>
			</div>
		</modalInfo>
		<WorkFlowModal
			ref="workFlowModal"
			v-if="OAAuditOption.existOA"
			v-on:submit="modalMainOK"
			desc="你的企业已对接OA，请确认流程发起人，提交后将推送OA审核。审核通过后可以进行盖章，然后由对方进行确认盖章，双方盖章后，结算单将生效"
			:auditChainAndOperator="params.originatorAuditChain"
		/>
		<modalMain
			ref="modalMainPDF"
			title="结算单预览"
			width="1130px"
		>
			<pdf-preview :url="result"></pdf-preview>
			<div slot="footer">
				<a-button @click="$refs.modalMainPDF.close()"> 返回 </a-button>
				<a-button
					type="primary"
					:disabled="!result"
					:loading="downloadLoading"
					@click="download"
				>
					下载
				</a-button>
			</div>
		</modalMain>
		<modalInfo
			ref="modalInfoSeal"
			title="是否进行盖章"
			tip="结算单已提交，需要盖章，是否需要盖章？ "
			cancelText="稍后盖章"
			okText="现在去盖章"
			@close="back"
			:loading="modalLoading"
			@verify="modalInfoSeal"
		/>
		<modalInfo
			ref="modalInfoOk"
			:width="283"
			title="提示"
			:tip="tip"
			@close="back"
			:footer="false"
		/>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import breadcrumb from '@/v2/components/breadcrumb/index';
import WorkFlowModal from '@/v2/center/trade/components/WorkFlowModal.vue';
import PdfPreview from '@sub/components/pdf/index.vue';
import modalInfo from '@/v2/components/modalInfo/info';
import modalMain from '@/v2/components/modalInfo/main';
import {
	API_GETSETTLETEMPLATE,
	API_POSTSETTLETESAVE,
	API_GETSETTLEDETAIL,
	API_DOWNLPREVIEWTE,
	API_POSTSETTLETESUBMIT,
	API_POSTSETTLETEPREVIEW
} from '@/v2/center/trade/api/settle';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import ContractOnline from './components/ContractOnline';
import DeliverDto from './components/DeliverDto';
import GoodsTransfer from './components/GoodsTransfer';
import SettleOnlineInfo from './components/SettleOnlineInfo';

export default {
	components: {
		breadcrumb,
		PdfPreview,
		modalInfo,
		ContractOnline,
		DeliverDto,
		GoodsTransfer,
		SettleOnlineInfo,
		modalMain,
		WorkFlowModal
	},
	data() {
		let { meta, query } = this.$route;
		return {
			orderId: query?.orderId,
			id: query?.id,
			meta, //获取title
			change: false, //内容有无修改
			data: {
				saveReq: {}, //提交的参数
				// 合同信息
				contractInfo: {},
				//开票信息
				invoice: {},
				//结算单信息
				statementInfo: {},
				//发运信息
				deliverBatchWithDeliverInfos: [],
				goodsTransferWithDeliverBatchInfos: [] //货转信息
			}, //接口数据返回信息
			deliveryIdList: [], //选中的收发货id集合
			goodsTransferIdList: [], //货转ID集合
			preViewLoading: false,
			saveLoading: false,
			submitLoading: false,
			downloadLoading: false, //下载
			result: '', //pdf预览地址
			params: {}, //提交参数
			modalLoading: false, //弹框loading状态
			tip: '' //是否签章提示
		};
	},
	watch: {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		//合同信息
		contractInfo() {
			return this.data.contractInfo || {};
		},
		//开票信息
		invoice() {
			return this.data.invoice || {};
		},
		//结算单信息
		statementInfo() {
			return this.data.statementInfo || {};
		},
		//发运信息
		deliverBatchWithDeliverInfos() {
			return this.data.deliverBatchWithDeliverInfos || [];
		},
		//货转信息
		goodsTransferWithDeliverBatchInfos() {
			return this.data.goodsTransferWithDeliverBatchInfos || [];
		},
		selectNoListInfo() {
			//统计选中运输方式，票重，衡重，车数,货转数量,所有批次
			let deliverQuantity = 0,
				receiveQuantity = 0,
				trainNum = 0,
				goodsTransferQuantity = 0,
				info = {
					ships: [], //船运
					trains: [], //火运
					trucks: [], //汽运
					none: [] //不涉及运输方式
				};
			//发货批次
			if (this.deliveryIdList?.length) {
				//发运信息板块
				this.deliverBatchWithDeliverInfos.map(item => {
					//批次信息
					let { deliverBatch } = item;
					if (this.deliveryIdList.includes(deliverBatch.id)) {
						deliverQuantity += Number(deliverBatch.deliverQuantity);
						receiveQuantity += Number(deliverBatch.receiveQuantity);
						trainNum += Number(deliverBatch.trainNum) || 0;
						//处理展示信息
						info = this.infoHandle(info, item);
					}
				});
			} else if (this.goodsTransferIdList?.length) {
				//货转信息板块
				this.goodsTransferWithDeliverBatchInfos.map(item => {
					//货转信息
					let { goodsTransfer, deliverBatches } = item;
					//如果当前货转被选择
					if (this.goodsTransferIdList.includes(goodsTransfer.id)) {
						//如果货转类型是复用货转，找批次信息
						if (goodsTransfer.goodsTransferType == 'GOODS_TRANSFER_REFERRED') {
							deliverBatches?.map(items => {
								let { deliverBatch } = items;
								deliverQuantity += Number(deliverBatch.deliverQuantity);
								receiveQuantity += Number(deliverBatch.receiveQuantity);
								trainNum += Number(deliverBatch.trainNum) || 0;
							});
						} else {
							//货转找对应的货转信息
							goodsTransferQuantity += Number(goodsTransfer.goodsTransferQuantity);
						}
						//处理展示信息
						//无需运输没有批次，单独判断处理
						if (goodsTransfer.transportMode == 'NONE') {
							info = this.infoHandle(info, item);
						} else {
							deliverBatches?.map(items => {
								info = this.infoHandle(info, items);
							});
						}
					}
				});
			}
			return {
				deliverQuantity,
				receiveQuantity,
				trainNum,
				goodsTransferQuantity,
				info
			};
		},
		OAAuditOption() {
			//校验是否对接OA
			let OAAuditOption = {};
			if (this.type == 'buy') {
				OAAuditOption = this.contractInfo?.buyerOAAuditOption || '';
			} else if (this.type == 'sell') {
				OAAuditOption = this.contractInfo?.sellerOAAuditOption || '';
			}
			return OAAuditOption;
		}
	},
	//进入页面前判断数据
	async beforeRouteEnter(to, from, next) {
		let { query, meta } = to;
		let { id, orderId } = query;
		let { type } = meta;
		let res = {};
		//如果修改详情，否则是新建，从合同信息中查询
		if (id) {
			res = await API_GETSETTLEDETAIL({ statementId: id });
		} else if (orderId) {
			//被选中的合同模板详情
			res = await API_GETSETTLETEMPLATE({ orderId });
		}
		if (res.success) {
			let data = res.data;
			let { orderType } = data.contractInfo;
			orderType = orderType.toLowerCase();
			//判断合同类型和将进入页面是否一致，一致直接进入，不一致转到对应页面
			if (type == orderType) {
				await next(t => {
					t.setDetail(data);
				});
			} else {
				let path = to.path.replace(type, orderType);
				next({
					path,
					query
				});
			}
		}
	},
	async created() {
		// await this.getDetail();
	},
	async mounted() {},
	methods: {
		//运输方式信息处理
		infoHandle(info, item) {
			let { deliverBatch, ships, goodsTransfer } = item;
			let transTypeObj = {
				SHIP: 'ships', //船运
				TRAIN: 'trains', //火运
				AUTOMOBILE: 'trucks', //汽运
				NONE: 'none' //不涉及运输方式
			};
			//从批次中获取发运信息，没有批次的为货转无需运输，取货转数据
			let despatchType = deliverBatch?.despatchType || goodsTransfer?.transportMode;
			let key = transTypeObj[despatchType];
			//记录运输方式，不同的运输方式展示不同的内容,船运信息记录所有的船舶数据，火运汽运做统计数据
			if (despatchType == 'SHIP') {
				ships.map(items => {
					info[key].push([
						{ value: deliverBatch.despatchTypeDesc, name: '运输方式' },
						{ value: items.shipName, name: '船舶名称' },
						{
							value: items.deliverQuantity,
							name: '装货量(吨)',
							type: 'number'
						},
						{ value: items.originPortName, name: '装港' },
						{ value: items.destinationPortName, name: '卸港/交货港' }
					]);
				});
			} else {
				let Arr = [];
				// 火运汽运做统计数据，只有一组数据
				if (despatchType == 'TRAIN' || despatchType == 'AUTOMOBILE') {
					if (!info[key][0]) {
						info[key][0] = [{ value: deliverBatch.despatchTypeDesc, name: '运输方式' }];
					}
					Arr = [
						...info[key][0],
						{
							value: Number(deliverBatch.deliverQuantity),
							name: '票重(吨)',
							type: 'number'
						},
						{
							value: Number(deliverBatch.receiveQuantity),
							name: '衡重(吨)',
							type: 'number'
						},
						{
							value: Number(deliverBatch.trainNum),
							name: '车数',
							type: 'number'
						}
					];
				} else if (despatchType == 'NONE') {
					//不涉及货转运输方式时,货转中出现
					if (!info[key][0]) {
						info[key][0] = [{ value: goodsTransfer.transportModeDesc, name: '运输方式' }];
					}
					Arr = [
						...info[key][0],
						{
							value: goodsTransfer.deliveryPlace,
							name: '交货地点'
						},
						{
							value: goodsTransfer.receiverName,
							name: '收货人'
						}
					];
				}
				Arr = Arr.map(items => {
					let i = Arr.find(itemss => itemss.name === items.name);
					if (i !== items) {
						if (i.type == 'number') {
							i.value += items.value;
						} else {
							i.value += `、${items.value || '-'}`;
						}
						return undefined;
					} else {
						return i;
					}
				}).filter(items => items);
				info[key][0] = [...Arr];
			}
			return info;
		},
		//选择结算货物变更
		electNoChange(val) {
			this[val.key] = val.data;
			this.selectChange();
		},
		//表单值发生了变化
		selectChange() {
			this.change = true;
		},
		//获取详情
		async setDetail(data) {
			let { saveReq = '' } = data;
			this.data = { ...data }; //合同信息
			//如果有提交值,设置反显
			if (saveReq) {
				this.params = saveReq || {}; //保存提交的参数
				//加个判断处理，方式原先选择方式后数据变数，但是数据显示错误
				if (this.deliverBatchWithDeliverInfos.length) {
					//如果有发运信息取发运ID集合
					this.deliveryIdList = saveReq.deliveryIdList || []; //选中的收发货id集合
				} else if (this.goodsTransferWithDeliverBatchInfos.length) {
					//如果有货转信息取发运ID集合
					this.goodsTransferIdList = saveReq.goodsTransferIdList || []; //货转ID集合
				}
				this.$nextTick(() => {
					this.$refs.settleOnlineInfo.setValue(saveReq);
				});
			}
		},
		//rules校验数据
		async rulesParams() {
			//如果他的类型不是无须运输，需要选择收发货信息
			if (!this.deliveryIdList?.length && !this.goodsTransferIdList?.length) {
				this.$message.error('请选择需要结算的货物');
				return false;
			}
			let paramsList = [];
			if (this.$refs.settleOnlineInfo) {
				paramsList.push(this.$refs.settleOnlineInfo.validateFields());
			}
			let params = {
				id: this.id,
				deliveryIdList: this.deliveryIdList, //发货ID集合
				goodsTransferIdList: this.goodsTransferIdList, //货转ID集合
				orderId: this.orderId || this.contractInfo.orderId //合同ID，没有取合同信息值
			};
			return new Promise(resolve => {
				Promise.all(paramsList).then(res => {
					if (!res.includes(false)) {
						res.map(item => {
							params = { ...params, ...item };
						});
						resolve(params);
					} else {
						this.$message.error('请补全结算单信息');
						resolve(false);
					}
				});
			});
		},
		//返回
		back() {
			this.goReceivable();
		},
		//判断返回
		judgeBack() {
			//如果dangdang发生数据变化，提示是否保存
			if (this.change) {
				this.$refs.modalInfoChange.open();
			} else {
				this.back();
			}
		},
		//保存
		async save() {
			//关闭保存提示弹框
			this.$refs.modalInfoChange.close();
			let params = await this.rulesParams();
			if (params) {
				this.saveLoading = true;
				API_POSTSETTLETESAVE(params)
					.then(res => {
						if (res.success) {
							this.$message.success('保存成功');

							this.goReceivable();
						}
					})
					.finally(() => {
						this.saveLoading = false;
					});
			}
		},
		//确认提交
		async submitOK(params = this.params) {
			this.modalLoading = true;
			let res = await API_POSTSETTLETESUBMIT(params);
			this.modalLoading = false;
			this.$refs.workFlowModal ? (this.$refs.workFlowModal.modalLoading = false) : '';
			if (res.success) {
				this.$message.success('提交成功');
				//关闭弹框,非OA弹框
				this.$refs.modalInfo?.close();
				//判断的是否对接OA,对接OA由OA审批
				if (this.OAAuditOption?.existOA) {
					this.$message.success('提交成功');
					this.back();
				} else {
					//判断是否签章提示
					let data = res.data;
					if (data.msg) {
						//如果不是签章员,提示联系签章员
						this.tip = data.msg;
						this.$refs.modalInfoOk.open();
					} else {
						//如果签章员,提示是否签章
						this.id = data.id;
						this.$refs.modalInfoSeal.open();
					}
				}
			}
		},
		//OA确认提交
		async modalMainOK(data) {
			if (data) {
				let params = {
					...this.params,
					originatorAuditChain: data
				};
				this.$refs.workFlowModal ? (this.$refs.workFlowModal.modalLoading = true) : '';
				this.submitOK(params);
			}
		},
		//提交
		async submit() {
			let params = await this.rulesParams();
			if (params) {
				this.submitLoading = true;
				this.params = { ...params };
				if (this.OAAuditOption?.existOA) {
					//需要对接OA
					this.params = {
						...this.params,
						originatorAuditChain: this.OAAuditOption.auditChainAndOperator
					};
					this.$refs.workFlowModal.showModal();
				} else {
					this.$refs.modalInfo.open();
				}
				this.submitLoading = false;
			}
		},
		//预览
		async preView() {
			let params = await this.rulesParams();
			if (params) {
				this.preViewLoading = true;
				API_POSTSETTLETEPREVIEW(params)
					.then(res => {
						this.result = res.data;
						this.$refs.modalMainPDF.open();
					})
					.finally(() => {
						this.preViewLoading = false;
					});
			}
		},
		//下载结算单预览
		download() {
			this.downloadLoading = true;
			let BASE_NET = ENV.BASE_NET;
			let result = BASE_NET + this.result;
			let name = `电子结算单-${this.contractInfo.sellerName}-${this.contractInfo.buyerName}-${this.contractInfo.contractNo}.pdf`;
			API_DOWNLPREVIEWTE(result)
				.then(res => {
					comDownload(res, null, name);
				})
				.finally(() => {
					this.downloadLoading = false;
				});
		},
		//跳转到盖章
		modalInfoSeal() {
			//replace防止返回时返回详情页
			this.$router.replace({
				path: `/center/settle/${this.type}/onlineseal`,
				query: {
					id: this.id
				}
			});
		},
		// 判断是否从新增应收账款菜单进入的
		goReceivable() {
			if (this.$route.query.source == 'receivable') {
				this.$router.push({
					path: '/center/assets/receivable/manual/edit',
					query: {
						activeIndex: 8,
						contractId: this.$route.query.contractId
					}
				});
			} else {
				this.$router.back();
			}
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
	.submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		text-align: center;
		.ant-btn {
			margin: 0 15px;
			padding: 0 30px;
			border-radius: 6px;
			border: 1px solid @primary-color;
		}
	}
	.sub {
		margin-bottom: 30px;
		.slTitleAssis {
			margin: 0 0 20px;
		}
		.title-tip {
			font-weight: 400;
			font-size: 14px;
			line-height: 14px;
			color: #77889d;
		}
		.subInfo {
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
			letter-spacing: 0px;
			text-align: left;
			color: rgba(0, 0, 0, 0.8);
			span {
				color: rgba(0, 0, 0, 0.4);
			}
		}
	}
}

.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	line-height: 22px;
}
</style>
