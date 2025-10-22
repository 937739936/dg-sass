
<template>
  <div>
    <a-modal 
      :visible="visible" 
      width="800px"
      :title="historyData.name||data.name"
      @cancel="onClose"
    >
      <template slot="footer">
        <a-button type="primary" @click="onClose" >确定</a-button>
      </template>
      <div class="modal-content">
        <div class="title"><strong>{{historyData.name||data.name}}</strong></div>
        <div class="update-info">
          <p v-if="historyData.id">
            <a @click.prevent="back">
              <a-icon type="arrow-left"/>
              返回
            </a>
          </p>
          <p>版本及更新</p>
          <p>当前版本：{{historyData.versionNumber ||data.versionNumber}}</p>
          <p class="history-text">
            <span>历史版本：</span>
            <template v-if="leftHistory.length > 0">
              <a 
                v-for="item,index in leftHistory" 
                :key="item.id"
                @click.prevent="showDetail(index)"
              >{{item.versionNumber}}</a>
            </template>
            <span v-else>无</span>
          </p>
        </div>
        <div class="editor-content" v-html="historyData.content||data.content"></div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  API_GET_AGREEMENT_BY_FILETYPE,
  API_GET_AGREEMENT_HISTORY_BY_FILETYPE,
  API_GET_AGREEMENT_BY_ID
} from 'api/account';
const FILE_TYPE = {
  "USER_AGREEMENT":"用户服务协议",
  "PRIVACY_AGREEMENT":"隐私保护政策",
  "AUTH_AGREEMENT":"认证服务协议"
}
export default {
  props:["fileType"],
  data(){
    return {
      visible:false,
      data:{},
      history:[],
      leftHistory:[],
      historyData:{},
    }
  },
  methods:{
    showModal(){
      if(!(this.fileType || this.fileType === 0)){
        return
      }
      API_GET_AGREEMENT_BY_FILETYPE(this.fileType).then((res) => {
        this.data = res.data||{};
        if(!this.data.id){
          this.$message.error(`未配置${FILE_TYPE[this.fileType]}`)
          return
        }
        if(['USER_AGREEMENT', 'AUTH_AGREEMENT'].includes(this.fileType)) {
          this.visible = true;
        }
      })
      if (this.fileType === 'PRIVACY_AGREEMENT') {
        API_GET_AGREEMENT_HISTORY_BY_FILETYPE(this.fileType).then((res) => {
          this.history = res.data||[];
          this.leftHistory = this.history;
          this.visible = true;
        })
      }
    },
    onClose(){
      this.visible = false;
    },
    showDetail(index){
      let {id} = this.leftHistory[index]||{};
      API_GET_AGREEMENT_BY_ID(id).then((res) => {
        this.historyData = res.data;
        this.leftHistory = this.leftHistory.slice(index+1);
      })
    },
    back(){
      this.leftHistory = this.history;
      this.historyData ={}
    }
  }
}
</script>
<style lang="less" scoped>
.editor-content{
  margin-top:20px;
}
.modal-content{
  height:400px;
  overflow:scroll;
}
.title{
  font-size: 18px;
  text-align:center;
  color: #000000;
}
.update-info{
  p{
    color:#000;
  }
  .history-text{
    a{
      margin-right:8px;
    }
  }
}

</style>