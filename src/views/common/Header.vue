<template>
	<div>
		<div :class="!ifHome ? 'wrap-bg' : ''">
			<div class="wrap-1200">
				<div class="menu-wrap">
					<div class="menu-block">
						<router-link
							to="/home"
							class="experience-btn"
						>
							<!-- <img
								class="logo-img"
								src="../../assets/imgs/home/menu/shulian-logo.png"
								alt=""
							/> -->
						</router-link>
					</div>
					<div class="menu-block">
						<ul class="menu ml0">
							<li>
								<router-link
									v-if="!VUEX_ST_TOKEN"
									to="/login"
									class="experience-btn"
									active-class="active"
									>登录</router-link
								>
								<span v-if="VUEX_ST_TOKEN && name">{{ name }}，</span>
								<span
									v-if="VUEX_ST_TOKEN"
									class="quit"
									@click="logout()"
									>退出</span
								>
								<a
									href="javascript:;"
									@click="changeTab('/center/account/person/info', 1)"
									class="my-center"
									>我的{{ systemConfig.name }}</a
								>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ENV from '../../api/env.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import systemConfig from '@/v2/config/common';

export default {
	name: 'Header',
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	mounted() {
		if (this.VUEX_ST_TOKEN) {
			this.name = this.VUEX_ST_PERSONALLINFO.name;
		}

		if (this.name.length > 4) {
			this.name = this.name.substring(0, 4) + '...';
		}
	},
	props: {
		ifHome: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		...mapActions({
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT'
		}),
		changeTab(url) {
			this.$router.replace(url);
		},
		logout() {
			this.VUEX_USER_LOGOUT();
		}
	},
	data() {
		return {
			name: '',
			ENV: ENV,
			systemConfig
		};
	}
};
</script>

<style lang="less" scoped>
.wrap-bg {
	background: #1b1e25;
	/*opacity: .9;*/
	height: 74px;
}

.wrap-1200 {
	width: 1200px;
	margin: 0 auto;
}

/*头*/
a {
	touch-action: none;
}

a:active,
a:visited,
a:focus {
	text-decoration: none;
	text-decoration-skip-ink: none;
	outline: none;
}

.menu-wrap {
	padding-top: 8px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: relative;
	z-index: 9999;

	.menu {
		display: inline-block;
		margin-left: 35px;

		li {
			display: inline-block;
			padding: 0 25px;

			a {
				color: #fff;
				font-size: 18px;
				padding: 5px 0;
				vertical-align: middle;

				&.active {
					border-bottom: 1px solid #fff;
				}

				&.my-center {
					background: #fff;
					color: #0053db;
					font-size: 14px;
					border-radius: 15px;
					font-weight: bold;
					padding: 4px 10px;
					margin-left: 15px;
				}
			}

			span {
				color: white;
				vertical-align: middle;
				display: inline-block;
			}

			&:hover {
				a {
					border-bottom: 1px solid #fff;

					&.my-center {
						border: none;
					}
				}
			}
		}

		.quit {
			vertical-align: middle;
			display: inline-block;

			&:hover {
				opacity: 0.8;
				cursor: pointer;
			}
		}
	}

	.ml10 {
		margin-left: 10px;
	}

	.ml0 {
		margin-left: 0px;
	}

	.pd0 {
		padding: 0;
	}
}

.logo-img {
	width: 172px;

	position: relative;
	top: 6px;
}
</style>
