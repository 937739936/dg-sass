// 善美保理-融单，善美融单-非流转 资金类型
export const shanMeiPayType = ['product-shanmei-bill', 'product-shanmei-bill-non'];
// 付款 类型转换
export const fileEnum = {
	// 核算表
	28: 'HSB',
	// 核算表PDF版
	34: 'HSB_PDF',
	// 代发证明
	6: 'DFZM',
	// 委托结算函
	7: 'WTJSH',
	// 履约保证金凭证/转保证金文件
	50: 'BOND_CREDENTIALS',
	// 保证金承诺函
	51: 'BOND_LETTER',
	// 货权凭证
	52: 'PROOF_CREDENTIALS',

	// 上传上游其他材料
	53: 'UP_OTHER',
	// 上传下游其他材料
	54: 'DOWN_OTHER',
	// 仓储合同
	56: 'STORAGE_FILE',
	// 合同签订现场材料
	57: 'SCENE_SIGN_IMG',
	// 开票变更材料
	58: 'INFO_CHANGE_FILE',
	// 其他证明材料
	59: 'OTHER_PROVE_FILE',
	// 提货通知单
	60: 'LADING',
	// 收货证明
	61: 'RECEIPT',
	// 质量验收单据
	62: 'RECEIPT_QUALITY',
	// 数量验收单据
	63: 'RECEIPT_QUANTITY',
	// 仓库相关单据
	64: 'RECEIPT_STORE',
	// 出库单据
	65: 'RECEIPT_OUT',
	// 还款信息
	66: 'REPAY_PDF',

	// 保证金支付凭证
	76: 'BZJ_ZF_PJ',
	// 量价确认函
	77: 'LJQE_LETTER',
	// 担保函
	78: 'DB_LETTER',
	// 保单
	83: 'GUARANTEE_SLIP',
	// 中标佐证
	94: 'THE_WINNING_POINT'
};
