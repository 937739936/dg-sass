<template>
	<a-row class="template">
		<a-modal
			class="slModal collectModal"
			:visible="selectVisible"
			title="选择已有模板"
			width="816px"
			destroyOnClose
			@cancel="closeTemplete"
			@ok="selectSubmit"
		>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getTemplateList"
				:allowClear="false"
				:isShowIcon="false"
				:colSpan="12"
				:isShowSearchBox="true"
			></SlFormNew>
			<div
				class="templateBox"
				v-if="templatList && templatList.length"
			>
				<div
					v-for="(items, index) in templatList"
					:key="index"
				>
					<div
						:class="'templateItem ' + (activeIndex === index ? 'active' : '')"
						@click="addTemplateValue(index, items.content)"
					>
						<p class="templateTitle">
							{{ items.name }}
							<img
								v-if="activeIndex === index"
								@click.stop="deleteTemplate(items.id, items.name)"
								src="@/v2/assets/imgs/common/trash_white_icon.png"
								alt=""
							/>
							<img
								v-else
								@click.stop="deleteTemplate(items.id, items.name)"
								src="@/v2/assets/imgs/common/trash_icon.png"
								alt=""
							/>
						</p>
						<div
							class="templateText"
							v-html="items.content"
						></div>
						<svg v-if="activeIndex === index"
							class="select_template_icon" version="1.0" xmlns="http://www.w3.org/2000/svg"
							width="44.000000pt" height="44.000000pt" viewBox="0 0 44.000000 44.000000"
							preserveAspectRatio="xMidYMid meet">
							<g transform="translate(0.000000,44.000000) scale(0.100000,-0.100000)"
							fill="var(--primary-color)" stroke="none">
							<path d="M220 215 l-215 -216 191 3 c171 3 194 5 213 22 27 25 33 72 29 254
							l-3 152 -215 -215z m158 -28 c4 -19 -60 -112 -81 -120 -8 -3 -28 6 -45 20 -49
							38 -39 91 11 58 23 -14 25 -14 56 25 33 42 53 47 59 17z"/>
							</g>
						</svg>
					</div>
				</div>

				<div class="pagination-wrap">
					<a-pagination
						:total="total"
						@change="change"
					/>
				</div>
			</div>
			<div
				v-else
				class="no-datas-content"
			>
				<img
					src="@/v2/assets/imgs/contract/no_businessline_bg.png"
					alt=""
					style="width: 66px"
				/>
				<p class="label">暂无数据</p>
			</div>
		</a-modal>

		<a-modal
			class="slModal"
			:visible="collectVisible"
			title="收藏模版"
			width="408px"
			@cancel="close"
			@ok="handleOk"
		>
			<a-form
				class="slFormDetail"
				:form="form"
			>
				<a-form-item label="模板名称">
					<a-input
						placeholder="请输入模板名称"
						autocomplete="off"
						v-decorator="[
							`name`,
							{
								rules: [
									{
										required: true,
										message: `请输入模板名称`
									}
								]
							}
						]"
					>
					</a-input>
				</a-form-item>
			</a-form>
		</a-modal>

		<a-modal
			class="slModal confirmModal"
			:visible="visible"
			title=""
			width="352px"
			@cancel="
				() => {
					this.visible = false;
				}
			"
			@ok="deltet"
		>
			<a-row
				gutter="12"
				type="flex"
			>
				<a-col flex="16px">
					<a-icon
						type="exclamation-circle"
						theme="filled"
						style="color: @primary-color;; font-size: 16px"
					/>
				</a-col>
				<a-col flex="1">
					<span>是否删除名称为：{{ templateName }}的模板?</span>
				</a-col>
			</a-row>
		</a-modal>
	</a-row>
