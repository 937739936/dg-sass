<template>
	<div class="receive-change-platform-info">
		<a-modal
			v-model="platformInfoChangeVisible"
			title="变更发货信息"
			@cancel="platformInfoChangeVisible = false"
			:footer="null"
		>
			<a-form-model
				v-if="platformInfoChangeVisible"
				:model="form"
				:rules="rules"
				ref="formModel"
				labelAlign="left"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<a-form-model-item label="发货平台">
					<a-input
						disabled
						v-model="form.platformTypeName"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="ownerName"
					label="客户名称"
				>
					<a-select
						v-model="form.ownerName"
						show-search
						placeholder="请输入发货平台中的客户名称"
						:default-active-first-option="false"
						:show-arrow="false"
						:not-found-content="ownerFetching ? undefined : '暂无数据'"
						@change="getCompanyListByQCC"
						@select="handleOwnerNameSelect"
						@focus="getCompanyListByQCC"
						@search="getCompanyListByQCC"
					>
						<a-spin
							v-if="ownerFetching"
							slot="notFoundContent"
							size="small"
						/>
						<a-select-option
							v-for="item in ownerNameList"
							:key="item.name"
							>{{ item.name }}</a-select-option
						>
					</a-select>
					<!--<a-input placeholder="请填写发货平台中的客户名称，填写全称" v-model="form.ownerName" />-->
				</a-form-model-item>
				<a-form-model-item
					v-if="form.platformType != '2'"
					prop="publishNum"
					label="货源单号"
				>
					<a-input
						placeholder="请输入发货平台中的货源单号"
						v-model="form.publishNum"
					/>
				</a-form-model-item>
				<a-form-model-item
					v-else
					prop="publishName"
					label="货源名称"
				>
					<a-select
						v-model="form.publishName"
						show-search
						placeholder="请输入发货平台中的货源名称"
						:not-found-content="nameFetching ? undefined : '暂无数据'"
						:default-active-first-option="false"
						@change="handleGoodsSourceFilter"
						@search="handleGoodsSourceFilter"
						@select="handleGoodsSourceChange"
					>
						<a-spin
							v-if="nameFetching"
							slot="notFoundContent"
							size="small"
						/>
						<a-select-option
							v-for="item in goodsSourceList"
							:key="JSON.stringify(item)"
							>{{ item.goodsSourceName }}</a-select-option
						>
					</a-select>
				</a-form-model-item>
			</a-form-model>
			<div class="btn-wrap">
				<a-button @click="platformInfoChangeVisible = false">取消</a-button>
				<a-button
					type="primary"
					@click="handleConfirm"
					>确定</a-button
				>
			</div>
		</a-modal>
	</div>
