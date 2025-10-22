import nmCryptokit from './cfca-origin';
import { message, Modal } from 'ant-design-vue';
import ENV from 'api/env.js';
import { API_CFCAHASH, API_CFCAPDF, API_CFCAVALID } from 'api';
const confirm = Modal.confirm;

//初始化新浏览器签名控件
var cryptoAgentPromise = '';

window.CryptoAgent = '';

export function initCryptoAgent(uscc) {
	uscc = uscc || '';
	var browser = BrowserInfo();
	if (
		'Edge' == browser.name ||
		('Chrome' == browser.name && parseInt(browser.version) > 41) ||
		('Firefox' == browser.name && parseInt(browser.version) > 52)
	) {
		return initCryptoAgentByOthers(uscc, browser.name);
	} else if ('Internet Explorer' == browser.name && parseInt(browser.version) > 9) {
		return initCryptoAgentByIE(uscc);
	} else {
		message.error('抱歉,暂不支持此浏览器');
		var defer = $.Deferred();
		defer.reject();
		return defer.promise();
	}
}

//生成CryptoAgent
function getCryptoAgent() {
	var browser = BrowserInfo();
	if ('Internet Explorer' == browser.name && parseInt(browser.version) > 9) {
		if (CryptoAgent == '') {
			try {
				var eDiv = document.createElement('div');
				if (navigator.appName.indexOf('Internet') >= 0 || navigator.appVersion.indexOf('Trident') >= 0) {
					if (window.navigator.cpuClass == 'x86') {
						eDiv.innerHTML = `<object id="CryptoAgent" codebase="https://admin.shdatalink.com/cfca/cfca-CrytoAgent/ie/x86/CryptoKit.Paperless.x86.cab#version=3,2,1,1" classid="clsid:B64B695B-348D-400D-8D58-9AAB1DA5851A" ></object>`;
					} else {
						eDiv.innerHTML = `<object id="CryptoAgent" codebase="https://admin.shdatalink.com/cfca/cfca-CrytoAgent/ie/x64/CryptoKit.Paperless.x64.cab#version=3,2,1,1" classid="clsid:8BF7E683-630E-4B59-9E61-C996B671EBDF" ></object>`;
					}
				} else {
					eDiv.innerHTML =
						'<embed id="CryptoAgent" type="application/npCryptoKit.Paperless.x86" style="height: 0px; width: 0px">';
				}
				document.body.appendChild(eDiv);
			} catch (e) {
				alert(e);
				//return false;
			}
			CryptoAgent = document.getElementById('CryptoAgent');
		}
	} else {
		if (cryptoAgentPromise == '') {
			CryptoAgent = new nmCryptokit(browser.name);
			return new Promise(function (resolve, reject) {
				CryptoAgent.init()
					.then(function (data) {
						resolve(data);
					})
					.catch(function (reason) {
						reject(reason);
					});
			});
		} else {
			return cryptoAgentPromise;
		}
	}
	return CryptoAgent;
}

