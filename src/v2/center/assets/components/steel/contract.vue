<template>
	<div
		class="contentBox"
		v-if="contractInfo"
	>
		<!-- 上游 -->
		<div class="upstreamBox">
			<div class="title">上游合同信息</div>
			<div class="divider"></div>
			<div class="content">
				<div>
					<p class="sub-title">基本信息</p>
					<a-row>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">合同编号</a-col>
								<a-col :span="18">{{ contractInfo.upContract.contractNo }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">合同金额(元)</a-col>
								<a-col
									:span="18"
									v-if="contractInfo.upContract.amount"
									>{{ contractInfo.upContract.amount }}元</a-col
								>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">签订日期</a-col>
								<a-col :span="18">{{ contractInfo.upContract.signDate }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">合同执行期</a-col>
								<a-col
									:span="18"
									v-if="contractInfo.upContract.execDateStart"
								>
									{{ contractInfo.upContract.execDateStart }}~{{ contractInfo.upContract.execDateEnd }}
								</a-col>
							</a-row>
						</a-col>
						<!--                        <a-col :span="12">-->
						<!--                            <a-row :gutter="20">-->
						<!--                                <a-col :span="6">到期日期</a-col>-->
						<!--                                <a-col :span="18">{{contractInfo.upContract.endDate}}</a-col>-->
						<!--                            </a-row>-->
						<!--                        </a-col>-->
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">签订状态</a-col>
								<a-col
									:span="18"
									class="doubleSign"
									v-if="contractInfo.upContract.signStatus == '2'"
									>双签</a-col
								>
								<a-col
									:span="18"
									class="singleSign"
									v-if="contractInfo.upContract.signStatus == '1'"
									>单签</a-col
								>
							</a-row>
						</a-col>
						<a-col
							:span="12"
							v-if="contractInfo.upContract.signStatus == '2' && contractInfo.upContract.doubelSignRecvDate"
						>
							<a-row :gutter="20">
								<a-col :span="8">双签版获得日期</a-col>
								<a-col :span="16">{{ contractInfo.upContract.doubelSignRecvDate }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>

				<!--                <div>-->
				<!--                    <p class="sub-title">合同详情</p>-->
				<!--                    <a-table :pagination="false" :columns="contractDetailColumns" :data-source="upstreamContractDetailData"  :scroll="{x:true}" rowKey="id"></a-table>-->
				<!--                </div>-->

				<div>
					<p class="sub-title">附件信息</p>
					<!-- 上游附件信息详情模块 -->
					<a-table
						v-if="contractInfo.upContract"
						:pagination="false"
						:columns="noFileName ? noFileNameFilesColumns : filesColumns"
						:data-source="contractInfo.upContract.list"
						:scroll="{ x: true }"
						rowKey="path"
					>
						<template
							slot="type"
							slot-scope="type"
						>
							{{ CONSTANTS.fileType[type] }}
						</template>
						<template
							slot="name"
							slot-scope="name, items"
						>
							<a
								:href="items.path"
								target="_blank"
								>{{ name }}</a
							>
						</template>
					</a-table>
					<div v-else>暂无数据</div>
				</div>
			</div>
		</div>
		<!-- 下游 -->
		<div class="downstreamBox">
			<div class="title">
				下游合同信息<span
					class="redTips"
					v-if="editFlag"
					>必须存在附件</span
				>
			</div>
			<div class="divider"></div>
			<div class="content">
				<div
					style="text-align: right"
					v-if="showEditorRadio && contractInfo.downContractType !== 'ONLINE'"
				>
					编辑合同
					<a-radio-group v-model="editFlag">
						<a-radio :value="true"> 是 </a-radio>
						<a-radio :value="false"> 否 </a-radio>
					</a-radio-group>
				</div>
				<div>
					<p class="sub-title">基本信息</p>

					<!-- 下游基本信息详情展示模块 -->

					<a-form-model
						ref="baseInfoForm"
						:model="contractInfo.downContract"
						:rules="baseInfoRules"
					>
						<a-row>
							<a-col
								:span="12"
								v-if="contractInfo.downContract.sellerName"
								style="margin-bottom: 24px"
							>
								<a-row :gutter="20">
									<a-col :span="6">卖方企业名称</a-col>
									<a-col :span="18">{{ contractInfo.downContract.sellerName }}</a-col>
								</a-row>
							</a-col>
							<a-col
								:span="12"
								v-if="contractInfo.downContract.sellerName"
								style="margin-bottom: 24px"
							>
								<a-row :gutter="20">
									<a-col :span="8">买方企业名称</a-col>
									<a-col :span="14">{{ contractInfo.downContract.buyerName }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同编号</a-col>
									<a-col :span="18">{{ contractInfo.downContract.contractNo }}</a-col>
								</a-row>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									ref="contractAmount"
									label="合同金额（元）"
									prop="contractAmount"
									:colon="false"
									:label-col="{ span: 8 }"
									:wrapper-col="{ span: 14 }"
								>
									<a-input
										:disabled="!editFlag"
										placeholder="请输入合同金额"
										v-model="baseInfoForm.contractAmount"
										:maxLength="50"
									/>
								</a-form-model-item>
							</a-col>

							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									ref="contractSignTime"
									label="签订日期"
									prop="contractSignTime"
									:colon="false"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 14 }"
								>
									<a-date-picker
										v-model="baseInfoForm.contractSignTime"
										type="date"
										:disabled="!editFlag"
										format="YYYY-MM-DD"
										style="width: 100%"
										@change="getTime"
										placeholder="请选择"
									/>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									ref="execDate"
									label="合同执行日期"
									prop="execDate"
									:colon="false"
									:label-col="{ span: 8 }"
									:wrapper-col="{ span: 14 }"
								>
									<a-range-picker
										v-model="baseInfoForm.execDate"
										type="date"
										:disabled="!editFlag"
										format="YYYY-MM-DD"
										@change="getExecTime"
										style="width: 100%"
									/>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-model-item
									ref="status"
									label="签订状态"
									prop="status"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 14 }"
								>
									<a-radio-group
										v-model="baseInfoForm.status"
										:disabled="!editFlag"
									>
										<a-radio :value="2">双签</a-radio>
										<a-radio :value="1">单签</a-radio>
									</a-radio-group>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="12"
								class="row"
								v-if="baseInfoForm.status == 2"
							>
								<a-form-model-item
									ref="doubleSignTime"
									label="双签合同获得日期"
									prop="doubleSignTime"
									:label-col="{ span: 8 }"
									:wrapper-col="{ span: 14 }"
								>
									<a-date-picker
										:disabled="!editFlag"
										v-model="baseInfoForm.doubleSignTime"
										type="date"
										format="YYYY-MM-DD"
										style="width: 100%"
										@change="getDoubleTime"
										placeholder="请选择"
									/>
								</a-form-model-item>
							</a-col>
						</a-row>
					</a-form-model>
				</div>

				<div>
					<p class="sub-title">附件信息</p>
					<!-- 下游附件编辑模块 -->
					<template v-if="editFlag">
						<Upload
							:receivalVO="receivalVO"
							@uploadFiles="getUploadFiles"
							type="TERMINAL_CONTRACT"
							btnText="上传下游合同"
						></Upload>
						<Upload
							:receivalVO="receivalVO"
							@uploadFiles="getUploadFiles"
							type="TERMINAL_CONTRACT_SUPPLEMENT"
							btnText="上传补充文档"
						></Upload>
						<!--                        <Upload :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT_BID_PROOF" btnText="上传中标佐证"></Upload>-->
						<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5"
							>单个文件最大支持100M，支持多个上传</span
						>
						<a-table
							v-if="contractInfo.downContract"
							:pagination="false"
							:columns="editFilesColumns"
							:data-source="editDownContractList"
							:scroll="{ x: true }"
							rowKey="path"
						>
							<template
								slot="type"
								slot-scope="type"
							>
								{{ CONSTANTS.fileType[type] }}
							</template>
							<template
								slot="name"
								slot-scope="name, items"
							>
								<a
									:href="items.path"
									target="_blank"
									>{{ name }}</a
								>
							</template>
							<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
							<template
								slot="action"
								slot-scope="action, items"
							>
								<a-popconfirm
									v-if="!items.locked"
									title="确定删除该附件?"
									okText="确定"
									cancelText="取消"
									@confirm="() => deleteFiles(items)"
								>
									<a href="javascript:;">删除</a>
								</a-popconfirm>
							</template>
						</a-table>
						<div v-else>暂无数据</div>
					</template>
					<!-- 下游附件详情展示模块 -->
					<template v-if="!editFlag">
						<a-table
							v-if="contractInfo.downContract"
							:pagination="false"
							:columns="noFileName ? noFileNameFilesColumns : filesColumns"
							:data-source="filterLockFile(contractInfo.downContract.list)"
							:scroll="{ x: true }"
							rowKey="path"
						>
							<template
								slot="type"
								slot-scope="type"
							>
								{{ CONSTANTS.fileType[type] }}
							</template>
							<template
								slot="name"
								slot-scope="name, items"
							>
								<a
									:href="items.path"
									target="_blank"
									>{{ name }}</a
								>
							</template>
						</a-table>
						<div v-else>暂无数据</div>
					</template>
				</div>
			</div>
		</div>
		<!-- 仓储合同信息 -->
		<div
			class="upstreamBox"
			v-if="receivalVO && receivalVO.paymentType === 'receivable-ICBC-steel' && receivalVO.generateAssetType == 1"
		>
			<div class="title">仓储合同信息</div>
			<div class="divider"></div>
			<div class="content">
				<div>
					<div
						class="sub-title"
						style="margin-bottom: 40px"
					>
						附件信息
						<div style="float: right; text-align: right">
							<a-button
								type="primary"
								icon="plus"
								@click="goSteelStorageContract"
							>
								编辑仓储合同
							</a-button>
							<div style="color: #999999">单个文件最大支持100M，支持多个上传</div>
						</div>
					</div>
					<!-- 仓储合同附件信息详情模块 -->
					<a-table
						v-if="contractInfo.warehouseContract"
						:pagination="false"
						:columns="noFileName ? noFileNameFilesColumns : filesColumns"
						:data-source="contractInfo.warehouseContract.list"
						:scroll="{ x: true }"
						rowKey="path"
					>
						<template slot="type"> 仓储合同 </template>
						<template
							slot="name"
							slot-scope="name, items"
						>
							<a
								:href="items.path"
								target="_blank"
								>{{ name }}</a
							>
						</template>
					</a-table>
					<div v-else>暂无数据</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import Upload from '../common/Upload.vue';
import { filterLockFile } from '@/untils/factory.js';
import _ from 'lodash';

export default {
	name: 'SteelContract',
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验合同金额
			let regs2 = /^\d+(\.\d{0,2})?$/;
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		return {
			filterLockFile: filterLockFile,
			contractDetailColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice' },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' }
			],
			upstreamContractDetailData: [], // 上游合同详情数据
			downstreamContractDetailData: [], // 下游合同详情数据
			contractEditColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice' },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			noFileNameFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			],

			editFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			fileInfos: [],
			baseInfoForm: {
				contractNo: '',
				contractAmount: '',
				contractSignTime: '',
				doubleSignTime: '',
				status: '',
				endTime: ''
			},
			detailForm: {},
			baseInfoRules: {
				contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
				contractAmount: [{ required: true, message: '合同⾦额不能为空', trigger: 'change' }],
				contractSignTime: [{ required: true, message: '签订⽇期不能为空', trigger: 'change' }],
				status: [{ required: true, message: '签订状态不能为空', trigger: 'change' }],
				// contractExpireDate: [ { required: true, message: '到期⽇期不能为空', trigger: 'change' } ],
				// endTime: [ { required: true, message: '请选择到期日期', trigger: 'change' } ],
				doubleSignTime: [{ required: true, message: '双签版合同获得⽇期不能为空', trigger: 'change' }]
			},
			editContractFlag: false, // 新增、修改合同详情,
			contractDetailForm: {
				goodsName: '',
				contractPrice: '',
				contractQuantity: ''
			},
			contractDetailRules: {
				goodsName: [{ required: true, message: '标的货物名称不能为空', trigger: 'blur' }],
				contractPrice: [
					{ required: true, message: '单价不能为空', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur', max: 9999999999, msg: '请输入0-9999999999,最多两位小数' }
				],
				contractQuantity: [
					{ required: true, message: '数量不能为空', trigger: 'change' },
					{ validator: validatePass, trigger: 'blur', max: 9999999999, msg: '请输入0-9999999999,最多两位小数' }
				]
			},
			downContractInfoFlag: true, // 上游合同基本信息是否填写完整
			downContractFullFlag: true, // 上游合同新增合同详情是否填写完整
			editTradeContractList: [],
			editUpContractList: [],
			editDownContractList: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
		};
	},
	props: ['showEditorRadio', 'editFlag', 'contractInfo', 'noFileName', 'lineId', 'receivalVO'],
	components: {
		Upload
	},

	watch: {
		contractInfo: function (data) {
			// 合同详情数据转成数组格式

			this.dealWithData(data);
		}
	},
	mounted() {
		let data = this.contractInfo;
		this.dealWithData(data);
	},
	methods: {
		moment,
		getTime(value, dateString) {
			// 合同签订日期
			this.baseInfoForm.contractSignTime = dateString;
		},
		getExecTime(value, dateString) {
			// 到期期限
			this.baseInfoForm.execDateStart = dateString[0];
			this.baseInfoForm.execDateEnd = dateString[1];
			this.$forceUpdate();
		},
		getDoubleTime(value, dateString) {
			// 双签日期
			this.doubleTime = value ? value._d : null;
			this.baseInfoForm.doubleSignTime = dateString;
		},
		dealWithData(data) {
			if (data) {
				this.dealWithCommonData(data);
			}
		},
		dealWithCommonData(data) {
			this.upstreamContractDetailData = [];
			let obj = {};
			obj.id = 1;
			obj.goodName = data.upContract.goodName;
			obj.basePrice = data.upContract.basePrice;
			obj.quantity = data.upContract.quantity;
			if (data.upContract.goodsVOList) {
				this.upstreamContractDetailData = data.upContract.goodsVOList;
			} else {
				this.upstreamContractDetailData.push(obj);
			}

			this.downstreamContractDetailData = [];
			let pro = {};
			pro.id = 1;
			pro.goodName = data.downContract.goodsName;
			pro.basePrice = data.downContract.contractPrice;
			pro.quantity = data.downContract.contractQuantity;
			this.downstreamContractDetailData.push(pro);
			this.contractDetailForm = data.downContract;
			this.baseInfoForm = data.downContract;
			this.baseInfoForm.execDate = [moment(data.downContract.execDateStart), moment(data.downContract.execDateEnd)];

			// 编辑附件模块table初始化数据
			if (this.editFlag || this.showEditorRadio) {
				this.editTradeContractList = Object.assign([], data.tradeContract ? data.tradeContract.list : []);
				this.editUpContractList = Object.assign([], data.upContract ? data.upContract.list : []);
				this.editDownContractList = Object.assign([], data.downContract ? data.downContract.list : []);
			}
		},

		getUploadFiles(data, type) {
			// 上传文件 获取附件数据
			this.fileInfos = data;
			// 遍历arr，把元素分别放入tmp数组(不存在才放)
			let tmp = new Array();
			let obj = {};
			if (type == 'CONTRACT_SUPPLEMENT') obj = this.contractInfo.upContract; // 上游合同补充文档
			if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'TERMINAL_CONTRACT_BID_PROOF')
				obj = this.contractInfo.downContract; // 下游合同、下游合同补充文档
			if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') obj = this.contractInfo.tradeContract; // 贸易背景合同

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let sameFlag = true;
			for (var i in data) {
				if (obj && obj.list) {
					obj.list.forEach(item => {
						if (
							item.md5Hex == data[i].md5Hex &&
							item.delFlag == data[i].delFlag &&
							item.name == data[i].name &&
							item.type == data[i].type
						) {
							this.$message.error('同类型的附件不能上传相同的文件');
							sameFlag = false;
						}
					});
				}
			}
			if (!sameFlag) return;
			// 判断相同类型下不可上传文件名相同且内容相同的文件--end
			this.$message.success('添加成功');

			let project = {};
			let list = [];
			for (let i = 0; i < this.fileInfos.length; i++) {
				let element = this.fileInfos[i];
				// 对contractInfo数据进行更新
				if (obj) {
					obj.list.push(element);
				} else {
					list.push(element);
					if (i == this.fileInfos.length - 1) {
						project.list = list;
						if (obj) {
							obj = project;
						} else {
							if (type == 'CONTRACT_SUPPLEMENT') this.contractInfo.upContract = project;
							if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'TERMINAL_CONTRACT_BID_PROOF')
								this.contractInfo.downContract = project;
							if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') this.contractInfo.tradeContract = project;
						}
					}
				}
				// 对编辑模块数据进行更新
				if (this.editFlag) {
					if (type == 'CONTRACT_SUPPLEMENT') {
						this.editUpContractList.push(element);
					}
					if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'TERMINAL_CONTRACT_BID_PROOF') {
						this.editDownContractList.push(element);
					}
					if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
						this.editTradeContractList.push(element);
					}
				}
			}
		},
		deleteFiles(items) {
			// 删除附件
			let arr = [];
			let changeArr = [];
			if (items.type == 'CONTRACT_SUPPLEMENT') {
				// 上游合同补充文档
				arr = this.contractInfo.upContract.list;
				changeArr = this.editUpContractList;
			}
			if (
				items.type == 'TERMINAL_CONTRACT' ||
				items.type == 'TERMINAL_CONTRACT_SUPPLEMENT' ||
				items.type == 'TERMINAL_CONTRACT_BID_PROOF'
			) {
				// 下游合同、下游合同补充文档、中标佐证
				arr = this.contractInfo.downContract.list;
				changeArr = this.editDownContractList;
			}
			if (items.type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
				// 贸易背景合同
				arr = this.contractInfo.tradeContract.list;
				changeArr = this.editTradeContractList;
			}
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					index = _index;
				}
			});
			changeArr.splice(index, 1);
			arr.forEach((element, index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		onSubmit() {
			// 整体提交
			if (this.editFlag) {
				if (this.$refs.baseInfoForm) {
					this.$refs.baseInfoForm.validate(valid => {
						//提交下游合同基本信息
						this.downContractInfoFlag = valid;
					});
				}
				if (this.$refs.contractDetailForm) {
					this.$refs.contractDetailForm.validate(valid => {
						//提交编辑的下游合同详情
						this.downContractFullFlag = valid;
					});
				}

				if (!this.downContractInfoFlag || !this.downContractFullFlag) return;
			}
			var warehouseContractList =
				this.contractInfo.warehouseContract && this.contractInfo.warehouseContract.list
					? this.contractInfo.warehouseContract.list
					: [];
			return {
				...this.contractInfo,
				list: [...this.contractInfo.downContract.list, ...warehouseContractList]
			};
		},
		goSteelStorageContract() {
			this.$router.push({
				path: '/center/steelStorage/warehouse/detail',
				query: {
					type: 'edit',
					id: this.contractInfo.warehouseContract.id
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	& > div {
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}

		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}

		.divider {
			background: #f4f5f8;
			height: 1px;
			margin-top: 0;
		}

		.content {
			padding: 15px;

			& > div {
				.row {
					height: 59px;
					margin-bottom: 0;

					::v-deep.ant-form-item-label {
						text-align: left;
					}

					.ant-form-item-children em {
						position: absolute;
						right: -20px;
					}

					::v-deep.ant-table-fixed-columns-in-body {
						text-align: left;
					}
				}

				& > .ant-row .ant-col .ant-row .ant-col:nth(1) {
					color: #6b6f76;
				}

				& > .ant-row .ant-col .ant-row .ant-col:odd {
					color: #383a3f;
				}

				p {
					font-family: PingFangSC-Medium;
					color: #383a3f;
					text-align: left;
					line-height: 18px;
					margin: 15px 0;
				}

				& > .ant-row {
					margin: 15px 0;

					.ant-col .ant-row .ant-col {
						margin-bottom: 3px;
					}

					.ant-col .ant-row .ant-col:first-child {
						color: #6b6f76;
					}

					.ant-col .ant-row .ant-col:last-child {
						color: #383a3f;
					}
				}
			}
		}
	}

	.doubleSign {
		color: #00ae9d !important;
	}

	.singleSign {
		color: #ff9726 !important;
	}

	.red {
		color: #f24e4d !important;
	}

	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}

		th {
			padding: 10px 12px;
		}

		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}

	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		display: inline-block;
		margin-right: 15px;
	}

	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
