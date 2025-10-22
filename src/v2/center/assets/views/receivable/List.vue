<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>应收账款管理</span
				>
				<a-button
					v-if="isCoreCompany"
					@click="gotoAdd"
					type="primary"
					>新增应收账款</a-button
				>
			</div>
			<AssetsManagementList
				ref="assetsList"
				:searchList="searchList"
				:defaultStatusData="tabList"
				:defaultTabType="'TAB_ALL'"
				:tabTypeName="'assetTabType'"
				:columns="columns"
				:listApi="API_GetAccountsReceivableList"
				:statisticsApi="API_GetAccountsReceivableCountManualAssetTabState"
				:exportApi="API_AccountsReceivableListExportExcel"
				exportName="应收账款记录"
				:synchroApi="API_SyncReceivable"
				:statusTipApi="API_GetAssetsStatusTip"
			>
				<template
					slot="customAction"
					slot-scope="{ record }"
				>
					<a-space :size="10">
						<a
							v-auth="'asset:recv:view'"
							href="javascript:;"
							@click="goDetail(record)"
							>查看</a
						>
						<!-- 状态为“待确认”、"平台驳回"、"资方驳回"或"已批注"时，可编辑 -->
						<template v-if="record.assetType == 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'">
							<a
								v-if="
									record.status == 'PLATFORM_REJECT' ||
									record.status == 'BANK_ROLLBACK' ||
									record.status == 'PLATFORM_OPERATE_REJECT' ||
									record.status == 'TO_BE_VERIFY'
								"
								v-auth="'asset:pay:edit'"
								href="javascript:;"
								@click="goToEdit(record)"
								>编辑</a
							>
						</template>
						<!-- 状态为“待确认，待确权”、"平台驳回"或"已批注" “可融资”时，可作废 ,可开票-->
						<template v-if="record.assetType == 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'">
							<a
								href="javascript:;"
								@click="goZuofei(record)"
								v-if="record.assetCancel"
								>作废</a
							>
						</template>
						<template v-if="record.assetType == 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'">
							<router-link
								style="margin-left: 8px"
								v-if="record.status == 'FUNDED'"
								:to="{ path: '/center/assets/receivable/manual/daiDetail', query: { id: record.id, activeIndex: 0 } }"
							>
								补录
							</router-link>
						</template>
					</a-space>
				</template>
			</AssetsManagementList>
		</a-card>
		<a-modal
			class="slModal cancel-modal"
			:visible="zuofeiVisible"
			:width="460"
			@cancel="zuofeiVisible = false"
			title="确认作废？"
		>
			<div class="tip"><span class="red">*</span> 请输入作废原因：</div>
			<a-textarea
				v-model="reasonName"
				placeholder="请输入资产作废原因，最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="zuofeiVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="submitZ"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>

		<!-- <a-modal
			v-model="zuofeiVisible"
			title="作废原因"
			:width="500"
			@ok="submitZ"
			class="slModal"
		>
			<div
				@click.stop
				style="background: #fff"
				@move.stop
			>
				<a-row> 请输入作废原因： </a-row>
				<a-row>
					<a-textarea
						style="margin: 0 auto; margin-top: 20px"
						:maxLength="100"
						placeholder="作废原因"
						v-model="reasonName"
					></a-textarea>
				</a-row>
			</div>
		</a-modal> -->
	</div>
</template>
<script>
import AssetsManagementList from '@sub/componentsAssets/AssetsList.vue';
import { searchList, columns, tabList } from './columns/columns.js';
import {
	API_GetAccountsReceivableList,
	API_GetAccountsReceivableCountManualAssetTabState,
	API_AccountsReceivableListExportExcel,
	API_GetAssetsStatusTip,
	API_SyncReceivable,
	API_GetAccountsPayableZF
} from '@/v2/center/assets/api/index.js';
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			syncLoading: false,
			listType: 'accountsReceivable',
			zuofeiVisible: false,
			reasonName: '',
			searchList,
			tabList,
			columns
		};
	},
	components: {
		AssetsManagementList
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER?.company?.companyType == 'CORE_COMPANY';
		}
	},
	beforeRouteLeave(to, from, next) {
		this.VUEX_SET_MANUAL_ASSET_OBJ({
			disableCopy: false,
			contractId: '',
			id: ''
		});
		this.VUEX_SET_POOL_ASSET_OBJ({
			disableCopy: false,
			buyerName: null,
			buyerUscc: null,
			contractId: '',
			id: ''
		});
		next();
	},
	methods: {
		...mapMutations({
			VUEX_SET_POOL_ASSET_OBJ: 'business/VUEX_SET_POOL_ASSET_OBJ'
		}),
		...mapMutations({
			VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
		}),
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		API_GetAccountsReceivableList,
		API_GetAccountsReceivableCountManualAssetTabState,
		API_AccountsReceivableListExportExcel,
		API_SyncReceivable,
		API_GetAssetsStatusTip,

		gotoAdd() {
			this.$router.push('/center/assets/receivable/manual/edit?&activeIndex=0');
		},
		getList(num) {
			this.$refs.assetsList.getList(num);
		},

		syncStatus() {
			// 同步状态
			this.syncLoading = true;
			API_SyncReceivable()
				.then(res => {
					if (res.success) {
						if (res.data) {
							this.$message.success('同步成功');
							this.getList();
						}
					}
					this.syncLoading = false;
				})
				.catch(() => {
					this.syncLoading = false;
				});
		},

		goZuofei(item) {
			this.reasonName = '';
			this.zuofeiVisible = true;
			this.currentId = item.id;
		},
		goDetail(item) {
			if (item.assetType == 'ACCOUNTS_RECEIVABLE') {
				this.$router.push({ path: '/center/assets/receivable/detail', query: { id: item.id, activeIndex: 0 } });
				return;
			}
			if (item.assetType == 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL') {
				this.$router.push({ path: '/center/assets/receivable/manual/detail', query: { id: item.id, activeIndex: 0 } });
			}
		},
		goToEdit(item) {
			this.$router.push({ path: '/center/assets/receivable/manual/edit', query: { id: item.id, activeIndex: 0 } });
		},

		submitZ() {
			if (!this.reasonName) {
				this.$message.error('作废原因必填');
				return;
			}
			this.zuofeiVisible = false;
			this.$confirm({
				centered: true,
				title: '确定作废',
				okText: '确定',
				content: '系统将对该应收账款进行作废，确定要进行作废么?',
				cancelText: '取消',
				onOk: () => {
					API_GetAccountsPayableZF({
						message: this.reasonName,
						assetId: this.currentId
					}).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('作废成功');
								this.getList();
							}
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>
<style lang="less" scoped>
// @import url('~@/v2/style/table-cover.less');
.cancel-modal {
	.tip {
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		margin-bottom: 20px;
	}
	.red {
		color: red;
	}
}
</style>
