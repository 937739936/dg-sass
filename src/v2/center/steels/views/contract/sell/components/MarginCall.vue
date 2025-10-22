<template>
	<div>
		<a-row
			class="title"
			style="justify-content: start"
		>
			<h3 style="margin: 30px 0">追保设置</h3>
		</a-row>
		<a-form-model
			:model="form"
			:rules="rules"
			ref="ruleForm"
			style="margin-top: 20px"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 14 }"
		>
			<a-row class="df2">
				<!-- 保证金比例 -->
				<a-col :span="12">
					<a-form-model-item
						label="保证金比例(%)"
						prop="bondRatio"
					>
						<a-input-number
							style="width: 100%"
							:max="100"
							:min="0"
							@blur="changeRatio"
							v-model="form.bondRatio"
							:precision="2"
						></a-input-number>
					</a-form-model-item>
				</a-col>
				<!-- 保证金金额 -->
				<a-col :span="12">
					<a-form-model-item
						label="保证金金额"
						prop="bondAmount"
					>
						<a-input-number
							style="width: 100%"
							:min="0"
							:precision="2"
							v-model="form.bondAmount"
						></a-input-number>
					</a-form-model-item>
				</a-col>
				<!-- 网价参考来源 -->
				<a-col :span="12">
					<a-form-model-item
						label="网价参考来源"
						prop="marketPriceSource"
					>
						<div class="df">
							<a-select
								placeholder="请选择"
								v-model="form.marketPriceSource"
								@change="changeSource"
							>
								<a-select-option
									v-for="items in marketPriceSourceList"
									:key="items.value"
									:value="items.value"
								>
									{{ items.label }}
								</a-select-option>
							</a-select>
							<a-button
								type="link"
								@click="getMark"
								:disabled="form.marketPriceSource != 'MYSTEEL_COM'"
							>
								网价标的选择</a-button
							>
						</div>
					</a-form-model-item>
				</a-col>
			</a-row>
			<a-row>
				<div v-if="form.marketPriceSource == 'MYSTEEL_COM'">
					<a-table
						:pagination="false"
						:columns="columns"
						class="new-table"
						:data-source="list"
						:loading="false"
						:scroll="{ x: true }"
						rowKey="id"
					>
					</a-table>
				</div>
				<!-- 市场价格下跌幅度设置 -->
				<div
					v-if="form.marketPriceSource == 'MYSTEEL_COM'"
					class="df2"
				>
					<a-col :span="12">
						<a-form-model-item
							label="市场价格下跌幅度设置(%)"
							prop="marketPriceDownRatio"
						>
							<a-input-number
								style="width: 100%"
								:max="100"
								@blur="sendText"
								:min="0"
								v-model="form.marketPriceDownRatio"
								:precision="2"
							></a-input-number>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="网价涨跌幅(元/吨)"
							prop="marketPriceFloatAmount"
						>
							<a-input-group compact>
								<a-select
									v-model="form.marketPriceFloatType"
									style="min-width: 100px"
									@change="sendText"
									placeholder="请选择"
								>
									<a-select-option value="UP"> 上浮</a-select-option>
									<a-select-option value="DOWN"> 下跌 </a-select-option>
								</a-select>
								<a-input-number
									style="width: 50%"
									:min="0"
									@blur="sendText"
									:precision="2"
									v-model="form.marketPriceFloatAmount"
								/>
							</a-input-group>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="预警通知人员"
							prop="bondLetterLinkmanList"
						>
							<a-select
								mode="multiple"
								v-model="form.bondLetterLinkmanList"
								placeholder="请选择"
								show-search
								style="width: 100%"
								:filter-option="false"
								:not-found-content="fetching ? undefined : null"
								@focus="fetchUser"
								@search="fetchUser"
								@change="handleChange"
							>
								<a-spin
									v-if="fetching"
									slot="notFoundContent"
									size="small"
								/>
								<a-select-option
									v-for="d in oaList"
									:key="d.id"
								>
									{{ d.text }}
								</a-select-option>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="销售基准价格"
							prop="baseUnitPrice"
						>
							<a-input
								style="width: 100%"
								:min="0"
								disabled
								v-model="baseUnitPrice"
								:precision="2"
							></a-input>
						</a-form-model-item>
					</a-col>
				</div>
			</a-row>
		</a-form-model>
		<MarkMarketModal
			ref="markMarketModal"
			@send="getSelect"
			:marketPriceId="marketPriceId"
		></MarkMarketModal>
	</div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { API_GETOAUSERBYKEYWORD } from '@/v2/center/steels/api';
