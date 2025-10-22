<template>
	<a-form
		v-bind="$attrs"
		v-on="$listeners"
	>
		<a-form-item label="仓库">
			<a-select
				:value="value"
				v-bind="$attrs"
				v-on="$listeners"
				@change="change"
			>
				<a-select-option
					v-for="item in storageList"
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
import { getStorageList } from '../api';
export default {
	props: {
		value: {}
	},
	data() {
		return {
			storageList: []
		};
	},
	mounted() {
		this.getStorageList();
	},
	methods: {
		// 获取仓库列表
		async getStorageList() {
			const res = await getStorageList({});
			this.storageList = res.data;
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
