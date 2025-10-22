<template>
	<a-modal
		title="区块详情"
		:width="920"
		class="slModal"
		:visible="showBlock"
		:footer="false"
		@cancel="handleCancel"
	>
		<div class="tabs">
			<div
				v-for="item in tabList"
				:key="item.value"
				:class="[activeValue == item.value ? 'active' : '']"
				@click="changeTab(item.value)"
			>
				{{ item.label }}
			</div>
		</div>
		<div
			class="area"
			v-if="activeValue == 1"
		>
			<div class="title">
				交易信息
			</div>
			<div class="area-content">

				<div class="area-content-item">
					<span>交易id：</span>
					<span >{{ detailData.transactionId }}</span>
				</div>
				<div class="area-content-item">
					<span>交易时间：</span>
					<span>{{ detailData.transactionTime }}</span>
				</div>
				<div class="area-content-item">
					<span>合约名称：</span>
					<span>{{ detailData.chaincode }}</span>
				</div>
				<div class="area-content-item">
					<span>区块编号：</span>
					<span>{{ detailData.blockNum }}</span>
				</div>
				<div class="area-content-item">
					<span>交易所在位置：</span>
					<span>{{ detailData.transactionIndex }}</span>
				</div>
				<div  class="area-content-item" style="margin-bottom:0">
					<span	>机构信息：</span>
					<a-button class="btn" type='ghost' @click="downloadFile">  
						<img src="@sub/assets/download.png" alt="" style="width:14px">
						<i style="margin-left:5px">点击下载</i>
					</a-button>
				</div>
			</div>

			<div  class="title" style="margin-top:20px">
				区块信息
			</div>
			<div class="area-content">
				<div  class="area-content-item">
					<span>区块高度：</span>
					<span>{{ detailData.blockHeight }}</span>
				</div>
				<div  class="area-content-item">
					<span>区块编号：</span>
					<span>{{ detailData.blockNum }}</span>
				</div>
				<div  class="area-content-item">
					<span>出块时间：</span>
					<span>{{ detailData.blockTime }}</span>
				</div>
				<div  class="area-content-item">
					<span>交易数：</span>
					<span>{{ detailData.transactionNum }}</span>
				</div>
				<div  class="area-content-item">
					<span>当前区块hash：</span>
					<span>{{ detailData.blockHash }}</span>
				</div>
				<div  class="area-content-item" style="margin-bottom:0"> 
					<span>前一区块hash：</span>
					<span>{{ detailData.preBlockHash }}</span>
				</div>
			</div>
		</div>
		<div
			class="json-wrap"
			v-if="activeValue == 2"
		>
			<json-view
				theme="one-dark"
				:data="JSON.parse(detailData.content || '{}')"
			></json-view>
		</div>
	</a-modal>
</template>

<script>
import jsonView from 'vue-json-views';
import comDownload from '@sub/utils/comDownload';
export default {
	props: {
		chainDetailApi: {},
		downBlockChainCer: {}
	},
	name: 'blockChain',
	components: {
		jsonView
	},
	mounted() {},
	data() {
		return {
			showBlock: false,
			activeValue: 1,
			detailData: {},
			tabList: [
				{ value: '1', label: '区块信息' },
				{ value: '2', label: '上链业务数据' }
			],
			id: ''
		};
	},
	methods: {
		showById(id) {
			this.getDataById(id);
			this.id = id
			this.showBlock = true;
		},
		changeTab(value) {
			this.activeValue = value;
		},
		async getDataById(id) {
			const res = await this.chainDetailApi({id})
			this.detailData = res.result|| {}
		},
		handleCancel() {
			this.showBlock = false;
		},

		async downloadFile() {

			const res = await this.downBlockChainCer({channel: 'trade',transactionId:this.id })
		 comDownload(res, null, 'org.cer');
		}
	},
};
</script>

<style scoped lang="less">
.json-wrap {
	overflow: auto;
	height: 378px;
	border-radius: 4px;
}
/deep/ .ant-modal-content {
	height: 520px;
}
.tabs {
	height: 32px;
	padding: 4px 8px 4px 8px;
	gap: 8px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	display: inline-block;
	margin-bottom: 20px;
	div {
		display: inline-block;
		width: 148px;
		text-align: center;
		border-radius: 2px;
		cursor: pointer;
		&.active {
			background: @primary-color;
			color: #fff;
			border-radius: 2px;
		}
	}

	// justify-content: center;
}
.area {
	// height: 520px;
	height: 378px;
	overflow: auto;
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500px;
		margin-bottom: 20px;
	}
	&-content {
		background: #F5F7FE;
		border-radius: 4px;
		padding: 20px;
	}
	.area-content-item {
		margin-bottom: 20px;
		span:first-child {
			color: rgba(0, 0, 0, 0.4);
		}
		span:last-child {
			color: rgba(0, 0, 0, 0.8);
		}
	}
	.btn {
		color: @primary-color;
		border: 1px solid @primary-color;
		height: 28px;
		line-height: 28px;
		display: inline-flex;
		align-items: center; 
	}
}
.json-wrap {
	border-radius: 4px;
	background: #000;
	padding: 0 1px;
}
</style>
