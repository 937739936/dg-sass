<template>
    <div>
        <default-layout v-if="!ifHideHead">
            <div class="logistics-detail">
                <div class="title">
                    铁路货运跟踪
                </div>
                <ul class="info">
                    <li>
                        批次号：<span>{{batchNo}}</span>
                    </li>
                    <li>
                        发货站：<span>{{source}}<template v-if="admOfSource">({{admOfSource}})</template></span>
                    </li>
                    <li>
                        到货站：<span>{{dest}}<template v-if="admOfDest">({{admOfDest}})</template></span>
                    </li>
                    <li>
                        发货日期：<span>{{deliverDate}}</span>
                    </li>
                </ul>
                <div class="site-info">
                    <div class="site-list" v-if="siteInfo.length > 0">
                        <p class="site-list-title">发货站</p>
                        <ul>
                            <li v-for="(i,index) in siteInfo" :key="index">
                       <span class="bg">
                           <i class="icon done" v-if="(i.type=='1' || i.type=='2') && index != siteInfo.length-1"></i>
                           <i class="icon current" v-if="index == siteInfo.length-1"></i>
                       </span>
                                <template v-if="index == siteInfo.length-1">
                            <span class="site-arrivetime">
                                <b>{{i.evtDate}}</b>
                            </span>
                                    <span><b>{{i.station}}<template v-if="i.adm">({{i.adm}})</template></b></span>
                                </template>
                                <template v-if="index != siteInfo.length-1">
                            <span class="site-arrivetime">
                                {{i.evtDate}}
                            </span>
                                    <span>{{i.station}}<template v-if="i.adm">({{i.adm}})</template></span>
                                </template>
                            </li>
                        </ul>
                        <p>到货站</p>
                    </div>
                  <div class="site-list flex" v-else>
                    暂无运输信息
                  </div>
                  <div class="site-map">
                        <map-route :siteInfo="siteInfo"></map-route>
                    </div>
                </div>
            </div>
        </default-layout>
        <template v-if="ifHideHead">
            <div class="logistics-detail">
                <div class="title">
                    铁路货运跟踪
                </div>
                <ul class="info">
                    <li>
                        批次号：<span>{{batchNo}}</span>
                    </li>
                    <li>
                        发货站：<span>{{source}}<template v-if="admOfSource">({{admOfSource}})</template></span>
                    </li>
                    <li>
                        到货站：<span>{{dest}}<template v-if="admOfDest">({{admOfDest}})</template></span>
                    </li>
                    <li>
                        发货日期：<span>{{deliverDate}}</span>
                    </li>
                </ul>
                <div class="site-info">
                    <div class="site-list">
                        <p class="site-list-title">发货站</p>
                        <ul>
                            <li v-for="(i,index) in siteInfo" :key="index">
                       <span class="bg">
                           <i class="icon done" v-if="(i.type=='1' || i.type=='2') && index != siteInfo.length-1"></i>
                           <i class="icon current" v-if="index == siteInfo.length-1"></i>
                       </span>
                                <template v-if="index == siteInfo.length-1">
                            <span class="site-arrivetime">
                                <b>{{i.evtDate}}</b>
                            </span>
                                    <span><b>{{i.station}}<template v-if="i.adm">({{i.adm}})</template></b></span>
                                </template>
                                <template v-if="index != siteInfo.length-1">
                            <span class="site-arrivetime">
                                {{i.evtDate}}
                            </span>
                                    <span>{{i.station}}<template v-if="i.adm">({{i.adm}})</template></span>
                                </template>
                            </li>
                        </ul>
                        <p>到货站</p>
                    </div>
                    <div class="site-map">
                        <map-route :siteInfo="siteInfo"></map-route>
                    </div>
                </div>
            </div>
        </template>
    </div>

</template>

