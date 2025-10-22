<template>
	<div>
		<a-modal
			v-model="visible"
			width="1200px"
			okText="确认添加"
			@ok="okInc"
			:title="panelType == 'contract' ? '选择业务线合同' : '选择业务线发票'"
		>
			<h3 style="margin-bottom: 10px">业务线名称</h3>
			<div
				class="business-line"
				ref="businessLine"
				v-if="companyChain.length > 0 && visible"
			>
				<div
					@click.stop
					class="actived-cover"
					:style="{ left: `${activedCoverLeft}px` }"
				></div>
				<div
					class="item cp"
					:key="index"
					v-for="(item, index) in companyChain"
					@click="selectCompany($event)"
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
								<a
									class="ant-dropdown-link"
									@click.stop
								>
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
							<p
								class="tc ellipsis"
								@click="stop($event, index)"
							>
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
			<div
				class=""
				v-if="panelType == 'contract'"
			>
				<h3 style="margin-bottom: 20px; margin-top: 20px">合同信息</h3>
				<div>
					<a-row>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">合同编号</a-col>
								<a-col :span="18">{{ curCompany.contractNo }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="8">合同金额</a-col>
								<a-col :span="16"
									><span class="red">{{ curCompany.amount }}</span
									>&nbsp;元</a-col
								>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">签订日期</a-col>
								<a-col :span="18">{{ curCompany.signDate }}</a-col>
							</a-row>
						</a-col>
						<a-col
							:span="12"
							:style="{ opacity: curCompany.endDate ? '1' : '0' }"
						>
							<a-row :gutter="20">
								<a-col :span="8">到期日期</a-col>
								<a-col :span="16">{{ curCompany.endDate }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">签订状态</a-col>
								<a-col
									:span="18"
									:class="curCompany.status == '2' ? 'doubleSign' : 'singleSign'"
									>{{ curCompany.status == '2' ? '双签' : '单签' }}</a-col
								>
							</a-row>
						</a-col>
						<!-- 双签状态 -->
						<a-col
							:span="12"
							v-if="curCompany.status == '2'"
						>
							<a-row :gutter="20">
								<a-col :span="8">双签版合同获得日期</a-col>
								<a-col :span="16">{{ curCompany.doubelSignRecvDate }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
				<div style="margin-top: 20px">
					<a-table
						:pagination="false"
						:columns="contractDetailColumns"
						:data-source="curCompany.list"
						:scroll="{ x: true }"
						rowKey="path"
					>
						<template
							slot="type"
							slot-scope="type"
						>
							{{ CONSTANTS.fileType[type] }}
						</template>
						<template
							slot="name"
							slot-scope="name, items"
						>
							<a
								:href="items.path"
								target="_blank"
								>{{ name }}</a
							>
						</template>
					</a-table>
				</div>
			</div>
			<div v-if="panelType == 'invo'">
				<h3 style="margin-bottom: 20px; margin-top: 20px">发票信息</h3>
				<a-table
					:pagination="false"
					:columns="invoColumns"
					:data-source="curInvoList"
					:scroll="{ x: true }"
					rowKey="id"
				>
					<span
						slot="totalAmount"
						slot-scope="totalAmount"
						>¥{{ totalAmount }}</span
					>
					<span
						slot="amount"
						slot-scope="amount"
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
						slot-scope="fileName, items"
					>
						<a
							:href="items.attachment"
							target="_blank"
							>{{ fileName }}</a
						>
					</template>
					<!-- <div slot="action" slot-scope="action, items">
                    <a href="javascript:;" @click="getResult(items)">查验结果</a>
                </div> -->
				</a-table>
			</div>
		</a-modal>
		<ChooseInvoice
			ref="ChooseInvoice"
			@chooseFinInvo="chooseFinInvo"
		/>
	</div>
</template>
<script>
import { API_FullBusinessLineDetailV1, API_GetReceivablefullBusinessLine } from '@/v2/center/assets/api/index.js';
import ChooseInvoice from './ChooseInvoice';
export default {
	name: 'AssetsCompanyRelationChainModal',
	props: {
		panelType: {
			type: String,
			default: 'contract'
		}
	},
	data() {
		return {
			visible: false,
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
				{ title: '价税合计(元)', dataIndex: 'totalAmount', key: 'totalAmount', scopedSlots: { customRender: 'totalAmount' } },
				{ title: '贸易合同编号', dataIndex: 'contractNo', key: 'contractNo' },
				{ title: '归属价税合计(元)', dataIndex: 'splitAmount', key: 'splitAmount' },
				{ title: '有无附件', dataIndex: 'hasAttach', key: 'hasAttach', scopedSlots: { customRender: 'hasAttach' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			contractDetailColumns: [
				{
					title: '单据类型',
					dataIndex: 'type',
					key: 'type',
					scopedSlots: { customRender: 'type' }
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					key: 'name',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					key: 'transferName'
				}
			]
		};
	},
	components: {
		ChooseInvoice
	},
	created() {},
	methods: {
		init(id) {
			this.activedCoverIndex = 0;
			this.companyChain = [];
			this.contractChain = [];
			this.getDetail(id);
		},
		getDetail(id) {
			API_FullBusinessLineDetailV1(id).then(res => {
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
				contractType: params.curContract.type
			};

			if (this.panelType == 'contract') {
				this.chooseContract(this.curObj);
			} else {
				this.curInvoList = [];
				this.$refs.ChooseInvoice.show(this.curObj.contractId, this.curObj.contractType);
			}
		},
		setActivedCoverLeft(index) {
			if (index) {
				this.activedCoverIndex = index;
			}
			this.activedCoverLeft = this.activedCoverIndex * this.activedCoverMoveBaseWidth;
		},
		okInc() {
			this.$emit(
				'addFin',
				this.panelType == 'contract'
					? this.curCompany
					: {
							curInvoList: this.curInvoList,
							...this.curObj
						}
			);
			this.visible = false;
		},
		chooseFinInvo(data) {
			this.curInvoList = data;
		},
		chooseContract(params) {
			API_GetReceivablefullBusinessLine({
				contractId: params.contractId,
				contractType: params.contractType
			}).then(res => {
				let map = {
					UP: 'upContract',
					ONLINE: 'onlineContract',
					DOWN: 'downContract'
				};
				let type = res.data.contractType;
				let _item = res.data[map[type]];

				this.curCompany = {
					..._item,
					contractId: params.contractId,
					contractType: type,
					goodName: type == 'DOWN' ? _item.goodsName : _item.goodName,
					basePrice: type == 'DOWN' ? _item.contractPrice : _item.basePrice,
					quantity: type == 'DOWN' ? _item.contractQuantity : _item.quantity,
					amount: type == 'DOWN' ? _item.contractAmount : _item.amount,
					signDate: type == 'DOWN' ? _item.contractSignTime : _item.signDate,
					endDate: type == 'DOWN' ? null : _item.endDate,
					status: type == 'DOWN' ? _item.status : _item.signStatus,
					doubelSignRecvDate: type == 'DOWN' ? _item.doubleSignTime : _item.doubelSignRecvDate
				};
			});
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
