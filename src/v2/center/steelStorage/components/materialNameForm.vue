<template>
	<a-form
		v-bind="$attrs"
		v-on="$listeners"
	>
		<a-form-item label="品名">
			<a-select
				:value="value"
				v-bind="$attrs"
				v-on="$listeners"
				@change="change"
				@focus="getMaterialNameBySteelType"
			>
				<a-select-option
					v-for="item in list"
					:key="item"
					:value="item"
				>
					{{ item }}
				</a-select-option>
			</a-select>
		</a-form-item>
	</a-form>
</template>

<script>
import { getMaterialNameBySteelType } from '../api';
export default {
	props: {
		value: {},
		steelType: {
			default: () => []
		}
	},
	data() {
		return {
			list: []
		};
	},
	watch: {
		steelType() {
			this.change([]);
		}
	},
	mounted() {},
	methods: {
		// 获取品名列表
		async getMaterialNameBySteelType() {
			const params = {
				steelType: this.steelType.join()
			};
			const res = await getMaterialNameBySteelType(params);
			this.list = res.data;
		},
		change(value) {
			this.$emit('change', value);
			this.$emit('input', value);
		}
	},
	components: {}
};
</script>

<style scoped></style>
