
<img src="https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/c061e96df620cc34ab9062bfb9c9efca/image.png" width="300" style="width:300px;" />


## 项目技术栈
### node >= 16
[Vue](https://cn.vuejs.org/)：版本2.6

[Vue Router](https://router.vuejs.org/zh/)：版本3.1.6

[Vuex](https://vuex.vuejs.org/zh/)：版本3.2.0

[Vue Cli](https://cli.vuejs.org/zh/)：版本3.0

[And Design Vue](https://www.antdv.com/docs/vue/introduce-cn/) ：版本1.6.5

[Node.js](http://nodejs.cn/)（工程构建）：版本16.20.0

**请确保相关版本正确**

## 项目初始化 安装依赖
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
```

### 启动开发服务器(支持vuecli和vite)
```
npm run dev # vue-clie
npm run devvite # vite
```

### 构建Build
生产环境打包
```
npm run prod
```
测试环境打包
```
npm run test
```

（测试打包可发布到：test环境）



## 目录分布介绍
```
 |- dist
 |- node_modules
 |- public
 |- src
    |- api
        |- env.js       //返回对应的环境参数
        |- index.js     //几乎所有的请求地址都在这里
        |- request.js   //基于axios进行二次封装 请求头添加auth
    |- assets //静态资源目录
        |- base
        |- imgs
        |- styl
    |- components //公共组件
    |- store      //Vuex
    |- untils
    |- views        //具体业务view
    |- app.vue      //页面入口
    |- main.js      //项目入口文件
    |- router.js    //全局路由配置
 |- .browserslistrc 
 |- .eslintrc.js    //eslint相关配置
 |- .gitignore  
 |- .babel.config.js    //babel配置文件
 |- package.json        //node 依赖文件
 |- postcss.config.js   //css预处理工具
 |- README.md
 |- vue.config.js       //vue开发构建相关配置

```
## 规范约定

1. 组件中请使用样式请使用`less`，如需深度选择器请使用`::v-deep`。
2. 通用组件卸载`src/components`下，组件自己的资源例如图片，写在自己组件目录下的`imgs`中。
3. `proxy.js`修改后端服务器地址，也可安装[Chrome插件](https://github.com/kylepaulsen/ResourceOverride)来快速替换后端服务地址。

## 项目基本常量字典信息


```javascript
{
    // 煤种id
    "coalTypeDict": {
        "STEAM_COAL": "STEAM_COAL", //动力煤
        "COKING_COAL": "COKING_COAL", //焦煤
        "COKE": "COKE", //焦炭
        "SEMI_COKE": "SEMI_COKE", //兰炭
        "SMOKELESS_COAL": "SMOKELESS_COAL", //无烟煤
        "INJECTION_COAL": "INJECTION_COAL" //喷吹煤
    },
    "contractTemplateDict": {
        // 合同模版id
        "COKING_001": "COKING_001", //焦炭合同模版001
        "COKING_002": "COKING_002", //焦炭合同模版002
        "COKING_003": "COKING_003", //焦炭合同模版003
        "COKING_004": "COKING_004", //焦炭合同模版004
        "COKING_005": "COKING_005", //焦炭合同模版005
        "COKING_006": "COKING_006", //焦炭合同模版006
        "COKING_COAL_001": "COKING_COAL_001", //焦煤合同模版001
        "COKING_COAL_003": "COKING_COAL_003",//焦煤合同模版003
        "STEAM_COAL_001": "STEAM_COAL_001", //动力煤合同模版001
        "STEAM_COAL_002": "STEAM_COAL_002", //动力煤合同模版002
        "STEAM_COAL_003": "STEAM_COAL_003", //动力煤合同模版003
        "STEAM_COAL_004": "STEAM_COAL_004", //动力煤合同模版004
        "STEAM_COAL_005": "STEAM_COAL_005", //动力煤合同模版005
        "SEMI_COKE_001": "SEMI_COKE_001", //兰炭合同模版001
        "SMOKELESS_COAL_001": "SMOKELESS_COAL_001", //无烟煤合同模版001
        "INJECTION_COAL_001": "INJECTION_COAL_001", //喷吹煤合同模版001
        "OFFLINE":"OFFLINE"//线下合同模板
    },
    "transportModeDict":{
        "TRAIN":"TRAIN", //火运
        "AUTOMOBILE": "AUTOMOBILE",//汽运
        "SHIP": "SHIP",//船运
        "AUTOMOBILE_AND_TRAIN": "AUTOMOBILE_AND_TRAIN",//汽运和火运
    },
    // 发运方式
    "despatchModeDict":{
        "TRAIN":"TRAIN", //火运
        "AUTOMOBILE": "AUTOMOBILE",//汽运
        "SHIP": "SHIP"//船运
    },
    "serviceFeePayModeDict":{
        "BUYER_AND_SELLER_ALL_PAY": "BUYER_AND_SELLER_ALL_PAY",//3买卖双方支付
        "BUYER_PAY": "BUYER_PAY",//2买方付款
        "SELLER_PAY": "SELLER_PAY" //1卖方付款
    },
    "orderStatusDict":{
        "APPROVAL_FAIL": "APPROVAL_FAIL",//"退回"2,
        "AUDITING": "AUDITING",//"审批中"3,
        "CANCELLATION": "CANCELLATION",//"作废"7,
        "COMPLETED": "COMPLETED",//"已完成"6,
        "DRAFT": "DRAFT",//"草稿"1,
        "EXECUTING": "EXECUTING",//"执行中"5,
        "REJECT": "REJECT",//"驳回"8,
        "WAIT_CONFIRM": "WAIT_CONFIRM",//"待确认"9 4,
        "WAIT_SIGN_SEAL": "WAIT_SIGN_SEAL",//"待签约"10 11
    },
    "orderTypeDict":{
        "BUY": "BUY",//采购订单,
        "SELL": "SELL",//销售订单
    }
}
```
## 交易基本整体流程

![](https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/aa0b0a1c5219e61c3a9c422cf2f23d26/image.png)

### 采购订单流程

![](https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/f1b2b2704f1815db002d94ee564dc703/image.png)

### 销售订单流程

![](https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/b51da843ea0f67b306da8fba69e396f1/image.png)

### 收发货流程

![](https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/70683ee515b4a5608bf939a636b150ee/image.png)

### 收付款流程

![](https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/3c4990104c71249dd946fef7f831da84/image.png)

### 结算单流程

![](https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend/uploads/fb5a4c7dca50ccf7ac182fdb2a430c8c/image.png)

### 子仓库操作

```
如果是从master拉取分支 这个时候子仓库是空的 

步骤1 执行下面命令

git submodule init 
git submodule update
步骤2
在 submodules文件下 切换到子仓库 master 分支
先拉取代码
git pull 
操作内容
Git add 。
Git commit 
Git push
退出子仓库
Cd ..
```
```
如果是第一次clone 代码
步骤 1 会同步拉取子仓库代码
git clone --recursive https://gitlab.shanghaishulian.com/dg-frontend/dg-trade-frontend.git
如果需要 修改 新增 子仓库的文件

步骤1
cd  submodules
步骤2
在 submodules文件下 切换到 master 分支
先拉取代码
git pull 
操作内容
Git add 。
Git commit 
Git push
退出子仓库
Cd ..
步骤3
在主仓库下
Git add 
Git commit 
Git push	
```