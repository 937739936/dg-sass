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
				<span>线下运输结算单详情</span>
			</div>
			<div class="slTitleAssis">合同信息</div>
			<ul class="grid-wrap">
				<li>
					<span class="label">合同编号</span>
					<span
						class="contract-number"
						@click="contractDetail"
						>{{ contractForm.paperContractNo }}</span
					>
				</li>
				<li>
					<span class="label">合同有效期</span>
					<span>{{ contractForm.execDateStart }} - {{ contractForm.execDateEnd }}</span>
				</li>
				<li>
					<span class="label">托运人</span>
					<span>{{ VUEX_ST_COMPANYSUER.companyName }}</span>
				</li>
				<li>
					<span class="label">承运人</span>
					<span>{{ contractForm.consigneeCompanyName }}</span>
				</li>
				<li>
					<span class="label">起运地点</span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>{{ contractForm.origin }}</span>
						</template>
						<span>{{ contractForm.origin }}</span>
					</a-tooltip>
				</li>
				<li>
					<span class="label">目的地点</span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>{{ contractForm.destination }}</span>
						</template>
						<span>{{ contractForm.destination }}</span>
					</a-tooltip>
				</li>
			</ul>
			<div class="slTitleAssis">结算信息</div>
			<ul class="grid-wrap grid-wrap-settle">
				<li>
					<span class="label">运输单号</span>
					<span>{{ settleForm.serialNo || '-' }}</span>
				</li>
				<li>
					<span class="label">结算金额</span>
					<span>{{ settleForm.settleAmount }}</span>
				</li>
				<li>
					<span class="label">结算数量(吨)</span>
					<span>{{ settleForm.settleQuantity }}</span>
				</li>
				<li>
					<span class="label">结算日期</span>
					<span>{{ settleForm.statementTime }}</span>
				</li>
			</ul>
			<div class="slTitleAssis">附件信息</div>
			<a-table
				:columns="attachmentColumns"
				:data-source="fileDataSource"
				:pagination="false"
				bordered
				rowKey="id"
				class="new-table attach-info-wrap"
			>
				<template
					slot="fileName"
					slot-scope="action, record"
				>
					<a @click.prevent="handlePreview(record)">{{ record.fileName }}</a>
				</template>
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a
						@click.prevent="download(record.fileUrl, record.fileName)"
						style="padding-left: 10px"
						>下载</a
					>
				</template>
			</a-table>
		</a-card>
		<image-viewer ref="imageViewer" />
	</div>
</template>
<script lang="jsx">
import { filePreview } from '@/v2/utils/file';
import moment from 'moment';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_transport_settle_details } from '@/v2/center/trade/api/transportContract';
import { mapGetters } from 'vuex';
import { API_GETCURRENTENV, API_DOWNLPREVIEWTE } from '@/v2/center/trade/api/settle';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';

