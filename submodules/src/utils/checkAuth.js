import store from '@/store';

export const hasAuth = (authcode) => {
    if (!authcode) {
        return true;
    }
    if (typeof authcode == 'string') {
        authcode = [authcode];
    }
    let userAuth = store.getters['user/VUEX_ST_USERAUTH'] || store.state.user.authList; // 从vuex中获取权限点
    let flag = authcode.some((v) => userAuth.includes(v)); // 判断是否有权限
    return flag;
};

