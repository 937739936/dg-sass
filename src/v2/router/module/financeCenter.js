const modulesFiles = require.context("./financeCenterModules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

const routesArr =[];

for(const key in modules) {
  routesArr.push(modules[key]);
}



export default routesArr;