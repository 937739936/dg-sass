<template>
	<div
		class="new-detail"
		style="width: 100%"
	>
		<div class="new-detail-content detail-form">
			<h2>追保信息</h2>
			<a-row class="df">
				<a-form-item label="保证金比例(%)">
					<div
						class="fake-ipt"
						disabled
					>
						{{ info.bondRatio }}
					</div>
				</a-form-item>
				<a-form-item label="保证金金额">
					<div class="fake-ipt">{{ info.bondAmount }}</div>
				</a-form-item>
				<a-form-item label="网价参考来源">
					<div class="fake-ipt">{{ info.marketPriceSourceDesc }}</div>
				</a-form-item>
			</a-row>
			<a-row
				class="df"
				v-if="info.marketPriceSource == 'MYSTEEL_COM'"
			>
				<a-form-item label="市场价格下跌幅度设置(%)">
					<div
						class="fake-ipt"
						disabled
					>
						{{ info.marketPriceDownRatio }}
					</div>
				</a-form-item>
				<a-form-item label="网价涨跌幅度(元/吨)">
					<div class="fake-ipt">{{ info.marketPriceFloatTypeDesc }}{{ info.marketPriceFloatAmount }}</div>
				</a-form-item>
				<a-form-item label="预警通知人员">
					<a-textarea
						class="ipt"
						style="height: 40px"
						disabled
						v-model="bondLetterLinkmanList"
						>{{ bondLetterLinkmanList }}</a-textarea
					>
				</a-form-item>
				<a-form-item label="销售基准价格">
					<div class="fake-ipt">{{ info.baseUnitPrice }}</div>
				</a-form-item>
			</a-row>
			<a-table
				:pagination="false"
				v-if="info.marketPriceSource == 'MYSTEEL_COM'"
				class="new-table"
				:columns="columns"
				:data-source="info.marketPrice"
				:scroll="{ x: true }"
				rowKey="id"
			>
				<template
					slot="raise"
					slot-scope="text, record"
				>
					<div
						style="color: #45bf83"
						v-if="record.raise < 0"
						s
					>
						<img
							class="up"
							src="../../assets/imgs/storage/down.png"
							alt=""
						/>
						{{ record.raise }}
					</div>
					<div
						style="color: #dd4444"
						v-else-if="record.raise > 0"
					>
						<img
							class="up"
							src="../../assets/imgs/storage/up.png"
							alt=""
						/>
						+{{ record.raise }}
					</div>
					<div v-else>-</div>
				</template>
			</a-table>
			<h2>追保记录</h2>
			<a-table
				:pagination="false"
				class="new-table"
				:columns="additionalMarginColumns"
				:data-source="bondLetterList"
				:scroll="{ x: true }"
				rowKey="id"
			>
				<div
					slot="action"
					slot-scope="action, items"
					style="display: flex"
				>
					<a
						href="javascript:;"
						@click="openPdf(items)"
						>查看</a
					>
				</div>
			</a-table>
		</div>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
const columns = [
	{ title: '来源', dataIndex: 'sourceFromDesc', key: 'sourceFromDesc' },
	{ title: '日期', dataIndex: 'date', key: 'date' },
	{ title: '时间', dataIndex: 'time', key: 'time' },
	{ title: '区域', dataIndex: 'area', key: 'area' },
	{ title: '钢材种类', dataIndex: 'steelType', key: 'steelType' },
	{ title: '品名', dataIndex: 'materialName', key: 'materialName' },
	{ title: '规格', dataIndex: 'specs', key: 'specs' },
	{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
	{ title: '钢厂/产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin' },
	{ title: '价格(元/吨)', dataIndex: 'unitPrice', key: 'unitPrice' },
	{ title: '涨跌(元/吨)', dataIndex: 'raise', key: 'raise', scopedSlots: { customRender: 'raise' } },
	{ title: '备注', dataIndex: 'note', key: 'note', fixed: 'right' }
];
const additionalMarginColumns = [
	{
		title: '追保函编号',
		dataIndex: 'serialNo'
	},
	{
		title: '买方名称',
		dataIndex: 'buyCompanyName'
	},
	{
		title: '追保金额',
		dataIndex: 'amount'
	},
	{
		title: '已追保金额',
		dataIndex: 'bondAmount'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc'
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		scopedSlots: {
			customRender: 'action'
		},
		algin: 'right',
		fixed: 'right'
	}
];
export default {
	props: {
		info: {
			default: () => {}
		},
		ENV: {
			default: () => {}
		},
		type: {
			default: 'rest'
		},
		bondLetterList: {
			default: () => []
		}
	},
	computed: {
		bondLetterLinkmanList() {
			let str = '';
			const list = this.info.bondLetterLinkmanList || [];
			list.forEach(el => {
				str += `${el.noticeName}-${el.noticePhone},`;
			});
			return str;
		},
		domainUrl() {
			if (this.type == 'rest') {
				return this.ENV.BASE_NET;
			}
			return this.ENV.VUE_APP_BASEURL + '/';
		}
	},
	data() {
		return {
			columns,
			additionalMarginColumns,
			previewImg: ''
		};
	},
	methods: {
		// 查看
		view(item) {
			this.previewImg = item.filePath;
			this.$refs.viewer.$viewer.show();
		},
		openPdf(item) {
			window.open(item.pdfPath, '_blank');
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.df {
	display: flex;
	flex-wrap: wrap;
	::v-deep .ant-form-item {
		width: 33%;
	}
}
.ipt {
	width: 364px;
	height: 40px;
	background: #f0f3fb;
	border-radius: 6px;
	font-size: 14px;
	color: #8495aa;
	border: 0;
}
.fake-ipt {
	width: 364px;
	height: 40px;
	background: #f0f3fb;
	border-radius: 6px;
	font-size: 14px;
	color: #8495aa;
	border: 0;
	padding: 4px 11px;
	display: flex;
	align-items: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
