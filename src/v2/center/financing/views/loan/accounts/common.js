import constants from '@sub/utils/constants.js';
export const financeCompanyUscc = [
	constants.rzlhUscc,
	constants.hnycUscc,
	constants.nxyhUscc,
	constants.ytyhUscc,
	constants.zhzlUscc,
	constants.jhblUscc,
	constants.ghblUscc,
	constants.sxycUscc,
	constants.gdyhUscc,
	constants.sxyhUscc,
	constants.jxjjUscc,
	constants.wwylUscc
];

export const financeCompanyUsccCheck = (uscc, record) => {
	if (record && record.paymentType) {
		return financeCompanyUscc.includes(uscc) || record.paymentType == 'receivable-shanmei';
	}

	return financeCompanyUscc.includes(uscc);
};
