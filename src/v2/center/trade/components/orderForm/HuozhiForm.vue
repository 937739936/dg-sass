<template>
	<div id="HuozhiForm">
		<div class="ant-row">
			<h3 style="margin: 30px 0">质量调整价的核算办法</h3>
		</div>
		<div
			class="ant-row"
			v-if="!(disabled && !dcname)"
		>
			<div
				class="ant-col ant-col ant-col-4"
				style="text-align: center; height: 31px; line-height: 31px"
			>
				电厂名称：
			</div>
			<div class="ant-col ant-col-9">
				<a-select
					style="width: 300px"
					v-model="dcname"
					:disabled="disabled"
					show-search
					placeholder="请输入内容搜索"
					:default-active-first-option="false"
					:show-arrow="false"
					:filter-option="false"
					:not-found-content="null"
					@search="getDCList"
				>
					<a-select-option
						v-for="items in dcList"
						:key="items.id"
						:value="items.id"
						>{{ items.name }}</a-select-option
					>
				</a-select>
			</div>
		</div>
		<!-- 选完电厂才出现后面的内容-->
		<template v-if="dcname">
			<div
				class="ant-row"
				style="margin-top: 40px; margin-bottom: 40px"
			>
				<div
					class="ant-col ant-col ant-col-4"
					style="text-align: center"
				>
					考核指标勾选：
				</div>
				<div class="ant-col ant-col ant-col-12">
					<a-checkbox
						:disabled="true"
						v-model="checkBox.type1"
						>热值</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBox.type2"
						>硫分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBox.type3"
						>水分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBox.type4"
						>挥发分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBox.type5"
						>灰分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBox.type6"
						>灰熔点</a-checkbox
					>
				</div>
			</div>
			<checkForm
				ref="checkForm"
				:selected="getSelectData(checkData)"
				:editable="!disabled"
			/>
			<div class="ant-row">
				<h3 style="margin: 30px 0">其他因素额外增扣</h3>
			</div>
			<div
				class="ant-row"
				style="margin-top: 4px; margin-bottom: 40px"
			>
				<div
					class="ant-col ant-col ant-col-4"
					style="text-align: center"
				>
					考核指标勾选：
				</div>
				<div class="ant-col ant-col ant-col-12">
					<a-checkbox
						:disabled="disabled"
						v-model="checkBoxOther.type7"
						>热值</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBoxOther.type8"
						>硫分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBoxOther.type9"
						>水分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBoxOther.type10"
						>挥发分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBoxOther.type11"
						>灰分</a-checkbox
					>
					<a-checkbox
						:disabled="disabled"
						v-model="checkBoxOther.type12"
						>灰熔点</a-checkbox
					>
				</div>
			</div>
			<otherFactors
				ref="otherFactors"
				:selected="getSelectData(checkDataOther)"
				:editable="!disabled"
			/>
		</template>
	</div>
</template>

