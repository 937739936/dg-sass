<template>
	<div class="contentBox slMain">
		<div class="title">
			<a-space :size="20">
				运输凭证信息
				<a-button
					v-if="editFlag && getDeliveryBatchByAssetIdParent"
					type="primary"
					ghost
					@click="selectModelShow"
				>
					选择货物批次
				</a-button>
			</a-space>
		</div>
		<ErrorPanel
			v-if="audit"
			:assetValidateList="assetValidateList"
		></ErrorPanel>
		<div class="mb50 content">
			<div
				class="tip-box"
				v-if="editFlag"
			>
				<span class="tip-title">
					【上传附件】可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件
					<template v-if="bankProductAssetConfigList.some(item => item.key === 'DELIVER_CAR_NUMBER_TABLE')">
						; 其中“车号表”同时支持xlsx，xls格式
					</template>
					。
				</span>
			</div>
			<div class="table-box">
				<a-table
					class="new-table"
					:dataSource="deliverList"
					:columns="deliverColumn"
					:rowKey="(record, index) => String(index)"
					:pagination="false"
				>
					<template
						slot="number"
						slot-scope="number"
					>
						{{ formatMoney(number) }}
					</template>

					<template
						slot="coalPlanSerialNo"
						slot-scope="coalPlanSerialNo, items"
					>
						<a
							:href="'/logisticsPlatform/in/coalplan/detail?id=' + items.coalPlanId"
							target="_blank"
							>{{ coalPlanSerialNo }}</a
						>
					</template>
					<a-space
						:size="24"
						slot="action"
						slot-scope="text, record"
					>
						<a-dropdown
							v-if="editFlag"
							:getPopupContainer="getPopupContainer"
						>
							<a-menu slot="overlay">
								<a-menu-item
									v-for="item in bankProductAssetConfigList.filter(item => item.secondaryCategory.includes(record.transferType))"
									:key="item.type"
								>
									<a-upload
										:headers="headers"
										:beforeUpload="beforeUpload"
										:accept="item.accept"
										:action="actionParent"
										:multiple="true"
										name="file"
										@change="e => fileChange(e, item, record)"
									>
										<div :class="item.required ? 'required' : ''">{{ item.label }}</div>
									</a-upload>
								</a-menu-item>
							</a-menu>
							<a>上传附件<a-icon type="right" /></a>
						</a-dropdown>
						<template v-if="record.transferType === 'AUTOMOBILE'">
							<!-- 汽运信息admin端展示 -->
							<template v-if="type === 'admin'">
								<a
									href="javascript:;"
									@click="transDetail(record.batchNo)"
								>
									发运详情
								</a>
								<!-- 汽运业务线类型为ACCOUNT_RECEIVABLE 时展示轨迹查询 -->
								<a-tooltip v-if="businessType === 'ACCOUNT_RECEIVABLE'">
									<template slot="title"> 请依据磅单明细，自主添加车牌号和到站时间，进行汽运轨迹抽查 </template>
									<a
										href="javascript:;"
										@click="goCarMap(record)"
										>轨迹查询</a
									>
								</a-tooltip>
							</template>
						</template>
						<a
							@click="openGuiji(record, record.transferType)"
							v-else
						>
							查看轨迹
						</a>
						<a
							v-if="editFlag"
							@click="deleteSelect(record.id)"
						>
							删除
						</a>
					</a-space>
				</a-table>
				<a-row
					type="flex"
					class="select"
				>
					<a-col flex="auto">
						已选：<span class="selectAll">{{ deliverList.length }}个批次</span>
					</a-col>
					<a-col flex="none">
						<a-space :size="20">
							<div>
								<a-space :size="10">
									发货数量合计<span class="number">{{ formatMoney(deliverCount.deliverQuntity) }}</span>
								</a-space>
								吨
							</div>
							<div>
								<a-space :size="10">
									收货数量合计<span class="number">{{ formatMoney(deliverCount.receiveQuantity) }}</span>
								</a-space>
								吨
							</div>
						</a-space>
					</a-col>
				</a-row>
			</div>
		</div>
		<!-- 如果是金融机构，文件数据为空也不展示 -->
		<template v-if="!(isBank && !attachFileList.length)">
			<div class="title">附件信息</div>
			<div class="mb50 content">
				<div class="table-box">
					<a-table
						:columns="editFlag ? fileColumns : filesColumns"
						class="new-table-file"
						bordered
						:rowKey="(record, index) => String(index)"
						:dataSource="attachFileList"
						:pagination="false"
					>
						<div
							slot="typeDesc"
							slot-scope="typeDesc, record"
							class="typeDesc"
						>
							<div style="margin-right: 20px; line-height: 24px">
								<span
									class="red"
									:style="{ color: record.required ? 'red' : 'transparent' }"
								>
									*
								</span>
								<span>{{ typeDesc }}</span>
							</div>
						</div>
						<div
							class="nameMain"
							slot="name"
							slot-scope="name, record"
						>
							<a-tooltip
								v-for="(item, fileIndex) in record.fileList"
								:key="fileIndex"
							>
								<template
									slot="title"
									v-if="item.transferName"
								>
									{{ item.transferName }}
								</template>
								<div class="nameEdit">
									<span @click="handlePreview(item)">{{ item.name }}</span>
									<a-popconfirm
										v-if="(item.locked || item.checked) != 1"
										title="确认删除？"
										@confirm="deleteFiles(item)"
									>
										<img
											class="del"
											src="@sub/assets/imgs/trade/del-icon.png"
											alt=""
										/>
									</a-popconfirm>
								</div>
							</a-tooltip>
						</div>
						<template
							slot="fileList"
							slot-scope="text, record"
						>
							<span class="preview-box">
								<a-tooltip
									v-for="(item, i) in record.fileList"
									:key="i"
								>
									<template slot="title">{{ item.transferName }} </template>
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
						<template
							slot="action"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="download(record)"
							>
								下载
							</a>
						</template>
						<template slot="lockedTitle">
							锁定
							<a-switch
								:checked="lockedAll"
								@change="onChangeAll"
								:disabled="!audit"
							/>
						</template>
						<template
							slot="locked"
							slot-scope="text, record"
						>
							<a-switch
								:disabled="!audit"
								:checked="Boolean(record[lockedKey])"
								@change="onChange(record)"
							/>
						</template>
					</a-table>
				</div>
			</div>
		</template>
		<!-- 选择货物批次 -->
		<a-modal
			v-model="selectModel"
			centered
			class="slModel"
			width="80%"
			:footer="null"
		>
			<div class="title">选择货物批次</div>
			<div style="padding: 20px">
				<div class="table-box">
					<a-table
						class="new-table"
						:dataSource="deliverSelectList"
						:columns="deliverSelectColumns"
						:pagination="false"
						rowKey="id"
						:customRow="onClickRow"
						:row-selection="rowSelection"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="batchNo"
							slot-scope="text, record"
						>
							<a @click="jumpToDetail(record)">{{ text }}</a>
						</template>
						<template
							slot="number"
							slot-scope="number"
						>
							{{ formatMoney(number) }}
						</template>
						<template
							slot="status"
							slot-scope="status, record"
						>
							<span :class="`status-tag status-${record.status}`">
								{{ record.statusDesc }}
							</span>
						</template>
					</a-table>
					<a-row
						type="flex"
						class="select"
					>
						<a-col flex="auto">
							已选：<span class="selectAll">{{ selectedRows.length }}个批次</span>
						</a-col>
						<a-col flex="none">
							<a-space :size="20">
								<div>
									<a-space :size="10">
										发货数量合计<span class="number">{{ formatMoney(deliverSelectCount.deliverQuntity) }}</span>
									</a-space>
									吨
								</div>
								<div>
									<a-space :size="10">
										收货数量合计<span class="number">{{ formatMoney(deliverSelectCount.receiveQuantity) }}</span>
									</a-space>
									吨
								</div>
							</a-space>
						</a-col>
					</a-row>
				</div>
				<div class="footer">
					<a-button @click="selectModelHide"> 取消 </a-button>
					<a-button
						type="primary"
						@click="selectModelOk"
					>
						确认
					</a-button>
				</div>
			</div>
		</a-modal>
		<a-modal
			v-model="shipModel"
			centered
			width="900px"
			:footer="null"
		>
			<div class="table-box">
				<a-table
					class="new-table"
					:dataSource="shipDataSource"
					:columns="columnsShip"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				>
					<span
						slot="operation"
						slot-scope="text, record"
					>
						<a @click.self="jumpToShipTail(record)">轨迹</a>
					</span>
				</a-table>
			</div>
		</a-modal>

		<a-modal
			v-model="carModel"
			title="车辆列表"
			width="900px"
			centered
			:footer="null"
		>
			<div class="table-box">
				<a-table
					class="new-table"
					:dataSource="carDataSource"
					:columns="columnsCar"
					:pagination="false"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
					<template
						slot="storageRecordSerialNo"
						slot-scope="text, record"
					>
						<a
							:href="'/logisticsPlatform/in/records/detail?id=' + record.storageRecordId"
							target="_blank"
							>{{ text }}</a
						>
					</template>
					<template
						slot="loadingTicketName"
						slot-scope="text, record"
					>
						<a
							v-if="text"
							href="javascript:;"
							@click="handlePreview(record)"
							>{{ text }}</a
						>
					</template>
					<template
						slot="ticketName"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="handlePreview(record)"
							>{{ text }}</a
						>
					</template>
					<span
						slot="operation"
						slot-scope="text, record"
					>
						<a-space>
							<a @click="auditDetail(record)">轨迹查询</a>
							<a
								v-if="record.smallToolsAdd === 0"
								@click="del(record)"
								>删除</a
							>
						</a-space>
					</span>
				</a-table>
			</div>
		</a-modal>
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import ImageViewer from '@sub/components/viewer/image.vue';
import { formatMoney } from '@sub/filters';
import comDownload from '@sub/utils/comDownload.js';
import { getPopupContainer } from '@sub/utils/factory.js';
import ErrorPanel from './components/ErrorPanel.vue';
// import { API_RECEIVERECORDINFO, API_getRouteInfo, API_GETTRAINRECORD } from '@/v2/center/assets/api/index.js';
const filesRestColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '发货批次号', dataIndex: 'batchNo' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const filesAdminColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '发货批次号', dataIndex: 'batchNo' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{
		dataIndex: 'locked',
		slots: { title: 'lockedTitle' },
		scopedSlots: { customRender: 'locked' },
		width: '15%',
		align: 'center'
	}
];

