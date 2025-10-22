<template>
  <div>
    <a-modal
        v-if="visible"
        width="800px"
        :title="systemConfig.name+'用户服务协议'"
        :visible="visible"
        @cancel="hideModal"
        :cancelButtonProps="{
        style: {
          display: 'none',
        },
      }"
    >
      <template slot="footer">
        <a-button type="primary" @click.native="hideModal">确定</a-button>
      </template>
      <div
          style="width: 100%; height: 400px; overflow: hidden; overflow-y: auto"
      >
        <div id="agree">
          <p style="text-align:center;color: #000000;font-size: 14pt"><strong>{{ systemConfig.name }}用户服务协议</strong></p>
          <a @click="date=202206" style="margin-bottom: 8px;display: inline-block;margin-left: 28px"
             v-if="date!=202206">
            <a-icon type="arrow-left"/>
            返回</a>
          <p style="color: #000000">版本及更新</p>
          <div v-if="date==202206">
            <p style="color: #000000">当前版本：2022年6月版</p>
            <p style="color: #000000">历史版本：<a @click="date=202101">2021年1月版</a> <a style="margin-left: 8px"
                                                                                   @click="date=202109">2021年9月版</a></p>
          </div>
          <div v-if="date==202109">
            <p style="color: #000000">当前版本：2021年9月版</p>
            <p style="color: #000000">历史版本：<a @click="date=202101">2021年1月版</a></p>
          </div>
          <div v-if="date==202101">
            <p style="color: #000000">当前版本：2021年1月版</p>
            <p style="color: #000000">历史版本：无</p>
          </div>
          <UserAgreement202101 v-if="date==202101"/>
          <UserAgreement202109 v-if="date==202109"/>
          <UserAgreement202206 v-if="date==202206"/>
        </div>
      </div>
    </a-modal>
    <a-modal
        v-if="secondAgree"
        width="800px"
        title="隐私保护政策"
        :visible="visible"
        @cancel="hideModal"
        :cancelButtonProps="{
        style: {
          display: 'none',
        },
      }"
    >
      <template slot="footer">
        <a-button type="primary" @click.native="hideModal">确定</a-button>
      </template>
      <div
          style="width: 100%; height: 400px; overflow: hidden; overflow-y: auto"
      >
      <div id="agree">
        <p style="text-align:center;color: #000000;font-size: 14pt"><strong>{{ systemConfig.name }}隐私保护政策</strong></p>
        <a @click="date=202206" style="margin-bottom: 8px;display: inline-block;margin-left: 28px" v-if="date!=202206">
          <a-icon type="arrow-left"/>
          返回</a>
        <p style="color: #000000">版本及更新</p>
        <div v-if="date==202206">
          <p style="color: #000000">当前版本：2022年6月版</p>
          <p style="color: #000000">历史版本：<a @click="date=202101">2021年1月版</a> <a style="margin-left: 8px"
                                                                                 @click="date=202109">2021年9月版</a></p>
        </div>
        <div v-if="date==202109">
          <p style="color: #000000">当前版本：2021年9月版</p>
          <p style="color: #000000">历史版本：<a @click="date=202101">2021年1月版</a></p>
        </div>
        <div v-if="date==202101">
          <p style="color: #000000">当前版本：2021年1月版</p>
          <p style="color: #000000">历史版本：无</p>
        </div>
        <PrivacyAgreement202101 v-if="date==202101"/>
        <PrivacyAgreement202109 v-if="date==202109"/>
        <PrivacyAgreement202206 v-if="date==202206"/>
      </div>
      </div>

    </a-modal>
    <a-modal
        v-if="certificateAgree"
        width="800px"
        :title="systemConfig.name+'数字证书服务协议'"
        :visible="visible"
        @cancel="hideModal"
        :destroyOnClose="true"
        :cancelButtonProps="{
        style: {
          display: 'none',
        },
      }">
      <template slot="footer">
        <a-button type="primary" @click.native="hideModal">确定</a-button>
      </template>
      <div
          style="width: 100%; height: 400px; overflow: hidden; overflow-y: auto" class="content-wrap">
        <div v-html="htmlContentService"></div>
        <a-spin class="loading-icon" v-if="!htmlContentService" />
      </div>
    </a-modal>


    <a-modal
        v-if="companyCertification"
        width="800px"
        :title="systemConfig.name+'企业认证服务协议'"
        :visible="visible"
        @cancel="hideModal"
        :cancelButtonProps="{
        style: {
          display: 'none',
        },
      }">
      <template slot="footer">
        <a-button type="primary" @click.native="hideModal">确定</a-button>
      </template>
      <div
          style="width: 100%; height: 400px; overflow: hidden; overflow-y: auto"
      >
      <div id="agree">
        <p style="text-align:center;color: #000000;font-size: 14pt"><strong>{{ systemConfig.name }}企业认证服务协议</strong></p>
        <a @click="date=202206" style="margin-bottom: 8px;display: inline-block;margin-left: 28px" v-if="date!=202206">
          <a-icon type="arrow-left"/>
          返回</a>
        <p style="color: #000000">版本及更新</p>
        <div v-if="date==202206">
          <p style="color: #000000">当前版本：2022年6月版</p>
          <p style="color: #000000">历史版本：<a @click="date=202101">2021年1月版</a> <a style="margin-left: 8px"
                                                                                 @click="date=202109">2021年9月版</a></p>
        </div>
        <div v-if="date==202109">
          <p style="color: #000000">当前版本：2021年9月版</p>
          <p style="color: #000000">历史版本：<a @click="date=202101">2021年1月版</a></p>
        </div>
        <div v-if="date==202101">
          <p style="color: #000000">当前版本：2021年1月版</p>
          <p style="color: #000000">历史版本：无</p>
        </div>
        <CertAgreement202101 v-if="date==202101"/>
        <CertAgreement202109 v-if="date==202109"/>
        <CertAgreement202206 v-if="date==202206"/>
      </div>
      </div>
    </a-modal>

    <a-modal
        v-if="cfcaAgree"
        width="800px"
        title="CFCA数字证书服务协议"
        :visible="visible"
        @cancel="hideModal"
        :destroyOnClose="true"
        :cancelButtonProps="{
        style: {
          display: 'none',
        },
      }">
      <template slot="footer">
        <a-button type="primary" @click.native="hideModal">确定</a-button>
      </template>
      <div style="width: 100%; height: 400px; overflow: hidden; overflow-y: auto" class="content-wrap">
        <div v-html="htmlContentCFCA"></div>
        <a-spin class="loading-icon" v-if="!htmlContentCFCA" />
      </div>
    </a-modal>

    <a-modal
        v-if="declarationAgree"
        width="800px"
        title="声明函"
        :visible="visible"
        @cancel="hideModal"
        :destroyOnClose="true"
        :cancelButtonProps="{
        style: {
          display: 'none',
        },
      }">
      <template slot="footer">
        <a-button type="primary" @click.native="hideModal">确定</a-button>
      </template>
      <div style="width: 100%; height: 400px; overflow: hidden; overflow-y: auto" class="content-wrap">
        <div v-html="htmlContentDeclar"></div>
        <a-spin class="loading-icon" v-if="!htmlContentDeclar" />
      </div>
    </a-modal>

  </div>
