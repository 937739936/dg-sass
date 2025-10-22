
PetiteVue.createApp({
  // $delimiters: ["${", "}"],
  params:{},
  header:{
    Source: 'APP',
  },
  data:{},
  historyData:{},
  history:[],
  leftHistory:[],
  mounted(){

    this.resizePage();
    this.params = getParams();
    this.getLatestAgreement();
    this.getHistory();
  },

   //获取相关类型协议最新版本
  getLatestAgreement:function(){
    var type = this.params.type;
    var _this = this;
    this.request("/dg-user-api/api/agreement/get?fileType="+type,function (data){
      _this.data = data;
      $(".global-resize-page").removeClass('none');
      try{
        dgAppJsdk.dismiss();
        dgAppJsdk.setTitle(data.name);
      }catch(e){
        alert(e)
      }
    });
  },

  //  //获取相关类型协议历史版本
  getHistory:function(){
    var type = this.params.type;
    var _this = this;
    this.request("/dg-user-api/api/agreement/getHistory?fileType="+type,function (data){
      _this.history = data;
      _this.leftHistory = data;
    })
  },
  //根据指定id获取版本
  getDetailById:function (index){
    var _this = this;
    var id = (this.leftHistory[index]||{}).id;
    this.request("/dg-user-api/api/agreement/queryById?id="+id,function (data){
      _this.historyData = data;
      _this.leftHistory = _this.leftHistory.slice(index+1);
    })
  },
  back(){
    this.leftHistory = this.history;
    this.historyData ={}
  },
  request:function (url,callback){
    $.ajax({
      headers: this.header,
      url: url,
      type:'GET',
      dataType:'json',
    }).then(function(result){
      if(!result.success){
        return
      }
      
      callback(result.data);
    })
  },
  resizePage:function (){
    var el = document.querySelector(".global-resize-page");
    function resize (){
      var wScale = window.innerWidth / 375;
      el.style = "width:375px;-webkit-transform:scale("+wScale+");transform:scale("+wScale+");-webkit-transform-origin:left top;transform-origin:left top;"
    }
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, resize, false);
    document.documentElement.addEventListener('DOMContentLoaded', resize, false);
    document.documentElement.scrollTop = 0  //切换页面时滚动到顶部
    resize();
  }
}).mount();

function getParams(url) {
  url = url || location.href;
  var obj = {},
      reg = /([^?=&#]+)=([^?=&#]+)/g;

  url.replace(reg, function() {
      obj[arguments[1]] = decodeURIComponent(arguments[2]);
  });
  return obj;
}
