<template>
  <div>
    <ul class="grid-wrap" >
      <li>
        <span class="label">合同编号</span>
        <span >
          <a href="javascript:;" @click="goContractDetail">{{info.contractNo}}</a>
          <a href="javascript:;" @click="openRelationModal" style="margin-left:5px">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style="vertical-align: middle;cursor: pointer;margin-top:-2px">
              <path d="M9.77515 1.74834L8.60848 2.915H2.91667V11.0817H11.0833V5.38987L12.25 4.22321V11.665C12.25 11.9871 11.9888 12.2484 11.6667 12.2484H2.33333C2.01117 12.2484 1.75 11.9871 1.75 11.665V2.33167C1.75 2.00951 2.01117 1.74834 2.33333 1.74834H9.77515ZM11.9498 1.22363L12.7747 2.04859L7.41247 7.41083L6.58898 7.41223L6.58752 6.58588L11.9498 1.22363Z" fill="var(--primary-color)"/>
            </svg>
          </a>

        </span>

      </li>
      <li>
        <span class="label">卖方企业</span>
        <span>{{info.sellerName}}</span>
      </li>
      <li>
        <span class="label">买方企业</span>
        <span>{{info.buyerName}}</span>
      </li>
      <li>
        <span class="label">品名</span>
        <span>{{info.goodsName}}</span>
      </li>
      <li>
        <span class="label">基准价格</span>
        <span v-if="info.followTheMarket">随行就市</span>
        <span v-if="info.basePrice !== undefined && info.basePrice !== null  && !info.followTheMarket && !info.basePriceDesc">
          <i v-if="info.basePrice == '随行就市' || info.basePrice == 0">随行就市</i>
          <i v-else>￥{{info.basePrice | formatMoney(2)}}/吨</i>
        </span>
        <i v-if="info.basePriceDesc && !info.followTheMarket">{{info.basePriceDesc || '-'}}</i>

      </li>
      <li>
        <span class="label">数量</span>
        <span>{{info.quantity | formatMoney }} 吨  <i v-if="info.quantityOffset">（±{{info.quantityOffset}}%）</i> </span>
      </li>
      <li>
        <span class="label">交货期限</span>
        <span>{{info.startDate}} - {{info.endDate}} </span>
      </li>
      <li>
        <span class="label">运输方式</span>
        <span>{{info.transportModeDesc}}</span>
      </li>
      <li>
        <span class="label">收货人</span>
        <span>{{info.consigneeCompanyName || '-'}}</span>
      </li>
    </ul>
    <RelationContract 
      ref="relationContract" 
      source='add' 
      @relation='getSelectContract'
      :querySource='querySource'
      :type="type"
    ></RelationContract>
  </div>
</template>

