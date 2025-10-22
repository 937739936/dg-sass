/**地址采取
 * Obj入参值，可为对象或字符串
 */
function urlFind(Obj) {
	let fileUrl = '';
	if (Obj instanceof Object) {
		if (Obj.response) {
			fileUrl = Obj.response.data.path || Obj.response.data.fileUrl;
		} else {
			fileUrl =
				Obj.fileUrl ||
				Obj.path ||
				Obj.url ||
				Obj.attachment ||
				Obj.filePath ||
				Obj.ticketUrl ||
				Obj.loadingTicketUrl ||
				Obj.file ||
				Obj.attachmentPath;
		}
	} else if (typeof Obj == 'string') {
		fileUrl = Obj;
	}
	if (fileUrl && fileUrl.indexOf(',') > 0) {
		fileUrl = fileUrl.substring(0, fileUrl.indexOf(','));
	}
	let url = fileUrl;
	return url;
}
/**
 * @function filePreview
 * @params {url} 文件预览url
 * @params {cb} 图片文件类型预览回调
 */
export const filePreview = (Obj, cb, isStatic = false, index = 0) => {
	let url = urlFind(Obj);
	//判断文件是否为图片/视频
	let front_url = url.split('?')[0]
	let ext = front_url.substr(front_url.lastIndexOf('.') + 1);
	let img = ['png', 'jpeg', 'jpg', 'gif'].indexOf(ext.toLowerCase()) !== -1;
	let wps = ['doc', 'docx', 'xlsx', 'xls'].indexOf(ext.toLowerCase()) !== -1;
	if (img) {
		let previewImageList = [];
		previewImageList.push(url);
		cb && cb(previewImageList, isStatic, index);
	} else if (wps) {
		window.open('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url), '_blank');
	} else {
		window.open(url, '_blank');
	}
};
