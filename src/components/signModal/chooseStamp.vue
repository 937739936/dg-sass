<template>
  <a-modal
    title="单据盖章"
    width="800px"
    destroyOnClose
    v-model="visible"
    @ok="checkSetpTwo"
    okText="下一步"
  >
    <div class="steps-content">
      <div v-if="this.certModelData.length>1">
        <strong class="steps-title">确认要加盖的签章方式</strong>
        <a-radio-group v-model="certModel" @change="certModelChange">
          <a-radio value="UKEY">Ukey（需进行密码验证）</a-radio>
          <a-radio value="TRUST">证书托管（需进行短信验证码校验）</a-radio>
        </a-radio-group>
      </div>
      <!-- 电子单据时才展示印章列表 -->
      <div v-if="this.type === 'electronic'">
        <strong class="steps-title">确认要加盖的印章</strong>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          bordered
          :pagination="false"
          :rowKey="(record) => record.id"
          :locale="{ emptyText: '暂无数据' }"
          :scroll="{ x: true }"
          class="sealTable"
          :loading="loading"
        >
          <div slot="docName" slot-scope="text" class="table-td-first">
            <div>
              {{ text }}
            </div>
          </div>
          <div slot="sealType" slot-scope="text, record" class="table-td">
            <div
              v-for="(item, index) in record.groupBySealTypeDTOS"
              :key="index"
              :class="
                index === record.groupBySealTypeDTOS.length - 1
                  ? ''
                  : 'borderBottom'
              "
            >
              {{ filterCodeByValueName(item.sealType, "cfca_seal_type") }}
            </div>
          </div>
          <div
            slot="sealName"
            slot-scope="sealName, record, indent"
            class="table-td"
          >
            <div
              v-for="(item, index) in record.groupBySealTypeDTOS"
              :key="index"
              :class="
                index === record.groupBySealTypeDTOS.length - 1
                  ? ''
                  : 'borderBottom'
              "
            >
              <template v-if="item.cfcaSealDTOList.length > 1">
                <a-radio-group
                  @change="(v) => handleChange(v, indent, record)"
                  v-model="record.value"
                >
                  <a-radio
                    v-for="(pro, i) in item.cfcaSealDTOList"
                    :key="i"
                    :value="pro.bid"
                    >{{ pro.sealName }}</a-radio
                  >
                </a-radio-group>
              </template>
              <template v-else>
                <span v-for="pro in item.cfcaSealDTOList" :key="pro.bid">{{
                  pro.sealName
                }}</span>
              </template>
            </div>
          </div>
          <div slot="sealImg" slot-scope="sealImg, record" class="table-td">
            <div
              v-for="(item, index) in record.groupBySealTypeDTOS"
              :key="index"
              :class="
                index === record.groupBySealTypeDTOS.length - 1
                  ? ''
                  : 'borderBottom'
              "
            >
              <div v-if="item.cfcaSealDTOList.length > 1" class="img-td">
                <img v-bind:src="`data:image/png;base64,${record.sealImg}`" />
              </div>
              <template v-else>
                <div
                  v-for="(pro, i) in item.cfcaSealDTOList"
                  :key="i"
                  class="img-td"
                >
                  <img :src="`data:image/png;base64,${pro.sealImg}`" />
                </div>
              </template>
            </div>
          </div>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters } from "vuex";
import { 
  API_GetCompanyCertModel,
  API_GetCompanySealList,
  API_GetCompanySealListSteel
} from "@/v2/api/sign";

