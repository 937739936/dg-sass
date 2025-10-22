<template>
	<div class="contentBox">
		<div
			class="content"
			v-if="otherInfo"
		>
			<p class="title">其他材料信息</p>
			<p class="sub-title">附件信息</p>
			<!-- 编辑模块 -->
			<template v-if="editFlag">
				<Upload
					v-if="assetsConfig.OTHER_INFO_AGENT_CERTIFICATION"
					@uploadFiles="getUploadFiles"
					type="PAYMENT_AGENT_CERTIFICATION"
					btnText="上传代发证明"
					:receivalVO="receivalVO"
				></Upload>
				<Upload
					v-if="assetsConfig.OTHER_INFO_SETTLEMENT_LETTER"
					@uploadFiles="getUploadFiles"
					type="PAYMENT_ENTRUSTED_SETTLEMENT_LETTER"
					btnText="上传委托结算函"
					:receivalVO="receivalVO"
				></Upload>
				<div
					class="category-upload-btn"
					v-if="assetsConfig.OTHER_INFO_MARGIN_PAYMENT_VOUCHER"
				>
					<a-button
						type="primary"
						ghost
						@click="open"
						>上传保证金支付凭证</a-button
					>
				</div>
				<Upload
					v-if="assetsConfig.OTHER_INFO_QUANTITY_PRICE_CONFIRM_LETTER"
					@uploadFiles="getUploadFiles"
					type="PAYMENT_LJQE_LETTER"
					btnText="上传量价确认函"
					:receivalVO="receivalVO"
				></Upload>
				<Upload
					v-if="assetsConfig.OTHER_INFO_SECURITY_LETTER"
					@uploadFiles="getUploadFiles"
					type="PAYMENT_DB_LETTER"
					btnText="上传担保函"
					:receivalVO="receivalVO"
				></Upload>

				<Upload
					v-if="assetsConfig.OTHER_INFO_UP_OTHER"
					@uploadFiles="getUploadFiles"
					type="CONTRACT_OTHER_MATERIALS"
					btnText="上传上游其他材料"
					:receivalVO="receivalVO"
				></Upload>
				<Upload
					v-if="assetsConfig.OTHER_INFO_DOWN_OTHER"
					@uploadFiles="getUploadFiles"
					:type="
						otherInfo && otherInfo.isOnlineContract == 1
							? 'TERMINAL_ONLINE_CONTRACT_OTHER_MATERIALS'
							: 'TERMINAL_CONTRACT_OTHER_MATERIALS'
					"
					btnText="上传下游其他材料"
					:receivalVO="receivalVO"
				></Upload>
				<Upload
					v-if="assetsConfig.OTHER_INFO_DOWN_TRANSFER"
					@uploadFiles="getUploadFiles"
					type="ASSET_DOWN_GOODS_TRANSFER_PDF"
					btnText="上传下游货转"
					:receivalVO="receivalVO"
				></Upload>
				<Upload
					v-if="assetsConfig.OTHER_INFO_SHIP_TRACK"
					@uploadFiles="getUploadFiles"
					type="SHIP_TRACK_UPLOAD"
					btnText="上传船运轨迹"
					:receivalVO="receivalVO"
				></Upload>
				<a-button
					v-if="assetsConfig.OTHER_INFO_TRAIN_TRACK"
					type="primary"
					ghost
					@click="updateTrain"
					class="clk-btn"
					>更新铁路轨迹表</a-button
				>
				<a-button
					v-if="assetsConfig.OTHER_INFO_SHIP_TRACK"
					type="primary"
					ghost
					@click="updateShip"
					class="clk-btn"
					>更新船舶轨迹表</a-button
				>
				<div style="margin-top: 5px; margin-bottom: 5px; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持单个上传</div>
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="editFilesColumns"
					:data-source="editFilesList.filter(i => i.delFlag == 0)"
					:scroll="{ x: true }"
					rowKey="index"
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
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） 删除按钮应隐藏-->
					<template
						slot="action"
						slot-scope="action, items"
					>
						<a-space>
							<a
								href="javascript:;"
								@click="viewDepositPaymentDetail(items)"
								v-if="items.type == 'PAYMENT_BZJ_ZF_PJ'"
								>详情</a
							>
							<a-popconfirm
								v-if="!items.locked && items.type != 'DOWN_GOODS_TRANSFER_PDF'"
								title="确定删除该附件?"
								okText="确定"
								cancelText="取消"
								@confirm="() => deleteFiles(items)"
							>
								<a href="javascript:;">删除</a>
							</a-popconfirm>
						</a-space>
					</template>
				</a-table>
			</template>
			<!-- 详情模块 -->
			<template v-if="!editFlag">
				<a-table
					:pagination="false"
					:columns="isHasBZJ() ? editFilesColumns : noFileName ? noFileNameFilesColumns : filesColumns"
					:data-source="filterLockFile(otherInfo.list)"
					:scroll="{ x: true }"
					rowKey="index"
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
							v-if="items.type == 'ASSET_AJXT_MATERIALS'"
							>{{ items.name }}</a
						>
						<a
							:href="items.path"
							target="_blank"
							v-else
							>{{ name }}</a
						>
					</template>
					<template
						slot="action"
						slot-scope="action, items"
						v-if="isHasBZJ()"
					>
						<a
							href="javascript:;"
							@click="viewDepositPaymentDetail(items)"
							v-if="items.type == 'PAYMENT_BZJ_ZF_PJ'"
							>详情</a
						>
					</template>
				</a-table>
			</template>
		</div>
		<DepositPaymentUpload
			ref="depositPaymentUpload"
			@send="updateDataSource"
			:handleType="handleType"
			:orderDetail="receivalVO"
		>
		</DepositPaymentUpload>
	</div>
