<template>
  <div class="docx-viewer-box" :id="id"></div>
</template>
<script>
export default {
  props:{
    src:{
      type:String,
      default:() => ""
    },
    id:{
      type:String,
      default:() => `docx${Math.random().toString(36).slice(2)}`
    }
  },
  data(){
    return {
      scripts:[],
      loadedLength:0
    }
  },
  created(){
    const jszip = this.createScript("/plugins/jszip.min.js")
    const docScript = this.createScript("/plugins/docx-preview.js")
    this.scripts.push(jszip,docScript)
    document.head.appendChild(jszip)
    document.head.appendChild(docScript)
  },
  mounted(){
    
  },
  beforeDestroy(){
    this.scripts.forEach((script) => {
      script.remove();
    })
    this.scripts.length = 0;
    this.loadedLength = 0;
  },
  methods:{
    loadDoc(){
      const id = this.id
      const xhr = new XMLHttpRequest();
      xhr.open( "GET", this.src , true);
      xhr.responseType="blob";
      xhr.onload= function(e){
        docx.renderAsync(e.target.response, document.getElementById(id))
          .then(x => console.log("docx: finished",x));
      };
      xhr.send();
    },
    loadScript(){
      this.loadedLength ++;
      if(this.loadedLength == this.scripts.length){
        this.loadDoc();
      }
    },
    createScript(src){
      const script = document.createElement("script");
      script.onload= this.loadScript
      script.src = src;
      return script;
    }
  }
}
</script>
<style lang="less" scoped>
.docx-viewer-box{
  width: 100%;
  height: 100%;
  overflow: auto;
}
::v-deep{
  .docx-wrapper{
    background-color: #fff;
  }
}
</style>
