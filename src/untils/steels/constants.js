
const obj = {
    // 合同状态
    "contractStatusDict": {
        "DRAFT": "DRAFT", //草稿
        "AUDIT": "AUDIT", //审批中
        "TO_BE_CONFIRMED": "TO_BE_CONFIRMED", //待确认
        "TO_BE_SIGN_UP": "TO_BE_SIGN_UP", //待签约
        "IN_EXECUTION": "IN_EXECUTION", //执行中
        "FINISHED": "FINISHED", //已完成
        "REJECTED": "REJECTED", //审核驳回
    },
    "deliverFileDict": {
        "REINFORCEMENT_PLAN": "钢筋计划", //钢筋计划
        "UPSTREAM_DOCUMENTS": "上游收货凭证", //上游收货凭证
        "DOWNSTREAM_DOCUMENTS": "下游收货凭证", //下游收货凭证
        'WEIGHING_LIST': '过磅单',
        'SHIPMENT_LIST': '发货单',
        'TRANSPORT': '运输凭证',
    },
}

export default obj

