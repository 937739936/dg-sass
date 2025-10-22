一个基于目前ui开发的简单form组件 因为目前只接受到 三个组件的改版 所以只引了三个 
后续同学 有新的开发 或者好的建议 可以一起探讨

## When To Use
  参数介绍 
   
| 名称 | 描述 | 参数 |  |
| --- | --- | --- | --- |
| list | 接收的渲染内容 | 无 |  |
| isShowIcon | 更多筛选 和 收起筛选 是否显示 | 默认为 true |  |


每一项的参数描述
   
| 名称 | 描述 | 参数 |  |
| --- | --- | --- | --- |
| type | 组件类型 input 输入框 select 下拉框  rangePicker 日期组件 multiple 多种输入框类型 兼容有个两个输入框的情况 | 无 |  |
| decorator | 和ant-design from v-decorator需要参数 功能一致 | 必传 |  |
| addonBeforeTitle | 当前选项的中文描述 |  |  |
| placeholder | 当前选项的中文描述 |  |  |
| options | 当是下拉框类型的时候 下拉选项 数组类型 |  |  |
| optionsConfig | 里面 key 和 value 对当前 options的 【key】【value】 进行转换 |  |  |
| isShow | 判断 是否 显示该选项 默认是true  接受 类型为 布尔 或者 一个函数需要有return出 布尔值）| true | false  | Function(text, record, index) {}    |  |
| children | type ==multiple 的必填项 会渲染两个输入框，内容和当前的想一直也需要  decorator  placeholder 等比备的| arr  |  |  |
| midfix | type ==multiple  两个输入框直接的间隔 默认 -  | string  |  |  |
| addonAfter | type ==multiple  最后一个输入框的 后缀  | a |  |  |










