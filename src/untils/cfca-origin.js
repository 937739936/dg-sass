var chromeExtension = 'afiednfllokghlacndjgblgggfenjlpa';
// var chromeExtension = 'ciogpmcebegbgbjajpkfkgpcijocclmf';
var productID = 'com.cfca.cryptokit.hldzsw';

var extensionName = productID + '.extension';
var reqEventName = productID + '.request';
var respEventName = productID + '.response';

var Browser = {
	IE: 'Internet Explorer',
	Edge: 'Edge',
	Chrome: 'Chrome',
	Safari: 'Safari',
	Firefox: 'Firefox'
};

(() => {
	const href = window.location.href;
	if (href.startsWith('https://test') || href.startsWith('https://uat')) {
		// 数链测试环境用晋融的chrome扩展
		// chromeExtension = 'gaonmjchaknlojbbaioagekcjhadcljb';
		chromeExtension = 'afiednfllokghlacndjgblgggfenjlpa';
	} else {
		// 数链生产环境用数链的chrome扩展
		chromeExtension = 'afiednfllokghlacndjgblgggfenjlpa';
	}
})();

export default function nmCryptokit(browser) {
	this.browser = browser;
}

nmCryptokit.prototype.init = function () {
	var browser = this.browser;

	return checkExtension(browser)
		.then(function (browser) {
			var request = new Object();
			request.action = 'connect';
			request.host = productID;
			return SendMessage(browser, request);
		})
		.then(function () {
			var request = new Object();
			request.action = 'checkHost';
			return SendMessage(browser, request);
		});
};

nmCryptokit.prototype.uninit = function () {
	var request = new Object();
	request.action = 'disconnect';
	request.host = productID;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.getExtensionVersion = function () {
	var request = new Object();
	var funcInfo = new Object();

	funcInfo.function = 'getExtensionVersion';
	funcInfo.params = null;
	request.action = 'getExtensionVersion';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.getHostVersion = function () {
	var request = new Object();
	var funcInfo = new Object();
	var randomId = GenerateRandomId();

	funcInfo.function = 'GetVersion';
	funcInfo.params = null;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.SelectCertificate = function (
	bstrSubjectDNFilter,
	bstrIssuerDNFilter,
	bstrSerialNumFilter,
	bstrCSPNameList
) {
	var request = new Object();
	var funcInfo = new Object();
	var paramArr = new Array();
	var randomId = GenerateRandomId();

	paramArr.push(bstrSubjectDNFilter);
	paramArr.push(bstrIssuerDNFilter);
	paramArr.push(bstrSerialNumFilter);
	paramArr.push(bstrCSPNameList);

	funcInfo.function = 'SelectCertificate';
	funcInfo.params = paramArr;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.GetSignCertInfo = function (bstrInfoType) {
	var request = new Object();
	var funcInfo = new Object();
	var paramArr = new Array();
	var randomId = GenerateRandomId();

	paramArr.push(bstrInfoType);

	funcInfo.function = 'getSignCertInfo';
	funcInfo.params = paramArr;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.SignMsgPKCS7 = function (bstrSourceData, bstrHashAlg, bWithSourceData) {
	var request = new Object();
	var funcInfo = new Object();
	var paramArr = new Array();
	var randomId = GenerateRandomId();

	paramArr.push(bstrSourceData);
	paramArr.push(bstrHashAlg);
	paramArr.push(bWithSourceData);

	funcInfo.function = 'SignMsgPKCS7';
	funcInfo.params = paramArr;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.SignHashMsgPKCS7Detached = function (bstrSourceData, bstrHashAlg) {
	var request = new Object();
	var funcInfo = new Object();
	var paramArr = new Array();
	var randomId = GenerateRandomId();

	paramArr.push(bstrSourceData);
	paramArr.push(bstrHashAlg);

	funcInfo.function = 'SignHashMsgPKCS7Detached';
	funcInfo.params = paramArr;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.GetVersion = function () {
	var request = new Object();
	var funcInfo = new Object();
	var randomId = GenerateRandomId();

	funcInfo.function = 'GetVersion';
	funcInfo.params = null;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

nmCryptokit.prototype.GetLastErrorDesc = function () {
	var request = new Object();
	var funcInfo = new Object();
	var randomId = GenerateRandomId();

	funcInfo.function = 'GetLastErrorDesc';
	funcInfo.params = null;
	funcInfo.randomId = randomId;

	request.action = 'invoke';
	request.funcInfo = funcInfo;

	return SendMessage(this.browser, request);
};

// Encapsulate Chrome sendMessage callback to Promise
function SendMessageforChrome(request) {
	return new Promise(function (resolve, reject) {
		chrome.runtime.sendMessage(chromeExtension, request, function (response) {
			if (response) {
				if (0 == response.errorcode) {
					resolve(response);
				} else {
					reject(response);
				}
			} else {
				var result = new Object();
				result.errorcode = 1;
				result.result = chrome.runtime.lastError.message;
				reject(result);
			}
		});
	});
}

// Encapsulate Edge&Firefox event to Promise
function SendMessagebyEvent(request) {
	var event = new CustomEvent(reqEventName, { detail: request });
	document.dispatchEvent(event);

	return new Promise(function (resolve, reject) {
		var responseEventName = respEventName;
		if (request.funcInfo != undefined && request.funcInfo.randomId != undefined)
			responseEventName += '.' + request.funcInfo.randomId;

		document.addEventListener(
			responseEventName,
			function CallBack(e) {
				document.removeEventListener(e.type, CallBack);
				var eJson = JSON.parse(e.detail);
				if (null != eJson && 0 == eJson.errorcode) {
					resolve(eJson);
				} else {
					reject(eJson);
				}
			},
			false
		);
	});
}

function SendMessage(browser, requestJSON) {
	if (Browser.Chrome == browser) {
		return SendMessageforChrome(requestJSON);
	} else {
		return SendMessagebyEvent(requestJSON);
	}
}

function checkExtension(browser) {
	return new Promise(function (resolve, reject) {
		var result = new Object();
		if (Browser.Chrome == browser) {
			// chrome.runtime.sendMessage() could check extension  existence.
			resolve(browser);
		} else if (Browser.Edge == browser || Browser.Firefox == browser) {
			if (document.getElementById(extensionName)) {
				resolve(browser);
			} else {
				result.errorcode = 1;
				result.result = 'Extension does not exist!';
				reject(result);
			}
		} else {
			result.errorcode = 1;
			result.result = 'Only support Chrome/Edge/Firefox';
			reject(result);
		}
	});
}

function GenerateRandomId() {
	var charstring = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	var maxPos = charstring.length;
	var randomId = '';
	for (let i = 0; i < 10; i++) {
		randomId += charstring.charAt(Math.floor(Math.random() * maxPos));
	}
	return randomId;
}
