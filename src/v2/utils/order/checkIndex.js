// mode:'check'代表考核指标，'other'代表其他因素
// type: 1=热值,2'==硫分,3=水分,4=挥发分,5=灰分,'6=灰熔点 7，8，9，10，11，12
// templateId:考核指标的热值模式1，2，3，4
export function getColumns (mode, type, templateId) { // 表格表头
    const temp = [ // 考核指标非热值
        { title: '变化幅度' + (type == 6 ? '(°C)':'(%)'), dataIndex: 'changeRange', key: 'changeRange', scopedSlots: { customRender: 'changeRange' }, width: 130 },
        { title: '价钱增减额(元/吨)', dataIndex: 'priceChange', key: 'priceChange', scopedSlots: { customRender: 'priceChange' } },
        { title: '增减基准' + (type == 6 ? '(°C)':'(%)'), dataIndex: 'changeBase', key: 'changeBase', scopedSlots: { customRender: 'changeBase' }, width: 130},
        { title: '加权方式', dataIndex: 'weightMethod', key: 'weightMethod', scopedSlots: { customRender: 'weightMethod' } },
        { title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' }, width: 100}
    ]
    const tempRZ1 = [ // 考核指标热值模版1
        { title: '增减基准  (千卡/千克)', dataIndex: 'changeBase', key: 'changeBase', scopedSlots: { customRender: 'changeBase' }, width: 110 },
        { title: '变化幅度  (千卡/千克)', dataIndex: 'changeRange', key: 'changeRange', scopedSlots: { customRender: 'changeRange' }, width: 110 },
        { title: '不足时', dataIndex: 'computeMethod', key: 'computeMethod', scopedSlots: { customRender: 'computeMethod' } },
        { title: '价格增减额', dataIndex: 'priceChange', key: 'priceChange', scopedSlots: { customRender: 'priceChange' }},
        { title: '热值加权方式', dataIndex: 'weightMethod', key: 'weightMethod', scopedSlots: { customRender: 'weightMethod' }},
        { title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' }, width: 100}
    ]
    const tempRZ2 = [ // 考核指标热值模版2
        { title: '热值基准价格', dataIndex: 'basePriceBox', key: 'basePriceBox', scopedSlots: { customRender: 'basePriceBox' } },
        { title: '热值加权方式', dataIndex: 'weightMethod', key: 'weightMethod', scopedSlots: { customRender: 'weightMethod' }},
        { title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' }, width: 100}
    ]
    const tempRZ3 = [ // 考核指标热值模版3，4
        { title: '增减基准  (千卡/千克)', dataIndex: 'changeBase', key: 'changeBase', scopedSlots: { customRender: 'changeBase' }, width: 110 },
        { title: '基准价格', dataIndex: 'basePriceBox', key: 'basePriceBox', scopedSlots: { customRender: 'basePriceBox' } },
        { title: '变化幅度  (千卡/千克)', dataIndex: 'changeRange', key: 'changeRange', scopedSlots: { customRender: 'changeRange' }, width: 110  },
        { title: '不足时', dataIndex: 'computeMethod', key: 'computeMethod', scopedSlots: { customRender: 'computeMethod' } },
        { title: '价格增减额', dataIndex: 'priceChange', key: 'priceChange', scopedSlots: { customRender: 'priceChange' }},
        { title: '热值加权方式', dataIndex: 'weightMethod', key: 'weightMethod', scopedSlots: { customRender: 'weightMethod' }},
        { title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' }, width: 100}
    ]
    const tempRZ4 = tempRZ3
    const tempOther = [ // 其他因素
        { title: '增扣金额(元/吨)', dataIndex: 'priceChange', key: 'priceChange', scopedSlots: { customRender: 'priceChange' },width: 240},
        { title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' }, width:115}
    ]
    const typeTitle = { // 1-6是考核指标  7-12是其他因素
        1: '热值变化区间（千卡/千克）',
        2: '含硫百分比(%)',
        3: '含水百分比(%)',
        4: '挥发分百分比(%)',
        5: '灰分百分比(%)',
        6: '灰熔点(°C)',
        7: '热值变化区间（千卡/千克）',
        8: '含硫百分比(%)',
        9: '含水百分比(%)',
        10: '挥发分百分比(%)',
        11: '灰分百分比(%)',
        12: '灰熔点(°C)',
    }
    var columns = []
    if (type == 1) { // 热值
        columns.push({ title: typeTitle[type], dataIndex: 'content', key: 'content', scopedSlots: { customRender: 'content' }})
        if (mode == 'check') {
            columns = columns.concat((templateId == 1)? tempRZ1 : ((templateId == 2) ? tempRZ2 : (templateId == 3 || templateId == 4)? tempRZ4 : []))
        }
    } else { // 非热值
        columns.push({ title: typeTitle[type], dataIndex: 'content', key: 'content', scopedSlots: { customRender: 'content' }})
        columns = columns.concat((mode == 'check')?temp:[])
    }
    columns = columns.concat((mode == 'other')?tempOther:[]) // 其他因素
    return columns
}
const indexArr = [ // type: 1=热值,2'==硫分,3=水分,4=挥发分,5=灰分,'6=灰熔点
    [{key:1, name:'Qnet,ar'}],
    [
        {key:1, name:'St,d'},
        {key:2, name:'St,ad'},
        {key:3, name:'St,ar'}
    ],
    [
        {key:1, name:'Mt'},
        {key:2, name:'Mt,ar'},
        {key:3, name:'Minh'}
    ],
    [
        {key:1, name:'Vdaf'},
        {key:2, name:'Vad'},
        {key:3, name:'Var'},
    ],
    [
        {key:1, name:'Ad'},
        {key:2, name:'Aad'},
        {key:3, name:'Aar'},
    ],
    [
        {key:1, name:'ST'},
        {key:2, name:'DT'},
        {key:3, name:'FT'},
    ]
]
export function getIndexName (mode,type) { // 参数名
    return indexArr[mode=='check'?parseInt(type)-1 : parseInt(type)-7]
}
