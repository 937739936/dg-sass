<template>
<a-row class="template">
  <div id="wangeditor">
    <!--<p v-if="!disabled">请注意段落缩进，每个段落首行需空两个字</p>-->
    <div :ref="value" style="text-align:left;"></div>
  </div>

</a-row>
</template>
<script>
import E from "wangeditor"
export default {
  data(){
    return {
    }
  },
  props: [
    "type",
    "value",
    'disabled',
    "defaultValue",
    "getData",
  ],
  mounted(){
    this.$nextTick(()=>{
      this.editor = new E(this.$refs[this.value])
      this.editor.config.zIndex = 65
      const replaceBR = (html)=>{
          html=html.replace(/<br>/ig,'<br />');
          html=html.replace(/<\/br>/ig,'');
          html=html.replace(/(\r\n)|(\n)/ig,'<br />');
          return html
      }
      const parseHTML = (html)=>{
          //删除无用的font节点  必须要创建节点  用$(html)的方式不行
          let parentdiv=$('<div id="testMyDiv" style="display:none"></div>');
          // 删除xml标签
          html = html.replace(/<\/?\w+:[^>]*>/gi, "");


          parentdiv.html(html);
 
          parentdiv.find("*").each(function (index,ele) {
            
            if (!$(ele).is('div,p,span,table,br,tr,td,th,thead,tbody,strong,em,del,u,b,ol,ul,li,base,big,col,dd,dt,dl,font')) {
              
              $(ele).replaceWith('<div>'+$(ele).text()+'</div>')
            }
          })

          
          // 删除注释节点和空文本节点
          parentdiv
          .contents()
          .filter(function() {

            if (this.nodeType == Node.COMMENT_NODE || this.nodeType == Node.TEXT_NODE) {
              // wps会把一些css样式也拷贝，这里用font-family匹配去除
              var text = $(this).text()
              if (text.indexOf('font-family') > -1) {
                return true
              }
            }

            return false; 
          }).remove();

          
          // 只获取文本
          html=parentdiv.html();

          // 最后把br替换一下

          html = replaceBR(html)


          return html
      }
      const editHTML = (html)=>{
          //删除无用的font节点  必须要创建节点  用$(html)的方式不行
          let parentdiv=$('<div id="testMyDiv" style="display:none"></div>');

          // 删除xml标签
          html = html.replace(/<\/?\w+:[^>]*>/gi, "");
          // 过滤老数据格式
          if (html.indexOf('style="3D&quot;text-indent:"') > -1) {
            // 把标签的属性都删掉
            var reg = /<([a-zA-Z1-6]+)(\s*[^>]*)?>/g
            html = html.replace(reg,'<$1>')
            
          }

          parentdiv.html(html);

          // 把html字符串中table添加一个class
          parentdiv.find("*").each(function (index,ele) {
            $(ele).removeAttr('class')
            if ($(ele).is('table')) {
              $(ele).addClass('rich-table')
            }
            // font换成span
            if ($(ele).is('font')) {
              let defaultColor1 = '#000000';
              let defaultColor2 = '#fff';
              $(ele).replaceWith('<span style="background-color:'+($(ele).css('backgroundColor')||defaultColor2)+';color:'+($(ele).attr('color')||defaultColor1)+';">'+$(ele).text()+'</span>')
            }
          })
          // 删除注释节点和空文本节点
          parentdiv
            .contents()
            .filter(function() {

              if (this.nodeType == Node.COMMENT_NODE || this.nodeType == Node.TEXT_NODE) {
                var text = $(this).text()
                // wps会把一些css样式也拷贝，这里用font-family匹配去除
                if (text.indexOf('font-family') > -1) {
                  return true
                }
              }

              return false; 
          }).remove();
          html=parentdiv.html();
          // 最后把br替换一下
          html = replaceBR(html)

          return html
      }
      this.editor.config.onchange = html => {

        this.editorContent = editHTML(html)
        this.getData({value: this.value, data: this.editorContent})
      }
      // 处理复制粘贴
      this.editor.config.pasteTextHandle = html => {

        return parseHTML(html)

      }
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
        'table', // 表格
        // 'code', // 插入代码
        // 'undo', // 撤销
        // 'redo' // 重复
      ];
      this.editor.create(); // 创建富文本实例
      setTimeout(()=>{
        if(this.disabled){
          this.editor.$textElem.attr('contenteditable', false)
        }
        if(this.defaultValue){
          this.editor.txt.html(this.defaultValue)
          this.editorContent = this.defaultValue
        }
      },1000)
    })
  },
  watch: {
    editorContent(data){
      this.getData({value: this.value, data})
    },
  },
  methods: {
    setContentEditStatus (v) {
      this.editor.$textElem.attr('contenteditable', v)
    },

    setEditorContent (v) {
      this.editor.txt.html(v)
      this.editorContent = v
    },
  }
}
</script>
<style lang="stylus" scoped>
/deep/ .w-e-text table {
  text-align: center;
  color: #000;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  width:100%;
}
/deep/ .w-e-text table td, /deep/ .w-e-text table th {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
}
/deep/ .w-e-text i {
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
    background:#0053db 
</style>
