<template>
	<div
		class="header"
		:class="show ? 'white' : ''"
		id="home-header"
	>
		<router-link to="/">
			<div class="logo">
				<img
					src="../../../assets/imgs/home/logo.png"
					alt=""
				/>
			</div>
		</router-link>
		<div class="navigation">
			<ul class="nav-list">
				<li
					v-for="(item, index) in navigationList"
					:key="`${item.url}_${index}`"
					class="nav-list-item"
				>
					<router-link :to="item.url">
						{{ item.name }}
					</router-link>
				</li>
			</ul>
			<ul
				class="user"
				v-if="!VUEX_ST_PERSONALLINFO.id"
			>
				<li class="login">
					<router-link to="/login">登录</router-link>
				</li>
				<li class="register">
					<router-link to="/register">注册</router-link>
				</li>
			</ul>
			<ul
				class="user"
				v-else
			>
				<li class="workbench">
					<a @click.prevent="enterSystem">进入工作台>></a>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import { delay } from 'lodash';
import Vue from 'vue';
import { pageResize } from '@/v2/center/home/lib/rem';
import { mapGetters } from 'vuex';
import storage from "@sub/utils/storage";
import store from 'store';
let navigationList = [
	{
		name: '走进数链',
		url: '/home'
	},
	{
		name: '企业动态',
		url: '/act'
	},
	{
		name: '解决方案',
		url: '/solution'
	},
	{
		name: '经典案例',
		url: '/case'
	},
	{
		name: '加入我们',
		url: '/join'
	}
];
export default {
	name: 'Header.vue',
	data() {
		return {
			navigationList,
			visible: false,
			show: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_BACKURL: 'VUEX_ST_BACKURL'
		})
	},
	mounted() {
		pageResize(document.querySelector('.header'));
		window.addEventListener('scroll', this.handleScroll);
		// this.appendCompToBody(ContactUs)
	},
	destroyed() {
		// document.body.style.all = 'unset';
		// document.querySelector('#app').style.all = 'unset';
	},
	methods: {
		cancel() {
			delay(() => {
				document.body.classList.remove('body-overflow-auto');
			}, 300);
		},
		bodyStyle() {
			return {
				padding: 0
			};
		},
		popContactUs() {
			document.body.classList.add('body-overflow-auto');
			this.visible = true;
		},
		// 父级元素使用transform ... 子元素fixed会失效，需要手动挂载
		appendCompToBody(component) {
			var contactUs = new Vue({
				el: document.createElement('div'),
				render: h => h(component)
			});
			document.body.appendChild(contactUs.$el);
		},
		handleScroll() {
			let top = document.documentElement.scrollTop;
			if (top > (150 * window.innerWidth) / 1920) {
				this.show = true;
			} else if (top == 0) {
				this.show = false;
			}
		},
		enterSystem() {
			const permissionList = store.getters['user/VUEX_ST_USERAUTH'];
			const { auth } = store.getters['user/VUEX_ST_PERSONALLINFO'];
			const { companyUserList } = store.getters['user/VUEX_ST_PERSONALLINFO'];
			if (permissionList.includes('workbench')) {
				if (companyUserList?.length) {
					const { companyType } = companyUserList[0].company;
					if (companyType == 'CORE_COMPANY') {
						if (auth) {
							this.jumpPage('/center/workbench/myToDoList');
						} else {
							this.jumpPage('/center/account/person/info');
						}
					} else {
						this.jumpPage('/center/account/person/info');
					}
				}
			} else {
				this.jumpPage('/center/account/person/info');
			}
			// to="/center/workbench/myToDoList"
		},
		jumpPage(path) {
			this.$router.push(path);
		}
	}
};
</script>

<style scoped lang="less">
.header {
	width: 100%;
	min-width: 1200px;
	height: 150px;
	display: flex;
	justify-content: space-between;
	position: absolute;
	left: 0;
	top: 0;
	border-bottom: 1px solid #fff;
	z-index: 599;
	justify-content: space-between;
	padding: 27px 109px 24px 83px;

	.logo {
		width: 317px;
		height: 100px;
		img {
			width: 100%;
			height: 100%;
		}
		// background: url("../../../assets/imgs/home/logo.png") no-repeat;
		// background-size: cover;
	}

	.navigation {
		display: flex;
		margin-top: 60px;

		.nav-list {
			display: flex;
			font-size: 30px;
			font-weight: 400;
			margin-right: 129px;

			.nav-list-item {
				a {
					color: #ffffff;
				}

				margin-left: 62px;
			}
		}

		.user {
			display: flex;
			justify-content: right;

			.login,
			.register,
			.workbench {
				width: 107px;
				height: 38px;
				font-size: 24px;
				border: 2px solid #ffffff;
				text-align: center;
				line-height: 34px;
				border-radius: 18px;
				font-weight: 400;
				a {
					color: #ffffff;
				}
				cursor: pointer;
			}

			.register,
			.workbench {
				margin-left: 13px;
				background: #ffffff;
				a {
					color: #595757;
				}
				&.workbench {
					padding: 0 15px;
					width: unset;
				}
			}
		}
	}
}

.white {
	background-color: #ffffff;
	position: fixed;
	top: 0;
	z-index: 899;
	left: 0;
	.logo {
		background-size: cover;
		img {
			content: url('../../../assets/imgs/home/logo-color.png');
		}
	}
	.navigation {
		.nav-list {
			.nav-list-item {
				a {
					color: #666666;
				}
			}
		}

		.user {
			.login,
			.register {
				border-color: #2f6eb4;
			}

			.login {
				a {
					color: #2f6eb4;
				}
			}

			.register {
				a {
					color: #ffffff;
				}
				background-color: #2f6eb4;
			}
		}
	}
}
/deep/ ::-webkit-scrollbar {
	background: 0 0;
	width: 0px;
	height: 0px;
}
/deep/ ::-webkit-scrollbar-thumb {
	background: #d7d7d7;
	border-radius: 0px;
	width: 0px;
	height: 0px;
}
</style>
