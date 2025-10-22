<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span class="slTitle">新增{{ typestr }}库记录</span>
      </div>
      <div class="slTitleAssis">
        {{ typestr }}库信息
        <span v-if="type == 'IN'" class="red">(请在车辆到达后再进行录入)</span>
      </div>
      <a-form :form="form" :colon="false" class="slFormDetail">
        <a-row v-if="type == 'IN'">
          <a-col :span="8">
            <a-form-item label="运输方式" required>
              <a-input value="火运" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="煤种" required>
              <a-select
                placeholder="请选择煤种"
                mode="tags"
                show-search
                :filter-option="filterOptions"
                option-filter-prop="children"
                @change="coalTypeChange"
                v-decorator="['coalType', { rules: valdater['coalType'] }]"
              >
                <a-select-option
                  v-for="item in coalTypeList"
                  :value="item.name"
                  :key="item.id"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="typestr + '库重量(吨)'">
              <a-input
                :placeholder="'请输入' + typestr + '库重量'"
                v-decorator="['weight', { rules: valdater['weight'] }]"
                @blur="checkWeight"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <template v-else>
          <a-row>
            <a-col :span="8">
              <a-form-item label="运输方式" required>
                <a-input value="火运" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="车次号">
                <a-input-number
                  placeholder="请输入车次号"
                  style="width: 100%"
                  v-decorator="[
                    'trainSerialNo',
                    { rules: valdater['trainSerialNo'] },
                  ]"
                  :min="0"
                  :precision="0"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item>
                <span slot="label">
                  启票重量(吨)
                  <a-tooltip>
                    <template slot="title"> 铁路大票上的标准吨位数 </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <a-input
                  placeholder="请输入启票重量"
                  v-decorator="[
                    'invoicingWeight',
                    { rules: valdater['invoicingWeight'] },
                  ]"
                  @blur="differenceWeightCalculate"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <span slot="label">
                  {{ typestr }}库重量(吨)
                  <a-tooltip>
                    <template slot="title"> 发车时实际轨道衡过衡数 </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <a-input
                  :placeholder="'请输入' + typestr + '库重量'"
                  v-decorator="['weight', { rules: valdater['weight'] }]"
                  @blur="checkWeight"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <span slot="label">
                  实收重量(吨)
                  <a-tooltip>
                    <template slot="title"> 下游收货方实收吨位数 </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <a-input
                  placeholder="请输入实收重量"
                  v-decorator="[
                    'actualWeight',
                    { rules: valdater['actualWeight'] },
                  ]"
                  @blur="differenceWeightCalculate"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="站台盈亏(吨)" class="special-item">
                {{ differenceWeightString }}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="装车热值(千卡/公斤)">
                <a-input
                  placeholder="请输入装车热值"
                  v-decorator="['loadingCv', { rules: valdater['loadingCv'] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <a-row
          :gutter="[20, 10]"
          v-for="(item, index) in warehouseList"
          :key="item.id"
        >
          <a-col :span="8">
            <a-form-item label="仓房" required>
              <div class="row">
                <a-select
                  :key="item.id"
                  placeholder="请选择仓房"
                  v-decorator="['houseId-' + item.id]"
                  style="margin-right: 10px"
                  @change="getGoodsAllocationInventory(index, $event)"
                >
                  <a-select-option
                    v-for="item in houseList"
                    :key="item.id"
                    :value="item.id"
                    :disabled="seletedHouseIds.includes(item.id)"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
                <a-space>
                  <a-icon
                    type="plus-circle"
                    style="font-size: 20px; cursor: pointer"
                    @click="addWarehouse"
                  />
                  <a-icon
                    type="delete"
                    style="font-size: 20px; cursor: pointer"
                    @click="delWarehouse(index)"
                    v-if="warehouseList.length != 1"
                  />
                </a-space>
              </div>
            </a-form-item>
          </a-col>

          <a-col :span="16" v-if="dataSource[index]" class="special-col">
            <a-table
              :bordered="false"
              :columns="columns"
              rowKey="uid"
              :dataSource="dataSource[index]"
              :pagination="false"
              :scroll="{ x: true }"
              size="small"
            >
              <template slot="coalType" slot-scope="text">
                <span v-if="getType(text) != '[object Array]'">
                  {{ text }}
                </span>
                <div
                  v-html="text.join('<div class=\'line\'></div>')"
                  v-else
                ></div>
              </template>
              <template slot="inventory" slot-scope="text">
                <span v-if="getType(text) != '[object Array]'">
                  {{ text }}
                </span>
                <div
                  v-html="text.join('<div class=\'line\'></div>')"
                  v-else
                ></div>
              </template>
              <template slot="weight" slot-scope="text, record, index2">
                <a-input
                  placeholder="请输入"
                  @change="onWeigth(index, index2, $event)"
                  :value="text"
                  @blur="checkWeight"
                />
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-form>
      <div class="slTitleAssis">
        附件信息
      </div>
      <a-tabs>
        <a-tab-pane key="attachment" tab="铁路大票" force-render>
          <div style="width: 100%">
            <a-spin :spinning="searchLoading">
              <a-form
                :form="ticketForm"
                :colon="false"
                class="slFormDetail"
              >
                <a-row>
                  <a-col :span="8">
                    <a-form-item label="托运人">
                      <a-select
                        show-search
                        placeholder="请输入托运人"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="handleSearchShipper"
                        @change="onSearchWaybill('push')"
                        v-decorator="[
                          'shipper',
                          { rules: valdater['shipper'] },
                        ]"
                        :getPopupContainer="
                          (node) => node.parentNode || document.body
                        "
                        allowClear
                      >
                        <a-select-option
                          v-for="item in shipperList"
                          :key="item.id"
                          :value="item.id"
                          >{{ item.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="运单号">
                      <a-input
                        placeholder="请输入运单号"
                        @blur="onSearchWaybill"
                        v-decorator="[
                          'waybillNo',
                          { rules: valdater['waybillNo'] },
                        ]"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <template v-if="searchLoaded">
                      <a-col :span="8">
                        <a-form-item label="发站">
                          <a-select
                            mode="tags"
                            show-search
                            :filter-option="filterOptions"
                            option-filter-prop="children"
                            placeholder="请输入发站"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :not-found-content="null"
                            @search="
                              handleSearchStation('sendStationList', $event)
                            "
                            :disabled="hasWaybill"
                            @change="onStationChange('sendStation', $event)"
                            v-decorator="[
                              'sendStation',
                              { rules: valdater['sendStation'] },
                            ]"
                            :getPopupContainer="
                              (node) => node.parentNode || document.body
                            "
                          >
                            <a-select-option
                              v-for="item in sendStationList"
                              :key="item.name"
                              :value="item.name"
                              >{{ item.name }}</a-select-option
                            >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="8">
                        <a-form-item label="到站">
                          <a-select
                            mode="tags"
                            show-search
                            :filter-option="filterOptions"
                            option-filter-prop="children"
                            placeholder="请输入到站"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :not-found-content="null"
                            @search="
                              handleSearchStation('arriveStationList', $event)
                            "
                            :disabled="hasWaybill"
                            @change="onStationChange('arriveStation', $event)"
                            v-decorator="[
                              'arriveStation',
                              { rules: valdater['arriveStation'] },
                            ]"
                            :getPopupContainer="
                              (node) => node.parentNode || document.body
                            "
                          >
                            <a-select-option
                              v-for="item in arriveStationList"
                              :key="item.name"
                              :value="item.name"
                              >{{ item.name }}</a-select-option
                            >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="8">
                        <a-form-item label="车数">
                          <a-input-number
                            style="width: 100%"
                            placeholder="请输入车数"
                            :disabled="hasWaybill"
                            :precision="0"
                            v-decorator="[
                              'trainNumber',
                              { rules: valdater['trainNumber'] },
                            ]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="8">
                        <a-form-item :label="typestr + '库日期'">
                          <a-date-picker
                            style="width: 100%"
                            :placeholder="'请选择' + typestr + '库日期'"
                            :disabled="hasWaybill"
                            v-decorator="[
                              'storageDate',
                              { rules: valdater['storageDate'] },
                            ]"
                            :disabledDate="disabledDate"
                          />
                        </a-form-item>
                      </a-col>
                  </template>
                </a-row>
              </a-form>
            </a-spin>
            <CustomUpload
              :ifEditable="true"
              @uploadFiles="getUploadFiles"
              :fileDataSource="attachemntDataSource"
              :type="'custom'"
              :defaultColumns="uploadColumns"
              :selectOptions="getSelectOption('attachment')"
            ></CustomUpload>
          </div>
        </a-tab-pane>
        <a-tab-pane key="track" tab="轨道衡报告" force-render>
          <div style="width: 100%;margin-top: 20px">
            <CustomUpload
              :ifEditable="true"
              @uploadFiles="getTrackUploadFiles"
              :fileDataSource="trackDataSource"
              :type="'custom'"
              :defaultColumns="uploadColumns"
              :selectOptions="getSelectOption()"
            ></CustomUpload>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div class="slDetailBottom">
        <a-space :size="20">
          <a-button @click="() => $router.back()">返回</a-button>
          <a-button type="primary" @click="onSave" :loading="saveLoading">
            确定
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>
<script>
import CustomUpload from "components/upload/CustomUpload";
import {
  getHouseList,
  getTransportModeList,
  getGoodsAllocationInventory,
  getShipperList,
  API_STATION,
} from "../../api/selectData";
import {
  getCoalTypeAllList,
  getTrainTrackWaybill,
  pushTrainShipper,
  addInRecords,
  addOutRecords,
} from "../../api";
import { isNumber, validNumber } from "@/v2/utils/validForm";
import num from '@/untils/num.js'
import moment from "moment";
import Breadcrumb from "@/v2/components/breadcrumb/index";

