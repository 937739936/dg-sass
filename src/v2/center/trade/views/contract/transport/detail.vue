<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>线下运输合同详情</span>
			</div>
			<div>
				<div class="slTitleAssis">合同信息</div>
				<ul class="grid-wrap">
					<li>
						<span class="label">业务线关联</span>
						<span>{{ detailsData.businessLineNo }}</span>
					</li>
					<li>
						<span class="label">承运人</span>
						<span>{{ detailsData.consigneeCompanyName }}</span>
					</li>
					<li>
						<span class="label">托运人</span>
						<span>{{ VUEX_ST_COMPANYSUER.companyName }}</span>
					</li>
					<li>
						<span class="label">合同编号</span>
						<span>{{ detailsData.paperContractNo }}</span>
					</li>
					<li>
						<span class="label">合同有效期</span>
						<span>{{ detailsData.execDateStart }}-{{ detailsData.execDateEnd }}</span>
					</li>
					<li>
						<span class="label">合同类型</span>
						<span>{{ detailsData.contractTermTypeDesc }}</span>
					</li>
					<li>
						<span class="label">合同签约状态</span>
						<span>{{ detailsData.signStatusDesc }}</span>
					</li>
					<li>
						<span class="label">签订日期</span>
						<span>{{ detailsData.contractSignTime }}</span>
					</li>
					<li>
						<span class="label">运输公司收款账户</span>
						<span>{{ detailsData.receivableAccountBank }}-{{ detailsData.receivableAccountNo }}</span>
					</li>
					<template v-if="detailsData.contractExtendInfo">
						<li>
							<span class="label">业务负责人</span>
							<span
								>{{ detailsData.contractExtendInfo.businessDirectorUnitName }}-{{
									detailsData.contractExtendInfo.businessDirectorName
								}}-{{ detailsData.contractExtendInfo.businessDirectorMobile }}</span
							>
						</li>
						<li>
							<span class="label"></span>
							<span></span>
						</li>
						<li>
							<span class="label"></span>
							<span></span>
						</li>
					</template>
				</ul>
			</div>
			<div>
				<div class="slTitleAssis">运输信息</div>
				<ul class="grid-wrap">
					<li>
						<span class="label">运输方式</span>
						<span>{{ detailsData.transportModeDesc }}</span>
					</li>
					<li>
						<span class="label">起运地</span>
						<span>{{ detailsData.origin }}</span>
					</li>
					<li>
						<span class="label">目的地</span>
						<span>{{ detailsData.destination }}</span>
					</li>
					<li>
						<span class="label">合同价格（元/吨）</span>
						<span>{{ detailsData.contractPrice }}</span>
					</li>
					<li>
						<span class="label">运输吨数</span>
						<span>{{ detailsData.contractQuantity || '-' }}</span>
					</li>
					<li>
						<span class="label"></span>
						<span></span>
					</li>
				</ul>
			</div>
			<div>
				<div class="slTitleAssis">
					合同附件
					<a-button
						type="primary"
						ghost
						class="slBtn"
						style="margin-left: 30px"
						@click="downFile"
						>一键下载</a-button
					>
				</div>
				<div class="table-box">
					<a-table
						:columns="columns"
						class="new-table"
						:bordered="true"
						rowKey="id"
						:dataSource="dataFiles"
						:pagination="false"
					>
						<template
							slot="name"
							slot-scope="text, items"
						>
							<a-space :size="20">
								<a
									href="javascript:;"
									@click="viewContractDetail(items)"
									>{{ items.name }}</a
								>
							</a-space>
						</template>
						<template
							slot="action"
							slot-scope="text, items"
						>
							<a-space :size="20">
								<a
									href="javascript:;"
									@click="downloadPdf(items)"
									>下载</a
								>
							</a-space>
						</template>
					</a-table>
				</div>
			</div>
		</a-card>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import { mapGetters } from 'vuex';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_contractDetail, API_downloadAllTransContractAttachment } from '@/v2/center/trade/api/transportContract';
import comDownload from '@sub/utils/comDownload.js';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { API_DOWNLPREVIEWTE, API_GETCURRENTENV } from '@/v2/center/assets/api/index.js';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';

export default {
	data() {
		return {
			columns: [
				{
					title: '单据类型',
					dataIndex: 'typeName',
					key: 'typeName',
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeNameRowSpan
							}
						};
					}
				},
				{
					title: '文件名',
					dataIndex: 'name',
					key: 'name',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '上传时间',
					dataIndex: 'uploadTime',
					key: 'uploadTime'
				},
				{
					title: '操作',
					dataIndex: 'action',
					key: 'action',
					scopedSlots: { customRender: 'action' }
				}
			],
			dataFiles: [],
			detailsData: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	components: {
		Breadcrumb,
		imageViewer
	},
	mounted() {
		this.getDetailsData();
	},
	methods: {
		viewContractDetail(item) {
			filePreview(item.url, this.$refs.imageViewer.show);
		},
		downloadPdf(items) {
			API_DOWNLPREVIEWTE(API_GETCURRENTENV(items.url)).then(res => {
				comDownload(res, null, items.name);
			});
		},
		downFile() {
			let zipFileName =
				this.detailsData.consigneeCompanyName +
				'_' +
				this.detailsData.consignorCompanyName +
				'_' +
				this.detailsData.paperContractNo +
				'_' +
				this.detailsData.contractSignTime +
				'.zip';
			//压缩包命名规则：承运人_托运人_合同编号_签订日期
			API_downloadAllTransContractAttachment({ id: this.detailsData.id }).then(res => {
				comDownload(res, undefined, zipFileName);
			});
		},
		getDetailsData() {
			API_contractDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detailsData = res.data;
					this.dataFiles = TableRowSpanFunc(res.data.contractAttachment, 'typeName');
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
.slTitle {
	height: 45px;
	border-bottom: 1px solid #e5e6eb;
	box-sizing: border-box;
}
.grid-wrap {
	margin-top: 20px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}
.table-wrap {
	margin-top: 20px;
}
.new-table {
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		height: 48px;
	}
	/deep/ .ant-table-tbody > tr:first-child > td:first-child {
		height: 48px;
	}
	/deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
		background: #fff !important;
	}
}
</style>
