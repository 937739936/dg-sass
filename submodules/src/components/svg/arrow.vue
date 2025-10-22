<template>
  <svg width="6" height="10" viewBox="0 0 6 10" :style="style" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L5 5L1 9" :stroke="color" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
<script>
import {create} from "./common";
export default create({initWidth:6,initHeight:10,initColor:"var(--primary-color)"})
</script>