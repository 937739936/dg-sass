<template>
	<a-row>
		<pdf-preview
			v-if="$route.query.url"
			:url="$route.query.url"
		></pdf-preview>
		<a-row
			type="flex"
			justify="center"
			style="margin: 50px 0"
		>
			<a-button
				type="primary"
				@click.native="$router.go(-1)"
				>返回</a-button
			>
		</a-row>
	</a-row>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
export default {
	components: {
		PdfPreview
	}
};
</script>

<style lang="stylus" scoped></style>
