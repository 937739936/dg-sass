<template>
	<div>
		<div class="s-title">
			<span>新增采购合同关联</span>
		</div>
		<RelationTemp
			type="buy"
			@detail="getInfo"
		></RelationTemp>
		<RelationTemp
			type="sell"
			@detail="getInfo2"
		></RelationTemp>
		<div>
			<div
				class="warning-tips"
				v-if="relWaringTips.length > 0"
			>
				<p>你所选的采销合同可能存在以下问题，如果你确定要继续关联，请忽略以下提示：</p>
				<ul>
					<li
						v-for="(item, index) in relWaringTips"
						:key="index"
					>
						{{ item }}
					</li>
				</ul>
			</div>
		</div>
		<a-row
			type="flex"
			justify="center"
			style="margin: 50px 0"
		>
			<a-button
				type="primary"
				@click.native="$router.go(-1)"
				>返回</a-button
			>
			<a-button
				type="primary"
				style="margin-left: 10px"
				@click="save"
				:loading="loading"
				>提交</a-button
			>
		</a-row>
	</div>
</template>

<script>
import RelationTemp from './components/RelationTemp';
import { API_SteelsSaveRelationContract, checkContractBinding } from '@/v2/center/steels/api/contract.js';
export default {
	data() {
		return {
			info: {
				contractNo: '',
				upContractNo: ''
			},
			relWaringTips: [], // 关联合同的警告提示
			relWaringTips2: [], // 关联合同的警告提示
			loading: false
		};
	},
	methods: {
		save() {
			if (!this.info.contractNo) {
				this.$message.error('请选择采购合同');
				return;
			}
			if (!this.info.upContractNo) {
				this.$message.error('请选择销售合同');
				return;
			}
			const params = {
				...this.info
			};
			this.loading = true;
			API_SteelsSaveRelationContract(params)
				.then(res => {
					if (res.success) {
						this.$message.success('操作成功');
						this.$router.go(-1);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getInfo(data) {
			this.info.upContractNo = data.contractNo;
			this.info.upContractId = data.id;
			this.checkBinding();
		},
		getInfo2(data) {
			this.info.contractNo = data.contractNo;
			this.info.downContractId = data.id;
			this.checkBinding();
		},
		// 检测关联
		async checkBinding(contractNo) {
			if (!this.info.contractNo || !this.info.upContractNo) {
				return;
			}
			const params = {
				...this.info
			};
			const res = await checkContractBinding(params);
			this.relWaringTips = res.data;
		}
	},
	components: {
		RelationTemp
	}
};
</script>

<style scoped lang="less">
.df {
	display: flex;
}
.aic {
	align-items: center;
}
.warning-tips {
	color: #fc8002;
	padding: 0 30px 20px 30px;
	p {
		margin: 15px 0px;
	}
	ul {
		li {
			line-height: 28px;
			padding: 0 15px;
			list-style: inside;
		}
	}
}
</style>
