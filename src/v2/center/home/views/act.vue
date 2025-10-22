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
						@change="loadMore(1)"
					>
						<a-tab-pane
							key="1"
							tab="公司动态"
						>
							<div class="tab-1">
								<div class="top-box">
									<div
										class="top"
										v-for="item in topList"
										:key="item.id"
										@click="goDetail(item)"
									>
										<img
											:src="BASE_NET + item.thumbnailUrl || '../../../assets/imgs/home/home-banner.png'"
											:alt="item.title"
										/>
										<div class="title">
											{{ item.title }}
										</div>
										<div class="desc">
											{{ item.synopsis }}
										</div>
										<div class="detail">详情</div>
										<div class="time">
											{{ item.publishDate }}
										</div>
									</div>
								</div>
								<ul class="acts">
									<li
										v-for="item in otherList"
										:key="item.id"
										@click="goDetail(item)"
									>
										<img
											:src="BASE_NET + item.thumbnailUrl || '../../../assets/imgs/home/home-banner.png'"
											:alt="item.title"
										/>
										<div style="flex: 1">
											<div class="title">
												{{ item.title }}
											</div>
											<div class="desc">
												{{ item.synopsis }}
											</div>
											<div class="detail">
												<div class="time">{{ item.publishDate }}</div>
												<a
													href="javascript:;"
													@click="goDetail(item)"
												>
													了解详情>
												</a>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</a-tab-pane>
						<a-tab-pane
							key="2"
							tab="行业资讯"
						>
							<div class="tab-1">
								<div class="top-box">
									<div
										class="top"
										v-for="item in topList"
										:key="item.id"
										@click="goDetail(item)"
									>
										<img
											:src="BASE_NET + item.thumbnailUrl || '../../../assets/imgs/home/home-banner.png'"
											:alt="item.title"
										/>
										<div class="title">
											{{ item.title }}
										</div>
										<div class="desc">
											{{ item.synopsis }}
										</div>
										<div
											class="detail"
											@click="goDetail(item)"
										>
											详情
										</div>
										<div class="time">
											{{ item.publishDate }}
										</div>
									</div>
								</div>
								<ul class="acts">
									<li
										v-for="item in otherList"
										:key="item.id"
										@click="goDetail(item)"
									>
										<img
											:src="BASE_NET + item.thumbnailUrl || '../../../assets/imgs/home/home-banner.png'"
											:alt="item.title"
										/>
										<div style="flex: 1">
											<div class="title">
												{{ item.title }}
											</div>
											<div class="desc">
												{{ item.synopsis }}
											</div>
											<div class="detail">
												<div class="time">{{ item.publishDate }}</div>
												<a href="javascript:;"> 了解详情> </a>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</a-tab-pane>
					</a-tabs>
					<a-pagination
						size="small"
						v-model="pageNo"
						:total="total"
						:pageSize="7"
						@change="loadMore"
					/>
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
import { API_HOMEPAGEDYNAMICQUERYCONFIG } from '@/api/home';
import { pageResize, unset, cancelUnset } from '@/v2/center/home/lib/rem';
import ENV from '@/api/env.js';
import keywords from '@/config/keywords';

export default {
	metaInfo: {
		...keywords.act
	},
	name: 'Act.vue',
	data() {
		return {
			activeTab: this.$route.query.tab || '1',
			topList: [],
			otherList: [],
			pageNo: 1,
			total: null,
			BASE_NET: ENV.BASE_NET
		};
	},
	destroyed() {
		cancelUnset();
	},
	mounted() {
		pageResize(document.querySelector('#act'));
		this.getCompanyDynamicList();
	},
	components: {
		Header,
		Footer
	},
	methods: {
		getCompanyDynamicList() {
			API_HOMEPAGEDYNAMICQUERYCONFIG({
				pageSize: 7,
				pageNo: this.pageNo,
				category: this.activeTab == 1 ? 'COMPANY_NEWS' : 'INDUSTRY_NEWS'
			}).then(res => {
				if (res.success) {
					this.topList = res.data.records.slice(0, 3);
					this.otherList = res.data.records.slice(3, 7);
					this.total = res.data.total;
				}
			});
		},
		loadMore(e) {
			this.pageNo = e;
			this.getCompanyDynamicList();
		},
		goDetail(item) {
			if (item.originalFlag == 1) {
				window.open(item.linkAddress, '_blank');
			} else {
				this.$router.push(`/article?id=${item.id}&tab=${this.activeTab}`);
			}
		}
	}
};
</script>

<style scoped lang="less">
#act {
	padding-top: 150px;
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
			padding-bottom: 62px;
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
		.tab-1 {
			.top-box {
				padding: 41px 196px 0;
				display: flex;
				img {
					height: 280px;
					width: 100%;
					margin-bottom: 39px;
					cursor: pointer;
				}
				.top {
					width: 32%;
					height: 660px;
					margin-right: 24px;
					background: #ffffff;
					box-shadow: 0px 5px 30px 0px rgba(200, 200, 200, 0.5);
					border-radius: 10px;
					margin-bottom: 80px;
					.title {
						font-weight: 400;
						color: #151515;
						height: 70px;
						font-size: 30px;
						line-height: 35px;
						padding: 0 24px;
						margin-bottom: 24px;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 100%;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						word-break: break-all;
						cursor: pointer;
					}
					.desc {
						font-size: 24px;
						padding: 0 24px;
						font-weight: 300;
						margin-bottom: 24px;
						overflow: hidden;
						text-overflow: ellipsis;
						height: 108px;
						line-height: 36px;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						word-break: break-all;
						cursor: pointer;
					}
					.detail {
						width: 150px;
						height: 44px;
						background: #2f6eb4;
						border-radius: 22px;
						text-align: center;
						line-height: 44px;
						color: #ffffff;
						font-size: 20px;
						margin: 0 auto 18px;
						cursor: pointer;
					}
					.time {
						text-align: center;
						font-size: 18px;
						font-weight: 400;
						color: #818181;
					}
				}
			}
			.acts {
				padding: 0 160px;
				li {
					//height: 240px;
					display: flex;
					padding-bottom: 40px;
					margin-bottom: 40px;
					border-bottom: 1px solid rgba(123, 123, 123, 0.5);
					&:last-child {
						border: none;
					}
					img {
						width: 326px;
						height: 240px;
						margin-right: 48px;
						cursor: pointer;
					}
					.title {
						height: 64px;
						font-size: 32px;
						font-weight: 400;
						color: #000000;
						line-height: 32px;
						margin-top: 12px;
						cursor: pointer;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.desc {
						height: 60px;
						font-size: 24px;
						font-weight: 300;
						color: #878787;
						line-height: 36px;
						margin-bottom: 68px;
						cursor: pointer;
					}
					.detail {
						display: flex;
						justify-content: space-between;
						.time {
							height: 14px;
							font-size: 18px;
							font-family: MicrosoftYaHei;
							font-weight: 400;
							color: #818181;
						}
					}
				}
			}
		}
	}
}
</style>