const TODAY = moment(moment().format("YYYY-MM-DD") + " 23:59:59");
let timer = null;
export default {
  components: {
    CustomUpload,
    Breadcrumb
  },
  data() {
    let { type } = this.$route.params;
    type = type?.toUpperCase();
    let typestr = type == "IN" ? "入" : "出";
    return {
      type,
      typestr,
      form: this.$form.createForm(this),
      ticketForm: this.$form.createForm(this),
      columns: renderColumns(type),
      uploadColumns,
      dataSource: [],
      attachemntDataSource: [],
      trackDataSource: [],
      attachmentKey: "attachment",
      warehouseList: [{ id: this.getUid() }],
      coalTypeList: [], //煤种
      transportModeList: [], //运输方式
      houseList: [], //仓房列表
      shipperList: [], //托运人列表
      searchLoading: false,
      searchLoaded: false,
      hasWaybill: false,
      valdater: {
        // "运输方式":[{required:true,message:"请选择运输方式"}],
        coalType: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请选择煤种");
                return;
              }
              let val = value.slice(-1)[0];
              if (!val) {
                callback("请选择煤种");
                return;
              }
              if (val.length > 30) {
                callback("最多30个字符");
                return;
              }
              callback();
            },
          },
        ],
        trainSerialNo: [
          { required: true, message: "请输入车次号" },
          { max:9, message: "长度不能超过9位",transform(val){return String(val)} }
        ],
        weight: [
          { required: true, message: `请输入${typestr}库重量` },
          { validator: validNumber({ float: 4, min: 0, max: 999999.9999 }) },
        ],
        invoicingWeight: [
          { required: true, message: "请输入启票重量" },
          { validator: validNumber({ float: 4, min: 0, max: 999999.9999 }) },
        ],
        actualWeight: [
          { required: false, message: "请输入实收重量" },
          { validator: validNumber({ float: 4, min: 0, max: 999999.9999 }) },
        ],
        loadingCv: [
          { required: false, message: "请输入装车热值" },
          { validator: validNumber({ float: 4, min: 0, max: 999999.9999 }) },
        ],
        shipper: [{ required: true, message: "请输入托运人" }],
        waybillNo: [
          { required: true, message: "请输入运单号" },
          { len: 12, message: "必须为12位" },
        ],
        sendStation: [{ required: true, message: "请输入发站" }],
        arriveStation: [{ required: true, message: "请输入到站" }],
        trainNumber: [
          { required: true, message: "请输入车数" },
          {
            validator: (rule, value, callback) => {
              value = Number(value);
              if (isNaN(value) || value < 1 || value > 500) {
                callback("请输入大于0或小于500的整数");
                return;
              }
              if (!isNumber(value, 0)) {
                callback("请输入整数");
                return;
              }
              callback();
            },
          },
        ],
        storageDate: [{ required: true, message: "请选择日期" }],
      },
      differenceWeight: NaN, //站台盈亏
      saveLoading: false,
      dict: {
        RAILWAY_TICKET: "铁路大票",
        TRAIN_NO_TABLE: "车号表",
        TRACK_SCALE_REPORT: "轨道衡报告",
      },
      seletedHouseIds: [],
      sendStationList: [],
      arriveStationList: [],
    };
  },
  computed: {
    differenceWeightString() {
      let differenceWeight = this.differenceWeight;
      if (differenceWeight > 0) {
        return "盈" + differenceWeight;
      } else if (differenceWeight < 0) {
        return "亏" + Math.abs(differenceWeight);
      } else if (differenceWeight == 0)  {
        return "0"
      }else{
        return "";
      }
    },
  },
  mounted() {
    this.getCoalTypeList();
    this.getHouseList();
    this.getTransportModeList();
  },
  methods: {
    getUploadFiles(source) {
      this.attachemntDataSource = source;
    },
    getTrackUploadFiles(source) {
      this.trackDataSource = source;
    },

    async onSave() {
      let data = { items: [], ticket: {}, attachments: [] };
      let { error, values } = await this.asyncFn((reslove) => {
        this.form.validateFields((error, values) => {
          reslove({ error, values });
        });
      });
      if (error) {
        return;
      }
      data = { ...data, coalType: values.coalType, weight: values.weight };
      //出场记录增加车次号，启票重量，实收重量，站台盈亏，装车热值
      if (this.type == "OUT") {
        data = {
          ...data,
          trainSerialNo:values.trainSerialNo,
          invoicingWeight:values.invoicingWeight,
          actualWeight:values.actualWeight,
          differenceWeight:this.differenceWeight,
          loadingCv:values.loadingCv,
        }
      }
      let totalWeight = 0;
      for (let i = 0; i < this.dataSource.length; i++) {
        let dt = this.dataSource[i];
        for (let j = 0; j < dt.length; j++) {
          let item = dt[j];
          let weight = item.weight || 0;
          weight = Number(weight);
          let error = `货位：${item.goodsAllocationName}，${this.typestr}库重量：`;
          if (isNaN(weight) || weight < 0) {
            this.$message.error(`${error}请输入正数`);
            return;
          }
          if (!isNumber(weight, 4)) {
            this.$message.error(`${error}最多4位小数`);
            return;
          }
          if (weight > item.inventory && this.type == "OUT") {
            this.$message.error(`${error}不能大于存货量`);
            return;
          }
          totalWeight += weight;
          if (weight != 0) {
            let d = {
              houseId: item.houseId,
              goodsAllocationId: item.goodsAllocationId,
              weight,
            };
            if (this.type == "OUT") {
              d.coalType = item.coalType;
            }
            data.items.push(d);
          }
        }
      }
      if (data.weight != totalWeight) {
        this.$info({
          title: "提示",
          content: "各货位出库重量总和与出库总重量不一致，请核对",
        });
        return;
      }

      let ticketRes = await this.asyncFn((reslove) => {
        this.ticketForm.validateFields((error, values) => {
          reslove({ error, values });
        });
      });
      if (ticketRes.error) {
        return;
      }
      let ticketValues = ticketRes.values;
      data.ticket = {
        ...ticketValues,
        shipper: this.getShipper(ticketValues.shipper).name,
        sendStation: ticketValues.sendStation.join(""),
        arriveStation: ticketValues.arriveStation.join(""),
        storageDate: ticketValues.storageDate.format("YYYY-MM-DD HH:mm:ss"),
      };
      [...this.attachemntDataSource, ...this.trackDataSource].forEach(
        (item) => {
          data.attachments.push({
            attachmentType: item.type,
            name: item.name,
            md5Hex: item.md5Hex,
            path: item.url,
          });
        }
      );
      let atlength = this.attachemntDataSource.filter(
        (item) => item.type == "RAILWAY_TICKET"
      ).length;
      if (atlength <= 0) {
        this.$message.error("请上传铁路大票");
        return;
      }
      // if (this.trackDataSource.length <= 0) {
      //   this.$message.error("请上传轨道衡报告");
      //   return;
      // }
      let isok = await this.asyncFn((reslove) => {
        this.$confirm({
          title: "提示",
          content: "确定提交吗",
          onOk: () => reslove(true),
          onCancel: () => reslove(false),
        });
      });
      if (!isok) {
        this.$message.error("已取消");
        return;
      }
      if (data.coalType) {
        data.coalType = data.coalType.join("");
      }
      let request = this.type === "IN" ? addInRecords : addOutRecords;
      this.saveLoading = true;
      request(data)
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.$message.success("保存成功");
          this.$router.back();
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    //站台盈亏计算
    differenceWeightCalculate() {
      let actualWeight = this.form.getFieldValue("actualWeight"),
        invoicingWeight = this.form.getFieldValue("invoicingWeight");
      if (!actualWeight) {
        this.differenceWeight = NaN;
        return;
      }
      this.differenceWeight = num.accSub(actualWeight,invoicingWeight);
    },
    //校验每个货位输入的重量和 是否大于总重量
    checkWeight() {
      let iweight = this.form.getFieldValue("weight");
      if (!isNumber(iweight, 4)) {
        return;
      }
      if (iweight < 0 || iweight > 999999.9999) {
        return;
      }
      let totalWeight = 0;
      for (let i = 0; i < this.dataSource.length; i++) {
        let dt = this.dataSource[i];
        for (let j = 0; j < dt.length; j++) {
          let item = dt[j];
          let weight = item.weight || 0;
          weight = Number(weight);
          let error = `货位：${item.goodsAllocationName}，${this.typestr}库重量：`;
          if (isNaN(weight) || weight < 0) {
            this.$message.error(`${error}请输入正数`);
            return;
          }
          if (!isNumber(weight, 4)) {
            this.$message.error(`${error}最多4位小数`);
            return;
          }
          if (weight > item.inventory && this.type == "OUT") {
            this.$message.error(`${error}不能大于存货量`);
            return;
          }
          totalWeight += weight;
        }
      }
      if (totalWeight > iweight) {
        this.$message.error(
          `本次${this.typestr}库重量总和，不能大于${this.typestr}库重量`
        );
      }
    },
    getSelectOption(type) {
      if (type == "attachment") {
        return [
          { value: "RAILWAY_TICKET", text: "铁路大票" },
          { value: "TRAIN_NO_TABLE", text: "车号表" },
        ];
      }
      return [{ value: "TRACK_SCALE_REPORT", text: "轨道衡报告" }];
    },

    //获取煤种
    getCoalTypeList() {
      getCoalTypeAllList().then((res) => {
        if (!res.success) {
          return;
        }
        this.coalTypeList = res.data || [];
      });
    },
    //获取运输方式
    getTransportModeList() {
      getTransportModeList().then((res) => {
        if (!res.success) {
          return;
        }
        this.transportModeList = res.data || [];
      });
    },
    getHouseList() {
      getHouseList().then((res) => {
        if (!res.success) {
          return;
        }
        this.houseList = res.data;
      });
    },
    getGoodsAllocationInventory(index, houseId) {
      if (!houseId) {
        this.dataSource[index] = null;
        return;
      }
      this.seletedHouseIds[index] = houseId;
      getGoodsAllocationInventory({ houseId, type: this.type }).then((res) => {
        if (!res.success) {
          return;
        }
        this.dataSource[index] = (res.data || []).map((item) => {
          return {
            uid: this.getUid(),
            houseId,
            ...item,
          };
        });
        this.dataSource = [...this.dataSource];
      });
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    onWeigth(index, index2, e) {
      this.dataSource[index][index2].weight = e.target.value;
      this.dataSource = [...this.dataSource];
    },
    handleSearchShipper(name) {
      if (!name) {
        return;
      }
      this.delayCall(() => {
        getShipperList({ name })
          .then((res) => {
            if (!res.success) {
              return;
            }
            this.shipperList = res.data || [];
          })
          .finally(() => {});
      }, 500);
    },
    //查询运单信息
    onSearchWaybill(type) {
      let { waybillNo } = this.ticketForm.getFieldsValue();
      if (!waybillNo || waybillNo.length != 12) {
        return;
      }
      this.delayCall(async () => {
        let { waybillNo, shipper: shipperId } =
          this.ticketForm.getFieldsValue();
        let shipper = this.getShipper(shipperId);
        try {
          if (type == "push" && !shipper.code && shipper.name) {
            let { success, data } = await pushTrainShipper({
              name: shipper.name,
            });
            if (success) {
              shipper.code = data.code;
            }
          }
        } catch (e) {
          return;
        }
        if (!waybillNo || !shipper.name) {
          return;
        }

        this.searchLoading = true;
        getTrainTrackWaybill({ serialNo: waybillNo, shipperName: shipper.name })
          .then((res) => {
            this.searchLoading = false;

            let data = res.data;
            this.hasWaybill = !!data;
            if (!res.success || !this.hasWaybill) {
              this.searchLoaded = true;
              return;
            }
            if (!data.arrived && this.type == "IN") {
              this.$message.error("货物运输中，请在车辆到达后再进行录入");
              return;
            }
            this.searchLoaded = true;
            this.$nextTick(() => {
              this.ticketForm.setFieldsValue({
                sendStation: data.departureStation,
                arriveStation: data.arriveStation,
                trainNumber: data.vehicleNum,
                storageDate: moment(
                  this.type == "IN" ? data.arriveDate : data.departureDate
                ),
              });
            });
          })
          .finally(() => {
            this.searchLoading = false;
          });
      }, 100);
    },
    getShipper(id) {
      if (!id) {
        return {};
      }
      return this.shipperList.filter((item) => item.id == id)[0] || {};
    },
    //查询站台信息
    handleSearchStation(field, name) {
      this.delayCall(() => {
        API_STATION({ keywords: name }).then((res) => {
          if (!res.success) {
            return;
          }
          this[field] = res.result || [];
        });
      }, 200);
    },
    onStationChange(field, values) {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.ticketForm.setFieldsValue({
          [field]: values.slice(-1),
        });
      }, 1);
    },
    addWarehouse() {
      this.warehouseList.push({ id: this.getUid() });
    },
    delWarehouse(index) {
      this.warehouseList.splice(index, 1);
      this.dataSource.splice(index, 1);
      this.seletedHouseIds.splice(index, 1);
    },
    getUid() {
      return Math.random().toString(36).slice(2);
    },
    coalTypeChange(values) {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.form.setFieldsValue({
          coalType: values
            .slice(-1)
            .filter((item) => !!item?.replace(/\s/g, "")),
        });
        this.form.validateFields(["coalType"]);
      }, 1);
    },
    disabledDate(current) {
      return current - TODAY >= 0;
      // if(this.type == "IN"){
      //   return current - TODAY >= 0;
      // }
      // return false;
    },
    delayCall(fn, ss) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        clearTimeout(timer);
        fn();
      }, ss);
    },
    getType(text) {
      return toString.call(text);
    },
    asyncFn(fn) {
      return new Promise((reslove) => {
        fn(reslove);
      });
    },
  },
};

