<template>
	<div>
		<a-modal
			v-model="visible"
			width="1200px"
			centered
			okText="确认添加"
			@ok="okInc"
			title="选择业务线发票"
		>
			<h3 style="margin-bottom: 10px">业务线名称</h3>
			<div
				class="business-line"
				ref="businessLine"
				v-if="companyChain.length > 0 && visible"
			>
				<div
					class="actived-cover"
					:style="{ left: `${activedCoverLeft}px` }"
				></div>
				<div
					class="item cp"
					:key="index"
					v-for="(item, index) in companyChain"
					@click.stop="selectCompany"
				>
					<div class="company">
						<img
							class="company-icon"
							src="@/assets/imgs/monitoring/company-icon.png"
						/>
						<div
							class="company tc"
							v-if="item.list"
						>
							<a-dropdown class="dropdown">
								<a class="ant-dropdown-link">
									<a-tooltip
										placement="top"
										:title="curFirstCompany.name"
									>
										<p
											class="ellipsis"
											style="width: calc(100% - 20px)"
										>
											{{ curFirstCompany.name }}
										</p>
									</a-tooltip>
									<a-icon
										class="icon"
										type="down"
									/>
								</a>
								<a-menu slot="overlay">
									<a-menu-item
										:key="idx"
										v-for="(i, idx) in item.list"
										@click="selectFirstCompany(i, idx)"
									>
										<a>{{ i.name }}</a>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						</div>
						<a-tooltip
							v-else
							placement="bottom"
							:title="item.name"
						>
							<p class="tc ellipsis">
								{{ item.name }}
							</p>
						</a-tooltip>
					</div>
					<a-divider
						v-if="index < companyChain.length - 1"
						class="divider"
					/>
				</div>
			</div>
			<h3 style="margin-bottom: 20px; margin-top: 20px">发票信息</h3>
			<a-table
				:pagination="false"
				:columns="invoColumns"
				:data-source="curInvoList"
				:scroll="{ x: true }"
				rowKey="id"
			>
				<span
					slot="amount"
					slot-scope="amount"
					v-mainTip="convertCurrency(amount)"
					>¥{{ amount }}</span
				>
				<template
					slot="hasAttach"
					slot-scope="hasAttach"
				>
					<span
						class="green"
						v-if="hasAttach"
						>有</span
					>
					<span
						class="orange"
						v-if="!hasAttach"
						>无</span
					>
				</template>
				<template
					slot="fileName"
					slot-scope="fileName, record"
				>
					<a @click="handlePreview(record)">{{ fileName }}</a>
				</template>
			</a-table>
		</a-modal>
		<ChooseInvoice
			ref="ChooseInvoice"
			:selectFinancedInvoice="selectFinancedInvoice"
			@chooseFinInvo="chooseFinInvo"
		/>
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import { convertCurrency } from '@sub/utils/factory';
import ImageViewer from '@sub/components/viewer/image.vue';
import ChooseInvoice from './ChooseInvoice';
export default {
	name: 'AssetsCompanyRelationChainModal',
	props: {
		selectFinancedInvoice: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	inject: {
		API_FullBusinessLineDetailV1: { form: 'API_FullBusinessLineDetailV1', default: null }
	},
	data() {
		return {
			visible: false,
			convertCurrency,
			companyChain: [],
			contractChain: [],
			curInvoList: [],
			activedCoverLeft: 0,
			// activedCoverIndex: +this.$route.query.activedCoverIndex || 0,
			activedCoverIndex: 0,
			activedCoverMoveBaseWidth: 206,
			curFirstCompany: '',
			curFirsContract: '',
			firstCompanyIndex: 0,
			curCompany: {},
			invoColumns: [
				{ title: '发票代码', dataIndex: 'code', key: 'code' },
				{ title: '发票号码', dataIndex: 'no', key: 'no' },
				{ title: '开票日期', dataIndex: 'issuedDate', key: 'issuedDate' },
				{ title: '价税合计(元)', dataIndex: 'totalAmount', key: 'totalAmount', scopedSlots: { customRender: 'amount' } },
				{ title: '贸易合同编号', dataIndex: 'contractNo', key: 'contractNo' },
				{ title: '归属价税合计(元)', dataIndex: 'splitAmount', key: 'splitAmount', scopedSlots: { customRender: 'amount' } },
				{ title: '有无附件', dataIndex: 'hasAttach', key: 'hasAttach', scopedSlots: { customRender: 'hasAttach' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			]
		};
	},
	components: {
		ChooseInvoice,
		ImageViewer
	},
	created() {},
	methods: {
		init(id) {
			this.activedCoverIndex = 0;
			this.companyChain = [];
			this.contractChain = [];
			this.getDetail(id);
		},
		// 查看附件
		handlePreview(record) {
			this.$refs.imageViewer.showFile(record);
		},
		getDetail(id) {
			if (this.API_FullBusinessLineDetailV1) {
				this.API_FullBusinessLineDetailV1(id).then(res => {
					if (res.success) {
						this.visible = true;
						this.companyChain = res.data.companyList;
						this.contractChain = res.data.contractList;

						let params = {};
						if (this.companyChain[0].list) {
							this.curFirstCompany = this.companyChain[0].list[0];

							this.curFirsContract = this.contractChain[0].contractList[0];
						}
						this.handleActived(params);
					}
				});
			}
		},
		// 第一个公司有多个时
		selectFirstCompany(data, index) {
			if (this.firstCompanyIndex === index && this.activedCoverIndex === 0) {
				return;
			}
			this.firstCompanyIndex = index;
			// this.activedCoverLeft = this.activedCoverIndex * this.activedCoverMoveBaseWidth;
			this.activedCoverIndex = 0;
			this.curFirstCompany = data;

			this.curFirsContract = this.contractChain[0].contractList[index];
			this.handleActived();
		},
		selectCompany(e) {
			const { businessLine } = this.$refs;
			// 根据鼠标点击坐标等计算出一个合适的X轴坐标位置
			let left =
				e.clientX - businessLine.getBoundingClientRect().left - this.activedCoverMoveBaseWidth / 3 + businessLine.scrollLeft;
			if (left <= 0) {
				left = 0;
			}
			// if (left + 353 > (businessLine.offsetWidth + businessLine.scrollLeft)) {
			//   left -= 206;
			// }

			let activedCoverIndex = Math.floor(left / this.activedCoverMoveBaseWidth);
			activedCoverIndex =
				activedCoverIndex >= this.companyChain.length * 2 ? this.companyChain.length * 2 - 1 : activedCoverIndex;

			if (this.companyChain[activedCoverIndex + 1]) {
				if (activedCoverIndex === this.activedCoverIndex) {
					return;
				}
				this.activedCoverIndex = activedCoverIndex;
				this.handleActived();
				return;
			}

			activedCoverIndex -= 1;
			if (activedCoverIndex === this.activedCoverIndex) {
				return;
			}
			this.activedCoverIndex = activedCoverIndex;
			this.handleActived();
		},
		handleActived(data) {
			this.setActivedCoverLeft();
			let upCompany = this.companyChain[this.activedCoverIndex - 1] || {};
			let upContract = this.contractChain[this.activedCoverIndex - 1] || {};
			let curCompany = this.companyChain[this.activedCoverIndex];
			let curContract = this.contractChain[this.activedCoverIndex];
			if (this.activedCoverIndex === 1) {
				upCompany = this.curFirstCompany ? this.curFirstCompany : upCompany;
				upContract = this.curFirsContract ? this.curFirsContract : upContract;
			}
			if (this.activedCoverIndex === 0) {
				upCompany = {};
				upContract = {};
				curCompany = this.curFirstCompany ? this.curFirstCompany : curCompany;
				curContract = this.curFirsContract ? this.curFirsContract : curContract;
			}
			const params = {
				upCompany,
				upContract: upContract.contract ? upContract.contract : upContract,
				curCompany,
				curContract: curContract.contract ? curContract.contract : curContract,
				downCompany: this.companyChain[this.activedCoverIndex + 1],
				// downContract: this.contractChain[this.activedCoverIndex + 1],
				activedCoverIndex: this.activedCoverIndex,
				...data
			};
			this.curObj = {
				contractId: params.curContract.contractId,
				contractType: params.curContract.type,
				orderNo: params.curContract.orderNo
			};
			this.curInvoList = [];
			this.$refs.ChooseInvoice.show(this.curObj);
		},
		setActivedCoverLeft(index) {
			if (index) {
				this.activedCoverIndex = index;
			}
			this.activedCoverLeft = this.activedCoverIndex * this.activedCoverMoveBaseWidth;
		},
		okInc() {
			this.$emit('addFin', {
				curInvoList: this.curInvoList,
				...this.curObj
			});
			this.visible = false;
		},
		chooseFinInvo(data) {
			this.curInvoList = data;
		}
	}
};
</script>
<style lang="less" scoped>
.business-line {
	display: flex;
	overflow-x: auto;
	position: relative;
	padding: 5px 0px;
	.company-icon {
		display: block;
		margin: 0 auto;
		width: 44px;
		height: 44px;
	}
	.dropdown {
		position: relative;
		z-index: 1;
		.icon {
			position: relative;
			top: -5px;
		}
	}
	.actived-cover {
		position: absolute;
		width: 353px;
		height: 75px;
		top: 0px;
		background: rgba(0, 83, 219, 0.08);
		border-radius: 4px;
		// pointer-events: none;
	}
	.divider {
		width: 50px;
		min-width: 50px;
		margin-right: 3px;
		margin-left: 3px;
		background: #dddfe4;
	}
	.item {
		display: flex;
	}
	.company {
		width: 150px;
		padding: 0px 3px;
		p {
			position: relative;
			z-index: 1;
			width: 100%;
		}
	}
}
</style>