</template>
<script>
const searchList = [
	{
		decorator: ['name'],
		addonBeforeTitle: '模板名称',
		type: 'input',
		placeholder: '请输入模板名称'
	}
];
import { API_TEXTTEMPLATELIST, API_SAVETEXTTEMPLATE, API_DELETETEMPLATE } from '@/v2/api/common';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
export default {
	data() {
		return {
			form: this.$form.createForm(this),
			selectVisible: false,
			collectVisible: false,
			searchList,
			type: '', // 模版类型数字
			editorContent: '', // 富文本编辑器内容
			selected: false,
			activeIndex: '',
			visible: false,
			templateName: '',
			params: {
				pageNo: 1,
				pageSize: 10,
				name: '',
				type: 1
			},
			total: 1,
			templatList: []
		};
	},
	components: {
		SlFormNew
	},
	mounted() {},
	methods: {
		collect(type, content) {
			this.type = type;
			this.editorContent = content;
			this.collectVisible = true;
		},
		select(type, content) {
			this.type = type;
			this.editorContent = content;
			this.selectVisible = true;
			this.activeIndex = '';
			this.getTemplateList();
		},
		closeTemplete() {
			this.activeIndex = '';
			this.editorContent = '';
			this.selectVisible = false;
		},
		close() {
			this.collectVisible = false;
			this.form.resetFields();
		},
		// 删除模板
		deltet(id, name) {
			API_DELETETEMPLATE({ id }).then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.$message.success('操作成功');
				this.getTemplateList();
			});
		},
		deleteTemplate(id, name) {
			this.$confirm({
				centered: true,
				title: `是否删除名称为：${name}的模板?`,
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_DELETETEMPLATE({ id }).then(res => {
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('操作成功');
						this.getTemplateList();
					});
				},
				onCancel: () => {}
			});
		},
		change(data) {
			this.params.pageNo = data;
			this.getTemplateList();
		},
		addTemplateValue(index, data) {
			this.activeIndex = index;
			this.editorContent = data;
			// this.$emit('showContent',this.editorContent)
		},
		selectSubmit() {
			if (!this.editorContent) {
				this.$message.error('请选择已有模板');
				return;
			}
			this.$emit('showContent', this.editorContent);
			this.selectVisible = false;
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					if (!this.editorContent) {
						this.$message.error('收藏内容不能为空');
						return;
					}
					API_SAVETEXTTEMPLATE({
						name: values.name,
						type: this.type,
						content: this.editorContent
					}).then(res => {
						this.collectVisible = false;
						this.form.resetFields();
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('收藏成功');
					});
				}
			});
		},
		selectTemplate() {
			if (this.disabled) return;
			this.selectVisible = true;
			this.getTemplateList();
		},
		getTemplateList(params = {}) {
			this.params.type = this.type;
			this.params.name = params?.name;
			API_TEXTTEMPLATELIST(this.params).then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.templatList = res.result.records;
				this.total = res.result.total;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slFormDetail {
	padding: 0;
}
.search-box {
	margin-top: 0;
}
.slModal.collectModal {
	::v-deep.ant-modal-body {
		padding-top: 18px;
	}
}
.no-datas-content {
	text-align: center;
	margin: 30px 0 18px 0;
	p {
		color: rgba(0, 0, 0, 0.24995);
		margin-top: 12px;
	}
}
.templateBox {
	cursor: pointer;
	.templateItem {
		width: 100%;
		background: #ffffff;
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		margin-top: 30px;
		position: relative;
		.templateTitle {
			width: 100%;
			height: 40px;
			background: #f3f5f6;
			border-radius: 3px 3px 0px 0px;
			padding: 10px 14px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: #77889d;
			line-height: 20px;
			img {
				float: right;
				width: 14px;
				height: 14px;
				position: relative;
				top: 2px;
			}
		}
		.templateText {
			width: 100%;
			padding: 12px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 20px;
		}
		.select_template_icon {
			position: absolute;
			right: -1px;
			bottom: -1px;
			width: 22px;
			height: 22px;
		}
	}
	.templateItem.active {
		border-color: @primary-color;
		.templateTitle {
			background-color: @primary-color;
			color: #fff;
		}
	}
}
::v-deep.ant-modal-confirm-body-wrapper {
	i {
		display: none;
	}
}
.pagination-wrap {
	width: 100%;
	height: 32px;
	margin-top: 20px;
	padding: 0;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
