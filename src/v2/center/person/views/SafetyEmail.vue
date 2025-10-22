<template>
	<div style="width: 100%">
		<div class="s-card">
			<div class="s-card-title">邮箱</div>
			<div class="s-card-content">
				<a-tabs
					:defaultActiveKey="$route.query.defaultKey || 1"
					tabPosition="top"
					@change="callback"
				>
					<a-tab-pane
						tab="邮箱"
						key="1"
					>
						<a-table
							rowKey="index"
							:columns="companyColumns"
							:pagination="false"
							:dataSource="companyData"
							:bordered="bordered"
							:locale="{ emptyText: '暂无数据' }"
						>
							<span
								slot="role"
								slot-scope="text, record"
							>
								{{ record.role | filterCodeByValueName('company_biz_role') }}
							</span>
						</a-table>
					</a-tab-pane>
					<a-tab-pane
						tab="验证码"
						key="2"
					>
						<a-table
							rowKey="createDate"
							:columns="recoderColumns"
							:pagination="false"
							:dataSource="recoderData"
							:bordered="bordered"
							:locale="{ emptyText: '暂无数据' }"
						>
							<span
								slot="status"
								slot-scope="text, record"
							>
								<i v-if="record.type == '企业关联'">
									{{ record.status | filterCodeByValueName('company_user_apply_status') }}
								</i>
								<i v-if="record.type == '企业认证'">
									{{ record.status | filterCodeByValueName('audit_status') }}
								</i>
							</span>
							<span
								slot="operation"
								class="table-operation"
								slot-scope="text, record"
								v-if="record.modifyId"
							>
								<a
									href="javascript:;"
									@click="$router.push('companyRelevanceDetail?id=' + record.modifyId)"
									>查看</a
								>
								<a-divider
									type="vertical"
									v-if="record.status == 4"
								/>
								<a
									href="javascript:;"
									v-if="record.status == 4"
									@click="editCompanyInfo(record)"
									>修改</a
								>
							</span>
						</a-table>
					</a-tab-pane>
					<!-- <router-link to="/center/v2/person/companyrelevance" > -->
					<a-button
						@click.native="goPage"
						icon="plus"
						type="primary"
						slot="tabBarExtraContent"
						v-if="!VUEX_ST_COMPANYSUER.id"
						>关联新企业</a-button
					>
					<!-- </router-link> -->
				</a-tabs>
			</div>
		</div>
	</div>
</template>

<script>
import { API_LINKEDCOMPANYS, API_LINKEDHISRECORD, API_VIEWPROFILE, API_USER_CAN_APPLY } from '@/v2/center/person/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			companyColumns: [
				{
					title: '公司名称',
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{
					title: '创建时间',
					dataIndex: 'linkTime',
					key: 'linkTime'
				},
				{
					title: '身份',
					dataIndex: 'role',
					key: 'role',
					scopedSlots: {
						customRender: 'role'
					}
				}
			],
			recoderColumns: [
				{
					title: '公司名称',
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{
					title: '类型',
					dataIndex: 'type',
					key: 'type'
				},
				{
					title: '创建时间',
					dataIndex: 'createDate',
					key: 'createDate'
				},
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					scopedSlots: {
						customRender: 'status'
					}
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					}
				}
			],
			recoderData: [],
			companyData: [],
			bordered: false
		};
	},
	created() {
		this.getLinkCompanys();
		this.getLinkCompanyRecord();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	methods: {
		goPage() {
			API_USER_CAN_APPLY({
				personalUserId: this.VUEX_ST_PERSONALLINFO.id
			}).then(res => {
				if (res.result) {
					API_VIEWPROFILE().then(res => {
						if (res.code != 200) {
							this.$message.info(res.mssage);
							return;
						}
						const that = this;
						if (res.result && res.result.name && res.result.idcard) {
							if (that.VUEX_ST_PERSONALLINFO.auth == '1') {
								that.$router.push('/center/v2/person/companyrelevance');
							} else {
								that.$router.push('/center/v2/person/personauth');
							}
						} else {
							this.$confirm({
								centered: true,
								title: '请先完善个人信息',
								okText: '前往完善',
								cancelText: '取消',
								onOk() {
									that.$router.push('/center/account/person/info');
								},
								onCancel() {}
							});
						}
					});
				} else {
					this.$message.error('当前账户已关联企业，或存在认证中的企业');
				}
			});
		},
		editCompanyInfo(record) {
			let path = record.authCompanyType === 2 ? '/center/v2/person/companyCertTerminal' : '/center/v2/person/companyCertStepOne';
			this.$router.push({
				path: path,
				query: {
					id: record.modifyId
				}
			});
		},
		callback(data) {
			data == 1 ? this.getLinkCompanys() : this.getLinkCompanyRecord();
			this.$router.replace('/center/v2/person/company?defaultKey=' + data);
		},
		getLinkCompanys() {
			API_LINKEDCOMPANYS().then(res => {
				if (res.code != 200) {
					this.$message.info(res.message);
					return;
				}
				res.result.forEach((item, index) => {
					item['index'] = index;
				});
				this.companyData = res.result;
			});
		},
		getLinkCompanyRecord() {
			API_LINKEDHISRECORD().then(res => {
				if (res.code != 200) {
					this.$message.info(res.message);
					return;
				}
				this.recoderData = res.result;
			});
		}
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="stylus" scoped>
.ant-table-wrapper {
  width: 100%;
}
</style>
