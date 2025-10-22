<template>
	<div id="pickUpFormComponent">
		<a-row>
			<a-col
				:span=12 v-for="(item, index) in baseInfoData"
				:key="index"
				class="row">
				<slot :name="item.value" :data="item">
					<a-form-item
						v-if="item.type == 'input'"
						:label="item.label"
						:colon=false>
						<a-input
							:disabled="true"
							v-decorator="[`${item.value}`]"/>
					</a-form-item>
					<a-form-item
						v-if="item.type == 'dateRange'"
						:label="item.label"
						:colon=false
						class="date-range">
						<a-range-picker
							:disabled="true"
							format="YYYY-MM-DD"
							:placeholder="['开始时间', '结束时间']"
							v-decorator="[`${item.value}`]"/>
					</a-form-item>
				</slot>
			</a-col>
		</a-row>
	</div>
</template>

<script>
    export default {
        name : "index",
        data(){
            return{
                baseInfoData:[
                    {
                        type:'input',
                        label:'订单编号',
                        value:'orderSerialNo'
                    },
                    {
                        type:'input',
                        label:'合同编号',
                        value:'contractNo'
                    },
                    {
                        type:'input',
                        label:'煤种',
                        value:'type'
                    },
                    {
                        type:'input',
                        label:'品名',
                        value:'goodsName'
                    },
                    {
                        type:'input',
                        label:'数量',
                        value:'quantity'
                    },
                    {
                        type:'input',
                        label:'基准价格(元/吨)',
                        value:'basicPrice'
                    },
                    {
                        type:'input',
                        label:'交提货地点',
                        value:'pickupPlace'
                    },
                    {
                        type:'dateRange',
                        label:'提货期限',
                        value:'deliveryDate'
                    },
                    {
                        type:'input',
                        label:'运输方式',
                        value:'transType'
                    },
                    {
                        type:'input',
                        label:'提货方式',
                        value:'pickupType'
                    },
                    {
                        type:'input',
                        label:'生产厂家',
                        value:'manufacturer'
                    },
                ],
            }
        }
    }
</script>

<style  lang="less">
    #pickUpFormComponent{
        .ant-form-item-label{
            label{
                font-size: 16px;
                color: rgba(0,0,0,0.75);
                width:74px;
                margin-right: 46px;
                display: inline-block;
                text-align: left;
            }
        }
        .ant-form-item-control{
            input{
                width:240px;
            }
            .ant-select{
                width:240px;
            }
        }
        .date-range{
            .ant-calendar-picker{
                width:240px;
                input{
                    width:90px;
                }
            }
        }
        .row{margin-bottom: 14px;padding-left: 40px;}
    }
</style>
