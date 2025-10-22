<template>
    <div class="lay-container">
        <div class="lay-wrapper">
            <div class="wrap-1200">
                <div class="menu-wrap">
                    <div class="menu-block">
                        <router-link to="/">
                            <img src="~@/assets/imgs/logo.png" style="width: 122px; position: relative; top: -8px" />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="logistics-box">
                <div class="logistics-detail-car">
                    <div class="info-box">
                        <div class="title">汽车行驶轨迹跟踪</div>
                        <div class="title-auxiliary">发货信息</div>
                        <ul class="info">
                            <li>
                                <label>合同号</label>
                                <span>{{ data.contractNo }}</span>
                            </li>
                            <li>
                                <label>发货批次号</label>
                                <span>{{ data.batchNo }}</span>
                            </li>
                            <li>
                                <label>收货地址</label>
                                <span>{{ data.receiveAddr }}</span>
                            </li>
                        </ul>
                        <div class="title-auxiliary">发货信息</div>
                        <div class="map-box">
                            <div class="carMap">
                                <MapRouteCarZX
                                    :siteInfo="automobileTrackDTO || {}"
                                    :plateNumber="data.plateNumber"
                                ></MapRouteCarZX>
                            </div>
                            <a-button
                                type="link"
                                v-show="!listVisible"
                                class="bottomUp link-but"
                                @click="listVisible = true"
                            >
                                停留点<a-icon type="caret-up" />
                            </a-button>
                            <a-drawer
                                placement="bottom"
                                :closable="false"
                                :visible="listVisible"
                                :get-container="false"
                                :mask="false"
                                wrapClassName="list"
                                height="316"
                                :wrap-style="{ position: 'absolute' }"
                            >
                                <a-space :size="12" direction="vertical">
                                    <a-row type="flex">
                                        <a-col flex="auto">
                                            <span class="tableTitle"> 停留点({{ parks.length || 0 }}) </span>
                                        </a-col>
                                        <a-col flex="100px">
                                            <a-space :size="10">
                                                <a-button type="primary" ghost @click="parkExport('停留点')">
                                                    <a-space align="center">
                                                        <img width="18" src="~@/assets/imgs/map/tableFile.png" alt="" />
                                                        导出
                                                    </a-space>
                                                </a-button>
                                                <a-button @click="onClose" type="link">
                                                    <img width="16" src="~@/assets/imgs/map/close.png" />
                                                </a-button>
                                            </a-space>
                                        </a-col>
                                    </a-row>
                                    <a-table
                                        :columns="columns"
                                        :data-source="automobileTrackDTO.parks || []"
                                        :bordered="false"
                                        :rowKey="(record, index) => index"
                                        :scroll="{ y: 185 }"
                                        :pagination="false"
                                    >
                                    </a-table>
                                </a-space>
                            </a-drawer>

                            <a-drawer
                                placement="left"
                                :closable="false"
                                :visible="detailVisible"
                                :get-container="false"
                                wrapClassName="detail"
                                :mask="false"
                                width="227"
                                :wrap-style="{ position: 'absolute' }"
                            >
                                <div class="body1">
                                    <a-space direction="vertical" :size="4">
                                        <div class="cardetail-title">
                                            <span>车牌号:{{ data.plateNumber }}</span>
                                            <img
                                                width="16"
                                                @click="detailVisible = false"
                                                src="~@/assets/imgs/map/close.png"
                                                alt=""
                                            />
                                        </div>
                                        <span>
                                            {{ data.deliverDate | momentYMDHM }}至{{ data.arriveDate | momentYMDHM }}
                                        </span>
                                        <span>司机姓名:{{ data.driverName }}</span>
                                        <span>司机联系方式:{{ data.driverMobile }}</span>
                                    </a-space>
                                </div>
                                <div class="body2">
                                    <a-space direction="vertical" :size="4">
                                        <div class="cardetail-title">总里程:{{ automobileTrackDTO.mileage }}</div>
                                        <a-timeline>
                                            <a-timeline-item>
                                                <img width="20" slot="dot" src="~@/assets/imgs/map/car_start.png" />
                                                {{ automobileTrackDTO.startPoint }}
                                            </a-timeline-item>
                                            <a-timeline-item>
                                                <img width="20" slot="dot" src="~@/assets/imgs/map/car_end.png" />
                                                {{ automobileTrackDTO.endPoint }}
                                            </a-timeline-item>
                                        </a-timeline>
                                    </a-space>
                                </div>
                            </a-drawer>
                            <a-button
                                type="link"
                                :class="{
                                    cardetail: true,
                                    'link-but': true,
                                    'link-vis': detailVisible,
                                }"
                                @click="detailVisible = !detailVisible"
                            >
                                详情<a-icon :type="detailVisible?'caret-up':'caret-down'" />
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import { getAction, downFile } from '@/api/manage'
import MapRouteCarZX from '@/components/map/MapRouteCarZX'
import moment from 'moment'
import {
  API_ShipmentPlanTrucksDetail,
  API_ShipmentPlanTruckTraceExport
} from "@/v2/center/steels/api/deliverPlan.js";
export default {
    name: 'logisticsDetailCarNew',
    data() {
        return {
            params: {},
            listVisible: true,
            detailVisible: true,
            data: {},
            columns: [
                {
                    title: '序号',
                    dataIndex: 'rowIndex',
                    width: 80,
                    customRender: function (t, r, index) {
                        return parseInt(index) + 1
                    },
                },
                { title: '停留开始时间', dataIndex: 'parkStartTime', width: 200 },
                { title: '停留持续时间(分钟)', dataIndex: 'partDuration', width: 200 },
                { title: '停留结束时间', dataIndex: 'parkEndTime', width: 200 },
                { title: '地址', dataIndex: 'partAddress' },
            ],
        }
    },
    computed: {
        automobileTrackDTO() {
            return this.data?.automobileTrackDTO || {}
        },
        parks() {
            return this.automobileTrackDTO?.parks || []
        },
    },
    filters: {
        momentYMDHM(date) {
            if (date) {
                return moment(date).format('MM-DD HH:mm')
            } else {
                return ''
            }
        },
    },
    mounted() {
        this.params = this.$route.query
        this.dispatchPlanTruck()
    },
    components: {
        MapRouteCarZX,
    },
    methods: {
        onClose() {
            this.listVisible = false
        },
        //获取轨迹信息
        dispatchPlanTruck() {
            API_ShipmentPlanTrucksDetail({ id: this.$route.query.id }).then((res) => {
                if (res.success) {
                    this.data = res.data
                }
            })
        },
        //停留点导出
        parkExport(fileName) {
            if (!fileName || typeof fileName != 'string') {
                fileName = '导出文件'
            }
            let param = { id: this.$route.query.id }
            param.method = 'get'
            API_ShipmentPlanTruckTraceExport(param).then((data) => {
                if (!data) {
                    this.$message.warning('文件下载失败')
                    return
                }
                if (data.fileName) {
                    fileName = data.fileName.replace('.xls', '').replace('.xlsx', '').replace('.zip', '')
                }
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls')
                } else {
                    let url = window.URL.createObjectURL(new Blob([data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName + '.xls')
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link) //下载完成移除元素
                    window.URL.revokeObjectURL(url) //释放掉blob对象
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.wrap-1200 {
    width: 1200px;
    margin: 0 auto;
    height: 64px;
    padding: 12px 0;
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .menu-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 9999;
    }
}
.logistics-box {
    background: #f4f5f8;
    .logistics-detail-car {
        padding: 30px 0;
        width: 1200px;
        margin: 0px auto;
        .info-box {
            background: #ffffff;
            padding: 0 20px 15px;
            margin-bottom: 20px;
            .title {
                border-bottom: 1px solid #e9effc;
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.8);
                line-height: 28px;
                padding: 20px 0px 20px;
            }
            .title-auxiliary {
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.8);
                line-height: 24px;
                padding: 30px 16px;
                position: relative;
                &:before {
                    position: absolute;
                    content: '';
                    width: 2px;
                    border-radius:2px 0 0 2px ;
                    height: 16px;
                    left: 0px;
                    top: 50%;
                    -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
                    background: #4682f3;
                }
            }
            .info {
                font-size: 16px;
                color: #999;
                margin-bottom: 0;
                padding:0;
                li {
                    width: 25%;
                    display: inline-block;
                    margin-bottom: 24px;
                    label {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #8495aa;
                        line-height: 22px;
                        display: block;
                        margin-bottom: 6px;
                    }
                    span {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.8);
                        line-height: 22px;
                        display: block;
                    }
                }
            }
        }
    }
    .map-box {
        position: relative;
        height: 780px;
        overflow: hidden;
        .carMap {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
        }
        .bottomUp {
            width: 100px;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            bottom: 0;
        }
        .link-but {
            height: 44px;
            padding: 12px;
            background: #ffffff;
            box-shadow: 0px -1px 2px 2px rgba(6, 31, 77, 0.05);
            border-radius: 2px 2px 0px 0px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #8b9db8;
            line-height: 18px;
        }
        .link-vis {
            color: #4682f3;
        }
        .cardetail {
            position: absolute;
            left: 16px;
            top: 16px;
            background: #fff;
            border-radius: 4px;
        }
        /deep/.detail {
            .ant-drawer-content-wrapper {
                top: 68px;
                left: 16px;
                height: 350px;
                border-radius: 6px;
                overflow: hidden;
                transform: translatex(calc(-100% - 16px)) !important;
                .ant-drawer-wrapper-body {
                    overflow: hidden;
                }
                .ant-drawer-body {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    padding: 0;
                    color: rgba(0, 0, 0, 0.8);
                    line-height: 22px;
                    overflow: hidden;
                    .cardetail-title {
                        width: 190px;
                        font-weight: 600;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                        img {
                            cursor: pointer;
                        }
                    }
                    .body1 {
                        padding: 16px 16px 14px;
                        background: #f4f9fd;
                        border: 1px solid #f4f5f8;
                    }
                    .body2 {
                        padding: 16px 16px 14px;
                    }
                }
            }
            &.ant-drawer-open {
                .ant-drawer-content-wrapper {
                    transform: none !important;
                }
            }
        }
        /deep/.list {
            .ant-drawer-content-wrapper {
                left: 0;
                right: 0;
                margin: 0 auto;
                bottom: 13px;
                width: 97.7%;
                border-radius: 6px;
                overflow: hidden;
                transform: translateY(calc(100% + 13px)) !important;
                .ant-drawer-body {
                    padding: 16px;
                    .tableTitle {
                        font-size: 18px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: rgba(0, 0, 0, 0.8);
                        line-height: 28px;
                    }
                    .ant-table-thead > tr > th {
                        background: #f5f7fd;
                        font-size: 14px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #8b9db8;
                    }
                    .ant-table-body tr td {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.8);
                    }
                }
            }
            &.ant-drawer-open {
                .ant-drawer-content-wrapper {
                    transform: none !important;
                }
            }
        }
    }
}
/deep/.ant-timeline-item-head-custom {
    padding:0 1px;
}
</style>
