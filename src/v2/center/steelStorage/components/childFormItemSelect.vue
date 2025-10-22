<template>
	<div class="form-select">
		<a-select
			:value="value"
			class="select"
			v-bind="$attrsAll"
			v-on="$listenersAll"
			@change="changeSelect"
		>
			<slot></slot>
		</a-select>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			default: ''
		}
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
		changeSelect(value) {
			this.$emit('input', value);
		}
	},

	components: {}
};
</script>
