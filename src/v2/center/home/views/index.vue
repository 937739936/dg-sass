<template>
	<div style="height: 100%">
		<!--    scale下 fixed会降级-->
		<Header></Header>
		<div
			id="index"
			v-show="(isMobile && mobileShow) || !isMobile"
		>
			<!--    头部-->
			<!--    内容-->
			<div id="top-swiper">
				<swiper
					:options="swiperOption"
					ref="mySwiper"
				>
					<swiper-slide>
						<!-- <video
							x5-video-player-type="h5"
							webkit-playsinline="true"
							playsinline="true"
							poster="../../../assets/imgs/home/banner.jpg"
							:src="videoDomain + '/video/banner1.mp4'"
							muted
							autoplay
							loop
							preload="auto"
							v-if="!isMobile && !isTest"
						></video> -->
						<img
							class="swiper-slide"
							src="../../../assets/imgs/home/banner.jpg"
							alt=""
						/>
						<div class="tab-1 animate__animated animate__fadeIn">
							<div class="sub">大宗商品供应链数字化服务平台</div>
							<div class="describe">
								——依托大宗商品实时交易数字化，构建可信的数字资产，<br />
								实现资产和资金的精准对接
							</div>
						</div>
					</swiper-slide>
					<swiper-slide>
						<!-- <video
							x5-video-player-type="h5"
							webkit-playsinline="true"
							playsinline="true"
							@click="goHuawei"
							style="cursor: pointer"
							poster="@/v2/assets/imgs/home/banner-huawei.png"
							:src="videoDomain + '/video/video-huawei.mp4'"
							muted
							autoplay
							loop
							preload="auto"
							v-if="!isMobile && !isTest"
						></video> -->
						<img
							class="swiper-slide"
							style="cursor: pointer"
							@click="goHuawei"
							src="@/v2/assets/imgs/home/banner-huawei.png"
							alt=""
						/>
					</swiper-slide>
					<swiper-slide>
						<!-- <video
							x5-video-player-type="h5"
							webkit-playsinline="true"
							playsinline="true"
							@click="goBaidu"
							style="cursor: pointer"
							poster="@/v2/assets/imgs/home/banner-baidu.png"
							:src="videoDomain + '/video/banner-baidu.mp4'"
							muted
							autoplay
							loop
							preload="auto"
							v-if="!isMobile && !isTest"
						></video> -->
						<img
							class="swiper-slide"
							style="cursor: pointer"
							@click="goBaidu"
							src="@/v2/assets/imgs/home/banner-baidu.png"
							alt=""
						/>
					</swiper-slide>
					<swiper-slide>
						<!-- <video
							x5-video-player-type="h5"
							webkit-playsinline="true"
							playsinline="true"
							poster="../../../assets/imgs/home/banner2.jpg"
							:src="videoDomain + '/video/banner2.mp4'"
							muted
							autoplay
							loop
							preload="auto"
							v-if="!isMobile && !isTest"
						></video> -->
						<img
							class="swiper-slide"
							src="../../../assets/imgs/home/banner2.jpg"
							alt=""
						/>
						<div
							class="tab-1 animate__animated animate__fadeIn"
							v-if="showSection == 3"
						>
							<div class="sub">中小企业解决方案</div>
							<div class="describe">——让普惠金融惠及每一家企业</div>
						</div>
					</swiper-slide>
					<swiper-slide>
						<!-- <video
							x5-video-player-type="h5"
							webkit-playsinline="true"
							playsinline="true"
							poster="../../../assets/imgs/home/banner3.jpg"
							:src="videoDomain + '/video/banner3.mp4'"
							muted
							autoplay
							loop
							preload="auto"
							v-if="!isMobile && !isTest"
						></video> -->
						<img
							class="swiper-slide"
							src="../../../assets/imgs/home/banner3.jpg"
							alt=""
						/>
						<div
							class="tab-1 animate__animated animate__fadeIn"
							v-if="showSection == 4"
						>
							<div class="sub">金融机构解决方案</div>
							<div class="describe">——让普惠金融无忧进入大宗领域</div>
						</div>
					</swiper-slide>
					<swiper-slide>
						<!-- <video
							x5-video-player-type="h5"
							webkit-playsinline="true"
							playsinline="true"
							poster="../../../assets/imgs/home/banner4.jpg"
							:src="videoDomain + '/video/banner4.mp4'"
							muted
							autoplay
							loop
							preload="auto"
							v-if="!isMobile && !isTest"
						></video> -->
						<img
							class="swiper-slide"
							src="../../../assets/imgs/home/banner4.jpg"
							alt=""
						/>

						<div
							class="tab-1 animate__animated animate__fadeIn"
							v-if="showSection == 5"
						>
							<div class="sub">核心企业解决方案</div>
							<div class="describe">——让产业数字化为核心企业保驾护航</div>
						</div>
					</swiper-slide>
					<div
						class="swiper-pagination"
						slot="pagination"
					></div>
					<div
						class="swiper-button-prev"
						slot="button-prev"
					>
						<a-icon type="left" />
					</div>
					<div
						class="swiper-button-next"
						slot="button-next"
					>
						<a-icon type="right" />
					</div>
				</swiper>
				<div class="act">
					<div class="act-one">
						<router-link to="/act">
							<span class="act-icon">公司动态</span>
						</router-link>
						<ul
							class="act-list"
							v-if="actList.length"
						>
							<swiper
								:options="swiperOption2"
								ref="mySwiper2"
								style="height: 100%"
							>
								<swiper-slide
									v-for="item in actList"
									:key="item.id"
									style="height: 100%"
								>
									<li>
										<span @click="actDetail(item)">{{ item.title }}</span>
									</li>
								</swiper-slide>
							</swiper>
						</ul>
					</div>
				</div>
			</div>
			<div class="solution">
				<div class="title">解决方案</div>
				<div class="subtitle">Solution</div>
				<ul>
					<li>
						<img
							:src="faceCore"
							:alt="keywords.imgDesc.faceCore"
							srcset=""
						/>
						<div class="jrjg">面向核心企业</div>
						<div class="fade-in">
							<div class="jrjg-des">数字化升级 <br />资产数字化整理 <br />BI管理驾驶舱 <br />智慧仓储</div>
							<router-link to="/solution3">
								<div class="button">了解更多</div>
							</router-link>
							<div class="phjr">盘活供应链 <br />改善现金流 <br />数智化转型</div>
						</div>
					</li>
					<li>
						<img
							:src="faceFinancial"
							:alt="keywords.imgDesc.faceFinancial"
							srcset=""
						/>
						<div class="jrjg">面向金融机构</div>
						<div class="fade-in">
							<div class="jrjg-des">
								金融机构云资产平台 <br />
								金融机构云风控服务
							</div>
							<router-link to="/solution2">
								<div class="button">了解更多</div>
							</router-link>
							<div class="phjr">
								普惠金融升级 <br />
								增强产业风控 <br />
								提升资产对接效率 <br />
							</div>
						</div>
					</li>
					<li>
						<img
							:src="faceEnterprises"
							:alt="keywords.imgDesc.faceEnterprises"
							srcset=""
						/>
						<div class="jrjg">面向中小企业</div>
						<div class="fade-in">
							<div class="jrjg-des">数链e付 <br />数链e货 <br />数链e采</div>
							<router-link to="/solution">
								<div class="button">了解更多</div>
							</router-link>
							<div class="phjr">
								成本低廉 <br />
								迅速放款 <br />
								流程高效 <br />
								手续简便
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div
				class="performance"
				v-if="performanceObj.cooperationCompanyNum"
			>
				<ul>
					<li>
						<div class="num">
							<countTo
								:startVal="0"
								:endVal="performanceObj.cooperationCompanyNum"
								:duration="2700"
							></countTo>
						</div>
						<div class="desc">中小企业合作数</div>
					</li>
					<li>
						<div class="num">
							<countTo
								:startVal="0"
								:endVal="performanceObj.cooperationBankNum"
								:duration="3500"
							></countTo>
						</div>
						<div class="desc">金融机构合作数</div>
					</li>
					<li>
						<div class="num">
							<countTo
								:startVal="0"
								:endVal="performanceObj.cooperationCoreCompanyNum"
								:duration="3500"
							></countTo>
						</div>
						<div class="desc">核心企业合作数</div>
					</li>
					<li>
						<div class="num">
							<countTo
								:startVal="0"
								:endVal="performanceObj.averageDailyLoanNum"
								:duration="3000"
							></countTo>
						</div>
						<div class="desc">日均放款笔数</div>
					</li>
					<li>
						<div class="num">
							<countTo
								:startVal="0"
								:endVal="performanceObj.averageDailyLoanAmountNew"
								:duration="2500"
								:decimals="2"
							></countTo>
							<span class="unit">{{ performanceObj.averageDailyLoanAmountUnit }}元</span>
						</div>
						<div class="desc">日均放款金额</div>
					</li>
					<li>
						<div class="num">
							<countTo
								:startVal="0"
								:endVal="performanceObj.cumulativeFinancingAmountNew"
								:duration="2500"
								:decimals="2"
							></countTo>
							<span class="unit">{{ performanceObj.cumulativeFinancingAmountUnit }}元</span>
						</div>
						<div class="desc">累计为中小企业融资金额</div>
					</li>
				</ul>
				<div class="time">截至{{ date }}</div>
			</div>
			<div class="cooperation">
				<div class="title">合作伙伴</div>
				<div class="subtitle">Cooperative Partners</div>
				<div class="tabs">
					<template v-if="isMobile">
						<div class="tab-title">
							<a
								@click.prevent="onTabChange('jrjk')"
								:class="[tabKey == 'jrjk' ? 'active' : '']"
								>金融机构</a
							>
							<a
								@click.prevent="onTabChange('hxqy')"
								:class="[tabKey == 'hxqy' ? 'active' : '']"
								>核心企业</a
							>
						</div>
						<div>
							<img
								v-show="tabKey == 'jrjk'"
								src="../../../assets/imgs/home/index-cooperation-list.png"
								alt="金融机构"
								style="width: 100%"
							/>
							<img
								v-show="tabKey == 'hxqy'"
								src="../../../assets/imgs/home/index-cooperation-list-2.png"
								alt="核心企业"
								style="width: 100%"
							/>
						</div>
					</template>
					<a-tabs
						default-active-key="1"
						v-else
					>
						<a-tab-pane
							key="1"
							tab="金融机构"
							:forceRender="true"
						>
							<div>
								<img
									src="../../../assets/imgs/home/index-cooperation-list.png"
									alt="金融机构"
									style="width: 100%"
								/>
							</div>
						</a-tab-pane>
						<a-tab-pane
							key="2"
							tab="核心企业"
							:forceRender="true"
						>
							<div>
								<img
									src="../../../assets/imgs/home/index-cooperation-list-2.png"
									alt="核心企业"
									style="width: 100%"
								/>
							</div>
						</a-tab-pane>
					</a-tabs>
					<div class="desc">（ 企业排名不分先后 ）</div>
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
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import countTo from 'vue-count-to';
import 'swiper/dist/css/swiper.css';
import 'animate.css';
import { pageResize, unset, cancelUnset } from '@/v2/center/home/lib/rem';
import moment from 'moment';
import { API_HOMEPAGEDYNAMICQUERYCONFIG, API_HOMEPAGEDYNAMICQUERYSTATISTICS } from '@/api/home';
import keywords from '@/config/keywords';

