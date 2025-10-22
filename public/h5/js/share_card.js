
PetiteVue.createApp({
  // $delimiters: ["${", "}"],
  params:{},
  header:{
    'Authorization': window.parent.localStorage.getItem('VUEX_ST_TOKEN'),
    Source: 'PC',
  },
  data:{
    loading:false
  },
  mounted(){
    this.resizePage();
    this.params = getParams();
    this.request();
    
  },
  request:function (){
    var id = this.params.id
    if(!id || id == 'null' || id == 'undefined'){
      return
    }
    var that = this;
    that.data.loading = true;
    $.ajax({
      headers: this.header,
      url: '/dg-station-api/api/coal/plan/qrCode?id='+id,
      type:'GET',
      dataType:'json',
    }).then(function(result){
      if(!result.success){
        return
      }
      result.data.qrCode = "data:image/png;base64,"+result.data.qrCode
      that.data = result.data;
      $(".global-resize-page").removeClass('none')
      that.data.loading = false
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
