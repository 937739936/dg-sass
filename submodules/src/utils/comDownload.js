/**
 * 下载数据流
 * @param res  数据流
 * @param url  文件url，主要用来截取获得下载文件的名字
 * @param name  如果该字段存在，则使用该字段作为文件名
 */
function getFileNameFromUrl(url) {
	try {
		// 创建一个 URL 对象
		const urlObj = new URL(url);

		// 获取路径部分
		const pathname = urlObj.pathname;

		// 使用字符串的 lastIndexOf 和 substring 方法来提取文件名
		const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

		return filename;
	} catch (error) {
		// 如果 URL 格式不正确，则捕获错误并返回 null 或抛出一个新的错误
		console.error('Invalid URL:', error);
		return null;
	}
}
export default function comDownload(res, url, name) {
	let title = name;
	if (!name && url) {
		title = getFileNameFromUrl(url);
		if (!title) {
			// 这里主要是为了解决window和mac返回路径中斜线不一致的问题，window返回的路径以'\'分割，mac返回路径以'/'分割
			// 这个问题目前只有本地有问题，线上服务器是linux系统，使用的是'/'
			if (url.lastIndexOf('/') > url.lastIndexOf('\\')) {
				title = url.substring(url.lastIndexOf('/') + 1);
			} else if (url.indexOf('\\') > -1) {
				title = url.substring(url.lastIndexOf('\\') + 1);
			}
		}
	}
	let blob;
	if (res instanceof Blob) {
		blob = res;
	} else {
		blob = new Blob([res]);
	}
	if ('msSaveOrOpenBlob' in navigator) {
		// 判断是ie的浏览器，调用ie文件下载的方法
		window.navigator.msSaveOrOpenBlob(blob, title);
	} else {
		let elink = document.createElement('a');
		elink.download = title;
		elink.style.display = 'none';
		elink.href = URL.createObjectURL(blob);
		document.body.appendChild(elink);
		elink.click();
		document.body.removeChild(elink);
	}
}
