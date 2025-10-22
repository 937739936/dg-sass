<template>
	<div class="center-storage-mine">
		<div class="title-wrapper">
			<div class="title-text">在港仓储信息</div>
		</div>

		<!-- 检索条件 -->
		<div class="search-wrapper">
			<a-form-model
				class="storage-mine-search"
				ref="searchForm"
				:model="searchForm"
			>
				<a-row :gutter="24">
					<a-col :span="9">
						<a-form-model-item
							:label-col="{ span: 6 }"
							:wrapper-col="{ span: 18 }"
							label="港口名称"
						>
							<a-select
								v-model="searchForm.harborType"
								@change="handleChangeName"
							>
								<a-select-option
									v-for="item in companyList"
									:key="item.value"
									:value="item.value"
									>{{ item.text }}</a-select-option
								>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col :span="9">
						<a-form-model-item
							:label-col="{ span: 6 }"
							:wrapper-col="{ span: 18 }"
							label="选择日期"
						>
							<a-range-picker
								v-model="searchDate"
								format="YYYY-MM-DD"
								:placeholder="['开始时间', '结束时间']"
								@change="handleChangeData"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="6">
						<a-form-model-item
							:label-col="{ span: 0 }"
							:wrapper-col="{ span: 24 }"
						>
							<a-button
								type="primary"
								@click="handleSearch"
								>查询</a-button
							>
							<a-button @click="handleReset">重置</a-button>
						</a-form-model-item>
					</a-col>
				</a-row>
			</a-form-model>
		</div>

		<!-- 统计 -->
		<div class="logistics-wrapper">
			<div class="logistics-item">
				<div class="text">当前存货吨数（吨）</div>
				<div class="number">
					{{ statisticData.totalRemainTons | formatNumber }}
				</div>
			</div>
			<div class="logistics-item">
				<div class="text">入场吨数合计（吨）</div>
				<div class="number">{{ statisticData.totalInTons | formatNumber }}</div>
			</div>
			<div class="logistics-item">
				<div class="text">出场吨数合计（吨）</div>
				<div class="number">
					{{ statisticData.totalOutTons | formatNumber }}
				</div>
			</div>
		</div>

		<!-- 列表 -->
		<div class="com-table-wrapper">
			<a-tabs
				:default-active-key="active"
				@change="handleTabsChange"
			>
				<a-tab-pane
					key="1"
					:tab="searchForm.harborType == 1 ? '出入场详情' : '当前货存详情'"
				/>
				<a-tab-pane
					key="2"
					tab="入场详情"
				/>
				<a-tab-pane
					key="3"
					tab="出场详情"
				/>
			</a-tabs>
			<component
				:is="component"
				:search="searchForm"
				@update="handleUpdateSearchData"
				ref="tableInfo"
			/>
			<a-button
				v-if="total > 0"
				class="export-btn"
				type="primary"
				@click="handleExport"
				>导出</a-button
			>
		</div>
	</div>