const columnsCarInfo = [
	{
		title: '车牌号',
		dataIndex: 'plateNumber'
	},
	{
		title: '发车时间',
		dataIndex: 'deliverDate',
		customRender: (text, row, index) => {
			if (text) {
				return moment(text).format('YYYY-MM-DD HH:mm');
			} else {
				return '-';
			}
		}
	},
	{
		title: '到站时间',
		dataIndex: 'arriveDate',
		customRender: (text, row, index) => {
			if (text) {
				return moment(text).format('YYYY-MM-DD HH:mm');
			} else {
				return '-';
			}
		}
	},
	{
		title: '发货量（吨）',
		dataIndex: 'deliverQuantity'
	},
	{
		title: '运单号',
		dataIndex: 'ticketNo'
	},
	{
		title: '操作',
		key: 'operation',
		fixed: 'right',
		scopedSlots: {
			customRender: 'operation'
		}
	}
];
const columnsCarStation = [
	{
		title: '车牌号',
		dataIndex: 'plateNumber'
	},
	{
		title: '发车时间',
		dataIndex: 'deliverDate',
		customRender: (text, row, index) => {
			if (text) {
				return moment(text).format('YYYY-MM-DD HH:mm');
			} else {
				return '-';
			}
		}
	},
	{
		title: '到站时间',
		dataIndex: 'arriveDate',
		customRender: (text, row, index) => {
			if (text) {
				return moment(text).format('YYYY-MM-DD HH:mm');
			} else {
				return '-';
			}
		}
	},
	{
		title: '发货量（吨）',
		dataIndex: 'deliverQuantity'
	},
	{
		title: '入库单号',
		align: 'center',
		dataIndex: 'storageRecordSerialNo',
		scopedSlots: { customRender: 'storageRecordSerialNo' }
	},
	{
		title: '矿发磅单',
		align: 'center',
		dataIndex: 'loadingTicketName',
		scopedSlots: { customRender: 'loadingTicketName' }
	},
	{
		title: '电子磅单',
		align: 'center',
		dataIndex: 'ticketName',
		scopedSlots: { customRender: 'ticketName' }
	},
	{
		title: '操作',
		key: 'operation',
		fixed: 'right',
		scopedSlots: {
			customRender: 'operation'
		}
	}
];
export default {
	name: 'TransportDocument',
	components: {
		ImageViewer,
		ErrorPanel
	},
	data() {
		return {
			getPopupContainer,
			formatMoney,
			shipModel: false, // 船运轨迹
			shipDataSource: [],
			selectModel: false,
			selectedRowKeys: [],
			deliverColumn: [],
			deliverInfoColumn: [
				{ title: '发货批次号', dataIndex: 'batchNo' },
				{
					title: '品名',
					dataIndex: 'goodName'
				},
				{ title: '发货数量(吨)', dataIndex: 'deliverQuntity', scopedSlots: { customRender: 'number' } },
				{ title: '发货日期', dataIndex: 'deliverDate' },
				{ title: '发货方式', dataIndex: 'transferTypeDesc' },
				{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
			],
			deliverStationInfoColumn: [
				{ title: '发货批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '品名', dataIndex: 'goodName', key: 'goodName' },
				{
					title: '上煤计划编号',
					dataIndex: 'coalPlanSerialNo',
					key: 'coalPlanSerialNo',
					scopedSlots: { customRender: 'coalPlanSerialNo' }
				},
				{ title: '发货数量（吨）', dataIndex: 'deliverQuntity', scopedSlots: { customRender: 'number' } },
				{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
				{
					title: '发货方式',
					dataIndex: 'transferTypeDesc'
				},
				{ title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			deliverSelectColumns: [
				{ title: '发货批次号', dataIndex: 'batchNo', key: 'batchNo', scopedSlots: { customRender: 'batchNo' } },
				{
					title: '运输方式',
					dataIndex: 'transferTypeDesc'
				},
				{ title: '发货数量(吨)', dataIndex: 'deliverQuntity', scopedSlots: { customRender: 'number' } },
				{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', scopedSlots: { customRender: 'number' } },
				{ title: '发货日期', dataIndex: 'deliverDate' },
				{ title: '最后收货日期', dataIndex: 'recentReceiveDate' },
				{ title: '状态', key: 'status', scopedSlots: { customRender: 'status' } }
			],
			deliverSelectList: [],
			fileColumns: [
				{
					title: '单据类型',
					dataIndex: 'typeDesc',
					width: 210,
					scopedSlots: { customRender: 'typeDesc' }
				},
				{ title: '发货批次号', dataIndex: 'batchNo' },
				{
					title: '文件名称',
					dataIndex: 'name',
					align: 'left',
					scopedSlots: { customRender: 'name' }
				}
			],
			carModel: false,
			carDataSource: [],
			columnsShip: [
				{
					title: '船舶名称',
					dataIndex: 'shipName'
				},
				{
					title: '航次号',
					dataIndex: 'voyageNo'
				},
				{
					title: 'mmsi',
					dataIndex: 'identifierNo'
				},
				{
					title: '装货量（吨）',
					dataIndex: 'deliverQuantity',
					scopedSlots: { customRender: 'number' }
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					}
				}
			],
			deliverList: [], // 所有的批次信息
			attachList: [], // 附件列表
			assetValidateList: [] // 校验错误信息
		};
	},
	props: {
		editFlag: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		audit: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		isBank: {
			type: Boolean,
			default: false
		},
		// 运输凭证批次是否必填
		transportRequired: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		// 判断汽运时是否展示轨迹
		businessType: {
			type: [String, undefined],
			default: undefined
		},
		deliverInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		transInfoBatchAttachList: {
			type: [Array, undefined],
			default: undefined
		}
	},
	inject: {
		refreshParent: { form: 'refreshParent', default: null },
		getDeliveryBatchByAssetIdParent: { form: 'getDeliveryBatchByAssetIdParent', default: null },
		actionParent: { form: 'actionParent', default: null },
		openGuijiParent: { form: 'openGuijiParent', default: null },
		transDetailParent: { form: 'transDetailParent', default: null },
		transDelParent: { form: 'transDelParent', default: null },
		getTransInfoParent: { form: 'getTransInfoParent', default: null },
		downFileAllParent: { form: 'downFileAllParent', default: null },
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null },
		serialNo: { form: 'serialNo', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' }
	},
	filters: {},
	watch: {
		deliverInfo: {
			deep: true,
			immediate: true,
			handler(data) {
				let list = data.deliverList;
				if (list?.length) {
					this.deliverList = list.map(item => {
						return { ...item, deliverQuntity: item.deliverQuntity || item.deliverQuantity };
					});
				}
				let fileList = data.attachList;
				if (fileList?.length) {
					this.attachList = fileList;
				}
				if (data.assetValidateList) {
					this.assetValidateList = data.assetValidateList || [];
				}
				if (data.paymentValidates) {
					this.assetValidateList = data.paymentValidates || [];
				}
				this.dealWithData();
			}
		},
		// 批次发生变化后批次重新传入回显附件
		transInfoBatchAttachList(data) {
			if (data) {
				// 将新的不存在与现有附件列表中的数据添加到列表中
				data.forEach(item => {
					if (!this.attachList.find(items => items.id === item.id)) {
						this.attachList.push(item);
					}
				});
			}
		},
		// 批次发生变化
		deliverList() {
			this.deliverListChange();
		}
	},
	mounted() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		filesColumns() {
			if (this.type === 'rest') {
				return filesRestColumns;
			}
			return filesAdminColumns;
		},
		// 批次信息统计
		deliverCount() {
			let deliverQuntity = 0;
			let receiveQuantity = 0;
			this.deliverList.forEach(item => {
				deliverQuntity += item.deliverQuntity || 0;
				receiveQuantity += item.receiveQuantity || 0;
			});
			let deliverCount = { deliverQuntity, receiveQuantity };
			return deliverCount;
		},
		// 筛选出选中的货物批次信息统计
		deliverSelectCount() {
			let deliverQuntity = 0;
			let receiveQuantity = 0;
			this.selectedRows.forEach(item => {
				deliverQuntity += item.deliverQuntity || 0;
				receiveQuantity += item.receiveQuantity || 0;
			});
			let deliverCount = { deliverQuntity, receiveQuantity };
			return deliverCount;
		},
		// 上传附件限制种类
		bankProductAssetConfigList() {
			let bankProductAssetConfigList = this.deliverInfo?.bankProductAssetConfigList || [];
			bankProductAssetConfigList = bankProductAssetConfigList
				.filter(item => item.status == 1)
				.map(item => {
					let accept = '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF,.bmp';
					if (item.assetAttachType === 'DELIVER_CAR_NUMBER_TABLE') {
						accept = '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF,.bmp.xlsx,.xls,.XLSX,.XLS';
					}
					return {
						key: item.assetAttachType,
						label: item.itemDesc,
						accept,
						secondaryCategory: item.secondaryCategory,
						required: Boolean(item.required)
					};
				});
			return bankProductAssetConfigList;
		},
		// 所有的附件信息整理
		attachFileList() {
			let list = this.attachList.filter(item => item.delFlag != 1);
			let obj = {};
			let listAdmin = [];
			list.forEach(el => {
				let { batchNo, type, typeDesc, locked, checked, id } = el;
				let required = false;
				let typeItem = this.bankProductAssetConfigList.find(item => item.key === type);
				if (typeItem) {
					typeDesc = typeItem?.label;
					required = typeItem?.required;
				}
				let batchNoType = batchNo + type;
				let elObj = { required, locked, checked, id, typeDesc, batchNo, type };
				if (!obj[batchNoType]) {
					obj[batchNoType] = { fileList: [], ...elObj };
				}
				listAdmin.push({ fileList: [el], ...elObj });
				obj[batchNoType].fileList.push(el);
			});
			list = [];
			for (let k in obj) {
				list.push(obj[k]);
			}
			if (this.type === 'rest') {
				return list;
			}
			// admin端不做合并处理
			return listAdmin;
		},
		// 判断所有文件锁定
		lockedAll() {
			if (this.attachFileList.length) {
				let locked = this.attachFileList.every(item => Boolean(item[this.lockedKey]));
				return locked;
			}
			return false;
		},
		selectedRows() {
			let list = this.deliverSelectList.filter(item => {
				return this.selectedRowKeys.includes(item.id);
			});
			return list;
		},
		// 选中项
		rowSelection() {
			const t = this;
			return {
				type: 'checkbox',
				selectedRowKeys: t.selectedRowKeys,
				onChange(selectedRowKeys) {
					t.selectedRowKeys = selectedRowKeys;
				}
			};
		}
	},
	methods: {
		onClickRow(record, index) {
			return {
				on: {
					click: () => {
						let key = record.id;
						if (this.selectedRowKeys.includes(key)) {
							this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== key);
						} else {
							this.selectedRowKeys.push(key);
						}
					}
				}
			};
		},
		del(item) {
			let that = this;
			this.$confirm({
				title: '删除?',
				content: '确认删除吗',
				okText: '确认',
				cancelText: '取消',
				async onOk() {
					if (that.transDelParent) {
						//根据批次号查询详情
						that.transDelParent(item).then(res => {
							that.transDetail(that.currentBatchNo);
						});
					}
				},
				onCancel() {}
			});
		},
		//打开汽运发运详情
		transDetail(batchNo) {
			this.currentBatchNo = batchNo;
			if (this.transDetailParent) {
				//根据批次号查询详情
				this.transDetailParent(batchNo).then(res => {
					if (res.success) {
						this.carDataSource = res.data;
						this.carModel = true;
					}
				});
			}
		},
		//打开汽运轨迹
		auditDetail(record) {
			if (!record.arriveDate) {
				this.$message.error('无法确定到站时间，轨迹查询失败，请收货后再进行查询');
				return;
			}
			let routeUrl = this.$router.resolve({
				path: '/logistics/carTrailZX',
				query: {
					planId: record.id
				}
			});
			window.open(routeUrl.href, '_blank');
			return;
		},
		// 应收汽运 去往汽运运输轨迹
		goCarMap(record) {
			let routeUrl = this.$router.resolve({
				path: '/logistics/carTrailZX',
				query: {
					batchNo: record.batchNo
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		// 跳转到收发货信息详情
		jumpToDetail(record) {
			let routeUrl = this.$router.resolve({
				path: '/center/receive/accept/detail',
				query: {
					deliverId: record.id
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		// 判断是否有判断外部变更，用于修改是进行页面拦截
		isNeedNextChange() {
			if (this.isNeedNextChangeParent) {
				this.isNeedNextChangeParent();
			}
		},
		// 如果批次发生变化，将附件中找不到对应批次的文件删除
		deliverListChange() {
			this.attachList = this.attachList.filter(item => {
				return this.deliverList.some(items => items.batchNo === item.batchNo);
			});
			// 发货批次发生变化，更新外部视图
			if (this.getTransInfoParent) {
				this.getTransInfoParent(this.deliverList);
			}
		},
		// 删除选中批次
		deleteSelect(id) {
			this.deliverList = this.deliverList.filter(item => item.id !== id);
			this.isNeedNextChange();
		},
		// 打开选择发货批次弹框
		async selectModelShow() {
			// 根据资产查询发货批次
			let data = await this.getDeliveryBatchByAssetIdParent();
			this.deliverSelectList = data;
			this.selectedRowKeys = this.deliverList.map(item => item.id);
			this.selectModel = true;
		},
		// 选择发货批次
		selectModelOk() {
			if (!this.selectedRowKeys.length) {
				this.$message.warning('请选择货物批次');
				return;
			}
			// 将此次没有选中的设置为删除
			this.deliverList = [...this.selectedRows];
			this.isNeedNextChange();
			this.selectModelHide();
		},
		// 关闭选择发货批次弹框
		selectModelHide() {
			this.deliverSelectList = [];
			this.selectedRowKeys = [];
			this.selectModel = false;
		},
		deleteFiles(items) {
			// 删除附件
			this.attachList = this.attachList.map(element => {
				if ((items.id && element.id == items.id) || (items.uid && element.uid == items.uid)) {
					element.delFlag = 1;
				}
				return element;
			});
			this.isNeedNextChange();
		},
		onChange(record) {
			let fileId = '';
			if (record.fileList?.length) {
				let arr = [];
				record.fileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			} else {
				fileId = record.id;
			}
			if (!fileId) {
				return;
			}
			let params = { type: record.type, fileId: fileId, lock: Boolean(!record[this.lockedKey]) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		onChangeAll() {
			let fileId = '';
			if (this.attachFileList?.length) {
				let arr = [];
				this.attachFileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList: this.attachList, lock: Boolean(!this.lockedAll) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		download(record) {
			let fileList = record.fileList;
			let files = fileList.map(item => item.path);
			let zipFileName = '';
			if (files.length === 0) {
				return;
			}
			if (files.length === 1) {
				zipFileName = fileList[0].transferName;
			} else {
				zipFileName = (record.typeDesc || record.itemDestc) + '.zip';
			}
			if (this.serialNo) {
				zipFileName = `${this.serialNo()}-${zipFileName}`;
			}
			files = files.join(',');
			if (this.downFileAllParent) {
				this.downFileAllParent({ zipFileName, files }).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		//上传前校验
		beforeUpload(file) {
			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return false;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return false;
			}
		},
		//文件上传
		fileChange(e, fileTypeObj, record) {
			let { file, fileList } = e;
			let uploadingList = fileList ?? [];
			let isContainUploading = uploadingList.some(item => {
				return item.status == 'uploading';
			});
			if (file.status == 'done') {
				// 上传成功
				// let fileData = file.response;
				let fileData = file.response.data; // 更换原有上传接口需要展示名称
				let ext = fileData.fileName.split('.')[fileData.fileName.split('.').length - 1].toLowerCase();
				let newFile = {
					...file,
					...fileData,
					path: fileData.fileUrl,
					ext,
					batchNo: record.batchNo,
					transType: record.transferType, // 运输方式
					name: fileData.fileName, // 更换原有上传接口需要展示名称
					createTime: fileData.createTime ?? moment().format('YYYY-MM-DD HH:mm:ss'),
					type: fileTypeObj.key,
					typeName: fileTypeObj.label,
					delflag: 0
				};
				this.attachList.push(newFile);
				this.isNeedNextChange();
			}
			let isContainNoStatus = uploadingList.some(item => {
				if (item.status) {
					return false;
				}
				return true;
			});
			if (isContainNoStatus || isContainUploading) {
				return;
			}
			if (!isContainUploading) {
				// 不包含上传状态时 改变按钮状态
				let errorNames = [];
				uploadingList.map(item => {
					if (item.status == 'error') {
						errorNames.push(item.name);
					}
				});
				if (errorNames.length > 0) {
					let errorNameString = errorNames.join('，');
					this.$message.error(`${record.typeName}: ${errorNameString}上传失败！`);
				}
			}
		},
		//查看附件
		handlePreview(items) {
			this.$refs.imageViewer.showFile(items);
		},
		dealWithData() {
			// 判断是否有上煤计划
			this.deliverColumn =
				this.deliverInfo?.deliverList && this.deliverInfo?.deliverList[0]?.coalPlanId
					? this.deliverStationInfoColumn
					: this.deliverInfoColumn;
			this.columnsCar =
				this.deliverInfo?.deliverList && this.deliverInfo?.deliverList[0]?.coalPlanId ? columnsCarStation : columnsCarInfo;
			this.$forceUpdate();
		},
		async openGuiji(items, type) {
			if (!items.id) {
				this.$message.error('该运单暂无轨迹');
				return;
			}
			let data = await this.openGuijiParent(items, type);
			if (type == 'SHIP') {
				this.shipDataSource = data;
				this.shipModel = true;
			}
		},
		jumpToShipTail(items) {
			if (this.type === 'rest') {
				window.open(
					'/logistics/LogisticsDetailShip?mmsi=' +
						items.identifierNo +
						'&shipName=' +
						items.shipName +
						'&type=historyLocation&deliveryId=' +
						items.id +
						'&from=yunkong'
				);
			} else {
				window.open(
					'/logistics/shipTrail?mmsi=' + items.identifierNo + '&shipName=' + items.shipName + '&type=2&deliverId=' + items.id + ''
				);
			}
		},
		// 数据输出整理
		onSubmit() {
			var checkRes = this.checkAssetsSubmit();
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return { deliveryBatchList: this.deliverList, list: this.attachList };
		},
		checkAssetsSubmit() {
			var obj = {};
			// 判断是否需要选择货物批次
			if (this.transportRequired && !this.deliverList?.length) {
				obj.errorStr = '请在运输凭证模块选择货物批次';
				return obj;
			}
			// 判断附件中是否有必填
			let requiredList = this.bankProductAssetConfigList.filter(item => item.required);
			// 如果是必填，判断是否有绑定批次
			if (!requiredList.length) {
				return obj;
			}
			if (requiredList.length && !this.deliverList?.length) {
				obj.errorStr = '请在运输凭证模块选择货物批次';
				return obj;
			}
			// 有批次的情况下，判断所有的批次是否包含必填附件信息
			let list = this.attachList.filter(item => item.delFlag != 1);
			this.deliverList.forEach(item => {
				let requiredListKey = requiredList.filter(items => {
					items.secondaryCategory.includes(item.transferType);
				});
				// 得到所有的必填类型
				let flag = requiredListKey.every(items =>
					list.some(itemss => itemss.batchNo === item.batchNo && itemss.type === items.key)
				);
				if (!flag) {
					obj.errorStr = '运输凭证模块-缺少必填附件';
				}
			});
			return obj;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.contentBox {
	font-size: 14px;
	color: #141517;
	background: none;
	margin: 0;
	min-width: 100%;

	::v-deep {
		.title {
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: 500;
			line-height: 32px;
			color: rgba(0, 0, 0, 0.8);
			margin-bottom: 15px;
			.ant-btn {
				padding: 0 10px;
			}
			div {
				font-family: PingFang SC;
			}
		}
		.mb50 {
			margin-bottom: 50px;
		}
		.content {
			.tip-box {
				display: flex;
				flex-direction: column;
				padding: 10px;
				border-radius: 4px;
				border: 1px solid #d0dfff;
				background: #e1eafe;
				color: rgba(0, 0, 0, 0.8);
				font-size: 12px;
				line-height: 22px;
				position: relative;
				overflow: hidden;
				.tip-title {
					// font-weight: 600;
				}
			}
			.ant-dropdown-menu-item {
				padding-left: 20px;
				padding-right: 20px;
				cursor: default;
				div {
					cursor: pointer;
				}
				.required {
					position: relative;
					&::before {
						position: absolute;
						top: 50%;
						bottom: 50%;
						margin: auto;
						right: 100%;
						width: 14px;
						height: 14px;
						line-height: 14px;
						color: #ea5530;
						content: '*';
					}
				}
				&.ant-dropdown-menu-item-active {
					background: #e4ebf4;
					color: @primary-color;
					.ant-upload {
						color: @primary-color;
					}
				}
				.ant-upload-list {
					display: none;
				}
			}
			.select {
				margin: 20px 0;
				font-family: PingFang SC;
				font-size: 14px;
				font-weight: 400;
				line-height: 26px;
				text-align: left;
				color: #77889d;
				.selectAll {
					font-family: PingFang SC;
					font-size: 14px;
					font-weight: 400;
					text-align: left;
					color: #000000;
				}
				.number {
					font-family: D-DIN-PRO;
					font-size: 18px;
					font-weight: 500;

					font-size: 18px;
					color: #f46332;
				}
			}

			.nameMain {
				white-space: normal;
				color: @primary-color;
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 14px; /* 100% */
				.nameEdit {
					background: #f3f5f6;
					display: inline-block;
					margin: 2px 8px;
					border-radius: 4px;
					padding: 6px;
					span {
						cursor: pointer;
						vertical-align: middle;
					}
					.del {
						width: 14px;
						cursor: pointer;
						vertical-align: middle;
						margin-left: 8px;
					}
				}
				.name {
					display: inline-block;
					border-left: 1px solid #e9effc;
					padding: 0px 14px;
					line-height: 14px;
					margin: 6px 0;
					&:first-child {
						border: 0;
					}
				}
			}

			.preview {
				cursor: pointer;
				margin-right: 14px;
				padding-right: 14px;
				border-right: 1px solid #e9effc;
			}
			.preview-box {
				.preview:last-child {
					border-right: 0;
				}
			}
		}
	}
}
.slModel {
	.title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 18px;
		line-height: 58px;
		color: rgba(0, 0, 0, 0.8);
		background: #f3f5f6;
		padding-left: 20px;
		border-radius: 8px 8px 0px 0px;
	}

	/deep/ .ant-modal-body {
		padding: 0;
	}
	// /deep/ .ant-modal-close-x {
	//   background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	//   background-size: cover;
	//   .ant-modal-close-icon {
	//     display: none;
	//   }
	// }
	.status-tag {
		display: inline-block;
		padding: 4px 6px;
		height: 20px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 12px;
		background: #c1d7ff;
		color: #4682f3;
		cursor: pointer;
		&.status-3 {
			background: #c1d7ff;
			color: #4682f3;
		}
		&.status-4 {
			background: #c5ecdd;
			color: #3eb384;
		}
	}
	.select {
		margin: 20px 0;
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: #77889d;
		.selectAll {
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 400;
			text-align: left;
			color: #000000;
		}
		.number {
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;

			font-size: 18px;
			color: #f46332;
		}
	}
	.footer {
		text-align: right;

		.ant-btn {
			margin-left: 20px;
			width: 90px;
			color: rgba(0, 0, 0, 0.8);
			border: 1px solid #c6cdd8;
			height: 34px;
		}

		.ant-btn-primary {
			color: #ffffff;
			border: none;
		}
	}
}
</style>
