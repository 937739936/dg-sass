import {cloneDeep} from 'lodash';
// 此方法用来对form的setFieldsValue进行切入，防止设置一些不存在的field
export default function(form) {
    
    // 保留原始方法
    var oldSetFieldsValue = form.setFieldsValue;
    var setFieldsValue = function ()
    {
        var _arguments = arguments
        var changeValue = cloneDeep(_arguments[0] || {})
        var keys = Object.keys(changeValue)
        var allValue = form.fieldsStore.getAllValues()
        for (var i = 0; i < keys.length; i++)
        {
            if (!allValue.hasOwnProperty(keys[i]))
            {
                delete changeValue[keys[i]]
            }
        }

        // 调用原始方法
        if (_arguments.length > 0) {

            _arguments[0] = changeValue
        }

        oldSetFieldsValue.apply(form, _arguments)
        
    }
    // 挂载方法
    form.setFieldsValue = setFieldsValue
    return form
}


