<template>
	<div class="user-wrap">
		<a-popover
			placement="bottom"
			class="user-popover"
		>
			<template slot="content">
				<p class="change-company">
					<span class="company-logo"></span>
					<span>切换企业</span>
				</p>
				<ul class="company-list">
					<li
						v-for="item in conpanyList"
						:key="item.companyUscc"
						@click="changeCompany(item)"
					>
						<span>{{ item.companyName }}</span>
						<a-icon type="right" />
					</li>
				</ul>
				<a-divider />
				<p
					class="logout"
					@click="logout"
				>
					退出系统
				</p>
			</template>
			<div class="user-info">
				<div>
					<p class="user-name">
						<span
							class="authentication-icon"
							:class="VUEX_ST_PERSONALLINFO.auth ? 'authentication-icon-true' : 'authentication-icon-false'"
						></span>
						<span>{{ VUEX_ST_PERSONALLINFO.name }}</span>
					</p>
					<p class="company-name">{{ VUEX_ST_COMPANYSUER.company.name }}</p>
				</div>
				<div>
					<a-avatar class="user-avatar" />
				</div>
			</div>
		</a-popover>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { API_COMPANYGETSWITCHCOMPANY, API_COMPANYUSERSWITCH } from 'api/account';
import { getPersonalDetail } from 'untils/factory.js';
import storage from '@sub/utils/storage';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default {
	data() {
		return {
			visible: true,
			conpanyList: [],
			loginUniqueId: storage.session.get('loginUniqueId')
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_GE_CENTERMENUS: 'VUEX_GE_CENTERMENUS',
			VUEX_GE_CENTERMENUSMAP: 'VUEX_GE_CENTERMENUSMAP',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	methods: {
		...mapActions({
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT'
		}),
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		logout() {
			this.VUEX_USER_LOGOUT();
		},
		getCompanyList() {
			if (!this.loginUniqueId) {
				this.getvisitorId();
			}
			API_COMPANYGETSWITCHCOMPANY({
				loginUniqueId: this.loginUniqueId
			}).then(res => {
				if (res.success) {
					this.conpanyList = (res.data || []).filter(item => item.companyUscc !== this.VUEX_ST_COMPANYSUER.companyUscc);
				}
			});
		},
		changeCompany({ companyUscc, companyUserId, supportDel }) {
			API_COMPANYUSERSWITCH({ uscc: companyUscc, companyUserId, supportDel, loginUniqueId: this.loginUniqueId }).then(res => {
				// 替换token 更新用户详情，以及权限
				if (res.success) {
					if (!res.data.result) {
						this.$confirm({
							title: '提示',
							content: '你的账号所属公司或权限已发生变化，请重新登录',
							okText: '确认',
							cancelText: '取消',
							onOk: () => {
								this.logout();
							}
						});
						return;
					}
					const { token } = res.data.token;
					storage.session.set('loginType', 'normal');
					this.VUEX_MU_USERTOKEN(token);
					getPersonalDetail(this.reloadPage);
				}
			});
		},
		reloadPage() {
			window.location.href = '/';
		},
		async getvisitorId() {
			const fp = await FingerprintJS.load();
			const result = await fp.get();
			storage.session.set('loginUniqueId', result.visitorId);
			this.loginUniqueId = result.visitorId;
		}
	},
	mounted() {
		this.getCompanyList();
	}
};
</script>

<style lang="less" scoped>
.user-info {
	width: 160px;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-content: center;
}
.company-name {
	width: 98px;
	height: 22px;
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.5);
	line-height: 22px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.user-name {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.authentication-icon {
	width: 14px;
	height: 14px;
	display: inline-block;
	margin-right: 12px;
}
.authentication-icon-true {
	background: url('~assets/imgs/person/authentication-active.png');
	background-size: 14px 14px;
	background-position: center;
	background-repeat: no-repeat;
}
.authentication-icon-false {
	background: url('~assets/imgs/person/authentication.png');
	background-size: 14px 14px;
	background-position: center;
	background-repeat: no-repeat;
}
.user-avatar {
	width: 48px;
	height: 48px;
	background: url('~assets/imgs/person/user.png');
	background-size: 48px 48px;
}
.company-logo {
	width: 14px;
	height: 14px;
	display: inline-block;
	background: url('~assets/imgs/person/change-company.png');
	background-size: 14px 14px;
	background-position: center;
	margin-right: 4px;
}
.change-company {
	width: 288px;
	height: 22px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.logout {
	width: 56px;
	height: 22px;
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.88);
	line-height: 22px;
	margin: 0 auto;
	cursor: pointer;
}
.logout:hover {
	color: #4682f3;
}
.company-list {
	width: 288px;
	height: auto;
	margin: 10px 0 30px 0;
	li {
		width: 100%;
		height: 30px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: #8495aa;
		cursor: pointer;
	}
	li:hover {
		span {
			color: #4682f3;
		}
		color: #4682f3;
	}
	.right-icon {
		width: 14px;
		height: 14px;
		display: inline-block;
		background: url('~assets/imgs/person/right-icon.png');
		background-size: 14px 14px;
		background-position: center;
	}
}
/deep/ .ant-popover-inner-content {
	padding: 20px 20px 10px 20px;
}
</style>
