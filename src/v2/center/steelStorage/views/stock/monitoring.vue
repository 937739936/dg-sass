<template>
	<div
		class="mySettleList slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>仓库监控查看</span
				>
			</div>
			<div
				style="margin-top: 20px"
				class="form-select"
			>
				<div style="width: 32px">仓库</div>
				<!-- 选择框 -->
				<a-select
					show-search
					style="width: 300px"
					v-model="warehouse"
					placeholder="请选择"
					:disabled="isDisabled"
					@change="search"
					:filter-option="filterOption"
					notFoundContent="暂无数据"
				>
					<a-select-option
						v-for="(items, index) in stockList"
						:key="index"
						:value="items.value"
					>
						{{ items.label }}</a-select-option
					>
				</a-select>
				<!-- <a-button style="margin-left:20px" type="primary" @click="search" v-auth="'steelWarehouse:store:monitor:view'">查询</a-button> -->
			</div>

			<div>
				<div class="line"></div>
				<p style="margin: 10px 0">仓储租赁合同</p>
				<div
					style="margin-top: 20px"
					v-if="storageDetailInfo.warehouseContract.warehouseAbbreviation"
				>
					<div>
						<a-row style="margin-top: 20px">
							<a-col :span="8"
								><span>纸质编号： {{ storageDetailInfo.warehouseContract.paperContractNo }} </span>
							</a-col>
							<a-col :span="8"
								><span>仓库类型：{{ warehouseType[storageDetailInfo.warehouseContract.warehouseType] }} </span>
							</a-col>
							<a-col :span="8"
								><span>
									期限：{{ storageDetailInfo.warehouseContract.startDate }} - {{ storageDetailInfo.warehouseContract.endDate }}
								</span>
							</a-col>
						</a-row>
						<a-row style="margin-top: 20px">
							<a-col :span="8"
								><span>租赁方： {{ storageDetailInfo.warehouseContract.lessor }} </span>
							</a-col>
							<a-col :span="8"
								><span>仓储方： {{ storageDetailInfo.warehouseContract.warehouseParty }} </span>
							</a-col>
							<a-col :span="8"
								><span>仓库简称： {{ storageDetailInfo.warehouseContract.warehouseAbbreviation }} </span>
							</a-col>
						</a-row>
						<a-row style="margin-top: 20px">
							<a-col :span="8"
								><span>租赁联系人： {{ storageDetailInfo.warehouseContract.lessorContacts }} </span>
							</a-col>
							<a-col :span="8"
								><span>租赁方联系电话： {{ storageDetailInfo.warehouseContract.lessorTel }} </span>
							</a-col>
							<a-col :span="8"
								><span>租赁方联系地址： {{ storageDetailInfo.warehouseContract.lessorAddr }} </span>
							</a-col>
						</a-row>
						<a-row style="margin-top: 20px">
							<a-col :span="8"
								><span>仓储方联系人： {{ storageDetailInfo.warehouseContract.warehousePartyContacts }} </span>
							</a-col>
							<a-col :span="8"
								><span>仓储方联系电话： {{ storageDetailInfo.warehouseContract.warehousePartyTel }} </span>
							</a-col>
							<a-col :span="8"
								><span>仓储方联系地址： {{ storageDetailInfo.warehouseContract.warehousePartyAddr }} </span>
							</a-col>
						</a-row>
					</div>
				</div>
				<div
					class="no-data"
					v-else
					style="margin-top: 20px"
				>
					暂无数据
				</div>
			</div>

			<div style="margin-top: 20px">
				<div class="line"></div>
				<p style="margin: 10px 0">监控影像</p>
				<div
					class="main"
					v-if="!showVideo"
				>
					<div
						class="main-video"
						v-for="(item, index) in monitoringList"
						:key="index"
					>
						<div class="video-box">
							<img
								class="img"
								src="@/assets/imgs/monitor.png"
								alt=""
							/>
							<div class="btn">
								<span>{{ index + 1 }}仓西北向东</span>
								<a-button
									style="margin-left: 5px"
									ghost
									@click="toControl(item, index)"
									type="primary"
									>查看</a-button
								>
							</div>
						</div>
					</div>

					<div
						class="no-data"
						v-if="!monitoringList.length"
						style="margin-top: 20px"
					>
						<div>暂无数据</div>
					</div>
				</div>
			</div>
			<div
				v-if="showVideo"
				class="show-video"
			>
				<VideoHls
					:customFullscreenEnter="true"
					ref="videoHls"
					type="video/mp4"
					@change="videoLoaded = true"
					@changeFullScreen="toggle"
					:src="cameraPreviewURLs"
				></VideoHls>
				<div style="height: 100%">
					<div
						class="control-button"
						style="padding: 0"
					>
						<p>
							<span
								@click="exit"
								class="back fr"
								style="cursor: pointer"
								>返回上一级</span
							>
						</p>
					</div>
				</div>
			</div>
			<div
				class="pagination"
				v-if="false"
			>
				<a-pagination
					v-model="paginationInfo.pageNo"
					:pageSize="paginationInfo.pageSize"
					:total="total"
					show-less-items
					@change="changePage"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import { getWarehouseList, getStorageDetail } from '../../api';
