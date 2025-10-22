<template>
	<div>
		<a-table
			:scroll="{ x: true }"
			:columns="columnsData"
			:data-source="data"
			:pagination="pagination"
		>
			<template
				slot="action"
				slot-scope="text, item"
			>
				<div
					v-for="item in columnsData"
					:key="item.key"
				>
					<div
						v-if="item.action"
						style="width: 60px"
					>
						<span
							v-for="(_item, _index) in item.action"
							:key="_index"
						>
							<template v-if="_item.auth ? hasAuth(_item.auth) : true">
								<a-tooltip :title="_item.name">
									<a
										v-if="_item.checkShow ? _item.checkShow(text) : true"
										@click="jump(_item, text)"
										style="margin-right: 15px"
									>
										<i
											v-if="'去盖章'.includes(_item.name)"
											class="qgz"
										>
										</i>
										<i
											v-if="'去发货'.includes(_item.name)"
											class="qfh"
										>
										</i>
										<i
											v-if="'去开具'.includes(_item.name)"
											class="qkj"
										>
										</i>
										<i
											v-if="'开提单'.includes(_item.name)"
											class="qkj"
										>
										</i>
										<i
											v-if="'填写实提'.includes(_item.name)"
											class="qkj"
										>
										</i>
										<i
											v-if="'去确认'.includes(_item.name)"
											class="qqr"
										>
										</i>
										<i
											v-if="'去编辑'.includes(_item.name)"
											class="qbj"
										>
										</i>
										<i
											v-if="'去提交'.includes(_item.name)"
											class="qtj"
										>
										</i>
										<i
											v-if="'去归档'.includes(_item.name)"
											class="qgd"
										>
										</i>
										<i
											v-if="'去确权'.includes(_item.name)"
											class="qqq"
										>
										</i>
										<i
											v-if="'去认领'.includes(_item.name)"
											class="qrl"
										>
										</i>
										<i
											v-if="'去完善'.includes(_item.name)"
											class="qws"
										>
										</i>
										<i
											v-if="'去审核'.includes(_item.name)"
											class="qsh"
										>
										</i>
										<i
											v-if="'去查看'.includes(_item.name)"
											class="qsh"
										>
										</i>
									</a>
								</a-tooltip>
							</template>
						</span>
					</div>
				</div>
			</template>
		</a-table>
		<div class="num">共{{ data.length }}条信息</div>
		<ConfirmModal ref="confirmModal" />
	</div>
</template>
<script>
import { hasAuth } from '@/v2/utils/checkAuth';
import ConfirmModal from '@/v2/center/trade/views/contract/components/ConfirmModal.vue';

export default {
	data() {
		return {
			pagination: {},
			loading: false,
			columns: []
		};
	},
	components: {
		ConfirmModal
	},
	props: ['columnsData', 'data'],
	mounted() {},
	methods: {
		hasAuth,
		jump(item, record) {
			let query = {};
			if (item.path === '/center/monitoring/dynamicMonitoring/detail') {
				query = { contractType: 0 };
			}
			if (item.path === '/center/receive/accept/confirm') {
				query = { first: record.status == 2 ? true : undefined, from: 'receive' };
			}
			item.query.forEach(item => {
				if (item.indexOf(':') > -1) {
					var key = item.split(':')[0];
					var rkey = item.split(':')[1];
					query[key] = record[rkey] || '';
				} else {
					query[item] = record[item] || '';
				}
			});

			if (item.path) {
				this.$router.push({
					path: item.path,
					query: query
				});
			} else {
				this.$refs.confirmModal.show({
					...record,
					type: (record.type || record.orderType || 'BUY').toLowerCase()
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep {
	.ant-table td {
		white-space: nowrap;
	}
	.ant-table-thead > tr > th {
		background: rgba(70, 130, 243, 0.05);
		color: rgba(37, 45, 62, 0.65);
		border: none;
	}
	.ant-table-tbody > tr > td {
		border: none;
		white-space: nowrap;
	}
	.ant-table-body > table {
		border: none;
	}
	.ant-table-tbody {
		tr:nth-child(2n + 2) {
			background: rgba(70, 130, 243, 0.05);
		}
		tr {
			td {
				color: rgba(37, 45, 62, 0.85);
			}
		}
	}
	.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
		background: none;
	}
	.ant-table-pagination.ant-pagination {
		position: absolute;
		right: 0;
		bottom: -87px;
	}
}
.num {
	height: 20px;
	font-size: 14px;
	position: absolute;
	font-weight: 400;
	color: rgba(37, 45, 62, 0.85);
	line-height: 20px;
	left: 0;
	bottom: -45px;
}
i {
	display: inline-block;
	width: 20px;
	height: 20px;
}
.qgz {
	background: url('../../../assets/imgs/workbench/qgz.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qgz-2.png') no-repeat;
		background-size: cover;
	}
}
.qfh {
	background: url('../../../assets/imgs/workbench/qfh.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qfh-2.png') no-repeat;
		background-size: cover;
	}
}
.qkj {
	background: url('../../../assets/imgs/workbench/qkj.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qkj-2.png') no-repeat;
		background-size: cover;
	}
}
.qqr {
	background: url('../../../assets/imgs/workbench/qqr.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qqr-2.png') no-repeat;
		background-size: cover;
	}
}
.qbj {
	background: url('../../../assets/imgs/workbench/qbj.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qbj-2.png') no-repeat;
		background-size: cover;
	}
}
.qtj {
	background: url('../../../assets/imgs/workbench/qtj.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qtj-2.png') no-repeat;
		background-size: cover;
	}
}
.qgd {
	background: url('../../../assets/imgs/workbench/qgd.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qgd-2.png') no-repeat;
		background-size: cover;
	}
}
.qqq {
	background: url('../../../assets/imgs/workbench/qqq.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qqq-2.png') no-repeat;
		background-size: cover;
	}
}
.qrl {
	background: url('../../../assets/imgs/workbench/qrl.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qrl-2.png') no-repeat;
		background-size: cover;
	}
}
.qws {
	background: url('../../../assets/imgs/workbench/qws.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qws-2.png') no-repeat;
		background-size: cover;
	}
}
.qsh {
	background: url('../../../assets/imgs/workbench/qsh.png') no-repeat;
	background-size: cover;
	&:hover {
		background: url('../../../assets/imgs/workbench/qsh-2.png') no-repeat;
		background-size: cover;
	}
}
</style>
