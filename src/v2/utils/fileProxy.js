import pdfjsLib from 'pdfjs-sig';

// 不需要添加签名的 URL
const excludeUrl = ['https://hm.baidu.com'];
/**
 * 拦截 AJAX 请求
 *
 * 该函数通过修改 XMLHttpRequest 对象的 open 方法，在原始 open 方法执行前后插入自定义逻辑，
 * 从而实现对 AJAX 请求的拦截和处理。
 */
function hookAJAX() {
	XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;
	var customizeOpen = function (method, url, async, user, password) {
		// console.info("hook ajax", url);
		this.nativeOpen(method, url, async, user, password);
	};
	XMLHttpRequest.prototype.open = customizeOpen;
}

/**
 * 钩子函数，用于自定义图片源设置的行为
 *
 * 该函数通过劫持 Image 对象的 src 属性的 setter 方法，
 * 在每次设置图片源时执行自定义的逻辑，如添加签名。
 */
function hookImg() {
	const property = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
	const nativeSet = property.set;
	// console.info("hook img", nativeSet)
	function customiseSrcSet(url) {
		console.info('hook img src', url);
		nativeSet.call(this, `${url}?a=111`);
	}
	Object.defineProperty(Image.prototype, 'src', {
		set: customiseSrcSet
	});
}

/**
 * 钩子函数，用于自定义HTMLAnchorElement元素的href属性设置行为
 */
function hookATarget() {
	const property = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');
	const nativeSet = property.set;
	function customiseSrcSet(url) {
		console.info('hook a href', url);
		nativeSet.call(this, `${url}?a=222`);
	}
	Object.defineProperty(HTMLAnchorElement.prototype, 'href', {
		set: customiseSrcSet
	});
}

/**
 * 钩子函数，用于拦截 window.open 方法的调用
 *
 * 当调用 window.open 时，此函数会拦截并调用原生的 window.open 方法
 * dg-trade-api/trade-files/20241126/water-mark/91d1199ef1594a87a562ae703c2d4364.xlsx
 * dg-trade-api/trade-files/20241126/water-mark/8d02d2946cd14c6996f4f3e1442ee953.docx
 * /dg-trade-api/trade-files/20241125/water-mark/f32ef7b9c09a40368dc5483fb1b31351.pdf
 *
 * @returns {void} 无返回值
 */
function hookOpen() {
	const nativeOpen = window.open;
	window.open = function (url) {
		console.info('hook open', url);
		// pdfjsLib.getDocument(url).promise.catch(function (reason) {
		//   console.error('PDF加载失败: ', reason);
		//   // 处理加载失败的情况，比如显示错误消息或重定向等
		// });
		nativeOpen.call(this, `${url}?a=333`);
	};
}

/**
 * 钩子函数，用于拦截和修改 fetch 请求
 *
 * @returns 无返回值
 */
function hookFetch() {
	var fet = Object.getOwnPropertyDescriptor(window, 'fetch');
	Object.defineProperty(window, 'fetch', {
		value: function (a, b, c) {
			console.info('hook fetch', a);
			return fet.value.apply(this, args);
		}
	});
}

/**
 * 监听页面a标签的点击事件
 */
function hookClick() {
	document.addEventListener('click', function (e) {
		if (e.target && e.target.tagName === 'A') {
			console.info('hook click', e);
			const { href, target } = e.target;
			if (href && target === '_blank') {
				e.preventDefault();
				window.open(`${href}?a=444`, '_blank');
			}
		}
	});
}

hookImg();
hookOpen();
hookATarget();
hookClick();
hookAJAX();
hookFetch();
