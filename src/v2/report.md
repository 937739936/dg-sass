# 不要修改SDK！不要修改SDK！不要修改SDK！

## 埋点平台使用说明
### 平台配置
1. 地址: `https://monitor.shanghaishulian.com/`
2. 环境区分
```
  uat: {
    host: "uat-trade.shanghaishulian.com",
    appid: "j21423aqq4",
  },
  production: {
    host: "www.shdatalink.com",
    appid: "1jsaa5q2ww",
  },
```
3. SDk文件地址 `项目根目录/public/reportSDK.umd.js`
### 使用说明
1. 注册新用户:`https://monitor.shanghaishulian.com/`
2. 根据`appid`绑定不同环境配置
3. 先创建类目（不同模块对应不同类目）
4. 在创建的类目下创建数据点，生成对应`code`，拿到`code`保存到项目中配置文件
### 开发说明
1. 方法调用 
```
@function window.reportUtil.reportEvent(code, data);
@param code {Number} 打点平台配置的code
@param data {Object} 需要提交的数据
```
`data`为空，默认采用图片打点，data不为空，采用post请求
### 注意事项
1. 为了避免不同需求部署不同环境，打点需要根据环境多次配置，目前打点只在`uat`和`production`生效，其他环境不提交打点数据，测试需要在`uat`环境验证，建议开发人员在打点平台配置`uat`和`production`两套，不要修改SDK！不要修改SDK！不要修改SDK！
2. 打点对应`code`配置:
```
production: src/v2/config/reportCode/prod.js
uat: src/v2/config/reportCode/uat.js
```
### DEMO
```
file: src/v2/center/trade/views/contract/ContractOnLineList.vue
method: window.reportUtil.reportEvent(code, data);
```