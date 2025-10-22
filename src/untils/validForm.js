
// 所有表单校验的工具方法，可以都写在这里


// 校验电话(固话+手机)
export function validIdTel(rule,value, callback) {
    var isMobilePhone = /1[0-9][0-9]{9}$/
    var isFixMob= /^(\(\d{3,4}\))\d{7,9}$/
    if(value!=''){
      if(isFixMob.test(value)||isMobilePhone.test(value)){
        callback()
      }else{
        callback('注册电话格式不正确')
      }
    }else{
      callback()
    }
}
