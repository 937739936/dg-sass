<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>补货申请</span
				>
			</div>
			<a-form
				:form="baseForm"
				:label-col="{ span: 8 }"
				:wrapper-col="{ span: 14 }"
			>
				<div class="bottom-box">
					<div class="s-card-content">
						<h2>补货通知</h2>
						<a-row class="row">
							<a-col span="8">
								<a-row>
									<a-form-item label="补货编号">
										{{ detailData.serialNo }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="出资机构">
										{{ detailData.bankName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="融资金额（元）">
										{{ detailData.finAmount }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="需补货值（元）">
										<span style="color: red">{{ detailData.lossAmount }}</span>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row>
									<a-form-item label="货押融资编号">
										<a @click="$router.push('/center/financing/financingPledgeDetail?id=' + detailData.financingApplyId + '')">{{
											detailData.financingApplyNo
										}}</a>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓库名称">
										{{ detailData.storageName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="当前质押数量（吨）"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 14 }"
									>
										{{ detailData.pledgeQuantity }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="通知时间">
										{{ detailData.noticeTime }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row>
									<a-form-item label="融资方">
										{{ detailData.financier }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓储企业">
										{{ detailData.storageCompanyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="当前质押货值（元）"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 14 }"
									>
										{{ detailData.pledgeGoodsValue }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>

				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<h2>补货信息</h2>

					<div class="card-desc">
						已补货物数量：{{ getNum(detailData.addList) }}吨，已补货物货值：{{
							getGoods(detailData.addList)
						}}元，还需补货物货值：{{ getGoods(detailData.addList, 'h') }}元
					</div>
					<a-button
						class="fr choose-btn"
						type="primary"
						@click="openChoose"
						>选择货物</a-button
					>
					<a-table
						:columns="goodsColumn"
						:dataSource="detailData.addList || []"
						:pagination="false"
						:scroll="{ x: true }"
						rowKey="id"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="thisPledgeQuantity"
							slot-scope="text, record, index"
						>
							<a-input-number
								v-model="record.thisPledgeQuantity"
								@change="calcNum(record, index)"
								:precision="4"
							></a-input-number>
						</template>
						<template
							slot="action"
							slot-scope="text, record, index"
						>
							<a
								href="javascript:;"
								@click="deleteGItem(index, record)"
								>删除</a
							>
						</template>
					</a-table>
				</div>
				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<h2>附件信息</h2>
					<a-row>
						<a-button
							type="primary"
							ghost
							class="downbtn"
							@click="downAll"
							>一键下载</a-button
						>
						<a-table
							rowKey="name"
							:columns="xieyiColumn"
							:dataSource="xieyiDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="action"
								slot-scope="text, record"
							>
								<a
									href="javascript:;"
									style="margin-right: 10px"
									@click="viewPDF(record)"
									>查看</a
								>
								<a
									href="javascript:;"
									@click="downPDF(record)"
									>下载</a
								>
							</div>
						</a-table>
					</a-row>
				</div>
				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<FinancingLiu
						ref="FinancingLiu"
						bizType="MORTGAGE_REPLENISHMENT"
					/>
					<div style="text-align: center; margin-top: 40px">
						<a-button
							@click="$router.back()"
							type="primary"
							ghost
							>返回</a-button
						>
						<a-button
							type="primary"
							@click="submitApply('2')"
							style="margin-left: 10px"
							>提交</a-button
						>
					</div>
				</div>
			</a-form>
			<ChooseGoods
				ref="ChooseGoods"
				@chooseFinGoods="chooseFinGoods"
			/>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_PledgeReplenDetail,
	API_PledgeReplenDetaildownloadFile,
	API_PledgeReplenApplyXie,
	API_PledgeReplenApplydownloadFileView,
	API_PledgeReplenApplydownloadFileAll,
	API_PledgeReplenApplydownloadFile,
	API_PledgeReplenAddSave
} from '@/api';
import _ from 'lodash';
import moment from 'moment';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
import ChooseGoods from '@/v2/center/assets/components/common/ChooseGoods.vue';
import comDownload from '@sub/utils/comDownload.js';

export default {
	data() {
		return {
			moment,
			baseForm: this.$form.createForm(this),
			filterCodeByValueName: filterCodeByValueName,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			detailData: { addList: [], lossAmount: 100 },
			xieyiDataSource: [],
			xieyiColumn: [
				{ title: '附件类型', dataIndex: 'fileType' },
				{ title: '文件名', dataIndex: 'fileName' },
				{ title: '文件类型', dataIndex: 'ext' },
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			logColumn: [
				{ title: '操作类型', dataIndex: 'auditResult', key: 'auditResult' },
				{ title: '操作人', dataIndex: 'auditOperatorName', key: 'auditOperatorName' },
				{ title: '所属公司', dataIndex: 'auditOperatorCompany', key: 'auditOperatorCompany' },
				{ title: '操作内容', dataIndex: 'auditOpinion', key: 'auditOpinion' },
				{ title: '操作时间', dataIndex: 'auditTime', key: 'auditTime' }
			],
			goodsColumn: [
				{ title: '入库单号', dataIndex: 'number', key: 'number', fixed: 'left' },
				{ title: '仓单编号', dataIndex: 'goodsRecordNo', key: 'goodsRecordNo', fixed: 'left' },
				{ title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '入库数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '入库热值（Kcal/kg）', dataIndex: 'heatValue', key: 'heatValue' },
				{ title: '可质押数量（吨）', dataIndex: 'canPledgeQuantity', key: 'canPledgeQuantity' },
				{
					title: '本次质押数量（吨）',
					dataIndex: 'thisPledgeQuantity',
					key: 'thisPledgeQuantity',
					scopedSlots: { customRender: 'thisPledgeQuantity' }
				},
				{ title: '单价（元/吨）', dataIndex: 'thisPledgePrice', key: 'thisPledgePrice' },
				{
					title: '本次质押货值（元）',
					dataIndex: 'thisPledgeGoods',
					key: 'thisPledgeGoods',
					customRender: (a, r) => {
						return (r.thisPledgeQuantity * r.thisPledgePrice).toFixed(2);
					}
				},
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			]
		};
	},
	components: {
		FinancingLiu,
		ChooseGoods
	},
	computed: {},
	mounted: function () {
		API_PledgeReplenApplyXie({ noticeId: this.$route.query.id, addGoodsType: 'ADD_GOODS' }).then(res => {
			this.xieyiDataSource = res.data || [];
		});
		API_PledgeReplenDetail({ noticeId: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
				if (this.$route.query.repeat) {
					this.detailData.addList = [];
				}
			}
		});
	},
	methods: {
		getNum(list = []) {
			let n = 0;
			list.forEach(i => {
				n = n + Number(i.thisPledgeQuantity);
			});
			return n.toFixed(2);
		},
		getGoods(list = [], s) {
			let n = 0;
			list.forEach(i => {
				n = n + Number(i.thisPledgeGoods);
			});
			if (s) {
				return Math.max(0, this.detailData.lossAmount - n).toFixed(2);
			}
			this.hasGoodV = n;
			return n.toFixed(2);
		},
		deleteGItem(index, record) {
			this.detailData.addList.splice(_.findIndex(this.detailData.addList, { id: record.id }), 1);
		},
		openChoose() {
			this.$refs.ChooseGoods.show(this.detailData.addList, this.detailData.storageNo, this.detailData.storageId);
		},
		chooseFinGoods(r) {
			this.detailData.addList = r;
		},
		calcNum(record, index) {
			record.thisPledgeGoods = record.thisPledgeQuantity * record.thisPledgePrice;
		},
		getParams() {
			return {
				noticeId: this.$route.query.id,
				addGoodsType: 'ADD_GOODS',
				addGoodsList: this.detailData.addList.map(i => {
					return {
						inboundNo: i.serialNo,
						addQuantity: i.thisPledgeQuantity
					};
				})
			};
		},
		async submitApply() {
			if (this.detailData.addList.length == 0) {
				this.$message.error('请选择补货信息');
				return;
			}
			if (!this.hasGoodV) {
				this.$message.error('请填写质押数量');
				return;
			}

			let auditChainAndOperator = null;
			try {
				auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck();
			} catch (e) {
				auditChainAndOperator = e;
			}

			if (!auditChainAndOperator) {
				return;
			}
			this.$confirm({
				centered: true,
				title: '确定提交',
				okText: '确定',
				content: '请确认数据填写无误，是否提交?',
				cancelText: '取消',
				onOk: () => {
					API_PledgeReplenAddSave({
						...this.getParams(),
						auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator
					}).then(res => {
						if (res.success) {
							this.$message.success('操作成功');
							this.$router.back();
						}
					});
				},
				onCancel() {}
			});
		},
		downAll() {
			API_PledgeReplenApplydownloadFileAll({
				...this.getParams()
			}).then(res => {
				comDownload(res, undefined, `补货-${this.detailData.serialNo}.zip`);
			});
		},
		downPDF(record) {
			if (record.attachmentId) {
				API_PledgeReplenDetaildownloadFile({
					contractFileId: record.attachmentId
				}).then(res => {
					comDownload(res, null, record.fileName + '.pdf');
				});
			} else {
				API_PledgeReplenApplydownloadFile({
					...this.getParams(),
					contractType: record.contractType
				}).then(res => {
					comDownload(res, null, record.fileName + '.pdf');
				});
			}
		},
		viewPDF(record) {
			if (record.path) {
				window.open(record.path, '_blank');
			} else {
				API_PledgeReplenApplydownloadFileView({
					...this.getParams(),
					contractType: record.contractType
				}).then(res => {
					if (res.data) {
						window.open(res.data, '_blank');
					}
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep .ant-form-item-label {
	text-align: left;
	label {
		color: #6b6f76;
	}
}
.card-desc {
	margin-bottom: 10px;
	font-size: 13px;
}
.choose-btn {
	margin-bottom: 20px;
	position: relative;
	z-index: 3;
}
.downbtn {
	margin-bottom: 14px;
	float: right;
	position: relative;
	z-index: 3;
}
.top-box {
	box-shadow: 0 2px 10px 0 #dddfe4;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;
	.s-card-title {
		margin-left: 20px;
		margin-top: 20px;
		font-family: PingFangSC-Medium;
		color: #141517;
		line-height: 24px;
		justify-content: space-between;
		padding-right: 20px;
		a {
			cursor: pointer;
		}
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}
.bottom-box {
	.s-card-content .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}
.s-card-content {
	padding: 20px 16px 24px 16px;
	border-radius: 8px;
	background: #fff;
	margin: 14px 0 0 0;
	.row .ant-col {
		margin-top: 8px;
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}

	.ant-row .ant-col {
		margin-bottom: 8px;
		margin-top: 8px;
	}
	h2 {
		font-style: normal;
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #141517;
		line-height: 22px;
		margin-bottom: 16px;
	}
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
</style>
