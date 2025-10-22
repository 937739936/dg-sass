<template>
  <a-modal
          v-if="!isNeedRotate" 
          :visible="visible"
          @ok="visible = false"
          :footer="null"
          @cancel="visible = false"
  >
        <div class="preview-dialog">
          <img class="img" :src="url">
          <a :href="url" target="_blank">查看原图</a>
        </div>
  </a-modal>
  <a-modal
          v-else-if="isNeedRotate" 
          :visible="visible"
          @ok="visible = false"
          :footer="null"
          @cancel="handlePreviewCancel"
          width="700px" height="700px" 
  >
        <div class="img-wrapper">
          <div id="preview-img-id">
            <img alt="example" :src="url" />
          </div>
          <div class="rotate-wrapper">
            <a-icon class="rotate-icon" @click="handleClick" type="redo" />
          </div>
          <a :href="url" target="_blank">查看原图</a>
      </div>
  </a-modal>
</template>

<script>
import ENV from '@/v2/config/env'
export default {
  data(){
    return {
      visible: false,
      url: null,
      deg:0 //图片旋转初始化
    }
  },
  props:{
    isNeedRotate: { //是否支持pdf
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods:{
    handlePreviewCancel() {
      let ele = document.getElementById('preview-img-id')
      ele.style.transform = `rotate(0deg)`
      this.deg = 0
      this.visible = false
    },
      // 旋转图片
    handleClick () {
      this.deg = (this.deg + 90) % 360
      let ele = document.getElementById('preview-img-id')
      ele.style.transform = `rotate(${this.deg}deg)`
    },
    show(url, flag){
      // flag 代表是否是本地图片
      if(url && url.indexOf(ENV.BASE_NET) == -1 && !flag){
        this.url = ENV.BASE_NET + url
      }else{
        this.url = url
      }

      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
  .preview-dialog{
      width: 100%;
      height : 100%;
      flex-direction:row;
      justify-content: center;
      align-items: center;
      overflow :  hidden;
      text-align: center;
  }
  .img{
      max-width : 100%;
      height : auto;
      margin : 0 auto;
      display: block;
  }
  .img-wrapper{
			margin: auto;
			position: relative;
			height:600px;
			width:600px;
      &>a{display:block;text-align:center;}
			#preview-img-id{
				width: 100%;
				height: 100%;
				display:flex;
				justify-content:center;
				align-items:center;
				user-select:none;
				a{
					user-select:none;
				}
				img{
					max-width: 600px;
					max-height:600px;
					pointer-events:none;
				}
			}
			&:hover .rotate-wrapper{
				display:flex;
			}
			.rotate-wrapper{
				justify-content:center;
				align-items:center;
				position: absolute;
				display: none;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				.rotate-icon{
					font-size: 80px;
					color: rgba(0,0,0,0.3);
					cursor: pointer;
				}
			}
		}
</style>


