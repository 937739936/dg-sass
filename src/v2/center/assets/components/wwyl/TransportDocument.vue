<template>
	<div class="contentBox">
		<div class="content">
			<!-- 编辑模块 -->
			<template v-if="editFlag">
				<p class="title">
					运输凭证信息<span
						class="redTips"
						v-if="editFlag"
						>必须存在附件</span
					>
				</p>
				<!-- 运输方式为汽运-->
				<a-table
					rowKey="id"
					:rowSelection="{
						selectedRowKeys: goodsSelectedRowKeys,
						onSelectAll: onSelectAllGoods,
						onSelect: onSelectGoods,
						onChange: onChangeGoods
					}"
					:columns="goodsColumns"
					:dataSource="goodsData"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				>
					<template
						slot="operation"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="jumpToDetail('release', record)"
							>查看</a
						>
					</template>

					<a-table
						class="inner-table"
						:rowSelection="{
							selectedRowKeys: goodsReceiveSelectedRowKeys,
							onChange: onChangeGoodsReceive,
							onSelect: onSelectGoodsReceive
						}"
						slot="expandedRowRender"
						slot-scope="record"
						:columns="innerColumns"
						:data-source="record.receiveRecordsList"
						rowKey="id"
						:pagination="false"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="jumpToDetail('goods', record)"
								>查看</a
							>
						</template>
					</a-table>
				</a-table>
				<div
					class="partBox"
					v-if="deliverInfo && autoData.length"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button type="primary">运输凭证</a-button>
						</div>
					</div>
					<template v-if="deliverInfo.deliverList">
						<span>批次号</span>
						<a-table
							:pagination="false"
							:columns="deliverColumns.slice(0, deliverColumns.length - 1)"
							:data-source="autoData"
							:scroll="{ x: true }"
							rowKey="index"
							:row-selection="rowSelectionOne"
						></a-table>
					</template>
					<div v-else>暂无数据</div>
					<Upload
						:receivalVO="receivalVO"
						@uploadFiles="getUploadFiles"
						type="DELIVER_CREDENTIALS"
						btnText="选择文件"
						:selectedRows="selectedRowsOne"
						mode="transport"
					></Upload>

					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>

				<!-- 运输方式为火运 -->
				<div
					class="partBox"
					v-if="deliverInfo && trainData.length"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'DELIVER_BIG_TICKET'"
								@click="
									() => {
										fileTypeOne = 'DELIVER_BIG_TICKET';
									}
								"
								>大票</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'DELIVER_CAR_NUMBER_TABLE'"
								@click="
									() => {
										fileTypeOne = 'DELIVER_CAR_NUMBER_TABLE';
									}
								"
								>车号表</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'DELIVER_OTHER_CREDENTIALS'"
								@click="
									() => {
										fileTypeOne = 'DELIVER_OTHER_CREDENTIALS';
									}
								"
								>其他凭证</a-button
							>
						</div>
						<span>注：需【全部大票】或者【20%及以上大票+大票明细】</span>
					</div>
					<template v-if="deliverInfo.deliverList">
						<span>批次号</span>
						<a-table
							:pagination="false"
							:columns="deliverColumns"
							:data-source="trainData"
							:scroll="{ x: true }"
							rowKey="index"
							:row-selection="rowSelectionTwo"
						>
							<template
								slot="action"
								slot-scope="action, items"
							>
								<a
									href="javascript:;"
									@click="openGuiji(items, 'TRAIN')"
									v-if="items.id"
									>查看轨迹</a
								>
							</template>
						</a-table>
					</template>
					<div v-else>暂无数据</div>
					<Upload
						:receivalVO="receivalVO"
						@uploadFiles="getUploadFiles"
						:type="fileTypeOne"
						btnText="选择文件"
						:selectedRows="selectedRowsTwo"
						mode="transport"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>

				<!-- 运输方式为船运-->
				<div
					class="partBox"
					v-if="deliverInfo && shipData.length"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								type="primary"
								:ghost="fileType != 'DELIVER_CREDENTIALS'"
								@click="
									() => {
										fileType = 'DELIVER_CREDENTIALS';
									}
								"
								>运输凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileType != 'DELIVER_SHIP_HARBOR'"
								@click="
									() => {
										fileType = 'DELIVER_SHIP_HARBOR';
									}
								"
								>港口确认凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileType != 'DELIVER_OTHER_CREDENTIALS'"
								@click="
									() => {
										fileType = 'DELIVER_OTHER_CREDENTIALS';
									}
								"
								>其他凭证</a-button
							>
						</div>
					</div>
					<template v-if="deliverInfo.deliverList">
						<span>批次号</span>
						<a-table
							:pagination="false"
							:columns="deliverColumns"
							:data-source="shipData"
							:scroll="{ x: true }"
							rowKey="index"
							:row-selection="rowSelectionThree"
						>
							<template
								slot="action"
								slot-scope="action, items"
							>
								<a
									href="javascript:;"
									@click="openGuiji(items, 'SHIP')"
									v-if="items.id"
									>查看轨迹</a
								>
							</template>
						</a-table>
					</template>
					<div v-else>暂无数据</div>
					<Upload
						:receivalVO="receivalVO"
						@uploadFiles="getUploadFiles"
						:type="fileType"
						btnText="选择文件"
						:selectedRows="selectedRowsThree"
						mode="transport"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>

				<!-- 附件展示 -->
				<template v-if="deliverInfo && deliverInfo.attachList">
					<a-table
						:pagination="false"
						:columns="editFilesColumns"
						:data-source="editFilesList"
						:scroll="{ x: true }"
						rowKey="index"
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
								<a
									href="javascript:;"
									v-if="!items.locked"
									>删除</a
								>
							</a-popconfirm>
							<span v-else> &nbsp;</span>
						</template>
					</a-table>
				</template>
			</template>

			<!-- 详情模块 -->
			<template v-if="!editFlag">
				<p class="title">运输凭证信息</p>
				<p class="sub-title">批次信息</p>
				<template v-if="deliverInfo.deliverList">
					<a-table
						:pagination="false"
						:columns="deliverColumns"
						:data-source="deliverInfo.deliverList || []"
						:scroll="{ x: true }"
						rowKey="index"
					>
						<template
							slot="action"
							slot-scope="action, items"
						>
							<a
								href="javascript:;"
								@click="openGuiji(items, items.transferType)"
								v-if="items.id && items.transferType != CONSTANTS.despatchModeDict.AUTOMOBILE"
								>轨迹查询</a
							>
						</template>
					</a-table>
				</template>
				<p
					class="sub-title"
					style="margin-top: 20px"
				>
					附件信息
				</p>
				<template v-if="deliverInfo.attachList">
					<a-table
						:pagination="false"
						:columns="noFileName ? noFileNameFilesColumns : filesColumns"
						:data-source="deliverInfo.attachList"
						:scroll="{ x: true }"
						rowKey="index"
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
				<div v-else>暂无数据</div>
			</template>
			<a-modal
				v-model="shipModel"
				width="900px"
				:footer="null"
			>
				<a-table
					:dataSource="shipDataSource"
					:columns="columnsShip"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				>
					<span
						slot="operation"
						slot-scope="text, record"
					>
						<a @click.self="jumpToShipTail(record)">轨迹查询</a>
					</span>
				</a-table>
			</a-modal>
		</div>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_RECEIVERECORDINFO,
	API_getRouteInfo,
	API_GETTRAINRECORD,
	API_GETPOOLDeliverData
} from '@/v2/center/assets/api/index.js';
import Upload from '../common/Upload.vue';
import { mapGetters } from 'vuex';
import _ from 'lodash';
export default {
	name: 'TransportDocument',
	data() {
		return {
			shipModel: false,
			shipDataSource: [],
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
					dataIndex: 'deliverQuantity'
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					}
				}
			],
			goodsColumns: [
				{
					title: '批次号',
					dataIndex: 'batchNo'
				},
				{
					title: '运输方式',
					dataIndex: 'transType',
					width: '200px',
					customRender: text => {
						return filterCodeByValueName(text, 'despatchTypeDict');
					}
				},
				{
					title: '发货日期',
					dataIndex: 'deliverDate'
				},
				{
					title: '发货数量(吨)',
					dataIndex: 'deliverQuantity'
				},
				{
					title: '货转凭证',
					dataIndex: 'goodsTransferFlag'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			innerColumns: [
				{
					title: '收货编号',
					dataIndex: 'receiveNo'
				},
				{
					title: '',
					dataIndex: 'aaa',
					width: '200px'
				},
				{
					title: '收货日期',
					dataIndex: 'receiveDate'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiveQuantity'
				},
				{
					title: '货转凭证',
					dataIndex: 'goodsTransferFlag'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' }
			], // 附件详情表头
			noFileNameFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 200 }
			],
			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			deliverColumns: [
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '品名', dataIndex: 'goodName', key: 'goodName' },
				{ title: '发货数量(吨)', dataIndex: 'deliverQuntity', key: 'deliverQuntity' },
				{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
				{
					title: '发运方式',
					dataIndex: 'transferType',
					key: 'transferType',
					customRender: text => {
						return filterCodeByValueName(text, 'despatchTypeDict') || text;
					}
				},
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			goodsSelectedRowKeys: [],
			goodsReceiveSelectedRowKeys: [],
			fileInfos: [], // 附件信息
			fileTypeOne: 'DELIVER_BIG_TICKET', // 火运默认附件类型大票
			fileType: 'DELIVER_CREDENTIALS', // 船运默认附件类型大票
			selectedRowsOne: [],
			selectedRowsTwo: [],
			selectedRowsThree: [],
			editFilesList: [], // 编辑情况下，附件列表数据
			goodsData: []
		};
	},
	props: ['editFlag', 'noFileName', 'receivalVO', 'deliverInfo'],
	filters: {
		filterCodeByValueName
	},
	components: {
		Upload
	},
	watch: {
		deliverInfo: function (data) {
			if (this.editFlag) {
				// 编辑情况下，给表格数据初始化
				this.editFilesList = Object.assign([], (this.deliverInfo || {}).attachList || []);
			}

			if (this.deliverInfo && this.deliverInfo.deliveryIds) {
				this.goodsSelectedRowKeys = this.deliverInfo.deliveryIds ? this.deliverInfo.deliveryIds.split(',') : [];
				this.goodsReceiveSelectedRowKeys = this.deliverInfo.receiveRecordIds ? this.deliverInfo.receiveRecordIds.split(',') : [];
			}
		},
		VUEX_POOL_ASSET_OBJ(v) {
			if (v.deliveryList) {
				this.goodsData = v.deliveryList || [];
			}
		}
	},
	mounted() {
		if (this.editFlag) {
			// 编辑情况下，给表格数据初始化
			this.editFilesList = Object.assign([], (this.deliverInfo || {}).attachList || []);
		}
		if (this.deliverInfo && this.deliverInfo.deliveryIds) {
			this.goodsSelectedRowKeys = this.deliverInfo.deliveryIds ? this.deliverInfo.deliveryIds.split(',') : [];
			this.goodsReceiveSelectedRowKeys = this.deliverInfo.receiveRecordIds ? this.deliverInfo.receiveRecordIds.split(',') : [];
		}
	},
	computed: {
		...mapGetters('business', {
			VUEX_POOL_ASSET_OBJ: 'VUEX_POOL_ASSET_OBJ'
		}),
		autoData() {
			return this.deliverInfo?.deliverList?.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.AUTOMOBILE) || [];
		},
		trainData() {
			return this.deliverInfo?.deliverList?.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.TRAIN) || [];
		},
		shipData() {
			return this.deliverInfo?.deliverList?.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.SHIP) || [];
		},
		rowSelectionOne() {
			const t = this;
			return {
				type: 'checkbox',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsOne = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsOne = selectedRows;
				}
			};
		},
		rowSelectionTwo() {
			return {
				type: 'checkbox',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsTwo = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsTwo = selectedRows;
				}
			};
		},
		rowSelectionThree() {
			return {
				type: 'checkbox',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsThree = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsThree = selectedRows;
				}
			};
		}
	},
	methods: {
		getUploadFiles(data, type, mode, selectedRows) {
			// 上传文件 获取附件数据

			this.fileInfos = data;
			let selectedArr = selectedRows || [];

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let obj = this.deliverInfo;
			let sameFlag = true;
			for (var i in data) {
				if (obj && obj.attachList) {
					obj.attachList.forEach(item => {
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
			this.$message.success('添加成功');
			// 判断相同类型下不可上传文件名相同且内容相同的文件--end

			for (let i = 0; i < selectedArr.length; i++) {
				let item = selectedArr[i];
				for (let j = 0; j < this.fileInfos.length; j++) {
					let element = { ...this.fileInfos[j] };
					element.batchNo = item.batchNo;
					element.transType = item.transferType;
					this.deliverInfo.attachList.push(element);
					// 对编辑模块数据进行更新
					if (this.editFlag) {
						this.editFilesList.push(element);
					}
				}
			}
		},
		onChangeGoods(selectedRowKeys, r) {
			this.goodsSelectedRowKeys = selectedRowKeys;
		},
		onChangeGoodsReceive(selectedRowKeys) {
			this.goodsReceiveSelectedRowKeys = selectedRowKeys;
		},
		onSelectAllGoods(selected, selectedRows, changeRows) {
			for (var i = 0; i < changeRows.length; i++) {
				this.onSelectGoods(changeRows[i], selected);
			}
		},
		onSelectGoods(record, selected) {
			if (record.receiveRecordsList && record.receiveRecordsList.length > 0) {
				if (selected) {
					record.receiveRecordsList.forEach(item => {
						if (this.goodsReceiveSelectedRowKeys.indexOf(item.id) == -1) {
							this.goodsReceiveSelectedRowKeys.push(item.id);
						}
					});
				} else {
					record.receiveRecordsList.forEach(item => {
						if (this.goodsReceiveSelectedRowKeys.indexOf(item.id) > -1) {
							this.goodsReceiveSelectedRowKeys.splice(this.goodsReceiveSelectedRowKeys.indexOf(item.id), 1);
						}
					});
				}
			}
			this.formatData(1);
		},
		onSelectGoodsReceive(record, selected, selectedRows) {
			if (selectedRows.length == 0) {
				this.goodsSelectedRowKeys.splice(this.goodsSelectedRowKeys.indexOf(record.deliverBatchId), 1);
			}
			if (selected) {
				selectedRows.forEach(item => {
					if (this.goodsSelectedRowKeys.indexOf(item.deliverBatchId) == -1) {
						this.goodsSelectedRowKeys.push(item.deliverBatchId);
					}
				});
			}

			this.formatData(1);
		},
		jumpToDetail(type, record) {
			if (type == 'release') {
				window.open('/center/receive/accept/detail?deliverId=' + record.id + '&from=release&showAddFile=no');
			} else {
				window.open('/center/receive/accept/detail?deliverId=' + record.deliverBatchId + '&from=receive&showAddFile=no');
			}
		},
		openGuiji(items, type) {
			API_RECEIVERECORDINFO({ deliverId: items.id }).then(res => {
				if (type == 'SHIP') {
					this.shipDataSource = (res.result.deliveryInfoShip || []).map(item => {
						return {
							...item,
							id: items.id
						};
					});

					this.shipModel = true;
				} else {
					this.jumpToTail(res.result);
				}
			});
		},
		jumpToShipTail(items) {
			window.open(
				'/logistics/LogisticsDetailShip?mmsi=' +
					items.identifierNo +
					'&shipName=' +
					items.shipName +
					'&type=historyLocation&deliveryId=' +
					items.id +
					'&from=yunkong&coalType=COKING_COAL&transType=SHIP'
			);
		},
		jumpToTail(params) {
			if (params.waybillId) {
				// 新数据  联运管家 传运单号
				// 判断是否是神华外购
				API_getRouteInfo({ id: params.waybillId }).then(res => {
					if (res.success) {
						let hasPath = false;
						if (res.data) {
							for (let i = 0; i < res.data.length; i++) {
								if (res.data[i].waybillPhaseTraceInfoVO.length) {
									hasPath = true;
									break;
								}
							}
						}
						if (!hasPath) {
							this.$message.error('该运单暂无轨迹');
						} else {
							window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + params.waybillId);
						}
					}
				});
			} else {
				// 老数据 传批次号
				API_GETTRAINRECORD({ deliverBatchNo: params.batchNo }).then(res => {
					if (res.success) {
						if (params.despatchType == this.CONSTANTS.despatchModeDict.TRAIN) {
							window.open('/logistics/LogisticsDetailTrain?deliverBatchNo=' + params.batchNo);
						}
					}
				});
			}
		},
		deleteFiles(items) {
			// 删除附件

			let arr = this.deliverInfo.attachList;
			let changeArr = this.editFilesList;
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.batchNo == items.batchNo &&
					element.name == items.name
				) {
					index = _index;
				}
			});
			changeArr.splice(index, 1);
			arr.forEach(element => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.batchNo == items.batchNo &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		formatData(changeData) {
			let arr = [];
			for (var i = 0; i < this.goodsSelectedRowKeys.length; i++) {
				let c = _.find(this.goodsData, { id: this.goodsSelectedRowKeys[i] });
				if (c && c.receiveRecordsList) {
					let o = {
						deliveryId: c.id
					};

					for (var j = 0; j < this.goodsReceiveSelectedRowKeys.length; j++) {
						let d = _.find(c.receiveRecordsList, { id: this.goodsReceiveSelectedRowKeys[j] });
						if (d) {
							if (o.receiveId) {
								o.receiveId.push(this.goodsReceiveSelectedRowKeys[j]);
							} else {
								o.receiveId = [this.goodsReceiveSelectedRowKeys[j]];
							}
						}
					}
					arr.push({
						...o,
						receiveId: o.receiveId ? o.receiveId.join(',') : ''
					});
				}
			}

			if (changeData) {
				for (var i = 0; i < arr.length; i++) {
					if (!arr[i].deliveryId || !arr[i].receiveId) {
						return;
					}
				}
				API_GETPOOLDeliverData({ goodsInfo: JSON.stringify(arr) }).then(r => {
					if (r.success) {
						this.$emit('changeDetailData', r.data);
					}
				});
			}
			return arr;
		},
		onSubmit() {
			if (this.deliverInfo && (this.deliverInfo.attachList || []).filter(r => r.delFlag == 0).length) {
				let json = this.formatData(false);
				this.deliverInfo.goodsInfo = JSON.stringify(json);
				// this.deliverInfo.attachList = this.editFilesList
				return this.deliverInfo;
			} else {
				this.$message.error('运输凭证缺少相关附件');
				return false;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #383a3f;
	::v-deep .inner-table th[key='selection-column'] span {
		display: none;
	}
	.content {
		padding: 0 15px;
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
		p {
			margin-bottom: 15px;
		}

		.partBox {
			margin-bottom: 30px;
			.littleTitle {
				margin-bottom: 10px;
				margin-top: 13px;
				p {
					line-height: 28px;
					display: inline-block;
				}
				.typeBox {
					margin-left: 52px;
					display: inline-block;
					button {
						height: 28px;
						margin-right: 10px;
					}
				}
				span {
					float: right;
					color: #6b6f76;
					font-size: 12px;
					line-height: 28px;
				}
			}
			::v-deep.ant-table-wrapper {
				margin: 12px 0 10px 0;
			}
		}
	}

	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		margin-right: 15px;
		float: right;
	}
	::v-deep.ant-btn {
		height: 28px;
	}
}
</style>