</template>
<script>
import Upload from '../common/Upload.vue';
import { filterLockFile } from '@/untils/factory.js';
import { API_AssetsUpdateTrain, API_AssetsUpdateShip } from '@/v2/center/assets/api/index.js';
import DepositPaymentUpload from '../DepositPaymentUpload.vue';
import _ from 'lodash';
export default {
	name: 'OtherFiles',
	data() {
		return {
			filterLockFile,
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			noFileNameFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			],
			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			fileInfos: [], // 附件信息
			fileType: '大票', // 默认附件类型为大票
			assetsConfig: {},
			editFilesList: [], // 编辑情况下，附件列表数据
			handleType: 'edit'
		};
	},
	props: ['editFlag', 'otherInfo', 'noFileName', 'receivalVO'],
	components: {
		Upload,
		DepositPaymentUpload
	},
	watch: {
		otherInfo: function (data) {
			this.initData();
		}
	},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			if (this.editFlag) {
				// 编辑情况下，给表格数据初始化
				this.editFilesList = Object.assign([], (this.otherInfo || {}).list || []);
			}
			this.checkAssetsConfig(this.otherInfo);
		},
		getUploadFiles(data, type, mode) {
			// 上传文件 获取附件数据
			this.fileInfos = data;

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let sameFlag = true;
			let obj = { list: this.editFilesList };
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
			this.$message.success('添加成功');
			this.editFilesList.push(data[0]);
		},
		updateTrain() {
			API_AssetsUpdateTrain({ id: this.receivalVO.id }).then(res => {
				if (res.success) {
					if (res.data && res.data.id) {
						this.$message.success('更新成功');
						var index = _.findIndex(this.editFilesList, { type: 'TRAIN_TRACK' });

						if (index != -1) {
							this.editFilesList[index] = res.data;
						} else {
							this.editFilesList.push(res.data);
						}
						this.$forceUpdate();
					} else {
						this.$message.error('暂无更新');
					}
				}
			});
		},
		updateShip() {
			API_AssetsUpdateShip({ id: this.receivalVO.id }).then(res => {
				if (res.success) {
					if (res.data && res.data.id) {
						if (res.data.batchNo) {
							this.$message.error('【' + res.data.batchNo + '】发货时间与收货时间超出船运近一个月查询范围，未能生成船运轨迹截图');
						} else {
							this.$message.success('更新成功');
						}
						var index = _.findIndex(this.editFilesList, { type: 'SHIP_TRACK' });

						if (index != -1) {
							this.editFilesList[index] = res.data;
						} else {
							this.editFilesList.push(res.data);
						}
						this.$forceUpdate();
					} else {
						if (res.data?.batchNo) {
							this.$message.error('【' + res.data.batchNo + '】发货时间与收货时间超出船运近一个月查询范围，未能生成船运轨迹截图');
						} else {
							this.$message.error('暂无更新');
						}
					}
				}
			});
		},
		// 资产包配置
		checkAssetsConfig(data) {
			let list = data.bankProductAssetConfigList || [{}];

			this.assetsConfig.OTHER_INFO_AGENT_CERTIFICATION =
				(_.find(list, { item: 'OTHER_INFO_AGENT_CERTIFICATION' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_SETTLEMENT_LETTER = (_.find(list, { item: 'OTHER_INFO_SETTLEMENT_LETTER' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_UP_OTHER = (_.find(list, { item: 'OTHER_INFO_UP_OTHER' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_DOWN_OTHER = (_.find(list, { item: 'OTHER_INFO_DOWN_OTHER' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_TRAIN_TRACK = (_.find(list, { item: 'OTHER_INFO_TRAIN_TRACK' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_DOWN_TRANSFER = (_.find(list, { item: 'OTHER_INFO_DOWN_TRANSFER' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_SHIP_TRACK = (_.find(list, { item: 'OTHER_INFO_SHIP_TRACK' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_MARGIN_PAYMENT_VOUCHER =
				(_.find(list, { item: 'OTHER_INFO_MARGIN_PAYMENT_VOUCHER' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_QUANTITY_PRICE_CONFIRM_LETTER =
				(_.find(list, { item: 'OTHER_INFO_QUANTITY_PRICE_CONFIRM_LETTER' }) || {}).status == 1;
			this.assetsConfig.OTHER_INFO_SECURITY_LETTER = (_.find(list, { item: 'OTHER_INFO_SECURITY_LETTER' }) || {}).status == 1;

			this.$forceUpdate();
		},
		checkAssetsSubmit(otherInfo) {
			// 暂时去除校验
			// var noNeedCheck = ['OTHER_INFO_DOWN_TRANSFER','OTHER_INFO_DOWN_OTHER']

			// var fileList = otherInfo.list
			// let list = otherInfo.bankProductAssetConfigList || []
			// var obj = {}

			// for (var key in this.assetsConfig) {

			//     var o = _.find(list,{item:key})
			//     if (this.assetsConfig[key] && o.required == 1 && o.assetAttachType) {

			//         if (!fileList.some(i=>i.type == o.assetAttachType && i.delFlag == 0) && !noNeedCheck.includes(o.item)){
			//             obj.errorStr = '其他材料模块-缺少:'+o.itemDesc.replace('上传','')
			//             break
			//         }
			//     }

			// }

			return {};
		},
		deleteFiles(items) {
			// 删除附件
			this.editFilesList[_.findIndex(this.editFilesList, { path: items.path })].delFlag = 1;
		},
		onSubmit() {
			var obj = {
				...this.otherInfo,
				list: this.editFilesList || []
			};
			var checkRes = this.checkAssetsSubmit(obj);
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}

			return obj;
		},
		open() {
			this.handleType = 'edit';
			this.$refs.depositPaymentUpload.open();
		},
		updateDataSource(obj) {
			obj.delFlag = 0;
			this.editFilesList.push(obj);
			this.$forceUpdate();
		},
		viewDepositPaymentDetail(items) {
			this.handleType = 'detail';
			items.handleType = 'detail';
			this.$refs.depositPaymentUpload.editOpen(items);
		},
		// 判断是否存在保证金支付凭证附件
		isHasBZJ() {
			let flag = false;
			if (this.otherInfo.list.length) {
				this.otherInfo.list.forEach(element => {
					flag = flag || element.type === 'PAYMENT_BZJ_ZF_PJ';
				});
			}
			return flag;
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	.content {
		padding: 0 15px;
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		p {
			margin-bottom: 15px;
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
	}
	.clk-btn {
		margin-right: 6px;
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
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
.category-upload-btn {
	display: inline-block;
	margin-right: 8px;
	margin-bottom: 12px;
}
</style>
