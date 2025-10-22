import { getQueryString } from "@/v2/utils/index";
import { getPersonalDetail } from "untils/factory.js";
import store from "@/store";

export const loginFree = () => {
  return new Promise(async (resolve, reject) => {
    const access_token = getQueryString("access_token");
    const redirect_url = getQueryString("redirect_url");
    const source = getQueryString("source");
    if (access_token && redirect_url && source) {
      try {
        const result = await store.dispatch("user/VUEX_LOGIN_BY_ACCESS_TOKEN");
        if (result.success) {
          store.commit("user/VUEX_MU_USERTOKEN", result.data.token);
          getPersonalDetail();
          resolve({
            redirect_url: getQueryString("redirect_url")
          });
        } else {
          window.location.href = getQueryString("redirect_url");
        }
      } catch (error) {
        if (error.status === 409) {
          setTimeout(() => {
            window.location.href = getQueryString("redirect_url");
          }, 1000);
          reject();
        }
        throw new Error(error);
      }
    }
  });
};
