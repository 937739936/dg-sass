<template>
	<div class="ifame-wps">
		<template v-if="showReturn">
			<div
				class="mask-return"
				@click="$router.push('/center/steels/statement/myStatementList')"
			>
				<a-tooltip title="保存并返回">
					<a-icon
						type="left"
						class="return-icon"
					/>
				</a-tooltip>
			</div>
			<div class="right-mask"></div>
		</template>
		<div
			class="loading"
			v-if="!showReturn"
		>
			<a-spin tip="加载中...请稍等" />
		</div>
		<div
			class="custom-mount"
			:style="{ opacity: !showReturn ? 0 : 1 }"
		>
			<div class="plug-mask"></div>
		</div>
	</div>
</template>
<script>
import WebOfficeSDK from './lib/web-office-sdk-v1.1.19.es.js';
import { wpsFileLink } from '@/v2/center/steels/api/statement.js';
export default {
	name: 'IframeWps',
	data() {
		return {
			id: this.$route.query.id,
			url: '',
			showReturn: false,
			isFirstLogin: false,
			lastTimeUserType: '',
			timeOut: '',
			removeHidden: false
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.getLink();
		document.querySelector('.main-content-inner').style.minHeight = 'auto';
	},
	beforeDestroy() {
		clearTimeout(this.timeOut);
		document.querySelector('.main-content-inner').style.minHeight = '100%';
	},
	methods: {
		mount() {
			const jssdk = WebOfficeSDK.config({
				url: this.url,
				mount: document.querySelector('.custom-mount'),
				commandBars: [
					{
						cmbId: 'HeaderLeft', // 组件 ID
						attributes: {
							visible: false, // 隐藏组件
							enable: false // 禁用组件，组件显示但不响应点击事件
						}
					},
					{
						cmbId: 'HeaderRight', // 组件 ID
						attributes: {
							visible: false, // 隐藏组件
							enable: false // 禁用组件，组件显示但不响应点击事件
						}
					},
					{
						cmbId: 'FloatQuickHelp', // 组件 ID
						attributes: {
							visible: false, // 隐藏组件
							enable: false // 禁用组件，组件显示但不响应点击事件
						}
					},
					{
						cmbId: 'FloatQuickHelp', // 组件 ID
						attributes: {
							visible: false, // 隐藏组件
							enable: false // 禁用组件，组件显示但不响应点击事件
						}
					},
					{
						cmbId: 'WriterHoverToolbars', // 组件 ID
						attributes: {
							visible: false, // 隐藏组件
							enable: false // 禁用组件，组件显示但不响应点击事件
						}
					}
				]
			});
			if (this.removeHidden) {
				this.showReturn = true;
			}
			jssdk.on('fileOpen', data => {
				this.showReturn = true;
				clearTimeout(this.timeOut);
			});
		},
		getLink() {
			let wpsSession = localStorage.getItem('wpsSession') || {};
			if (typeof wpsSession === 'string') {
				wpsSession = JSON.parse(wpsSession);
			}
			this.lastTimeUserType = wpsSession.lastTimeUserType;
			this.isFirstLogin = !this.lastTimeUserType;
			if (this.isFirstLogin) {
				wpsFileLink({
					id: this.id
				}).then(res => {
					if (res.success) {
						this.url = res.data.shareLink;
						wpsSession.lastTimeUserType = res.data.lastTimeUserType;
						localStorage.setItem('wpsSession', JSON.stringify(wpsSession));
						this.mount();
						this.timeOut = setTimeout(() => {
							this.getLink();
							this.removeHidden = true;
						}, 4000);
					}
				});
			} else {
				wpsFileLink({
					id: this.id,
					lastTimeUserType: this.lastTimeUserType
				}).then(res => {
					if (res.success) {
						this.url = res.data.shareLink;
						wpsSession.lastTimeUserType = res.data.lastTimeUserType;
						localStorage.setItem('wpsSession', JSON.stringify(wpsSession));
						this.mount();
						if (this.lastTimeUserType != res.data.lastTimeUserType) {
							this.timeOut = setTimeout(() => {
								this.getLink();
								this.removeHidden = true;
							}, 4000);
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.ifame-wps {
	position: relative;
	margin: -40px;
	padding-top: 15px;
}
.custom-mount {
	width: 100%;
	height: calc(100vh - 75px);
	position: relative;
}
.mask-return {
	width: 30px;
	height: 30px;
	position: absolute;
	z-index: 99;
	top: 20px;
	left: 6px;
	cursor: pointer;
	text-align: center;
	line-height: 30px;
	.return-icon {
		color: rgb(162, 172, 189);
		font-weight: bold;
		font-size: 16px;
	}
}
.right-mask {
	width: 60px;
	height: 100%;
	background-color: rgb(242, 244, 247);
	position: absolute;
	right: 0;
	z-index: 99;
	top: 0;
}

.bottom-mask {
	width: 60px;
	height: 30px;
	background-color: #f2f4f7;
	position: absolute;
	right: 60px;
	bottom: 5px;
}
.plug-mask {
	width: 40%;
	min-width: 400px;
	right: 0;
	height: 30px;
	background-color: #f2f4f7;
	position: absolute;
	bottom: 5px;
	z-index: 99;
}
.save-btn {
	text-align: center;
	padding-top: 6px;
	position: absolute;
	width: 200px;
	left: 50%;
	margin-left: -100px;
	bottom: -14px;
}
.loading {
	text-align: center;
	position: absolute;
	top: 55%;
}
</style>