</template>
<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import StorageAllTZG from '../components/TZGStorageAll';
import StorageAdmissionTZG from '../components/TZGStorageAdmission';
import StorageExitTZG from '../components/TZGStorageExit';
import StorageAllCFD from '../components/CFDStorageAll';
import StorageAdmissionCFD from '../components/CFDStorageAdmission';
import StorageExitCFD from '../components/CFDStorageExit';
import {
	API_getWarehouseHarborGetMyWarehouseStatistic,
	API_getWarehouseHarborHncfStoreGetMyWarehouseStatistic
} from '@/v2/center/storage/api';
import comDownload from '@sub/utils/comDownload.js';
export default {
	name: 'CenterStorageMine',
	data() {
		return {
			searchForm: {},
			total: 0,
			active: '1',
			searchDate: null,
			searchFormCache: {}, // 缓存检索数据，用于导出
			companyList: filterCodeByKey('harbor_type'),
			statisticData: {} // 统计数据
		};
	},
	computed: {
		component() {
			let str = '';
			switch (this.active) {
				case '1':
					if (this.searchForm.harborType == '1') str = 'StorageAllTZG'; // 泰州港出入港详情
					if (this.searchForm.harborType == '2') str = 'StorageAllCFD'; // 曹妃甸出入港详情
					break;
				case '2':
					if (this.searchForm.harborType == '1') str = 'StorageAdmissionTZG'; // 泰州港入港详情
					if (this.searchForm.harborType == '2') str = 'StorageAdmissionCFD'; // 曹妃甸入港详情
					break;
				case '3':
					if (this.searchForm.harborType == '1') str = 'StorageExitTZG'; // 泰州港出港详情
					if (this.searchForm.harborType == '2') str = 'StorageExitCFD'; // 曹妃甸出港详情
					break;
			}
			return str;
		}
	},
	components: {
		StorageAllTZG,
		StorageAdmissionTZG,
		StorageExitTZG,
		StorageAllCFD,
		StorageAdmissionCFD,
		StorageExitCFD
	},
	mounted() {
		this.searchForm = {
			harborType: this.companyList[0] && this.companyList[0].value ? this.companyList[0].value : ''
		};
		this.handleSearch();
	},
	methods: {
		// 获取统计信息
		getStatisticData() {
			// 泰州港
			if (this.searchForm.harborType == '1') {
				API_getWarehouseHarborGetMyWarehouseStatistic(this.searchForm).then(resp => {
					if (resp.success) this.statisticData = resp.result || {};
				});
			}
			// 华能曹妃甸港
			if (this.searchForm.harborType == '2') {
				API_getWarehouseHarborHncfStoreGetMyWarehouseStatistic(this.searchForm).then(resp => {
					if (resp.success) this.statisticData = resp.result || {};
				});
			}
		},
		// 切换tab标签
		handleTabsChange(val) {
			this.active = val;
			this.handleSearch();
		},
		// 切换名称
		handleChangeName(val) {
			this.searchForm = Object.assign({
				...this.searchForm,
				harborType: val
			});
			this.handleSearch();
		},
		// 切换时间
		handleChangeData(val, string) {
			this.searchForm.startDate = string[0];
			this.searchForm.endDate = string[1];
		},
		// 搜索
		handleSearch() {
			if (this.companyList.length === 0) {
				this.$message.error('暂无港口数据可供查询');
				return false;
			}
			this.$nextTick(() => {
				this.getStatisticData();
				this.$refs.tableInfo.getList(this.searchForm);
			});
		},
		// 重置
		handleReset() {
			if (this.companyList.length === 0) {
				this.$message.error('暂无港口数据可供查询');
				return false;
			}
			this.searchDate = null;
			this.searchForm = {
				harborType: this.searchForm.harborType // 1-泰州港 2-曹妃甸
			};
			this.$refs.tableInfo.reset(this.searchForm);
			this.getStatisticData();
		},
		// 每次检索更新searchFormCache
		handleUpdateSearchData(data, total) {
			this.searchFormCache = Object.assign({}, data);
			this.total = total;
		},
		// 导出-导出当前时间段的全部数据
		handleExport() {
			if (this.companyList.length === 0) {
				this.$message.error('暂无港口数据可供导出');
				return false;
			}
			let params = {
				harborType: this.searchFormCache.harborType,
				startDate: this.searchFormCache.startDate,
				endDate: this.searchFormCache.endDate
			};
			let obj = this.$refs.tableInfo.exportXls(params);
			let exportFunc = obj.func;
			let name = obj.name;
			exportFunc.then(res => {
				comDownload(res, undefined, name + '.xls');
			});
		}
	},
	filters: {
		/**
		 * 将val格式化为保留两位小数，整数部分每三位数一个逗号的数字
		 * @param val 1219899.009
		 * return 1,219,899.01
		 */
		formatNumber(val) {
			if (typeof val !== 'number') val = Number(val);
			if (Number.isNaN(val)) val = 0;
			let isNegative = val < 0;
			val = Math.abs(val);

			val = val.toFixed(2);
			let arr = val.split('.');
			let arrFront = [];
			const length = arr[0].length;
			if (length <= 3) {
				arrFront.unshift(arr[0]);
			} else {
				for (let i = 3; i <= parseInt(length / 3) * 3; i = i + 3) {
					let start = length - i;
					arrFront.unshift(arr[0].substr(start, 3));
					if (start < 3 && start > 0) arrFront.unshift(arr[0].substring(0, start));
				}
			}
			let res = arrFront.join(',') + '.' + arr[1];
			return isNegative ? '-' + res : res;
		}
	}
};
</script>
<style lang="less" scoped>
.center-storage-mine {
	.title-wrapper {
		padding-bottom: 20px;
		border-bottom: 1px solid #d8d8d8;
		margin-bottom: 40px;
		.title-text {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.65);
		}
	}
	.storage-mine-search {
		margin-bottom: 20px;
		button {
			margin-left: 20px;
		}
	}
	.logistics-wrapper {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 40px;
		.logistics-item {
			text-align: center;
			font-size: 16px;
			.text {
				color: rgba(51, 51, 51, 0.65);
			}
			.number {
				color: #333333;
				padding: 8px;
			}
		}
	}

	.com-table-wrapper {
		position: relative;
		::v-deep.ant-tabs-tab {
			font-size: 16px;
			text-align: center;
			line-height: 21px;
		}
		.export-btn {
			position: absolute;
			top: 5px;
			right: 0px;
		}
		::v-deepbutton.export-btn {
			font-size: 16px;
		}
		::v-deep.ant-tabs-bar {
			margin: 0px;
		}
	}
}
</style>
