<template>
  <div class="slMain">
    <Breadcrumb :type="type" />
    <a-spin :spinning="submitLoading">
      <a-card :bordered="false">
        <div class="methods-wrap">
          <span class="slTitle">{{ detailTitle }}</span>
        </div>
        <div class="importActions">
          <a-space :size="20">
            <div class="addItemBtn" @click="addOneDispatchCarInfo">
              <img
                class="icon"
                src="@/v2/assets/imgs/logisticsPlatform/add_one_cart_icon.png"
                alt=""
              />
              <span>单条新增</span>
            </div>
            <div class="addExcelBtn" @click="importExcelDispatchCarInfo">
              <i class="iconfont icon icon-exceldaoru1"></i>
              <span>Excel导入</span>
            </div>
          </a-space>
        </div>
        <div class="tipText">
          <span
            >【Excel导入】仅支持单选上传Excel文件(*xls.*xlsx) ，
            请下载模板填写后上传</span
          >
        </div>
        <div style="margin-bottom: 30px">
          <a-form-model ref="ruleForm">
            <a-table
              :dataSource="dataList"
              :columns="columns"
              class="new-table new-table2"
              :bordered="false"
              :pagination="false"
              :scroll="{ x: true }"
              :rowKey="
                (record, index) => {
                  return record.id;
                }
              "
            >
              <template slot="plateNumberTitle">
                <span>车牌号</span>
                <span class="requiredTableTitle">*</span>
              </template>
              <template slot="loadingWeightTitle">
                <span>矿发净重（吨）</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>最大值200吨，精确到小数点后两位</span>
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </template>
              <template slot="loadingScaleFileTitle">
                <span>矿发磅单 </span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>支持上传单张图片，图片大小不得超过100MB</span>
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </template>

              <template slot="indexNumber" slot-scope="text, record, index">
                <div style="line-height: 40px; width: 60px">
                  <span>{{ index + 1 }}</span>
                </div>
              </template>
              <template
                slot="licensePlateNumber"
                slot-scope="text, record, index"
              >
                <DispatchCarColumnItem
                  :recordItem="record"
                  :text="text"
                  :index="index"
                  :columnTitle="'licensePlateNumber'"
                  :placeholder="'请输入车牌号'"
                  :planId="planId"
                  v-on:columnItem-Change="columnItemChange"
                />
              </template>
              <template slot="driverName" slot-scope="text, record, index">
                <DispatchCarColumnItem
                  :recordItem="record"
                  :text="text"
                  :index="index"
                  :columnTitle="'driverName'"
                  :placeholder="'请输入司机姓名'"
                  v-on:columnItem-Change="columnItemChange"
                />
              </template>

              <template slot="driverMobile" slot-scope="text, record, index">
                <DispatchCarColumnItem
                  :recordItem="record"
                  :text="text"
                  :index="index"
                  :columnTitle="'driverMobile'"
                  :placeholder="'请输入司机电话'"
                  v-on:columnItem-Change="columnItemChange"
                />
              </template>
              <template slot="loadingDate" slot-scope="text, record, index">
                <DispatchCarColumnItem
                  :recordItem="record"
                  :text="text"
                  :index="index"
                  :columnTitle="'loadingDate'"
                  :placeholder="'请输入矿发时间'"
                  v-on:columnItem-Change="columnItemChange"
                />
              </template>
              <template slot="loadingWeight" slot-scope="text, record, index">
                <DispatchCarColumnItem
                  :recordItem="record"
                  :text="text"
                  :index="index"
                  :columnTitle="'loadingWeight'"
                  :placeholder="'请输入矿发净重'"
                  v-on:columnItem-Change="columnItemChange"
                />
              </template>
              <template
                slot="loadingScaleFile"
                slot-scope="text, record, index"
              >
                <LoadingScaleFileColumnItem
                  :originFile="text"
                  :editable="record.editable"
                  :index="index"
                  v-on:scaleFileChange="scaleFileChange"
                />
              </template>
              <template slot="action" slot-scope="text, record, index">
                <a-space :size="26">
                  <a
                    v-if="record.editable"
                    :disabled="!record.isCanSave"
                    href="javascript:;"
                    class="actionBtn"
                    @click="saveCarItem(record, index)"
                    >保存</a
                  >
                  <a
                    v-else
                    href="javascript:;"
                    class="actionBtn"
                    @click="editCarItem(record, index)"
                    >编辑</a
                  >
                  <a
                    href="javascript:;"
                    class="actionBtn"
                    @click="deleteCarItem(record, index)"
                    >删除</a
                  >
                </a-space>
              </template>
            </a-table>
          </a-form-model>
        </div>

        <div class="slDetailBottom">
          <a-space :size="30">
            <a-button type="primary" ghost @click="back">取消</a-button>
            <a-button type="primary" @click="save" :loading="submitLoading"
              >提交</a-button
            >
          </a-space>
        </div>
      </a-card>
    </a-spin>
    <a-modal
      v-model="excelModal"
      centered
      wrapClassName="invoice-box2"
      class="slModal excel-modal"
      :footer="null"
    >
      <a-spin :spinning="uploadExcelLoading">
        <div class="title">上传附件</div>
        <div class="excel-box">
          <div class="excel-box-content">
            <div class="excel-box-title">
              仅支持单选上传Excel文件(*.xls、*xlsx)
            </div>
            <div class="excel-box-upload">
              <img
                src="~/assets/imgs/newInvoice/upload-file.png"
                style="width: 44px; height: 50px"
                alt=""
              />
              <a-upload
                list-type="picture-card"
                name="file"
                style="margin-top: 18px"
                :showUploadList="false"
                :accept="'.xls,.xlsx'"
                :headers="headers"
                :multiple="false"
                :fileList="fileListExcel"
                :before-upload="beforeUploadExcel"
                @change="handleChange"
              >
                <a-button style="color: var(--primary-color); border: 1px solid var(--primary-color)">
                  选择文件</a-button
                >
              </a-upload>
              <p style="margin-top: 13px; fontweight: 400">
                上传文件大小需小于100MB
              </p>
            </div>
          </div>
          <div class="tpl">
            <div style="font-weight: 400">
              导入前请下载模板，按照模板格式导入上传
            </div>
            <a class="download-tpl" :href="templateExcelPath">
              <i class="iconfont icon3 icon-bianzu"></i>
              <span>下载模板</span>
            </a>
          </div>
          <div v-if="uploadExcelErrorMessage" class="excel-box-error-text">
            <span>{{ uploadExcelErrorMessage }}</span>
          </div>
        </div>
      </a-spin>
    </a-modal>
    <modalInfo
      ref="modalInfo"
      @verify="modalInfoOK"
      :title="modalInfoTitle"
      :tip="modalInfoMessage"
    />
  </div>
