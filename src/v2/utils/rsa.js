/* eslint-disable no-console */
import pdfjsLib from 'pdfjs-sig';
import CryptoJS from 'crypto-js';
import { API_GET_KEY } from '@/v2/api/rsa';
import forge from 'node-forge';
import store from '@/store';

class RsaDecrypt {
	#encrypt;
	#privateKey;
	#publicKey;
	#frontendSign;
	#keyId;
	#key;
	#userId;
	#expireTime;
	#createTime;
	#encStr;
	constructor() {
		this.encrypt = null;
		this.privateKey = null;
		this.publicKey = null;
		this.encrypted = null;
		this.uncrypted = null;
		this.frontendSign = null;
		this.keyId = null;
		this.key = null;
		this.userId = null;
		this.expireTime = null;
		this.createTime = null;
		this.encStr = null;
		this.excludePdfErrorMessage = ['Failed to fetch'];
		this.excludeImageUrl = ['https://hm.baidu.com'];
		this.urlParams = {
			userId: '',
			timestamp: '',
			receiveConfidentialityLevel: '',
			signConfidentialityLevel: '',
			url: ''
		};
		this.fileErrorStore = {};
		this.element = document.body;
		this.fileRetryTimer = null;
		this.startRetryTimeInterval = 0.5; // 单位s
		this.maxRetryTimes = 3;
		this.fileExtension = [
			'jpg',
			'jpeg',
			'png',
			'bmp',
			'gif',
			'pdf',
			'docx',
			'xlsx',
			'pptx',
			'doc',
			'xls',
			'ppt',
			'zip',
			'rar',
			'7z',
			'tar',
			'gz',
			'txt',
			'mp4',
			'avi',
			'3gp',
			'mkv'
		];
		this.imageFileExtension = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
	}
	async init() {
		await this.#initJSEncrypt();
	}
	registerHooks() {
		this.hookImg();
		// this.hookATarget();
		this.hookClick();
		this.addErrorListener();
		this.hookOpen();
		this.isProduction();
	}
	async #initJSEncrypt() {
		// const keyPair = await window.crypto.subtle.generateKey(
		//   {
		//     name: 'RSA-OAEP',
		//     modulusLength: 2048,
		//     publicExponent: new Uint8Array([1, 0, 1]),
		//     hash: { name: 'SHA-256' },
		//   },
		//   true,
		//   ['encrypt', 'decrypt'],
		// );
		// this.publicKey = await this.exportKey(keyPair.publicKey);
		// this.privateKey = keyPair.privateKey;

