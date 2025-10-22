<template>
	<div class="business-line-info">
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
		>
			<a-form-item label="货主">
				<a-select
					style="width: 364px"
					:disabled="!enableeEdit"
					placeholder="请选择货主"
					v-decorator="['ownerCompanyUscc', { rules: [{ required: true, message: '请选择货主' }] }]"
					@change="ownerCompanyUsccChange"
				>
					<a-select-option
						v-for="item in shipperOptions"
						:value="item.companyUscc"
						:key="item.companyUscc"
						>{{ item.companyName }}</a-select-option
					>
				</a-select>
			</a-form-item>
		</a-form>
	</div>
</template>

<script>
export default {
	name: 'ShipperInfo',
	props: {
		shipperInfo: {
			type: Object,
			default: () => {
				return {
					ownerCompanyName: undefined, // 货主名称
					ownerCompanyUscc: undefined // 货主编码
				};
			}
		},
		enableeEdit: {
			type: Boolean,
			default: true
		},
		shipperList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			form: this.$form.createForm(this)
		};
	},
	computed: {
		shipperOptions() {
			let options = this.shipperList || [];
			if (options.length == 0 && this.shipperInfo.ownerCompanyUscc) {
				options = [{ companyName: this.shipperInfo.ownerCompanyName, companyUscc: this.shipperInfo.ownerCompanyUscc }];
			}
			return options;
		}
	},
	watch: {
		shipperInfo: {
			deep: true,
			handler(val) {
				let { ownerCompanyUscc } = val;
				console.log('shipperInfo change', val);
				this.$nextTick(() => {
					this.form.setFieldsValue({
						ownerCompanyUscc: ownerCompanyUscc
					});
				});
			},

			immediate: true
		}
	},
	methods: {
		validateBusinessLineInfo() {
			return new Promise((resolve, reject) => {
				this.form.validateFields((err, values) => {
					if (err) {
						reject('货主信息填写有误');
						return;
					}
					let { ownerCompanyUscc } = values;
					let shipperInfo = this.getSelectShipperInfo(ownerCompanyUscc);
					resolve(shipperInfo);
				});
			});
		},
		// 货主编码改变时触发
		ownerCompanyUsccChange(value) {
			let shipperInfo = this.getSelectShipperInfo(value);
			this.$emit('onSelectedShipperInfoChange', shipperInfo);
		},
		getSelectShipperInfo(ownerCompanyUscc) {
			let shipperInfo = { ownerCompanyUscc };
			this.shipperList.forEach(item => {
				if (item.companyUscc === ownerCompanyUscc) {
					shipperInfo.ownerCompanyName = item.companyName;
					return;
				}
			});
			return { ...shipperInfo };
		}
	}
};
</script>

<style lang="less" scoped>
.business-line-info {
	// padding-bottom: 1px;
	margin-bottom: 50px;
	.slFormDetail {
		padding: 0 0;
		// padding-bottom: 20px;
	}
}
</style>