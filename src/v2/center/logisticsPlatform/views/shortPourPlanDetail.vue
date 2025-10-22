<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">下煤短倒计划详情</span>
      </div>
      <a-card 
        :tab-list="tabList"
        :active-tab-key="tabKey"
        @tabChange="onTabChange"
        :bordered="false"
        style="padding: 0;"
      >
        <template v-if="tabKey=='base'">
          <DetailBase :id="id"></DetailBase>
        </template>
        <template v-if="tabKey=='dispatch'">
          <DetailDispatch :id="id"></DetailDispatch>
        </template>
      </a-card>
    </a-card>
  </div>
  
</template>

<script>
import DetailBase from "./shortpour/DetailBase";
import DetailDispatch from "./shortpour/DetailDispatch";
import Breadcrumb from "@/v2/components/breadcrumb/index";

export default {
  components:{
    DetailBase,
    DetailDispatch,
    Breadcrumb
  },
  data(){
    return {
      tabKey:"base",
      id:this.$route.query.id,
      tabList:[
        {
          key: 'base',
          tab: '基本信息',
        },
        {
          key: 'dispatch',
          tab: '派车信息',
        },
      ]
    }
  },
  mounted(){
  },
  methods:{
    onTabChange(key){
      this.tabKey = key;
    }
  }
}
</script>