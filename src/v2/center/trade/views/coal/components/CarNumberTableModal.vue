<template>
	<a-modal
		centered
		title="车号表"
		width="70%"
		height="80%"
		v-model="visible"
		:mask="true"
		:maskClosable="false"
		:footer="null"
	>
		<div>
			<div
				style="
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					margin-bottom: 20px;
					font-size: 16px;
					font-weight: bold;
				"
			>
				<a-button
					type="primary"
					@click="exportXls"
					style="position: absolute; left: 100px; top: 10px"
					v-if="waybillId"
					>导出</a-button
				>
				<span>整列运输运单-车辆附表</span>
				<span
					>运单号码【{{ modalInfo.serialNo }}】共【{{
						modalInfo.waybillVehicleInfoVO ? modalInfo.waybillVehicleInfoVO.length : 0
					}}】车</span
				>
			</div>
			<div style="display: flex; flex-direction: row; margin-bottom: 20px; justify-content: space-between; font-weight: bold">
				<span>发站：{{ modalInfo.departureStation }}({{ modalInfo.departureRailwayName }})</span>
				<span>到站：{{ modalInfo.arriveStation }}({{ modalInfo.arriveRailwayName }})</span>
				<span>日期：{{ modalInfo.workDate }}</span>
			</div>
			<a-table
				:bordered="false"
				:columns="columns"
				rowKey="demandId"
				:dataSource="modalInfo.waybillVehicleInfoVO"
				:pagination="false"
				:scroll="{ x: false, y: 350 }"
			>
				<template
					slot="index"
					slot-scope="text, record, index"
				>
					{{ index + 1 }}
				</template>
			</a-table>
		</div>
	</a-modal>
</template>
<script>
import comDownload from '@sub/utils/comDownload.js';
import { API_ExportTrainTable } from '@/v2/center/trade/api/coal';

const columns = [
	{
		title: '序号',
		key: 'index',
		dataIndex: 'index',
		scopedSlots: { customRender: 'index' }
	},
	{
		title: '需求号',
		key: 'demandId',
		dataIndex: 'demandId'
	},
	{
		title: '车种车号',
		key: 'carInfo',
		dataIndex: 'carInfo'
	},
	{
		title: '货物重量(吨)',
		key: 'weight',
		dataIndex: 'weight'
	},
	{
		title: '计费重量(吨)',
		key: 'totalWeight',
		dataIndex: 'totalWeight'
	},
	{
		title: '施/蓬号',
		key: 'tentnum',
		dataIndex: 'tentnum'
	},
	{
		title: '备注',
		key: 'remark',
		dataIndex: 'remark'
	}
];
export default {
	props: {
		waybillId: {
			default: () => {
				return '';
			}
		},
		modalInfo: {
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			columns
		};
	},
	methods: {
		show() {
			this.visible = true;
		},
		close() {
			this.visible = false;
		},
		exportXls() {
			// 导出车号表
			API_ExportTrainTable({ id: this.waybillId }).then(res => {
				comDownload(res, undefined, '运单【' + this.modalInfo.serialNo + '】车辆附表.xls');
			});
		}
	}
};
</script>
<style lang="less" scoped></style>
