<template>
	<a-modal
		title="查看证书"
		width="60%"
		:visible="visible"
		:confirmLoading="confirmLoading"
		okText="确定"
		cancelText="取消"
		@ok="
			() => {
				this.visible = false;
			}
		"
		@cancel="
			() => {
				this.visible = false;
			}
		"
	>
		<div>
			<p>基本信息</p>
			<a-row class="row">
				<a-col
					class="flex-box"
					:span="8"
				>
					<div class="name">颁发机构</div>
					<div class="value">中国金融认证中心CFCA</div>
				</a-col>
				<a-col
					class="flex-box"
					:span="8"
				>
					<div class="name">公司名称</div>
					<div class="value">
						{{ data.companyName }}
					</div>
				</a-col>
				<a-col
					class="flex-box"
					:span="8"
				>
					<div class="name">签章员</div>
					<div class="value">
						{{ data.signerName }}
					</div>
				</a-col>
			</a-row>

			<template v-if="data.certList.length > 0">
				<a-table
					rowKey="id"
					:columns="columns"
					:dataSource="data.certList"
					:pagination="false"
					:defaultExpandAllRows="true"
					:locale="{ emptyText: '暂无数据' }"
					:scroll="{ x: true }"
				>
					<template
						slot="time"
						slot-scope="time, record"
					>
						<span>{{ record.startTime }}~{{ record.slEndTime }}</span>
					</template>
				</a-table>
			</template>
			<div style="margin-top: 20px">
				<div
					class="seal"
					v-for="(i, index) in data.sealList"
					:key="index"
				>
					<div>
						<img :src="`data:image/png;base64,${i.sealImg}`" />
					</div>
					<p>{{ i.sealName }}</p>
				</div>
			</div>
		</div>
	</a-modal>
</template>
<script>
import ENV from 'api/env.js';
const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		customRender(t, r, index) {
			return parseInt(index) + 1;
		},
		width: 70
	},
	{ title: '证书DN', dataIndex: 'dn', key: 'dn' },
	{ title: '序列号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '证书有效期', dataIndex: 'time', key: 'time', scopedSlots: { customRender: 'time' }, width: 320 },
	{ title: '签章方式', dataIndex: 'certModelText', key: 'certModelText', width: 120 },
	{ title: '状态', dataIndex: 'statusText', key: 'statusText', width: 80 }
];
export default {
	name: 'CertDetail',

	data() {
		return {
			confirmLoading: false,
			visible: false,
			companyInfo: {},
			BASE_NET: ENV.BASE_NET,
			data: {
				certList: [],
				sealList: []
			},
			certApplyId: '',
			columns
		};
	},
	methods: {
		showModal(data) {
			this.visible = true;
			this.data = data;
		}
	}
};
</script>
<style lang="less" scoped>
p {
	color: #383a3f;
	line-height: 32px;
	padding-bottom: 10px;
	font-weight: 600;
}
.row {
	padding-bottom: 22px;
}
.flex-box {
	display: flex;
	> div {
		padding-right: 10px;
		color: #6b6f76;
		line-height: 18px;
	}
	.name {
		width: 80px;
	}
	.value {
		flex: 1;
		color: #383a3f;
	}
}
.seal {
	display: inline-block;
	margin-right: 25px;
	> div {
		width: 136px;
		height: 136px;
		padding: 20px;
		border: 1px solid #eeeeee;
		border-radius: 8px;
		margin: auto;
	}
	img {
		width: 100%;
		height: 100%;
	}
	p {
		text-align: center;
		color: #383a3f;
		font-weight: normal;
	}
}
</style>
