<template>
	<div class="center-storage-admission-and-exit">
		<div class="title-wrapper">
			<div class="title-text">港口出入场登记</div>
			<div>
				<a-button
					type="primary"
					@click="handleAddInfo"
					>新增入港信息</a-button
				>
			</div>
		</div>
		<div v-if="tableData.length > 0">
			<div
				v-for="(item, index) in tableData"
				:key="index"
				class="table-wrapper"
			>
				<AdmissionAndExitTable
					@deleteInConfirm="getTableData"
					:data="item"
				/>
			</div>
		</div>
		<div
			class="no-res"
			v-else
		>
			<div class="ant-table-placeholder">
				<div class="ant-empty ant-empty-normal">
					<div class="ant-empty-image">
						<svg
							width="64"
							height="41"
							viewBox="0 0 64 41"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g
								transform="translate(0 1)"
								fill="none"
								fillRule="evenodd"
							>
								<ellipse
									fill="#F5F5F5"
									cx="32"
									cy="33"
									rx="32"
									ry="7"
								></ellipse>
								<g
									fillRule="nonzero"
									stroke="#D9D9D9"
								>
									<path
										d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
									></path>
									<path
										d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
										fill="#FAFAFA"
									></path>
								</g>
							</g>
						</svg>
					</div>
					<p class="ant-empty-description">暂无数据</p>
				</div>
			</div>
		</div>
		<TZGAdmissionAdd
			@addConfirm="getTableData"
			ref="admissionAddTZG"
		/>
	</div>
</template>
<script>
import AdmissionAndExitTable from '../components/AdmissionAndExitTable.vue';
import TZGAdmissionAdd from '../components/TZGAdmissionAdd.vue';
import { API_getWarehouseHarborListTz } from '@/v2/center/storage/api';
export default {
	name: 'CenterStorageAdmissionAndExit',
	components: {
		AdmissionAndExitTable,
		TZGAdmissionAdd
	},
	data() {
		return {
			tableData: []
		};
	},
	mounted() {
		this.getTableData();
	},
	methods: {
		// 获取列表信息
		getTableData() {
			API_getWarehouseHarborListTz({
				harborType: 1 // 泰州港
			}).then(resp => {
				if (resp.success) {
					this.tableData = resp.result || [];
				}
			});
		},
		handleAddInfo() {
			this.$refs.admissionAddTZG.init(false);
		}
	}
};
</script>
<style lang="less" scoped>
.center-storage-admission-and-exit {
	.title-wrapper {
		display: flex;
		justify-content: space-between;
		padding-bottom: 20px;
		border-bottom: 1px solid #d8d8d8;
		.title-text {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.65);
		}
		::v-deepbutton {
			font-size: 16px;
		}
	}
	.no-res {
		padding-top: 100px;
	}
}
</style>
