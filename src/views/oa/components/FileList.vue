<template>
	<div>
		<template v-if="record">
			<template v-if="record.indexOf(',') > -1">
				<template v-for="(i, index) in list">
					<p :key="index">
						<a
							href="javascript:;"
							@click="previewFile(i)"
							>{{ i.split('/')[i.split('/').length - 1] }}</a
						>
					</p>
				</template>
			</template>
			<template v-else>
				<p>
					<a
						href="javascript:;"
						@click="previewFile(record)"
						>{{ list[list.length - 1] }}</a
					>
				</p>
			</template>
		</template>
		<preview ref="preview" />
	</div>
</template>

<script>
import { API_GETCURRENTENV } from 'api';
import preview from 'components/preview/index.vue';
export default {
	name: 'FileList',
	props: ['record'],
	components: {
		preview
	},
	data() {
		return {};
	},
	computed: {
		list() {
			let record = this.record;
			if (record.includes('.')) {
				return record.split(',') || [];
			}
			if (record.includes('/')) {
				return record.split('/') || [];
			}
			return [];
		}
	},
	methods: {
		previewFile(record) {
			let fullPath = API_GETCURRENTENV(record);
			if (record?.indexOf('.pdf') > -1) {
				window.open(fullPath, '_blank');
			} else if (
				record?.indexOf('.doc') > -1 ||
				record?.indexOf('.docx') > -1 ||
				record?.indexOf('.xlsx') > -1 ||
				record?.indexOf('.xls') > -1
			) {
				window.open('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(fullPath), '_blank');
			} else {
				this.$refs.preview.show(fullPath, 1);
			}
		}
	}
};
</script>

<style scoped></style>
