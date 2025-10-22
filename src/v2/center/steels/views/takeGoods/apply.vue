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
					>提货申请</span
				>
				<a-button
					type="primary"
					icon="plus"
					v-auth="'steel:takeDeliveryApply:apply'"
					@click="apply"
				>
					<span style="font-size: 14px">申请提货</span>
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<p style="display: flex; justify-content: end">
				<a-button
					type="primary"
					@click="exportList"
					icon="export"
					:disabled="disabledExport"
				>
					导出
				</a-button>
			</p>
			<a-table
				:columns="columns"
				:data-source="dataSource"
				:pagination="false"
				:scroll="{ x: 1200 }"
				rowKey="id"
				:loading="loading"
				style="margin-top: 20px"
				class="new-table"
			>
				<span
					slot="takeType"
					slot-scope="text, record"
					>{{ getTakeTypeText(record.takeType, 'takeType') }}</span
				>
				<span
					slot="steelType"
					slot-scope="text, record"
					>{{ getSteelTypeText(record.steelType, 'steelType') }}</span
				>
				<span slot="steelType"></span>
				<span
					slot="takeSerialNo"
					slot-scope="text, record"
					style="word-break: break-all"
				>
					<a
						@click="viewPreview(record)"
						v-if="record.takeStatus == 7"
						>{{ record.takeSerialNo }}</a
					>
				</span>
				<span
					slot="status"
					slot-scope="text, record"
				>
					<span></span>
					{{ getStatusDesc(record) }}
				</span>
				<span
					slot="methods"
					slot-scope="text, record"
				>
					<!-- 1已提交 2 待提交 3 驳回 4 作废 5已转移-->
					<a-button
						type="link"
						@click.stop="deatilsOrEdit(record, 'preview')"
						v-auth="'steel:takeDeliveryApply:view'"
						>查看</a-button
					>
					<a-button
						type="link"
						@click.stop="deatilsOrEdit(record, 'edit')"
						v-if="[2, 3].includes(record.status) && !record.originalSerialNo"
						v-auth="'steel:takeDeliveryApply:operate'"
						>修改</a-button
					>
					<!-- 发起方 -->
					<a-button
						type="link"
						@click.stop="deleteItem(record)"
						v-if="
							[2, 1].includes(record.status) &&
							!record.originalSerialNo &&
							VUEX_ST_COMPANYSUER.companyUscc == record.buyCompanyUscc
						"
						v-auth="'steel:takeDeliveryApply:operate'"
					>
						删除
					</a-button>
					<!-- 驳回状态 或者 已提交 未关联结算单的 原始单号不为空-->
					<a-button
						type="link"
						@click.stop="cancellation(record)"
						v-if="[3].includes(record.status) || (record.status == 1 && record.isRelationTake == 1 && record.originalSerialNo)"
						v-auth="'steel:takeDeliveryApply:invalid'"
						>作废</a-button
					>
					<!-- .是串联业务-isStrandBusiness==“1”
          4.上游企业名称不为空时
          2.当前登录企业为提货申请卖方，uscc判断
          3.提货申请未关联提单isRelationTake == “1”
          5.状态为已提交状态-status==1 -->
					<a-button
						type="link"
						v-auth="'steel:takeDeliveryApply:transferTakeGoods'"
						@click.stop="transfer(record)"
						v-if="
							record.isStrandBusiness == 1 &&
							VUEX_ST_COMPANYSUER.companyUscc == record.sellCompanyUscc &&
							record.isRelationTake == 1 &&
							record.status == 1
						"
					>
						转移提货
					</a-button>
				</span>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>

		<viewer ref="viewer" />
		<preview ref="preview" />
		<void-dialog
			:fn="fn"
			paramsKey="remark"
			label="作废"
			ref="voidDialog"
			v-on:update="getList"
		/>
		<GoodsTransfer
			ref="goodsTransfer"
			v-on:update="getList"
		/>
	</div>
</template>

