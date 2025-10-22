<template>
  <div class="step">
    <div v-for="(item, index) in list" :key="index" :class="[index + 1 != list.length ? 'flex1' : '' ]">
      <div class="item" :class="[currentStep >= index ? 'active' : '']">
        <div class="num-box">
          <div class="num" v-if="currentStep <= index">{{index + 1}}</div>
          <a-icon v-else type="check-circle" theme="filled" class="circleIcon"/>
          <p style="margin-top:10px">{{item.title}}</p>
        </div>
        <div class="line" :class="[currentStep > index ? 'line-active': '']" v-if="index + 1 != list.length"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentStep: {
      default:0
    },
    list: {
      default: ()=> []
    }
  },
  data() {
    return {
    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang='less'>
.step {
  display: flex;
  justify-content: space-around;
  .item {
    flex: 1;
    text-align: center;
    align-items: center;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    display: flex;
    color: rgba(70,130,243,0.5);
    .num-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 26px;
    }

    .num {
      width: 28px;
      height: 28px;
      font-size: 18px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      color: rgba(70,130,243,0.5);
      border: 1px solid @primary-color;
    }
    .line {
      height: 1px;
      border: 2px solid rgba(70,130,243,0.2);
      position: relative;
      flex: 1;
      &::before {
        content:  '';
        width: 6px;
        height: 6px;
        background: @primary-color;
        position: absolute;
        top: -3px;
        border-radius: 3px;
        left: -3px;
      }
       &::after {
        content:  '';
        width: 0px;
        height: 0px;
        border: 6px solid transparent ;
        border-left-color: rgba(70,130,243,0.2);;
        position: absolute;
        top: -6px;
        right: -14px;
      }
    }
    
  }
  .item.active {
    color: @primary-color;
    .num {
      background: @primary-color;
      color: #fff;
    }
  }
  .line-active {
    border: 2px solid @primary-color!important;
    &::after {
      border-left-color: @primary-color!important;
    }
  }
}
.flex1 {
  flex: 1;
}
.circleIcon{
  font-size: 28px;
  color: var(--primary-color);
}
</style>