</template>

<script>
let S = "京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领";
let N = "0123456789";
let Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
import modalInfo from "@/v2/components/modalInfo/info";
import Breadcrumb from "@/v2/components/breadcrumb/index";
import DispatchCarColumnItem from "../components/DispatchCarColumnItem";
import LoadingScaleFileColumnItem from "../components/LoadingScaleFileColumnItem";
import { v4 as uuidv4 } from "uuid";
import { submitTruckingList, importDispatchCarExcel } from "../api";
import { mapGetters } from "vuex";
import { ExportBgIcon } from '@sub/components/svg'

export default {
  components: {
    Breadcrumb,
    DispatchCarColumnItem,
    LoadingScaleFileColumnItem,
    modalInfo,
    ExportBgIcon
  },
  data() {
    let { type } = this.$route.params;
    let { coalplanId, contractType, title } = this.$route.query;
    let detailTitle = title ? title : "新增派车信息";
    return {
      S,
      N,
      Z, // 车牌号
      detailTitle: detailTitle,
      submitLoading: false,
      uploadExcelLoading: false,
      maxLength: 200,
      type: type,
      planId: coalplanId,
      contractType: contractType,
      publicPath: process.env.BASE_URL,
      excelModal: false,
      fileListExcel: [],
      templateExcelPath:
        process.env.BASE_URL +
        "files/" +
        (type == "IN"
          ? "汽运上煤计划派车信息导入模板.xlsx"
          : "汽运下煤计划派车信息导入模板.xlsx"),
      modalInfoTitle: "提示信息",
      modalInfoMessage: "",
      uploadExcelErrorMessage: "",
      dataList: [],
      rules: {
        licensePlateNumber: [
          {
            required: true,
            message: "请填写车牌号",
            trigger: ["change", "blur"],
          },
          {
            pattern:
              /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
            message: "请输入正确的车牌号",
            trigger: ["change", "blur"],
          },
        ],
      },
      columns: renderColumn(type),
    };
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_TOKEN: "VUEX_ST_TOKEN",
    }),
    headers() {
      return {
        Authorization: this.VUEX_ST_TOKEN,
        Source: "PC",
      };
    },
  },
  watch: {
    fileListExcel: {
      handler(value) {
        if (value.length) {
          this.handleUpload2();
        }
      },
      deep: true,
    },
  },
  mounted() {
    // this.testData()
  },
  methods: {
    addOneDispatchCarInfo() {
      if (this.dataList.length == 200) {
        this.showModalInfo("提示", "数据超限，页面最大数据200行");
        return;
      }
      // 单条新增
      let newItem = {
        licensePlateNumber: "",
        editable: true,
        isCanSave: false,
        id: uuidv4(),
      };
      const newData = [...this.dataList];
      newData.unshift(newItem);
      this.dataList = [...newData];
    },
    importExcelDispatchCarInfo() {
      // Excel导入
      let isHasEditing = false;
      for (let index = 0; index < this.dataList.length; index++) {
        const element = this.dataList[index];
        if (element.editable == true) {
          // 车牌相同但 不是同一条数据
          isHasEditing = true;
          break;
        }
      }
      if (isHasEditing == true) {
        // 存在正在编辑的不可导入
        this.showModalInfo("提示", "当前存在编辑行，不可进行导入操作");
        return;
      }
      this.uploadExcelErrorMessage = "";
      this.excelModal = true;
    },
    deleteCarItem(item) {
      // 删除
      const newData = [...this.dataList];
      let tindex = newData.indexOf(item);
      if (tindex != -1) {
        newData.splice(tindex, 1);
      }
      this.dataList = newData;
    },
    editCarItem(item, index) {
      // 编辑
      this.$set(this.dataList[index], "editable", true);
    },
    saveCarItem(item, index) {
      // 保存
      let checkResult = this.checkRepeatLicensePlateNumber(item);
      if (checkResult.isHasSameNumber) {
        this.$set(this.dataList[index], "errors", checkResult.errors);
        this.$set(this.dataList[index], "isCanSave", false);
      } else {
        this.$set(this.dataList[index], "editable", false);
      }
    },
    isHasInputError(record) {
      let errors = record.errors;
      let isHasError = false;
      for (const errorkey in errors) {
        if (errors[errorkey]) {
          isHasError = true;
        }
      }
      return isHasError;
    },
    isCanSaveCarItem(record) {
      // 是否可以保存
      if (
        record.licensePlateNumber == null ||
        record.licensePlateNumber == ""
      ) {
        return false;
      }
      let isHasError = this.isHasInputError(record);
      return !isHasError;
    },
    checkRepeatLicensePlateNumber(record) {
      // 检查重复车牌
      let errors = record.errors ?? {};
      let isHasSameNumber = false;
      for (let index = 0; index < this.dataList.length; index++) {
        const element = this.dataList[index];
        if (
          element.licensePlateNumber == record.licensePlateNumber &&
          element.id != record.id
        ) {
          // 车牌相同但 不是同一条数据
          isHasSameNumber = true;
          break;
        }
      }
      if (isHasSameNumber) {
        errors = { ...errors, licensePlateNumber: "该车牌号已录入" };
      }
      return { errors, isHasSameNumber };
    },
    columnItemChange(index, record, errors, columnTitle) {
      // 列表输入信息发生变化
      if (
        columnTitle == "licensePlateNumber" &&
        !record.error?.licensePlateNumber
      ) {
        // 如果是车牌检查本地是否有错误
        let checkResult = this.checkRepeatLicensePlateNumber(record);
        record.errors = checkResult.errors;
      }
      this.$set(
        this.dataList[index],
        "isCanSave",
        this.isCanSaveCarItem(record)
      );
      this.$set(this.dataList[index], "errors", record.errors);
    },
    scaleFileChange(index, file) {
      this.$set(this.dataList[index], "loadingScaleFile", file);
    },
    isEmptyStr(str) {
      if (str == null || str === "") {
        return true;
      }
      return false;
    },
    beforeUploadExcel(file) {
      this.uploadExcelErrorMessage = "";
      const isLimitFileSize = file.size / 1024 / 1024 < 100;
      if (!isLimitFileSize) {
        this.uploadExcelErrorMessage = "文档过大，请重新上传";
        return false;
      }
      this.fileListExcel = [file];
      return false;
    },
    handleChange() {},
    async handleUpload2() {
      // this.uploadLoading = true;
      const formData = new FormData();
      this.fileListExcel.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("type", "INPUT");
      formData.append("industryType", "ALL");
      formData.append("module", "TOOL");
      // !this.timer && this.circulation(1)
      try {
        this.uploadExcelLoading = true;
        const res = await importDispatchCarExcel(this.planId, formData);
        if (!res.success) {
          // 上传失败"不识别该文件",请重试
          this.uploadExcelErrorMessage = res.error.message;
          return;
        }
        if (res?.data.error) {
          this.uploadExcelErrorMessage = res?.data.error;
          return;
        }
        let excelList = res?.data.itemList ?? [];
        let originDataList = this.dataList;
        let newImportLength = excelList.length;
        let newErrorLenght = 0;
        let newTotalLength = originDataList.length + newImportLength;

        if (newImportLength == 0) {
          this.uploadExcelErrorMessage = "文档为空，请填写后提交";
          return;
        }
        if (newTotalLength > this.maxLength) {
          this.uploadExcelErrorMessage =
            "数据超限，页面最大数据200行，导入失败";
          return;
        }
        // 导入报错
        let excelErrorList = [];
        // 导入报错
        let excelNormalList = [];
        // 原有报错
        let originErrorList = [];
        // 原有正常
        let originNormalList = [];
        excelList = excelList.map((t) => {
          t.id = uuidv4();
          let checkResult = this.checkRepeatLicensePlateNumber(t);
          t.errors = checkResult.errors;
          let isHasError = this.isHasInputError(t);
          if (isHasError) {
            newErrorLenght += 1;
            t.isCanSave = false;
            excelErrorList.push(t);
          } else {
            t.isCanSave = true;
            excelNormalList.push(t);
          }
          return t;
        });
        originDataList.map((t) => {
          let isHasError = this.isHasInputError(t);
          if (isHasError) {
            originErrorList.push(t);
          } else {
            originNormalList.push(t);
          }
          return t;
        });
        let newDataList = [];
        newDataList = newDataList.concat(excelErrorList);
        newDataList = newDataList.concat(originErrorList);
        newDataList = newDataList.concat(excelNormalList);
        newDataList = newDataList.concat(originNormalList);
        this.dataList = newDataList;
        this.excelModal = false;
        if (newErrorLenght > 0) {
          // 存在错误数据
          let message = `本次共成功导入${newImportLength}条数据，错误数据${newErrorLenght}条，请及时修改`;
          this.showModalInfo("导入结果", message);
        } else {
          this.$message.success("导入成功");
        }
      } catch (err) {
      } finally {
        this.fileListExcel = [];
        this.uploadExcelLoading = false;
        // this.uploadLoading = false
      }
    },
    showModalInfo(title, message) {
      this.modalInfoTitle = title;
      this.modalInfoMessage = message;
      this.$refs.modalInfo.open();
    },
    modalInfoOK() {
      this.$refs.modalInfo.close();
    },
    back() {
      this.$router.back();
    },
    save() {
      let submitList = [];
      let otherList = [];
      let isHasEditing = false;
      for (let index = 0; index < this.dataList.length; index++) {
        const element = this.dataList[index];
        let isHasError = this.isHasInputError(element);
        if (element.editable) {
          // 存在编辑行
          isHasEditing = true;
          break;
        } else if (isHasError) {
          // 正在编辑和存在错误的不上传
          otherList.push(element);
        } else {
          let {
            licensePlateNumber,
            driverName,
            driverMobile,
            loadingDate,
            loadingWeight,
            loadingScaleFile,
          } = element;
          let carItem = {
            licensePlateNumber,
            driverName,
            driverMobile,
            loadingDate,
            loadingWeight,
            loadingScaleFile,
          };
          submitList.push(carItem);
        }
      }
      if (isHasEditing == true) {
        // 存在正在编辑的不可导入
        this.showModalInfo("保存结果", "当前存在编辑行，不可进行提交操作");
        return;
      }
      let submitLength = submitList.length;
      if (submitLength == 0) {
        this.showModalInfo("保存结果", "当前无可提交数据！");
        return;
      }
      this.submitLoading = true;
      submitTruckingList({ planId: this.planId, truckList: submitList })
        .then((res) => {
          if (!res.success) {
            return;
          } else if (res.success && res.data) {
            this.dataList = otherList;
            let errorLength = otherList.length;
            if (errorLength > 0) {
              let message = `本次共上传${submitLength}条数据，${errorLength}条错误数据未上传，请处理后重新提交`;
              this.showModalInfo("保存结果", message);
            } else {
              this.$message.success(
                `上传成功！本次共上传${submitLength}条数据`
              );
              this.$router.push({
                path: `/center/logisticsPlatform/coalplan/${this.type}/detail`,
                query: {
                  id: this.planId,
                  contractType: this.contractType,
                },
              });
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          this.submitLoading = false;
        });
    },
    testData() {
      /*
            loadingScaleFile:  {
                        bid: null,
                        createdDate: "2023-11-08 19:31:28",
                        name: "20231027141229.jpg",
                        path: "/station-files/20231108/5e0e9f9cb0ba49419c7e6203bd60821f.jpg",
                        // "url": null,
                        // "ext": null,
                        // "md5Hex": "dcb605803043abafe72ec6c0df3aa01e",
                        // "size": null,
                        // "previewUrl": null,
                        // "videoDuration": null
                    },
            */
      let list = [];
      for (let index = 0; index < 200; index++) {
        list.push({
          // indexNumber:
          id: uuidv4(),
          licensePlateNumber: null,
          driverName: "老王",
          driverMobile: "13988888888",
          loadingDate: "2023-09-09 12:00",
          loadingWeight: 120,
          editable: false,
          isCanSave: false,
          errors: {
            licensePlateNumber: "请输入正确的车牌号",
            driverName: "请输入正确的司机姓名",
          },
        });
      }
      this.dataList = list;
    },
  },
};

function renderColumn(type) {
  let columns = [
    {
      title: "序号",
      dataIndex: "indexNumber",
      scopedSlots: { customRender: "indexNumber" },
      // width: 60,
      // fixed: "left",
    },
    {
      //   title: "车牌号",
      dataIndex: "licensePlateNumber",
      slots: { title: "plateNumberTitle" },
      scopedSlots: { customRender: "licensePlateNumber" },
    },
    {
      title: "司机姓名",
      dataIndex: "driverName",
      scopedSlots: { customRender: "driverName" },
    },
    {
      title: "司机电话",
      dataIndex: "driverMobile",
      scopedSlots: { customRender: "driverMobile" },
    },
  ];
  let inColumns = [
    {
      title: "矿发时间",
      dataIndex: "loadingDate",
      scopedSlots: { customRender: "loadingDate" },
    },
    {
      //   title: "矿发净重(吨)",
      dataIndex: "loadingWeight",
      slots: { title: "loadingWeightTitle" },
      scopedSlots: { customRender: "loadingWeight" },
    },
    {
      //   title: "矿发磅单 ",
      dataIndex: "loadingScaleFile",
      slots: { title: "loadingScaleFileTitle" },
      scopedSlots: { customRender: "loadingScaleFile" },
    },
  ];
  if (type == "IN") {
    columns = columns.concat(inColumns);
  }
  columns.push({
    title: "操作",
    fixed: "right",
    scopedSlots: { customRender: "action" },
    dataIndex: "操作",
    // width: 106,
  });
  return columns;
}
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
.importActions {
  margin-top: 20px;
}
.tipText {
  margin-top: 20px;
  margin-bottom: 30px;
  font-size: 12px;
  color: #77889d;
}
.requiredTableTitle {
  color: #f5222d;
}
.slDetailBottom {
  width: calc(100vw - 254px);
  border-top: 1px solid #e5e6eb;
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
.actionBtn {
  height: 32px;
  font-size: 14px;
}

.addItemBtn {
  height: 38px;
  width: 106px;
  // padding: 0 12px;
  background: @primary-color;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    width: 18px;
    vertical-align: middle;
    margin-right: 10px;
  }
}

.addExcelBtn {
  height: 38px;
  width: 106px;
  // padding: 0 12px;
  background: white;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: @primary-color;
  line-height: 22px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 4px;
  border: 1px solid @primary-color;
  .icon {
    width: 18px;
    vertical-align: middle;
    margin-right: 10px;
  }
}

.invoice-box2 {
  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 58px;
    color: rgba(0, 0, 0, 0.8);
    background: #f3f5f6;
    padding-left: 20px;
    border-radius: 8px 8px 0px 0px;
  }
  .ant-modal-body {
    padding-bottom: 30px;
  }

  .excel-box-title {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #8495aa;
  }
  .excel-box-error-text {
    margin: 10px 20px 0 20px;
    color: #d44;
    font-size: 14px;
  }
}

