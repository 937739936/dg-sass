// BUY_CONTRACT_NO("采购合同编号"),
// SELL_CONTRACT_NO("销售合同编号"),
// GOODS_NAME("品名"),
// DELIVERY_DATE("交货期限"),
// TRANS_TYPE("运输方式"),
// ARRIVE_STATION("到站"),
// RECEIVE_ADDR("收货地址"),
// DISCHARGING_PORT("卸货港"),
// RECEIVER_NAME("收货人")
export const errorInfo = {
	BUY_CONTRACT_NO: '采购合同已关联其他销售合同，对应业务线为：',
	SELL_CONTRACT_NO: '销售合同已关联其他采购合同，对应业务线为：',
	GOODS_NAME: '采购合同与销售合同的品名不一致',
	DELIVERY_DATE: '上游合同的交货截止日不在下游合同的交货期限内',
	TRANS_TYPE: '采购合同与销售合同的运输方式不一致',
	ARRIVE_STATION: '采购合同与销售合同的到站不一致',
	RECEIVE_ADDR: '采购合同与销售合同的收货地址不一致',
	DISCHARGING_PORT: '采购合同与销售合同的卸货港不一致',
	RECEIVER_NAME: '采购合同与销售合同的收货人不一致'
};