</template>
<script>
import UserAgreement202101 from './txt/UserAgreement202101'
import UserAgreement202109 from './txt/UserAgreement202109'
import UserAgreement202206 from './txt/UserAgreement202206'
import PrivacyAgreement202101 from './txt/PrivacyAgreement202101'
import PrivacyAgreement202109 from './txt/PrivacyAgreement202109'
import PrivacyAgreement202206 from './txt/PrivacyAgreement202206'
import CertAgreement202101 from './txt/CertAgreement202101'
import CertAgreement202109 from './txt/CertAgreement202109'
import CertAgreement202206 from './txt/CertAgreement202206'
import { API_GET_AGREEMENT_CLIENT } from "@/v2/center/person/api";
import systemConfig from '@/v2/config/common';

export default {
  components: {
    UserAgreement202101,
    UserAgreement202109,
    UserAgreement202206,
    PrivacyAgreement202101,
    PrivacyAgreement202109,
    PrivacyAgreement202206,
    CertAgreement202101,
    CertAgreement202109,
    CertAgreement202206,
  },
  data() {
    return {
      visible: false,
      firstAgree: true,
      secondAgree: false,
      certificateAgree: false,
      companyCertification: false,
      cfcaAgree: false,
      declarationAgree: false,
      date: '202206',
      htmlContentCFCA: null,
      htmlContentService: null,
      htmlContentDeclar: null,
      systemConfig
    };
  },
  methods: {
    showModal(content) {
      if (content == "firstAgree") {
        this.firstAgree = true
      } else if (content == "secondAgree") {
        this.secondAgree = true
      } else if (content == 'certificateAgree') {
        this.certificateAgree = true
        API_GET_AGREEMENT_CLIENT({
          fileType: 'SH_DATA_CERT_SERVICE_AGREEMENT'
        }).then(res => {
          if(res.success) {
            this.htmlContentService = res.data.content;
          }
        });
      } else if (content == 'companyCertification') {
        this.companyCertification = true
      } else if (content == 'cfcaAgree') {
        this.cfcaAgree = true
        API_GET_AGREEMENT_CLIENT({
          fileType: 'CFCA_DATA_CERT_SERVICE_AGREEMENT'
        }).then(res => {
          if(res.success) {
            this.htmlContentCFCA = res.data.content;
          }
        });
      } else if (content == 'declarationAgree') {
        this.declarationAgree = true
        API_GET_AGREEMENT_CLIENT({
          fileType: 'SH_DATA_CERT_DECLARATION_LETTER'
        }).then(res => {
          if(res.success) {
            this.htmlContentDeclar = res.data.content;
          }
        });
      }
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
      let timer = setTimeout(() => {
        clearTimeout(timer)
        this.firstAgree = false
        this.secondAgree = false
        this.certificateAgree = false
        this.companyCertification = false
        this.cfcaAgree = false
        this.declarationAgree = false
      },300)
      
    },
  },
};
</script>
<style lang='less' scoped>
#agree {
  p {
    text-indent: 24pt;
    font-family: 微软雅黑;
    font-size: 10.5pt;
  }

  a {
    color: #1890ff !important;

    span {
      color: #1890ff !important;
    }
  }
}
.content-wrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.loading-icon {
  margin-top: 20px;
}
</style>


