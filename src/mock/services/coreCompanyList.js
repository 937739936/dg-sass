/*
* @Author: zhangyazhou
* @Date:   2021-04-23 17:06:04
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-23 17:10:10
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success": true,
    "data": [{
      "coreCompanyId" : "08ec9b5143adf3b9e333b9b03ac0f341",
      "coreCompanyUscc" : "91320681MA25D6JA5M",
      "coreCompanyName" : "启东市文兴机电安装工程有限公司"
    },{
      "coreCompanyId" : "08ec9b5143adf3b9e3333ac0f341",
      "coreCompanyUscc" : "913206815D6JA5M",
      "coreCompanyName" : "test"
    }]
  }
}