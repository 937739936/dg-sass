<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"  :style="style">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 5H2V12H9V5ZM1 3C0.447715 3 0 3.44771 0 4V13C0 13.5523 0.447715 14 1 14H10C10.5523 14 11 13.5523 11 13V4C11 3.44772 10.5523 3 10 3H1Z" fill="var(--primary-color)"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 1C3 0.447715 3.44771 0 4 0H13C13.5523 0 14 0.447715 14 1V10C14 10.5523 13.5523 11 13 11H10.3V9H12V2H5V3.53846H3V1Z" fill="var(--primary-color)"/>
    <rect x="3" y="6" width="5" height="2" rx="1" fill="var(--primary-color)"/>
    <rect x="3" y="9" width="5" height="2" rx="1" fill="var(--primary-color)"/>
  </svg>

</template>
<script>
import {create} from "./common";
export default create({initWidth:14,initHeight:14,initColor:"#C3C3C3"})
</script>