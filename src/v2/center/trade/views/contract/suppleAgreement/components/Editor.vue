<template>
	<div>
		<div id="wangeditor">
			<!-- 工具栏 -->
			<Toolbar
				class="toolbar"
				:editor="editor"
				:defaultConfig="toolbarConfig"
			/>
			<!-- 编辑器 -->
			<Editor
				style="height: 400px; overflow-y: hidden"
				:defaultConfig="editorConfig"
				v-model="html"
				@onChange="onChange"
				@onCreated="onCreated"
				@onBlur="onBlur"
			/>
		</div>
		<div :id="id"></div>
	</div>
</template>

<script>
import { Editor, Toolbar, SlateEditor, SlateElement, SlateNode } from '@wangeditor/editor-for-vue';
const filterHtmlImgTag = /<img(?:.|\s)*?>/gi;
const filterHtmlVideoTag = /<video(?:.|\s)*?>/gi;

export default {
	name: 'MyEditor',
	props: ['content', 'placeholder', 'id', 'sensitiveWordsList'],
	components: { Editor, Toolbar },
	data() {
		return {
			editor: null,
			html: '',
			toolbarConfig: {
				// toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
				excludeKeys: [
					'wangeditor-uploaded-image',
					'insertVideo',
					'uploadVideo',
					'insertImage',
					'uploadImage',
					'todo',
					'redo',
					'undo',
					'imageWidth30',
					'lineHeight',
					'fontFamily'
				]
			},
			editorConfig: {
				placeholder: '请输入' + this.placeholder,
				// autoFocus: false,
				// 所有的菜单配置，都要在 MENU_CONF 属性下
				MENU_CONF: {}
			},
			htmlContent: null
		};
	},
	watch: {
		content: {
			handler(val) {
				if (val && this.editor) {
					this.editor.setHtml(val);
				}
			},
			immediate: true,
			deep: true
		},
		sensitiveWordsList: {
			handler(val) {
				const list = val?.split('，');
				if (val && list?.length) {
					this.$nextTick(() => {
						this.marksensitiveWords(list);
					});
				} else {
					this.$nextTick(() => {
						this.marksensitiveWords([]);
					});
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		// 标记敏感词
		marksensitiveWords(list) {
			if (this.editor) {
				let content = this.editor.getHtml();
				content = content.replace(/<\/?span.*?>/g, '').replace(/style="background-color: rgb\(255, 255, 0\);"/g, '');
				list.forEach(item => {
					content = content.replace(item, `<span style="display:inline-block;background-color:yellow">${item}</span>`);
				});

				this.editor.setHtml(content);
			}
		},
		updateHtmlContent(content) {
			if (this.editor) {
				this.editor.setHtml(content);
			}
		},
		// 在html节点创建当前富文本内容
		createContentHtmlNode() {
			const currentNode = document.querySelector(`#${this.id}`);
			if (currentNode) {
				currentNode.parentNode.removeChild(currentNode);
			}
			const htmlParse = new DOMParser();
			this.htmlContent = htmlParse.parseFromString(this.htmlContent, 'text/html');
			this.formateHtmlContent(this.htmlContent);
			const elem = document.createElement('div');
			elem.setAttribute('id', this.id);
			elem.style.display = 'none';
			elem.appendChild(this.htmlContent.childNodes[0]);
			document.body.appendChild(elem);
		},
		// 复制的table存在单元格合并的情况，遍历节点，将空的td标签添加&nbsp;，避免内容为空，td不显示
		formateHtmlContent(html) {
			for (let i = 0; i < html.childNodes.length; i++) {
				if (html.childNodes[i].childNodes) {
					if (html.childNodes[i]?.tagName?.toLowerCase() == 'td' && !html.childNodes[i].innerHTML) {
						html.childNodes[i].innerHTML = '&nbsp;';
					}
					this.formateHtmlContent(html.childNodes[i]);
				}
			}
		},
		onCreated(editor) {
			this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
			this.editor.setHtml(this.content);
		},
		onChange(editor) {
			// 内容为空是 富文本默认给了<p><br></p>标签
			let content = editor.getHtml();
			// this.$emit('change', content);
			content = content.replace(/font-family:\s*[^;]+;\s*/gi, '');
			const currentContent = this.content ? this.content.replace(/<\/?.+?\/?>/gi, '') : '';
			if (content.replace(/<\/?.+?\/?>/gi, '') == currentContent) {
				// return;
			}
			if (editor.isEmpty()) {
				this.$emit('change', '');
			} else {
				this.htmlContent = content;
				this.createContentHtmlNode();
				const elem = document.querySelector(`#${this.id}`);
				setTimeout(() => {
					this.$emit(
						'change',
						elem.innerHTML
							.replace(/<br\s*\/?>/g, '\r\n')
							.replace(filterHtmlImgTag, '')
							.replace(filterHtmlVideoTag, '')
							.replace(/(line-height(.*?);)/gi, 'line-height: 2;')
					);
				}, 200);
			}
		},
		onBlur(editor) {
			const content = editor.getHtml();
			// 内容为空是 富文本默认给了<p><br></p>标签
			if (editor.isEmpty()) {
				this.$emit('blur', '');
			} else {
				this.htmlContent = content;
				this.createContentHtmlNode();
				const elem = document.querySelector(`#${this.id}`);
				this.$emit(
					'blur',
					elem.innerHTML
						.replace(/<br\s*\/?>/g, '\r\n')
						.replace(filterHtmlImgTag, '')
						.replace(filterHtmlVideoTag, '')
						.replace(/(line-height(.*?);)/gi, 'line-height: 2;')
				);
			}
		},
		getEditorText() {
			const editor = this.editor;
			if (editor == null) return;
		},
		printEditorHtml() {
			const editor = this.editor;
			if (editor == null) return;
		}
	},
	mounted() {},
	beforeDestroy() {
		const editor = this.editor;
		if (editor == null) return;
		editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
		const currentNode = document.querySelector(`#${this.id}`);
		if (currentNode) {
			currentNode.parentNode.removeChild(currentNode);
		}
	}
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="less" scoped>
//文本编辑器
#wangeditor {
	width: 100%;
	// margin: 20px 0 10px 0;
	margin-bottom: 20px;
	height: 256px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	z-index: 1070;
	& > div:last-child {
		height: 190px !important;
	}
	::v-deep.w-e-toolbar {
		border-color: #e5e6eb;
		background-color: #f3f5f6 !important;
		border-radius: 3px 3px 0px 0px !important;
		border-bottom: none !important;
		.w-e-bar-item:nth-of-type(22) {
			display: none !important;
		}
		.w-e-bar-item:nth-of-type(23) {
			display: none !important;
		}
	}
	::v-deep.w-e-text-container {
		border-color: #e5e6eb;
		border-radius: 0px 0 4px 4px !important;
	}
	::v-deep .w-e-text table {
		text-align: center;
		color: rgba(0, 0, 0, 0.8);
		border-top: 1px solid rgba(0, 0, 0, 0.8);
		border-left: 1px solid rgba(0, 0, 0, 0.8);
		width: 100%;
	}
	::v-deep .w-e-text table td,
	::v-deep .w-e-text table th {
		border-bottom: 1px solid rgba(0, 0, 0, 0.8);
		border-right: 1px solid rgba(0, 0, 0, 0.8);
	}
	::v-deep .w-e-text i {
		font-style: italic;
	}
	/deep/ .w-e-text-placeholder {
		font-style: normal;
	}
}
</style>
