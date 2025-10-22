
//车牌照
var LICENCE_PLATE =
  /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/

PetiteVue.createApp({
  params:{},
  data:{},
  saveLoading:false,
  licenseVisiable:false,
  visible:"",
  licenceKey:"province",
  licenceIndex:0,
  licenceData:{
    province:[
      ["京","津","沪","渝","冀","豫","云","辽","黑"],
      ["湘","皖","鲁","新","苏","浙","赣","鄂"],
      ["桂","甘","晋","蒙","陕","吉","闽","贵","粤"],
      ["青","藏","川","宁","琼","使","领"]
    ],
    code:[
      ["0","1","2","3","4","5","6","7","8","9"],
      ["Q","W","E","R","T","Y","U","P"],
      ["A","S","D","F","G","H","J","K","L"],
      ["Z","X","C","V","B","N","M"]
    ]
  },
  submitData:{
    licensePlateNumber:new Array(7),
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
      var timer = setTimeout(function(){
        clearTimeout(timer)
        
      },500)
      PetiteVue.nextTick(function(){
        $("body").removeClass('none');
      })
     
      
    }).fail(function (result) {
      var res = result.responseJSON;
      if(res.error){
        alertTips.toast(res.error.message);
      }
    })
  },
  showLicense:function(key,index){
    this.licenceIndex = index
    this.licenceKey = key;
    this.licenseVisiable = true;
    document.querySelectorAll(".license-input .key")[index].focus();
  },
  closeLicenceModal:function(){
    this.licenceIndex = 0;
    this.licenceKey = "province";
    this.licenseVisiable = false;
  },
  delLicence:function(){
    var val = this.submitData.licensePlateNumber[this.licenceIndex];
    if(val){
      this.submitData.licensePlateNumber[this.licenceIndex] = "";
    }else{
      this.licenceIndex--;
      if(this.licenceIndex < 0){
        this.closeLicenceModal();
        return
      }
      this.licenceKey =  this.licenceIndex == 0 ? "province" :"code";
    }
    
    
    document.querySelectorAll(".license-input .key")[this.licenceIndex].focus();
  },
  changeLicense:function(key){
    var length = this.submitData.licensePlateNumber.length;
    this.submitData.licensePlateNumber[this.licenceIndex ] = key
    if(this.licenceIndex >= length-1){
      var index = this.submitData.licensePlateNumber.findIndex((item) => !item);
      if(index == -1){
        this.licenseVisiable = false;
      }else{
        this.licenceIndex = index;
      }
    }else{
      this.licenceIndex++;
    }
    this.licenceKey =  this.licenceIndex == 0 ? "province" :"code";
    document.querySelectorAll(".license-input .key")[this.licenceIndex].focus();
    
  },
  onOk:function(){
    this.onCancel()
  },
  onCancel:function(){
    this.visible = ""

  },
  onConfirm:function(){
    
    if(this.data.status == 'FINISHED'){
      alertTips.toast('上煤计划已完成，请勿派车')
      return
    }
    var id = this.params.id;
    if(!id||this.saveLoading ){
      return
    }
    var licensePlateNumber = this.submitData.licensePlateNumber.join('');
    if(!licensePlateNumber){
      alertTips.toast('请输入车牌号')
      return
    }
    if(!LICENCE_PLATE.test(licensePlateNumber)){
      alertTips.toast('车牌号格式不正确')
      this.showLicense("code",this.submitData.licensePlateNumber.length-1)
      return
    }
    this.visible = "confirm"
  },
  save:function(){
    var id = this.params.id;
    var licensePlateNumber = this.submitData.licensePlateNumber.join('');
    var self = this;
    alertTips.loadingMask("处理中...")
    $.ajax({
      headers:{
        'Content-Type':'application/json;charset=UTF-8'
      },
      url:'/dg-station-api/api/trucking/order/h5/in/add',
      type:'POST',
      dataType:'json',
      data:JSON.stringify({planId:id,licensePlateNumber})
    }).then(function (res){
      alertTips.hide()
      self.saveLoading = false;
      self.submitData={
        licensePlateNumber:new Array(7),
      };
      self.visible = "success";
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