export default {
	metaInfo: {
		...keywords.index
	},
	name: 'index.vue',
	data() {
		let that = this;
		let isMobile = navigator.userAgent.includes('Mobile');
		return {
			videoDomain: 'https://shdatalink.oss-cn-zhangjiakou.aliyuncs.com',
			isTest: !location.origin.includes('www.shdatalink.com'),
			keywords,
			showSection: -1,
			date: moment().format('YYYY年MM月DD日'),
			act: {},
			show: false,
			actList: [],
			swiperOption: {
				loop: !isMobile,
				speed: 500,
				initialSlide: 0,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				autoplay: {
					delay: 5000,
					stopOnLastSlide: false,
					disableOnInteraction: false
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				},
				on: {
					init: function () {
						that.showSection = this.realIndex;
					},
					slideChange: function () {
						that.showSection = this.realIndex;
					}
				}
			},
			swiperOption2: {
				loop: true,
				direction: 'vertical',
				autoplay: {
					delay: 3000,
					stopOnLastSlide: false,
					disableOnInteraction: false
				}
			},
			performanceObj: {},
			faceCore: require('../../../assets/imgs/home/index-solution-item-1.png'),
			faceFinancial: require('../../../assets/imgs/home/index-solution-item-2.png'),
			faceEnterprises: require('../../../assets/imgs/home/index-solution-item-3.png'),
			//
			isMobile,
			mobileShow: false,
			tabKey: 'jrjk'
		};
	},
	created() {},
	mounted() {
		this.imgload();
		this.getCompanyDynamicList();
		this.getStastics();
		window.addEventListener('scroll', this.handleScr);
		// const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
		// this.show = flag

		pageResize(document.querySelector('#index'));
	},
	destroyed() {
		cancelUnset();
		window.removeEventListener('scroll', this.handleScr);
	},
	components: {
		Header,
		Footer,
		swiper,
		swiperSlide,
		countTo
	},
	methods: {
		onTabChange(key) {
			this.tabKey = key;
		},
		goBaidu() {
			window.open('/article/?id=133&tab=1');
		},
		goHuawei() {
			window.open('/article/?id=130&tab=1');
		},
		imgload() {
			if (this.isMobile) {
				let img = document.createElement('img');
				img.onload = function () {
					this.mobileShow = true;
				};
				img.src = require('../../../assets/imgs/home/banner.jpg');
			}
		},
		getCompanyDynamicList() {
			API_HOMEPAGEDYNAMICQUERYCONFIG({
				pageSize: 5,
				pageNo: 1,
				category: 'COMPANY_NEWS'
			}).then(res => {
				if (res.success) {
					this.actList = res.data.records;
				}
			});
		},
		getStastics() {
			API_HOMEPAGEDYNAMICQUERYSTATISTICS().then(res => {
				if (res.success) {
					this.performanceObj = res.data;
					this.performanceObj.averageDailyLoanAmount = this.unit(this.performanceObj.averageDailyLoanAmount || 0);
					this.performanceObj.cumulativeFinancingAmount = this.unit(this.performanceObj.cumulativeFinancingAmount || 0);
					if (typeof this.performanceObj.averageDailyLoanAmount === 'string') {
						if (
							this.performanceObj.averageDailyLoanAmount.includes('万') ||
							this.performanceObj.averageDailyLoanAmount.includes('亿')
						) {
							this.performanceObj.averageDailyLoanAmountUnit =
								this.performanceObj.averageDailyLoanAmount[this.performanceObj.averageDailyLoanAmount.length - 1];
							this.performanceObj.averageDailyLoanAmountNew = Number(this.performanceObj.averageDailyLoanAmount.slice(0, -1));
						}
					} else {
						this.performanceObj.averageDailyLoanAmountNew = this.performanceObj.averageDailyLoanAmount;
					}
					if (typeof this.performanceObj.cumulativeFinancingAmount === 'string') {
						if (
							this.performanceObj.cumulativeFinancingAmount.includes('万') ||
							this.performanceObj.cumulativeFinancingAmount.includes('亿')
						) {
							this.performanceObj.cumulativeFinancingAmountUnit =
								this.performanceObj.cumulativeFinancingAmount[this.performanceObj.cumulativeFinancingAmount.length - 1];
							this.performanceObj.cumulativeFinancingAmountNew = Number(
								this.performanceObj.cumulativeFinancingAmount.slice(0, -1)
							);
						}
					} else {
						this.performanceObj.cumulativeFinancingAmountNew = this.performanceObj.cumulativeFinancingAmount;
					}
				}
			});
		},
		actDetail(item) {
			if (item.originalFlag == 1) {
				window.open(item.linkAddress);
			} else {
				let tab = item.category == 'COMPANY_NEWS' ? 1 : 2;
				this.$router.push(`/article?id=${item.id}&tab=${tab}`);
			}
		},
		handleScr() {
			let top = document.documentElement.scrollTop;
			let h = document.querySelector('.solution').offsetHeight + document.querySelector('#top-swiper').offsetHeight + 120;
			if (top > (window.innerWidth / 1920) * h - window.innerHeight) {
				this.show = true;
			}
		},
		//单位换算
		unit(sum) {
			if (sum) {
				if (Number(sum) > 100000000) {
					return Math.round(Number(sum) / 1000000) / 100 + '亿';
				} else if (Number(sum) > 10000) {
					return Math.round(Number(sum) / 100) / 100 + '万';
				} else {
					return Math.round(Number(sum) * 100) / 100;
				}
			} else {
				return '0';
			}
		}
	}
};
</script>

