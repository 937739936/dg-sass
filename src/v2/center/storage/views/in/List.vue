<template>
	<InOutTable
		type="in"
		:columnsIndex="0"
	></InOutTable>
</template>

<script>
import InOutTable from '../../components/InOutTable.vue';

export default {
	name: 'StorageCenterIn',

	components: {
		InOutTable
	}
};
</script>