<script>
    import { API_GETTRAINRECORD, API_SOAGETTRAINRECORD } from "api"
    import DefaultLayout from "layout/default";
    import MapRoute from "../../components/map/MapRoute"
    export default {
        name : "logisticsDetailTrain",
        data(){
            return{
                admOfDest:'', // 到货所属局
                admOfSource:'', // 发货所属局
                batchNo:'', // 批次号
                deliverDate:'',
                dest:'',// 到货站
                evtDate:'',// 报告时间
                type:'',// 类型 1发货站 2中间站 3到货站
                source:'',// 发货站
                siteInfo:[],
                ifHideHead:false
            }

        },
        mounted(){
            // 如果是外部请求进入，不需要展示头部
            if(this.$route.query.from == 'yunkong'){
                this.ifHideHead = true;
            }else{
                this.ifHideHead = false;
            }
            this.getTrailRecord();
        },
        components: {
            DefaultLayout,
            MapRoute
        },
        methods:{
            getTrailRecord(){
                API_SOAGETTRAINRECORD({'deliverBatchNo':this.$route.query.deliverBatchNo,'source':this.$route.query.source||''}).then(res=>{
                    if(res.success){
                        this.admOfDest = res.data.admOfDest,
                        this.admOfSource = res.data.admOfSource,
                        this.batchNo = res.data.batchNo,
                        this.deliverDate = res.data.deliverDate,
                        this.dest = res.data.dest,
                        this.source = res.data.source

                        let records = res.data.records || []
                        let start =  [] // type=1 起点
                        let end = [] // type=3 终点
                        let routeList = []
                        records.forEach(item => {
                          if (item.type == 1 || item.type == 3) {
                            let arr = item.evtDate.split(' ')
                            if (arr[1] == '00:00') item.evtDate = arr[0]
                            if (item.type == 1) start.push(item)
                            if (item.type == 3) end.push(item)
                          } else {
                            routeList.push(item)
                          }
                        })
                        this.siteInfo = [].concat(start).concat(routeList).concat(end)
                    }
                });
            }
        }
    }
</script>

<style lang="less">
    .logistics-detail{
        width: 1200px;
        margin:0 auto;
        .title{
            border:1px solid #ddd;
            font-size: 18px;
            color:#666;
            padding:20px 28px;
            margin-top: 40px;
            margin-bottom: 40px;
        }
        .info{
            margin-bottom: 40px;
            padding:30px 65px;
            border:1px solid #ddd;
            font-size: 18px;
            color:#999;
            display: flex;
            flex-direction: row;
            li{
                width:25%;
                span{
                    color:#333;
                    word-break: break-all;
                }
            }
        }
        .site-info{
            display: flex;
            flex-direction: row;
            .site-list{
                height:613px;
                overflow-y: auto;
                border:1px solid #ddd;
                flex-grow: 1;
                padding:46px;
                color:#333;
                font-size: 16px;
                margin-right: 20px;
                &.flex{
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .site-list-title{margin-bottom: 10px;}
                ul{
                    margin-left: 20px;
                    border-left: 1px solid #ccc;
                    li{
                        font-size: 18px;
                        padding-left: 20px;
                        position: relative;
                        margin-bottom: 30px;
                        span{
                            display: inline-block;
                            word-break: break-all;
                            &.site-arrivetime{
                                margin-right: 14px;
                            }
                        }
                        .bg{
                            position: absolute;
                            left: -8px;
                            background: #fff;
                            z-index: 1;
                            padding:2px 0;
                        }
                        .icon{
                            display: inline-block;
                            z-index: 99;
                            width:16px;
                            height: 16px;
                            background-color: #fff;
                            &.done{
                                background: url("../../assets/imgs/logistics/trail-done.png");
                            }
                            &.current{
                                background: url("../../assets/imgs/logistics/trail-current.png");
                            }
                        }
                        &:last-child{
                            margin-bottom:10px;
                        }
                    }
                }

            }
            .site-map{
                width:690px;
                height:613px;
                border:1px solid #ddd;
                padding:20px;
            }
        }
    }
</style>