.invoice-box,
.invoice-box2 {
  .ant-modal-header {
    border-bottom: 0;
    padding-top: 30px;
    padding-bottom: 20px;

    .ant-modal-title {
      font-weight: 600;
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
    }
  }

  .ant-modal-close {
    top: 8px;
  }

  .ant-modal-content {
    border-radius: 6px;
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-footer {
    padding-top: 20px;
    padding-bottom: 20px !important;
    border-top: 0;
    padding-right: 20px;
  }

  .footer-box {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .footer-btn1 {
      color: @primary-color;
      border: 1px solid @primary-color;
      background: #fff;
      width: 126px;
      height: 44px;
      border-radius: 6px;
      font-size: 14px;
    }

    .footer-btn {
      width: 126px;
      height: 44px;
      background: @primary-color;
      border-radius: 6px;
    }
  }
}

.excel-modal {
  /deep/ .ant-modal-body {
    padding: 0 0 20px 0;
  }
  /deep/ .ant-modal-content {
    border-radius: 10px;
  }
}

.excel-box {
  &-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    height: 190px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid rgba(139, 157, 184, 0.3);
    margin-top: 16px;
  }

  &-content {
    height: 268px;
    background: #f8f9fe;
    border-radius: 6px;
    border: 1px solid rgba(139, 157, 184, 0.3);
    box-sizing: border-box;
    font-weight: 600;
    color: #8495aa;
    padding: 20px;
    margin: 30px 20px;
  }

  .icon2 {
    // height: 44px;
    // width: 50px;
    font-size: 40px;
    // margin-bottom: 22px;
  }

  .tpl {
    height: 108px;
    background: #f8f9fe;
    border-radius: 6px;
    border: 1px solid rgba(139, 157, 184, 0.3);
    padding: 20px;
    margin: 0 20px;
    font-size: 14px;
    color: #8495aa;
  }

  .download-tpl {
    width: 106px;
    height: 30px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid @primary-color;
    color: @primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    font-weight: 400;
  }

  .icon3 {
    font-size: 14px;
    margin-right: 4px;
  }

  /deep/ .ant-upload-picture-card-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/ .ant-upload {
    padding: 0 !important;
    background: none;
    height: auto;
    width: auto;
    float: none;
    border: none;
  }
}
</style>