import ENV from '@/v2/config/env';
/**
 * @function filePreview
 * @params {url} 文件预览url
 * @params {cb} 图片文件类型预览回调
 */
export const filePreview = (url, cb, isStatic = false, index = 0) => {
	const canUsefileType = ['.doc', '.docx', '.xlsx', '.xls'];
	const canUseImageType = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
	if (Array.isArray(url)) {
		cb && cb(url, isStatic, index);
		return;
	}
	const front_url = url.split('?')[0]; // url去掉参数
	const lastIndex = front_url.lastIndexOf('.');
	const currentFileType = front_url.substring(lastIndex, url.length).toLowerCase();
	const previewUrl = url;
	if (canUsefileType.includes(currentFileType)) {
		const fileUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewUrl)}`;
		window.open(fileUrl, '_blank');
	} else if (currentFileType === '.pdf') {
		window.open(previewUrl, '_blank');
	} else if (canUseImageType.includes(currentFileType)) {
		let previewImageList = [];
		previewImageList.push(url);
		cb && cb(previewImageList, isStatic, index);
	} else if (['.zip', '.rar', '.mp4', '.avi','.3gp', 'mkv', '.pptx', '.txt'].includes(currentFileType)) {
		window.open(previewUrl, '_blank');
	} else {
		throw new Error('不支持的文件预览类型');
	}
};

export const getPreviewUrl = url => {
	return url;
};