import { constractSaveOrSubmit, warehouseContractDetails } from '../../api/warehouse.js';
import VideoHls from '@/v2/components/videoHls/VideoHls.vue';
import { api as fullscreen } from 'vue-fullscreen';
import ENV from '@/v2/config/env';
const filterOption = (input, option) => {
	return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
export default {
	data() {
		return {
			warehouse: '',
			// 仓库列表
			stockList: [],
			// 监控数据
			monitoringList: [],
			paginationInfo: {
				pageNo: 1,
				pageSize: 8
			},
			total: 8,
			warehouseType: {
				1: '仓库',
				2: '站台',
				3: '港口'
			},
			storageDetailInfo: {
				warehouseContract: {}
			},
			fullscreen: false,
			showVideo: false,
			cameraPreviewURLs: '',
			filterOption
		};
	},
	computed: {
		isDisabled() {
			return !!this.$route.query.id;
		}
	},
	mounted() {
		if (this.$route.query.id) {
			this.warehouse = this.$route.query.id;
			this.getStorageDetail();
		}
		this.getStorageList();
	},
	methods: {
		/**选择仓库 */
		changeStock() {},
		search() {
			if (!this.warehouse) {
				this.$message.error('请选择仓库');
				return;
			}
			this.getStorageDetail();
		},
		// 获取仓库列表
		// 获取仓库列表
		async getStorageList() {
			const res = await getWarehouseList({});
			const list = res.data || [];
			this.stockList = list.map(el => {
				return {
					value: el.warehouseId,
					label: el.warehouseAbbr
				};
			});
		},
		// 获取仓库详情
		async getStorageDetail() {
			const params = {
				id: this.warehouse
			};
			const res = await warehouseContractDetails(params);
			this.storageDetailInfo = res.data || { warehouseContract: {} };
			if (!this.storageDetailInfo.warehouseContract) {
				this.storageDetailInfo.warehouseContract = {};
			}

			this.monitoringList = [1, 2];
		},
		changePage(value) {
			this.paginationInfo.pageNo = value;
		},
		// 查看
		toControl(item, index) {
			this.showVideo = true;
			let num = index > 1 ? 0 : index;
			const arr = [
				`https://www.shdatalink.com${ENV.BASE_NET}trade-files/20221021/fa0b4871f0444e4587a833512dce1347.mp4`,
				`https://www.shdatalink.com${ENV.BASE_NET}trade-files/20221021/78d0a867b23e4bec9da0393d700b9bf7.mp4`
			];
			this.cameraPreviewURLs = arr[num];
		},
		toggle() {
			fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
				teleport: this.teleport,
				callback: isFullscreen => {
					this.fullscreen = isFullscreen;
				}
			});
		},
		exit() {
			this.showVideo = false;
		}
	},
	components: {
		VideoHls
	}
};
</script>

