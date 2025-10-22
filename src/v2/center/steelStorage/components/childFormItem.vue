<template>
	<div class="form-input">
		<a-input
			class="sl-ipt"
			v-bind="$attrsAll"
			v-on="$listenersAll"
			autoComplete="off"
		>
		</a-input>
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
			return Object.assign({}, this.$listeners, { input: event => this.$emit('input', event.target.value) });
		}
	},
	methods: {},
	components: {}
};
</script>

<style scoped></style>
