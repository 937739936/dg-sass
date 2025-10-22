<template>
  <div>
    <a-modal :visible="visible" title="编辑" :width="840" @cancel="onCancel" :destroyOnClose="true">
      <template slot="footer">
        <a-space>
          <a-button class="btn" @click="onCancel">取消</a-button>
          <a-button class="btn" type="primary" @click="onOk">确定</a-button>
        </a-space>
      </template>
      <div class="name">
        <label class="label">监控名称：</label>
        <span class="text">{{ data.name }}</span>
      </div>
      <div class="platform-tip">请选择该监控的位置</div>
      <PlatformPlan :edit="true" :height="375" :showFullScreen="false" :editId="data.id" ref="platform"></PlatformPlan>
    </a-modal>
  </div>
</template>
<script>
import PlatformPlan from "../components/PlatformPlan";
import {updateCameraPlaneGraphPosition} from "../api/index";

export default {
  props:{
    callback:{
      type:Function,
      default:() => null
    }
  },
  components:{
    PlatformPlan
  },
  data(){
    return {
      visible:false,
      data:{}
    }
  },
  methods:{
    show(data){
      this.visible = true;
      this.data = data;
    },
    close(){
      this.visible = false;
      this.data = {};
    },
    onOk(){
      let {moveEnd} = this.$refs.platform;
      let {id} = this.data;
      updateCameraPlaneGraphPosition({cameraId:id,...moveEnd}).then(({success}) => {
        if(!success){
          return
        }
        this.$message.success("操作成功");
        this.close();
        if(this.callback){
          this.callback({cameraId:id,...moveEnd})
        }
      })
    },
    onCancel(){
      this.close();
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep{
  .ant-modal-header{
    background-color:#F3F5F6;
  }
  .ant-modal-footer{
    padding:15px 16px;
  }
}
.platform-tip{
  margin-top:20px;
  margin-bottom:10px;
  font-size:14px;
  color:rgba(#000,0.4);
}
.btn{
  width:90px;
  height:34px;
}
.name{
  margin-top:10px;
  font-size:14px;
  .label{
    color:rgba(#000,0.4);
  }
  .text{
    color:rgba(#000,0.8);
  }
}
</style>