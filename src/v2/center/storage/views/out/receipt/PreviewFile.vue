<template>
	<div class="background-wrapper">
		<a-card
			class="custom-card-title mb16"
			title="出仓单文件预览"
			:bordered="false"
		>
			<pdf-preview
				v-for="(item, index) in data"
				:key="item"
				:id="index"
				:url="item"
			></pdf-preview>
			<div class="tc">
				<a-button
					type="primary"
					@click="$router.go(-1)"
					>返回</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { API_OutWarehouseReceiptGetAttach } from '@/v2/center/storage/api';

export default {
	name: 'storageCenterOutPdfPreview',
	components: {
		PdfPreview
	},

	data() {
		return {
			data: []
		};
	},
	created() {
		this.getAttach();
	},
	methods: {
		getAttach() {
			API_OutWarehouseReceiptGetAttach(this.$route.query.id).then(res => {
				this.data = res.data;
			});
		}
	}
};
</script>
