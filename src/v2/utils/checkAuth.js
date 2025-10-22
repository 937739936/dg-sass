import store from '@/store';

// 根据配置的visible和authCode 过滤菜单
export const filterMenuVisiable = menuList => {
	let _menuList = menuList.filter(el => {
		let visibleflag = true;
		let authFlag = true;
		if (el.hasOwnProperty('visible')) {
			visibleflag = el.visible;
		}
		if (el.hasOwnProperty('authCode') && el.authCode) {
			authFlag = hasAuth(el.authCode);
		}

		return visibleflag && authFlag;
	});
	_menuList.forEach(el => {
		if (!el.children) return;
		el.children = el.children.filter(a => {
			let visibleflag = true;
			let authFlag = true;
			if (a.hasOwnProperty('visible')) {
				visibleflag = a.visible;
			}
			if (a.hasOwnProperty('authCode') && a.authCode) {
				authFlag = hasAuth(a.authCode);
			}

			return visibleflag && authFlag;
		});
	});

	return _menuList;
};

export const hasAuth = authcode => {
	if (!authcode) {
		return true;
	}
	if (typeof authcode == 'string') {
		authcode = [authcode];
	}
	let userAuth = store.getters['user/VUEX_ST_USERAUTH']; // 从vuex中获取权限点

	let flag = authcode.some(v => userAuth.includes(v)); // 判断是否有权限

	return flag;
};
