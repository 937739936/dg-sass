<template>
	<div class="slMain">
		<breadcrumb />
		<div>
			<a-card
				:bordered="false"
				class="content"
			>
				<div class="slTitle">
					<span>{{ meta.title }}</span>
				</div>
				<ContractOfflineDetail :contractInfo="data || {}" />
			</a-card>
			<a-card
				:bordered="false"
				class="content"
				style="padding-top: 0px"
			>
				<a-tabs v-model="active">
					<a-tab-pane
						key="1"
						tab="结算单信息"
					>
					</a-tab-pane>
					<a-tab-pane
						key="2"
						:tab="`结算单操作记录(${logList.length || 0})`"
					>
					</a-tab-pane>
				</a-tabs>
				<div
					style="width: 100%; padding-top: 30px"
					v-show="active == 1"
				>
					<div class="sub">
						<div class="slTitleAssis">结算信息</div>
						<SettleOfflineDetail :statementInfo="data" />
					</div>
					<div class="sub">
						<div class="slTitleAssis">附件</div>
						<fileTable
							ref="file"
							fileType="settleDefault"
							disabled
							@download="download"
							:fileData="attachmentList"
							:documentType="documentType"
						>
						</fileTable>
					</div>
				</div>
				<div
					style="width: 100%; padding-top: 30px"
					v-show="active == 2"
				>
					<a-table
						:columns="auditLogListColumns"
						class="new-table"
						:bordered="false"
						rowKey="id"
						:scroll="{ x: true }"
						:dataSource="logList"
						:pagination="false"
					>
					</a-table>
				</div>
			</a-card>
		</div>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import fileTable from '@/v2/components/fileTable/FileTableNew';
import comDownload from '@sub/utils/comDownload.js';
import ContractOfflineDetail from './components/ContractOfflineDetail';
import SettleOfflineDetail from './components/SettleOfflineDetail';
import { filesColumns, auditLogListColumns } from './columns/columns.js';
import { API_OffinleStatementDetail, API_DownloadSettleFiles } from '@/v2/center/trade/api/settle';
export default {
	components: {
		breadcrumb,
		SettleOfflineDetail,
		ContractOfflineDetail,
		fileTable
	},
	data() {
		let { meta, query } = this.$route;
		return {
			filesColumns,
			auditLogListColumns,
			id: query?.id,
			meta, //获取title
			data: {}, //数据信息
			active: '1', //默认展示的信息，结算
			documentType: [{ type: 'JSD', required: true, typeName: '线下贸易结算单' }], //附件种类
			//结算单信息
			statementInfo: {},
			form: this.$form.createForm(this)
		};
	},
	watch: {},
	computed: {
		//附件信息
		attachmentList() {
			return this.data.attachmentList || [];
		},
		//操作日志
		logList() {
			return this.data.logList || [];
		}
	},
	async beforeRouteEnter(to, from, next) {
		let { query, meta } = to;
		let { id } = query;
		let { type } = meta;
		if (id) {
			let res = await API_OffinleStatementDetail({ statementId: id });
			if (res.success) {
				let data = res.data;
				let orderType = data.type;
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
		}
	},
	async created() {
		//详情
		// await this.getDetail();
	},
	async mounted() {},
	methods: {
		//获取详情
		getDetail() {
			API_OffinleStatementDetail({ statementId: this.id }).then(res => {
				this.data = res.data;
			});
		},
		//设置详情
		setDetail(data) {
			this.data = data;
		},
		//下载
		download() {
			let id = this.id;
			API_DownloadSettleFiles({ statementId: id }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
	.content {
		padding: 30px;
		margin-bottom: 20px;
		&:last-child {
			margin: 0;
		}
		.slTitle {
			color: rgba(0, 0, 0, 0.8);
			font-size: 24px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			margin-bottom: 30px;
		}
	}

	.submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		text-align: center;
		z-index: 100;
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
.modalBack {
	.textarea {
		width: 450px;
		height: 150px !important;
		font-size: 14px;
		line-height: 20px;
		padding: 16px 14px;
		background: #f3f5f6;
		color: rgba(0, 0, 0, 0.8);

		&::-webkit-input-placeholder {
			color: #8191a9;
		}
	}
}
</style>
