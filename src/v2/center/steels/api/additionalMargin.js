/**
 * api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';
// 追保函新增选择合同
export const getMaterialContractList = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/getContractPage`, data, 'GET');
/** 追保函新增 */
export const getMaterialDetail = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/material`, data, 'GET');
// 追保函列表
export const getBondLetterList = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/getPage`, data, 'GET');
// 追保函详情
export const getBondLetterDetail = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/detail`, data, 'GET');
/** 追保函保存 */
export const saveBondLetter = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/save`, data, 'POST', 2);
/** 追保函提交 */
export const submitBondLetter = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/submit`, data, 'POST', 2);
/** 追保函预览 */
export const previewBondLetter = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/preview`, data, 'POST', 2);
// 追保函作废
export const invalidBondLetter = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/cancel`, data, 'GET');
// 追保函完结
export const completeBondLetter = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/complete`, data, 'GET');
// 签章auto
export const bondLetterSealAuto = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/seal/auto`, data, 'POST', 2);
// 签章uk
export const bondLetterSealUkey = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/seal/ukey`, data, 'POST', 2);
// 签章完成通知
export const bondLetterSignAfterConfirm = data => request(`${ENV.BASE_GANG_API}/api/bondLetter/signAfterConfirm`, data, 'PUT');
// 追保函作废
// export const invalidBondLetter = (data) => request(`${ENV.BASE_GANG_API}/api/bondLetter/cancel`, data, 'GET')
