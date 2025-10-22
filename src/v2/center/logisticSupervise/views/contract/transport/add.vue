<template>
	<div class="slMain">
		<Breadcrumb />
    <a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
      <div class="methods-wrap">
        <div
          slot="title"
          class="slTitle"
        >
          <span>{{ $route.query.id ? '编辑运输合同' : '新增运输合同' }}</span>
        </div>
      </div>
      <div
        class="slTitleAssis"
      >
        合同信息
      </div>
      <TransportContractInfo ref="contractInfo"></TransportContractInfo>
      <div
        class="slTitleAssis"
      >
        运输信息
      </div>
      <TransportInfo ref="transportInfo"></TransportInfo>
      <div
        class="slTitleAssis"
      >
        中转信息
        <a-checkbox v-model="disTransferFlag" style="margin-left: 30px;">不涉及中转</a-checkbox>
      </div>
      <TransferInfo v-if="!disTransferFlag" ref="transferInfo"></TransferInfo>
      <div
        class="slTitleAssis"
      >
        附件信息
      </div>
      <Attachment ref="attachment" :list='attachmentList'></Attachment>
      <div class="submit-btn">
        <a-space :size="30">
          <a-button
            type="primary"
            ghost
            @click="cancel"
            >取消</a-button
          >
          <a-button
            type="primary"
            @click="save(false)"
            :loading="loadingSave"
            >保存</a-button
          >
          <a-button
            type="primary"
            @click="save(true)"
            :loading="loadingSubmit"
            >提交</a-button
          >
        </a-space>
      </div>
    </a-card>
  </div>
</template> 
<script>
  import Breadcrumb from '@/v2/components/breadcrumb/index';
  import TransportInfo from '@/v2/center/logisticSupervise/views/contract/components/TransportInfo';
  import TransportContractInfo from '@/v2/center/logisticSupervise/views/contract/components/TransportContractInfo';
  import TransferInfo from '@/v2/center/logisticSupervise/views/contract/components/TransferInfo';
  import Attachment from '@/v2/center/logisticSupervise/views/contract/components/Attachment';
  import { 
    API_contractDetail,
    API_Save
  } from '@/v2/center/trade/api/transportContract';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        disTransferFlag: false,
        attachmentList: [
          {
            key:"OFFLINE_CONTRACT",
            label: '运输合同',
            accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
            tip: '可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件。',
            required: true,
            isShowBtn: false,
          },
          {
            key:"LOGIC_TRANSFER_CONTRACT",
            label: '运输中转合同',
            accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
            tip: '可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件。',
            required: true,
            isShowBtn: false,
          },
          {
            key:"OTHER",
            label: '其他凭证',
            accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
            tip: '可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件。',
            required: false,
            isShowBtn: false,
          }
        ],
        loadingSave: false,
        loadingSubmit: false,
      }
    },
    components: {
      Breadcrumb,
      TransportInfo,
      TransportContractInfo,
      TransferInfo,
      Attachment
    },
    computed: {
      ...mapGetters('user', {
        VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
      }),
    },
    mounted() {
      if (this.$route.query.id) {
        this.getDetailsData()
      } else {
        if (this.$refs.contractInfo) {
          this.$refs.contractInfo.initFormData()
        }
      }
    },
    watch: {
      disTransferFlag: {
        immediate: false,
        handler(data) {
          if (data) {
            this.attachmentList.splice(1,1)
          } else {
            this.attachmentList.splice(1, 0 , {
              key:"LOGIC_TRANSFER_CONTRACT",
              label: '运输中转合同',
              accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
              tip: '可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件。',
              required: true,
              isShowBtn: false,
            })
          }
        }
      }
    },
    methods: {
      objAllValuesEmpty(obj) {
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (obj[prop] !== null && obj[prop] !== undefined && obj[prop] !== '') {
              return false; // 发现非空属性，返回false
            }
          }
        }
        return true; // 所有属性都为空，返回true
      },
      getDetailsData() {
        API_contractDetail({
          id: this.$route.query.id
        }).then(res => {
          if (res.success) {
            this.detailsData = res.data;
            this.$nextTick(() => {
              this.$refs.contractInfo.initFormData(this.detailsData)
              this.$refs.transportInfo.initFormData(this.detailsData)
              
              if (this.$refs.transferInfo) {
                this.$refs.transferInfo.initFormData(this.detailsData)
              }
              this.$refs.attachment.init(this.detailsData.contractAttachment)
              setTimeout(()=>{
                this.disTransferFlag = this.objAllValuesEmpty(this.detailsData.contractDynamicsFields)
              }, 0)
            });
          }
        });
      },
      cancel() {
        this.$router.push('/center/logisticSupervise/contract/transport/list')
      },
      async save(type) {
        const contractInfo = await this.$refs.contractInfo.handleSubmit()
        if (!contractInfo) return
        const transportInfo = await this.$refs.transportInfo.handleSubmit()
        if (!transportInfo) return
        let transferInfo = null
        if (!this.disTransferFlag) {
          transferInfo = await this.$refs.transferInfo.handleSubmit()
          if (!transferInfo) return
        }
        const filesInfo = await this.$refs.attachment.save()
        if (!filesInfo) return
        if (![contractInfo.sellerUscc, contractInfo.buyerUscc].includes(this.VUEX_ST_COMPANYSUER.companyUscc)) {
          this.$message.error('承运人和托运人至少一方为'+this.VUEX_ST_COMPANYSUER.companyName)
          return
        }
        const bodyObj = {
          id: this.$route.query.id,
          submit: type,
          productCode: 'LOGIC_DELIVER',
          ...contractInfo,
          ...transportInfo,
          contractDynamicsFields: transferInfo,
          attachmentReq: filesInfo,
          signStatus: 2,
        }
        console.log('bodyObj', bodyObj)
        API_Save(bodyObj).then(res=>{
          if (res.success && res.data) {
            this.$message.success(type?'提交成功':'保存成功')
            this.$router.push('/center/logisticSupervise/contract/transport/list')
          }
        })
      },
    }
  }
</script>  
<style lang="less" scoped>
  .slTitleAssis {
    margin: 30px 0 20px 0;
  }
  .submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		text-align: center;
		.ant-btn {
			margin: 0 15px;
			padding: 0 30px;
			border-radius: 6px;
			border: 1px solid @primary-color;
		}
	}
</style>
   