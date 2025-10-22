<template>
 <a-modal
   width="80%"
   class="slModal"
   :visible="visible"
   @cancel="close"
   destroyOnClose
 >
   <template slot="title">
     <div class="title">
       <div class="name">{{ title }}</div>
     </div>
   </template>
   <div class="content">
    <a-form-model
			ref="transForm"
			:model="formModel"
			:rules="rules"
			class="slFormDetail"
		>
			<a-table
				class="new-table"
				:dataSource="formModel.dataSource"
				:columns="columns"
				:pagination="false"
				:scroll="{ x: true }"
				rowKey="uuid"
			>
        <template slot="plateNumberTitle">
					<span class="requiredTableTitle">车牌号</span>
				</template>
        <template
					slot="plateNumber"
					slot-scope="text, record, index"
				>
          <a-form-model-item
						:prop="'dataSource.' + index + '.plateNumber'"
						:rules="rules.plateNumber"
						>
            <LicensePlateNumberInput
              v-model="record.plateNumber"
            />
          </a-form-model-item>
          
        </template>
        <template slot="deliverQuantityTitle">
					<span class="requiredTableTitle">发货数量（吨）</span>
				</template>
				<template
					slot="deliverQuantity"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.deliverQuantity'"
						:rules="rules.deliverQuantity"
						>
						<a-input-number
							style="width: 250px"
							placeholder="请输入发货数量"
							v-model="record.deliverQuantity"
						/>
						</a-form-model-item>
				</template>
				<template slot="deliverDateTitle">
					<span class="requiredTableTitle">发车时间</span>
				</template>
				<template
					slot="deliverDate"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.deliverDate'"
						:rules="rules.deliverDate"
						>
						<a-date-picker
							style="width: 250px"
              showTime
							placeholder="请选择发车时间"
							format="YYYY-MM-DD HH:mm"
							valueFormat="YYYY-MM-DD HH:mm"
							v-model="record.deliverDate"
              :disabled-date="startVal => disabledStartDate(record, startVal)"
						/>
					</a-form-model-item>
        </template>
        <template slot="arriveDateTitle">
					<span class="requiredTableTitle">到站时间</span>
				</template>
				<template
					slot="arriveDate"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.arriveDate'"
						:rules="rules.arriveDate"
						>
						<a-date-picker
							style="width: 250px"
							placeholder="请选择到站时间"
              showTime
							valueFormat="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm"
              :disabled-date="endVal => disabledEndDate(record, endVal)"
              :disabled-time="endVal => disabledEndDateTime(record, endVal)"
							v-model="record.arriveDate"
						/>
					</a-form-model-item>
        </template>
        <template slot="trainNumTitle">
					<span class="requiredTableTitle">运单号</span>
				</template>
				<template
					slot="ticketNo"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'dataSource.' + index + '.ticketNo'"
						:rules="rules.ticketNo"
						>
						<a-input
							style="width: 250px"
							v-model="record.ticketNo"
							placeholder="请输入运单号"
						/>
					</a-form-model-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
				>
					<a-space>							
						<a-popconfirm
							title="确定删除该条运输信息?"
							okText="确定"
							cancelText="取消"
							@confirm="onDeleteItem(index)"
						>
							<a href="#">删除</a>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
		</a-form-model>
    <a-button
			style="margin-top: 10px;"
      @click="addNewItem"
      type="primary"
      ghost
    >
      新增
    </a-button>
   </div>
   <template slot="footer">
     <a-space :size="20">
       <div
         class="footer-btn cancel-btn"
         @click="close"
       >
         取消
       </div>
       <div
         class="footer-btn confirm-btn"
         @click="confirmBtnClick"
       >
         提交
       </div>
     </a-space>
   </template>
 </a-modal>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import LicensePlateNumberInput from "./LicensePlateNumberInput";
import moment from 'moment';

