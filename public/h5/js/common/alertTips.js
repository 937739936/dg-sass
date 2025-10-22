

let alertTips = {
	init:function () {
		$("body").append(` 
			<div class="alert-tips-layout">
				<div class="alert-tips"></div>
				<div class="alert-tips-success">
					<i class="success-white-icon"></i>
					<span class="text"></span>
				</div>
				<div class="alert-tips-loading">
					<i class="loading-icon"></i>
					<span class="text"></span>
				</div>
			</div>
		`);
		this.$alertTipsLayout = $(".alert-tips-layout");
		this.$alertTips = $(".alert-tips-layout .alert-tips");
		this.$alertTipsSuccess = $(".alert-tips-layout .alert-tips-success .text");
		this.$alertTipsLoading = $(".alert-tips-layout .alert-tips-loading .text");
	},
	toastModal:function (text,duration,fn) {
		this.hide()
		this.$alertTips.html(text);
		this.$alertTipsLayout.addClass("show").addClass("modal")
		this._hide(duration,fn)
	},
	toast:function (text,duration,fn) {
		this.hide()
		this.$alertTips.html(text);
		this.$alertTipsLayout.addClass("show")
		this._hide(duration,fn)
	},
	success:function (text,duration,fn) {
		this.hide()
		this.$alertTipsSuccess.html(text);
		this.$alertTipsLayout.addClass("success")
		this._hide(duration,fn)
	},
	loading:function (text,duration,fn) {
		this.$alertTipsLoading.html(text);
		this.$alertTipsLayout.addClass("loading")
	},
	loadingMask:function (text,duration,fn) {
		this.$alertTipsLoading.html(text);
		this.$alertTipsLayout.addClass("loading-mask")
	},
	_hide:function (duration=1.5,fn) {
		duration = (duration - 0.2) * 1000;
		let timer = setTimeout(() => {
			clearTimeout(timer);
			this.hide()
			fn && fn()
		},duration)	
	},
	hide:function () {
		this.$alertTipsLayout.removeClass("show").removeClass("loading").removeClass("success").removeClass("modal").removeClass("loading-mask");
		this.$alertTips.html("")
		this.$alertTipsSuccess.html("")
		this.$alertTipsLoading.html("")
	}
	

}

alertTips.init()

window.alertTips = alertTips