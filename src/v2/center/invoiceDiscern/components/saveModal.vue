<template>
	<TipModal
		ref="tipModal"
		tip="发票及销货清单已保存。是否导出当前销货清单？"
		cancelBtnText="返回列表"
		@cancel="goBack"
		@save="confirm"
		title="保存提示"
		okBtnText="现在导出"
	>
	</TipModal>
</template>

<script>
import TipModal from './TipModal.vue';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { saveAfterExport, exportFourInvoice } from '@/v2/center/invoiceDiscern/api';
export default {
	props: {
		dataSource: {
			default: () => {
				return [];
			}
		},
		type: {
			default: 'excel'
		}
	},
	data() {
		return {};
	},
	methods: {
		open() {
			this.$refs.tipModal.open();
		},
		goBack() {
			this.$router.push({
				path: '/invoice/discern/list'
			});
		},
		// 导出数据
		async confirm() {
			let splitList = [];
			if (this.type == 'excel') {
				splitList = this.dataSource.filter(el => el.myInvoiceDO.scanStatus == 0);
			}
			if (this.type == 'fourEle') {
				splitList = this.dataSource;
			}
			if (!splitList.length) {
				return this.$message.error('没有销货清单');
			}

			const params = {
				taskId: this.$route.query.taskId,
				splitList,
				invoiceItemVOList: splitList
			};

			let Fn = this.type == 'fourEle' ? exportFourInvoice : saveAfterExport;
			const res = await Fn(params);
			comDownload(res, undefined, '销货清单-' + moment().format('yyyy-MM-DD') + '.xls');
			setTimeout(() => {
				this.goBack();
			}, 500);
		}
	},
	components: {
		TipModal
	}
};
</script>

<style scoped></style>
