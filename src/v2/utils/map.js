import   { getMapKey } from '@/v2/api/common'


export const loadMP =  (flag)  =>{
  const map = new Promise(async function (resolve, reject)  {

    const params = {
      apiCode: 'JS@001'
    }
    let info = {}

    const res = await getMapKey(params)

    info = res.data
      window._AMapSecurityConfig = {
        securityJsCode:info.secret, 
      }
      
      AMapLoader.load({
        key: info.key, //申请好的Web端开发者 Key，调用 load 时必填
        // version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      }).then(() => {
        resolve()
      }).catch((e) => {
        reject(e)
      }); 
  })

  return Promise.all([map]).then((res) => {
    return res
  }).catch(e => {
    console.error(e)
  })
 




}