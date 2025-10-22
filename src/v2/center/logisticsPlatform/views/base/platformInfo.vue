<template>
   <div class="slMain">
    <a-card :bordered="false" :loading="loading">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">站台信息管理</span>
      </div>
      <a-descriptions bordered  :column="3"  size="middle">
        <a-descriptions-item label="站台编号">{{ data.serialNo }}</a-descriptions-item>
        <a-descriptions-item label="站台名称">{{ data.name }}</a-descriptions-item>
        <a-descriptions-item label="仓储企业">{{ data.storageCompanyName }}</a-descriptions-item>
        <a-descriptions-item label="行业">{{ data.industryCname }}</a-descriptions-item>
        <a-descriptions-item label="类型">站台</a-descriptions-item>
        <a-descriptions-item label="站台联系人">{{ data.linkman }}</a-descriptions-item>
        <a-descriptions-item label="联系人手机号">{{ data.linkmanMobile }}</a-descriptions-item>
        <a-descriptions-item label="地址">
          <div class="address">
            <a  href="#"  @click="open(false)" > {{data.area}} {{ data.address }}</a>
            <a href="#" @click="open(true)" class="edit">
              <Edit></Edit>
            </a>  
          </div>
               
        </a-descriptions-item>
      </a-descriptions>
      <a-card 
        :tabList="tabList" 
        :activeTabKey="activeTabKey" 
        :bordered="false" 
        class="card"
        @tabChange="onTabChange"
      >
      <div v-show="activeTabKey=='pic'">
        <div class="btns">
          <a-button type="primary" @click="onPush">监控信息</a-button>
        </div>
        <PlatformPlan id="canvas" :height="440" :edit="false"></PlatformPlan>
      </div>
      <div  v-show="activeTabKey=='contract'">
        <div class="btns" v-auth="'logisticsStorageCenter:systemManager:stationInfoManager:addLeaseContract'">
          <a-button type="primary" @click="toUploadPage">上传合同</a-button>
        </div>
        <TenancyContract></TenancyContract>
      </div>
      </a-card>
      
      <!-- <div class="slTitleAssis" style="margin-bottom: 30px;">
        <span>站台平面展示图</span>
        <a-button type="primary" @click="onPush">监控信息</a-button>
      </div> -->
      
      <CheckPort ref="checkPOrt"  @selectPort="doFetch"></CheckPort>
    </a-card>
  </div>
 
</template>

<script>
import {getStationDetail} from "../../api";
import CheckPort from '../../components/CheckPort'
import PlatformPlan from "../../components/PlatformPlan";
import TenancyContract from './platformInfo/TenancyContract.vue';
import storage from  "@sub/utils/storage";
import { Edit } from "@sub/components/svg"
export default {
  components: {
    CheckPort,
    PlatformPlan,
    TenancyContract,
    Edit
  },
  data() {
    const activeTabKey = storage.session.get("platforminfo_tab")||"pic"
    return {
      loading:true,
      tabList:[
        {key:"pic",tab:"站台平面图"},
        {key:"contract",tab:"仓储租赁合同"},
      ],
      activeTabKey,
      data:{}
    }
  },
  mounted(){
    this.doFetch();
  },
  methods: {
    onTabChange(value){
      storage.session.set("platforminfo_tab",value)
      this.activeTabKey = value;
    },
    doFetch(){
      getStationDetail().then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        this.data = data;
      })
    },
    open(flag) {
      this.$refs.checkPOrt.show(this.data, flag)
    },
    onPush(){
      this.$router.push("/center/logisticsPlatform/monitorList")
      // window.open("/center/logisticsPlatform/monitorList","_blank")
    },
    toUploadPage(){
      this.$router.push("/center/logisticsPlatform/platformInfo/tenancyContractEdit")
    }
  },
  
}
</script>

<style scoped  lang='less' >

</style>
<style lang="less" scoped>
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
.slTitleAssis{
  display:flex;
  align-items:center;
  justify-content: space-between;
  margin-top:50px;
}

.address{
  display:flex;
  align-items:center;
  font-size:14px;
  color: @primary-color;
  .edit{
    flex-shrink:0;
    margin-left:12px;
    width:14px;
    height:14px;
    position: relative;
    top: -1px;
  }
}
::v-deep{
  .ant-descriptions-bordered .ant-descriptions-item-label{
    background-color:#F3F5F6;
    color:#77889D;
  }
}
.card{
  padding-left:0;
  padding-right:0;
  .btns{
    padding-bottom:30px;
    display:flex;
    justify-content: flex-end;
  }
  ::v-deep{
    .ant-card-head{
      height:56px;
    }
    .ant-card-body{
      padding-top:30px;
    }
  }
}
</style>