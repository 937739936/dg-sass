<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
				>
					应付账款管理
				</span>
			</div>
			<AssetsManagementList
				ref="assetsList"
				:searchList="searchList"
				:defaultStatusData="tabList"
				:defaultTabType="'TAB_ALL'"
				:tabTypeName="'assetTabType'"
				:columns="columns"
				:listApi="API_GetAccountsPayableList"
				:statisticsApi="API_GetAccountsReceivableCountAssetTabState"
				:exportApi="API_AccountsReceivableAssetExportExcel"
				exportName="应付账款记录"
				:synchroApi="API_SyncPayable"
				:statusTipApi="API_GetAssetsStatusTip"
			>
				<template
					slot="customAction"
					slot-scope="{ record }"
				>
					<a-space :size="10">
						<router-link
							v-auth="'asset:pay:view'"
							:to="{ path: '/center/assets/payable/manage/detail', query: { id: record.id, activeIndex: 0 } }"
							>查看</router-link
						>
						<!-- 状态为“待确认”、"平台驳回"、"资方驳回"或"已批注"时，可编辑 -->
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
						<!-- 登录企业为资产对应的卖方: 待卖方盖章 -->
						<a
							v-if="
								(record.status == 'TO_BE_CONFIRM' || record.status == 'TO_BE_SIGN') &&
								VUEX_ST_COMPANYSUER.companyName == record.buyerName
							"
							v-auth="'asset:pay:edit'"
							href="javascript:;"
							@click="goToSign(record)"
							>盖章</a
						>

						<!-- 状态为“待确认，待确权”、"平台驳回"或"已批注" “可融资”时，可作废 ,可开票-->
						<a
							href="javascript:;"
							@click="goZuofei(record)"
							v-if="record.assetCancel"
							>作废</a
						>
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
		<a-modal
			class="modal"
			:header="null"
			:footer="null"
			:visible="visible"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<div
				v-html="strMsg"
				style="text-align: center"
			></div>
			<a-button
				type="primary"
				@click="visible = false"
				style="display: block; margin: 30px auto 0"
				>确定</a-button
			>
		</a-modal>
	</div>
</template>
<script>
import AssetsManagementList from '@sub/componentsAssets/AssetsList.vue';
import { searchList, columns, tabList } from './columns/columns.js';
import { mapGetters } from 'vuex';

import {
	API_GetAccountsPayableList,
	API_SyncPayable,
	API_GetAccountsReceivableCountAssetTabState,
	API_AccountsReceivableAssetExportExcel,
	API_GetAccountsPayableZF,
	API_GetAssetsStatusTip,
	API_JudgeConfirm
} from '@/v2/center/assets/api/index.js';
export default {
	data() {
		return {
			zuofeiVisible: false,
			reasonName: '',
			syncLoading: false,
			searchList,
			tabList,
			columns,
			strMsg: '', // 确权时发票状态错误提示信息内容
			visible: false // 确权时发票状态错误提示信息弹窗
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
		API_GetAccountsPayableList,
		API_SyncPayable,
		API_GetAccountsReceivableCountAssetTabState,
		API_AccountsReceivableAssetExportExcel,
		API_GetAssetsStatusTip,
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		goToEdit(item) {
			// 编辑应付账款
			if (item.id) {
				this.$router.push('/center/assets/payable/manage/edit?id=' + item.id + '&activeIndex=0' + `&status=${item.status}`);
			}
		},
		// 资产盖章
		goToSign(item) {
			let id = item.id;
			if (item.modifyId) {
				id = item.modifyId;
			}
			API_JudgeConfirm({ assetId: id }).then(res => {
				if (res.success) {
					if (res.data) {
						this.strMsg = res.data;
						this.visible = true;
					} else {
						this.$router.push(
							`/center/assets/payable/manage/stamp?id=${id}&serialNo=${item.serialNo}&&bankName=${item.bankName}`
						);
					}
				}
			});
		},
		goZuofei(item) {
			this.reasonName = '';
			this.zuofeiVisible = true;
			this.currentId = item.id;
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
								this.getList(1);
							}
						}
					});
				},
				onCancel() {}
			});
		},
		getList(num) {
			this.$refs.assetsList.getList(num);
		},
		syncStatus() {
			// 同步状态
			this.syncLoading = true;
			API_SyncPayable()
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
