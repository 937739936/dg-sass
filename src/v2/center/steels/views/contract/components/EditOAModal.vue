<template>
	<!-- 修改下游负责人信息 -->
	<a-modal
		title="修改信息"
		:visible="updateTerminalDirectorVisible"
		@cancel="updateTerminalDirectorVisible = false"
		@ok="submitUpdate"
		destroyOnClose
	>
		<div class="content">
			<relation-order
				:oaflag="true"
				:isOa="false"
				:showRelation="false"
				ref="relation"
				:hideTitle="true"
				:resultDetail="resultDetail"
				:edit="true"
			/>
		</div>
	</a-modal>
</template>

<script>
import { API_COMPANYOACHECK, getOAAuditCode, editModifyProcessInitiator, getOaInfo } from '@/v2/center/steels/api/contract.js';
// import {
//   getOAAuditCode,
//   editModifyProcessInitiator,
//   getOaInfo,
// } from "api/steels";
import { mapGetters } from 'vuex';
import RelationOrder from './RelationOrder.vue';
import { getPopupContainer } from '@/v2/utils/factory';

export default {
	data() {
		return {
			getPopupContainer,
			updateTerminalDirectorVisible: false, // 修改下游负责人弹窗
			updateForm: this.$form.createForm(this), // 修改下游负责人表单
			info: {},
			oaUserNameList: [],
			systemCode: '',
			curOperator: {},
			oaInfo: {},
			oaauditcodelist: [],
			systemVOList: [],
			auditChainAndOperator: {},
			defaultRelationValue: {},
			resultDetail: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {
		RelationOrder
	},
	methods: {
		show(info = {}) {
			getOaInfo({
				id: info.id
			}).then(res => {
				if (res.success) {
					this.updateTerminalDirectorVisible = true;
					this.resultDetail = {
						auditChainAndOperator: res.data
					};
					this.getOrderData();
				}
			});
			this.info = info;
		},
		close() {
			this.updateTerminalDirectorVisible = false;
		},
		submitUpdate() {
			// 提交下游负责人的修改
			let relationFlag = false;
			if (this.$refs.relation) {
				this.$refs.relation.relationForm.validateFieldsAndScroll(error => {
					if (!error) {
						relationFlag = true;
					}
				});
			}
			if (!relationFlag) {
				return;
			}
			const params = {
				id: this.info.id,
				...this.curOperator,
				auditChainAndOperator: this.$refs.relation.auditChainAndOperator
			};
			editModifyProcessInitiator(params).then(res => {
				if (res.success) {
					this.updateTerminalDirectorVisible = false;
					this.$message.success('操作成功');
					this.$emit('success');
					this.$refs.relation.relationForm.resetFields();
				}
			});
		},
		async getOAAuditCode() {
			const res = await getOAAuditCode();
			this.oaInfo = res.data;
		},
		async getOrderData() {
			let res = await API_COMPANYOACHECK({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				industryType: 'STEEL'
			});
			this.oaflag = res.result;
			if (this.oaflag) {
				this.getOAAuditCode();
				this.$refs.relation.getoaauditcodelist(this.oaflag);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	// margin-left: -60px;
	// padding-right: 60px;
	.wrap {
		margin: 0;
	}
	/deep/ .card {
		box-shadow: none;
		padding: 0;
		min-height: 100px;
	}
}
</style>
