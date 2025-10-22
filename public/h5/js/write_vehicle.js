
//车牌照
var LICENCE_PLATE =
  /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/

PetiteVue.createApp({
  params:{},
  data:{},
  saveLoading:false,
  submitData:{
    licensePlateNumber:'',
    driverMobile:'',
    driverName:''
  },
  mounted:function (){
    this.resizePage()
    this.params = getParams();
    this.doFetch()
  },
  doFetch:function (){
    var id = this.params.id;
    if(!id){
      return
    }
    var self = this;
    $.ajax({
      url: '/dg-station-api/api/coal/plan/detail?id='+id,
      type:'GET',
      dataType:'json',
    }).then(function(res){
      if(!res.success ){
        return
      }
      self.data = res.data;
      $(".global-resize-page").removeClass('none');
    }).fail(function (result) {
      var res = result.responseJSON;
      if(res.error){
        alertTips.toast(res.error.message);
      }
    })
  },
  changeLicense:function(e){
    var value = e.target.value ||"";
    this.submitData.licensePlateNumber = value.toUpperCase();
  },
  add:function(){
    if(this.data.status == 'FINISHED'){
      alertTips.toast('上煤计划已完成，请勿派车')
      return
    }
    var id = this.params.id;
    if(!id||this.saveLoading ){
      return
    }
    var data = this.submitData;
    if(!data.licensePlateNumber){
      alertTips.toast('请输入车牌号')
      return
    }
    if(!LICENCE_PLATE.test(data.licensePlateNumber)){
      alertTips.toast('车牌号格式不正确')
      return
    }
    if(!/^1\d{10}$/.test(data.driverMobile)){
      alertTips.toast('手机号格式不正确')
      return
    }
    if(!data.driverName){
      alertTips.toast('请输入姓名')
      return
    }
    var self = this;
    alertTips.loading("处理中...")
    $.ajax({
      headers:{
        'Content-Type':'application/json;charset=UTF-8'
      },
      url:'/dg-station-api/api/trucking/order/add',
      type:'POST',
      dataType:'json',
      data:JSON.stringify(Object.assign({planId:id},data))
    }).then(function (res){
      self.saveLoading = false;
      self.submitData={
        licensePlateNumber:'',
        driverMobile:'',
        driverName:''
      };
      alertTips.toast('提交成功')
    }).fail(function (res) {
      let result = res.responseJSON;
      self.saveLoading = false;
      if(result.error){
        alertTips.toast(result.error.message);
        return
      }
    })
  },
  resizePage:function (){
    let el = document.querySelector(".global-resize-page");
    function resize (){
      let wScale = window.innerWidth / 375;
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

