<template>
	<div class="form-date">
		<a-date-picker
			class="range"
			:value="value"
			v-bind="$attrsAll"
			v-on="$listenersAll"
			:allowClear="false"
			@change="changeDate"
		>
			<span
				slot="suffixIcon"
				class="calendar"
			></span>
		</a-date-picker>
	</div>
</template>

<script>
export default {
	props: {
		addonBeforeTitle: '',
		value: ''
	},
	data() {
		return {};
	},
	computed: {
		$attrsAll() {
			return {
				value: this.value,
				...this.$attrs
			};
		},
		$listenersAll() {
			return Object.assign({}, this.$listeners);
		}
	},
	mounted() {},
	methods: {
		changeDate(value) {
			this.$emit('input', value);
		}
	},

	components: {}
};
</script>
<style lang="less" scope>
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}
</style>