import { filterCodeByValueName } from '@sub/utils/globalCode.js';
const columns = [
  {
    title: "电子单据",
    align: "center",
    dataIndex: "docName",
    key: "docName",
    scopedSlots: { customRender: "docName" },
  },
  {
    title: "印章类型",
    align: "center",
    dataIndex: "sealType",
    key: "sealType",
    scopedSlots: { customRender: "sealType" },
  },
  {
    title: "印章名称",
    align: "center",
    dataIndex: "sealName",
    key: "sealName",
    scopedSlots: { customRender: "sealName" },
  },
  {
    title: "印章图片",
    align: "center",
    width: 150,
    dataIndex: "sealImg",
    key: "sealImg",
    scopedSlots: { customRender: "sealImg" },
    fixed: "right",
  },
];
export default {
  name: "ChooseStamp",
  data() {
    return {
      columns,
      visible: false,
      stepsInfo: {
        current: 0,
        steps: [
          {
            title: "确认印章",
          },
          {
            title: "盖章校验",
          },
          {
            title: "盖章完成",
          },
        ],
      },
      dataSource: [],
      selected: {},
      form: this.$form.createForm(this),
      formLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
      },
      filterCodeByValueName: filterCodeByValueName,
      certModel: '',
      steelFalg: '',
      dataObj: {},
      certModelData: [],
      loading: false,
    };
  },
  props:{
    type:{ // 电子单据时才展示印章列表
      default(){
        return '';
      }
    },
  },
  watch: {
    dataSource: function (data) {
      this.dataSource = data;
    },
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_PERSONALLINFO: "VUEX_ST_PERSONALLINFO",
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
  },
  methods: {
    handleChange(v, indent, record) { // 修改印章的选择
      this.dataSource.forEach((item) => {
        // 印章名称修改时，印章图片相应的修改
        if (item.value === record.value) {
          let _item = item.groupBySealTypeDTOS;
          _item.forEach((pro) => {
            let _pro = pro.cfcaSealDTOList;
            _pro.forEach((project) => {
              if (project.bid === record.value) {
                record.sealImg = project.sealImg;
              }
            });
          });
        }
      });
      this.$set(this.dataSource, indent, record);
    },
    async showModal(obj, steelFalg) { // 单据盖章弹窗展示
      API_GetCompanyCertModel().then((res) => {
        if (res.success && res.data.length) {
          // 弹窗数据展示
          this.certModelData = res.data
          let flag = steelFalg || false;
          if (res.data.length>1) {
            obj.certModel = 'UKEY'
          } else {
            obj.certModel = res.data[0]
          }
          this.dataObj = obj
          this.steelFalg = flag
          this.certModel = this.dataObj.certModel
          if (this.type === 'electronic') { // 电子单据
            this.getList(this.dataObj, this.steelFalg);
          } else {
            if (res.data.length>1) { // 非电子单据，多种签章方式时才展示弹窗
              this.visible = true;
            } else {
              this.$emit("submit", '', this.certModel);
            }
          }
        }
      })
      
    },
    async getList(obj, steelFalg) { // 获取单据印章列表
      this.loading = true;
      // 钢材、煤炭不共用
      let API = steelFalg
        ? API_GetCompanySealListSteel
        : API_GetCompanySealList;
      try {
        const res = await API({
          bizLicenseNo: this.VUEX_ST_COMPANYSUER.companyUscc,
          ...obj,
        })
        this.dataSource = res.data || [];
        this.loading = false
        if (!this.dataSource.length) {
          this.$message.error("目前暂无需要加盖的印章");
          return;
        }
        this.visible = true;
        this.dataSource.forEach((item) => {
          // 初始化选中第一个值
          let _item = item.groupBySealTypeDTOS;
          _item.forEach((pro) => {
            let _pro = pro.cfcaSealDTOList;
            if (_pro.length > 0) {
              item.value = _pro[0].bid;
              item.sealImg = _pro[0].sealImg;
            }
          });
        });
      } catch (error) {
        this.loading = false
      }
    },
    getData() { // 获取数据，去除dataSource中未选中的数据
      let arr = JSON.parse(JSON.stringify(this.dataSource));
      let newArr = [];
      arr.forEach((item, indent) => {
        let value = item.value;
        let _item = item.groupBySealTypeDTOS;
        newArr.push(item);
        _item.forEach((pro, index) => {
          let _pro = Object.assign([], pro.cfcaSealDTOList);
          let new_pro = [];
          if (_pro.length > 1) {
            _pro.forEach((project) => {
              if (project.bid === value) {
                new_pro.push(project);
                newArr[indent].groupBySealTypeDTOS[index].cfcaSealDTOList =
                  new_pro;
              }
            });
          }
        });
      });
      return newArr;
    },
    checkSetpTwo() { // 下一步
      let cfcaSealList = this.getData(); // 印模结合数组
      if (this.type === 'electronic') {
        if (!cfcaSealList?.length) {
          this.$message.error('盖章的印模集合不能为空')
          return
        }
      }
      this.visible = false;
      this.$emit("submit", cfcaSealList, this.certModel);
    },
    certModelChange(e) { // 签章类型选择
      this.dataObj.certModel = e.target.value
      this.dataSource = []
      if (this.type === 'electronic') {
        this.getList(this.dataObj, this.steelFalg);
      }
    }
  },
};
</script>
<style lang="less" scoped>
.sealTable {
  ::v-deep.ant-table-tbody > tr > td {
    padding: 0;
  }
  .borderBottom {
    border-bottom: 1px solid #e8e8e8;
  }
  .table-td-first {
    padding: 0 14px;
  }
  .table-td {
    & > div {
      padding: 0 14px;
      height: 45px;
      line-height: 45px;
    }
  }
  .img-td {
    margin: 2px 0 6px;
    height: 43px;
    position: relative;
    & > img {
      max-height: 43px;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
  }
}
::v-deep.ant-table td {
  white-space: nowrap;
}
::v-deep.ant-table .ant-table-column-title {
  font-weight: 600;
}
.steps-content {
  &>div {
    margin-bottom: 30px;
    .steps-title {
      display: block;
      border-left: 2px solid @primary-color;
      padding-left: 15px;
      margin-bottom: 15px;
    }
  }
}

</style>