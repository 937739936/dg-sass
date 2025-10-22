/**
 * @function getIndexOfPermissionList
 * @params {String} code: 需要查询的authCode
 * @params {Array} list: permissionList
 * @return {Number} 当前查询的authCode在permissionList中的索引
*/
function getIndexOfPermissionList(code, list) {
  return list.indexOf(code);
}

/**
 * @function checkUserRoles
 * @params {Array} configList: 当前authCode本地配置的companyUserRoles
 * @params {Array} list: 当前用户的companyUserRoles
 * @return {Boolean} 返回当前companyUserRoles的角色是否和本地companyUserRoles中也存在
*/
function checkUserRoles(configList, list) {
  let flag = false;
  for(let i = 0;i < list?.length;i ++) {
    if(configList.includes(list[i])){
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * @function checkCompanyType
 * @params {Array} configList: 本地配置的companyType列表
 * @params {String} type: 当前用户的companyType
 * @return {Boolean} 本地配置的companyType列表是否包含当前companyType
*/
function checkCompanyType(configList, type) {
  return configList.indexOf(type) >= 0;
}

/**
 * @function 
 * @params {Object} 当前用户信息
 * @params {Array} 用户permissionList
 * @params {Object} 本地配置的菜单权限列表
 * @params {Object} 所在的全部企业
 * @return {Array} 根据当前用户companyUscc返回过滤后的permissionList
*/
export default function (userInfo, list, authRouter, allInfo) {
  const result = list;
  for(let key in authRouter) {
    const codeIndex = getIndexOfPermissionList(key, list);
    if(authRouter[key].visible) {
      // 如果companyUscc和companyUserRoles同时存在
      if(authRouter[key]?.companyUscc && authRouter[key]?.companyUserRoles) {
        if(!authRouter[key].companyUscc.includes(userInfo.companyUscc) && !checkUserRoles(authRouter[key]?.companyUserRoles, userInfo.companyUserRoles)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
      if(authRouter[key]?.companyUscc && !authRouter[key]?.companyUserRoles) {
        if(!authRouter[key].companyUscc.includes(userInfo.companyUscc)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
      if(!authRouter[key]?.companyUscc && authRouter[key]?.companyUserRoles) {
        if(!checkUserRoles(authRouter[key]?.companyUserRoles, userInfo.companyUserRoles)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
      if(authRouter[key]?.companyType) {
        if(!checkCompanyType(authRouter[key]?.companyType, userInfo.companyType)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
    } else {
      // 如果companyUscc和companyUserRoles同时存在
      if(authRouter[key]?.companyUscc && authRouter[key]?.companyUserRoles) {
        if(authRouter[key].companyUscc.includes(userInfo.companyUscc) && checkUserRoles(authRouter[key]?.companyUserRoles, userInfo.companyUserRoles)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
      if(authRouter[key]?.companyUscc && !authRouter[key]?.companyUserRoles) {
        if(authRouter[key].companyUscc.includes(userInfo.companyUscc)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
      if(!authRouter[key]?.companyUscc && authRouter[key]?.companyUserRoles) {
        if(checkUserRoles(authRouter[key]?.companyUserRoles, userInfo.companyUserRoles)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
      if(authRouter[key]?.companyType) {
        if(checkCompanyType(authRouter[key]?.companyType, userInfo.companyType)) {
          codeIndex >=0 && result.splice(codeIndex, 1);
        }
      }
    }
  }
  // 如果curCompanyId不存在，移除下面两个权限点
  if(!allInfo.curCompanyId) {
    result.splice(list.indexOf('company:user'), 1);
    result.splice(list.indexOf('company:password'), 1);
  }
  // 如果没有完成实名认证，移除下面权限点
  if(!allInfo.auth) {
    result.splice(list.indexOf('company'), 1);
  }
  return result;
}