<script>
import RelationContract from './RelationContract.vue'
import { mapGetters, mapMutations } from "vuex"
import { getContractInfo } from "../../../api/inout.js";
import { getCoalType, getCoalConfigByType, API_getTempleteByCode } from '@/v2/api/diy';
import { cloneDeep, debounce } from 'lodash';
import { 

getWarehouseReceiptContractDetail,
getIndex,


} from '@/v2/center/logisticsPlatform/api/warehouseReceipt'
const idsMap = {
	transportModeName: 'transportMode',
	deliveryModeName: 'deliveryMode',
	settleModeName: 'settleMode',
	freightPayModeName: 'freightPayMode',
	sellerContactName: 'sellerContactsId',
	buyContactName: 'buyerContactsId',
	sellerBankNo: 'sellerBankAccountId',
	buyBankNo: 'buyerBankAccountId',
	deliveryStartDate: 'deliveryDate'
};
export default {
  props: {
    type: {
      default: 'IN'
    },
    querySource: {
      default: ''
    },
  },
  data() {
    return {
      info: { },
      relationForm: this.$form.createForm(this),
      contractTemplateList: [],
      productIndicatorList: [],
      hasProductIndicator: false,
      templeteData: {},
      // 判断是否是 编辑 第一次加载
      isFirst: false,
    }
  },
  computed: {
    ...mapGetters('user', {
        VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),

    // 判断当前是否关联了合同
    isRelationContract() {
      
      return !!this.info.serialNo
    }
  },
  watch:{
    $route(to ){
      if(to.query.contractId) {
        this.getContractInfo()
      } else {
        this.info = {}
        this.$emit("sendRelationFlag",{}, this.isFirst)
      }
    }
  },
  mounted() {
    if(this.$route.query.contractId) {
      this.getContractInfo()
    } else {
      this.$nextTick(() => {
        
        this.relationForm.setFieldsValue({noRelation: true})
      })
    }
  },
  beforeDestroy() {
		this.clearThymeleafHtml();
	},
  methods: {
    ...mapMutations({
    	
			
		

			VUEX_SET_PRODUCTION_INDICATOR: 'contract/VUEX_SET_PRODUCTION_INDICATOR',
			VUE_SET_OPTIONS_LIST: 'contract/VUE_SET_OPTIONS_LIST',
			VUEX_SET_CONTRACT_BOOLEAN: 'contract/VUEX_SET_CONTRACT_BOOLEAN',
      VUEX_UPDATE_CONTRACT_DATA: 'contract/VUEX_UPDATE_CONTRACT_DATA',
      VUEX_SET_UPDATE_INDICATOR: 'contract/VUEX_SET_UPDATE_INDICATOR',
		}),
    // 选择合同
    openRelationModal() {

       this.$refs.relationContract.show()
    },
    init(info= {}, isFirst = false) {
        this.isFirst = isFirst
        this.getContractInfo(info.contractId || info.orderContractId, info.contractType  )
    },
    async getContractInfo(orderContractId, contractType) {


        
      const params = {

        contractType:  contractType || this.$route.query.contractType,
        orderContractId:orderContractId || this.$route.query.contractId,
      }

      const res = await getWarehouseReceiptContractDetail(params)

      let info = res.data || {}
      this.info = info

      this.VUEX_UPDATE_CONTRACT_DATA({contract: this.info, ...this.info})
      /** 清除质量指标 */




      this.$emit('sendRelationFlag',info, this.isFirst)

      await this.getCoalConfig( contractType || this.$route.query.contractType, orderContractId || this.$route.query.contractId )
    
      
    },
    // 去往合同详情
    goContractDetail() {
      let contractType  = this.type == 'IN' ? 'BUY' : 'SELL'

      let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${this.info.orderContractId}&type=${contractType}`

      if(this.info.contractType == 'OFFLINE') {
      
        path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${this.info.orderContractId}&type=${contractType.toLowerCase()}`

      }
      window.open(path)
    },
    changeRelation(e) {
      this.relationForm.setFields({
        contractNo: {
          value: undefined,
          errors: null,
        },
      });
    },
     // 获取选择的合同
    getSelectContract(info = {}) {
       this.isFirst = false
       this.getContractInfo(info.orderContractId, info.contractType)


    },
    geInfo() {
      return new Promise((resolve) => {
        if(this.relationForm.getFieldValue('noRelation') === false)  {
          this.relationForm.validateFieldsAndScroll((err, values) => {
            if(err) {
              resolve(false)
            } else {
              resolve(this.info)
            }
          })
        } else {
          resolve(this.info)
        }
      })
    },
    	// 根据煤种查询配置
		async getCoalConfig(contractType, orderContractId ) {
      const params = {
        id:  this.isFirst ? this.$route.query.id : null,
				orderContractId,
				contractType
      }
      // const res = await getCoalConfigByType(params)
      const res = await getIndex(params)

    
      this.productIndicatorList = res.data || [];
      if (this.productIndicatorList.length) {
        this.hasProductIndicator = true;
      } else {
        this.hasProductIndicator = false;
      }
      res.data.forEach(item => {
        if (item.inputType == 'RANGE') {
          item.valueList = {
            [`${item.indicatorCode}_value2`]: null,
            [`${item.indicatorCode}_value1`]: null
          };
        } else {
          const value = {
            [`${item.indicatorCode}_value1`]: null
          };
          if (item.symbolList) {
            value[`${item.indicatorCode}_symbol`] = item.symbol || undefined;
          }
          item.valueList = value;
        }
      });
      this.VUEX_SET_PRODUCTION_INDICATOR(res.data.sort((a, b) => a.sortOrder - b.sortOrder));
      if(!this.isFirst) {
        let productIndicatorList =  res.data || []
        productIndicatorList.forEach(el => {
            el.valueList = { }
            el.valueList[el.indicatorCode + '_value1'] = el.value1
            el.valueList[el.indicatorCode + '_value2'] = el.value2

          })

        productIndicatorList = productIndicatorList.filter(el => el.selected).filter((el,i) => i < 10)

        const orderIndicators = [
            {
              productIndicatorList,
            }
          ]
        this.VUEX_SET_UPDATE_INDICATOR(orderIndicators);
        this.$emit('updateIndex')
      }

    },
    // 存储配置文件中所有下拉选项的options
		getOptionsList(transportMode) {
			const tempArr = [];
			for (const key in this.templeteData.formList) {
				if (this.templeteData.formList[key].length) {
					this.templeteData.formList[key].forEach(item => {
						if (item.options && item.options.length) {
							tempArr.push(item.options);
						}
					});
				}
			}
			let deliveryModeList = [];
			transportMode.forEach(item => {
				if (item.deliveryMode && item.deliveryMode.length) {
					deliveryModeList = deliveryModeList.concat(item.deliveryMode);
				}
			});
			this.VUE_SET_OPTIONS_LIST(transportMode.concat(tempArr.flat()).concat(deliveryModeList));
		},
    setThymeleafHtmlContent(content, code) {
			this.clearThymeleafHtml();
			const htmlParse = new DOMParser();
			this.htmlStr = htmlParse.parseFromString(this.filterHtmlContent(content), 'text/html');
			this.filterHtmlDomByAttr(this.htmlStr, this.attr);
			const elem = document.createElement('div');
			elem.setAttribute('id', `thymeleaf-content-${code}`);
			elem.style.display = 'none';
			elem.appendChild(this.htmlStr.childNodes[0]);
			document.body.appendChild(elem);
		},
    // 清除设置的thymeleaf html节点
		clearThymeleafHtml() {
			const html = document.body;
			for (let i = 0; i < html.childNodes.length; i++) {
				if (html.childNodes[i].nodeType === 1) {
					if (html.childNodes[i].getAttribute('id')?.indexOf('thymeleaf-content-') >= 0) {
						html.childNodes[i].parentNode.removeChild(html.childNodes[i]);
					}
				}
			}
		},
    		// 过滤html中特殊字符
		filterHtmlContent(content) {
			if (!content) {
				return '';
			}
			return content
				.replace(/\/n/g, '')
				.replace(/\"/g, "'")
				.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, '');
		},
    filterHtmlDomByAttr(html, attr = this.attr) {
			for (let i = 0; i < html.childNodes.length; i++) {
				if (html.childNodes[i].nodeType === 1) {
					let attrText = html.childNodes[i].getAttribute('th:text') || html.childNodes[i].getAttribute('th:utext');
					let attrIfText = '';
					if (html.childNodes[i].getAttribute('th:if')) {
						attrIfText = html.childNodes[i].getAttribute('th:if')?.replace(/\s*/g, '');
						if (attrIfText.indexOf('!=null') >= 0) {
							const indexArr = [attrIfText.indexOf('{'), attrIfText.indexOf('}')];
							const replaceAttrName = attrIfText.substring(indexArr[0] + 1, indexArr[1]);
							this.VUEX_SET_CONTRACT_BOOLEAN(replaceAttrName);
							html.childNodes[i].setAttribute('th:if', '${' + replaceAttrName + 'Boolean' + '} == true');
						}
					}
					if (attrText) {
						attrText = attrText?.replace('${', '')?.replace('}', '');
						html.childNodes[i].setAttribute('id', idsMap[attrText] || attrText);
					}
					let attrTextEach = html.childNodes[i].getAttribute('th:each');
					if (attrTextEach) {
						html.childNodes[i].setAttribute('id', 'indicatorList');
					}
					const attrFlag = html.childNodes[i].getAttribute(attr);
					if (attrFlag && attrFlag.indexOf('customCount+') >= 0) {
						const key = html.childNodes[i].getAttribute(attr);
						this.getKeyAndValue(key);
						html.childNodes[i].setAttribute(this.attr, '${' + this.replaceElem[key] + '}');
					}
					if (attrFlag && attrFlag.indexOf('customCountCn_') >= 0) {
						const key = html.childNodes[i].getAttribute(attr);
						this.getKeyAndValue(key);
						html.childNodes[i].setAttribute(this.attr, '${' + this.replaceElem[key] + '}');
					}
					if (html.childNodes[i].childNodes) {
						this.filterHtmlDomByAttr(html.childNodes[i], attr);
					}
				}
			}
		},
  },
  components: {
    RelationContract,
  }
}
</script>

