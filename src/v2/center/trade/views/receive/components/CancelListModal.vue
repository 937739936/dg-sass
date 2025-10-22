<template>
	<a-modal
		:visible="visible"
		:footer="null"
		centered
		width="790px"
		@cancel="handleCancel"
		:title="null"
		:destroyOnClose="true"
	>
		<div class="title">确认作废该条收货记录?</div>
		<div style="padding: 0 20px 20px">
			<a-table
				:row-selection="rowSelection"
				class="new-table"
				style="margin-bottom: 20px"
				:dataSource="dataSource"
				:columns="deliverColumns"
				:pagination="false"
				rowKey="receiveId"
			>
			</a-table>
			<a-form
				:form="form"
				@submit="handleSubmit"
				v-if="receiveIds.length"
			>
				<a-form-item>
					<a-textarea
						class="zf-textarea"
						placeholder="请输入作废原因..."
						v-decorator="['cancelReason', { rules: [{ required: true, message: '作废原因必填' }] }]"
					/>
				</a-form-item>
			</a-form>
			<div class="footer">
				<a-button @click="handleCancel">取消</a-button>
				<a-button
					type="primary"
					@click="handleSubmit"
					>确定</a-button
				>
			</div>
		</div>
	</a-modal>
</template>

<script>
import { API_GetReceiveCancelList, API_RECEIVERECORDCANCEL } from '@/v2/center/trade/api/receive';
const deliverColumns = [
	{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' },
	{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate' },
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
	{ title: '备注', dataIndex: 'remark', key: 'remark' }
];
export default {
	data() {
		return {
			visible: false,
			form: this.$form.createForm(this),
			dataSource: [],
			deliverColumns,
			receiveIds: [],
			deliverId: '',
			orderId: ''
		};
	},
	computed: {
		rowSelection() {
			let that = this;
			return {
				onChange: (selectedRowKeys, selectedRows) => {
					that.receiveIds = selectedRowKeys;
				},
				getCheckboxProps: record => ({
					props: {
						disabled: !record.canCancel
					}
				})
			};
		}
	},
	methods: {
		init({ id, orderId }) {
			this.receiveIds = [];
			this.visible = true;
			this.deliverId = id;
			this.orderId = orderId;
			API_GetReceiveCancelList({ deliverBatchId: id }).then(res => {
				if (res.success) {
					this.dataSource = res.result;
				}
			});
		},
		handleCancel() {
			this.visible = false;
		},
		handleSubmit(e) {
			e.preventDefault();
			if (!this.receiveIds.length) {
				this.$message.error('至少选择一条收货记录');
				return;
			}
			this.form.validateFields((err, values) => {
				if (!err) {
					API_RECEIVERECORDCANCEL({
						deliverId: this.deliverId,
						orderId: this.orderId,
						cancelReason: values.cancelReason,
						receiveIds: this.receiveIds
					}).then(res => {
						this.visible = false;
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('操作成功');
						this.$emit('ok');
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 20px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
	margin-bottom: 20px;
}

/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}

.footer {
	text-align: right;

	.ant-btn {
		margin-left: 20px;
		width: 90px;
		color: rgba(0, 0, 0, 0.8);
		border: 1px solid #c6cdd8;
		height: 34px;
	}

	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}

.zf-textarea {
	width: 100%;
	height: 60px !important;
	font-size: 14px;
	line-height: 20px;
	padding: 16px 14px;
	background: #f3f5f6;
	color: rgba(0, 0, 0, 0.8);
	margin-bottom: 20px;
	&::-webkit-input-placeholder {
		color: #8191a9;
	}
}
</style>
