import ENV from '@/v2/config/env';
import request from '@/api/request';

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

// 货转开具——获取货转开具修改信息
export function API_getApiGoodsTransferDOUpdList(orderNo, no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${orderNo}/${no}/updList`, {}, 'GET');
}

// 货转开具——查询货转订单批次
// export function API_getGoodsTransferDOOrderNoNext(orderNo) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/${orderNo}/next`, {}, "GET");
// }

// 货转开具——保存
// export function API_postApiGoodsTransferDOSave(data, orderNo, no) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/save/${orderNo}?no=${no ? no : ""}`, data, "POST", 2);
// }

// 货转开具——提交
// export function API_postApiGoodsTransferDOSubmit(data) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/submit`, data, "POST", 2);
// }

// 获取车皮信息
// export function API_getGoodsTransferDODeliverInfoTrains(deliverId) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/deliverInfoTrains/${deliverId}`, {}, "GET");
// }

// 货转开具——修改——保存
// export function API_postApiGoodsTransferDOModifySave(data, orderNo, no) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/save/${orderNo}?no=${no ? no : ""}`, data, "POST", 2);
// }

// export function API_GetShipDeliverInfoShips(deliverId, data) {
//   return request(`${ENV.BASE_API}/api/ship/deliverInfoShips/${deliverId}`, data, "GET");
// }

// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}
// 企业货转对接OA接口
export function API_COMPANYOACHECKV2(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa/v2`, data, 'GET');
}

// 货转证明——详情查看
// export function API_getApiGoodsTransferInfo(orderNo, no) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/${orderNo}/${no}/info`, {}, "GET");
// }

export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserId`, data, 'POST');
}

// 获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

// 货转开具——货转开具列表
// export function API_getGoodsTransferDOApplyList(data) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/goodsTransferApplyList`, data, "GET");
// }

// 货转证明——获取盖章带签名列表
export function API_getApiGoodsTransferDOApplyGetToSignList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/seller/getToSigList`, data, 'POST', 2);
}

// 货转证明盖章
export function API_postApiGoodsTransferDOToConfirm(goodsTransferNo) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/seller/confirm`, { goodsTransferNo }, 'GET');
}

// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}

// 开具货转证明盖章
export function API_CfcaGoodsTransferAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/goodsTransferAutoSignatureV2`, data, 'POST', 2);
}

// 货转-待确认状态下-点击确认-驳回货转
export function API_GoodsTransferRejectConfirm(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/buyer/reject`, data, 'POST', 2);
}

// 货转-待确认状态下-盖章获取
export function API_GoodsTransferConfirmGetToSigList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/buyer/getToSigList`, data, 'POST', 2);
}

//货转-待确认状态下-确认盖章
export function API_postApiGoodsTransferConfirm(goodsTransferNo) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/buyer/confirm`, { goodsTransferNo }, 'GET');
}

// 货转-待确认状态下-盖章获取signure
export function API_GoodsTransferConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/goodsTransferConfirmAutoSignatureV2`, data, 'POST', 2);
}

// 货转证明批量下载
// export function API_getApiGoodsTransferDOBatchDownload(data) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/batchDownload`, data, "GET", 1, "blob");
// }

// 货转证明——货转记录——新接口
// export function API_getApiGoodsTransferDoRecordList(data) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/goodsTransferRecordList`, data, "GET");
// }

// 货转证明——取消
// export function API_getApiGoodsTransferCancel(no) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/${no}/cancel`, {}, "GET");
// }

// 货转证明——作废
// export function API_postApiGoodsTransferInvalid(data) {
//   return request(`${ENV.BASE_API}/api/goodsTransferDO/invalid`, data, "POST");
// }

// 货转开具——查看货转，获取url
export function API_getGoodsTransfeUrl(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/getGoodsTransferAttach`, data, 'GET');
}

// 货转状态提示
// export function goodsTransferDo(data) {
//   return request(`${ENV.BASE_NET}api/goodsTransferDO/getStatusTip`, data, "GET");
// }

//货转-货转开具-被选择销售合同列表
export function API_goodsTransferApplyList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/goodsTransferApply/List`, data, 'POST', 2);
}
//货转-货转开具-被选择销售合同详情
export function API_goodsTransferApplyDetail(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/goodsTransferApply/detail`, data, 'POST', 2);
}

//货转-货转开具-电子合同开具预览
export function API_goodsTransferApplyPreView(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/goodsTransferApply/preView`, data, 'POST', 2);
}
//货转-货转开具-货转列表
export function API_goodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/list`, data, 'POST', 2);
}
//货转-货转开具-货转保存
export function API_goodsTransferSave(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/save`, data, 'POST', 2);
}
//货转-货转开具-货转提交
export function API_goodsTransferSubmit(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/submit`, data, 'POST', 2);
}
//货转-货转开具-货转详情
export function API_goodsTransferDetail(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/detail`, data, 'GET');
}
//货转-货转开具-货转删除
export function API_goodsTransferDelete(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/delete`, data, 'GET');
}
//货转-货转开具-货转作废
export function API_goodsTransferCancel(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/cancel`, data, 'POST', 2);
}
//货转-货转开具-货转下载
export function API_goodsTransferBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/batchDownload`, data, 'POST', 2, 'blob');
}
//货转-货转管理-列表-状态提示
export function API_goodsTransferGetStatusTip(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/getStatusTip`, data, 'GET');
}