<script>
import Pagination from './components/pagination.vue';
import {
	getOrderApplyList,
	deleteGoodsApplyItem,
	takeDeliveryApplyExport,
	invalidTakeGoods,
	transferGoods
} from '@/v2/center/steels/api/orderApply';
import comDownload from '@sub/utils/comDownload.js';
import VoidDialog from './components/voidDialog.vue';
import Viewer from './components/viewer.vue';
import Preview from './components/preview.vue';
import GoodsTransfer from './components/goodsTransfer.vue';
import { columns } from './config/applyTableList';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import moment from 'moment';
import ENV from '@/v2/config/env';
import { mapMutations, mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '提货单号',
		type: 'input',
		placeholder: '请输入提货单号',
		allowClear: true
	},
	{
		decorator: ['date2'],
		addonBeforeTitle: '创建日期',
		realKey: ['startDate', 'endDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},

	{
		decorator: ['takeSerialNo'],
		addonBeforeTitle: '关联提货单号',
		type: 'input',
		placeholder: '请输入关联提货单号',
		allowClear: true
	},

	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: 1, label: '已提交' },
			{ value: 2, label: '待提交' },
			{ value: 3, label: '驳回' },
			{ value: 4, label: '作废' }
		]
	},
	{
		decorator: ['sellCompanyName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称',
		allowClear: true
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			url: {
				list: getOrderApplyList
			},
			columns,
			searchList,
			images: [],
			loading: false,
			steelType: filterCodeBySteelKey('steelType'),
			takeType: filterCodeBySteelKey('takeType'),
			takeDeliveryStatus: filterCodeBySteelKey('takeDeliveryStatus'),
			disabledExport: false,
			fn: invalidTakeGoods
		};
	},
	components: {
		Pagination,
		Viewer,
		Preview,
		VoidDialog,
		GoodsTransfer
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		getTakeTypeText(type, text) {
			for (let i = 0; i < this[text].length; i++) {
				if (this[text][i].value == type) {
					return this[text][i].label;
				}
			}
		},
		getSteelTypeText(type, text) {
			const typeList = type.split(',');
			const result = [];
			for (let i = 0; i < typeList.length; i++) {
				for (let j = 0; j < this[text].length; j++) {
					if (this[text][j].value == typeList[i]) {
						result.push(this[text][j].label);
					}
				}
			}
			return result.join(',');
		},
		deatilsOrEdit(item, type) {
			this.$router.push({
				path: '/center/take/goods/step',
				query: {
					serialNo: item.serialNo,
					contractNo: item.contractNo,
					id: item.id,
					type: type
				}
			});
		},
		deleteItem(item) {
			this.$confirm({
				title: '提示',
				content: '确定要删除吗？',
				cancelText: '取消',
				okText: '确定',
				onOk: () => {
					deleteGoodsApplyItem({
						serialNo: item.serialNo,
						id: item.id
					}).then(res => {
						if (res.success) {
							this.$message.success('删除成功');
							this.getList();
						}
					});
				},
				onCancel: () => {
					return;
				}
			});
		},
		viewPreview(record) {
			if (record.attachList) {
				const fileList = record.attachList.map(item => `${location.origin}${ENV.BASE_GANG_API}/${item.fileUrl}`);
				this.$refs.viewer.show(fileList);
			} else {
				this.$refs.preview.show(record.pdfPath, record);
			}
		},
		// 作废
		cancellation(item) {
			this.$refs.voidDialog.showModal(item);
		},
		exportList() {
			this.disabledExport = true;
			takeDeliveryApplyExport({
				...this.searchParams
			})
				.then(res => {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}提货申请导出.xls`);
				})
				.finally(() => {
					this.disabledExport = false;
				});
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},

		pageChange(item) {
			this.pageNo = item.current;
			this.pageSize = item.pageSize;
			this.getList();
		},
		apply() {
			this.$router.push({
				path: '/center/take/goods/step'
			});
		},
		getStatusDesc(item) {
			const statusObj = {
				1: '已提交',
				2: '待提交',
				3: '驳回',
				4: '作废',
				5: '已提交'
			};
			if (this.VUEX_ST_COMPANYSUER.companyUscc == item.sellCompanyUscc) {
				statusObj[5] = '已转移';
			}
			return statusObj[item.status];
		},
		// 转移提货
		async transfer(item) {
			this.$refs.goodsTransfer.showModal(item);
			// const that = this
			// this.$confirm({
			//   centered:true,
			//   title: `是否将该笔提货申请转移至上游企业：${item.upCompanyName}`,
			//   okText: '确定',
			//   cancelText: '取消',
			//   async onOk() {
			//     const params = {
			//       id: item.id
			//     }
			//     await transferGoods(params)
			//     that.$message.success('操作成功')
			//     that.search()
			//   },
			//   onCancel() {}
			// });
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.ant-advanced-search-form {
	margin-top: 20px;
}
</style>