<script>
import { API_listTerminalPower } from '@/v2/center/trade/api/contract';
import checkForm from './CheckForm';
import otherFactors from './OtherFactors';
import { mapGetters } from 'vuex';
export default {
	name: 'HuozhiForm',
	data() {
		return {
			dcList: [],
			dcname: this._dcname ? parseInt(this._dcname) : '',
			hasOther: false,
			checkBox: {
				type1: true,
				type2: false,
				type3: false,
				type4: false,
				type5: false,
				type6: false
			},
			checkData: {},
			checkDataOther: {},
			tempCheckData: {}, // 储存临时数据
			tempCheckDataOther: {}, // 储存临时数据
			checkBoxOther: {
				type7: false,
				type8: false,
				type9: false,
				type10: false,
				type11: false,
				type12: false
			}
		};
	},
	props: ['disabled', '_checkData', '_dcname', 'contractTemplate', 'coalType'],
	computed: {
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		})
	},
	created() {
		this.getDCList();
		if (!this._checkData) return;

		let main = [1, 2, 3, 4, 5, 6];
		let other = [7, 8, 9, 10, 11, 12];
		for (let i = 0; i < this._checkData.length; i++) {
			let type = this._checkData[i].type;
			if (main.indexOf(type) > -1) {
				this.checkData['type' + type] = this._checkData[i];
				this.checkBox['type' + type] = true;
			}
			if (other.indexOf(type) > -1) {
				this.checkDataOther['type' + type] = this._checkData[i];
				this.checkBoxOther['type' + type] = true;
			}
		}
	},

	watch: {
		checkBox: {
			handler(v) {
				var obj = {};
				//this.tempCheckData 记录上一次的选择
				if (v.type1) {
					obj['type1'] = this.checkData['type1'] ||
						this.tempCheckData['type1'] || {
							type: 1,
							typeName: '热值',
							templateId: this.getTemplateById(this.dcname),
							itemList: []
						};
					this.tempCheckData['type1'] = obj['type1'];
				}
				if (v.type2) {
					obj['type2'] = this.checkData['type2'] ||
						this.tempCheckData['type2'] || {
							type: 2,
							typeName: '硫分',
							itemList: []
						};
					this.tempCheckData['type2'] = obj['type2'];
				}
				if (v.type3) {
					obj['type3'] = this.checkData['type3'] ||
						this.tempCheckData['type3'] || {
							type: 3,
							typeName: '水分',
							itemList: []
						};
					this.tempCheckData['type3'] = obj['type3'];
				}
				if (v.type4) {
					obj['type4'] = this.checkData['type4'] ||
						this.tempCheckData['type4'] || {
							type: 4,
							typeName: '挥发分',
							itemList: []
						};
					this.tempCheckData['type4'] = obj['type4'];
				}
				if (v.type5) {
					obj['type5'] = this.checkData['type5'] ||
						this.tempCheckData['type5'] || {
							type: 5,
							typeName: '灰分',
							itemList: []
						};
					this.tempCheckData['type5'] = obj['type5'];
				}
				if (v.type6) {
					obj['type6'] = this.checkData['type6'] ||
						this.tempCheckData['type6'] || {
							type: 6,
							typeName: '灰熔点',
							itemList: []
						};
					this.tempCheckData['type6'] = obj['type6'];
				}

				this.checkData = obj;
			},
			immediate: false,
			deep: true
		},
		checkBoxOther: {
			handler(v) {
				var obj = {};
				//this.tempCheckDataOther 记录上一次的选择
				if (v.type7) {
					obj['type7'] = this.checkDataOther['type7'] ||
						this.tempCheckDataOther['type7'] || {
							type: 7,
							typeName: '热值',
							itemList: []
						};
					this.tempCheckDataOther['type7'] = obj['type7'];
				}
				if (v.type8) {
					obj['type8'] = this.checkDataOther['type8'] ||
						this.tempCheckDataOther['type8'] || {
							type: 8,
							typeName: '硫分',
							itemList: []
						};
					this.tempCheckDataOther['type8'] = obj['type8'];
				}
				if (v.type9) {
					obj['type9'] = this.checkDataOther['type9'] ||
						this.tempCheckDataOther['type9'] || {
							type: 9,
							typeName: '水分',
							itemList: []
						};
					this.tempCheckDataOther['type9'] = obj['type9'];
				}
				if (v.type10) {
					obj['type10'] = this.checkDataOther['type10'] ||
						this.tempCheckDataOther['type10'] || {
							type: 10,
							typeName: '挥发分',
							itemList: []
						};
					this.tempCheckDataOther['type10'] = obj['type10'];
				}
				if (v.type11) {
					obj['type11'] = this.checkDataOther['type11'] ||
						this.tempCheckDataOther['type11'] || {
							type: 11,
							typeName: '灰分',
							itemList: []
						};
					this.tempCheckDataOther['type11'] = obj['type11'];
				}
				if (v.type12) {
					obj['type12'] = this.checkDataOther['type12'] ||
						this.tempCheckDataOther['type12'] || {
							type: 12,
							typeName: '灰熔点',
							itemList: []
						};
					this.tempCheckDataOther['type12'] = obj['type12'];
				}
				for (let key in obj) {
					if (obj[key]) {
						this.hasOther = true;
					}
				}

				this.checkDataOther = obj;
			},
			immediate: false,
			deep: true
		},
		dcname: {
			handler(v) {
				this.checkData = {
					...this.checkData,
					type1: {
						type: 1,
						typeName: '热值',
						templateId: this.getTemplateById(v),
						itemList: []
					}
				};
			}
		}
	},
	methods: {
		getDCList(data) {
			// if(!data) return
			API_listTerminalPower({
				orderType: this.CONSTANTS.orderTypeDict.BUY, // 采购
				coalType: this.VUEX_ST_ORDERCREATEINFO ? this.VUEX_ST_ORDERCREATEINFO.data.contract.coalType : coalType, // 动力煤
				contractTemplate: this.contractTemplate,
				keyWord: data || ''
			}).then(res => {
				if (res.success) {
					this.dcList = res.data || [];
				}
			});
		},
		getTemplateById(v) {
			let template = '';
			this.dcList.forEach(item => {
				if (v == item.id) {
					template = item.templateId;
				}
			});

			return template;
		},
		getSelectData(map) {
			let array = [];
			for (let key in map) {
				array.push(map[key]);
			}
			return array;
		},
		getHuozhiData(flag) {
			let list = [];
			let listOther = [];
			let data = this.$refs.checkForm ? this.$refs.checkForm.save(flag).data || [] : [];
			let dataOther = this.$refs.otherFactors ? this.$refs.otherFactors.save(flag).data || [] : [];
			data.forEach(element => {
				if (element.itemList && element.itemList.length) {
					element.itemList.forEach(item => {
						item.indicatorType = element.type;
						item.templateType = element.templateId;
						list.push(item);
					});
				}
			});
			dataOther.forEach(element => {
				if (element.itemList && element.itemList.length) {
					element.itemList.forEach(item => {
						item.indicatorType = element.type;
						item.templateType = element.templateId;
						listOther.push(item);
					});
				}
			});

			return list.concat(listOther);
		},
		validHuozhiData(flag) {
			let data = this.$refs.checkForm ? this.$refs.checkForm.save(flag).isPass : true; // 校验数据是否填写完整
			let dataOther = this.$refs.otherFactors ? this.$refs.otherFactors.save(flag).isPass : true; // 校验数据是否填写完整
			let dataError = this.$refs.checkForm ? this.$refs.checkForm.save(flag).errorMsg : ''; // 校验数据区间,返回错误信息
			let dataOtherError = this.$refs.otherFactors ? this.$refs.otherFactors.save(flag).errorMsg : ''; // 校验数据区间,返回错误信息
			return {
				isPass: this.dcname ? data && dataOther && this.dcname : true,
				errorMsg: dataError ? dataError : dataOtherError
			};
		},
		getdcname() {
			return this.dcname;
		}
	},
	components: {
		checkForm,
		otherFactors
	}
};
</script>
<style></style>
