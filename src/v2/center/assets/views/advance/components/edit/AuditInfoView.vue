<template>
	<div class="content">
		<div
			v-if="
				detailData.receivalVO &&
				detailData.receivalVO.status == 'PLATFORM_REJECT' &&
				detailData.auditInfo &&
				detailData.auditInfo.audit &&
				detailData.auditInfo.audit.auditResult != 'PASS'
			"
		>
			<div class="slTitleAssis">审核结果</div>

			<a-row class="row">
				<a-col :span="8">
					<span class="label">审批人员：</span>
					<span class="value">{{ detailData.auditInfo.audit.auditor }}</span>
				</a-col>
				<a-col :span="8">
					<span class="label">审批时间：</span>
					<span class="value">{{ detailData.auditInfo.audit.auditTime }}</span>
				</a-col>
				<a-col :span="8">
					<span class="label">审批结果：</span>
					<span class="red">驳回</span>
				</a-col>
			</a-row>
			<a-row class="row">
				<a-col :span="8">
					<span class="label">驳回原因：</span>
				</a-col>
				<a-col :span="20">
					<span class="value">{{ detailData.auditInfo.audit.auditOpinion }}</span>
				</a-col>
			</a-row>
			<a-row
				class="row"
				v-if="detailData.auditInfo.audit.validateMsg"
			>
				<a-col :span="8">
					<a-space>
						<span class="label"
							>系统校验错误提示<span style="color: var(--primary-color)"
								>({{ detailData.auditInfo.audit.validateMsg.length }})：</span
							></span
						>
						<span v-if="detailData.auditInfo.audit.validateMsg.length > 10">
							<a-icon
								type="caret-up"
								style="color: var(--primary-color)"
								v-show="validateMsgHideShowMIn"
								@click="validateMsgHideShowMIn = false"
							/>
							<a-icon
								type="caret-down"
								style="color: var(--primary-color)"
								v-show="!validateMsgHideShowMIn"
								@click="validateMsgHideShowMIn = true"
							/>
						</span>
					</a-space>
				</a-col>
				<a-col :span="20">
					<div
						v-for="(its, i) in detailData.auditInfo.audit.validateMsg.slice(0, validateMsgHideShowMIn ? undefined : 10)"
						:key="i"
					>
						<span class="value">{{ its }}</span>
					</div>
				</a-col>
			</a-row>
		</div>
		<!-- 只显⽰当前“融资失败”且已批注的批注信息-->
		<div
			v-if="
				detailData.receivalVO &&
				detailData.receivalVO.status == 'COMMENTED' &&
				detailData.commentInfo &&
				detailData.commentInfo.comment
			"
		>
			<h2>批注信息</h2>
			<a-row>
				<a-col :span="4">批注人</a-col>
				<a-col :span="20">{{ detailData.commentInfo.comment.commenter }}</a-col>
			</a-row>
			<a-row>
				<a-col :span="4">批注时间</a-col>
				<a-col :span="20">{{ detailData.commentInfo.comment.createDate }}</a-col>
			</a-row>
			<a-row>
				<a-col :span="4">批注信息</a-col>
				<a-col :span="20">{{ detailData.commentInfo.comment.remark }}</a-col>
			</a-row>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		detailData: {
			type: Object,
			default: undefined
		}
	},
	data() {
		return {
			validateMsgHideShowMIn: false
		};
	}
};
</script>

<style lang="less" scoped>
.content {
	.slTitleAssis {
		margin-bottom: 20px;
	}
	// .row {
	// 	padding: 5px 0;
	// }
	.label {
		line-height: 30px;
		color: rgba(0, 0, 0, 0.4);
	}
	.value {
		color: rgba(0, 0, 0, 0.8);
		word-wrap: break-word;
	}
	.red {
		font-size: 12px;
		border-radius: 5px;
		padding: 1px 6px;
		background-color: rgba(242, 208, 208, 1);
		color: rgba(221, 68, 68, 1);
	}
}
</style>
