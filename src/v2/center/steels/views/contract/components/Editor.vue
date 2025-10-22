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
	</div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

export default {
	name: 'MyEditor',
	props: ['content'],
	components: { Editor, Toolbar },
	data() {
		return {
			editor: null,
			html: '',
			toolbarConfig: {
				// toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
				excludeKeys: [
					'uploadVideo',
					'uploadImage',
					'insertVideo',
					'insertImage',
					'fullScreen',
					'todo',
					'redo',
					'undo',
					'imageWidth30'
				]
			},
			editorConfig: {
				placeholder: '请输入内容...',
				// autoFocus: false,
				// 所有的菜单配置，都要在 MENU_CONF 属性下
				MENU_CONF: {}
			}
		};
	},
	watch: {
		content: {
			handler(val) {
				if (val && this.editor) {
					this.editor.setHtml(val);
				}
			},
			immediate: true
		}
	},
	methods: {
		onCreated(editor) {
			this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
			this.editor.setHtml(this.content);
		},
		onChange(editor) {
			if (editor.getSelectionText() || editor.isFocused()) {
				return;
			}
			// 内容为空是 富文本默认给了<p><br></p>标签
			const content = editor.getHtml();
			// this.$emit('change', content);
			if (editor.isEmpty()) {
				this.$emit('change', '');
			} else {
				this.$emit('change', content);
			}
		},
		onBlur(editor) {
			const content = editor.getHtml();

			// 内容为空是 富文本默认给了<p><br></p>标签
			if (editor.isEmpty()) {
				this.$emit('blur', '');
			} else {
				this.$emit('blur', content);
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
	}
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="less" scoped>
//文本编辑器
#wangeditor {
	width: 100%;
	margin: 20px 0 10px 0;
	height: 256px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	& > div:last-child {
		height: 174px !important;
	}
	::v-deep.w-e-toolbar {
		border-color: #e5e6eb;
		background-color: #f3f5f6 !important;
		border-radius: 3px 3px 0px 0px !important;
		border-bottom: none !important;
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
}
</style>
