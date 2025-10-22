<template>
  <div  class="slMain">
     <Breadcrumb></Breadcrumb>
     <a-card :bordered="false" style="border-radius:5px;padding-bottom:0px">
      <span class="slTitle">新增电子仓单管理协议</span>
      <a-tabs :defaultActiveKey="1">
        <a-tab-pane
          :key="1"
          tab="协议预览"
        >
          <div class="preview-wrap">
            <AgreementPdf></AgreementPdf>
          </div>
        </a-tab-pane>
        <div
          slot="tabBarExtraContent"
          @click="fullScreenView"
        >
          <FullScreenIcon class="fullScreenIcon"></FullScreenIcon>
          <span class="blue" style="color:var(--primary-color)">全屏预览</span>
        </div>
      </a-tabs>
     </a-card>
      <a-card :bordered="false" style="margin-top:20px;border-radius:5px;padding-bottom:70x">
        <div class="slTitleAssis" style="margin-top:10px"> 基本信息</div>
        <a-form
          :form="form"
          class="slFormDetail"
          :colon="false"
        >
          <a-row>
            <a-col :span="8">
              <a-row type="flex">
                <a-form-item label="协议模板">
                  <a-select
                    style="width:364px"
                    placeholder="请选择协议模板"
                    @change="changeType"
                    v-decorator="['templateType', { rules: [{ required: true, message: '请选择发协议模板' }] }]"
                  >
                   <a-select-option value='WAREHOUSE_RECEIPT_MANAGE_AGREEMENT_001'>电子仓单管理协议模板001</a-select-option>
                   <a-select-option value='WAREHOUSE_RECEIPT_MANAGE_AGREEMENT_002'>电子仓单管理协议模板002</a-select-option>

                  </a-select>
                </a-form-item>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify='center'>
                <a-form-item label="仓储企业" required>
                  <a-input
                      style="width:364px"
                      disabled
                      placeholder="请输入仓储企业"
                      :value='currentStorageCompanyInfo.storageCompanyName'

                    />
                </a-form-item>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify='end'>
                <a-form-item label="协议签约地">
                  <a-cascader
                    :options="areaOptions"
                     style="width:364px"
                    placeholder="请选择协议签约地"
                    @change="changeArea"
                    v-decorator="[
                      'signArea',
                      {
                        rules: [
                          {
                            type: 'array',
                            required: true,
                            message: `请选择协议签约地`
                          }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>
          <div class="slTitleAssis" style="margin-top:10px">
            <span>仓储合同信息</span>
            <a-button style="margin-left:20px" type="primary" ghost  @click="link">关联仓储合同信息</a-button>
          </div>
          <a-row style="margin-top:20px">
            <a-col :span="8">
              <a-row type="flex">
                <a-form-item label="仓储合同号">
                  <a-input
                    style="width:364px"
                    placeholder="请输入仓储合同号"
                    disabled
                    v-decorator="[
                      'stationLeaseContractNo',
                      {
                        rules: [{ required: true, message: `请输入仓储合同号` }],
                        validateTrigger: ['blur']
                      }
                    ]"
                  />
                </a-form-item>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify='center'>
                <a-form-item label="存储期间">
                  <a-input
                    style="width:364px"
                    placeholder="请输入存储期间"
                    disabled
                    v-decorator="[
                      'effectiveDate',
                      {
                        rules: [{ required: true, message: `请输入存储期间` }],
                        validateTrigger: ['blur']
                      }
                    ]"
                  />
                </a-form-item>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify='end'>
                <a-form-item label="仓储地址">
                  	<a-input
                      style="width:364px"
                      placeholder="请输入仓储地址"
                      @blur="changeAddress"
                      :maxLength="100"
                      v-decorator="[
                        'storageCompanyAddress',
                        {
                          rules: [{ required: true, message: `请输入仓储地址` }],
                          validateTrigger: ['blur']
                        }
                      ]"
                    />
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>
          <!-- 审批流 -->
        </a-form>
        <template v-if="isOa">
          <div class="slTitleAssis" style="margin-top:10px">审批流</div>
          <WorkFlow
            ref="workFlow"
            :auditChainAndOperator="auditChainAndOperator"
          />

        </template>
        <div class="slDetailBottom">
          <a-space :size="30">
            <a-button type="primary" ghost  @click="goBack">取消</a-button>
            <a-button type="primary" ghost  @click="save">保存</a-button>
            <a-button type="primary" @click="submit">提交</a-button>
          </a-space>
        </div>

      </a-card>


    <PreviewModal ref="previewModal" @download='downloadPdf'></PreviewModal>
    <LinkStorageContractDraw ref="linkContractDraw" @select='selectStorageContract' :listApi="getWarehouseReceiptLeaseContractList"></LinkStorageContractDraw>
    <TipModal
      ref="submitModal"
      @ok="confirmSubmit"
      @cancel="closeModal"
      title="确认提交"
      cancelBtnText="取消"
      okBtnText="确定"
    >
      <div class="tip-box">
        <p>{{submitTip}}</p>
      </div>
    </TipModal>
    <TipModal
      ref="signModal"
      @ok="confirmSign"
      @cancel="goBack"
      title="提示"
      cancelBtnText="稍后盖章"
      okBtnText="现在去盖章"
    >
      <div class="tip-box">
        <p>补充协议已确认，需要盖章，是否现在进行盖章？</p>
      </div>
    </TipModal>
    <TipModal
			ref="signNeedModal"
			@ok="goBack"
			@cancel="goBack"
			title="确认提交"
		>
			<div class="tip-box">
				<p>协议已确认，请联系签章员或管理员进行盖章。</p>
				<p
					class="tip-wrap-desc"
					v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
				>
					签章员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.signerUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
				<p
					class="tip-wrap-desc"
					v-else
				>
					管理员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.adminUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
			</div>
		</TipModal>
    <ModalInfo
			ref="modalInfoChange"
			title="提示确认提交"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="forceBack"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="submit"
				>
					提交后返回
				</a-button>
			</div>
		</ModalInfo>
  </div>