import { debounce, cloneDeep } from 'lodash';
import { convertCurrency } from '@/v2/utils/factory.js';
const columns = [
	{ title: '来源', dataIndex: 'sourceFromDesc', key: 'sourceFromDesc' },
	{ title: '日期', dataIndex: 'date', key: 'date' },
	{ title: '时间', dataIndex: 'time', key: 'time' },
	{ title: '区域', dataIndex: 'area', key: 'area' },
	{ title: '钢材种类', dataIndex: 'steelType', key: 'steelType' },
	{ title: '品名', dataIndex: 'materialName', key: 'materialName' },
	{ title: '规格', dataIndex: 'specs', key: 'specs' },
	{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
	{ title: '钢厂/产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin' },
	{ title: '价格(元/吨)', dataIndex: 'unitPrice', key: 'unitPrice' },
	{ title: '涨跌(元/吨)', dataIndex: 'raise', key: 'raise', customRender: text => text || '-' },
	{ title: '备注', dataIndex: 'note', key: 'note', fixed: 'right' }
];
import MarkMarketModal from './MarkMarketModal.vue';
export default {
	props: {
		type: {
			default: 'BUY'
		}
		// 素材明细数据
		// selectedData: {
		//   default: () => []
		// }
	},
	data() {
		this.fetchUser = debounce(this.fetchUser, 800);
		return {
			form: {
				bondRatio: null,
				bondAmount: '',
				marketPriceSource: '',
				marketPriceDownRatio: null,
				marketPriceFloatType: undefined,
				bondLetterLinkmanList: []
			},
			rules: {
				bondRatio: [{ required: true, message: '请输入', trigger: 'blur' }],
				bondAmount: [{ required: true, message: '请输入', trigger: 'change' }],
				marketPriceSource: [{ required: true, message: '请选择网价参考来源', trigger: 'change' }],
				marketPriceDownRatio: [{ required: true, message: '请输入', trigger: 'blur' }]
			},
			/** 网价参考来源 */
			marketPriceSourceList: [
				{ value: 'MYSTEEL_COM', label: '我的钢铁网' },
				{ value: 'CHINATSI_COM', label: '唐宋钢铁网' },
				{ value: 'OTHER', label: '其他' }
			],
			oaList: [],
			fetching: false,
			columns,
			// 选择的网价数据
			marketPriceId: '',
			list: [],
			/** 计算的含税金额 */
			includedTax: 0,
			// 网价价格
			unitPrice: 0
		};
	},
	watch: {
		money: {
			handler(list) {
				this.changeRatio();
			},
			deep: true
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE',
			VUEX_ST_STEELSALLCODE: 'VUEX_ST_STEELSALLCODE'
		}),
		// 判断是否是新增
		isEdit() {
			return this.$route.query.type == 'edit';
		},
		baseUnitPrice() {
			const item = this.list[0] || { unitPrice: 0 };
			let baseUnitPrice = item.unitPrice;
			if (this.form.marketPriceFloatType == 'UP') {
				baseUnitPrice = (this.form.marketPriceFloatAmount || 0) + item.unitPrice;
			} else if (this.form.marketPriceFloatType == 'DOWN') {
				baseUnitPrice = item.unitPrice - (this.form.marketPriceFloatAmount || 0);
			}
			return baseUnitPrice;
		},
		money() {
			return this.$store.state.steelContract.money;
		}
	},

	mounted() {},
	methods: {
		handleChange(value) {},
		init(info) {
			this.form = info;
			const list = info.marketPrice || [];

			this.list = list;
			this.marketPriceId = info.marketPriceId || '';
			if (info.bondLetterLinkmanList && info.bondLetterLinkmanList.length) {
				this.form.bondLetterLinkmanList = info.bondLetterLinkmanList.map(el => `${el.noticeName}-${el.noticePhone}`);
			}
		},
		async fetchUser(value) {
			if (!value) return;

			this.fetching = true;
			const params = {
				systemCode: 'CCS_OA',
				keyword: value
			};
			try {
				const res = await API_GETOAUSERBYKEYWORD(params);
				const list = res.data || [];
				this.oaList = list.map(el => {
					return {
						text: `${el.USERNAME}-${el.MOBILE}`,
						id: `${el.USERNAME}-${el.MOBILE}`
					};
				});
				this.fetching = false;
			} catch (error) {
				this.fetching = false;
			}
		},
		// 输出数据
		save() {
			let flag = false;
			this.$refs.ruleForm.validate(valid => {
				flag = valid;
			});
			if (!flag) {
				return false;
			}
			if (this.form.marketPriceSource == 'MYSTEEL_COM') {
				if (!this.marketPriceId) {
					this.$message.error('请选择网价标的数据');
					return false;
				}
			}
			// bondLetterLinkmanList
			/** 获取所有的预警人员信息 */
			let bondLetterLinkmanList = [];
			if (this.form.bondLetterLinkmanList && this.form.bondLetterLinkmanList.length) {
				this.form.bondLetterLinkmanList.forEach(el => {
					const arr = el.split('-');
					const obj = {
						noticeName: arr[0],
						noticePhone: arr[1]
					};
					bondLetterLinkmanList.push(obj);
				});
			}

			return { ...this.form, baseUnitPrice: this.baseUnitPrice, bondLetterLinkmanList, marketPriceId: this.marketPriceId || '' };
		},
		getSelect(id, list) {
			this.marketPriceId = id;

			this.list = list;
			const item = list[0] || { unitPrice: 0 };
			/** 基准价格计算 */
			const unitPrice = item.unitPrice;
			this.unitPrice = unitPrice;

			this.sendText();
		},
		// 计算保证金金额
		changeRatio() {
			// 保证金比例 * 含税金额
			this.form.bondAmount = (((this.form.bondRatio || 0) * this.$store.state.steelContract.money) / 100).toFixed(2);
			this.$forceUpdate();
			// 重新校验保证金
			this.$refs.ruleForm.validateField('bondAmount');
			this.sendText();
		},
		getMark() {
			this.$refs.markMarketModal.open();
		},
		changeSource() {
			if (this.form.marketPriceSource == 'MYSTEEL_COM') {
				this.sendText();
			}
		},
		sendText() {
			if (this.form.marketPriceSource != 'MYSTEEL_COM') {
				return;
			}
			const item = this.list[0] || {};
			let desc = ``;
			if (this.form.marketPriceFloatType == 'UP') {
				desc = `,上浮约${this.form.marketPriceFloatAmount || 0}元/吨为${this.baseUnitPrice}`;
			} else if (this.form.marketPriceFloatType == 'DOWN') {
				desc = `,下跌约${this.form.marketPriceFloatAmount || 0}元/吨为${this.baseUnitPrice}`;
			}
			let date = item.date;
			if (date) {
				date = date.replace('-', '年').replace('-', '月') + '日';
			}

			let str = `
        1、乙方应在本合同签订一个工作日内，向甲方支付履约保证金（现汇）${this.form.bondAmount} 元（大写：${convertCurrency(this.form.bondAmount)}），履约保证金可冲抵最后一笔货款或在乙方付清全款后返 还乙方。
        <div>
        2、当货物市场价格发生下跌，甲方有权依据“我的钢铁”网站www.mysteel.com 公布的本合同货物市场价格（市场价格为${item.area || ''}地区：${item.materialName || ''}，${item.specs || ''}，${item.材质 || ''} 的市场报价）(以${date || ''}市场价格
        ${item.unitPrice || ''}元/吨${desc}为基准)或期货交易市场价格（以合同签订当日上海期货交易所螺纹钢或热卷主力合约 15 点收盘结算价为基准），当市场价格下跌幅度达 ${this.form.marketPriceDownRatio || ''}%时，甲方书面通知乙方追加市场下跌金额 100%的保证金，追加履约
        保证金具体金额以甲方单方通知为准。乙方应在甲方通知的时间期限内，按照甲方要求追加支付相应履约保证金。履约保证金根据市场下跌情况，可多次收取。
        </div>`;
			str = str.replace(/\s*/g, '');
			this.$emit('sendText', str);
		}
	},
	components: {
		MarkMarketModal
	}
};
</script>

<style scoped lang="less">
.df {
	display: flex;
	align-items: center;
}
.df2 {
	display: flex;
	flex-wrap: wrap;
}
</style>
