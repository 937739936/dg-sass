<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">质押物详情</span>
            </div>
            <a-form :label-col="{ span: 9}" :wrapper-col="{span: 15}">
                <div class="bottom-box">
                    <div class="s-card-content">
                        <h2>基本信息</h2>
                        <a-row class="row">
                            <a-col span="8">
                                <a-row>
                                    <a-form-item label="货主名称">
                                    {{detailData.goodsCompanyName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="货物名称">
                                    {{detailData.goodsName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="质押货值（元）">
                                    {{detailData.pledgeGoodsValue}}
                                    </a-form-item>
                                </a-row>
                            </a-col>
                            <a-col span="8">
                                <a-row>
                                    <a-form-item label="仓库名称">
                                    {{detailData.storageName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="存货点">
                                    {{detailData.inventoryPoint}}
                                    </a-form-item>
                                </a-row>
                            </a-col>
                            <a-col span="8">
                                <a-row>
                                    <a-form-item label="仓储企业">
                                    {{detailData.storageCompanyName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="质押数量（吨）">
                                    {{detailData.pledgeQuantity}}
                                    </a-form-item>
                                </a-row>
                            </a-col>
                        </a-row>
                    </div>

                </div>
            </a-form>
            <div class="s-card-content" style="padding-bottom: 30px;">
                <h2>质押详情</h2>
                <a-table
                    :columns="goodsColumn"
                    :dataSource="detailData.financingPledgeVOList||[]"
                    :pagination="false"
                    rowKey="id"
                    :locale="{emptyText: '暂无数据'}"
                >
                    <div slot="action" slot-scope="action, items">
                        <a style="margin-right: 8px;" @click="openFin(items)">融资详情</a>
                    </div>
                </a-table>

                <div style="text-align:center;margin-top:40px;">
                    <a-button @click="$router.back()" type="primary" ghost>返回</a-button>
                </div>
            </div>
        </a-card >
    </div>
</template>
<script>
    import { filterCodeByValueName } from '@sub/utils/globalCode.js'
    import { API_PledgeExchangeDetail} from '@/api'
    import moment from 'moment';

    export default {
        data() {
            return {
                moment,
                filterCodeByValueName: filterCodeByValueName,
                detailData:{},
                goodsColumn:[
                    { title: '融资编号', dataIndex: 'serialNo', key: 'serialNo'},
                    { title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint'},
                    { title: '质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity'},
                    { title: '质押货值（元）', dataIndex: 'pledgeGoodsValue', key: 'pledgeGoodsValue'},
                    { title: '金融机构', dataIndex: 'bankName', key: 'bankName',},
                    { title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate'},
                    { title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
            }
        },
        components: {
        },
        computed: {
        },
        mounted: function () {
            let query = this.$route.query
            API_PledgeExchangeDetail({goodsCompanyUscc: query.goodsCompanyUscc,inventoryPointId:query.inventoryPointId}).then(res=>{
                if (res.success) {
                    this.detailData = res.data||{}
                }
            })
        },
        methods: {
            openFin(record){
                const { href } = this.$router.resolve({
                    path:'/center/financing/financingPledgeDetail',
                    query: {
                        id: record.financingApplyId,
                    }
                });

                window.open(href,'_new')
            }

        }
        
    }
</script>
<style lang="less" scoped>
    ::v-deep .ant-form-item-label {
        text-align: left;
        label {
            color:#6B6F76;
        }
    }
	.top-box {
		box-shadow: 0 2px 10px 0 #DDDFE4;
		overflow: hidden;
		border-radius: 8px;
		background: #fff;
		.s-card-title {
			margin-left: 20px;
			margin-top: 20px;
			font-family: PingFangSC-Medium;
			color: #141517;
			line-height: 24px;
			justify-content: space-between;
			padding-right: 20px;
			a {
				cursor: pointer;
			}
		}
		.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
			color: #6B6F76;
		}
		.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
			color: #383A3F;
		}
	}
	.bottom-box {
		.s-card-content .ant-row .ant-col:first-child {
			color: #6B6F76;
		}
		.s-card-content .ant-row .ant-col:last-child {
			color: #383A3F;
		}
	}
	.s-card-content{
		padding: 20px 16px 24px 16px;
		border-radius: 8px;
		background: #fff;
		margin: 14px 0 0 0;
		.row .ant-col {
            margin-top:8px;
			margin-bottom: 8px;
			text-overflow: ellipse;
			white-space: nowrap;
			overflow: hidden;
		}

		.ant-row .ant-col {
			margin-bottom: 8px;
            margin-top:8px;
		}
		h2 {
			font-style: normal;
			font-family: PingFangSC-Medium;
			font-size: 14px;
			color: #141517;
			line-height: 22px;
			margin-bottom: 16px;
		}
	}
	.divider {
      background: #f4f5f8;
      height: 1px;
      margin-top:20px;
      margin-left: -20px;
      margin-right: -20px;
    }


</style>
