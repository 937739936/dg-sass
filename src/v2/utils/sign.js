import { initCryptoAgent, getPdfHash, generateSignature, composePdf } from 'untils/cfca.js';
// isOrderModule 订单模块step1的返回数据取res.data，其他取res.result，后续其他盖章接口返回数据结构也会由res.result替换为res.data
export function sign(step1, step2, completedRoute, isOrderModule = false) {
	//若当前为开发环境 且开启了模拟签章 跳过签章的电子签名环节
	if (process.env.VUE_APP_BUILD_ENV === 'development' || window.FAKE_SIGN === 'ON') {
		if (window.FAKE_SIGN === 'ON') {
			this.$message.info('当前正在使用模拟盖章功能');
			step2().then(res => {
				this.$message.success('模拟盖章完成！').then(() => {
					if (completedRoute) {
						if (Object.prototype.toString.call(completedRoute) === '[object Function]') {
							completedRoute();
							return;
						}
						this.$router.push(completedRoute);
					} else {
						// 终止合同盖章completedRoute为undefined
						this.$router.go(-1);
					}
				});
			});
			return;
		} else {
			this.$message.info(
				'当前为开发模式。可在浏览器console或控制台输入 window.FAKE_SIGN="ON" 开启模拟盖章。页面重新加载后自动关闭'
			);
		}
	}
	const currentCompanyUscc = this.VUEX_ST_COMPANYSUER.companyUscc;
	var that = this;
	var defer = $.Deferred();
	defer.resolve();
	defer = defer
		.then(function () {
			return initCryptoAgent(currentCompanyUscc);
		})
		.then(function (CertContent) {
			if (typeof CertContent != 'string') {
				CertContent = CertContent.result;
			}
			step1({
				cert: CertContent
			}).then(res => {
				//   获取电子签章

				that.signLoading = true;
				var toSigList = isOrderModule ? res.data : res.result;
				let pdfId = '';
				$.each(toSigList, function (i, e) {
					defer = defer
						.then(function (data) {
							return getPdfHash(toSigList[i]);
						})
						.then(function (data) {
							pdfId = data.pdfId;
							return generateSignature(data);
						})
						.then(function (data) {
							return composePdf({ ...data, pdfId });
						});
				});
				defer.fail(function () {
					that.signLoading = false;
					that.$message.error('签署失败，请联系管理员');
				});
				defer.done(function () {
					step2({
						cert: CertContent
					}).then(res => {
						that.signLoading = false;

						that.$message.success('签署完成').then(() => {
							if (completedRoute) {
								if (Object.prototype.toString.call(completedRoute) === '[object Function]') {
									completedRoute();
									return;
								}
								that.$router.push(completedRoute);
							} else {
								// 终止合同盖章completedRoute为undefined
								that.$router.go(-1);
							}
						});
					});
				});
			});
		})
		.catch(() => {
			that.signLoading = false;
		});
}
