
window.dgAppJsdk={
  _callback_id : 0,
  autoSetTitle:function(){
    if(document.title){
     this.setTitle(document.title||"");
    }
  },
  loading:function(value){
    value = value || false;
    if(toString.call(value) != "[object Boolean]"){
      value = !!value;
    }
    this.config({method:"loading",data:value})
  },
  dismiss:function(){
    this.config({method:"dismiss",data:""});
  },
  toNamed:function(name){
    this.config({method:"toNamed",data:name})
  },
  setTitle:function(title){
    this.config({method:"setTitle",data:title})
  },
  _checkConfig:function(config){
    if(toString.call(config) != "[object Object]"){
      throw Error("config不是一个对象");
    }
    if(!config.method || toString.call(config.method) != '[object String]'){
      throw Error("必须包含method字段且为字符串");
    }
    var configStr ;
    try{
      config.data = JSON.stringify(config.data);
      configStr = JSON.stringify(config);
    }catch(e){
      throw Error("不是一个有效的json格式");
    }
    return configStr;
  },
  config:function (data){
    if(!window._dg_app_exec){
      return;
    }
    // eval(js);
    var callbackName = `__dg_native_callback_${this._callback_id++}`
    // 注册全局回调函数
    if (typeof data.callback === 'function') {
      var callback = data.callback.bind(data)
      window[callbackName] = function(args) {
        callback(args)
        delete window[callbackName]
      }
      data.callback = callbackName;
    }
    _dg_app_exec.postMessage(this._checkConfig(data))
  },
  
 };
