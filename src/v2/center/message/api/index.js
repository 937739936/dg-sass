import ENV from '@/v2/config/env';
import request from '@/api/request';
// 预警解除审批
export const artificialProcess = data => request(`${ENV.BASE_API}/api/riskAlertRecord/artificialProcess`, data, 'POST', 2);