<style scoped lang="less">
#index {
	height: 1px;
}
/deep/ ::-webkit-scrollbar {
	width: 0 !important;
	height: 0 !important;
}
/deep/ ::-webkit-scrollbar-thumb {
	width: 0 !important;
	height: 0 !important;
}
#top-swiper {
	position: relative;
	width: 100%;
	video {
		width: 100%;
		height: 100%;
	}
	.swiper-slide {
		display: inherit;
		width: 100%;
		height: 100%;
	}
	.act {
		padding: 0 120px;
		position: absolute;
		width: 100%;
		bottom: 36px;
		left: 0;
		z-index: 333;
		.act-one {
			padding: 0 29px;
			border: 3px solid #ffffff;
			border-radius: 39px;
			box-sizing: border-box;
			background-color: rgba(255, 255, 255, 0.8);
			font-size: 28px;
			font-weight: 400;
			color: #595757;
			display: flex;
			.act-list {
				height: 86px;
				li {
					height: 86px;
					line-height: 83px;
				}
			}
			span {
				cursor: pointer;
				vertical-align: middle;
			}
			.act-icon {
				width: 171px;
				height: 43px;
				background: #597cb0;
				border: 1px solid #597cb0;
				border-radius: 22px;
				line-height: 41px;
				display: inline-block;
				text-align: center;
				font-weight: 400;
				font-size: 32px;
				margin-top: 21px;
				color: #fcfcfd;
				margin-right: 20px;
			}
		}
	}
}
.solution {
	height: 937px;
	width: 100%;
	padding: 174px 122px 131px;
	background: url('../../../assets/imgs/home/index-solution-bg.png') no-repeat;
	background-size: cover;
	position: relative;
	top: -75px;
	margin-bottom: 107px;
	z-index: 2;
	.title {
		height: 66px;
		font-size: 70px;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
		line-height: 66px;
		margin-bottom: 26px;
	}
	.subtitle {
		height: 33px;
		font-size: 40px;
		font-weight: 300;
		color: #ffffff;
		line-height: 33px;
		text-align: center;
		opacity: 0.5;
		margin-bottom: 67px;
	}
	ul {
		display: flex;
		justify-content: space-between;
		li {
			width: 32%;
			height: 440px;
			// background: url("../../../assets/imgs/home/index-solution-item-1.png") rgba(0, 0, 0, .7) no-repeat;
			background-size: cover;
			position: relative;
			img {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
			&:nth-child(2) {
				// background: url("../../../assets/imgs/home/index-solution-item-2.png") no-repeat;
				background-size: cover;
			}
			&:nth-child(3) {
				// background: url("../../../assets/imgs/home/index-solution-item-3.png") no-repeat;
				background-size: cover;
			}
			.fade-in {
				opacity: 0;
				z-index: 2;
				height: 100%;
				position: absolute;
				width: 100%;
				left: 0;
				top: 0;
				padding-top: 139px;
				background-color: rgba(0, 0, 0, 0.7);
				transition: all 1000ms;
			}
			&:hover {
				.fade-in {
					opacity: 1;
				}
			}
			.des {
				position: absolute;
				height: 42px;
				font-size: 44px;
				font-weight: 500;
				left: 44px;
				bottom: 36px;
				color: #ffffff;
				line-height: 42px;
				z-index: 3;
				text-shadow: 0px 0px 7px rgba(40, 40, 40, 0.83);
			}
			.jrjg {
				font-size: 44px;
				font-weight: 500;
				color: #ffffff;
				z-index: 3;
				text-shadow: 0px 0px 7px rgba(40, 40, 40, 0.83);
				margin: 57px 0 37px 29px;
				position: relative;
			}
			.jrjg-des {
				font-size: 28px;
				font-weight: 400;
				color: #fcfcfd;
				line-height: 44px;
				position: relative;
				margin-left: 32px;
			}
			.button {
				width: 128px;
				height: 38px;
				line-height: 38px;
				text-align: center;
				background: #ffffff;
				border-radius: 19px;
				color: #303030;
				position: absolute;
				left: 34px;
				font-size: 24px;
				bottom: 36px;
			}
			.phjr {
				font-size: 24px;
				font-weight: 300;
				color: #fcfcfd;
				line-height: 40px;
				text-align: right;
				position: absolute;
				right: 34px;
				bottom: 35px;
			}
		}
	}
}
.performance {
	width: 1500px;
	margin: 0 auto;
	background: url('../../../assets/imgs/home/index-performance-bg.png') no-repeat;
	background-size: cover;
	padding-bottom: 139px;
	ul {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		li {
			width: 500px;
			margin-bottom: 152px;
			text-align: center;
			.num {
				font-size: 80px;
				color: #000000;
				font-weight: bold;
				margin-bottom: 23px;
			}
			.desc {
				font-size: 30px;
				font-weight: 400;
				color: #717070;
			}
			.unit {
				font-size: 40px;
				font-weight: 400;
				color: #000000;
			}
		}
	}
	.time {
		font-size: 24px;
		font-weight: 400;
		text-align: center;
		color: #aaaaaa;
		line-height: 36px;
	}
}
.cooperation {
	background: url('../../../assets/imgs/home/index-cooperation-bg.png') no-repeat;
	background-size: cover;
	padding: 87px 94px;
	.title {
		text-align: center;
		height: 65px;
		font-size: 70px;
		font-weight: 400;
		color: #000000;
		margin-bottom: 30px;
	}
	.subtitle {
		text-align: center;
		height: 40px;
		font-size: 40px;
		font-weight: 300;
		color: #000000;
		opacity: 0.5;
		margin-bottom: 40px;
	}
	.desc {
		height: 21px;
		font-size: 22px;
		font-weight: 300;
		text-align: center;
		color: #8e8e8e;
		line-height: 39px;
		margin-bottom: 108px;
	}
}
.tabs {
	.tab-title {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #e8e8e8;
		a {
			padding: 24px 0;
			font-size: 28px;
			color: #868686;
			margin-right: 190px;
			border-bottom: 6px solid transparent;
			&:last-child {
				margin-right: 0;
			}
			&.active {
				color: #2f6eb4;
				border-bottom-color: #4d6ba2;
			}
		}
	}
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
.tab-1 {
	position: absolute;
	left: 410px;
	top: 349px;
	z-index: 23;
	.sub {
		height: 58px;
		line-height: 58px;
		font-size: 60px;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 27px;
	}
	.describe {
		height: 92px;
		font-size: 40px;
		font-weight: 300;
		color: #ffffff;
		line-height: 48px;
	}
}
.animate__fadeIn {
	animation-duration: 2s;
}
.swiper-pagination {
	bottom: 250px;
	::v-deep.swiper-pagination-bullet {
		width: 15px;
		height: 15px;
		border: 2px solid #ffffff;
		border-radius: 50%;
		background: none;
		margin-right: 30px;
	}
	::v-deep.swiper-pagination-bullet-active {
		background: #ffffff;
	}
}
.swiper-button-prev {
	background: none;
	left: 20px;
	.anticon-left {
		font-size: 44px;
		color: #ffffff;
	}
}
.swiper-button-next {
	background: none;
	right: 40px;
	.anticon-right {
		font-size: 44px;
		color: #ffffff;
	}
}
</style>
