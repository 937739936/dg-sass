<template>
  <div class="content">


  <DetailInfo ref="detailInfo" source='oa'></DetailInfo>

  </div>
</template>
<script lang="jsx">
import DetailInfo from '@/v2/center/trade/views/contract/suppleAgreement/components/DetailInfo.vue'
import {
  API_STATION,
  API_SupplementalAgreementGetCompleted,
  API_SupplementalAgreementDetail,
  API_LOGINBYMOBILEFORSA,
} from 'api';
import {
  API_getOrderContractDetailById
} from "@/v2/center/trade/api/contract";
import { mapMutations } from 'vuex'
import iPagination from "@sub/components/iPagination";
import ContractTemplate from "components/template/index.vue";
import { labelCol, wrapperCol } from '@/config/layoutConfig';
import { getBaseInfoData1 } from "@/v2/utils/order/getBaseInfoData.js";
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer, down } from "untils/factory.js";
import moment from 'moment';
import { getPersonalDetail } from 'untils/factory.js'

const columns = [
  { title: '序号', dataIndex: 'mobile1' },
  { title: '基于原合同条款', dataIndex: 'mobile11' },
  { title: '变更前', dataIndex: 'mobile111' },
  { title: '变更后', dataIndex: 'mobile12' },
  { title: '变更说明', dataIndex: 'mobile123' },
];

const checkboxOptions = [
  { label: '基准价格', value: 'basePrice' },
  { label: '数量', value: 'quantity' },
  { label: '交货期限', value: 'deliveryDate' },
  { label: '运输方式', value: 'transportMode' },
];

