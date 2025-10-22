<template>
	<div>
		<a-row :gutter="24">
			<a-col
				v-auth="'company:account:add'"
				span="12"
			>
				<div
					class="item add"
					@click="creatBankAccount('add')"
				>
					<span>
						<img
							class="add-icon"
							src="@/v2/assets/imgs/person/addBank.png"
						/>
						<span>点击添加银行账户</span>
					</span>
				</div>
			</a-col>

			<a-col
				span="12"
				:key="item.id"
				v-for="item in bankList"
			>
				<div class="item">
					<div class="bank">
						<a-row
							type="flex"
							justify="space-between"
						>
							<a-col>
								<img src="@/v2/assets/imgs/person/bankAccount@2x.png" />
							</a-col>
							<a-col class="flex-1">
								<a-row type="flex">
									<span
										span="24"
										class="name"
										>{{ item.accountType | filterCodeByValueName('bankAccountTypeDict') }}</span
									>
									<span
										span="24"
										class="value"
										>{{ item.bankName }}</span
									>
								</a-row>
							</a-col>
						</a-row>
						<div class="info">
							<a-row
								type="flex"
								justify="space-between"
							>
								<span class="name">账号</span>
								<span class="ellipsis value">{{ item.accountName }}</span>
							</a-row>
							<a-row
								type="flex"
								justify="space-between"
							>
								<span class="name">银行账号</span>
								<span class="ellipsis value">{{ item.accountNo }}</span>
							</a-row>
							<a-row
								type="flex"
								justify="space-between"
							>
								<span class="name">开户城市</span>
								<span class="ellipsis value">{{ item.province }} {{ item.city }}</span>
							</a-row>
							<a-row
								type="flex"
								justify="space-between"
							>
								<span class="name">开户行名称</span>
								<span class="ellipsis value">{{ item.subbranchName }}</span>
							</a-row>
							<a-row
								type="flex"
								justify="space-between"
							>
								<span class="name">备注</span>
								<span class="ellipsis value">
									<a-tooltip placement="topRight">
										<template
											slot="title"
											v-if="item.remark"
										>
											{{ item.remark }}
										</template>
										<div v-if="item.remark && item.remark.length > 30">{{ item.remark.slice(0, 30) }}...</div>
										<div v-else>
											{{ item.remark || '-' }}
										</div>
									</a-tooltip>
								</span>
							</a-row>
						</div>
					</div>
					<a-row
						type="flex"
						justify="space-between"
						style="border-top: 1px solid #eef0f2"
					>
						<a-col
							class="tc button"
							span="12"
						>
							<span
								v-auth="'company:account:edit'"
								@click="operateBankAccount(1, item)"
							>
								编辑
							</span>
						</a-col>
						<a-col
							class="tc button"
							span="12"
						>
							<span
								v-auth="'company:account:del'"
								@click="operateBankAccount(2, item)"
							>
								删除
							</span>
						</a-col>
					</a-row>
				</div>
			</a-col>
		</a-row>
		<CreatBankAccount
			ref="creatBankAccount"
			@change="getBankAccountList"
		></CreatBankAccount>
	</div>
</template>

<script lang="jsx">
import CreatBankAccount from './CreatBankAccount';
import { API_COMPANYACCOUNTLIST, API_COMPANYACCOUNTDELETE } from '@/v2/api/account';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';

export default {
	name: 'BankAccountCard',

	components: {
		CreatBankAccount
	},
	data() {
		return {
			bankList: []
		};
	},
	created() {
		this.getBankAccountList();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		operateBankAccount(value, data) {
			switch (value) {
				case 1:
					this.creatBankAccount('modify', data);
					break;
				case 2:
					this.deleteBankAccount(data.id);
					break;
			}
		},

		// 获取银行列表
		getBankAccountList() {
			API_COMPANYACCOUNTLIST({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc }).then(res => {
				if (res.success) {
					this.bankList = res.data;
				}
			});
		},

		creatBankAccount(type, data = {}) {
			this.$refs.creatBankAccount.showModal(type, data);
		},

		deleteBankAccount(id) {
			this.$confirm({
				centered: true,
				title: '删除后，业务人员在合同执行中将无法选择该账户作为收付款账户，确定要删除吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					API_COMPANYACCOUNTDELETE(id).then(res => {
						if (res.success) {
							this.$message.success('操作成功');
							this.getBankAccountList();
						}
					});
				},
				onCancel() {}
			});
		}
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="less" scoped>
.gutter-box {
	border: 1px solid red;
}
.tc {
	text-align: center;
}
.add {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	color: #383a3f;
	line-height: 22px;
	cursor: pointer;
}
.item {
	// width: 430px;
	height: 250px;
	background: #ffffff;
	border: 1px solid #eef0f2;
	border-radius: 8px;
	margin-bottom: 24px;
	.add-icon {
		width: 100px;
		height: 100px;
		margin-right: 20px;
	}
	.bank {
		padding: 18px;
		img {
			width: 36px;
			height: 36px;
			margin-right: 18px;
		}
		.flex-1 {
			flex: 1;
			.name {
				display: block;
				width: 100%;
				font-size: 14px;
				color: #383a3f;
				line-height: 22px;
				font-size: 14px;
				font-weight: 600;
			}
		}
		span {
			height: 22px;
			line-height: 22px;
		}
		.info {
			margin-top: 15px;
			color: #9ba0aa;
			letter-spacing: 0;
			line-height: 18px;
			.name {
				width: 100px;
			}
			.value {
				flex: 1;
				text-align: right;
				span {
					display: block;
					width: 100%;
				}
			}
		}
	}
	.button {
		line-height: 40px;
		color: @primary-color;
		span {
			display: inline-block;
			height: 100%;
			padding: 0 20px;
			cursor: pointer;
		}
	}
}
</style>