function renderColumns(type) {
  let typestr = type == "IN" ? "入" : "出";
  return [
    {
      title: "货位",
      key: "goodsAllocationName",
      dataIndex: "goodsAllocationName",
    },
    {
      title: "煤种",
      key: "coalType",
      dataIndex: "coalType",
      scopedSlots: { customRender: "coalType" },
    },
    {
      title: "存货量",
      key: "inventory",
      dataIndex: "inventory",
      scopedSlots: { customRender: "inventory" },
    },
    {
      title: `本次${typestr}库重量`,
      key: "weight",
      dataIndex: "weight",
      scopedSlots: { customRender: "weight" },
    },
  ];
}
const uploadColumns = [
  {
    title: "单据类型",
    key: "typeName",
    dataIndex: "typeName",
  },
  {
    title: "文件名",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];
</script>

<style lang="less" scoped>
/deep/.line {
  height: 5px;
  // background-color:#e8e8e8;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.red {
  color: red;
}
.ant-col {
  height:82px;
}
.ant-form-item {
  width: 364px;
  margin-bottom: 0;
}
.special-col {
  height: auto;
}
.slDetailBottom {
  width: calc(100vw - 254px);
  min-width: 1186px;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 228px;
  z-index: 999;
}
.special-item {
  ::v-deep.ant-form-item-children {
    display: inline-block;
    height: 32px;
    line-height: 32px;
  }
}
</style>
