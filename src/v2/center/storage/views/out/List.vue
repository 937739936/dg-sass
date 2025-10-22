<template>
	<InOutTable
		type="out"
		:columnsIndex="1"
	></InOutTable>
</template>

<script>
import InOutTable from '../../components/InOutTable.vue';

export default {
	name: 'storageCenterOutList',

	components: {
		InOutTable
	}
};
</script>
