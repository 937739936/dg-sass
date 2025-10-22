<template>
	<div id="receiveInfo">
		<div class="title"><i class="title_icon"></i>收货信息</div>
		<a-table
			:dataSource="receiveDataSourceTemp"
			:columns="receiveColumns"
			:scroll="{ x: true }"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
		<a-modal
			v-model="visible"
			title="收货信息"
			on-ok="handleOk"
			width="80%"
			class="receiveInfoModal"
		>
			<a-form
				:form="receiveModalForm"
				layout="inline"
			>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="收货数量(吨)"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								placeholder="请输入收货数量"
								v-decorator="['receiveQuantity', { rules: [{ required: true, message: '请输入收货数量' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="收货日期"
							:colon="false"
						>
							<a-date-picker
								:disabled="disabled"
								placeholder="请输入收货日期"
								v-decorator="['receiveDate', { rules: [{ required: true, message: '请输入收货日期' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="热值(kcal/kg)"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								placeholder="请输入热值"
								v-decorator="[
									'heatingVal',
									{
										rules: [
											{ required: true, message: '请输入热值' },
											{
												validator: validateIndex
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="硫分(%)"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								placeholder="请输入硫分"
								v-decorator="[
									'sulfurContent',
									{
										rules: [
											{ required: true, message: '请输入硫分' },
											{
												validator: validateIndex
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="挥发分(%)"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								placeholder="请输入挥发分"
								v-decorator="[
									'volatileContent',
									{
										rules: [
											{ required: false, message: '请输入挥发分' },
											{
												validator: validateIndex
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="水分(%)"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								placeholder="请输入水分"
								v-decorator="[
									'waterContent',
									{
										rules: [
											{ required: false, message: '请输入水分' },
											{
												validator: validateIndex
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="upload-wrap">
				<div class="upload-block">
					<CustomUpload
						:ifEditable="!disabled"
						@uploadFiles="getUploadFiles"
						:fileDataSource="fileDataSource"
						:type="'receive'"
					/>
				</div>
			</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
				>
					返回
				</a-button>
				<a-button
					key="submit"
					type="primary"
					@click="handleOk"
					v-if="!disabled"
				>
					确定
				</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment';
import CustomUpload from '@/v2/components/CustomUpload';
import coalTypeData from '@/v2/utils/order/coalTypeData.js';
export default {
	name: 'ReceiveInfoModal',
	components: {
		CustomUpload
	},
	watch: {
		receiveDataSource(data) {
			if (data) {
				data.forEach(item => {
					let receiveAttachmentInfo = [];
					item.receiveAttachmentInfo.forEach(it => {
						receiveAttachmentInfo.push({
							[it.type]: it.fileUrl
						});
					});

					this.result.push(Object.assign({}, item, ...receiveAttachmentInfo));
				});
				this.$emit('receiveDetail', this.result);
			}
		}
	},
	data() {
		return {
			receiveModalForm: this.$form.createForm(this),
			visible: false,
			receiveDataSourceTemp: [],
			receiveColumns: [
				{
					title: '收货编号',
					dataIndex: 'receiveNo'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiveQuantity'
				},
				{
					title: '收货日期',
					dataIndex: 'receiveDate'
				}
				// ,
				// {
				//     title: '操作',
				//     align:"center",
				//     scopedSlots: {
				//         customRender: 'operation'
				//     },
				// },
			],
			fileInfos: [],
			fileDataSource: [],
			result: [],
			current: 0,
			receiveId: ''
		};
	},
	props: ['receiveDataSource', 'disabled', 'params'],
	mounted() {
		let quanColumn = coalTypeData['receive'][this.params.coalType] || [];

		var arr = [];
		quanColumn.forEach(item => {
			if (item.first_value && item.last_value) {
				arr.push({
					title: item.label,
					dataIndex: item.first_value
				});
				arr.push({
					title: item.label,
					dataIndex: item.last_value
				});
			} else {
				arr.push({
					title: item.label,
					dataIndex: item.value
				});
			}
		});
		var receiveDataSourceTemp = [];
		this.receiveDataSource.forEach(item => {
			let cokeIndexInfo = item.cokeIndexInfo || '{}';
			item = {
				...item,
				...JSON.parse(cokeIndexInfo)
			};
			receiveDataSourceTemp.push(item);
		});
		this.receiveDataSourceTemp = receiveDataSourceTemp;
		this.receiveColumns = [...this.receiveColumns, ...arr];
	},
	methods: {
		handleOk() {
			this.receiveModalForm.validateFields((err, values) => {
				if (!err) {
					var obj = {
						receiveQuantity: values.receiveQuantity,
						receiveDate: values.receiveDate.format('YYYY-MM-DD'),
						heatingVal: values.heatingVal,
						sulfurContent: values.sulfurContent,
						volatileContent: values.volatileContent,
						waterContent: values.waterContent,
						receiveId: this.receiveId
					};
					Object.assign(obj, ...this.fileInfos);
					this.receiveDataSource.forEach((item, index) => {
						if (index == this.current) {
							item.receiveQuantity = values.receiveQuantity;
							item.receiveDate = values.receiveDate.format('YYYY-MM-DD');
							item.heatingVal = values.heatingVal;
							item.sulfurContent = values.sulfurContent;
							item.volatileContent = values.volatileContent;
							item.waterContent = values.waterContent;
						}
					});
					this.result.splice(this.current, 1, obj);
					this.$emit('receiveDetail', this.result);
					this.visible = false;
				}
			});
		},
		receiveModalShow(record) {
			this.current = record.key;
			this.visible = true;
			this.$nextTick(() => {
				this.receiveId = record.receiveId;
				this.receiveModalForm.setFieldsValue({
					receiveQuantity: record.receiveQuantity,
					receiveDate: moment(record.receiveDate),
					heatingVal: record.heatingVal,
					sulfurContent: record.sulfurContent,
					volatileContent: record.volatileContent,
					waterContent: record.waterContent
				});
				this.fileDataSource = record.receiveAttachmentInfo;
			});
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		validateIndex(rule, value, callback) {
			if (rule.field == 'heatingVal') {
				if (value) {
					if (!this.ifInt(value)) {
						callback('请输入整数');
					}
					if (!this.ifRange(value, 1000, 7500)) {
						callback('请输入1000-7500之间的整数');
					}
				}
				callback();
			}
			if (rule.field == 'sulfurContent') {
				if (value) {
					if (!this.ifTwoDecimal(value)) {
						callback('请输入数字，最多两位小数');
					}
					if (!this.ifRange(value, 0.01, 10)) {
						callback('0.01-10之间的数字');
					}
				}
				callback();
			}
			if (rule.field == 'volatileContent') {
				if (value) {
					if (!this.ifTwoDecimal(value)) {
						callback('请输入数字，最多两位小数');
					}
					if (!this.ifRange(value, 0.01, 600)) {
						callback('0.01-600之间的数字');
					}
				}
				callback();
			}
			if (rule.field == 'waterContent') {
				if (value) {
					if (!this.ifTwoDecimal(value)) {
						callback('请输入数字，最多两位小数');
					}
					if (!this.ifRange(value, 0.01, 50)) {
						callback('0.01-50之间的数字');
					}
				}
				callback();
			}
			callback();
		},
		ifInt(value) {
			if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
				return true;
			} else {
				return false;
			}
		},
		ifRange(value, value1, value2) {
			if (value >= value1 && value <= value2) {
				return true;
			} else {
				return false;
			}
		},
		ifTwoDecimal(value) {
			if (/^\d+(\.\d{0,2})?$/.test(value)) {
				return true;
			} else {
				return false;
			}
		},
		ifTwoDecimalNegative(value) {
			if (/^(-?)\d+(\.\d{0,2})?$/.test(value)) {
				return true;
			} else {
				return false;
			}
		}
	}
};
</script>

<style lang="less">
.receiveInfoModal {
	.row {
		height: 60px;
	}
	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 74px;
			margin-right: 66px;
			display: inline-block;
			text-align: left;
		}
	}
	.ant-form-item-control {
		input {
			width: 240px;
		}
		.ant-select {
			width: 240px;
		}
	}
}
</style>
<style lang="less" scoped>
#receiveInfo {
	::v-deep.ant-table-column-title,
	::v-deep.ant-table-body tr td {
		white-space: nowrap;
	}
}
</style>
