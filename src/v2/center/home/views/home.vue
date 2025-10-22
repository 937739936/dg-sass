<template>
	<div style="height: 100%">
		<!--    头部-->
		<Header class="white"></Header>
		<div id="home">
			<!--    内容-->
			<div id="container">
				<div class="banner"></div>
				<div class="tabs">
					<a-tabs :default-active-key="$route.query.tab || '1'">
						<a-tab-pane
							key="1"
							tab="公司简介"
						>
							<div class="tab-1">
								<!-- <video
									controls="controls"
									src="https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com/video/MG1%2B2.mp4"
									muted
									autoplay
									loop
									preload="auto"
									style="width: 1112px; margin-bottom: 60px"
									v-if="!isMobile"
								></video> -->
								<img
									src="../../../assets/imgs/home/zjsl_video_poster.png"
									alt=""
									style="width: 1112px; margin-bottom: 60px"
								/>
								<p>数链科技由具有资深大宗商品行业背景、金融背景、科技背景的高级管理人员发起，2021年1月正式成立。</p>
								<p>
									致力于用人工智能、大数据、云计算、区块链等科技手段，实现大宗商品实时交易数字化。将交易流程“数据信用”，交易标的“物的信用”，与核心企业的“主体信用”相结合，打破大宗商品领域核心企业资金瓶颈，解决中小贸易商“融资难、融资贵”的痛点，实现金融机构资金直达以往不能覆盖的资产。
								</p>
								<img
									src="../../../assets/imgs/home/home-tab1-logo.png"
									alt="数链科技致力于用人工智能、大数据、云计算、区块链等科技手段，实现大宗商品实时交易数字化。将交易流程“数据信用”，交易标的“物的信用”，与核心企业的“主体信用”相结合，打破大宗商品领域核心企业资金瓶颈，解决中小贸易商“融资难、融资贵”的痛点，实现金融机构资金直达以往不能覆盖的资产。"
									class="logo"
								/>
							</div>
						</a-tab-pane>
						<a-tab-pane
							key="2"
							tab="企业愿景"
						>
							<div class="tab-2">
								<div class="desc">打造全球领先的</div>
								<div class="desc">大宗商品供应链数字化服务平台</div>
							</div>
						</a-tab-pane>
						<a-tab-pane
							key="3"
							tab="企业使命"
						>
							<div class="tab-3">
								<p>我们为服务大宗商品生态企业而生，普惠是我们的理念。</p>
								<p>我们通过科技应用赋能大宗商品供应链，推动大宗行业和金融机构实现产业数字化和资产数字化场景应用的创新。</p>
								<p>
									我们相信我们的服务让大宗商品交易更透明，让虚假贸易无处遁形，让金融机构触达之前不能覆盖的客户，让中小企业融资更高效、成本更低。
								</p>
							</div>
						</a-tab-pane>
						<a-tab-pane
							key="4"
							tab="发展历程"
						>
							<div class="tab-4"></div>
						</a-tab-pane>
					</a-tabs>
				</div>
			</div>
			<!--    底部-->
			<Footer></Footer>
		</div>
	</div>
</template>

<script>
import Header from '../components/Header';
import Footer from '../components/Footer';
import { pageResize, unset, cancelUnset } from '@/v2/center/home/lib/rem';
import keywords from '@/config/keywords';

export default {
	metaInfo: {
		...keywords.home
	},
	name: 'Home.vue',
	data() {
		let isMobile = navigator.userAgent.includes('Mobile');
		return {
			isMobile
		};
	},
	components: {
		Header,
		Footer
	},

	destroyed() {
		cancelUnset();
	},
	mounted() {
		pageResize(document.querySelector('#home'));
	}
};
</script>

<style scoped lang="less">
#home {
	padding-top: 150px;
	height: 1px;
}
#container {
	.banner {
		width: 100%;
		height: 515px;
		background: url('../../../assets/imgs/home/home-banner.png') no-repeat;
		background-size: cover;
	}

	::v-deep .tabs {
		.ant-tabs-nav {
			& > div {
				margin: 0 auto;
				color: #868686;
				font-size: 28px;
			}
		}

		.ant-tabs-tab-active {
			color: #2f6eb4;
			border-bottom: 6px solid #4d6ba2;
		}

		.ant-tabs-ink-bar {
			display: none !important;
		}

		.ant-tabs-tab {
			padding: 24px 0px;
			margin-right: 190px;

			&:last-child {
				margin-right: 0;
			}
		}

		.ant-tabs-bar {
			margin-bottom: 0;
		}
	}

	.tabs {
		position: relative;
		background-color: #ffffff;

		.tab-1 {
			height: 1700px;
			width: 100%;
			background: url('../../../assets/imgs/home/home-tab1-bg.png') no-repeat 100%;
			background-size: cover;
			padding-top: 60px;
			padding-left: 282px;

			p {
				font-weight: 300;
				width: 1112px;
				color: #595757;
				line-height: 56px;
				font-size: 30px;
				margin-bottom: 48px;
			}

			.logo {
				width: 466px;
				height: 147px;
				margin-top: 129px;
			}
		}

		.tab-2 {
			height: 1073px;
			width: 100%;
			background: url('../../../assets/imgs/home/home-tab2-bg.png') no-repeat 100%;
			background-size: cover;
			padding-top: 270px;

			.desc {
				text-align: center;
				font-size: 64px;
				font-weight: bold;
				color: #2f6eb4;
				line-height: 81px;
				margin-bottom: 34px;
			}
		}

		.tab-3 {
			height: 1500px;
			width: 100%;
			background: url('../../../assets/imgs/home/home-tab3-bg.png') no-repeat 100%;
			background-size: cover;
			padding-left: 290px;
			padding-top: 173px;

			p {
				font-weight: 300;
				width: 1332px;
				color: #595757;
				line-height: 56px;
				font-size: 32px;
				margin-bottom: 48px;
			}
		}

		.tab-4 {
			height: 1500px;
			width: 100%;
			background: url('../../../assets/imgs/home/home-tab4-bg.png') no-repeat 100%;
			background-size: cover;
		}
	}
}
</style>
