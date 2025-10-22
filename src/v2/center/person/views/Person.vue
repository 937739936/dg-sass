<template>
	<div class="person slMain">
		<a-card :bordered="false">
			<div
				class="loading-wrap"
				v-if="loading"
			>
				<a-spin />
			</div>
			<div v-else>
				<NoAuth v-if="!auth && !authAuditStatus" />
				<Info
					v-else
					:personalInfo="personalInfo"
					v-on:update="initData"
				/>
			</div>
			<!-- <Auth /> -->
			<!-- <Authed /> -->
			<!-- <Authing /> -->
		</a-card>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import { API_PERSONALMODIFY, API_PersonalModifyMobileValid, API_GetRealNameAuthDetail } from '@/v2/api/account';
import { mapGetters, mapMutations } from 'vuex';
import { API_UPLOAD } from '@/v2/center/person/api';
import NoAuth from './components/NoAuth';
import Auth from './components/Auth';
import Authed from './components/Authed';
import Authing from './components/Authing';
import Info from './components/Info';

export default {
	components: {
		NoAuth,
		Auth,
		Authed,
		Authing,
		Info
	},
	data() {
		return {
			unverifiedVisible: false,
			result: {},
			picUrl: '',
			action: API_UPLOAD,
			ENV,
			authAuditStatus: '',
			auth: null,
			personalInfo: {},
			loading: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	watch: {},
	mounted() {
		this.initData();
	},
	methods: {
		...mapMutations({
			VUEX_MU_PERSONALLINFO: 'user/VUEX_MU_PERSONALLINFO'
		}),
		async initData() {
			this.loading = true;
			const { data } = await API_GetRealNameAuthDetail({ t: new Date().getTime() });
			this.authAuditStatus = data.authAuditStatus;
			this.auth = data.auth;
			this.personalInfo = data;
			this.loading = false;
		},
		showModel() {
			this.unverifiedVisible = false;
			this.visible = true;
			this.$refs.personValidModel.showPersonValid();
		},
		authenticationCompany() {
			if (!this.VUEX_ST_PERSONALLINFO.name) {
				this.unverifiedVisible = true;
			} else {
				this.$router.push('/center/account/company/info');
			}
		},
		handleChange(info) {
			this.picUrl = info;
			if (this.picUrl.includes('trade-files')) {
				API_PERSONALMODIFY({
					picUrl: this.picUrl
				}).then(res => {
					if (!res.success) {
						this.$message.error(res.message);
						return;
					}
					this.$refs.iUpload.fileList = [];
					this.VUEX_MU_PERSONALLINFO({
						...this.VUEX_ST_PERSONALLINFO,
						picUrl: this.picUrl
					});
					this.$message.success('保存成功');
				});
			}
		},
		editMobile() {
			this.JudgeUpdateMobile();
		},
		JudgeUpdateMobile() {
			// 判断是否可在个人信息处修改手机号,非管理员，非签章员身份可修改
			API_PersonalModifyMobileValid().then(res => {
				if (res.success) {
					this.$router.push('/center/account/person/safety');
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	background: #fff;
}
.person {
	position: relative;
	.flex-center {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.title {
		height: 33px;
		font-size: 24px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		line-height: 33px;
		margin-bottom: 30px;
	}
	.tips {
		widows: 100%;
		height: 60px;
		padding: 12px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		border: 1px solid rgba(229, 230, 235, 1);
		box-sizing: border-box;
		background: rgba(243, 247, 255, 1);
		border-radius: 4px;
		margin-top: 30px;
		color: rgba(0, 0, 0, 0.8);
	}
	.icon {
		width: 16px;
		height: 16px;
		display: inline-block;
		background-image: url('~v2/assets/imgs/common/info_icon.png');
		background-size: 16px 16px;
		background-position: center;
	}
	.desc-top {
		margin-left: 12px;
	}
	.desc-bot {
		margin-left: 28px;
	}
	.person-auth {
		color: @primary-color;
		cursor: pointer;
	}
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 200px;
		box-sizing: border-box;
	}
	.card {
		width: 218px;
		height: 136px;
		background-image: url('~v2/assets/imgs/person/card.png');
		background-size: 218px 136px;
	}
	.content-tip {
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		margin-top: 20px;
	}
	.auth-btn {
		width: 116px;
		height: 38px;
		margin-top: 50px;
	}
}
.loading-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding-top: 200px;
	box-sizing: border-box;
}
</style>
