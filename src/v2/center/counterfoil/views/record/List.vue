<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					><span>票据查询</span></span
				>
			</div>
			<a-tabs
				v-model="active"
				size="large"
				@change="handelChange"
			>
				<a-tab-pane
					tab="云票"
					key="yun"
				>
					<CounterfoilYunList></CounterfoilYunList>
				</a-tab-pane>
				<a-tab-pane
					tab="融单"
					key="rong"
				>
					<CounterfoilRongList></CounterfoilRongList>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>
<script>
import CounterfoilYunList from './components/CounterfoilYunList.vue';
import CounterfoilRongList from './components/CounterfoilRongList.vue';

export default {
	data() {
		return {
			active: this.$route.query.active || 'yun'
		};
	},
	components: {
		CounterfoilYunList,
		CounterfoilRongList
	},
	computed: {},
	mounted() {},
	methods: {
		handelChange() {
			this.$router.push('/center/counterfoil/record/list?active=' + this.active);
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
</style>
