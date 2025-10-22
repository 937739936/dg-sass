<template>
	<div class="contentBox">
		<div class="content">
			<p class="title">供应商盖章版材料</p>
			<p class="sub-title">附件信息</p>
			<!-- 详情模块 -->
			<template>
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="signAttachInfoVO && signAttachInfoVO.list"
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
							:href="BASE_NET + items.path"
							target="_blank"
							v-if="items.type == 'ASSET_AJXT_MATERIALS'"
							>{{ items.name }}</a
						>
						<a
							:href="BASE_NET + items.path"
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
	</div>
</template>
<script>
import ENV from '@/v2/config/env';
import { filterLockFile } from '@/untils/factory.js';
import { API_AssetsUpdateTrain, API_AssetsUpdateShip } from '@/v2/center/assets/api/index.js';
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
			BASE_NET: ENV.BASE_NET,
			assetsConfig: {},
			editFilesList: [], // 编辑情况下，附件列表数据
			handleType: 'edit'
		};
	},
	props: ['editFlag', 'signAttachInfoVO', 'noFileName', 'receivalVO'],
	components: {},
	// watch: {
	//   'otherInfo': function (data) {
	//     this.initData()
	//   }
	// },
	mounted() {
		// this.initData()
	},
	methods: {
		initData() {
			if (this.editFlag) {
				// 编辑情况下，给表格数据初始化
				this.editFilesList = Object.assign([], (this.otherInfo || {}).list || []);
			}
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
