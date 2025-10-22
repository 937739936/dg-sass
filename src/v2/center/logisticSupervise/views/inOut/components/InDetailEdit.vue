<template>
  <div>
    <a-modal 
      :visible="visible" 
      title="编辑"
      class="slModal"
      width="550px"
      forceRender
      @cancel="cancel"
    >
      <template #footer>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok" :loading="saveLoading">保存</a-button>
      </template>
      <a-form 
        :form="form"
        class="slFormDetail"
      >
        <a-row :getter="20" class="a-row">
          <a-col class="a-col">
            <a-form-item label="车牌号">
              <a-input 
                placeholder="请输入车牌号" 
                v-decorator="['licensePlateNumber']"
                disabled
              />
            </a-form-item>
            <a-form-item label="司机电话">
              <a-input 
                placeholder="请输入司机电话" 
                v-decorator="['driverMobile',validator['driverMobile'] ]"
              />
            </a-form-item>
            <a-form-item label="矿发时间">
              <a-date-picker  
                showTime
                format="YYYY-MM-DD HH:mm"
                width="100%"
                v-decorator="['loadingDate', { rules: [
                  { required: false,message: '请选择矿发时间'  },
                ] }]"
              />
            </a-form-item>
            
          </a-col>
          <a-col  class="a-col">
            <a-form-item label="司机姓名">
              <a-input 
                placeholder="请输入司机姓名" 
                v-decorator="['driverName', validator.limit('driverName',50)]"
              />
            </a-form-item>
            <a-form-item label="发站">
              <a-input 
                placeholder="请输入发站" 
                v-decorator="['sendStation', validator.limit('sendStation',50)]"
              />
            </a-form-item>
            <a-form-item label="矿发净重">
              <a-input 
                placeholder="请输入矿发净重" 
                v-decorator="['loadingWeight', validator.loadingWeight]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :colon="false">
          <template slot="label" >
            矿发磅单 <span style="color:#77889D">支持上传单张图片，图片大小不得超过100MB</span>
          </template>
          <a-upload
            :show-upload-list="false"
            :before-upload="beforeUpload"
            accept="image/jpg,image/png"
            list-type="picture-card"
            v-if="loadingScaleFile.length == 0"
          >
            <div >
              <a-icon type="plus" style="font-size:20px;color:#cbcbcb;"/>
            </div>
            <!-- <a-button type="primary" ghost>点击上传</a-button> -->
          </a-upload>
          <div class="img-wrap" v-else>
            <a class="close" @click.prevent="onDel"></a>
            <img :src="(loadingScaleFile[0]||{}).url" @click="onPreview"  alt=""  />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <ConfirmModal ref="confirm"></ConfirmModal>
    <image-viewer ref="imageViewer" />
  </div>
