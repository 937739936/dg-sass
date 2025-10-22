<template>
	<div>
		<!--国宏保理资产合同-->
		<div
			class="contentBox"
			v-if="contractInfo"
		>
			<!-- 上游 -->
			<div class="upstreamBox">
				<div class="title">上游合同信息</div>
				<div class="divider"></div>
				<div class="content">
					<div>
						<p class="sub-title">基本信息</p>
						<a-row>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同编号</a-col>
									<a-col :span="18">{{ contractInfo.upContract.contractNo }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">合同金额</a-col>
									<a-col :span="16">
										<span class="red">{{ contractInfo.upContract.amount || '-' }}</span>
										<span v-if="contractInfo.upContract.amount">&nbsp;元</span>
									</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">签订日期</a-col>
									<a-col :span="18">{{ contractInfo.upContract.signDate }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">合同执行期</a-col>
									<a-col :span="16">{{ contractInfo.upContract.execDateStart }}~{{ contractInfo.upContract.execDateEnd }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">签订状态</a-col>
									<a-col
										:span="18"
										class="doubleSign"
										v-if="contractInfo.upContract.signStatus == '2'"
										>双签</a-col
									>
									<a-col
										:span="18"
										class="singleSign"
										v-if="contractInfo.upContract.signStatus == '1'"
										>单签</a-col
									>
								</a-row>
							</a-col>
							<!-- 双签状态 -->
							<a-col
								:span="12"
								v-if="contractInfo.upContract.signStatus == '2' && contractInfo.upContract.doubelSignRecvDate"
							>
								<a-row :gutter="20">
									<a-col :span="8">双签版合同获得日期</a-col>
									<a-col :span="16">{{ contractInfo.upContract.doubelSignRecvDate }}</a-col>
								</a-row>
							</a-col>
						</a-row>
					</div>

					<div>
						<p class="sub-title">合同详情</p>
						<a-table
							:pagination="false"
							:columns="contractDetailColumns"
							:data-source="upstreamContractDetailData"
							:scroll="{ x: true }"
							rowKey="id"
						>
							<template
								slot="basePrice"
								slot-scope="text, items"
							>
								<span>{{ items.basePrice || items.basePriceDesc || '-' }}</span>
							</template>
						</a-table>
					</div>

					<div>
						<p class="sub-title">附件信息</p>

						<!-- 上游附件信息详情模块 -->
						<a-table
							v-if="contractInfo.upContract"
							:pagination="false"
							:columns="noFileName ? noFileNameFilesColumns : filesColumns"
							:data-source="contractInfo.upContract.list"
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
			</div>
			<!-- 下游 -->
			<div class="downstreamBox">
				<div class="title">下游合同信息</div>
				<div class="divider"></div>
				<div class="content">
					<div>
						<p class="sub-title">基本信息</p>
						<a-row>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">卖方企业名称</a-col>
									<a-col :span="16">{{ contractInfo.downOnlineContract.sellerName }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">买方企业名称</a-col>
									<a-col :span="16">{{ contractInfo.downOnlineContract.buyerName }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同编号</a-col>
									<a-col :span="18">{{ contractInfo.downOnlineContract.contractNo }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">合同金额</a-col>
									<a-col :span="16">
										<a-col :span="16">
											<span class="red">{{ contractInfo.downOnlineContract.amount || '-' }}</span>
											<span v-if="contractInfo.downOnlineContract.amount">&nbsp;元</span>
										</a-col>
									</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">签订日期</a-col>
									<a-col :span="18">{{ contractInfo.downOnlineContract.signDate }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">合同执行期</a-col>
									<a-col :span="16"
										>{{ contractInfo.downOnlineContract.execDateStart }}~{{ contractInfo.downOnlineContract.execDateEnd }}</a-col
									>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">签订状态</a-col>
									<a-col
										:span="18"
										class="doubleSign"
										v-if="contractInfo.downOnlineContract.signStatus == '2'"
										>双签</a-col
									>
									<a-col
										:span="18"
										class="singleSign"
										v-if="contractInfo.downOnlineContract.signStatus == '1'"
										>单签</a-col
									>
								</a-row>
							</a-col>
							<!-- 双签状态 -->
							<a-col
								:span="12"
								v-if="contractInfo.downOnlineContract.signStatus == '2' && contractInfo.downOnlineContract.doubelSignRecvDate"
							>
								<a-row :gutter="20">
									<a-col :span="8">双签版合同获得日期</a-col>
									<a-col :span="16">{{ contractInfo.downOnlineContract.doubelSignRecvDate }}</a-col>
								</a-row>
							</a-col>
						</a-row>
					</div>

					<div>
						<p class="sub-title">合同详情</p>
						<a-table
							:pagination="false"
							:columns="contractDetailColumns"
							:data-source="downstreamContractDetailData"
							:scroll="{ x: true }"
							rowKey="id"
						>
							<template
								slot="basePrice"
								slot-scope="text, items"
							>
								<span v-if="items.followTheMarket">随行就市</span>
								<span v-else>{{ items.basePrice || items.basePriceDesc || '-' }}</span>
							</template>
						</a-table>
					</div>

					<div>
						<!-- 下游附件编辑模块 -->
						<template v-if="editFlag">
							<template v-if="assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_BID_PROOF">
								<Upload
									:receivalVO="receivalVO"
									@uploadFiles="getUploadFiles"
									type="CONTRACT_OTHER_BID_PROOF"
									btnText="上传中标佐证"
								></Upload>
								<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5"
									>单个文件最大支持100M，支持多个上传</span
								>
							</template>
							<a-table
								bordered
								v-if="editDownContractList.length || (!editDownContractList.length && !supplementalInfo.length)"
								:pagination="false"
								:columns="editFilesColumns"
								:data-source="editDownContractList"
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
								<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
								<template
									slot="action"
									slot-scope="action, items"
								>
									<a-popconfirm
										v-if="!items.locked"
										title="确定删除该附件?"
										okText="确定"
										cancelText="取消"
										@confirm="() => deleteFiles(items)"
									>
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</template>
							</a-table>

							<a-table
								v-if="supplementalInfo.length"
								bordered
								:dataSource="supplementalInfo"
								:columns="supplementalColumns"
								:rowKey="record => record.index"
								:pagination="false"
								:scroll="{ x: true }"
								style="margin-top: 20px"
							>
								<template
									slot="changeItem"
									slot-scope="text, record"
									v-if="record.changeItem"
								>
									<span
										v-for="(item, index) in record.changeItem.split(',')"
										:key="index"
									>
										{{ filterCodeByValueName(item, 'changeItemEnums') }}
										<span v-if="index < record.changeItem.split(',').length - 1">、</span>
									</span>
								</template>
								<template
									slot="executionDate"
									slot-scope="text, record"
								>
									{{ record.executionDateStart }}
									<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
								</template>
								<template
									slot="name"
									slot-scope="text, record"
								>
									<a
										v-for="(item, index) in record.supplementalFile"
										:key="index"
										class="edit-btn"
										:href="item.url"
										target="_blank"
									>
										{{ item.name }}
										<span v-if="index < record.supplementalFile.length - 1">,</span>
									</a>
								</template>
								<template
									slot="transferName"
									slot-scope="text, record"
								>
									<span
										v-for="(item, index) in record.supplementalFile"
										:key="index"
										class="edit-btn"
									>
										{{ item.transferName || '-' }}
										<span v-if="index < record.supplementalFile.length - 1 && item.transferName">,</span>
									</span>
								</template>
								<template
									slot="operation"
									slot-scope="operation, record, index"
								>
									<a-space>
										<a-popconfirm
											title="确定删除该附件信息?"
											okText="确定"
											cancelText="取消"
											@confirm="() => deleteSupplementFiles(record, index)"
										>
											<a
												href="javascript:;"
												class="delete-btn"
												>删除</a
											>
										</a-popconfirm>
									</a-space>
								</template>
							</a-table>
						</template>
						<!-- 上游附件信息详情模块 -->
						<a-table
							bordered
							v-if="
								(contractInfo.downOnlineContract.list.length ||
									(!contractInfo.downOnlineContract.list.length && !supplementalInfo.length)) &&
								contractInfo.downOnlineContract &&
								!editFlag
							"
							:pagination="false"
							:columns="noFileName ? noFileNameFilesColumns : filesColumns"
							:data-source="contractInfo.downOnlineContract.list"
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
						<a-table
							v-if="supplementalInfo.length && contractInfo.downOnlineContract && !editFlag"
							bordered
							:dataSource="supplementalInfo"
							:columns="supplementalDetailColumns"
							:rowKey="record => record.index"
							:pagination="false"
							:scroll="{ x: true }"
							style="margin-top: 20px"
						>
							<template
								slot="changeItem"
								slot-scope="text, record"
								v-if="record.changeItem"
							>
								<span
									v-for="(item, index) in record.changeItem.split(',')"
									:key="index"
								>
									{{ filterCodeByValueName(item, 'changeItemEnums') }}
									<span v-if="index < record.changeItem.split(',').length - 1">、</span>
								</span>
							</template>
							<template
								slot="executionDate"
								slot-scope="text, record"
							>
								{{ record.executionDateStart }}
								<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
							</template>
							<template
								slot="name"
								slot-scope="text, record"
							>
								<a
									v-for="(item, index) in record.supplementalFile"
									:key="index"
									class="edit-btn"
									:href="item.url"
									target="_blank"
								>
									{{ item.name }}
									<span v-if="index < record.supplementalFile.length - 1">,</span>
								</a>
							</template>
							<template
								slot="transferName"
								slot-scope="text, record"
							>
								<span
									v-for="(item, index) in record.supplementalFile"
									:key="index"
									class="edit-btn"
								>
									{{ item.transferName || '-' }}
									<span v-if="index < record.supplementalFile.length - 1 && item.transferName">,</span>
								</span>
							</template>
						</a-table>
					</div>
				</div>
			</div>

			<!-- 贸易背景合同 -->
			<div
				class="tradeBox"
				v-if="assetsConfig.CONTRACT_TRADE_FILE"
			>
				<div class="title">贸易背景合同信息</div>
				<div class="divider"></div>
				<div
					class="content"
					style="padding-bottom: 0"
				>
					<div>
						<p class="sub-title">附件信息</p>
						<!-- 贸易背景合同编辑模块 -->
						<template v-if="editFlag">
							<Upload
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="ASSET_TRADE_BACKGROUND_CONTRACT"
								btnText="上传贸易背景合同"
							></Upload>
							<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5"
								>单个文件最大支持100M，支持多个上传</span
							>
							<a-table
								v-if="contractInfo.tradeContract"
								:pagination="false"
								:columns="editFilesColumns"
								:data-source="editTradeContractList"
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
								<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
								<template
									slot="action"
									slot-scope="action, items"
								>
									<a-popconfirm
										v-if="!items.locked"
										title="确定删除该附件?"
										okText="确定"
										cancelText="取消"
										@confirm="() => deleteFiles(items)"
									>
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</template>
							</a-table>
						</template>
						<!-- 贸易背景合同详情展示模块 -->
						<template v-if="!editFlag">
							<a-table
								v-if="contractInfo.tradeContract"
								:pagination="false"
								:columns="noFileName ? noFileNameFilesColumns : filesColumns"
								:data-source="filterLockFile(contractInfo.tradeContract.list)"
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
						</template>
					</div>
				</div>
			</div>

			<!-- 其它合同 -->
			<div v-if="assetsConfig.CONTRACT_BUSINESSLINE_FILE">
				<ChooseOtherContract
					:data="contractInfo"
					:editFlag="editFlag"
					:lineId="lineId"
					ref="ChooseOtherContract"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import Upload from '../common/Upload.vue';
import { filterLockFile } from '@/untils/factory.js';
import ChooseOtherContract from '../common/ChooseOtherContract.vue';
import _ from 'lodash';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
export default {
	name: 'GhContract',
	data() {
		return {
			filterLockFile: filterLockFile,
			contractDetailColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice', scopedSlots: { customRender: 'basePrice' } },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' }
			],
			upstreamContractDetailData: [], // 上游合同详情数据
			downstreamContractDetailData: [], // 下游合同详情数据
			contractEditColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice' },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			noFileNameFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			],

			editFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			fileInfos: [],
			assetsConfig: {},
			detailForm: {},
			editContractFlag: false, // 新增、修改合同详情,
			editTradeContractList: [],
			editUpContractList: [],
			editDownContractList: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			supplementalInfo: [], // 下游补充协议附件
			supplementalColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : text == '2' ? '双签' : '';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				},
				{
					title: '操作',
					dataIndex: 'operation',
					align: 'center',
					width: 150,
					fixed: 'right',
					scopedSlots: { customRender: 'operation' }
				}
			],
			supplementalDetailColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : text == '2' ? '双签' : '';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				}
			],
			filterCodeByValueName: filterCodeByValueName
		};
	},
	props: ['editFlag', 'contractInfo', 'noFileName', 'lineId', 'receivalVO', 'isAdvance'],
	components: {
		Upload,
		ChooseOtherContract
	},

	watch: {
		contractInfo: function (data) {
			// 合同详情数据转成数组格式

			this.dealWithData(data);
		}
	},
	mounted() {
		let data = this.contractInfo;
		this.dealWithData(data);
	},
	methods: {
		moment,
		// 资产包配置
		checkAssetsConfig(data) {
			let list = data.bankProductAssetConfigList || [{}];
			this.assetsConfig.CONTRACT_TRADE_FILE = _.find(list, { item: 'CONTRACT_TRADE_FILE' }).status == 1;
			this.assetsConfig.CONTRACT_BUSINESSLINE_FILE = _.find(list, { item: 'CONTRACT_BUSINESSLINE_FILE' }).status == 1;
			this.assetsConfig.CONTRACT_BUSINESSLINE_FILE = _.find(list, { item: 'CONTRACT_BUSINESSLINE_FILE' }).status == 1;
			this.assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_BID_PROOF =
				_.find(list, { item: 'CONTRACT_DOWN_DSIGN_ONLINE_BID_PROOF' }).status == 1;
		},
		dealWithData(data) {
			if (data) {
				this.dealWithCommonData(data);
				this.checkAssetsConfig(data);
			}
		},
		dealWithCommonData(data) {
			this.upstreamContractDetailData = [];
			let obj = {};
			obj.id = 1;
			obj.goodName = data.upContract.goodName;
			obj.basePrice = data.upContract.basePrice || data.upContract.basePriceDesc;
			obj.quantity = data.upContract.quantity;
			if (data.upContract.goodsVOList) {
				this.upstreamContractDetailData = data.upContract.goodsVOList;
			} else {
				this.upstreamContractDetailData.push(obj);
			}

			this.downstreamContractDetailData = [];
			let pro = {};
			pro.id = 1;
			pro.goodName = data.downOnlineContract.goodName;
			pro.basePrice = data.downOnlineContract.basePrice || data.downOnlineContract.basePriceDesc;
			pro.quantity = data.downOnlineContract.quantity;
			this.downstreamContractDetailData.push(pro);

			// 编辑附件模块table初始化数据
			if (this.editFlag) {
				this.editTradeContractList = Object.assign([], data.tradeContract ? data.tradeContract.list : []);
				this.editUpContractList = Object.assign([], data.upContract ? data.upContract.list : []);
				this.editDownContractList = Object.assign([], data.downOnlineContract ? data.downOnlineContract.list : []);

				this.supplementalInfo = Object.assign([], data.downOnlineContract ? data.downOnlineContract.supplementalInfo : []);
			}
		},

		getUploadFiles(data, type) {
			// 上传文件 获取附件数据
			this.fileInfos = data;
			// 遍历arr，把元素分别放入tmp数组(不存在才放)
			let tmp = new Array();
			let obj = {};
			if (type == 'CONTRACT_SUPPLEMENT') obj = this.contractInfo.upContract; // 上游合同补充文档
			if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'CONTRACT_OTHER_BID_PROOF')
				obj = this.contractInfo.downOnlineContract; // 下游合同、下游合同补充文档
			if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') obj = this.contractInfo.tradeContract; // 贸易背景合同

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let sameFlag = true;
			for (var i in data) {
				if (obj && obj.list) {
					obj.list.forEach(item => {
						if (
							item.md5Hex == data[i].md5Hex &&
							item.delFlag == data[i].delFlag &&
							item.name == data[i].name &&
							item.type == data[i].type
						) {
							this.$message.error('同类型的附件不能上传相同的文件');
							sameFlag = false;
						}
					});
				}
			}
			if (!sameFlag) return;
			// 判断相同类型下不可上传文件名相同且内容相同的文件--end
			this.$message.success('添加成功');

			let project = {};
			let list = [];
			for (let i = 0; i < this.fileInfos.length; i++) {
				let element = this.fileInfos[i];
				// 对contractInfo数据进行更新
				if (obj) {
					obj.list.push(element);
				} else {
					list.push(element);
					if (i == this.fileInfos.length - 1) {
						project.list = list;
						if (obj) {
							obj = project;
						} else {
							if (type == 'CONTRACT_SUPPLEMENT') this.contractInfo.upContract = project;
							if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'CONTRACT_OTHER_BID_PROOF')
								this.contractInfo.downOnlineContract = project;
							if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') this.contractInfo.tradeContract = project;
						}
					}
				}
				// 对编辑模块数据进行更新
				if (this.editFlag) {
					if (type == 'CONTRACT_SUPPLEMENT') {
						this.editUpContractList.push(element);
					}
					if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'CONTRACT_OTHER_BID_PROOF') {
						this.editDownContractList.push(element);
					}
					if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
						this.editTradeContractList.push(element);
					}
				}
			}
		},
		deleteFiles(items) {
			// 删除附件
			let arr = [];
			let changeArr = [];
			if (items.type == 'CONTRACT_SUPPLEMENT') {
				// 上游合同补充文档
				arr = this.contractInfo.upContract.list;
				changeArr = this.editUpContractList;
			}
			if (
				items.type == 'TERMINAL_CONTRACT' ||
				items.type == 'TERMINAL_CONTRACT_SUPPLEMENT' ||
				items.type == 'CONTRACT_OTHER_BID_PROOF'
			) {
				// 下游合同、下游合同补充文档、中标佐证
				arr = this.contractInfo.downOnlineContract.list;
				changeArr = this.editDownContractList;
			}
			if (items.type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
				// 贸易背景合同
				arr = this.contractInfo.tradeContract.list;
				changeArr = this.editTradeContractList;
			}
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					index = _index;
				}
			});
			changeArr.splice(index, 1);
			arr.forEach((element, index) => {
				if (
					element.id == items?.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		onSubmit() {
			// 整体提交
			if (this.$refs.ChooseOtherContract) {
				this.contractInfo.businessLineContract = this.$refs.ChooseOtherContract.getbusData();
			}
			return {
				...this.contractInfo,
				list: [
					...(this.contractInfo.downOnlineContract?.list || []),
					...(this.contractInfo.upContract?.list || []),
					...(this.contractInfo.tradeContract?.list || [])
				],
				supplementalInfo: [...(this.contractInfo.downOnlineContract?.supplementalInfo || [])]
			};
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	::v-deep& > div {
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}
		.divider {
			background: #f4f5f8;
			height: 1px;
			margin-top: 0;
		}
		.add-other {
			float: right;
			margin-right: 15px;
			margin-top: 8px;
		}
		.content {
			padding: 15px;
			.other-title {
				color: #383a3f;
				margin-bottom: 20px;
			}
			& > div {
				.row {
					height: 59px;
					margin-bottom: 0;
					.ant-form-item-label {
						text-align: left;
					}
					.ant-form-item-children em {
						position: absolute;
						right: -20px;
					}
					.ant-table-fixed-columns-in-body {
						text-align: left;
					}
				}
				& > .ant-row .ant-col .ant-row .ant-col:nth(1) {
					color: #6b6f76;
				}
				& > .ant-row .ant-col .ant-row .ant-col:odd {
					color: #383a3f;
				}
				p:not(.ant-empty-description) {
					font-family: PingFangSC-Medium;
					color: #383a3f;
					text-align: left;
					line-height: 18px;
					margin: 15px 0;
				}
				& > .ant-row {
					margin: 15px 0;
					.ant-col .ant-row .ant-col {
						margin-bottom: 3px;
					}
					.ant-col .ant-row .ant-col:first-child {
						color: #6b6f76;
					}
					.ant-col .ant-row .ant-col:last-child {
						color: #383a3f;
					}
				}
			}
		}
	}
	.doubleSign {
		color: #00ae9d !important;
	}
	.singleSign {
		color: #ff9726 !important;
	}
	.red {
		color: #f24e4d !important;
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		float: right;
		display: inline-block;
		margin-right: 15px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
