<template>
	<div class="breadcrumb-wrap">
		<a-breadcrumb
			:routes="routes"
			v-if="routes.length"
		>
			<template
				slot="itemRender"
				slot-scope="{ route, params, routes }"
			>
				<span v-if="routes.indexOf(route) === routes.length - 1">
					{{ route.name }}
				</span>
				<router-link
					v-else
					:to="route.path"
				>
					{{ route.name }}
				</router-link>
			</template>
		</a-breadcrumb>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		routes: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	methods: {},
	mounted() {}
};
</script>

<style lang="less" scoped>
.breadcrumb-wrap {
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.4);
	line-height: 20px;
	position: sticky;
	top: 0;
	z-index: 999;
	padding: 15px 0;
	background-color: #f3f5f6;
	width: 100%;
	::v-deep.ant-breadcrumb {
		line-height: 20px;
		& > span:last-child {
			.ant-breadcrumb-link {
				font-family:
					PingFangSC-Medium,
					PingFang SC !important;
				font-weight: 500 !important;
				color: rgba(0, 0, 0, 0.4) !important;
			}
		}
	}
}
</style>