const attachmentColumns = [
	{
		title: '文件类型',
		key: 'typeName',
		dataIndex: 'typeName',
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
		title: '文件名称',
		key: 'fileName',
		dataIndex: 'fileName',
		scopedSlots: { customRender: 'fileName' }
	},
	{
		title: '上传时间',
		key: 'uploadTime',
		dataIndex: 'uploadTime'
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验结算单价、结算数量
			let regs2 = rule.point == 2 ? /^\d+(\.\d{0,2})?$/ : /^\d+(\.\d{0,4})?$/;
			if (value <= 0) {
				return callback(new Error('数值不能为0'));
			}
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};

		return {
			attachmentColumns,
			addRules: {
				type: [{ required: true, message: '请选择结算单类型', trigger: 'change' }],
				paperContractNo: [{ required: true, message: '请选择合同', trigger: 'change' }]
			},
			contractForm: {
				type: 'BUY',
				paperContractNo: ''
			},
			contractData: null,
			settleForm: {},
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			settleRules: {
				statementTime: [{ required: true, message: '请选择结算日期', trigger: 'change' }, { validator: this.statementTime }],
				date: [{ required: true, message: '请选择供货周期', trigger: 'change' }],
				settleAmount: [
					{ required: true, message: '请输入结算金额', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						point: 2,
						msg: '请输入最多两位小数'
					}
				],
				settleQuantity: [
					{ required: true, message: '请输入结算数量', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						max: 1000000000,
						point: 4,
						msg: '请输入大于0小于999999999.9999的数,最多四位小数'
					}
				]
			},
			detailData: {},
			contractDisabled: false,
			statementTimeDevMax: false, //结算日期是否大于30天
			supplyDateDevMax: false, //供货周期与系统时间是否大于60天
			supplyDateLengthMax: false //供货周期是否大于60天
		};
	},
	components: {
		Breadcrumb,
		imageViewer
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	created() {},
	mounted() {
		// 编辑
		if (this.$route.query.statementId) {
			this.getDetail();
		}
		if (this.$route.query.contractNo) {
			// 如果是从业务动态监控的补录结算单入口进来，则合同信息直接反显，禁止修改
			this.contractForm.type = this.$route.query.statementType;
			this.contractDisabled = true;
		}
	},
	methods: {
		moment,
		mergeCells(text, data, key, index) {
			// 上一行该列数据是否一样
			if (index !== 0 && text === data[index - 1][key]) {
				return 0;
			}
			let rowSpan = 1;
			// 判断下一行是否相等
			for (let i = index + 1; i < data.length; i++) {
				if (text !== data[i][key]) {
					break;
				}
				rowSpan++;
			}
			return rowSpan;
		},
		handlePreview(item) {
			filePreview(item.fileUrl, this.$refs.imageViewer.show);
		},
		download(url, name) {
			API_DOWNLPREVIEWTE(API_GETCURRENTENV(url)).then(res => {
				comDownload(res, null, name);
			});
		},
		getDetail() {
			API_transport_settle_details({
				statementId: this.$route.query.statementId
			}).then(res => {
				this.contractForm = res.data.offlineTransportContractVO;
				this.settleForm = res.data.terminalStatementVO;
				this.fileDataSource = res.data.terminalStatementVO?.attachmentList || [];
				this.fileDataSource = TableRowSpanFunc(this.fileDataSource, 'typeName');
				const { execDateStart, execDateEnd } = res.data.offlineTransportContractVO;
				if (execDateStart && execDateEnd) {
					this.$set(this.settleForm, 'date', [moment(execDateStart), moment(execDateEnd)]);
				}
			});
		},
		contractDetail() {
			let routeUrl = this.$router.resolve({
				path: `/center/contract/transport/detail`,
				query: {
					id: this.contractForm.id
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		//结算日期校验
		statementTime(rule, value, callback) {
			//contractId合同ID，statementTime结算日期，serialNo结算单号，statementId结算单ID
			callback();
		},
		disabledDate(current) {
			// 结算日起不可选未来日期
			return current && current > moment().endOf('day');
		},
		goback() {
			this.$router.back();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
@import url('~@/v2/style/grid-wrap.less');
</style>
<style lang="less" scoped>
.ant-card-bordered {
	border: none;
}

.contract-detail {
	padding: 0 20px;
	.ant-col {
		margin-bottom: 15px;
	}
}
.ant-calendar-picker {
	width: 100%;
}
.order-wrap {
	::v-deep.ant-calendar-picker {
		width: auto;
	}
}
.custom-main-content-inner {
	margin-top: -20px;
}
.col-padding-left {
	padding-left: 80px;
}
.grid-wrap-settle {
	li:nth-of-type(1) {
		width: 99.9%;
		border-bottom: 0;
		box-sizing: border-box;
	}
	li:nth-of-type(4) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-of-type(3) {
		border-radius: 0;
	}
}
.attach-info-wrap {
	margin-top: 20px;
	/deep/.ant-table-tbody > tr > td {
		border-bottom: 1px solid #e8e8e8;
	}
	/deep/ .ant-table-tbody > tr:last-child td:first-child {
		border-radius: 0;
	}
}
</style>
