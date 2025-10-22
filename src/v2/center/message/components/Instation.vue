<template>
	<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
		<div style="text-align: left; margin-bottom: 15px; margin-top: 15px">
			<a-button
				@click="readAll()"
				type="primary"
				ghost
			>
				全部设为已读
			</a-button>
		</div>
		<a-table
			:columns="columns"
			class="new-table"
			rowKey="id"
			:scroll="{ x: true }"
			:dataSource="dataSource"
			:pagination="false"
			:loading="loading"
		>
			<template
				slot="message"
				slot-scope="text, record"
			>
				<div v-if="record.isShowBtn" style="display: flex; flex-direction: row; align-items: center;">
					<i
						v-show="record.status == '未读'"
						style="
							display: inline-block;
							background-color: #f24e4d;
							width: 8px;
							height: 8px;
							border-radius: 50%;
							margin-right: 10px;
						"
					></i
					><span
						class="jump-link text-overflow"
						@click="goToDetail(record)"
						>{{ record.message }}</span
					>
				</div>
				<div v-else>
					{{ record.message }}
				</div>
			</template>
		</a-table>
		<i-pagination
			:pagination="pagination"
			size="small"
			@change="getList"
		/>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_GetNoticeList, API_SetReadMessage, API_SetReadAll } from 'api';
import { getMessageListMap } from 'untils/message';

export default {
	mixins: [ListMixin],
	data() {
		return {
			columns: [
				{
					title: '消息内容',
					dataIndex: 'message',
					width: '80%',
					scopedSlots: {
						customRender: 'message'
					}
				},
				{
					title: '接收时间',
					dataIndex: 'sendDate'
				}
			],
			loading: false
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		readAll() {
			API_SetReadAll().then(res => {
				if (res.success) {
					this.$message.success('设置成功');
					this.getList();
				}
			});
		},
		goToDetail(item) {
			if (item.selectKey == '/center/contract/contractList') {
				return;
			}
			let queryParams = {
				selectKey: item.selectKey,
			}
			queryParams = item.params ? Object.assign(queryParams, JSON?.parse(item?.params)) : queryParams;
			this.$router.push({
				path: item.url,
				query: queryParams
			});
			this.setRead(item);
		},
		setRead(item) {
			API_SetReadMessage(item.id).then(res => {
				if (res.success) {
					this.getList();
				}
			});
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			this.loading = true;
			API_GetNoticeList({
				...this.pagination,
				t: new Date().getTime()
			})
				.then(res => {
					if (res.success) {
						this.dataSource = [];
						this.pagination.total = res.result.total;
						this.$emit('setCount', res.result.total);
						this.pagination.defaultPageSize = res.result.size;
						res.result.records.forEach(item => {
							getMessageListMap(item.params).forEach(it => {
								if (item.type == it.type) {
									if (it.ifShowBtn) {
										this.dataSource.push({
											id: item.id,
											message: item.content,
											isShowBtn: true,
											sendDate: item.sendDate,
											url: it.url,
											selectKey: it.selectKey,
											menuTitle: it.menuTitle,
											barFlag: it.barFlag,
											companyId: it.companyId,
											status: item.status == '0' ? '未读' : '已读',
											params: item.params
										});
									} else {
										this.dataSource.push({
											id: item.id,
											message: item.content,
											sendDate: item.sendDate,
											isShowBtn: false,
											companyId: it.companyId,
											status: item.status == '0' ? '未读' : '已读',
											params: item.params
										});
									}
								}
							});
						});
					}
				})
				.finally(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.table-box.fixedBottom {
	.new-table {
		margin-bottom: 2px;
	}

	.jump-link {
		cursor: pointer;
		&:hover {
			color: @primary-color;
		}
	}

	.slPagination {
		margin-top: 10px;
		width: calc(100% - 254px);
		min-width: 1186px;
		background: #fff;
		padding: 10px 30px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		left: 228px;
	}
}
.slPagination {
	width: calc(100% - 35px) !important;
	left: 20px !important;
}
.text-overflow {
	width: 80vw;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	cursor: pointer;
}
</style>