export default {
  name: 'SuppleAgreementCreatOa',

  components: {

    DetailInfo
  },

  data(){
    return {
      columns,
      getPopupContainer,
      labelCol,
      wrapperCol,
      moment,
      transportMode: '',
      contractId: '',
      visible: false,
      pdfUrl: '',
      checkboxOptions: [...checkboxOptions],
      multiValueField: ['shipDischargingPortName', 'shipLoadingPortName', 'deliveryPlace', 'trainSendStationName', 'trainArriveStationName'],
      form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
      signContent: '',
      url: '',
      isSupplementalAgreement: false,
      supplementalAgreement: '',
      oldValue: {},
      transportModeItem: [],
      transportModeDict: [],
      placeData: [],
      contractDetail: {},
      despatchTypeDict: filterCodeByKey('despatchTypeDict'),
      oldDeliveryModeItem: [],
      contractTemplate: '',
      contractNo: '',
      completedSuppleAgreement: {},
      formDataIsChanged: false,
      id: '',
      // serialNo: '',
    }
  },

  computed: {
    isOa () {
      return this.$route.query.isOa;
    },
    getDespatchTypeDict() {
      const despatchTypeDict = {}
       this.despatchTypeDict.forEach((item) => {
        despatchTypeDict[item.value] = item.text;
      });
      return despatchTypeDict;
    }
  },

  created () {
    const { id, contractNo, orderId, type, contractId, companyUserId, } = this.$route.query;
    this.contractNo = this.$route.query.contractNo;
    this.id = id;
    this.orderId = orderId;
    this.type = type;
    this.contractId = contractId;
    // this.serialNo = id;

    API_LOGINBYMOBILEFORSA({
      id,
      companyUserId,
    }).then(res=>{
      this.VUEX_MU_USERTOKEN(res.token);
      getPersonalDetail(this.getDetail)
    })
  },

  methods: {
    ...mapMutations({
      VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
    }),
    getDetail() {
      this.$nextTick(() => {
        this.$refs.detailInfo.getDetail()
      })
      // this.getCompletedSuppleAgreementList();
      // this.getContractDetail();
    },
    downFile() {
      down(`data:application/pdf;base64,${this.pdfUrl}`, '补充协议.pdf');
    },

    handleSignDate(value) {
      if (value.format('x')  < this.maxSignDateTimeStamp) {
        this.$message.error(`签订日期不能小于${(moment(this.maxSignDateTimeStamp).format('LL'))}`);
        this.$nextTick(() => {
          this.form.resetFields(['signDate']);
        });
      }
    },
    goBack() {
      if (!this.formDataIsChanged) {
        this.$router.go(-1);
        return;
      }
      const modal = this.$confirm({
        title: '提示',
        content: <div>内容已被修改，是否要保存后再返回？<br/><br/><br/>
          <a-space>
            <a-button type='primary' ghost onClick={() => { modal.destroy() }}>取消</a-button>
            <a-button type='primary' ghost onClick={() => { this.$router.go(-1); modal.destroy(); }}>直接返回</a-button>
            <a-button type='primary' onClick={() => { this.save(1); modal.destroy(); }}>保存后返回</a-button>
          </a-space>
        </div>,
        okText: '是',
        cancelText:'否',
        // mask:false,
        okButtonProps: {
            style: { display: 'none' },
        },
        cancelButtonProps: {
            style: { display: 'none' },
        },
        icon: () => {
          return <a-icon type="exclamation-circle" theme="filled" />
        }
      });
    },
    onValuesChange(props, values) {
      this.formDataIsChanged = true;
    },
    validator(rule, value, callback){
      if (!value) {
        callback();
        return;
      }
      const text = '变更前与变更后数据不能一致，请重新填写';
      if (rule.field === 'deliveryDate') {
        if (this.contractDetail.deliveryStartDate === value[0].format('YYYY-MM-DD')
            && this.contractDetail.deliveryEndDate === value[1].format('YYYY-MM-DD')) {
          callback(text);
        }
        callback();
        return;
      }
      if (rule.field === 'transportMode') {
        if (this.contractDetail.transportMode === value) {
          callback(text);
        }
        callback();
        return;
      }
      if (this.contractDetail[rule.field] === value) {
        callback(text);
      }
      callback();
    },

    getCompletedSuppleAgreementList() {
      API_SupplementalAgreementGetCompleted({ contractNo: this.contractNo }).then((res) => {
        if (res.success) {
          this.completedSuppleAgreement = res.data || [];
          const signDate = (this.completedSuppleAgreement.agreementList || []).map((item) => moment(item.signDate).format('x'));
          this.maxSignDateTimeStamp = Math.max(...signDate, moment(this.completedSuppleAgreement.contractSignDate).format('x'));
        }
      });
    },
    getContractDetail() {
      API_getOrderContractDetailById({ orderId: this.orderId }).then((res) => {
        if (res.success) {
          this.contractDetail = { ...res.data.contract, ...res.data.contractDelivery };

          this.contractTemplate = this.contractDetail.contractTemplateName;
          const transportMode = this.contractDetail.transportMode;

          const { transportFormField } = getBaseInfoData1(transportMode, '', this.contractTemplate, true);
          this.oldDeliveryModeItem = [...transportFormField];
          this.oldDeliveryModeItem.forEach((item) => {
            this.checkboxOptions.push({ label: item.label, value: item.value })
          });

          this.transportModeItem = [...transportFormField];
          this.transportModeDict = filterCodeByKey('transportModeDict' + this.contractTemplate);

          if (this.id) {
            this.getAgreementDetail();
            return;
          }
          this.isSupplementalAgreement = true

        }
      }).catch(() => {
        this.isSupplementalAgreement = true
      } )
    },
    getAgreementDetail() {
      API_SupplementalAgreementDetail({ id: this.id }).then((res) => {
        if (res.success) {
          const agreementDetail = res.data;
          this.supplementalAgreement = agreementDetail.signContent;
          this.isSupplementalAgreement = true;
          const changeContent = agreementDetail.changeItems.map((item) => item.fieldName);

          if (changeContent.includes('transportMode')) {
            let transportMode = ''
            agreementDetail.changeItems.forEach((item) => {
              if (item.fieldName === 'transportMode') {
                item.itemDetails.forEach((i) => {
                  if (i.itemName === 'transportMode') {
                    transportMode = i.value;
                  }
                })
              }
            })
            const { transportFormField } = getBaseInfoData1(transportMode, '', this.contractTemplate, true);
            this.transportModeItem = [...transportFormField];
          }

          let fields = {
            signDate: moment(agreementDetail.signDate),
          };
          this.$nextTick(() => {
            // this.form.setFieldsValue(fields);
            // this.form.setFieldsValue({ changeContent, ...fields });
          });
          this.form.setFieldsValue({ changeContent, ...fields });


          agreementDetail.changeItems.forEach((item) => {
            const fieldName = item.fieldName;
            fields = {
              ...fields,
              [`${fieldName}-regulation`]: item.regulation,
              [`${fieldName}-description`]: item.description,
            }
            item.itemDetails.forEach((i) => {
              switch (fieldName) {
                case 'basePrice':
                  fields = {
                    ...fields,
                    [fieldName]: i.value,
                  };
                  break;
                case 'quantity':
                  if (i.itemName === 'quantityOffset') {
                    fields = {
                      ...fields,
                      quantityOffset: i.value,
                    };
                  }
                  if (i.itemName === 'quantity') {
                    fields = {
                      ...fields,
                      [fieldName]: i.value,
                    };
                  }
                  break;
                case 'deliveryDate':
                  if (i.itemName === 'deliveryStartDate') {
                    fields = {
                      ...fields,
                      deliveryDate: fields.deliveryDate || [],
                    };
                    fields.deliveryDate[0] = moment(i.value);
                  }
                  if (i.itemName === 'deliveryEndDate') {
                    fields = {
                      ...fields,
                      deliveryDate: fields.deliveryDate || [],
                    };
                    fields.deliveryDate[1] = moment(i.value);
                  }
                  break;
                default:
                  if (fieldName !== 'transportMode') {
                    fields = {
                      ...fields,
                      [fieldName]: this.multiValueField.includes(fieldName) ? (i.value || '').split(',') : i.value,
                    };
                  }
                  break;
              }
            });

            if (fieldName === 'transportMode') {
              this.transportMode = item.fieldCName;
              item.itemDetails.forEach((j) => {
                fields = {
                  ...fields,
                  [j.itemName]: this.multiValueField.includes(j.itemName) ? (j.value || '').split(',') : j.value,
                }
              })
            }
          });

          this.$nextTick(() => {
            this.form.setFieldsValue(fields);
            this.formDataIsChanged = false;
          });
        }
      })
    },
    transportModeChange(value) {
      const { transportFormField } = getBaseInfoData1(value, '', this.contractTemplate, true);
      this.transportModeItem = [...transportFormField];
    },
    fetchPlace(data){
      if(!data) return
      API_STATION({
        keywords: encodeURIComponent(data)
      }).then(res=>{
        if(res.code != 200){
          this.$message.error(res.message)
          return;
        }
        this.placeData = res.result
      })
    },
    changeContent() {
      const changeContent = this.form.getFieldValue('changeContent') || [];
      const changeContentReorder = [];
      this.checkboxOptions.forEach((item) => {
        if (changeContent.includes(item.value)) {
          changeContentReorder.push(item.value);
        }
      });
      return changeContentReorder;
    },
    handleCheckboxDisabled(value) {
      // disabled: this.form.getFieldValue('changeContent') && this.form.getFieldValue('changeContent').includes('transportMode')
      const transportModeItem = this.oldDeliveryModeItem.map((item) => item.value)
      const changeContentValue = this.form.getFieldValue('changeContent') || [];
      if (transportModeItem.includes(value) && changeContentValue.includes('transportMode')) {
        return true
      }
      if (transportModeItem.some((item) => changeContentValue.includes(item)) && value === 'transportMode') {
        return true
      }
      return false;
    },

    handleChangeItemsData(value) {
      const changeContent = this.changeContent();
      const data = [];
      changeContent.forEach((item, index) => {
        let itemDetails = [];
        switch (item) {
          case 'basePrice':
            itemDetails = [
              {
                itemName: item, // 变更项名称
                oldValue: this.contractDetail.basePrice, // 变更项老的值
                value: value[item] // 变更项新的值
              }
            ]; // 具体变更项
            break;
          case 'quantity':
            itemDetails = [
              {
                itemName: item,
                oldValue: this.contractDetail.quantity,
                value: value[item],
              },
              {
                itemName: 'quantityOffset',
                oldValue: this.contractDetail.quantityOffset, 
                value: value.quantityOffset,
              }
            ];
            break;
          case 'deliveryDate':
            itemDetails = [
              {
                itemName: 'deliveryStartDate',
                oldValue: this.contractDetail.deliveryStartDate, 
                value: value[item][0].format('YYYY-MM-DD'),
              },
              {
                itemName: 'deliveryEndDate',
                oldValue: this.contractDetail.deliveryEndDate, 
                value: value[item][1].format('YYYY-MM-DD'),
              }
            ];
            break;

          // case 'transportMode':
            
          //   break;
          default:
            break;
        }

        if (this.form.getFieldValue('transportMode') && item === 'transportMode') {
          this.transportModeItem.forEach((i) => {
            if (value[i.value]) {
              itemDetails = [
                ...itemDetails,
                {
                  itemName: i.value, // 变更项名称
                  // oldValue: this.oldValue[item][item], // 变更项老的值
                  value: this.multiValueField.includes(i.value) ? value[i.value].join(',') : value[i.value], // 变更项新的值
                }
              ];
            }
          });
          itemDetails = [
            ...itemDetails,
            {
              itemName: 'transportMode',
              oldValue: this.contractDetail.transportMode,
              value: this.form.getFieldValue('transportMode')
            }
          ];
        }

        this.oldDeliveryModeItem.forEach((i) => {
          if (i.value === item) {
            itemDetails = [
              {
                itemName: item,
                oldValue: this.contractDetail[item],
                value: value[item] // 变更项新的值
              }
            ];
          }
        });


        const valueItem = {
          itemDetails,
          serialNumber: index + 1, // 序号
          fieldName: item, // 变更字段
          regulation: value[`${item}-regulation`], // 变更条列
          description: value[`${item}-description`], // 变更说明
        }
        data.push(valueItem);
      })

      return data;
    },

    getData(data) {
      this.onValuesChange();
      if (data.data.replace(/<[^>]+>/g, "") == "") {
        this.signContent = "";
      } else {
        this.signContent = data.data;
      }
    },
  }
}
</script>
<style lang="less" scoped>
  .content{
    // width: 993px;
    margin: 30px auto;
    border: 1px solid #dddddd;
    padding: 30px;
  }
  ::v-deep .select-template{
    display: none;
  }
  ::v-deep .ant-input-number{
    width: auto;
  }
  .form{
    ::v-deep .ant-form-item{
      margin: 0;
    }
  }
  .table{
    width: 100%;
  }
  .title {
    padding: 15px 0px;
    text-align: center;
  }
  .desc{
    margin: 20px 0px;
    
  }
  .indent{
    text-indent: 2em;
  }
  .checkbox{
    padding-left: 2em;
  }
  .red{
    color: #f5222d;
  }
  th{
    background: #fafafa;
  }
  th, td{
    padding: 8px;
    overflow-wrap: break-word;
    border-bottom: 1px solid #e8e8e8;
  }
</style>