<style scoped lang="less">
.main {
	display: flex;
	flex-wrap: wrap;
	// justify-content: space-between;
	.img {
		width: 200px;
		height: 200px;
	}
	&-video {
		width: 24%;
		display: flex;
		align-items: center;
	}
}
.video-box {
	border: 1px solid #f5f5f5;
	margin-bottom: 15px;
	.btn {
		display: flex;
		justify-content: flex-end;
		margin: 10px;
		align-items: center;
	}
}
.show-video {
	height: 600px;
	margin-top: 10px;
	position: relative;
	.control-button {
		width: 90%;
		position: absolute;
		box-sizing: border-box;
		top: 0;
		z-index: 1;
		p {
			width: 100%;
			color: #ffffff;
			line-height: 40px;
			box-sizing: border-box;
			height: 40px;
			// background: #000000;
			overflow: hidden;
			padding: 0 5px;
		}
		.up,
		.down,
		.right,
		.left,
		.zoom-in,
		.zoom-out,
		.pause {
			width: 16px;
			height: 16px;
			margin-left: 20px;
			display: inline-block;
			position: relative;
			top: 3px;
			cursor: pointer;
		}
		.back {
			line-height: 25px;
			padding: 0 18px;
			color: rgba(255, 255, 255, 0.65);
			border: 1px solid rgba(255, 255, 255, 0.65);
			border-radius: 4px;
			position: relative;
			top: 6px;
			cursor: pointer;
			a {
				color: rgba(255, 255, 255, 0.65);
			}
		}
	}
}
.pagination {
	display: flex;
	justify-content: flex-end;
}
.no-data {
	display: block;
	min-height: 200px;
	text-align: center;
	line-height: 200px;
	// box-shadow: 1px 10px 10px #f5f5f5;;
}
.line {
	width: 100%;
	height: 4px;
	background: #f5f5f5;
	margin-top: 20px;
	padding-top: 20px;
}
/deep/ .vjs-progress-control {
	display: none;
}
/deep/ .vjs-current-time {
	display: none;
}
/deep/ .vjs-remaining-time {
	display: none;
}
.form-select:hover {
	border-color: #ced1dd;
}
.form-select.focus {
	border-color: @primary-color;
}
.form-select {
	position: relative;
	display: flex;
	align-items: center;
	background: #fff;
	padding-left: 12px;
	border-radius: 4px;
	color: rgba(0, 0, 0, 0.4);
	border: 1px solid #e5e6eb;
	width: 320px;
	.select {
		flex: 1;
		width: 1%;
		position: relative;
	}
	::v-deep .ant-select-selection {
		border: none;
		box-shadow: none;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		background: #fff;
		line-height: 32px;
		height: 32px;
	}
	::v-deep .ant-select-selection__rendered {
		margin-left: 12px;
		height: 32px;
		line-height: 32px;
	}
	::v-deep .ant-select-arrow {
		color: #c3c3c3;
	}
	::v-deep .anticon-close-circle {
		font-size: 14px;
		position: relative;
		left: -3px;
		top: -1px;
	}
	::v-deep.ant-select-dropdown {
		width: 100% !important;
		left: -0px !important;
	}
	::v-deep.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
		background-color: #e4ebf4 !important;
	}
	::v-deep.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
		background-color: #f3f5f6 !important;
	}
	::v-deep.ant-select-dropdown-menu-item-selected {
		background-color: #f3f5f6 !important;
		font-weight: normal !important;
	}
}

::v-deep .ant-input {
	border: none;
	height: 32px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.8);
	&:focus {
		border: none;
		box-shadow: none;
	}
}
input::-webkit-input-placeholder {
	color: #abb3c1;
}
input::-moz-placeholder {
	color: #abb3c1;
}
input:-ms-input-placeholder {
	color: #abb3c1;
}
input::placeholder {
	color: #abb3c1;
}
</style>
