<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">云票开立申请</span>
			</div>

			<div class="new-detail-content">
				<div class="slTitleAssis">资产信息</div>
				<a-row>
					<a-table
						class="new-table"
						rowKey="serialNo"
						:columns="rongzi"
						:dataSource="rongziDataSource"
						:pagination="false"
						:scroll="{ x: true }"
						:defaultExpandAllRows="true"
					>
						<div
							slot="serialNo"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="openAssets(record)"
								>{{ text }}</a
							>
						</div>
					</a-table>
				</a-row>
				<a-row style="margin: 30px 0">
					<a-col :span="12"> 承诺付款日：{{ detailData.receivalVO && detailData.receivalVO.endDate }} </a-col>
				</a-row>
			</div>
			<div class="new-detail-content">
				<div class="slTitleAssis">云票协议</div>
				<a-row>
					<a-button
						type="primary"
						ghost
						class="downbtn"
						@click="downAll"
						>下载所有协议</a-button
					>
					<a-table
						class="new-table"
						rowKey="name"
						:columns="xieyi"
						:dataSource="xieyiDataSource"
						:pagination="false"
						:defaultExpandAllRows="true"
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

			<div style="text-align: center; margin-top: 30px">
				<a-button @click="$router.back()">返回</a-button>
				<a-button
					type="primary"
					style="margin-left: 20px"
					@click="sumbitApply"
					>提交</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';

import {
	API_CounterfoilDetaildownloadFileAll,
	API_CounterfoilApplySave,
	API_GetCounterfoilApplytoSave,
	API_CounterfoilDetaildownloadFile,
	API_CounterfoilDetailViewFile
} from '@/v2/center/counterfoil/api/index.js';

export default {
	data() {
		return {
			rongziDataSource: [],
			tiexianDataSource: [],
			xieyiDataSource: [],
			fangkuanDataSource: [],
			detailData: {},
			fangkuanData: {},
			rongzi: [
				{
					title: '应付账款流水号',
					dataIndex: 'serialNo',
					scopedSlots: { customRender: 'serialNo' },
					fixed: 'left'
				},
				{
					title: '卖方名称',
					dataIndex: 'sellerName'
				},
				{
					title: '买方名称',
					dataIndex: 'buyerName'
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
				},
				{
					title: '应付账款金额（元）',
					dataIndex: 'amount'
				},
				{
					title: '应付账款起始日期',
					dataIndex: 'beginDate'
				},
				{
					title: '应付账款到期日期',
					dataIndex: 'endDate'
				}
			],
			xieyi: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '合同名称',
					dataIndex: 'typeDesc'
				},
				{
					title: '状态',
					dataIndex: 'statusDesc'
				},
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			]
		};
	},
	components: {
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.assetId = this.$route.query.id || '';
		this.getDetail();
	},
	methods: {
		sumbitApply() {
			this.$confirm({
				centered: true,
				content: '系统将对云票协议进行签章，请确保信息无误',
				okText: '确定',
				icon: 'info-circle',
				title: '确认提示',
				closable: true,
				cancelText: '取消',
				onOk: () => {
					API_CounterfoilApplySave({ assetId: this.assetId }).then(res => {
						if (res.data) {
							if (
								this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
								this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
							) {
								this.$router.push('/center/counterfoil/open/sign?id=' + res.data);
							} else {
								this.$message.success('操作成功');
								this.$router.push('/center/counterfoil/record/list');
							}
						}
					});
				},
				onCancel() {}
			});
		},
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/payable/manage/detail',
				query: {
					id: record.id,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		downPDF(record) {
			if (record.path) {
				comDownload(res, null, record.path + '.pdf');
				return;
			}
			API_CounterfoilDetaildownloadFile({
				type: record.type,
				assetId: this.assetId
			}).then(res => {
				comDownload(res, undefined, record.typeDesc + '.pdf');
			});
		},
		viewPDF(record) {
			if (record.path) {
				window.open(record.path, '_blank');
				return;
			}
			API_CounterfoilDetailViewFile({
				type: record.type,
				assetId: this.assetId
			}).then(res => {
				window.open(res.data, '_blank');
			});
		},
		downAll() {
			API_CounterfoilDetaildownloadFileAll({
				assetId: this.assetId
			}).then(res => {
				comDownload(res, undefined, `云票协议.zip`);
			});
		},
		getDetail() {
			API_GetCounterfoilApplytoSave({ assetId: this.assetId }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.rongziDataSource = [res.data.receivalVO];
					this.xieyiDataSource = res.data.assetBillFileVOList || [];
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.downbtn {
	margin-bottom: 14px;
}
.new-detail-content {
	.ant-form-item {
		display: flex;
	}
}
.slTitleAssis {
	margin-bottom: 20px;
}
</style>
