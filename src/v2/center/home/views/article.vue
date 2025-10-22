<template>
	<div style="height: 100%">
		<!--    头部-->
		<Header class="white"></Header>
		<div id="act">
			<!--    内容-->
			<div id="container">
				<div class="banner"></div>
				<div class="tabs">
					<a-tabs
						v-model="activeTab"
						@tabClick="tabClick"
					>
						<a-tab-pane
							key="1"
							tab="公司动态"
						>
						</a-tab-pane>
						<a-tab-pane
							key="2"
							tab="行业资讯"
						>
						</a-tab-pane>
					</a-tabs>
					<div class="content">
						<div class="breadcrumbs">
							<a @click="$router.push(`/act?tab=${$route.query.tab}`)"> <a-icon type="left" /> 返回列表 </a>
						</div>
						<div class="title">
							{{ article.title }}
						</div>
						<div class="time">
							{{ article.publishDate }}
						</div>
						<div
							class="article"
							v-html="article.content"
						></div>
					</div>
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
import { API_HOMEPAGEDYNAMICQUERYBYID } from '@/api/home';
import { pageResize, unset, cancelUnset } from '@/v2/center/home/lib/rem';

export default {
	name: 'article.vue',
	data() {
		return {
			activeTab: this.$route.query.tab || '1',
			topList: [],
			otherList: [],
			id: this.$route.query.id,
			article: {}
		};
	},
	destroyed() {
		cancelUnset();
	},
	mounted() {
		pageResize(document.querySelector('#act'));
		this.getDetail();
	},
	components: {
		Header,
		Footer
	},
	methods: {
		getDetail() {
			API_HOMEPAGEDYNAMICQUERYBYID({ id: this.id }).then(res => {
				if (res.success) {
					this.article = res.data;
					document.title = this.article.title;
				}
			});
		},
		tabClick(e) {
			this.$router.push(`/act?tab=${e}`);
		}
	}
};
</script>

<style scoped lang="less">
#act {
	height: 1px;
}
#container {
	.banner {
		width: 100%;
		height: 515px;
		background: url('../../../assets/imgs/home/act-banner.png') no-repeat;
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
		.ant-pagination {
			text-align: center;
			margin-bottom: 62px;
			li {
				margin: 0 12px;
			}
		}
		.ant-pagination-item-active {
			background-color: #4682f3;
			border: none;
			border-radius: 50%;
			a {
				color: #ffffff;
			}
		}
	}

	.tabs {
		position: relative;
		background-color: #ffffff;
		background: url('../../../assets/imgs/home/solution-tab3-bg.png') no-repeat;
		background-size: cover;
	}
}
.content {
	width: 1280px;
	margin: 0 auto;
	.breadcrumbs {
		font-size: 24px;
		font-weight: 400;
		color: #2f6eb4;
		line-height: 36px;
		margin-bottom: 51px;
		margin-top: 54px;
	}
	.title {
		height: 40px;
		font-size: 28px;
		text-align: center;
		font-weight: 500;
		color: #333333;
		line-height: 40px;
		margin-bottom: 35px;
	}
	.time {
		height: 22px;
		font-size: 14px;
		font-weight: 400;
		color: #8c929b;
		margin: 16px 0 54px 0;
		line-height: 22px;
		text-align: center;
	}
	.article {
		font-size: 16px;
		font-weight: 400;
		color: #27282d;
		line-height: 28px;
		padding-bottom: 100px;
		min-height: calc(100vh - 504px);
	}
}
</style>