function initCryptoAgentByOthers(uscc, browserName) {
	var defer = $.Deferred();
	cryptoAgentPromise = getCryptoAgent();
	cryptoAgentPromise
		.then(function () {})
		.then(function () {
			return CryptoAgent.GetVersion();
		})
		.then(function (response) {
			return CryptoAgent.SelectCertificate(uscc, '', '', '');
		})
		.then(function (response) {
			return CryptoAgent.SignHashMsgPKCS7Detached('test', 'SHA-1');
		})
		.then(function () {
			return CryptoAgent.GetSignCertInfo('SerialNumber');
		})
		.then(function (response) {
			return validCert(response.result);
		})
		.then(function () {
			return window.CryptoAgent.GetSignCertInfo('CertContent');
		})
		.then(function (response) {
			defer.resolve(response.result);
		})
		.catch(function (response) {
			if (response == undefined || response == '' || response == null) {
				defer.reject();
				return;
			}
			if (
				response.message == "Cannot read property 'sendMessage' of undefined" ||
				(response.result && response.result.indexOf('Could not establish connection') != -1)
			) {
				confirm({
					title: '请先安装谷歌内核浏览器插件，或联系平台客服',
					okText: '去下载',
					cancelText: '取消',
					onOk() {
						// 该文件在admin的build目录中
						window.open('https://admin.shdatalink.com/cfca/cfca-CrytoAgent/chrome/extension.zip', '_parent');
					},
					onCancel() {}
				});
				defer.reject();
				return;
			} else if (
				response.result == 'Attempting to use a disconnected port object' ||
				response.result == "Cannot read properties of undefined (reading 'postMessage')"
			) {
				confirm({
					title: '请先安装CFCA无纸化签名exe插件!，或联系平台客服',
					okText: '去下载',
					cancelText: '取消',
					onOk() {
						// 该文件在admin的build目录中
						window.open(
							'https://admin.shdatalink.com/cfca/cfca-CrytoAgent/chrome/CryptoKitHost.Paperless.hldzsw.Setup.exe',
							'_parent'
						);
					},
					onCancel() {}
				});
				defer.reject();
				return;
			} else if (response.result == 'Extension does not exist!') {
				confirm({
					title: '请先安装火狐内核浏览器插件!',
					okText: '确定',
					cancelText: '取消',
					onOk() {
						window.open(
							'http://test3-trade-admin.yimei180.net/cfca/cfca-CrytoAgent/firefox/cfca_cryptokitpaperlesshldzsw_extension-3.4.0.7-fx.xpi',
							'_parent'
						);
					},
					onCancel() {}
				});
				defer.reject();
				return;
			} else if (response.result == 'No such native application com.cfca.cryptokit.paperless.hldzsw') {
				confirm({
					title: '请先安装CFCA无纸化签名exe插件，或联系平台客服',
					okText: '去下载',
					cancelText: '取消',
					onOk() {
						window.open('https://admin.shdatalink.com/cfca/cfca-CrytoAgent/CryptoKit.Paperless.exe', '_parent');
					},
					onCancel() {}
				});
				defer.reject();
				return;
			} else if (response.errorcode == '-2146434962') {
				message.error('请输入PIN码');
			} else if (typeof response == 'string') {
				message.error(response);
			} else if (response.errorcode == '-1610149887') {
				message.error('印章未到有效时间范围内,无法盖章,请联系管理员');
			} else {
				message.error('请确认Ukey是否正确插入');
			}
			defer.reject();
		});
	return defer.promise();
}

//初始化IE浏览器签名控件
function initCryptoAgentByIE(uscc) {
	var defer = $.Deferred();
	CryptoAgent = getCryptoAgent();
	if (document.all.CryptoAgent.object == null) {
		message.error('请先安装ActiveX插件！');
		defer.reject();
		return defer.promise();
	}
	//判断是否安装好了插件
	var version = '';
	try {
		version = CryptoAgent.GetVersion();
	} catch (e) {
		message.error('请先安装ActiveX插件');
	}
	if (version == '') {
		defer.reject();
		return defer.promise();
	}
	//根据获取证书判断是否插入了Ukey
	try {
		var bSelectCertResult = CryptoAgent.SelectCertificate(uscc, '', '', '');
		if (!bSelectCertResult) {
			var errorDesc = CryptoAgent.GetLastErrorDesc();
			alert(errorDesc);
		}
	} catch (e) {
		message.error('没有找到对应证书，请确认已申请证书并插入Ukey!');
		defer.reject();
		return defer.promise();
	}
	var certSerialNo;
	try {
		certSerialNo = CryptoAgent.GetSignCertInfo('SerialNumber');
	} catch (e) {
		message.error('获取证书序列号失败！');
		defer.reject();
		return defer.promise();
	}

	if (uscc != '' && uscc != null && uscc != undefined) {
		//尝试签名，调出密码框
		try {
			var signature = CryptoAgent.SignHashMsgPKCS7Detached('test', 'SHA-1');
		} catch (e) {
			var errorDesc = CryptoAgent.GetLastErrorDesc();
			if (errorDesc.indexOf('0x80090008') != -1) {
				message.error('请选择Ukey中的证书！');
			} else {
				message.error(errorDesc);
			}
			defer.reject();
			return defer.promise();
		}
	}
	var def = $.Deferred();
	validCert(certSerialNo)
		.then(res => {
			var CertContent = window.CryptoAgent.GetSignCertInfo('CertContent');
			if (typeof CertContent != 'string') {
				CertContent = CertContent.result;
			}
			def.resolve(CertContent);
		})
		.catch(err => {
			def.reject();
		});

	return def.promise();
}

//校验证书
function validCert(serialNo) {
	var defer = $.Deferred();
	if (typeof serialNo != 'string') {
		serialNo = serialNo.result;
	}
	API_CFCAVALID({
		serialNo
	})
		.then(res => {
			if (!res.data) {
				message.error(res.message);
				defer.reject();
				return;
			}
			if (!res.data.result) {
				message.error(res.data.msg);
				defer.reject();
				return;
			}
			defer.resolve(res.data);
		})
		.catch(e => {
			defer.reject();
		});
	return defer.promise();
}

