## v2版本开发指南
### 基本目录结构
- src 
  - v2 存放v2改版所有文件
  - api 业务无关api
  - assets 资源目录
    - imgs 图片
    - bigview 大屏
    - common 公共读
    - monitoring 预警模块图片
    - storage 仓储模块图片
    - ...
  - center 业务相关文件
    - assets 资产管理
    - financing 融资管理
    - monitoring 数据监控
    - person 账户中心
    - steels 钢材供应链
    - storage 仓储中心
    - trade 数字供应链
    - workbench 工作台
  - components 通用组件
  - config 通用配置
  - http axios配置文件
  - router 路由管理
    - modules 路由模块
  - store vuex存储
    - modules vuex模块
  - style 统一样式
  - utils 工具箱
  - views 业务无关页面
### 改版方案
step1: 
1. 先将一级菜单按照划分好的文件目录结构对应填充（包括文件引用地址修改，相关api分离，公共模块抽离，业务无关模块抽离之后放到v2/components文件夹下，公共方法放到v2/utils目录下）
2. 菜单放在v2/center对应模块的menu文件夹下
3. 路由按照对应的模块放在v2/router/modules下
step2: vuex改版，按照modules的组织形式改版，修改引入和使用方式
step3: menu改版，menu为纯配置文件，不应该包含业务相关代码，菜单显示隐藏之后会统一改到菜单相关组件中
step4: router改版
step5: axios配置管理src/request改版（业务相关逻辑抽离）
step6: vue-cli到webpack迁移（为了更方便做打包优化）

### 为什么要改版
1. 目前项目结构组织形式不合理，menu/router/components/api都没有按照模块划分管理，造成的问题是单个文件内容过多，多人协作开发容易有冲突；组件复用没有，需要修改全局搜索改版的成本和风险很高，新开发功能就重新写一遍之前有的组件相关业务，开发效率低；
2. 目前页面ui风格不统一，代码风格不统一，甚至有一些逻辑bug并未暴露，希望通过重构统一ui风格的同时，开启eslint统一代码风格，review一遍业务代码；
3. 有很多业务无关配置文件，工具方法文件包含了很多业务逻辑，造成这些文件/模块复用性很低（比如axios配置文件包含了一些个性化api业务）；
4. 数据存储使用不合理，目前所有vuex中的数据在浏览器storage中都有存储，比较浪费存储空间；
5. 随着业务开展越多，复杂程度上升，项目体积越来越大，直接采用微前端的方式对已经稳定运行的业务风险大，先重构，重构作为过渡，完全重构完成之后如果业务需要用到微前端，在重构的基础上接入成本低，风险小（未来v2/center下面的业务相关文件可以单独作为子应用)；


## Tips
1. 已经迁移到v2目录下的文件，旧文件已经删除，分支是`f_clear_files`，如需查询修改记录，前往该分支查找