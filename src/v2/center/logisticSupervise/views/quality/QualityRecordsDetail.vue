<template>
  <div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false" class="content">
			<div class="methods-wrap">
				<span slot="title" class="slTitle">质检详情</span>
			</div>
      <div class="slTitleAssis">
        货权信息
      </div>
      <ul class="grid-wrap">
        <li style="width: 33.3%;">
          <span class="label">仓库名称</span>
          <span>{{ detail.stationName ||"--" }}</span>
        </li>
        <li style="width: 66.6%;">
          <span class="label">货主名称</span>
          <span>{{ detail.companyName || "--" }}</span>
        </li>
      </ul>
      <div class="slTitleAssis">
        任务概览
      </div>
      <ul class="grid-wrap">
        <li >
          <span class="label">质检人员</span>
          <span>{{ detail.createdName||"--" }}</span>
        </li>
        <li >
          <span class="label">船名</span>
          <span>{{ detail.shipName||"--" }}</span>
        </li>
        <li >
          <span class="label">装船日期</span>
          <span>{{ detail.shipDate||"--" }}</span>
        </li>
        <li style="width: 99.9%;">
          <span class="label">化验报告</span>
          <span v-if="detail.analysisReportUrl">
            <a v-if="isPdf" @click.prevent="openPDF">化验报告</a>
            <img
              v-else
              :src="detail.analysisReportUrl"
              alt=""
              class="image"
              v-viewer
            />
          </span>
          <span v-else>--</span>
        </li>
      </ul>
      <div class="btn">
        <a-button type="primary" style="width:100px;" ghost @click="$router.back()">返回</a-button>
      </div>
      
    </a-card>
  </div>
</template>
<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { getQualityDetail } from '@/v2/center/logisticSupervise/api';
import {filePreview,getPreviewUrl} from "@/v2/utils/file";
export default {
  components: {
		Breadcrumb,
	},
  data(){
    return {
      id:this.$route.query.id,
      detail:{}
    }
  },
  created(){
    this.getQualityDetail()
  },
  computed:{
    isPdf(){
      if(/.pdf$/ig.test(this.detail.analysisReportUrl)){
        return true;
      }
      return false
    }
    
  },
  methods:{
    async getQualityDetail(){
      const res = await getQualityDetail({id:this.id})
      if(!res.success){
        return
      }
      this.detail = res.data;
      this.detail.analysisReportUrl = getPreviewUrl(this.detail.analysisReportUrl)
    },
    openPDF() {
			// 查看报告
      filePreview(this.detail.analysisReportUrl)
		}
  }
}
</script>
<style lang="less" scoped>
// @import url('~@/v2/style/table-cover.less');
@import url('~@/v2/style/grid-wrap.less');
.btn{
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center
}
.image{
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
}
</style>