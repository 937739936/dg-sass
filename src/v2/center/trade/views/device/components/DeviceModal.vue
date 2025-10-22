<template>
	<div>
		<a-modal
			class="slModal"
			:visible="visible"
			:title="typeStr"
			@cancel="close"
			width="408px"
		>
			<template slot="footer">
				<a-button @click="close">取消</a-button>
				<a-button
					v-if="type != 'detail'"
					type="primary"
					:loading="loading"
					@click="submit"
				>
					确定
				</a-button>
			</template>
			<a-form
				class="slFormDetail"
				style="padding: 0"
				:form="form"
			>
				<a-form-item label="序列号">
					<a-input
						v-if="type == 'add'"
						placeholder="请输入设备序列号"
						:maxLength="20"
						v-decorator="[
							`deviceSerial`,
							{
								rules: rules.deviceSerial,
								validateTrigger: ['blur']
							}
						]"
					/>
					<span v-else>{{ info.deviceSerial }}</span>
				</a-form-item>
				<a-form-item
					label="设备验证码"
					v-if="validateCode"
				>
					<a-input
						placeholder="请输入设备验证码"
						:maxLength="15"
						v-decorator="[
							`validateCode`,
							{
								rules: rules.validateCode
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="设备名称">
					<a-input
						v-if="type != 'detail'"
						placeholder="请为设备设置名称以方便识别"
						:maxLength="15"
						v-decorator="[
							`deviceName`,
							{
								rules: rules.deviceName,
								validateTrigger: ['blur']
							}
						]"
					/>
					<a-space v-else>
						{{ info.deviceName }}
						<a-icon
							v-auth="'dgChain:myDevice:myDevice:edit'"
							@click="editChange"
							type="edit"
						/>
					</a-space>
				</a-form-item>
				<a-form-item label="设备型号">
					{{ info.deviceModel }}
				</a-form-item>
				<a-form-item label="设备版本">
					{{ info.deviceVersion }}
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	API_DEVICEDETAIL,
	API_DEVICEINFO,
	API_DEVICENAME,
	API_DEVICEDEADD,
	API_DEVICEDEUPDATE
} from '@/v2/center/trade/api/device';
var pattern = /^[^\s]*$/;
export default {
	data() {
		return {
			visible: false,
			form: this.$form.createForm(this),
			validateCode: false, //是否新设备
			loading: false,
			info: {
				deviceSerial: '',
				deviceName: '',
				deviceModel: '',
				deviceVersion: ''
			},
			type: '',
			rules: {
				deviceSerial: [
					{
						required: true,
						message: `设备序列号必填`,
						type: 'string'
					},
					{
						validator: this.deviceSerialRules
					}
				],
				validateCode: [
					{
						required: true,
						whitespace: true,
						message: `设备验证码必填,不支持空格`,
						pattern,
						type: 'string'
					}
				],
				deviceName: [
					{
						required: true,
						whitespace: true,
						message: `设备名称必填`,
						type: 'string'
					},
					{
						validator: this.deviceNameRules
					}
				]
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		typeStr() {
			let type = this.type;
			let typeStr = '设备';
			switch (type) {
				case 'add':
					typeStr = '新增设备';
					break;
				case 'edit':
					typeStr = '编辑设备';
					break;
				case 'detail':
					typeStr = '设备详情';
					break;
			}
			return typeStr;
		}
	},
	methods: {
		async show(type = 'detail', deviceSerial) {
			this.type = type;
			if (deviceSerial) {
				let res = await API_DEVICEDETAIL({ deviceSerial });
				if (res.success && res.data) {
					this.info = res.data;
				}
			}
			this.visible = true;
		},
		close() {
			this.info = {};
			this.form.resetFields();
			this.visible = false;
			this.loading = false;
			this.validateCode = false;
		},

		//设备序列号信息查询，去重校验
		async deviceSerialRules(rule, value, callback) {
			if (!value) {
				callback();
				return;
			} else {
				if (!pattern.test(value)) {
					callback('不支持空格输入');
					return;
				}
				// eslint-disable-next-line no-control-regex
				if (value.match(/[^\x00-\xff]/g)) {
					callback('不支持全角字符');
					return;
				}
				await API_DEVICEINFO({ deviceSerial: value })
					.then(res => {
						if (res.success && res.data) {
							let { deviceModel, deviceVersion, isUnique } = res.data;
							//如果设备型号合设备版本都不存在，则是新增设备，否则是绑定新设备
							if (!deviceModel && !deviceVersion) {
								this.info.deviceModel = '';
								this.info.deviceVersion = '';
								this.validateCode = true;
							} else {
								this.info.deviceModel = deviceModel;
								this.info.deviceVersion = deviceVersion;
								this.validateCode = false;
							}
							if (!isUnique) {
								// 设备是否唯一，true唯一
								// 设备唯一表示没有重复绑定
								callback('该设备已增过，请勿重复添加');
							} else {
								callback();
							}
						} else {
							callback('序列号检测失败');
						}
					})
					.catch(() => {
						callback();
					});
			}
		},
		//设备名称去重校验
		async deviceNameRules(rule, value, callback) {
			if (!value) {
				callback();
			} else {
				if (!pattern.test(value)) {
					callback('不支持空格输入');
					return;
				}
				let data = { deviceName: value };
				//如果修改，传序列号
				if (this.type == 'edit') {
					data.deviceSerial = this.info.deviceSerial;
				}
				let res = await API_DEVICENAME(data).catch(() => {
					callback();
				});
				if (res.success && res.data) {
					callback();
				} else {
					callback('该设备名已使用过，请更换名称');
				}
			}
		},
		//点击修改
		editChange() {
			this.type = 'edit';
			this.$nextTick(() => {
				//设置设备名称
				this.form.setFieldsValue({
					deviceName: this.info.deviceName
				});
			});
		},
		//提交
		submit() {
			this.loading = true;
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					let res;
					if (this.type == 'add') {
						//新增
						res = await API_DEVICEDEADD(values).finally(() => {
							this.loading = false;
						});
					} else if (this.type == 'edit') {
						//修改
						res = await API_DEVICEDEUPDATE({
							deviceName: values.deviceName,
							deviceSerial: this.info.deviceSerial
						}).finally(() => {
							this.loading = false;
						});
					}
					if (res.success) {
						this.$message.success('操作成功');
						this.close();
						this.$emit('confirm');
					} else {
						this.$message.error(res.error?.message);
					}
				}
				this.loading = false;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slModal {
	/deep/.ant-modal-body {
		padding: 20px;
	}
}
i {
	font-size: 14px;
	cursor: pointer;
}
</style>
