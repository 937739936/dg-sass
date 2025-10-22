<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>追保函管理</span
				>
				<a-button
					v-auth="'steel:bondLetter:list:add'"
					type="primary"
					@click="goAdd"
				>
					<span style="font-size: 14px">创建追保函</span>
				</a-button>
			</div>
			<SlForm
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:isShowIcon="false"
			></SlForm>
			<div style="width: 100%; margin-top: 40px">
				<a-table
					:columns="columns"
					class="new-table"
					:rowKey="record => record.id"
					:dataSource="list"
					:pagination="false"
					:scroll="{ x: true }"
					:loading="loading"
				>
					<div
						slot="statusDesc"
						slot-scope="action, items"
						style="display: flex"
					>
						<span
							class="status"
							:class="items.status"
							>{{ items.statusDesc }}</span
						>
					</div>
					<div
						slot="action"
						slot-scope="action, items"
						style="display: flex"
					>
						<a
							href="javascript:;"
							@click="goDetail(items)"
							v-auth="'steel:bondLetter:list:view'"
							>详情</a
						>
						<!-- 待签约 -->
						<template v-if="['WAIT_SIGN'].includes(items.status)">
							<a
								href="javascript:;"
								style="margin-left: 26px"
								v-auth="'steel:bondLetter:list:sign'"
								@click="goStamp(items)"
								>盖章</a
							>
							<a
								href="javascript:;"
								style="margin-left: 26px"
								v-auth="'steel:bondLetter:list:completed'"
								@click="invalid(items)"
								>作废</a
							>
						</template>
						<!-- 执行中 -->
						<template v-if="['EXECUTING'].includes(items.status)">
							<a
								href="javascript:;"
								style="margin-left: 26px"
								v-auth="'steel:bondLetter:list:view'"
								@click="contractDownload(items)"
								>下载</a
							>
							<a
								href="javascript:;"
								style="margin-left: 26px"
								v-auth="'steel:bondLetter:list:completed'"
								@click="completeBondLetter(items)"
								>完结</a
							>
							<a
								href="javascript:;"
								style="margin-left: 26px"
								v-auth="'steel:bondLetter:list:completed'"
								@click="invalid(items)"
								>作废</a
							>
							<a
								href="javascript:;"
								style="margin-left: 26px"
								@click="goCollection(items)"
								>登记</a
							>
						</template>
						<!-- 驳回 -->
						<template v-if="['REJECTED'].includes(items.status)">
							<a
								href="javascript:;"
								style="margin-left: 26px"
								v-auth="'steel:bondLetter:list:completed'"
								@click="invalid(items)"
								>作废</a
							>
						</template>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					v-if="isShowPagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import { getBondLetterList, completeBondLetter, invalidBondLetter } from '@/v2/center/steels/api/additionalMargin.js';
