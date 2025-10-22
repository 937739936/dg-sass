<template>
    <div class="tabs-bar">
        <div @click="tabChange(0)" v-if="tabs.indexOf('contract') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/monitoring/contract.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 0 ? 'blue': ''">合同</p>
            </div>
            <i :class="judgeColor(0)"></i>
        </div>
        <div @click="tabChange(1)" v-if="tabs.indexOf('transportDocument') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/monitoring/delivery.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 1 ? 'blue': ''">运输凭证</p>
            </div>
            <i :class="judgeColor(1)"></i>
        </div>
        <div @click="tabChange(2)" v-if="tabs.indexOf('qualityDocument') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/assets/test.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 2 ? 'blue': ''">数质量凭证</p>
            </div>
            <i :class="judgeColor(2)"></i>
        </div>
        <div @click="tabChange(3)" v-if="tabs.indexOf('goodsTransferDocument') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/assets/goodsTransfer.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 3 ? 'blue': ''">货转凭证</p>
            </div>
            <i :class="judgeColor(3)"></i>
        </div>
        <div @click="tabChange(4)" v-if="tabs.indexOf('accountsTable') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/assets/accounts.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 4 ? 'blue': ''">核算表</p>
            </div>
            <i :class="judgeColor(4)"></i>
        </div>
        <div @click="tabChange(5)" v-if="tabs.indexOf('confirmLetter') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/assets/confirm.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 5 ? 'blue': ''">确认函</p>
            </div>
            <i :class="judgeColor(5)"></i>
        </div>
        <div @click="tabChange(8)" v-if="tabs.indexOf('settlesFiles') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/monitoring/file.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 8 ? 'blue': ''">结算单</p>
            </div>
            <i :class="judgeColor(8)"></i>
        </div>
        <div @click="tabChange(6)" v-if="tabs.indexOf('invoice') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/monitoring/invoice.png" alt="">
                <em></em>
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 6 ? 'blue': ''">发票</p>
            </div>
            <i :class="judgeColor(6)"></i>
        </div>
        <div @click="tabChange(7)" v-if="tabs.indexOf('otherFiles') > -1">
            <div class="tabs-icon">
                <img src="@/assets/imgs/monitoring/file.png" alt="">
            </div>
            <div class="tabs-text">
                <p :class="myactiveIndex == 7 ? 'blue': ''">其他材料</p>
            </div>
            <i :class="judgeColor(7)"></i>
        </div>

    </div>
</template>
<script>

export default {
    name: "LeftTabs",
    props: {
        tabs: {
            type: Array,
            default:()=>[],
        },
        detailData: {
            type: Object,
            default:()=>null
        },
        activeIndex:{
            type: String,
            default:'1'
        }

    },
    components: {
        // AssetsCompanyRelationChainModal
    },
    data() {
        return {
            myactiveIndex:this.activeIndex
        };
    },


    methods: {
        tabChange(index){
            this.myactiveIndex = index
            this.$emit('tabChange',index)
        },
        judgeColor(index){
            // 项下各必备附件存在数据时，标记绿色
            // 项下附件存在数据时，标记桔色
            // 项下附件无数据时，标记红色
            //0-合同 1-运输凭证 2-数质量凭证 3-货转凭证 4-核算表 5-确认函 6-发票 7-其他材料
            if (!this.detailData) return
            if (index == 0) { // 合同
                if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) || (this.detailData.contractInfo.tradeContract && this.detailData.contractInfo.tradeContract.list.length>0) || (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
                    if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) && (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
                        return 'green'
                    } else {
                        return 'orange'
                    }
                } else {
                    return 'red'
                }
            } else if (index == 1) { // 运输凭证
                if (this.detailData.deliverInfo.attachList && this.detailData.deliverInfo.attachList.length>0) {
                    return 'green'
                } else {
                    return 'red'
                }
            } else if (index == 2) { // 数质量凭证
                if (this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length>0) {
                    return 'green'
                } else {
                    return 'red'
                }
            } else if (index == 3) { // 货转凭证
                if (this.detailData.goodTransferInfo.list && this.detailData.goodTransferInfo.list.length>0) {
                    return 'orange'
                } else {
                    return 'red'
                }
            } else if (index == 4) { // 核算表凭证
                if (this.detailData.accountInfo.list && this.detailData.accountInfo.list.length>0) {
                    return 'green'
                } else {
                    return 'red'
                }
            } else if (index == 5) { // 确认函
                if (this.detailData.confirmLetterInfo.list && this.detailData.confirmLetterInfo.list.length>0) {
                    return 'orange'
                } else {
                    return 'red'
                }
            } else if (index == 6) { // 发票
                if (this.detailData.invoiceInfo.list && this.detailData.invoiceInfo.list.length>0) {
                    return 'orange'
                } else {
                    return 'red'
                }
            } else if (index == 7) { // 其他材料
                if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length>0) {
                    return 'orange'
                } else {
                    return 'red'
                }
            } else if (index == 8) { // 结算单
                if (this.detailData.settlementInfo && this.detailData.settlementInfo.list && this.detailData.settlementInfo.list.length>0) {
                    return 'orange'
                } else {
                    return 'red'
                }
            }
        },
    },
};
</script>
<style lang="less" scoped>
</style>