<template>
	<a-row class="template">
		<a-row
			type="flex"
			class="title select-template"
		>
			<p>
				{{ label
				}}<span
					v-show="required"
					class="red-sim"
					>（合同提交时，必须填写）</span
				>
			</p>
			<a-button
				v-if="!disabled && !flag"
				style="margin: 0 20px"
				type="primary"
				icon="heart"
				@click.native="
					visible2 = true;
					name = '';
				"
				>收藏</a-button
			>
			<a-button
				v-if="!disabled && !flag"
				type="primary"
				icon="plus-circle"
				@click.native="selectTemplate"
				>选择已有模板</a-button
			>
		</a-row>
		<div
			class="problem"
			v-if="problem && problem.length"
		>
			存在敏感词：{{ problem.join('、') }}
		</div>
		<div id="wangeditor">
			<!--<p v-if="!disabled">请注意段落缩进，每个段落首行需空两个字</p>-->
			<div
				:ref="value"
				style="text-align: left"
			></div>
		</div>
		<div
			class="s-modal"
			v-if="visible"
		>
			<div
				@click.stop
				style="background: #fff; margin-top: 120px"
				@move.stop
			>
				<div
					style="background: #fff; width: 800px"
					class="content"
				>
					<a-row style="width: 80%; margin: 0 auto; margin-top: 20px">
						<a-input
							@change="getTemplateList"
							v-model="params.name"
							placeholder="请输入模板名称"
						></a-input>
					</a-row>
					<a-row v-if="templatList && templatList.length">
						<a-row
							v-for="(items, index) in templatList"
							:key="index"
							style="margin: 10px 0; cursor: pointer"
							@click.native="addTemplateValue(items.content)"
						>
							<h3>
								{{ items.name
								}}<a-button
									style="margin-left: 20px"
									@click.stop="deleteTemplate(items.id, items.name)"
									>删除</a-button
								>
							</h3>
							<a-row v-html="items.content"></a-row>
						</a-row>
						<a-row
							type="flex"
							justify="center"
							style="margin-top: 30px"
						>
							<a-pagination
								:total="total"
								@change="change"
							/>
						</a-row>
					</a-row>
					<a-row
						v-else
						type="flex"
						justify="center"
						style="font-size: 24px; color: #999; padding: 20px 0"
						>暂无数据</a-row
					>
				</div>
				<a-row
					class="btn"
					@click.stop
				>
					<a-button
						type="primary"
						@click="closeTemplateModal"
						>取消</a-button
					>
				</a-row>
			</div>
		</div>

		<div
			class="s-modal"
			v-if="visible2"
			@click="visible2 = false"
		>
			<div
				@click.stop
				style="background: #fff; margin-top: 120px"
				@move.stop
			>
				<a-row
					class="content"
					@click.native.stop
				>
					<a-row>
						<a-input
							style="width: 90%; margin: 0 auto; margin-top: 20px"
							placeholder="请输入模板名称"
							v-model="name"
						></a-input>
					</a-row>
					<a-row class="btn">
						<a-button
							type="primary"
							@click="visible2 = false"
							>取消</a-button
						>
						<a-button
							type="primary"
							style="margin-left: 20px"
							@click="handleOk"
							>确定</a-button
						>
					</a-row>
				</a-row>
			</div>
		</div>
	</a-row>
