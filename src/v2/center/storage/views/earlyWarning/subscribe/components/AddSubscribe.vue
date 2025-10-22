<template>
	<a-modal
		class="slModal"
		title="新增订阅"
		width="800px"
		destroyOnClose
		@ok="handleOk"
		v-model="visible"
	>
		<div class="modal-form-wrapper">
			<a-form :form="form">
				<a-table
					class="new-table"
					:columns="columns"
					:rowKey="record => record.timestamp"
					:dataSource="dataSource"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="mobilePhone"
						slot-scope="text, record, index"
					>
						<a-form-item
							:label="false"
							:colon="false"
						>
							<a-input
								style="width: 230px"
								placeholder="请输入手机号"
								@focus="handleFocus(record)"
								@change="handleChangeMobilePhone"
								v-decorator="[
									setDecoratorName(record, 'mobilePhone'),
									{
										initialValue: text,
										rules: [{ required: false, message: '请输入手机号' }, { validator: validIdTel }]
									}
								]"
							/>
						</a-form-item>
					</template>
					<template
						slot="earlyWarningTypes"
						slot-scope="text, record, index"
					>
						<a-form-item
							:label="false"
							:colon="false"
						>
							<a-checkbox-group
								@change="handleChangeEarlyWarningTypes"
								v-decorator="[
									setDecoratorName(record, 'earlyWarningTypes'),
									{
										initialValue: text,
										rules: [{ required: false, message: '订阅预警类型不能为空' }]
									}
								]"
							>
								<a-checkbox
									@focus="handleFocus(record)"
									:value="item.key"
									:key="item.key"
									v-for="item in earlyWarningType"
								>
									{{ item.value }}
								</a-checkbox>
							</a-checkbox-group>
						</a-form-item>
					</template>
					<template
						slot="action"
						slot-scope="text, record, index"
					>
						<a
							style="margin-right: 8px"
							@click="add()"
							>添加</a
						>
						<a
							class="del"
							@click="del(index)"
							v-if="dataSource.length > 1"
							>删除</a
						>
					</template>
				</a-table>
			</a-form>
		</div>
	</a-modal>
</template>

<script lang="jsx">
import iPagination from "@sub/components/iPagination";
import { API_GrainSituationEarlyWarningAddSubscription, API_GrainSituationEarlyWarningType } from '@/v2/center/storage/api';

const columns = [
	{
		title: '手机号',
		dataIndex: 'mobilePhone',
		scopedSlots: { customRender: 'mobilePhone' }
	},
	{
		title: '订阅预警类型',
		dataIndex: 'earlyWarningTypes',
		scopedSlots: { customRender: 'earlyWarningTypes' }
	},
	{
		title: '操作',
		key: 'action',
		width: 100,
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	name: 'AddSubscribe',

	components: {
		iPagination
	},
	data() {
		return {
			columns,
			form: this.$form.createForm(this),
			visible: false,
			continue: true,
			curRecord: {},
			earlyWarningType: [],
			dataSource: [],
			params: {},
			pagination: {
				type: '',
				total: 0,
				pageNo: 1
			}
		};
	},
	created() {
		API_GrainSituationEarlyWarningType().then(res => {
			if (res.success) {
				this.earlyWarningType = res.data;
			}
		});
	},
	methods: {
		// 校验注册电话
		validIdTel(rule, value, callback) {
			const isMobilePhone = /1[0-9][0-9]{9}$/;
			// const isFixMob= /^(\(\d{3,4}\))\d{7,9}$/

			if (value.length > 0) {
				if (isMobilePhone.test(value)) {
					callback();
				} else {
					callback('手机号格式不正确');
				}
			} else {
				callback();
			}
		},
		setDecoratorName(record, str) {
			return `${str}${record.timestamp}`;
		},
		handleFocus(record) {
			this.curRecord = record;
		},
		handleChangeMobilePhone(e) {
			this.setValue(e.target.value, 'mobilePhone');
		},
		handleChangeEarlyWarningTypes(v) {
			this.setValue(v, 'earlyWarningTypes');
		},
		setValue(v, str) {
			const fields = {};
			fields[this.setDecoratorName(this.curRecord, str)] = v;
			this.form.setFieldsValue(fields);
			this.dataSource.forEach(item => {
				if (item.timestamp === this.curRecord.timestamp) {
					item[str] = v;
				}
			});
		},
		showModal() {
			this.visible = true;
			this.dataSource = [
				{
					mobilePhone: '',
					earlyWarningTypes: [],
					timestamp: -1
				}
				// {
				//   mobilePhone: 1,
				//   earlyWarningTypes: ['GRAIN_TEMP'],
				//   timestamp: 222
				// },
				// {
				//   mobilePhone: 2,
				//   earlyWarningTypes: ['GRAIN_TEMP'],
				//   timestamp: 333
				// },
			];
		},

		add() {
			if (this.continue) {
				this.continue = false;
				setTimeout(() => {
					const timestamp = new Date().getTime();
					const item = {
						phone: '',
						type: '',
						timestamp
					};
					this.dataSource = [...this.dataSource, item];
					this.continue = true;
				}, 200);
			}
		},

		del(index) {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确定删除该数据？',
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
					this.dataSource.splice(index, 1);
				},
				onCancel() {}
			});
		},

		handleOk() {
			let isNullValue = false;
			this.dataSource.forEach(item => {
				if (
					(item.earlyWarningTypes && item.earlyWarningTypes.length <= 0) ||
					(item.mobilePhone && item.mobilePhone.length <= 0)
				) {
					isNullValue = true;
				}
				if (!item.earlyWarningTypes) {
					isNullValue = true;
				}
				if (!item.mobilePhone) {
					isNullValue = true;
				}
			});
			if (isNullValue) {
				this.$message.error('手机号和订阅预警类型不能为空');
				return;
			}
			this.form.validateFieldsAndScroll(err => {
				if (!err) {
					API_GrainSituationEarlyWarningAddSubscription({ subscriptions: this.dataSource }).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('新增订阅成功');
								this.$emit('addSuccess');
								this.visible = false;
							} else {
								this.$message.error('新增订阅失败');
							}
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.modal-form-wrapper {
	max-height: 500px;
	overflow-y: auto;
}
::v-deep.modal-form-wrapper .ant-form-item {
	margin-bottom: 0;
}
</style>
