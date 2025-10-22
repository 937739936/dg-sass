import Vue from 'vue'
const cb = function(el,binding,vnode){
    el.addEventListener('click', () => {
        if (!vnode.componentInstance.loading) {
            Vue.config.silent = true;
            vnode.componentInstance.loading = true
          setTimeout(() => {
            vnode.componentInstance.loading = false
            Vue.config.silent = false;
          }, binding.value || 1000)
        }
      })
}
const debounceclick = {
    inserted: cb,
    update: cb
}


const install = function(Vue) {
  Vue.directive('debounceclick', debounceclick)
}


debounceclick.install = install
export default debounceclick