</template>
<script>
import {
	API_getCommonGetCompanyDetailFromQichacha,
	API_getDeliverListGoodsSourceByCompanyName,
	API_postDeliverUpdatePublishNum
} from '@/v2/center/trade/api/receive';
export default {
	name: 'ReceiveChangePlatformInfo',
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 批次号
		deliverId: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
			form: {
				platformTypeName: '',
				publishNum: '',
				ownerName: '',
				publishName: '',
				platformType: ''
			},
			rules: {
				publishNum: [{ required: true, message: '请输入发货平台中的货源单号', trigger: ['blur', 'change'] }],
				ownerName: [{ required: true, message: '请输入货源单号对应的客户名称', trigger: ['blur', 'change'] }],
				publishName: [{ required: true, message: '请选择货源单号对应的货源名称', trigger: ['blur', 'change'] }]
			},
			platformInfoChangeVisible: false, // 变更平台信息弹框是否可见
			goodsSourceList: [], // 客源名称arr
			goodsSourceListCache: [], // 客源名称arr
			currentGoodsSource: {},
			ownerFetching: false,
			ownerTimer: null,
			nameFetching: false,
			nameTimer: null,
			ownerNameList: [] // 客户名称arr
		};
	},
	methods: {
		init() {
			this.platformInfoChangeVisible = true;
			this.form = {
				platformTypeName: this.detail.platformTypeName,
				publishNum: this.detail.publishNum,
				ownerName: this.detail.ownerName,
				platformType: this.detail.platformType,
				publishName: this.detail.publishName
			};
			this.getCompanyName();
			this.getCompanyListByQCC(this.form.ownerName);
		},
		// 获取货源名称
		getCompanyName() {
			if (this.form.platformType != '2') return false;
			if (!this.form.ownerName) {
				this.$message.error('请输入发货平台中的客户名称');
				return false;
			}
			API_getDeliverListGoodsSourceByCompanyName({
				companyName: this.form.ownerName
			}).then(resp => {
				if (resp.success) {
					this.goodsSourceList = resp.result || [];
					this.goodsSourceListCache = resp.result || [];
					this.currentGoodsSource = {};
					// if (this.form.publishNum) {
					//   this.handleGoodsSourceChange(this.form.publishNum)
					// }
					if (this.goodsSourceList.length === 0) this.clearGoodsSource();
				} else {
					this.goodsSourceList = [];
					this.goodsSourceListCache = [];
					this.clearGoodsSource();
				}
			});
		},
		// 通过企查查 模糊查询公司名称
		getCompanyListByQCC(name) {
			if (!name && !this.form.ownerName) return false;
			clearTimeout(this.ownerTimer);
			this.ownerFetching = true;
			this.ownerTimer = setTimeout(() => {
				API_getCommonGetCompanyDetailFromQichacha({
					keyword: name || this.form.ownerName
				}).then(resp => {
					this.ownerFetching = false;
					/**
           * [{"creditCode": "913711006138077718",
            "name": "山东鼎新电子玻璃集团有限公司"}]
           */
					if (resp.success) this.ownerNameList = resp.result || [];
				});
			}, 300);
		},
		// 选择客户名称
		handleOwnerNameSelect(val) {
			this.$set(this.form, 'ownerName', val);
			this.getCompanyName();
		},
		// 过滤货源名称
		handleGoodsSourceFilter(val) {
			clearTimeout(this.nameTimer);
			this.goodsSourceList = [];
			this.nameFetching = true;
			this.nameTimer = setTimeout(() => {
				if (val) {
					this.goodsSourceList = this.goodsSourceListCache.filter(item => {
						return item.goodsSourceName.indexOf(val) > -1;
					});
				} else {
					this.goodsSourceList = [].concat(this.goodsSourceListCache);
				}
				this.nameFetching = false;
			}, 300);
		},
		handleGoodsSourceChange(val) {
			let obj = JSON.parse(val);
			this.currentGoodsSource = Object.assign({}, obj);
			this.$set(this.form, 'publishName', this.currentGoodsSource.goodsSourceName);
			this.$set(this.form, 'publishNum', this.currentGoodsSource.goodsSourceId);
			this.handleGoodsSourceFilter();
		},
		// 清空陆港通货源信息
		clearGoodsSource() {
			this.currentGoodsSource = {};
			this.$set(this.form, 'publishName', undefined);
			this.$set(this.form, 'publishNum', undefined);
		},
		// 保存变更信息
		handleConfirm() {
			this.$refs.formModel.validate(valid => {
				if (valid) {
					let params = {
						deliverBatchId: this.deliverId,
						publishNum: this.form.platformType == '2' ? this.form.publishNum : this.form.publishNum,
						ownerName: this.form.ownerName,
						platformType: this.detail.platformType
					};
					API_postDeliverUpdatePublishNum(params).then(resp => {
						if (resp.success) {
							this.platformInfoChangeVisible = false;
							this.$emit('confirm', resp.result || {});
							this.$message.success('变更成功');
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.receive-change-platform-info {
	.btn-wrap {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
}
::v-deep.ant-modal-body {
	padding: 20px 60px 50px 60px;
	.ant-form-item {
		margin-bottom: 14px;
	}
}
</style>
