<template>
	<!-- 收发货车皮信息-->
	<div id="trainInfo">
		<!--判断是否是下游支付-->
		<div class="title">
			<i class="title_icon"></i>车皮信息
			<span
				class="remarks"
				v-if="
					contractTemplate &&
					freightPayType != filterCodeByTextName('下游支付', 'freightPayTypeDict') &&
					contractTemplate != CONSTANTS.contractTemplateDict.COKING_006
				"
				>(请至少录入一个车皮信息)</span
			>
		</div>
		<div class="train-times-wrap">
			<a-table
				:dataSource="dataSource"
				:columns="columns"
				:pagination="false"
				:locale="{ emptyText: '暂无数据' }"
			>
				<template
					slot="operation"
					v-if="!disabled"
					slot-scope="text, record, index"
				>
					<a
						href="javascript:;"
						class="edit-btn"
						@click="editTrainInfo(record, index)"
						>编辑</a
					>
					<span class="line">|</span>
					<a-popconfirm
						v-if="dataSource.length"
						title="确定删除该车皮信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => onDelete(record.key)"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							>删除</a
						>
					</a-popconfirm>
				</template>
			</a-table>
			<template v-if="!disabled">
				<p
					class="add-wrap"
					@click="editTrainInfo"
				>
					<i>+</i>新增车皮
				</p>
			</template>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="车皮信息"
				centered
				v-model="modalTrainInfoIsShow"
				okText="确定"
				cancelText="取消"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				class="modal-train-info"
			>
				<a-form
					:form="trainInfoform"
					@submit="modalFormSubmit"
					layout="inline"
				>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="运单号"
								:colon="false"
							>
								<a-input v-decorator="['transTicketNo', { rules: [{ required: true, message: '请输入运单号' }] }]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="车种"
								:colon="false"
							>
								<a-input
									v-decorator="['trainType']"
									maxLength="29"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="车号"
								:colon="false"
							>
								<a-input
									maxLength="29"
									v-decorator="[
										'trainNo',
										{
											rules: [{ required: true, message: '请输入车号' }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="票重（吨）"
								:colon="false"
							>
								<a-input
									v-decorator="[
										'deliverQuantity',
										{
											rules: [{ pattern: /^\d+(\.\d{0,3})?$/, message: '票重为数字，最多三位小数' }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</div>
	</div>
</template>

<script>
import { filterCodeByTextName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
export default {
	name: 'trainInfo',
	props: {
		freightPayType: {
			required: true
		},
		contractTemplate: {
			default: function () {
				return '';
			}
		},
		datas: {
			type: Array,
			default: function () {
				return [];
			}
		},
		disabled: {},
		params: {
			type: Object,
			default: function () {
				return {};
			}
		}
	},
	created() {
		this.dataSource = this.datas;
	},
	watch: {
		datas() {
			this.dataSource = this.datas;
			if (this.disabled) {
				this.columns = this.columns.filter(item => {
					return item.dataIndex != 'operation';
				});
				this.columnsSW = this.columnsSW.filter(item => {
					return item.dataIndex != 'operation';
				});
			}
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	data() {
		return {
			dataSource: [],
			columns: [
				{
					title: '运单号',
					dataIndex: 'transTicketNo'
				},
				{
					title: '车种',
					dataIndex: 'trainType'
				},
				{
					title: '车号',
					dataIndex: 'trainNo'
				},
				{
					title: '票重（吨）',
					dataIndex: 'deliverQuantity'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			modalTrainInfoIsShow: false,
			modifyIndex: 0,
			modifyStatus: false,
			trainInfoform: this.$form.createForm(this),
			filterCodeByTextName: filterCodeByTextName
		};
	},
	methods: {
		editTrainInfo: function (record, index) {
			this.modalTrainInfoIsShow = true;
			this.modifyIndex = index;
			this.$nextTick(() => {
				if (typeof record.key != 'undefined') {
					this.modifyStatus = true;
					this.trainInfoform.setFieldsValue({
						transTicketNo: record.transTicketNo,
						trainType: record.trainType,
						trainNo: record.trainNo,
						deliverQuantity: record.deliverQuantity
					});
				}
			});
			if (this.params && this.params.serialNo) {
				this.$nextTick(() => {
					let that = this;
					setTimeout(function () {
						that.trainInfoform.setFieldsValue({ transTicketNo: that.params.serialNo });
					});
				});
			}
		},
		modalFormSubmit: function (e) {
			e.preventDefault();
			this.trainInfoform.validateFields((err, values) => {
				if (!err) {
					let obj = {
						key: new Date().getTime(),
						transTicketNo: values.transTicketNo,
						trainType: values.trainType,
						trainNo: values.trainNo,
						deliverQuantity: values.deliverQuantity
					};
					if (!this.modifyStatus) {
						this.$message.success('添加成功');
						this.dataSource.push(obj);
					} else {
						this.$message.success('修改成功');
						this.dataSource.splice(this.modifyIndex, 1, obj);
					}
					this.modifyStatus = false;
					this.modalTrainInfoIsShow = false;
					this.trainInfoform.resetFields();
					this.$emit('dataSource', this.dataSource);
				}
			});
		},
		modalCancel: function () {
			this.modifyStatus = false;
			this.trainInfoform.resetFields();
		},
		onDelete: function (key) {
			const dataSource = [...this.dataSource];
			this.dataSource = dataSource.filter(item => item.key !== key);
			this.$message.success('删除成功');
			this.$emit('dataSource', this.dataSource);
		}
	}
};
</script>

<style lang="less">
#trainInfo {
	.remarks {
		color: #ff1515;
		font-size: 16px;
		padding-left: 44px;
	}
	.train-times-wrap {
		margin-bottom: 30px;
		font-size: 0;
	}
	.add-wrap {
		width: 100%;
		display: inline-block;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;
		font-size: 14px;
		i {
			font-size: 20px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			position: relative;
			top: -2px;
		}
		&:hover {
			opacity: 0.8;
			cursor: pointer;
		}
	}
}
</style>
<style lang="less" scoped>
.modal-train-info {
	::v-deep.ant-modal-content {
		width: 450px;
	}
	::v-deep label {
		width: 80px;
		display: inline-block;
		text-align: right;
	}
	input {
		width: 300px;
	}
	::v-deep.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}
}
</style>
