const modulesFiles = require.context("./reportCode", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

const ENV = () => {
  const envStr = process.env.VUE_APP_NODE_ENV_CONFIG;
  if (envStr === 'production') {
    return 'prod';
  } else if (envStr === 'development') {
    return 'uat';
  } else {
    return 'uat';
  }
};
export default modules[ENV()] || {};