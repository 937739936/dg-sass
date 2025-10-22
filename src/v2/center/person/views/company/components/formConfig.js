const formBase = [
  {
    label: '企业名称',
    placeholder: '请输入公司名称',
    value: 'name',
    type: 'input-select'
  },
  {
    label: '成立日期',
    placeholder: '请选择成立日期',
    value: 'establishDate',
    type: 'date'
  },
  {
    label: '统一社会信用代码',
    placeholder: '请输入统一社会信用代码',
    value: 'bizLicenseNo',
    type: 'input',
    maxLength: 18
  },
  {
    label: '营业期限（止）',
    placeholder: '请输入营业期限',
    value: 'licenceEndDate',
    type: 'date'
  },
  {
    label: '企业类型',
    placeholder: '请输入企业类型',
    value: 'companyOrgType',
    type: 'input',
    maxLength: 127
  },
  {
    label: '企业简称',
    placeholder: '请输入企业简称',
    value: 'abbreviation',
    type: 'input-abbreviation'
  },
  {
    label: '注册地址',
    placeholder: '请输入城市',
    value: 'area',
    type: 'cascader'
  },
  {
    label: '企业简称首字母缩写',
    placeholder: '请输入企业简称首字母缩写',
    value: 'abbrPinYin',
    type: 'input-abbrPinYin'
  },
  {
    label: '详细地址',
    placeholder: '请输入详细地址',
    value: 'address',
    type: 'input'
  },
  {
    label: '经营范围',
    placeholder: '请输入企业的经营范围',
    value: 'scope',
    type: 'input',
    maxLength: 4090
  }
];

export {
  formBase
}
