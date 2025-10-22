<template>
	<a-modal
		:visible="visible"
		title="提示信息"
		:width="1200"
		@cancel="
			() => {
				visible = false;
			}
		"
		@ok="okInc"
	>
		<a-form
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 18 }"
		>
			<h4 style="margin-bottom: 30px; font-weight: bold">质押物置换信息</h4>
			<a-row class="row">
				<a-col span="8">
					<a-row>
						<a-form-item label="仓库名称">
							{{ detailData.storageName }}
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item label="存货点">
							{{ detailData.inventoryPoint }}
						</a-form-item>
					</a-row>
				</a-col>
				<a-col span="8">
					<a-row>
						<a-form-item label="仓储企业">
							{{ detailData.storageCompanyName }}
						</a-form-item>
					</a-row>

					<a-row>
						<a-form-item
							label="本次解质数量（吨）"
							:label-col="{ span: 9 }"
							:wrapper-col="{ span: 14 }"
						>
							{{ detailData.thisQ }}
						</a-form-item>
					</a-row>
				</a-col>
				<a-col span="8">
					<a-row>
						<a-form-item label="货主名称">
							{{ detailData.goodsCompanyName }}
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item
							label="本次解质货值（元）"
							:label-col="{ span: 9 }"
							:wrapper-col="{ span: 14 }"
						>
							{{ detailData.thisV }}
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<h4 style="margin-bottom: 30px; margin-top: 30px; font-weight: bold">
				本次质押物置换涉及以下{{ detailData.financingPledgeVOList.length }}笔融资，提交后，系统将自动发起{{
					detailData.financingPledgeVOList.length
				}}笔质押物置换申请流程：
			</h4>
			<a-tabs
				:defaultActiveKey="0"
				v-show="detailData.financingPledgeVOList.length"
			>
				<a-tab-pane
					:tab="item.serialNo"
					:key="index"
					v-for="(item, index) in detailData.financingPledgeVOList"
				>
					<a-form
						:label-col="{ span: 6 }"
						:wrapper-col="{ span: 18 }"
						style="width: 100%"
					>
						<a-row class="row">
							<a-col span="8">
								<a-row>
									<a-form-item label="货押融资编号">
										{{ item.serialNo }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
						<a-row class="row">
							<a-col span="8">
								<a-row>
									<a-form-item label="金融机构">
										{{ item.bankName }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row>
									<a-form-item label="融资起息日">
										{{ item.beginDate }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row>
									<a-form-item label="融资到期日">
										{{ item.endDate }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
						<h4 style="margin-bottom: 30px; margin-top: 10px">赎货信息：</h4>
						<a-table
							:columns="goodsShuColumns"
							:dataSource="item.redeemGoodsList || []"
							:pagination="false"
							rowKey="id"
							:locale="{ emptyText: '暂无数据' }"
						>
						</a-table>
						<h4 style="margin-bottom: 30px; margin-top: 30px">补货信息：</h4>
						<a-table
							:columns="goodsBuColumns"
							:dataSource="item.addGoodsListPure || []"
							:pagination="false"
							rowKey="id"
							:locale="{ emptyText: '暂无数据' }"
						>
						</a-table>
						<h4 style="margin-bottom: 30px; margin-top: 30px">附件信息：</h4>
						<a-row>
							<a-button
								type="primary"
								ghost
								class="downbtn"
								@click="downAll(index, item.serialNo)"
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
										@click="viewPDF(record, index)"
										>查看</a
									>
									<a
										href="javascript:;"
										@click="downPDF(record, index)"
										>下载</a
									>
								</div>
							</a-table>
						</a-row>
					</a-form>
				</a-tab-pane>
			</a-tabs>
		</a-form>
	</a-modal>
</template>
<script>
import {
	API_PledgeExchangeApplyXie,
	API_PledgeExchangeAddSave,
	API_PledgeExchangeApplydownloadFileView,
	API_PledgeExchangeApplydownloadFile,
	API_PledgeExchangeApplydownloadFileAll
} from 'api';
import comDownload from '@sub/utils/comDownload.js';
export default {
	name: 'SubstitutionApplyModal',
	data() {
		return {
			visible: false,
			detailData: { financingPledgeVOList: [] },
			goodsShuColumns: [
				{ title: '入库单号', dataIndex: 'number', key: 'number', fixed: 'left' },
				{ title: '仓单编号', dataIndex: 'serialNo', key: 'serialNo', fixed: 'left' },
				{ title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '入库日期', dataIndex: 'inoutDate', key: 'inoutDate' },
				{ title: '入库数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '本次解质数量（吨）', dataIndex: 'thisQ', key: 'pledgeQuantity' },
				{ title: '单价（元/吨）', dataIndex: 'pledgePrice', key: 'pledgePrice' },
				{ title: '本次解质货值（元）', dataIndex: 'thisV', key: 'thisV' }
			],
			xieyiDataSource: [],
			xieyiColumn: [
				{ title: '附件类型', dataIndex: 'fileType' },
				{ title: '文件名', dataIndex: 'fileName' },
				{ title: '文件类型', dataIndex: 'ext' },
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			goodsBuColumns: [
				{ title: '入库单号', dataIndex: 'number', key: 'number', fixed: 'left' },
				{ title: '仓单编号', dataIndex: 'serialNo', key: 'serialNo', fixed: 'left' },
				{ title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '入库数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '入库热值（Kcal/kg）', dataIndex: 'heatValue', key: 'heatValue' },
				{ title: '本次质押数量（吨）', dataIndex: 'thisPledgeQuantity', key: 'thisPledgeQuantity' },
				{ title: '单价（元/吨）', dataIndex: 'thisPledgePrice', key: 'thisPledgePrice' },
				{ title: '本次质押货值（元', dataIndex: 'thisPledgeGoods', key: 'thisPledgeGoods' }
			]
		};
	},
	methods: {
		show(data) {
			this.visible = true;

			this.detailData = data;

			API_PledgeExchangeApplyXie().then(res => {
				this.xieyiDataSource = res.data || [];
			});
		},
		getParams(index, all) {
			var list = [];
			this.detailData.financingPledgeVOList.forEach(item => {
				list.push({
					addGoodsList: item.addGoodsList,
					serialNo: item.serialNo,
					redeemGoodsList: item.redeemGoodsList.map(i => {
						return {
							inboundId: i.inboundId,
							redeemQuantity: i.redeemQuantity
						};
					})
				});
			});

			return {
				inventoryPointId: this.detailData.inventoryPointId || 'a',
				goodsCompanyUscc: this.detailData.goodsCompanyUscc || 'a',
				goodsName: this.detailData.goodsName || 'a',
				financingPledgeExchangeVOList: all ? list : [list[index]],
				auditChainAndOperator: this.detailData.auditChainAndOperator || undefined
			};
		},
		downAll(index, serialNo) {
			API_PledgeExchangeApplydownloadFileAll({
				...this.getParams(index)
			}).then(res => {
				comDownload(res, undefined, `质押物置换-${serialNo}.zip`);
			});
		},
		downPDF(record, index) {
			API_PledgeExchangeApplydownloadFile({
				...this.getParams(index),
				contractType: record.contractType
			}).then(res => {
				comDownload(res, null, record.fileName + '.pdf');
			});
		},
		viewPDF(record, index) {
			API_PledgeExchangeApplydownloadFileView({
				...this.getParams(index),
				contractType: record.contractType
			}).then(res => {
				if (res.data) {
					window.open(res.data, '_blank');
				}
			});
		},
		okInc() {
			this.$confirm({
				centered: true,
				title: '确定提交',
				okText: '确定',
				content: '请确认数据填写无误，是否提交?',
				cancelText: '取消',
				onOk: () => {
					API_PledgeExchangeAddSave({
						...this.getParams(null, true)
						// financingPledgeExchangeVOList:this.detailData.financingPledgeVOList
					}).then(res => {
						if (res.success) {
							this.$message.success('操作成功');
							this.visible = false;
							this.$router.back();
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.downbtn {
	float: right;
	margin-bottom: 10px;
	position: relative;
	z-index: 2;
}
</style>