export default {
 name: 'AutoListModel',
 components: {
LicensePlateNumberInput
 },
 data() {
   return {
     title: '编辑运输信息', // 标题
     visible: false, // 是否显示
     spinning: false, // 是否正在加载
     formModel: {
				dataSource: [],
			},
      columns:columns,
      rules: rules,
      record: {},
   };
 },
 methods: {
   // 显示弹窗
   showModal(record, index) {
			let dataSource = record.automobileDetailDtoList || []
      this.formModel = {
				dataSource: [...record.automobileDetailDtoList],
			};
      this.record = record;
      this.index = index;
      this.visible = true;
			if (dataSource.length == 0) {
				this.addNewItem();
			}
      
   },
   // 关闭弹窗
   close() {
     this.visible = false;
   },

   // 确认按钮点击事件
   async confirmBtnClick() {
     // 点击确认按钮
		 let dataSource = this.formModel.dataSource || [];
		if (dataSource.length === 0) {
			this.$emit('editAutoListFinish', [], this.record,this.index);
      this.close();
			return;
		}
     try {
      const list = await this.onValidateCar()
      this.$emit('editAutoListFinish', list, this.record,this.index);
      this.close();
     } catch (error) {
      //
     }
   },
   onValidateCar() {
      return new Promise((resolve, reject) => {
        let dataSource = this.formModel.dataSource || [];
        if (dataSource.length === 0) {
          reject('请添加批次信息');
          return;
        }
        this.$refs.transForm.validate(valid => {
          if (valid) {
            resolve(dataSource);
          } else {
            reject('批次信息存在错误！');
          }
        });
      });
    },
   addNewItem() {
    let oldList = this.formModel.dataSource || [];
			// 
			let newItem = {
				uuid: uuidv4(),
        type: 'HAND',
				plateNumber: '',
				deliverDate: '',
				arriveDate: '',
				deliverQuantity: '',
				ticketNo: '',
			};
			oldList.push(newItem);
			this.formModel = {
				dataSource: [...oldList],
			};
   },
   onDeleteItem(index) {
			let dataSource = this.formModel.dataSource;
			dataSource.splice(index, 1);
			this.formModel.dataSource = [...dataSource];
		},
    // disabledDeliverDate(current) {
		// 	return false;
		// },
    // disabledArriveDate(current) {
		// 	return false;
		// },
    disabledStartDate(record, startValue) {
			const endValue = record.arriveDate;
			if (!startValue || !endValue) {
				return false;
			}
			return startValue.valueOf() > moment(endValue).valueOf();
		},
		disabledEndDate(record, endValue) {
			const startValue = record.deliverDate;
			if (!endValue || !startValue) {
				return false;
			}
			return (
				endValue &&
				(moment(endValue).format('YYYY-MM-DD') < moment(record.deliverDate).format('YYYY-MM-DD') ||
					moment(endValue).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD'))
			);
		},
    disabledEndDateTime(record, date) {
			const choosetime = moment(date).format('HH-mm-ss');
			const chooseday = parseInt(moment(date).format('YYYY-MM-DD').split('-')[2]);
			const chooseh = parseInt(choosetime.split('-')[0]);
			if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
				const nowtime = moment().format('HH-mm-ss');
				const day = parseInt(moment().format('YYYY-MM-DD').split('-')[2]);
				const h = parseInt(nowtime.split('-')[0]);
				const m = parseInt(nowtime.split('-')[1]);
				return {
					disabledHours: () => this.rangeHours(0, 24, h, chooseday, day),
					disabledMinutes: () => this.rangeMinutes(0, 60, m, chooseday, day, chooseh, h),
					disabledSeconds: () => []
				};
			}
			if (moment(date).format('YYYY-MM-DD') === moment(record.deliverDate).format('YYYY-MM-DD')) {
				const nowtime = moment(record.deliverDate).format('HH-mm-ss');
				const day = parseInt(moment(record.deliverDate).format('YYYY-MM-DD').split('-')[2]);
				const h = parseInt(nowtime.split('-')[0]);
				const m = parseInt(nowtime.split('-')[1]);
				return {
					disabledHours: () => this.rangeHours1(0, 24, h, chooseday, day),
					disabledMinutes: () => this.rangeMinutes1(0, 60, m, chooseday, day, chooseh, h),
					disabledSeconds: () => []
				};
			}
		},
		rangeHours(start, end, value, chooseday, day) {
			const result = [];
			if (chooseday === day) {
				for (let i = start; i < end; i++) {
					if (i > value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		rangeMinutes(start, end, value, chooseday, day, chooseh, h) {
			const result = [];
			if (chooseday === day && chooseh === h) {
				for (let i = start; i < end; i++) {
					if (i > value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		rangeHours1(start, end, value, chooseday, day) {
			const result = [];
			if (chooseday === day) {
				for (let i = start; i < end; i++) {
					if (i < value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		rangeMinutes1(start, end, value, chooseday, day, chooseh, h) {
			const result = [];
			if (chooseday === day && chooseh === h) {
				for (let i = start; i < end; i++) {
					if (i <= value) {
						result.push(i);
					}
				}
			}
			return result;
		},
 }
};

export const columns = [
	{
    // title: '车牌号',
    dataIndex: 'plateNumber',
		slots: { title: 'plateNumberTitle' },
    scopedSlots: { customRender: 'plateNumber' }
  },
  {
    // title: '发货数量（吨）',
    dataIndex: 'deliverQuantity',
		slots: { title: 'deliverQuantityTitle' },
    scopedSlots: { customRender: 'deliverQuantity' },
  },
  {
    // title: '发车时间',
    dataIndex: 'deliverDate',
		slots: { title: 'deliverDateTitle' },
    scopedSlots: { customRender: 'deliverDate' },
  },
  {
    title: '到站时间',
    dataIndex: 'arriveDate',
		// slots: { title: 'arriveDateTitle' },
    scopedSlots: { customRender: 'arriveDate' },
  },
  {
		title: '运单号',
		dataIndex: 'ticketNo',
		// slots: { title: 'ticketNoTitle' },
		scopedSlots: { customRender: 'ticketNo' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		align: 'center',
		fixed: 'right',
		// width: 130,
		scopedSlots: { customRender: 'action' }
	}
];
const rules = {
  plateNumber: [
		{ required: true, message: '请输入车牌号', trigger: ['change', 'blur'] },
    {
      pattern:
        /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/,
      message: '请输入正确的车牌号',
      trigger: ['blur']
    }
	],
  deliverQuantity: [
    { 
      required: true, 
      message: '请输入发货数量', 
      trigger: ['change', 'blur'] 
    },
    {
      // 正则发货量为数字，最大200，最多两位小数
      // pattern: /^(0|[1-9]\d?|1\d\d?|200)(\.\d{0,2})?$/,
			pattern:/^(?!0(\.0{1,2})?$)(?:[1-9]\d?(?:\.\d{1,2})?|1\d\d(?:\.\d{1,2})?|200(?:\.0{1,2})?)$/,
      message: '发货量为数字，最大200，最多两位小数',
      trigger: ['change', 'blur']
    }
  ],
	deliverDate: [
		{
			required: true,
			message: '请选择发车时间',
			trigger: 'change'
		}
	],
  ticketNo: [{ pattern: /^.{0,30}$/, message: '最大输入30个字符' }],
				
};
</script>

<style lang="less" scoped>
.slModal {
 .title {
   display: flex;
   align-items: center;
   height: 100%;
   .name {
     font-size: 18px;
     color: rgba(#000, 0.8);
     font-weight: 500;
   }
 }
 .footer-btn {
   height: 32px;
   width: 90px;
   line-height: 32px;
   border-radius: 4px;
   padding: 0 !important;
   cursor: pointer;
   text-align: center;
 }
 .cancel-btn {
   border: 1px solid #e5e6eb;
   border-color: #c3c3c3;
 }
 .cancel-btn:hover {
   color: @primary-color;
   border-color: @primary-color;
 }
 .confirm-btn {
   background: @primary-color;
   color: white;
 }
 .content {
   padding: 0;
 }
 	.slFormDetail {
		padding-top: 0px;
    
	}
}
</style>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>

<style lang="less" scoped>
.new-table {
  	.requiredTableTitle {
		// color: #f5222d;
		&::before {
			content: '*';
			color: #f5222d;
		}
	}
	/deep/ .ant-table-tbody > tr > td {
		padding: 14px 20px;
	}
	/deep/ .ant-form-item {
		margin-bottom: 0;
    height: unset;
	}
	/deep/ .has-error .ant-form-explain,
	.has-error .ant-form-split {
		position: absolute;
		bottom: -7px;
	}
		/deep/ .ant-form-explain {
		position: absolute;
		line-height: 0;
		min-height: unset;
	}
	/deep/ .ant-form-item-control {
		line-height: 32px;
	}
}


</style>