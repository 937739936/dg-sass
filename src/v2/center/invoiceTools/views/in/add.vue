<template>
	<div class="wrapper">
		<a-alert
			class="a-alert"
			v-if="!invoiceInfoList.length"
			type="info"
			show-icon
		>
			<template slot="message">
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col>
						如识别当天的发票，请确保开票方开票时没有采用离线开票的方式，当天开具的发票存在无法识别的情况，建议第二天再上传。
					</a-col>
				</a-row>
			</template>
		</a-alert>
		<a-alert
			class="a-alert"
			v-else
			type="error"
			show-icon
		>
			<template slot="message">
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col
						v-for="item in invoiceInfoList"
						:key="item.id"
					>
						发票号码：{{ item.invoiceNo }}对应的发票信息已存在，保存以上发票图片附件将自动关联发票信息
					</a-col>
				</a-row>
			</template>
		</a-alert>
		<a-card :bordered="false">
			<template v-if="step == 1">
				<p class="title">新增发票</p>
				<a-row
					type="flex"
					justify="space-between"
					style="padding: 15px 0"
				>
					<a-col>
						<span class="label">添加方式</span>
						<a-radio-group
							v-model="curModel"
							button-style="solid"
						>
							<a-radio-button :value="1"> 发票图片识别 </a-radio-button>
							<a-radio-button :value="2">
								Excel导入上传
								<!-- 发票四要素识别 -->
							</a-radio-button>
						</a-radio-group>
					</a-col>
					<a-col
						class="des"
						v-if="curModel == 2"
					>
						<p class="title">操作要求：</p>
						<p>1.该功能仅支持上传Excel文件（*.xls、*.xlsx），请下载模板填写后上传。</p>
						<p>2.请务必将必填字段填写准确完整，否则可能识别、添加失败。</p>
					</a-col>
				</a-row>
			</template>

			<PictureInvoice
				location="add"
				ref="pictureInvoice"
				v-show="curModel == 1"
				:type="invoiceType"
				@changeStep="changeStep2"
			></PictureInvoice>
			<ExcelInvoice
				v-show="curModel == 2"
				:type="invoiceType"
				@changeStep="changeStep"
			></ExcelInvoice>
		</a-card>
	</div>
</template>

<script>
import { API_InvoiceDelImgScanCache } from '@/v2/center/invoiceTools/api';
import PictureInvoice from '../../components/PictureInvoice.vue';
import ExcelInvoice from '../../components/ExcelInvoice.vue';

export default {
	props: {
		type: {
			type: String,
			default: ''
		},
		isMonitoring: {
			type: String,
			default: ''
		}
	},
	computed: {
		invoiceType() {
			return this.$route.query.type;
		}
	},
	components: {
		PictureInvoice,
		ExcelInvoice
	},
	data() {
		return {
			title: {
				buy: '进项发票',
				sell: '销项发票',
				freight: '运费发票'
			},
			curModel: 1,
			step: 1,
			previewImg: '',
			fileListinvoiceImg: [],
			invoiceInfoList: []
		};
	},
	created() {
		// 及时清除图片发票识别的缓存数据
		API_InvoiceDelImgScanCache().then(() => {});
	},
	methods: {
		changeStep(v) {
			this.step = v;
		},
		changeStep2(v) {
			this.invoiceInfoList = [];
			if (this.$refs.pictureInvoice) {
				this.invoiceInfoList = this.$refs.pictureInvoice.invoiceImgList.filter(el => el.id && el.result == 'PASS');
			}
			this.step = v;
		}
	}
};
</script>
<style lang="less" scoped>
.title {
	font-size: 12px;
	color: #383a3f;
	text-align: left;
	line-height: 18px;
}
.label {
	padding-right: 56px;
	font-size: 12px;
	color: #383a3f;
	text-align: left;
}
::v-deep {
	.example,
	.ant-upload.ant-upload-select-picture-card,
	.ant-upload-list-picture-card-container,
	.ant-upload-list-item-list-type-picture-card {
		width: 240px;
		height: 150px;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-card-head-title:before {
		position: absolute;
		content: '';
		display: block;
		width: 2px;
		height: 15px;
		background: #0053db;
		top: 21px;
		left: 0;
	}
}
.des {
	font-size: 12px;
	color: #6b6f76;
	line-height: 20px;
}
.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
::v-deep .ant-alert-info .ant-alert-icon {
	color: #0053db;
}
.invoice-img {
	img {
		cursor: pointer;
		width: 240px;
		height: 150px;
	}
}
.excels-upload {
	position: relative;
	> .down-file {
		position: absolute;
		top: 6px;
		left: 120px;
	}
}
</style>
