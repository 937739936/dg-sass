<template>
	<div
		class="s-card"
		style="width: 100%"
	>
		<div class="s-card-title">证书申请-申请必读</div>
		<!-- <h3>CA证书申请前必读</h3> -->
		<div
			class="s-card-content"
			style="margin-top: 50px"
		>
			<ul>
				<li>
					<a
						href="https://www.cfca.com.cn/upload/CFCACPS20181119.pdf"
						target="_blank"
					>
						<img src="@/v2/assets/imgs/person/1.png" />
						<p>CFCA电子认证业务规则</p>
					</a>
				</li>
				<li>
					<a
						href="https://www.cfca.com.cn/20150811/101230094.html"
						target="_blank"
					>
						<img src="@/v2/assets/imgs/person/2.png" />
						<p>《CFCA数字证书服务协议》</p>
					</a>
				</li>
				<li>
					<a
						href="https://www.cfca.com.cn/20150811/101230100.html"
						target="_blank"
					>
						<img src="@/v2/assets/imgs/person/3.png" />
						<p>《数字证书使用安全提示》</p>
					</a>
				</li>
			</ul>
			<div class="radio">
				<a-checkbox
					:checked="checked"
					:autoFocus="autoFocus"
					@change="onChange"
				>
					我方已认真阅读并同意遵守中金金融认证中心有限公司（CFCA）网站（http://www.cfca.com.cn)发布的《数字证书服务协议》、《电子认证业务规则（CPS））》中规定的相关义务。
				</a-checkbox>
			</div>
			<a-row
				type="flex"
				justify="center"
				style="margin: 50px 0"
			>
				<a-button
					@click="$router.go(-1)"
					style="margin: 0 100px"
					>返回</a-button
				>
				<a-button
					@click="goNext"
					type="primary"
					:disabled="!checked"
					>证书申请</a-button
				>
			</a-row>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			checked: false,
			autoFocus: false
		};
	},
	methods: {
		...mapMutations({
			VUEX_MU_APPLYBOOK: 'business/VUEX_MU_APPLYBOOK'
		}),
		goNext() {
			if (this.checked) {
				this.VUEX_MU_APPLYBOOK('');
				this.$router.push('/center/v2/company/book/steptwo');
			}
		},

		onChange() {
			this.checked = !this.checked;
		}
	}
};
</script>

<style lang="stylus" scoped>
.radio
    flex-row(flex-start, flex-start)
    margin 30px 0
.s-card-content
  width 90%
  margin 0 auto
h3
    text-align left
    font-size 22px
    font-family PingFang-SC-Medium
    color #565656
    margin 30px 0
  ul
    flex-row(space-between, center)
    li
        flex 1
        flex-column(center, center)
        a
          flex-column(center, center)
          img
              width 90px
              height 90px
          p
              font-size 16px
              font-family PingFang-SC-Medium
              color #565656
              margin-top 16px
</style>