import iPagination from '@sub/components/iPagination';
import SlForm from '@sub/components/ui-new/Form/sl-form';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { API_SteelsDownloadFilesPath } from '@/v2/center/steels/api';
import comDownload from '@sub/utils/comDownload.js';
export default {
	name: 'SteelSettleApplyList',
	data() {
		return {
			searchList: [
				{
					decorator: ['serialNo'],
					addonBeforeTitle: '追保函编号',
					type: 'input',
					placeholder: '请输入追保函编号',
					allowClear: true
				},
				{
					decorator: ['buyCompanyName'],
					addonBeforeTitle: '买方名称',
					type: 'input',
					placeholder: '请输入买方名称',
					allowClear: true
				},
				{
					decorator: ['status'],
					addonBeforeTitle: '状态',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: [{ value: '', label: '全部' }, ...filterSteelsCodeByKey('bondLetterStatus')]
				}
			],
			searchParams: {},
			columns: [
				{
					title: '追保函编号',
					dataIndex: 'serialNo'
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName'
				},
				{
					title: '追保金额',
					dataIndex: 'amount'
				},
				{
					title: '已追保金额',
					dataIndex: 'collectionAmount'
				},
				{
					title: '状态',
					dataIndex: 'statusDesc',
					scopedSlots: {
						customRender: 'statusDesc'
					}
				},
				{
					title: '操作',
					dataIndex: 'action',
					key: 'action',
					scopedSlots: {
						customRender: 'action'
					},
					algin: 'right',
					fixed: 'right'
				}
			],
			list: [],
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false,
			isShowPagination: true,
			addInvoce2: require('@/assets/imgs/newInvoice/add-invoce2.png')
		};
	},
	components: {
		iPagination,
		SlForm
	},
	mounted() {
		this.getList();
	},
	computed: {},
	methods: {
		changeSearch(info) {
			this.searchParams = info;
			this.pagination.pageNo = 1;
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			const params = {
				pageNo: pageNo,
				pageSize: pageSize,
				...this.searchParams
			};

			this.loading = true;
			try {
				const res = await getBondLetterList(params);
				this.list = res.data.records;
				this.pagination.total = res.data.total;
				this.isShowPagination = res.data.total > res.data.size;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		goAdd() {
			this.$router.push({
				path: '/center/steels/additionalMargin/additionalMargin/contractList'
			});
		},
		goDetail(item) {
			this.$router.push({
				path: '/center/steels/additionalMargin/additionalMargin/detail',
				query: {
					id: item.id,
					contractId: item.contractId,
					marketPriceSource: item.marketPriceSource
				}
			});
		},
		goCollection(item) {
			this.$router.push({
				path: '/center/steels/funds/collection/claimDetail',
				query: {
					source: 'marginCall',
					downstreamContractNo: item.contractNo,
					downstreamContractId: item.contractId,
					letterId: item.id
				}
			});
		},
		// 作废
		async invalid(item) {
			const params = {
				id: item.id
			};
			this.$confirm({
				centered: true,
				title: '您确定作废当前追保函么？',
				okText: '确定',
				cancelText: '取消',
				onOk: async () => {
					await invalidBondLetter(params);
					this.$message.success('操作成功');
					this.pagination.pageNo = 1;
					this.getList();
				},
				onCancel() {}
			});
		},
		// 完结
		async completeBondLetter(item) {
			const params = {
				id: item.id
			};
			this.$confirm({
				centered: true,
				title: '您确定完结当前追保函么?',
				okText: '确定',
				cancelText: '取消',
				onOk: async () => {
					const res = await completeBondLetter(params);
					this.$message.success('操作成功');
					this.pagination.pageNo = 1;
					this.getList();
				},
				onCancel() {}
			});
		},
		// 去盖章
		goStamp(item) {
			this.$router.push({
				path: '/center/steels/additionalMargin/additionalMargin/stamp',
				query: {
					pdfPath: item.pdfPath,
					id: item.id
				}
			});
		},
		download(item) {
			window.location.href = `${item.pdfPath}`;
		},
		async contractDownload(record) {
			const fileFormat = record.pdfPath.split('?')[0].split('.').pop().toLowerCase();
			const arr = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			const flag = arr.includes(fileFormat);
			const res = await API_SteelsDownloadFilesPath({ filePath: record.pdfPath });
			const unit = flag ? fileFormat : 'pdf';
			comDownload(res, null, `追保函.${unit}`);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
/deep/ .ant-table-column-title {
  font-weight: 600;
}
 /deep/ .highlight td {
  color: red !important;
 }
 .settle-btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
 }
 .top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
 }
  .btn-box-title {
    display: flex;
    align-items: center;
    .btn {
      width: 140px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid @primary-color;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @primary-color;
      font-size: 14px;
      margin-left: 20px;
      font-weight: 400;
      cursor: pointer;

    }
  }
  .icon, .icon2 {
    width:18px;
    vertical-align: middle;
    margin-right: 15px
    // height: 18px;
    // display: inline-block;
    // vertical-align: middle;
    // background: url(~assets/imgs/newInvoice/add-invoice.png) no-repeat;
    // background-size: contain;
    // margin-right: 10px ;
    // vertical-align: middle;
  }
  .status {
    // width: 56px;
    padding:3px 7px ;
    // height: 26px;
    background: #F1F6FF;
    border-radius: 4px;
    color: #7997BF;
    display: flex;
    align-items: center;
    justify-content:center;
    font-size: 14px;
  }
  .AUDITING {
    background: #FFF6F2;
    color: #EF7C06;
  }
  .WAIT_SIGN {
    background: #F1FFF6;
    color: #45BF83;

  }
  .REJECTED {
    background: #FFF9F9;
    color: #DD4444;
  }
  .page-title {
   margin-left: 0 !important;
  }
  .divider {
    margin-bottom: 20px;
  }
</style>
