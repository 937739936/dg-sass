<template>
	<a-row
		style="margin-top: 20px"
		v-if="pagination.total"
	>
		<a-col align="center">
			<a-pagination
				:current="pagination.pageNo"
				:total="pagination.total"
				:showSizeChanger="!pagination.hideSize"
				:pageSize="pagination.pageSize"
				:showTotal="total => `共有${total} 条`"
				:pageSizeOptions="['5', '10', '20', '30', '40', '50']"
				:showQuickJumper="quick"
				@showSizeChange="onChange"
				@change="onChange"
			/>
		</a-col>
	</a-row>
</template>
<script>
export default {
	name: 'iStoragePagination',
	props: ['pagination'],
	computed: {
		quick() {
			return this.pagination.total / (this.pagination.hideSize ? 10 : 10) > 5;
		}
	},
	methods: {
		onChange(page, size) {
			this.$emit('change', page, size);
		}
	}
};
</script>
