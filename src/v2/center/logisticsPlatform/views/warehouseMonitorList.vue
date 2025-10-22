<template>
  <div class="custom-main-content-inner">
    <div class="page-title"><span>视频监控</span></div>
    <a-card :bordered="false" >
      <a-form
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        :form="searchForm"
      >
        <a-row :gutter="10">
          <a-col :span="10">
            <a-form-item label="仓库名称">
              <a-select>
                <a-select-option value="1">仓库一</a-select-option>
                <a-select-option value="2">仓库二</a-select-option>
                <a-select-option value="3">仓库三</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="核心企业">
              <a-select>
                <a-select-option value="1">核心企业一</a-select-option>
                <a-select-option value="2">核心企业二</a-select-option>
                <a-select-option value="3">核心企业三</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4" class="align-center">
            <a-form-item 
              label=" " 
              :colon="false"
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
            >
              <a-space>
                <a-button type="primary">查询</a-button>
                <a-button >重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="card-list">
        <a-card 
          :bordered="true" 
          size="small" 
          class="card" 
          v-for="item in warehouseList" :key="item" 
        >
          <template #title><span class="title">召豪站台</span> </template>
          <a-row :gutter="[10,10]">
            <a-col :span="8" class="left">
              监控总数:<span class="val">10</span>
            </a-col>
            <a-col :span="8" class="center">
              在线数:<span class="online">10</span>
            </a-col>
            <a-col :span="8" class="right">
              掉线数:<span class="red">10</span>
            </a-col>
          </a-row>
          <a-row :gutter="[10,10]">
            <a-col>核心企业: 陕煤供应链管理有限公司</a-col>
          </a-row>
          <a-row :gutter="[10,20]">
            <a-col>当前库存: 100万吨</a-col>
          </a-row>
          <a-row :gutter="[10,20]">
            <a-col class="center">
              <a-button type="primary" @click="detail">查看监控1</a-button>
            </a-col>
          </a-row>
        </a-card>
        
      </div>
      
    </a-card>
  </div>
</template>
<script>

export default {
  data(){
    return {
      searchForm:this.$form.createForm(this),
      warehouseList:[1,2,3,4,5,6,7]
    }
  },
  methods:{
    detail(){
      this.$router.push({path:"/center/logisticsPlatform/monitorList"})
    }
  }
}
</script>
<style lang="less" scoped>

.card-list{
  display:flex;
  flex-wrap:wrap;
  justify-content:space-between;
}
.card{
  margin-bottom:20px;
  width:32%;
  font-size:14px;
  .ant-col{
    color:#8495AA;
  }
  .left{
    text-align:left;
  }
  .center{
    text-align:center;
  }
  .right{
    text-align:right;
  }
  .title{
    color:#383A3F;
    font-size:16px;
    &::before{
      content:" ";
      display:inline-block;
      width:22px;
      height:22px;
      background-image:url("~assets/imgs/logisticsPlatform/monitor_icon.png");
      background-size:contain;
      background-repeat:no-repeat;
      vertical-align: text-bottom;
    }
  }
  .val{
    color:#383A3F;
    font-weight:bold;
  }
  .online{
    color:#81D653;
  }
  .red{
    color:#FA5252;
  }
  
}
</style>
