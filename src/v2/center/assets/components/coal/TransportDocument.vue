<template>
	<div class="contentBox">
		<div
			class="content"
			v-if="deliverInfo"
		>
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
				<div
					class="partBox"
					v-if="assetsConfig.DELIVER_AUTOMOBILE_CREDENTIALS"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								type="primary"
								v-if="receivalVO"
								>运输凭证</a-button
							>
						</div>
					</div>
					<template v-if="deliverInfo.deliverList">
						<span>批次号</span>
						<a-table
							:pagination="false"
							:columns="deliverColumns"
							:data-source="deliverInfo.deliverList.filter(item => item.transferType == CONSTANTS.despatchModeDict.AUTOMOBILE)"
							:scroll="{ x: true }"
							rowKey="index"
							:row-selection="rowSelectionOne"
						></a-table>
					</template>
					<div v-else>暂无数据</div>
					<Upload
						v-if="receivalVO"
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
					v-if="
						assetsConfig.DELIVER_TRAIN_BIG_TICKET || assetsConfig.DELIVER_TRAIN_CAR_NUMBER || assetsConfig.DELIVER_TRAIN_OTHER
					"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								v-if="assetsConfig.DELIVER_TRAIN_BIG_TICKET"
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
								v-if="assetsConfig.DELIVER_TRAIN_CAR_NUMBER"
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
								v-if="assetsConfig.DELIVER_TRAIN_OTHER"
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
							:data-source="deliverInfo.deliverList.filter(item => item.transferType == CONSTANTS.despatchModeDict.TRAIN)"
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
						transType="TRAIN"
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
					v-if="assetsConfig.DELIVER_SHIP_CREDENTIALS || assetsConfig.DELIVER_SHIP_HARBOR || assetsConfig.DELIVER_SHIP_OTHER"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								v-if="assetsConfig.DELIVER_SHIP_CREDENTIALS"
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
								v-if="assetsConfig.DELIVER_SHIP_HARBOR"
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
								v-if="assetsConfig.DELIVER_SHIP_OTHER"
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
							:data-source="deliverInfo.deliverList.filter(item => item.transferType == CONSTANTS.despatchModeDict.SHIP)"
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
						:selectedRows="selectedRowsTwo"
						mode="transport"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>

				<!-- 附件展示 -->
				<template v-if="deliverInfo.attachList">
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
								<a href="javascript:;">删除</a>
							</a-popconfirm>
						</template>
					</a-table>
				</template>
				<div v-else>暂无数据</div>
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
								v-if="items.id && items.transferType != 'AUTOMOBILE'"
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
						:data-source="filterLockFile(deliverInfo.attachList)"
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
import { filterLockFile } from '@/untils/factory.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_RECEIVERECORDINFO, API_getRouteInfo, API_GETTRAINRECORD } from '@/v2/center/assets/api/index.js';
import Upload from '../common/Upload.vue';
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
			filterLockFile,
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
			deliverColumnsNoOp: [
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
				}
			],
			assetsConfig: {},
			fileInfos: [], // 附件信息
			fileTypeOne: 'DELIVER_BIG_TICKET', // 火运默认附件类型大票
			fileType: 'DELIVER_CREDENTIALS', // 船运默认附件类型大票
			selectedRowsOne: [],
			selectedRowsTwo: [],
			editFilesList: [] // 编辑情况下，附件列表数据
		};
	},
	props: ['editFlag', 'deliverInfo', 'contractInfo', 'noFileName', 'receivalVO'],
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
			this.checkAssetsConfig(data);
		}
	},
	mounted() {
		if (this.editFlag) {
			// 编辑情况下，给表格数据初始化
			this.editFilesList = Object.assign([], (this.deliverInfo || {}).attachList || []);
		}
		// 移除轨迹操作
		if (
			this.deliverInfo.deliverList &&
			this.deliverInfo.deliverList[0] &&
			this.deliverInfo.deliverList[0].transferType == 'AUTOMOBILE'
		) {
			this.deliverColumns = this.deliverColumnsNoOp;
		}

		this.checkAssetsConfig(this.deliverInfo);
	},
	computed: {
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
		// 资产包配置
		checkAssetsConfig(data) {
			let list = data.bankProductAssetConfigList || [{}];
			let autoPici = data.deliverList.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.AUTOMOBILE).length > 0;
			this.assetsConfig.DELIVER_AUTOMOBILE_CREDENTIALS =
				autoPici && (_.find(list, { item: 'DELIVER_AUTOMOBILE_CREDENTIALS' }) || {}).status == 1;

			let trainPici = data.deliverList.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.TRAIN).length > 0;

			this.assetsConfig.DELIVER_TRAIN_BIG_TICKET =
				trainPici && (_.find(list, { item: 'DELIVER_TRAIN_BIG_TICKET' }) || {}).status == 1;
			this.assetsConfig.DELIVER_TRAIN_CAR_NUMBER =
				trainPici && (_.find(list, { item: 'DELIVER_TRAIN_CAR_NUMBER' }) || {}).status == 1;
			this.assetsConfig.DELIVER_TRAIN_OTHER = trainPici && (_.find(list, { item: 'DELIVER_TRAIN_OTHER' }) || {}).status == 1;

			let shipPici = data.deliverList.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.SHIP).length > 0;
			this.assetsConfig.DELIVER_SHIP_CREDENTIALS =
				shipPici && (_.find(list, { item: 'DELIVER_SHIP_CREDENTIALS' }) || {}).status == 1;
			this.assetsConfig.DELIVER_SHIP_HARBOR = shipPici && (_.find(list, { item: 'DELIVER_SHIP_HARBOR' }) || {}).status == 1;
			this.assetsConfig.DELIVER_SHIP_OTHER = shipPici && (_.find(list, { item: 'DELIVER_SHIP_OTHER' }) || {}).status == 1;
			this.$forceUpdate();
		},
		checkAssetsSubmit(deliverInfo) {
			var fileList = deliverInfo.attachList;
			let list = deliverInfo.bankProductAssetConfigList || [];
			var obj = {};

			for (var key in this.assetsConfig) {
				var o = _.find(list, { item: key });
				if (this.assetsConfig[key] && o.required == 1) {
					if (!fileList.some(i => i.type == o.assetAttachType && i.delFlag == 0)) {
						obj.errorStr = '运输凭证模块-缺少:' + o.itemDesc;
						break;
					}
				}
			}

			return obj;
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
		onSubmit() {
			var checkRes = this.checkAssetsSubmit(this.deliverInfo);
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return this.deliverInfo || { attachList: [] };
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #383a3f;
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
		margin-right: 15px;
		float: right;
	}
	::v-deep.ant-btn {
		height: 28px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