</template>
<script>
import {isNumber} from "v2/utils/validForm"
import ConfirmModal from "v2/components/modal/ConfirmModal";
import { commonStationUpload} from "v2/api/upload";
import ImageViewer from "@sub/components/viewer/image" 
import {automobileRecordEdit} from "v2/center/logisticsPlatform/api/inout"
import moment from "moment"
export default {
  props:["id"],
  components:{
    ConfirmModal,
    ImageViewer,
  },
  data(){
    return {
      visible:false,
      form: this.$form.createForm(this),
      saveLoading:false,
      loadingScaleFile:[],
      validator:{
        "driverMobile":{ rules: [
          { validator:(rule, value, callback) => {
            if(!value){
              callback();
              return
            }
            if(!/^1\d{10}$/.test(value)){
              callback("请输入正确的电话号码");
              return
            }
            callback();
          } },
        ]},
        limit:(name,length=50) => {
          return {rules:[{
          validator:(rule,value,callback) => {
            if(value && value.length > length){
              this.form.setFieldsValue({[name]:value.slice(0,length)})
            }
            callback();
          }
        }]}
        },
        "loadingWeight":{rules:[{
          validator:(rule,value,callback) => {
            if(value === 0 || value < 0 ){
              this.form.setFieldsValue({loadingWeight:0})
              return
            }
            if( value > 200){
              this.form.setFieldsValue({loadingWeight:200})
              return
            }
            if(!value){
              callback();
              return
            }
            if(!isNumber(value,2)){
              this.form.setFieldsValue({loadingWeight:value.match(/(\d{1,})(\.\d{1,2})?/g)[0]})
            }
            callback();
          }
        }]}
      },
      productCode: 'LOGIC_DELIVER',
    }
  },
  methods:{
    show({weightInfo}){
      this.visible = true;
      const values = {
        licensePlateNumber:weightInfo.licensePlateNumber,
        driverMobile:weightInfo.driverMobile,
        driverName:weightInfo.driverName,
        sendStation:weightInfo.sendStation,
        loadingWeight:weightInfo.loadingWeight
      }
      if(weightInfo.loadingDate){
        values.loadingDate = moment(weightInfo.loadingDate)
      }
      const url = weightInfo.loadingTicket
      if(url){
        this.loadingScaleFile = [{
          path:url,
          url:"/dg-trade-api/"+url
        }]
      }
      
      this.form.setFieldsValue(values)
    },
    ok(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true
        let file = {...(this.loadingScaleFile[0]||{})};
        delete file.url
       
        if(values.loadingDate){
          values.loadingDate =  values.loadingDate.format("YYYY-MM-DD HH:mm")
        }
        automobileRecordEdit({id:this.id,...values,loadingScaleFile:file}).then((success,data) => {
          this.saveLoading = false
          if(!success){
            return
          }
          this.cancel()
          this.$message.success("操作成功")
          this.$emit("reload")
        }).catch(() => {
          this.saveLoading = false
        })
      })
    },
    cancel(){
      this.form.resetFields();
      this.loadingScaleFile = []
      this.visible = false;
    },
    beforeUpload(file){
      const t = this;
      if (file.size / 1024 / 1024 > 100) {
        t.$message.error("单个图片大小不得超过100M");
        return true;
      }
      if (
        file.name.indexOf("/") > 0 ||
        file.name.indexOf("\\") > 0 ||
        file.name.indexOf("%") > 0
      ) {
        t.$message.error("文件名不要包含特殊符号");
        return true;
      }
      this.handleUpload(file)
      return false
    },
    async  handleUpload(file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        this.$message.loading("上传中...",0)
        const {data} = await commonStationUpload(formData)
        this.$message.destroy();
        this.loadingScaleFile.push({
          name:data.name,
          path:data.path,
          md5Hex:data.md5Hex,
          createDate:data.createDate,
          url:"/dg-trade-api/"+data.path , 
        })

      } catch (err) {
         const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试'
         this.$message.error(tip);
      } 
    },
    onDel(){
      this.$refs.confirm.showModal({
        modalTitle:"确认删除",
        modalText:"确认要删除该图片吗，删除后无法恢复",
        confirm:() => {
          this.loadingScaleFile.length = 0;
          this.$forceUpdate()
        }
      })
    },
    onPreview(){
      this.$refs.imageViewer.show([this.loadingScaleFile[0]?.url])
    }
  }
}
</script>
<style lang="less" scoped>
.a-row{
  display: flex;
  .a-col{
    flex:1;
    flex-shrink: 0;
    margin-right: 20px;
    &:last-child{
      margin-right: 0;;
    }
  }
}
.img-wrap{
  position:relative;
  width:60px;
  height:60px;
  border-radius: 3px;
  .close{
    position:absolute;
    top:-4px;
    right:-4px;
    width:14px;
    height:14px;
    background-image:url("~assets/imgs/logisticsPlatform/icon_truck_delete.png");
    background-size:100%;
    background-position:center;
    
  }
  img{
    width:100%;
    height:100%;
    cursor:pointer;
  }
}
::v-deep{
  .ant-calendar-picker{
    min-width: 100% !important;
  }
  .ant-upload-select{
    width:60px;
    height: 60px;
  }
}
</style>