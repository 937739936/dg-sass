<template>
	<div class="mobile-check">
		<p class="check-tip">为确认身份，我们需验证您的安全手机</p>
		<p class="check-tip">如果您当前的手机号已无法使用,请切换验证方式或联系客服</p>
		<a-radio-group
			v-model="checkType"
			@change="handleChange"
		>
			<a-radio
				value="MOBILE"
				class="current-mobile"
			>
				当前安全手机：<span class="mobile-num">{{ mobile }}</span>
			</a-radio>
			<a-radio
				value="EMAIL"
				class="current-mobile"
			>
				当前邮箱：<span class="mobile-num">{{ email }}</span>
			</a-radio>
		</a-radio-group>
		<div class="input-wrap">
			<a-input
				class="input-code"
				v-model.trim="msgcode"
				:maxLength="10"
			/>
			<div
				class="error-msg"
				v-show="errormsg"
			>
				验证码输入错误
			</div>
			<i
				class="code"
				v-if="disabled"
				>{{ count }}s后重新发送</i
			>
			<i
				class="code"
				v-else
				style="cursor: pointer"
				@click="getLoginCode"
				>获取短信验证码</i
			>
		</div>
		<a-button
			type="primary"
			class="next-btn"
			@click="checkCode"
			:disabled="btnDisabled"
			>下一步</a-button
		>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { tencentCaptcha } from '@/v2/utils/factory';
export default {
	props: ['sendapi', 'checkapi'],
	data() {
		return {
			msgcode: '',
			count: 0,
			errormsg: '',
			disabled: false,
			checkType: 'MOBILE', // 校验方式默认是手机号
			btnDisabled: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		mobile() {
			let str = this.VUEX_ST_PERSONALLINFO.mobile;
			return str.substr(0, 3) + '****' + str.substr(7);
		},
		email() {
			let str = this.VUEX_ST_PERSONALLINFO.email || '';
			return str;
		}
	},
	methods: {
		beforeRouteLeave(to, from, next) {
			window.clearInterval(this.timer);
			next();
		},
		countDown() {
			this.count = 60;
			let num = 60;
			if (this.timer) window.clearInterval(this.timer);
			this.timer = window.setInterval(() => {
				if (num <= 0) {
					window.clearInterval(this.timer);
					this.disabled = false;
				}
				num--;
				this.count = num;
			}, 1000);
		},
		getLoginCode() {
			if (this.btnDisabled) return;
			tencentCaptcha(this.sendSms, this.checkType);
		},
		sendSms({ ticket, randstr }) {
			this.sendapi({
				ticket,
				randstr,
				type: this.checkType
			}).then(res => {
				if (!res.success) {
					this.$message.error(res.data);
					return;
				}
				this.$message.success('发送成功');
				this.disabled = true;
				this.countDown();
			});
		},
		checkCode() {
			if (!this.msgcode) {
				this.errormsg = '请输入验证码';
				return;
			}
			this.checkapi({
				code: this.msgcode,
				type: this.checkType
			})
				.then(res => {
					if (!res.success || !res.data) {
						this.$message.error(res.data || '验证码错误');
						return;
					}

					this.errormsg = '';

					this.$emit('checksuccess', this.msgcode);
				})
				.catch(e => {
					this.errormsg = '';
				});
		},
		handleChange(e) {
			if (e.target.value === 'EMAIL') {
				if (!this.VUEX_ST_PERSONALLINFO.email) {
					this.$message.warning({
						content: '请提前绑定安全邮箱，再进行邮箱验证登录。',
						duration: 5
					});
					this.btnDisabled = true;
				} else {
					this.btnDisabled = false;
				}
			} else {
				this.btnDisabled = false;
			}
		}
	}
};
</script>
<style scoped lang="less">
.mobile-check {
	min-height: 300px;
	text-align: center;
	.error-msg {
		color: red;
		text-align: left;
	}
	.next-btn {
		width: 120px;
		height: 32px;
		text-align: center;
		margin-top: 16px;
	}
	.input-wrap {
		width: 330px;
		margin: 0 auto;
		height: 53px;
		margin-top: 10px;
		position: relative;
		.code {
			font-family: PingFangSC-Regular;
			font-size: 12px;
			color:  @primary-color;
			position: absolute;
			right: 7px;
			top: 7px;
		}
	}
	.check-tip {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #6b6f76;
		text-align: center;
	}
	.current-mobile {
		display: block;
		margin-top: 15px;
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #383a3f;
		text-align: left;
	}
	.mobile-num {
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: @primary-color;
	}
}
</style>
