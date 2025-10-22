<template>
	<div class="form-input">
		<a-input-number
			class="sl-ipt"
			v-bind="$attrsAll"
			style="width: 100%"
			:value="value"
			v-on="$listenersAll"
			@change="handleinput"
			autoComplete="off"
		>
		</a-input-number>
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
	methods: {
		handleinput(val) {
			this.$emit('input', val);
		}
	},
	components: {}
};
</script>

<style scoped></style>
