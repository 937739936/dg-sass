<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>预付资产管理</span
				>
			</div>
			<AssetsManagementList
				ref="listView"
				:searchList="searchList"
				:defaultStatusData="tabList"
				:tabTypeName="'preAssetTabType'"
				:columns="columns"
				:listApi="API_GetAdvancePayableList"
				:statisticsApi="API_GetAccountsReceivableListStatistics"
				:exportApi="API_AccountsReceivableListExportExcel"
				exportName="预付账款记录"
				:synchroApi="API_SyncPayable"
				:statusTipApi="API_GetAssetsStatusTip"
			>
				<template
					slot="customAction"
					slot-scope="{ record }"
				>
					<a-space :size="10">
						<router-link
							v-auth="'asset:pre:view'"
							:to="{ path: '/center/assets/advance/detail', query: { id: record.id, activeIndex: 0 } }"
							>查看</router-link
						>
						<!-- 状态为“待确认”、"平台运营驳回"、"资方驳回"或"平台风控驳回"时，可编辑 -->
						<a
							v-auth="'asset:pre:edit'"
							href="javascript:;"
							@click="goToEdit(record)"
							v-if="
								record.status == 'PLATFORM_REJECT' ||
								record.status == 'BANK_ROLLBACK' ||
								record.status == 'PLATFORM_OPERATE_REJECT' ||
								record.status == 'TO_BE_VERIFY'
							"
							>编辑</a
						>
						<!-- 状态为“待确认”、"平台运营驳回"或"平台风控驳回", “可融资”:assetCancel == 1&&当登录企业为预付资产对应的买方,时，可作废 -->
						<a
							v-auth="'asset:pre:cancel'"
							href="javascript:;"
							@click="goZuofei(record)"
							v-if="record.assetCancel"
							>作废</a
						>
						<!-- 状态为“待确认，”、"平台驳回"或"已批注"时，可提交 -->
						<!-- <a
							v-auth="'asset:pre:submit'"
							href="javascript:;"
							@click="goTijiao(record)"
							v-if="record.status == 'PLATFORM_REJECT' || record.status == 'COMMENTED' || record.status == 'TO_BE_VERIFY'"
							>提交</a
						> -->
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
						placeholder="请输入资产作废原因，最多200字"
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
	API_GetAdvancePayableList,
	API_SyncPayable,
	API_GetAccountsReceivableListStatistics,
	API_AccountsReceivableListExportExcel,
	API_GetAssetsStatusTip,
	API_GetAccountsPayableZF
} from '@/v2/center/assets/api/index.js';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
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
		})
	},

	methods: {
		API_GetAdvancePayableList,
		API_SyncPayable,
		API_GetAccountsReceivableListStatistics,
		API_AccountsReceivableListExportExcel,
		API_GetAssetsStatusTip,

		// handleChange(data) {
		// 	this.searchParams = data;
		// 	this.changeSearch(this.searchParams);
		// },
		goToEdit(item) {
			// 编辑应付账款
			if (item.id) {
				this.$router.push('/center/assets/advance/edit?id=' + item.id + '&activeIndex=0');
			}
		},
		goZuofei(item) {
			this.reasonName = '';
			this.zuofeiVisible = true;
			this.currentId = item.id;
		},
		goTijiao(item) {
			if (item.id) {
				this.$router.push('/center/assets/advance/edit?id=' + item.id + '&submit=1&activeIndex=0');
			}
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
				content: '系统将对该应付账款进行作废，确定要进行作废么?',
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
		},
		getList() {
			this.$refs.listView.getList();
		}
	}
};
</script>
<style lang="less" scoped>
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