</template>

<script>
import Breadcrumb from "@/v2/components/breadcrumb/index";
import AgreementPdf from '../components/AgreementPdf.vue';
import TipModal from '@sub/components/DelModal.vue';
import PreviewModal from '../components/PreviewModal.vue';
import {getStationDetail} from "../../../api";
import LinkStorageContractDraw from '../components/LinkStorageContractDraw.vue'
import WorkFlow from '../components/WorkFlow.vue'
import { mapGetters } from 'vuex';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import { area } from '@sub/utils/area.js';
import { deepCompare } from '@/v2/utils/factory';
import comDownload from '@sub/utils/comDownload';
import {
	API_COMPANYOACHECKV2
} from '@/v2/center/trade/api/goodsTransfer';
import ModalInfo from '@/v2/components/modalInfo/info';
import { FullScreenIcon } from '@sub/components/svg';

import { 
 saveOrSubmitWarehouseReceiptAgreementManage,
 getWarehouseReceiptAgreementManageDetail,
 downloadPreviewWarehouseReceiptAgreementManage,
 getWarehouseReceiptLeaseContractList,
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt'




export default {
  data() {
    return {
      form: this.$form.createForm(this),
      isOa: false,
      detailInfo: {
        auditChainAndOperator: {}
      },
      roleData: {},
      // 现有参数
      currentParams: {},
      // 当前站台详情
      currentStorageCompanyInfo: {},
      // 选择的仓储合同信息
      selectStorageContractInfo: {},
      // 级联
      areaOptions: area,
      id: '',
      auditChainAndOperator: {},
      cacheInfo: {},
      isNeedNext: true,
    }
  },
  computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
    submitTip() {
      if(this.isOa) {
        return '当前企业已对接OA，提交后将推送OA审核。审核通过后可以进行盖章，然后由对方进行确认盖章，双方盖章后，协议将生效，确认提交吗？'
      }
      return '提交后，请对协议进行盖章，盖章后将由对方进行确认盖章，双方盖章后，协议将生效，确认提交吗？'
    },
    isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
  async created() {
    this.id = this.$route.query.id
    this.checkIsOa()
    await  this.getStationDetail()
    this.getCurrentCompanyRolesInfo()
     this.$store.commit('logisticsPlatform/initAgreeManageInfo' )
    if(this.id) {
      this.getDetail()
    } else  {
      this.getLastStorageContract()
    }
  },
  beforeRouteLeave(to, form, next) {
   
    if(this.isNeedNext) {
       this.oldAndNew(next)
    } else {
      next()
    }
   
	},
  methods: {
    getWarehouseReceiptLeaseContractList,
    async getDetail() {
      const params = {
        id: this.id,
      }
      const res = await getWarehouseReceiptAgreementManageDetail(params)
      this.detailInfo = res.data
      const cacheInfo = {
        templateType: this.detailInfo.templateType,
        signArea: this.detailInfo.signArea.split('/'),
        storageCompanyAddress: this.detailInfo.storageCompanyAddress,
        stationLeaseContractNo: this.detailInfo.stationLeaseContractNo,
        effectiveDate: `${this.detailInfo.effectiveStartDate}至${this.detailInfo.effectiveEndDate}`
      }
      this.cacheInfo = cacheInfo

      this.auditChainAndOperator = res.data.auditChainAndOperator || {}




      this.$store.commit('logisticsPlatform/initAgreeManageInfo', this.detailInfo)


      this.$nextTick(() => {
        this.form.setFieldsValue(cacheInfo)
      })
    },
    // 获取当前站台信息
    async getStationDetail() {
      const res = await getStationDetail()
      this.currentStorageCompanyInfo = res.data

      this.$store.commit('logisticsPlatform/updateStorageCompanyInfo',this.currentStorageCompanyInfo )

    },
    async checkIsOa() {
			const res = await API_COMPANYOACHECKV2({ bizType: 'WAREHOUSE_MANAGE_AGREEMENT' });
			this.isOa = res.result;
      // this.isOa = false;

		},
    // 检测当前是否开启oa
    filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
    fullScreenView() {
      this.$refs.previewModal.show()
    },
    // 选择的仓储合同信息
    selectStorageContract(info) {
      this.selectStorageContractInfo = info;
      this.form.setFieldsValue({
        stationLeaseContractNo: info.bizContractNo,
        effectiveDate: info.effectiveDate,
        storageCompanyAddress: this.currentStorageCompanyInfo.address,
      })

      this.$store.commit('logisticsPlatform/updateStorageCompanyAddress', this.currentStorageCompanyInfo.address  )
      this.$store.commit('logisticsPlatform/updateAgreeManageInfoSignDate',info.effectiveStartDate )
      this.$store.commit('logisticsPlatform/updateStationLeaseContractNo',info.bizContractNo )

    },
    forceBack() {
      this.isNeedNext = false
      this.goBack()
    },
    goBack() {
      this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list')
    },
    link() {
      this.$refs.linkContractDraw.show()
    },
    closeModal() {
      this.$refs.submitModal.close()
      this.$refs.signModal.close()
      this.$refs.signNeedModal.close()

    },
    getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},
    save() {

      this.form.validateFieldsAndScroll(async (err, values) => {
        
        if (!err) {
          const params = {
            operatorType: 'SAVE',
            type: 'ONLINE',
            stationLeaseContractId: this.selectStorageContractInfo.id || this.detailInfo.stationLeaseContractId,
            ...values,
            signArea: values.signArea.join('/'),
            bid: this.id || null
          }
          // 检测审批流
          let obj = {}
          if(this.isOa) {
            obj =  await this.$refs.workFlow.handleSubmit()
            if(obj == false) {
              return
            }
            params.auditChainAndOperator = obj.auditChainAndOperator
          }
  
          const res = await saveOrSubmitWarehouseReceiptAgreementManage(params)
          this.$message.success('保存成功')
          this.isNeedNext = false;
          this.goBack()
        } 
      });
    },
    submit() {
     
       this.form.validateFieldsAndScroll(async (err, values) => {
        
        if (!err) {
         const params = {
            operatorType: 'SUBMIT',
            type: 'ONLINE',
            stationLeaseContractId: this.selectStorageContractInfo.id || this.detailInfo.stationLeaseContractId,
            ...values,
            signArea: values.signArea.join('/'),
            bid: this.id || null
          }
          // 检测审批流
          let obj = {}
          if(this.isOa) {
            obj =  await this.$refs.workFlow.handleSubmit()
            if(obj == false) {
              return
            }
            // 如果对接了OA
            this.$refs.submitModal.open()

            this.currentParams = {...obj, ...params}
            return
          }

          this.$refs.submitModal.open()
          this.currentParams = params


        } 
      });
    },
    async confirmSubmit() {
      if(this.isOa) {
        // 提交以后返回列表
         await saveOrSubmitWarehouseReceiptAgreementManage(this.currentParams)
        this.isNeedNext = false;
        this.$message.success('提交成功')
        this.goBack()
      } else {

        const res =  await saveOrSubmitWarehouseReceiptAgreementManage(this.currentParams)
        this.isNeedNext = false;
        this.id = res.data
        this.$refs.submitModal.close()
        // 判断当前角色 是否有盖章权限
        if(this.isSignAuth) {

          this.$refs.signModal.open()

        } else { 

          this.$refs.signNeedModal.open()
        }
      }
    },
    // 确认盖章
    confirmSign() {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/signAgree',
				query: {
					id: this.id
				}
			});
		},
    async downloadPdf() {
      this.form.validateFieldsAndScroll(async (err, values) => {
        
        if (!err) {
          const params = {
            operatorType: 'SAVE',
            type: 'ONLINE',
            stationLeaseContractId: this.selectStorageContractInfo.id || this.detailInfo.stationLeaseContractId,
            ...values,
            signArea: values.signArea.join('/'),
            bid: this.id || null
          }
          const res = await downloadPreviewWarehouseReceiptAgreementManage(params)
          comDownload(res.data,null,res.name)

        } 
      });
    },
    async oldAndNew(next) {
			//如果有原始数据并且原始数据与现有数据不一致，则发生了修改
      /** 判断当前必填项都已经完成 */
      this.form.validateFields(async (err, values) => {


        if(!err) {
          if(this.isOa) {
            let obj =  await this.$refs.workFlow.handleSubmit()
            console.log(obj)
            if(obj == false) {
              next()
              return
            }
            obj.auditChainAndOperator.needPushOA = true
            obj.auditChainAndOperator.operatorInfo.forEach(el => {
              return {
                systemCode: el.systemCode,
                systemName: el.systemName,
                operatorName: el.operatorName,
                operatorMobile: el.operatorMobile

              }
            });
            // 获取回显的oa数据
            // 判断原来没有OA
            if(!this.auditChainAndOperator) {
               this.openModal()
            } else {
              if(this.$route.query.id) {
                if(!deepCompare(this.cacheInfo, values) || !deepCompare(this.auditChainAndOperator, obj.auditChainAndOperator)) {
                  // 弹出提示
                  this.openModal()
                } else {
                  next()
                }
              } else {
                this.openModal()
              }
            }
   
          } else {
            if(this.$route.query.id) {
              if(!deepCompare(this.cacheInfo, values)) {
                // 弹出提示
                this.openModal()
              } else {
                next()
              }
            } else {
              this.openModal()
            }
          }
        } else {
          next()
        }
         
      })
		},
    openModal() {
      this.$refs.modalInfoChange.open()
    },
    // 协议签约地
    changeArea(arr) {
      
      this.$store.commit('logisticsPlatform/updateAgreeManageInfoArea',arr.join('/') )
    },
    changeType(type) {

      this.$store.commit('logisticsPlatform/updateTemplateType',type )
      
    },
    changeAddress(e) {
      let txt = e.target.value
       this.$store.commit('logisticsPlatform/updateStorageCompanyAddress',txt )
    },
    async getLastStorageContract() {
      const params = {
        pageSize: 10,
        pageNo: 1,
      }
      const res = await getWarehouseReceiptLeaseContractList(params)
      let list = res.data.records || []
      const item = list[0]
      this.selectStorageContract(item)
     
    }
  },
  components: {
    Breadcrumb,
    AgreementPdf,
    PreviewModal,
    LinkStorageContractDraw,
    WorkFlow,
    TipModal,
    ModalInfo,
    FullScreenIcon
  },
}
</script>

<style scoped  lang='less' >
.preview-wrap {
	height: 168px;
	width: 100%;
	border: 1px solid #eaebed;
	overflow: hidden;
	border-top: 0;
}
::v-deep.ant-tabs {
	margin-bottom: 30px;
	.ant-tabs-extra-content {
		cursor: pointer;
		.fullScreenIcon {
			display: inline-block;
			width: 14px;
			height: 14px;
			margin-right: 3px;
      position: relative;
			top: 2px;
		}
	}
}
::v-deep.ant-tabs-tabpane {
	height: 168px;
}
.line {
  width: 100%;
  height: 20px;
  background: #F3F5F6;
}
.slDetailBottom {
  margin-top: 20px;
  width: calc(100vw - 254px);
  border-top: 1px solid #e5e6eb;

  // min-width: 1186px;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // border-top: 1px solid #E5E6EB;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 228px;
  z-index:9;
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
