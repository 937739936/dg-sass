<template>
	<div id="footer">
		<div class="info">
			<router-link to="/">
				<div class="logo"></div>
			</router-link>
			<div class="nav-list">
				<div
					class="nav-item"
					v-for="(item, index) in navList"
					:key="`${item.url}_${index}`"
				>
					<div class="title">
						<router-link :to="item.url">
							{{ item.name }}
						</router-link>
					</div>
					<ul>
						<li
							v-for="(i, ind) in item.children"
							:key="`${i.url}_${index}_${ind}`"
							class="nav-item-child"
						>
							<a
								:to="i.url"
								@click="footerMenu(i.url)"
							>
								{{ i.name }}
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="qr">
				<ul>
					<li>
						<div class="qr-code">
							<img
								src="../../../assets/imgs/home/wx-qr.png"
								alt=""
							/>
						</div>
						<div class="icon">
							<img
								src="../../../assets/imgs/home/wx-icon.png"
								alt=""
							/>
						</div>
						<div class="desc">数联智汇公众号</div>
					</li>
					<li>
						<div class="qr-code">
							<img
								src="../../../assets/imgs/home/xn-qr.png"
								alt=""
							/>
						</div>
						<div
							class="icon"
							style="width: 43px; height: 43px"
						>
							<img
								src="../../../assets/imgs/home/xn-icon.png"
								alt=""
							/>
						</div>
						<div class="desc">数链小牛助手</div>
					</li>
					<li>
						<div class="qr-code">
							<img
								src="../../../assets/imgs/home/qq-qr.png"
								alt=""
							/>
						</div>
						<div
							class="icon"
							style="width: 36px; height: 40px"
						>
							<img
								src="../../../assets/imgs/home/qq-icon.png"
								alt=""
							/>
						</div>
						<div class="desc">数链QQ客服</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="cooperation">
			<ul class="cooperation-list">
				<li
					v-for="(item, index) in linkList"
					:key="`${item.websiteLink}_${index}`"
					class="cooperation-list-item"
				>
					<a
						:href="item.websiteLink"
						target="_blank"
					>
						{{ item.websiteName }}
					</a>
				</li>
			</ul>
			<FooterText />
		</div>
	</div>
</template>

<script>
import { GET_LINK_LIST } from '@/api/home';
import FooterText from './FooterText.vue';
import reportCode from '@/v2/config/reportCode';

let navList = [
	{
		name: '走进数链',
		url: '/home',
		children: [
			{
				name: '企业简介',
				url: '/home'
			},
			{
				name: '企业愿景',
				url: '/home?tab=2'
			},
			{
				name: '企业使命',
				url: '/home?tab=3'
			},
			{
				name: '发展历程',
				url: '/home?tab=4'
			}
		]
	},
	{
		name: '企业动态',
		url: '/act',
		children: [
			{
				name: '公司动态',
				url: '/act?tab=1'
			},
			{
				name: '行业资讯',
				url: '/act?tab=2'
			}
		]
	},
	{
		name: '解决方案',
		url: '/solution',
		children: [
			{
				name: '核心企业',
				url: '/solution?tab=3'
			},
			{
				name: '金融机构',
				url: '/solution?tab=2'
			},
			{
				name: '中小企业',
				url: '/solution?tab=1'
			}
		]
	},
	{
		name: '经典案例',
		url: '/case',
		children: [
			{
				name: '金融机构案例',
				url: '/case?tab=1'
			},
			{
				name: '核心企业案例',
				url: '/case?tab=2'
			}
		]
	},
	{
		name: '支持与服务',
		url: '/join',
		children: [
			{
				name: '加入我们',
				url: '/join'
			},
			{
				name: '帮助中心',
				url: '/center/help'
			}
		]
	}
];
export default {
	name: 'Footer.vue',
	data() {
		return {
			linkList: [],
			navList,
			copyYear: new Date().getFullYear(),
			env: process.env.VUE_APP_BUILD_ENV
		};
	},
	components: {
		FooterText
	},
	mounted() {
		this.getListData();
	},
	watch: {
		$route(to, from) {
			// 路由发生变化页面刷新
			if (to.path === from.path) {
				window.location = to.fullPath;
			}
		}
	},
	methods: {
		footerMenu(url) {
			if (url === '/center/help') {
				const code = reportCode.helpCenter.entry;
				window.reportUtil.reportEvent(code, {});
			}
			this.$router.push(url);
		},
		getListData() {
			GET_LINK_LIST({}).then(res => {
				if (res.success) {
					this.linkList = res.result;
				}
			});
		}
	}
};
</script>

<style scoped lang="less">
#footer {
	width: 100%;
	min-width: 1200px;

	.info {
		padding: 70px 125px 54px 124px;
		background-color: rgb(32, 57, 98);
		height: 345px;
		display: flex;
		justify-content: space-between;

		.logo {
			width: 317px;
			height: 100px;
			background: url('../../../assets/imgs/home/logo.png') no-repeat;
			background-size: cover;
		}

		.nav-list {
			display: flex;

			.nav-item {
				margin-left: 56px;

				.title {
					margin-bottom: 24px;
					line-height: 35px;
					cursor: pointer;

					a {
						font-weight: 400;
						color: #ffffff;
						font-size: 28px;
					}
				}

				.nav-item-child {
					line-height: 41px;

					a {
						color: #ffffff;
						font-size: 22px;
						cursor: pointer;
					}
				}
			}
		}

		.qr {
			& > ul {
				display: flex;

				li {
					width: 120px;
					text-align: center;

					img {
						width: 100%;
						height: 100%;
					}

					.qr-code {
						width: 97px;
						height: 97px;
					}

					.icon {
						width: 51px;
						height: 44px;
						margin: 27px auto 13px;
					}

					.desc {
						height: 16px;
						line-height: 16px;
						font-weight: 400;
						font-size: 16px;
						color: #ffffff;
					}
				}
			}
		}
	}

	.cooperation {
		height: 145px;
		background-color: rgb(18, 33, 63);
		padding: 30px 208px 96px 199px;

		.cooperation-list {
			display: flex;
			justify-content: space-between;
			margin-bottom: 48px;

			a {
				color: rgba(255, 255, 255, 0.5);
			}
		}
		.reference {
			display: flex;
			justify-content: center;
			li {
				cursor: pointer;
				padding: 0 12px;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
}
</style>
