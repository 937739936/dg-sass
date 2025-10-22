<template>
	<div>
		<CoalEdit
			:defaultIndex="activeIndex || 0"
			:detailData="detailData"
			ref="edit"
			v-if="industryType === 'COAL'"
		></CoalEdit>
		<SteelEdit
			:defaultIndex="activeIndex || 0"
			:detailData="detailData"
			ref="edit"
			v-else-if="industryType === 'STEEL'"
		></SteelEdit>
		<ModalInfo
			ref="modalInfoChange"
			title="提示确认提交"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="back"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="submit"
				>
					提交后返回
				</a-button>
			</div>
		</ModalInfo>
	</div>
</template>
<script>
import { delKeep } from '@/v2/utils/factory.js';
import { API_GetAccountsDetail } from '@/v2/center/assets/api/index.js';
import ModalInfo from '@/v2/components/modalInfo/info';
import SteelEdit from './components/SteelEdit.vue';
import CoalEdit from './components/CoalEdit.vue';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			activeIndex: this.$route.query.activeIndex || 0,
			detailData: {}, // 详情数据
			isNeedNext: false, // 是否数据变更
			forceBack: null
		};
	},
	components: {
		CoalEdit,
		SteelEdit,
		ModalInfo
	},
	provide() {
		return {
			isNeedNextChangeParent: this.isNeedNextChange
		};
	},
	beforeRouteLeave(to, from, next) {
		// 如果是前往合同编辑，不校验
		if (to.path === '/center/contract/sell/offline/add') {
			next();
			return;
		}
		if (this.isNeedNext) {
			this.oldAndNew(next);
		} else {
			delKeep(this);
			next();
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		industryType() {
			let industryType = this.detailData?.receivalVO?.industryType;
			return industryType;
		}
	},
	mounted() {
		API_GetAccountsDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
			}
		});
	},
	methods: {
		isNeedNextChange(change = true) {
			this.isNeedNext = change;
		},
		//返回
		back() {
			this.isNeedNext = false;
			this.$refs.modalInfoChange.close();
			delKeep(this);
			this.forceBack();
		},
		// 离开页面拦截
		oldAndNew(next) {
			this.forceBack = next;
			this.$refs.modalInfoChange.open();
		},
		// 提交后返回
		submit() {
			this.$refs.modalInfoChange.close();
			this.$refs.edit?.$refs.editInfo?.onSubmit('submit');
		}
	}
};
</script>
<style lang="less" scoped></style>