//获取PDF待签名值
export function getPdfHash(item) {
	var defer = $.Deferred();
	let obj = {};
	(obj.pdfFilePath = item.pdfFilePath), (obj.sealImageBase64 = item.sealImg), (obj.cert = item.cert);
	if (item.signLocation) {
		obj.offsetX = item.signLocation.offsetX;
		obj.offsetY = item.signLocation.offsetY;
		obj.keyword = item.signLocation.keyword;
	}
	obj.partiesTotalCount = item.partiesTotalCount;
	obj.currentPartiesIndex = item.currentPartiesIndex;
	obj.calcCross = item.calcCross;
	API_CFCAHASH(obj)
		.then(res => {
			if (!res.data) {
				defer.reject();
				return;
			}
			defer.resolve(res.data);
		})
		.catch(e => {
			defer.reject();
		});
	return defer.promise();
}

//根据pdfhash生成签名signature
export function generateSignature(item) {
	var defer = $.Deferred();
	if (item['pdfHash'] == '' || item['pdfHash'] == undefined) {
		defer.reject();
		return defer.promise();
	}

	var browser = BrowserInfo();
	if (
		'Edge' == browser.name ||
		('Chrome' == browser.name && parseInt(browser.version) > 41) ||
		('Firefox' == browser.name && parseInt(browser.version) > 52)
	) {
		CryptoAgent.SignHashMsgPKCS7Detached(item['pdfHash'], 'SHA-1')
			.then(function (response) {
				item['signature'] = response.result;
				defer.resolve(item);
			})
			.catch(function (response) {
				defer.reject();
			});
	} else if ('Internet Explorer' == browser.name && parseInt(browser.version) > 9) {
		item['signature'] = CryptoAgent.SignHashMsgPKCS7Detached(item['pdfHash'], 'SHA-1');
		defer.resolve(item);
	} else {
		message.error('抱歉,暂不支持此浏览器');
		var defer = $.Deferred();
		defer.reject();
	}
	return defer.promise();
}

export function SignMsgPKCS7(ukeyToSign) {
	var defer = $.Deferred();
	var browser = BrowserInfo();
	if (
		'Edge' == browser.name ||
		('Chrome' == browser.name && parseInt(browser.version) > 41) ||
		('Firefox' == browser.name && parseInt(browser.version) > 52)
	) {
		CryptoAgent.SignMsgPKCS7(ukeyToSign, 'SHA-1', true)
			.then(function (response) {
				defer.resolve(response.result);
			})
			.catch(function (response) {
				defer.reject();
			});
		return defer.promise();
	} else if ('Internet Explorer' == browser.name && parseInt(browser.version) > 9) {
		defer.resolve(CryptoAgent.SignMsgPKCS7(ukeyToSign, 'SHA-1', true));
	} else {
		message.error('抱歉,暂不支持此浏览器');
		var defer = $.Deferred();
		defer.reject();
	}
	return defer.promise();
}

//合成PDF
export function composePdf(item) {
	var defer = $.Deferred();
	if (item.signature && typeof item.signature !== 'string') {
		item.signature = item.signature.result;
	}
	API_CFCAPDF(item)
		.then(res => {
			if (!res.data) {
				defer.reject();
				return;
			}
			defer.resolve(res.data);
		})
		.catch(e => {
			defer.reject();
		});
	return defer.promise();
}

//判断浏览器类型
function BrowserInfo() {
	var res = {
		name: '',
		version: ''
	};
	var reg;
	var userAgent = self.navigator.userAgent;

	if ((reg = /edge\/([\d\.]+)/i.exec(userAgent))) {
		res.name = 'Edge';
		res.version = reg[1];
	} else if (/msie/i.test(userAgent)) {
		res.name = 'Internet Explorer';
		res.version = /msie ([\d\.]+)/i.exec(userAgent)[1];
	} else if (/Trident/i.test(userAgent)) {
		res.name = 'Internet Explorer';
		res.version = /rv:([\d\.]+)/i.exec(userAgent)[1];
	} else if (/chrome/i.test(userAgent)) {
		res.name = 'Chrome';
		res.version = /chrome\/([\d\.]+)/i.exec(userAgent)[1];
	} else if (/safari/i.test(userAgent)) {
		res.name = 'Safari';
		res.version = /version\/([\d\.]+)/i.exec(userAgent)[1];
	} else if (/firefox/i.test(userAgent)) {
		res.name = 'Firefox';
		res.version = /firefox\/([\d\.]+)/i.exec(userAgent)[1];
	}
	return res;
}