</template>
<script>
import E from 'wangeditor';
import { API_TEXTTEMPLATELIST, API_SAVETEXTTEMPLATE, API_DELETETEMPLATE } from '@/v2/center/steels/api';
export default {
	data() {
		return {
			visible: false,
			visible2: false,
			params: {
				pageNo: 1,
				pageSize: 10,
				name: '',
				type: 1
			},
			templatList: null,
			total: 1,
			name: '',
			editorContent: '',
			editor: '',
			problem: [],
			isChange: false
		};
	},
	props: [
		'type',
		'value',
		'disabled',
		'flag',
		'defaultValue',
		'getData',
		'contractTemplate',
		'problemList',
		'businessType',
		'required',
		'label'
	],
	computed: {},
	mounted() {
		this.init();
	},

	watch: {
		defaultValue: function (data) {
			this.defaultValue = data;
			this.$nextTick(() => {
				if (this.disabled) {
					this.editor && this.editor.$textElem.attr('contenteditable', false);
				}
				if (this.defaultValue) {
					if(!this.isChange){
						this.editor && this.editor.txt.html(this.defaultValue);
						this.editorContent = this.defaultValue;
						if (this.editor) {
							this.editor.enable(true);
							this.editor.isFocus = false;
						}
					}
					this.isChange = false;
				}
			});
		},
		editorContent(data) {
			this.getData({ value: this.value, data });
		},
		problemList(data) {
			this.problem = [];
			this.editorContent = this.editorContent
				.replace(/<\/?mgc.*?>/g, '')
				.replace(/style="background-color: rgb\(255, 255, 0\);"/g, ''); //每次检测关键词时，清空原有的高亮标签，防止标签多层嵌套
			data.map(item => {
				if (this.editorContent.includes(item)) {
					this.problem.push(item);
					const regExp = new RegExp(item, 'g');
					this.editorContent = this.editorContent.replace(
						regExp,
						`<mgc style="display:inline-block;background-color:yellow">${item}</mgc>`
					);
				}
			});
			this.setEditorContent(this.editorContent);
		}
	},
	methods: {
		init() {
			this.$nextTick(() => {
				this.editor = new E(this.$refs[this.value]);
				this.editor.config.zIndex = 65;
				const replaceBR = html => {
					html = html.replace(/<br>/gi, '<br />');
					html = html.replace(/<\/br>/gi, '');
					html = html.replace(/(\r\n)|(\n)/gi, '<br />');
					return html;
				};
				const parseHTML = html => {
					//删除无用的font节点  必须要创建节点  用$(html)的方式不行
					let parentdiv = $('<div id="testMyDiv" style="display:none"></div>');
					// 删除xml标签
					html = html.replace(/<\/?\w+:[^>]*>/gi, '');

					parentdiv.html(html);

					parentdiv.find('*').each(function (index, ele) {
						if (!$(ele).is('div,p,span,table,br,tr,td,th,thead,tbody,strong,em,del,u,b,ol,ul,li,base,big,col,dd,dt,dl,font')) {
							$(ele).replaceWith('<div>' + $(ele).text() + '</div>');
						}
					});

					// 删除注释节点和空文本节点
					parentdiv
						.contents()
						.filter(function () {
							if (this.nodeType == Node.COMMENT_NODE || this.nodeType == Node.TEXT_NODE) {
								// wps会把一些css样式也拷贝，这里用font-family匹配去除
								var text = $(this).text();
								if (text.indexOf('font-family') > -1) {
									return true;
								}
							}

							return false;
						})
						.remove();

					// 只获取文本
					html = parentdiv.html();

					// 最后把br替换一下

					html = replaceBR(html);

					return html;
				};
				const editHTML = html => {
					//删除无用的font节点  必须要创建节点  用$(html)的方式不行
					let parentdiv = $('<div id="testMyDiv" style="display:none"></div>');

					// 删除xml标签
					html = html.replace(/<\/?\w+:[^>]*>/gi, '');
					// 过滤老数据格式
					if (html.indexOf('style="3D&quot;text-indent:"') > -1) {
						// 把标签的属性都删掉
						var reg = /<([a-zA-Z1-6]+)(\s*[^>]*)?>/g;
						html = html.replace(reg, '<$1>');
					}

					parentdiv.html(html);

					// 把html字符串中table添加一个class
					parentdiv.find('*').each(function (index, ele) {
						$(ele).removeAttr('class');
						if ($(ele).is('table')) {
							$(ele).addClass('rich-table');
						}
						// font换成span
						if ($(ele).is('font')) {
							let defaultColor1 = '#000000';
							let defaultColor2 = '#fff';
							$(ele).replaceWith(
								'<span style="background-color:' +
									($(ele).css('backgroundColor') || defaultColor2) +
									';color:' +
									($(ele).attr('color') || defaultColor1) +
									';">' +
									$(ele).text() +
									'</span>'
							);
						}
					});
					// 删除注释节点和空文本节点
					parentdiv
						.contents()
						.filter(function () {
							if (this.nodeType == Node.COMMENT_NODE || this.nodeType == Node.TEXT_NODE) {
								var text = $(this).text();
								// wps会把一些css样式也拷贝，这里用font-family匹配去除
								if (text.indexOf('font-family') > -1) {
									return true;
								}
							}

							return false;
						})
						.remove();
					html = parentdiv.html();
					// 最后把br替换一下
					html = replaceBR(html);

					return html;
				};
				this.editor.config.onchange = html => {
					this.editorContent = editHTML(html);
					this.isChange = true;
					this.getData({ value: this.value, data: this.editorContent });
				};
				// 处理复制粘贴
				this.editor.config.pasteTextHandle = html => {
					return parseHTML(html);
				};
				// this.editor.config.pasteFilterStyle = true
				this.editor.config.menus = [
					'bold', // 粗体
					// 'fontSize', // 字号
					// 'fontName', // 字体
					'italic', // 斜体
					'underline', // 下划线
					'strikeThrough', // 删除线
					'foreColor', // 文字颜色
					'backColor', // 背景颜色
					// 'link', // 插入链接
					// 'list', // 列表
					// 'indent'
					'justify', // 对齐方式
					// 'quote', // 引用
					// 'emoticon', // 表情
					// 'image', // 插入图片
					'table' // 表格
					// 'code', // 插入代码
					// 'undo', // 撤销
					// 'redo' // 重复
				];
				this.editor.create(); // 创建富文本实例
				setTimeout(() => {
					if (this.disabled) {
						this.editor.$textElem.attr('contenteditable', false);
					}
					if (this.defaultValue) {
						this.editor.txt.html(this.defaultValue);
						this.editorContent = this.defaultValue;
					}
				}, 1000);
			});
		},
		setContentEditStatus(v) {
			this.editor.$textElem.attr('contenteditable', v);
		},

		setEditorContent(v) {
			this.editor.txt.html(v);
			this.editorContent = v;
		},
		// 删除
		deleteTemplate(id, name) {
			const that = this;
			this.$confirm({
				centered: true,
				title: `是否删除名称为：${name}的模板?`,
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_DELETETEMPLATE({ id }).then(res => {
						if (res.code != 200) {
							that.$message.error(res.message);
							return;
						}
						that.$message.success('操作成功');
						that.getTemplateList();
					});
				},
				onCancel() {}
			});
		},
		change(data) {
			this.params.pageNo = data;
			this.getTemplateList();
		},
		addTemplateValue(data) {
			this.editorContent = data;
			this.editor.txt.html(data);
			this.visible = false;
		},
		handleOk() {
			if (!this.editorContent) {
				this.visible2 = false;
				this.$message.error('收藏内容不能为空');
				return;
			}
			if (!this.name) {
				this.visible2 = false;
				this.$message.error('收藏名称不能为空');
				return;
			}
			API_SAVETEXTTEMPLATE({
				name: this.name,
				type: this.type,
				content: this.editorContent
			}).then(res => {
				this.visible2 = false;
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.$message.success('收藏成功');
			});
		},
		selectTemplate() {
			if (this.disabled) return;
			this.visible = true;
			this.getTemplateList();
		},
		getTemplateList() {
			this.params.type = this.type;
			API_TEXTTEMPLATELIST(this.params).then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.templatList = res.result.records;
				this.total = res.result.total;
			});
		},
		closeTemplateModal() {
			this.visible = false;
			this.params = {
				pageNo: 1,
				pageSize: 10,
				name: '',
				type: 1
			};
		}
	}
};
</script>
<style lang="stylus" scoped>
::v-deep .w-e-text table {
  text-align: center;
  color: #000;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  width:100%;
}
::v-deep .w-e-text table td, ::v-deep .w-e-text table th {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
}
::v-deep .w-e-text i {
  font-style:italic;
}
.s-modal
  width 100%
  height 100%
  position fixed
  left 0
  top 0
  background rgba(0,0,0,.4)
  z-index 105
  flex-row(center, flex-start)
  .content
    width 400px
    height auto
    max-height 500px
    overflow-y auto
    background #ffffff
    padding 0 30px
    border-radius 8px
    position relative
  .btn
    width 90%
    margin 20px 0
    flex-row(flex-end, center)
    background #fff
.title
  font-size 18px
  color rgba(0,0,0,0.85)
  font-family PingFangSC-Regular
  margin 30px 0
  p:first-child:before
    content:'';
    height: 20px;
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    top: -1px;
    width: 2px;
    background: @primary-color;
.problem
  color: #E8372B
  margin-bottom 24px
</style>
