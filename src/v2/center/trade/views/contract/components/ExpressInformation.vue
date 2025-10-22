<template>
	<a-form
		:form="form"
		:label-col="{ span: 6 }"
		:wrapper-col="{ span: 16 }"
	>
		<a-row>
			<a-col :span="12">
				<a-form-item label="快递公司">
					<a-select
						v-decorator="['expressMailType', { rules: [{ required: true, message: '请选择快递公司' }] }]"
						:getPopupContainer="getPopupContainer"
						placeholder="请选择"
					>
						<a-select-option
							:value="item.value"
							v-for="item in expressList"
							:key="item.value"
						>
							{{ item.text }}
						</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="快递单号">
					<a-input
						:maxLength="20"
						v-decorator="[
							`expressOrderNo`,
							{
								rules: [{ required: true, message: `请输入快递单号` }, { validator: validator.validLetterAndNumber }]
							}
						]"
						placeholder="请输入快递单号"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item
					label="发件信息"
					:colon="false"
					:label-col="{ span: 3 }"
				>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="姓名">
					<a-input
						:maxLength="20"
						v-decorator="[
							`senderName`,
							{
								rules: [{ required: true, message: `请输入姓名` }, { validator: validator.validLetterOrNumberOrHanzi }]
							}
						]"
						placeholder="请输入姓名"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="电话">
					<a-input
						v-decorator="[
							`senderMobile`,
							{
								rules: [{ required: true, message: `请输入电话` }, { validator: validator.validIdTel }]
							}
						]"
						placeholder="请输入电话"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="发货地址">
					<a-cascader
						:getPopupContainer="getPopupContainer"
						:options="options"
						:load-data="loadData"
						placeholder="发货地址"
						v-decorator="[
							`sendA`,
							{
								rules: [{ required: true, message: `请选择发货地址` }]
							}
						]"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item
					label="详细地址"
					:label-col="{ span: 0 }"
					:wrapper-col="{ span: 22 }"
				>
					<a-input
						:maxLength="50"
						v-decorator="[
							`sendDetailAddress`,
							{
								rules: [{ required: true, message: `请输入详细地址` }]
							}
						]"
						placeholder="请输入详细地址"
					/>
				</a-form-item>
			</a-col>
			<!-- <a-col :span="18">
        <a-form-item
          label=" "
          :colon="false"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-textarea
            placeholder="粘贴或输入整段地址，点击“识别”自动拆分姓名、电话和地址"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-col>
      <a-col :span="5" :offset="1">
        <a-button type="primary"> 识别 </a-button>
      </a-col> -->
			<a-col :span="24">
				<a-form-item
					label="收件信息"
					:colon="false"
					:label-col="{ span: 3 }"
				>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="姓名">
					<a-input
						:maxLength="20"
						v-decorator="[
							`receiverName`,
							{
								rules: [{ required: true, message: `请输入姓名` }, { validator: validator.validLetterOrNumberOrHanzi }]
							}
						]"
						placeholder="请输入姓名"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="电话">
					<a-input
						v-decorator="[
							`receiverMobile`,
							{
								rules: [{ required: true, message: `请输入电话` }, { validator: validator.validIdTel }]
							}
						]"
						placeholder="请输入电话"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="收货地址">
					<a-cascader
						:getPopupContainer="getPopupContainer"
						:options="options"
						:load-data="loadData"
						placeholder="收货地址"
						v-decorator="[
							`receiveA`,
							{
								rules: [{ required: true, message: `请选择收货地址` }]
							}
						]"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item
					label="详细地址"
					:label-col="{ span: 0 }"
					:wrapper-col="{ span: 22 }"
				>
					<a-input
						:maxLength="50"
						v-decorator="[
							`receiveDetailAddress`,
							{
								rules: [{ required: true, message: `请输入详细地址` }]
							}
						]"
						placeholder="请输入详细地址"
					/>
				</a-form-item>
			</a-col>
			<!-- <a-col :span="18">
        <a-form-item
          label=" "
          :colon="false"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-textarea
            placeholder="粘贴或输入整段地址，点击“识别”自动拆分姓名、电话和地址"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-col>
      <a-col :span="5" :offset="1">
        <a-button type="primary"> 识别 </a-button>
      </a-col> -->
		</a-row>
	</a-form>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_BIZPROVINCELIST, API_BIZCITYLIST, API_BIZAREALIST } from '@/v2/center/trade/api/contract';
import { validIdTel, validLetterOrNumberOrHanzi, validLetterAndNumber } from '@/v2/utils/validForm';
export default {
	name: 'ExpressInformation',
	data() {
		return {
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			getPopupContainer,
			expressList: filterCodeByKey('expressMailEnum'),
			validator: {
				validLetterOrNumberOrHanzi,
				validIdTel,
				validLetterAndNumber
			},
			options: []
		};
	},
	created() {
		this.getProvinceData();
	},
	methods: {
		//监听表单值的变化
		async onValuesChange(props, values) {
			//地址变化,反向渲染
			if (values.hasOwnProperty('sendA')) {
				let option = this.options.filter(item => {
					return item.value == values.sendA[0];
				});
				if (!option[0].children) {
					await this.loadData(option);
				}
				let options = option[0].children.filter(item => {
					return item.value == values.sendA[1];
				});
				if (!options[0].children) {
					await this.loadData(options);
				}
			}
			if (values.hasOwnProperty('receiveA')) {
				let option = this.options.filter(item => {
					return item.value == values.receiveA[0];
				});
				if (!option[0].children) {
					await this.loadData(option);
				}
				let options = option[0].children.filter(item => {
					return item.value == values.receiveA[1];
				});
				if (!options[0].children) {
					await this.loadData(options);
				}
			}
		},
		async loadData(selectedOptions) {
			const targetOption = selectedOptions[selectedOptions.length - 1];
			targetOption.loading = true;
			let children = [];
			if (targetOption.hierarchy == 1) {
				//选择省
				children = await this.getCityData(targetOption.value);
			} else if (targetOption.hierarchy == 2) {
				//选择市
				children = await this.getAreaData(targetOption.value);
			}
			if (children.length) {
				targetOption.children = children;
			} else {
				targetOption.isLeaf = true;
			}
			targetOption.loading = false;
			this.options = [...this.options];
		},

		// 获取省
		async getProvinceData() {
			let res = await API_BIZPROVINCELIST({ countryCode: 1, containsAll: true });
			if (res.success) {
				this.options = res.result.map(item => {
					return {
						value: item.code,
						label: item.name,
						hierarchy: 1,
						isLeaf: false
					};
				});
			}
		},
		// 获取市
		async getCityData(provinceCode) {
			let options = [];
			let res = await API_BIZCITYLIST({ provinceCode, containsAll: true });
			if (res.success) {
				options = res.result.map(item => {
					return {
						value: item.code,
						label: item.name,
						hierarchy: 2,
						isLeaf: false
					};
				});
			}
			return options;
		},
		// 获取区县
		async getAreaData(cityCode) {
			let options = [];
			let res = await API_BIZAREALIST({ cityCode, containsAll: true });
			if (res.success) {
				options = res.result
					.filter(item => {
						return item;
					})
					.map(item => {
						return {
							value: item?.code,
							label: item?.name
						};
					});
			}
			return options;
		}
	}
};
</script>

<style></style>