		const rsa = forge.pki.rsa;
		const keyPair = rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
		this.publicKey = await this.exportKey(keyPair.publicKey, 'public');
		this.privateKey = keyPair.privateKey;
	}
	async checkKeyValid() {
		// 如果key不存在，或者key仅剩余30s过期，则重新获取
		if (!this.key || !this.keyId || (this.expireTime && (new Date(this.expireTime) - new Date()) / 1000 < 30)) {
			if (!this.publicKey) {
				await this.#initJSEncrypt();
			}
			await this.fetchSignMaterial();
		}
	}
	async exportKey(key, type) {
		// const exported = await window.crypto.subtle.exportKey(
		//   key.type === 'public' ? 'spki' : 'pkcs8',
		//   key,
		// );
		// const exportedAsString = this.arrayBuffer2str(exported);
		// return window.btoa(exportedAsString);
		let pem = '';
		if (type === 'public') {
			pem = forge.pki.publicKeyToPem(key);
			pem = pem.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\s+/g, '');
		} else {
			pem = forge.pki.privateKeyToPem(key);
			pem = pem.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s+/g, '');
		}
		return pem;
	}
	// async importKey(pem, type) {
	//   let format = 'pkcs8';
	//   let keyUsage = 'encrypt';
	//   if (type === 'private') {
	//     format = 'pkcs8';
	//     keyUsage = 'decrypt';
	//   } else if (type == 'public') {
	//     format = 'spki';
	//     keyUsage = 'encrypt';
	//   }
	//   const binaryDer = this.str2ArrayBuffer(window.atob(pem));
	//   return window.crypto.subtle.importKey(
	//     format,
	//     binaryDer,
	//     { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
	//     true,
	//     [keyUsage],
	//   );
	// }
	arrayBuffer2str(buf) {
		return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
	}
	str2ArrayBuffer(str) {
		const buf = new ArrayBuffer(str.length);
		const bufView = new Uint8Array(buf);
		for (let i = 0, strLen = str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}
	// 生成指定长度的字符串
	randomString(len = 16) {
		let str = '';
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < len; i++) {
			str += chars.charAt(Math.floor(Math.random() * 62));
		}
		return str;
	}
	// AES算法ECB模式加密生成附件url所需签名
	async aecEncryptData(data = {}) {
		try {
			const key = this.getDecryptData();
			const content = JSON.stringify(data);
			const encryptedContent = CryptoJS.AES.encrypt(content, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			this.encStr = encodeURIComponent(encryptedContent.toString());
			return this.encStr;
		} catch (error) {
			throw error;
		}
	}
	// 加密
	encryptData(data) {
		this.encrypt.setPublicKey(this.publicKey);
		this.encrypted = this.encrypt.encrypt(data);
	}
	// 获取加密后的数据
	getEncryptData() {
		return this.encrypted;
	}
	// 解密
	async decryptData(data) {
		// const ab = this.str2ArrayBuffer(window.atob(data));
		// const decrypted = await window.crypto.subtle.decrypt(
		//   {
		//     name: 'RSA-OAEP',
		//   },
		//   this.privateKey,
		//   ab,
		// );
		// const decoded = btoa(this.arrayBuffer2str(decrypted));
		// this.uncrypted = decoded;
		// return decoded;
		const decrypted = this.privateKey.decrypt(forge.util.decode64(data), 'RSA-OAEP', {
			md: forge.md.sha256.create(), // 指定哈希算法为 SHA-256
			mgf1: forge.mgf1.create(forge.md.sha256.create())
		});
		this.uncrypted = btoa(decrypted);
		return decrypted;
	}
	arrayBufferToBase64(buffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}
	// 获取解密后的数据
	getDecryptData() {
		return CryptoJS.lib.WordArray.create(this.base64ToArrayBuffer(this.uncrypted));
	}
	/**
	 * 钩子函数，用于自定义图片源设置的行为
	 * 该函数通过劫持 Image 对象的 src 属性的 setter 方法，
	 * 在每次设置图片源时执行自定义的逻辑，如添加签名。
	 */
	hookImg() {
		// 监听 img 标签的属性变化
		const observer = new MutationObserver(mutationsList => {
			for (let i = 0; i < mutationsList.length; i++) {
				const mutation = mutationsList[i];
				if (mutation.type === 'attributes' && mutation.target instanceof Image) {
					const img = mutation.target;
					const { src } = img;
					img.onload = () => {
						if (this.fileErrorStore[this.getUrlWithoutParams(src)]) {
							this.fileErrorStore[this.getUrlWithoutParams(src)].success = true;
							// TODO: 重新加载成功后，删除失败记录
							delete this.fileErrorStore[this.getUrlWithoutParams(src)];
						}
					};
					img.onerror = async () => {
						const storeSrc = this.fileErrorStore[this.getUrlWithoutParams(src)] || {};
						const ext = this.getFileExtension(img.src);
						const imgNoParams = this.getUrlWithoutParams(img.src);
						const storeErrorImage = this.fileErrorStore[imgNoParams];
						if (storeErrorImage && storeErrorImage.retryTimes >= this.maxRetryTimes && !storeErrorImage.success) {
							return;
						}
						if (!ext || !this.imageFileExtension.includes(ext)) {
							return;
						}
						if (storeSrc?.newUrl && !storeSrc.success) {
							img.src = storeSrc?.newUrl;
							return;
						}
						if (storeSrc?.newUrl && storeSrc.retryTimes >= this.maxRetryTimes) {
							return;
						}
						if (!src.startsWith('http://localhost') && !src.startsWith('http://127.0.0.1')) {
							// 重新生成签名加载图片
							const urlReload = await this.generateFileUrl(src);
							img.src = urlReload;
						}
					};
				}
			}
		});
		// 设置观察目标（页面中的所有 <img> 标签）
		const imgElements = document.querySelectorAll('img');
		imgElements.forEach(img => {
			observer.observe(img, {
				attributes: true // 观察属性变化
			});
		});
		// 如果新添加的 img 标签还需要监听，可以通过 MutationObserver 观察 DOM 的变化
		const bodyObserver = new MutationObserver(() => {
			const imgElements = document.querySelectorAll('img');
			imgElements.forEach(img => {
				if (!img.hasAttribute('data-observed')) {
					observer.observe(img, { attributes: true });
					img.setAttribute('data-observed', 'true');
				}
			});
		});
		bodyObserver.observe(document.body, { childList: true, subtree: true });
	}
	/**
	 * 钩子函数，用于拦截 window.open 方法的调用
	 * 当调用 window.open 时，此函数会拦截并调用原生的 window.open 方法
	 * /dg-trade-api/trade-files/20240704/water-mark/cd9f02d4665e4f639ca5926afd3e5ea0.png?a=111
	 * /dg-trade-api/trade-files/20241126/water-mark/91d1199ef1594a87a562ae703c2d4364.xlsx
	 * /dg-trade-api/trade-files/20241126/water-mark/8d02d2946cd14c6996f4f3e1442ee953.docx
	 * /dg-trade-api/trade-files/20241125/water-mark/f32ef7b9c09a40368dc5483fb1b31351.pdf
	 *
	 * @returns {void} 无返回值
	 */
	hookOpen() {
		const originalWindowOpen = window.open.bind(window);
		const { id } = store.getters['user/VUEX_ST_PERSONALLINFO'];
		const _this = this;
		window.open = async function () {
			if (arguments[0].includes('https://view.officeapps.live.com/op/view.aspx')) {
				arguments[0] = arguments[0].replace('https://view.officeapps.live.com/op/view.aspx', '/dg-onlyoffice/onlineOffice/view');
				arguments[0] = arguments[0].replace('src=', 'url=');
				const currentHref = window.location.origin;
				if (currentHref.indexOf('localhost') >= 0 || currentHref.indexOf('127.0.0.1') >= 0) {
					arguments[0] = `https://test1-trade.shanghaishulian.com${arguments[0]}&personalUserId=${id}`;
				} else {
					arguments[0] = `${currentHref}${arguments[0]}&personalUserId=${id}`;
				}
			}
			const urlParams = _this.getUrlParams(arguments[0]);
			if (
				!urlParams.frontendSign &&
				_this.fileExtension.includes(_this.getFileExtension(arguments[0])) &&
				arguments[1] === '_blank'
			) {
				const url = await _this.generateFileUrl(arguments[0]);
				originalWindowOpen.apply(_this, [`${url}&personalUserId=${id}`, '_blank']);
				return;
			}
			originalWindowOpen.apply(_this, arguments);
		};
	}
	// 判断是否是生产环境
	isProduction() {
		const currentUrl = window.location.href;
		if (currentUrl.indexOf('localhost') !== -1 || currentUrl.indexOf('127.0.0.1') !== -1) {
			return false;
		}
		if (currentUrl.indexOf('test') !== -1) {
			return false;
		}
		if (currentUrl.indexOf('uat') !== -1) {
			return false;
		}
		return true;
	}
	// 从url中获取文件扩展名
	getFileExtension(url) {
		if (!url || typeof url !== 'string') return '';
		if (url.indexOf('/dg-onlyoffice/onlineOffice/view') >= 0) {
			const fileUrl = url.split('?url=')[1];
			return decodeURIComponent(fileUrl).split('?')[0].split('.').pop().toLowerCase();
		}
		if (url.indexOf('?') === -1) {
			const urlArr = url.replace(window.location.origin, '').split('.');
			return urlArr.length > 1 ? urlArr.pop().toLowerCase() : '';
		}
		const urlArr = url.split('?')[0].split('.');
		if (urlArr.length <= 1) {
			return '';
		}
		const urlExt = urlArr.pop().toLowerCase();
		return this.fileExtension.includes(urlExt) ? urlExt : '';
	}
	/**
	 * 钩子函数，用于自定义HTMLAnchorElement元素的href属性设置行为
	 */
	hookATarget() {
		const property = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');
		const nativeSet = property.set;
		function customiseSrcSet(url) {
			nativeSet.call(this, url);
		}
		Object.defineProperty(HTMLAnchorElement.prototype, 'href', {
			set: customiseSrcSet
		});
	}
	throttle(fn, interval) {
		let lastTime = 0;
		return function () {
			const now = new Date().getTime();
			if (now - lastTime >= interval) {
				fn.apply(this, arguments);
				lastTime = now;
			}
		};
	}
	/**
	 * 监听页面a标签的点击事件
	 */
	hookClick() {
		this.element.removeEventListener('click', e => this.clickACallback(e));
		this.element.addEventListener('click', e => this.clickACallback(e), false);
	}
	// a链接click事件监听
	async clickACallback(e) {
		if (e.target && e.target.tagName === 'A') {
			const { href, target } = e.target;
			if (href && target === '_blank') {
				e.preventDefault();
				const url = await this.generateFileUrl(href);
				pdfjsLib
					.getDocument(url)
					.promise.catch(async reason => {
						// 处理加载失败的情况，比如显示错误消息或重定向等 excludePdfErrorMessage 不包含的错误提示信息
						if (!this.excludePdfErrorMessage.includes(reason.message)) {
							const url = await this.generateFileUrl(href);
							window.open(url, '_blank');
						}
					})
					.then(() => {
						window.open(url, '_blank');
					});
			}
		}
	}
	/**
	 * 生成文件的访问链接
	 * vue组件内调用事例：this.$RsaDecrypt.generateFileUrl(url) 返回值为Promise<string>
	 * @param {string} fileUrl - 文件的原始URL
	 * @returns {Promise<string>} - 返回处理后的文件访问链接
	 */
	async generateFileUrl(fileUrl) {
		if (!fileUrl) {
			return Promise.reject(new Error('fileUrl不能为空'));
		}
		await this.checkKeyValid();
		const urlParams = this.getUrlParams(fileUrl);
		const index = fileUrl.indexOf('?');
		const fileNoParamsUrl = fileUrl.substring(0, index);
		const frontendSign = await this.aecEncryptData({
			userId: this.userId,
			timestamp: new Date().getTime(),
			receiveConfidentialityLevel: urlParams.confidentialityLevel,
			signConfidentialityLevel: urlParams.confidentialityLevel,
			url: fileUrl.indexOf('/dg-onlyoffice') >= 0 ? urlParams.url : fileNoParamsUrl
		});
		let result = '';
		if (urlParams.confidentialityLevel && urlParams.confidentialityLevel === 'CONFIDENTIAL') {
			result = `${fileNoParamsUrl}?sign=${urlParams.sign}&confidentialityLevel=${urlParams.confidentialityLevel}&keyId=${this.keyId}&frontendSign=1.0${frontendSign}`;
			if (urlParams.url) {
				const urlHasParams = `${urlParams.url}?sign=${urlParams.sign}&confidentialityLevel=${urlParams.confidentialityLevel}&keyId=${this.keyId}&frontendSign=1.0${frontendSign}`;
				result = `${fileNoParamsUrl}?url=${encodeURIComponent(urlHasParams)}`;
			}
		} else {
			result = fileUrl;
		}
		if (this.fileErrorStore[this.getUrlWithoutParams(fileUrl)]) {
			this.fileErrorStore[this.getUrlWithoutParams(fileUrl)]['newUrl'] = result;
		} else {
			this.fileErrorStore[this.getUrlWithoutParams(fileUrl)] = {
				oldUrl: fileUrl,
				newUrl: result,
				success: true,
				timestamp: new Date().getTime(),
				retryTimes: 0
			};
		}
		console.info(`%c生成文件访问链接成功，新URL：${result}`, `color: #52c41a;`);
		return Promise.resolve(result);
	}
	/**
	 * 从给定的URL中提取查询参数，并返回一个包含这些参数的对象。
	 *
	 * @param {string} url - 要解析的URL。
	 * @returns {Object} - 包含URL查询参数的对象。
	 */
	getUrlParams(url) {
		let fileUrl = url;
		let fileUrlNoParams = '';
		if (url.indexOf('/dg-onlyoffice/onlineOffice/view') >= 0) {
			fileUrl = decodeURIComponent(url.split('?url=')[1]);
			const baseUrl = fileUrl.split('?')[0];
			fileUrlNoParams = baseUrl.split('?')[0];
		}
		const index = fileUrl.indexOf('?');
		const search = fileUrl.substring(index);
		const params = {};
		if (search.length > 1) {
			search
				.slice(1)
				.split('&')
				.forEach(param => {
					const [key, value] = param.split('=');
					params[key] = value;
				});
		}
		if (fileUrlNoParams) {
			params.url = fileUrlNoParams;
		}
		return params;
	}
	// 去除url中的参数，获取不带参数的url
	getUrlWithoutParams(url) {
		if (!url) {
			return '';
		}
		const httpsIndex = url.indexOf('https://');
		const httpsUrl = url.slice(httpsIndex);
		const index = httpsUrl.indexOf('?');
		if (index !== -1) {
			return httpsUrl.slice(0, index);
		} else {
			return httpsUrl;
		}
	}
	/**
	 * 查找错误图片并重新加载
	 * 最大重试次数 3次 {maxRetryTimes}
	 * @param url 图片路径
	 */
	findErrorImageAndRetryLoad() {
		const images = document.querySelectorAll('img');
		const httpsImages = [...images].filter(img => img.src.indexOf('https://') !== -1 && img.src.indexOf('?') >= 0);
		httpsImages.forEach(img => {
			const urlNoParams = this.getUrlWithoutParams(img.src);
			if (
				this.fileErrorStore[urlNoParams] &&
				!this.fileErrorStore[urlNoParams].success &&
				this.fileErrorStore[urlNoParams].retryTimes < this.maxRetryTimes
			) {
				img.src = this.fileErrorStore[urlNoParams].newUrl;
				this.fileErrorStore[urlNoParams].retryTimes++;
			}
		});
	}
	addErrorListener() {
		// 标准错误捕获接口
		window.onerror = function (msg, source, line, column, error) {
			console.info('window.onerror---------', msg, source, line, column, error);
		};
		// 不同浏览器下返回的 error 对象可能不同, 兼容处理
		window.addEventListener(
			'error',
			async e => {
				const { currentSrc } = e.target;
				const urlNoParams = this.getUrlWithoutParams(currentSrc);
				if (!urlNoParams || this.fileErrorStore[urlNoParams]?.newUrl) {
					return;
				}
				console.log(`%c当前链接访问失败，url：${urlNoParams}`, `color: #ff4d4f;`);
				if (currentSrc) {
					this.fileErrorStore[urlNoParams] = {
						oldUrl: currentSrc,
						newUrl: '',
						success: false,
						timestamp: new Date().getTime(),
						retryTimes: 0
					};
					const httpsIndex = currentSrc.indexOf('https://');
					await this.generateFileUrl(currentSrc.slice(httpsIndex));
					this.startRetryTimer();
				}
			},
			true
		);
	}
	// 开启定时任务，定时检查图片加载失败的情况
	startRetryTimer() {
		const imagesError = [];
		Object.keys(this.fileErrorStore).forEach(key => {
			if (!this.fileErrorStore[key].success) {
				imagesError.push(this.fileErrorStore[key]);
			}
		});
		if (imagesError.length) {
			this.fileRetryTimer = setInterval(() => {
				this.findErrorImageAndRetryLoad();
			}, this.startRetryTimeInterval * 1000);
		}
	}
	base64ToArrayBuffer(base64) {
		const binaryString = window.atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}
	// 调用后端接口获取签名物料信息
	fetchSignMaterial() {
		if (!sessionStorage.getItem('VUEX_ST_TOKEN')) {
			return Promise.reject('未登录');
		}
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await API_GET_KEY({
					publicKey: this.publicKey?.replace('-----BEGIN PUBLIC KEY-----', '')?.replace('-----END PUBLIC KEY-----', ''),
					_t: new Date().getTime()
				});
				if (data) {
					this.key = data.key;
					this.keyId = data.keyId;
					this.userId = data.userId;
					this.expireTime = data.expireTime;
					this.createTime = data.createTime;
					await this.decryptData(data.key);
					resolve(data);
				}
			} catch (error) {
				reject(error);
			}
		});
	}
	// 重新生成密钥
	async regenerateKey() {
		await this.#initJSEncrypt();
	}
}

// new RsaDecrypt();

export default RsaDecrypt;
