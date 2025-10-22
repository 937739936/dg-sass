<template>
	<div style="height: 100%">
		<!--    头部-->
		<Header></Header>
		<div id="join">
			<!--    内容-->
			<div id="container">
				<div class="banner"></div>
				<div class="tabs">
					<a-tabs default-active-key="1">
						<a-tab-pane
							key="1"
							tab="校园招聘"
						>
							<div class="tab">
								<ul class="job-list">
									<li class="job-item">
										<div class="title">
											<div>
												<span class="serial">1</span>
												<span>大宗商品大客户经理</span>
											</div>
											<div
												class="detail"
												@click="detailJob(1)"
											>
												{{ activeJob == 1 ? '收起' : '详情' }}
												<a-icon
													type="up"
													v-if="activeJob == 1"
												/>
												<a-icon
													type="down"
													v-else
												/>
											</div>
										</div>
										<div
											class="describe"
											v-if="activeJob == 1"
										>
											<p class="subtitle">岗位职责</p>
											<p class="desc">
												1、负责区域内大宗供应链资产开发及客户维护，推进资产和资金匹配。 <br />
												2、负责推广公司产品并收集客户反馈，协助产研团队对公司产品进行优化。<br />
												3、深入探索新的大宗商品供应链场景应用的创新，协助搭建产品体系。<br />
												业务区域覆盖河南河北、山西陕西、宁夏内蒙、湖南湖北、川渝云贵等省市，常驻地有丰富可选空间。
											</p>
											<a
												class="join-btn"
												href="mailto:hr@shdatalink.com"
											>
												hr@shdatalink.com
											</a>
										</div>
									</li>
									<li class="job-item">
										<div class="title">
											<div>
												<span class="serial">2</span>
												<span>产品经理</span>
											</div>
											<div
												class="detail"
												@click="detailJob(2)"
											>
												{{ activeJob == 2 ? '收起' : '详情' }}
												<a-icon
													type="up"
													v-if="activeJob == 2"
												/>
												<a-icon
													type="down"
													v-else
												/>
											</div>
										</div>
										<div
											class="describe"
											v-if="activeJob == 2"
										>
											<p class="subtitle">岗位职责</p>
											<p class="desc">
												1、需求收集与分析，深入思考业务需求本质，抽象用户需求 <br />
												2、将需求转化为高品质的产品设计或解决方案，输出PRD和原型图 <br />
												3、跨部门沟通协作，紧跟业务发展变化，将产品流程落地，提升管理效率 <br />
											</p>
											<a
												class="join-btn"
												href="mailto:hr@shdatalink.com"
											>
												hr@shdatalink.com
											</a>
										</div>
									</li>
									<li class="job-item">
										<div class="title">
											<div>
												<span class="serial">3</span>
												<span>财务岗</span>
											</div>
											<div
												class="detail"
												@click="detailJob(3)"
											>
												{{ activeJob == 3 ? '收起' : '详情' }}
												<a-icon
													type="up"
													v-if="activeJob == 3"
												/>
												<a-icon
													type="down"
													v-else
												/>
											</div>
										</div>
										<div
											class="describe"
											v-if="activeJob == 3"
										>
											<p class="subtitle">岗位职责：</p>
											<p class="desc">
												1、参与账务处理工作，编制、汇总财务报表并及时上报 <br />
												2、及时汇报企业经营状况、财务收支及各项财务计划的具体执行情况 <br />
												3、协助进行企业成本管理工作，包括成本预测、控制、核算、分析等 <br />
											</p>
											<a
												class="join-btn"
												href="mailto:hr@shdatalink.com"
											>
												hr@shdatalink.com
											</a>
										</div>
									</li>
								</ul>
							</div>
						</a-tab-pane>
						<!--          <a-tab-pane key="2" tab="校园招聘">-->
						<!--          </a-tab-pane>-->
						<!--          <a-tab-pane key="3" tab="岗位发布">-->
						<!--          </a-tab-pane>-->
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
		...keywords.join
	},
	name: 'Case.vue',
	data() {
		return {
			activeJob: null
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
		pageResize(document.querySelector('#join'));
	},
	methods: {
		detailJob(key) {
			this.activeJob = this.activeJob == key ? null : key;
		}
	}
};
</script>

<style scoped lang="less">
body {
	min-width: unset;
}
#join {
	position: relative;
	height: 1px;
}
#container {
	.banner {
		width: 100%;
		height: 617px;
		background: url('../../../assets/imgs/home/join-banner.png') no-repeat;
		background-size: cover;
		position: relative;
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
		.tab {
			padding: 99px 192px 72px;
			width: 100%;
			li {
				.title {
					height: 100px;
					line-height: 100px;
					background: #f2f2f2;
					font-weight: 400;
					color: #333333;
					display: flex;
					font-size: 36px;
					justify-content: space-between;
					padding: 0 27px 0 34px;
					margin-bottom: 30px;
				}
				.serial {
					width: 50px;
					display: inline-block;
					height: 50px;
					background: #2f6eb4;
					border-radius: 50%;
					text-align: center;
					line-height: 50px;
					color: #ffffff;
					font-weight: 400;
					font-size: 30px;
					margin-right: 23px;
					vertical-align: middle;
				}
				.detail {
					font-size: 26px;
					font-weight: 400;
					color: #2f6eb4;
					line-height: 100px;
					margin-right: 20px;
					cursor: pointer;
				}
				.describe {
					padding: 64px 108px 91px;
					.subtitle {
						height: 34px;
						font-size: 36px;
						font-weight: 400;
						color: #232323;
						line-height: 49px;
						margin-bottom: 41px;
					}
					.desc {
						font-size: 28px;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #575757;
						line-height: 56px;
					}
					.join-btn {
						display: inline-block;
						padding: 23px 39px;
						font-size: 36px;
						font-weight: 400;
						color: #ffffff;
						background: #2f6eb4;
						border-radius: 40px;
						margin-top: 83px;
						margin-bottom: 91px;
					}
				}
			}
		}
	}
}
</style>
