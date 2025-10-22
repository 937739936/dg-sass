<template>
	<a-modal
		title="出仓单附件预览"
		width="800px"
		destroyOnClose
		v-model="visible"
	>
		<template slot="footer">
			<a-button @click="handleCancel">关闭</a-button>
		</template>
		<div style="min-height: 500px">
			<pdf-preview
				v-for="(item, index) in data"
				:key="item"
				:id="index"
				:url="item"
			></pdf-preview>
		</div>
	</a-modal>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { API_OutWarehouseReceiptGetAttach } from '@/v2/center/steels/api';

export default {
	name: 'PreviewFileModal',
	components: {
		PdfPreview
	},

	data() {
		return {
			visible: false,
			data: [],
			id: ''
		};
	},
	methods: {
		showModal(id) {
			this.data = [];
			this.visible = true;
			this.id = id;
			this.getAttach();
		},
		handleCancel() {
			this.visible = false;
		},
		getAttach() {
			API_OutWarehouseReceiptGetAttach(this.id).then(res => {
				this.data = res.data;
			});
		}
	}
};
</script>
