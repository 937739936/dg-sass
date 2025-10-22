<template>
	<div class="custom-main-content-inner">
		<div class="page-title">
			<span>结算单详情</span>
		</div>
		<a-card title="合同信息">
			<template #extra> 结算单状态:{{ data.statusDesc }} </template>
			<a-descriptions :column="2">
				<a-descriptions-item label="合同编号">
					<a @click.prevent="contractDetail">{{ data.paperContractNo }}</a>
				</a-descriptions-item>
				<a-descriptions-item label="签订日期">{{ data.contractSignTime }}</a-descriptions-item>
				<a-descriptions-item label="卖方企业名称">{{ data.sellerName }}</a-descriptions-item>
				<a-descriptions-item label="买方企业名称">{{ data.buyerName }}</a-descriptions-item>
				<a-descriptions-item label="煤种">{{ data.coalTypeDesc }}</a-descriptions-item>
				<a-descriptions-item label="品名">{{ data.goodsName }}</a-descriptions-item>
				<a-descriptions-item label="基准价格(元/吨)">{{
					data.followTheMarket ? '随行就市' : data.contractPrice
				}}</a-descriptions-item>
				<a-descriptions-item label="数量(吨)">{{ data.contractQuantity }}</a-descriptions-item>
				<a-descriptions-item label="交货期限">{{ data.execDateStart }} 至 {{ data.execDateEnd }}</a-descriptions-item>
				<a-descriptions-item label="运输方式">{{ data.transTypeDesc }}</a-descriptions-item>
			</a-descriptions>
		</a-card>
		<a-card
			title="结算单信息"
			style="margin-top: 10px"
		>
			<a-descriptions :column="2">
				<a-descriptions-item label="结算单类型">{{ data.typeDesc }}</a-descriptions-item>
				<a-descriptions-item label="结算单号">{{ data.serialNo }}</a-descriptions-item>
				<a-descriptions-item label="结算日期">{{ data.statementTime }}</a-descriptions-item>
				<a-descriptions-item label="供货周期">{{ data.supplyDateStart }} 至 {{ data.supplyDateEnd }}</a-descriptions-item>
				<a-descriptions-item label="结算单价">{{ data.settleUnitPrice }}</a-descriptions-item>
				<a-descriptions-item label="结算数量">{{ data.settleQuantity }}</a-descriptions-item>
				<a-descriptions-item label="结算金额">{{ data.settleAmount }}</a-descriptions-item>
				<a-descriptions-item label="备注">{{ data.remark }}</a-descriptions-item>
			</a-descriptions>
		</a-card>
		<a-card
			title="附件"
			style="margin-top: 10px"
		>
			<a-table
				:bordered="false"
				:columns="attachmentColumns"
				:rowKey="record => record.id"
				:dataSource="data.attachmentList"
				:pagination="false"
				:scroll="{ x: false }"
			>
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a @click.prevent="handlePreview(record)">查看</a>
					<a
						@click.prevent="download(record.fileUrl, record.fileName)"
						style="padding-left: 10px"
						>下载</a
					>
				</template>
			</a-table>
		</a-card>
		<div style="padding: 20px; text-align: center">
			<a-button @click="goback">返回</a-button>
			<template v-if="data.status == 'WAI_CONFIRM' && this.edit">
				<a-button
					style="margin-left: 20px"
					@click="rejectModal"
					type="danger"
					ghost
					>驳回</a-button
				>
				<a-button
					type="primary"
					style="margin-left: 20px"
					@click="doConfirm"
					v-auth="'coalMineDgChain:settlement:settlement:confirm'"
					>确认</a-button
				>
			</template>
		</div>
		<a-modal
			title="提示"
			:visible="rejectVisible"
			:destroyOnClose="true"
			@cancel="rejectModal"
			@ok="doReject"
		>
			<a-form>
				<a-form-item
					label="请输入驳回原因(如日期错误、结算数量错误、结算单价错误、单据错误等)"
					required
				>
					<a-textarea
						:auto-size="{ minRows: 4, maxRows: 6 }"
						v-model="rejectReason"
						:maxLength="200"
					></a-textarea>
				</a-form-item>
			</a-form>
		</a-modal>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import { attachmentColumns } from './js/logistics';
import {
	API_GETCURRENTENV,
	API_DOWNLPREVIEWTE,
	API_GetDownloadRAR,
	getStatementDetail,
	doRejectStatus,
	doStatementStatus
} from '@/v2/center/trade/api/coal';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
export default {
	data() {
		return {
			statementId: this.$route.query.id,
			edit: this.$route.query.edit, //判断是否确认
			attachmentColumns,
			data: {},
			rejectVisible: false,
			API_GETCURRENTENV,
			rejectReason: '',
			previewImg: ''
		};
	},
	created() {},
	mounted() {
		this.doFetch();
	},
	methods: {
		doFetch() {
			getStatementDetail(this.statementId).then(res => {
				this.data = res.data;
			});
		},
		download(url, name) {
			API_DOWNLPREVIEWTE(API_GETCURRENTENV(url)).then(res => {
				comDownload(res, null, name);
			});
		},
		rejectModal() {
			this.rejectVisible = !this.rejectVisible;
		},
		doReject() {
			let rejectReason = this.rejectReason;
			if (!rejectReason || !rejectReason.replace(/\s/g, '')) {
				this.$message.error('请输入驳回原因');
				return;
			}
			doRejectStatus({ statementId: this.data.statementId, rejectReason, confirm: false }).then(res => {
				if (!res.success) {
					return;
				}
				this.$message.success('操作成功');
				this.rejectModal();
				this.doFetch();
				this.$router.back();
			});
		},
		doConfirm() {
			this.$confirm({
				title: '提交确认',
				content: '请确认结算信息无误',
				onOk: () => {
					doStatementStatus({ statementId: this.data.statementId, confirm: true }).then(res => {
						if (!res.success) {
							return Promise.reject();
						}
						this.$message.success('操作成功');
						this.doFetch();
						this.$router.back();
						return Promise.resolve();
					});
				}
			});
		},
		contractDetail() {
			this.$router.push({ path: '/center/coal/sellContract/detail', query: { id: this.data.terminalContractId } });
		},
		goback() {
			this.$router.back();
		},
		//查看附件
		handlePreview(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.fileUrl;
			}
			if (data.url) {
				url = data.url;
			} else if (data.fileUrl) {
				url = data.fileUrl;
			}
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	}
};
</script>
