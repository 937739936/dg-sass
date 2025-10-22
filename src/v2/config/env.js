function BaseEnv() {
  return {
    BASE_API: process.env.VUE_APP_BASE_API,
    BASE_NET: process.env.VUE_APP_BASE_API + "/",
    REST_SOCKET_URL: process.env.VUE_APP_REST_SOCKET_URL,
    ADMIN_SOCKET_URL: process.env.VUE_APP_ADMIN_SOCKET_URL,
    VUE_APP_YIMEI_FIN_URL: process.env.VUE_APP_YIMEI_FIN_URL,
    BASE_ADMIN_API: process.env.VUE_APP_BASE_ADMIN_API,
    BASE_GRAIN_API: process.env.VUE_APP_BASE_GRAIN_API,
    BASE_GRAIN_NET: process.env.VUE_APP_BASE_GRAIN_API + "/",
    BASE_GANG_API: process.env.VUE_APP_BASE_GANG_API,
    BASE_GANG_NET: process.env.VUE_APP_BASE_GANG_API + "/",
    BASE_USER_API: process.env.VUE_APP_BASE_USER_API,
    BASE_STATION_API: process.env.VUE_APP_BASE_STATION_API,
    MONITOR_SOCKET_API: process.env.VUE_APP_MONITOR_SOCKET_API,
  };
}

export default BaseEnv();
