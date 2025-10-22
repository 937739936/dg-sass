<template>
	<div class="wrap">
		<div class="info-desc">
			<p class="title">基本信息</p>
			<div class="info-wrap">
				<p>登记日期：{{ detailData.invoiceCreateDate }}</p>
				<p>账务主体：{{ detailData.buyerName }}</p>
				<p>开票日期：{{ detailData.issuedDateStr }}</p>
				<p>发票类型：{{ detailData.invoiceTypeDesc }}</p>
				<p>采购合同编号：{{ detailData.contractNo }}</p>
			</div>
		</div>
		<div class="info-desc marin-top30">
			<p class="title">入账信息</p>
			<div class="info-wrap">
				<p>凭证号：{{ detailData.no }}</p>
				<p>入账月份：{{ moment(detailData.recordDate).format('YYYY年MM月') }}</p>
				<p>结算情况：{{ getStatementTypeDesc(detailData.statementType) }}</p>
				<p>备注：{{ detailData.remark }}</p>
			</div>
		</div>
		<div class="info-desc marin-top30">
			<p class="title">发票列表</p>
			<div class="info-table">
				<a-table
					:columns="columnsEntryInvoiceList"
					:data-source="detailData.invoiceList"
					:pagination="false"
					rowKey="key"
				>
					<span
						slot="action"
						slot-scope="text, scoped"
					>
						<a @click="detail(scoped)">查看</a>
					</span>
				</a-table>
			</div>
		</div>
		<div class="btn-wrap">
			<a-button
				type="primary"
				ghost
				@click="back"
				>返回</a-button
			>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import moment from 'moment';
import { columnsEntryInvoiceList } from './table';
import imageViewer from '@/v2/components/imageViewer.vue';
import { API_GET_INVOICE_ENTRY_DETAIL } from '@/v2/center/invoiceTools/api';

export default {
	data() {
		return {
			columnsEntryInvoiceList,
			detailData: {},
			plainOptionsEumn: {
				预开票: 'PRE',
				尾票: 'TAIL',
				全票: 'FULL'
			}
		};
	},
	components: {
		imageViewer
	},
	methods: {
		moment,
		getStatementTypeDesc(type) {
			for (const key in this.plainOptionsEumn) {
				if (this.plainOptionsEumn[key] == type) {
					return key;
				}
			}
		},
		detail(scoped) {
			this.$router.push({
				path: '/center/admin/invoice/in/detail',
				query: {
					id: scoped.id
				}
			});
		},
		back() {
			this.$router.back();
		},
		fetchData() {
			API_GET_INVOICE_ENTRY_DETAIL({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.detailData.invoiceList.forEach((item, index) => {
						item.key = ++index;
					});
				}
			});
		}
	},
	mounted() {
		this.fetchData();
	}
};
</script>

<style lang="less" scoped>
.title {
	width: 100%;
	height: 24px;
	font-size: 16px;
	font-family:
		PingFangSC-Medium,
		PingFang SC;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	line-height: 24px;
	padding-left: 16px;
	position: relative;
}
.title::before {
	content: '';
	width: 2px;
	height: 16px;
	background: #4682f3;
	display: inline-block;
	position: absolute;
	top: 4px;
	left: 0;
}
.info-wrap {
	width: 100%;
	height: 122px;
	background: #f5f7fd;
	border-radius: 10px;
	padding: 30px 20px 30px 30px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-top: 20px;
	p {
		width: 33.33%;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 20px;
	}
}
.marin-top30 {
	margin-top: 30px;
}
.info-table {
	margin-top: 20px;
}
.count {
	width: 100%;
	height: 20px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	font-weight: 400;
	color: #8495aa;
	margin-top: 20px;
	span {
		margin-left: 40px;
	}
}
.info-file {
	margin-top: 20px;
	img {
		width: 200px;
		height: 112px;
		display: inline-block;
		object-fit: cover;
		cursor: pointer;
	}
}
.btn-wrap {
	width: 100%;
	height: 44px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
