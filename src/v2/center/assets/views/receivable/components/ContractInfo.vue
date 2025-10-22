<template>
	<div>
		<p class="title">下游合同信息</p>
		<div
			class="slTitleThird"
			style="margin-top: 0"
		>
			<span class="sub-title sub-title2">合同详情</span>
			<a-button
				type="primary"
				ghost
				class="slBtn"
				v-if="isShowBtn"
				@click="goEditContract"
				style="margin-left: 25px"
			>
				{{ contractInfo.id ? ' 编辑下游合同信息/附件' : ' 新增下游合同信息' }}
			</a-button>
		</div>
		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item label="卖方企业">{{ contractInfo.sellerName || '-' }}</a-descriptions-item>
			<a-descriptions-item label="买方企业">{{ contractInfo.buyerName || '-' }}</a-descriptions-item>
			<a-descriptions-item label="合同编号">
				<a
					href="javascript:;"
					v-if="contractInfo.contractNo"
					@click="goDetail"
					>{{ contractInfo.contractNo || '-' }}</a
				>
				<span v-else>-</span>
			</a-descriptions-item>
			<a-descriptions-item label="合同金额">
				<span v-if="detailInfo.totalPrice">
					{{ detailInfo.totalPrice && detailInfo.totalPrice != 0 ? formatMoney(detailInfo.totalPrice) + '元' : '-' }}</span
				>
				<span v-else>-</span>
			</a-descriptions-item>
			<a-descriptions-item label="签订日期">{{ contractInfo.signDate || '-' }}</a-descriptions-item>
			<a-descriptions-item label="合同执行期"
				>{{ contractInfo.execDateStart }} - {{ contractInfo.execDateEnd }}</a-descriptions-item
			>
			<a-descriptions-item
				label="签订状态"
				v-if="contractInfo.signStatus"
				>{{ contractInfo.signStatus == 2 ? '双签' : '单签' }}</a-descriptions-item
			>
			<a-descriptions-item
				label="双签合同日期"
				v-if="contractInfo.signStatus == 2"
				>{{ contractInfo.doubleSignRecvDate || '-' }}</a-descriptions-item
			>
			<a-descriptions-item label="标的货物名称">{{ detailInfo.goodsName || '-' }}</a-descriptions-item>
			<a-descriptions-item label="单价">{{ detailInfo.price ? formatMoney(detailInfo.price) + '元' : '-' }}</a-descriptions-item>
			<a-descriptions-item label="数量">{{
				detailInfo.quantity ? formatMoney(detailInfo.quantity) + '元/吨' : '-'
			}}</a-descriptions-item>
		</a-descriptions>
		<template v-if="contractInfo.acctBankBranch && contractInfo.acctBankName && contractInfo.acctNo">
			<div class="slTitleThird sub-title">回款账户信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="回款账号">{{ contractInfo.acctNo || '-' }}</a-descriptions-item>
				<a-descriptions-item label="回款账号开户行">{{ contractInfo.acctBankBranch || '-' }}</a-descriptions-item>
				<a-descriptions-item label="回款账号开户名">{{ contractInfo.acctBankName || '-' }}</a-descriptions-item>
			</a-descriptions>
		</template>

		<!-- 合同附件 -->
		<div
			class="slTitleThird"
			style="margin-top: 30px"
			v-if="contractInfo.list.length"
		>
			<span class="sub-title">合同附件</span>
		</div>
		<div
			class="table-box"
			v-if="contractInfo.contractType != 'DOWN' && contractInfo.list.length"
		>
			<a-table
				:columns="onlineColumns"
				class="new-table"
				:bordered="false"
				:rowKey="(r, index) => index"
				:dataSource="contractInfo.list"
				:pagination="false"
			>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
						<a
							href="javascript:;"
							@click="handlePreview(items)"
							v-if="items.path"
							>查看</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
		<div
			class="table-box"
			v-if="contractInfo.contractType == 'DOWN' && contractAttachment.length"
		>
			<a-table
				:columns="offlineColumns"
				class="new-table new-table2"
				:bordered="false"
				:rowKey="(r, index) => index"
				:dataSource="contractAttachment"
				:pagination="false"
			>
				<template
					slot="fileList"
					slot-scope="text, record"
				>
					<span class="preview-box">
						<a-tooltip
							v-for="(item, i) in record.fileList"
							:key="i"
						>
							<a
								href="javascript:;"
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}
							</a>
						</a-tooltip>
					</span>
				</template>
			</a-table>
		</div>
		<!-- v-if="isShowSupp" -->
		<div
			class="slTitleThird"
			style="margin-top: 30px"
			v-if="isShowSupp"
		>
			<span class="sub-title">补充协议</span>
		</div>
		<div
			style="margin-top: 20px"
			v-if="isShowSupp"
		>
			<SuppleAgree
				ref="suppleAgree"
				@handlePreview="handlePreview"
				handleType="detail"
			></SuppleAgree>
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import ImageViewer from '@sub/components/viewer/image.vue';
import SuppleAgree from '../components/SuppleAgree.vue';
const onlineColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc' },
	{ title: '文件名称', dataIndex: 'name' },
	{ title: '文件转换名称', dataIndex: 'transferName' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];
const offlineColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
	// { title: "操作", dataIndex: "action",scopedSlots: { customRender: "action" },width: '15%',align:'center'},
];
export default {
	props: {
		// 判断当前是否复用合同
		poolReuse: {
			default: 1
		},
		buyerName: {
			default: ''
		},
		buyerUscc: {
			default: ''
		}
	},
	data() {
		return {
			contractInfo: {
				list: [],
				deliveryList: [],
				poolContractDetail: {}
			},
			offlineColumns,
			onlineColumns,
			detailInfo: {},
			// 回款信息
			isShowSupp: false
		};
	},
	computed: {
		// 线下 附件列表
		contractAttachment() {
			const obj = {};
			const list = this.contractInfo.list || [];
			list.forEach(el => {
				if (!obj[el.type]) {
					obj[el.type] = { fileList: [], typeDesc: el.typeDesc, type: el.type };
				}
				obj[el.type].fileList.push(el);
			});
			const contractAttachment = [];
			for (let k in obj) {
				contractAttachment.push(obj[k]);
			}
			return contractAttachment;
		},
		isShowBtn() {
			// 复用合同
			if (this.poolReuse == 1) {
				// 线上隐藏 线下显示
				return this.contractInfo.contractType == 'DOWN';
			}
			if (this.poolReuse === 0) {
				return true;
			}
			return false;
		}
	},
	methods: {
		formatMoney,
		init(info) {
			this.contractInfo = info;
			this.detailInfo = info.goodsVOList ? info.goodsVOList[0] : {};
			let supplementalInfo = info.supplementalInfo || [];
			this.isShowSupp = !!supplementalInfo.length;
			// 补协
			this.$nextTick(() => {
				if (this.isShowSupp) {
					this.$refs.suppleAgree.init(this.contractInfo);
				}
			});
		},
		// 去往合同详情
		goDetail() {
			let path = `/center/contract/sell/online/detail?id=${this.contractInfo.orderId}&type=SELL`;
			if (this.contractInfo.contractType == 'DOWN') {
				path = `/center/contract/sell/offline/detail?id=${this.contractInfo.id}&type=sell`;
			}

			const routeData = this.$router.resolve({
				path
			});

			window.open(routeData.href, '_blank');
		},
		// 去往合同编辑或者新增
		goEditContract() {
			// 编辑
			let path = `/center/contract/sell/offline/add`;
			let query = {
				id: this.contractInfo.id,
				type: 'sell',
				source: 'receivable',
				manuaId: this.$route.query.id
			};
			// 新增
			if (this.poolReuse == 0 && !this.$route.query.id) {
				query = {
					type: 'sell',
					source: 'receivable',
					buyerName: this.buyerName,
					manuaId: '',
					id: this.contractInfo.id,
					poolReuse: this.poolReuse
				};
			}
			// const routeData = this.$router.resolve({
			//   path,
			//   query,
			// })
			this.$router.push({ path, query });

			// window.open(routeData.href, '_blank')
		},
		// 电子合同查看
		viewContractDetail(record) {
			// 电子合同 查看-跳转到合同详情
			let routeUrl = this.$router.resolve({
				path:
					this.type == 'rest'
						? `/center/contract/${this.contractType.toLowerCase()}/agreement/pdf/detail`
						: '/sys/contract/preview',
				query: {
					contractNo: this.contractInfo.contractNo,
					contractId: this.contractInfo.id,
					zipFileName:
						this.contractInfo.contractNo + '-' + this.contractInfo.sellerName + '-' + this.contractInfo.buyerName + '.zip',
					no: record.no,
					newTab: 'newTab'
				}
			});

			window.open(routeUrl.href, '_blank');
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path;
			if (!url) {
				return;
			}
			console.log(url);
			this.$refs.imageViewer.showFile(url);
		}
	},
	components: {
		SuppleAgree,
		ImageViewer
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 30px;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 104px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
	}
}
.sub-title {
	font-family: PingFangSC-Medium;
	position: relative;
	margin-left: 10px;
	&:before {
		content: '';
		float: left;
		position: absolute;
		left: -10px;
		top: 3px;
		width: 4px;
		height: 14px;
		background: @primary-color;
	}
}
.sub-title2 {
	&:before {
		// margin-top: 10px;
	}
}
.title {
	font-family: PingFangSC-Medium;
	padding-left: 16px;
	text-align: left;
	line-height: 40px;
	font-size: 15px;
	height: 40px;
	background-color: rgba(0, 83, 219, 0.15);
	margin-bottom: 20px;
	color: #000;
}
</style>
