function init(){
  if(location.protocol == "https:"){
    document.write('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">')
  }
}
init();

// window._AMapSecurityConfig = {
//   securityJsCode:'b479c002dcb6334968232a9d8853b6d9', 
// }