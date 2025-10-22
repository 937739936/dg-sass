<template>
	<p>
		<span class="search-form-label">{{ label }}:</span>
		<a-space class="input-search-wrap">
			<a-input-search
				class="search-input"
				@focus="changeClass(1)"
				@blur="changeClass(0)"
				size="small"
				v-model="no"
				:class="[isInput ? 'search-input-active' : 'search-input']"
				@search="confirmSearch"
				:placeholder="placeholder"
			/>
		</a-space>
	</p>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: '编号'
		},
		title: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			no: '',
			isInput: 0
		};
	},
	methods: {
		confirmSearch() {
			if (this.no) {
				this.$emit('change', { [this.title]: [this.no.trim()] });
				this.no = '';
			}
		},
		clear() {
			this.no = '';
		},
		changeClass(type) {
			this.isInput = type;
		}
	}
};
</script>

<style lang="less" scoped>
@import url('./style.less');
</style>