<style scoped  lang='less' >
.grid-wrap {
  margin-top: 20px;
  width: 100%;
  border-radius: 3px;
  height: auto;
  overflow: hidden;
  border-left: 1px solid #E5E6EB;
  li {
    width: 33.3%;
    height: 48px;
    float: left;
    border-bottom: 1px solid #E5E6EB;
    border-right: 1px solid #E5E6EB;
    overflow: hidden;
    position: relative;
    span {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      padding: 0 12px;
      text-align: left;
    }
    &>span:first-child {
      border-right: 1px solid #E5E6EB;
    }
    .label{
      width: 120px;
      background: #F3F5F6;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #77889D;
      position: absolute;
      left: 0;
      top: 0;
    }
    span:last-child{
      width: 100%;
      padding-left: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  li:nth-child(1),li:nth-child(2), li:nth-child(3) {
    border-top: 1px solid #E5E6EB;
  }
  li:nth-child(3){
    border-radius: 0 3px 0 0;
  }
  li:last-child {
    border-radius: 0 0 3px 0;
  }
  li.special {
    border-radius: 0 3px 3px 0;
  }
}
.ant-col{
  height: 82px;
  // margin-bottom: 10px
}
.col-height.ant-col {
  height: inherit;
}
.ant-form-item {
  width: 364px;
  margin-bottom: 0;
}
.no-relation {
  position: relative;
  top: 35px;
}

</style>
