import {
	API_FinancingAudit,
	API_FinancingMAINAudit,
	API_FinancingMAINOnlySignSave,
	API_FinancingJROnlySignSave,
	API_FinancingDetail
} from '@/v2/center/financing/api/index.js';
import { mapGetters } from 'vuex';
export const assetsMixin = {
	data() {
		return {
			rongzi: [
				{
					title: '应收账款流水号',
					dataIndex: 'receivableSerialNo',
					scopedSlots: { customRender: 'receivableSerialNo' }
				},
				{
					title: '买方名称',
					dataIndex: 'buyerName'
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
				},
				{
					title: '应收账款金额',
					dataIndex: 'receivableAmount'
				},
				{
					title: '应收账款起始日期',
					dataIndex: 'beginDate'
				},
				{
					title: '应收账款到期日期',
					dataIndex: 'endDate'
				}
			],
			financingApplyId: ''
		};
	},
	watch: {},
	created() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/receivable/detail',
				query: {
					id: record.id,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		sumbitAudit() {
			// 审核拒绝直接调接口 不盖章
			if (this.auditResult == 'REJECT') {
				this.$confirm({
					centered: true,
					content: '需要填写驳回意见',
					okText: '确定',
					icon: 'info-circle',
					title: '确认驳回？',
					closable: true,
					cancelText: '取消',
					onOk: () => {
						if (!this.auditOpinion) {
							this.$message.error('请填写驳回意见');
							return;
						}
						let func = this.$route.query.type == 'jr' ? API_FinancingAudit : API_FinancingMAINAudit;
						func({
							financingApplyId: this.financingApplyId,
							auditOpinion: this.auditOpinion
						}).then(() => {
							this.$message.success('操作成功');
							this.$router.back();
						});
					},
					onCancel() {}
				});

				return;
			}
			if (this.auditResult == 'PASS') {
				this.$confirm({
					centered: true,
					content: '系统将对融资合同进行签章，请确保信息无误',
					okText: '确定',
					icon: 'info-circle',
					title: '确认提示',
					closable: true,
					cancelText: '取消',
					onOk: () => {
						const o = {
							auditOpinion: this.auditOpinion,
							type: this.$route.query.type,
							id: this.financingApplyId
						};
						let func = o.type == 'main' ? API_FinancingMAINOnlySignSave : API_FinancingJROnlySignSave;
						func({ financingApplyId: o.id, auditOpinion: o.auditOpinion }).then(res => {
							if (res.data) {
								if (o.type == 'main') {
									this.getFinancingDetail(o);
								} else {
									if (
										this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
										this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
									) {
										this.$router.push({
											path: '/center/financing/financingAuditSign',
											query: o
										});
									} else {
										this.$message.success('操作成功');
										this.$router.push('/center/financing/financingListJR');
									}
								}
							}
						});
					},
					onCancel() {}
				});
			}
		},
		getFinancingDetail(o) {
			if (!o?.id) {
				return;
			}
			API_FinancingDetail({ financingApplyId: o.id }).then(res => {
				if (res.success) {
					if (res.data.status === 'CORE_COMPANY_TO_BE_SIGNED') {
						if (
							this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
							this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
						) {
							this.$router.push({
								name: 'financingAuditSign',
								params: o,
								query: o
							});
						} else {
							this.$message.success('操作成功');
							this.$router.push('/center/financing/financingListJR');
						}
					} else {
						this.$message.success('操作成功');
						this.$router.push('/center/financing/financingListMAIN');
					}
				}
			});
		}
	}
};
